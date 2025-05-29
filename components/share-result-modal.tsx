"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Share2,
  Copy,
  Check,
  MessageCircle,
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Smartphone,
  Users,
  Download,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ShareResultModalProps {
  result: {
    id: string
    testTitle: string
    totalScore: number
    maxScore: number
    rank: string
    percentile: number
    submittedAt: string
  }
}

export function ShareResultModal({ result }: ShareResultModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [customMessage, setCustomMessage] = useState("")

  // デバッグ用のログ
  console.log("ShareResultModal rendered with result:", result)

  // シェア用のURL（実際のアプリでは適切なドメインに変更）
  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/essay-test/result/${result.id}`

  // デフォルトのシェアメッセージ
  const defaultMessage = `小論文テスト「${result.testTitle}」の結果が出ました！
📝 総合得点: ${result.totalScore}/${result.maxScore}点
🏆 評価: ${result.rank}ランク
📊 上位${result.percentile}%

AI採点システムで客観的に評価されました✨`

  // カスタムメッセージまたはデフォルトメッセージ
  const shareMessage = customMessage || defaultMessage

  // URLをクリップボードにコピー
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      console.log("URL copied to clipboard")
    } catch (err) {
      console.error("コピーに失敗しました:", err)
    }
  }

  // LINE シェア
  const shareToLine = () => {
    console.log("LINE share clicked")
    const text = encodeURIComponent(`${shareMessage}\n\n詳細はこちら: ${shareUrl}`)
    window.open(`https://line.me/R/msg/text/?${text}`, "_blank")
  }

  // Facebook シェア
  const shareToFacebook = () => {
    console.log("Facebook share clicked")
    const url = encodeURIComponent(shareUrl)
    const quote = encodeURIComponent(shareMessage)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}`, "_blank")
  }

  // Twitter シェア
  const shareToTwitter = () => {
    console.log("Twitter share clicked")
    const text = encodeURIComponent(`${shareMessage}\n${shareUrl}`)
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank")
  }

  // Instagram（ストーリー用画像生成のヒント）
  const shareToInstagram = () => {
    console.log("Instagram share clicked")
    alert(
      "Instagramでシェアするには:\n1. スクリーンショットを撮影\n2. Instagramアプリでストーリーに投稿\n3. 結果URLを追加してください",
    )
  }

  // メールシェア
  const shareByEmail = () => {
    console.log("Email share clicked")
    const subject = encodeURIComponent(`小論文テスト結果: ${result.testTitle}`)
    const body = encodeURIComponent(`${shareMessage}\n\n詳細な結果はこちらでご確認ください:\n${shareUrl}`)
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  // Web Share API（モバイル対応）
  const shareNative = async () => {
    console.log("Native share clicked")
    if (navigator.share) {
      try {
        await navigator.share({
          title: `小論文テスト結果: ${result.testTitle}`,
          text: shareMessage,
          url: shareUrl,
        })
      } catch (err) {
        console.error("シェアに失敗しました:", err)
      }
    } else {
      // Web Share APIが利用できない場合はクリップボードにコピー
      copyToClipboard()
    }
  }

  // 結果画像を生成してダウンロード（簡易版）
  const downloadResultImage = () => {
    console.log("Download image clicked")
    // Canvas APIを使用して結果画像を生成
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 800
    canvas.height = 600

    // 背景
    ctx.fillStyle = "#f8fafc"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // タイトル
    ctx.fillStyle = "#1e293b"
    ctx.font = "bold 32px Arial"
    ctx.textAlign = "center"
    ctx.fillText("小論文テスト結果", canvas.width / 2, 80)

    // テスト名
    ctx.font = "24px Arial"
    ctx.fillStyle = "#64748b"
    ctx.fillText(result.testTitle, canvas.width / 2, 120)

    // スコア
    ctx.font = "bold 72px Arial"
    ctx.fillStyle = "#3b82f6"
    ctx.fillText(`${result.totalScore}`, canvas.width / 2, 220)

    ctx.font = "24px Arial"
    ctx.fillStyle = "#64748b"
    ctx.fillText(`/ ${result.maxScore}点`, canvas.width / 2, 250)

    // ランク
    ctx.font = "bold 48px Arial"
    ctx.fillStyle = "#10b981"
    ctx.fillText(`${result.rank}ランク`, canvas.width / 2, 320)

    // パーセンタイル
    ctx.font = "24px Arial"
    ctx.fillStyle = "#64748b"
    ctx.fillText(`上位${result.percentile}%`, canvas.width / 2, 360)

    // AI採点
    ctx.font = "18px Arial"
    ctx.fillStyle = "#8b5cf6"
    ctx.fillText("OpenAI GPT-4o による高精度AI採点", canvas.width / 2, 420)

    // 日付
    ctx.font = "16px Arial"
    ctx.fillStyle = "#94a3b8"
    const date = new Date(result.submittedAt).toLocaleDateString("ja-JP")
    ctx.fillText(`採点日: ${date}`, canvas.width / 2, 460)

    // URL
    ctx.font = "14px Arial"
    ctx.fillStyle = "#64748b"
    ctx.fillText("詳細結果はWebで確認", canvas.width / 2, 520)

    // ダウンロード
    const link = document.createElement("a")
    link.download = `小論文テスト結果_${result.testTitle}_${date}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  const handleOpenChange = (open: boolean) => {
    console.log("Dialog open state changed:", open)
    setIsOpen(open)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white"
          onClick={() => {
            console.log("Share button clicked")
            setIsOpen(true)
          }}
        >
          <Share2 className="w-4 h-4" />
          結果をシェア
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            結果をシェア
          </DialogTitle>
          <DialogDescription>
            小論文テストの結果を友達や家族とシェアしましょう。SNSやメールで簡単に共有できます。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 結果プレビュー */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">シェア内容プレビュー</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{result.testTitle}</Badge>
                  <Badge variant="default">{result.rank}ランク</Badge>
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {result.totalScore}/{result.maxScore}点
                </div>
                <div className="text-sm text-muted-foreground mb-2">上位{result.percentile}%</div>
                <div className="text-xs text-blue-600">OpenAI GPT-4o による高精度AI採点</div>
              </div>
            </CardContent>
          </Card>

          {/* カスタムメッセージ */}
          <div>
            <label className="text-sm font-medium mb-2 block">シェアメッセージをカスタマイズ（任意）</label>
            <Textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder={defaultMessage}
              className="min-h-[100px]"
            />
            <div className="text-xs text-muted-foreground mt-1">空欄の場合はデフォルトメッセージが使用されます</div>
          </div>

          {/* シェアボタン */}
          <div>
            <h4 className="font-medium mb-3">シェア方法を選択</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* LINE */}
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-green-50 hover:border-green-300"
                onClick={shareToLine}
              >
                <MessageCircle className="w-6 h-6 text-green-600" />
                <span className="text-sm">LINE</span>
              </Button>

              {/* Facebook */}
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-blue-50 hover:border-blue-300"
                onClick={shareToFacebook}
              >
                <Facebook className="w-6 h-6 text-blue-600" />
                <span className="text-sm">Facebook</span>
              </Button>

              {/* Twitter */}
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-sky-50 hover:border-sky-300"
                onClick={shareToTwitter}
              >
                <Twitter className="w-6 h-6 text-sky-600" />
                <span className="text-sm">Twitter</span>
              </Button>

              {/* Instagram */}
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-pink-50 hover:border-pink-300"
                onClick={shareToInstagram}
              >
                <Instagram className="w-6 h-6 text-pink-600" />
                <span className="text-sm">Instagram</span>
              </Button>

              {/* メール */}
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-gray-50 hover:border-gray-300"
                onClick={shareByEmail}
              >
                <Mail className="w-6 h-6 text-gray-600" />
                <span className="text-sm">メール</span>
              </Button>

              {/* ネイティブシェア（モバイル） */}
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-purple-50 hover:border-purple-300"
                onClick={shareNative}
              >
                <Smartphone className="w-6 h-6 text-purple-600" />
                <span className="text-sm">その他</span>
              </Button>

              {/* 画像ダウンロード */}
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-orange-50 hover:border-orange-300"
                onClick={downloadResultImage}
              >
                <Download className="w-6 h-6 text-orange-600" />
                <span className="text-sm">画像保存</span>
              </Button>

              {/* URLコピー */}
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-indigo-50 hover:border-indigo-300"
                onClick={copyToClipboard}
              >
                {copied ? <Check className="w-6 h-6 text-green-600" /> : <Copy className="w-6 h-6 text-indigo-600" />}
                <span className="text-sm">{copied ? "コピー済み" : "URLコピー"}</span>
              </Button>
            </div>
          </div>

          {/* URL表示 */}
          <div>
            <label className="text-sm font-medium mb-2 block">結果ページURL</label>
            <div className="flex gap-2">
              <Input value={shareUrl} readOnly className="font-mono text-sm" />
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* 注意事項 */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <Users className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-blue-900 mb-1">シェア時の注意</h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• この結果は大学のスカウト担当者にも公開されます</li>
                  <li>• 結果URLは一定期間後に無効になる場合があります</li>
                  <li>• 個人情報の取り扱いにご注意ください</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
