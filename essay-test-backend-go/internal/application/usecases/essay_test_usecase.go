package usecases

import (
	"context"
	"fmt"
	"unicode/utf8"

	"essay-test-backend/internal/application/dto"
	"essay-test-backend/internal/domain/entities"
	"essay-test-backend/internal/domain/repositories"
	"essay-test-backend/internal/domain/services"

	"github.com/google/uuid"
	"go.uber.org/zap"
)

type EssayTestUsecase struct {
	testRepo       repositories.EssayTestRepository
	submissionRepo repositories.SubmissionRepository
	resultRepo     repositories.ScoringResultRepository
	scoringService services.ScoringService
	logger         *zap.Logger
}

func NewEssayTestUsecase(
	testRepo repositories.EssayTestRepository,
	submissionRepo repositories.SubmissionRepository,
	resultRepo repositories.ScoringResultRepository,
	scoringService services.ScoringService,
	logger *zap.Logger,
) *EssayTestUsecase {
	return &EssayTestUsecase{
		testRepo:       testRepo,
		submissionRepo: submissionRepo,
		resultRepo:     resultRepo,
		scoringService: scoringService,
		logger:         logger,
	}
}

func (u *EssayTestUsecase) GetAllTests(ctx context.Context) ([]dto.EssayTestResponse, error) {
	u.logger.Info("すべてのテストを取得中")
	
	tests, err := u.testRepo.GetAll(ctx)
	if err != nil {
		u.logger.Error("テストの取得に失敗", zap.Error(err))
		return nil, fmt.Errorf("failed to get tests: %w", err)
	}

	var response []dto.EssayTestResponse
	for _, test := range tests {
		response = append(response, dto.EssayTestResponse{
			ID:           test.ID,
			Title:        test.Title,
			Description:  test.Description,
			ReadingTime:  test.ReadingTime,
			WritingTime:  test.WritingTime,
			TotalPoints:  test.TotalPoints,
			Difficulty:   test.Difficulty,
			Category:     test.Category,
			Participants: test.Participants,
			Questions:    convertQuestionsToDTO(test.Questions),
		})
	}

	u.logger.Info("テスト取得完了", zap.Int("count", len(response)))
	return response, nil
}

func (u *EssayTestUsecase) GetTestByID(ctx context.Context, id string) (*dto.EssayTestResponse, error) {
	u.logger.Info("テストを取得中", zap.String("test_id", id))
	
	test, err := u.testRepo.GetByID(ctx, id)
	if err != nil {
		u.logger.Error("テストの取得に失敗", zap.Error(err), zap.String("test_id", id))
		return nil, fmt.Errorf("failed to get test: %w", err)
	}

	if test == nil {
		u.logger.Warn("テストが見つかりません", zap.String("test_id", id))
		return nil, fmt.Errorf("test not found")
	}

	response := &dto.EssayTestResponse{
		ID:           test.ID,
		Title:        test.Title,
		Description:  test.Description,
		ReadingTime:  test.ReadingTime,
		WritingTime:  test.WritingTime,
		TotalPoints:  test.TotalPoints,
		Difficulty:   test.Difficulty,
		Category:     test.Category,
		Participants: test.Participants,
		EssayText:    test.EssayText,
		Questions:    convertQuestionsToDTO(test.Questions),
		ScoringCriteria: dto.ScoringCriteriaResponse{
			MainThesis:     test.ScoringCriteria.MainThesis,
			KeyPoints:      test.ScoringCriteria.KeyPoints,
			Question2Topic: test.ScoringCriteria.Question2Topic,
		},
	}

	u.logger.Info("テスト取得完了", zap.String("test_id", id), zap.String("title", test.Title))
	return response, nil
}

