// 病理检验页面功能实现
const PathologyPage = {
    // 初始化页面
    init: function() {
        this.bindEvents();
        this.loadData();
        // 延迟初始化图表，确保DOM完全加载
        setTimeout(() => {
            this.initCharts();
        }, 100);
        this.updateTimeFilterVisibility();
    },
    
    // 绑定事件
    bindEvents: function() {
        // 刷新按钮点击事件
        document.getElementById('refresh-btn').addEventListener('click', () => {
            this.loadData(true);
        });
        
        // 导出按钮点击事件
        document.getElementById('export-btn').addEventListener('click', () => {
            this.exportData();
        });
        
        // 时间周期选择事件
        document.getElementById('time-period').addEventListener('change', () => {
            this.updateTimeFilterVisibility();
            this.loadData();
        });
        
        // 年份选择事件
        document.getElementById('year-select').addEventListener('change', () => {
            this.loadData();
        });
        
        // 季度选择事件
        document.getElementById('quarter-select').addEventListener('change', () => {
            this.loadData();
        });
    },
    
    // 更新时间筛选器可见性
    updateTimeFilterVisibility: function() {
        const timePeriod = document.getElementById('time-period').value;
        const quarterSelect = document.getElementById('quarter-select');
        
        if (timePeriod === 'quarter') {
            quarterSelect.style.display = 'inline-block';
        } else {
            quarterSelect.style.display = 'none';
        }
    },
    
    // 加载数据
    loadData: function(isRefresh = false) {
        const timePeriod = document.getElementById('time-period').value;
        const year = document.getElementById('year-select').value;
        const quarter = document.getElementById('quarter-select').value;
        
        // 显示加载状态
        this.showLoading(true);
        
        // 模拟API请求延迟
        setTimeout(() => {
            // 模拟数据
            const data = this.generateMockData(timePeriod, year, quarter);
            
            // 更新概览卡片
            this.updateOverviewCards(data.overview);
            
            // 更新图表数据
            this.updateCharts(data.charts);
            
            // 更新表格数据
            this.updateTableData(data.table);
            
            // 隐藏加载状态
            this.showLoading(false);
            
            // 如果是刷新操作，显示提示
            if (isRefresh) {
                this.showMessage('数据刷新成功');
            }
        }, 1000);
    },
    
    // 生成模拟数据
    generateMockData: function(timePeriod, year, quarter) {
        const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
        
        // 根据时间周期生成不同的月份数据
        let months = [];
        if (timePeriod === 'year') {
            months = monthNames;
        } else if (timePeriod === 'quarter') {
            const startMonth = (parseInt(quarter) - 1) * 3;
            months = monthNames.slice(startMonth, startMonth + 3);
        } else {
            // 月度视图，显示最近6个月
            const currentMonth = new Date().getMonth();
            months = [];
            for (let i = 5; i >= 0; i--) {
                const monthIndex = (currentMonth - i + 12) % 12;
                months.push(monthNames[monthIndex]);
            }
        }
        
        // 生成标本量趋势数据
        const specimenVolumeData = months.map(() => Math.floor(Math.random() * 150) + 600);
        const revenueData = specimenVolumeData.map(v => Math.round(v * 5 * (0.9 + Math.random() * 0.2)) / 10);
        
        // 生成病理类型分布数据
        const pathologyTypeData = [
            { name: '常规病理', value: Math.floor(Math.random() * 15) + 60 },
            { name: '冰冻病理', value: Math.floor(Math.random() * 10) + 15 },
            { name: '细胞学检查', value: Math.floor(Math.random() * 10) + 12 },
            { name: '免疫组化', value: Math.floor(Math.random() * 5) + 8 },
            { name: '分子病理', value: Math.floor(Math.random() * 5) + 5 }
        ];
        
        // 生成设备运行效率数据
        const equipmentEfficiencyData = [
            { name: '病理切片机A', usage: Math.floor(Math.random() * 10) + 80 },
            { name: '病理切片机B', usage: Math.floor(Math.random() * 10) + 75 },
            { name: '冰冻切片机', usage: Math.floor(Math.random() * 10) + 70 },
            { name: '脱水机A', usage: Math.floor(Math.random() * 10) + 75 },
            { name: '脱水机B', usage: Math.floor(Math.random() * 10) + 70 },
            { name: '染色机', usage: Math.floor(Math.random() * 10) + 85 },
            { name: '免疫组化仪', usage: Math.floor(Math.random() * 10) + 65 },
            { name: '分子病理检测系统', usage: Math.floor(Math.random() * 10) + 60 }
        ];
        
        // 生成临床科室送检量排名
        const departmentRankingData = [
            { name: '普外科', value: Math.floor(Math.random() * 200) + 900 },
            { name: '妇产科', value: Math.floor(Math.random() * 200) + 800 },
            { name: '肿瘤外科', value: Math.floor(Math.random() * 150) + 700 },
            { name: '骨科', value: Math.floor(Math.random() * 150) + 600 },
            { name: '消化内科', value: Math.floor(Math.random() * 150) + 500 },
            { name: '呼吸内科', value: Math.floor(Math.random() * 100) + 450 },
            { name: '泌尿外科', value: Math.floor(Math.random() * 100) + 400 },
            { name: '神经外科', value: Math.floor(Math.random() * 100) + 350 }
        ];
        
        // 按值排序
        departmentRankingData.sort((a, b) => b.value - a.value);
        
        // 生成表格数据
        const tableData = [
            { project: '常规组织病理学检查', volume: 1345, revenue: 403.5, avgReportTime: 3, positiveRate: 38.5, diagnosticConsistency: 98.2 },
            { project: '术中冰冻病理学检查', volume: 456, revenue: 205.2, avgReportTime: 0.5, positiveRate: 42.1, diagnosticConsistency: 97.5 },
            { project: '细胞学检查', volume: 567, revenue: 170.1, avgReportTime: 2, positiveRate: 28.9, diagnosticConsistency: 96.8 },
            { project: '免疫组化检查', volume: 345, revenue: 138.0, avgReportTime: 4, positiveRate: 45.6, diagnosticConsistency: 98.6 },
            { project: '分子病理学检查', volume: 234, revenue: 117.0, avgReportTime: 5, positiveRate: 52.3, diagnosticConsistency: 99.1 },
            { project: '细胞学-液基制片', volume: 789, revenue: 236.7, avgReportTime: 2, positiveRate: 32.4, diagnosticConsistency: 97.2 },
            { project: '特殊染色检查', volume: 187, revenue: 74.8, avgReportTime: 3, positiveRate: 48.7, diagnosticConsistency: 98.3 },
            { project: '肿瘤标志物检测', volume: 456, revenue: 182.4, avgReportTime: 3, positiveRate: 36.9, diagnosticConsistency: 98.8 }
        ];
        
        // 计算总览数据
        const totalSpecimens = tableData.reduce((sum, item) => sum + item.volume, 0);
        const totalRevenue = tableData.reduce((sum, item) => sum + item.revenue, 0).toFixed(1);
        const avgReportTime = (tableData.reduce((sum, item) => sum + item.avgReportTime * item.volume, 0) / totalSpecimens).toFixed(1);
        const equipmentUsage = (equipmentEfficiencyData.reduce((sum, item) => sum + item.usage, 0) / equipmentEfficiencyData.length).toFixed(1);
        
        return {
            overview: {
                totalSpecimens: totalSpecimens.toLocaleString(),
                totalRevenue: totalRevenue,
                reportTimeliness: 95.8,
                specialStaining: 23.5,
                // 趋势数据
                specimensTrend: 7.5,
                revenueTrend: 11.2,
                timelinessTrend: 2.3,
                stainingTrend: -1.8
            },
            charts: {
                specimenVolume: {
                    months: months,
                    volumes: specimenVolumeData,
                    revenues: revenueData
                },
                pathologyType: pathologyTypeData,
                equipmentEfficiency: equipmentEfficiencyData,
                departmentRanking: departmentRankingData
            },
            table: tableData
        };
    },
    
    // 更新概览卡片
    updateOverviewCards: function(data) {
        // 更新主要指标
        const totalSpecimensEl = document.getElementById('total-specimens');
        const totalRevenueEl = document.getElementById('total-revenue');
        const reportTimelinessEl = document.getElementById('report-timeliness');
        const specialStainingEl = document.getElementById('special-stain-rate');
        
        if (totalSpecimensEl) totalSpecimensEl.textContent = data.totalSpecimens;
        if (totalRevenueEl) totalRevenueEl.textContent = data.totalRevenue;
        if (reportTimelinessEl) reportTimelinessEl.textContent = data.reportTimeliness;
        if (specialStainingEl) specialStainingEl.textContent = data.specialStaining;
        
        // 更新趋势信息
        this.updateTrendValue('specimens-trend', data.specimensTrend);
        this.updateTrendValue('revenue-trend', data.revenueTrend);
        this.updateTrendValue('timeliness-trend', data.timelinessTrend);
        this.updateTrendValue('staining-trend', data.stainingTrend);
    },
    
    // 更新趋势值样式
    updateTrendValue: function(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            const sign = value >= 0 ? '+' : '';
            element.textContent = sign + value + '%';
            element.className = 'trend-value ' + (value >= 0 ? 'positive' : 'negative');
        }
    },
    
    // 初始化图表
    initCharts: function() {
        console.log('开始初始化病理科图表...');
        
        // 检查容器是否存在
        const specimenVolumeContainer = document.getElementById('specimen-volume-chart');
        const pathologyTypeContainer = document.getElementById('pathology-type-chart');
        const reportTurnaroundContainer = document.getElementById('report-turnaround-chart');
        const departmentRankingContainer = document.getElementById('department-ranking-chart');
        
        console.log('容器检查结果:', {
            specimenVolumeContainer: !!specimenVolumeContainer,
            pathologyTypeContainer: !!pathologyTypeContainer,
            reportTurnaroundContainer: !!reportTurnaroundContainer,
            departmentRankingContainer: !!departmentRankingContainer
        });
        
        if (!specimenVolumeContainer || !pathologyTypeContainer || !reportTurnaroundContainer || !departmentRankingContainer) {
            console.error('病理科页面图表容器未找到');
            return;
        }
        
        // 标本量趋势图
        try {
            this.specimenVolumeChart = echarts.init(specimenVolumeContainer);
            console.log('标本量趋势图初始化成功');
        } catch (error) {
            console.error('标本量趋势图初始化失败:', error);
        }
        
        // 病理类型分布图
        try {
            this.pathologyTypeChart = echarts.init(pathologyTypeContainer);
            console.log('病理类型分布图初始化成功');
        } catch (error) {
            console.error('病理类型分布图初始化失败:', error);
        }
        
        // 报告周转时间分析图
        try {
            this.reportTurnaroundChart = echarts.init(reportTurnaroundContainer);
            console.log('报告周转时间分析图初始化成功');
        } catch (error) {
            console.error('报告周转时间分析图初始化失败:', error);
        }
        
        // 科室送检量排名图
        try {
            this.departmentRankingChart = echarts.init(departmentRankingContainer);
            console.log('科室送检量排名图初始化成功');
        } catch (error) {
            console.error('科室送检量排名图初始化失败:', error);
        }
        
        // 响应式调整
        window.addEventListener('resize', () => {
            if (this.specimenVolumeChart) this.specimenVolumeChart.resize();
            if (this.pathologyTypeChart) this.pathologyTypeChart.resize();
            if (this.reportTurnaroundChart) this.reportTurnaroundChart.resize();
            if (this.departmentRankingChart) this.departmentRankingChart.resize();
        });
    },
    
    // 更新图表数据
    updateCharts: function(charts) {
        // 检查图表实例是否存在
        if (!this.specimenVolumeChart || !this.pathologyTypeChart || 
            !this.reportTurnaroundChart || !this.departmentRankingChart) {
            console.error('图表实例未初始化');
            return;
        }

        // 更新标本量趋势图
        this.specimenVolumeChart.setOption({
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                },
                formatter: function(params) {
                    let result = params[0].name + '<br/>';
                    params.forEach(param => {
                        result += param.marker + param.seriesName + ': ' + param.value + 
                                 (param.seriesName.includes('收入') ? '万元' : '例') + '<br/>';
                    });
                    return result;
                }
            },
            legend: {
                data: ['标本量', '收入(万元)'],
                top: 10
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: charts.specimenVolume.months,
                axisLine: {
                    lineStyle: {
                        color: '#e6e6e6'
                    }
                }
            },
            yAxis: [
                {
                    type: 'value',
                    name: '标本量',
                    position: 'left',
                    axisLine: {
                        lineStyle: {
                            color: '#1890ff'
                        }
                    },
                    axisLabel: {
                        formatter: '{value}例'
                    }
                },
                {
                    type: 'value',
                    name: '收入(万元)',
                    position: 'right',
                    axisLine: {
                        lineStyle: {
                            color: '#52c41a'
                        }
                    },
                    axisLabel: {
                        formatter: '{value}万'
                    }
                }
            ],
            series: [
                {
                    name: '标本量',
                    type: 'line',
                    smooth: true,
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0, y: 0, x2: 0, y2: 1,
                            colorStops: [
                                { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
                                { offset: 1, color: 'rgba(24, 144, 255, 0.1)' }
                            ]
                        }
                    },
                    lineStyle: {
                        color: '#1890ff',
                        width: 3
                    },
                    itemStyle: {
                        color: '#1890ff'
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: charts.specimenVolume.volumes
                },
                {
                    name: '收入(万元)',
                    type: 'line',
                    yAxisIndex: 1,
                    smooth: true,
                    lineStyle: {
                        color: '#52c41a',
                        width: 3
                    },
                    itemStyle: {
                        color: '#52c41a'
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: charts.specimenVolume.revenues
                }
            ]
        });
        
        // 更新病理类型分布图
        this.pathologyTypeChart.setOption({
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    return params.seriesName + '<br/>' +
                           params.marker + params.name + ': ' + params.value + '例 (' + params.percent + '%)';
                },
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: '#ccc',
                borderWidth: 1,
                textStyle: {
                    color: '#fff'
                }
            },
            legend: {
                orient: 'vertical',
                left: 10,
                top: 'center',
                data: charts.pathologyType.map(item => item.name),
                textStyle: {
                    fontSize: 12
                }
            },
            series: [
                {
                    name: '病理类型分布',
                    type: 'pie',
                    radius: ['45%', '75%'],
                    center: ['60%', '50%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 8,
                        borderColor: '#fff',
                        borderWidth: 2,
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.1)'
                    },
                    label: {
                        show: true,
                        position: 'outside',
                        formatter: '{b}: {d}%',
                        fontSize: 11,
                        fontWeight: 'bold'
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 20,
                            shadowColor: 'rgba(0, 0, 0, 0.3)'
                        },
                        label: {
                            show: true,
                            fontSize: 14,
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: true,
                        length: 15,
                        length2: 10,
                        smooth: true
                    },
                    data: charts.pathologyType.map((item, index) => ({
                        ...item,
                        itemStyle: {
                            color: ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1'][index % 5]
                        }
                    })),
                    animationType: 'scale',
                    animationEasing: 'elasticOut',
                    animationDelay: function (idx) {
                        return Math.random() * 200;
                    }
                }
            ]
        });
        
        // 更新报告周转时间分析图（设备使用率）
        this.reportTurnaroundChart.setOption({
            title: {
                text: '设备使用率分析',
                left: 'center',
                top: 10,
                textStyle: {
                    fontSize: 14,
                    fontWeight: 'bold'
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function(params) {
                    const param = params[0];
                    return param.name + '<br/>使用率: ' + param.value + '%';
                },
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: '#ccc',
                borderWidth: 1,
                textStyle: {
                    color: '#fff'
                }
            },
            grid: {
                left: '15%',
                right: '8%',
                bottom: '8%',
                top: '20%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01],
                max: 100,
                axisLabel: {
                    formatter: '{value}%',
                    fontSize: 11
                },
                axisLine: {
                    lineStyle: {
                        color: '#e6e6e6'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: '#f0f0f0',
                        type: 'dashed'
                    }
                }
            },
            yAxis: {
                type: 'category',
                data: charts.equipmentEfficiency.map(item => item.name),
                axisLabel: {
                    fontSize: 11,
                    interval: 0
                },
                axisLine: {
                    lineStyle: {
                        color: '#e6e6e6'
                    }
                }
            },
            series: [
                {
                    name: '使用率',
                    type: 'bar',
                    data: charts.equipmentEfficiency.map(item => ({
                        value: item.usage,
                        itemStyle: {
                            color: function() {
                                // 根据使用率设置不同颜色
                                const value = item.usage;
                                if (value >= 80) return '#52c41a';
                                if (value >= 60) return '#faad14';
                                return '#ff4d4f';
                            }(),
                            borderRadius: [0, 4, 4, 0],
                            shadowBlur: 3,
                            shadowColor: 'rgba(0, 0, 0, 0.1)'
                        }
                    })),
                    barWidth: '60%',
                    label: {
                        show: true,
                        position: 'right',
                        formatter: '{c}%',
                        fontSize: 10,
                        fontWeight: 'bold'
                    },
                    animationDelay: function (idx) {
                        return idx * 100;
                    }
                }
            ],
            animationEasing: 'elasticOut'
        });
        
        // 更新科室送检量排名图
        this.departmentRankingChart.setOption({
            title: {
                text: '科室送检量排名',
                left: 'center',
                top: 10,
                textStyle: {
                    fontSize: 14,
                    fontWeight: 'bold'
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function(params) {
                    const param = params[0];
                    return param.name + '<br/>送检量: ' + param.value.toLocaleString() + '例';
                },
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: '#ccc',
                borderWidth: 1,
                textStyle: {
                    color: '#fff'
                }
            },
            grid: {
                left: '15%',
                right: '8%',
                bottom: '8%',
                top: '20%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01],
                axisLabel: {
                    formatter: function(value) {
                        return value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value;
                    },
                    fontSize: 11
                },
                axisLine: {
                    lineStyle: {
                        color: '#e6e6e6'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: '#f0f0f0',
                        type: 'dashed'
                    }
                }
            },
            yAxis: {
                type: 'category',
                data: charts.departmentRanking.map(item => item.name),
                axisLabel: {
                    fontSize: 11,
                    interval: 0
                },
                axisLine: {
                    lineStyle: {
                        color: '#e6e6e6'
                    }
                }
            },
            series: [
                {
                    name: '送检量',
                    type: 'bar',
                    data: charts.departmentRanking.map((item, index) => ({
                        value: item.value,
                        itemStyle: {
                            color: function() {
                                // 渐变色，排名越高颜色越深
                                const colors = ['#1890ff', '#40a9ff', '#69c0ff', '#91d5ff', '#bae7ff', '#e6f7ff', '#f0f9ff', '#fafafa'];
                                return colors[index] || '#fafafa';
                            }(),
                            borderRadius: [0, 4, 4, 0],
                            shadowBlur: 3,
                            shadowColor: 'rgba(0, 0, 0, 0.1)'
                        }
                    })),
                    barWidth: '60%',
                    label: {
                        show: true,
                        position: 'right',
                        formatter: function(params) {
                            return params.value >= 1000 ? 
                                   (params.value / 1000).toFixed(1) + 'k' : 
                                   params.value;
                        },
                        fontSize: 10,
                        fontWeight: 'bold'
                    },
                    animationDelay: function (idx) {
                        return idx * 100;
                    }
                }
            ],
            animationEasing: 'elasticOut'
        });
    },
    
    // 更新表格数据
    updateTableData: function(data) {
        const tableBody = document.getElementById('test-detail-table');
        if (!tableBody) {
            console.error('表格容器未找到');
            return;
        }
        tableBody.innerHTML = '';
        
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.project}</td>
                <td>${item.volume}</td>
                <td>${item.revenue}</td>
                <td>${item.avgReportTime}</td>
                <td>${item.positiveRate}</td>
                <td>${item.diagnosticConsistency}</td>
                <td>
                    <button class="btn btn-small btn-primary">详情</button>
                    <button class="btn btn-small btn-secondary">导出</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    },
    
    // 导出数据
    exportData: function() {
        this.showMessage('数据导出成功');
    },
    
    // 显示加载状态
    showLoading: function(show) {
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = '<div class="loading-spinner"></div>';
        
        if (show) {
            document.body.appendChild(loadingOverlay);
        } else {
            const existingOverlay = document.querySelector('.loading-overlay');
            if (existingOverlay) {
                document.body.removeChild(existingOverlay);
            }
        }
    },
    
    // 显示消息提示
    showMessage: function(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message-toast';
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 3000);
    }
};

