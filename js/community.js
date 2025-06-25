/**
 * コミュニティページ JavaScript
 * チャット機能、報酬システム、求人情報の管理
 */

class CommunityManager {
    constructor() {
        this.currentUser = null;
        this.messages = [];
        this.rewards = [];
        this.jobOffers = [];
        this.chatRefreshInterval = null;
        
        this.init();
    }
    
    async init() {
        // DOM要素の取得
        this.userPanel = document.getElementById('userPanel');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInputSection = document.getElementById('chatInputSection');
        this.loginRequired = document.getElementById('loginRequired');
        this.messageInput = document.getElementById('messageInput');
        this.sendMessageBtn = document.getElementById('sendMessageBtn');
        this.loginPromptBtn = document.getElementById('loginPromptBtn');
        this.rewardsContainer = document.getElementById('rewardsContainer');
        this.jobOffersContainer = document.getElementById('jobOffersContainer');
        
        // イベントリスナーの設定
        this.setupEventListeners();
        
        // 認証状態確認
        await this.checkAuthStatus();
        
        // データの初期読み込み
        await this.loadInitialData();
    }
    
    setupEventListeners() {
        // メッセージ送信
        this.sendMessageBtn?.addEventListener('click', () => this.sendMessage());
        this.messageInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // ログイン促進ボタン
        this.loginPromptBtn?.addEventListener('click', () => {
            if (window.authManager) {
                window.authManager.showAuthModal();
            } else {
                // AuthManagerが利用できない場合のフォールバック
                const authModal = document.getElementById('authModal');
                if (authModal) {
                    authModal.style.display = 'flex';
                }
            }
        });
    }
    
    async checkAuthStatus() {
        try {
            if (window.apiClient) {
                const userInfo = await window.apiClient.getCurrentUser();
                this.currentUser = userInfo;
                await this.loadUserProfile();
                this.showUserPanel();
                this.showChatInput();
            }
        } catch (error) {
            console.log('ユーザー未ログイン');
            this.showLoginRequired();
        }
    }
    
    async loadUserProfile() {
        if (!this.currentUser) return;
        
        try {
            const profile = await window.apiClient.getUserProfile();
            this.updateUserPanel(profile);
        } catch (error) {
            console.error('プロフィール読み込みエラー:', error);
        }
    }
    
    updateUserPanel(profile) {
        const userInitial = document.getElementById('userInitial');
        const displayUsername = document.getElementById('displayUsername');
        const userLevel = document.getElementById('userLevel');
        const userExp = document.getElementById('userExp');
        const userWPM = document.getElementById('userWPM');
        const userAccuracy = document.getElementById('userAccuracy');
        const userDays = document.getElementById('userDays');
        const professionalStatus = document.getElementById('professionalStatus');
        
        if (userInitial && this.currentUser.username) {
            userInitial.textContent = this.currentUser.username.charAt(0).toUpperCase();
        }
        
        if (displayUsername) {
            displayUsername.textContent = this.currentUser.username;
        }
        
        if (userLevel) {
            userLevel.textContent = `Lv.${profile.level}`;
        }
        
        if (userExp) {
            const nextLevelExp = this.calculateNextLevelExp(profile.level);
            const currentLevelExp = this.calculateLevelExp(profile.level - 1);
            const progressExp = profile.experience_points - currentLevelExp;
            const neededExp = nextLevelExp - currentLevelExp;
            userExp.textContent = `${progressExp} / ${neededExp} EXP`;
        }
        
        if (userWPM) {
            userWPM.textContent = `${Math.round(profile.career_best_wpm)} 文字/分`;
        }
        
        if (userAccuracy) {
            userAccuracy.textContent = `${Math.round(profile.career_best_accuracy)}%`;
        }
        
        if (userDays) {
            userDays.textContent = `${profile.consecutive_days}日連続`;
        }
        
        // プロ認定表示
        if (professionalStatus && profile.is_professional) {
            professionalStatus.style.display = 'block';
        }
    }
    
    calculateLevelExp(level) {
        return level * level * 100;
    }
    
    calculateNextLevelExp(level) {
        return level * level * 100;
    }
    
    showUserPanel() {
        if (this.userPanel) {
            this.userPanel.style.display = 'block';
        }
    }
    
    showChatInput() {
        if (this.chatInputSection) {
            this.chatInputSection.style.display = 'block';
        }
        if (this.loginRequired) {
            this.loginRequired.style.display = 'none';
        }
    }
    
    showLoginRequired() {
        if (this.chatInputSection) {
            this.chatInputSection.style.display = 'none';
        }
        if (this.loginRequired) {
            this.loginRequired.style.display = 'block';
        }
        if (this.userPanel) {
            this.userPanel.style.display = 'none';
        }
    }
    
