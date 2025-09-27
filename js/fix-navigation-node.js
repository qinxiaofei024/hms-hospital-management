// Node.js版本的批量修复脚本
const fs = require('fs');
const path = require('path');

class NavigationFixer {
    constructor() {
        this.pages = [
            'data-asset.html',
            'data-integration.html',
            'economic-operation.html',
            'economic-benefit.html',
            'performance-management.html',
            'realtime-monitoring.html',
            'operation-command.html',
            'operation-report.html',
            'medical-service.html',
            'department-analysis.html',
            'medical-imaging.html',
            'anesthesia-icu.html',
            'ultrasound.html',
            'nuclear-medicine.html',
            'medical-laboratory.html',
            'endoscopy.html',
            'pathology.html',
            'department-cockpit.html',
            'department-cost.html',
            'department-disease.html',
            'department-report.html',
            'department-resource.html',
            'department-revenue.html',
            'department-service.html',
            'key-indicators.html',
            'mobile-operation.html',
            'ai-assistant.html',
            'chart-diagnostics.html',
            'command-system.html'
        ];
        
        this.pagesDirectory = path.join(__dirname, '..', 'pages');
    }

    // 修复单个页面
    fixPage(pageName) {
        try {
            const pagePath = path.join(this.pagesDirectory, pageName);
            
            // 检查文件是否存在
            if (!fs.existsSync(pagePath)) {
                console.warn(`页面不存在: ${pageName}`);
                return false;
            }
            
            // 读取文件内容
            let html = fs.readFileSync(pagePath, 'utf8');
            
            // 1. 移除硬编码的导航栏
            html = this.removeHardcodedNavigation(html);
            
            // 2. 添加统一导航容器
            html = this.addNavigationContainer(html);
            
            // 3. 添加导航加载脚本
            html = this.addNavigationScript(html);
            
            // 4. 保存修复后的文件
            fs.writeFileSync(pagePath, html, 'utf8');
            
            console.log(`✅ 已修复: ${pageName}`);
            return true;
            
        } catch (error) {
            console.error(`❌ 修复页面失败 ${pageName}:`, error.message);
            return false;
        }
    }

    // 移除硬编码的导航栏
    removeHardcodedNavigation(html) {
        // 移除顶部导航栏
        html = html.replace(/<header[^>]*header[^>]*>[\s\S]*?<\/header>/gi, '');
        
        // 移除左侧菜单
        html = html.replace(/<aside[^>]*sidebar[^>]*>[\s\S]*?<\/aside>/gi, '');
        
        // 移除任何其他导航元素
        html = html.replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '');
        html = html.replace(/<div[^>]*navigation[^>]*>[\s\S]*?<\/div>/gi, '');
        
        return html;
    }

    // 添加统一导航容器
    addNavigationContainer(html) {
        const bodyTag = html.indexOf('<body>');
        if (bodyTag !== -1) {
            const insertionPoint = bodyTag + 6; // 在 <body> 标签后插入
            return html.slice(0, insertionPoint) + 
                   '\n    <!-- 统一导航组件 -->\n    <div id="navigation-container"></div>\n' + 
                   html.slice(insertionPoint);
        }
        return html;
    }

    // 添加导航加载脚本
    addNavigationScript(html) {
        const bodyEnd = html.indexOf('</body>');
        if (bodyEnd !== -1) {
            return html.slice(0, bodyEnd) + 
                   '\n    <!-- 加载统一导航组件 -->\n    <script src="../js/navigation-loader.js"></script>\n' + 
                   html.slice(bodyEnd);
        }
        return html;
    }

    // 批量修复所有页面
    fixAllPages() {
        console.log('🚀 开始批量修复页面导航栏...\n');
        
        let successCount = 0;
        let failCount = 0;
        
        for (const page of this.pages) {
            const success = this.fixPage(page);
            
            if (success) {
                successCount++;
            } else {
                failCount++;
            }
        }
        
        console.log(`\n📊 修复完成:`);
        console.log(`✅ 成功: ${successCount} 个页面`);
        console.log(`❌ 失败: ${failCount} 个页面`);
        
        if (failCount === 0) {
            console.log('🎉 所有页面导航栏已统一修复！');
        } else {
            console.log('⚠️  部分页面修复失败，请检查错误信息');
        }
        
        return { successCount, failCount };
    }

    // 检查页面是否存在
    checkPageExists(pageName) {
        const pagePath = path.join(this.pagesDirectory, pageName);
        return fs.existsSync(pagePath);
    }

    // 生成修复报告
    generateReport() {
        const existingPages = this.pages.filter(page => this.checkPageExists(page));
        return {
            totalPages: this.pages.length,
            existingPages: existingPages.length,
            missingPages: this.pages.length - existingPages.length,
            timestamp: new Date().toISOString()
        };
    }
}

// 创建修复器实例并运行
const fixer = new NavigationFixer();

// 显示报告
console.log('📋 页面检查报告:');
const report = fixer.generateReport();
console.log(`总页面数: ${report.totalPages}`);
console.log(`现有页面: ${report.existingPages}`);
console.log(`缺失页面: ${report.missingPages}`);

// 开始修复
console.log('\n' + '='.repeat(50));
fixer.fixAllPages();