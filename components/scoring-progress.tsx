"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Brain,
  FileText,
  CheckCircle,
  Clock,
  Sparkles,
  Target,
  TrendingUp,
  Lightbulb,
  Award,
  BookOpen,
  MessageSquare,
} from "lucide-react"

interface ScoringProgressProps {
  testTitle: string
  onComplete?: () => void
}

// 採点ステップの定義
const scoringSteps = [
  {
    id: "reading",
    title: "回答内容の読み込み",
    description: "提出された回答を解析しています",
    icon: FileText,
    duration: 2000,
  },
  {
    id: "understanding",
    title: "内容理解の評価",
    description: "課題文の理解度を分析しています",
    icon: Brain,
    duration: 3000,
  },
  {
    id: "logic",
    title: "論理性の評価",
    description: "論理構成と一貫性を評価しています",
    icon: Target,
    duration: 3500,
  },
  {
    id: "expression",
    title: "表現力の評価",
    description: "文章力と表現技法を分析しています",
    icon: MessageSquare,
    duration: 2500,
  },
  {
    id: "creativity",
    title: "独創性の評価",
    description: "独自の視点と具体例を評価しています",
    icon: Lightbulb,
    duration: 3000,
  },
  {
    id: "finalizing",
    title: "総合評価の算出",
    description: "最終スコアとフィードバックを生成しています",
    icon: Award,
    duration: 2000,
  },
]

// 小論文のコツ
const essayTips = [
  {
    title: "要約のコツ",
    content: "筆者の主張を正確に把握し、重要な論点を漏らさずに簡潔にまとめましょう。",
    icon: FileText,
  },
  {
    title: "論理構成",
    content: "序論・本論・結論の構成を意識し、論理的な流れを作りましょう。",
    icon: Target,
  },
  {
    title: "具体例の活用",
    content: "抽象的な議論だけでなく、具体的な事例や体験を交えて説得力を高めましょう。",
    icon: Lightbulb,
  },
  {
    title: "反対意見への配慮",
    content: "自分の立場だけでなく、反対意見も考慮して論述すると評価が高まります。",
    icon: TrendingUp,
  },
]

// 大学スカウト情報
const scoutInfo = ["優秀な成績（80点以上）を収めた学生には、大学からスカウトメッセージが届きます"]

export function ScoringProgress({ testTitle, onComplete }: ScoringProgressProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [currentTip, setCurrentTip] = useState(0)
  const [showScoutInfo, setShowScoutInfo] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)

  // 総採点時間（約16秒）
  const totalDuration = scoringSteps.reduce((sum, step) => sum + step.duration, 0)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    const startTime = Date.now()

    const runStep = (stepIndex: number) => {
      if (stepIndex >= scoringSteps.length) {
        setProgress(100)
        setTimeout(() => {
          onComplete?.()
        }, 1000)
        return
      }

      setCurrentStep(stepIndex)
      const step = scoringSteps[stepIndex]

      // ステップ内での進捗更新
      const stepStartTime = Date.now()
      const updateProgress = () => {
        const elapsed = Date.now() - startTime
        const newProgress = Math.min((elapsed / totalDuration) * 100, 100)
        setProgress(newProgress)

        if (elapsed < totalDuration) {
          requestAnimationFrame(updateProgress)
        }
      }
      updateProgress()

      timeoutId = setTimeout(() => {
        runStep(stepIndex + 1)
      }, step.duration)
    }

    runStep(0)

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [onComplete, totalDuration])

  // 経過時間の更新
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // コツの自動切り替え
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % essayTips.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const currentStepData = scoringSteps[currentStep]
  const CurrentIcon = currentStepData?.icon || Brain

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-8 h-8 text-blue-600 animate-pulse" />
          <h1 className="text-3xl font-bold">AI採点中</h1>
        </div>
        <p className="text-muted-foreground mb-2">{testTitle}</p>
        <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block">高精度AI採点システム</div>
      </div>

      {/* メイン採点プロセス */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CurrentIcon className="w-6 h-6 text-blue-600" />
            {currentStepData?.title || "採点準備中"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{currentStepData?.description || "採点を開始しています..."}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />

            {/* 採点ステップ一覧 */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
              {scoringSteps.map((step, index) => {
                const StepIcon = step.icon
                const isCompleted = index < currentStep
                const isCurrent = index === currentStep
                const isPending = index > currentStep

                return (
                  <div
                    key={step.id}
                    className={`p-3 rounded-lg border transition-all ${
                      isCompleted
                        ? "bg-green-50 border-green-200"
                        : isCurrent
                          ? "bg-blue-50 border-blue-200 animate-pulse"
                          : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <StepIcon className={`w-4 h-4 ${isCurrent ? "text-blue-600" : "text-gray-400"}`} />
                      )}
                      <span
                        className={`text-xs font-medium ${
                          isCompleted ? "text-green-700" : isCurrent ? "text-blue-700" : "text-gray-500"
                        }`}
                      >
                        {step.title}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* 経過時間 */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-4">
              <Clock className="w-4 h-4" />
              <span>経過時間: {elapsedTime}秒</span>
              <span>•</span>
              <span>
                推定残り時間: {Math.max(0, Math.round((totalDuration - (progress / 100) * totalDuration) / 1000))}秒
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 情報カード */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* 小論文のコツ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-green-600" />
              小論文のコツ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {essayTips.map((tip, index) => {
                const TipIcon = tip.icon
                const isActive = index === currentTip

                return (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border transition-all duration-500 ${
                      isActive ? "bg-green-50 border-green-200 scale-105" : "bg-gray-50 border-gray-200 opacity-60"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <TipIcon className={`w-5 h-5 mt-0.5 ${isActive ? "text-green-600" : "text-gray-400"}`} />
                      <div>
                        <h4 className={`font-medium mb-1 ${isActive ? "text-green-900" : "text-gray-600"}`}>
                          {tip.title}
                        </h4>
                        <p className={`text-sm ${isActive ? "text-green-700" : "text-gray-500"}`}>{tip.content}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* AI採点の仕組み */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-600" />
              AI採点の仕組み
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">採点項目</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 要点の把握と整理（問1）</li>
                  <li>• 論理性と構成力（問2）</li>
                  <li>• 表現力と文章力</li>
                  <li>• 独創性と具体例の活用</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">AI技術</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 最新の言語処理AI</li>
                  <li>• 大学入試採点基準に準拠</li>
                  <li>• 人間の採点者との一致率95%以上</li>
                  <li>• 客観的で公平な評価</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 進捗インジケーター */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
          <span className="text-sm text-blue-700">高精度AI採点を実行中... しばらくお待ちください</span>
        </div>
      </div>
    </div>
  )
}
