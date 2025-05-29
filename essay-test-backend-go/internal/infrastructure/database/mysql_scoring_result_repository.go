package database

import (
	"context"
	"time"
	"essay-test-backend/internal/domain/entities"
	"essay-test-backend/internal/domain/repositories"

	"gorm.io/gorm"
)

type mysqlScoringResultRepository struct {
	db *gorm.DB
}

func NewMySQLScoringResultRepository(db *gorm.DB) repositories.ScoringResultRepository {
	return &mysqlScoringResultRepository{db: db}
}

func (r *mysqlScoringResultRepository) Create(ctx context.Context, result *entities.ScoringResult) error {
	return r.db.WithContext(ctx).Create(result).Error
}

func (r *mysqlScoringResultRepository) GetByID(ctx context.Context, id string) (*entities.ScoringResult, error) {
	var result entities.ScoringResult
	err := r.db.WithContext(ctx).
		Preload("Details.CriteriaScores").
		First(&result, "id = ?", id).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	
	// 期限切れチェック
	if time.Now().After(result.ExpiresAt) {
		return nil, nil
	}
	
	return &result, nil
}

func (r *mysqlScoringResultRepository) GetBySubmissionID(ctx context.Context, submissionID string) (*entities.ScoringResult, error) {
	var result entities.ScoringResult
	err := r.db.WithContext(ctx).
		Preload("Details.CriteriaScores").
		First(&result, "submission_id = ?", submissionID).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	
	// 期限切れチェック
	if time.Now().After(result.ExpiresAt) {
		return nil, nil
	}
	
	return &result, nil
}

func (r *mysqlScoringResultRepository) GetAll(ctx context.Context) ([]entities.ScoringResult, error) {
	var results []entities.ScoringResult
	err := r.db.WithContext(ctx).
		Preload("Details.CriteriaScores").
		Where("expires_at > ?", time.Now()).
		Find(&results).Error
	return results, err
}

func (r *mysqlScoringResultRepository) DeleteExpired(ctx context.Context) error {
	return r.db.WithContext(ctx).
		Where("expires_at <= ?", time.Now()).
		Delete(&entities.ScoringResult{}).Error
} 