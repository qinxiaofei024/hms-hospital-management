// 内镜分析页面功能实现
const EndoscopyPage = {
    // 初始化页面
    init: function() {
        this.bindEvents();
        this.loadData();
        this.initCharts();
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
        
        // 生成检查量趋势数据
        const examVolumeData = months.map(() => Math.floor(Math.random() * 200) + 800);
        const revenueData = examVolumeData.map(v => Math.round(v * 3.5 * (0.9 + Math.random() * 0.2)) / 10);
        
        // 生成内镜类型分布数据
        const endoscopyTypeData = [
            { name: '胃镜', value: Math.floor(Math.random() * 10) + 40 },
            { name: '肠镜', value: Math.floor(Math.random() * 10) + 35 },
            { name: '支气管镜', value: Math.floor(Math.random() * 5) + 10 },
            { name: '膀胱镜', value: Math.floor(Math.random() * 5) + 8 },
            { name: '宫腔镜', value: Math.floor(Math.random() * 5) + 7 }
        ];
        
        // 生成设备运行效率数据
        const equipmentEfficiencyData = [
            { name: '电子胃镜A', usage: Math.floor(Math.random() * 10) + 85 },
            { name: '电子胃镜B', usage: Math.floor(Math.random() * 10) + 80 },
            { name: '电子肠镜A', usage: Math.floor(Math.random() * 10) + 75 },
            { name: '电子肠镜B', usage: Math.floor(Math.random() * 10) + 70 },
            { name: '支气管镜', usage: Math.floor(Math.random() * 10) + 65 },
            { name: '膀胱镜', usage: Math.floor(Math.random() * 10) + 60 },
            { name: '宫腔镜', usage: Math.floor(Math.random() * 10) + 55 }
        ];
        
        // 生成临床科室申请量排名
        const departmentRankingData = [
            { name: '消化内科', value: Math.floor(Math.random() * 200) + 800 },
            { name: '胃肠外科', value: Math.floor(Math.random() * 200) + 700 },
            { name: '呼吸内科', value: Math.floor(Math.random() * 150) + 500 },
            { name: '泌尿外科', value: Math.floor(Math.random() * 150) + 400 },
            { name: '妇产科', value: Math.floor(Math.random() * 150) + 350 },
            { name: '普外科', value: Math.floor(Math.random() * 100) + 300 },
            { name: '肿瘤科', value: Math.floor(Math.random() * 100) + 250 }
        ];
        
        // 按值排序
        departmentRankingData.sort((a, b) => b.value - a.value);
        
        // 生成表格数据
        const tableData = [
            { project: '普通胃镜检查', volume: 1245, revenue: 311.3, avgTime: 15, detectionRate: 68.5, complicationRate: 0.8 },
            { project: '无痛胃镜检查', volume: 1876, revenue: 562.8, avgTime: 20, detectionRate: 72.3, complicationRate: 1.2 },
            { project: '胃镜下活检', volume: 987, revenue: 296.1, avgTime: 25, detectionRate: 85.6, complicationRate: 1.5 },
            { project: '普通肠镜检查', volume: 1123, revenue: 336.9, avgTime: 30, detectionRate: 75.2, complicationRate: 1.0 },
            { project: '无痛肠镜检查', volume: 1654, revenue: 496.2, avgTime: 35, detectionRate: 78.9, complicationRate: 1.4 },
            { project: '肠镜下活检', volume: 876, revenue: 262.8, avgTime: 40, detectionRate: 88.4, complicationRate: 1.8 },
            { project: '支气管镜检查', volume: 543, revenue: 217.2, avgTime: 25, detectionRate: 65.7, complicationRate: 2.1 },
            { project: '膀胱镜检查', volume: 432, revenue: 172.8, avgTime: 20, detectionRate: 70.3, complicationRate: 1.6 },
            { project: '宫腔镜检查', volume: 398, revenue: 159.2, avgTime: 25, detectionRate: 62.8, complicationRate: 1.3 }
        ];
        
        // 计算总览数据
        const totalExams = tableData.reduce((sum, item) => sum + item.volume, 0);
        const totalRevenue = tableData.reduce((sum, item) => sum + item.revenue, 0).toFixed(1);
        const avgExamTime = (tableData.reduce((sum, item) => sum + item.avgTime * item.volume, 0) / totalExams).toFixed(0);
        const equipmentUsage = (equipmentEfficiencyData.reduce((sum, item) => sum + item.usage, 0) / equipmentEfficiencyData.length).toFixed(1);
        
        return {
            overview: {
                totalExams: totalExams.toLocaleString(),
                totalRevenue: totalRevenue,
                equipmentUsage: equipmentUsage,
                avgExamTime: avgExamTime
            },
            charts: {
                examVolume: {
                    months: months,
                    volumes: examVolumeData,
                    revenues: revenueData
                },
                endoscopyType: endoscopyTypeData,
                equipmentEfficiency: equipmentEfficiencyData,
                departmentRanking: departmentRankingData
            },
            table: tableData
        };
    },
    
    // 更新概览卡片
    updateOverviewCards: function(data) {
        document.getElementById('total-exams').textContent = data.totalExams;
        document.getElementById('total-revenue').textContent = '¥' + data.totalRevenue;
        document.getElementById('equipment-usage').textContent = data.equipmentUsage + '%';
        document.getElementById('avg-exam-time').textContent = data.avgExamTime + '分钟';
    },
    
    // 初始化图表
    initCharts: function() {
        // 检查量趋势图
        this.examVolumeChart = echarts.init(document.getElementById('exam-volume-chart'));
        
        // 内镜类型分布图
        this.endoscopyTypeChart = echarts.init(document.getElementById('endoscopy-type-chart'));
        
        // 设备运行效率分析图
        this.equipmentEfficiencyChart = echarts.init(document.getElementById('equipment-efficiency-chart'));
        
        // 科室申请量排名图
        this.departmentRankingChart = echarts.init(document.getElementById('department-ranking-chart'));
        
        // 响应式调整
        window.addEventListener('resize', () => {
            this.examVolumeChart.resize();
            this.endoscopyTypeChart.resize();
            this.equipmentEfficiencyChart.resize();
            this.departmentRankingChart.resize();
        });
    },
    
    // 更新图表数据
    updateCharts: function(data) {
        // 更新检查量趋势图
        this.examVolumeChart.setOption({
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            legend: {
                data: ['检查量', '收入(万元)']
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
                data: data.examVolume.months
            },
            yAxis: [
                {
                    type: 'value',
                    name: '检查量',
                    position: 'left'
                },
                {
                    type: 'value',
                    name: '收入(万元)',
                    position: 'right'
                }
            ],
            series: [
                {
                    name: '检查量',
                    type: 'line',
                    stack: 'Total',
                    areaStyle: {},
                    emphasis: {
                        focus: 'series'
                    },
                    data: data.examVolume.volumes
                },
                {
                    name: '收入(万元)',
                    type: 'line',
                    yAxisIndex: 1,
                    emphasis: {
                        focus: 'series'
                    },
                    data: data.examVolume.revenues
                }
            ]
        });
        
        // 更新内镜类型分布图
        this.endoscopyTypeChart.setOption({
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 10,
                data: data.endoscopyType.map(item => item.name)
            },
            series: [
                {
                    name: '内镜类型',
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
                    data: data.endoscopyType
                }
            ]
        });
        
        // 更新设备运行效率分析图
        this.equipmentEfficiencyChart.setOption({
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function(params) {
                    const param = params[0];
                    return param.name + '<br/>使用率: ' + param.value + '%';
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
                boundaryGap: [0, 0.01],
                max: 100,
                axisLabel: {
                    formatter: '{value}%'
                }
            },
            yAxis: {
                type: 'category',
                data: data.equipmentEfficiency.map(item => item.name)
            },
            series: [
                {
                    name: '使用率',
                    type: 'bar',
                    data: data.equipmentEfficiency.map(item => item.usage),
                    itemStyle: {
                        color: function(params) {
                            // 根据使用率设置不同颜色
                            const value = params.value;
                            if (value >= 80) return '#52c41a';
                            if (value >= 60) return '#faad14';
                            return '#ff4d4f';
                        }
                    }
                }
            ]
        });
        
        // 更新科室申请量排名图
        this.departmentRankingChart.setOption({
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
                boundaryGap: [0, 0.01]
            },
            yAxis: {
                type: 'category',
                data: data.departmentRanking.map(item => item.name)
            },
            series: [
                {
                    name: '申请量',
                    type: 'bar',
                    data: data.departmentRanking.map(item => item.value),
                    itemStyle: {
                        color: '#1890ff'
                    }
                }
            ]
        });
    },
    
    // 更新表格数据
    updateTableData: function(data) {
        const tableBody = document.getElementById('exam-detail-table');
        tableBody.innerHTML = '';
        
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.project}</td>
                <td>${item.volume}</td>
                <td>${item.revenue}</td>
                <td>${item.avgTime}</td>
                <td>${item.detectionRate}</td>
                <td>${item.complicationRate}</td>
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
        const messageContainer = document.createElement('div');
        messageContainer.className = 'message';
        messageContainer.textContent = message;
        
        document.body.appendChild(messageContainer);
        
        // 3秒后自动消失
        setTimeout(() => {
            messageContainer.classList.add('fade-out');
            setTimeout(() => {
                document.body.removeChild(messageContainer);
            }, 500);
        }, 3000);
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    if (typeof Common !== 'undefined' && typeof Common.ensureEcharts === 'function') {
        try {
            Common.ensureEcharts();
        } catch (e) {
            console.warn('ensureEcharts 调用失败:', e);
        }
    }

    if (typeof echarts !== 'undefined') {
        EndoscopyPage.init();
    } else {
        const onReady = function() {
            document.removeEventListener('echartsLoaded', onReady);
            EndoscopyPage.init();
        };
        document.addEventListener('echartsLoaded', onReady);
    }
});