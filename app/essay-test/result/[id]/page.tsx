"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  Info,
  Loader2,
  FileText,
  Eye,
  EyeOff,
  Bug,
  RefreshCw,
  Trophy,
} from "lucide-react"
import Link from "next/link"
import { ShareResultModal } from "@/components/share-result-modal"
import { getResult, type ResultData } from "@/lib/api-client"

// ランクを計算する関数
function calculateRank(score: number): string {
  if (score >= 90) return "S"
  if (score >= 80) return "A"
  if (score >= 70) return "B+"
  if (score >= 60) return "B"
  if (score >= 50) return "C+"
  if (score >= 40) return "C"
  return "D"
}

// パーセンタイルを計算する関数（実際のアプリではデータベースから取得）
function calculatePercentile(score: number): number {
  // 仮の実装：スコアに基づいて簡易的に計算
  return Math.min(Math.round((score / 100) * 100), 99)
}

interface ResultPageProps {
  params: Promise<{
    id: string
  }>
}

export default function ResultPage({ params }: ResultPageProps) {
  const [result, setResult] = useState<ResultData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openCollapsibles, setOpenCollapsibles] = useState<Record<string, boolean>>({})
  const [showAnswers, setShowAnswers] = useState(true) // 回答表示の切り替え
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [showDebug, setShowDebug] = useState(false)
  const [resultId, setResultId] = useState<string>("")

  // paramsを解決してresultIDを取得
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params
      setResultId(resolvedParams.id)
    }
    resolveParams()
  }, [params])

  const toggleCollapsible = (key: string) => {
    setOpenCollapsibles((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const fetchResult = async (withDebug = false) => {
    if (!resultId) return
    
    try {
      setLoading(true)
      setError(null)
      console.log("結果を取得中:", resultId, withDebug ? "(デバッグモード)" : "")

      const data = await getResult(resultId)

      if (!data) {
        setError("結果が見つかりません")
        setLoading(false)
        return
      }

      console.log("取得したデータ:", data)
      setResult(data)
    } catch (err) {
      console.error("結果取得エラー:", err)
      setError(`結果の取得に失敗しました: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (resultId) {
      fetchResult()
    }
  }, [resultId])

  const handleDebugCheck = () => {
    fetchResult(true)
    setShowDebug(true)
  }

  const handleRetry = () => {
    setShowDebug(false)
    setDebugInfo(null)
    fetchResult(false)
  }

  const getScoreColor = (score: number, max: number) => {
    const percentage = (score / max) * 100
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadgeVariant = (score: number, max: number) => {
    const percentage = (score / max) * 100
    if (percentage >= 80) return "default"
    if (percentage >= 60) return "secondary"
    return "destructive"
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
        <h2 className="text-xl font-semibold mb-2">採点結果を読み込み中...</h2>
        <p className="text-muted-foreground">AI採点システムが答案を採点しています。しばらくお待ちください。</p>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="p-8 bg-gray-50 rounded-lg text-center">
          <AlertTriangle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">結果が見つかりません</h2>
          <p className="text-muted-foreground mb-4">{error || "採点結果を取得できませんでした。"}</p>

          <div className="flex flex-wrap gap-2 justify-center">
            <Button onClick={handleRetry} className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              再試行
            </Button>
            <Link href="/essay-test">
              <Button variant="outline">テスト一覧に戻る</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const rank = calculateRank(result.totalScore)
  const percentile = calculatePercentile(result.totalScore)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-blue-600" />
          <h1 className="text-3xl font-bold">AI採点結果</h1>
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-1">{result.testTitle}</h2>
        <div className="mt-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block">
          {result.debug.usedFallback ? "基本採点システム" : "高精度AI採点システム"}
        </div>
      </div>

      {/* 総合結果 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            総合結果
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2 text-blue-600">{result.totalScore}</div>
              <div className="text-sm text-muted-foreground">100点満点</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2 text-green-600">{rank}</div>
              <div className="text-sm text-muted-foreground">総合評価</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2 text-purple-600">{percentile}%</div>
              <div className="text-sm text-muted-foreground">上位パーセンタイル</div>
            </div>
          </div>
          <Progress value={(result.totalScore / 100) * 100} className="mt-6" />

          {/* 総合評価 */}
          {result?.scores?.feedback?.overall_assessment && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">総合評価</h4>
              <p className="text-sm text-muted-foreground">{result.scores.feedback.overall_assessment}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 提出した回答内容 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              提出した回答内容
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAnswers(!showAnswers)}
              className="flex items-center gap-2"
            >
              {showAnswers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showAnswers ? "回答を隠す" : "回答を表示"}
            </Button>
          </CardTitle>
        </CardHeader>
        {showAnswers && (
          <CardContent>
            <div className="space-y-6">
              {/* 問1の回答 */}
              <div>
                <h4 className="font-medium mb-2 flex items-center justify-between">
                  問1: 要約
                  <span className="text-sm text-muted-foreground">
                    {result.answers.question1.length}字
                  </span>
                </h4>
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {result.answers.question1.text}
                  </p>
                </div>
              </div>

              {/* 問2の回答 */}
              <div>
                <h4 className="font-medium mb-2 flex items-center justify-between">
                  問2: 意見記述
                  <span className="text-sm text-muted-foreground">
                    {result.answers.question2.length}字
                  </span>
                </h4>
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {result.answers.question2.text}
                  </p>
                </div>
              </div>

              {/* 提出日時 */}
              <div className="text-xs text-muted-foreground text-center pt-2 border-t">
                提出日時: {new Date(result.submittedAt).toLocaleString("ja-JP")}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* 問題別詳細 */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* 問1結果 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              問1: 要約
              <Badge variant={getScoreBadgeVariant(result.scores.question1.total, 30)}>
                {result.scores.question1.total}/30点
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(result.scores.question1.breakdown).map(([key, item]) => (
                <div key={key} className="border-l-4 border-blue-200 pl-4">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">{key}</h4>
                    <span className={`text-sm font-medium ${getScoreColor(item.score, 10)}`}>
                      {item.score}点
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.comment}</p>
                  {item.reasoning && (
                    <p className="text-xs text-gray-500 mt-1">理由: {item.reasoning}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 問2結果 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              問2: 意見記述
              <Badge variant={getScoreBadgeVariant(result.scores.question2.total, 70)}>
                {result.scores.question2.total}/70点
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(result.scores.question2.breakdown).map(([key, item]) => (
                <div key={key} className="border-l-4 border-green-200 pl-4">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">{key}</h4>
                    <span className={`text-sm font-medium ${getScoreColor(item.score, 20)}`}>
                      {item.score}点
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.comment}</p>
                  {item.reasoning && (
                    <p className="text-xs text-gray-500 mt-1">理由: {item.reasoning}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* フィードバック */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            詳細フィードバック
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* 良い点 */}
            <div>
              <h4 className="font-medium mb-3 text-green-700 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                良い点
              </h4>
              <ul className="space-y-2">
                {result.scores.feedback.strengths.map((strength, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            {/* 改善点 */}
            <div>
              <h4 className="font-medium mb-3 text-orange-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                改善点
              </h4>
              <ul className="space-y-2">
                {result.scores.feedback.improvements.map((improvement, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* アクションボタン */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Link href="/essay-test">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
            新しいテストを受ける
          </Button>
        </Link>
        <Link href="/ranking">
          <Button variant="outline" size="lg" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            ランキングを見る
          </Button>
        </Link>
        <ShareResultModal result={{
          id: result.id,
          testTitle: result.testTitle,
          totalScore: result.totalScore,
          maxScore: 100,
          rank: rank,
          percentile: percentile,
          submittedAt: result.submittedAt,
        }} />
      </div>

      {/* デバッグ情報 */}
      {result.debug && (
        <Card className="mt-8 bg-gray-50">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Info className="w-4 h-4" />
              システム情報
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>結果ID: {result.id}</p>
              <p>作成日時: {new Date(result.debug.createdAt).toLocaleString("ja-JP")}</p>
              <p>有効期限: {new Date(result.debug.expiresAt).toLocaleString("ja-JP")}</p>
              <p>採点方式: {result.debug.usedFallback ? "基本採点" : "AI採点"}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
