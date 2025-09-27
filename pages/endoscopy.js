// 内镜管理分析页面 JavaScript

// 全局变量
let examVolumeChart, endoscopyTypeChart, equipmentEfficiencyChart, departmentRankingChart;

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    init();
});

// 初始化函数
function init() {
    initCharts();
    loadData();
    bindEvents();
}

// 初始化图表
function initCharts() {
    // 检查量趋势图
    const examVolumeContainer = document.getElementById('exam-volume-chart');
    if (examVolumeContainer) {
        examVolumeChart = echarts.init(examVolumeContainer);
    }
    
    // 内镜类型分布图
    const endoscopyTypeContainer = document.getElementById('endoscopy-type-chart');
    if (endoscopyTypeContainer) {
        endoscopyTypeChart = echarts.init(endoscopyTypeContainer);
    }
    
    // 设备运行效率分析图
    const equipmentEfficiencyContainer = document.getElementById('equipment-efficiency-chart');
    if (equipmentEfficiencyContainer) {
        equipmentEfficiencyChart = echarts.init(equipmentEfficiencyContainer);
    }
    
    // 科室申请量排名图
    const departmentRankingContainer = document.getElementById('department-ranking-chart');
    if (departmentRankingContainer) {
        departmentRankingChart = echarts.init(departmentRankingContainer);
    }
    
    // 窗口大小改变时调整图表
    window.addEventListener('resize', function() {
        if (examVolumeChart) examVolumeChart.resize();
        if (endoscopyTypeChart) endoscopyTypeChart.resize();
        if (equipmentEfficiencyChart) equipmentEfficiencyChart.resize();
        if (departmentRankingChart) departmentRankingChart.resize();
    });
}

// 加载数据
function loadData() {
    updateOverviewCards();
    updateCharts();
}

// 更新概览卡片
function updateOverviewCards() {
    // 模拟数据
    const overviewData = {
        totalExams: { value: 2856, trend: 8.5, unit: '人次' },
        totalRevenue: { value: 485.6, trend: 12.3, unit: '万元' },
        equipmentUsage: { value: 87.5, trend: -2.1, unit: '%' },
        avgExamTime: { value: 28.5, trend: -5.2, unit: '分钟' }
    };
    
    // 更新总检查人次
    updateTrendValue('total-exams-value', overviewData.totalExams.value, overviewData.totalExams.unit);
    updateTrendValue('total-exams-trend', overviewData.totalExams.trend, '%', true);
    
    // 更新总收入
    updateTrendValue('total-revenue-value', overviewData.totalRevenue.value, overviewData.totalRevenue.unit);
    updateTrendValue('total-revenue-trend', overviewData.totalRevenue.trend, '%', true);
    
    // 更新设备使用率
    updateTrendValue('equipment-usage-value', overviewData.equipmentUsage.value, overviewData.equipmentUsage.unit);
    updateTrendValue('equipment-usage-trend', overviewData.equipmentUsage.trend, '%', true);
    
    // 更新平均检查时长
    updateTrendValue('avg-exam-time-value', overviewData.avgExamTime.value, overviewData.avgExamTime.unit);
    updateTrendValue('avg-exam-time-trend', overviewData.avgExamTime.trend, '%', true);
}

// 更新趋势值
function updateTrendValue(elementId, value, unit, isTrend = false) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    if (isTrend) {
        const isPositive = value > 0;
        const icon = isPositive ? '↗' : '↘';
        const className = isPositive ? 'trend-up' : 'trend-down';
        element.innerHTML = `<span class="${className}">${icon} ${Math.abs(value)}${unit}</span>`;
    } else {
        element.textContent = `${value}${unit}`;
    }
}

// 更新图表
function updateCharts() {
    updateExamVolumeChart();
    updateEndoscopyTypeChart();
    updateEquipmentEfficiencyChart();
    updateDepartmentRankingChart();
}

