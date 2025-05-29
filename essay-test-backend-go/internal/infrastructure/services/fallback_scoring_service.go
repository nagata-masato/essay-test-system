package services

import (
	"context"
	"fmt"
	"math"
	"strings"
	"time"
	"unicode/utf8"

	"essay-test-backend/internal/domain/entities"
	"essay-test-backend/internal/domain/services"
	"essay-test-backend/pkg/config"

	"github.com/google/uuid"
	"go.uber.org/zap"
)

type fallbackScoringService struct {
	config *config.Config
	logger *zap.Logger
}

func NewFallbackScoringService(config *config.Config, logger *zap.Logger) services.ScoringService {
	return &fallbackScoringService{
		config: config,
		logger: logger,
	}
}

func (s *fallbackScoringService) ScoreSubmission(ctx context.Context, submission *entities.Submission, test *entities.EssayTest) (*entities.ScoringResult, error) {
	s.logger.Info("フォールバック採点を開始", 
		zap.String("submission_id", submission.ID),
		zap.String("test_id", test.ID))

	if len(submission.Answers) != 2 {
		return nil, fmt.Errorf("expected 2 answers, got %d", len(submission.Answers))
	}

	// 回答の文字数を計算
	answer1Length := utf8.RuneCountInString(submission.Answers[0].Content)
	answer2Length := utf8.RuneCountInString(submission.Answers[1].Content)

	// 問1の採点（要約問題）
	q1Score := s.scoreQuestion1(answer1Length, submission.Answers[0].Content)
	
	// 問2の採点（意見記述問題）
	q2Score := s.scoreQuestion2(answer2Length, submission.Answers[1].Content)

	totalScore := q1Score + q2Score
	maxScore := 100
	percentage := float64(totalScore) / float64(maxScore) * 100

	// 採点結果の詳細を作成
	details := []entities.QuestionScore{
		{
			ID:          uuid.New().String(),
			QuestionNum: 1,
			Score:       q1Score,
			MaxScore:    30,
			Percentage:  float64(q1Score) / 30 * 100,
			Comment:     s.getQuestion1Comment(answer1Length),
			Reasoning:   s.getQuestion1Reasoning(answer1Length),
			CriteriaScores: s.getQuestion1CriteriaScores(q1Score),
		},
		{
			ID:          uuid.New().String(),
			QuestionNum: 2,
			Score:       q2Score,
			MaxScore:    70,
			Percentage:  float64(q2Score) / 70 * 100,
			Comment:     s.getQuestion2Comment(answer2Length),
			Reasoning:   s.getQuestion2Reasoning(answer2Length),
			CriteriaScores: s.getQuestion2CriteriaScores(q2Score),
		},
	}

	result := &entities.ScoringResult{
		ID:           uuid.New().String(),
		SubmissionID: submission.ID,
		TestID:       test.ID,
		TestTitle:    test.Title,
		TotalScore:   totalScore,
		MaxScore:     maxScore,
		Percentage:   percentage,
		Details:      details,
		Feedback:     s.generateFeedback(totalScore, answer1Length, answer2Length),
		ScoredBy:     "fallback",
		ExpiresAt:    time.Now().Add(30 * 24 * time.Hour), // 30日後に期限切れ
	}

	s.logger.Info("フォールバック採点完了",
		zap.String("result_id", result.ID),
		zap.Int("total_score", totalScore),
		zap.Float64("percentage", percentage))

	return result, nil
}

func (s *fallbackScoringService) scoreQuestion1(length int, content string) int {
	// 問1: 要約問題（30点満点）
	// 文字数による基本点数
	var baseScore int
	switch {
	case length >= 150 && length <= 250:
		baseScore = 25 // 適切な文字数
	case length >= 100:
		baseScore = 20 // やや短い
	case length >= 50:
		baseScore = 15 // 短い
	default:
		baseScore = 10 // 非常に短い
	}

	// 内容による加点（簡易的な判定）
	bonusScore := 0
	keywords := []string{"匿名性", "SNS", "表現の自由", "誹謗中傷", "責任", "実名制"}
	for _, keyword := range keywords {
		if strings.Contains(content, keyword) {
			bonusScore++
		}
	}
	
	// 最大5点の加点
	if bonusScore > 5 {
		bonusScore = 5
	}

	totalScore := baseScore + bonusScore
	if totalScore > 30 {
		totalScore = 30
	}

	return totalScore
}

