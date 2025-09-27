// 经济效益分析页面图表修复脚本
// 这个简化版本专注于直接初始化图表，解决图表不显示的问题

// 简单的日志函数
function log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const logText = `[EconomicBenefitFix] ${timestamp} - ${message}`;
    
    // 输出到控制台
    if (type === 'error') {
        console.error(logText);
    } else if (type === 'warn') {
        console.warn(logText);
    } else {
        console.log(logText);
    }
    
    // 在页面上显示日志（可选）
    showLogOnPage(logText, type);
}

// 在页面上显示日志
function showLogOnPage(message, type) {
    try {
        // 检查是否已存在日志容器，如果没有则创建
        let logContainer = document.getElementById('economic-benefit-logs');
        if (!logContainer) {
            logContainer = document.createElement('div');
            logContainer.id = 'economic-benefit-logs';
            logContainer.style.position = 'fixed';
            logContainer.style.bottom = '20px';
            logContainer.style.right = '20px';
            logContainer.style.width = '400px';
            logContainer.style.maxHeight = '300px';
            logContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            logContainer.style.color = 'white';
            logContainer.style.padding = '15px';
            logContainer.style.borderRadius = '5px';
            logContainer.style.overflowY = 'auto';
            logContainer.style.zIndex = '10000';
            logContainer.style.fontFamily = 'monospace';
            logContainer.style.fontSize = '12px';
            logContainer.innerHTML = '<div style="font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid white; padding-bottom: 5px;">图表加载日志</div>';
            document.body.appendChild(logContainer);
        }
        
        // 创建日志条目
        const logEntry = document.createElement('div');
        logEntry.style.marginBottom = '5px';
        logEntry.style.padding = '3px 0';
        
        // 设置颜色
        if (type === 'error') {
            logEntry.style.color = '#ff6b6b';
        } else if (type === 'success') {
            logEntry.style.color = '#4ecdc4';
        } else if (type === 'warn') {
            logEntry.style.color = '#ffd166';
        }
        
        logEntry.textContent = message;
        logContainer.appendChild(logEntry);
        
        // 滚动到底部
        logContainer.scrollTop = logContainer.scrollHeight;
    } catch (e) {
        // 如果日志显示失败，至少在控制台显示错误
        console.error('显示日志失败:', e);
    }
}

// 检查ECharts是否可用
function checkECharts() {
    return new Promise((resolve, reject) => {
        if (typeof echarts !== 'undefined') {
            log(`✅ ECharts库已加载，版本: ${echarts.version}`, 'success');
            resolve(echarts);
        } else {
            log('❌ ECharts库未加载！尝试重新加载...', 'error');
            
            // 尝试动态加载ECharts
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js';
            script.onload = function() {
                if (typeof echarts !== 'undefined') {
                    log(`✅ ECharts库动态加载成功，版本: ${echarts.version}`, 'success');
                    resolve(echarts);
                } else {
                    log('❌ ECharts库动态加载失败！', 'error');
                    reject(new Error('ECharts库加载失败'));
                }
            };
            script.onerror = function() {
                log('❌ ECharts库CDN访问失败！', 'error');
                reject(new Error('ECharts库CDN访问失败'));
            };
            document.head.appendChild(script);
        }
    });
}

