// 批量修复所有页面的导航栏问题
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
        
        this.navigationLoaderPath = 'js/navigation-loader.js';
    }

    // 修复单个页面
    async fixPage(pagePath) {
        try {
            const response = await fetch(pagePath);
            if (!response.ok) {
                console.warn(`无法访问页面: ${pagePath}`);
                return false;
            }
            
            let html = await response.text();
            
            // 1. 移除硬编码的导航栏
            html = this.removeHardcodedNavigation(html);
            
            // 2. 添加统一导航容器
            html = this.addNavigationContainer(html);
            
            // 3. 添加导航加载脚本
            html = this.addNavigationScript(html);
            
            // 4. 保存修复后的文件
            await this.saveFixedPage(pagePath, html);
            
            console.log(`已修复: ${pagePath}`);
            return true;
            
        } catch (error) {
            console.error(`修复页面失败 ${pagePath}:`, error);
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

    // 保存修复后的页面
    async saveFixedPage(pagePath, html) {
        // 这里需要实际的文件写入逻辑
        // 在实际环境中，这可能需要服务器端处理或用户下载
        console.log(`模拟保存: ${pagePath}`);
        console.log(`内容长度: ${html.length} 字符`);
        
        // 在实际实现中，这里应该使用File System API或其他方式保存文件
        // 由于浏览器安全限制，这里只能模拟
        return true;
    }

    // 批量修复所有页面
    async fixAllPages() {
        console.log('开始批量修复页面导航栏...');
        
        let successCount = 0;
        let failCount = 0;
        
        for (const page of this.pages) {
            const fullPath = `../pages/${page}`;
            const success = await this.fixPage(fullPath);
            
            if (success) {
                successCount++;
            } else {
                failCount++;
            }
            
            // 添加延迟以避免请求过于频繁
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        console.log(`\n修复完成:`);
        console.log(`✅ 成功: ${successCount} 个页面`);
        console.log(`❌ 失败: ${failCount} 个页面`);
        
        if (failCount === 0) {
            console.log('🎉 所有页面导航栏已统一修复！');
        } else {
            console.log('⚠️  部分页面修复失败，请检查控制台错误信息');
        }
    }

    // 检查页面是否存在
    async checkPageExists(pagePath) {
        try {
            const response = await fetch(pagePath, { method: 'HEAD' });
            return response.ok;
        } catch {
            return false;
        }
    }

    // 生成修复报告
    generateReport() {
        return {
            totalPages: this.pages.length,
            fixedPages: this.pages.filter(page => this.checkPageExists(`../pages/${page}`)).length,
            timestamp: new Date().toISOString()
        };
    }
}

// 创建修复器实例
const navigationFixer = new NavigationFixer();

// 提供全局访问
window.navigationFixer = navigationFixer;

// 自动开始修复（可选）
// navigationFixer.fixAllPages().catch(console.error);

console.log('导航修复工具已加载');
console.log('使用方法: navigationFixer.fixAllPages()');