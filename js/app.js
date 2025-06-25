/**
 * アプリケーション初期化
 * DOMロード時の初期化とイベントリスナーの設定
 */

// グローバル変数
let game;
let dom;
let apiClient;

// DOMが読み込まれたら初期化
document.addEventListener("DOMContentLoaded", async () => {
    // DOM要素とAPIクライアントを初期化
    dom = new DOMElements();
    apiClient = new APIClient();
    await apiClient.init();
    
    // グローバルからアクセスできるようにする
    window.dom = dom;
    window.apiClient = apiClient;
    
    // ゲームインスタンスを作成
    game = new VoiceTypingGame();
    window.game = game;
    
    // 認証マネージャーを初期化
    window.authManager = new AuthManager();
    await window.authManager.init();
    
    // イベントリスナーの設定
    setupGameEventListeners();
});

// ゲーム関連のイベントリスナー設定
function setupGameEventListeners() {
    if (!dom) return;
    
    // ゲーム開始ボタン
    if (dom.startBtn) {
        dom.startBtn.addEventListener("click", () => game.startGame());
    }
    
    // 再スタートボタン
    if (dom.restartBtn) {
        dom.restartBtn.addEventListener("click", () => game.returnToTitle());
    }
    
    // もう一度聞くボタン
    if (dom.speakBtn) {
        dom.speakBtn.addEventListener("click", () => {
            SpeechManager.speak(game.gameState.currentSentence);
        });
    }
    
    // ユーザー入力フィールド
    if (dom.userInput) {
        dom.userInput.addEventListener("keydown", (e) => {
            console.log("キー入力検出:", e.key, "ゲームアクティブ:", game.gameState.isGameActive);
            
            if (e.key === "Enter" && game.gameState.isGameActive) {
                e.preventDefault();
                const answer = dom.userInput.value.trim();
                console.log("回答送信:", answer, "正解:", game.gameState.currentSentence);
                game.handleAnswer(answer);
            }
        });
    }
}