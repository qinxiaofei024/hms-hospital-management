// 成本控制分析页面JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // 初始化页面
    initCostControl();
    
    // 绑定事件监听器
    bindEventListeners();
});

// 初始化成本控制分析页面
function initCostControl() {
    // 初始化图表
    initCostTrendChart();
    initCostStructureChart();
    initDepartmentCostChart();
    initCostEfficiencyChart();
    
    // 加载数据
    loadCostData();
}

// 绑定事件监听器
function bindEventListeners() {
    // 刷新按钮
    document.getElementById('refresh-btn').addEventListener('click', function() {
        refreshCostData();
    });
    
    // 导出按钮
    document.getElementById('export-btn').addEventListener('click', function() {
        exportCostReport();
    });
    
    // 筛选条件变化
    document.getElementById('time-range').addEventListener('change', function() {
        updateCostData();
    });
    
    document.getElementById('department-select').addEventListener('change', function() {
        updateCostData();
    });
    
    document.getElementById('cost-type').addEventListener('change', function() {
        updateCostData();
    });
}

// 初始化成本趋势图
function initCostTrendChart() {
    const chart = echarts.init(document.getElementById('cost-trend-chart'));
    
    const option = {
        title: [
            {
                text: '近30天成本趋势',
                textStyle: {
                    fontSize: 14,
                    fontWeight: 'normal'
                }
            },
            {
                text: 'Cost Trend - Last 30 Days',
                top: 25,
                textStyle: {
                    fontSize: 11,
                    color: '#999',
                    fontWeight: 'normal'
                }
            }
        ],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        legend: {
            data: ['总成本', '人员成本', '药品成本', '材料成本', '设备成本']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: generateDateRange(30)
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value}万'
            }
        },
        series: [
            {
                name: '总成本',
                type: 'line',
                data: generateRandomData(30, 2800, 3000),
                smooth: true,
                itemStyle: {
                    color: '#ff4d4f'
                }
            },
            {
                name: '人员成本',
                type: 'line',
                data: generateRandomData(30, 850, 950),
                smooth: true,
                itemStyle: {
                    color: '#1890ff'
                }
            },
            {
                name: '药品成本',
                type: 'line',
                data: generateRandomData(30, 1200, 1300),
                smooth: true,
                itemStyle: {
                    color: '#52c41a'
                }
            },
            {
                name: '材料成本',
                type: 'line',
                data: generateRandomData(30, 450, 550),
                smooth: true,
                itemStyle: {
                    color: '#fa8c16'
                }
            },
            {
                name: '设备成本',
                type: 'line',
                data: generateRandomData(30, 200, 300),
                smooth: true,
                itemStyle: {
                    color: '#722ed1'
                }
            }
        ]
    };
    
    chart.setOption(option);
    
    // 响应式
    window.addEventListener('resize', function() {
        chart.resize();
    });
}

// 初始化成本结构图
function initCostStructureChart() {
    const chart = echarts.init(document.getElementById('cost-structure-chart'));
    
    const option = {
        title: [
            {
                text: '成本结构分析',
                textStyle: {
                    fontSize: 14,
                    fontWeight: 'normal'
                }
            },
            {
                text: 'Cost Structure Analysis',
                top: 25,
                textStyle: {
                    fontSize: 11,
                    color: '#999',
                    fontWeight: 'normal'
                }
            }
        ],
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c}万元 ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['人员成本', '药品成本', '材料成本', '设备成本', '其他成本']
        },
        series: [
            {
                name: '成本结构',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '18',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    {value: 892, name: '人员成本', itemStyle: {color: '#1890ff'}},
                    {value: 1245, name: '药品成本', itemStyle: {color: '#52c41a'}},
                    {value: 485, name: '材料成本', itemStyle: {color: '#fa8c16'}},
                    {value: 234, name: '设备成本', itemStyle: {color: '#722ed1'}},
                    {value: 156, name: '其他成本', itemStyle: {color: '#13c2c2'}}
                ]
            }
        ]
    };
    
    chart.setOption(option);
    
    // 响应式
    window.addEventListener('resize', function() {
        chart.resize();
    });
}

