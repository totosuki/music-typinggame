/**
 * 認証機能
 * ログイン・新規登録・ユーザー管理
 */

// 認証状態の管理
let isLoginMode = true;

// 認証UIの更新
async function updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    const userMenu = document.getElementById('userMenu');
    const usernameDisplay = document.getElementById('usernameDisplay');
    
    if (!loginBtn || !userMenu || !usernameDisplay) {
        return; // 要素が存在しない場合は何もしない（使い方ページなど）
    }
    
    if (window.apiClient && window.apiClient.isLoggedIn()) {
        loginBtn.style.display = 'none';
        userMenu.style.display = 'flex';
        usernameDisplay.textContent = window.apiClient.currentUser.username;
        
        // レベル情報を取得して表示
        try {
            const profile = await window.apiClient.getUserProfile();
            updateLevelDisplay(profile);
        } catch (error) {
            console.log('プロフィール取得エラー:', error);
        }
    } else {
        loginBtn.style.display = 'block';
        userMenu.style.display = 'none';
        clearLevelDisplay();
    }
}

// レベル表示を更新
function updateLevelDisplay(profile) {
    // 既存のレベル表示要素があれば更新、なければ作成
    let levelDisplay = document.getElementById('userLevelDisplay');
    
    if (!levelDisplay) {
        // レベル表示要素を作成
        levelDisplay = document.createElement('span');
        levelDisplay.id = 'userLevelDisplay';
        levelDisplay.className = 'user-level-display';
        
        // ユーザー名の隣に挿入
        const usernameDisplay = document.getElementById('usernameDisplay');
        if (usernameDisplay && usernameDisplay.parentNode) {
            usernameDisplay.parentNode.insertBefore(levelDisplay, usernameDisplay.nextSibling);
        }
    }
    
    levelDisplay.textContent = `Lv.${profile.level}`;
    levelDisplay.style.display = 'inline-block';
}

// レベル表示をクリア
function clearLevelDisplay() {
    const levelDisplay = document.getElementById('userLevelDisplay');
    if (levelDisplay) {
        levelDisplay.style.display = 'none';
    }
}

// 認証イベントリスナーの設定
function setupAuthEventListeners() {
    
    // ログインボタン
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            document.getElementById('authModal').style.display = 'flex';
            isLoginMode = true;
            updateAuthModal();
        });
    }
    
    // ログアウトボタン
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            window.apiClient.logout();
            await updateAuthUI();
            window.dispatchEvent(new Event('authStateChanged'));
        });
    }
    
    // 統計ボタン（レガシー対応）
    const statsLink = document.querySelector('a[href="#stats"]');
    if (statsLink) {
        statsLink.addEventListener('click', async (e) => {
            e.preventDefault();
            // アカウントページにリダイレクト
            window.location.href = '/account.html';
        });
    }
    
    // モーダル閉じるボタン
    const closeAuthModal = document.getElementById('closeAuthModal');
    if (closeAuthModal) {
        closeAuthModal.addEventListener('click', () => {
            document.getElementById('authModal').style.display = 'none';
        });
    }
    
    const closeStatsModal = document.getElementById('closeStatsModal');
    if (closeStatsModal) {
        closeStatsModal.addEventListener('click', () => {
            document.getElementById('statsModal').style.display = 'none';
        });
    }
    
    // フォーム切り替え
    const authSwitchBtn = document.getElementById('authSwitchBtn');
    if (authSwitchBtn) {
        authSwitchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('フォーム切り替えボタンがクリックされました。現在のモード:', isLoginMode ? 'ログイン' : '新規登録');
            isLoginMode = !isLoginMode;
            console.log('切り替え後のモード:', isLoginMode ? 'ログイン' : '新規登録');
            updateAuthModal();
        });
    }
    
    // 認証フォーム送信
    const authForm = document.getElementById('authForm');
    if (authForm) {
        authForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('authUsername').value;
            const password = document.getElementById('authPassword').value;
            const errorDiv = document.getElementById('authError');
            
            try {
                if (isLoginMode) {
                    await window.apiClient.login(username, password);
                } else {
                    await window.apiClient.register(username, password);
                }
                
                await updateAuthUI();
                document.getElementById('authModal').style.display = 'none';
                document.getElementById('authForm').reset();
                errorDiv.style.display = 'none';
                
                // 認証状態変更イベントを発火
                window.dispatchEvent(new Event('authStateChanged'));
                
            } catch (error) {
                errorDiv.textContent = error.message;
                errorDiv.style.display = 'block';
            }
        });
    }
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
        if (title) title.textContent = 'ログイン';
        if (submitBtn) submitBtn.textContent = 'ログイン';
        if (switchText) switchText.textContent = 'アカウントをお持ちでない方は';
        if (switchBtn) switchBtn.textContent = '新規登録';
    } else {
        if (title) title.textContent = '新規登録';
        if (submitBtn) submitBtn.textContent = '新規登録';
        if (switchText) switchText.textContent = '既にアカウントをお持ちの方は';
        if (switchBtn) switchBtn.textContent = 'ログイン';
    }
    
    console.log('モーダル更新完了');
}

// ユーザー統計の表示
async function showUserStats() {
    try {
        const stats = await window.apiClient.getUserStats();
        
        const profile = await window.apiClient.getUserProfile();
        
        document.getElementById('totalGamesCount').textContent = stats.total_games;
        document.getElementById('bestWPMCount').textContent = Math.round(stats.best_wpm);
        document.getElementById('bestAccuracyCount').textContent = Math.round(stats.best_accuracy) + '%';
        
        // プロフィール情報の追加表示
        const statsOverview = document.querySelector('.stats-overview');
        const existingProfile = document.querySelector('.profile-info');
        
        if (statsOverview && !existingProfile) {
            const profileInfo = document.createElement('div');
            profileInfo.className = 'profile-info';
            profileInfo.innerHTML = `
                <div class="stat-item">
                    <span class="stat-number">Lv.${profile.level}</span>
                    <span class="stat-desc">現在のレベル</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${profile.experience_points}</span>
                    <span class="stat-desc">総経験値</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${profile.consecutive_days}</span>
                    <span class="stat-desc">連続プレイ日数</span>
                </div>
            `;
            statsOverview.appendChild(profileInfo);
        }
        
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

// AuthManagerクラスの作成
class AuthManager {
    constructor() {
        this.initialized = false;
        this.init();
    }
    
    async init() {
        if (this.initialized) return;
        
        setupAuthEventListeners();
        
        // APIクライアントの初期化を待つ
        if (window.apiClient) {
            await window.apiClient.init();
        }
        
        await updateAuthUI();
        this.initialized = true;
    }
    
    showAuthModal() {
        const authModal = document.getElementById('authModal');
        if (authModal) {
            authModal.style.display = 'flex';
            isLoginMode = true;
            updateAuthModal();
        }
    }
    
    async refreshAuthUI() {
        await updateAuthUI();
    }
}

// グローバルに露出
window.AuthManager = AuthManager;