import { Router, Request, Response } from 'express'
import { ApiResponse } from '../types'

const router = Router()

// 結果データの一時保存（実際のプロダクションではデータベースを使用）
const resultsStore = new Map<string, any>()

// 結果を保存する関数
export function saveResult(resultId: string, resultData: any) {
  resultsStore.set(resultId, resultData)
}

// 結果を取得
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const result = resultsStore.get(id)
    
    if (!result) {
      return res.status(404).json({
        success: false,
        error: '結果が見つかりません'
      })
    }
    
    // 有効期限チェック
    if (result.expiresAt && Date.now() > result.expiresAt) {
      resultsStore.delete(id)
      return res.status(410).json({
        success: false,
        error: '結果の有効期限が切れています'
      })
    }
    
    const response: ApiResponse = {
      success: true,
      data: result
    }
    res.json(response)
  } catch (error) {
    console.error('結果取得エラー:', error)
    res.status(500).json({
      success: false,
      error: '結果の取得に失敗しました'
    })
  }
})

// すべての結果を取得（管理用）
router.get('/', (req: Request, res: Response) => {
  try {
    const allResults = Array.from(resultsStore.values())
    const response: ApiResponse = {
      success: true,
      data: allResults
    }
    res.json(response)
  } catch (error) {
    console.error('結果一覧取得エラー:', error)
    res.status(500).json({
      success: false,
      error: '結果一覧の取得に失敗しました'
    })
  }
})

export default router 