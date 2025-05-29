"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Search,
  SortAsc,
  SortDesc,
  Calendar,
  Trophy,
  FileText,
  Users,
  Filter,
  ChevronDown,
  Star,
  BookOpen,
} from "lucide-react"
import Link from "next/link"

// 採点結果の型定義
interface EssayResult {
  id: string
  userId: string
  userName: string
  testId: string
  testTitle: string
  totalScore: number
  rank: string
  submittedAt: string
  category: string
}

// サンプルデータ生成関数
function generateSampleResults(): EssayResult[] {
  const categories = ["社会問題", "科学技術", "環境", "教育", "経済"]
  const testTitles = [
    "SNSの匿名性について",
    "AI技術と社会の未来",
    "環境問題と持続可能な社会",
    "教育格差の解消",
    "グローバル経済の課題",
  ]
  const userNames = ["山田太郎", "佐藤花子", "鈴木一郎", "田中美咲", "高橋健太", "伊藤さくら", "渡辺翔太", "小林明日香"]

  const results: EssayResult[] = []

  // 現在の日時
  const now = new Date()

  // 過去30日分のデータを生成
  for (let i = 0; i < 50; i++) {
    const randomDate = new Date(now)
    randomDate.setDate(now.getDate() - Math.floor(Math.random() * 30))

    const score = Math.floor(Math.random() * 41) + 60 // 60-100点
    let rank
    if (score >= 90) rank = "S"
    else if (score >= 80) rank = "A"
    else if (score >= 70) rank = "B+"
    else if (score >= 60) rank = "B"
    else rank = "C+"

    const categoryIndex = Math.floor(Math.random() * categories.length)
    const titleIndex = Math.floor(Math.random() * testTitles.length)
    const userIndex = Math.floor(Math.random() * userNames.length)

    results.push({
      id: `result-${i}`,
      userId: `user-${userIndex}`,
      userName: userNames[userIndex],
      testId: `test-${titleIndex}`,
      testTitle: testTitles[titleIndex],
      totalScore: score,
      rank,
      submittedAt: randomDate.toISOString(),
      category: categories[categoryIndex],
    })
  }

  return results
}

