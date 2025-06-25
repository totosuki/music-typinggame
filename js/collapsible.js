/**
 * 折りたたみ機能
 * 各セクションを開閉可能にする共通機能
 */

class CollapsibleManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupCollapsibles();
    }
    
    setupCollapsibles() {
        // ページロード時に折りたたみセクションを初期化
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeCollapsibleSections();
        });
        
        // 動的に追加された要素にも対応
        const observer = new MutationObserver(() => {
            this.initializeCollapsibleSections();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    initializeCollapsibleSections() {
        // まだ初期化されていない折りたたみセクションを探す
        const sections = document.querySelectorAll('.collapsible-section:not(.initialized)');
        
        sections.forEach(section => {
            this.setupCollapsibleSection(section);
        });
    }
    
    setupCollapsibleSection(section) {
        const header = section.querySelector('.collapsible-header');
        const content = section.querySelector('.collapsible-content');
        
        if (!header || !content) return;
        
        // ヘッダーにトグルボタンを追加
        if (!header.querySelector('.toggle-btn')) {
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'toggle-btn';
            toggleBtn.innerHTML = '−';
            toggleBtn.setAttribute('aria-label', '折りたたみ');
            header.appendChild(toggleBtn);
            
            // クリックイベントを追加
            header.addEventListener('click', (e) => {
                if (e.target.closest('.toggle-btn')) {
                    this.toggleSection(section);
                }
            });
        }
        
        // 初期状態を設定（デフォルトは開いた状態）
        if (!section.classList.contains('collapsed')) {
            content.style.display = 'block';
        } else {
            content.style.display = 'none';
            const toggleBtn = header.querySelector('.toggle-btn');
            if (toggleBtn) toggleBtn.innerHTML = '+';
        }
        
        section.classList.add('initialized');
    }
    
    toggleSection(section) {
        const header = section.querySelector('.collapsible-header');
        const content = section.querySelector('.collapsible-content');
        const toggleBtn = header.querySelector('.toggle-btn');
        
        if (!content || !toggleBtn) return;
        
        const isCollapsed = section.classList.contains('collapsed');
        
        if (isCollapsed) {
            // 展開
            section.classList.remove('collapsed');
            content.style.display = 'block';
            toggleBtn.innerHTML = '−';
            
            // アニメーション効果
            content.style.opacity = '0';
            content.style.transform = 'translateY(-10px)';
            requestAnimationFrame(() => {
                content.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                content.style.opacity = '1';
                content.style.transform = 'translateY(0)';
            });
        } else {
            // 折りたたみ
            section.classList.add('collapsed');
            content.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            content.style.opacity = '0';
            content.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                content.style.display = 'none';
                content.style.transition = '';
            }, 300);
            
            toggleBtn.innerHTML = '+';
        }
    }
    
    // 特定のセクションを開く
    expandSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section && section.classList.contains('collapsed')) {
            this.toggleSection(section);
        }
    }
    
    // 特定のセクションを閉じる
    collapseSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section && !section.classList.contains('collapsed')) {
            this.toggleSection(section);
        }
    }
    
    // 全セクションを開く
    expandAll() {
        const sections = document.querySelectorAll('.collapsible-section.collapsed');
        sections.forEach(section => this.toggleSection(section));
    }
    
    // 全セクションを閉じる
    collapseAll() {
        const sections = document.querySelectorAll('.collapsible-section:not(.collapsed)');
        sections.forEach(section => this.toggleSection(section));
    }
}

// グローバルに露出
window.CollapsibleManager = CollapsibleManager;

// 自動初期化
window.collapsibleManager = new CollapsibleManager();