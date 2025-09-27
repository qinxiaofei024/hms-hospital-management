// 医疗管理系统全面测试脚本 - 测试链接可用性和数据完整性
console.log('开始医疗管理系统全面测试...');

// 定义测试配置
const testConfig = {
    // 测试左侧菜单链接
    menuLinks: [
        { name: '首页', url: 'index.html' },
        { name: '数据资产', url: 'pages/data-asset.html' },
        { name: '数据集成', url: 'pages/data-integration.html' },
        { name: '医学影像', url: 'pages/medical-imaging.html' },
        { name: '麻醉重症', url: 'pages/anesthesia-icu.html' },
        { name: '超声医学', url: 'pages/ultrasound.html' },
        { name: '移动运营', url: 'pages/mobile-operation.html' },
        { name: '智能助理', url: 'pages/ai-assistant.html' },
        { name: '指挥系统', url: 'pages/command-system.html' },
        { name: '运营报表', url: 'pages/operation-report.html' },
        { name: '实时监控', url: 'pages/real-time-monitor.html' },
        { name: '404页面', url: 'pages/404.html' }
    ],
    
    // 测试数据文件
    dataFiles: [
        { name: '首页数据', url: 'data/index.json' },
        { name: '数据资产数据', url: 'data/data-asset.json' },
        { name: '数据集成数据', url: 'data/data-integration.json' }
    ],
    
    // 测试CSS和JS文件
    resourceFiles: [
        { name: '样式文件', url: 'css/style.css' },
        { name: '通用JS', url: 'js/common.js' },
        { name: '首页JS', url: 'js/index.js' },
        { name: 'Logo文件', url: 'images/logo.svg' }
    ]
};

// 测试结果存储
const testResults = {
    passed: 0,
    failed: 0,
    details: []
};

// 执行链接测试
async function testLinks() {
    console.log('\n===== 开始链接可用性测试 =====');
    
    for (const link of testConfig.menuLinks) {
        try {
            const response = await fetch(link.url);
            if (response.ok) {
                testResults.passed++;
                console.log(`✅ ${link.name} (${link.url}) - 链接可访问`);
                testResults.details.push({ type: 'link', name: link.name, url: link.url, status: 'passed' });
            } else {
                testResults.failed++;
                console.log(`❌ ${link.name} (${link.url}) - 链接不可访问，状态码: ${response.status}`);
                testResults.details.push({ type: 'link', name: link.name, url: link.url, status: 'failed', error: `状态码: ${response.status}` });
            }
        } catch (error) {
            testResults.failed++;
            console.log(`❌ ${link.name} (${link.url}) - 链接测试失败: ${error.message}`);
            testResults.details.push({ type: 'link', name: link.name, url: link.url, status: 'failed', error: error.message });
        }
    }
}

// 执行数据文件测试
async function testDataFiles() {
    console.log('\n===== 开始数据文件测试 =====');
    
    for (const file of testConfig.dataFiles) {
        try {
            const response = await fetch(file.url);
            if (!response.ok) {
                testResults.failed++;
                console.log(`❌ ${file.name} (${file.url}) - 数据文件加载失败，状态码: ${response.status}`);
                testResults.details.push({ type: 'data', name: file.name, url: file.url, status: 'failed', error: `状态码: ${response.status}` });
                continue;
            }
            
            const data = await response.json();
            testResults.passed++;
            console.log(`✅ ${file.name} (${file.url}) - 数据文件加载成功`);
            
            // 特殊检查首页数据完整性
            if (file.url === 'data/index.json') {
                await testIndexDataIntegrity(data);
            }
            
            testResults.details.push({ type: 'data', name: file.name, url: file.url, status: 'passed' });
        } catch (error) {
            testResults.failed++;
            console.log(`❌ ${file.name} (${file.url}) - 数据文件测试失败: ${error.message}`);
            testResults.details.push({ type: 'data', name: file.name, url: file.url, status: 'failed', error: error.message });
        }
    }
}

