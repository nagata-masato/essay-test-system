package database

import (
	"context"
	"essay-test-backend/internal/domain/entities"
	"essay-test-backend/internal/domain/repositories"

	"gorm.io/gorm"
)

type mysqlSubmissionRepository struct {
	db *gorm.DB
}

func NewMySQLSubmissionRepository(db *gorm.DB) repositories.SubmissionRepository {
	return &mysqlSubmissionRepository{db: db}
}

func (r *mysqlSubmissionRepository) Create(ctx context.Context, submission *entities.Submission) error {
	return r.db.WithContext(ctx).Create(submission).Error
}

func (r *mysqlSubmissionRepository) GetByID(ctx context.Context, id string) (*entities.Submission, error) {
	var submission entities.Submission
	err := r.db.WithContext(ctx).Preload("Answers").First(&submission, "id = ?", id).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &submission, nil
}

func (r *mysqlSubmissionRepository) GetByTestID(ctx context.Context, testID string) ([]entities.Submission, error) {
	var submissions []entities.Submission
	err := r.db.WithContext(ctx).Preload("Answers").Where("test_id = ?", testID).Find(&submissions).Error
	return submissions, err
}

func (r *mysqlSubmissionRepository) Update(ctx context.Context, submission *entities.Submission) error {
	return r.db.WithContext(ctx).Save(submission).Error
} 