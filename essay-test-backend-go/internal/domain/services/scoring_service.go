package services

import (
	"context"
	"essay-test-backend/internal/domain/entities"
)

type ScoringService interface {
	ScoreSubmission(ctx context.Context, submission *entities.Submission, test *entities.EssayTest) (*entities.ScoringResult, error)
} 