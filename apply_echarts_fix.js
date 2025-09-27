// 批量应用ECharts增强版诊断工具到所有页面
// 这个脚本会为所有包含ECharts的页面添加增强版诊断工具

const fs = require('fs');
const path = require('path');

// 需要应用修复的页面列表
const pagesToFix = [
    'nuclear-medicine.html',
    'medical-laboratory.html', 
    'ultrasound.html',
    'endoscopy.html',
    'department-cockpit.html',
    'department-service.html',
    'data-integration.html',
    'real-time-monitor.html',
    'key-indicators.html',
    'anesthesia-icu.html',
    'operation-report.html',
    'command-system.html',
    'department-revenue.html',
    'department-report.html',
    'data-asset.html',
    'economic-operation.html',
    'mobile-operation.html',
    'department-resource.html',
    'department-disease.html',
    'department-cost.html'
];

// 诊断工具引入代码
const diagnosticToolImport = `    <!-- ECharts增强版诊断工具 -->
    <script src="../js/echarts-diagnostics-enhanced.js"></script>`;

// 自动修复脚本模板
const autoFixScript = (pageName) => `    
    <!-- 自动修复ECharts图表 -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(function() {
                if (typeof window.fixEChartsCharts === 'function') {
                    console.log('[${pageName}] 启动ECharts增强版诊断修复...');
                    window.fixEChartsCharts().then(function() {
                        console.log('[${pageName}] ECharts图表修复完成');
                    }).catch(function(error) {
                        console.error('[${pageName}] ECharts图表修复失败:', error);
                    });
                } else {
                    console.log('[${pageName}] ECharts增强版诊断工具未加载');
                }
            }, 1000);
        });
    </script>`;

// 处理单个页面
function processPage(filename) {
    const filePath = path.join(__dirname, 'hms', 'pages', filename);
    
    if (!fs.existsSync(filePath)) {
        console.log(`跳过不存在的文件: ${filename}`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 检查是否已经包含诊断工具
    if (content.includes('echarts-diagnostics-enhanced.js')) {
        console.log(`${filename} 已包含诊断工具，跳过`);
        return;
    }
    
    // 检查是否包含ECharts
    if (!content.includes('echarts')) {
        console.log(`${filename} 不包含ECharts，跳过`);
        return;
    }
    
    const pageName = filename.replace('.html', '').split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join('');
    
    // 在ECharts引入后添加诊断工具
    content = content.replace(
        /(<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/echarts@[^"]+"><\/script>)/,
        `$1\n${diagnosticToolImport}`
    );
    
    // 在navigation-loader.js后添加自动修复脚本
    content = content.replace(
        /(<script src="\.\.\/js\/navigation-loader\.js"><\/script>)/,
        `$1${autoFixScript(pageName)}`
    );
    
    // 如果没有navigation-loader.js，在</body>前添加
    if (!content.includes('navigation-loader.js')) {
        content = content.replace(
            /(<\/body>)/,
            `${autoFixScript(pageName)}\n$1`
        );
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ 已处理: ${filename}`);
}

// 批量处理所有页面
console.log('开始批量应用ECharts增强版诊断工具...');
pagesToFix.forEach(processPage);
console.log('批量处理完成！');