/**
 * ゲームロジック
 * ゲーム状態管理、統計計算、ランク管理など
 */

// ================================
// ゲーム状態管理クラス
// ================================
class GameState {
    constructor() {
        this.reset();
    }

    reset() {
        this.currentSentence = "";
        this.score = 0;
        this.timeLimit = GAME_CONFIG.DEFAULT_TIME_LIMIT;
        this.timeRemaining = this.timeLimit;
        this.currentDifficulty = GAME_CONFIG.DEFAULT_DIFFICULTY;
        this.isGameActive = false;
        this.isGameStarted = false;
        this.timer = null;
        this.sentenceTimer = null;
        this.sentenceTimeLimit = 0;
        this.sentenceTimeRemaining = 0;
    }
}

// ================================
// 統計データ管理クラス
// ================================
class GameStats {
    constructor() {
        this.reset();
    }

    reset() {
        this.totalCharacters = 0;
        this.correctCharacters = 0;
        this.incorrectCharacters = 0;
        this.keystrokes = {};
        this.startTime = null;
        this.endTime = null;
        this.totalAnswers = 0;
        this.correctAnswers = 0;
    }

    analyzeInput(userAnswer, correctAnswer) {
        console.log(`入力分析: ユーザー入力="${userAnswer}", 正解="${correctAnswer}"`);
        
        this.totalAnswers++;
        
        if (userAnswer === correctAnswer) {
            this.correctAnswers++;
            this.correctCharacters += correctAnswer.length;
            this.totalCharacters += correctAnswer.length;
            
            for (const char of correctAnswer) {
                if (!this.keystrokes[char]) {
                    this.keystrokes[char] = { total: 0, errors: 0 };
                }
                this.keystrokes[char].total++;
            }
        } else {
            const maxLength = Math.max(userAnswer.length, correctAnswer.length);
            for (let i = 0; i < maxLength; i++) {
                const userChar = userAnswer[i] || '';
                const correctChar = correctAnswer[i] || '';
                
                if (correctChar) {
                    this.totalCharacters++;
                    if (!this.keystrokes[correctChar]) {
                        this.keystrokes[correctChar] = { total: 0, errors: 0 };
                    }
                    this.keystrokes[correctChar].total++;
                    
                    if (userChar === correctChar) {
                        this.correctCharacters++;
                    } else {
                        this.incorrectCharacters++;
                        this.keystrokes[correctChar].errors++;
                    }
                }
            }
        }
        
        console.log(`分析後の統計: 総文字数=${this.totalCharacters}, 正確文字数=${this.correctCharacters}`);
    }

    calculateWPM() {
        if (!this.startTime || !this.endTime) return 0;
        const timeDiffSeconds = (this.endTime - this.startTime) / 1000;
        if (timeDiffSeconds === 0) return 0;
        
        // 1分間あたりの正確に入力したひらがな文字数を計算
        return Math.round((this.correctCharacters / timeDiffSeconds) * 60);
    }

    calculateAccuracy() {
        if (this.totalCharacters === 0) return 0;
        return Math.round((this.correctCharacters / this.totalCharacters) * 100);
    }

    analyzeWeakKeys() {
        const weakKeys = [];
        console.log("キーストローク分析データ:", this.keystrokes);
        
        for (const [key, data] of Object.entries(this.keystrokes)) {
            if (data.total >= 2 && data.errors >= 1) {
                const errorRate = (data.errors / data.total) * 100;
                console.log(`キー「${key}」: エラー${data.errors}/${data.total} = ${errorRate}%`);
                
                if (errorRate >= 30) {  // 30%以上のエラー率で苦手キーとする
                    weakKeys.push({
                        key: key,
                        errorRate: Math.round(errorRate),
                        errors: data.errors,
                        total: data.total
                    });
                }
            }
        }
        
        console.log("苦手キー一覧:", weakKeys);
        return weakKeys.sort((a, b) => b.errorRate - a.errorRate).slice(0, 8);  // 最大8個まで表示
    }
}

// ================================
// DOM要素管理クラス
// ================================
class DOMElements {
    constructor() {
        this.userInput = document.getElementById("userInput");
        this.resultEl = document.getElementById("result");
        this.scoreEl = document.getElementById("score");
        this.timeRemainingEl = document.getElementById("time-remaining");
        this.startBtn = document.getElementById("startBtn");
        this.speakBtn = document.getElementById("speakBtn");
        this.finalResult = document.getElementById("finalResult");
        this.restartBtn = document.getElementById("restartBtn");
        this.rankBadge = document.getElementById("rank-badge");
        this.rankMessage = document.getElementById("rank-message");
    }
}

// ================================
// 音声管理クラス
// ================================
class SpeechManager {
    static speak(text) {
        console.log("音声読み上げ関数が呼ばれました:", text);
        
        if (!('speechSynthesis' in window)) {
            console.error("このブラウザは音声合成をサポートしていません");
            alert("このブラウザは音声合成をサポートしていません。別のブラウザをお試しください。");
            return;
        }

        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = GAME_CONFIG.SPEECH_LANG;
        utterance.volume = 1.0;
        utterance.rate = GAME_CONFIG.SPEECH_RATE;
        utterance.pitch = 1.0;
        
        utterance.onstart = () => console.log("音声読み上げ開始:", text);
        utterance.onend = () => console.log("音声読み上げ終了");
        utterance.onerror = (event) => {
            console.error("音声合成エラー:", event);
            window.dom.resultEl.textContent = "音声の読み上げでエラーが発生しました。「もう一度聞く」ボタンを押してください。";
        };
        
        window.speechSynthesis.speak(utterance);
        console.log("speechSynthesis.speak() 実行完了");
    }

    static playFeedback(type) {
        const feedbackTexts = {
            correct: "ピンポーン",
            incorrect: "ブッブー",
            timeup: "時間切れです"
        };
        
        if (feedbackTexts[type] && 'speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(feedbackTexts[type]);
            utterance.lang = GAME_CONFIG.SPEECH_LANG;
            utterance.volume = 1.0;
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
        }
    }
}

// ================================
// 文章管理クラス
// ================================
class SentenceManager {
    static getDifficultySentences(difficulty) {
        switch(difficulty) {
            case "easy":
                return sentences.filter(sentence => sentence.length <= 10);
            case "hard":
                return sentences.filter(sentence => sentence.length > 20);
            case "normal":
            default:
                return sentences.filter(sentence => sentence.length > 10 && sentence.length <= 20);
        }
    }

    static getRandomSentence(difficulty) {
        const selectedSentences = this.getDifficultySentences(difficulty);
        return selectedSentences.length > 0 
            ? selectedSentences[Math.floor(Math.random() * selectedSentences.length)]
            : sentences[Math.floor(Math.random() * sentences.length)];
    }

    static calculateTimeLimit(sentence, difficulty) {
        const settings = DIFFICULTY_SETTINGS[difficulty] || DIFFICULTY_SETTINGS.normal;
        return Math.ceil(settings.baseTime + (sentence.length * settings.extraTimePerChar));
    }
}

// ================================
// ランク管理クラス
// ================================
class RankManager {
    static calculateRank(score, timeLimit, difficulty) {
        const averageTimePerCorrect = score > 0 ? timeLimit / score : timeLimit;
        const criteria = RANK_CRITERIA[difficulty] || RANK_CRITERIA.normal;
        
        if (averageTimePerCorrect < criteria.S) return "S";
        if (averageTimePerCorrect < criteria.A) return "A";
        if (averageTimePerCorrect < criteria.B) return "B";
        return "C";
    }

    static getRankMessage(rank) {
        return RANK_MESSAGES[rank] || "";
    }
}