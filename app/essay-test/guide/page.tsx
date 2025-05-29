"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BookOpen, Target, TrendingUp, Users, Clock, FileText, Award, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function EssayTestGuide() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/essay-test">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              テスト一覧に戻る
            </Button>
          </Link>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            小論文作成ガイド
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            効果的な小論文を書くための段階的なガイドです。基礎から応用まで、レベルに応じて学習を進めましょう。
          </p>
        </div>
      </div>

      {/* レベル別ガイド */}
      <div className="grid gap-8 mb-12">
        {/* 基礎レベル */}
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-green-800">基礎レベル</CardTitle>
                  <p className="text-green-600">小論文の基本構造を理解する</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-300">
                初心者向け
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  基本構成（序論・本論・結論）
                </h4>
                <ul className="space-y-2 text-sm text-green-700">
                  <li>
                    • <strong>序論</strong>: 問題提起と論点の明確化
                  </li>
                  <li>
                    • <strong>本論</strong>: 根拠を示した論証
                  </li>
                  <li>
                    • <strong>結論</strong>: 主張のまとめと展望
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  文章作成のポイント
                </h4>
                <ul className="space-y-2 text-sm text-green-700">
                  <li>• 一文は短く、明確に</li>
                  <li>• 接続詞を効果的に使用</li>
                  <li>• 具体例で論証を補強</li>
                  <li>• 客観的な視点を保つ</li>
                </ul>
              </div>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <h5 className="font-medium text-green-800 mb-2">練習のコツ</h5>
              <p className="text-sm text-green-700">
                まずは短い文章から始めて、段階的に文字数を増やしていきましょう。
                毎日少しずつでも書く習慣をつけることが重要です。
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 応用レベル */}
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-blue-800">応用レベル</CardTitle>
                  <p className="text-blue-600">論理的思考力を高める</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-300">
                中級者向け
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  論理的構成の技法
                </h4>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li>• 演繹法と帰納法の使い分け</li>
                  <li>• 対比・比較による論証</li>
                  <li>• 因果関係の明確化</li>
                  <li>• 反対意見への配慮</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  説得力のある表現
                </h4>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li>• データや統計の活用</li>
                  <li>• 専門用語の適切な使用</li>
                  <li>• 感情に訴える表現技法</li>
                  <li>• 読み手を意識した文体</li>
                </ul>
              </div>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg">
              <h5 className="font-medium text-blue-800 mb-2">レベルアップのために</h5>
              <p className="text-sm text-blue-700">
                様々な分野の文章を読み、論理構成を分析してみましょう。
                また、自分の意見に対する反対意見も考える習慣をつけることが大切です。
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 発展レベル */}
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-purple-800">発展レベル</CardTitle>
                  <p className="text-purple-600">独創性と深い洞察力を身につける</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-300">
                上級者向け
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  高度な論証技法
                </h4>
                <ul className="space-y-2 text-sm text-purple-700">
                  <li>• 多角的な視点からの分析</li>
                  <li>• 抽象的概念の具体化</li>
                  <li>• 学際的なアプローチ</li>
                  <li>• 創造的な解決策の提示</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  社会的影響力のある文章
                </h4>
                <ul className="space-y-2 text-sm text-purple-700">
                  <li>• 時代背景の考慮</li>
                  <li>• グローバルな視点</li>
                  <li>• 倫理的な配慮</li>
                  <li>• 未来への提言</li>
                </ul>
              </div>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg">
              <h5 className="font-medium text-purple-800 mb-2">さらなる向上のために</h5>
              <p className="text-sm text-purple-700">
                学術論文や専門書を読み、高度な論証方法を学びましょう。
                また、異なる文化や価値観を理解し、多様な視点から物事を考える力を養うことが重要です。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* サービス紹介 */}
      <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 mb-8">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-orange-800 flex items-center justify-center gap-2">
            <Award className="w-6 h-6" />
            AI採点システムの特徴
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="p-3 bg-orange-100 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="font-semibold text-orange-800 mb-2">即座に採点</h4>
              <p className="text-sm text-orange-700">提出後すぐにAIが採点し、詳細なフィードバックを提供します。</p>
            </div>
            <div className="text-center">
              <div className="p-3 bg-orange-100 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <Target className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="font-semibold text-orange-800 mb-2">的確な評価</h4>
              <p className="text-sm text-orange-700">論理性、表現力、独創性など多角的な観点から評価します。</p>
            </div>
            <div className="text-center">
              <div className="p-3 bg-orange-100 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="font-semibold text-orange-800 mb-2">継続的改善</h4>
              <p className="text-sm text-orange-700">過去の結果を分析し、個人に最適化された学習提案を行います。</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 学習リソース */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
            <BookOpen className="w-6 h-6" />
            追加学習リソース
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">推奨図書</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• 「論理的思考力を鍛える33の思考実験」</li>
                <li>• 「大学入試小論文の書き方」</li>
                <li>• 「クリティカルシンキング入門」</li>
                <li>• 「文章力の基本」</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">練習のヒント</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• 毎日15分の文章練習を継続する</li>
                <li>• 新聞の社説を要約してみる</li>
                <li>• 異なる立場から同じ問題を考える</li>
                <li>• 友人や先生に添削してもらう</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="text-center mt-12">
        <h3 className="text-2xl font-bold mb-4">準備はできましたか？</h3>
        <p className="text-muted-foreground mb-6">学んだ知識を活かして、実際の小論文テストに挑戦してみましょう。</p>
        <Link href="/essay-test">
          <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
            テストを開始する
          </Button>
        </Link>
      </div>
    </div>
  )
}
