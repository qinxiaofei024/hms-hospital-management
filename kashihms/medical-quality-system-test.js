// 医疗质量安全监测系统功能测试脚本
// 测试所有6个页面的核心功能

class MedicalQualitySystemTest {
    constructor() {
        this.testResults = [];
        this.pages = [
            {
                name: '诊疗流程监测',
                url: 'pages/diagnosis-treatment-process.html',
                chartId: 'diagnosisChart'
            },
            {
                name: '手术质量安全监测',
                url: 'pages/surgical-quality-safety.html',
                chartId: 'surgicalChart'
            },
            {
                name: '护理质量监测',
                url: 'pages/nursing-quality-monitoring.html',
                chartId: 'nursingChart'
            },
            {
                name: '危重病例管理',
                url: 'pages/critical-case-management.html',
                chartId: 'criticalChart'
            },
            {
                name: '药事与血液管理',
                url: 'pages/medication-blood-management.html',
                chartId: 'medicationChart'
            },
            {
                name: '技术创新与质量提升',
                url: 'pages/technology-innovation-quality.html',
                chartId: 'technologyChart'
            }
        ];
    }

    // 添加测试结果
    addResult(test, status, message) {
        this.testResults.push({
            test,
            status,
            message,
            timestamp: new Date().toISOString()
        });
        console.log(`[${status}] ${test}: ${message}`);
    }

    // 测试页面加载
    async testPageLoad(page) {
        try {
            // 检查页面标题
            if (document.title.includes(page.name)) {
                this.addResult(`${page.name} - 页面标题`, 'PASS', '页面标题正确');
            } else {
                this.addResult(`${page.name} - 页面标题`, 'FAIL', '页面标题不匹配');
            }

            // 检查导航容器
            const navContainer = document.getElementById('navigation-container');
            if (navContainer) {
                this.addResult(`${page.name} - 导航容器`, 'PASS', '导航容器存在');
            } else {
                this.addResult(`${page.name} - 导航容器`, 'FAIL', '导航容器不存在');
            }

            // 检查统计卡片
            const statCards = document.querySelectorAll('.stat-card');
            if (statCards.length > 0) {
                this.addResult(`${page.name} - 统计卡片`, 'PASS', `找到 ${statCards.length} 个统计卡片`);
            } else {
                this.addResult(`${page.name} - 统计卡片`, 'FAIL', '未找到统计卡片');
            }

            // 检查图表容器
            const chartContainer = document.getElementById(page.chartId);
            if (chartContainer) {
                this.addResult(`${page.name} - 图表容器`, 'PASS', '图表容器存在');
            } else {
                this.addResult(`${page.name} - 图表容器`, 'FAIL', '图表容器不存在');
            }

            // 检查表格
            const tables = document.querySelectorAll('.quality-table');
            if (tables.length > 0) {
                this.addResult(`${page.name} - 数据表格`, 'PASS', `找到 ${tables.length} 个数据表格`);
            } else {
                this.addResult(`${page.name} - 数据表格`, 'FAIL', '未找到数据表格');
            }

        } catch (error) {
            this.addResult(`${page.name} - 页面加载`, 'ERROR', error.message);
        }
    }