// 测试首页数据完整性
async function testIndexDataIntegrity(data) {
    console.log('\n----- 测试首页数据完整性 -----');
    
    // 检查关键数据结构
    const requiredFields = [
        { path: 'patientLevel.ageDistribution', name: '患者年龄分布数据' },
        { path: 'surgeryLevel.typeDistribution', name: '手术类型分布数据' },
        { path: 'resourceLevel.departmentDistribution', name: '资源分布数据' },
        { path: 'equipmentLevel.typeDistribution', name: '设备分布数据' },
        { path: 'warningMessages', name: '预警信息数据' }
    ];
    
    for (const field of requiredFields) {
        try {
            const value = getNestedValue(data, field.path);
            if (value && Array.isArray(value) && value.length > 0) {
                testResults.passed++;
                console.log(`✅ ${field.name} - 数据结构完整`);
                testResults.details.push({ type: 'data-integrity', name: field.name, status: 'passed' });
            } else {
                testResults.failed++;
                console.log(`⚠️ ${field.name} - 数据为空或不完整`);
                testResults.details.push({ type: 'data-integrity', name: field.name, status: 'warning' });
            }
        } catch (error) {
            testResults.failed++;
            console.log(`❌ ${field.name} - 数据结构缺失: ${error.message}`);
            testResults.details.push({ type: 'data-integrity', name: field.name, status: 'failed', error: error.message });
        }
    }
}

// 测试资源文件
async function testResourceFiles() {
    console.log('\n===== 开始资源文件测试 =====');
    
    for (const resource of testConfig.resourceFiles) {
        try {
            const response = await fetch(resource.url);
            if (response.ok) {
                testResults.passed++;
                console.log(`✅ ${resource.name} (${resource.url}) - 资源文件可访问`);
                testResults.details.push({ type: 'resource', name: resource.name, url: resource.url, status: 'passed' });
            } else {
                testResults.failed++;
                console.log(`❌ ${resource.name} (${resource.url}) - 资源文件不可访问，状态码: ${response.status}`);
                testResults.details.push({ type: 'resource', name: resource.name, url: resource.url, status: 'failed', error: `状态码: ${response.status}` });
            }
        } catch (error) {
            testResults.failed++;
            console.log(`❌ ${resource.name} (${resource.url}) - 资源文件测试失败: ${error.message}`);
            testResults.details.push({ type: 'resource', name: resource.name, url: resource.url, status: 'failed', error: error.message });
        }
    }
}

// 辅助函数：获取嵌套对象值
function getNestedValue(obj, path) {
    const keys = path.split('.');
    return keys.reduce((acc, key) => {
        if (acc === undefined || acc === null) {
            throw new Error(`路径 ${path} 中的键 ${key} 不存在`);
        }
        return acc[key];
    }, obj);
}

// 生成测试报告
function generateTestReport() {
    console.log('\n===== 测试报告总结 =====');
    console.log(`总测试项: ${testResults.passed + testResults.failed}`);
    console.log(`通过: ${testResults.passed}`);
    console.log(`失败: ${testResults.failed}`);
    
    if (testResults.failed > 0) {
        console.log('\n❌ 发现问题列表:');
        const failedTests = testResults.details.filter(test => test.status === 'failed' || test.status === 'warning');
        failedTests.forEach(test => {
            console.log(`  - ${test.name} (${test.type}): ${test.error || '数据不完整'}`);
        });
    }
    
    console.log('\n测试完成！');
    
    // 将测试结果保存到localStorage，以便在HTML页面中显示
    try {
        localStorage.setItem('hmsTestResults', JSON.stringify(testResults));
    } catch (e) {
        console.log('无法保存测试结果到localStorage');
    }
    
    // 触发自定义事件，通知HTML页面测试已完成
    const event = new CustomEvent('testComplete', { detail: testResults });
    window.dispatchEvent(event);
}

// 主测试函数
async function runAllTests() {
    await testLinks();
    await testResourceFiles();
    await testDataFiles();
    generateTestReport();
}

// 导出函数供外部调用
window.HMSTest = {
    runAllTests: runAllTests,
    testResults: testResults
};

// 运行测试
runAllTests();