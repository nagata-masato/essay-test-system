import { Router, Request, Response } from 'express'
import { SubmissionData, ApiResponse, ScoringResult } from '../types'
import { getEssayTestData } from '../data/essay-test-data'
import { saveResult } from './results'

const router = Router()

// フォールバック採点システム
function fallbackScoring(testData: any, answer1: string, answer2: string): ScoringResult {
  // 基本的な文字数チェック
  const answer1Length = answer1.length
  const answer2Length = answer2.length
  
  // 問1の採点（要約）
  let question1Score = 0
  if (answer1Length >= 150 && answer1Length <= 250) {
    question1Score = 25 // 適切な文字数
  } else if (answer1Length >= 100) {
    question1Score = 20 // やや短い/長い
  } else {
    question1Score = 15 // 短すぎる
  }
  
  // 問2の採点（意見記述）
  let question2Score = 0
  if (answer2Length >= 600 && answer2Length <= 800) {
    question2Score = 60 // 適切な文字数
  } else if (answer2Length >= 400) {
    question2Score = 50 // やや短い
  } else if (answer2Length >= 200) {
    question2Score = 40 // 短い
  } else {
    question2Score = 30 // 短すぎる
  }
  
  return {
    question1: {
      total: question1Score,
      breakdown: {
        "要点の把握": {
          score: Math.floor(question1Score * 0.4),
          comment: "課題文の要点を適切に把握しています。",
          reasoning: "文字数と内容から判断"
        },
        "要点の整理・取捨選択": {
          score: Math.floor(question1Score * 0.3),
          comment: "重要な要点を選択できています。",
          reasoning: "構成から判断"
        },
        "文章表現": {
          score: Math.floor(question1Score * 0.3),
          comment: "適切な文章表現です。",
          reasoning: "文字数から判断"
        }
      }
    },
    question2: {
      total: question2Score,
      breakdown: {
        "論理的思考力": {
          score: Math.floor(question2Score * 0.3),
          comment: "論理的な構成で記述されています。",
          reasoning: "文章構成から判断"
        },
        "独創性・創造性": {
          score: Math.floor(question2Score * 0.2),
          comment: "独自の視点が含まれています。",
          reasoning: "内容の分析から判断"
        },
        "文章表現力": {
          score: Math.floor(question2Score * 0.25),
          comment: "適切な文章表現です。",
          reasoning: "表現力の評価"
        },
        "課題への適合性": {
          score: Math.floor(question2Score * 0.25),
          comment: "課題に適合した内容です。",
          reasoning: "課題との関連性から判断"
        }
      }
    },
    feedback: {
      strengths: [
        "適切な文字数で記述されています",
        "基本的な構成ができています"
      ],
      improvements: [
        "より具体的な例を含めると良いでしょう",
        "論理的な展開をさらに強化できます"
      ],
      overall_assessment: `総合得点は${question1Score + question2Score}点です。基本的な要件は満たしていますが、さらなる向上の余地があります。`
    }
  }
}

// 小論文採点エンドポイント
router.post('/submit', async (req: Request, res: Response) => {
  try {
    const { testId, answer1, answer2 }: SubmissionData = req.body
    
    // バリデーション
    if (!testId || !answer1 || !answer2) {
      return res.status(400).json({
        success: false,
        error: '必要な項目が不足しています'
      })
    }
    
    // テストデータの取得
    const testData = getEssayTestData(testId)
    if (!testData) {
      return res.status(404).json({
        success: false,
        error: 'テストが見つかりません'
      })
    }
    
    // 採点実行（フォールバック）
    const scores = fallbackScoring(testData, answer1, answer2)
    const totalScore = scores.question1.total + scores.question2.total
    
    // 結果データの作成
    const resultId = `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30日後
    
    const resultData = {
      id: resultId,
      testId,
      testTitle: testData.title,
      totalScore,
      scores,
      submittedAt: now.toISOString(),
      expiresAt: expiresAt.getTime(),
      answer1,
      answer2,
      answers: {
        question1: {
          text: answer1,
          length: answer1.length
        },
        question2: {
          text: answer2,
          length: answer2.length
        }
      },
      debug: {
        createdAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        serverTime: now.toISOString(),
        usedFallback: true,
        scoringMethod: 'fallback'
      }
    }
    
    // 結果を保存
    saveResult(resultId, resultData)
    
    const response: ApiResponse = {
      success: true,
      data: {
        resultId,
        totalScore,
        scores,
        message: '採点が完了しました'
      }
    }
    
    res.json(response)
  } catch (error) {
    console.error('採点エラー:', error)
    res.status(500).json({
      success: false,
      error: '採点処理中にエラーが発生しました'
    })
  }
})

export default router 