    // 测试JavaScript组件
    async testJavaScriptComponents() {
        try {
            // 检查NavigationLoader
            if (typeof NavigationLoader !== 'undefined') {
                this.addResult('JavaScript组件 - NavigationLoader', 'PASS', 'NavigationLoader类已定义');
            } else {
                this.addResult('JavaScript组件 - NavigationLoader', 'FAIL', 'NavigationLoader类未定义');
            }

            // 检查全局navigationLoader实例
            if (window.navigationLoader) {
                this.addResult('JavaScript组件 - navigationLoader实例', 'PASS', '全局实例存在');
            } else {
                this.addResult('JavaScript组件 - navigationLoader实例', 'FAIL', '全局实例不存在');
            }

            // 检查MedicalQualityComponents
            if (typeof MedicalQualityComponents !== 'undefined') {
                this.addResult('JavaScript组件 - MedicalQualityComponents', 'PASS', 'MedicalQualityComponents类已定义');
            } else {
                this.addResult('JavaScript组件 - MedicalQualityComponents', 'FAIL', 'MedicalQualityComponents类未定义');
            }

            // 检查MedicalCharts
            if (window.medicalCharts) {
                this.addResult('JavaScript组件 - MedicalCharts', 'PASS', 'MedicalCharts实例存在');
            } else {
                this.addResult('JavaScript组件 - MedicalCharts', 'FAIL', 'MedicalCharts实例不存在');
            }

            // 检查ECharts
            if (typeof echarts !== 'undefined') {
                this.addResult('JavaScript组件 - ECharts', 'PASS', 'ECharts库已加载');
            } else {
                this.addResult('JavaScript组件 - ECharts', 'FAIL', 'ECharts库未加载');
            }

        } catch (error) {
            this.addResult('JavaScript组件测试', 'ERROR', error.message);
        }
    }

    // 测试交互功能
    async testInteractivity() {
        try {
            // 测试统计卡片点击
            const statCards = document.querySelectorAll('.stat-card');
            if (statCards.length > 0) {
                const firstCard = statCards[0];
                firstCard.click();
                this.addResult('交互功能 - 统计卡片点击', 'PASS', '统计卡片可点击');
            }

            // 测试表格行点击
            const tableRows = document.querySelectorAll('.quality-table tbody tr');
            if (tableRows.length > 0) {
                const firstRow = tableRows[0];
                firstRow.click();
                this.addResult('交互功能 - 表格行点击', 'PASS', '表格行可点击');
            }

            // 测试窗口调整大小
            if (window.medicalCharts && typeof window.medicalCharts.resizeAllCharts === 'function') {
                window.medicalCharts.resizeAllCharts();
                this.addResult('交互功能 - 图表响应式', 'PASS', '图表支持响应式调整');
            }

        } catch (error) {
            this.addResult('交互功能测试', 'ERROR', error.message);
        }
    }

    // 生成测试报告
    generateReport() {
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(r => r.status === 'PASS').length;
        const failedTests = this.testResults.filter(r => r.status === 'FAIL').length;
        const errorTests = this.testResults.filter(r => r.status === 'ERROR').length;

        const report = {
            summary: {
                total: totalTests,
                passed: passedTests,
                failed: failedTests,
                errors: errorTests,
                successRate: ((passedTests / totalTests) * 100).toFixed(2) + '%'
            },
            details: this.testResults
        };

        console.log('=== 医疗质量安全监测系统测试报告 ===');
        console.log(`总测试数: ${totalTests}`);
        console.log(`通过: ${passedTests}`);
        console.log(`失败: ${failedTests}`);
        console.log(`错误: ${errorTests}`);
        console.log(`成功率: ${report.summary.successRate}`);
        console.log('=====================================');

        return report;
    }

    // 运行所有测试
    async runAllTests() {
        console.log('开始运行医疗质量安全监测系统测试...');
        
        // 获取当前页面信息
        const currentPage = this.pages.find(page => 
            window.location.pathname.includes(page.url.replace('pages/', ''))
        );

        if (currentPage) {
            console.log(`当前页面: ${currentPage.name}`);
            await this.testPageLoad(currentPage);
        }

        await this.testJavaScriptComponents();
        await this.testInteractivity();

        return this.generateReport();
    }
}

// 自动运行测试（如果页面已加载）
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            const tester = new MedicalQualitySystemTest();
            window.medicalQualityTester = tester;
            tester.runAllTests();
        }, 2000); // 等待2秒确保所有组件加载完成
    });
} else {
    setTimeout(() => {
        const tester = new MedicalQualitySystemTest();
        window.medicalQualityTester = tester;
        tester.runAllTests();
    }, 1000);
}

// 导出测试类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MedicalQualitySystemTest;
}