// 初始化科室成本对比图
function initDepartmentCostChart() {
    const chart = echarts.init(document.getElementById('department-cost-chart'));
    
    const option = {
        title: [
            {
                text: '各科室成本对比',
                textStyle: {
                    fontSize: 14,
                    fontWeight: 'normal'
                }
            },
            {
                text: 'Department Cost Comparison',
                top: 25,
                textStyle: {
                    fontSize: 11,
                    color: '#999',
                    fontWeight: 'normal'
                }
            }
        ],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['人员成本', '药品成本', '材料成本', '设备成本']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['心内科', '骨科', '神经外科', '消化内科', '呼吸内科', '神经内科', '妇产科', '儿科']
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value}万'
            }
        },
        series: [
            {
                name: '人员成本',
                type: 'bar',
                stack: '成本',
                data: [125.6, 98.7, 142.3, 89.6, 78.9, 72.5, 95.2, 112.8],
                itemStyle: {
                    color: '#1890ff'
                }
            },
            {
                name: '药品成本',
                type: 'bar',
                stack: '成本',
                data: [198.2, 156.8, 189.7, 132.4, 115.6, 98.3, 145.7, 156.9],
                itemStyle: {
                    color: '#52c41a'
                }
            },
            {
                name: '材料成本',
                type: 'bar',
                stack: '成本',
                data: [89.5, 95.2, 125.8, 52.8, 48.2, 42.6, 78.5, 58.7],
                itemStyle: {
                    color: '#fa8c16'
                }
            },
            {
                name: '设备成本',
                type: 'bar',
                stack: '成本',
                data: [43.5, 38.5, 54.8, 23.7, 24.6, 21.3, 26.5, 22.6],
                itemStyle: {
                    color: '#722ed1'
                }
            }
        ]
    };
    
    chart.setOption(option);
    
    // 响应式
    window.addEventListener('resize', function() {
        chart.resize();
    });
}

// 初始化成本效率分析图
function initCostEfficiencyChart() {
    const chart = echarts.init(document.getElementById('cost-efficiency-chart'));
    
    const option = {
        title: [
            {
                text: '成本控制效率分析',
                textStyle: {
                    fontSize: 14,
                    fontWeight: 'normal'
                }
            },
            {
                text: 'Cost Control Efficiency Analysis',
                top: 25,
                textStyle: {
                    fontSize: 11,
                    color: '#999',
                    fontWeight: 'normal'
                }
            }
        ],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        legend: {
            data: ['成本控制率', '成本节约额']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['心内科', '骨科', '神经外科', '消化内科', '呼吸内科', '神经内科', '妇产科', '儿科']
        },
        yAxis: [
            {
                type: 'value',
                name: '控制率(%)',
                position: 'left',
                axisLabel: {
                    formatter: '{value}%'
                }
            },
            {
                type: 'value',
                name: '节约额(万元)',
                position: 'right',
                axisLabel: {
                    formatter: '{value}万'
                }
            }
        ],
        series: [
            {
                name: '成本控制率',
                type: 'bar',
                yAxisIndex: 0,
                data: [72.3, 69.8, 65.2, 75.6, 71.4, 73.8, 70.9, 68.5],
                itemStyle: {
                    color: '#1890ff'
                }
            },
            {
                name: '成本节约额',
                type: 'line',
                yAxisIndex: 1,
                data: [45.6, 32.8, 28.9, 38.2, 29.5, 31.7, 35.4, 28.3],
                smooth: true,
                itemStyle: {
                    color: '#52c41a'
                }
            }
        ]
    };
    
    chart.setOption(option);
    
    // 响应式
    window.addEventListener('resize', function() {
        chart.resize();
    });
}

// 生成日期范围
function generateDateRange(days) {
    const dates = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(date.toLocaleDateString('zh-CN', {month: 'numeric', day: 'numeric'}));
    }
    
    return dates;
}

// 生成随机数据
function generateRandomData(count, min, max) {
    const data = [];
    for (let i = 0; i < count; i++) {
        data.push(Math.round((Math.random() * (max - min) + min) * 10) / 10);
    }
    return data;
}

