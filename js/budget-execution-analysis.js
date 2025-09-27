// 预算执行分析页面JavaScript

// 等待导航加载完成
function waitForNavigation() {
    return new Promise((resolve) => {
        if (document.querySelector('#navigation-container .sidebar')) {
            resolve();
        } else {
            const observer = new MutationObserver((mutations) => {
                if (document.querySelector('#navigation-container .sidebar')) {
                    observer.disconnect();
                    resolve();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    });
}

// 安全绑定事件
function safeBindEvent(elementId, eventType, handler) {
    try {
        const element = document.getElementById(elementId);
        if (element && typeof element.addEventListener === 'function') {
            element.addEventListener(eventType, handler);
            console.log(`成功绑定事件: ${elementId} -> ${eventType}`);
        } else {
            console.warn(`元素未找到或无法绑定事件: ${elementId}`);
        }
    } catch (error) {
        console.error(`绑定事件时发生错误: ${elementId}`, error);
    }
}

// 页面初始化
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // 等待导航加载完成
        await waitForNavigation();
        
        // 延迟执行确保DOM完全渲染
        setTimeout(() => {
            initCharts();
            bindEvents();
            loadData();
        }, 100);
        
    } catch (error) {
        console.error('页面初始化失败:', error);
    }
});

// 绑定事件
function bindEvents() {
    // 筛选条件变化
    safeBindEvent('budget-year', 'change', function() {
        loadData();
    });
    
    safeBindEvent('budget-type', 'change', function() {
        loadData();
    });
    
    safeBindEvent('department-select', 'change', function() {
        loadData();
    });
    
    // 刷新按钮
    safeBindEvent('refresh-btn', 'click', function() {
        loadData();
    });
    
    // 导出按钮
    safeBindEvent('export-btn', 'click', function() {
        exportReport();
    });
}

// 初始化图表
function initCharts() {
    initBudgetExecutionChart();
    initBudgetCategoryChart();
    initMonthlyTrendChart();
    initDepartmentComparisonChart();
}

// 预算执行概览图
function initBudgetExecutionChart() {
    const chart = echarts.init(document.getElementById('budget-execution-chart'));
    
    const option = {
        title: {
            text: '预算执行概览',
            left: 'center',
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c}万元 ({d}%)'
        },
        legend: {
            bottom: '5%',
            left: 'center'
        },
        series: [
            {
                name: '预算执行',
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
                        fontSize: '18',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: 2245, name: '已执行', itemStyle: { color: '#52c41a' } },
                    { value: 611, name: '未执行', itemStyle: { color: '#f0f0f0' } }
                ]
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 预算分类分析图
function initBudgetCategoryChart() {
    const chart = echarts.init(document.getElementById('budget-category-chart'));
    
    const option = {
        title: {
            text: '预算分类分析',
            left: 'center',
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            bottom: '5%'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['人员经费', '设备采购', '医疗耗材', '维护费用', '培训费用', '其他费用'],
            axisLabel: {
                rotate: 45
            }
        },
        yAxis: {
            type: 'value',
            name: '金额(万元)'
        },
        series: [
            {
                name: '预算金额',
                type: 'bar',
                data: [850, 650, 480, 320, 280, 276],
                itemStyle: { color: '#1890ff' }
            },
            {
                name: '执行金额',
                type: 'bar',
                data: [720, 485, 395, 245, 235, 165],
                itemStyle: { color: '#52c41a' }
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 月度执行趋势图
function initMonthlyTrendChart() {
    const chart = echarts.init(document.getElementById('monthly-trend-chart'));
    
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const budgetData = [240, 220, 280, 260, 300, 320, 280, 290, 310, 285, 275, 290];
    const executionData = [185, 165, 225, 210, 245, 265, 235, 240, 255, 235, 225, 240];
    
    const option = {
        title: {
            text: '月度执行趋势',
            left: 'center',
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            bottom: '5%'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: months
        },
        yAxis: {
            type: 'value',
            name: '金额(万元)'
        },
        series: [
            {
                name: '预算金额',
                type: 'line',
                data: budgetData,
                smooth: true,
                itemStyle: { color: '#1890ff' },
                areaStyle: { opacity: 0.3 }
            },
            {
                name: '执行金额',
                type: 'line',
                data: executionData,
                smooth: true,
                itemStyle: { color: '#52c41a' },
                areaStyle: { opacity: 0.3 }
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 科室对比分析图
function initDepartmentComparisonChart() {
    const chart = echarts.init(document.getElementById('department-comparison-chart'));
    
    const option = {
        title: {
            text: '科室预算执行对比',
            left: 'center',
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
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
            name: '执行率(%)',
            max: 100
        },
        yAxis: {
            type: 'category',
            data: ['儿科', '妇产科', '神经内科', '呼吸内科', '消化内科', '神经外科', '骨科', '心内科']
        },
        series: [
            {
                name: '执行率',
                type: 'bar',
                data: [
                    { value: 78.0, itemStyle: { color: '#52c41a' } },
                    { value: 80.0, itemStyle: { color: '#52c41a' } },
                    { value: 72.0, itemStyle: { color: '#1890ff' } },
                    { value: 98.3, itemStyle: { color: '#ff4d4f' } },
                    { value: 69.3, itemStyle: { color: '#1890ff' } },
                    { value: 91.7, itemStyle: { color: '#fa8c16' } },
                    { value: 84.4, itemStyle: { color: '#52c41a' } },
                    { value: 81.4, itemStyle: { color: '#52c41a' } }
                ],
                barWidth: '60%',
                itemStyle: {
                    borderRadius: [0, 4, 4, 0]
                }
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 加载数据
function loadData() {
    // 模拟数据加载
    console.log('加载预算执行数据...');
    
    // 这里可以根据筛选条件重新加载数据
    const budgetYear = document.getElementById('budget-year').value;
    const budgetType = document.getElementById('budget-type').value;
    const department = document.getElementById('department-select').value;
    
    console.log('筛选条件:', { budgetYear, budgetType, department });
    
    // 重新初始化图表（模拟数据更新）
    setTimeout(() => {
        initCharts();
    }, 500);
}

// 导出报告
function exportReport() {
    // 模拟导出功能
    const budgetYear = document.getElementById('budget-year').value;
    const budgetType = document.getElementById('budget-type').value;
    const department = document.getElementById('department-select').value;
    
    console.log('导出预算执行分析报告...', { budgetYear, budgetType, department });
    
    // 创建下载链接
    const data = {
        title: '预算执行分析报告',
        date: new Date().toLocaleDateString('zh-CN'),
        filters: { budgetYear, budgetType, department },
        summary: {
            totalBudget: '2,856万',
            executionRate: '78.6%',
            remainingBudget: '245万',
            achievementRate: '92.4%'
        }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `预算执行分析报告_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('报告导出成功！');
}