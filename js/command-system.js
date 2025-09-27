// 全局 showLoading 函数
window.showLoading = function() {
    console.log('显示加载动画...');
    // 这里应该是显示加载动画的代码
};

// 全局 hideLoading 函数
window.hideLoading = function() {
    console.log('隐藏加载动画...');
    // 这里应该是隐藏加载动画的代码
};

/**
 * 综合运营指挥系统页面JavaScript
 * 与首页保持一致的引用风格
 */

// 定义 showLoading 函数
function showLoading() {
    console.log('显示加载动画...');
    // 这里应该是显示加载动画的代码
}

// 定义 hideLoading 函数
function hideLoading() {
    console.log('隐藏加载动画...');
    // 这里应该是隐藏加载动画的代码
}

const CommandSystemPage = {
    // 图表实例
    charts: {},
    
    // 初始化页面
    init: function() {
        console.log('初始化综合运营指挥系统页面...');
        
        // 初始化事件监听
        this.initEventListeners();
        
        // 加载数据
        this.loadData();
        
        // 初始化图表
        this.initCharts();
    },
    
    // 初始化事件监听
    initEventListeners: function() {
        // 刷新按钮
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadData();
                this.refreshCharts();
            });
        }
        
        // 导出按钮
        const exportBtn = document.getElementById('export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportReport();
            });
        }
        
        // 时间范围选择
        const timeRangeSelect = document.getElementById('time-range');
        if (timeRangeSelect) {
            timeRangeSelect.addEventListener('change', () => {
                this.loadData();
                this.refreshCharts();
            });
        }
        
        // 科室类型选择
        const departmentTypeSelect = document.getElementById('department-type');
        if (departmentTypeSelect) {
            departmentTypeSelect.addEventListener('change', () => {
                this.loadData();
                this.refreshCharts();
            });
        }
        
        // 窗口大小变化时，重新调整图表大小
        window.addEventListener('resize', () => {
            this.resizeCharts();
        });
    },
    
    // 加载数据
    loadData: function() {
        console.log('加载综合运营指挥系统数据...');
        
        // 显示加载动画
        showLoading();
        
        // 这里应该是从服务器获取数据
        // 为了演示，我们使用模拟数据
        this.data = this.getMockData();
        
        // 隐藏加载动画
        hideLoading();
    },
    
    // 获取模拟数据
    getMockData: function() {
        return {
            // 科室收入数据
            departmentRevenue: {
                departments: ['内科', '外科', '妇产科', '儿科', '急诊科', '骨科', '心内科', '神经科'],
                revenue: [485.6, 568.2, 386.4, 245.8, 356.7, 425.3, 512.8, 398.5]
            },
            
            // 收入趋势数据
            revenueTrend: {
                months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                revenue: [1850, 1920, 1980, 2050, 2100, 2150, 2200, 2250, 2300, 2350, 2400, 2450]
            },
            
            // 床位使用状态数据
            bedUsage: {
                departments: ['内科', '外科', '妇产科', '儿科', '急诊科', '骨科', '心内科', '神经科'],
                used: [185, 168, 142, 118, 190, 156, 172, 148],
                total: [200, 190, 166, 150, 200, 170, 180, 160]
            },
            
            // 手术间使用状态数据
            operatingRoom: {
                rooms: ['手术室1', '手术室2', '手术室3', '手术室4', '手术室5', '手术室6', '手术室7', '手术室8'],
                status: [
                    { used: 8, idle: 12, preparing: 4 },
                    { used: 10, idle: 10, preparing: 4 },
                    { used: 6, idle: 14, preparing: 4 },
                    { used: 12, idle: 8, preparing: 4 },
                    { used: 9, idle: 11, preparing: 4 },
                    { used: 7, idle: 13, preparing: 4 },
                    { used: 11, idle: 9, preparing: 4 },
                    { used: 8, idle: 12, preparing: 4 }
                ]
            },
            
            // 预警指标分布数据
            warningDistribution: {
                departments: ['内科', '外科', '妇产科', '儿科', '急诊科', '骨科', '心内科', '神经科'],
                normal: [15, 18, 20, 22, 12, 17, 16, 19],
                warning: [3, 2, 1, 0, 4, 2, 3, 1],
                alert: [1, 1, 0, 0, 2, 0, 1, 0]
            },
            
            // 预警趋势数据
            warningTrend: {
                dates: this.getLast30Days(),
                warnings: [5, 7, 3, 8, 6, 9, 4, 7, 5, 6, 8, 4, 7, 9, 5, 6, 4, 8, 7, 5, 6, 9, 7, 4, 5, 8, 6, 7, 5, 4],
                alerts: [2, 1, 3, 2, 4, 1, 2, 3, 1, 2, 3, 1, 2, 4, 1, 3, 2, 1, 2, 3, 1, 2, 3, 1, 2, 1, 3, 2, 1, 2]
            }
        };
    },
    
    // 获取过去30天的日期
    getLast30Days: function() {
        const dates = [];
        const today = new Date();
        
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            dates.push(`${date.getMonth() + 1}/${date.getDate()}`);
        }
        
        return dates;
    },
    
    // 初始化图表
    initCharts: function() {
        // 检查ECharts是否已加载
        if (typeof echarts === 'undefined') {
            console.error('ECharts 未加载，尝试动态加载...');
            Common.loadJS('https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js', () => {
                this.initCharts();
            });
            return;
        }
        
        // 初始化各个图表
        this.initDepartmentRevenueChart();
        this.initRevenueTrendChart();
        this.initBedUsageChart();
        this.initOperatingRoomChart();
        this.initWarningDistributionChart();
        this.initWarningTrendChart();
    },
    
    // 初始化科室收入对比图表
    initDepartmentRevenueChart: function() {
        const chartContainer = document.getElementById('departmentRevenueChart');
        if (!chartContainer) {
            console.error('科室收入对比图表容器不存在');
            return;
        }
        
        const chart = echarts.init(chartContainer);
        this.charts.departmentRevenue = chart;
        
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: '{b}: {c} 万元'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: this.data.departmentRevenue.departments,
                axisLabel: {
                    interval: 0,
                    rotate: 30
                }
            },
            yAxis: {
                type: 'value',
                name: '收入(万元)'
            },
            series: [
                {
                    name: '科室收入',
                    type: 'bar',
                    data: this.data.departmentRevenue.revenue,
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#83bff6' },
                            { offset: 0.5, color: '#188df0' },
                            { offset: 1, color: '#188df0' }
                        ])
                    },
                    emphasis: {
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#2378f7' },
                                { offset: 0.7, color: '#2378f7' },
                                { offset: 1, color: '#83bff6' }
                            ])
                        }
                    }
                }
            ]
        };
        
        chart.setOption(option);
    },
    
    // 初始化收入趋势分析图表
    initRevenueTrendChart: function() {
        const chartContainer = document.getElementById('revenueTrendChart');
        if (!chartContainer) {
            console.error('收入趋势分析图表容器不存在');
            return;
        }
        
        const chart = echarts.init(chartContainer);
        this.charts.revenueTrend = chart;
        
        const option = {
            tooltip: {
                trigger: 'axis'
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
                data: this.data.revenueTrend.months
            },
            yAxis: {
                type: 'value',
                name: '收入(万元)'
            },
            series: [
                {
                    name: '医疗收入',
                    type: 'line',
                    data: this.data.revenueTrend.revenue,
                    smooth: true,
                    lineStyle: {
                        width: 3,
                        color: '#5470c6'
                    },
                    symbol: 'circle',
                    symbolSize: 8,
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(84, 112, 198, 0.5)' },
                            { offset: 1, color: 'rgba(84, 112, 198, 0.1)' }
                        ])
                    }
                }
            ]
        };
        
        chart.setOption(option);
    },
    
    // 初始化床位使用状态图表
    initBedUsageChart: function() {
        const chartContainer = document.getElementById('bedUsageChart');
        if (!chartContainer) {
            console.error('床位使用状态图表容器不存在');
            return;
        }
        
        const chart = echarts.init(chartContainer);
        this.charts.bedUsage = chart;
        
        // 计算床位使用率
        const usageRates = this.data.bedUsage.departments.map((dept, index) => {
            return (this.data.bedUsage.used[index] / this.data.bedUsage.total[index] * 100).toFixed(1);
        });
        
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function(params) {
                    const deptIndex = params[0].dataIndex;
                    const dept = CommandSystemPage.data.bedUsage.departments[deptIndex];
                    const used = CommandSystemPage.data.bedUsage.used[deptIndex];
                    const total = CommandSystemPage.data.bedUsage.total[deptIndex];
                    const rate = usageRates[deptIndex];
                    return `${dept}<br/>已用: ${used}床<br/>总数: ${total}床<br/>使用率: ${rate}%`;
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: this.data.bedUsage.departments,
                axisLabel: {
                    interval: 0,
                    rotate: 30
                }
            },
            yAxis: {
                type: 'value',
                name: '床位数量',
                max: function(value) {
                    return Math.ceil(value.max * 1.2);
                }
            },
            series: [
                {
                    name: '已用床位',
                    type: 'bar',
                    stack: 'total',
                    data: this.data.bedUsage.used,
                    itemStyle: {
                        color: '#5470c6'
                    }
                },
                {
                    name: '空闲床位',
                    type: 'bar',
                    stack: 'total',
                    data: this.data.bedUsage.total.map((total, index) => total - this.data.bedUsage.used[index]),
                    itemStyle: {
                        color: '#91cc75'
                    }
                }
            ]
        };
        
        chart.setOption(option);
    },
    
    // 初始化手术间使用状态图表
    initOperatingRoomChart: function() {
        const chartContainer = document.getElementById('operatingRoomChart');
        if (!chartContainer) {
            console.error('手术间使用状态图表容器不存在');
            return;
        }
        
        const chart = echarts.init(chartContainer);
        this.charts.operatingRoom = chart;
        
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['使用中', '空闲', '准备中']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: this.data.operatingRoom.rooms
            },
            yAxis: {
                type: 'value',
                name: '小时数'
            },
            series: [
                {
                    name: '使用中',
                    type: 'bar',
                    stack: 'total',
                    data: this.data.operatingRoom.status.map(status => status.used),
                    itemStyle: {
                        color: '#5470c6'
                    }
                },
                {
                    name: '空闲',
                    type: 'bar',
                    stack: 'total',
                    data: this.data.operatingRoom.status.map(status => status.idle),
                    itemStyle: {
                        color: '#91cc75'
                    }
                },
                {
                    name: '准备中',
                    type: 'bar',
                    stack: 'total',
                    data: this.data.operatingRoom.status.map(status => status.preparing),
                    itemStyle: {
                        color: '#fac858'
                    }
                }
            ]
        };
        
        chart.setOption(option);
    },
    
    // 初始化预警指标分布图表
    initWarningDistributionChart: function() {
        const chartContainer = document.getElementById('warningDistributionChart');
        if (!chartContainer) {
            console.error('预警指标分布图表容器不存在');
            return;
        }
        
        const chart = echarts.init(chartContainer);
        this.charts.warningDistribution = chart;
        
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['正常', '预警', '告警']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: this.data.warningDistribution.departments,
                axisLabel: {
                    interval: 0,
                    rotate: 30
                }
            },
            yAxis: {
                type: 'value',
                name: '指标数量'
            },
            series: [
                {
                    name: '正常',
                    type: 'bar',
                    stack: 'total',
                    data: this.data.warningDistribution.normal,
                    itemStyle: {
                        color: '#91cc75'
                    }
                },
                {
                    name: '预警',
                    type: 'bar',
                    stack: 'total',
                    data: this.data.warningDistribution.warning,
                    itemStyle: {
                        color: '#fac858'
                    }
                },
                {
                    name: '告警',
                    type: 'bar',
                    stack: 'total',
                    data: this.data.warningDistribution.alert,
                    itemStyle: {
                        color: '#ee6666'
                    }
                }
            ]
        };
        
        chart.setOption(option);
    },
    
    // 初始化预警趋势分析图表
    initWarningTrendChart: function() {
        const chartContainer = document.getElementById('warningTrendChart');
        if (!chartContainer) {
            console.error('预警趋势分析图表容器不存在');
            return;
        }
        
        const chart = echarts.init(chartContainer);
        this.charts.warningTrend = chart;
        
        const option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['预警', '告警']
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
                data: this.data.warningTrend.dates,
                axisLabel: {
                    interval: 2
                }
            },
            yAxis: {
                type: 'value',
                name: '次数'
            },
            series: [
                {
                    name: '预警',
                    type: 'line',
                    data: this.data.warningTrend.warnings,
                    smooth: true,
                    lineStyle: {
                        width: 3,
                        color: '#fac858'
                    },
                    symbol: 'circle',
                    symbolSize: 8
                },
                {
                    name: '告警',
                    type: 'line',
                    data: this.data.warningTrend.alerts,
                    smooth: true,
                    lineStyle: {
                        width: 3,
                        color: '#ee6666'
                    },
                    symbol: 'circle',
                    symbolSize: 8
                }
            ]
        };
        
        chart.setOption(option);
    },
    
    // 刷新图表
    refreshCharts: function() {
        // 重新加载数据
        this.loadData();
        
        // 更新各个图表
        Object.keys(this.charts).forEach(chartId => {
            const chart = this.charts[chartId];
            if (chart) {
                // 根据图表ID调用相应的更新方法
                switch (chartId) {
                    case 'departmentRevenue':
                        this.updateDepartmentRevenueChart(chart);
                        break;
                    case 'revenueTrend':
                        this.updateRevenueTrendChart(chart);
                        break;
                    case 'bedUsage':
                        this.updateBedUsageChart(chart);
                        break;
                    case 'operatingRoom':
                        this.updateOperatingRoomChart(chart);
                        break;
                    case 'warningDistribution':
                        this.updateWarningDistributionChart(chart);
                        break;
                    case 'warningTrend':
                        this.updateWarningTrendChart(chart);
                        break;
                }
            }
        });
    },
    
    // 更新科室收入对比图表
    updateDepartmentRevenueChart: function(chart) {
        const option = {
            series: [
                {
                    data: this.data.departmentRevenue.revenue
                }
            ]
        };
        chart.setOption(option);
    },
    
    // 更新收入趋势分析图表
    updateRevenueTrendChart: function(chart) {
        const option = {
            xAxis: {
                data: this.data.revenueTrend.months
            },
            series: [
                {
                    data: this.data.revenueTrend.revenue
                }
            ]
        };
        chart.setOption(option);
    },
    
    // 更新床位使用状态图表
    updateBedUsageChart: function(chart) {
        const option = {
            xAxis: {
                data: this.data.bedUsage.departments
            },
            series: [
                {
                    data: this.data.bedUsage.used
                },
                {
                    data: this.data.bedUsage.total.map((total, index) => total - this.data.bedUsage.used[index])
                }
            ]
        };
        chart.setOption(option);
    },
    
    // 更新手术间使用状态图表
    updateOperatingRoomChart: function(chart) {
        const option = {
            xAxis: {
                data: this.data.operatingRoom.rooms
            },
            series: [
                {
                    data: this.data.operatingRoom.status.map(status => status.used)
                },
                {
                    data: this.data.operatingRoom.status.map(status => status.idle)
                },
                {
                    data: this.data.operatingRoom.status.map(status => status.preparing)
                }
            ]
        };
        chart.setOption(option);
    },
    
    // 更新预警指标分布图表
    updateWarningDistributionChart: function(chart) {
        const option = {
            xAxis: {
                data: this.data.warningDistribution.departments
            },
            series: [
                {
                    data: this.data.warningDistribution.normal
                },
                {
                    data: this.data.warningDistribution.warning
                },
                {
                    data: this.data.warningDistribution.alert
                }
            ]
        };
        chart.setOption(option);
    },
    
    // 更新预警趋势分析图表
    updateWarningTrendChart: function(chart) {
        const option = {
            xAxis: {
                data: this.data.warningTrend.dates
            },
            series: [
                {
                    data: this.data.warningTrend.warnings
                },
                {
                    data: this.data.warningTrend.alerts
                }
            ]
        };
        chart.setOption(option);
    },
    
    // 调整图表大小
    resizeCharts: function() {
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.resize();
            }
        });
    },
    
    // 导出报告
    exportReport: function() {
        console.log('导出综合运营指挥系统报告...');
        
        // 这里应该是实现导出功能的代码
        // 为了演示，我们只显示一个提示
        Common.showToast('报告导出功能正在开发中...');
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 检查Common对象是否已加载
    if (typeof Common === 'undefined') {
        console.error('Common 对象未加载，尝试动态加载...');
        // 动态加载common.js
        const script = document.createElement('script');
        script.src = '../js/common.js';
        script.onload = function() {
            CommandSystemPage.init();
        };
        document.head.appendChild(script);
    } else {
        CommandSystemPage.init();
    }
});