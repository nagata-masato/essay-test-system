package entities

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// EssayTest represents a test configuration
type EssayTest struct {
	ID           string    `json:"id" gorm:"primaryKey;type:varchar(191)"`
	Title        string    `json:"title" gorm:"not null"`
	Description  string    `json:"description"`
	ReadingTime  string    `json:"reading_time"`
	WritingTime  string    `json:"writing_time"`
	TotalPoints  int       `json:"total_points"`
	Difficulty   string    `json:"difficulty"`
	Category     string    `json:"category"`
	Participants int       `json:"participants"`
	EssayText    string    `json:"essay_text" gorm:"type:text"`
	Questions    []Question `json:"questions" gorm:"foreignKey:TestID"`
	ScoringCriteria ScoringCriteria `json:"scoring_criteria" gorm:"embedded"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// Question represents a test question
type Question struct {
	ID              string    `json:"id" gorm:"primaryKey;type:varchar(191)"`
	TestID          string    `json:"test_id" gorm:"type:varchar(191);index"`
	Number          int       `json:"number"`
	Title           string    `json:"title"`
	Description     string    `json:"description"`
	Points          int       `json:"points"`
	CharacterLimit  string    `json:"character_limit"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

// ScoringCriteria represents scoring criteria for a test
type ScoringCriteria struct {
	MainThesis     string   `json:"main_thesis"`
	KeyPoints      []string `json:"key_points" gorm:"serializer:json"`
	Question2Topic string   `json:"question2_topic"`
}

// Submission represents a user's essay submission
type Submission struct {
	ID        string    `json:"id" gorm:"primaryKey;type:varchar(191)"`
	TestID    string    `json:"test_id" gorm:"type:varchar(191);index"`
	UserID    string    `json:"user_id,omitempty" gorm:"type:varchar(191);index"`
	Answers   []Answer  `json:"answers" gorm:"foreignKey:SubmissionID"`
	Status    string    `json:"status"` // pending, scored, failed
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Answer represents an answer to a question
type Answer struct {
	ID           string `json:"id" gorm:"primaryKey;type:varchar(191)"`
	SubmissionID string `json:"submission_id" gorm:"type:varchar(191);index"`
	QuestionID   string `json:"question_id" gorm:"type:varchar(191);index"`
	Content      string `json:"content" gorm:"type:text"`
	WordCount    int    `json:"word_count"`
}

// ScoringResult represents the scoring result
type ScoringResult struct {
	ID           string           `json:"id" gorm:"primaryKey;type:varchar(191)"`
	SubmissionID string           `json:"submission_id" gorm:"type:varchar(191);index"`
	TestID       string           `json:"test_id" gorm:"type:varchar(191);index"`
	TestTitle    string           `json:"test_title"`
	TotalScore   int              `json:"total_score"`
	MaxScore     int              `json:"max_score"`
	Percentage   float64          `json:"percentage"`
	Details      []QuestionScore  `json:"details" gorm:"foreignKey:ResultID"`
	Feedback     string           `json:"feedback" gorm:"type:text"`
	ScoredBy     string           `json:"scored_by"` // ai, fallback
	ExpiresAt    time.Time        `json:"expires_at"`
	CreatedAt    time.Time        `json:"created_at"`
	UpdatedAt    time.Time        `json:"updated_at"`
}

// QuestionScore represents the score for a specific question
type QuestionScore struct {
	ID           string          `json:"id" gorm:"primaryKey;type:varchar(191)"`
	ResultID     string          `json:"result_id" gorm:"type:varchar(191);index"`
	QuestionID   string          `json:"question_id" gorm:"type:varchar(191);index"`
	QuestionNum  int             `json:"question_num"`
	Score        int             `json:"score"`
	MaxScore     int             `json:"max_score"`
	Percentage   float64         `json:"percentage"`
	CriteriaScores []CriteriaScore `json:"criteria_scores" gorm:"foreignKey:QuestionScoreID"`
	Comment      string          `json:"comment" gorm:"type:text"`
	Reasoning    string          `json:"reasoning" gorm:"type:text"`
}

// CriteriaScore represents the score for a specific criteria
type CriteriaScore struct {
	ID               string  `json:"id" gorm:"primaryKey;type:varchar(191)"`
	QuestionScoreID  string  `json:"question_score_id" gorm:"type:varchar(191);index"`
	CriteriaName     string  `json:"criteria_name"`
	Score            int     `json:"score"`
	MaxScore         int     `json:"max_score"`
	Comment          string  `json:"comment"`
	Reasoning        string  `json:"reasoning"`
}

// BeforeCreate hooks for UUID generation
func (e *EssayTest) BeforeCreate(tx *gorm.DB) error {
	if e.ID == "" {
		e.ID = uuid.New().String()
	}
	return nil
}

func (q *Question) BeforeCreate(tx *gorm.DB) error {
	if q.ID == "" {
		q.ID = uuid.New().String()
	}
	return nil
}

func (s *Submission) BeforeCreate(tx *gorm.DB) error {
	if s.ID == "" {
		s.ID = uuid.New().String()
	}
	return nil
}

func (a *Answer) BeforeCreate(tx *gorm.DB) error {
	if a.ID == "" {
		a.ID = uuid.New().String()
	}
	return nil
}

func (sr *ScoringResult) BeforeCreate(tx *gorm.DB) error {
	if sr.ID == "" {
		sr.ID = uuid.New().String()
	}
	return nil
}

func (qs *QuestionScore) BeforeCreate(tx *gorm.DB) error {
	if qs.ID == "" {
		qs.ID = uuid.New().String()
	}
	return nil
}

func (cs *CriteriaScore) BeforeCreate(tx *gorm.DB) error {
	if cs.ID == "" {
		cs.ID = uuid.New().String()
	}
	return nil
} 