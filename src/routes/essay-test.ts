import { Router } from 'express'
import { getEssayTestData, getAllEssayTests } from '../data/essay-test-data'
import { ApiResponse } from '../types'

const router = Router()

// すべてのテスト一覧を取得
router.get('/', (req, res) => {
  try {
    const tests = getAllEssayTests()
    const response: ApiResponse = {
      success: true,
      data: tests
    }
    res.json(response)
  } catch (error) {
    console.error('テスト一覧取得エラー:', error)
    res.status(500).json({
      success: false,
      error: 'テスト一覧の取得に失敗しました'
    })
  }
})

// 特定のテストデータを取得
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params
    const testData = getEssayTestData(id)
    
    if (!testData) {
      return res.status(404).json({
        success: false,
        error: 'テストが見つかりません'
      })
    }
    
    const response: ApiResponse = {
      success: true,
      data: testData
    }
    res.json(response)
  } catch (error) {
    console.error('テストデータ取得エラー:', error)
    res.status(500).json({
      success: false,
      error: 'テストデータの取得に失敗しました'
    })
  }
})

export default router 