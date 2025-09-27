// 移动端运营页面JavaScript
const MobileOperationPage = {
    // 页面数据
    data: {
        // 移动端概览数据
        mobileOverview: {
            outpatient: { today: 1286, yesterday: 1156, trend: [1100, 1120, 1150, 1180, 1200, 1220, 1286] },
            inpatient: { today: 352, yesterday: 340, trend: [320, 325, 330, 335, 340, 345, 352] },
            revenue: { today: 128, yesterday: 120, trend: [110, 112, 115, 118, 120, 122, 128] }
        },
        // 用户活跃度数据
        userActivity: {
            daily: [120, 132, 101, 134, 90, 230, 210],
            weekly: [820, 932, 901, 934, 1290, 1330, 1320],
            monthly: [3200, 3320, 3100, 3340, 3900, 4300, 4200]
        },
        // 服务使用情况数据
        serviceUsage: {
            registration: 65,
            payment: 45,
            report: 78,
            consultation: 32
        },
        // 满意度分析数据
        satisfaction: {
            overall: 4.6,
            items: [
                { name: '服务态度', value: 4.8 },
                { name: '医疗质量', value: 4.7 },
                { name: '环境设施', value: 4.3 },
                { name: '等候时间', value: 4.2 },
                { name: '费用透明', value: 4.5 }
            ]
        },
        // 运营效率数据
        operationalEfficiency: {
            bedUtilization: 85,
            avgStayDays: 6.2,
            turnoverRate: 4.8,
            doctorEfficiency: 18
        }
    },

    // 加载数据
    loadData: function() {
        console.log('加载移动端运营数据...');
        // 这里可以添加从服务器获取数据的代码
    },

    // 更新数据
    updateData: function() {
        // 模拟数据更新
        this.data.mobileOverview.outpatient.today += Math.floor(Math.random() * 10) - 5;
        this.data.mobileOverview.inpatient.today += Math.floor(Math.random() * 5) - 2;
        this.data.mobileOverview.revenue.today += (Math.random() * 2 - 1).toFixed(1);
        
        // 更新显示
        this.updateDisplay();
    },

    // 更新显示
    updateDisplay: function() {
        // 更新门诊量
        const outpatientElements = document.querySelectorAll('.mobile-stat-value');
        if (outpatientElements.length > 0) {
            outpatientElements[0].textContent = this.data.mobileOverview.outpatient.today.toLocaleString();
        }
        
        // 更新住院量
        if (outpatientElements.length > 1) {
            outpatientElements[1].textContent = this.data.mobileOverview.inpatient.today.toLocaleString();
        }
        
        // 更新收入
        if (outpatientElements.length > 2) {
            outpatientElements[2].textContent = '¥' + this.data.mobileOverview.revenue.today + '万';
        }
    },

    // 初始化图表
    initCharts: function() {
        // 初始化移动端概览图表
        this.initMobileOverviewChart();
        
        // 初始化用户活跃度图表
        this.initUserActivityChart();
        
        // 初始化服务使用情况图表
        this.initServiceUsageChart();
        
        // 初始化满意度分析图表
        this.initSatisfactionChart();
        
        // 初始化运营效率图表
        this.initOperationalEfficiencyChart();
    },

    // 初始化移动端概览图表
    initMobileOverviewChart: function() {
        const chartDom = document.getElementById('mobile-overview-chart');
        if (!chartDom) return;
        
        const myChart = echarts.init(chartDom);
        const option = {
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '门诊量',
                    type: 'line',
                    data: this.data.mobileOverview.outpatient.trend,
                    smooth: true,
                    itemStyle: {
                        color: '#1890ff'
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(24, 144, 255, 0.5)' },
                            { offset: 1, color: 'rgba(24, 144, 255, 0.1)' }
                        ])
                    }
                },
                {
                    name: '住院量',
                    type: 'line',
                    data: this.data.mobileOverview.inpatient.trend,
                    smooth: true,
                    itemStyle: {
                        color: '#52c41a'
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(82, 196, 26, 0.5)' },
                            { offset: 1, color: 'rgba(82, 196, 26, 0.1)' }
                        ])
                    }
                }
            ]
        };
        
        myChart.setOption(option);
        
        // 响应式调整
        window.addEventListener('resize', function() {
            myChart.resize();
        });
    },

    // 初始化用户活跃度图表
    initUserActivityChart: function() {
        const chartDom = document.getElementById('user-activity-chart');
        if (!chartDom) return;
        
        const myChart = echarts.init(chartDom);
        const option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['日活跃', '周活跃', '月活跃']
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
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '日活跃',
                    type: 'line',
                    data: this.data.userActivity.daily,
                    smooth: true,
                    itemStyle: {
                        color: '#1890ff'
                    }
                },
                {
                    name: '周活跃',
                    type: 'line',
                    data: this.data.userActivity.weekly,
                    smooth: true,
                    itemStyle: {
                        color: '#52c41a'
                    }
                },
                {
                    name: '月活跃',
                    type: 'line',
                    data: this.data.userActivity.monthly,
                    smooth: true,
                    itemStyle: {
                        color: '#fa8c16'
                    }
                }
            ]
        };
        
        myChart.setOption(option);
        
        // 响应式调整
        window.addEventListener('resize', function() {
            myChart.resize();
        });
    },

    // 初始化服务使用情况图表
    initServiceUsageChart: function() {
        const chartDom = document.getElementById('service-usage-chart');
        if (!chartDom) return;
        
        const myChart = echarts.init(chartDom);
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c}%'
            },
            series: [
                {
                    name: '服务使用率',
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
                            fontSize: '16',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        { value: this.data.serviceUsage.registration, name: '预约挂号' },
                        { value: this.data.serviceUsage.payment, name: '缴费充值' },
                        { value: this.data.serviceUsage.report, name: '报告查询' },
                        { value: this.data.serviceUsage.consultation, name: '在线咨询' }
                    ]
                }
            ]
        };
        
        myChart.setOption(option);
        
        // 响应式调整
        window.addEventListener('resize', function() {
            myChart.resize();
        });
    },

    // 初始化满意度分析图表
    initSatisfactionChart: function() {
        const chartDom = document.getElementById('satisfaction-chart');
        if (!chartDom) return;
        
        const myChart = echarts.init(chartDom);
        const option = {
            radar: {
                indicator: [
                    { name: '服务态度', max: 5 },
                    { name: '医疗质量', max: 5 },
                    { name: '环境设施', max: 5 },
                    { name: '等候时间', max: 5 },
                    { name: '费用透明', max: 5 }
                ]
            },
            series: [{
                name: '满意度评分',
                type: 'radar',
                data: [
                    {
                        value: this.data.satisfaction.items.map(item => item.value),
                        name: '当前评分',
                        areaStyle: {
                            color: 'rgba(24, 144, 255, 0.3)'
                        },
                        lineStyle: {
                            color: '#1890ff'
                        },
                        itemStyle: {
                            color: '#1890ff'
                        }
                    }
                ]
            }]
        };
        
        myChart.setOption(option);
        
        // 响应式调整
        window.addEventListener('resize', function() {
            myChart.resize();
        });
    },

    // 初始化运营效率图表
    initOperationalEfficiencyChart: function() {
        const chartDom = document.getElementById('operational-efficiency-chart');
        if (!chartDom) return;
        
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
                data: ['床位使用率', '医生效率', '周转率', '平均住院日']
            },
            series: [
                {
                    name: '运营指标',
                    type: 'bar',
                    data: [
                        this.data.operationalEfficiency.bedUtilization,
                        this.data.operationalEfficiency.doctorEfficiency * 5,
                        this.data.operationalEfficiency.turnoverRate * 10,
                        100 - (this.data.operationalEfficiency.avgStayDays - 3) * 10
                    ],
                    itemStyle: {
                        color: function(params) {
                            const colorList = ['#1890ff', '#52c41a', '#fa8c16', '#722ed1'];
                            return colorList[params.dataIndex];
                        }
                    }
                }
            ]
        };
        
        myChart.setOption(option);
        
        // 响应式调整
        window.addEventListener('resize', function() {
            myChart.resize();
        });
    },

    // 初始化标签页切换功能
    initTabs: function() {
        document.querySelectorAll('.mobile-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                const tabContainer = this.parentElement;
                const tabId = this.getAttribute('data-tab');
                
                // 移除所有标签的active类
                tabContainer.querySelectorAll('.mobile-tab').forEach(t => t.classList.remove('active'));
                
                // 添加当前标签的active类
                this.classList.add('active');
                
                // 隐藏所有标签内容
                const card = this.closest('.mobile-card');
                card.querySelectorAll('.mobile-tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                // 显示对应的标签内容
                const targetContent = document.getElementById(tabId + '-tab');
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    },

    // 初始化按钮点击效果
    initButtons: function() {
        document.querySelectorAll('.mobile-button').forEach(button => {
            button.addEventListener('click', function() {
                const buttonText = this.textContent;
                console.log(`点击了按钮: ${buttonText}`);
                
                // 添加点击效果
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            });
        });
    },

    // 初始化列表项点击效果
    initListItems: function() {
        document.querySelectorAll('.mobile-list-item').forEach(item => {
            item.addEventListener('click', function() {
                const itemText = this.querySelector('.mobile-list-text').textContent;
                console.log(`点击了列表项: ${itemText}`);
                
                // 添加点击效果
                this.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                setTimeout(() => {
                    this.style.backgroundColor = '';
                }, 300);
            });
        });
    },

    // 初始化统计项动画效果
    initStatItems: function() {
        document.querySelectorAll('.mobile-stat-value').forEach(stat => {
            const finalValue = stat.textContent;
            const isNumeric = /^\d+$/.test(finalValue.replace(/,/g, ''));
            
            if (isNumeric) {
                const numericValue = parseInt(finalValue.replace(/,/g, ''));
                let currentValue = 0;
                const increment = Math.ceil(numericValue / 20);
                
                const counter = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= numericValue) {
                        currentValue = numericValue;
                        clearInterval(counter);
                    }
                    stat.textContent = currentValue.toLocaleString();
                }, 50);
            }
        });
    },

    // 初始化进度条动画效果
    initProgressBars: function() {
        document.querySelectorAll('.mobile-progress-fill').forEach(progress => {
            const width = progress.style.width;
            progress.style.width = '0';
            
            setTimeout(() => {
                progress.style.transition = 'width 1s ease-out';
                progress.style.width = width;
            }, 300);
        });
    },

    // 初始化所有功能
    init: function() {
        this.loadData();
        this.initCharts();
        this.initTabs();
        this.initButtons();
        this.initListItems();
        this.initStatItems();
        this.initProgressBars();
        
        // 模拟数据更新
        setInterval(() => {
            this.updateData();
        }, 10000);
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    MobileOperationPage.init();
});