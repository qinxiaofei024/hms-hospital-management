// 医疗质量指标页面JavaScript
let isInitialized = false; // 防止重复初始化的标志位

document.addEventListener('DOMContentLoaded', function() {
    // 初始化页面
    initMedicalQuality();
    
    // 绑定事件监听器
    bindEventListeners();
});

// 初始化医疗质量指标页面
function initMedicalQuality() {
    if (isInitialized) {
        console.log('Medical quality indicators already initialized, skipping...');
        return;
    }
    
    // 尝试使用新组件库
    if (window.medicalQualityComponents && window.medicalQualityComponents.initialized) {
        initWithNewComponents();
    } else {
        // 监听组件库初始化完成事件（只监听一次）
        const handleComponentInit = () => {
            if (!isInitialized) {
                initWithNewComponents();
            }
            document.removeEventListener('component:initialized', handleComponentInit);
        };
        document.addEventListener('component:initialized', handleComponentInit);
        
        // 备用：使用传统方式
        setTimeout(() => {
            if (!isInitialized && (!window.medicalQualityComponents || !window.medicalQualityComponents.initialized)) {
                initTraditionalCharts();
            }
        }, 1000);
    }
    
    // 加载数据
    loadQualityData();
}

// 使用新组件库初始化
function initWithNewComponents() {
    if (isInitialized) {
        console.log('Already initialized with new components, skipping...');
        return;
    }
    
    try {
        console.log('Initializing medical quality indicators with new component library');
        
        // 初始化统计卡片
        initQualityStatCards();
        
        // 初始化图表（使用传统方式，避免递归）
        initQualityTrendChartTraditional();
        initDepartmentQualityChartTraditional();
        initQualityDistributionChartTraditional();
        initAdverseEventsChartTraditional();
        
        isInitialized = true; // 设置初始化完成标志
        console.log('Medical quality indicators initialized successfully with new components');
    } catch (error) {
        console.error('Failed to initialize with new components, falling back to traditional method:', error);
        // 直接调用传统图表初始化函数，避免递归
        initQualityTrendChartTraditional();
        initDepartmentQualityChartTraditional();
        initQualityDistributionChartTraditional();
        initAdverseEventsChartTraditional();
        isInitialized = true; // 即使失败也设置标志，避免重复尝试
    }
}

// 传统方式初始化
function initTraditionalCharts() {
    if (isInitialized) {
        console.log('Already initialized, skipping traditional initialization...');
        return;
    }
    
    console.log('Initializing medical quality indicators with traditional method');
    
    // 初始化图表
    initQualityTrendChartTraditional();
    initDepartmentQualityChartTraditional();
    initQualityDistributionChartTraditional();
    initAdverseEventsChartTraditional();
    
    isInitialized = true; // 设置初始化完成标志
}

