# CLAUDE.md

指示が無い限りは常に日本語で回答してください。
指示が無い限りはインデントはスペース4つにしてください。

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.

## 最新のアーキテクチャ（2024年更新）

### 技術スタック
- **フロントエンド**: バニラHTML/CSS/JavaScript（フレームワークなし）
- **バックエンド**: FastAPI + SQLAlchemy + SQLite
- **認証**: JWT（JSON Web Token）
- **外部ライブラリ**: Chart.js（統計グラフ）
- **フォント**: Inter（Google Fonts）

### アプリケーション構成

#### フロントエンドページ
1. **index.html**: メインゲームページ
2. **community.html**: コミュニティチャット・報酬・求人情報
3. **account.html**: ユーザープロフィール・統計・設定
4. **how-to-use.html**: 使い方ガイド

#### JavaScript モジュール（js/）
- **config.js**: ゲーム設定・文章データ・難易度定義
- **api-client.js**: FastAPI通信・認証管理
- **auth.js**: ログイン/新規登録UI管理
- **game-logic.js**: ゲームロジック・音声合成・統計
- **ui-manager.js**: プログレスバー・結果表示
- **main-game.js**: メインゲームクラス
- **community.js**: コミュニティページ機能
- **account.js**: アカウントページ機能・統計グラフ
- **dark-mode.js**: ダークモード切り替え
- **collapsible.js**: 折りたたみUI（未使用）
- **app.js**: アプリケーション初期化

#### CSS スタイル
- **style.css**: メインスタイル（CSS変数・ダークモード対応）
- **community.css**: コミュニティページ専用
- **account.css**: アカウントページ専用

### バックエンドAPI（main.py）

#### データベースモデル
- **User**: ユーザー認証情報
- **UserProfile**: プロフィール・レベル・経験値
- **GameResult**: ゲーム結果・統計
- **CommunityMessage**: チャットメッセージ
- **JobOffer**: 求人情報
- **Reward**: 報酬・実績

#### 主要エンドポイント
```
POST /register - ユーザー登録
POST /login - ログイン
GET /profile - プロフィール取得
POST /game-result - ゲーム結果保存
GET /community/messages - チャットメッセージ取得
POST /community/messages - メッセージ投稿
GET /job-offers - 求人情報取得
GET /rewards - 報酬一覧取得
```

## 主要機能

### 1. ゲームシステム
- **音声タイピングゲーム**: Web Speech API使用
- **難易度別文章**: 初級/中級/上級の3段階
- **ランク判定**: S/A/B/C（スコアと正確率基準）
- **リアルタイム統計**: WPM・正確率・苦手キー分析

### 2. ユーザー管理
- **JWT認証**: ログイン状態管理
- **プロフィールシステム**: レベル・経験値・実績
- **統計追跡**: 過去のゲーム結果・パフォーマンス推移

### 3. コミュニティ機能
- **チャット**: リアルタイムメッセージング
- **報酬システム**: 実績・ボーナス配布
- **求人情報**: 高ランクユーザー向け特別招待

### 4. UI/UX
- **ダークモード**: システム設定連動＋手動切り替え
- **レスポンシブデザイン**: モバイル対応
- **モダンデザイン**: 角丸・グラデーション・アニメーション

## 特記事項

### ダークモード実装
- CSS変数システム使用（`:root`と`[data-theme="dark"]`）
- システム設定自動検出（`prefers-color-scheme`）
- ローカルストレージで設定保存
- 全ページ対応

### 統計システム
- **Chart.js**: WPMと正確率の推移グラフ
- **パフォーマンス分析**: 時系列データ可視化
- **苦手キー特定**: エラー率50%以上のキー表示

### テレビ朝日コラボ企画
- **人材プール**: 高ランクユーザーの採用支援
- **プロ認定**: レベル20以上で認定バッジ
- **特別招待**: Aランク以上で求人アクセス

## 開発履歴

### Geminiによる最新変更（2024年12月）
1. **Inter フォント導入**: Google Fonts経由
2. **Chart.js統合**: 統計グラフ機能追加
3. **UI大幅改善**: コミュニティ・アカウントページリデザイン
4. **カードベースレイアウト**: `.card`クラス統一
5. **レスポンシブ強化**: モバイル表示最適化
6. **アニメーション追加**: ホバーエフェクト・トランジション

### ファイル構成の変更
- アカウントページの統計グラフ機能追加（Chart.js）
- コミュニティページの全面リデザイン
- CSS変数システムによるダークモード完全対応
- 折りたたみ機能削除（ユーザー要望）

### 重要な技術仕様
- **WPM計算**: 日本語ベース（文字/分）
- **経験値システム**: `スコア×10 + WPM×2 + 正確率×3`
- **レベル計算**: `level²×100`の累積経験値
- **ランク条件**: S(90%以上)、A(80%以上)、B(70%以上)、C(未満)

## 開発時の注意点
- **認証状態**: ページ間で一貫したJWT管理
- **API通信**: 非同期処理の適切なエラーハンドリング
- **音声機能**: HTTPS環境でのWeb Speech API制限
- **モバイル対応**: タッチ操作・画面サイズ考慮