// 图表控制功能
function refreshChart(chartId, period) {
    console.log(`刷新图表: ${chartId}, 周期: ${period || '默认'}`);
    
    // 更新按钮状态
    if (period) {
        const chartContainer = document.getElementById(chartId).closest('.chart-container');
        const buttons = chartContainer.querySelectorAll('.chart-btn[data-period]');
        buttons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.period == period);
        });
    }
    
    // 重新加载数据
    PathologyPage.loadData();
}

// 趋势模态框功能
function showTrendModal(metric) {
    console.log(`显示趋势详情: ${metric}`);
    
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'trend-modal';
    modal.innerHTML = `
        <div class="trend-modal-content">
            <div class="trend-modal-header">
                <h3>${getTrendTitle(metric)}</h3>
                <button class="trend-modal-close" onclick="closeTrendModal()">&times;</button>
            </div>
            <div class="trend-modal-body">
                <div id="trend-chart-${metric}" style="width: 100%; height: 300px;"></div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 初始化趋势图表
    setTimeout(() => {
        updateTrendChart(metric);
    }, 100);
}

function closeTrendModal() {
    const modal = document.querySelector('.trend-modal');
    if (modal) {
        document.body.removeChild(modal);
    }
}

function updateTrendChart(metric) {
    const chartContainer = document.getElementById(`trend-chart-${metric}`);
    if (!chartContainer) return;
    
    const chart = echarts.init(chartContainer);
    const data = getTrendData(metric);
    
    const option = {
        title: {
            text: getTrendTitle(metric),
            left: 'center'
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: data.months
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            name: getTrendTitle(metric),
            type: 'line',
            data: data.values,
            smooth: true,
            areaStyle: {}
        }]
    };
    
    chart.setOption(option);
}

function getTrendTitle(metric) {
    const titles = {
        'specimens': '标本量趋势',
        'revenue': '收入趋势',
        'timeliness': '报告及时率趋势',
        'staining': '特殊染色率趋势'
    };
    return titles[metric] || '趋势分析';
}

function getTrendData(metric) {
    const months = ['1月', '2月', '3月', '4月', '5月', '6月'];
    const data = {
        'specimens': [1200, 1350, 1180, 1420, 1380, 1450],
        'revenue': [360, 405, 354, 426, 414, 435],
        'timeliness': [93.2, 94.1, 92.8, 95.3, 94.7, 95.8],
        'staining': [21.5, 22.3, 20.8, 23.1, 22.9, 23.5]
    };
    
    return {
        months: months,
        values: data[metric] || []
    };
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    PathologyPage.init();
});