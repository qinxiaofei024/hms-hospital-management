/**
 * 
 * 
 */
var DepartmentRevenuePage = {
    // ?    state: {
        currentTimeRange: 'month',
        currentDepartment: 'cardiology',
        currentRevenueType: 'all',
        loading: false,
        charts: {}
    },
    
    // 
    mockData: {
        // 
        departments: [
            { id: 'cardiology', name: '?, type: 'internal' },
            { id: 'orthopedics', name: '', type: 'surgery' },
            { id: 'neurosurgery', name: '', type: 'surgery' },
            { id: 'digestive', name: '', type: 'internal' },
            { id: 'respiratory', name: '', type: 'internal' },
            { id: 'neurology', name: '', type: 'internal' },
            { id: 'obstetrics', name: '?, type: 'specialized' },
            { id: 'pediatrics', name: '', type: 'specialized' }
        ],
        
        //  - 
        monthlyRevenue: [
            { month: '1?, revenue: 260000000, growthRate: 9.2, cumulativeRevenue: 260000000, cumulativeGrowthRate: 9.2, target: 240000000, completionRate: 108.3 },
            { month: '2?, revenue: 240000000, growthRate: 11.1, cumulativeRevenue: 500000000, cumulativeGrowthRate: 10.1, target: 240000000, completionRate: 104.2 },
            { month: '3?, revenue: 280000000, growthRate: 12.0, cumulativeRevenue: 780000000, cumulativeGrowthRate: 10.8, target: 240000000, completionRate: 108.3 },
            { month: '4?, revenue: 270000000, growthRate: 10.2, cumulativeRevenue: 1050000000, cumulativeGrowthRate: 10.7, target: 240000000, completionRate: 109.4 },
            { month: '5?, revenue: 290000000, growthRate: 11.5, cumulativeRevenue: 1340000000, cumulativeGrowthRate: 10.9, target: 240000000, completionRate: 111.7 },
            { month: '6?, revenue: 300000000, growthRate: 12.3, cumulativeRevenue: 1640000000, cumulativeGrowthRate: 11.1, target: 240000000, completionRate: 113.9 },
            { month: '7?, revenue: 290000000, growthRate: 10.9, cumulativeRevenue: 1930000000, cumulativeGrowthRate: 11.0, target: 240000000, completionRate: 114.9 },
            { month: '8?, revenue: 300000000, growthRate: 11.1, cumulativeRevenue: 2230000000, cumulativeGrowthRate: 11.0, target: 240000000, completionRate: 116.1 },
            { month: '9?, revenue: 280000000, growthRate: 10.2, cumulativeRevenue: 2510000000, cumulativeGrowthRate: 10.9, target: 240000000, completionRate: 116.2 },
            { month: '10?, revenue: 320000000, growthRate: 11.5, cumulativeRevenue: 2830000000, cumulativeGrowthRate: 11.0, target: 240000000, completionRate: 117.9 }
        ],
        
        // 
        revenueStructure: [
            { type: 'medical-service', name: '', amount: 120000000, percentage: 38.2, lastMonthAmount: 110000000, lastMonthPercentage: 39.7, growthRate: 9.1, percentageChange: -1.5, targetPercentage: 43, status: 'danger' },
            { type: 'drug', name: '', amount: 140000000, percentage: 42.5, lastMonthAmount: 120000000, lastMonthPercentage: 41.8, growthRate: 16.7, percentageChange: 0.7, targetPercentage: 40, status: 'danger' },
            { type: 'material', name: '', amount: 62000000, percentage: 19.3, lastMonthAmount: 52000000, lastMonthPercentage: 18.5, growthRate: 19.2, percentageChange: 0.8, targetPercentage: 20, status: 'good' },
            { type: 'inspection', name: '?, amount: 45000000, percentage: 14.1, lastMonthAmount: 41000000, lastMonthPercentage: 14.4, growthRate: 9.8, percentageChange: -0.3, targetPercentage: null, status: 'good' },
            { type: 'treatment', name: '', amount: 38000000, percentage: 11.9, lastMonthAmount: 35000000, lastMonthPercentage: 12.2, growthRate: 8.6, percentageChange: -0.3, targetPercentage: null, status: 'good' },
            { type: 'operation', name: '', amount: 58000000, percentage: 18.1, lastMonthAmount: 51000000, lastMonthPercentage: 17.9, growthRate: 13.7, percentageChange: 0.2, targetPercentage: 18, status: 'good' },
            { type: 'bed', name: '', amount: 21000000, percentage: 6.6, lastMonthAmount: 20000000, lastMonthPercentage: 6.9, growthRate: 5.0, percentageChange: -0.3, targetPercentage: null, status: 'good' }
        ],
        
        // 
        departmentRevenueComparison: [
            { department: '?, revenue: 320000000, yearOnYearGrowth: 11.5, monthOnMonthGrowth: 14.3, medicalServicePercentage: 38.2, drugPercentage: 42.5, materialPercentage: 19.3, rank: 1 },
            { department: '', revenue: 300000000, yearOnYearGrowth: 10.2, monthOnMonthGrowth: 12.5, medicalServicePercentage: 39.8, drugPercentage: 41.2, materialPercentage: 19.0, rank: 2 },
            { department: '', revenue: 280000000, yearOnYearGrowth: 9.8, monthOnMonthGrowth: 11.7, medicalServicePercentage: 40.5, drugPercentage: 40.8, materialPercentage: 18.7, rank: 3 },
            { department: '', revenue: 260000000, yearOnYearGrowth: 10.5, monthOnMonthGrowth: 13.0, medicalServicePercentage: 39.2, drugPercentage: 41.5, materialPercentage: 19.3, rank: 4 },
            { department: '', revenue: 250000000, yearOnYearGrowth: 9.7, monthOnMonthGrowth: 12.3, medicalServicePercentage: 38.8, drugPercentage: 42.1, materialPercentage: 19.1, rank: 5 },
            { department: '', revenue: 240000000, yearOnYearGrowth: 10.1, monthOnMonthGrowth: 11.9, medicalServicePercentage: 39.5, drugPercentage: 41.3, materialPercentage: 19.2, rank: 6 },
            { department: '?, revenue: 220000000, yearOnYearGrowth: 9.4, monthOnMonthGrowth: 11.5, medicalServicePercentage: 40.2, drugPercentage: 40.5, materialPercentage: 19.3, rank: 7 },
            { department: '', revenue: 200000000, yearOnYearGrowth: 9.2, monthOnMonthGrowth: 10.8, medicalServicePercentage: 39.6, drugPercentage: 41.8, materialPercentage: 18.6, rank: 8 }
        ],
        
        // 
        averageCost: [
            { type: 'discharge', name: '?, current: 35600, lastMonth: 34380, monthOnMonthGrowth: 3.5, lastYear: 33250, yearOnYearGrowth: 7.1, target: 36000, status: 'good' },
            { type: 'visit', name: '', current: 265, lastMonth: 261, monthOnMonthGrowth: 1.5, lastYear: 256, yearOnYearGrowth: 3.5, target: 270, status: 'good' },
            { type: 'drug', name: '', current: 15130, lastMonth: 14670, monthOnMonthGrowth: 3.1, lastYear: 14210, yearOnYearGrowth: 6.5, target: 15500, status: 'good' },
            { type: 'material', name: '', current: 6870, lastMonth: 6390, monthOnMonthGrowth: 7.5, lastYear: 6290, yearOnYearGrowth: 9.2, target: 7000, status: 'good' },
            { type: 'inspection', name: '?, current: 6010, lastMonth: 5870, monthOnMonthGrowth: 2.4, lastYear: 5680, yearOnYearGrowth: 5.8, target: 6200, status: 'good' },
            { type: 'treatment', name: '', current: 4120, lastMonth: 3980, monthOnMonthGrowth: 3.5, lastYear: 3890, yearOnYearGrowth: 6.0, target: 4300, status: 'good' }
        ],
        
        // 
        revenueGrowthFactors: [
            { factor: '?, contribution: 12.5, percentage: 72.5, performance: '+8.2%?3.5%', analysis: '' },
            { factor: '', contribution: 3.2, percentage: 18.7, performance: '', analysis: '? },
            { factor: '', contribution: 1.5, percentage: 8.8, performance: 'CMI?0.05?1.4%', analysis: '? },
            { factor: '', contribution: -1.0, percentage: 0.0, performance: '?, analysis: '? }
        ],
        
        // 
        optimizationSuggestions: [
            {
                category: '?,
                problem: '?8.2% < 43%?,
                reason: '?,
                suggestion: '1. ?. 3. ',
                responsible: '',
                deadline: '2023-12-31',
                expectedEffect: '?0%'
            },
            {
                category: '',
                problem: '?2.5% > 40%?,
                reason: '',
                suggestion: '1. 2. ?. ?,
                responsible: '',
                deadline: '2023-11-30',
                expectedEffect: '40%'
            },
            {
                category: '',
                problem: '?19.2%?,
                reason: '?,
                suggestion: '1. ?. 3. ',
                responsible: '',
                deadline: '2023-12-15',
                expectedEffect: '?0%'
            },
            {
                category: '?,
                problem: '?,
                reason: '?,
                suggestion: '1. 2. ?. ',
                responsible: '',
                deadline: '2024-03-31',
                expectedEffect: '?
            }
        ],
        
        // 
        keyIndicators: [
            { name: '', value: 320000000, unit: '', changeRate: 14.3, isPositive: true },
            { name: '', value: 180000000, unit: '', changeRate: -3.2, isPositive: false },
            { name: '', value: 38.2, unit: '%', changeRate: -1.5, isPositive: false },
            { name: '', value: 42.5, unit: '%', changeRate: 0.7, isPositive: false },
            { name: '', value: 19.3, unit: '%', changeRate: 0.8, isPositive: false },
            { name: '?, value: 11.5, unit: '%', changeRate: 2.3, isPositive: true },
            { name: '?, value: 14.3, unit: '%', changeRate: 3.8, isPositive: true },
            { name: '', value: 11200, unit: '', changeRate: 3.2, isPositive: true },
            { name: '?, value: 35600, unit: '', changeRate: 2.8, isPositive: true },
            { name: '', value: 265, unit: '', changeRate: 1.5, isPositive: true },
            { name: '?, value: 112.5, unit: '%', changeRate: 2.5, isPositive: true },
            { name: '?, value: 96.8, unit: '%', changeRate: -3.2, isPositive: false }
        ]
    },
    
    // ?    init: function() {
        // ?        this.state.currentTimeRange = document.getElementById('time-range').value;
        this.state.currentDepartment = document.getElementById('department-select').value;
        this.state.currentRevenueType = document.getElementById('revenue-type').value;
        
        // ?        this.initEventListeners();
        
        // 
        this.loadData();
        
        // ?        this.initCharts();
    },
    
    // ?    initEventListeners: function() {
        var self = this;
        
        // 
        document.getElementById('time-range').addEventListener('change', function() {
            self.state.currentTimeRange = this.value;
            self.refreshData();
        });
        
        // 
        document.getElementById('department-select').addEventListener('change', function() {
            self.state.currentDepartment = this.value;
            self.refreshData();
        });
        
        // 
        document.getElementById('revenue-type').addEventListener('change', function() {
            self.state.currentRevenueType = this.value;
            self.refreshData();
        });
        
        // 
        document.getElementById('refresh-data-btn').addEventListener('click', function() {
            self.refreshData();
        });
        
        // 
        var exportButtons = document.querySelectorAll('.export-actions button');
        exportButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                self.exportReport(this.textContent);
            });
        });
        
        // 
        var paginationButtons = document.querySelectorAll('.pagination-btn:not(:disabled)');
        paginationButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                if (this.textContent === '? || this.textContent === '?) {
                    // 
                } else {
                    // ?                }
            });
        });
    },
    
    // 
    loadData: function() {
        var self = this;
        self.state.loading = true;
        
        // 
        setTimeout(function() {
            // 
            self.renderKeyIndicators();
            
            // 
            self.renderDataTables();
            
            self.state.loading = false;
        }, 500);
    },
    
    // 
    refreshData: function() {
        var self = this;
        self.state.loading = true;
        
        // 
        setTimeout(function() {
            // 
            self.renderKeyIndicators();
            
            // 
            self.renderDataTables();
            
            // 
            self.updateCharts();
            
            self.state.loading = false;
        }, 800);
    },
    
    // ?    initCharts: function() {
        // ?        this.state.charts.revenueMonthlyTrendChart = echarts.init(document.getElementById('revenueMonthlyTrendChart'));
        this.initRevenueMonthlyTrendChart();
        
        // ?        this.state.charts.revenueQuarterlyTrendChart = echarts.init(document.getElementById('revenueQuarterlyTrendChart'));
        this.initRevenueQuarterlyTrendChart();
        
        // ?        this.state.charts.revenueYearlyComparisonChart = echarts.init(document.getElementById('revenueYearlyComparisonChart'));
        this.initRevenueYearlyComparisonChart();
        
        // ?        this.state.charts.revenueStructureChart = echarts.init(document.getElementById('revenueStructureChart'));
        this.initRevenueStructureChart();
        
        // ?        this.state.charts.revenueStructureMonthlyChart = echarts.init(document.getElementById('revenueStructureMonthlyChart'));
        this.initRevenueStructureMonthlyChart();
        
        // ?        this.state.charts.outpatientRevenueStructureChart = echarts.init(document.getElementById('outpatientRevenueStructureChart'));
        this.initOutpatientRevenueStructureChart();
        
        // ?        this.state.charts.inpatientRevenueStructureChart = echarts.init(document.getElementById('inpatientRevenueStructureChart'));
        this.initInpatientRevenueStructureChart();
        
        // 
        this.state.charts.departmentsRevenueRankingChart = echarts.init(document.getElementById('departmentsRevenueRankingChart'));
        this.initDepartmentsRevenueRankingChart();
        
        // ?        this.state.charts.departmentVsBenchmarkChart = echarts.init(document.getElementById('departmentVsBenchmarkChart'));
        this.initDepartmentVsBenchmarkChart();
        
        // ?        this.state.charts.revenueGrowthComparisonChart = echarts.init(document.getElementById('revenueGrowthComparisonChart'));
        this.initRevenueGrowthComparisonChart();
        
        // ?        this.state.charts.revenueStructureRadarChart = echarts.init(document.getElementById('revenueStructureRadarChart'));
        this.initRevenueStructureRadarChart();
        
        // 
        this.state.charts.averageCostPerDischargeTrendChart = echarts.init(document.getElementById('averageCostPerDischargeTrendChart'));
        this.initAverageCostPerDischargeTrendChart();
        
        // ?        this.state.charts.averageCostPerVisitTrendChart = echarts.init(document.getElementById('averageCostPerVisitTrendChart'));
        this.initAverageCostPerVisitTrendChart();
        
        // 
        this.state.charts.departmentsAverageCostComparisonChart = echarts.init(document.getElementById('departmentsAverageCostComparisonChart'));
        this.initDepartmentsAverageCostComparisonChart();
        
        // ?        this.state.charts.averageCostStructureChart = echarts.init(document.getElementById('averageCostStructureChart'));
        this.initAverageCostStructureChart();
        
        // 
        this.state.charts.revenueGrowthFactorsChart = echarts.init(document.getElementById('revenueGrowthFactorsChart'));
        this.initRevenueGrowthFactorsChart();
        
        // 
        this.state.charts.workloadGrowthContributionChart = echarts.init(document.getElementById('workloadGrowthContributionChart'));
        this.initWorkloadGrowthContributionChart();
        
        // ?        window.addEventListener('resize', function() {
            for (var chartKey in this.state.charts) {
                if (this.state.charts.hasOwnProperty(chartKey)) {
                    this.state.charts[chartKey].resize();
                }
            }
        }.bind(this));
    },
    
    // 
    updateCharts: function() {
        // ?        this.updateRevenueMonthlyTrendChart();
        this.updateRevenueQuarterlyTrendChart();
        this.updateRevenueYearlyComparisonChart();
        this.updateRevenueStructureChart();
        this.updateRevenueStructureMonthlyChart();
        this.updateOutpatientRevenueStructureChart();
        this.updateInpatientRevenueStructureChart();
        this.updateDepartmentsRevenueRankingChart();
        this.updateDepartmentVsBenchmarkChart();
        this.updateRevenueGrowthComparisonChart();
        this.updateRevenueStructureRadarChart();
        this.updateAverageCostPerDischargeTrendChart();
        this.updateAverageCostPerVisitTrendChart();
        this.updateDepartmentsAverageCostComparisonChart();
        this.updateAverageCostStructureChart();
        this.updateRevenueGrowthFactorsChart();
        this.updateWorkloadGrowthContributionChart();
    },
    
    // 
    renderKeyIndicators: function() {
        var keyMetricsContainer = document.querySelector('.key-metrics');
        keyMetricsContainer.innerHTML = '';
        
        this.mockData.keyIndicators.forEach(function(indicator) {
            var metricCard = document.createElement('div');
            metricCard.className = 'metric-card';
            
            var formattedValue = indicator.unit === '' ? 
                this.formatCurrency(indicator.value) : 
                (indicator.value + indicator.unit);
            
            var changeClass = indicator.isPositive ? 'positive' : 'negative';
            var changeSymbol = indicator.isPositive ? '+' : '';
            
            metricCard.innerHTML = `
                <div class="metric-card-value">${formattedValue}</div>
                <div class="metric-card-label">${indicator.name}</div>
                <div class="metric-card-change ${changeClass}">${changeSymbol}${indicator.changeRate}% ?/div>
            `;
            
            keyMetricsContainer.appendChild(metricCard);
        }, this);
    },
    
    // 
    renderDataTables: function() {
        // 
        this.renderRevenueTrendTable();
        
        // 
        this.renderRevenueStructureTable();
        
        // 
        this.renderDepartmentRevenueComparisonTable();
        
        // 
        this.renderAverageCostTable();
        
        // 
        this.renderRevenueGrowthFactorsTable();
        
        // 
        this.renderOptimizationSuggestionsTable();
    },
    
    // 
    exportReport: function(type) {
        // 
        alert('' + type + '...');
        // 
    },
    
    // ?    formatCurrency: function(value) {
        if (value >= 100000000) {
            return '' + (value / 100000000).toFixed(1) + '?;
        } else if (value >= 10000) {
            return '' + (value / 10000).toFixed(0) + '?;
        } else {
            return '' + value.toLocaleString();
        }
    },
    
    // 
    initRevenueMonthlyTrendChart: function() {
        var option = {
            title: {
                text: '',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                },
                formatter: function(params) {
                    var result = params[0].name + '<br/>';
                    params.forEach(function(param) {
                        var value = param.seriesName === '' ? 
                            DepartmentRevenuePage.formatCurrency(param.value) : 
                            param.value + '%';
                        result += param.marker + param.seriesName + ': ' + value + '<br/>';
                    });
                    return result;
                }
            },
            legend: {
                data: ['', '?, '?],
                bottom: 10
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: this.mockData.monthlyRevenue.map(function(item) { return item.month; })
            },
            yAxis: [
                {
                    type: 'value',
                    name: '',
                    position: 'left',
                    axisLabel: {
                        formatter: function(value) {
                            if (value >= 100000000) {
                                return (value / 100000000).toFixed(0) + '?;
                            } else {
                                return (value / 10000000).toFixed(1) + '';
                            }
                        }
                    }
                },
                {
                    type: 'value',
                    name: '?,
                    position: 'right',
                    axisLabel: {
                        formatter: '{value}%'
                    }
                }
            ],
            series: [
                {
                    name: '',
                    type: 'line',
                    data: this.mockData.monthlyRevenue.map(function(item) { return item.revenue; }),
                    smooth: true,
                    areaStyle: {
                        opacity: 0.3
                    }
                },
                {
                    name: '?,
                    type: 'line',
                    yAxisIndex: 1,
                    data: this.mockData.monthlyRevenue.map(function(item) { return item.growthRate; }),
                    smooth: true
                },
                {
                    name: '?,
                    type: 'line',
                    yAxisIndex: 1,
                    data: this.mockData.monthlyRevenue.map(function(item) { return item.completionRate; }),
                    smooth: true
                }
            ]
        };
        
        this.state.charts.revenueMonthlyTrendChart.setOption(option);
    },
    
    // ?    updateRevenueMonthlyTrendChart: function() {
        this.state.charts.revenueMonthlyTrendChart.setOption({
            series: [
                {
                    data: this.mockData.monthlyRevenue.map(function(item) { return item.revenue; })
                },
                {
                    data: this.mockData.monthlyRevenue.map(function(item) { return item.growthRate; })
                },
                {
                    data: this.mockData.monthlyRevenue.map(function(item) { return item.completionRate; })
                }
            ]
        });
    },
    
    // 
    initRevenueQuarterlyTrendChart: function() {
        //  - 
        var quarterlyData = [
            { quarter: 'Q1', revenue: 780000000, growthRate: 10.8 },
            { quarter: 'Q2', revenue: 860000000, growthRate: 11.3 },
            { quarter: 'Q3', revenue: 870000000, growthRate: 10.7 },
            { quarter: 'Q4', revenue: 900000000, growthRate: 11.4 }
        ];
        
        var option = {
            title: {
                text: '',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function(params) {
                    var result = params[0].name + '<br/>';
                    params.forEach(function(param) {
                        var value = param.seriesName === '' ? 
                            DepartmentRevenuePage.formatCurrency(param.value) : 
                            param.value + '%';
                        result += param.marker + param.seriesName + ': ' + value + '<br/>';
                    });
                    return result;
                }
            },
            legend: {
                data: ['', '?],
                bottom: 10
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: quarterlyData.map(function(item) { return item.quarter; })
            },
            yAxis: [
                {
                    type: 'value',
                    name: '',
                    position: 'left',
                    axisLabel: {
                        formatter: function(value) {
                            if (value >= 100000000) {
                                return (value / 100000000).toFixed(0) + '?;
                            } else {
                                return (value / 10000000).toFixed(1) + '';
                            }
                        }
                    }
                },
                {
                    type: 'value',
                    name: '?,
                    position: 'right',
                    axisLabel: {
                        formatter: '{value}%'
                    }
                }
            ],
            series: [
                {
                    name: '',
                    type: 'bar',
                    data: quarterlyData.map(function(item) { return item.revenue; }),
                    itemStyle: {
                        borderRadius: [4, 4, 0, 0]
                    }
                },
                {
                    name: '?,
                    type: 'line',
                    yAxisIndex: 1,
                    data: quarterlyData.map(function(item) { return item.growthRate; }),
                    smooth: true
                }
            ]
        };
        
        this.state.charts.revenueQuarterlyTrendChart.setOption(option);
    },
    
    // ?    updateRevenueQuarterlyTrendChart: function() {
        //  - 
        var quarterlyData = [
            { quarter: 'Q1', revenue: 780000000, growthRate: 10.8 },
            { quarter: 'Q2', revenue: 860000000, growthRate: 11.3 },
            { quarter: 'Q3', revenue: 870000000, growthRate: 10.7 },
            { quarter: 'Q4', revenue: 900000000, growthRate: 11.4 }
        ];
        
        this.state.charts.revenueQuarterlyTrendChart.setOption({
            series: [
                {
                    data: quarterlyData.map(function(item) { return item.revenue; })
                },
                {
                    data: quarterlyData.map(function(item) { return item.growthRate; })
                }
            ]
        });
    },
    
    // 
    initRevenueYearlyComparisonChart: function() {
        //  - 
        var yearlyData = [
            { year: '2018', revenue: 2500000000 },
            { year: '2019', revenue: 2700000000 },
            { year: '2020', revenue: 2900000000 },
            { year: '2021', revenue: 3100000000 },
            { year: '2022', revenue: 3200000000 },
            { year: '2023', revenue: 3400000000 }
        ];
        
        var option = {
            title: {
                text: '',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function(params) {
                    var result = params[0].name + '<br/>';
                    params.forEach(function(param) {
                        var value = DepartmentRevenuePage.formatCurrency(param.value);
                        result += param.marker + param.seriesName + ': ' + value + '<br/>';
                    });
                    return result;
                }
            },
            legend: {
                data: [''],
                bottom: 10
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: yearlyData.map(function(item) { return item.year; })
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: function(value) {
                        return (value / 100000000).toFixed(0) + '?;
                    }
                }
            },
            series: [
                {
                    name: '',
                    type: 'bar',
                    data: yearlyData.map(function(item) { return item.revenue; }),
                    itemStyle: {
                        borderRadius: [4, 4, 0, 0]
                    }
                }
            ]
        };
        
        this.state.charts.revenueYearlyComparisonChart.setOption(option);
    },
    
    // ?    updateRevenueYearlyComparisonChart: function() {
        //  - 
        var yearlyData = [
            { year: '2018', revenue: 2500000000 },
            { year: '2019', revenue: 2700000000 },
            { year: '2020', revenue: 2900000000 },
            { year: '2021', revenue: 3100000000 },
            { year: '2022', revenue: 3200000000 },
            { year: '2023', revenue: 3400000000 }
        ];
        
        this.state.charts.revenueYearlyComparisonChart.setOption({
            series: [
                {
                    data: yearlyData.map(function(item) { return item.revenue; })
                }
            ]
        });
    },
    
    // 
    initRevenueStructureChart: function() {
        // ?        var mainRevenueTypes = this.mockData.revenueStructure.filter(function(item) {
            return ['medical-service', 'drug', 'material'].includes(item.type);
        });
        
        var option = {
            title: {
                text: '',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                bottom: '10%',
                data: mainRevenueTypes.map(function(item) { return item.name; })
            },
            series: [
                {
                    name: '',
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
                    data: mainRevenueTypes.map(function(item) {
                        return {
                            value: item.amount,
                            name: item.name
                        };
                    })
                }
            ]
        };
        
        this.state.charts.revenueStructureChart.setOption(option);
    },
    
    // ?    updateRevenueStructureChart: function() {
        // ?        var mainRevenueTypes = this.mockData.revenueStructure.filter(function(item) {
            return ['medical-service', 'drug', 'material'].includes(item.type);
        });
        
        this.state.charts.revenueStructureChart.setOption({
            series: [
                {
                    data: mainRevenueTypes.map(function(item) {
                        return {
                            value: item.amount,
                            name: item.name
                        };
                    })
                }
            ]
        });
    },
    
    // 
    initRevenueStructureMonthlyChart: function() {
        //  - 
        var monthlyStructureData = [
            { month: '7?, medicalService: 37.8, drug: 42.3, material: 19.9 },
            { month: '8?, medicalService: 38.0, drug: 42.2, material: 19.8 },
            { month: '9?, medicalService: 38.1, drug: 42.4, material: 19.5 },
            { month: '10?, medicalService: 38.2, drug: 42.5, material: 19.3 }
        ];
        
        var option = {
            title: {
                text: '',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                },
                formatter: function(params) {
                    var result = params[0].name + '<br/>';
                    params.forEach(function(param) {
                        result += param.marker + param.seriesName + ': ' + param.value + '%<br/>';
                    });
                    return result;
                }
            },
            legend: {
                data: ['', '', ''],
                bottom: 10
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: monthlyStructureData.map(function(item) { return item.month; })
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value}%'
                }
            },
            series: [
                {
                    name: '',
                    type: 'line',
                    data: monthlyStructureData.map(function(item) { return item.medicalService; }),
                    smooth: true
                },
                {
                    name: '',
                    type: 'line',
                    data: monthlyStructureData.map(function(item) { return item.drug; }),
                    smooth: true
                },
                {
                    name: '',
                    type: 'line',
                    data: monthlyStructureData.map(function(item) { return item.material; }),
                    smooth: true
                }
            ]
        };
        
        this.state.charts.revenueStructureMonthlyChart.setOption(option);
    },
    
    // ?    updateRevenueStructureMonthlyChart: function() {
        //  - 
        var monthlyStructureData = [
            { month: '7?, medicalService: 37.8, drug: 42.3, material: 19.9 },
            { month: '8?, medicalService: 38.0, drug: 42.2, material: 19.8 },
            { month: '9?, medicalService: 38.1, drug: 42.4, material: 19.5 },
            { month: '10?, medicalService: 38.2, drug: 42.5, material: 19.3 }
        ];
        
        this.state.charts.revenueStructureMonthlyChart.setOption({
            series: [
                {
                    data: monthlyStructureData.map(function(item) { return item.medicalService; })
                },
                {
                    data: monthlyStructureData.map(function(item) { return item.drug; })
                },
                {
                    data: monthlyStructureData.map(function(item) { return item.material; })
                }
            ]
        });
    },
    
    // 
    initOutpatientRevenueStructureChart: function() {
        //  - 
        var outpatientRevenueStructure = [
            { name: '', value: 35 },
            { name: '', value: 30 },
            { name: '?, value: 15 },
            { name: '', value: 10 },
            { name: '', value: 10 }
        ];
        
        var option = {
            title: {
                text: '',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c}%'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                bottom: '10%',
                data: outpatientRevenueStructure.map(function(item) { return item.name; })
            },
            series: [
                {
                    name: '',
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
                    data: outpatientRevenueStructure
                }
            ]
        };
        
        this.state.charts.outpatientRevenueStructureChart.setOption(option);
    },
    
    // ?    updateOutpatientRevenueStructureChart: function() {
        //  - 
        var outpatientRevenueStructure = [
            { name: '', value: 35 },
            { name: '', value: 30 },
            { name: '?, value: 15 },
            { name: '', value: 10 },
            { name: '', value: 10 }
        ];
        
        this.state.charts.outpatientRevenueStructureChart.setOption({
            series: [
                {
                    data: outpatientRevenueStructure
                }
            ]
        });
    },
    
    // 
    initInpatientRevenueStructureChart: function() {
        //  - 
        var inpatientRevenueStructure = [
            { name: '', value: 35 },
            { name: '', value: 25 },
            { name: '', value: 15 },
            { name: '', value: 10 },
            { name: '?, value: 10 },
            { name: '', value: 5 }
        ];
        
        var option = {
            title: {
                text: '',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c}%'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                bottom: '10%',
                data: inpatientRevenueStructure.map(function(item) { return item.name; })
            },
            series: [
                {
                    name: '',
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
                    data: inpatientRevenueStructure
                }
            ]
        };
        
        this.state.charts.inpatientRevenueStructureChart.setOption(option);
    },
    
    // ?    updateInpatientRevenueStructureChart: function() {
        //  - 
        var inpatientRevenueStructure = [
            { name: '', value: 35 },
            { name: '', value: 25 },
            { name: '', value: 15 },
            { name: '', value: 10 },
            { name: '?, value: 10 },
            { name: '', value: 5 }
        ];
        
        this.state.charts.inpatientRevenueStructureChart.setOption({
            series: [
                {
                    data: inpatientRevenueStructure
                }
            ]
        });
    },
    
    // ?    initDepartmentsRevenueRankingChart: function() {
        var option = {
            title: {
                text: '?,
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function(params) {
                    var result = params[0].name + '<br/>';
                    params.forEach(function(param) {
                        var value = DepartmentRevenuePage.formatCurrency(param.value);
                        result += param.marker + param.seriesName + ': ' + value + '<br/>';
                    });
                    return result;
                }
            },
            legend: {
                data: [''],
                bottom: 10
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                axisLabel: {
                    formatter: function(value) {
                        if (value >= 100000000) {
                            return (value / 100000000).toFixed(0) + '?;
                        } else {
                            return (value / 10000000).toFixed(1) + '';
                        }
                    }
                }
            },
            yAxis: {
                type: 'category',
                data: this.mockData.departmentRevenueComparison.map(function(item) { return item.department; }).reverse()
            },
            series: [
                {
                    name: '',
                    type: 'bar',
                    data: this.mockData.departmentRevenueComparison.map(function(item) { return item.revenue; }).reverse(),
                    itemStyle: {
                        borderRadius: [0, 4, 4, 0]
                    }
                }
            ]
        };
        
        this.state.charts.departmentsRevenueRankingChart.setOption(option);
    },
    
    // 
    updateDepartmentsRevenueRankingChart: function() {
        this.state.charts.departmentsRevenueRankingChart.setOption({
            yAxis: {
                data: this.mockData.departmentRevenueComparison.map(function(item) { return item.department; }).reverse()
            },
            series: [
                {
                    data: this.mockData.departmentRevenueComparison.map(function(item) { return item.revenue; }).reverse()
                }
            ]
        });
    },
    
    // 
    initDepartmentVsBenchmarkChart: function() {
        //  - 
        var benchmarkData = [
            { name: '?, revenue: 320000000, growthRate: 11.5, medicalServicePercentage: 38.2 },
            { name: '', revenue: 350000000, growthRate: 12.8, medicalServicePercentage: 42.0 }
        ];
        
        var option = {
            title: {
                text: '',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function(params) {
                    var result = params[0].name + '<br/>';
                    params.forEach(function(param) {
                        var value = param.seriesName === '' ? 
                            DepartmentRevenuePage.formatCurrency(param.value) : 
                            param.value + '%';
                        result += param.marker + param.seriesName + ': ' + value + '<br/>';
                    });
                    return result;
                }
            },
            legend: {
                data: ['', '?, ''],
                bottom: 10
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: benchmarkData.map(function(item) { return item.name; })
            },
            yAxis: [
                {
                    type: 'value',
                    name: '',
                    position: 'left',
                    axisLabel: {
                        formatter: function(value) {
                            if (value >= 100000000) {
                                return (value / 100000000).toFixed(0) + '?;
                            } else {
                                return (value / 10000000).toFixed(1) + '';
                            }
                        }
                    }
                },
                {
                    type: 'value',
                    name: '?,
                    position: 'right',
                    axisLabel: {
                        formatter: '{value}%'
                    }
                }
            ],
            series: [
                {
                    name: '',
                    type: 'bar',
                    data: benchmarkData.map(function(item) { return item.revenue; }),
                    itemStyle: {
                        borderRadius: [4, 4, 0, 0]
                    }
                },
                {
                    name: '?,
                    type: 'line',
                    yAxisIndex: 1,
                    data: benchmarkData.map(function(item) { return item.growthRate; }),
                    smooth: true
                },
                {
                    name: '',
                    type: 'line',
                    yAxisIndex: 1,
                    data: benchmarkData.map(function(item) { return item.medicalServicePercentage; }),
                    smooth: true
                }
            ]
        };
        
        this.state.charts.departmentVsBenchmarkChart.setOption(option);
    },
    
    // ?    updateDepartmentVsBenchmarkChart: function() {
        //  - 
        var benchmarkData = [
            { name: '?, revenue: 320000000, growthRate: 11.5, medicalServicePercentage: 38.2 },
            { name: '', revenue: 350000000, growthRate: 12.8, medicalServicePercentage: 42.0 }
        ];
        
        this.state.charts.departmentVsBenchmarkChart.setOption({
            series: [
                {
                    data: benchmarkData.map(function(item) { return item.revenue; })
                },
                {
                    data: benchmarkData.map(function(item) { return item.growthRate; })
                },
                {
                    data: benchmarkData.map(function(item) { return item.medicalServicePercentage; })
                }
            ]
        });
    },
    
    // ?    initRevenueGrowthComparisonChart: function() {
        var option = {
            title: {
                text: '',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function(params) {
                    var result = params[0].name + '<br/>';
                    params.forEach(function(param) {
                        result += param.marker + param.seriesName + ': ' + param.value + '%<br/>';
                    });
                    return result;
                }
            },
            legend: {
                data: ['?, '?],
                bottom: 10
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: this.mockData.departmentRevenueComparison.map(function(item) { return item.department; })
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value}%'
                }
            },
            series: [
                {
                    name: '?,
                    type: 'bar',
                    data: this.mockData.departmentRevenueComparison.map(function(item) { return item.yearOnYearGrowth; }),
                    itemStyle: {
                        borderRadius: [4, 4, 0, 0]
                    }
                },
                {
                    name: '?,
                    type: 'bar',
                    data: this.mockData.departmentRevenueComparison.map(function(item) { return item.monthOnMonthGrowth; }),
                    itemStyle: {
                        borderRadius: [4, 4, 0, 0]
                    }
                }
            ]
        };
        
        this.state.charts.revenueGrowthComparisonChart.setOption(option);
    },
    
    // ?    updateRevenueGrowthComparisonChart: function() {
        this.state.charts.revenueGrowthComparisonChart.setOption({
            xAxis: {
                data: this.mockData.departmentRevenueComparison.map(function(item) { return item.department; })
            },
            series: [
                {
                    data: this.mockData.departmentRevenueComparison.map(function(item) { return item.yearOnYearGrowth; })
                },
                {
                    data: this.mockData.departmentRevenueComparison.map(function(item) { return item.monthOnMonthGrowth; })
                }
            ]
        });
    },
    
    // 
    initRevenueStructureRadarChart: function() {
        // ?
        var topDepartments = this.mockData.departmentRevenueComparison.slice(0, 3);
        
        var option = {
            title: {
                text: '?,
                left: 'center'
            },
            tooltip: {},
            legend: {
                data: topDepartments.map(function(item) { return item.department; }),
                bottom: 10
            },
            radar: {
                indicator: [
                    { name: '', max: 50 },
                    { name: '', max: 50 },
                    { name: '', max: 30 }
                ]
            },
            series: [
                {
                    name: '',
                    type: 'radar',
                    data: topDepartments.map(function(item) {
                        return {
                            value: [item.medicalServicePercentage, item.drugPercentage, item.materialPercentage],
                            name: item.department
                        };
                    })
                }
            ]
        };
        
        this.state.charts.revenueStructureRadarChart.setOption(option);
    },
    
    // ?    updateRevenueStructureRadarChart: function() {
        // ?
        var topDepartments = this.mockData.departmentRevenueComparison.slice(0, 3);
        
        this.state.charts.revenueStructureRadarChart.setOption({
            legend: {
                data: topDepartments.map(function(item) { return item.department; })
            },
            series: [
                {
                    data: topDepartments.map(function(item) {
                        return {
                            value: [item.medicalServicePercentage, item.drugPercentage, item.materialPercentage],
                            name: item.department
                        };
                    })
                }
            ]
        });
    },
    
    // 
    initAverageCostPerDischargeTrendChart: function() {
        //  - 
        var monthlyAverageCostData = [
            { month: '1?, averageCost: 34800 },
            { month: '2?, averageCost: 34600 },
            { month: '3?, averageCost: 34900 },
            { month: '4?, averageCost: 35100 },
            { month: '5?, averageCost: 35200 },
            { month: '6?, averageCost: 35300 },
            { month: '7?, averageCost: 35400 },
            { month: '8?, averageCost: 35500 },
            { month: '9?, averageCost: 35550 },
            { month: '10?, averageCost: 35600 }
        ];
        
        var option = {
            title: {
                text: '?,
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                formatter: function(params) {
                    var result = params[0].name + '<br/>';
                    params.forEach(function(param) {
                        result += param.marker + param.seriesName + ': ' + param.value.toLocaleString() + '<br/>';
                    });
                    return result;
                }
            },
            legend: {
                data: ['?],
                bottom: 10
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: monthlyAverageCostData.map(function(item) { return item.month; })
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: function(value) {
                        return '' + (value / 1000).toFixed(0) + 'k';
                    }
                }
            },
            series: [
                {
                    name: '?,
                    type: 'line',
                    data: monthlyAverageCostData.map(function(item) { return item.averageCost; }),
                    smooth: true,
                    areaStyle: {
                        opacity: 0.3
                    }
                }
            ]
        };
        
        this.state.charts.averageCostPerDischargeTrendChart.setOption(option);
    },
    
    // 
    updateAverageCostPerDischargeTrendChart: function() {
        //  - 
        var monthlyAverageCostData = [
            { month: '1?, averageCost: 34800 },
            { month: '2?, averageCost: 34600 },
            { month: '3?, averageCost: 34900 },
            { month: '4?, averageCost: 35100 },
            { month: '5?, averageCost: 35200 },
            { month: '6?, averageCost: 35300 },
            { month: '7?, averageCost: 35400 },
            { month: '8?, averageCost: 35500 },
            { month: '9?, averageCost: 35550 },
            { month: '10?, averageCost: 35600 }
        ];
        
        this.state.charts.averageCostPerDischargeTrendChart.setOption({
            xAxis: {
                data: monthlyAverageCostData.map(function(item) { return item.month; })
            },
            series: [
                {
                    data: monthlyAverageCostData.map(function(item) { return item.averageCost; })
                }
            ]
        });
    },
    
    // 
    initAverageCostPerVisitTrendChart: function() {
        //  - 
        var monthlyAverageVisitCostData = [
            { month: '1?, averageCost: 260 },
            { month: '2?, averageCost: 262 },
            { month: '3?, averageCost: 261 },
            { month: '4?, averageCost: 263 },
            { month: '5?, averageCost: 262 },
            { month: '6?, averageCost: 264 },
            { month: '7?, averageCost: 263 },
            { month: '8?, averageCost: 264 },
            { month: '9?, averageCost: 265 },
            { month: '10?, averageCost: 265 }
        ];
        
        var option = {
            title: {
                text: '',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                formatter: function(params) {
                    var result = params[0].name + '<br/>';
                    params.forEach(function(param) {
                        result += param.marker + param.seriesName + ': ' + param.value + '<br/>';
                    });
                    return result;
                }
            },
            legend: {
                data: [''],
                bottom: 10
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: monthlyAverageVisitCostData.map(function(item) { return item.month; })
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value}'
                }
            },
            series: [
                {
                    name: '',
                    type: 'line',
                    data: monthlyAverageVisitCostData.map(function(item) { return item.averageCost; }),
                    smooth: true,
                    areaStyle: {
                        opacity: 0.3
                    }
                }
            ]
        };
        
        this.state.charts.averageCostPerVisitTrendChart.setOption(option);
    },
    
    // ?    updateAverageCostPerVisitTrendChart: function() {
        //  - 
        var monthlyAverageVisitCostData = [
            { month: '1?, averageCost: 260 },
            { month: '2?, averageCost: 262 },
            { month: '3?, averageCost: 261 },
            { month: '4?, averageCost: 263 },
            { month: '5?, averageCost: 262 },
            { month: '6?, averageCost: 264 },
            { month: '7?, averageCost: 263 },
            { month: '8?, averageCost: 264 },
            { month: '9?, averageCost: 265 },
            { month: '10?, averageCost: 265 }
        ];
        
        this.state.charts.averageCostPerVisitTrendChart.setOption({
            xAxis: {
                data: monthlyAverageVisitCostData.map(function(item) { return item.month; })
            },
            series: [
                {
                    data: monthlyAverageVisitCostData.map(function(item) { return item.averageCost; })
                }
            ]
        });
    },
    
    // ?    initDepartmentsAverageCostComparisonChart: function() {
        //  - 
        var departmentsAverageCostData = [
            { department: '?, averageCost: 35600 },
            { department: '', averageCost: 38200 },
            { department: '', averageCost: 41500 },
            { department: '', averageCost: 32100 },
            { department: '', averageCost: 31800 },
            { department: '', averageCost: 33200 },
            { department: '?, averageCost: 28500 },
            { department: '', averageCost: 22100 }
        ];
        
        var option = {
            title: {
                text: '?,
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function(params) {
                    var result = params[0].name + '<br/>';
                    params.forEach(function(param) {
                        result += param.marker + param.seriesName + ': ' + param.value.toLocaleString() + '<br/>';
                    });
                    return result;
                }
            },
            legend: {
                data: ['?],
                bottom: 10
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: departmentsAverageCostData.map(function(item) { return item.department; })
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: function(value) {
                        return '' + (value / 1000).toFixed(0) + 'k';
                    }
                }
            },
            series: [
                {
                    name: '?,
                    type: 'bar',
                    data: departmentsAverageCostData.map(function(item) { return item.averageCost; }),
                    itemStyle: {
                        borderRadius: [4, 4, 0, 0]
                    }
                }
            ]
        };
        
        this.state.charts.departmentsAverageCostComparisonChart.setOption(option);
    },
    
    // 
    updateDepartmentsAverageCostComparisonChart: function() {
        //  - 
        var departmentsAverageCostData = [
            { department: '?, averageCost: 35600 },
            { department: '', averageCost: 38200 },
            { department: '', averageCost: 41500 },
            { department: '', averageCost: 32100 },
            { department: '', averageCost: 31800 },
            { department: '', averageCost: 33200 },
            { department: '?, averageCost: 28500 },
            { department: '', averageCost: 22100 }
        ];
        
        this.state.charts.departmentsAverageCostComparisonChart.setOption({
            xAxis: {
                data: departmentsAverageCostData.map(function(item) { return item.department; })
            },
            series: [
                {
                    data: departmentsAverageCostData.map(function(item) { return item.averageCost; })
                }
            ]
        });
    },
    
    // 
    initAverageCostStructureChart: function() {
        //  - 
        var averageCostStructure = [
            { name: '', value: 15130, percentage: 42.5 },
            { name: '', value: 6870, percentage: 19.3 },
            { name: '?, value: 6010, percentage: 16.9 },
            { name: '', value: 4120, percentage: 11.6 },
            { name: '', value: 2800, percentage: 7.9 },
            { name: '', value: 670, percentage: 1.9 }
        ];
        
        var option = {
            title: {
                text: '',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    return params.name + ': ' + params.value.toLocaleString() + ' (' + params.percent + '%)';
                }
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                bottom: '10%',
                data: averageCostStructure.map(function(item) { return item.name; })
            },
            series: [
                {
                    name: '',
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
                    data: averageCostStructure.map(function(item) {
                        return {
                            value: item.value,
                            name: item.name
                        };
                    })
                }
            ]
        };
        
        this.state.charts.averageCostStructureChart.setOption(option);
    },
    
    // ?    updateAverageCostStructureChart: function() {
        //  - 
        var averageCostStructure = [
            { name: '', value: 15130, percentage: 42.5 },
            { name: '', value: 6870, percentage: 19.3 },
            { name: '?, value: 6010, percentage: 16.9 },
            { name: '', value: 4120, percentage: 11.6 },
            { name: '', value: 2800, percentage: 7.9 },
            { name: '', value: 670, percentage: 1.9 }
        ];
        
        this.state.charts.averageCostStructureChart.setOption({
            series: [
                {
                    data: averageCostStructure.map(function(item) {
                        return {
                            value: item.value,
                            name: item.name
                        };
                    })
                }
            ]
        });
    },
    
    // ?    initRevenueGrowthFactorsChart: function() {
        var option = {
            title: {
                text: '?,
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function(params) {
                    var result = params[0].name + '<br/>';
                    params.forEach(function(param) {
                        result += param.marker + param.seriesName + ': ' + param.value + '%<br/>';
                    });
                    return result;
                }
            },
            legend: {
                data: ['?],
                bottom: 10
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: this.mockData.revenueGrowthFactors.map(function(item) { return item.factor; })
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value}%'
                }
            },
            series: [
                {
                    name: '?,
                    type: 'bar',
                    data: this.mockData.revenueGrowthFactors.map(function(item) { return item.contribution; }),
                    itemStyle: {
                        borderRadius: [4, 4, 0, 0],
                        color: function(params) {
                            return params.value >= 0 ? '#52c41a' : '#ff4d4f';
                        }
                    }
                }
            ]
        };
        
        this.state.charts.revenueGrowthFactorsChart.setOption(option);
    },
    
    // 
    updateRevenueGrowthFactorsChart: function() {
        this.state.charts.revenueGrowthFactorsChart.setOption({
            xAxis: {
                data: this.mockData.revenueGrowthFactors.map(function(item) { return item.factor; })
            },
            series: [
                {
                    data: this.mockData.revenueGrowthFactors.map(function(item) { return item.contribution; })
                }
            ]
        });
    },
    
    // ?    initWorkloadGrowthContributionChart: function() {
        // ?- 
        var workloadGrowthContribution = [
            { name: '', contribution: 8.2 },
            { name: '', contribution: 3.5 },
            { name: '?, contribution: 2.1 },
            { name: '?, contribution: 1.2 },
            { name: '?, contribution: 0.8 }
        ];
        
        var option = {
            title: {
                text: '?,
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function(params) {
                    var result = params[0].name + '<br/>';
                    params.forEach(function(param) {
                        result += param.marker + param.seriesName + ': ' + param.value + '%<br/>';
                    });
                    return result;
                }
            },
            legend: {
                data: ['?],
                bottom: 10
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: workloadGrowthContribution.map(function(item) { return item.name; })
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value}%'
                }
            },
            series: [
                {
                    name: '?,
                    type: 'bar',
                    data: workloadGrowthContribution.map(function(item) { return item.contribution; }),
                    itemStyle: {
                        borderRadius: [4, 4, 0, 0]
                    }
                }
            ]
        };
        
        this.state.charts.workloadGrowthContributionChart.setOption(option);
    },
    
    // 
    updateWorkloadGrowthContributionChart: function() {
        // ?- 
        var workloadGrowthContribution = [
            { name: '', contribution: 8.2 },
            { name: '', contribution: 3.5 },
            { name: '?, contribution: 2.1 },
            { name: '?, contribution: 1.2 },
            { name: '?, contribution: 0.8 }
        ];
        
        this.state.charts.workloadGrowthContributionChart.setOption({
            xAxis: {
                data: workloadGrowthContribution.map(function(item) { return item.name; })
            },
            series: [
                {
                    data: workloadGrowthContribution.map(function(item) { return item.contribution; })
                }
            ]
        });
    },
    
    // 
    renderRevenueTrendTable: function() {
        var revenueTrendTableBody = document.querySelector('#revenueTrendTable tbody');
        revenueTrendTableBody.innerHTML = '';
        
        this.mockData.monthlyRevenue.forEach(function(item) {
            var row = document.createElement('tr');
            
            var growthRateClass = item.growthRate >= 0 ? 'positive' : 'negative';
            var growthRateSymbol = item.growthRate >= 0 ? '+' : '';
            
            var completionRateClass = item.completionRate >= 100 ? 'positive' : 'negative';
            
            row.innerHTML = `
                <td>${item.month}</td>
                <td>${DepartmentRevenuePage.formatCurrency(item.revenue)}</td>
                <td class="${growthRateClass}">${growthRateSymbol}${item.growthRate}%</td>
                <td>${DepartmentRevenuePage.formatCurrency(item.cumulativeRevenue)}</td>
                <td class="${growthRateClass}">${growthRateSymbol}${item.cumulativeGrowthRate}%</td>
                <td>${DepartmentRevenuePage.formatCurrency(item.target)}</td>
                <td class="${completionRateClass}">${item.completionRate}%</td>
            `;
            
            revenueTrendTableBody.appendChild(row);
        });
    },
    
    // 
    renderRevenueStructureTable: function() {
        var revenueStructureTableBody = document.querySelector('#revenueStructureTable tbody');
        revenueStructureTableBody.innerHTML = '';
        
        this.mockData.revenueStructure.forEach(function(item) {
            var row = document.createElement('tr');
            
            var growthRateClass = item.growthRate >= 0 ? 'positive' : 'negative';
            var growthRateSymbol = item.growthRate >= 0 ? '+' : '';
            
            var percentageChangeClass = item.percentageChange >= 0 ? 'positive' : 'negative';
            var percentageChangeSymbol = item.percentageChange >= 0 ? '+' : '';
            
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${DepartmentRevenuePage.formatCurrency(item.amount)}</td>
                <td>${item.percentage}%</td>
                <td>${DepartmentRevenuePage.formatCurrency(item.lastMonthAmount)}</td>
                <td>${item.lastMonthPercentage}%</td>
                <td class="${growthRateClass}">${growthRateSymbol}${item.growthRate}%</td>
                <td class="${percentageChangeClass}">${percentageChangeSymbol}${item.percentageChange}%</td>
                <td>${item.targetPercentage ? item.targetPercentage + '%' : '-'}</td>
                <td>
                    <span class="status-indicator ${item.status}">
                        ${item.status === 'good' ? '? : '?}
                    </span>
                </td>
            `;
            
            revenueStructureTableBody.appendChild(row);
        });
    },
    
    // 
    renderDepartmentRevenueComparisonTable: function() {
        var departmentRevenueComparisonTableBody = document.querySelector('#departmentRevenueComparisonTable tbody');
        departmentRevenueComparisonTableBody.innerHTML = '';
        
        this.mockData.departmentRevenueComparison.forEach(function(item) {
            var row = document.createElement('tr');
            
            var yearOnYearGrowthClass = item.yearOnYearGrowth >= 0 ? 'positive' : 'negative';
            var yearOnYearGrowthSymbol = item.yearOnYearGrowth >= 0 ? '+' : '';
            
            var monthOnMonthGrowthClass = item.monthOnMonthGrowth >= 0 ? 'positive' : 'negative';
            var monthOnMonthGrowthSymbol = item.monthOnMonthGrowth >= 0 ? '+' : '';
            
            row.innerHTML = `
                <td>${item.rank}</td>
                <td>${item.department}</td>
                <td>${DepartmentRevenuePage.formatCurrency(item.revenue)}</td>
                <td class="${yearOnYearGrowthClass}">${yearOnYearGrowthSymbol}${item.yearOnYearGrowth}%</td>
                <td class="${monthOnMonthGrowthClass}">${monthOnMonthGrowthSymbol}${item.monthOnMonthGrowth}%</td>
                <td>${item.medicalServicePercentage}%</td>
                <td>${item.drugPercentage}%</td>
                <td>${item.materialPercentage}%</td>
            `;
            
            departmentRevenueComparisonTableBody.appendChild(row);
        });
    },
    
    // 
    renderAverageCostTable: function() {
        var averageCostTableBody = document.querySelector('#averageCostTable tbody');
        averageCostTableBody.innerHTML = '';
        
        this.mockData.averageCost.forEach(function(item) {
            var row = document.createElement('tr');
            
            var monthOnMonthGrowthClass = item.monthOnMonthGrowth >= 0 ? 'positive' : 'negative';
            var monthOnMonthGrowthSymbol = item.monthOnMonthGrowth >= 0 ? '+' : '';
            
            var yearOnYearGrowthClass = item.yearOnYearGrowth >= 0 ? 'positive' : 'negative';
            var yearOnYearGrowthSymbol = item.yearOnYearGrowth >= 0 ? '+' : '';
            
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.current}</td>
                <td>${item.lastMonth}</td>
                <td class="${monthOnMonthGrowthClass}">${monthOnMonthGrowthSymbol}${item.monthOnMonthGrowth}%</td>
                <td>${item.lastYear}</td>
                <td class="${yearOnYearGrowthClass}">${yearOnYearGrowthSymbol}${item.yearOnYearGrowth}%</td>
                <td>${item.target}</td>
                <td>
                    <span class="status-indicator ${item.status}">
                        ${item.status === 'good' ? '? : '?}
                    </span>
                </td>
            `;
            
            averageCostTableBody.appendChild(row);
        });
    },
    
    // 
    renderRevenueGrowthFactorsTable: function() {
        var revenueGrowthFactorsTableBody = document.querySelector('#revenueGrowthFactorsTable tbody');
        revenueGrowthFactorsTableBody.innerHTML = '';
        
        this.mockData.revenueGrowthFactors.forEach(function(item) {
            var row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${item.factor}</td>
                <td>${item.contribution}%</td>
                <td>${item.percentage}%</td>
                <td>${item.performance}</td>
                <td>${item.analysis}</td>
            `;
            
            revenueGrowthFactorsTableBody.appendChild(row);
        });
    },
    
    // 
    renderOptimizationSuggestionsTable: function() {
        var optimizationSuggestionsTableBody = document.querySelector('#optimizationSuggestionsTable tbody');
        optimizationSuggestionsTableBody.innerHTML = '';
        
        this.mockData.optimizationSuggestions.forEach(function(item, index) {
            var row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.category}</td>
                <td>${item.problem}</td>
                <td>${item.reason}</td>
                <td>${item.suggestion}</td>
                <td>${item.responsible}</td>
                <td>${item.deadline}</td>
                <td>${item.expectedEffect}</td>
                <td>
                    <button class="btn btn-primary btn-sm"></button>
                </td>
            `;
            
            optimizationSuggestionsTableBody.appendChild(row);
        });
    }
};

// 
window.addEventListener('load', function() {
    // ECharts?    if (typeof echarts === 'undefined') {
        console.error('ECharts');
        return;
    }
    
    // ?    DepartmentRevenuePage.init();
});