// 加载成本数据
function loadCostData() {
    showLoading();
    
    // 模拟异步数据加载
    setTimeout(() => {
        try {
            // 这里可以添加实际的数据加载逻辑
            // 例如：fetch('/api/cost-data').then(...)
            
            console.log('成本数据加载完成');
            showMessage('数据加载完成', 'success');
            
            // 更新图表数据
            updateAllCharts();
            
        } catch (error) {
            console.error('数据加载失败:', error);
            showMessage('数据加载失败，请重试', 'error');
        } finally {
            hideLoading();
        }
    }, 1000); // 模拟网络延迟
}

// 刷新成本数据
function refreshCostData() {
    showLoading();
    
    // 模拟数据刷新
    setTimeout(() => {
        try {
            console.log('刷新成本数据');
            
            // 重新加载所有图表数据
            updateAllCharts();
            
            showMessage('数据已刷新', 'success');
        } catch (error) {
            console.error('数据刷新失败:', error);
            showMessage('数据刷新失败，请重试', 'error');
        } finally {
            hideLoading();
        }
    }, 800);
}

// 根据筛选条件更新数据
function updateCostData() {
    const timeRange = document.getElementById('time-range').value;
    const department = document.getElementById('department-select').value;
    const costType = document.getElementById('cost-type').value;
    
    showLoading();
    
    // 模拟筛选数据更新
    setTimeout(() => {
        try {
            console.log('更新数据:', { timeRange, department, costType });
            
            // 根据筛选条件更新图表
            updateChartsWithFilters({ timeRange, department, costType });
            
            showMessage('筛选条件已应用', 'info');
        } catch (error) {
            console.error('数据更新失败:', error);
            showMessage('数据更新失败，请重试', 'error');
        } finally {
            hideLoading();
        }
    }, 600);
}

// 更新所有图表
function updateAllCharts() {
    try {
        // 重新初始化所有图表
        initCostTrendChart();
        initCostStructureChart();
        initDepartmentCostChart();
        initCostEfficiencyChart();
        
        console.log('所有图表已更新');
    } catch (error) {
        console.error('图表更新失败:', error);
        throw error;
    }
}

// 根据筛选条件更新图表
function updateChartsWithFilters(filters) {
    try {
        // 这里可以根据筛选条件生成不同的数据
        // 目前使用模拟数据，实际应用中应该调用API获取筛选后的数据
        
        updateAllCharts();
        
        console.log('图表已根据筛选条件更新:', filters);
    } catch (error) {
        console.error('筛选更新失败:', error);
        throw error;
    }
}

// 导出成本报告
function exportCostReport() {
    console.log('导出成本控制报告...');
    
    // 模拟导出功能
    showMessage('报告导出中，请稍候...', 'info');
    
    setTimeout(() => {
        showMessage('报告导出成功', 'success');
    }, 2000);
}

