import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import dotenv from 'dotenv'

// ルートのインポート
import essayTestRoutes from './routes/essay-test'
import scoringRoutes from './routes/scoring'
import resultsRoutes from './routes/results'

// 環境変数の読み込み
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// ミドルウェアの設定
app.use(helmet())
app.use(compression())
app.use(morgan('combined'))

// CORS設定
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// JSON解析
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ヘルスチェックエンドポイント
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// APIルートの設定
app.use('/api/essay-test', essayTestRoutes)
app.use('/api/scoring', scoringRoutes)
app.use('/api/results', resultsRoutes)

// 404エラーハンドリング
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'エンドポイントが見つかりません',
    path: req.originalUrl
  })
})

// エラーハンドリングミドルウェア
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('サーバーエラー:', err)
  
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'サーバー内部エラーが発生しました' 
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  })
})

// サーバー起動
app.listen(PORT, () => {
  console.log(`🚀 小論文テストシステム バックエンドサーバーが起動しました`)
  console.log(`📍 ポート: ${PORT}`)
  console.log(`🌍 環境: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🔗 ヘルスチェック: http://localhost:${PORT}/health`)
})

export default app 