// 初始化单个图表
function initChart(chartId, chartTitle, chartType = 'line') {
    return new Promise((resolve, reject) => {
        try {
            // 获取图表容器
            const chartDom = document.getElementById(chartId);
            if (!chartDom) {
                log(`❌ 未找到ID为${chartId}的图表容器！`, 'error');
                reject(new Error(`未找到图表容器: ${chartId}`));
                return;
            }
            
            // 确保容器有明确的尺寸
            chartDom.style.width = '100%';
            chartDom.style.height = '400px';
            
            // 检查容器尺寸
            const containerWidth = chartDom.offsetWidth;
            const containerHeight = chartDom.offsetHeight;
            log(`图表容器${chartId}尺寸: ${containerWidth}px × ${containerHeight}px`);
            
            if (containerWidth <= 0 || containerHeight <= 0) {
                log(`❌ 图表容器${chartId}尺寸无效！请检查CSS样式和元素可见性`, 'error');
                reject(new Error(`图表容器尺寸无效: ${chartId}`));
                return;
            }
            
            // 初始化图表
            log(`开始初始化图表: ${chartId} (${chartTitle})`);
            const chart = echarts.init(chartDom);
            log(`✅ 图表${chartId}初始化成功`, 'success');
            
            // 设置图表配置
            const option = getChartOption(chartTitle, chartType);
            chart.setOption(option);
            log(`✅ 图表${chartId}配置设置完成`, 'success');
            
            // 添加窗口调整事件
            window.addEventListener('resize', function() {
                setTimeout(() => {
                    try {
                        chart.resize();
                        log(`图表${chartId}已调整大小`);
                    } catch (e) {
                        log(`调整图表${chartId}大小时出错: ${e.message}`, 'error');
                    }
                }, 100);
            });
            
            resolve(chart);
        } catch (error) {
            log(`❌ 初始化图表${chartId}时出错: ${error.message}`, 'error');
            log(`错误堆栈: ${error.stack}`, 'error');
            reject(error);
        }
    });
}

// 获取图表配置
function getChartOption(title, chartType) {
    // 根据图表类型返回不同的配置
    if (chartType === 'pie') {
        return {
            title: {
                text: title,
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: '数据分布',
                    type: 'pie',
                    radius: '60%',
                    data: [
                        {value: 35, name: '类别A'},
                        {value: 25, name: '类别B'},
                        {value: 20, name: '类别C'},
                        {value: 10, name: '类别D'},
                        {value: 10, name: '类别E'}
                    ],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
    } else if (chartType === 'bar') {
        return {
            title: {
                text: title,
                left: 'center'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['数据1', '数据2'],
                bottom: 10
            },
            xAxis: {
                type: 'category',
                data: ['项目1', '项目2', '项目3', '项目4', '项目5']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '数据1',
                    type: 'bar',
                    data: [120, 200, 150, 80, 70],
                    itemStyle: {
                        color: '#0066cc'
                    }
                },
                {
                    name: '数据2',
                    type: 'bar',
                    data: [90, 180, 120, 100, 90],
                    itemStyle: {
                        color: '#52c41a'
                    }
                }
            ]
        };
    } else {
        // 默认折线图
        return {
            title: {
                text: title,
                left: 'center'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['趋势1', '趋势2'],
                bottom: 10
            },
            xAxis: {
                type: 'category',
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '趋势1',
                    type: 'line',
                    data: [120, 200, 150, 80, 70, 110, 130, 180, 160, 220, 190, 250],
                    smooth: true,
                    itemStyle: {
                        color: '#0066cc'
                    }
                },
                {
                    name: '趋势2',
                    type: 'line',
                    data: [86, 190, 30, 40, 120, 280, 200, 150, 170, 100, 130, 180],
                    smooth: true,
                    itemStyle: {
                        color: '#52c41a'
                    }
                }
            ]
        };
    }
}

// 初始化所有图表
async function initAllCharts() {
    try {
        log('开始初始化所有图表...', 'info');
        
        // 确保ECharts可用
        await checkECharts();
        
        // 等待一小段时间，确保DOM完全渲染
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 初始化主图表 - 整体趋势图表
        await initChart('overall-trend-chart', '经济效益整体趋势', 'line');
        
        // 初始化科室收益图表
        await initChart('department-benefit-chart', '各科室收益分布', 'pie');
        
        // 初始化服务项目收益图表
        await initChart('service-benefit-chart', '服务项目收益分析', 'bar');
        
        // 初始化服务项目成本图表
        await initChart('service-cost-chart', '服务项目成本构成', 'pie');
        
        // 显示成功消息
        showSuccessMessage();
        
        log('✅ 所有图表初始化完成！', 'success');
    } catch (error) {
        log(`❌ 初始化图表过程中发生错误: ${error.message}`, 'error');
        showErrorMessage(`图表初始化失败: ${error.message}`);
    }
}

