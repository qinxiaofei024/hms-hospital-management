/**
 * 综合运营分析报告页面JavaScript
 * 与首页保持一致的引用风格
 */
const OperationReportPage = {
    // 图表实例
    charts: {},
    
    // 初始化页面
    init: function() {
        console.log('初始化综合运营分析报告页面...');
        
        // 初始化事件监听
        this.initEventListeners();
        
        // 加载数据
        this.loadReportData();
        
        // 初始化图表
        this.initCharts();
    },
    
    // 初始化事件监听
    initEventListeners: function() {
        // 刷新报告按钮
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshReport();
            });
        }
        
        // 导出PDF按钮（报告头部）
        const exportPdfBtn = document.getElementById('export-pdf-btn');
        if (exportPdfBtn) {
            exportPdfBtn.addEventListener('click', () => {
                this.exportPDF();
            });
        }
        
        // 打印报告按钮（报告头部）
        const printBtn = document.getElementById('print-btn');
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                window.print();
            });
        }
        
        // 报告周期选择器
        const reportPeriod = document.getElementById('reportPeriod');
        if (reportPeriod) {
            reportPeriod.addEventListener('change', () => {
                this.loadReportData();
                this.refreshCharts();
            });
        }
        
        // 年份选择器
        const reportYear = document.getElementById('reportYear');
        if (reportYear) {
            reportYear.addEventListener('change', () => {
                this.loadReportData();
                this.refreshCharts();
            });
        }
        
        // 窗口大小变化时，重新调整图表大小
        window.addEventListener('resize', () => {
            this.resizeCharts();
        });
    },
    
    // 加载报告数据
    loadReportData: function() {
        console.log('加载综合运营分析报告数据...');
        
        // 获取选择的报告周期和年份
        const reportPeriod = document.getElementById('reportPeriod').value;
        const reportYear = document.getElementById('reportYear').value;
        
        // 这里应该是从服务器获取数据
        // 为了演示，我们使用模拟数据
        this.data = this.getMockData(reportPeriod, reportYear);
    },
    
    // 刷新报告
    refreshReport: function() {
        console.log('刷新综合运营分析报告...');
        
        // 显示刷新状态
        const refreshBtn = document.getElementById('refreshBtn');
        const originalText = refreshBtn.innerHTML;
        refreshBtn.innerHTML = '刷新中...';
        refreshBtn.disabled = true;
        
        // 重新加载数据
        this.loadReportData();
        
        // 刷新图表
        this.refreshCharts();
        
        // 恢复按钮状态
        setTimeout(() => {
            refreshBtn.innerHTML = originalText;
            refreshBtn.disabled = false;
        }, 1000);
    },
    
    // 导出PDF
    exportPDF: function() {
        console.log('导出综合运营分析报告PDF...');
        
        // 显示导出状态
        const exportBtn = document.getElementById('export-pdf-btn');
        if (!exportBtn) {
            console.error('导出按钮未找到');
            return;
        }
        
        const originalText = exportBtn.innerHTML;
        exportBtn.innerHTML = '导出中...';
        exportBtn.disabled = true;
        
        try {
            // 获取要导出的内容区域
            const reportContainer = document.querySelector('.report-container');
            if (!reportContainer) {
                throw new Error('报告容器未找到');
            }
            
            // 配置PDF选项
            const opt = {
                margin: [10, 10, 10, 10],
                filename: '喀什地区第一人民医院综合运营分析报告.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff'
                },
                jsPDF: { 
                    unit: 'mm', 
                    format: 'a4', 
                    orientation: 'portrait' 
                }
            };
            
            // 生成PDF
            html2pdf().set(opt).from(reportContainer).save().then(() => {
                console.log('PDF导出成功');
                if (typeof Common !== 'undefined' && Common.showToast) {
                    Common.showToast('报告已成功导出为PDF格式！');
                } else {
                    alert('报告已成功导出为PDF格式！');
                }
            }).catch((error) => {
                console.error('PDF导出失败:', error);
                if (typeof Common !== 'undefined' && Common.showToast) {
                    Common.showToast('PDF导出失败，请重试！', 'error');
                } else {
                    alert('PDF导出失败，请重试！');
                }
            }).finally(() => {
                // 恢复按钮状态
                exportBtn.innerHTML = originalText;
                exportBtn.disabled = false;
            });
            
        } catch (error) {
            console.error('PDF导出过程中发生错误:', error);
            if (typeof Common !== 'undefined' && Common.showToast) {
                Common.showToast('PDF导出失败，请重试！', 'error');
            } else {
                alert('PDF导出失败，请重试！');
            }
            // 恢复按钮状态
            exportBtn.innerHTML = originalText;
            exportBtn.disabled = false;
        }
    },
    
    // 获取模拟数据
    getMockData: function(reportPeriod, reportYear) {
        // 根据报告周期和年份生成模拟数据
        const serviceVolumeData = [];
        const outpatientDistributionData = [];
        const totalRevenueData = [];
        const revenueStructureData = [];
        const departmentRevenueData = [];
        const humanResourceData = [];
        const equipmentUsageData = [];
        
        // 医疗服务量趋势数据
        if (reportPeriod === 'year') {
            serviceVolumeData.push(
                {year: '2023年', outpatient: 52.5, inpatient: 2.2},
                {year: '2024年', outpatient: 53.8, inpatient: 2.3},
                {year: '2025年', outpatient: 56.8, inpatient: 2.4}
            );
        } else if (reportPeriod === 'quarter') {
            const quarters = ['第一季度', '第二季度', '第三季度', '第四季度'];
            for (let i = 0; i < quarters.length; i++) {
                const baseOutpatient = 13.5 + Math.random() * 1.5;
                const baseInpatient = 0.55 + Math.random() * 0.05;
                serviceVolumeData.push({
                    year: quarters[i],
                    outpatient: Math.round(baseOutpatient * 10) / 10,
                    inpatient: Math.round(baseInpatient * 100) / 100
                });
            }
        } else {
            const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
            for (let i = 0; i < months.length; i++) {
                const baseOutpatient = 4.5 + Math.random() * 0.5;
                const baseInpatient = 0.18 + Math.random() * 0.02;
                serviceVolumeData.push({
                    year: months[i],
                    outpatient: Math.round(baseOutpatient * 10) / 10,
                    inpatient: Math.round(baseInpatient * 100) / 100
                });
            }
        }
        
        // 门诊科室服务量分布数据
        outpatientDistributionData.push(
            {name: '内科', value: 35.2},
            {name: '外科', value: 28.5},
            {name: '妇产科', value: 12.8},
            {name: '儿科', value: 10.5},
            {name: '五官科', value: 8.2},
            {name: '其他', value: 4.8}
        );
        
        // 医院总收入趋势数据
        if (reportPeriod === 'year') {
            totalRevenueData.push(
                {year: '2023年', revenue: 5.8},
                {year: '2024年', revenue: 6.4},
                {year: '2025年', revenue: 7.2}
            );
        } else if (reportPeriod === 'quarter') {
            const quarters = ['第一季度', '第二季度', '第三季度', '第四季度'];
            for (let i = 0; i < quarters.length; i++) {
                const baseRevenue = 1.6 + Math.random() * 0.2;
                totalRevenueData.push({
                    year: quarters[i],
                    revenue: Math.round(baseRevenue * 10) / 10
                });
            }
        } else {
            const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
            for (let i = 0; i < months.length; i++) {
                const baseRevenue = 0.55 + Math.random() * 0.1;
                totalRevenueData.push({
                    year: months[i],
                    revenue: Math.round(baseRevenue * 10) / 10
                });
            }
        }
        
        // 收入结构分析数据
        revenueStructureData.push(
            {name: '医疗服务收入', value: 45.2},
            {name: '药品收入', value: 38.5},
            {name: '检查收入', value: 12.3},
            {name: '其他收入', value: 4.0}
        );
        
        // 主要科室收入排名数据
        departmentRevenueData.push(
            {name: '心内科', value: 2580},
            {name: '骨科', value: 2450},
            {name: '神经外科', value: 2120},
            {name: '普外科', value: 1980},
            {name: '消化内科', value: 1860},
            {name: '呼吸内科', value: 1650},
            {name: '神经内科', value: 1980},
            {name: '妇产科', value: 1750}
        );
        
        // 人力资源配置数据
        humanResourceData.push(
            {name: '医生', value: 320},
            {name: '护士', value: 650},
            {name: '医技人员', value: 280},
            {name: '行政人员', value: 120},
            {name: '后勤人员', value: 180}
        );
        
        // 设备利用率分析数据
        equipmentUsageData.push(
            {name: 'MRI', usage: 82.5, revenue: 1860},
            {name: 'CT', usage: 78.3, revenue: 1650},
            {name: '超声设备', usage: 85.6, revenue: 1250},
            {name: '内窥镜', usage: 72.4, revenue: 980},
            {name: 'X光机', usage: 68.7, revenue: 760},
            {name: '检验设备', usage: 92.3, revenue: 1450}
        );
        
        return {
            serviceVolumeData,
            outpatientDistributionData,
            totalRevenueData,
            revenueStructureData,
            departmentRevenueData,
            humanResourceData,
            equipmentUsageData
        };
    },
    
    // 初始化图表
    initCharts: function() {
        // 检查ECharts是否已加载
        if (typeof echarts === 'undefined') {
            console.warn('ECharts 未加载，使用 Common.ensureEcharts 进行统一加载...');
            if (typeof Common !== 'undefined' && Common.ensureEcharts) {
                Common.ensureEcharts();
            }
            // 等待 echartsLoaded 事件后再初始化
            return;
        }
        
        // 初始化各个图表
        this.initServiceVolumeChart();
        this.initOutpatientDistributionChart();
        this.initTotalRevenueChart();
        this.initRevenueStructureChart();
        this.initDepartmentRevenueChart();
        this.initHumanResourceChart();
        this.initEquipmentUsageChart();
    },
    
    // 初始化医疗服务量趋势图表
    initServiceVolumeChart: function() {
        const chartContainer = document.getElementById('serviceVolumeChart');
        if (!chartContainer) {
            console.error('医疗服务量趋势图表容器不存在');
            return;
        }
        
        const chart = echarts.init(chartContainer);
        this.charts.serviceVolume = chart;
        
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                }
            },
            legend: {
                data: ['门诊量(万人次)', '住院量(万人次)']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: this.data.serviceVolumeData.map(item => item.year),
                axisPointer: {
                    type: 'shadow'
                }
            },
            yAxis: [
                {
                    type: 'value',
                    name: '门诊量',
                    min: 0,
                    axisLabel: {
                        formatter: '{value}'
                    }
                },
                {
                    type: 'value',
                    name: '住院量',
                    min: 0,
                    axisLabel: {
                        formatter: '{value}'
                    }
                }
            ],
            series: [
                {
                    name: '门诊量(万人次)',
                    type: 'bar',
                    data: this.data.serviceVolumeData.map(item => item.outpatient),
                    itemStyle: {
                        color: '#5470c6'
                    }
                },
                {
                    name: '住院量(万人次)',
                    type: 'line',
                    yAxisIndex: 1,
                    data: this.data.serviceVolumeData.map(item => item.inpatient),
                    lineStyle: {
                        width: 3,
                        color: '#91cc75'
                    },
                    symbol: 'circle',
                    symbolSize: 8
                }
            ]
        };
        
        chart.setOption(option);
    },
    
    // 初始化门诊科室服务量分布图表
    initOutpatientDistributionChart: function() {
        const chartContainer = document.getElementById('outpatientDistributionChart');
        if (!chartContainer) {
            console.error('门诊科室服务量分布图表容器不存在');
            return;
        }
        
        const chart = echarts.init(chartContainer);
        this.charts.outpatientDistribution = chart;
        
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c}% ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: '门诊科室分布',
                    type: 'pie',
                    radius: '50%',
                    data: this.data.outpatientDistributionData,
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
        
        chart.setOption(option);
    },
    
    // 初始化医院总收入趋势图表
    initTotalRevenueChart: function() {
        const chartContainer = document.getElementById('totalRevenueChart');
        if (!chartContainer) {
            console.error('医院总收入趋势图表容器不存在');
            return;
        }
        
        const chart = echarts.init(chartContainer);
        this.charts.totalRevenue = chart;
        
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
                data: this.data.totalRevenueData.map(item => item.year)
            },
            yAxis: {
                type: 'value',
                name: '收入(亿元)'
            },
            series: [
                {
                    name: '医院总收入',
                    type: 'line',
                    data: this.data.totalRevenueData.map(item => item.revenue),
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
    
    // 初始化收入结构分析图表
    initRevenueStructureChart: function() {
        const chartContainer = document.getElementById('revenueStructureChart');
        if (!chartContainer) {
            console.error('收入结构分析图表容器不存在');
            return;
        }
        
        const chart = echarts.init(chartContainer);
        this.charts.revenueStructure = chart;
        
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c}% ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: '收入结构',
                    type: 'pie',
                    radius: '50%',
                    data: this.data.revenueStructureData,
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
        
        chart.setOption(option);
    },
    
    // 初始化主要科室收入排名图表
    initDepartmentRevenueChart: function() {
        const chartContainer = document.getElementById('departmentRevenueChart');
        if (!chartContainer) {
            console.error('主要科室收入排名图表容器不存在');
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
                type: 'value',
                name: '收入(万元)'
            },
            yAxis: {
                type: 'category',
                data: this.data.departmentRevenueData.map(item => item.name),
                axisLabel: {
                    interval: 0
                }
            },
            series: [
                {
                    name: '科室收入',
                    type: 'bar',
                    data: this.data.departmentRevenueData.map(item => item.value),
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                            { offset: 0, color: '#83bff6' },
                            { offset: 0.5, color: '#188df0' },
                            { offset: 1, color: '#188df0' }
                        ])
                    },
                    emphasis: {
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
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
    
    // 初始化人力资源配置图表
    initHumanResourceChart: function() {
        const chartContainer = document.getElementById('humanResourceChart');
        if (!chartContainer) {
            console.error('人力资源配置图表容器不存在');
            return;
        }
        
        const chart = echarts.init(chartContainer);
        this.charts.humanResource = chart;
        
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c}人 ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: '人力资源配置',
                    type: 'pie',
                    radius: '50%',
                    data: this.data.humanResourceData,
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
        
        chart.setOption(option);
    },
    
    // 初始化设备利用率分析图表
    initEquipmentUsageChart: function() {
        const chartContainer = document.getElementById('equipmentUsageChart');
        if (!chartContainer) {
            console.error('设备利用率分析图表容器不存在');
            return;
        }
        
        const chart = echarts.init(chartContainer);
        this.charts.equipmentUsage = chart;
        
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function(params) {
                    const data = params[0];
                    const equipment = OperationReportPage.data.equipmentUsageData[data.dataIndex];
                    return `${equipment.name}<br/>利用率: ${equipment.usage}%<br/>收入: ${equipment.revenue}万元`;
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
                data: this.data.equipmentUsageData.map(item => item.name),
                axisLabel: {
                    interval: 0,
                    rotate: 30
                }
            },
            yAxis: {
                type: 'value',
                name: '利用率(%)',
                max: 100
            },
            series: [
                {
                    name: '设备利用率',
                    type: 'bar',
                    data: this.data.equipmentUsageData.map(item => item.usage),
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
                    },
                    markLine: {
                        data: [
                            { type: 'average', name: '平均值' }
                        ]
                    }
                }
            ]
        };
        
        chart.setOption(option);
    },
    
    // 刷新图表
    refreshCharts: function() {
        // 重新加载数据
        this.loadReportData();
        
        // 更新各个图表
        Object.keys(this.charts).forEach(chartId => {
            const chart = this.charts[chartId];
            if (chart) {
                // 根据图表ID调用相应的更新方法
                switch (chartId) {
                    case 'serviceVolume':
                        this.updateServiceVolumeChart(chart);
                        break;
                    case 'outpatientDistribution':
                        this.updateOutpatientDistributionChart(chart);
                        break;
                    case 'totalRevenue':
                        this.updateTotalRevenueChart(chart);
                        break;
                    case 'revenueStructure':
                        this.updateRevenueStructureChart(chart);
                        break;
                    case 'departmentRevenue':
                        this.updateDepartmentRevenueChart(chart);
                        break;
                    case 'humanResource':
                        this.updateHumanResourceChart(chart);
                        break;
                    case 'equipmentUsage':
                        this.updateEquipmentUsageChart(chart);
                        break;
                }
            }
        });
    },
    
    // 更新医疗服务量趋势图表
    updateServiceVolumeChart: function(chart) {
        const option = {
            xAxis: {
                data: this.data.serviceVolumeData.map(item => item.year)
            },
            series: [
                {
                    data: this.data.serviceVolumeData.map(item => item.outpatient)
                },
                {
                    data: this.data.serviceVolumeData.map(item => item.inpatient)
                }
            ]
        };
        chart.setOption(option);
    },
    
    // 更新门诊科室服务量分布图表
    updateOutpatientDistributionChart: function(chart) {
        const option = {
            series: [
                {
                    data: this.data.outpatientDistributionData
                }
            ]
        };
        chart.setOption(option);
    },
    
    // 更新医院总收入趋势图表
    updateTotalRevenueChart: function(chart) {
        const option = {
            xAxis: {
                data: this.data.totalRevenueData.map(item => item.year)
            },
            series: [
                {
                    data: this.data.totalRevenueData.map(item => item.revenue)
                }
            ]
        };
        chart.setOption(option);
    },
    
    // 更新收入结构分析图表
    updateRevenueStructureChart: function(chart) {
        const option = {
            series: [
                {
                    data: this.data.revenueStructureData
                }
            ]
        };
        chart.setOption(option);
    },
    
    // 更新主要科室收入排名图表
    updateDepartmentRevenueChart: function(chart) {
        const option = {
            yAxis: {
                data: this.data.departmentRevenueData.map(item => item.name)
            },
            series: [
                {
                    data: this.data.departmentRevenueData.map(item => item.value)
                }
            ]
        };
        chart.setOption(option);
    },
    
    // 更新人力资源配置图表
    updateHumanResourceChart: function(chart) {
        const option = {
            series: [
                {
                    data: this.data.humanResourceData
                }
            ]
        };
        chart.setOption(option);
    },
    
    // 更新设备利用率分析图表
    updateEquipmentUsageChart: function(chart) {
        const option = {
            xAxis: {
                data: this.data.equipmentUsageData.map(item => item.name)
            },
            series: [
                {
                    data: this.data.equipmentUsageData.map(item => item.usage)
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
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 依赖全局生命周期和统一脚本加载机制
    if (typeof Common !== 'undefined' && typeof Common.ensureEcharts === 'function') {
        try {
            Common.ensureEcharts();
        } catch (e) {
            console.warn('ensureEcharts 调用失败:', e);
        }
    }

    // 如果 ECharts 已就绪，直接初始化；否则等待全局事件
    if (typeof echarts !== 'undefined') {
        OperationReportPage.init();
    } else {
        const onReady = function() {
            document.removeEventListener('echartsLoaded', onReady);
            OperationReportPage.init();
        };
        document.addEventListener('echartsLoaded', onReady);
    }
});