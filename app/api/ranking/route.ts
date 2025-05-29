import { type NextRequest, NextResponse } from "next/server"
import { generateSampleRanking, generateNationalRanking } from "@/lib/ranking-data"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const type = url.searchParams.get("type") // "target" or "national"
    const universityId = url.searchParams.get("universityId")
    const userId = url.searchParams.get("userId") || "current-user"

    console.log("ランキングAPI呼び出し:", { type, universityId, userId })

    if (type === "target") {
      if (!universityId) {
        return NextResponse.json({ error: "universityId is required for target ranking" }, { status: 400 })
      }

      // 志望校別ランキングを取得
      const ranking = generateSampleRanking(universityId, userId)
      return NextResponse.json(ranking)
    } else if (type === "national") {
      // 全国ランキングを取得
      const ranking = generateNationalRanking(userId)
      return NextResponse.json(ranking)
    } else {
      return NextResponse.json(
        {
          error: "Invalid type parameter. Use 'target' or 'national'",
          received: type,
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("ランキング取得エラー:", error)

    // より詳細なエラー情報を返す
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    const errorStack = error instanceof Error ? error.stack : undefined

    console.error("エラー詳細:", { message: errorMessage, stack: errorStack })

    return NextResponse.json(
      {
        error: "ランキングの取得中にエラーが発生しました",
        details: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, targetUniversities } = body

    console.log("志望校保存リクエスト:", { userId, targetUniversities })

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 })
    }

    if (!Array.isArray(targetUniversities)) {
      return NextResponse.json({ error: "targetUniversities must be an array" }, { status: 400 })
    }

    if (targetUniversities.length > 3) {
      return NextResponse.json({ error: "Maximum 3 target universities allowed" }, { status: 400 })
    }

    // 実際のアプリでは、ここでデータベースに志望校情報を保存
    console.log("志望校を保存:", { userId, targetUniversities })

    return NextResponse.json({
      success: true,
      message: "志望校が正常に保存されました",
      targetUniversities,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("志望校保存エラー:", error)

    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    console.error("エラー詳細:", errorMessage)

    return NextResponse.json(
      {
        error: "志望校の保存中にエラーが発生しました",
        details: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
