/**
 * アカウントページ JavaScript
 * プロフィール情報と統計データの管理
 */

class AccountManager {
    constructor() {
        this.currentUser = null;
        this.profile = null;
        this.stats = null;
        
        this.init();
    }
    
    async init() {
        // DOM要素の取得
        this.loginRequired = document.getElementById('loginRequired');
        this.accountContent = document.getElementById('accountContent');
        this.loginPromptBtn = document.getElementById('loginPromptBtn');
        
        // イベントリスナーの設定
        this.setupEventListeners();
        
        // 認証状態確認
        await this.checkAuthStatus();
    }
    
    setupEventListeners() {
        // ログイン促進ボタン
        this.loginPromptBtn?.addEventListener('click', () => {
            if (window.authManager) {
                window.authManager.showAuthModal();
            }
        });
        
        // 認証状態変更の監視
        window.addEventListener('authStateChanged', () => {
            this.checkAuthStatus();
        });
    }
    
    async checkAuthStatus() {
        try {
            // APIクライアントの初期化を待つ
            let retryCount = 0;
            const maxRetries = 50; // 5秒間待機
            
            while (!window.apiClient && retryCount < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 100));
                retryCount++;
            }
            
            if (!window.apiClient) {
                console.error('APIクライアントの初期化に失敗しました');
                this.showLoginRequired();
                return;
            }
            
            // APIクライアントの初期化を確実に待つ
            if (!window.apiClient.currentUser && window.apiClient.token) {
                console.log('APIクライアントを再初期化中...');
                await window.apiClient.init();
            }
            
