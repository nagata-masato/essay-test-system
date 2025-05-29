"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { School, Search, Target, Check, X, ArrowLeft, Star, TrendingUp } from "lucide-react"
import Link from "next/link"
import { universities } from "@/lib/ranking-data"

// 現在のユーザー情報（実際のアプリではログイン情報から取得）
const currentUser = {
  id: "current-user",
  nickname: "あなた",
  grade: 3,
  targetUniversities: ["tokyo-univ", "waseda-univ"], // 現在の志望校
  prefecture: "東京都",
}

export default function TargetSchoolsPage() {
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>(currentUser.targetUniversities)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all")

  // フィルタリングされた大学リスト
  const filteredUniversities = universities.filter((univ) => {
    const matchesSearch =
      univ.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      univ.shortName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === "all" || univ.category === filterCategory
    const matchesDifficulty = filterDifficulty === "all" || univ.difficulty === filterDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const handleUniversityToggle = (universityId: string) => {
    setSelectedUniversities((prev) => {
      if (prev.includes(universityId)) {
        return prev.filter((id) => id !== universityId)
      } else if (prev.length < 3) {
        return [...prev, universityId]
      } else {
        // 3校制限に達している場合は何もしない
        return prev
      }
    })
  }

  const handleSave = () => {
    // 実際のアプリでは、ここでAPIを呼び出してサーバーに保存
    console.log("志望校を保存:", selectedUniversities)
    // 保存後、ランキングページにリダイレクト
    window.location.href = "/ranking"
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "S":
        return "bg-red-500 text-white"
      case "A":
        return "bg-orange-500 text-white"
      case "B":
        return "bg-yellow-500 text-white"
      case "C":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "国立":
        return "bg-blue-500 text-white"
      case "公立":
        return "bg-green-500 text-white"
      case "私立":
        return "bg-purple-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/ranking">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">志望校設定</h1>
              <p className="text-muted-foreground">最大3校まで選択できます</p>
            </div>
          </div>
        </div>

        {/* 選択状況 */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-blue-900">選択中の志望校</h3>
            <Badge variant="secondary">{selectedUniversities.length}/3校</Badge>
          </div>
          {selectedUniversities.length === 0 ? (
            <p className="text-blue-700 text-sm">まだ志望校が選択されていません</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedUniversities.map((univId) => {
                const univ = universities.find((u) => u.id === univId)
                return univ ? (
                  <Badge key={univId} variant="default" className="flex items-center gap-1">
                    {univ.name}
                    <button
                      onClick={() => handleUniversityToggle(univId)}
                      className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ) : null
              })}
            </div>
          )}
        </div>
      </div>

      {/* 検索・フィルター */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            大学を検索・絞り込み
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 検索ボックス */}
            <div>
              <Input
                placeholder="大学名で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            {/* フィルター */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">設置区分</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="all">すべて</option>
                  <option value="国立">国立</option>
                  <option value="公立">公立</option>
                  <option value="私立">私立</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">難易度</label>
                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="all">すべて</option>
                  <option value="S">S（最難関）</option>
                  <option value="A">A（難関）</option>
                  <option value="B">B（標準）</option>
                  <option value="C">C（基礎）</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 大学リスト */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <School className="w-5 h-5" />
            大学一覧 ({filteredUniversities.length}校)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredUniversities.map((university) => {
              const isSelected = selectedUniversities.includes(university.id)
              const canSelect = selectedUniversities.length < 3 || isSelected

              return (
                <div
                  key={university.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? "border-blue-500 bg-blue-50"
                      : canSelect
                        ? "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        : "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
                  }`}
                  onClick={() => canSelect && handleUniversityToggle(university.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center">
                        <Checkbox checked={isSelected} disabled={!canSelect} className="mr-3" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{university.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getCategoryColor(university.category)} variant="secondary">
                            {university.category}
                          </Badge>
                          <Badge className={getDifficultyColor(university.difficulty)} variant="secondary">
                            難易度{university.difficulty}
                          </Badge>
                          <span className="text-sm text-gray-500">{university.region}</span>
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="flex items-center gap-2 text-blue-600">
                        <Check className="w-5 h-5" />
                        <span className="text-sm font-medium">選択中</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {filteredUniversities.length === 0 && (
            <div className="text-center py-8">
              <School className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">検索条件に一致する大学が見つかりません</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 保存ボタン */}
      <div className="mt-8 flex justify-center">
        <Button
          onClick={handleSave}
          disabled={selectedUniversities.length === 0}
          size="lg"
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
        >
          <Star className="w-5 h-5 mr-2" />
          志望校を保存してランキングを見る
        </Button>
      </div>

      {/* 説明 */}
      <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="flex items-start gap-2">
          <TrendingUp className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-900 mb-1">志望校ランキングについて</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• 同じ志望校を目指すライバルとの順位が表示されます</li>
              <li>• 志望校内での自分のポジションが一目でわかります</li>
              <li>• 次の順位やTOP10入りまでの必要点数が表示されます</li>
              <li>• いつでも志望校の変更が可能です</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
