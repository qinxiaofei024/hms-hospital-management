// 测试Common对象的各个功能
function testCommonFunctions() {
    console.log('开始测试Common对象的功能...');
    
    // 测试getUrlParam
    try {
        const testParam = Common.getUrlParam('test');
        console.log('✓ getUrlParam 测试通过: 返回值', testParam);
    } catch (error) {
        console.error('✗ getUrlParam 测试失败:', error.message);
    }
    
    // 测试formatNumber
    try {
        const formattedNum = Common.formatNumber(1234567.89);
        console.log('✓ formatNumber 测试通过: 1234567.89 ->', formattedNum);
    } catch (error) {
        console.error('✗ formatNumber 测试失败:', error.message);
    }
    
    // 测试formatDate
    try {
        const formattedDate = Common.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');
        console.log('✓ formatDate 测试通过: 当前日期 ->', formattedDate);
    } catch (error) {
        console.error('✗ formatDate 测试失败:', error.message);
    }
    
    // 测试debounce
    try {
        const debouncedFn = Common.debounce(() => console.log('Debounced function called'), 100);
        debouncedFn();
        console.log('✓ debounce 测试通过: 函数已创建');
    } catch (error) {
        console.error('✗ debounce 测试失败:', error.message);
    }
    
    // 测试throttle
    try {
        const throttledFn = Common.throttle(() => console.log('Throttled function called'), 100);
        throttledFn();
        console.log('✓ throttle 测试通过: 函数已创建');
    } catch (error) {
        console.error('✗ throttle 测试失败:', error.message);
    }
    
    // 测试deepClone
    try {
        const original = { name: 'test', arr: [1, 2, 3] };
        const cloned = Common.deepClone(original);
        console.log('✓ deepClone 测试通过: 克隆对象', cloned);
    } catch (error) {
        console.error('✗ deepClone 测试失败:', error.message);
    }
    
    // 测试showToast
    try {
        Common.showToast('测试成功提示', 'success', 2000);
        console.log('✓ showToast 测试通过: 成功提示已显示');
    } catch (error) {
        console.error('✗ showToast 测试失败:', error.message);
    }
    
    // 测试toggleMenu (通过检查是否能执行而不报错)
    try {
        Common.toggleMenu();
        console.log('✓ toggleMenu 测试通过: 函数已执行');
    } catch (error) {
        console.error('✗ toggleMenu 测试失败:', error.message);
    }
    
    console.log('测试完成！请检查控制台输出和页面效果。');
}

// 等待页面加载完成后执行测试
window.addEventListener('DOMContentLoaded', function() {
    // 给toggleMenu函数添加一些延迟，确保菜单DOM已经加载
    setTimeout(function() {
        testCommonFunctions();
    }, 500);
});