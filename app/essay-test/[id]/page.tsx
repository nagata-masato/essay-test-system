"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  Clock,
  FileText,
  AlertCircle,
  Upload,
  ImageIcon,
  Eye,
  Edit3,
  RefreshCw,
  AlertTriangle,
  Info,
  HelpCircle,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { getTestData, submitEssay, type EssayTestData } from "@/lib/api-client"
import { ScoringProgress } from "@/components/scoring-progress"

interface EssayTestProps {
  params: Promise<{
    id: string
  }>
}

export default function EssayTestDetail({ params }: EssayTestProps) {
  const router = useRouter()
  const [testData, setTestData] = useState<EssayTestData | null>(null)
  const [step, setStep] = useState<"loading" | "reading" | "writing" | "submitting">("loading")
  const [timeLeft, setTimeLeft] = useState(900) // 15分 = 900秒
  const [answer1, setAnswer1] = useState("")
  const [answer2, setAnswer2] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadedImages, setUploadedImages] = useState<{ question1?: File; question2?: File }>({})
  const [transcribedTexts, setTranscribedTexts] = useState<{ question1?: string; question2?: string }>({})
  const [isTranscribing, setIsTranscribing] = useState<{ question1?: boolean; question2?: boolean }>({})
  const [showTranscriptionModal, setShowTranscriptionModal] = useState<{ question1?: boolean; question2?: boolean }>({})
  const [showManualInput, setShowManualInput] = useState<{ question1?: boolean; question2?: boolean }>({})
  const [manualTexts, setManualTexts] = useState<{ question1?: string; question2?: string }>({})
  const [refusalWarnings, setRefusalWarnings] = useState<{ question1?: boolean; question2?: boolean }>({})
  const [loadStartTime] = useState(Date.now())
  const [submitWarning, setSubmitWarning] = useState<string | null>(null)
  const [showInstructions, setShowInstructions] = useState<{ question1: boolean; question2: boolean }>({
    question1: true,
    question2: true,
  })
  const [testId, setTestId] = useState<string>("")

  // paramsを解決してテストIDを取得
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params
      setTestId(resolvedParams.id)
    }
    resolveParams()
  }, [params])

  // "guide" または "results" の場合は即座にリダイレクト
  useEffect(() => {
    if (!testId) return

    if (testId === "guide") {
      router.replace("/essay-test/guide")
      return
    }

    if (testId === "results") {
      router.replace("/essay-test-results")
      return
    }

    // テストデータを読み込み（バックエンドAPIから）
    const loadTestData = async () => {
      try {
        const data = await getTestData(testId)
        console.log("テストデータ読み込み:", { id: testId, data: !!data })
        if (data) {
          setTestData(data)
          setStep("reading")
        } else {
          console.error("テストが見つかりません:", testId)
          setError("指定されたテストが見つかりません。")
        }
      } catch (error) {
        console.error("テストデータ読み込みエラー:", error)
        setError("テストデータの読み込みに失敗しました。")
      }
    }

    loadTestData()
  }, [testId, router])

  // testDataがnullの場合の早期リターン
  if (!testData && step !== "loading") {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">テストが見つかりません</h1>
          <p className="text-muted-foreground mb-4">指定されたテストID「{testId}」が無効です。</p>
          <Button onClick={() => router.push("/essay-test")} className="bg-orange-500 hover:bg-orange-600 text-white">
            テスト一覧に戻る
          </Button>
        </div>
      </div>
    )
  }

  useEffect(() => {
    if (timeLeft > 0 && step !== "loading") {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (step === "reading") {
      setStep("writing")
      setTimeLeft(3600) // 60分 = 3600秒
    } else if (step === "writing") {
      handleSubmit()
    }
  }, [timeLeft, step])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // 回答内容の検証関数
  const validateAnswerContent = (
    answer: string,
    questionType: "summary" | "opinion",
  ): { isValid: boolean; reason?: string } => {
    // 空の回答をチェック
    if (!answer || answer.trim().length === 0) {
      return { isValid: false, reason: "回答が空です" }
    }

    // 指示文や問題文がそのまま入力されていないかチェック
    const instructionPatterns = [
      /課題文の要旨を.*字程度で要約してください/,
      /問1[:：].*要約/,
      /問2[:：].*意見/,
      /【\d+点】/,
      /$$\d+字程度$$/,
      /\d+字以内/,
    ]

    // 指示文のパターンが繰り返し出現するかチェック
    let instructionMatchCount = 0
    for (const pattern of instructionPatterns) {
      const matches = answer.match(pattern)
      if (matches && matches.length > 0) {
        instructionMatchCount += matches.length
      }
    }

    // 指示文が3回以上出現する場合は無効と判断
    if (instructionMatchCount >= 3) {
      return {
        isValid: false,
        reason: "回答に指示文が繰り返し含まれています。実際の回答を入力してください。",
      }
    }

    // 問題の種類に応じた追加チェック
    if (questionType === "summary") {
      // 要約問題の場合、極端に長い回答は不適切
      if (answer.length > 400) {
        return {
          isValid: false,
          reason: "要約問題の回答が長すぎます。200字程度にまとめてください。",
        }
      }
    } else if (questionType === "opinion") {
      // 意見記述問題の場合、極端に短い回答は不適切
      if (answer.length < 50) {
        return {
          isValid: false,
          reason: "意見記述問題の回答が短すぎます。より詳細な意見を記述してください。",
        }
      }
    }

    return { isValid: true }
  }

  const handleSubmit = async () => {
    if (!testData) return

    // 回答の検証
    if (!answer1.trim() || !answer2.trim()) {
      setError("両方の問題に回答してください。")
      return
    }

    if (answer1.trim().length < 10) {
      setError("問1の回答が短すぎます。10文字以上記述してください。")
      return
    }

    if (answer2.trim().length < 30) {
      setError("問2の回答が短すぎます。30文字以上記述してください。")
      return
    }

    // 回答内容の検証
    const answer1Validation = validateAnswerContent(answer1, "summary")
    if (!answer1Validation.isValid) {
      setError(`問1: ${answer1Validation.reason}`)
      return
    }

    const answer2Validation = validateAnswerContent(answer2, "opinion")
    if (!answer2Validation.isValid) {
      setError(`問2: ${answer2Validation.reason}`)
      return
    }

    setIsSubmitting(true)
    setError(null)
    setSubmitWarning(null)
    setStep("submitting")

    try {
      console.log("提出開始:", {
        testId: testData.id,
        testTitle: testData.title,
        answer1Length: answer1.length,
        answer2Length: answer2.length,
        answer1Preview: answer1.substring(0, 50),
        answer2Preview: answer2.substring(0, 50),
      })

      const response = await submitEssay({
        testId: testData.id,
        testTitle: testData.title,
        answer1: answer1.trim(),
        answer2: answer2.trim(),
      })

      console.log("提出成功:", response)

      // フォールバック使用の警告を表示
      if (response.message) {
        setSubmitWarning(response.message)
      }

      // 結果ページにリダイレクト
      router.push(`/essay-test/result/${response.resultId}`)
    } catch (error) {
      console.error("提出エラー:", error)
      setError("ネットワークエラーが発生しました。再度お試しください。")
      setStep("writing")
      setIsSubmitting(false)
    }
  }

  // 読解終了の処理
  const handleEndReading = () => {
    console.log("読解終了ボタンがクリックされました")
    setStep("writing")
    setTimeLeft(3600) // 60分 = 3600秒
  }

  // 確認ダイアログを表示
  const showEndReadingConfirm = () => {
    setShowConfirm(true)
  }

  // 確認ダイアログでの確定処理
  const confirmEndReading = () => {
    setShowConfirm(false)
    handleEndReading()
  }

  // 指示文の表示/非表示を切り替える
  const toggleInstructions = (questionNumber: 1 | 2) => {
    setShowInstructions((prev) => ({
      ...prev,
      [`question${questionNumber}`]: !prev[`question${questionNumber}`],
    }))
  }

  // ローディング中
  if (step === "loading") {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold mb-4">テストを読み込み中...</h1>
          <p className="text-muted-foreground mb-2">テストID: {testId}</p>
          <div className="text-sm text-gray-500">
            {Date.now() - loadStartTime > 3000 && (
              <div className="mt-4">
                <p className="text-red-600 mb-2">読み込みに時間がかかっています</p>
                <Button onClick={() => router.push("/essay-test")} variant="outline">
                  テスト一覧に戻る
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // 読解ステップのレンダリング
  if (step === "reading") {
    if (!testData) {
      return <div>Loading...</div>
    }
    
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">{testData.title}</h1>
              <p className="text-muted-foreground">課題文読解</p>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="text-lg font-mono">{formatTime(timeLeft)}</span>
            </div>
          </div>
          <Progress value={((900 - timeLeft) / 900) * 100} className="mb-4" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              課題文
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              {testData.essayText.split("\n\n").map((paragraph, index) => (
                <p key={index} className="mb-4 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-between items-center">
          <div className="p-4 bg-blue-50 rounded-lg flex-1 mr-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">読解時間について</p>
                <p className="text-sm text-blue-700">
                  課題文をしっかりと読み、内容を理解してください。準備ができたら記述に進むことができます。
                </p>
              </div>
            </div>
          </div>

          <div className="ml-4">
            {!showConfirm ? (
              <Button
                size="lg"
                onClick={showEndReadingConfirm}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                読解を終了して記述に進む
              </Button>
            ) : (
              <Card className="w-80">
                <CardHeader>
                  <CardTitle className="text-lg">読解を終了しますか？</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    読解を終了すると、課題文を再度確認することはできません。記述問題に進んでもよろしいですか？
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowConfirm(false)}>
                      キャンセル
                    </Button>
                    <Button onClick={confirmEndReading} className="bg-orange-500 hover:bg-orange-600 text-white">
                      記述に進む
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    )
  }

  // 記述ステップのレンダリング
  if (step === "writing") {
    if (!testData) {
      return <div>Loading...</div>
    }
    
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">{testData.title}</h1>
              <p className="text-muted-foreground">小論文記述</p>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="text-lg font-mono">{formatTime(timeLeft)}</span>
            </div>
          </div>
          <Progress value={((3600 - timeLeft) / 3600) * 100} className="mb-4" />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{testData.question1.title}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => toggleInstructions(1)}
                  className="flex items-center gap-1 text-blue-600"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>{showInstructions.question1 ? "指示を隠す" : "指示を表示"}</span>
                </Button>
              </CardTitle>
              {showInstructions.question1 && (
                <p className="text-sm text-muted-foreground">{testData.question1.description}</p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  value={answer1}
                  onChange={(e) => setAnswer1(e.target.value)}
                  placeholder="課題文の要旨を簡潔にまとめてください..."
                  className="min-h-[120px]"
                />
                <div className="mt-2 flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    文字数:{" "}
                    <span className={answer1.trim().length < 10 ? "text-amber-600 font-medium" : ""}>
                      {answer1.length}字
                    </span>
                    <span className="text-xs ml-1">(最低10文字必要)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{testData.question2.title}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => toggleInstructions(2)}
                  className="flex items-center gap-1 text-blue-600"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>{showInstructions.question2 ? "指示を隠す" : "指示を表示"}</span>
                </Button>
              </CardTitle>
              {showInstructions.question2 && (
                <p className="text-sm text-muted-foreground">{testData.question2.description}</p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  value={answer2}
                  onChange={(e) => setAnswer2(e.target.value)}
                  placeholder="あなたの意見を論理的に述べてください..."
                  className="min-h-[300px]"
                />
                <div className="mt-2 flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    文字数:{" "}
                    <span className={answer2.trim().length < 30 ? "text-amber-600 font-medium" : ""}>
                      {answer2.length}字
                    </span>
                    <span className="text-xs ml-1">(最低30文字必要 / 800字以内)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 注意事項 */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-yellow-800 mb-1">回答入力時の注意</h3>
                  <p className="text-sm text-yellow-700">
                    問題文や指示文をそのまま入力すると正しく採点されません。実際の回答を入力してください。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
              <p className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </p>
            </div>
          )}

          {submitWarning && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800">
              <p className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                {submitWarning}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            {/* 文字数制限の警告表示 */}
            {answer1.trim().length > 0 && answer1.trim().length < 10 && (
              <div className="text-xs text-amber-600 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                問1は最低10文字必要です（現在: {answer1.trim().length}文字）
              </div>
            )}
            {answer2.trim().length > 0 && answer2.trim().length < 30 && (
              <div className="text-xs text-amber-600 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                問2は最低30文字必要です（現在: {answer2.trim().length}文字）
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                !answer1.trim() ||
                !answer2.trim() ||
                answer1.trim().length < 10 ||
                answer2.trim().length < 30
              }
              size="lg"
              className="self-end bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isSubmitting ? "提出中..." : "答案を提出"}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // 提出中のレンダリング
  if (step === "submitting") {
    if (!testData) {
      return <div>Loading...</div>
    }
    
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{testData.title}</h1>
          <p className="text-muted-foreground">AI採点システムが答案を採点しています。しばらくお待ちください。</p>
          {submitWarning && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 max-w-md mx-auto">
              <p className="flex items-center gap-2 text-sm">
                <Info className="w-4 h-4" />
                {submitWarning}
              </p>
            </div>
          )}
        </div>
        <ScoringProgress testTitle={testData.title} />
      </div>
    )
  }

  // デフォルトの戻り値（すべてのケースをカバー）
  return null
} 