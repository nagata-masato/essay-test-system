import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, FileText, Users, Trophy, Target, BookOpen, PenTool, Sparkles, ArrowRight, Star, Award } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* ヒーローセクション */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          小論文テストシステム
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          読解力と論述力を測定する本格的な小論文テスト。大学のスカウト担当者も注目する結果で、あなたの実力を証明しましょう。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/essay-test">
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3">
              <PenTool className="w-5 h-5 mr-2" />
              テストを開始する
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="/ranking">
            <Button size="lg" variant="outline" className="px-8 py-3">
              <Trophy className="w-5 h-5 mr-2" />
              ランキングを見る
            </Button>
          </Link>
        </div>
      </div>

      {/* 特徴セクション */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <CardTitle>本格的な小論文テスト</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              大学入試レベルの本格的な小論文テストで、読解力と論述力を総合的に測定します。
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <CardTitle>全国ランキング</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              全国のユーザーと競い合い、志望校別のランキングで実力を確認できます。
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-white" />
            </div>
            <CardTitle>大学スカウト</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              優秀な結果は大学のスカウト担当者にも公開され、進路の可能性が広がります。
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* 主要機能へのナビゲーション */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {/* 小論文テスト */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <PenTool className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">小論文テスト</h2>
                <p className="text-gray-600">読解力と論述力を測定</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              様々なテーマの小論文テストに挑戦して、あなたの実力を測定しましょう。結果は詳細な分析とともに提供されます。
            </p>
            <Link href="/essay-test">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                テスト一覧を見る
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* ランキング */}
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">ランキング</h2>
                <p className="text-gray-600">全国・志望校別順位</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              全国ランキングや志望校別ランキングで、あなたの実力を他のユーザーと比較できます。
            </p>
            <Link href="/ranking">
              <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                ランキングを見る
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* 採点結果一覧 */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">みんなの採点結果</h2>
                <p className="text-gray-600">他のユーザーの結果を参考に</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              他のユーザーの小論文と採点結果を閲覧して、学習の参考にしましょう。
            </p>
            <Link href="/essay-test-results">
              <Button className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                採点結果一覧を見る
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* 書き方ガイド */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">書き方ガイド</h2>
                <p className="text-gray-600">レベル別実践ガイド</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              レベル別の実践的な書き方ガイドで、効率よく小論文のスキルアップを図りましょう。
            </p>
            <Link href="/essay-test/guide">
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                ガイドを見る
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* 統計情報 */}
      <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold text-center mb-8">システム統計</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">15,000+</div>
              <div className="text-gray-600">総受験者数</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-gray-600">テスト問題数</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">200+</div>
              <div className="text-gray-600">提携大学数</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">95%</div>
              <div className="text-gray-600">満足度</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 