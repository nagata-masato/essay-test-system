// ランキングシステムのデータ定義

export interface University {
  id: string
  name: string
  shortName: string
  category: "国立" | "公立" | "私立"
  difficulty: "S" | "A" | "B" | "C"
  region: string
}

export interface UserProfile {
  id: string
  nickname: string
  grade: 1 | 2 | 3 // 高校学年
  targetUniversities: string[] // 志望校ID（最大3校）
  prefecture: string
}

export interface TestScore {
  userId: string
  testId: string
  score: number
  maxScore: number
  rank: string
  submittedAt: string
  testTitle: string
}

export interface RankingEntry {
  userId: string
  nickname: string
  totalScore: number
  testCount: number
  averageScore: number
  rank: number
  previousRank?: number
  scoreChange?: number
  lastTestDate: string
}

export interface TargetRanking {
  universityId: string
  universityName: string
  myRank: number
  totalParticipants: number
  myScore: number
  topScore: number
  averageScore: number
  pointsToNext: number
  pointsToTop10: number
  pointsToTop: number
  entries: RankingEntry[]
}

// サンプル大学データ
export const universities: University[] = [
  {
    id: "tokyo-univ",
    name: "東京大学",
    shortName: "東大",
    category: "国立",
    difficulty: "S",
    region: "関東",
  },
  {
    id: "kyoto-univ",
    name: "京都大学",
    shortName: "京大",
    category: "国立",
    difficulty: "S",
    region: "関西",
  },
  {
    id: "osaka-univ",
    name: "大阪大学",
    shortName: "阪大",
    category: "国立",
    difficulty: "A",
    region: "関西",
  },
  {
    id: "tohoku-univ",
    name: "東北大学",
    shortName: "東北大",
    category: "国立",
    difficulty: "A",
    region: "東北",
  },
  {
    id: "waseda-univ",
    name: "早稲田大学",
    shortName: "早大",
    category: "私立",
    difficulty: "A",
    region: "関東",
  },
  {
    id: "keio-univ",
    name: "慶應義塾大学",
    shortName: "慶大",
    category: "私立",
    difficulty: "A",
    region: "関東",
  },
]

// サンプルユーザーデータ（デモ用）
export const sampleUsers: UserProfile[] = [
  {
    id: "user-1",
    nickname: "受験生A",
    grade: 3,
    targetUniversities: ["tokyo-univ", "waseda-univ", "keio-univ"],
    prefecture: "東京都",
  },
  {
    id: "user-2",
    nickname: "頑張る高校生",
    grade: 2,
    targetUniversities: ["kyoto-univ", "osaka-univ"],
    prefecture: "大阪府",
  },
]

// サンプルランキングデータ生成
export function generateSampleRanking(universityId: string, currentUserId: string): TargetRanking {
  try {
    console.log("ランキング生成開始:", { universityId, currentUserId })

    const university = universities.find((u) => u.id === universityId)
    if (!university) {
      console.error("大学が見つかりません:", universityId)
      // エラーを投げる代わりに、デフォルト値を返す
      return {
        universityId,
        universityName: "不明な大学",
        myRank: 1,
        totalParticipants: 1,
        myScore: 0,
        topScore: 0,
        averageScore: 0,
        pointsToNext: 0,
        pointsToTop10: 0,
        pointsToTop: 0,
        entries: [
          {
            userId: currentUserId,
            nickname: "あなた",
            totalScore: 0,
            testCount: 0,
            averageScore: 0,
            rank: 1,
            lastTestDate: new Date().toISOString(),
          },
        ],
      }
    }

    // サンプルデータ生成
    const entries: RankingEntry[] = []
    const totalParticipants = Math.floor(Math.random() * 200) + 50 // 50-250人

    console.log("参加者数:", totalParticipants)

    for (let i = 0; i < Math.min(totalParticipants, 20); i++) {
      const score = Math.floor(Math.random() * 40) + 60 // 60-100点
      const previousScore = score + Math.floor(Math.random() * 20) - 10 // ±10点の変動

      entries.push({
        userId: i === 0 ? currentUserId : `user-${i}`,
        nickname: i === 0 ? "あなた" : `受験生${String.fromCharCode(65 + i)}`,
        totalScore: score,
        testCount: Math.floor(Math.random() * 5) + 1,
        averageScore: score,
        rank: i + 1,
        previousRank: i + Math.floor(Math.random() * 6) - 2, // ±2の順位変動
        scoreChange: score - previousScore,
        lastTestDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      })
    }

    // スコア順にソート
    entries.sort((a, b) => b.totalScore - a.totalScore)
    entries.forEach((entry, index) => {
      entry.rank = index + 1
    })

    const myEntry = entries.find((e) => e.userId === currentUserId)
    if (!myEntry) {
      console.error("ユーザーエントリが見つかりません:", currentUserId)
      // デフォルトエントリを追加
      const defaultEntry: RankingEntry = {
        userId: currentUserId,
        nickname: "あなた",
        totalScore: 70,
        testCount: 1,
        averageScore: 70,
        rank: entries.length + 1,
        lastTestDate: new Date().toISOString(),
      }
      entries.push(defaultEntry)
      entries.sort((a, b) => b.totalScore - a.totalScore)
      entries.forEach((entry, index) => {
        entry.rank = index + 1
      })
    }

    const finalMyEntry = entries.find((e) => e.userId === currentUserId)!
    const topScore = entries.length > 0 ? entries[0].totalScore : 0
    const averageScore =
      entries.length > 0 ? Math.floor(entries.reduce((sum, e) => sum + e.totalScore, 0) / entries.length) : 0

    // 次の順位までの点数計算
    const nextRankEntry = entries.find((e) => e.rank === finalMyEntry.rank - 1)
    const pointsToNext = nextRankEntry ? Math.max(0, nextRankEntry.totalScore - finalMyEntry.totalScore + 1) : 0

    // TOP10までの点数計算
    const top10Entry = entries.find((e) => e.rank === 10)
    const pointsToTop10 =
      top10Entry && finalMyEntry.rank > 10 ? Math.max(0, top10Entry.totalScore - finalMyEntry.totalScore + 1) : 0

    const result = {
      universityId,
      universityName: university.name,
      myRank: finalMyEntry.rank,
      totalParticipants,
      myScore: finalMyEntry.totalScore,
      topScore,
      averageScore,
      pointsToNext,
      pointsToTop10,
      pointsToTop: Math.max(0, topScore - finalMyEntry.totalScore),
      entries: entries.slice(0, 10), // TOP10のみ表示
    }

    console.log("ランキング生成完了:", result)
    return result
  } catch (error) {
    console.error("ランキング生成エラー:", error)
    // エラーが発生した場合のフォールバック
    return {
      universityId,
      universityName: "エラー",
      myRank: 1,
      totalParticipants: 1,
      myScore: 0,
      topScore: 0,
      averageScore: 0,
      pointsToNext: 0,
      pointsToTop10: 0,
      pointsToTop: 0,
      entries: [
        {
          userId: currentUserId,
          nickname: "あなた",
          totalScore: 0,
          testCount: 0,
          averageScore: 0,
          rank: 1,
          lastTestDate: new Date().toISOString(),
        },
      ],
    }
  }
}

