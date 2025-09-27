// 锚点链接和预警信息功能测试脚本
console.log('开始测试锚点链接和预警信息功能...');

// 1. 测试锚点链接功能
const testAnchors = async () => {
    console.log('\n=== 锚点链接测试 ===');
    const anchors = [
        { id: '#dashboard', name: '仪表盘' },
        { id: '#data-center', name: '数据中心' },
        { id: '#leadership-cockpit', name: '领导驾驶舱' },
        { id: '#medical-tech', name: '医疗技术' },
        { id: '#mobile-operation', name: '移动手术' },
        { id: '#ai-assistant', name: 'AI助手' }
    ];
    
    let allAnchorsWork = true;
    
    for (const anchor of anchors) {
        try {
            console.log(`\n测试 ${anchor.name} (${anchor.id})...`);
            
            // 检查锚点元素是否存在
            const element = document.querySelector(anchor.id);
            if (!element) {
                console.error(`✗ 错误: 锚点元素 ${anchor.id} 不存在`);
                allAnchorsWork = false;
                continue;
            }
            
            console.log(`✓ 锚点元素 ${anchor.id} 存在`);
            
            // 检查元素位置
            const rect = element.getBoundingClientRect();
            console.log(`  锚点位置: 顶部=${Math.round(rect.top)}px, 左侧=${Math.round(rect.left)}px, 宽度=${Math.round(rect.width)}px, 高度=${Math.round(rect.height)}px`);
            
            // 滚动到锚点并检查
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            await new Promise(resolve => setTimeout(resolve, 1500)); // 等待滚动完成
            
            const newRect = element.getBoundingClientRect();
            const isInView = newRect.top >= 0 && newRect.top <= 100; // 允许100px误差
            
            if (isInView) {
                console.log(`✓ 成功: 页面已滚动到 ${anchor.name} 区域`);
            } else {
                console.warn(`⚠ 警告: 页面滚动到 ${anchor.name} 区域，但不在视口中（当前位置: 顶部=${Math.round(newRect.top)}px）`);
                allAnchorsWork = false;
            }
            
        } catch (error) {
            console.error(`✗ 测试 ${anchor.name} 失败:`, error.message);
            allAnchorsWork = false;
        }
    }
    
    console.log('\n=== 锚点链接测试总结 ===');
    if (allAnchorsWork) {
        console.log('✓ 所有锚点链接功能正常');
    } else {
        console.log('✗ 部分锚点链接功能存在问题，请查看上面的详细信息');
    }
};

// 2. 测试预警信息功能
const testWarningMessages = async () => {
    console.log('\n=== 预警信息测试 ===');
    
    let allWarningsWork = true;
    
    try {
        // 检查预警区域
        const warningSection = document.getElementById('warning-section');
        if (!warningSection) {
            console.error('✗ 错误: 预警区域 #warning-section 不存在');
            allWarningsWork = false;
        } else {
            console.log('✓ 预警区域 #warning-section 存在');
            console.log(`  预警区域位置: 顶部=${Math.round(warningSection.getBoundingClientRect().top)}px, 左侧=${Math.round(warningSection.getBoundingClientRect().left)}px`);
            
            // 检查预警列表
            const warningList = document.getElementById('warningList');
            if (!warningList) {
                console.error('✗ 错误: 预警列表 #warningList 不存在');
                allWarningsWork = false;
            } else {
                console.log('✓ 预警列表 #warningList 存在');
                console.log(`  预警项数量: ${warningList.children.length}`);
                
                // 检查是否有预警项
                if (warningList.children.length === 0) {
                    console.warn('⚠ 警告: 预警列表中没有预警项');
                } else {
                    // 显示第一个预警项的内容
                    const firstWarning = warningList.children[0];
                    console.log(`  第一个预警项内容: ${firstWarning.textContent.trim().substring(0, 100)}...`);
                }
            }
            
            // 检查拖动功能
            const draggableHandle = document.querySelector('.draggable-handle');
            if (!draggableHandle) {
                console.error('✗ 错误: 拖动句柄 .draggable-handle 不存在');
                allWarningsWork = false;
            } else {
                console.log('✓ 拖动句柄 .draggable-handle 存在');
                console.log('  提示: 请手动测试预警信息区域的拖动功能');
            }
        }
        
    } catch (error) {
        console.error('✗ 预警信息测试失败:', error.message);
        allWarningsWork = false;
    }
    
    console.log('\n=== 预警信息测试总结 ===');
    if (allWarningsWork) {
        console.log('✓ 所有预警信息功能正常');
    } else {
        console.log('✗ 部分预警信息功能存在问题，请查看上面的详细信息');
    }
};

// 3. 创建简单的HTML测试界面
const createTestUI = () => {
    const testDiv = document.createElement('div');
    testDiv.style.position = 'fixed';
    testDiv.style.top = '10px';
    testDiv.style.left = '10px';
    testDiv.style.zIndex = '10000';
    testDiv.style.backgroundColor = 'white';
    testDiv.style.border = '1px solid #ddd';
    testDiv.style.padding = '15px';
    testDiv.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    testDiv.style.fontFamily = 'Arial, sans-serif';
    testDiv.style.fontSize = '12px';
    testDiv.id = 'anchors-warnings-test-ui';
    
    testDiv.innerHTML = `
        <h3 style="margin-top: 0; color: #333;">锚点链接和预警信息测试</h3>
        <p style="margin: 10px 0;">按F12打开控制台查看详细测试结果</p>
        <button id="run-test-btn" style="padding: 5px 10px; background-color: #4CAF50; color: white; border: none; cursor: pointer;">
            运行测试
        </button>
        <button id="close-test-btn" style="margin-left: 10px; padding: 5px 10px; background-color: #f44336; color: white; border: none; cursor: pointer;">
            关闭
        </button>
    `;
    
    document.body.appendChild(testDiv);
    
    // 添加按钮事件
    document.getElementById('run-test-btn').addEventListener('click', async () => {
        await runAllTests();
    });
    
    document.getElementById('close-test-btn').addEventListener('click', () => {
        document.getElementById('anchors-warnings-test-ui').remove();
    });
};

// 4. 运行所有测试
const runAllTests = async () => {
    console.log('\n\n=========================');
    console.log('开始全面测试锚点链接和预警信息功能');
    console.log('=========================');
    
    await testAnchors();
    await testWarningMessages();
    
    console.log('\n\n=========================');
    console.log('测试完成，请查看以上测试结果');
    console.log('=========================');
};

// 当页面加载完成后初始化测试
window.addEventListener('DOMContentLoaded', function() {
    // 创建测试UI
    createTestUI();
    
    // 自动运行一次测试
    setTimeout(async () => {
        await runAllTests();
    }, 1000);
});