// 显示加载状态
function showLoading() {
    // 创建加载遮罩
    let loadingMask = document.getElementById('loading-mask');
    if (!loadingMask) {
        loadingMask = document.createElement('div');
        loadingMask.id = 'loading-mask';
        loadingMask.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-text">数据加载中...</div>
            </div>
        `;
        loadingMask.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        `;
        
        const loadingContent = loadingMask.querySelector('.loading-content');
        loadingContent.style.cssText = `
            text-align: center;
            color: #666;
        `;
        
        const spinner = loadingMask.querySelector('.loading-spinner');
        spinner.style.cssText = `
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #007bff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 10px;
        `;
        
        // 添加旋转动画
        if (!document.getElementById('loading-styles')) {
            const style = document.createElement('style');
            style.id = 'loading-styles';
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(loadingMask);
    }
    loadingMask.style.display = 'flex';
}

// 隐藏加载状态
function hideLoading() {
    const loadingMask = document.getElementById('loading-mask');
    if (loadingMask) {
        loadingMask.style.display = 'none';
    }
}

// 显示消息
function showMessage(message, type = 'info') {
    // 创建消息提示
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    
    const colors = {
        success: '#52c41a',
        error: '#ff4d4f',
        warning: '#fa8c16',
        info: '#1890ff'
    };
    
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${colors[type] || colors.info};
        color: white;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        z-index: 10000;
        font-size: 14px;
        max-width: 300px;
        word-wrap: break-word;
        animation: slideIn 0.3s ease-out;
    `;
    
    // 添加滑入动画
    if (!document.getElementById('message-styles')) {
        const style = document.createElement('style');
        style.id = 'message-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(messageEl);
    
    // 3秒后自动移除
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => {
                messageEl.remove();
            }, 300);
        }
    }, 3000);
}

// 图表响应式处理
function handleChartResize() {
    const charts = [
        'cost-trend-chart',
        'cost-structure-chart', 
        'department-cost-chart',
        'cost-efficiency-chart'
    ];
    
    charts.forEach(chartId => {
        const chartDom = document.getElementById(chartId);
        if (chartDom && echarts.getInstanceByDom(chartDom)) {
            echarts.getInstanceByDom(chartDom).resize();
        }
    });
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 窗口大小变化时重新调整图表大小
window.addEventListener('resize', debounce(handleChartResize, 250));

// ==================== 均次费用分析模块 ====================

// 初始化均次费用分析功能
function initAverageCostAnalysis() {
    // 初始化均次费用分析图表
    initAvgCostCharts();
    
    // 绑定均次费用分析事件
    bindAvgCostEvents();
    
    // 加载医生费用明细数据
    loadDoctorCostDetail();
}

// 绑定均次费用分析事件
function bindAvgCostEvents() {
    // 标签页切换
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchAnalysisTab(this.dataset.tab);
        });
    });
    
    // 筛选条件变化
    document.getElementById('org-dimension').addEventListener('change', updateAvgCostAnalysis);
    document.getElementById('time-dimension').addEventListener('change', updateAvgCostAnalysis);
    document.getElementById('analysis-type').addEventListener('change', updateAvgCostAnalysis);
    
    // 医生明细展开/收起
    document.getElementById('toggle-doctor-detail').addEventListener('click', toggleDoctorDetail);
}

// 切换分析标签页
function switchAnalysisTab(tabType) {
    // 更新标签页状态
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabType}"]`).classList.add('active');
    
    // 更新数据和图表
    updateAvgCostData(tabType);
}

// 初始化均次费用分析图表
function initAvgCostCharts() {
    initDeptAvgCostRanking();
    initAvgCostTrend();
    initCostStructureAnalysis();
    initCostFactorAnalysis();
}

// 初始化科室均次费用排名图表
function initDeptAvgCostRanking() {
    const chart = echarts.init(document.getElementById('dept-avg-cost-ranking'));
    
    const option = {
        title: {
            text: '科室均次费用排名',
            textStyle: {
                fontSize: 14,
                fontWeight: 'normal'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function(params) {
                return `${params[0].name}<br/>均次费用: ¥${params[0].value}`;
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            axisLabel: {
                formatter: '¥{value}'
            }
        },
        yAxis: {
            type: 'category',
            data: ['心内科', '神经外科', '骨科', '消化内科', '呼吸内科', '神经内科', '妇产科', '儿科']
        },
        series: [{
            name: '均次费用',
            type: 'bar',
            data: [856, 742, 698, 623, 587, 534, 489, 423],
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    {offset: 0, color: '#667eea'},
                    {offset: 1, color: '#764ba2'}
                ])
            }
        }]
    };
    
    chart.setOption(option);
    window.avgCostRankingChart = chart;
}