func (u *EssayTestUsecase) SubmitEssay(ctx context.Context, req dto.SubmissionRequest) (*dto.SubmissionResponse, error) {
	u.logger.Info("小論文提出開始", 
		zap.String("test_id", req.TestID),
		zap.String("user_id", req.UserID),
		zap.Int("answers_count", len(req.Answers)))

	// テストの存在確認
	test, err := u.testRepo.GetByID(ctx, req.TestID)
	if err != nil {
		u.logger.Error("テストの取得に失敗", zap.Error(err), zap.String("test_id", req.TestID))
		return nil, fmt.Errorf("failed to get test: %w", err)
	}

	if test == nil {
		u.logger.Warn("テストが見つかりません", zap.String("test_id", req.TestID))
		return nil, fmt.Errorf("test not found")
	}

	// 回答数の検証
	if len(req.Answers) != len(test.Questions) {
		u.logger.Error("回答数が不正", 
			zap.Int("expected", len(test.Questions)), 
			zap.Int("actual", len(req.Answers)))
		return nil, fmt.Errorf("expected %d answers, got %d", len(test.Questions), len(req.Answers))
	}

	// 提出データの作成
	submission := &entities.Submission{
		ID:     uuid.New().String(),
		TestID: req.TestID,
		UserID: req.UserID,
		Status: "pending",
	}

	for i, answer := range req.Answers {
		submission.Answers = append(submission.Answers, entities.Answer{
			ID:           uuid.New().String(),
			SubmissionID: submission.ID,
			QuestionID:   answer.QuestionID,
			Content:      answer.Content,
			WordCount:    utf8.RuneCountInString(answer.Content),
		})
		
		u.logger.Debug("回答詳細", 
			zap.Int("question_num", i+1),
			zap.String("question_id", answer.QuestionID),
			zap.Int("word_count", utf8.RuneCountInString(answer.Content)))
	}

	// 提出データの保存
	if err := u.submissionRepo.Create(ctx, submission); err != nil {
		u.logger.Error("提出データの保存に失敗", zap.Error(err))
		return nil, fmt.Errorf("failed to create submission: %w", err)
	}

	u.logger.Info("提出データ保存完了", zap.String("submission_id", submission.ID))

	// 採点の実行
	result, err := u.scoringService.ScoreSubmission(ctx, submission, test)
	if err != nil {
		submission.Status = "failed"
		u.submissionRepo.Update(ctx, submission)
		u.logger.Error("採点に失敗", zap.Error(err), zap.String("submission_id", submission.ID))
		return nil, fmt.Errorf("failed to score submission: %w", err)
	}

	// 結果の保存
	if err := u.resultRepo.Create(ctx, result); err != nil {
		u.logger.Error("結果の保存に失敗", zap.Error(err))
		return nil, fmt.Errorf("failed to save result: %w", err)
	}

	submission.Status = "scored"
	u.submissionRepo.Update(ctx, submission)

	u.logger.Info("採点完了", 
		zap.String("result_id", result.ID),
		zap.Int("total_score", result.TotalScore),
		zap.Float64("percentage", result.Percentage))

	return &dto.SubmissionResponse{
		ResultID:   result.ID,
		TotalScore: result.TotalScore,
		MaxScore:   result.MaxScore,
		Percentage: result.Percentage,
		Message:    "採点が完了しました",
	}, nil
}

func (u *EssayTestUsecase) GetResult(ctx context.Context, resultID string) (*dto.ScoringResultResponse, error) {
	u.logger.Info("結果を取得中", zap.String("result_id", resultID))
	
	result, err := u.resultRepo.GetByID(ctx, resultID)
	if err != nil {
		u.logger.Error("結果の取得に失敗", zap.Error(err), zap.String("result_id", resultID))
		return nil, fmt.Errorf("failed to get result: %w", err)
	}

	if result == nil {
		u.logger.Warn("結果が見つかりません", zap.String("result_id", resultID))
		return nil, fmt.Errorf("result not found")
	}

	response := convertResultToDTO(result)
	u.logger.Info("結果取得完了", 
		zap.String("result_id", resultID),
		zap.String("test_title", result.TestTitle),
		zap.Int("total_score", result.TotalScore))

	return response, nil
}

// Helper functions
func convertQuestionsToDTO(questions []entities.Question) []dto.QuestionResponse {
	var result []dto.QuestionResponse
	for _, q := range questions {
		result = append(result, dto.QuestionResponse{
			ID:             q.ID,
			Number:         q.Number,
			Title:          q.Title,
			Description:    q.Description,
			Points:         q.Points,
			CharacterLimit: q.CharacterLimit,
		})
	}
	return result
}

func convertResultToDTO(result *entities.ScoringResult) *dto.ScoringResultResponse {
	var details []dto.QuestionScoreResponse
	for _, detail := range result.Details {
		var criteriaScores []dto.CriteriaScoreResponse
		for _, cs := range detail.CriteriaScores {
			criteriaScores = append(criteriaScores, dto.CriteriaScoreResponse{
				CriteriaName: cs.CriteriaName,
				Score:        cs.Score,
				MaxScore:     cs.MaxScore,
				Comment:      cs.Comment,
				Reasoning:    cs.Reasoning,
			})
		}

		details = append(details, dto.QuestionScoreResponse{
			QuestionNum:    detail.QuestionNum,
			Score:          detail.Score,
			MaxScore:       detail.MaxScore,
			Percentage:     detail.Percentage,
			CriteriaScores: criteriaScores,
			Comment:        detail.Comment,
			Reasoning:      detail.Reasoning,
		})
	}

	return &dto.ScoringResultResponse{
		ID:         result.ID,
		TestTitle:  result.TestTitle,
		TotalScore: result.TotalScore,
		MaxScore:   result.MaxScore,
		Percentage: result.Percentage,
		Details:    details,
		Feedback:   result.Feedback,
		ScoredBy:   result.ScoredBy,
		CreatedAt:  result.CreatedAt,
		ExpiresAt:  result.ExpiresAt,
	}
} 