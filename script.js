/**
 * 音声タイピングゲーム - メインスクリプト
 * 音声で読み上げられた日本語文章をタイピングするゲーム
 */

// ================================
// 定数定義
// ================================
const GAME_CONFIG = {
    DEFAULT_TIME_LIMIT: 60,
    DEFAULT_DIFFICULTY: "normal",
    SPEECH_RATE: 0.9,
    SPEECH_LANG: "ja-JP",
    NEXT_ROUND_DELAY: 2000,
    SPEECH_DELAY: 500,
    AVERAGE_WORDS_PER_SENTENCE: 3
};

const DIFFICULTY_SETTINGS = {
    easy: { baseTime: 12, extraTimePerChar: 0.25 },
    normal: { baseTime: 10, extraTimePerChar: 0.2 },
    hard: { baseTime: 8, extraTimePerChar: 0.167 }
};

const RANK_CRITERIA = {
    easy: { S: 5, A: 8, B: 12 },
    normal: { S: 7, A: 12, B: 18 },
    hard: { S: 10, A: 15, B: 20 }
};

const RANK_MESSAGES = {
    S: "素晴らしい！タイピングの達人ですね！",
    A: "excellent! 素晴らしいタイピング力です！",
    B: "よくできました！もう少し練習を続けましょう！",
    C: "タイピングの基本を身につけましょう。毎日の練習が大切です！"
};

// ================================
// 文章データ
// ================================
const sentences = [
    "宇宙開発に新たな企業が参入",
    "高校生が国際科学賞を受賞",
    "水不足対策で節水呼びかけ",
    "大規模な火災訓練が実施される",
    "スマホ決済の利用者が増加中",
    "歴史的建造物の修復工事始まる",
    "高速道路で長時間の渋滞発生",
    "美術館で特別展が開幕しました",
    "再生可能エネルギーの導入拡大",
    "新たな法律案が衆議院で可決",
    "全国でインフルエンザが流行中",
    "新空港の建設計画が正式決定",
    "大学でAI研究が本格化している",
    "登山客の増加で安全対策強化",
    "海洋プラスチックごみ問題深刻",
    "新作アニメ映画が話題を呼ぶ",
    "農産物の輸出額が過去最高に",
    "オンライン授業が常態化進む",
    "住宅価格の高騰が各地で続く",
    "外国人観光客の受け入れ再開",
    "今日はいい天気ですね",
    "明日は早く起きます",
    "猫がソファで寝ている",
    "宿題を早く終わらせたい",
    "コーヒーを飲みながら音楽を聴く",
    "公園で友達と遊びました",
    "新しい本を買いました",
    "電車の中はとても静かでした",
    "お寿司が食べたいです",
    "日曜日に映画を見に行きます",
    "空には星が輝いている",
    "私は毎朝コーヒーを飲む",
    "彼女は美しい絵を描いた",
    "今日の天気は晴れです",
    "図書館で本を借りました",
    "音楽を聴くのが好きです",
    "海辺で貝殻を集めた",
    "友達と映画を見に行った",
    "美味しいケーキを食べた",
    "電車が遅れて困った",
    "新しいパソコンを買った",
    "彼は英語が上手に話せる",
    "桜の花が風に舞っている",
    "明日は早起きする予定だ",
    "隣の猫がとても可愛い",
    "この問題は難しすぎる",
    "彼女は優しい笑顔をした",
    "窓から富士山が見える",
    "私の趣味は写真撮影です",
    "彼は昨日遅くまで仕事をした",
    "季節の変わり目は体調に気をつけよう",
    "新しいレシピを試してみた",
    "公園でジョギングをする",
    "手紙を書くのは楽しい",
    "彼女は二か国語を話せる",
    "夏は海に行きたいです",
    "彼は数学が得意だった",
    "雨の日は読書が捗る",
    "このカメラはとても高性能だ",
    "子供たちは元気に遊んでいる",
    "冬は雪が降ることがある",
    "コンビニでおにぎりを買った",
    "日本語の勉強は楽しい",
    "彼女は医者になりたかった",
    "この道をまっすぐ行ってください",
    "昨日の夜は良く眠れた",
    "彼は歌が上手だと思う",
    "週末は家族と過ごした",
    "この料理のレシピを教えて",
    "花火大会は夏の風物詩だ",
    "電話番号を忘れてしまった",
    "山登りは健康に良い",
    "彼女は毎日日記を書いている",
    "この問題の解き方を教えて",
    "彼は有名な小説家になった",
    "駅までの道を教えてください",
    "彼女は料理が上手だ",
    "新幹線で東京へ行く",
    "パーティーは楽しかった",
    "彼は親切にしてくれた",
    "この本はとても面白い",
    "明日は雨が降るだろう",
    "彼女は歌手になりたい",
    "夕日がとても綺麗だった",
    "彼は数学の問題を解いた",
    "私たちは一緒に旅行した",
    "この映画は感動的だった",
    "彼女は早く寝る習慣がある",
    "カレーライスを作った",
    "彼は自転車で通勤している",
    "花が美しく咲いている",
    "私は朝食を食べなかった",
    "彼女はピアノが弾ける",
    "この靴はとても履きやすい",
    "彼は毎日ランニングをする",
    "虹がきれいに見えた",
    "時計の電池が切れた",
    "彼女は外国語が得意だ",
    "この問題は解決できる",
    "彼は昨日病院へ行った",
    "私は寿司が好きです",
    "音楽会はとても楽しかった",
    "彼女は早く起きる人だ",
    "この地図を見てください",
    "彼はテニスが得意だ",
    "彼女はケーキを焼いた",
    "私は毎日ブログを書いている",
    "この山は高くて険しい",
    "彼女は静かに座っていた",
    "野球の試合を見に行った",
    "彼は新しい車を買った",
    "私は毎週水泳に行く",
    "この問題は誰も解けない",
    "彼女は明日来ると言った",
    "彼はコーヒーを飲まない",
    "私は夜更かしをした",
    "彼女は優しく微笑んだ",
    "この絵はとても美しい",
    "日本語を勉強しています",
    "明日の予定を確認してください",
    "彼は昨日遅く帰った",
    "私は旅行が好きです",
    "この料理はとても美味しい",
    "彼女は歩くのが速い",
    "彼は友達と遊んでいる",
    "私は海が好きです",
    "雪が静かに降っている",
    "彼女は英語を教えている",
    "彼は昨日早く寝た",
    "私はギターを弾きます"
];

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
// API クライアント
// ================================
class APIClient {
    constructor() {
        this.baseURL = '';  // 同じドメインで動作
        this.token = localStorage.getItem('access_token');
        this.currentUser = null;
        this.init();
    }

