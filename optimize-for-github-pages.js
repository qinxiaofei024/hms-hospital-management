const fs = require('fs');
const path = require('path');

// 项目根目录
const projectRoot = __dirname;

// 需要处理的文件类型
const fileExtensions = ['.html', '.css', '.js'];

// 需要排除的目录和文件
const excludeDirs = [
    'node_modules',
    '.git',
    '_site',
    '.jekyll-cache',
    'tools',
    'mirrors',
    '.github'
];

const excludeFiles = [
    'fix_responsive_batch.js',
    'fix_inline_styles.js',
    'test_responsive_pages.js',
    'optimize-for-github-pages.js',
    'responsive-test-report.json'
];

// 路径映射规则
const pathMappings = {
    // pages目录下的文件引用根目录资源
    '../css/': './css/',
    '../js/': './js/',
    '../images/': './images/',
    '../components/': './components/',
    '../data/': './data/',
    '../index.html': './index.html',
    
    // 根目录文件引用
    'css/': './css/',
    'js/': './js/',
    'images/': './images/',
    'components/': './components/',
    'data/': './data/'
};

// 获取所有需要处理的文件
function getAllFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            // 跳过排除的目录
            if (!excludeDirs.includes(file)) {
                getAllFiles(filePath, fileList);
            }
        } else {
            // 检查文件扩展名和排除列表
            const ext = path.extname(file);
            if (fileExtensions.includes(ext) && !excludeFiles.includes(file)) {
                fileList.push(filePath);
            }
        }
    });
    
    return fileList;
}

// 处理HTML文件中的路径
function processHtmlFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // 处理href和src属性
    const patterns = [
        /href=["']([^"']*?)["']/g,
        /src=["']([^"']*?)["']/g
    ];
    
    patterns.forEach(pattern => {
        content = content.replace(pattern, (match, url) => {
            // 跳过外部链接和锚点
            if (url.startsWith('http') || url.startsWith('#') || url.startsWith('mailto:')) {
                return match;
            }
            
            // 应用路径映射
            for (const [oldPath, newPath] of Object.entries(pathMappings)) {
                if (url.includes(oldPath)) {
                    const newUrl = url.replace(oldPath, newPath);
                    modified = true;
                    return match.replace(url, newUrl);
                }
            }
            
            return match;
        });
    });
    
    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ 已优化: ${path.relative(projectRoot, filePath)}`);
        return true;
    }
    
    return false;
}

// 处理CSS文件中的路径
function processCssFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // 处理url()引用
    const urlPattern = /url\(['"]?([^'"]*?)['"]?\)/g;
    
    content = content.replace(urlPattern, (match, url) => {
        // 跳过外部链接和data URLs
        if (url.startsWith('http') || url.startsWith('data:')) {
            return match;
        }
        
        // 应用路径映射
        for (const [oldPath, newPath] of Object.entries(pathMappings)) {
            if (url.includes(oldPath)) {
                const newUrl = url.replace(oldPath, newPath);
                modified = true;
                return match.replace(url, newUrl);
            }
        }
        
        return match;
    });
    
    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ 已优化: ${path.relative(projectRoot, filePath)}`);
        return true;
    }
    
    return false;
}

// 主处理函数
function optimizeForGitHubPages() {
    console.log('🚀 开始优化项目结构以适配GitHub Pages...\n');
    
    const allFiles = getAllFiles(projectRoot);
    let processedCount = 0;
    let modifiedCount = 0;
    
    allFiles.forEach(filePath => {
        const ext = path.extname(filePath);
        let wasModified = false;
        
        try {
            if (ext === '.html') {
                wasModified = processHtmlFile(filePath);
            } else if (ext === '.css') {
                wasModified = processCssFile(filePath);
            }
            
            processedCount++;
            if (wasModified) {
                modifiedCount++;
            }
        } catch (error) {
            console.error(`❌ 处理文件失败: ${path.relative(projectRoot, filePath)}`);
            console.error(`   错误: ${error.message}`);
        }
    });
    
    console.log(`\n📊 优化完成统计:`);
    console.log(`   处理文件总数: ${processedCount}`);
    console.log(`   修改文件数量: ${modifiedCount}`);
    console.log(`   成功率: ${((modifiedCount / processedCount) * 100).toFixed(1)}%`);
    
    // 生成优化报告
    const report = {
        timestamp: new Date().toISOString(),
        summary: {
            totalFiles: processedCount,
            modifiedFiles: modifiedCount,
            successRate: `${((modifiedCount / processedCount) * 100).toFixed(1)}%`
        },
        pathMappings: pathMappings,
        excludedDirs: excludeDirs,
        excludedFiles: excludeFiles
    };
    
    fs.writeFileSync(
        path.join(projectRoot, 'github-pages-optimization-report.json'),
        JSON.stringify(report, null, 2),
        'utf8'
    );
    
    console.log(`\n📋 优化报告已生成: github-pages-optimization-report.json`);
    console.log(`\n✨ 项目已优化完成，可以部署到GitHub Pages！`);
}

// 运行优化
if (require.main === module) {
    optimizeForGitHubPages();
}

module.exports = { optimizeForGitHubPages };