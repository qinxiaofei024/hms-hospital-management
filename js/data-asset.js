// 数据资产管理页面的图表和交互功能
const DataAssetPage = {
    // 存储从JSON加载的数据
    data: null,
    
    // 从JSON文件加载数据
    loadData: function() {
        return fetch('../data/data-asset.json')
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
                showToast('数据加载失败，使用默认数据', 'error');
                // 使用完整的默认数据
                this.data = {
                    overview: {
                        totalDataVolume: {
                            '2023': 28.5,
                            '2024': 33.6,
                            '2025': 38.6
                        },
                        businessSystems: {
                            '2023': 38,
                            '2024': 40,
                            '2025': 42
                        },
                        patientData: {
                            '2023': 1056890,
                            '2024': 1156890,
                            '2025': 1256890
                        },
                        dataQualityScore: {
                            '2023': 88.2,
                            '2024': 90.5,
                            '2025': 92.8
                        }
                    },
                    qualityTrend: {
                        months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                        '2025': {
                            data: [95.8, 96.0, 96.2, 96.4, 96.5, 96.7, 96.8, 96.9, 97.0, 97.1, 97.2, 97.3]
                        }
                    },
                    qualityDistribution: {
                        '2025': {
                            categories: ['优秀 (≥90分)', '良好 (80-89分)', '一般 (70-79分)', '较差 (<70分)'],
                            data: [
                                {"value": 65, "name": "优秀 (≥90分)", "color": "#52c41a"},
                                {"value": 28, "name": "良好 (80-89分)", "color": "#faad14"},
                                {"value": 5, "name": "一般 (70-79分)", "color": "#ff7875"},
                                {"value": 2, "name": "较差 (<70分)", "color": "#ff4d4f"}
                            ]
                        }
                    },
                    dataDistribution: {
                        '2025': {
                            categories: ['电子病历', '检验检查', '影像数据', '用药记录', '财务数据', '运营管理', '其他数据'],
                            data: [
                                {"value": 12.5, "name": "电子病历", "color": "#0066cc"},
                                {"value": 9.8, "name": "检验检查", "color": "#1890ff"},
                                {"value": 8.2, "name": "影像数据", "color": "#40a9ff"},
                                {"value": 4.1, "name": "用药记录", "color": "#69c0ff"},
                                {"value": 2.5, "name": "财务数据", "color": "#91d5ff"},
                                {"value": 1.2, "name": "运营管理", "color": "#bae7ff"},
                                {"value": 0.3, "name": "其他数据", "color": "#e6f7ff"}
                            ]
                        }
                    },
                    securityMetrics: {
                        encryptionCoverage: "100%",
                        securityVulnerabilities: 0,
                        monitoringCoverage: "24/7",
                        systemAvailability: "99.9%"
                    },
                    keySystems: [
                        {
                            "id": "1",
                            "name": "电子病历系统",
                            "type": "核心业务系统",
                            "version": "V5.2",
                            "dataVolume": "12.5 TB",
                            "lastUpdated": "2025-06-15 09:15:32",
                            "status": "正常"
                        },
                        {
                            "id": "2",
                            "name": "医院信息系统",
                            "type": "核心业务系统",
                            "version": "V6.0",
                            "dataVolume": "8.2 TB",
                            "lastUpdated": "2025-06-15 09:12:18",
                            "status": "正常"
                        },
                        {
                            "id": "3",
                            "name": "医学影像系统",
                            "type": "医技系统",
                            "version": "V4.8",
                            "dataVolume": "9.8 TB",
                            "lastUpdated": "2025-06-15 09:05:22",
                            "status": "正常"
                        },
                        {
                            "id": "4",
                            "name": "检验信息系统",
                            "type": "医技系统",
                            "version": "V5.5",
                            "dataVolume": "4.1 TB",
                            "lastUpdated": "2025-06-15 09:08:45",
                            "status": "警告"
                        },
                        {
                            "id": "5",
                            "name": "财务管理系统",
                            "type": "管理系统",
                            "version": "V3.6",
                            "dataVolume": "2.5 TB",
                            "lastUpdated": "2025-06-15 09:02:10",
                            "status": "正常"
                        },
                        {
                            "id": "6",
                            "name": "人力资源系统",
                            "type": "管理系统",
                            "version": "V3.2",
                            "dataVolume": "0.3 TB",
                            "lastUpdated": "2025-06-15 08:58:36",
                            "status": "离线"
                        },
                        {
                            "id": "7",
                            "name": "药品管理系统",
                            "type": "业务系统",
                            "version": "V4.0",
                            "dataVolume": "1.2 TB",
                            "lastUpdated": "2025-06-15 08:55:14",
                            "status": "警告"
                        }
                    ],
                    dataGrowthTrend: {
                        quarters: [
                            "2023 Q1", "2023 Q2", "2023 Q3", "2023 Q4",
                            "2024 Q1", "2024 Q2", "2024 Q3", "2024 Q4",
                            "2025 Q1", "2025 Q2"
                        ],
                        growthRate: [
                            2.1, 2.3, 2.5, 2.8,
                            3.0, 3.2, 3.5, 3.8,
                            4.0, 4.2
                        ],
                        newRecords: [
                            45000, 48000, 52000, 55000,
                            60000, 65000, 70000, 75000,
                            80000, 85000
                        ]
                    }
                };
                return this.data;
            });
    },    

    // 初始化所有图表
    initCharts: function() {
        if (!this.data) {
            console.error('No data available for charts');
            return;
        }
        
        this.initQualityTrendChart();
        this.initQualityDistributionChart();
        this.initDataDistributionChart();
        this.initDataGrowthChart();
    },

    // 初始化数据质量趋势图表
    initQualityTrendChart: function() {
        const chartDom = document.getElementById('qualityTrendChart');
        if (!chartDom) return;
        
        const myChart = echarts.init(chartDom);
        const currentYear = '2025'; // 使用最近一年的数据
        
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
                boundaryGap: false,
                data: this.data.qualityTrend.months
            },
            yAxis: {
                type: 'value',
                min: 90,
                max: 100,
                axisLabel: {
                    formatter: '{value}分'
                }
            },
            series: [
                {
                    name: '数据质量评分',
                    type: 'line',
                    smooth: true,
                    data: this.data.qualityTrend[currentYear]?.data || [],
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

        myChart.setOption(option);

        // 窗口大小改变时重新调整图表大小
        window.addEventListener('resize', function() {
            myChart.resize();
        });
    },

    // 初始化数据质量分布图表
    initQualityDistributionChart: function() {
        const chartDom = document.getElementById('qualityDistributionChart');
        if (!chartDom) return;
        
        const myChart = echarts.init(chartDom);
        const currentYear = '2025';
        
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                top: 'middle',
                textStyle: {
                    fontSize: 12
                }
            },
            series: [
                {
                    name: '数据质量等级',
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
                    data: this.data.qualityDistribution[currentYear]?.data || []
                }
            ]
        };

        myChart.setOption(option);

        // 窗口大小改变时重新调整图表大小
        window.addEventListener('resize', function() {
            myChart.resize();
        });
    },

    // 初始化数据分布图表
        initDataDistributionChart: function() {
            // 检查页面上是否有数据分布图表的容器
            let chartContainer = document.getElementById('dataDistributionChart');
            
            if (!chartContainer) {
                // 如果没有，创建一个
                const dataDistributionSection = document.querySelector('.data-distribution');
                if (dataDistributionSection) {
                    chartContainer = document.createElement('div');
                    chartContainer.id = 'dataDistributionChart';
                    chartContainer.className = 'chart-container';
                    dataDistributionSection.appendChild(chartContainer);
                } else {
                    return;
                }
            }
            
            const myChart = echarts.init(chartContainer);
            
            const currentYear = new Date().getFullYear();
            const distributionData = this.data.dataDistribution[currentYear]?.data || [];
            const totalDataVolume = this.data.overview.totalDataVolume[currentYear];
            
            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function(params) {
                        const data = params[0];
                        return data.name + '<br/>' + 
                               data.seriesName + ': ' + data.value + ' TB' + '<br/>' +
                               '占比: ' + ((data.value / totalDataVolume) * 100).toFixed(1) + '%';
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
                    data: distributionData.map(item => item.name),
                    axisLabel: {
                        rotate: 30
                    }
                },
                yAxis: {
                    type: 'value',
                    name: '存储容量 (TB)',
                    nameLocation: 'middle',
                    nameGap: 40
                },
                series: [
                    {
                        name: '数据容量',
                        type: 'bar',
                        data: distributionData.map(item => item.value),
                        itemStyle: {
                            color: function(params) {
                                return distributionData[params.dataIndex]?.color || '#0066cc';
                            },
                            borderRadius: [4, 4, 0, 0]
                        },
                        label: {
                            show: true,
                            position: 'top',
                            formatter: '{c} TB'
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
    
    // 初始化数据增长趋势图表
    initDataGrowthChart: function() {
        // 检查页面上是否有增长趋势图表的容器，如果没有则创建
        let chartContainer = document.getElementById('dataGrowthChart');
        let sectionContainer = document.querySelector('.growth-trend-section');
        
        if (!sectionContainer) {
            // 创建数据增长趋势区域
            const contentElement = document.querySelector('.content');
            if (contentElement) {
                const newSection = document.createElement('div');
                newSection.className = 'growth-trend-section';
                newSection.innerHTML = `
                    <h3>数据增长趋势</h3>
                    <div class="chart-container" id="dataGrowthChart"></div>
                `;
                
                // 添加到数据分布区域之后
                const dataDistributionSection = document.querySelector('.data-distribution');
                if (dataDistributionSection) {
                    dataDistributionSection.after(newSection);
                } else {
                    contentElement.appendChild(newSection);
                }
                
                chartContainer = document.getElementById('dataGrowthChart');
            }
        }
        
        if (!chartContainer) return;
        
        const myChart = echarts.init(chartContainer);
        
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            legend: {
                data: ['增长率 (%)', '新增记录数']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: this.data.dataGrowthTrend?.quarters || [],
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '增长率 (%)',
                    position: 'left'
                },
                {
                    type: 'value',
                    name: '新增记录数',
                    position: 'right',
                    axisLabel: {
                        formatter: function(value) {
                            if (value >= 10000) {
                                return (value / 10000).toFixed(1) + '万';
                            }
                            return value;
                        }
                    }
                }
            ],
            series: [
                {
                    name: '增长率 (%)',
                    type: 'line',
                    smooth: true,
                    data: this.data.dataGrowthTrend?.growthRate || [],
                    itemStyle: {
                        color: '#0066cc'
                    },
                    lineStyle: {
                        width: 3
                    },
                    symbol: 'circle',
                    symbolSize: 8
                },
                {
                    name: '新增记录数',
                    type: 'bar',
                    yAxisIndex: 1,
                    data: this.data.dataGrowthTrend?.newRecords || [],
                    itemStyle: {
                        color: '#91d5ff',
                        borderRadius: [4, 4, 0, 0]
                    },
                    label: {
                        show: true,
                        position: 'top',
                        formatter: function(params) {
                            if (params.value >= 10000) {
                                return (params.value / 10000).toFixed(1) + '万';
                            }
                            return params.value;
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

    // 更新数据概览卡片
    updateOverviewCards: function() {
        if (!this.data || !this.data.overview) {
            return;
        }
        
        const currentYear = '2025';
        const overview = this.data.overview;
        
        // 获取页面上现有的卡片元素并更新
        const assetCards = document.querySelectorAll('.data-asset-card');
        
        // 更新数据资产总量卡片
        if (assetCards[0]) {
            const valueElement = assetCards[0].querySelector('.data-value');
            if (valueElement) {
                valueElement.textContent = overview.totalDataVolume[currentYear] + ' TB';
            }
            
            // 添加环比增长数据
            const labelElement = assetCards[0].querySelector('.data-label');
            if (labelElement && overview.totalDataVolume['2024'] && overview.totalDataVolume['2025']) {
                const growthRate = ((overview.totalDataVolume['2025'] - overview.totalDataVolume['2024']) / overview.totalDataVolume['2024'] * 100).toFixed(1);
                
                // 查找或创建趋势元素
                let trendElement = labelElement.querySelector('.data-trend');
                if (!trendElement) {
                    trendElement = document.createElement('span');
                    trendElement.className = 'data-trend trend-up';
                    labelElement.appendChild(trendElement);
                }
                
                trendElement.className = growthRate > 0 ? 'data-trend trend-up' : 'data-trend trend-down';
                trendElement.innerHTML = `<i>${growthRate > 0 ? '↑' : '↓'}</i> ${Math.abs(growthRate)}%`;
            }
        }
        
        // 更新业务系统数量卡片
        if (assetCards[1]) {
            const valueElement = assetCards[1].querySelector('.data-value');
            if (valueElement) {
                valueElement.textContent = overview.businessSystems[currentYear];
            }
            
            // 添加环比增长数据
            const labelElement = assetCards[1].querySelector('.data-label');
            if (labelElement && overview.businessSystems['2024'] && overview.businessSystems['2025']) {
                const growth = overview.businessSystems['2025'] - overview.businessSystems['2024'];
                
                // 查找或创建趋势元素
                let trendElement = labelElement.querySelector('.data-trend');
                if (!trendElement) {
                    trendElement = document.createElement('span');
                    trendElement.className = 'data-trend trend-up';
                    labelElement.appendChild(trendElement);
                }
                
                trendElement.className = growth > 0 ? 'data-trend trend-up' : 'data-trend trend-down';
                trendElement.innerHTML = `<i>${growth > 0 ? '↑' : '↓'}</i> ${Math.abs(growth)}`;
            }
        }
        
        // 更新患者数据量卡片
        if (assetCards[2]) {
            const valueElement = assetCards[2].querySelector('.data-value');
            if (valueElement) {
                valueElement.textContent = overview.patientData[currentYear].toLocaleString();
            }
            
            // 添加环比增长数据
            const labelElement = assetCards[2].querySelector('.data-label');
            if (labelElement && overview.patientData['2024'] && overview.patientData['2025']) {
                const growthRate = ((overview.patientData['2025'] - overview.patientData['2024']) / overview.patientData['2024'] * 100).toFixed(1);
                
                // 查找或创建趋势元素
                let trendElement = labelElement.querySelector('.data-trend');
                if (!trendElement) {
                    trendElement = document.createElement('span');
                    trendElement.className = 'data-trend trend-up';
                    labelElement.appendChild(trendElement);
                }
                
                trendElement.className = growthRate > 0 ? 'data-trend trend-up' : 'data-trend trend-down';
                trendElement.innerHTML = `<i>${growthRate > 0 ? '↑' : '↓'}</i> ${Math.abs(growthRate)}%`;
            }
        }
        
        // 更新数据质量评分卡片
        if (assetCards[3]) {
            const valueElement = assetCards[3].querySelector('.data-value');
            if (valueElement) {
                valueElement.textContent = overview.dataQualityScore[currentYear];
            }
            
            // 添加环比增长数据
            const labelElement = assetCards[3].querySelector('.data-label');
            if (labelElement && overview.dataQualityScore['2024'] && overview.dataQualityScore['2025']) {
                const growth = (overview.dataQualityScore['2025'] - overview.dataQualityScore['2024']).toFixed(1);
                
                // 查找或创建趋势元素
                let trendElement = labelElement.querySelector('.data-trend');
                if (!trendElement) {
                    trendElement = document.createElement('span');
                    trendElement.className = 'data-trend trend-up';
                    labelElement.appendChild(trendElement);
                }
                
                trendElement.className = growth > 0 ? 'data-trend trend-up' : 'data-trend trend-down';
                trendElement.innerHTML = `<i>${growth > 0 ? '↑' : '↓'}</i> ${Math.abs(growth)}`;
            }
        }
        
        // 更新安全指标
        this.updateSecurityMetrics();
        
        // 显示关键系统列表
        this.renderKeySystemsTable();
    },
    
    // 更新安全指标
    updateSecurityMetrics: function() {
        if (!this.data || !this.data.securityMetrics) {
            return;
        }
        
        const securityMetrics = this.data.securityMetrics;
        const securityItems = document.querySelectorAll('.security-item');
        
        if (securityItems.length >= 4) {
            securityItems[0].querySelector('.status-value').textContent = securityMetrics.encryptionCoverage;
            securityItems[1].querySelector('.status-value').textContent = securityMetrics.securityVulnerabilities;
            securityItems[2].querySelector('.status-value').textContent = securityMetrics.monitoringCoverage;
            securityItems[3].querySelector('.status-value').textContent = securityMetrics.systemAvailability;
        }
    },
    
    // 渲染关键系统表格
    renderKeySystemsTable: function() {
        if (!this.data || !this.data.keySystems) {
            return;
        }
        
        // 检查是否已有关键系统区域，如果没有则创建
        let keySystemsSection = document.querySelector('.key-systems-section');
        const contentElement = document.querySelector('.content');
        
        if (!keySystemsSection && contentElement) {
            // 创建关键系统区域
            keySystemsSection = document.createElement('div');
            keySystemsSection.className = 'key-systems-section';
            keySystemsSection.innerHTML = `
                <h3>关键业务系统</h3>
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>系统名称</th>
                                <th>类型</th>
                                <th>版本</th>
                                <th>数据量</th>
                                <th>最后更新</th>
                                <th>状态</th>
                            </tr>
                        </thead>
                        <tbody id="keySystemsTableBody"></tbody>
                    </table>
                </div>
            `;
            
            // 添加到安全管理区域之后
            const securitySection = document.querySelector('.security-section');
            if (securitySection) {
                securitySection.after(keySystemsSection);
            } else {
                contentElement.appendChild(keySystemsSection);
            }
        }
        
        // 添加表格样式
        this.addTableStyles();
        
        // 填充表格数据
        const tableBody = document.getElementById('keySystemsTableBody');
        if (tableBody) {
            tableBody.innerHTML = '';
            
            this.data.keySystems.forEach(system => {
                const row = document.createElement('tr');
                
                // 根据系统状态设置不同的样式
                let statusClass = '';
                switch(system.status) {
                    case '正常':
                        statusClass = 'status-normal';
                        break;
                    case '警告':
                        statusClass = 'status-warning';
                        break;
                    case '离线':
                        statusClass = 'status-offline';
                        break;
                }
                
                row.innerHTML = `
                    <td>${system.name}</td>
                    <td>${system.type}</td>
                    <td>${system.version}</td>
                    <td>${system.dataVolume}</td>
                    <td>${system.lastUpdated}</td>
                    <td><span class="status-badge ${statusClass}">${system.status}</span></td>
                `;
                
                tableBody.appendChild(row);
            });
        }
    },
    
    // 添加表格样式
    addTableStyles: function() {
        // 检查是否已经添加了表格样式
        if (document.getElementById('tableStyles')) {
            return;
        }
        
        const style = document.createElement('style');
        style.id = 'tableStyles';
        style.textContent = `
            .key-systems-section {
                background-color: #fff;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                margin-bottom: 30px;
            }
            
            .key-systems-section h3 {
                color: #333;
                margin-bottom: 20px;
                font-size: 18px;
            }
            
            .table-container {
                overflow-x: auto;
            }
            
            .data-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 14px;
            }
            
            .data-table th,
            .data-table td {
                padding: 12px;
                text-align: left;
                border-bottom: 1px solid #f0f0f0;
            }
            
            .data-table th {
                background-color: #fafafa;
                font-weight: 600;
                color: #333;
            }
            
            .data-table tr:hover {
                background-color: #fafafa;
            }
            
            .status-badge {
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: 500;
            }
            
            .status-normal {
                background-color: #f6ffed;
                color: #52c41a;
                border: 1px solid #b7eb8f;
            }
            
            .status-warning {
                background-color: #fffbe6;
                color: #faad14;
                border: 1px solid #ffe58f;
            }
            
            .status-offline {
                background-color: #fff2f0;
                color: #ff4d4f;
                border: 1px solid #ffccc7;
            }
            
            .growth-trend-section {
                background-color: #fff;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                margin-bottom: 30px;
            }
            
            .growth-trend-section h3 {
                color: #333;
                margin-bottom: 20px;
                font-size: 18px;
            }
        `;
        
        document.head.appendChild(style);
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

    // 导出报表功能
    exportReport: function() {
        const exportBtn = document.querySelector('.btn-primary');
        if (exportBtn) {
            exportBtn.addEventListener('click', function() {
                Common.showLoading();
                setTimeout(function() {
                    Common.hideLoading();
                    Common.showToast('报表已导出', 'success');
                }, 1500);
            });
        }
    },

    // 初始化页面
    init: function() {
        Common.showLoading();
        
        this.loadData()
            .then(() => {
                Common.hideLoading();
                this.updateOverviewCards();
                this.initCharts();
                this.refreshData();
                this.exportReport();
            })
            .catch(() => {
                Common.hideLoading();
                console.error('Failed to initialize page');
            });
    }
};

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', function() {
    DataAssetPage.init();
});