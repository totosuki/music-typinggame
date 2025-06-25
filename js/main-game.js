/**
 * メインゲームクラス
 * ゲームの全体的な流れを管理
 */

// ================================
// メインゲームクラス
// ================================
class VoiceTypingGame {
    constructor() {
        this.gameState = new GameState();
        this.gameStats = new GameStats();
        this.setupEventListeners();
        this.init();
    }

    init() {
        UIManager.setupProgressBar();
        this.returnToTitle();
    }

    startGame() {
        UIManager.setupProgressBar();
        
        this.gameState.reset();
        this.gameStats.reset();
        
        window.dom.scoreEl.textContent = this.gameState.score;
        window.dom.timeRemainingEl.textContent = this.gameState.timeLimit;
        
        window.dom.userInput.style.display = "block";
        window.dom.speakBtn.style.display = "inline-block";
        window.dom.startBtn.style.display = "none";
        window.dom.finalResult.style.display = "none";
        
        const instructionsSection = document.querySelector('.instructions-section');
        if (instructionsSection) {
            instructionsSection.style.display = "none";
        }
        
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            progressBar.style.width = "100%";
            progressBar.style.background = "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)";
        }
        
        this.gameState.isGameStarted = true;
        this.nextRound();
    }

    nextRound() {
        if (this.gameState.timeRemaining <= 0) {
            this.endGame();
            return;
        }
        
        this.gameState.currentSentence = SentenceManager.getRandomSentence(this.gameState.currentDifficulty);
        console.log("次の文章:", this.gameState.currentSentence);
        
        window.dom.resultEl.textContent = "音声を聞いて、文章を入力してください";
        window.dom.userInput.value = "";
        window.dom.userInput.disabled = false;
        window.dom.userInput.focus();
        window.dom.speakBtn.disabled = false;
        
        if (!this.gameState.isGameActive) {
            this.startTimer();
        }
        
        this.startSentenceTimer();
        
        setTimeout(() => {
            SpeechManager.speak(this.gameState.currentSentence);
        }, GAME_CONFIG.SPEECH_DELAY);
    }

    startTimer() {
        if (this.gameState.timer) {
            clearInterval(this.gameState.timer);
        }
        
        this.gameState.isGameActive = true;
        this.gameState.timeRemaining = this.gameState.timeLimit;
        this.gameStats.startTime = new Date();
        UIManager.updateProgressBar(this.gameState.timeRemaining, this.gameState.timeLimit);
        
        this.gameState.timer = setInterval(() => {
            this.gameState.timeRemaining--;
            UIManager.updateProgressBar(this.gameState.timeRemaining, this.gameState.timeLimit);
            
            if (this.gameState.timeRemaining <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    startSentenceTimer() {
        if (this.gameState.sentenceTimer) {
            clearInterval(this.gameState.sentenceTimer);
        }
        
        this.gameState.sentenceTimeLimit = SentenceManager.calculateTimeLimit(
            this.gameState.currentSentence, 
            this.gameState.currentDifficulty
        );
        this.gameState.sentenceTimeRemaining = this.gameState.sentenceTimeLimit;
        
        this.gameState.sentenceTimer = setInterval(() => {
            this.gameState.sentenceTimeRemaining--;
            
            if (this.gameState.sentenceTimeRemaining <= 0) {
                clearInterval(this.gameState.sentenceTimer);
                
                const currentInput = window.dom.userInput.value.trim();
                this.gameStats.analyzeInput(currentInput, this.gameState.currentSentence);
                
                window.dom.resultEl.textContent = `⏱ 時間切れ！正解は「${this.gameState.currentSentence}」でした`;
                window.dom.userInput.disabled = true;
                window.dom.speakBtn.disabled = true;
                
                SpeechManager.playFeedback('incorrect');
                setTimeout(() => this.nextRound(), GAME_CONFIG.NEXT_ROUND_DELAY);
            }
        }, 1000);
    }

    handleAnswer(answer) {
        clearInterval(this.gameState.sentenceTimer);
        
        this.gameStats.analyzeInput(answer, this.gameState.currentSentence);
        
        if (answer === this.gameState.currentSentence) {
            this.gameState.score++;
            window.dom.resultEl.textContent = `✅ 正解！`;
            SpeechManager.playFeedback('correct');
        } else {
            window.dom.resultEl.textContent = `❌ 不正解です。正解は「${this.gameState.currentSentence}」でした`;
            SpeechManager.playFeedback('incorrect');
        }
        
        window.dom.scoreEl.textContent = this.gameState.score;
        window.dom.userInput.disabled = true;
        window.dom.speakBtn.disabled = true;
        
        setTimeout(() => this.nextRound(), GAME_CONFIG.NEXT_ROUND_DELAY);
    }

    endGame() {
        console.log("=== endGame 開始 ===");
        console.log("ゲーム状態:", this.gameState);
        console.log("ゲーム統計:", this.gameStats);
        
        clearInterval(this.gameState.timer);
        clearInterval(this.gameState.sentenceTimer);
        this.gameState.isGameActive = false;
        this.gameStats.endTime = new Date();
        
        window.dom.userInput.disabled = true;
        window.dom.speakBtn.disabled = true;
        
        const progressContainer = document.querySelector('.progress-container');
        if (progressContainer) {
            progressContainer.style.display = 'none';
        }
        
        window.dom.userInput.style.display = "none";
        window.dom.speakBtn.style.display = "none";
        window.dom.startBtn.style.display = "none";
        
        console.log("UIManager.showResult を呼び出します");
        console.log("引数:", {
            stats: this.gameStats,
            score: this.gameState.score,
            timeLimit: this.gameState.timeLimit,
            difficulty: this.gameState.currentDifficulty
        });
        
        UIManager.showResult(
            this.gameStats, 
            this.gameState.score, 
            this.gameState.timeLimit, 
            this.gameState.currentDifficulty
        );
        
        console.log("=== endGame 完了 ===");
    }

    returnToTitle() {
        clearInterval(this.gameState.timer);
        clearInterval(this.gameState.sentenceTimer);
        
        this.gameState.isGameActive = false;
        this.gameState.isGameStarted = false;
        
        this.gameState.score = 0;
        window.dom.scoreEl.textContent = this.gameState.score;
        window.dom.timeRemainingEl.textContent = this.gameState.timeLimit;
        window.dom.resultEl.innerHTML = `
            <div style="text-align: center; color: #64748b;">
                ゲーム開始ボタンを押すか、Enterキーを押してゲームを開始してください
            </div>
        `;
        window.dom.userInput.value = "";
        window.dom.userInput.style.display = "block";
        window.dom.userInput.disabled = true;
        
        window.dom.speakBtn.style.display = "inline-block";
        window.dom.speakBtn.disabled = true;
        window.dom.startBtn.style.display = "inline-block";
        window.dom.finalResult.style.display = "none";
        
        const progressContainer = document.querySelector('.progress-container');
        if (progressContainer) {
            progressContainer.style.display = 'block';
            const progressBar = document.getElementById('progress-bar');
            if (progressBar) {
                progressBar.style.width = "100%";
                progressBar.style.background = "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)";
            }
        }
    }

    setupEventListeners() {
        document.addEventListener("DOMContentLoaded", () => {
            this.init();
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                this.returnToTitle();
                return;
            }
            
            if (e.key === "Enter" && !this.gameState.isGameStarted) {
                if (document.activeElement !== window.dom.userInput) {
                    e.preventDefault();
                    this.startGame();
                }
            }
        });
    }
}