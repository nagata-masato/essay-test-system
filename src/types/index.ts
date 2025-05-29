// 小論文テストのデータ型定義
export interface EssayTestData {
  id: string
  title: string
  description: string
  readingTime: string
  writingTime: string
  totalPoints: number
  difficulty: string
  category: string
  participants: number
  essayText: string
  question1: {
    title: string
    description: string
    points: number
    characterLimit: string
  }
  question2: {
    title: string
    description: string
    points: number
    characterLimit: string
  }
  scoringCriteria: {
    mainThesis: string
    keyPoints: string[]
    question2Topic: string
  }
}

// 採点結果の型定義
export interface ScoringResult {
  question1: {
    total: number
    breakdown: {
      [key: string]: {
        score: number
        comment: string
        reasoning: string
      }
    }
  }
  question2: {
    total: number
    breakdown: {
      [key: string]: {
        score: number
        comment: string
        reasoning: string
      }
    }
  }
  feedback: {
    strengths: string[]
    improvements: string[]
    overall_assessment: string
  }
}

// 提出データの型定義
export interface SubmissionData {
  testId: string
  testTitle?: string
  answer1: string
  answer2: string
}

// 結果データの型定義
export interface ResultData {
  id: string
  testId: string
  testTitle: string
  totalScore: number
  scores: ScoringResult
  submittedAt: string
  expiresAt: number
  answer1: string
  answer2: string
  answers: {
    question1: {
      text: string
      length: number
    }
    question2: {
      text: string
      length: number
    }
  }
  debug: {
    createdAt: string
    expiresAt: string
    serverTime: string
    usedFallback: boolean
    scoringMethod: string
  }
}

// API レスポンスの型定義
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// エラーレスポンスの型定義
export interface ErrorResponse {
  error: string
  details?: any
  canRetry?: boolean
  fallbackAvailable?: boolean
} 