    async init() {
        if (this.token) {
            try {
                this.currentUser = await this.getCurrentUser();
            } catch (error) {
                console.log('トークンが無効です:', error);
                this.logout();
            }
        }
    }

    getAuthHeaders() {
        if (!this.token) {
            throw new Error('認証が必要です');
        }
        return {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
        };
    }

    async register(username, password) {
        const response = await fetch(`${this.baseURL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'アカウント作成に失敗しました');
        }

        const data = await response.json();
        this.token = data.access_token;
        localStorage.setItem('access_token', this.token);
        this.currentUser = await this.getCurrentUser();
        return this.currentUser;
    }

    async login(username, password) {
        const response = await fetch(`${this.baseURL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'ログインに失敗しました');
        }

        const data = await response.json();
        this.token = data.access_token;
        localStorage.setItem('access_token', this.token);
        this.currentUser = await this.getCurrentUser();
        return this.currentUser;
    }

    logout() {
        this.token = null;
        this.currentUser = null;
        localStorage.removeItem('access_token');
    }

    async getCurrentUser() {
        const response = await fetch(`${this.baseURL}/api/auth/me`, {
            headers: this.getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('ユーザー情報の取得に失敗しました');
        }

        return await response.json();
    }

    isLoggedIn() {
        return this.token !== null && this.currentUser !== null;
    }

    async submitGameResult(gameResult) {
        const response = await fetch(`${this.baseURL}/api/game/submit-result`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(gameResult)
        });

        if (!response.ok) {
            throw new Error('ゲーム結果の保存に失敗しました');
        }

        return await response.json();
    }

