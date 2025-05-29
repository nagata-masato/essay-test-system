package main

import (
	"log"

	"essay-test-backend/internal/application/usecases"
	"essay-test-backend/internal/infrastructure/database"
	"essay-test-backend/internal/infrastructure/services"
	"essay-test-backend/internal/presentation/handlers"
	"essay-test-backend/internal/presentation/routes"
	"essay-test-backend/pkg/config"
	"essay-test-backend/pkg/logger"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

func main() {
	// 設定の読み込み
	cfg, err := config.Load()
	if err != nil {
		log.Fatal("設定の読み込みに失敗:", err)
	}

	// ログの初期化
	zapLogger, err := logger.NewZapLogger(cfg.LogLevel)
	if err != nil {
		log.Fatal("ログの初期化に失敗:", err)
	}
	defer zapLogger.Sync()

	zapLogger.Info("サーバー起動開始", 
		zap.String("environment", cfg.Environment),
		zap.String("port", cfg.Server.Port))

	// データベース接続
	db, err := database.NewMySQLConnection(cfg.Database)
	if err != nil {
		zapLogger.Fatal("データベース接続に失敗", zap.Error(err))
	}

	zapLogger.Info("データベース接続成功")

	// マイグレーション実行
	if err := database.Migrate(db); err != nil {
		zapLogger.Fatal("マイグレーションに失敗", zap.Error(err))
	}

	zapLogger.Info("マイグレーション完了")

	// テストデータのシード
	if err := database.SeedTestData(db); err != nil {
		zapLogger.Fatal("テストデータのシードに失敗", zap.Error(err))
	}

	zapLogger.Info("テストデータのシード完了")

	// リポジトリの初期化
	testRepo := database.NewMySQLEssayTestRepository(db)
	submissionRepo := database.NewMySQLSubmissionRepository(db)
	resultRepo := database.NewMySQLScoringResultRepository(db)

	// サービスの初期化
	scoringService := services.NewFallbackScoringService(cfg, zapLogger)

	// ユースケースの初期化
	testUsecase := usecases.NewEssayTestUsecase(
		testRepo, 
		submissionRepo, 
		resultRepo, 
		scoringService, 
		zapLogger,
	)

	// ハンドラーの初期化
	testHandler := handlers.NewEssayTestHandler(testUsecase, zapLogger)

	// Ginエンジンの設定
	if cfg.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.New()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	// CORS設定
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = cfg.CORS.AllowedOrigins
	corsConfig.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	corsConfig.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}
	corsConfig.AllowCredentials = true
	r.Use(cors.New(corsConfig))

	zapLogger.Info("CORS設定完了", zap.Strings("allowed_origins", cfg.CORS.AllowedOrigins))

	// ルートの設定
	routes.SetupRoutes(r, testHandler)

	zapLogger.Info("ルート設定完了")

	// サーバー起動
	zapLogger.Info("サーバー起動", zap.String("port", cfg.Server.Port))
	if err := r.Run(":" + cfg.Server.Port); err != nil {
		zapLogger.Fatal("サーバー起動に失敗", zap.Error(err))
	}
} 