    async loadInitialData() {
        await Promise.all([
            this.loadCommunityMessages(),
            this.loadRewards(),
            this.loadJobOffers()
        ]);
        
        // チャットの自動更新を開始
        this.startChatRefresh();
    }
    
    async loadCommunityMessages() {
        try {
            const messages = await window.apiClient.getCommunityMessages();
            this.messages = messages;
            this.renderMessages();
        } catch (error) {
            console.error('メッセージ読み込みエラー:', error);
            this.showMessagesError();
        }
    }
    
    renderMessages() {
        if (!this.chatMessages) return;
        
        if (this.messages.length === 0) {
            this.chatMessages.innerHTML = '<div class="loading-messages">まだメッセージがありません。最初のメッセージを投稿してみましょう！</div>';
            return;
        }
        
        // メッセージを古い順に並び替え（最新メッセージが下に来るように）
        const sortedMessages = [...this.messages].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        const messagesHtml = sortedMessages.map(message => this.createMessageHtml(message)).join('');
        this.chatMessages.innerHTML = messagesHtml;
        
        // 最新メッセージにスクロール
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    createMessageHtml(message) {
        const date = new Date(message.created_at);
        const timeString = date.toLocaleTimeString('ja-JP', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        const messageTypeClass = `message-type-${message.message_type}`;
        
        return `
            <div class="message-item ${messageTypeClass}">
                <div class="message-header">
                    <span class="message-username">${this.escapeHtml(message.username)}</span>
                    <span class="message-level">Lv.${message.user_level}</span>
                    <span class="message-time">${timeString}</span>
                </div>
                <div class="message-content">${this.escapeHtml(message.message)}</div>
            </div>
        `;
    }
    
    showMessagesError() {
        if (this.chatMessages) {
            this.chatMessages.innerHTML = '<div class="loading-messages">メッセージの読み込みに失敗しました。</div>';
        }
    }
    
    async sendMessage() {
        if (!this.currentUser) {
            alert('メッセージを送信するには、ログインが必要です。');
            return;
        }
        
        const message = this.messageInput.value.trim();
        if (!message) {
            alert('メッセージを入力してください。');
            return;
        }
        
        const messageType = 'general';
        
        try {
            this.sendMessageBtn.disabled = true;
            this.sendMessageBtn.textContent = '送信中...';
            
            await window.apiClient.postCommunityMessage({
                message: message,
                message_type: messageType
            });
            
            // メッセージをクリア
            this.messageInput.value = '';
            
            // メッセージを再読み込み
            await this.loadCommunityMessages();
            
        } catch (error) {
            console.error('メッセージ送信エラー:', error);
            alert('メッセージの送信に失敗しました。');
        } finally {
            this.sendMessageBtn.disabled = false;
            this.sendMessageBtn.textContent = '送信';
        }
    }
    
    async loadRewards() {
        if (!this.currentUser) return;
        
        try {
            const rewards = await window.apiClient.getUserRewards();
            this.rewards = rewards;
            this.renderRewards();
        } catch (error) {
            console.error('報酬読み込みエラー:', error);
        }
    }
    
    renderRewards() {
        if (!this.rewardsContainer) return;
        
        // 求人招待以外の報酬のみをフィルタリング
        const nonJobRewards = this.rewards.filter(reward => reward.reward_type !== 'job_invitation');
        
        if (nonJobRewards.length === 0) {
            this.rewardsContainer.innerHTML = '<p class="no-rewards">現在、受け取り可能な報酬はありません</p>';
            return;
        }
        
        const rewardsHtml = nonJobRewards.map(reward => this.createRewardHtml(reward)).join('');
        this.rewardsContainer.innerHTML = rewardsHtml;
        
        // 報酬受け取りボタンのイベントリスナー
        this.rewardsContainer.querySelectorAll('.claim-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const rewardId = parseInt(e.target.dataset.rewardId);
                this.claimReward(rewardId);
            });
        });
    }
    
    createRewardHtml(reward) {
        const rewardData = reward.reward_data;
        let title = '報酬';
        let description = '報酬が利用可能です';
        
        if (reward.reward_type === 'achievement') {
            title = `🏆 ${rewardData.name}`;
            description = rewardData.description;
        } else if (reward.reward_type === 'job_invitation') {
            title = `💼 ${rewardData.company}からの招待`;
            description = rewardData.message;
        }
        
        return `
            <div class="reward-item">
                <div class="reward-header">
                    <h4 class="reward-title">${this.escapeHtml(title)}</h4>
                    <span class="reward-type">${this.getRewardTypeLabel(reward.reward_type)}</span>
                </div>
                <p class="reward-description">${this.escapeHtml(description)}</p>
                <button class="claim-btn" data-reward-id="${reward.id}">受け取る</button>
            </div>
        `;
    }
    
    getRewardTypeLabel(type) {
        const labels = {
            'achievement': '実績',
            'job_invitation': '求人招待',
            'experience': '経験値'
        };
        return labels[type] || '報酬';
    }
    
    async claimReward(rewardId) {
        try {
            await window.apiClient.claimReward(rewardId);
            alert('報酬を受け取りました！');
            await this.loadRewards();
        } catch (error) {
            console.error('報酬受け取りエラー:', error);
            alert('報酬の受け取りに失敗しました。');
        }
    }
    
    async loadJobOffers() {
        if (!this.currentUser) return;
        
        try {
            const jobOffers = await window.apiClient.getJobOffers();
            this.jobOffers = jobOffers;
            this.renderJobOffers();
        } catch (error) {
            console.error('求人読み込みエラー:', error);
        }
    }
    
    renderJobOffers() {
        if (!this.jobOffersContainer) return;
        
        // 求人招待の報酬を取得
        const jobInvitations = this.rewards.filter(reward => reward.reward_type === 'job_invitation');
        
        const jobOffersSection = this.jobOffersContainer.querySelector('.no-jobs');
        
        if (this.jobOffers.length === 0 && jobInvitations.length === 0) {
            if (jobOffersSection) {
                jobOffersSection.textContent = '現在、あなたの条件に合う求人はありません';
            }
            return;
        }
        
        // "求人なし"メッセージを削除
        if (jobOffersSection) {
            jobOffersSection.remove();
        }
        
        let allJobsHtml = '';
        
        // 通常の求人情報
        if (this.jobOffers.length > 0) {
            allJobsHtml += this.jobOffers.map(job => this.createJobOfferHtml(job)).join('');
        }
        
        // 求人招待を求人情報として表示
        if (jobInvitations.length > 0) {
            allJobsHtml += jobInvitations.map(invitation => this.createJobInvitationHtml(invitation)).join('');
        }
        
        this.jobOffersContainer.insertAdjacentHTML('afterbegin', allJobsHtml);
    }
    
    createJobOfferHtml(job) {
        return `
            <div class="job-item">
                <div class="job-header">
                    <h4 class="job-title">${this.escapeHtml(job.title)}</h4>
                    <span class="job-company">${this.escapeHtml(job.company)}</span>
                </div>
                <p class="job-description">${this.escapeHtml(job.description)}</p>
                <div class="job-requirements">
                    <strong>応募条件:</strong>
                    <ul>
                        <li>レベル${job.required_level}以上</li>
                        <li>WPM ${job.required_wpm}文字/分以上</li>
                        <li>正確率 ${job.required_accuracy}%以上</li>
                    </ul>
                </div>
                <button class="apply-btn" onclick="alert('求人への応募機能は準備中です。しばらくお待ちください。')">
                    応募する
                </button>
            </div>
        `;
    }
    
    startChatRefresh() {
        // 30秒ごとにチャットを更新
        this.chatRefreshInterval = setInterval(() => {
            this.loadCommunityMessages();
        }, 30000);
    }
    
    stopChatRefresh() {
        if (this.chatRefreshInterval) {
            clearInterval(this.chatRefreshInterval);
            this.chatRefreshInterval = null;
        }
    }
    
    createJobInvitationHtml(invitation) {
        const invitationData = invitation.reward_data;
        return `
            <div class="job-item job-invitation">
                <div class="job-header">
                    <h4 class="job-title">🎖️ 特別招待: ${this.escapeHtml(invitationData.position)}</h4>
                    <span class="job-company">${this.escapeHtml(invitationData.company)}</span>
                </div>
                <p class="job-description">${this.escapeHtml(invitationData.message)}</p>
                <div class="job-invitation-note">
                    <strong>🌟 あなたの優秀な成績により特別に招待されました</strong>
                </div>
                <button class="apply-btn invitation-btn" data-invitation-id="${invitation.id}">
                    招待を受ける
                </button>
            </div>
        `;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // ログイン状態変更時の更新
    async onAuthStateChanged() {
        await this.checkAuthStatus();
        await this.loadInitialData();
    }
    
    // ページ離脱時のクリーンアップ
    destroy() {
        this.stopChatRefresh();
    }
}

// グローバルに露出
window.CommunityManager = CommunityManager;

// ページ読み込み完了時に初期化
document.addEventListener('DOMContentLoaded', () => {
    window.communityManager = new CommunityManager();
});

// ページ離脱時のクリーンアップ
window.addEventListener('beforeunload', () => {
    if (window.communityManager) {
        window.communityManager.destroy();
    }
});

// 認証状態変更の監視（他のスクリプトから呼び出し可能）
window.addEventListener('authStateChanged', () => {
    if (window.communityManager) {
        window.communityManager.onAuthStateChanged();
    }
});