// 初始化均次费用趋势分析图表
function initAvgCostTrend() {
    const chart = echarts.init(document.getElementById('avg-cost-trend'));
    
    const option = {
        title: {
            text: '均次费用趋势分析',
            textStyle: {
                fontSize: 14,
                fontWeight: 'normal'
            }
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['门急诊均次费用', '住院均次费用', '目标值']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: generateMonthRange(12)
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '¥{value}'
            }
        },
        series: [
            {
                name: '门急诊均次费用',
                type: 'line',
                data: [420, 435, 448, 456, 462, 458, 465, 472, 468, 475, 482, 489],
                smooth: true,
                itemStyle: {
                    color: '#1890ff'
                }
            },
            {
                name: '住院均次费用',
                type: 'line',
                data: [7800, 7950, 8100, 8200, 8350, 8280, 8420, 8560, 8480, 8620, 8750, 8890],
                smooth: true,
                itemStyle: {
                    color: '#52c41a'
                }
            },
            {
                name: '目标值',
                type: 'line',
                data: [450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450],
                lineStyle: {
                    type: 'dashed',
                    color: '#ff4d4f'
                },
                itemStyle: {
                    color: '#ff4d4f'
                }
            }
        ]
    };
    
    chart.setOption(option);
    window.avgCostTrendChart = chart;
}

// 初始化费用结构占比分析图表
function initCostStructureAnalysis() {
    const chart = echarts.init(document.getElementById('cost-structure-analysis'));
    
    const option = {
        title: {
            text: '费用结构占比分析',
            textStyle: {
                fontSize: 14,
                fontWeight: 'normal'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c}% ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['药品费用', '检查费用', '治疗费用', '材料费用', '其他费用']
        },
        series: [{
            name: '费用结构',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['60%', '50%'],
            data: [
                {value: 35.2, name: '药品费用'},
                {value: 28.6, name: '检查费用'},
                {value: 18.4, name: '治疗费用'},
                {value: 12.3, name: '材料费用'},
                {value: 5.5, name: '其他费用'}
            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };
    
    chart.setOption(option);
    window.costStructureChart = chart;
}

// 初始化影响因素分析图表
function initCostFactorAnalysis() {
    const chart = echarts.init(document.getElementById('cost-factor-analysis'));
    
    const option = {
        title: {
            text: '影响因素分析',
            textStyle: {
                fontSize: 14,
                fontWeight: 'normal'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['正向影响', '负向影响']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value}%'
            }
        },
        yAxis: {
            type: 'category',
            data: ['药品价格', '检查项目', '治疗方案', '住院天数', '并发症率', '医保政策']
        },
        series: [
            {
                name: '正向影响',
                type: 'bar',
                stack: '影响',
                data: [15.2, 12.8, 8.6, 0, 0, 5.4],
                itemStyle: {
                    color: '#52c41a'
                }
            },
            {
                name: '负向影响',
                type: 'bar',
                stack: '影响',
                data: [0, 0, 0, -6.3, -4.2, 0],
                itemStyle: {
                    color: '#ff4d4f'
                }
            }
        ]
    };
    
    chart.setOption(option);
    window.costFactorChart = chart;
}

// 生成月份范围
function generateMonthRange(months) {
    const result = [];
    const now = new Date();
    for (let i = months - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        result.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
    }
    return result;
}

// 更新均次费用分析数据
function updateAvgCostAnalysis() {
    const orgDimension = document.getElementById('org-dimension').value;
    const timeDimension = document.getElementById('time-dimension').value;
    const analysisType = document.getElementById('analysis-type').value;
    
    // 根据筛选条件更新图表数据
    updateAvgCostCharts(orgDimension, timeDimension, analysisType);
    
    // 更新指标卡片数据
    updateAvgCostIndicators(orgDimension, timeDimension, analysisType);
}

// 更新均次费用数据（标签页切换）
function updateAvgCostData(tabType) {
    // 模拟根据标签页类型更新数据
    if (tabType === 'outpatient') {
        document.getElementById('outpatient-avg-cost').textContent = '458.6';
        document.getElementById('inpatient-avg-cost').textContent = '8,256.3';
    } else {
        document.getElementById('outpatient-avg-cost').textContent = '462.3';
        document.getElementById('inpatient-avg-cost').textContent = '8,420.7';
    }
    
    // 更新图表
    updateAvgCostCharts('department', 'month', 'trend');
}

// 更新均次费用图表
function updateAvgCostCharts(orgDimension, timeDimension, analysisType) {
    // 这里可以根据实际需求调用API获取数据
    // 目前使用模拟数据
    
    if (window.avgCostRankingChart) {
        window.avgCostRankingChart.setOption({
            yAxis: {
                data: orgDimension === 'doctor' ? 
                    ['张医生', '李医生', '王医生', '陈医生', '刘医生', '赵医生', '孙医生', '周医生'] :
                    ['心内科', '神经外科', '骨科', '消化内科', '呼吸内科', '神经内科', '妇产科', '儿科']
            },
            series: [{
                data: orgDimension === 'doctor' ? 
                    [1256, 1142, 1098, 1023, 987, 934, 889, 823] :
                    [856, 742, 698, 623, 587, 534, 489, 423]
            }]
        });
    }
}

// 更新均次费用指标
function updateAvgCostIndicators(orgDimension, timeDimension, analysisType) {
    // 模拟数据更新
    const indicators = {
        'outpatient-avg-cost': (Math.random() * 100 + 400).toFixed(1),
        'inpatient-avg-cost': (Math.random() * 1000 + 8000).toFixed(1),
        'cost-growth-rate': (Math.random() * 10 + 2).toFixed(1),
        'control-target-rate': (Math.random() * 20 + 85).toFixed(1)
    };
    
    Object.keys(indicators).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = indicators[id];
        }
    });
}