// 更新检查量趋势图
function updateExamVolumeChart() {
    if (!examVolumeChart) return;
    
    const option = {
        title: {
            text: '',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        legend: {
            data: ['胃镜', '肠镜', '支气管镜', '其他'],
            top: 20
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        },
        yAxis: {
            type: 'value',
            name: '检查人次'
        },
        series: [
            {
                name: '胃镜',
                type: 'line',
                stack: 'Total',
                data: [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330]
            },
            {
                name: '肠镜',
                type: 'line',
                stack: 'Total',
                data: [220, 182, 191, 234, 290, 330, 310, 201, 154, 190, 330, 410]
            },
            {
                name: '支气管镜',
                type: 'line',
                stack: 'Total',
                data: [150, 232, 201, 154, 190, 330, 410, 320, 332, 301, 334, 390]
            },
            {
                name: '其他',
                type: 'line',
                stack: 'Total',
                data: [320, 332, 301, 334, 390, 330, 320, 150, 232, 201, 154, 190]
            }
        ]
    };
    
    examVolumeChart.setOption(option);
}

// 更新内镜类型分布图
function updateEndoscopyTypeChart() {
    if (!endoscopyTypeChart) return;
    
    const option = {
        title: {
            text: '',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left'
        },
        series: [
            {
                name: '内镜类型',
                type: 'pie',
                radius: '50%',
                data: [
                    { value: 1048, name: '胃镜检查' },
                    { value: 735, name: '肠镜检查' },
                    { value: 580, name: '支气管镜' },
                    { value: 484, name: '胆道镜' },
                    { value: 300, name: '其他内镜' }
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
    
    endoscopyTypeChart.setOption(option);
}

// 更新设备运行效率分析图
function updateEquipmentEfficiencyChart() {
    if (!equipmentEfficiencyChart) return;
    
    const option = {
        title: {
            text: '',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['使用率', '故障率'],
            top: 20
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['胃镜1号', '胃镜2号', '肠镜1号', '肠镜2号', '支气管镜', '胆道镜']
        },
        yAxis: {
            type: 'value',
            name: '百分比(%)'
        },
        series: [
            {
                name: '使用率',
                type: 'bar',
                data: [85, 92, 78, 88, 75, 82],
                itemStyle: {
                    color: '#5470c6'
                }
            },
            {
                name: '故障率',
                type: 'bar',
                data: [5, 3, 8, 4, 12, 6],
                itemStyle: {
                    color: '#ee6666'
                }
            }
        ]
    };
    
    equipmentEfficiencyChart.setOption(option);
}

// 更新科室申请量排名图
function updateDepartmentRankingChart() {
    if (!departmentRankingChart) return;
    
    const option = {
        title: {
            text: '',
            left: 'center'
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
            name: '申请量(人次)'
        },
        yAxis: {
            type: 'category',
            data: ['消化内科', '呼吸内科', '普外科', '胸外科', '肿瘤科', '急诊科']
        },
        series: [
            {
                name: '申请量',
                type: 'bar',
                data: [520, 432, 301, 234, 190, 154],
                itemStyle: {
                    color: function(params) {
                        const colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272'];
                        return colors[params.dataIndex % colors.length];
                    }
                }
            }
        ]
    };
    
    departmentRankingChart.setOption(option);
}

// 绑定事件
function bindEvents() {
    // 概览卡片趋势按钮点击事件
    document.querySelectorAll('.trend-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const cardType = this.closest('.overview-card').querySelector('.card-title').textContent;
            showTrendModal(cardType);
        });
    });
    
    // 图表筛选器变化事件
    document.querySelectorAll('.chart-filter').forEach(filter => {
        filter.addEventListener('change', function() {
            const chartId = this.closest('.chart-container').querySelector('.chart-wrapper').id;
            updateChartByFilter(chartId, this.value);
        });
    });
}

// 根据筛选器更新图表
function updateChartByFilter(chartId, filterValue) {
    console.log(`更新图表 ${chartId}，筛选条件: ${filterValue}`);
    // 这里可以根据不同的筛选条件重新加载数据和更新图表
}

// 刷新图表
function refreshChart(chartId) {
    console.log(`刷新图表: ${chartId}`);
    // 重新加载数据并更新对应图表
    switch(chartId) {
        case 'exam-volume-chart':
            updateExamVolumeChart();
            break;
        case 'endoscopy-type-chart':
            updateEndoscopyTypeChart();
            break;
        case 'equipment-efficiency-chart':
            updateEquipmentEfficiencyChart();
            break;
        case 'department-ranking-chart':
            updateDepartmentRankingChart();
            break;
    }
}

// 显示趋势模态框
function showTrendModal(cardType) {
    console.log(`显示 ${cardType} 的趋势详情`);
    // 这里可以实现模态框显示逻辑
}

// 关闭趋势模态框
function closeTrendModal() {
    const modal = document.getElementById('trend-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 更新趋势图表
function updateTrendChart(cardType) {
    console.log(`更新 ${cardType} 的趋势图表`);
    // 这里可以实现趋势图表的更新逻辑
}

// 获取趋势标题
function getTrendTitle(cardType) {
    const titles = {
        '总检查人次': '检查人次趋势分析',
        '总收入': '收入趋势分析',
        '设备使用率': '设备使用率趋势',
        '平均检查时长': '检查时长趋势'
    };
    return titles[cardType] || '趋势分析';
}

// 获取趋势数据
function getTrendData(cardType) {
    // 模拟趋势数据
    const trendData = {
        '总检查人次': {
            categories: ['1月', '2月', '3月', '4月', '5月', '6月'],
            data: [2156, 2298, 2456, 2634, 2789, 2856]
        },
        '总收入': {
            categories: ['1月', '2月', '3月', '4月', '5月', '6月'],
            data: [398.5, 425.6, 445.2, 468.9, 475.3, 485.6]
        },
        '设备使用率': {
            categories: ['1月', '2月', '3月', '4月', '5月', '6月'],
            data: [82.3, 85.6, 88.9, 91.2, 89.6, 87.5]
        },
        '平均检查时长': {
            categories: ['1月', '2月', '3月', '4月', '5月', '6月'],
            data: [32.1, 31.5, 30.8, 29.9, 29.2, 28.5]
        }
    };
    return trendData[cardType] || { categories: [], data: [] };
}