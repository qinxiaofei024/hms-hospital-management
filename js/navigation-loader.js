// 统一导航栏加载脚本 - 增强版
console.log('Navigation loader script starting...');

// 防重复加载保护
if (!window.NavigationLoader) {

class NavigationLoader {
    constructor() {
        console.log('NavigationLoader constructor called');
        this.navContainerId = 'navigation-container';
        this.initialized = false;
        this.retryCount = 0;
        this.maxRetries = 3;
        
        // 根据当前页面路径确定正确的相对路径
        const currentPath = window.location.pathname;
        console.log('Current path:', currentPath);
        
        if (currentPath.includes('/pages/')) {
            this.navPath = '../components/nav.html';
            this.sidebarPath = '../js/sidebar.js';
        } else {
            this.navPath = 'components/nav.html';
            this.sidebarPath = 'js/sidebar.js';
        }
        
        console.log('NavigationLoader initialized with paths:', {
            currentPath: currentPath,
            navPath: this.navPath,
            sidebarPath: this.sidebarPath
        });
    }

    async init() {
        if (this.initialized) {
            console.log('NavigationLoader already initialized');
            return true;
        }
        
        console.log('NavigationLoader init started');
        
        try {
            // 获取导航容器
            const container = document.getElementById(this.navContainerId);
            if (!container) {
                console.error('Navigation container not found');
                this.showError('导航容器未找到');
                return false;
            }
            
            console.log('Navigation container found, loading content...');
            
            // 加载导航HTML
            const response = await fetch(this.navPath);
            console.log('Fetch response:', response.status, response.statusText);
            
            if (!response.ok) {
                throw new Error(`Failed to load navigation: ${response.status} ${response.statusText}`);
            }
            
            const html = await response.text();
            console.log('Navigation HTML loaded successfully, length:', html.length);
            
            if (!html || html.length < 100) {
                throw new Error('Navigation HTML content is too short or empty');
            }
            
            // 处理链接路径
            const processedHtml = this.processLinks(html);
            console.log('Links processed');
            
            // 注入HTML到容器
            container.innerHTML = processedHtml;
            console.log('Navigation HTML injected into container');
            
            // 验证注入是否成功
            if (container.children.length === 0) {
                throw new Error('Failed to inject HTML into container');
            }
            
            // 加载侧边栏脚本
            await this.loadSidebarScript();
            
            this.initialized = true;
            console.log('NavigationLoader initialization completed successfully');
            
            // 触发导航加载完成事件
            const event = new CustomEvent('navigationLoaded', {
                detail: { 
                    success: true,
                    timestamp: new Date().toISOString(),
                    containerElements: container.children.length
                }
            });
            document.dispatchEvent(event);
            
            return true;
        } catch (error) {
            console.error('Navigation initialization error:', error);
            this.handleError(error);
            return false;
        }
    }

    processLinks(html) {
        console.log('Processing links in HTML...');
        const inPages = window.location.pathname.includes('/pages/');
        
        if (inPages) {
            // 修复在子页面中资源路径（如logo）相对路径错误
            html = html.replace(/(src|href)="images\//g, '$1="../images/');
            // 子页面中 ../index.html 与 ../pages/xxx.html 本身是正确的，不做改动
        } else {
            // 根目录首页：将 ../ 前缀修正为相对当前目录
            html = html.replace(/href="\.\.\/pages\//g, 'href="pages/');
            html = html.replace(/href="\.\.\/index\.html"/g, 'href="index.html"');
            // 根目录下的 images/ 路径保持不变
        }

        // 纠正常见的历史命名错误
        html = html.replace(/drug-blood-management\.html/g, 'medication-blood-management.html');
        
        return html;
    }

    async loadSidebarScript() {
        console.log('Loading sidebar script...');
        
        try {
            // 检查是否已经加载了sidebar脚本
            if (document.querySelector(`script[src="${this.sidebarPath}"]`)) {
                console.log('Sidebar script already loaded');
                // 如果脚本已加载但SidebarManager未初始化，则初始化它
                this.initializeSidebarManager();
                return;
            }
            
            const script = document.createElement('script');
            script.src = this.sidebarPath;
            script.async = true;
            
            return new Promise((resolve, reject) => {
                script.onload = () => {
                    console.log('Sidebar script loaded successfully');
                    // 脚本加载完成后初始化SidebarManager
                    this.initializeSidebarManager();
                    resolve();
                };
                
                script.onerror = () => {
                    console.warn('Failed to load sidebar script, but continuing...');
                    resolve(); // 不阻塞主流程
                };
                
                document.head.appendChild(script);
            });
        } catch (error) {
            console.warn('Error loading sidebar script:', error);
            // 不抛出错误，允许导航继续工作
        }
    }

    initializeSidebarManager() {
        try {
            if (typeof SidebarManager !== 'undefined') {
                // 确保只初始化一次
                if (!window._sidebarManager) {
                    console.log('Initializing SidebarManager...');
                    window._sidebarManager = new SidebarManager();
                    window._sidebarManager.init();
                    
                    // 同时设置不带下划线的引用，确保兼容性
                    window.sidebarManager = window._sidebarManager;
                    
                    console.log('SidebarManager initialized successfully');
                    console.log('Available as window.sidebarManager and window._sidebarManager');
                }
            } else if (typeof Common !== 'undefined' && Common.initSidebar) {
                // 兼容旧的公共侧边栏初始化
                Common.initSidebar();
            }
        } catch (e) {
            console.warn('Initialize SidebarManager failed:', e);
        }
    }

    showError(message) {
        const container = document.getElementById(this.navContainerId);
        if (container) {
            container.innerHTML = `<div style="padding: 12px; color: #f5222d;">导航加载失败：${message}</div>`;
        }
    }

    handleError(error) {
        this.retryCount++;
        if (this.retryCount <= this.maxRetries) {
            console.log(`Retrying navigation load (${this.retryCount}/${this.maxRetries})...`);
            setTimeout(() => this.init(), 300 * this.retryCount);
        } else {
            this.showError(error.message || '未知错误');
        }
    }
}

// 导出到全局作用域以便调试
window.NavigationLoader = NavigationLoader;

// 自动初始化
(function autoInit() {
    if (!window.navigationLoader) {
        window.navigationLoader = new NavigationLoader();
        
        // 根据文档状态决定初始化时机
        if (document.readyState === 'loading') {
            console.log('Document still loading, adding DOMContentLoaded listener');
            document.addEventListener('DOMContentLoaded', () => window.navigationLoader.init());
        } else {
            console.log('Document already loaded, initializing immediately');
            setTimeout(() => window.navigationLoader.init(), 100);
        }
    } else {
        console.log('NavigationLoader instance already exists');
    }
    
    console.log('Navigation loader script setup complete');
})();

} else {
    console.log('NavigationLoader already loaded, skipping redefinition');
}