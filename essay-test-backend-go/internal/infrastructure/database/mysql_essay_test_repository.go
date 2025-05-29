package database

import (
	"context"
	"essay-test-backend/internal/domain/entities"
	"essay-test-backend/internal/domain/repositories"

	"gorm.io/gorm"
)

type mysqlEssayTestRepository struct {
	db *gorm.DB
}

func NewMySQLEssayTestRepository(db *gorm.DB) repositories.EssayTestRepository {
	return &mysqlEssayTestRepository{db: db}
}

func (r *mysqlEssayTestRepository) GetAll(ctx context.Context) ([]entities.EssayTest, error) {
	var tests []entities.EssayTest
	err := r.db.WithContext(ctx).Preload("Questions").Find(&tests).Error
	return tests, err
}

func (r *mysqlEssayTestRepository) GetByID(ctx context.Context, id string) (*entities.EssayTest, error) {
	var test entities.EssayTest
	err := r.db.WithContext(ctx).Preload("Questions").First(&test, "id = ?", id).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &test, nil
}

func (r *mysqlEssayTestRepository) Create(ctx context.Context, test *entities.EssayTest) error {
	return r.db.WithContext(ctx).Create(test).Error
}

func (r *mysqlEssayTestRepository) Update(ctx context.Context, test *entities.EssayTest) error {
	return r.db.WithContext(ctx).Save(test).Error
}

func (r *mysqlEssayTestRepository) Delete(ctx context.Context, id string) error {
	return r.db.WithContext(ctx).Delete(&entities.EssayTest{}, "id = ?", id).Error
} 