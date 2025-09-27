// 掌上运营页面的图表和交互功能
const MobileOperationPage = {
    // 存储从JSON加载的数据
    data: null,
    
    // 从JSON文件加载数据
    loadData: function() {
        // 模拟从JSON文件加载数据
        // 实际项目中应该替换为真实的fetch请求
        return new Promise((resolve, reject) => {
            // 模拟网络延迟
            setTimeout(() => {
                this.data = {
                    // 移动端展示数据
                    mobileOverview: {
                        todayOutpatient: 1286,
                        todayInpatient: 352,
                        todayRevenue: 1280000,
                        weeklyTrend: {
                            days: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                            outpatient: [1120, 1250, 1320, 1280, 1350, 980, 850],
                            inpatient: [320, 340, 360, 350, 370, 290, 270],
                            revenue: [1120000, 1250000, 1320000, 1280000, 1350000, 980000, 850000]
                        }
                    },
                    
                    // 用户活跃度数据
                    userActivity: {
                        weeklyTrend: {
                            days: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                            activeUsers: [120, 135, 142, 138, 150, 95, 82]
                        },
                        monthlyTrend: {
                            months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                            activeUsers: [3200, 3500, 3800, 4200, 4500, 4800, 5200, 5500, 5800, 6200, 6500, 6800]
                        },
                        userComposition: {
                            byRole: [
                                { name: '医生', value: 45 },
                                { name: '护士', value: 30 },
                                { name: '管理人员', value: 15 },
                                { name: '其他', value: 10 }
                            ],
                            byDepartment: [
                                { name: '内科', value: 25 },
                                { name: '外科', value: 20 },
                                { name: '妇产科', value: 15 },
                                { name: '儿科', value: 12 },
                                { name: '骨科', value: 10 },
                                { name: '其他', value: 18 }
                            ]
                        }
                    },
                    
                    // 服务使用情况数据
                    serviceUsage: {
                        distribution: [
                            { name: '数据查询', value: 35 },
                            { name: '统计报表', value: 25 },
                            { name: '预警通知', value: 20 },
                            { name: '待办事项', value: 15 },
                            { name: '其他', value: 5 }
                        ],
                        growthTrend: {
                            months: ['1月', '2月', '3月', '4月', '5月', '6月'],
                            usageCount: [12000, 15000, 18000, 22000, 26000, 30000]
                        }
                    },
                    
                    // 满意度分析数据
                    satisfaction: {
                        score: 92.5,
                        distribution: [
                            { name: '非常满意', value: 65 },
                            { name: '满意', value: 25 },
                            { name: '一般', value: 8 },
                            { name: '不满意', value: 2 }
                        ]
                    },
                    
                    // 运营效率数据
                    operationEfficiency: {
                        metrics: [
                            { name: '响应速度', value: 95 },
                            { name: '数据更新及时性', value: 92 },
                            { name: '功能可用性', value: 96 },
                            { name: '系统稳定性', value: 94 },
                            { name: '操作便捷性', value: 90 }
                        ],
                        responseTime: {
                            months: ['1月', '2月', '3月', '4月', '5月', '6月'],
                            time: [1.2, 1.1, 0.9, 0.8, 0.7, 0.6]
                        }
                    }
                };
                resolve(this.data);
            }, 500);
        });
    },
    
    // 初始化所有图表
    initCharts: function() {
        if (!this.data) {
            console.error('No data available for charts');
            return;
        }
        
        // 初始化移动端概览图表
        this.initMobileOverviewChart();
        
        // 初始化用户活跃度相关图表
        this.initUserActiveTrendChart('week');
        this.initUserCompositionChart('role');
        
        // 初始化服务使用情况相关图表
        this.initServiceDistributionChart();
        this.initServiceGrowthChart('month');
        
        // 初始化满意度分析相关图表
        this.initSatisfactionScoreChart();
        this.initSatisfactionDistributionChart();
        
        // 初始化运营效率相关图表
        this.initEfficiencyMetricsChart();
        this.initResponseTimeChart();
    },
    
    // 初始化移动端概览图表
    initMobileOverviewChart: function() {
        const chartDom = document.getElementById('mobile-overview-chart');
        const myChart = echarts.init(chartDom);
        
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            legend: {
                data: ['门诊量', '住院量'],
                textStyle: {
                    fontSize: 10
                },
                top: 0
            },
            grid: {
                left: '3%',
                right: '3%',
                bottom: '3%',
                top: '25%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: this.data.mobileOverview.weeklyTrend.days,
                axisLabel: {
                    fontSize: 10
                }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    fontSize: 10
                }
            },
            series: [
                {
                    name: '门诊量',
                    type: 'line',
                    data: this.data.mobileOverview.weeklyTrend.outpatient,
                    smooth: true,
                    lineStyle: {
                        color: '#0066cc',
                        width: 2
                    },
                    symbol: 'circle',
                    symbolSize: 4
                },
                {
                    name: '住院量',
                    type: 'line',
                    data: this.data.mobileOverview.weeklyTrend.inpatient,
                    smooth: true,
                    lineStyle: {
                        color: '#52c41a',
                        width: 2
                    },
                    symbol: 'circle',
                    symbolSize: 4
                }
            ]
        };
        
        myChart.setOption(option);
        
        // 窗口大小改变时重新调整图表大小
        window.addEventListener('resize', function() {
            myChart.resize();
        });
    },
    
    // 初始化用户活跃趋势图表
    initUserActiveTrendChart: function(period) {
        const chartDom = document.getElementById('user-active-trend-chart');
        const myChart = echarts.init(chartDom);
        
        let xAxisData, seriesData;
        
        if (period === 'week') {
            xAxisData = this.data.userActivity.weeklyTrend.days;
            seriesData = this.data.userActivity.weeklyTrend.activeUsers;
        } else if (period === 'month') {
            xAxisData = this.data.userActivity.monthlyTrend.months;
            seriesData = this.data.userActivity.monthlyTrend.activeUsers;
        }
        
        const option = {
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
                type: 'category',
                data: xAxisData
            },
            yAxis: {
                type: 'value',
                name: '活跃用户数'
            },
            series: [
                {
                    name: '活跃用户数',
                    type: 'bar',
                    data: seriesData,
                    itemStyle: {
                        color: '#0066cc',
                        borderRadius: [4, 4, 0, 0]
                    }
                }
            ]
        };
        
        myChart.setOption(option);
        
        // 窗口大小改变时重新调整图表大小
        window.addEventListener('resize', function() {
            myChart.resize();
        });
    },
    
    // 初始化用户构成分析图表
    initUserCompositionChart: function(type) {
        const chartDom = document.getElementById('user-composition-chart');
        const myChart = echarts.init(chartDom);
        
        let seriesData;
        
        if (type === 'role') {
            seriesData = this.data.userActivity.userComposition.byRole;
        } else if (type === 'department') {
            seriesData = this.data.userActivity.userComposition.byDepartment;
        }
        
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c}%'
            },
            legend: {
                orient: 'vertical',
                left: 10,
                top: 'middle',
                textStyle: {
                    fontSize: 12
                }
            },
            series: [
                {
                    name: '用户构成',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    center: ['60%', '50%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 8,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: false
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 14,
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: seriesData
                }
            ]
        };
        
        myChart.setOption(option);
        
        // 窗口大小改变时重新调整图表大小
        window.addEventListener('resize', function() {
            myChart.resize();
        });
    },
    
    // 初始化服务分布图表
    initServiceDistributionChart: function() {
        const chartDom = document.getElementById('service-distribution-chart');
        const myChart = echarts.init(chartDom);
        
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c}%'
            },
            series: [
                {
                    name: '服务使用分布',
                    type: 'pie',
                    radius: '65%',
                    center: ['50%', '50%'],
                    data: this.data.serviceUsage.distribution,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    itemStyle: {
                        color: function(params) {
                            const colors = ['#0066cc', '#1890ff', '#40a9ff', '#69c0ff', '#91d5ff'];
                            return colors[params.dataIndex];
                        }
                    }
                }
            ]
        };
        
        myChart.setOption(option);
        
        // 窗口大小改变时重新调整图表大小
        window.addEventListener('resize', function() {
            myChart.resize();
        });
    },
    
    // 初始化服务增长趋势图表
    initServiceGrowthChart: function(period) {
        const chartDom = document.getElementById('service-growth-chart');
        const myChart = echarts.init(chartDom);
        
        // 简化处理，这里仅使用月度数据
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'line'
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
                data: this.data.serviceUsage.growthTrend.months
            },
            yAxis: {
                type: 'value',
                name: '使用次数'
            },
            series: [
                {
                    name: '服务使用次数',
                    type: 'line',
                    data: this.data.serviceUsage.growthTrend.usageCount,
                    smooth: true,
                    itemStyle: {
                        color: '#0066cc'
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: 'rgba(0, 102, 204, 0.3)'
                            },
                            {
                                offset: 1,
                                color: 'rgba(0, 102, 204, 0.05)'
                            }
                        ])
                    }
                }
            ]
        };
        
        myChart.setOption(option);
        
        // 窗口大小改变时重新调整图表大小
        window.addEventListener('resize', function() {
            myChart.resize();
        });
    },
    
    // 初始化满意度评分图表
    initSatisfactionScoreChart: function() {
        const chartDom = document.getElementById('satisfaction-score-chart');
        const myChart = echarts.init(chartDom);
        
        const score = this.data.satisfaction.score;
        
        const option = {
            series: [
                {
                    name: '满意度评分',
                    type: 'gauge',
                    radius: '90%',
                    startAngle: 180,
                    endAngle: 0,
                    min: 0,
                    max: 100,
                    splitNumber: 10,
                    axisLine: {
                        lineStyle: {
                            width: 30,
                            color: [
                                [0.5, '#ff4d4f'],
                                [0.7, '#faad14'],
                                [0.9, '#52c41a'],
                                [1, '#0066cc']
                            ]
                        }
                    },
                    pointer: {
                        icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                        length: '12%',
                        width: 8,
                        offsetCenter: [0, '-60%'],
                        itemStyle: {
                            color: 'auto'
                        }
                    },
                    axisTick: {
                        length: 12,
                        lineStyle: {
                            color: 'auto',
                            width: 2
                        }
                    },
                    splitLine: {
                        length: 20,
                        lineStyle: {
                            color: 'auto',
                            width: 5
                        }
                    },
                    axisLabel: {
                        color: '#464646',
                        fontSize: 14,
                        distance: -60,
                        formatter: function(value) {
                            if (value === 0) {
                                return '0';
                            } else if (value === 50) {
                                return '50';
                            } else if (value === 100) {
                                return '100';
                            }
                            return '';
                        }
                    },
                    title: {
                        offsetCenter: [0, '-20%'],
                        fontSize: 14
                    },
                    detail: {
                        offsetCenter: [0, '0%'],
                        formatter: '{value}分',
                        fontSize: 24,
                        color: '#0066cc'
                    },
                    data: [
                        {
                            value: score,
                            name: '满意度'
                        }
                    ]
                }
            ]
        };
        
        myChart.setOption(option);
        
        // 窗口大小改变时重新调整图表大小
        window.addEventListener('resize', function() {
            myChart.resize();
        });
    },
    
    // 初始化满意度分布图表
    initSatisfactionDistributionChart: function() {
        const chartDom = document.getElementById('satisfaction-distribution-chart');
        const myChart = echarts.init(chartDom);
        
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c}%'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: this.data.satisfaction.distribution.map(item => item.name)
            },
            yAxis: {
                type: 'value',
                name: '占比(%)'
            },
            series: [
                {
                    name: '满意度分布',
                    type: 'bar',
                    data: this.data.satisfaction.distribution.map(item => item.value),
                    itemStyle: {
                        color: function(params) {
                            const colors = ['#52c41a', '#73d13d', '#faad14', '#ff4d4f'];
                            return colors[params.dataIndex];
                        },
                        borderRadius: [4, 4, 0, 0]
                    },
                    label: {
                        show: true,
                        position: 'top',
                        formatter: '{c}%'
                    }
                }
            ]
        };
        
        myChart.setOption(option);
        
        // 窗口大小改变时重新调整图表大小
        window.addEventListener('resize', function() {
            myChart.resize();
        });
    },
    
    // 初始化运营效率指标图表
    initEfficiencyMetricsChart: function() {
        const chartDom = document.getElementById('efficiency-metrics-chart');
        const myChart = echarts.init(chartDom);
        
        const option = {
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
                max: 100
            },
            yAxis: {
                type: 'category',
                data: this.data.operationEfficiency.metrics.map(item => item.name)
            },
            series: [
                {
                    name: '效率指标',
                    type: 'bar',
                    data: this.data.operationEfficiency.metrics.map(item => item.value),
                    itemStyle: {
                        color: function(params) {
                            const value = params.value;
                            if (value >= 90) return '#0066cc';
                            else if (value >= 80) return '#52c41a';
                            else if (value >= 70) return '#faad14';
                            else return '#ff4d4f';
                        },
                        borderRadius: [0, 4, 4, 0]
                    },
                    label: {
                        show: true,
                        position: 'right',
                        formatter: '{c}'
                    }
                }
            ]
        };
        
        myChart.setOption(option);
        
        // 窗口大小改变时重新调整图表大小
        window.addEventListener('resize', function() {
            myChart.resize();
        });
    },
    
    // 初始化响应时间图表
    initResponseTimeChart: function() {
        const chartDom = document.getElementById('response-time-chart');
        const myChart = echarts.init(chartDom);
        
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
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
                data: this.data.operationEfficiency.responseTime.months
            },
            yAxis: {
                type: 'value',
                name: '响应时间(秒)',
                max: 2
            },
            series: [
                {
                    name: '响应时间',
                    type: 'line',
                    data: this.data.operationEfficiency.responseTime.time,
                    smooth: true,
                    itemStyle: {
                        color: '#ff4d4f'
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: 'rgba(255, 77, 79, 0.3)'
                            },
                            {
                                offset: 1,
                                color: 'rgba(255, 77, 79, 0.05)'
                            }
                        ])
                    }
                }
            ]
        };
        
        myChart.setOption(option);
        
        // 窗口大小改变时重新调整图表大小
        window.addEventListener('resize', function() {
            myChart.resize();
        });
    },
    
    // 更新移动端时间显示
    updateMobileTime: function() {
        const deviceTime = document.querySelector('.device-time');
        if (deviceTime) {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            deviceTime.textContent = `${hours}:${minutes}`;
        }
    },
    
    // 初始化主题标签切换
    initThemeTabs: function() {
        const themeTabs = document.querySelectorAll('.theme-tab-item');
        themeTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // 移除所有标签的激活状态
                themeTabs.forEach(t => t.classList.remove('active'));
                
                // 添加当前标签的激活状态
                tab.classList.add('active');
                
                // 隐藏所有内容
                const contents = document.querySelectorAll('.theme-content');
                contents.forEach(content => content.classList.remove('active'));
                
                // 显示对应内容
                const target = tab.getAttribute('data-theme');
                document.getElementById(target).classList.add('active');
            });
        });
    },
    
    // 初始化图表时间周期切换
    initPeriodToggle: function() {
        const periodBtns = document.querySelectorAll('.chart-action-btn[data-period]');
        periodBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // 获取父级容器中的所有按钮
                const parent = btn.parentElement;
                const siblings = parent.querySelectorAll('.chart-action-btn[data-period]');
                
                // 移除所有按钮的激活状态
                siblings.forEach(s => s.classList.remove('active'));
                
                // 添加当前按钮的激活状态
                btn.classList.add('active');
                
                // 获取周期类型
                const period = btn.getAttribute('data-period');
                
                // 更新对应图表
                if (parent.closest('#user-active-trend-chart').parentElement) {
                    this.initUserActiveTrendChart(period);
                } else if (parent.closest('#service-growth-chart').parentElement) {
                    this.initServiceGrowthChart(period);
                }
            });
        });
    },
    
    // 初始化用户构成类型切换
    initUserTypeToggle: function() {
        const typeBtns = document.querySelectorAll('.chart-action-btn[data-type]');
        typeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // 获取父级容器中的所有按钮
                const parent = btn.parentElement;
                const siblings = parent.querySelectorAll('.chart-action-btn[data-type]');
                
                // 移除所有按钮的激活状态
                siblings.forEach(s => s.classList.remove('active'));
                
                // 添加当前按钮的激活状态
                btn.classList.add('active');
                
                // 获取类型
                const type = btn.getAttribute('data-type');
                
                // 更新图表
                this.initUserCompositionChart(type);
            });
        });
    },
    
    // 初始化日期范围选择器
    initDateRangeSelector: function() {
        const dateRangeSelect = document.getElementById('date-range-select');
        dateRangeSelect.addEventListener('change', () => {
            const selectedValue = dateRangeSelect.value;
            // 这里可以根据选择的日期范围更新数据和图表
            console.log(`已切换到${dateRangeSelect.options[dateRangeSelect.selectedIndex].text}数据`);
        });
    },
    
    // 初始化刷新按钮
    initRefreshButton: function() {
        const refreshBtn = document.querySelector('.btn-default');
        refreshBtn.addEventListener('click', () => {
            // 模拟刷新操作
            setTimeout(() => {
                this.loadData().then(() => {
                    this.initCharts();
                    this.updateMobileTime();
                });
            }, 1000);
        });
    },
    
    // 初始化导出按钮
    initExportButton: function() {
        const exportBtn = document.querySelector('.btn-primary');
        exportBtn.addEventListener('click', () => {
            // 模拟导出操作
            setTimeout(() => {
                // 导出完成
            }, 1500);
        });
    },
    
    // 初始化页面
    init: function() {
        this.loadData()
            .then(() => {
                // 初始化所有图表
                this.initCharts();
                
                // 更新移动端时间
                this.updateMobileTime();
                setInterval(() => this.updateMobileTime(), 60000); // 每分钟更新一次
                
                // 初始化主题标签切换
                this.initThemeTabs();
                
                // 初始化图表周期切换
                this.initPeriodToggle();
                
                // 初始化用户构成类型切换
                this.initUserTypeToggle();
                
                // 初始化日期范围选择器
                this.initDateRangeSelector();
                
                // 初始化刷新按钮
                this.initRefreshButton();
                
                // 初始化导出按钮
                this.initExportButton();
            })
            .catch(() => {
                console.error('Failed to initialize page');
            });
    }
};

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', function() {
    MobileOperationPage.init();
});