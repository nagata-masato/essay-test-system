# Essay Test Backend (Go/Gin)

小論文テストシステムのバックエンドAPI - Go/Ginベースのクリーンアーキテクチャ実装

## 🏗️ アーキテクチャ

### クリーンアーキテクチャ
```
├── cmd/server/           # アプリケーションエントリーポイント
├── internal/
│   ├── domain/          # ドメイン層
│   │   ├── entities/    # エンティティ
│   │   ├── repositories/ # リポジトリインターフェース
│   │   └── services/    # ドメインサービス
│   ├── application/     # アプリケーション層
│   │   ├── usecases/    # ユースケース
│   │   └── dto/         # データ転送オブジェクト
│   ├── infrastructure/ # インフラストラクチャ層
│   │   ├── database/    # データベース実装
│   │   └── services/    # 外部サービス実装
│   └── presentation/   # プレゼンテーション層
│       ├── handlers/    # HTTPハンドラー
│       └── routes/      # ルート定義
└── pkg/                # 共通パッケージ
    ├── config/         # 設定管理
    └── logger/         # ログ管理
```

## 🚀 技術スタック

### コア技術
- **Go 1.23** - プログラミング言語
- **Gin Web Framework** - HTTPウェブフレームワーク
- **GORM** - ORM（Object-Relational Mapping）
- **MySQL** - データベース

### 主要ライブラリ
- **Zap** - 高性能ログライブラリ
- **Viper** - 設定管理
- **UUID** - UUID生成
- **CORS** - Cross-Origin Resource Sharing

### 開発・運用
- **Docker & Docker Compose** - コンテナ化
- **Adminer** - データベース管理ツール

## 📋 機能

### API エンドポイント

#### テスト関連
- `GET /api/essay-test` - すべてのテスト取得
- `GET /api/essay-test/:id` - 特定のテスト取得
- `POST /api/essay-test/submit` - 小論文提出

#### 結果関連
- `GET /api/results/:id` - 結果取得

#### ヘルスチェック
- `GET /health` - サーバーヘルスチェック

### 採点システム
- **フォールバック採点**: 文字数ベースの基本採点システム
- **詳細な採点基準**: 要点把握、論理的思考力、独創性など
- **結果の永続化**: 30日間の結果保存

## 🛠️ セットアップ

### 前提条件
- Go 1.23以上
- Docker & Docker Compose
- MySQL 8.0

### 1. リポジトリクローン
```bash
git clone <repository-url>
cd essay-test-backend-go
```

### 2. 環境変数設定
```bash
cp env.example .env
# .envファイルを編集して適切な値を設定
```

### 3. 依存関係のインストール
```bash
go mod download
```

### 4. データベース起動（Docker Compose使用）
```bash
docker-compose up -d mysql adminer
```

### 5. アプリケーション起動
```bash
go run cmd/server/main.go
```

または

```bash
docker-compose up -d
```

## 🔧 開発

### ローカル開発
```bash
# データベースのみ起動
docker-compose up -d mysql

# アプリケーションをローカルで起動
go run cmd/server/main.go
```

### ビルド
```bash
go build -o bin/server cmd/server/main.go
```

### テスト
```bash
go test ./...
```

## 📊 データベース

### テーブル構造
- `essay_tests` - テスト情報
- `questions` - 問題情報
- `submissions` - 提出データ
- `answers` - 回答データ
- `scoring_results` - 採点結果
- `question_scores` - 問題別採点結果
- `criteria_scores` - 採点基準別結果

### 初期データ
システム起動時に以下のテストデータが自動投入されます：
- SNSの匿名性について
- AI技術と社会の未来
- 環境問題と持続可能な社会

## 🌐 API仕様

### レスポンス形式
```json
{
  "success": true,
  "data": {},
  "message": "メッセージ",
  "error": "エラーメッセージ"
}
```

### 小論文提出
```json
POST /api/essay-test/submit
{
  "test_id": "sns-anonymity",
  "user_id": "user123",
  "answers": [
    {
      "question_id": "sns-q1",
      "content": "回答内容..."
    },
    {
      "question_id": "sns-q2", 
      "content": "回答内容..."
    }
  ]
}
```

## 🔒 セキュリティ

- CORS設定による適切なオリジン制御
- 入力値検証
- SQLインジェクション対策（GORM使用）
- 構造化ログによる監査証跡

## 📈 監視・ログ

### ログ出力
- 構造化JSON形式
- レベル別ログ（DEBUG, INFO, WARN, ERROR）
- リクエスト/レスポンスの詳細ログ

### ヘルスチェック
```bash
curl http://localhost:5000/health
```

## 🚀 デプロイ

### Docker使用
```bash
docker-compose up -d
```

### 本番環境設定
```bash
export ENVIRONMENT=production
export LOG_LEVEL=info
export DB_HOST=your-production-db-host
# その他の環境変数を設定
```

## 🤝 貢献

1. フォークする
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📝 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 📞 サポート

問題や質問がある場合は、GitHubのIssuesを使用してください。 