// 加载医生费用明细数据
function loadDoctorCostDetail() {
    const tbody = document.getElementById('doctor-cost-tbody');
    const mockData = [
        {
            name: '张主任',
            department: '心内科',
            outpatientCost: '¥523.6',
            inpatientCost: '¥9,256.3',
            drugRatio: '32.5%',
            examRatio: '28.6%',
            treatmentRatio: '22.3%',
            materialRatio: '16.6%',
            evaluation: '合理'
        },
        {
            name: '李医生',
            department: '神经外科',
            outpatientCost: '¥486.2',
            inpatientCost: '¥8,742.1',
            drugRatio: '35.2%',
            examRatio: '26.8%',
            treatmentRatio: '20.5%',
            materialRatio: '17.5%',
            evaluation: '偏高'
        },
        {
            name: '王医生',
            department: '骨科',
            outpatientCost: '¥445.8',
            inpatientCost: '¥8,123.7',
            drugRatio: '30.8%',
            examRatio: '29.2%',
            treatmentRatio: '24.1%',
            materialRatio: '15.9%',
            evaluation: '合理'
        },
        {
            name: '陈医生',
            department: '消化内科',
            outpatientCost: '¥412.3',
            inpatientCost: '¥7,856.4',
            drugRatio: '38.6%',
            examRatio: '25.4%',
            treatmentRatio: '19.8%',
            materialRatio: '16.2%',
            evaluation: '药占比偏高'
        },
        {
            name: '刘医生',
            department: '呼吸内科',
            outpatientCost: '¥398.7',
            inpatientCost: '¥7,623.9',
            drugRatio: '33.4%',
            examRatio: '27.8%',
            treatmentRatio: '21.6%',
            materialRatio: '17.2%',
            evaluation: '合理'
        }
    ];
    
    tbody.innerHTML = mockData.map(item => `
        <tr>
            <td>${item.name}</td>
            <td>${item.department}</td>
            <td>${item.outpatientCost}</td>
            <td>${item.inpatientCost}</td>
            <td>${item.drugRatio}</td>
            <td>${item.examRatio}</td>
            <td>${item.treatmentRatio}</td>
            <td>${item.materialRatio}</td>
            <td><span class="evaluation ${item.evaluation === '合理' ? 'reasonable' : 'warning'}">${item.evaluation}</span></td>
        </tr>
    `).join('');
}

// 切换医生明细显示/隐藏
function toggleDoctorDetail() {
    const table = document.getElementById('doctor-detail-table');
    const btn = document.getElementById('toggle-doctor-detail');
    
    if (table.style.display === 'none') {
        table.style.display = 'block';
        btn.textContent = '收起详情';
    } else {
        table.style.display = 'none';
        btn.textContent = '展开详情';
    }
}

// 在页面加载完成后初始化均次费用分析
document.addEventListener('DOMContentLoaded', function() {
    // 延迟初始化，确保主要功能先加载
    setTimeout(() => {
        initAverageCostAnalysis();
    }, 500);
});