// 全国ランキング生成
export function generateNationalRanking(currentUserId: string): RankingEntry[] {
  try {
    console.log("全国ランキング生成開始:", currentUserId)

    const entries: RankingEntry[] = []
    const totalUsers = 5000 // 全国5000人想定

    // 現在のユーザーのランクを決定（上位20%程度に設定）
    const myRank = Math.floor(Math.random() * 1000) + 500 // 500-1500位程度
    const myScore = Math.floor(Math.random() * 30) + 70 // 70-100点

    // 上位10人 + 自分の前後 + 自分を表示
    for (let i = 1; i <= 10; i++) {
      entries.push({
        userId: `top-user-${i}`,
        nickname: `全国TOP${i}`,
        totalScore: 100 - i + 1,
        testCount: Math.floor(Math.random() * 10) + 5,
        averageScore: 100 - i + 1,
        rank: i,
        scoreChange: Math.floor(Math.random() * 10) - 5,
        lastTestDate: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
      })
    }

    // 自分の前後3人
    for (let i = Math.max(1, myRank - 3); i <= myRank + 3; i++) {
      if (i <= 10) continue // TOP10と重複を避ける

      entries.push({
        userId: i === myRank ? currentUserId : `user-${i}`,
        nickname: i === myRank ? "あなた" : `受験生${i}`,
        totalScore: i === myRank ? myScore : myScore + Math.floor(Math.random() * 10) - 5,
        testCount: Math.floor(Math.random() * 5) + 1,
        averageScore: i === myRank ? myScore : myScore + Math.floor(Math.random() * 10) - 5,
        rank: i,
        previousRank: i + Math.floor(Math.random() * 10) - 5,
        scoreChange: Math.floor(Math.random() * 15) - 5,
        lastTestDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      })
    }

    const result = entries.sort((a, b) => a.rank - b.rank)
    console.log("全国ランキング生成完了:", result.length, "件")
    return result
  } catch (error) {
    console.error("全国ランキング生成エラー:", error)
    // エラーが発生した場合のフォールバック
    return [
      {
        userId: currentUserId,
        nickname: "あなた",
        totalScore: 0,
        testCount: 0,
        averageScore: 0,
        rank: 1,
        lastTestDate: new Date().toISOString(),
      },
    ]
  }
}

// ユーティリティ関数
export function getUniversityById(id: string): University | undefined {
  return universities.find((u) => u.id === id)
}

export function formatScoreChange(change: number): string {
  if (change > 0) return `+${change}点`
  if (change < 0) return `${change}点`
  return "±0点"
}

export function formatRankChange(current: number, previous?: number): string {
  if (!previous) return ""
  const change = previous - current
  if (change > 0) return `↗${change}位UP`
  if (change < 0) return `↘${Math.abs(change)}位DOWN`
  return "→変動なし"
}