    async getUserStats() {
        const response = await fetch(`${this.baseURL}/api/stats/user`, {
            headers: this.getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('統計データの取得に失敗しました');
        }

        return await response.json();
    }

    async getLeaderboard() {
        const response = await fetch(`${this.baseURL}/api/stats/leaderboard`);

        if (!response.ok) {
            throw new Error('リーダーボードの取得に失敗しました');
        }

        return await response.json();
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
            dom.resultEl.textContent = "音声の読み上げでエラーが発生しました。「もう一度聞く」ボタンを押してください。";
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

// ================================
// UI管理クラス
// ================================
class UIManager {
    static setupProgressBar() {
        const oldProgressContainer = document.querySelector('.progress-container');
        if (oldProgressContainer) {
            oldProgressContainer.remove();
        }
        
        const gameContainer = document.querySelector('.game-container');
        if (!gameContainer) return;

        const h1 = gameContainer.querySelector('h1');
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        progressContainer.innerHTML = '<div id="progress-bar"></div>';
        
        if (h1 && h1.nextSibling) {
            gameContainer.insertBefore(progressContainer, h1.nextSibling);
        } else if (h1) {
            h1.parentNode.insertBefore(progressContainer, h1.nextSibling);
        } else {
            gameContainer.prepend(progressContainer);
        }
        
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            progressBar.style.width = "100%";
            progressBar.style.background = "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)";
            console.log("Progress bar initialized successfully");
        }
    }

    static updateProgressBar(timeRemaining, timeLimit) {
        const progressBar = document.getElementById("progress-bar");
        if (!progressBar) return;

        const percentRemaining = (timeRemaining / timeLimit) * 100;
        progressBar.style.width = `${percentRemaining}%`;
        
        if (percentRemaining <= 20) {
            progressBar.style.background = "linear-gradient(90deg, #dc2626 0%, #ef4444 100%)";
        } else if (percentRemaining <= 50) {
            progressBar.style.background = "linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)";
        } else {
            progressBar.style.background = "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)";
        }
        
        if (dom.timeRemainingEl) {
            dom.timeRemainingEl.textContent = timeRemaining;
        }
    }

    static showResult(stats, score, timeLimit, difficulty) {
        console.log("=== showResult 開始 ===");
        console.log("引数:", { stats, score, timeLimit, difficulty });
        
        const rank = RankManager.calculateRank(score, timeLimit, difficulty);
        console.log("計算されたランク:", rank);
        
        const rankMessage = RankManager.getRankMessage(rank);
        console.log("ランクメッセージ:", rankMessage);
        
        const wpm = stats.calculateWPM();
        console.log("計算されたWPM:", wpm);
        
        const accuracy = stats.calculateAccuracy();
        console.log("計算された正確率:", accuracy);
        
        const weakKeys = stats.analyzeWeakKeys();
        console.log("苦手キー:", weakKeys);

        console.log("ゲーム統計データ:", stats);
        console.log("WPM:", wpm, "正確率:", accuracy, "苦手キー:", weakKeys);

        dom.rankBadge.textContent = rank;
        dom.rankBadge.className = `rank rank-${rank.toLowerCase()}`;
        dom.rankMessage.textContent = rankMessage;

        const correctCountEl = document.getElementById('correct-count');
        const totalCharsEl = document.getElementById('total-chars');
        const wpmDisplayEl = document.getElementById('wpm-display');
        const accuracyDisplayEl = document.getElementById('accuracy-display');

        if (correctCountEl) correctCountEl.textContent = score;
        if (totalCharsEl) totalCharsEl.textContent = stats.totalCharacters;
        if (wpmDisplayEl) wpmDisplayEl.textContent = wpm;
        if (accuracyDisplayEl) accuracyDisplayEl.textContent = accuracy + '%';

        this.displayWeakKeys(weakKeys);
        this.showInvitationIfEligible(rank);
        
        // ログインしている場合、APIに統計を送信（非同期で実行、エラーでも続行）
        if (apiClient && apiClient.isLoggedIn()) {
            const gameResult = {
                score: score,
                wpm: wpm,
                accuracy: accuracy,
                total_characters: stats.totalCharacters,
                correct_characters: stats.correctCharacters,
                rank: rank,
                weak_keys: weakKeys
            };
            
            console.log('統計をAPIに送信中:', gameResult);
            
            // 非同期で送信（UI表示をブロックしない）
            apiClient.submitGameResult(gameResult)
                .then(result => {
                    console.log('統計の保存に成功しました:', result);
                })
                .catch(error => {
                    console.error('統計の保存に失敗しました:', error);
                });
        }
        
        console.log("=== リザルト表示を実行 ===");
        console.log("finalResult 要素:", dom.finalResult);
        
        dom.finalResult.style.display = "flex";
        console.log("finalResult.style.display を flex に設定");
        
        SpeechManager.playFeedback('timeup');
        console.log("=== showResult 完了 ===");
    }

    static displayWeakKeys(weakKeys) {
        const weakKeysSection = document.getElementById('weak-keys-section');
        const weakKeysList = document.getElementById('weak-keys-list');
        
        if (!weakKeysSection || !weakKeysList) return;

        weakKeysList.innerHTML = '';
        
        if (weakKeys.length > 0) {
            weakKeysSection.style.display = 'block';
            weakKeys.forEach(keyData => {
                const keyElement = document.createElement('div');
                keyElement.className = 'weak-key-tag';
                keyElement.textContent = `${keyData.key} (${keyData.errorRate}%)`;
                keyElement.title = `${keyData.errors}/${keyData.total}回のミス`;
                weakKeysList.appendChild(keyElement);
            });
        } else {
            const noWeakKeysMessage = document.createElement('div');
            noWeakKeysMessage.textContent = '苦手キーは見つかりませんでした。素晴らしいタイピングです！';
            noWeakKeysMessage.style.color = '#64748b';
            noWeakKeysMessage.style.fontStyle = 'italic';
            weakKeysList.appendChild(noWeakKeysMessage);
        }
    }

    static showInvitationIfEligible(rank) {
        const existingInvitation = dom.finalResult.querySelector('.invitation-message');
        if (existingInvitation) {
            existingInvitation.remove();
        }
        
        if (rank === "S" || rank === "A") {
            const invitationDiv = document.createElement('div');
            invitationDiv.className = 'invitation-message';
            invitationDiv.innerHTML = `
                <h3>🎊 おめでとうございます！ 🎊</h3>
                <p>あなたの素晴らしいタイピングスキルに感銘を受けました。</p>
                <p>私たちのチームであなたの才能を活かしませんか？</p>
                <p>以下のリンクから、私たちの採用情報をご覧いただけます：</p>
                <a href="https://example.com/join-us" class="invitation-link" target="_blank">採用情報を見る</a>
                <p class="invitation-note">※このオファーは特別なスキルを持つ方だけに表示されています</p>
            `;
            
            const restartButton = dom.finalResult.querySelector('#restartBtn');
            if (restartButton) {
                dom.finalResult.insertBefore(invitationDiv, restartButton);
            } else {
                dom.finalResult.appendChild(invitationDiv);
            }
        }
    }
}

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
        
        dom.scoreEl.textContent = this.gameState.score;
        dom.timeRemainingEl.textContent = this.gameState.timeLimit;
        
        dom.userInput.style.display = "block";
        dom.speakBtn.style.display = "inline-block";
        dom.startBtn.style.display = "none";
        dom.finalResult.style.display = "none";
        
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
        
        dom.resultEl.textContent = "音声を聞いて、文章を入力してください";
        dom.userInput.value = "";
        dom.userInput.disabled = false;
        dom.userInput.focus();
        dom.speakBtn.disabled = false;
        
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
                
                const currentInput = dom.userInput.value.trim();
                this.gameStats.analyzeInput(currentInput, this.gameState.currentSentence);
                
                dom.resultEl.textContent = `⏱ 時間切れ！正解は「${this.gameState.currentSentence}」でした`;
                dom.userInput.disabled = true;
                dom.speakBtn.disabled = true;
                
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
            dom.resultEl.textContent = `✅ 正解！`;
            SpeechManager.playFeedback('correct');
        } else {
            dom.resultEl.textContent = `❌ 不正解です。正解は「${this.gameState.currentSentence}」でした`;
            SpeechManager.playFeedback('incorrect');
        }
        
