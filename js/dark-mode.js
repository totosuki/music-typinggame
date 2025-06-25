/**
 * ダークモード機能
 * システム設定に応じた自動切り替えとユーザー手動切り替えに対応
 */

class DarkModeManager {
    constructor() {
        this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
        this.init();
    }
    
    init() {
        // 初期テーマを適用
        this.applyTheme(this.currentTheme);
        
        // トグルボタンを作成
        this.createToggleButton();
        
        // システムテーマ変更の監視
        this.watchSystemTheme();
    }
    
    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    getStoredTheme() {
        return localStorage.getItem('theme');
    }
    
    setStoredTheme(theme) {
        localStorage.setItem('theme', theme);
    }
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        this.setStoredTheme(theme);
        
        // トグルボタンの更新
        this.updateToggleButton();
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
    }
    
    createToggleButton() {
        // 既存のボタンがあれば削除
        const existingButton = document.getElementById('theme-toggle');
        if (existingButton) {
            existingButton.remove();
        }
        
        // トグルボタンを作成
        const toggleButton = document.createElement('button');
        toggleButton.id = 'theme-toggle';
        toggleButton.className = 'theme-toggle';
        toggleButton.setAttribute('aria-label', 'ダークモード切り替え');
        toggleButton.innerHTML = this.currentTheme === 'dark' ? '☀️' : '🌙';
        
        // クリックイベントを追加
        toggleButton.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // ナビゲーションバーの右端（認証メニューの後）に追加
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            // 認証メニューの後に挿入（右端に配置）
            const authMenu = navMenu.querySelector('.auth-menu');
            if (authMenu) {
                navMenu.insertBefore(toggleButton, authMenu.nextSibling);
            } else {
                navMenu.appendChild(toggleButton);
            }
        }
    }
    
    updateToggleButton() {
        const toggleButton = document.getElementById('theme-toggle');
        if (toggleButton) {
            toggleButton.innerHTML = this.currentTheme === 'dark' ? '☀️' : '🌙';
            toggleButton.setAttribute('title', 
                this.currentTheme === 'dark' ? 'ライトモードに切り替え' : 'ダークモードに切り替え'
            );
        }
    }
    
    watchSystemTheme() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            // ユーザーが手動で設定していない場合のみシステム設定に従う
            if (!this.getStoredTheme()) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
    
    // システムテーマをリセット（ユーザー設定を削除）
    resetToSystemTheme() {
        localStorage.removeItem('theme');
        this.applyTheme(this.getSystemTheme());
    }
}

// グローバルに露出
window.DarkModeManager = DarkModeManager;

// DOM読み込み完了時に初期化
document.addEventListener('DOMContentLoaded', () => {
    window.darkModeManager = new DarkModeManager();
});