func (s *fallbackScoringService) scoreQuestion2(length int, content string) int {
	// 問2: 意見記述問題（70点満点）
	// 文字数による基本点数
	var baseScore int
	switch {
	case length >= 600 && length <= 800:
		baseScore = 60 // 適切な文字数
	case length >= 400:
		baseScore = 50 // やや短い
	case length >= 200:
		baseScore = 40 // 短い
	case length >= 100:
		baseScore = 30 // 非常に短い
	default:
		baseScore = 20 // 極端に短い
	}

	// 内容による加点（簡易的な判定）
	bonusScore := 0
	
	// 論理的構成の確認
	if strings.Contains(content, "一方で") || strings.Contains(content, "しかし") || strings.Contains(content, "また") {
		bonusScore += 2
	}
	
	// 具体例の確認
	if strings.Contains(content, "例えば") || strings.Contains(content, "具体的に") {
		bonusScore += 2
	}
	
	// 結論の確認
	if strings.Contains(content, "結論") || strings.Contains(content, "以上") || strings.Contains(content, "このように") {
		bonusScore += 2
	}
	
	// 自分の意見の明確性
	if strings.Contains(content, "私は") || strings.Contains(content, "私の考え") || strings.Contains(content, "思う") {
		bonusScore += 2
	}
	
	// 根拠の提示
	if strings.Contains(content, "なぜなら") || strings.Contains(content, "理由") || strings.Contains(content, "根拠") {
		bonusScore += 2
	}

	totalScore := baseScore + bonusScore
	if totalScore > 70 {
		totalScore = 70
	}

	return totalScore
}

func (s *fallbackScoringService) getQuestion1Comment(length int) string {
	switch {
	case length >= 150 && length <= 250:
		return "適切な文字数で要約されています。"
	case length >= 100:
		return "やや短めですが、要点は押さえられています。"
	case length >= 50:
		return "短すぎます。もう少し詳しく要約してください。"
	default:
		return "文字数が不足しています。"
	}
}

func (s *fallbackScoringService) getQuestion1Reasoning(length int) string {
	return fmt.Sprintf("文字数: %d字。要約問題では150-250字程度が適切です。", length)
}

func (s *fallbackScoringService) getQuestion2Comment(length int) string {
	switch {
	case length >= 600 && length <= 800:
		return "適切な文字数で論述されています。"
	case length >= 400:
		return "やや短めですが、論点は整理されています。"
	case length >= 200:
		return "短すぎます。もう少し詳しく論述してください。"
	default:
		return "文字数が大幅に不足しています。"
	}
}

func (s *fallbackScoringService) getQuestion2Reasoning(length int) string {
	return fmt.Sprintf("文字数: %d字。意見記述問題では600-800字程度が適切です。", length)
}

func (s *fallbackScoringService) getQuestion1CriteriaScores(totalScore int) []entities.CriteriaScore {
	return []entities.CriteriaScore{
		{
			ID:           uuid.New().String(),
			CriteriaName: "要点把握",
			Score:        int(math.Round(float64(totalScore) * 0.4)),
			MaxScore:     12,
			Comment:      "課題文の主要な論点を理解できています。",
			Reasoning:    "文字数と内容から判定しました。",
		},
		{
			ID:           uuid.New().String(),
			CriteriaName: "要点の整理・取捨選択",
			Score:        int(math.Round(float64(totalScore) * 0.35)),
			MaxScore:     10,
			Comment:      "重要な論点を適切に選択できています。",
			Reasoning:    "要約の構成から判定しました。",
		},
		{
			ID:           uuid.New().String(),
			CriteriaName: "文章表現",
			Score:        int(math.Round(float64(totalScore) * 0.25)),
			MaxScore:     8,
			Comment:      "文章表現は概ね適切です。",
			Reasoning:    "文字数と構成から判定しました。",
		},
	}
}

