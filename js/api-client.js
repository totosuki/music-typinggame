/**
 * API クライアント
 * FastAPI バックエンドとの通信を管理
 */

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
                console.log('ログイン済みユーザー:', this.currentUser);
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

    // コミュニティ機能のAPIメソッド
    async getCommunityMessages(limit = 50) {
        const response = await fetch(`${this.baseURL}/api/community/messages?limit=${limit}`);

        if (!response.ok) {
            throw new Error('コミュニティメッセージの取得に失敗しました');
        }

        return await response.json();
    }

    async postCommunityMessage(messageData) {
        const response = await fetch(`${this.baseURL}/api/community/messages`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(messageData)
        });

        if (!response.ok) {
            throw new Error('メッセージの投稿に失敗しました');
        }

        return await response.json();
    }

    async getUserProfile() {
        const response = await fetch(`${this.baseURL}/api/profile`, {
            headers: this.getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('プロフィールの取得に失敗しました');
        }

        return await response.json();
    }

    async getUserRewards() {
        const response = await fetch(`${this.baseURL}/api/rewards`, {
            headers: this.getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('報酬の取得に失敗しました');
        }

        return await response.json();
    }

    async claimReward(rewardId) {
        const response = await fetch(`${this.baseURL}/api/rewards/${rewardId}/claim`, {
            method: 'POST',
            headers: this.getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('報酬の受け取りに失敗しました');
        }

        return await response.json();
    }

    async getJobOffers() {
        const response = await fetch(`${this.baseURL}/api/job-offers`, {
            headers: this.getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('求人情報の取得に失敗しました');
        }

        return await response.json();
    }
}