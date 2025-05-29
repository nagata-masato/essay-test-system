package repositories

import (
	"context"
	"essay-test-backend/internal/domain/entities"
)

type EssayTestRepository interface {
	GetAll(ctx context.Context) ([]entities.EssayTest, error)
	GetByID(ctx context.Context, id string) (*entities.EssayTest, error)
	Create(ctx context.Context, test *entities.EssayTest) error
	Update(ctx context.Context, test *entities.EssayTest) error
	Delete(ctx context.Context, id string) error
}

type SubmissionRepository interface {
	Create(ctx context.Context, submission *entities.Submission) error
	GetByID(ctx context.Context, id string) (*entities.Submission, error)
	GetByTestID(ctx context.Context, testID string) ([]entities.Submission, error)
	Update(ctx context.Context, submission *entities.Submission) error
}

type ScoringResultRepository interface {
	Create(ctx context.Context, result *entities.ScoringResult) error
	GetByID(ctx context.Context, id string) (*entities.ScoringResult, error)
	GetBySubmissionID(ctx context.Context, submissionID string) (*entities.ScoringResult, error)
	GetAll(ctx context.Context) ([]entities.ScoringResult, error)
	DeleteExpired(ctx context.Context) error
} 