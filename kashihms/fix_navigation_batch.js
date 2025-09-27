// 批量修复导航栏脚本
const fs = require('fs');
const path = require('path');

// 需要修复的页面列表
const pagesToFix = [
    'endoscopy.html',
    'nuclear-medicine.html',
    'medical-laboratory.html',
    'medical-imaging.html',
    'ultrasound.html',
    'operation-report.html',
    'mobile-operation.html',
    'economic-benefit.html',
    'department-report.html',
    'department-revenue.html',
    'command-system.html'
];

// 使用相对当前脚本所在目录的 pages 文件夹，避免硬编码到 /kashihms/
const pagesDir = path.join(__dirname, 'pages');

function fixNavigationInFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 查找并替换硬编码导航部分
        const startPattern = /<!-- 统一导航组件 -->\s*<div id="navigation-container"><\/div>\s*<div class="container">\s*<!-- 顶部导航栏 -->/;
        const endPattern = /<!-- 右侧内容区 -->/;
        
        if (startPattern.test(content)) {
            // 找到开始位置
            const startMatch = content.match(startPattern);
            const startIndex = startMatch.index + startMatch[0].length;
            
            // 找到结束位置
            const endMatch = content.match(endPattern);
            if (endMatch) {
                const endIndex = endMatch.index;
                
                // 提取需要保留的部分
                const beforeNav = content.substring(0, startMatch.index);
                const afterContent = content.substring(endIndex);
                
                // 构建新的内容
                const newContent = beforeNav + 
                    `<!-- 统一导航组件 -->
    <div id="navigation-container"></div>

    <!-- 主要内容区域 -->
    <div class="main-content" style="margin-left: 0;">
        <div class="content-wrapper" style="margin-left: 240px;">
            ` + afterContent;
                
                // 修复结尾的div结构
                const fixedContent = newContent.replace(
                    /(\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*)(<!-- 加载统一导航组件 -->)/,
                    '$1\n    $2'
                );
                
                fs.writeFileSync(filePath, fixedContent, 'utf8');
                console.log(`✅ 修复完成: ${path.basename(filePath)}`);
                return true;
            }
        }
        
        console.log(`⚠️  未找到匹配模式: ${path.basename(filePath)}`);
        return false;
    } catch (error) {
        console.error(`❌ 修复失败: ${path.basename(filePath)} - ${error.message}`);
        return false;
    }
}

// 执行批量修复
console.log('开始批量修复导航栏...\n');

let successCount = 0;
let totalCount = pagesToFix.length;

pagesToFix.forEach(pageFile => {
    const filePath = path.join(pagesDir, pageFile);
    if (fs.existsSync(filePath)) {
        if (fixNavigationInFile(filePath)) {
            successCount++;
        }
    } else {
        console.log(`⚠️  文件不存在: ${pageFile}`);
    }
});

console.log(`\n修复完成! 成功: ${successCount}/${totalCount}`);