// 初始化质量统计卡片
function initQualityStatCards() {
    const qualityStats = [
        {
            title: '治愈率',
            value: '94.2%',
            trend: '+0.5%',
            trendType: 'up',
            description: '较上月提升'
        },
        {
            title: '院内感染率',
            value: '0.8%',
            trend: '-0.2%',
            trendType: 'down',
            description: '较上月下降'
        },
        {
            title: '患者满意度',
            value: '96.8%',
            trend: '+1.2%',
            trendType: 'up',
            description: '较上月提升'
        },
        {
            title: '平均住院日',
            value: '7.2天',
            trend: '-0.3天',
            trendType: 'down',
            description: '较上月缩短'
        }
    ];
    
    // 创建统计卡片容器
    const statsContainer = document.createElement('div');
    statsContainer.className = 'quality-stats-container';
    statsContainer.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
    `;
    
    // 在页面顶部插入统计卡片
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.insertBefore(statsContainer, mainContent.firstChild);
    }
    
    // 创建统计卡片
    qualityStats.forEach(stat => {
        if (window.medicalQualityComponents && window.medicalQualityComponents.createStatCard) {
            // 创建卡片容器
            const cardContainer = document.createElement('div');
            cardContainer.className = 'stat-card-container';
            statsContainer.appendChild(cardContainer);
            
            // 使用正确的API创建统计卡片
            const statCard = window.medicalQualityComponents.createStatCard(cardContainer, stat);
        }
    });
}

// 绑定事件监听器
function bindEventListeners() {
    // 刷新按钮
    document.getElementById('refresh-btn').addEventListener('click', function() {
        refreshQualityData();
    });
    
    // 导出按钮
    document.getElementById('export-btn').addEventListener('click', function() {
        exportQualityReport();
    });
    
    // 筛选条件变化
    document.getElementById('time-range').addEventListener('change', function() {
        updateQualityData();
    });
    
    document.getElementById('department-select').addEventListener('change', function() {
        updateQualityData();
    });
    
    document.getElementById('quality-category').addEventListener('change', function() {
        updateQualityData();
    });
}

// 初始化质量指标趋势图
function initQualityTrendChartTraditional() {
    const chart = echarts.init(document.getElementById('quality-trend-chart'));
    
    const option = {
        title: {
            text: '近30天质量指标趋势',
            textStyle: {
                fontSize: 14,
                fontWeight: 'normal'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        legend: {
            data: ['治愈率', '院内感染率', '患者满意度', '平均住院日']
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
        yAxis: [
            {
                type: 'value',
                name: '百分比(%)',
                position: 'left',
                axisLabel: {
                    formatter: '{value}%'
                }
            },
            {
                type: 'value',
                name: '天数',
                position: 'right',
                axisLabel: {
                    formatter: '{value}天'
                }
            }
        ],
        series: [
            {
                name: '治愈率',
                type: 'line',
                yAxisIndex: 0,
                data: generateRandomData(30, 94, 98),
                smooth: true,
                itemStyle: {
                    color: '#52c41a'
                }
            },
            {
                name: '院内感染率',
                type: 'line',
                yAxisIndex: 0,
                data: generateRandomData(30, 0.5, 1.2),
                smooth: true,
                itemStyle: {
                    color: '#ff4d4f'
                }
            },
            {
                name: '患者满意度',
                type: 'line',
                yAxisIndex: 0,
                data: generateRandomData(30, 85, 95),
                smooth: true,
                itemStyle: {
                    color: '#1890ff'
                }
            },
            {
                name: '平均住院日',
                type: 'line',
                yAxisIndex: 1,
                data: generateRandomData(30, 7, 10),
                smooth: true,
                itemStyle: {
                    color: '#fa8c16'
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

// 初始化科室质量对比图
function initDepartmentQualityChartTraditional() {
    const chart = echarts.init(document.getElementById('department-quality-chart'));
    
    const option = {
        title: {
            text: '各科室质量指标对比',
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
            data: ['治愈率', '患者满意度', '手术成功率']
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
                formatter: '{value}%'
            }
        },
        series: [
            {
                name: '治愈率',
                type: 'bar',
                data: [96.8, 95.2, 94.5, 97.1, 96.3, 95.8, 98.2, 94.9],
                itemStyle: {
                    color: '#52c41a'
                }
            },
            {
                name: '患者满意度',
                type: 'bar',
                data: [92.5, 89.8, 91.2, 93.6, 90.4, 88.9, 94.7, 87.3],
                itemStyle: {
                    color: '#1890ff'
                }
            },
            {
                name: '手术成功率',
                type: 'bar',
                data: [98.5, 99.1, 97.8, 98.9, 98.2, 97.5, 99.3, 98.0],
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

// 初始化质量指标分布图
function initQualityDistributionChartTraditional() {
    const chart = echarts.init(document.getElementById('quality-distribution-chart'));
    
    const option = {
        title: {
            text: '质量指标达标情况',
            textStyle: {
                fontSize: 14,
                fontWeight: 'normal'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['优秀', '良好', '待改进', '需关注']
        },
        series: [
            {
                name: '达标情况',
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
                    {value: 45, name: '优秀', itemStyle: {color: '#52c41a'}},
                    {value: 32, name: '良好', itemStyle: {color: '#1890ff'}},
                    {value: 18, name: '待改进', itemStyle: {color: '#fa8c16'}},
                    {value: 5, name: '需关注', itemStyle: {color: '#ff4d4f'}}
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

// 初始化不良事件统计图
function initAdverseEventsChartTraditional() {
    const chart = echarts.init(document.getElementById('adverse-events-chart'));
    
    const option = {
        title: {
            text: '不良事件统计',
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
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value'
        },
        yAxis: {
            type: 'category',
            data: ['药物不良反应', '跌倒事件', '压疮事件', '输血反应', '手术并发症', '院内感染', '其他']
        },
        series: [
            {
                name: '事件数量',
                type: 'bar',
                data: [12, 8, 5, 3, 7, 15, 6],
                itemStyle: {
                    color: function(params) {
                        const colors = ['#ff4d4f', '#fa8c16', '#fadb14', '#52c41a', '#13c2c2', '#1890ff', '#722ed1'];
                        return colors[params.dataIndex];
                    }
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

// 加载质量数据
function loadQualityData() {
    // 模拟数据加载
    console.log('加载医疗质量数据...');
    
    // 这里可以添加实际的数据加载逻辑
    // 例如：fetch('/api/quality-data')
}

// 刷新质量数据
function refreshQualityData() {
    console.log('刷新医疗质量数据...');
    
    // 显示加载状态
    showLoading();
    
    // 模拟数据刷新
    setTimeout(() => {
        loadQualityData();
        hideLoading();
        showMessage('数据刷新成功', 'success');
    }, 1000);
}

// 更新质量数据
function updateQualityData() {
    const timeRange = document.getElementById('time-range').value;
    const department = document.getElementById('department-select').value;
    const category = document.getElementById('quality-category').value;
    
    console.log('更新医疗质量数据:', {timeRange, department, category});
    
    // 这里可以根据筛选条件更新数据
    loadQualityData();
}

// 导出质量报告
function exportQualityReport() {
    console.log('导出医疗质量报告...');
    
    // 模拟导出功能
    showMessage('报告导出中，请稍候...', 'info');
    
    setTimeout(() => {
        showMessage('报告导出成功', 'success');
    }, 2000);
}

// 显示加载状态
function showLoading() {
    // 可以添加加载动画
    console.log('显示加载状态');
}

// 隐藏加载状态
function hideLoading() {
    // 隐藏加载动画
    console.log('隐藏加载状态');
}

// 显示消息
function showMessage(message, type = 'info') {
    console.log(`${type}: ${message}`);
    // 这里可以添加实际的消息显示逻辑
}