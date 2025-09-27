// 数据集成管理页面的图表和交互功能
const DataIntegrationPage = {
    // 存储从JSON加载的数据
    data: null,
    currentYear: '2025',
    
    // 从JSON文件加载数据
    loadData: function() {
        return fetch('../data/data-integration.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                this.data = data;
                return data;
            })
            .catch(error => {
                console.error('Error loading data:', error);
                Common.showMessage('数据加载失败，请刷新页面重试', 'error');
                // 使用默认数据继续
                this.data = {
                    overview: {
                        totalInterfaces: {'2025': 42},
                        dataCompleteness: {'2025': 97.8},
                        avgResponseTime: {'2025': 2.5}
                    },
                    successRateTrend: {
                        timePoints: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
                        '2025': {
                            data: [99.2, 99.0, 98.8, 99.5, 99.6, 98.7, 98.5, 98.3, 99.1, 99.0, 99.4, 99.3]
                        }
                    },
                    dataTransferTrend: {
                        timePoints: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                        '2025': {
                            data: [120, 85, 230, 350, 280, 150]
                        }
                    },
                    dataSources: [
                        {"id": "1", "name": "电子病历系统", "status": "normal", "statusText": "正常", "connectionType": "JDBC", "frequency": "实时", "lastSyncTime": "10分钟前", "errorCount": 0},
                        {"id": "2", "name": "医院信息系统", "status": "normal", "statusText": "正常", "connectionType": "REST API", "frequency": "实时", "lastSyncTime": "5分钟前", "errorCount": 0},
                        {"id": "3", "name": "检验系统", "status": "warning", "statusText": "警告", "connectionType": "HL7", "frequency": "每15分钟", "lastSyncTime": "15分钟前", "errorCount": 3}
                    ]
                };
                return this.data;
            });
    },
    
    // 初始化所有图表
    initCharts: function() {
        if (!this.data) {
            console.error('No data available for charts');
            Common.showToast('数据未加载，无法初始化图表', 'error');
            return;
        }
        
        console.log('Initializing charts with data:', this.data);
        console.log('Current year:', this.currentYear);
        console.log('Success rate trend data:', this.data.successRateTrend[this.currentYear]?.data || []);
        console.log('Data transfer trend data:', this.data.dataTransferTrend[this.currentYear]?.data || []);
        
        this.initSuccessRateChart();
        this.initDataTransferChart();
    },

    // 初始化集成成功率趋势图表
    initSuccessRateChart: function() {
        const chartDom = document.getElementById('successRateChart');
        if (!chartDom) {
            console.error('successRateChart DOM element not found');
            return;
        }
        
        if (!this.data || !this.data.successRateTrend) {
            console.error('Success rate trend data not available');
            return;
        }
        
        try {
            const myChart = echarts.init(chartDom);
            
            // 创建默认数据以防没有对应年份的数据
            const defaultSuccessData = Array(12).fill(99);
            
            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    },
                    formatter: function(params) {
                        const data = params[0];
                        return data.name + '<br/>' + 
                               data.seriesName + ': ' + data.value + '%';
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
                    boundaryGap: false,
                    data: this.data.successRateTrend.timePoints || ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']
                },
                yAxis: {
                    type: 'value',
                    min: 90,
                    max: 100,
                    axisLabel: {
                        formatter: '{value}%'
                    }
                },
                series: [
                    {
                        name: '集成成功率',
                        type: 'line',
                        smooth: true,
                        data: this.data.successRateTrend[this.currentYear]?.data || defaultSuccessData,
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
                        },
                        lineStyle: {
                            width: 3
                        },
                        symbol: 'circle',
                        symbolSize: 8
                    }
                ]
            };

            console.log('Success rate chart option:', option);
            myChart.setOption(option);

            // 窗口大小改变时重新调整图表大小
            window.addEventListener('resize', function() {
                myChart.resize();
            });
        } catch (error) {
            console.error('Error initializing success rate chart:', error);
            Common.showToast('集成成功率趋势图表初始化失败', 'error');
        }
    },

    // 初始化数据传输量统计图表
    initDataTransferChart: function() {
        const chartDom = document.getElementById('dataTransferChart');
        if (!chartDom) {
            console.error('dataTransferChart DOM element not found');
            return;
        }
        
        if (!this.data || !this.data.dataTransferTrend) {
            console.error('Data transfer trend data not available');
            return;
        }
        
        try {
            const myChart = echarts.init(chartDom);
            
            // 创建默认数据以防没有对应年份的数据
            const defaultTransferData = [100, 80, 200, 300, 250, 130];
            
            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function(params) {
                        const data = params[0];
                        return data.name + '<br/>' + 
                               data.seriesName + ': ' + data.value + ' GB';
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
                    data: this.data.dataTransferTrend.timePoints || ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00']
                },
                yAxis: {
                    type: 'value',
                    name: '数据量 (GB)',
                    nameLocation: 'middle',
                    nameGap: 40
                },
                series: [
                    {
                        name: '数据传输量',
                        type: 'bar',
                        data: this.data.dataTransferTrend[this.currentYear]?.data || defaultTransferData,
                        itemStyle: {
                            color: function(params) {
                                const colors = ['#0066cc', '#1890ff', '#40a9ff', '#69c0ff', '#91d5ff', '#bae7ff'];
                                return colors[params.dataIndex];
                            },
                            borderRadius: [4, 4, 0, 0]
                        },
                        label: {
                            show: true,
                            position: 'top',
                            formatter: '{c} GB'
                        }
                    }
                ]
            };

            console.log('Data transfer chart option:', option);
            myChart.setOption(option);

            // 窗口大小改变时重新调整图表大小
            window.addEventListener('resize', function() {
                myChart.resize();
            });
        } catch (error) {
            console.error('Error initializing data transfer chart:', error);
            Common.showToast('数据传输量统计图表初始化失败', 'error');
        }
    },

    // 更新数据概览卡片
    updateOverviewCards: function() {
        if (!this.data || !this.data.overview) {
            return;
        }
        
        const overview = this.data.overview;
        const year = this.currentYear;
        
        // 更新数据概览卡片内容
        const totalInterfacesElement = document.querySelector('.total-interfaces .card-value');
        const normalInterfacesElement = document.querySelector('.normal-interfaces .card-value');
        const warningInterfacesElement = document.querySelector('.warning-interfaces .card-value');
        const errorInterfacesElement = document.querySelector('.error-interfaces .card-value');
        const dataCompletenessElement = document.querySelector('.data-completeness .card-value');
        const avgResponseTimeElement = document.querySelector('.avg-response-time .card-value');
        
        if (totalInterfacesElement && overview.totalInterfaces && overview.totalInterfaces[year]) {
            totalInterfacesElement.textContent = overview.totalInterfaces[year];
        }
        if (normalInterfacesElement && overview.normalInterfaces && overview.normalInterfaces[year]) {
            normalInterfacesElement.textContent = overview.normalInterfaces[year];
        }
        if (warningInterfacesElement && overview.warningInterfaces && overview.warningInterfaces[year]) {
            warningInterfacesElement.textContent = overview.warningInterfaces[year];
        }
        if (errorInterfacesElement && overview.errorInterfaces && overview.errorInterfaces[year]) {
            errorInterfacesElement.textContent = overview.errorInterfaces[year];
        }
        if (dataCompletenessElement && overview.dataCompleteness && overview.dataCompleteness[year]) {
            dataCompletenessElement.textContent = overview.dataCompleteness[year] + '%';
        }
        if (avgResponseTimeElement && overview.avgResponseTime && overview.avgResponseTime[year]) {
            avgResponseTimeElement.textContent = overview.avgResponseTime[year] + '秒';
        }
    },

    // 刷新数据功能
    refreshData: function() {
        const refreshBtn = document.querySelector('.btn-default');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', function() {
                Common.showLoading();
                setTimeout(() => {
                    // 重新加载数据
                    this.loadData().then(() => {
                        this.updateOverviewCards();
                        this.initCharts();
                        Common.hideLoading();
                        Common.showToast('数据已刷新', 'success');
                    });
                }, 1000);
            }.bind(this));
        }
    },

    // 查看详情功能
    viewDetails: function() {
        const detailBtn = document.querySelector('.btn-primary');
        if (detailBtn) {
            detailBtn.addEventListener('click', function() {
                Common.showToast('查看详情功能已触发', 'info');
            });
        }
    },

    // 更新数据源表格
    updateDataSourcesTable: function() {
        if (!this.data || !this.data.dataSources) {
            return;
        }
        
        const tableBody = document.querySelector('tbody');
        if (!tableBody) return;
        
        // 清空表格内容
        tableBody.innerHTML = '';
        
        // 渲染数据源表格
        this.data.dataSources.forEach(source => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${source.name}</td>
                <td>${source.type || source.connectionType}</td>
                <td>
                    <span class="status-badge status-${source.status}">
                        ${source.statusText || source.status}
                    </span>
                </td>
                <td>${source.frequency}</td>
                <td>${source.lastSyncTime}</td>
                <td>${source.errorCount || 0}</td>
            `;
            
            // 添加点击事件
            row.addEventListener('click', function() {
                Common.showToast(`您选择了数据源: ${source.name}`, 'info');
            });
            
            tableBody.appendChild(row);
        });
    },

    // 初始化表格
    initTableEvents: function() {
        // 现在表格事件在updateDataSourcesTable中已经处理
        this.updateDataSourcesTable();
    },

    // 初始化页面
    init: function() {
        Common.showLoading();
        
        this.loadData()
            .then(() => {
                Common.hideLoading();
                this.updateOverviewCards();
                this.updateDataSourcesTable();
                this.initCharts();
                this.refreshData();
                this.viewDetails();
                this.initTableEvents();
            })
            .catch(() => {
                Common.hideLoading();
                console.error('Failed to initialize page');
            });
    }
};

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', function() {
    DataIntegrationPage.init();
});