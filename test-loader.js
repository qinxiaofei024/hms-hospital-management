// 简化版导航加载器测试
console.log('Test loader script loaded');

class SimpleNavigationLoader {
    constructor() {
        console.log('SimpleNavigationLoader constructor called');
        this.navContainerId = 'navigation-container';
        this.initialized = false;
    }
    
    async init() {
        console.log('SimpleNavigationLoader init called');
        
        try {
            const container = document.getElementById(this.navContainerId);
            if (!container) {
                console.error('Navigation container not found');
                return false;
            }
            
            console.log('Container found, attempting to load navigation...');
            
            // 测试fetch
            const response = await fetch('components/nav.html');
            console.log('Fetch response:', response.status, response.statusText);
            
            if (!response.ok) {
                throw new Error(`Failed to load: ${response.status}`);
            }
            
            const html = await response.text();
            console.log('HTML loaded, length:', html.length);
            
            // 注入HTML
            container.innerHTML = html;
            console.log('HTML injected successfully');
            
            this.initialized = true;
            
            // 触发事件
            const event = new CustomEvent('navigationLoaded', {
                detail: { success: true }
            });
            document.dispatchEvent(event);
            
            return true;
        } catch (error) {
            console.error('SimpleNavigationLoader error:', error);
            return false;
        }
    }
}

// 创建实例
console.log('Creating SimpleNavigationLoader instance...');
window.simpleLoader = new SimpleNavigationLoader();

// 自动初始化
function autoInit() {
    console.log('Auto init triggered, document state:', document.readyState);
    if (window.simpleLoader && !window.simpleLoader.initialized) {
        console.log('Calling init...');
        window.simpleLoader.init();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
} else {
    console.log('Document already loaded, initializing immediately');
    setTimeout(autoInit, 100);
}

console.log('Test loader script setup complete');