/**
 * UI管理
 * プログレスバー、リザルト表示、苦手キー表示など
 */

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
        
        if (window.dom.timeRemainingEl) {
            window.dom.timeRemainingEl.textContent = timeRemaining;
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

        window.dom.rankBadge.textContent = rank;
        window.dom.rankBadge.className = `rank rank-${rank.toLowerCase()}`;
        window.dom.rankMessage.textContent = rankMessage;

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
        if (window.apiClient && window.apiClient.isLoggedIn()) {
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
            window.apiClient.submitGameResult(gameResult)
                .then(result => {
                    console.log('統計の保存に成功しました:', result);
                })
                .catch(error => {
                    console.error('統計の保存に失敗しました:', error);
                });
        }
        
        console.log("=== リザルト表示を実行 ===");
        console.log("finalResult 要素:", window.dom.finalResult);
        
        window.dom.finalResult.style.display = "flex";
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
        const existingInvitation = window.dom.finalResult.querySelector('.invitation-message');
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
            
            const restartButton = window.dom.finalResult.querySelector('#restartBtn');
            if (restartButton) {
                window.dom.finalResult.insertBefore(invitationDiv, restartButton);
            } else {
                window.dom.finalResult.appendChild(invitationDiv);
            }
        }
    }
}