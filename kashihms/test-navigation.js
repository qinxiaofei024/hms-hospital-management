// 详细的导航加载器调试脚本
console.log('=== 导航加载器详细调试开始 ===');

// 1. 检查页面基本信息
console.log('1. 页面基本信息:');
console.log('   当前路径:', window.location.pathname);
console.log('   当前URL:', window.location.href);
console.log('   document.readyState:', document.readyState);

// 2. 检查导航容器
console.log('2. 导航容器检查:');
const navContainer = document.getElementById('navigation-container');
console.log('   容器存在:', !!navContainer);
if (navContainer) {
    console.log('   容器位置:', navContainer.getBoundingClientRect());
    console.log('   容器内容长度:', navContainer.innerHTML.length);
    console.log('   容器内容:', navContainer.innerHTML.substring(0, 100) + '...');
}

// 3. 检查NavigationLoader类和实例
console.log('3. NavigationLoader状态:');
console.log('   类存在:', typeof NavigationLoader !== 'undefined');
console.log('   实例存在:', !!window.navigationLoader);

if (window.navigationLoader) {
    console.log('   实例属性:');
    console.log('     navPath:', window.navigationLoader.navPath);
    console.log('     sidebarPath:', window.navigationLoader.sidebarPath);
    console.log('     initialized:', window.navigationLoader.initialized);
    console.log('     navContainerId:', window.navigationLoader.navContainerId);
}

// 4. 手动测试路径计算
console.log('4. 路径计算测试:');
function testGetCorrectPath(relativePath) {
    const currentPath = window.location.pathname;
    if (currentPath.includes('/pages/')) {
        return '../' + relativePath;
    }
    return relativePath;
}

const testNavPath = testGetCorrectPath('components/nav.html');
const testSidebarPath = testGetCorrectPath('js/sidebar.js');
console.log('   计算的nav路径:', testNavPath);
console.log('   计算的sidebar路径:', testSidebarPath);

// 5. 手动测试fetch
console.log('5. 手动fetch测试:');
async function manualFetchTest() {
    try {
        console.log('   开始fetch:', testNavPath);
        const response = await fetch(testNavPath);
        console.log('   fetch响应状态:', response.status);
        console.log('   fetch响应OK:', response.ok);
        
        if (response.ok) {
            const text = await response.text();
            console.log('   内容长度:', text.length);
            console.log('   内容开头:', text.substring(0, 200));
            
            // 6. 手动测试DOM注入
            console.log('6. 手动DOM注入测试:');
            if (navContainer) {
                const originalContent = navContainer.innerHTML;
                navContainer.innerHTML = text.substring(0, 500) + '... [手动注入测试]';
                console.log('   DOM注入成功，内容长度:', navContainer.innerHTML.length);
                
                // 恢复原内容
                setTimeout(() => {
                    navContainer.innerHTML = originalContent;
                    console.log('   已恢复原内容');
                }, 3000);
            }
        }
    } catch (error) {
        console.error('   fetch失败:', error);
    }
}

// 7. 检查事件监听器
console.log('7. 事件监听器检查:');
console.log('   DOMContentLoaded已触发:', document.readyState !== 'loading');

// 8. 手动调用初始化
console.log('8. 手动初始化测试:');
if (window.navigationLoader && typeof window.navigationLoader.init === 'function') {
    console.log('   准备手动调用init方法...');
    setTimeout(async () => {
        try {
            console.log('   开始手动初始化...');
            await window.navigationLoader.init();
            console.log('   手动初始化完成');
            
            // 检查结果
            setTimeout(() => {
                const container = document.getElementById('navigation-container');
                if (container) {
                    console.log('   初始化后容器内容长度:', container.innerHTML.length);
                    console.log('   初始化后容器内容预览:', container.innerHTML.substring(0, 200));
                }
            }, 1000);
        } catch (error) {
            console.error('   手动初始化失败:', error);
        }
    }, 2000);
}

// 延迟执行fetch测试
setTimeout(manualFetchTest, 1000);

console.log('=== 导航加载器详细调试设置完成 ===');