export default function EssayResultsPage() {
  const [results, setResults] = useState<EssayResult[]>([])
  const [filteredResults, setFilteredResults] = useState<EssayResult[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<"submittedAt" | "totalScore" | "userName">("submittedAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedRank, setSelectedRank] = useState<string | null>(null)

  useEffect(() => {
    // 実際のアプリではAPIからデータを取得
    const fetchResults = async () => {
      try {
        // サンプルデータを生成
        const sampleData = generateSampleResults()
        setResults(sampleData)
        setFilteredResults(sampleData)
      } catch (error) {
        console.error("結果の取得に失敗:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [])

  // 検索とフィルタリングを適用
  useEffect(() => {
    let filtered = [...results]

    // 検索クエリでフィルタリング
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (result) =>
          result.testTitle.toLowerCase().includes(query) ||
          result.userName.toLowerCase().includes(query) ||
          result.category.toLowerCase().includes(query),
      )
    }

    // カテゴリでフィルタリング
    if (selectedCategory) {
      filtered = filtered.filter((result) => result.category === selectedCategory)
    }

    // ランクでフィルタリング
    if (selectedRank) {
      filtered = filtered.filter((result) => result.rank === selectedRank)
    }

    // ソート
    filtered.sort((a, b) => {
      if (sortField === "submittedAt") {
        return sortDirection === "asc"
          ? new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
          : new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      } else if (sortField === "totalScore") {
        return sortDirection === "asc" ? a.totalScore - b.totalScore : b.totalScore - a.totalScore
      } else {
        // userName
        return sortDirection === "asc" ? a.userName.localeCompare(b.userName) : b.userName.localeCompare(a.userName)
      }
    })

    setFilteredResults(filtered)
  }, [results, searchQuery, sortField, sortDirection, selectedCategory, selectedRank])

  // カテゴリの一覧を取得
  const categories = Array.from(new Set(results.map((result) => result.category)))

  // ランクの一覧を取得
  const ranks = Array.from(new Set(results.map((result) => result.rank))).sort((a, b) => {
    const rankOrder = { S: 0, A: 1, "B+": 2, B: 3, "C+": 4, C: 5, D: 6 }
    return rankOrder[a as keyof typeof rankOrder] - rankOrder[b as keyof typeof rankOrder]
  })

  // 日付をフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // ソートボタンのクリックハンドラ
  const handleSort = (field: "submittedAt" | "totalScore" | "userName") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc") // 新しいフィールドでソートする場合はデフォルトで降順
    }
  }

  // ランクに応じた色を取得
  const getRankColor = (rank: string) => {
    switch (rank) {
      case "S":
        return "bg-purple-500 text-white"
      case "A":
        return "bg-blue-500 text-white"
      case "B+":
        return "bg-green-500 text-white"
      case "B":
        return "bg-green-400 text-white"
      case "C+":
        return "bg-yellow-500 text-white"
      case "C":
        return "bg-yellow-400 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold">採点結果を読み込み中...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">小論文採点結果一覧</h1>
            <p className="text-muted-foreground">みんなの小論文採点結果を閲覧できます。優れた回答から学びましょう。</p>
          </div>
        </div>

        {/* 検索とフィルター */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="col-span-full md:col-span-1 lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="テスト名、ユーザー名で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <select
              value={selectedCategory || ""}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">すべてのカテゴリ</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedRank || ""}
              onChange={(e) => setSelectedRank(e.target.value || null)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">すべてのランク</option>
              {ranks.map((rank) => (
                <option key={rank} value={rank}>
                  {rank}ランク
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ソートボタン */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant={sortField === "submittedAt" ? "default" : "outline"}
            size="sm"
            onClick={() => handleSort("submittedAt")}
            className="flex items-center gap-1"
          >
            <Calendar className="w-4 h-4" />
            日付
            {sortField === "submittedAt" && (
              <>{sortDirection === "asc" ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />}</>
            )}
          </Button>

          <Button
            variant={sortField === "totalScore" ? "default" : "outline"}
            size="sm"
            onClick={() => handleSort("totalScore")}
            className="flex items-center gap-1"
          >
            <Trophy className="w-4 h-4" />
            スコア
            {sortField === "totalScore" && (
              <>{sortDirection === "asc" ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />}</>
            )}
          </Button>

          <div className="ml-auto">
            <Badge variant="outline" className="flex items-center gap-1">
              <Filter className="w-3 h-3" />
              {filteredResults.length}件表示
            </Badge>
          </div>
        </div>
      </div>

      {/* 結果一覧 */}
      <div className="space-y-4">
        {filteredResults.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">該当する結果がありません</h3>
            <p className="text-gray-500">検索条件を変更してお試しください</p>
          </div>
        ) : (
          filteredResults.map((result) => (
            <Link href={`/essay-test/result/${result.id}`} key={result.id}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {result.category}
                        </Badge>
                        <Badge className={`text-xs ${getRankColor(result.rank)}`}>{result.rank}ランク</Badge>
                        <span className="text-xs text-gray-500">{formatDate(result.submittedAt)}</span>
                      </div>
                      <h3 className="font-medium text-lg mb-1">{result.testTitle}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{result.userId}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">{result.totalScore}</div>
                        <div className="text-xs text-gray-500">100点満点</div>
                      </div>
                      <ChevronDown className="w-5 h-5 text-gray-400 rotate-270" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>

      {/* 説明 */}
      <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex items-start gap-3">
          <BookOpen className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">小論文採点結果の共有について</h3>
            <p className="text-sm text-blue-800 mb-3">
              このページでは、すべてのユーザーの小論文採点結果を閲覧できます。他の受験者の優れた回答から学び、自分の小論文スキルを向上させましょう。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <Star className="w-4 h-4 text-blue-600 mt-0.5" />
                <span>高評価の回答を参考にして、自分の文章力を磨きましょう</span>
              </div>
              <div className="flex items-start gap-2">
                <Trophy className="w-4 h-4 text-blue-600 mt-0.5" />
                <span>様々なテーマの小論文に挑戦して、総合力を高めましょう</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