            // ログイン状態をチェック
            if (window.apiClient && window.apiClient.isLoggedIn()) {
                this.currentUser = window.apiClient.currentUser;
                console.log('アカウントページ: ログイン済みユーザー', this.currentUser);
                await this.loadAccountData();
                this.showAccountContent();
            } else {
                console.log('アカウントページ: ログインが必要');
                this.showLoginRequired();
            }
        } catch (error) {
            console.error('認証状態確認エラー:', error);
            this.showLoginRequired();
        }
    }
    
    async loadAccountData() {
        try {
            // 並行してプロフィールと統計データを取得
            const [profile, stats] = await Promise.all([
                window.apiClient.getUserProfile(),
                window.apiClient.getUserStats()
            ]);
            
            this.profile = profile;
            this.stats = stats;
            
            this.updateProfileSection();
            this.updateStatsSection();
            
        } catch (error) {
            console.error('アカウントデータ読み込みエラー:', error);
        }
    }
    
    updateProfileSection() {
        if (!this.profile || !this.currentUser) return;
        
        // プロフィール基本情報
        const profileInitial = document.getElementById('profileInitial');
        const profileUsername = document.getElementById('profileUsername');
        const profileLevel = document.getElementById('profileLevel');
        const profileExp = document.getElementById('profileExp');
        const profileProBadge = document.getElementById('profileProBadge');
        
        if (profileInitial) {
            profileInitial.textContent = this.currentUser.username.charAt(0).toUpperCase();
        }
        
        if (profileUsername) {
            profileUsername.textContent = this.currentUser.username;
        }
        
        if (profileLevel) {
            profileLevel.textContent = `Lv.${this.profile.level}`;
        }
        
        if (profileExp) {
            const nextLevelExp = this.calculateNextLevelExp(this.profile.level);
            const currentLevelExp = this.calculateLevelExp(this.profile.level - 1);
            const progressExp = this.profile.experience_points - currentLevelExp;
            const neededExp = nextLevelExp - currentLevelExp;
            profileExp.textContent = `${progressExp} / ${neededExp} EXP`;
        }
        
        if (profileProBadge && this.profile.is_professional) {
            profileProBadge.style.display = 'inline-block';
        }
        
        // プロフィール統計
        const profileTotalPlayTime = document.getElementById('profileTotalPlayTime');
        const profileBestWPM = document.getElementById('profileBestWPM');
        const profileBestAccuracy = document.getElementById('profileBestAccuracy');
        const profileConsecutiveDays = document.getElementById('profileConsecutiveDays');
        
        if (profileTotalPlayTime) {
            profileTotalPlayTime.textContent = Math.round(this.profile.total_play_time / 60);
        }
        
        if (profileBestWPM) {
            profileBestWPM.textContent = Math.round(this.profile.career_best_wpm);
        }
        
        if (profileBestAccuracy) {
            profileBestAccuracy.textContent = `${Math.round(this.profile.career_best_accuracy)}%`;
        }
        
        if (profileConsecutiveDays) {
            profileConsecutiveDays.textContent = this.profile.consecutive_days;
        }
    }
    
    updateStatsSection() {
        if (!this.stats) return;
        
        // 統計概要
        const totalGames = document.getElementById('totalGames');
        const totalScore = document.getElementById('totalScore');
        const averageWPM = document.getElementById('averageWPM');
        const averageAccuracy = document.getElementById('averageAccuracy');
        
        if (totalGames) {
            totalGames.textContent = this.stats.total_games;
        }
        
        if (totalScore) {
            totalScore.textContent = this.stats.total_score.toLocaleString();
        }
        
        if (averageWPM) {
            averageWPM.textContent = Math.round(this.stats.average_wpm);
        }
        
        if (averageAccuracy) {
            averageAccuracy.textContent = `${Math.round(this.stats.average_accuracy)}%`;
        }
        
        // 最近のゲーム履歴
        this.updateRecentGames();
        this.renderStatsChart();
    }
    
    renderStatsChart() {
        const ctx = document.getElementById('statsChart')?.getContext('2d');
        if (!ctx || !this.stats || !this.stats.recent_games) return;

        if (this.statsChart) {
            this.statsChart.destroy();
        }

        const labels = this.stats.recent_games.map(game => new Date(game.date).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })).reverse();
        const wpmData = this.stats.recent_games.map(game => Math.round(game.wpm)).reverse();
        const accuracyData = this.stats.recent_games.map(game => Math.round(game.accuracy)).reverse();

        this.statsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'WPM (文字/分)',
                        data: wpmData,
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        yAxisID: 'yWPM',
                    },
                    {
                        label: '正確率 (%)',
                        data: accuracyData,
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        yAxisID: 'yAccuracy',
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    yWPM: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'WPM'
                        },
                        beginAtZero: true
                    },
                    yAccuracy: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        min: 0,
                        max: 100,
                        title: {
                            display: true,
                            text: '正確率 (%)'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                    }
                },
                plugins: {
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    }
                }
            }
        });
    }
    
    updateRecentGames() {
        const recentGamesContainer = document.getElementById('recentGamesContainer');
        if (!recentGamesContainer || !this.stats.recent_games) return;
        
        if (this.stats.recent_games.length === 0) {
            recentGamesContainer.innerHTML = '<div class="loading-games">まだゲームをプレイしていません</div>';
            return;
        }
        
        const gamesHtml = this.stats.recent_games.map(game => this.createGameItemHtml(game)).join('');
        recentGamesContainer.innerHTML = gamesHtml;
    }
    
    createGameItemHtml(game) {
        const date = new Date(game.date);
        const dateString = date.toLocaleDateString('ja-JP', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        return `
            <div class="game-item">
                <div class="game-date">${dateString}</div>
                <div class="game-details">
                    <div class="game-stat">
                        <span class="game-stat-value">${game.score}</span>
                        <span class="game-stat-label">スコア</span>
                    </div>
                    <div class="game-stat">
                        <span class="game-stat-value">${Math.round(game.wpm)}</span>
                        <span class="game-stat-label">WPM</span>
                    </div>
                    <div class="game-stat">
                        <span class="game-stat-value">${Math.round(game.accuracy)}%</span>
                        <span class="game-stat-label">正確率</span>
                    </div>
                </div>
                <div class="game-rank rank-${game.rank.toLowerCase()}">${game.rank}</div>
            </div>
        `;
    }
    
    calculateLevelExp(level) {
        return level * level * 100;
    }
    
    calculateNextLevelExp(level) {
        return level * level * 100;
    }
    
    showAccountContent() {
        if (this.loginRequired) {
            this.loginRequired.style.display = 'none';
        }
        if (this.accountContent) {
            this.accountContent.style.display = 'block';
        }
    }
    
    showLoginRequired() {
        if (this.loginRequired) {
            this.loginRequired.style.display = 'block';
        }
        if (this.accountContent) {
            this.accountContent.style.display = 'none';
        }
    }
}

// グローバルに露出
window.AccountManager = AccountManager;

// ページ読み込み完了時に初期化
document.addEventListener('DOMContentLoaded', () => {
    window.accountManager = new AccountManager();
});