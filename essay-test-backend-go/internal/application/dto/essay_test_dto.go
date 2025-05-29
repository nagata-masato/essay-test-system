package dto

import "time"

// Request DTOs
type SubmissionRequest struct {
	TestID  string          `json:"test_id" binding:"required"`
	UserID  string          `json:"user_id,omitempty"`
	Answers []AnswerRequest `json:"answers" binding:"required"`
}

type AnswerRequest struct {
	QuestionID string `json:"question_id" binding:"required"`
	Content    string `json:"content" binding:"required"`
}

// Response DTOs
type EssayTestResponse struct {
	ID           string             `json:"id"`
	Title        string             `json:"title"`
	Description  string             `json:"description"`
	ReadingTime  string             `json:"reading_time"`
	WritingTime  string             `json:"writing_time"`
	TotalPoints  int                `json:"total_points"`
	Difficulty   string             `json:"difficulty"`
	Category     string             `json:"category"`
	Participants int                `json:"participants"`
	EssayText    string             `json:"essay_text,omitempty"`
	Questions    []QuestionResponse `json:"questions"`
	ScoringCriteria ScoringCriteriaResponse `json:"scoring_criteria,omitempty"`
}

type QuestionResponse struct {
	ID             string `json:"id"`
	Number         int    `json:"number"`
	Title          string `json:"title"`
	Description    string `json:"description"`
	Points         int    `json:"points"`
	CharacterLimit string `json:"character_limit"`
}

type ScoringCriteriaResponse struct {
	MainThesis     string   `json:"main_thesis"`
	KeyPoints      []string `json:"key_points"`
	Question2Topic string   `json:"question2_topic"`
}

type SubmissionResponse struct {
	ResultID   string  `json:"result_id"`
	TotalScore int     `json:"total_score"`
	MaxScore   int     `json:"max_score"`
	Percentage float64 `json:"percentage"`
	Message    string  `json:"message"`
}

type ScoringResultResponse struct {
	ID         string                  `json:"id"`
	TestTitle  string                  `json:"test_title"`
	TotalScore int                     `json:"total_score"`
	MaxScore   int                     `json:"max_score"`
	Percentage float64                 `json:"percentage"`
	Details    []QuestionScoreResponse `json:"details"`
	Feedback   string                  `json:"feedback"`
	ScoredBy   string                  `json:"scored_by"`
	CreatedAt  time.Time               `json:"created_at"`
	ExpiresAt  time.Time               `json:"expires_at"`
}

type QuestionScoreResponse struct {
	QuestionNum    int                       `json:"question_num"`
	Score          int                       `json:"score"`
	MaxScore       int                       `json:"max_score"`
	Percentage     float64                   `json:"percentage"`
	CriteriaScores []CriteriaScoreResponse   `json:"criteria_scores"`
	Comment        string                    `json:"comment"`
	Reasoning      string                    `json:"reasoning"`
}

type CriteriaScoreResponse struct {
	CriteriaName string `json:"criteria_name"`
	Score        int    `json:"score"`
	MaxScore     int    `json:"max_score"`
	Comment      string `json:"comment"`
	Reasoning    string `json:"reasoning"`
}

// API Response wrapper
type APIResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
	Message string      `json:"message,omitempty"`
} 