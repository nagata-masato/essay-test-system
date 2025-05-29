package handlers

import (
	"net/http"

	"essay-test-backend/internal/application/dto"
	"essay-test-backend/internal/application/usecases"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

type EssayTestHandler struct {
	usecase *usecases.EssayTestUsecase
	logger  *zap.Logger
}

func NewEssayTestHandler(usecase *usecases.EssayTestUsecase, logger *zap.Logger) *EssayTestHandler {
	return &EssayTestHandler{
		usecase: usecase,
		logger:  logger,
	}
}

func (h *EssayTestHandler) GetAllTests(c *gin.Context) {
	h.logger.Info("すべてのテスト取得リクエスト")
	
	tests, err := h.usecase.GetAllTests(c.Request.Context())
	if err != nil {
		h.logger.Error("テストの取得に失敗", zap.Error(err))
		c.JSON(http.StatusInternalServerError, dto.APIResponse{
			Success: false,
			Error:   "テストの取得に失敗しました",
		})
		return
	}

	h.logger.Info("テスト取得成功", zap.Int("count", len(tests)))
	c.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Data:    tests,
	})
}

func (h *EssayTestHandler) GetTestByID(c *gin.Context) {
	id := c.Param("id")
	h.logger.Info("テスト取得リクエスト", zap.String("test_id", id))
	
	test, err := h.usecase.GetTestByID(c.Request.Context(), id)
	if err != nil {
		h.logger.Error("テストの取得に失敗", zap.Error(err), zap.String("test_id", id))
		
		if err.Error() == "test not found" {
			c.JSON(http.StatusNotFound, dto.APIResponse{
				Success: false,
				Error:   "指定されたテストが見つかりません",
			})
		} else {
			c.JSON(http.StatusInternalServerError, dto.APIResponse{
				Success: false,
				Error:   "テストの取得に失敗しました",
			})
		}
		return
	}

	h.logger.Info("テスト取得成功", zap.String("test_id", id), zap.String("title", test.Title))
	c.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Data:    test,
	})
}

func (h *EssayTestHandler) SubmitEssay(c *gin.Context) {
	var req dto.SubmissionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.logger.Error("リクエストの解析に失敗", zap.Error(err))
		c.JSON(http.StatusBadRequest, dto.APIResponse{
			Success: false,
			Error:   "リクエストが無効です",
		})
		return
	}

	h.logger.Info("小論文提出リクエスト", 
		zap.String("test_id", req.TestID),
		zap.String("user_id", req.UserID),
		zap.Int("answers_count", len(req.Answers)))

	result, err := h.usecase.SubmitEssay(c.Request.Context(), req)
	if err != nil {
		h.logger.Error("小論文の提出に失敗", zap.Error(err))
		
		if err.Error() == "test not found" {
			c.JSON(http.StatusNotFound, dto.APIResponse{
				Success: false,
				Error:   "指定されたテストが見つかりません",
			})
		} else {
			c.JSON(http.StatusInternalServerError, dto.APIResponse{
				Success: false,
				Error:   "小論文の提出に失敗しました",
			})
		}
		return
	}

	h.logger.Info("小論文提出成功", 
		zap.String("result_id", result.ResultID),
		zap.Int("total_score", result.TotalScore))
	
	c.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Data:    result,
		Message: "小論文が正常に提出されました",
	})
}

func (h *EssayTestHandler) GetResult(c *gin.Context) {
	resultID := c.Param("id")
	h.logger.Info("結果取得リクエスト", zap.String("result_id", resultID))
	
	result, err := h.usecase.GetResult(c.Request.Context(), resultID)
	if err != nil {
		h.logger.Error("結果の取得に失敗", zap.Error(err), zap.String("result_id", resultID))
		
		if err.Error() == "result not found" {
			c.JSON(http.StatusNotFound, dto.APIResponse{
				Success: false,
				Error:   "結果が見つかりません",
			})
		} else {
			c.JSON(http.StatusInternalServerError, dto.APIResponse{
				Success: false,
				Error:   "結果の取得に失敗しました",
			})
		}
		return
	}

	h.logger.Info("結果取得成功", 
		zap.String("result_id", resultID),
		zap.String("test_title", result.TestTitle))
	
	c.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Data:    result,
	})
}

func (h *EssayTestHandler) HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Message: "サーバーは正常に動作しています",
		Data: gin.H{
			"status": "healthy",
			"service": "essay-test-backend",
		},
	})
} 