        dom.scoreEl.textContent = this.gameState.score;
        dom.userInput.disabled = true;
        dom.speakBtn.disabled = true;
        
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
        
        dom.userInput.disabled = true;
        dom.speakBtn.disabled = true;
        
        const progressContainer = document.querySelector('.progress-container');
        if (progressContainer) {
            progressContainer.style.display = 'none';
        }
        
        dom.userInput.style.display = "none";
        dom.speakBtn.style.display = "none";
        dom.startBtn.style.display = "none";
        
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
        dom.scoreEl.textContent = this.gameState.score;
        dom.timeRemainingEl.textContent = this.gameState.timeLimit;
        dom.resultEl.innerHTML = `
            <div style="text-align: center; color: #64748b;">
                ゲーム開始ボタンを押すか、Enterキーを押してゲームを開始してください
            </div>
        `;
        dom.userInput.value = "";
        dom.userInput.style.display = "block";
        dom.userInput.disabled = true;
        
        dom.speakBtn.style.display = "inline-block";
        dom.speakBtn.disabled = true;
        dom.startBtn.style.display = "inline-block";
        dom.finalResult.style.display = "none";
        
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
                if (document.activeElement !== dom.userInput) {
                    e.preventDefault();
                    this.startGame();
                }
            }
        });
    }
}

