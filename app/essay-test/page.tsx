import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, FileText, Users, Trophy, Target, BookOpen, PenTool, Sparkles } from "lucide-react"
import Link from "next/link"
import { getAllEssayTests } from "@/lib/essay-test-data"

export default function EssayTestPage() {
  const essayTests = getAllEssayTests()

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">小論文テスト</h1>
        <p className="text-muted-foreground">
          読解力と論述力を測定する小論文テストです。結果は大学のスカウト担当者にも公開されます。
        </p>
      </div>

      {/* ランキングナビゲーション */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-1">採点結果ランキング</h2>
                <p className="text-gray-600 text-sm">志望校ライバルとの競争で実力アップ！全国順位もチェック</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/ranking">
                <Button className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                  <Target className="w-4 h-4" />
                  ランキングを見る
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <Target className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-medium text-sm">マイ・ターゲットランキング</div>
                <div className="text-xs text-gray-500">同じ志望校を目指すライバルとの順位</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <Users className="w-5 h-5 text-purple-600" />
              <div>
                <div className="font-medium text-sm">全国ランキング</div>
                <div className="text-xs text-gray-500">全ユーザー中での総合順位</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 採点結果一覧へのリンク */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-400 to-green-500 rounded-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-1">みんなの採点結果</h2>
                <p className="text-gray-600 text-sm">他のユーザーの小論文と採点結果を閲覧して学びましょう</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/essay-test-results">
                <Button className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                  <Users className="w-4 h-4" />
                  採点結果一覧を見る
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {essayTests.map((test) => (
          <Card key={test.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{test.title}</CardTitle>
                  <Badge variant="secondary" className="mb-2">
                    {test.category}
                  </Badge>
                </div>
                <Badge variant={test.difficulty === "やや難" ? "destructive" : "default"} className="ml-2">
                  {test.difficulty}
                </Badge>
              </div>
              <CardDescription className="text-sm">{test.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    読解: {test.readingTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    記述: {test.writingTime}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div>満点: {test.totalPoints}点</div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {test.participants.toLocaleString()}人受験
                  </div>
                </div>
                <Link href={`/essay-test/${test.id}`} className="block">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">テストを開始</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ガイドページへのリンク */}
      <Card className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-1">小論文の書き方ガイド</h2>
                <p className="text-gray-600 text-sm">レベル別の実践的な書き方ガイドで効率よくスキルアップ</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/essay-test/guide">
                <Button className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                  <PenTool className="w-4 h-4" />
                  ガイドを見る
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <BookOpen className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium text-sm">レベル1：基礎完成</div>
                <div className="text-xs text-gray-500">小論文の「型」をマスター</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <PenTool className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-medium text-sm">レベル2：応用</div>
                <div className="text-xs text-gray-500">論理と多角的視点で説得力UP</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <div>
                <div className="font-medium text-sm">レベル3：発展</div>
                <div className="text-xs text-gray-500">独創性と鋭い洞察で差をつける</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
