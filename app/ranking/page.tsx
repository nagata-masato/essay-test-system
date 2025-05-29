"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Target, TrendingUp, Users, Star, Zap, Settings, Medal, Crown, Award, Flame, Info } from "lucide-react"
import Link from "next/link"
import {
  generateSampleRanking,
  generateNationalRanking,
  formatScoreChange,
  formatRankChange,
  type TargetRanking,
  type RankingEntry,
} from "@/lib/ranking-data"

// 現在のユーザー情報（実際のアプリではログイン情報から取得）
const currentUser = {
  id: "current-user",
  nickname: "あなた",
  grade: 3,
  targetUniversities: ["tokyo-univ", "waseda-univ", "keio-univ"],
  prefecture: "東京都",
}

export default function RankingPage() {
  const [targetRankings, setTargetRankings] = useState<TargetRanking[]>([])
  const [nationalRanking, setNationalRanking] = useState<RankingEntry[]>([])
  const [selectedTab, setSelectedTab] = useState<"target" | "national">("target")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // データを読み込み
    const loadRankingData = async () => {
      try {
        // 志望校別ランキングを生成
        const targetData = currentUser.targetUniversities.map((univId) => generateSampleRanking(univId, currentUser.id))
        setTargetRankings(targetData)

        // 全国ランキングを生成
        const nationalData = generateNationalRanking(currentUser.id)
        setNationalRanking(nationalData)
      } catch (error) {
        console.error("ランキングデータの読み込みに失敗:", error)
      } finally {
        setLoading(false)
      }
    }

    loadRankingData()
  }, [])

  const myNationalRank = nationalRanking.find((entry) => entry.userId === currentUser.id)

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold">ランキングを読み込み中...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                小論文AI採点ランキング
              </h1>
              <p className="text-muted-foreground">志望校ライバルとの競争で実力アップ！</p>
            </div>
          </div>
          <Link href="/ranking/target-schools">
            <Button
              variant="outline"
              className="flex items-center gap-2 border-orange-500 text-orange-600 hover:bg-orange-50"
            >
              <Settings className="w-4 h-4" />
              志望校設定
            </Button>
          </Link>
        </div>

        {/* タブ切り替え */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-fit">
          <Button
            variant={selectedTab === "target" ? "default" : "ghost"}
            onClick={() => setSelectedTab("target")}
            className="flex items-center gap-2"
          >
            <Target className="w-4 h-4" />
            マイ・ターゲット
          </Button>
          <Button
            variant={selectedTab === "national" ? "default" : "ghost"}
            onClick={() => setSelectedTab("national")}
            className="flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            全国ランキング
          </Button>
        </div>
      </div>

      {/* マイ・ターゲットランキング */}
      {selectedTab === "target" && (
        <div className="space-y-6">
          {targetRankings.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">志望校を設定してください</h3>
                <p className="text-muted-foreground mb-4">
                  志望校を設定すると、同じ志望校を目指すライバルとのランキングが表示されます。
                </p>
                <Link href="/ranking/target-schools">
                  <Button>志望校を設定する</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            targetRankings.map((ranking, index) => (
              <Card key={ranking.universityId} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-600 rounded-lg">
                        <Medal className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{ranking.universityName}</h3>
                        <p className="text-sm text-muted-foreground">志望者ランキング</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {ranking.totalParticipants}人参加
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {/* 自分の順位（最重要表示） */}
                  <div className="mb-6 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
                          <Crown className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h4 className="text-2xl font-bold text-gray-800">あなたの順位</h4>
                          <p className="text-gray-600">現在のポジション</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-bold text-blue-600">#{ranking.myRank}</div>
                        <div className="text-lg font-semibold text-gray-700">{ranking.myScore}点</div>
                      </div>
                    </div>

                    {/* 目標までの距離 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {ranking.pointsToNext > 0 && (
                        <div className="text-center p-3 bg-white rounded-lg border">
                          <div className="text-sm text-gray-600 mb-1">次の順位まで</div>
                          <div className="text-xl font-bold text-orange-600">あと{ranking.pointsToNext}点</div>
                          <Zap className="w-4 h-4 text-orange-500 mx-auto mt-1" />
                        </div>
                      )}
                      {ranking.pointsToTop10 > 0 && (
                        <div className="text-center p-3 bg-white rounded-lg border">
                          <div className="text-sm text-gray-600 mb-1">TOP10入りまで</div>
                          <div className="text-xl font-bold text-purple-600">あと{ranking.pointsToTop10}点</div>
                          <Star className="w-4 h-4 text-purple-500 mx-auto mt-1" />
                        </div>
                      )}
                      <div className="text-center p-3 bg-white rounded-lg border">
                        <div className="text-sm text-gray-600 mb-1">1位との差</div>
                        <div className="text-xl font-bold text-red-600">{ranking.pointsToTop}点差</div>
                        <Trophy className="w-4 h-4 text-red-500 mx-auto mt-1" />
                      </div>
                    </div>
                  </div>

                  {/* 統計情報 */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">志望者平均点</div>
                      <div className="text-2xl font-bold text-gray-800">{ranking.averageScore}点</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">トップスコア</div>
                      <div className="text-2xl font-bold text-gray-800">{ranking.topScore}点</div>
                    </div>
                  </div>

                  {/* TOP10ランキング */}
                  <div>
                    <h5 className="font-semibold mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-600" />
                      TOP10ランキング
                    </h5>
                    <div className="space-y-2">
                      {ranking.entries.slice(0, 10).map((entry, idx) => (
                        <div
                          key={entry.userId}
                          className={`flex items-center justify-between p-3 rounded-lg border ${
                            entry.userId === currentUser.id ? "bg-blue-50 border-blue-200" : "bg-white hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                idx === 0
                                  ? "bg-yellow-500 text-white"
                                  : idx === 1
                                    ? "bg-gray-400 text-white"
                                    : idx === 2
                                      ? "bg-orange-500 text-white"
                                      : "bg-gray-200 text-gray-700"
                              }`}
                            >
                              {entry.rank}
                            </div>
                            <div>
                              <div className="font-medium">{entry.nickname}</div>
                              {entry.scoreChange !== undefined && (
                                <div className="text-xs text-gray-500">
                                  {formatScoreChange(entry.scoreChange)}
                                  {entry.previousRank && (
                                    <span className="ml-2">{formatRankChange(entry.rank, entry.previousRank)}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg">{entry.totalScore}点</div>
                            <div className="text-xs text-gray-500">{entry.testCount}回受験</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* 全国ランキング */}
      {selectedTab === "national" && (
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">全国ランキング</h3>
                  <p className="text-sm text-muted-foreground">全ユーザー中での順位</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* 自分の全国順位 */}
              {myNationalRank && (
                <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                        <Flame className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-gray-800">全国順位</h4>
                        <p className="text-gray-600">全ユーザー中</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold text-purple-600">#{myNationalRank.rank}</div>
                      <div className="text-lg font-semibold text-gray-700">{myNationalRank.totalScore}点</div>
                      {myNationalRank.scoreChange !== undefined && (
                        <div className="text-sm text-gray-600 mt-1">
                          前回から {formatScoreChange(myNationalRank.scoreChange)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 全国TOP10 + 自分の周辺 */}
              <div>
                <h5 className="font-semibold mb-3 flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-600" />
                  <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    <span>※現在表示されているデータはサンプルです。実際のデータは開発中です。</span>
                  </div>
                  全国TOP10 & あなたの周辺
                </h5>
                <div className="space-y-2">
                  {nationalRanking.map((entry, idx) => (
                    <div
                      key={entry.userId}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        entry.userId === currentUser.id ? "bg-purple-50 border-purple-200" : "bg-white hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            entry.rank === 1
                              ? "bg-yellow-500 text-white"
                              : entry.rank === 2
                                ? "bg-gray-400 text-white"
                                : entry.rank === 3
                                  ? "bg-orange-500 text-white"
                                  : entry.rank <= 10
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {entry.rank}
                        </div>
                        <div>
                          <div className="font-medium">{entry.nickname}</div>
                          {entry.scoreChange !== undefined && (
                            <div className="text-xs text-gray-500">
                              {formatScoreChange(entry.scoreChange)}
                              {entry.previousRank && (
                                <span className="ml-2">{formatRankChange(entry.rank, entry.previousRank)}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{entry.totalScore}点</div>
                        <div className="text-xs text-gray-500">{entry.testCount}回受験</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* アクションボタン */}
      <div className="mt-8 text-center">
        <Link href="/essay-test">
          <Button
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            テストを受けてランクアップ！
          </Button>
        </Link>
      </div>
    </div>
  )
}