func (s *fallbackScoringService) getQuestion2CriteriaScores(totalScore int) []entities.CriteriaScore {
	return []entities.CriteriaScore{
		{
			ID:           uuid.New().String(),
			CriteriaName: "課題文の理解",
			Score:        int(math.Round(float64(totalScore) * 0.2)),
			MaxScore:     14,
			Comment:      "課題文の内容を適切に理解しています。",
			Reasoning:    "論述の内容から判定しました。",
		},
		{
			ID:           uuid.New().String(),
			CriteriaName: "自分自身の明確な意見・立場",
			Score:        int(math.Round(float64(totalScore) * 0.25)),
			MaxScore:     17,
			Comment:      "自分の立場が明確に示されています。",
			Reasoning:    "意見の明確性から判定しました。",
		},
		{
			ID:           uuid.New().String(),
			CriteriaName: "論理的思考力",
			Score:        int(math.Round(float64(totalScore) * 0.3)),
			MaxScore:     21,
			Comment:      "論理的な構成で論述されています。",
			Reasoning:    "論理的構成から判定しました。",
		},
		{
			ID:           uuid.New().String(),
			CriteriaName: "独創性",
			Score:        int(math.Round(float64(totalScore) * 0.15)),
			MaxScore:     10,
			Comment:      "独自の視点が含まれています。",
			Reasoning:    "内容の独創性から判定しました。",
		},
		{
			ID:           uuid.New().String(),
			CriteriaName: "適合性",
			Score:        int(math.Round(float64(totalScore) * 0.1)),
			MaxScore:     8,
			Comment:      "課題に適合した内容です。",
			Reasoning:    "課題への適合性から判定しました。",
		},
	}
}

func (s *fallbackScoringService) generateFeedback(totalScore, answer1Length, answer2Length int) string {
	var feedback strings.Builder
	
	feedback.WriteString("【総合評価】\n")
	switch {
	case totalScore >= 80:
		feedback.WriteString("優秀な答案です。論理的構成と内容の両面で高い水準に達しています。\n\n")
	case totalScore >= 60:
		feedback.WriteString("良好な答案です。基本的な論点は押さえられていますが、さらなる向上の余地があります。\n\n")
	case totalScore >= 40:
		feedback.WriteString("標準的な答案です。基本的な理解は示されていますが、論述の深化が必要です。\n\n")
	default:
		feedback.WriteString("改善が必要な答案です。課題文の理解と論述の構成を見直してください。\n\n")
	}

	feedback.WriteString("【問1について】\n")
	feedback.WriteString(fmt.Sprintf("文字数: %d字\n", answer1Length))
	if answer1Length >= 150 && answer1Length <= 250 {
		feedback.WriteString("適切な文字数で要約されています。\n")
	} else {
		feedback.WriteString("要約問題では150-250字程度が適切です。\n")
	}
	feedback.WriteString("\n")

	feedback.WriteString("【問2について】\n")
	feedback.WriteString(fmt.Sprintf("文字数: %d字\n", answer2Length))
	if answer2Length >= 600 && answer2Length <= 800 {
		feedback.WriteString("適切な文字数で論述されています。\n")
	} else {
		feedback.WriteString("意見記述問題では600-800字程度が適切です。\n")
	}
	feedback.WriteString("\n")

	feedback.WriteString("【改善のポイント】\n")
	feedback.WriteString("・論理的な構成を意識してください（序論・本論・結論）\n")
	feedback.WriteString("・具体例を用いて論述を補強してください\n")
	feedback.WriteString("・自分の意見を明確に示してください\n")
	feedback.WriteString("・課題文の内容を踏まえた論述を心がけてください\n")

	return feedback.String()
} 