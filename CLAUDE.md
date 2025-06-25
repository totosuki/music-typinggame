# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

指示が無い限りは常に日本語で回答してください。
指示が無い限りはインデントはスペース4つにしてください。

## アプリケーション概要
音声タイピングゲーム - 音声読み上げされた日本語文章を聞いてタイピングするWebアプリケーション  
**デザイン**: Apple公式サイト風のモダンUI（ダークテーマ、SF Pro Display フォント）

## アーキテクチャ
- **技術スタック**: ピュアHTML/CSS/JavaScript（フレームワーク無し）
- **構成**: 3ファイル構成のシンプルなWebアプリ
  - `index.html`: UIマークアップ（詳細結果表示対応）
  - `script.js`: ゲームロジック（約900行、統計分析機能付き）
  - `style.css`: Appleスタイルデザイン（約400行）

## 主要機能とコンポーネント

### ゲーム機能（script.js）
- **文章管理**: 131の日本語文章を3段階の難易度に分類
  - 初級（easy）: 10文字以下
  - 中級（normal）: 11-20文字  
  - 上級（hard）: 21文字以上
- **音声合成**: Web Speech API使用（日本語対応）
- **タイマー管理**: 全体制限時間 + 文章別制限時間
- **スコアリング**: 正解数ベースのランク判定（S/A/B/C）
- **UI制御**: リアルタイムプログレスバー、結果表示

### UI構成（index.html + style.css）
- **レスポンシブデザイン**: モバイル対応
- **モダンUI**: グラデーション背景、ブラーエフェクト
- **ゲームコントロール**: 時間制限・難易度選択
- **リアルタイム表示**: 進捗バー、残り時間、スコア

### 詳細結果分析機能
- **WPM計算**: Words Per Minute（5文字=1単語換算）
- **正確率計算**: 正確な文字数 ÷ 総入力文字数 × 100
- **苦手キー分析**: エラー率50%以上のキーを特定・表示
- **総合統計**: 正解数、総文字数、入力時間の詳細記録

### 特殊機能
- **特別招待システム**: A以上のランクで採用情報表示
- **キーボードショートカット**: Enter（開始/送信）、Escape（リセット）
- **音声フィードバック**: 正解/不正解/時間切れの音声通知
- **リアルタイム統計**: ゲーム中の入力をリアルタイム分析

## 開発時の注意点
- **ブラウザ対応**: Web Speech API対応ブラウザが必要
- **音声制限**: デバイスや設定により音声合成が制限される可能性
- **セキュリティ**: HTTPSが必要な機能を含む場合あり

## 文章データ構造
```javascript
const sentences = [...]; // 131文章の配列
const easySentences = sentences.filter(sentence => sentence.length <= 10);
const normalSentences = sentences.filter(sentence => sentence.length > 10 && sentence.length <= 20);
const hardSentences = sentences.filter(sentence => sentence.length > 20);
```

## ゲーム状態管理
主要なグローバル変数:
- `isGameActive`: ゲーム進行中フラグ
- `currentSentence`: 現在の問題文
- `score`: 正解数
- `timeRemaining`: 残り時間
- `currentDifficulty`: 選択難易度
- `gameStats`: 統計データオブジェクト
  - `totalCharacters`: 総入力文字数
  - `correctCharacters`: 正確な文字数
  - `keystrokes`: キー別の入力回数と間違い回数
  - `startTime/endTime`: ゲーム開始/終了時刻

## 統計分析システム
```javascript
gameStats = {
    totalCharacters: 0,       // 総入力文字数
    correctCharacters: 0,     // 正確な文字数
    incorrectCharacters: 0,   // 間違った文字数
    keystrokes: {},          // キー別の入力回数と間違い回数
    startTime: null,         // ゲーム開始時刻
    endTime: null,           // ゲーム終了時刻
    totalAnswers: 0,         // 総回答数
    correctAnswers: 0        // 正解数
};
```