// 医学影像运营分析页面JavaScript
var MedicalImagingPage = {
    // 初始化页面
    init: function() {
        this.initEventListeners();
        this.loadData();
    },
    
    // 初始化事件监听
    initEventListeners: function() {
        // 刷新按钮点击事件
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', function() {
                MedicalImagingPage.refreshData();
            });
        }
        
        // 导出按钮点击事件
        const exportBtn = document.getElementById('export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', function() {
                MedicalImagingPage.exportData();
            });
        }
        
        // 图表控制按钮事件
        this.bindChartControls();
        
        // 概览卡片趋势按钮事件
        this.bindTrendButtons();
        
        // 时间周期选择器变化事件
        const timePeriod = document.getElementById('time-period');
        if (timePeriod) {
            timePeriod.addEventListener('change', function() {
                MedicalImagingPage.updateTimeFilterVisibility();
                MedicalImagingPage.loadData();
            });
        }
        
        // 年份选择器变化事件
        const yearSelect = document.getElementById('year-select');
        if (yearSelect) {
            yearSelect.addEventListener('change', function() {
                MedicalImagingPage.loadData();
            });
        }
        
        // 季度选择器变化事件
        const quarterSelect = document.getElementById('quarter-select');
        if (quarterSelect) {
            quarterSelect.addEventListener('change', function() {
                MedicalImagingPage.loadData();
            });
        }
        
        // 图表缩放按钮点击事件
        const zoomButtons = document.querySelectorAll('.chart-zoom-btn');
        zoomButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                zoomButtons.forEach(function(btn) {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
                MedicalImagingPage.loadData();
            });
        });
        
        // 图表筛选器变化事件
        const chartFilters = document.querySelectorAll('.chart-filter');
        chartFilters.forEach(function(filter) {
            filter.addEventListener('change', function() {
                MedicalImagingPage.loadData();
            });
        });
    },
    
    // 更新时间筛选器可见性
    updateTimeFilterVisibility: function() {
        const timePeriod = document.getElementById('time-period');
        const quarterSelect = document.getElementById('quarter-select');
        
        if (timePeriod && quarterSelect) {
            if (timePeriod.value === 'quarter') {
                quarterSelect.style.display = 'inline-block';
            } else {
                quarterSelect.style.display = 'none';
            }
        }
    },
    
    // 加载数据
    loadData: function() {
        // 显示图表加载动画
        this.showChartLoading(true);
        
        // 获取选择的时间周期和年份
        const timePeriod = document.getElementById('time-period')?.value || 'year';
        const year = document.getElementById('year-select')?.value || '2023';
        const quarter = document.getElementById('quarter-select')?.value || '1';
        
        // 模拟API调用，加载数据
        setTimeout(function() {
            const mockData = MedicalImagingPage.getMockData(timePeriod, year, quarter);
            MedicalImagingPage.updateOverviewCards(mockData.overview);
            MedicalImagingPage.initCharts(mockData.charts);
            MedicalImagingPage.fillExamDetailTable(mockData.examDetails);
            
            // 隐藏加载动画
            setTimeout(() => {
                MedicalImagingPage.showChartLoading(false);
            }, 300);
        }, 500);
    },
    
    // 显示/隐藏图表加载动画
    showChartLoading: function(show) {
        const chartContainers = document.querySelectorAll('.chart-container');
        chartContainers.forEach(container => {
            if (show) {
                container.classList.add('chart-loading');
            } else {
                container.classList.remove('chart-loading');
            }
        });
    },
    
    // 刷新数据
    refreshData: function() {
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            const originalText = refreshBtn.innerHTML;
            refreshBtn.innerHTML = '刷新中...';
            refreshBtn.disabled = true;
            
            // 重新加载数据
            setTimeout(function() {
                MedicalImagingPage.loadData();
                refreshBtn.innerHTML = originalText;
                refreshBtn.disabled = false;
            }, 800);
        }
    },
    
    // 导出数据
    exportData: function() {
        alert('数据已成功导出！');
    },
    
    // 绑定图表控制按钮事件
    bindChartControls: function() {
        // 时间周期控制按钮
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // 移除其他按钮的active状态
                e.target.parentNode.querySelectorAll('.control-btn').forEach(b => b.classList.remove('active'));
                // 添加当前按钮的active状态
                e.target.classList.add('active');
                
                const period = e.target.dataset.period;
                this.updateTrendChart(period);
            });
        });
        
        // 刷新按钮
        document.querySelectorAll('.refresh-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const chartType = e.target.dataset.chart;
                this.refreshChart(chartType);
            });
        });
    },
    
    // 绑定趋势按钮事件
    bindTrendButtons: function() {
        document.querySelectorAll('.trend-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cardType = e.target.dataset.card;
                this.showTrendModal(cardType);
            });
        });
    },
    
    // 更新趋势图
    updateTrendChart: function(period) {
        console.log(`更新趋势图，周期: ${period}天`);
        // 这里可以重新获取数据并更新图表
        this.loadData();
    },
    
    // 刷新指定图表
    refreshChart: function(chartType) {
        console.log(`刷新图表: ${chartType}`);
        // 显示加载状态
        this.showChartLoading(true);
        
        // 模拟数据刷新
        setTimeout(() => {
            this.loadData();
            this.showChartLoading(false);
        }, 1000);
    },
    
    // 显示趋势详情模态框
    showTrendModal: function(cardType) {
        console.log(`显示${cardType}趋势详情`);
        // 这里可以实现趋势详情的模态框显示
    },
    
    // 获取模拟数据
    getMockData: function(timePeriod, year, quarter) {
        // 根据时间周期生成模拟数据
        let examVolumeData = [];
        let equipmentDistributionData = [];
        let equipmentEfficiencyData = [];
        let departmentRankingData = [];
        let examDetailsData = [];
        let overviewData = {};
        
        // 生成检查量趋势数据
        if (timePeriod === 'year') {
            examVolumeData = [
                {year: '2023年', mri: 2.5, ct: 4.8, dr: 12.5, ultrasound: 8.2},
                {year: '2024年', mri: 2.8, ct: 5.2, dr: 13.2, ultrasound: 8.8},
                {year: '2025年', mri: 3.2, ct: 5.8, dr: 14.5, ultrasound: 9.5}
            ];
        } else if (timePeriod === 'quarter') {
            const quarters = ['第一季度', '第二季度', '第三季度', '第四季度'];
            for (let i = 0; i < quarters.length; i++) {
                examVolumeData.push({
                    year: quarters[i],
                    mri: 0.7 + Math.random() * 0.2,
                    ct: 1.3 + Math.random() * 0.3,
                    dr: 3.5 + Math.random() * 0.5,
                    ultrasound: 2.2 + Math.random() * 0.3
                });
            }
        } else {
            const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
            for (let i = 0; i < months.length; i++) {
                examVolumeData.push({
                    year: months[i],
                    mri: 0.25 + Math.random() * 0.1,
                    ct: 0.45 + Math.random() * 0.15,
                    dr: 1.2 + Math.random() * 0.2,
                    ultrasound: 0.75 + Math.random() * 0.1
                });
            }
        }
        
        // 设备检查类型分布数据
        equipmentDistributionData = [
            {name: 'MRI', value: 15},
            {name: 'CT', value: 25},
            {name: 'DR', value: 35},
            {name: '彩超', value: 25}
        ];
        
        // 设备运行效率数据
        equipmentEfficiencyData = [
            {name: 'MRI', usage: 82.5, avgExamTime: 25, avgWaitTime: 15},
            {name: 'CT', usage: 88.2, avgExamTime: 15, avgWaitTime: 12},
            {name: 'DR', usage: 92.8, avgExamTime: 5, avgWaitTime: 8},
            {name: '彩超', usage: 90.5, avgExamTime: 10, avgWaitTime: 10}
        ];
        
        // 临床科室申请量排名数据
        departmentRankingData = [
            {name: '心内科', volume: 1250, revenue: 850},
            {name: '骨科', volume: 1180, revenue: 780},
            {name: '神经外科', volume: 980, revenue: 820},
            {name: '神经内科', volume: 920, revenue: 680},
            {name: '普外科', volume: 880, revenue: 620},
            {name: '消化内科', volume: 850, revenue: 580},
            {name: '呼吸内科', volume: 780, revenue: 520},
            {name: '妇产科', volume: 720, revenue: 480}
        ];
        
        // 影像检查明细数据
        examDetailsData = [
            {item: '头颅MRI平扫+增强', volume: 3250, revenue: 285, avgTime: 30, positiveRate: 52.5, appointmentRate: 96.2},
            {item: '胸部CT平扫', volume: 4820, revenue: 320, avgTime: 15, positiveRate: 48.3, appointmentRate: 94.5},
            {item: '腹部CT增强', volume: 3680, revenue: 410, avgTime: 20, positiveRate: 54.8, appointmentRate: 95.8},
            {item: '胸部DR正侧位', volume: 12500, revenue: 380, avgTime: 5, positiveRate: 42.6, appointmentRate: 88.9},
            {item: '心脏彩超', volume: 6850, revenue: 520, avgTime: 15, positiveRate: 49.2, appointmentRate: 92.3},
            {item: '腹部彩超', volume: 7280, revenue: 450, avgTime: 12, positiveRate: 46.8, appointmentRate: 91.5}
        ];
        
        // 数据概览
        overviewData = {
            totalExams: 38380,
            totalRevenue: 2365,
            equipmentUsage: 88.5,
            avgExamTime: 16.5,
            examsTrend: 12.5,
            revenueTrend: 8.3,
            equipmentTrend: 3.2,
            timeTrend: -5.8
        };
        
        // 影像质量监控数据
        const qualityData = {
            imageQuality: [92, 94, 91, 95, 93, 96],
            retakeRate: [3.2, 2.8, 3.5, 2.1, 2.9, 1.8],
            diagnosisAccuracy: [96, 97, 95, 98, 97, 98],
            months: ['1月', '2月', '3月', '4月', '5月', '6月']
        };
        
        // 报告时间分析数据
        const reportTimeData = {
            avgReportTime: [12, 18, 6, 4, 8, 24],
            overtimeRate: [8, 12, 3, 2, 5, 15],
            examTypes: ['CT', 'MRI', 'DR', '彩超', '钼靶', '胃肠造影']
        };
        
        // 预约情况分析数据
        const appointmentData = [
            { value: 1048, name: '正常预约' },
            { value: 735, name: '加急预约' },
            { value: 580, name: '取消预约' },
            { value: 484, name: '改期预约' },
            { value: 300, name: '未到检查' }
        ];
        
        // 收入构成分析数据
        const revenueStructureData = {
            examFee: [320, 450, 180, 120, 90, 200],
            materialFee: [120, 180, 60, 40, 30, 80],
            diagnosisFee: [80, 120, 40, 30, 20, 50],
            examTypes: ['CT', 'MRI', 'DR', '彩超', '钼靶', '胃肠造影']
        };
        
        return {
            overview: overviewData,
            charts: {
                examVolumeData: examVolumeData,
                equipmentDistributionData: equipmentDistributionData,
                equipmentEfficiencyData: equipmentEfficiencyData,
                departmentRankingData: departmentRankingData,
                qualityData: qualityData,
                reportTimeData: reportTimeData,
                appointmentData: appointmentData,
                revenueStructureData: revenueStructureData
            },
            examDetails: examDetailsData
        };
    },
    
    // 更新概览卡片
    updateOverviewCards: function(data) {
        const totalExamsEl = document.getElementById('total-exams');
        const totalRevenueEl = document.getElementById('total-revenue');
        const equipmentUsageEl = document.getElementById('equipment-usage');
        const avgExamTimeEl = document.getElementById('avg-exam-time');
        
        // 更新主要指标
        if (totalExamsEl) totalExamsEl.innerText = data.totalExams.toLocaleString();
        if (totalRevenueEl) totalRevenueEl.innerText = '¥' + (data.totalRevenue / 10000).toFixed(1) + '万';
        if (equipmentUsageEl) equipmentUsageEl.innerText = data.equipmentUsage.toFixed(1) + '%';
        if (avgExamTimeEl) avgExamTimeEl.innerText = data.avgExamTime.toFixed(1) + '分钟';
        
        // 更新趋势信息
        if (data.examsTrend) {
            const examsTrendEl = document.getElementById('exams-trend');
            if (examsTrendEl) {
                examsTrendEl.textContent = `${data.examsTrend > 0 ? '↗' : '↘'} ${data.examsTrend > 0 ? '+' : ''}${data.examsTrend}%`;
                examsTrendEl.className = `trend ${data.examsTrend > 0 ? 'positive' : 'negative'}`;
            }
        }
        
        if (data.revenueTrend) {
            const revenueTrendEl = document.getElementById('revenue-trend');
            if (revenueTrendEl) {
                revenueTrendEl.textContent = `${data.revenueTrend > 0 ? '↗' : '↘'} ${data.revenueTrend > 0 ? '+' : ''}${data.revenueTrend}%`;
                revenueTrendEl.className = `trend ${data.revenueTrend > 0 ? 'positive' : 'negative'}`;
            }
        }
        
        if (data.equipmentTrend) {
            const equipmentTrendEl = document.getElementById('equipment-trend');
            if (equipmentTrendEl) {
                equipmentTrendEl.textContent = `${data.equipmentTrend > 0 ? '↗' : '↘'} ${data.equipmentTrend > 0 ? '+' : ''}${data.equipmentTrend}%`;
                equipmentTrendEl.className = `trend ${data.equipmentTrend > 0 ? 'positive' : 'negative'}`;
            }
        }
        
        if (data.timeTrend) {
            const timeTrendEl = document.getElementById('time-trend');
            if (timeTrendEl) {
                timeTrendEl.textContent = `${data.timeTrend > 0 ? '↗' : '↘'} ${data.timeTrend > 0 ? '+' : ''}${data.timeTrend}%`;
                timeTrendEl.className = `trend ${data.timeTrend > 0 ? 'negative' : 'positive'}`; // 时间减少是好事
            }
        }
    },
    
    // 初始化图表
    initCharts: function(data) {
        // 检查ECharts是否加载
        if (typeof echarts !== 'undefined') {
            // 检查量趋势图
            this.initExamVolumeChart(data.examVolumeData);
            
            // 设备检查类型分布图
            this.initEquipmentDistributionChart(data.equipmentDistributionData);
            
            // 设备运行效率分析图
            this.initEquipmentEfficiencyChart(data.equipmentEfficiencyData);
            
            // 临床科室申请量排名图
            this.initDepartmentRankingChart(data.departmentRankingData);
            
            // 影像质量监控图
            this.initQualityMonitorChart(data.qualityData);
            
            // 报告时间分析图
            this.initReportTimeChart(data.reportTimeData);
            
            // 预约情况分析图
            this.initAppointmentChart(data.appointmentData);
            
            // 收入构成分析图
            this.initRevenueStructureChart(data.revenueStructureData);
        } else {
            console.warn('ECharts library not loaded');
        }
    },
    
    // 初始化检查量趋势图
    initExamVolumeChart: function(data) {
        const chartDom = document.getElementById('exam-volume-chart');
        if (!chartDom) return;
        
        try {
            // 使用默认主题
            const myChart = echarts.init(chartDom);
            
            // 添加渐变颜色数组
            const gradientColors = [
                new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: 'rgba(0, 102, 204, 0.8)' },
                    { offset: 1, color: 'rgba(0, 102, 204, 0.1)' }
                ]),
                new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: 'rgba(82, 196, 26, 0.8)' },
                    { offset: 1, color: 'rgba(82, 196, 26, 0.1)' }
                ]),
                new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: 'rgba(250, 173, 20, 0.8)' },
                    { offset: 1, color: 'rgba(250, 173, 20, 0.1)' }
                ]),
                new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: 'rgba(245, 34, 45, 0.8)' },
                    { offset: 1, color: 'rgba(245, 34, 45, 0.1)' }
                ])
            ];
            
            const option = {
                backgroundColor: 'transparent',
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    },
                    formatter: function(params) {
                        let result = params[0].axisValue + '<br/>';
                        params.forEach(function(param) {
                            result += param.marker + param.seriesName + ': ' + Math.round(param.value * 100) / 100 + '万人次<br/>';
                        });
                        return result;
                    }
                },
                legend: {
                    data: ['MRI', 'CT', 'DR', '彩超'],
                    top: 0,
                    textStyle: {
                        color: '#a0aec0'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    top: '15%',
                    containLabel: true,
                    backgroundColor: 'rgba(26, 32, 44, 0.3)'
                },
                xAxis: {
                    type: 'category',
                    data: data.map(item => item.year),
                    axisPointer: {
                        type: 'shadow'
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#4a5568'
                        }
                    },
                    axisLabel: {
                        color: '#a0aec0'
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}万',
                        color: '#a0aec0'
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#4a5568'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#2d3748',
                            type: 'dashed'
                        }
                    }
                },
                series: [
                    {
                        name: 'MRI',
                        type: 'line',
                        data: data.map(item => item.mri),
                        smooth: true,
                        areaStyle: {
                            color: gradientColors[0]
                        },
                        itemStyle: {color: '#0066cc'},
                        lineStyle: {
                            color: '#0066cc',
                            width: 3
                        },
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowColor: 'rgba(0, 102, 204, 0.5)'
                            }
                        }
                    },
                    {
                        name: 'CT',
                        type: 'line',
                        data: data.map(item => item.ct),
                        smooth: true,
                        areaStyle: {
                            color: gradientColors[1]
                        },
                        itemStyle: {color: '#52c41a'},
                        lineStyle: {
                            color: '#52c41a',
                            width: 3
                        },
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowColor: 'rgba(82, 196, 26, 0.5)'
                            }
                        }
                    },
                    {
                        name: 'DR',
                        type: 'line',
                        data: data.map(item => item.dr),
                        smooth: true,
                        areaStyle: {
                            color: gradientColors[2]
                        },
                        itemStyle: {color: '#faad14'},
                        lineStyle: {
                            color: '#faad14',
                            width: 3
                        },
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowColor: 'rgba(250, 173, 20, 0.5)'
                            }
                        }
                    },
                    {
                        name: '彩超',
                        type: 'line',
                        data: data.map(item => item.ultrasound),
                        smooth: true,
                        areaStyle: {
                            color: gradientColors[3]
                        },
                        itemStyle: {color: '#f5222d'},
                        lineStyle: {
                            color: '#f5222d',
                            width: 3
                        },
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowColor: 'rgba(245, 34, 45, 0.5)'
                            }
                        }
                    }
                ]
            };
            
            myChart.setOption(option);
            
            // 图表加载动画
            myChart.dispatchAction({ type: 'showTip', seriesIndex: 0, dataIndex: 0 });
            setTimeout(() => {
                myChart.dispatchAction({ type: 'hideTip' });
            }, 2000);
            
            // 响应式调整
            window.addEventListener('resize', function() {
                myChart.resize();
            });
        } catch (e) {
            console.error('Failed to initialize exam volume chart:', e);
        }
    },
    
    // 初始化设备检查类型分布图
    initEquipmentDistributionChart: function(data) {
        const chartDom = document.getElementById('equipment-distribution-chart');
        if (!chartDom) return;
        
        try {
            const myChart = echarts.init(chartDom);
            
            // 现代化配色方案 - 使用渐变色
            const modernColors = [
                {
                    type: 'linear',
                    x: 0, y: 0, x2: 1, y2: 1,
                    colorStops: [
                        { offset: 0, color: '#667eea' },
                        { offset: 1, color: '#764ba2' }
                    ]
                },
                {
                    type: 'linear',
                    x: 0, y: 0, x2: 1, y2: 1,
                    colorStops: [
                        { offset: 0, color: '#f093fb' },
                        { offset: 1, color: '#f5576c' }
                    ]
                },
                {
                    type: 'linear',
                    x: 0, y: 0, x2: 1, y2: 1,
                    colorStops: [
                        { offset: 0, color: '#4facfe' },
                        { offset: 1, color: '#00f2fe' }
                    ]
                },
                {
                    type: 'linear',
                    x: 0, y: 0, x2: 1, y2: 1,
                    colorStops: [
                        { offset: 0, color: '#43e97b' },
                        { offset: 1, color: '#38f9d7' }
                    ]
                },
                {
                    type: 'linear',
                    x: 0, y: 0, x2: 1, y2: 1,
                    colorStops: [
                        { offset: 0, color: '#fa709a' },
                        { offset: 1, color: '#fee140' }
                    ]
                }
            ];
            
            const option = {
                backgroundColor: 'transparent',
                tooltip: {
                    trigger: 'item',
                    formatter: function(params) {
                        return `<div style="padding: 8px 12px; background: rgba(0,0,0,0.8); border-radius: 8px; border: none; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
                                    <div style="color: #fff; font-weight: bold; margin-bottom: 4px;">${params.name}</div>
                                    <div style="color: #a0aec0;">数量: <span style="color: #4facfe; font-weight: bold;">${params.value}</span></div>
                                    <div style="color: #a0aec0;">占比: <span style="color: #43e97b; font-weight: bold;">${params.percent}%</span></div>
                                </div>`;
                    },
                    backgroundColor: 'transparent',
                    borderWidth: 0,
                    textStyle: {
                        color: '#fff'
                    }
                },
                legend: {
                    orient: 'vertical',
                    left: '5%',
                    top: 'center',
                    data: data.map(item => item.name),
                    textStyle: {
                        color: '#64748b',
                        fontSize: 13,
                        fontWeight: '500'
                    },
                    icon: 'roundRect',
                    itemWidth: 14,
                    itemHeight: 14,
                    itemGap: 16,
                    formatter: function(name) {
                        const item = data.find(d => d.name === name);
                        return `{a|${name}} {b|${item ? item.value : ''}}`;
                    },
                    textStyle: {
                        rich: {
                            a: {
                                color: '#1e293b',
                                fontSize: 13,
                                fontWeight: '500',
                                width: 80
                            },
                            b: {
                                color: '#64748b',
                                fontSize: 12,
                                fontWeight: 'bold'
                            }
                        }
                    }
                },
                series: [
                    {
                        name: '检查类型分布',
                        type: 'pie',
                        radius: ['45%', '75%'],
                        center: ['65%', '50%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 8,
                            borderColor: '#fff',
                            borderWidth: 3,
                            shadowBlur: 15,
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                            color: function(params) {
                                return modernColors[params.dataIndex % modernColors.length];
                            }
                        },
                        label: {
                            show: true,
                            position: 'outside',
                            formatter: function(params) {
                                return `{a|${params.percent}%}\n{b|${params.name}}`;
                            },
                            rich: {
                                a: {
                                    color: '#1e293b',
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    lineHeight: 20
                                },
                                b: {
                                    color: '#64748b',
                                    fontSize: 12,
                                    lineHeight: 16
                                }
                            },
                            distanceToLabelLine: 5
                        },
                        labelLine: {
                            show: true,
                            length: 15,
                            length2: 8,
                            smooth: true,
                            lineStyle: {
                                color: '#cbd5e1',
                                width: 2
                            }
                        },
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 25,
                                shadowColor: 'rgba(0, 0, 0, 0.2)',
                                scale: true,
                                scaleSize: 5
                            },
                            label: {
                                fontSize: 18,
                                fontWeight: 'bold'
                            }
                        },
                        data: data,
                        animationType: 'scale',
                        animationEasing: 'cubicOut',
                        animationDelay: function(idx) {
                            return idx * 100;
                        },
                        animationDuration: 1000
                    }
                ]
            };
            
            myChart.setOption(option);
            
            // 添加交互动画
            let currentIndex = -1;
            setInterval(() => {
                if (currentIndex >= 0) {
                    myChart.dispatchAction({
                        type: 'downplay',
                        seriesIndex: 0,
                        dataIndex: currentIndex
                    });
                }
                currentIndex = (currentIndex + 1) % data.length;
                myChart.dispatchAction({
                    type: 'highlight',
                    seriesIndex: 0,
                    dataIndex: currentIndex
                });
            }, 3000);
            
            // 响应式调整
            window.addEventListener('resize', function() {
                myChart.resize();
            });
        } catch (e) {
            console.error('Failed to initialize equipment distribution chart:', e);
        }
    },
    
    // 初始化设备运行效率分析图
    initEquipmentEfficiencyChart: function(data) {
        const chartDom = document.getElementById('equipment-efficiency-chart');
        if (!chartDom) return;
        
        try {
            // 使用默认主题
            const myChart = echarts.init(chartDom);
            
            // 添加渐变颜色
            const barGradient1 = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(0, 102, 204, 0.9)' },
                { offset: 1, color: 'rgba(0, 102, 204, 0.4)' }
            ]);
            
            const barGradient2 = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(82, 196, 26, 0.9)' },
                { offset: 1, color: 'rgba(82, 196, 26, 0.4)' }
            ]);
            
            const barGradient3 = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(250, 173, 20, 0.9)' },
                { offset: 1, color: 'rgba(250, 173, 20, 0.4)' }
            ]);
            
            const option = {
                backgroundColor: 'transparent',
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function(params) {
                        let result = params[0].axisValue + '<br/>';
                        params.forEach(function(param) {
                            const unit = param.seriesName === '使用率' ? '%' : '分钟';
                            result += param.marker + param.seriesName + ': ' + param.value + unit + '<br/>';
                        });
                        return result;
                    }
                },
                legend: {
                    data: ['使用率', '平均检查时长', '平均等待时长'],
                    top: 0,
                    textStyle: {
                        color: '#a0aec0'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    top: '15%',
                    containLabel: true,
                    backgroundColor: 'rgba(26, 32, 44, 0.3)'
                },
                xAxis: {
                    type: 'category',
                    data: data.map(item => item.name),
                    axisLine: {
                        lineStyle: {
                            color: '#4a5568'
                        }
                    },
                    axisLabel: {
                        color: '#a0aec0'
                    }
                },
                yAxis: [
                    {
                        type: 'value',
                        name: '使用率',
                        min: 0,
                        max: 100,
                        interval: 20,
                        axisLabel: {
                            formatter: '{value}%',
                            color: '#a0aec0'
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#4a5568'
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                color: '#2d3748',
                                type: 'dashed'
                            }
                        }
                    },
                    {
                        type: 'value',
                        name: '时长',
                        min: 0,
                        max: 40,
                        interval: 10,
                        axisLabel: {
                            formatter: '{value}分钟',
                            color: '#a0aec0'
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#4a5568'
                            }
                        },
                        splitLine: {
                            show: false
                        }
                    }
                ],
                series: [
                    {
                        name: '使用率',
                        type: 'bar',
                        data: data.map(item => item.usage),
                        itemStyle: {
                            color: barGradient1,
                            borderRadius: [5, 5, 0, 0]
                        },
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowColor: 'rgba(0, 102, 204, 0.5)'
                            }
                        },
                        animationDelay: function(idx) {
                            return idx * 100;
                        }
                    },
                    {
                        name: '平均检查时长',
                        type: 'bar',
                        yAxisIndex: 1,
                        data: data.map(item => item.avgExamTime),
                        itemStyle: {
                            color: barGradient2,
                            borderRadius: [5, 5, 0, 0]
                        },
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowColor: 'rgba(82, 196, 26, 0.5)'
                            }
                        },
                        animationDelay: function(idx) {
                            return idx * 100 + 100;
                        }
                    },
                    {
                        name: '平均等待时长',
                        type: 'bar',
                        yAxisIndex: 1,
                        data: data.map(item => item.avgWaitTime),
                        itemStyle: {
                            color: barGradient3,
                            borderRadius: [5, 5, 0, 0]
                        },
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowColor: 'rgba(250, 173, 20, 0.5)'
                            }
                        },
                        animationDelay: function(idx) {
                            return idx * 100 + 200;
                        }
                    }
                ],
                animationEasing: 'elasticOut',
                animationDelayUpdate: function(idx) {
                    return idx * 5;
                }
            };
            
            myChart.setOption(option);
            
            // 图表加载动画
            myChart.dispatchAction({ type: 'showTip', seriesIndex: 0, dataIndex: 0 });
            setTimeout(() => {
                myChart.dispatchAction({ type: 'hideTip' });
            }, 2000);
            
            // 响应式调整
            window.addEventListener('resize', function() {
                myChart.resize();
            });
        } catch (e) {
            console.error('Failed to initialize equipment efficiency chart:', e);
        }
    },
    
    // 初始化临床科室申请量排名图
    initDepartmentRankingChart: function(data) {
        const chartDom = document.getElementById('department-ranking-chart');
        if (!chartDom) return;
        
        try {
            // 使用默认主题
            const myChart = echarts.init(chartDom);
            
            // 按申请量降序排列
            data.sort(function(a, b) { return b.volume - a.volume; });
            
            const option = {
                backgroundColor: 'transparent',
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function(params) {
                        return params[0].name + ': ' + params[0].value + '人次';
                    }
                },
                grid: {
                    left: '15%',
                    right: '4%',
                    bottom: '3%',
                    top: '3%',
                    containLabel: true,
                    backgroundColor: 'rgba(26, 32, 44, 0.3)'
                },
                xAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}人次',
                        color: '#a0aec0'
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#4a5568'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#2d3748',
                            type: 'dashed'
                        }
                    }
                },
                yAxis: {
                    type: 'category',
                    data: data.map(item => item.name),
                    axisLabel: {
                        interval: 0,
                        fontSize: 12,
                        color: '#a0aec0'
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#4a5568'
                        }
                    }
                },
                series: [
                    {
                        name: '申请量',
                        type: 'bar',
                        data: data.map(item => item.volume),
                        itemStyle: {
                            color: function(params) {
                                // 蓝色渐变
                                const baseColor = '#0066cc';
                                const opacity = 0.4 + (params.dataIndex / (data.length - 1)) * 0.6;
                                const r = parseInt(baseColor.slice(1, 3), 16);
                                const g = parseInt(baseColor.slice(3, 5), 16);
                                const b = parseInt(baseColor.slice(5, 7), 16);
                                
                                return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                    { offset: 0, color: `rgba(${r}, ${g}, ${b}, 0.6)` },
                                    { offset: 1, color: `rgba(${r}, ${g}, ${b}, ${opacity})` }
                                ]);
                            },
                            borderRadius: [0, 5, 5, 0]
                        },
                        barWidth: '60%',
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowColor: 'rgba(0, 102, 204, 0.5)'
                            }
                        },
                        animationDelay: function(idx) {
                            return idx * 150;
                        }
                    }
                ],
                animationEasing: 'cubicOut'
            };
            
            myChart.setOption(option);
            
            // 图表加载动画
            myChart.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: 0 });
            setTimeout(() => {
                myChart.dispatchAction({ type: 'downplay', seriesIndex: 0, dataIndex: 0 });
            }, 2000);
            
            // 响应式调整
            window.addEventListener('resize', function() {
                myChart.resize();
            });
        } catch (e) {
            console.error('Failed to initialize department ranking chart:', e);
        }
    },
    
    // 影像质量监控图
    initQualityMonitorChart: function(data) {
        const chartDom = document.getElementById('qualityMonitorChart');
        if (!chartDom) return;
        
        const myChart = echarts.init(chartDom);
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'cross' }
            },
            legend: {
                data: ['图像质量评分', '重拍率', '诊断准确率']
            },
            xAxis: {
                type: 'category',
                data: ['1月', '2月', '3月', '4月', '5月', '6月']
            },
            yAxis: [
                {
                    type: 'value',
                    name: '评分',
                    min: 0,
                    max: 100
                },
                {
                    type: 'value',
                    name: '百分比(%)',
                    min: 0,
                    max: 10
                }
            ],
            series: [
                {
                    name: '图像质量评分',
                    type: 'line',
                    data: [92, 94, 91, 95, 93, 96],
                    smooth: true
                },
                {
                    name: '重拍率',
                    type: 'bar',
                    yAxisIndex: 1,
                    data: [3.2, 2.8, 3.5, 2.1, 2.9, 1.8]
                },
                {
                    name: '诊断准确率',
                    type: 'line',
                    data: [96, 97, 95, 98, 97, 98],
                    smooth: true
                }
            ]
        };
        myChart.setOption(option);
    },
    
    // 报告时间分析图
    initReportTimeChart: function(data) {
        const chartDom = document.getElementById('reportTimeChart');
        if (!chartDom) return;
        
        const myChart = echarts.init(chartDom);
        const option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['平均报告时间', '超时率']
            },
            xAxis: {
                type: 'category',
                data: ['CT', 'MRI', 'DR', '彩超', '钼靶', '胃肠造影']
            },
            yAxis: [
                {
                    type: 'value',
                    name: '时间(小时)',
                    min: 0,
                    max: 48
                },
                {
                    type: 'value',
                    name: '超时率(%)',
                    min: 0,
                    max: 20
                }
            ],
            series: [
                {
                    name: '平均报告时间',
                    type: 'bar',
                    data: [12, 18, 6, 4, 8, 24]
                },
                {
                    name: '超时率',
                    type: 'line',
                    yAxisIndex: 1,
                    data: [8, 12, 3, 2, 5, 15]
                }
            ]
        };
        myChart.setOption(option);
    },
    
    // 预约情况分析图
    initAppointmentChart: function(data) {
        const chartDom = document.getElementById('appointmentChart');
        if (!chartDom) return;
        
        const myChart = echarts.init(chartDom);
        const option = {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: '预约情况',
                    type: 'pie',
                    radius: '50%',
                    data: [
                        { value: 1048, name: '正常预约' },
                        { value: 735, name: '加急预约' },
                        { value: 580, name: '取消预约' },
                        { value: 484, name: '改期预约' },
                        { value: 300, name: '未到检查' }
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
        myChart.setOption(option);
    },
    
    // 收入构成分析图
    initRevenueStructureChart: function(data) {
        const chartDom = document.getElementById('revenueStructureChart');
        if (!chartDom) return;
        
        const myChart = echarts.init(chartDom);
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' }
            },
            legend: {
                data: ['检查费', '材料费', '诊断费']
            },
            xAxis: {
                type: 'category',
                data: ['CT', 'MRI', 'DR', '彩超', '钼靶', '胃肠造影']
            },
            yAxis: {
                type: 'value',
                name: '收入(万元)'
            },
            series: [
                {
                    name: '检查费',
                    type: 'bar',
                    stack: '总量',
                    data: [320, 450, 180, 120, 90, 200]
                },
                {
                    name: '材料费',
                    type: 'bar',
                    stack: '总量',
                    data: [120, 180, 60, 40, 30, 80]
                },
                {
                    name: '诊断费',
                    type: 'bar',
                    stack: '总量',
                    data: [80, 120, 40, 30, 20, 50]
                }
            ]
        };
        myChart.setOption(option);
    },
    
    // 填充检查详细数据表格
    fillExamDetailTable: function(data) {
        const tableBody = document.getElementById('exam-detail-table');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        data.forEach(function(item) {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${item.item}</td>
                <td>${item.volume.toLocaleString()}</td>
                <td>${item.revenue}</td>
                <td>${item.avgTime}</td>
                <td>${item.positiveRate}</td>
                <td>${item.appointmentRate}</td>
                <td>
                    <button class="btn btn-small">详情</button>
                    <button class="btn btn-small">导出</button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    MedicalImagingPage.init();
    // 初始设置时间筛选器可见性
    MedicalImagingPage.updateTimeFilterVisibility();
});