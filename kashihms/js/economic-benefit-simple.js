/**
 * 极简版经济效益分析图表初始化脚本
 * 目的：排除复杂类结构干扰，直接测试图表显示功能
 */

// 确保DOM完全加载后执行
window.addEventListener('load', function() {
    console.log('=== 极简版经济效益分析脚本启动 ===');
    
    // 简化的日志函数
    function log(message, type = 'info') {
        const logPrefix = {
            info: 'ℹ️',
            success: '✅',
            error: '❌',
            warn: '⚠️'
        };
        console.log(`${logPrefix[type] || 'ℹ️'} ${message}`);
        
        // 尝试显示在调试控制台
        const debugConsole = document.getElementById('debug-console');
        if (debugConsole) {
            const logElement = document.createElement('div');
            logElement.className = `log-entry log-${type}`;
            logElement.textContent = `${new Date().toLocaleTimeString()} ${message}`;
            debugConsole.appendChild(logElement);
            debugConsole.scrollTop = debugConsole.scrollHeight;
        }
    }
    
    // 检查ECharts库是否加载
    function checkECharts() {
        if (typeof echarts !== 'undefined') {
            log('ECharts库加载成功', 'success');
            return true;
        } else {
            log('ECharts库未加载，请检查CDN链接', 'error');
            // 尝试重新加载ECharts
            loadEChartsFallback();
            return false;
        }
    }
    
    // 备用ECharts加载方法
    function loadEChartsFallback() {
        log('尝试加载备用ECharts库', 'warn');
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js';
        script.onload = function() {
            log('备用ECharts库加载成功', 'success');
            initAllCharts();
        };
        script.onerror = function() {
            log('备用ECharts库加载失败', 'error');
        };
        document.head.appendChild(script);
    }
    
    // 创建简单的折线图
    function createLineChart(chartDom, title) {
        if (!chartDom) {
            log(`未找到图表容器: ${chartDom}`, 'error');
            return null;
        }
        
        // 确保容器有尺寸
        if (!chartDom.style.width) chartDom.style.width = '100%';
        if (!chartDom.style.height) chartDom.style.height = '400px';
        
        log(`正在创建${title}图表`);
        
        try {
            const chart = echarts.init(chartDom);
            
            const option = {
                title: {
                    text: title,
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['收入', '支出', '结余'],
                    bottom: 10
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '15%',
                    top: '15%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                },
                yAxis: {
                    type: 'value',
                    name: '金额 (万元)'
                },
                series: [
                    {
                        name: '收入',
                        type: 'line',
                        stack: 'Total',
                        data: [1200, 1900, 3000, 2400, 2800, 3500, 3900, 4200, 4800, 5300, 5800, 6200],
                        itemStyle: { color: '#5470c6' }
                    },
                    {
                        name: '支出',
                        type: 'line',
                        stack: 'Total',
                        data: [900, 1500, 2300, 1900, 2200, 2800, 3100, 3400, 3900, 4300, 4700, 5100],
                        itemStyle: { color: '#91cc75' }
                    },
                    {
                        name: '结余',
                        type: 'line',
                        data: [300, 400, 700, 500, 600, 700, 800, 800, 900, 1000, 1100, 1100],
                        itemStyle: { color: '#ee6666' }
                    }
                ]
            };
            
            chart.setOption(option);
            log(`${title}图表创建成功`, 'success');
            
            // 响应窗口大小变化
            window.addEventListener('resize', function() {
                chart.resize();
            });
            
            return chart;
        } catch (error) {
            log(`${title}图表创建失败: ${error.message}`, 'error');
            return null;
        }
    }
    
    // 创建简单的饼图
    function createPieChart(chartDom, title) {
        if (!chartDom) {
            log(`未找到图表容器: ${chartDom}`, 'error');
            return null;
        }
        
        // 确保容器有尺寸
        if (!chartDom.style.width) chartDom.style.width = '100%';
        if (!chartDom.style.height) chartDom.style.height = '400px';
        
        log(`正在创建${title}图表`);
        
        try {
            const chart = echarts.init(chartDom);
            
            const option = {
                title: {
                    text: title,
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    bottom: 10,
                    top: 'center'
                },
                series: [
                    {
                        name: '科室收益',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 30,
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            { value: 3500, name: '内科' },
                            { value: 2800, name: '外科' },
                            { value: 2200, name: '妇产科' },
                            { value: 1800, name: '儿科' },
                            { value: 1500, name: '骨科' },
                            { value: 1200, name: '眼科' },
                            { value: 1000, name: '其他科室' }
                        ]
                    }
                ]
            };
            
            chart.setOption(option);
            log(`${title}图表创建成功`, 'success');
            
            // 响应窗口大小变化
            window.addEventListener('resize', function() {
                chart.resize();
            });
            
            return chart;
        } catch (error) {
            log(`${title}图表创建失败: ${error.message}`, 'error');
            return null;
        }
    }
    
    // 初始化所有图表
    function initAllCharts() {
        if (!checkECharts()) return;
        
        log('开始初始化图表...');
        
        // 获取图表容器
        const overallTrendChart = document.getElementById('overall-trend-chart');
        const departmentBenefitChart = document.getElementById('department-benefit-chart');
        
        // 创建图表
        if (overallTrendChart) {
            createLineChart(overallTrendChart, '总体效益趋势分析');
        }
        
        if (departmentBenefitChart) {
            createPieChart(departmentBenefitChart, '各科室收益情况');
        }
        
        // 显示成功消息
        const successMessage = document.createElement('div');
        successMessage.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #52c41a;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        successMessage.innerHTML = '<span>✅</span> 图表初始化完成，请查看页面';
        document.body.appendChild(successMessage);
        
        // 3秒后自动隐藏消息
        setTimeout(() => {
            successMessage.style.transition = 'opacity 0.5s';
            successMessage.style.opacity = '0';
            setTimeout(() => successMessage.remove(), 500);
        }, 3000);
        
        log('图表初始化流程完成', 'success');
    }
    
    // 添加简单的标签切换功能
    function initTabNavigation() {
        const tabs = document.querySelectorAll('.tab-navigation button');
        const tabContents = document.querySelectorAll('.tab-content');
        
        if (tabs.length > 0 && tabContents.length > 0) {
            log('初始化标签切换功能');
            
            tabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    const tabId = this.getAttribute('data-tab');
                    
                    // 更新标签样式
                    tabs.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    
                    // 显示对应内容
                    tabContents.forEach(content => {
                        content.classList.remove('active');
                        if (content.id === tabId) {
                            content.classList.add('active');
                            
                            // 如果是切换到有图表的标签，尝试重新初始化
                            if (content.id === 'overall') {
                                setTimeout(initAllCharts, 100);
                            }
                        }
                    });
                    
                    log(`切换到标签: ${tab.textContent.trim()}`);
                });
            });
        }
    }
    
    // 主函数：延迟执行，确保DOM完全就绪
    function main() {
        log('页面DOM加载完成，准备初始化图表...');
        
        // 初始化标签导航
        initTabNavigation();
        
        // 初始化图表，确保ECharts已加载
        if (typeof Common !== 'undefined' && typeof Common.ensureEcharts === 'function') {
            try {
                Common.ensureEcharts();
            } catch (e) {
                console.warn('ensureEcharts 调用失败:', e);
            }
        }

        if (typeof echarts !== 'undefined') {
            initAllCharts();
        } else {
            const onReady = function() {
                document.removeEventListener('echartsLoaded', onReady);
                initAllCharts();
            };
            document.addEventListener('echartsLoaded', onReady);
        }
        
        // 额外的错误捕获
        window.addEventListener('error', function(e) {
            log(`全局错误: ${e.message} (${e.filename}:${e.lineno})`, 'error');
        });
        
        window.addEventListener('unhandledrejection', function(e) {
            log(`未处理的Promise拒绝: ${e.reason}`, 'error');
        });
    }
    
    // 启动主函数
    main();
    
    console.log('=== 极简版经济效益分析脚本加载完成 ===');
});