// ================================
// グローバル変数とイベントリスナー
// ================================
let game;
let dom;
let apiClient;

// DOMが読み込まれたら初期化
document.addEventListener("DOMContentLoaded", async () => {
    dom = new DOMElements();
    apiClient = new APIClient();
    await apiClient.init();
    game = new VoiceTypingGame();
    
    // 認証状態に応じてUIを更新
    updateAuthUI();
    
    // イベントリスナーの設定
    dom.startBtn.addEventListener("click", () => game.startGame());
    dom.restartBtn.addEventListener("click", () => game.returnToTitle());
    dom.speakBtn.addEventListener("click", () => {
        SpeechManager.speak(game.gameState.currentSentence);
    });
    
    dom.userInput.addEventListener("keydown", (e) => {
        console.log("キー入力検出:", e.key, "ゲームアクティブ:", game.gameState.isGameActive);
        
        if (e.key === "Enter" && game.gameState.isGameActive) {
            e.preventDefault();
            const answer = dom.userInput.value.trim();
            console.log("回答送信:", answer, "正解:", game.gameState.currentSentence);
            game.handleAnswer(answer);
        }
    });
    
    // 認証関連のイベントリスナー
    setupAuthEventListeners();
});

// 認証UIの更新
function updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    const userMenu = document.getElementById('userMenu');
    const usernameDisplay = document.getElementById('usernameDisplay');
    
    if (apiClient.isLoggedIn()) {
        loginBtn.style.display = 'none';
        userMenu.style.display = 'flex';
        usernameDisplay.textContent = apiClient.currentUser.username;
    } else {
        loginBtn.style.display = 'block';
        userMenu.style.display = 'none';
    }
}

// 認証状態の管理
let isLoginMode = true;

