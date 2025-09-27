// 侧栏收放功能测试脚本
// 用于在浏览器控制台中测试侧栏功能

console.log('=== 侧栏收放功能测试开始 ===');

function testSidebarFunction() {
    const results = {
        navigationContainer: false,
        sidebarManager: false,
        toggleButton: false,
        sidebarElement: false,
        mainContent: false,
        functionalTest: false
    };
    
    // 1. 检查导航容器
    const navContainer = document.getElementById('navigation-container');
    if (navContainer && navContainer.children.length > 0) {
        results.navigationContainer = true;
        console.log('✓ 导航容器已加载，包含', navContainer.children.length, '个子元素');
    } else {
        console.log('✗ 导航容器为空或不存在');
    }
    
    // 2. 检查SidebarManager实例
    if (typeof window.sidebarManager !== 'undefined') {
        results.sidebarManager = true;
        console.log('✓ SidebarManager实例存在');
        console.log('  - 类型:', typeof window.sidebarManager);
        console.log('  - 构造函数:', window.sidebarManager.constructor.name);
    } else {
        console.log('✗ SidebarManager实例不存在');
    }
    
    // 3. 检查收放按钮
    const toggleButton = document.querySelector('.toggle-sidebar-btn');
    if (toggleButton) {
        results.toggleButton = true;
        console.log('✓ 收放按钮已找到');
        console.log('  - 按钮文本:', toggleButton.textContent);
        console.log('  - 按钮类名:', toggleButton.className);
        console.log('  - 按钮位置:', toggleButton.getBoundingClientRect());
    } else {
        console.log('✗ 收放按钮未找到');
        
        // 查找所有按钮
        const allButtons = document.querySelectorAll('button');
        console.log('  页面中共有', allButtons.length, '个按钮:');
        allButtons.forEach((btn, index) => {
            console.log(`    ${index + 1}. "${btn.textContent}" (类名: ${btn.className})`);
        });
    }
    
    // 4. 检查侧栏元素
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        results.sidebarElement = true;
        console.log('✓ 侧栏元素已找到');
        console.log('  - 侧栏类名:', sidebar.className);
        console.log('  - 是否收起:', sidebar.classList.contains('collapsed'));
        console.log('  - 侧栏尺寸:', sidebar.getBoundingClientRect());
    } else {
        console.log('✗ 侧栏元素未找到');
    }
    
    // 5. 检查主内容区域
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        results.mainContent = true;
        console.log('✓ 主内容区域已找到');
        console.log('  - 主内容类名:', mainContent.className);
        console.log('  - 主内容尺寸:', mainContent.getBoundingClientRect());
    } else {
        console.log('✗ 主内容区域未找到');
    }
    
    // 6. 功能测试
    if (results.sidebarManager && results.toggleButton) {
        try {
            console.log('开始功能测试...');
            
            // 记录初始状态
            const initialSidebarState = sidebar ? sidebar.classList.contains('collapsed') : null;
            console.log('  - 初始侧栏状态:', initialSidebarState ? '收起' : '展开');
            
            // 测试toggleSidebar方法
            window.sidebarManager.toggleSidebar();
            
            // 检查状态变化
            const newSidebarState = sidebar ? sidebar.classList.contains('collapsed') : null;
            console.log('  - 切换后侧栏状态:', newSidebarState ? '收起' : '展开');
            
            if (initialSidebarState !== newSidebarState) {
                results.functionalTest = true;
                console.log('✓ 侧栏收放功能正常工作');
            } else {
                console.log('✗ 侧栏状态未发生变化');
            }
            
            // 恢复初始状态
            if (initialSidebarState !== newSidebarState) {
                window.sidebarManager.toggleSidebar();
                console.log('  - 已恢复初始状态');
            }
            
        } catch (error) {
            console.log('✗ 功能测试失败:', error.message);
        }
    } else {
        console.log('⚠ 跳过功能测试（缺少必要组件）');
    }
    
    // 7. 总结
    console.log('\n=== 测试结果总结 ===');
    const passedTests = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;
    
    console.log(`通过测试: ${passedTests}/${totalTests}`);
    console.log('详细结果:');
    Object.entries(results).forEach(([test, passed]) => {
        console.log(`  ${passed ? '✓' : '✗'} ${test}`);
    });
    
    if (passedTests === totalTests) {
        console.log('\n🎉 所有测试通过！侧栏收放功能正常工作。');
    } else if (passedTests >= 4) {
        console.log('\n⚠ 大部分功能正常，但存在一些问题需要修复。');
    } else {
        console.log('\n❌ 存在严重问题，需要进一步调试。');
    }
    
    return results;
}

// 自动运行测试
if (typeof window !== 'undefined') {
    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(testSidebarFunction, 2000);
        });
    } else {
        setTimeout(testSidebarFunction, 1000);
    }
}

// 导出测试函数供手动调用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = testSidebarFunction;
} else if (typeof window !== 'undefined') {
    window.testSidebarFunction = testSidebarFunction;
}