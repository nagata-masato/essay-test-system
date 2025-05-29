package routes

import (
	"essay-test-backend/internal/presentation/handlers"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine, testHandler *handlers.EssayTestHandler) {
	// ヘルスチェック
	r.GET("/health", testHandler.HealthCheck)

	// API v1 グループ
	v1 := r.Group("/api/v1")
	{
		// テスト関連のルート
		tests := v1.Group("/tests")
		{
			tests.GET("", testHandler.GetAllTests)           // すべてのテスト取得
			tests.GET("/:id", testHandler.GetTestByID)       // 特定のテスト取得
			tests.POST("/:id/submit", testHandler.SubmitEssay) // 小論文提出
		}

		// 結果関連のルート
		results := v1.Group("/results")
		{
			results.GET("/:id", testHandler.GetResult) // 結果取得
		}
	}

	// 既存のAPIとの互換性のためのルート（フロントエンドが移行するまで）
	legacy := r.Group("/api")
	{
		essayTest := legacy.Group("/essay-test")
		{
			essayTest.GET("", testHandler.GetAllTests)
			essayTest.GET("/:id", testHandler.GetTestByID)
			essayTest.POST("/submit", testHandler.SubmitEssay)
		}
		
		legacy.GET("/results/:id", testHandler.GetResult)
	}
} 