// 認証イベントリスナーの設定
function setupAuthEventListeners() {
    
    // ログインボタン
    document.getElementById('loginBtn').addEventListener('click', () => {
        document.getElementById('authModal').style.display = 'flex';
        isLoginMode = true;
        updateAuthModal();
    });
    
    // ログアウトボタン
    document.getElementById('logoutBtn').addEventListener('click', () => {
        apiClient.logout();
        updateAuthUI();
    });
    
    // 統計ボタン
    document.querySelector('a[href="#stats"]').addEventListener('click', async (e) => {
        e.preventDefault();
        if (apiClient.isLoggedIn()) {
            await showUserStats();
        } else {
            alert('統計を表示するにはログインが必要です');
        }
    });
    
    // モーダル閉じるボタン
    document.getElementById('closeAuthModal').addEventListener('click', () => {
        document.getElementById('authModal').style.display = 'none';
    });
    
    document.getElementById('closeStatsModal').addEventListener('click', () => {
        document.getElementById('statsModal').style.display = 'none';
    });
    
    // フォーム切り替え
    document.getElementById('authSwitchBtn').addEventListener('click', (e) => {
        e.preventDefault();
        console.log('フォーム切り替えボタンがクリックされました。現在のモード:', isLoginMode ? 'ログイン' : '新規登録');
        isLoginMode = !isLoginMode;
        console.log('切り替え後のモード:', isLoginMode ? 'ログイン' : '新規登録');
        updateAuthModal();
    });
    
    // 認証フォーム送信
    document.getElementById('authForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('authUsername').value;
        const password = document.getElementById('authPassword').value;
        const errorDiv = document.getElementById('authError');
        
        try {
            if (isLoginMode) {
                await apiClient.login(username, password);
            } else {
                await apiClient.register(username, password);
            }
            
            updateAuthUI();
            document.getElementById('authModal').style.display = 'none';
            document.getElementById('authForm').reset();
            errorDiv.style.display = 'none';
            
        } catch (error) {
            errorDiv.textContent = error.message;
            errorDiv.style.display = 'block';
        }
    });
}

// 認証モーダルの更新
function updateAuthModal() {
    console.log('updateAuthModal が呼ばれました。isLoginMode:', isLoginMode);
    
    const title = document.getElementById('authTitle');
    const submitBtn = document.getElementById('authSubmitBtn');
    const switchText = document.getElementById('authSwitchText');
    const switchBtn = document.getElementById('authSwitchBtn');
    
    console.log('DOM要素の取得結果:', { title, submitBtn, switchText, switchBtn });
    
    if (isLoginMode) {
        title.textContent = 'ログイン';
        submitBtn.textContent = 'ログイン';
        switchText.textContent = 'アカウントをお持ちでない方は';
        switchBtn.textContent = '新規登録';
    } else {
        title.textContent = '新規登録';
        submitBtn.textContent = '新規登録';
        switchText.textContent = '既にアカウントをお持ちの方は';
        switchBtn.textContent = 'ログイン';
    }
    
    console.log('モーダル更新完了');
}

// ユーザー統計の表示
async function showUserStats() {
    try {
        const stats = await apiClient.getUserStats();
        
        document.getElementById('totalGamesCount').textContent = stats.total_games;
        document.getElementById('bestWPMCount').textContent = Math.round(stats.best_wpm);
        document.getElementById('bestAccuracyCount').textContent = Math.round(stats.best_accuracy) + '%';
        
        const recentGamesList = document.getElementById('recentGamesList');
        recentGamesList.innerHTML = '';
        
        if (stats.recent_games.length === 0) {
            recentGamesList.innerHTML = '<p style="text-align: center; color: #64748b;">まだゲームをプレイしていません</p>';
        } else {
            stats.recent_games.forEach(game => {
                const gameItem = document.createElement('div');
                gameItem.className = 'game-history-item';
                
                const date = new Date(game.date).toLocaleDateString('ja-JP');
                
                gameItem.innerHTML = `
                    <div class="game-date">${date}</div>
                    <div class="game-stats">
                        <span>スコア: ${game.score}</span>
                        <span>WPM: ${Math.round(game.wpm)}</span>
                        <span>正確率: ${Math.round(game.accuracy)}%</span>
                        <span class="game-rank rank-${game.rank.toLowerCase()}">${game.rank}</span>
                    </div>
                `;
                
                recentGamesList.appendChild(gameItem);
            });
        }
        
        document.getElementById('statsModal').style.display = 'flex';
        
    } catch (error) {
        console.error('統計の取得に失敗しました:', error);
        alert('統計の取得に失敗しました');
    }
}