// 显示成功消息
function showSuccessMessage() {
    try {
        const message = document.createElement('div');
        message.style.position = 'fixed';
        message.style.top = '20px';
        message.style.right = '20px';
        message.style.background = '#52c41a';
        message.style.color = 'white';
        message.style.padding = '15px 20px';
        message.style.borderRadius = '4px';
        message.style.zIndex = '10000';
        message.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        message.style.fontWeight = 'bold';
        message.textContent = '🎉 图表已成功显示！ECharts工作正常';
        document.body.appendChild(message);
        
        // 5秒后移除消息
        setTimeout(function() {
            message.style.opacity = '0';
            message.style.transition = 'opacity 0.5s';
            setTimeout(function() {
                if (document.body.contains(message)) {
                    document.body.removeChild(message);
                }
            }, 500);
        }, 5000);
    } catch (e) {
        console.error('显示成功消息失败:', e);
    }
}

// 显示错误消息
function showErrorMessage(text) {
    try {
        const message = document.createElement('div');
        message.style.position = 'fixed';
        message.style.top = '20px';
        message.style.right = '20px';
        message.style.background = '#ff4d4f';
        message.style.color = 'white';
        message.style.padding = '15px 20px';
        message.style.borderRadius = '4px';
        message.style.zIndex = '10000';
        message.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        message.style.fontWeight = 'bold';
        message.textContent = text;
        document.body.appendChild(message);
        
        // 10秒后移除消息
        setTimeout(function() {
            message.style.opacity = '0';
            message.style.transition = 'opacity 0.5s';
            setTimeout(function() {
                if (document.body.contains(message)) {
                    document.body.removeChild(message);
                }
            }, 500);
        }, 10000);
    } catch (e) {
        console.error('显示错误消息失败:', e);
    }
}

// 简单的标签切换功能
function setupTabSwitching() {
    try {
        // 全局函数处理标签切换
        window.switchTab = function(tabId, event) {
            log(`切换到标签: ${tabId}`);
            
            // 移除所有标签的active类
            const tabs = document.querySelectorAll('.tab-button');
            tabs.forEach(tab => tab.classList.remove('active'));
            
            // 添加当前标签的active类
            if (event && event.target) {
                event.target.classList.add('active');
            } else {
                // 找到对应的标签按钮并激活
                const activeTab = document.querySelector(`.tab-button[onclick*="'${tabId}'"]`);
                if (activeTab) {
                    activeTab.classList.add('active');
                }
            }
            
            // 隐藏所有内容
            const contents = document.querySelectorAll('.tab-content');
            contents.forEach(content => content.classList.remove('active'));
            
            // 显示当前内容
            const currentContent = document.getElementById(tabId);
            if (currentContent) {
                currentContent.classList.add('active');
            }
            
            // 调整图表大小
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            }, 100);
        };
        
        log('标签切换功能已设置', 'success');
    } catch (e) {
        log(`设置标签切换功能时出错: ${e.message}`, 'error');
    }
}

// 当DOM加载完成后初始化图表
function initEconomicBenefitCharts() {
    log('页面开始加载...', 'info');
    
    // 确保DOM完全加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            log('DOM内容已加载完成', 'success');
            setupTabSwitching();
            
            // 延迟初始化，确保所有资源都已加载
            setTimeout(initAllCharts, 1000);
        });
    } else {
        log('DOM已准备就绪', 'success');
        setupTabSwitching();
        
        // 延迟初始化，确保所有资源都已加载
        setTimeout(initAllCharts, 1000);
    }
}

// 启动初始化
initEconomicBenefitCharts();

// 导出全局函数，方便在控制台手动调用
window.initEconomicBenefitCharts = initEconomicBenefitCharts;
window.refreshEconomicBenefitCharts = initAllCharts;