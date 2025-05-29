package database

import (
	"essay-test-backend/internal/domain/entities"
	"essay-test-backend/pkg/config"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func NewMySQLConnection(cfg config.DatabaseConfig) (*gorm.DB, error) {
	dsn := cfg.GetDSN()
	
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return nil, err
	}

	return db, nil
}

func Migrate(db *gorm.DB) error {
	return db.AutoMigrate(
		&entities.EssayTest{},
		&entities.Question{},
		&entities.Submission{},
		&entities.Answer{},
		&entities.ScoringResult{},
		&entities.QuestionScore{},
		&entities.CriteriaScore{},
	)
} 