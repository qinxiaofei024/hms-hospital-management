// 科室病种管理页面逻辑
var DepartmentDiseasePage = {
    // 页面状态
    state: {
        currentDepartment: 'internal',
        diseaseType: 'all',
        dateRange: {
            start: '',
            end: ''
        },
        dataType: 'count',
        charts: {
            diseaseDistributionChart: null,
            diseaseTrendChart: null,
            diseaseCostChart: null,
            drgsChart: null,
            qualityTrendChart: null,
            riskRadarChart: null
        }
    },
    
    // 模拟数据
    mockData: {
        // 病种分布数据
        diseaseDistribution: [
            { name: '脑梗死', value: 235, percentage: 22.3 },
            { name: '肺炎', value: 325, percentage: 30.9 },
            { name: '急性心梗', value: 125, percentage: 11.9 },
            { name: '骨折', value: 165, percentage: 15.7 },
            { name: '糖尿病', value: 285, percentage: 27.0 },
            { name: '阑尾炎', value: 145, percentage: 13.8 },
            { name: '胆囊炎', value: 115, percentage: 10.9 },
            { name: '慢性肾病', value: 95, percentage: 9.0 },
            { name: '白内障', value: 215, percentage: 20.5 },
            { name: '胃肠炎', value: 325, percentage: 30.9 }
        ],
        
        // 病种趋势数据
        diseaseTrend: [
            { month: '1月', 脑梗死: 22, 肺炎: 31, 急性心梗: 10, 糖尿病: 27, 骨折: 15 },
            { month: '2月', 脑梗死: 20, 肺炎: 29, 急性心梗: 9, 糖尿病: 25, 骨折: 13 },
            { month: '3月', 脑梗死: 24, 肺炎: 33, 急性心梗: 11, 糖尿病: 29, 骨折: 16 },
            { month: '4月', 脑梗死: 25, 肺炎: 34, 急性心梗: 12, 糖尿病: 30, 骨折: 17 },
            { month: '5月', 脑梗死: 26, 肺炎: 35, 急性心梗: 12, 糖尿病: 31, 骨折: 18 },
            { month: '6月', 脑梗死: 27, 肺炎: 37, 急性心梗: 13, 糖尿病: 32, 骨折: 19 },
            { month: '7月', 脑梗死: 28, 肺炎: 38, 急性心梗: 13, 糖尿病: 33, 骨折: 19 },
            { month: '8月', 脑梗死: 29, 肺炎: 39, 急性心梗: 14, 糖尿病: 34, 骨折: 20 },
            { month: '9月', 脑梗死: 28, 肺炎: 38, 急性心梗: 14, 糖尿病: 33, 骨折: 19 },
            { month: '10月', 脑梗死: 30, 肺炎: 40, 急性心梗: 15, 糖尿病: 36, 骨折: 20 }
        ],
        
        // 病种费用数据
        diseaseCost: [
            { name: '脑梗死', count: 235, avgCost: 18500, totalCost: 4347500, drugCost: 1965000, materialCost: 978000 },
            { name: '肺炎', count: 325, avgCost: 12500, totalCost: 4062500, drugCost: 2124000, materialCost: 751000 },
            { name: '急性心梗', count: 125, avgCost: 28500, totalCost: 3562500, drugCost: 1371000, materialCost: 1169000 },
            { name: '骨折', count: 165, avgCost: 22500, totalCost: 3712500, drugCost: 1107000, materialCost: 1599000 },
            { name: '糖尿病', count: 285, avgCost: 8500, totalCost: 2422500, drugCost: 1515000, materialCost: 369000 },
            { name: '阑尾炎', count: 145, avgCost: 9800, totalCost: 1421000, drugCost: 405000, materialCost: 367000 },
            { name: '胆囊炎', count: 115, avgCost: 12800, totalCost: 1472000, drugCost: 483000, materialCost: 420000 },
            { name: '慢性肾病', count: 95, avgCost: 25500, totalCost: 2422500, drugCost: 1428000, materialCost: 545000 },
            { name: '白内障', count: 215, avgCost: 8200, totalCost: 1763000, drugCost: 397000, materialCost: 808000 },
            { name: '胃肠炎', count: 325, avgCost: 5800, totalCost: 1885000, drugCost: 863000, materialCost: 349000 }
        ],
        
        // 病种详细信息
        diseaseDetail: [
            { name: '脑梗死', count: 235, avgCost: 18500, drugRatio: 45.2, materialRatio: 22.5, avgLength: 6.8, successRate: 96.2, mortality: 2.5, yearOnYear: 2.1, riskLevel: '高风险' },
            { name: '肺炎', count: 325, avgCost: 12500, drugRatio: 52.3, materialRatio: 18.5, avgLength: 5.2, successRate: 95.5, mortality: 1.8, yearOnYear: 3.5, riskLevel: '高风险' },
            { name: '急性心梗', count: 125, avgCost: 28500, drugRatio: 38.5, materialRatio: 32.8, avgLength: 7.5, successRate: 94.8, mortality: 4.2, yearOnYear: 1.8, riskLevel: '高风险' },
            { name: '骨折', count: 165, avgCost: 22500, drugRatio: 32.5, materialRatio: 42.8, avgLength: 8.2, successRate: 98.5, mortality: 0.8, yearOnYear: 4.2, riskLevel: '中风险' },
            { name: '糖尿病', count: 285, avgCost: 8500, drugRatio: 62.5, materialRatio: 15.2, avgLength: 4.8, successRate: 97.5, mortality: 1.2, yearOnYear: 2.8, riskLevel: '中风险' },
            { name: '阑尾炎', count: 145, avgCost: 9800, drugRatio: 28.5, materialRatio: 25.8, avgLength: 4.2, successRate: 99.2, mortality: 0.5, yearOnYear: 3.1, riskLevel: '低风险' },
            { name: '胆囊炎', count: 115, avgCost: 12800, drugRatio: 32.8, materialRatio: 28.5, avgLength: 5.5, successRate: 98.8, mortality: 0.7, yearOnYear: 2.5, riskLevel: '低风险' },
            { name: '慢性肾病', count: 95, avgCost: 25500, drugRatio: 58.5, materialRatio: 22.5, avgLength: 9.2, successRate: 93.5, mortality: 3.2, yearOnYear: 2.2, riskLevel: '高风险' },
            { name: '白内障', count: 215, avgCost: 8200, drugRatio: 22.5, materialRatio: 45.8, avgLength: 3.5, successRate: 99.5, mortality: 0.3, yearOnYear: 3.8, riskLevel: '低风险' },
            { name: '胃肠炎', count: 325, avgCost: 5800, drugRatio: 45.8, materialRatio: 18.5, avgLength: 3.2, successRate: 98.2, mortality: 0.4, yearOnYear: 4.5, riskLevel: '低风险' }
        ],
        
        // DRGs分析数据
        drgsData: [
            { group: '脑梗死', count: 235, cmi: 1.35, avgCost: 18500, costIndex: 1.12, timeIndex: 1.08, mortality: 2.5, successRate: 96.2 },
            { group: '肺炎', count: 325, cmi: 1.25, avgCost: 12500, costIndex: 1.08, timeIndex: 1.05, mortality: 1.8, successRate: 95.5 },
            { group: '急性心梗', count: 125, cmi: 2.15, avgCost: 28500, costIndex: 1.15, timeIndex: 1.12, mortality: 4.2, successRate: 94.8 },
            { group: '骨折', count: 165, cmi: 1.85, avgCost: 22500, costIndex: 1.10, timeIndex: 1.15, mortality: 0.8, successRate: 98.5 },
            { group: '糖尿病', count: 285, cmi: 1.15, avgCost: 8500, costIndex: 1.05, timeIndex: 1.02, mortality: 1.2, successRate: 97.5 },
            { group: '阑尾炎', count: 145, cmi: 1.05, avgCost: 9800, costIndex: 1.02, timeIndex: 1.01, mortality: 0.5, successRate: 99.2 },
            { group: '胆囊炎', count: 115, cmi: 1.25, avgCost: 12800, costIndex: 1.04, timeIndex: 1.03, mortality: 0.7, successRate: 98.8 },
            { group: '慢性肾病', count: 95, cmi: 1.95, avgCost: 25500, costIndex: 1.18, timeIndex: 1.20, mortality: 3.2, successRate: 93.5 },
            { group: '白内障', count: 215, cmi: 1.10, avgCost: 8200, costIndex: 1.03, timeIndex: 0.98, mortality: 0.3, successRate: 99.5 },
            { group: '胃肠炎', count: 325, cmi: 0.95, avgCost: 5800, costIndex: 1.01, timeIndex: 0.95, mortality: 0.4, successRate: 98.2 }
        ],
        
        // 医疗质量数据
        qualityData: [
            { name: '脑梗死', surgerySuccess: 98.5, complication: 5.2, readmission: 8.5, infection: 3.5, rationalDrug: 92.5, avgLength: 6.8, improvement: 95.2, mortality: 2.5 },
            { name: '肺炎', surgerySuccess: 99.0, complication: 4.8, readmission: 7.2, infection: 4.2, rationalDrug: 91.2, avgLength: 5.2, improvement: 94.8, mortality: 1.8 },
            { name: '急性心梗', surgerySuccess: 96.8, complication: 7.5, readmission: 9.2, infection: 5.8, rationalDrug: 93.5, avgLength: 7.5, improvement: 93.8, mortality: 4.2 },
            { name: '骨折', surgerySuccess: 98.2, complication: 6.5, readmission: 6.8, infection: 4.5, rationalDrug: 94.8, avgLength: 8.2, improvement: 97.8, mortality: 0.8 },
            { name: '糖尿病', surgerySuccess: 99.5, complication: 3.8, readmission: 12.5, infection: 3.2, rationalDrug: 95.2, avgLength: 4.8, improvement: 96.8, mortality: 1.2 },
            { name: '阑尾炎', surgerySuccess: 99.5, complication: 2.5, readmission: 3.2, infection: 2.8, rationalDrug: 96.5, avgLength: 4.2, improvement: 98.5, mortality: 0.5 },
            { name: '胆囊炎', surgerySuccess: 99.2, complication: 3.2, readmission: 4.5, infection: 3.1, rationalDrug: 95.8, avgLength: 5.5, improvement: 98.2, mortality: 0.7 },
            { name: '慢性肾病', surgerySuccess: 97.5, complication: 8.5, readmission: 15.2, infection: 6.5, rationalDrug: 92.8, avgLength: 9.2, improvement: 92.5, mortality: 3.2 },
            { name: '白内障', surgerySuccess: 99.8, complication: 1.5, readmission: 2.5, infection: 2.2, rationalDrug: 97.2, avgLength: 3.5, improvement: 99.2, mortality: 0.3 },
            { name: '胃肠炎', surgerySuccess: 99.8, complication: 2.2, readmission: 5.8, infection: 2.5, rationalDrug: 96.8, avgLength: 3.2, improvement: 97.8, mortality: 0.4 }
        ],
        
        // 风险预警数据
        riskData: [
            { name: '脑梗死', highRiskCount: 45, mortality: 2.5, complication: 5.2, costExceed: 12.5, dayExceed: 8.5, disputeCount: 3, riskScore: 85, riskLevel: '高风险' },
            { name: '肺炎', highRiskCount: 38, mortality: 1.8, complication: 4.8, costExceed: 10.8, dayExceed: 7.2, disputeCount: 2, riskScore: 82, riskLevel: '高风险' },
            { name: '急性心梗', highRiskCount: 42, mortality: 4.2, complication: 7.5, costExceed: 15.2, dayExceed: 12.5, disputeCount: 5, riskScore: 92, riskLevel: '高风险' },
            { name: '骨折', highRiskCount: 28, mortality: 0.8, complication: 6.5, costExceed: 11.8, dayExceed: 9.2, disputeCount: 3, riskScore: 75, riskLevel: '中风险' },
            { name: '糖尿病', highRiskCount: 32, mortality: 1.2, complication: 3.8, costExceed: 8.5, dayExceed: 6.8, disputeCount: 2, riskScore: 72, riskLevel: '中风险' },
            { name: '阑尾炎', highRiskCount: 12, mortality: 0.5, complication: 2.5, costExceed: 5.2, dayExceed: 4.5, disputeCount: 1, riskScore: 60, riskLevel: '低风险' },
            { name: '胆囊炎', highRiskCount: 15, mortality: 0.7, complication: 3.2, costExceed: 6.8, dayExceed: 5.8, disputeCount: 1, riskScore: 62, riskLevel: '低风险' },
            { name: '慢性肾病', highRiskCount: 38, mortality: 3.2, complication: 8.5, costExceed: 14.5, dayExceed: 15.2, disputeCount: 4, riskScore: 88, riskLevel: '高风险' },
            { name: '白内障', highRiskCount: 10, mortality: 0.3, complication: 1.5, costExceed: 4.2, dayExceed: 3.2, disputeCount: 0, riskScore: 55, riskLevel: '低风险' },
            { name: '胃肠炎', highRiskCount: 18, mortality: 0.4, complication: 2.2, costExceed: 5.8, dayExceed: 4.8, disputeCount: 0, riskScore: 58, riskLevel: '低风险' }
        ],
        
        // 质量趋势数据
        qualityTrend: [
            { month: '1月', successRate: 96.2, complication: 4.8, infection: 3.5, rationalDrug: 92.5 },
            { month: '2月', successRate: 96.5, complication: 4.5, infection: 3.2, rationalDrug: 92.8 },
            { month: '3月', successRate: 96.8, complication: 4.2, infection: 3.0, rationalDrug: 93.2 },
            { month: '4月', successRate: 97.0, complication: 4.0, infection: 2.8, rationalDrug: 93.5 },
            { month: '5月', successRate: 97.2, complication: 3.8, infection: 2.6, rationalDrug: 93.8 },
            { month: '6月', successRate: 97.5, complication: 3.5, infection: 2.5, rationalDrug: 94.2 },
            { month: '7月', successRate: 97.8, complication: 3.2, infection: 2.4, rationalDrug: 94.5 },
            { month: '8月', successRate: 98.0, complication: 3.0, infection: 2.2, rationalDrug: 94.8 },
            { month: '9月', successRate: 98.2, complication: 2.8, infection: 2.0, rationalDrug: 95.2 },
            { month: '10月', successRate: 98.5, complication: 2.5, infection: 1.8, rationalDrug: 95.5 }
        ],
        
        // 风险雷达数据
        riskRadar: [
            { subject: '死亡率', A: 2.5, B: 1.5, fullMark: 5 },
            { subject: '并发症', A: 5.2, B: 3.2, fullMark: 10 },
            { subject: '费用超出', A: 12.5, B: 8.5, fullMark: 20 },
            { subject: '住院日超出', A: 8.5, B: 5.5, fullMark: 15 },
            { subject: '医疗纠纷', A: 3, B: 1, fullMark: 5 },
            { subject: '高风险病例', A: 45, B: 30, fullMark: 60 }
        ]
    },
    
    // 初始化页面
    init: function() {
        this.initCharts();
        this.initEventListeners();
        this.loadData();
        this.renderDiseaseDetailTable();
        this.renderDrgsTable();
        this.renderQualityTable();
        this.renderRiskTable();
    },
    
    // 初始化图表
    initCharts: function() {
        // 初始化图表实例
        this.state.charts.diseaseDistributionChart = echarts.init(document.getElementById('diseaseDistributionChart'));
        this.state.charts.diseaseTrendChart = echarts.init(document.getElementById('diseaseTrendChart'));
        this.state.charts.diseaseCostChart = echarts.init(document.getElementById('diseaseCostChart'));
        this.state.charts.drgsChart = echarts.init(document.getElementById('drgsChart'));
        this.state.charts.qualityTrendChart = echarts.init(document.getElementById('qualityTrendChart'));
        this.state.charts.riskRadarChart = echarts.init(document.getElementById('riskRadarChart'));
        
        // 设置窗口大小改变时的响应
        window.addEventListener('resize', function() {
            for (var chartKey in DepartmentDiseasePage.state.charts) {
                if (DepartmentDiseasePage.state.charts[chartKey]) {
                    DepartmentDiseasePage.state.charts[chartKey].resize();
                }
            }
        });
        
        // 初始化各图表
        this.initDiseaseDistributionChart();
        this.initDiseaseTrendChart();
        this.initDiseaseCostChart();
        this.initDrgsChart();
        this.initQualityTrendChart();
        this.initRiskRadarChart();
    },
    
    // 初始化事件监听器
    initEventListeners: function() {
        // 科室选择事件
        document.getElementById('departmentSelect').addEventListener('change', function() {
            DepartmentDiseasePage.state.currentDepartment = this.value;
            DepartmentDiseasePage.refreshData();
        });
        
        // 病种类型选择事件
        document.getElementById('diseaseTypeSelect').addEventListener('change', function() {
            DepartmentDiseasePage.state.diseaseType = this.value;
            DepartmentDiseasePage.refreshData();
        });
        
        // 日期范围选择事件
        document.getElementById('dateRangePicker').addEventListener('change', function() {
            var value = this.value.split(' - ');
            if (value.length === 2) {
                DepartmentDiseasePage.state.dateRange.start = value[0];
                DepartmentDiseasePage.state.dateRange.end = value[1];
                DepartmentDiseasePage.refreshData();
            }
        });
        
        // 数据类型选择事件
        document.getElementById('dataTypeSelect').addEventListener('change', function() {
            DepartmentDiseasePage.state.dataType = this.value;
            DepartmentDiseasePage.refreshData();
        });
        
        // 刷新按钮事件
        document.getElementById('refreshBtn').addEventListener('click', function() {
            DepartmentDiseasePage.refreshData();
        });
        
        // 导出按钮事件
        document.getElementById('exportBtn').addEventListener('click', function() {
            DepartmentDiseasePage.exportReport();
        });
        
        // 自定义报告按钮事件
        document.getElementById('customReportBtn').addEventListener('click', function() {
            DepartmentDiseasePage.customReport();
        });
        
        // 标签页切换事件
        document.querySelectorAll('.tab-btn').forEach(function(tab) {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.tab-btn').forEach(function(t) {
                    t.classList.remove('active');
                });
                document.querySelectorAll('.tab-panel').forEach(function(panel) {
                    panel.classList.remove('active');
                });
                
                this.classList.add('active');
                var tabId = this.dataset.tab;
                document.getElementById(tabId).classList.add('active');
                
                // 如果切换到DRGs分析标签，需要更新图表
                if (tabId === 'drgsAnalysis') {
                    DepartmentDiseasePage.updateDrgsChart();
                } else if (tabId === 'qualityAnalysis') {
                    DepartmentDiseasePage.updateQualityTrendChart();
                } else if (tabId === 'riskAnalysis') {
                    DepartmentDiseasePage.updateRiskRadarChart();
                }
            });
        });
    },
    
    // 加载数据
    loadData: function() {
        // 设置默认日期范围（近12个月）
        var endDate = new Date();
        var startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 11);
        
        this.state.dateRange.start = startDate.getFullYear() + '-' +
            String(startDate.getMonth() + 1).padStart(2, '0') + '-' +
            String(startDate.getDate()).padStart(2, '0');
        
        this.state.dateRange.end = endDate.getFullYear() + '-' +
            String(endDate.getMonth() + 1).padStart(2, '0') + '-' +
            String(endDate.getDate()).padStart(2, '0');
        
        // 设置日期选择器值
        document.getElementById('dateRangePicker').value = 
            this.state.dateRange.start + ' - ' + this.state.dateRange.end;
        
        // 更新所有图表
        this.updateAllCharts();
    },
    
    // 根据科室和时间筛选数据
    filterDataBySelection: function(data, keyField) {
        // 如果选择了全部科室，直接返回原数据
        if (this.state.currentDepartment === 'all') {
            return data;
        }
        
        // 根据科室筛选数据
        // 注意：这里使用模拟数据，实际项目中应该有与科室关联的数据字段
        // 为了演示，我们对不同科室返回不同的随机数据子集
        var departmentFactor = this.getDepartmentFactor();
        var filteredData = data.map(function(item) {
            var newItem = JSON.parse(JSON.stringify(item));
            
            // 对数值字段应用科室因子进行模拟
            Object.keys(newItem).forEach(function(key) {
                if (typeof newItem[key] === 'number' && key !== keyField) {
                    newItem[key] = Math.round(newItem[key] * departmentFactor);
                }
            });
            
            return newItem;
        });
        
        return filteredData;
    },
    
    // 获取科室相关的因子
    getDepartmentFactor: function() {
        var factors = {
            'internal': 1.0,
            'surgery': 0.8,
            'pediatrics': 0.6,
            'gynecology': 0.7,
            'neurology': 1.2,
            'cardiology': 1.1,
            'orthopedics': 0.9,
            'ophthalmology': 0.5,
            'dermatology': 0.4,
            'ent': 0.5
        };
        
        return factors[this.state.currentDepartment] || 1.0;
    },
    
    // 刷新数据
    refreshData: function() {
        // 显示加载状态
        this.showLoading(true);
        
        // 模拟数据加载延迟
        setTimeout(function() {
            // 更新所有图表
            DepartmentDiseasePage.updateAllCharts();
            
            // 更新表格数据
            DepartmentDiseasePage.renderDiseaseDetailTable();
            DepartmentDiseasePage.renderDrgsTable();
            DepartmentDiseasePage.renderQualityTable();
            DepartmentDiseasePage.renderRiskTable();
            
            // 隐藏加载状态
            DepartmentDiseasePage.showLoading(false);
        }, 500);
    },
    
    // 显示/隐藏加载状态
    showLoading: function(show) {
        var loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = show ? 'flex' : 'none';
        }
    },
    
    // 渲染病种详细信息表格
    renderDiseaseDetailTable: function() {
        var tableBody = document.getElementById('diseaseDetailTable');
        if (!tableBody) return;
        
        // 清空表格
        while (tableBody.firstChild) {
            tableBody.removeChild(tableBody.firstChild);
        }
        
        // 根据科室筛选数据
        var filteredData = this.filterDataBySelection(this.mockData.diseaseDetail, 'name');
        
        // 遍历数据并添加行
        filteredData.forEach(function(diseaseData) {
            var row = document.createElement('tr');
            
            // 根据病种类型筛选
            if (DepartmentDiseasePage.state.diseaseType !== 'all') {
                if ((DepartmentDiseasePage.state.diseaseType === 'high' && diseaseData.count < 200) ||
                    (DepartmentDiseasePage.state.diseaseType === 'critical' && diseaseData.riskLevel !== '高风险') ||
                    (DepartmentDiseasePage.state.diseaseType === 'specialty' && !['脑梗死', '急性心梗', '慢性肾病'].includes(diseaseData.name)) ||
                    (DepartmentDiseasePage.state.diseaseType === 'chronic' && !['糖尿病', '慢性肾病'].includes(diseaseData.name))) {
                    return;
                }
            }
            
            // 设置风险等级样式
            var riskClass = '';
            switch (diseaseData.riskLevel) {
                case '高风险':
                    riskClass = 'status-badge status-high';
                    break;
                case '中风险':
                    riskClass = 'status-badge status-medium';
                    break;
                case '低风险':
                    riskClass = 'status-badge status-low';
                    break;
            }
            
            row.innerHTML = `
                <td>${diseaseData.name}</td>
                <td>${diseaseData.count}</td>
                <td>${DepartmentDiseasePage.formatCurrency(diseaseData.avgCost)}</td>
                <td>${diseaseData.drugRatio.toFixed(1)}</td>
                <td>${diseaseData.materialRatio.toFixed(1)}</td>
                <td>${diseaseData.avgLength.toFixed(1)}</td>
                <td>${diseaseData.successRate.toFixed(1)}</td>
                <td class="negative">${diseaseData.mortality.toFixed(1)}</td>
                <td class="${diseaseData.yearOnYear >= 0 ? 'positive' : 'negative'}">
                    ${diseaseData.yearOnYear >= 0 ? '+' : ''}${diseaseData.yearOnYear.toFixed(1)}
                </td>
                <td><span class="${riskClass}">${diseaseData.riskLevel}</span></td>
            `;
            
            tableBody.appendChild(row);
        });
    },
    
    // 渲染DRGs分析表格
    renderDrgsTable: function() {
        var tableBody = document.getElementById('drgsTable');
        if (!tableBody) return;
        
        // 清空表格
        while (tableBody.firstChild) {
            tableBody.removeChild(tableBody.firstChild);
        }
        
        // 根据科室筛选数据
        var filteredData = this.filterDataBySelection(this.mockData.drgsData, 'group');
        
        // 遍历数据并添加行
        filteredData.forEach(function(drgsData) {
            var row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${drgsData.group}</td>
                <td>${drgsData.count}</td>
                <td>${drgsData.cmi.toFixed(2)}</td>
                <td>${DepartmentDiseasePage.formatCurrency(drgsData.avgCost)}</td>
                <td class="${drgsData.costIndex > 1.1 ? 'negative' : drgsData.costIndex >= 1 ? 'warning' : 'positive'}">
                    ${drgsData.costIndex.toFixed(2)}
                </td>
                <td class="${drgsData.timeIndex > 1.1 ? 'negative' : drgsData.timeIndex >= 1 ? 'warning' : 'positive'}">
                    ${drgsData.timeIndex.toFixed(2)}
                </td>
                <td class="negative">${drgsData.mortality.toFixed(1)}</td>
                <td class="positive">${drgsData.successRate.toFixed(1)}</td>
            `;
            
            tableBody.appendChild(row);
        });
    },
    
    // 渲染医疗质量分析表格
    renderQualityTable: function() {
        var tableBody = document.getElementById('qualityTable');
        if (!tableBody) return;
        
        // 清空表格
        while (tableBody.firstChild) {
            tableBody.removeChild(tableBody.firstChild);
        }
        
        // 根据科室筛选数据
        var filteredData = this.filterDataBySelection(this.mockData.qualityData, 'name');
        
        // 遍历数据并添加行
        filteredData.forEach(function(qualityData) {
            var row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${qualityData.name}</td>
                <td class="positive">${qualityData.surgerySuccess.toFixed(1)}</td>
                <td class="negative">${qualityData.complication.toFixed(1)}</td>
                <td class="negative">${qualityData.readmission.toFixed(1)}</td>
                <td class="negative">${qualityData.infection.toFixed(1)}</td>
                <td class="positive">${qualityData.rationalDrug.toFixed(1)}</td>
                <td>${qualityData.avgLength.toFixed(1)}</td>
                <td class="positive">${qualityData.improvement.toFixed(1)}</td>
                <td class="negative">${qualityData.mortality.toFixed(1)}</td>
            `;
            
            tableBody.appendChild(row);
        });
    },

    // 渲染质量指标表格
    renderQualityTable: function() {
        var tableBody = document.getElementById('qualityTable');
        if (!tableBody) return;
        
        // 清空表格
        while (tableBody.firstChild) {
            tableBody.removeChild(tableBody.firstChild);
        }
        
        // 遍历数据并添加行
        this.mockData.qualityData.forEach(function(qualityData) {
            var row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${qualityData.name}</td>
                <td class="positive">${qualityData.surgerySuccess.toFixed(1)}</td>
                <td class="negative">${qualityData.complication.toFixed(1)}</td>
                <td class="negative">${qualityData.readmission.toFixed(1)}</td>
                <td class="negative">${qualityData.infection.toFixed(1)}</td>
                <td class="positive">${qualityData.rationalDrug.toFixed(1)}</td>
                <td>${qualityData.avgLength.toFixed(1)}</td>
                <td class="positive">${qualityData.improvement.toFixed(1)}</td>
                <td class="negative">${qualityData.mortality.toFixed(1)}</td>
            `;
            
            tableBody.appendChild(row);
        });
    },
    
    // 渲染风险预警分析表格
    renderRiskTable: function() {
        var tableBody = document.getElementById('riskTable');
        if (!tableBody) return;
        
        // 清空表格
        while (tableBody.firstChild) {
            tableBody.removeChild(tableBody.firstChild);
        }
        
        // 根据科室筛选数据
        var filteredData = this.filterDataBySelection(this.mockData.riskData, 'name');
        
        // 遍历数据并添加行
        filteredData.forEach(function(riskData) {
            var row = document.createElement('tr');
            
            // 设置风险等级样式
            var riskClass = '';
            switch (riskData.riskLevel) {
                case '高风险':
                    riskClass = 'status-badge status-high';
                    break;
                case '中风险':
                    riskClass = 'status-badge status-medium';
                    break;
                case '低风险':
                    riskClass = 'status-badge status-low';
                    break;
            }
            
            row.innerHTML = `
                <td>${riskData.name}</td>
                <td>${riskData.highRiskCount}</td>
                <td class="negative">${riskData.mortality.toFixed(1)}</td>
                <td class="negative">${riskData.complication.toFixed(1)}</td>
                <td class="negative">${riskData.costExceed.toFixed(1)}</td>
                <td class="negative">${riskData.dayExceed.toFixed(1)}</td>
                <td>${riskData.disputeCount}</td>
                <td class="${riskData.riskScore > 80 ? 'negative' : riskData.riskScore >= 60 ? 'warning' : 'positive'}">
                    ${riskData.riskScore}
                </td>
                <td><span class="${riskClass}">${riskData.riskLevel}</span></td>
            `;
            
            tableBody.appendChild(row);
        });
    },
    
    // 更新所有图表
    updateAllCharts: function() {
        this.updateDiseaseDistributionChart();
        this.updateDiseaseTrendChart();
        this.updateDiseaseCostChart();
        this.updateDrgsChart();
        this.updateQualityTrendChart();
        this.updateRiskRadarChart();
    },
    
    // 初始化病种分布图
    initDiseaseDistributionChart: function() {
        var option = {
            title: {
                text: '病种分布分析',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    return params.seriesName + '<br/>' + params.name + ': ' + 
                        params.value + ' 例 (' + params.percent + '%)';
                }
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                bottom: 10
            },
            series: [
                {
                    name: '病种分布',
                    type: 'pie',
                    radius: '60%',
                    center: ['50%', '45%'],
                    data: this.mockData.diseaseDistribution,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    label: {
                        formatter: function(params) {
                            return params.name + ': ' + params.percent + '%';
                        }
                    }
                }
            ]
        };
        
        this.state.charts.diseaseDistributionChart.setOption(option);
    },
    
    // 更新病种分布图
    updateDiseaseDistributionChart: function() {
        // 根据病种类型筛选数据
        var filteredData = this.mockData.diseaseDistribution;
        
        if (this.state.diseaseType !== 'all') {
            filteredData = filteredData.filter(function(item) {
                if (DepartmentDiseasePage.state.diseaseType === 'high') {
                    return item.value >= 200;
                } else if (DepartmentDiseasePage.state.diseaseType === 'critical') {
                    return ['脑梗死', '肺炎', '急性心梗', '慢性肾病'].includes(item.name);
                } else if (DepartmentDiseasePage.state.diseaseType === 'specialty') {
                    return ['脑梗死', '急性心梗', '慢性肾病'].includes(item.name);
                } else if (DepartmentDiseasePage.state.diseaseType === 'chronic') {
                    return ['糖尿病', '慢性肾病'].includes(item.name);
                }
                return true;
            });
        }
        
        // 根据科室筛选数据
        filteredData = this.filterDataBySelection(filteredData, 'name');
        
        // 更新图表数据
        this.state.charts.diseaseDistributionChart.setOption({
            series: [
                {
                    data: filteredData
                }
            ]
        });
    },
    
    // 初始化病种趋势图
    initDiseaseTrendChart: function() {
        var option = {
            title: {
                text: '病种趋势分析',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['脑梗死', '肺炎', '急性心梗', '糖尿病', '骨折'],
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
                data: this.mockData.diseaseTrend.map(function(item) { return item.month; })
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '脑梗死',
                    type: 'line',
                    data: this.mockData.diseaseTrend.map(function(item) { return item.脑梗死; }),
                    smooth: true
                },
                {
                    name: '肺炎',
                    type: 'line',
                    data: this.mockData.diseaseTrend.map(function(item) { return item.肺炎; }),
                    smooth: true
                },
                {
                    name: '急性心梗',
                    type: 'line',
                    data: this.mockData.diseaseTrend.map(function(item) { return item.急性心梗; }),
                    smooth: true
                },
                {
                    name: '糖尿病',
                    type: 'line',
                    data: this.mockData.diseaseTrend.map(function(item) { return item.糖尿病; }),
                    smooth: true
                },
                {
                    name: '骨折',
                    type: 'line',
                    data: this.mockData.diseaseTrend.map(function(item) { return item.骨折; }),
                    smooth: true
                }
            ]
        };
        
        this.state.charts.diseaseTrendChart.setOption(option);
    },
    
    // 更新病种趋势图
    updateDiseaseTrendChart: function() {
        // 根据病种类型筛选数据
        var legendData = ['脑梗死', '肺炎', '急性心梗', '糖尿病', '骨折'];
        var seriesData = this.mockData.diseaseTrend;
        
        if (this.state.diseaseType !== 'all') {
            if (this.state.diseaseType === 'high') {
                legendData = ['脑梗死', '肺炎', '糖尿病', '骨折'];
            } else if (this.state.diseaseType === 'critical') {
                legendData = ['脑梗死', '肺炎', '急性心梗'];
            } else if (this.state.diseaseType === 'specialty') {
                legendData = ['脑梗死', '急性心梗'];
            } else if (this.state.diseaseType === 'chronic') {
                legendData = ['糖尿病'];
            }
        }
        
        // 构建series数组
        var series = legendData.map(function(diseaseName) {
            return {
                name: diseaseName,
                type: 'line',
                data: seriesData.map(function(item) { return item[diseaseName]; }),
                smooth: true
            };
        });
        
        // 更新图表数据
        this.state.charts.diseaseTrendChart.setOption({
            legend: {
                data: legendData
            },
            series: series
        });
    },
    
    // 初始化病种费用图
    initDiseaseCostChart: function() {
        var option = {
            title: {
                text: '病种费用分析',
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
                        if (param.seriesName === '例均费用') {
                            result += param.marker + param.seriesName + ': ¥' + param.value.toFixed(0) + '<br/>';
                        } else if (param.seriesName === '病例数') {
                            result += param.marker + param.seriesName + ': ' + param.value + '<br/>';
                        } else {
                            result += param.marker + param.seriesName + ': ' + param.value.toFixed(1) + '%<br/>';
                        }
                    });
                    return result;
                }
            },
            legend: {
                data: ['病例数', '例均费用', '药占比', '材占比'],
                bottom: 10
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '20%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: this.mockData.diseaseCost.map(function(item) { return item.name; }),
                axisLabel: {
                    interval: 0,
                    rotate: 30
                }
            },
            yAxis: [
                {
                    type: 'value',
                    name: '病例数',
                    position: 'left'
                },
                {
                    type: 'value',
                    name: '比率(%)',
                    position: 'right',
                    max: 70,
                    axisLabel: {
                        formatter: '{value}%'
                    }
                },
                {
                    type: 'value',
                    name: '费用(元)',
                    position: 'right',
                    show: false
                }
            ],
            series: [
                {
                    name: '病例数',
                    type: 'bar',
                    data: this.mockData.diseaseCost.map(function(item) { return item.count; })
                },
                {
                    name: '例均费用',
                    type: 'line',
                    yAxisIndex: 2,
                    data: this.mockData.diseaseCost.map(function(item) { return item.avgCost; }),
                    smooth: true,
                    lineStyle: {
                        width: 3
                    },
                    itemStyle: {
                        color: '#ff4d4f'
                    },
                    symbolSize: 10
                },
                {
                    name: '药占比',
                    type: 'line',
                    yAxisIndex: 1,
                    data: this.mockData.diseaseCost.map(function(item) { return item.drugCost / item.totalCost * 100; }),
                    smooth: true
                },
                {
                    name: '材占比',
                    type: 'line',
                    yAxisIndex: 1,
                    data: this.mockData.diseaseCost.map(function(item) { return item.materialCost / item.totalCost * 100; }),
                    smooth: true
                }
            ]
        };
        
        this.state.charts.diseaseCostChart.setOption(option);
    },
    
    // 更新病种费用图
    updateDiseaseCostChart: function() {
        // 根据病种类型筛选数据
        var filteredData = this.mockData.diseaseCost;
        
        if (this.state.diseaseType !== 'all') {
            filteredData = filteredData.filter(function(item) {
                if (DepartmentDiseasePage.state.diseaseType === 'high') {
                    return item.count >= 200;
                } else if (DepartmentDiseasePage.state.diseaseType === 'critical') {
                    return ['脑梗死', '肺炎', '急性心梗', '慢性肾病'].includes(item.name);
                } else if (DepartmentDiseasePage.state.diseaseType === 'specialty') {
                    return ['脑梗死', '急性心梗', '慢性肾病'].includes(item.name);
                } else if (DepartmentDiseasePage.state.diseaseType === 'chronic') {
                    return ['糖尿病', '慢性肾病'].includes(item.name);
                }
                return true;
            });
        }
        
        // 根据科室筛选数据
        filteredData = this.filterDataBySelection(filteredData, 'name');
        
        // 重新计算药占比和材占比
        filteredData = filteredData.map(function(item) {
            var newItem = JSON.parse(JSON.stringify(item));
            newItem.totalCost = item.count * item.avgCost;
            return newItem;
        });
        
        // 更新图表数据
        this.state.charts.diseaseCostChart.setOption({
            xAxis: {
                data: filteredData.map(function(item) { return item.name; })
            },
            series: [
                {
                    data: filteredData.map(function(item) { return item.count; })
                },
                {
                    data: filteredData.map(function(item) { return item.avgCost; })
                },
                {
                    data: filteredData.map(function(item) { return item.drugCost / item.totalCost * 100; })
                },
                {
                    data: filteredData.map(function(item) { return item.materialCost / item.totalCost * 100; })
                }
            ]
        });
    },
    
    // 初始化DRGs图表
    initDrgsChart: function() {
        var option = {
            title: {
                text: 'DRGs分析',
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
                        if (param.seriesName === 'CMI值') {
                            result += param.marker + param.seriesName + ': ' + param.value.toFixed(2) + '<br/>';
                        } else if (param.seriesName === '费用指数' || param.seriesName === '时间指数') {
                            result += param.marker + param.seriesName + ': ' + param.value.toFixed(2) + '<br/>';
                        } else {
                            result += param.marker + param.seriesName + ': ' + param.value + '<br/>';
                        }
                    });
                    return result;
                }
            },
            legend: {
                data: ['病例数', 'CMI值', '费用指数', '时间指数'],
                bottom: 10
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '20%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: this.mockData.drgsData.map(function(item) { return item.group; }),
                axisLabel: {
                    interval: 0,
                    rotate: 30
                }
            },
            yAxis: [
                {
                    type: 'value',
                    name: '病例数',
                    position: 'left'
                },
                {
                    type: 'value',
                    name: '指数/CMI',
                    position: 'right',
                    max: 2.5
                }
            ],
            series: [
                {
                    name: '病例数',
                    type: 'bar',
                    data: this.mockData.drgsData.map(function(item) { return item.count; })
                },
                {
                    name: 'CMI值',
                    type: 'line',
                    yAxisIndex: 1,
                    data: this.mockData.drgsData.map(function(item) { return item.cmi; }),
                    smooth: true,
                    lineStyle: {
                        width: 3
                    },
                    itemStyle: {
                        color: '#1890ff'
                    },
                    symbolSize: 10
                },
                {
                    name: '费用指数',
                    type: 'line',
                    yAxisIndex: 1,
                    data: this.mockData.drgsData.map(function(item) { return item.costIndex; }),
                    smooth: true
                },
                {
                    name: '时间指数',
                    type: 'line',
                    yAxisIndex: 1,
                    data: this.mockData.drgsData.map(function(item) { return item.timeIndex; }),
                    smooth: true
                }
            ]
        };
        
        this.state.charts.drgsChart.setOption(option);
    },
    
    // 更新DRGs图表
    updateDrgsChart: function() {
        // 根据病种类型筛选数据
        var filteredData = this.mockData.drgsData;
        
        if (this.state.diseaseType !== 'all') {
            filteredData = filteredData.filter(function(item) {
                if (DepartmentDiseasePage.state.diseaseType === 'high') {
                    return item.count >= 200;
                } else if (DepartmentDiseasePage.state.diseaseType === 'critical') {
                    return ['脑梗死', '肺炎', '急性心梗', '慢性肾病'].includes(item.group);
                } else if (DepartmentDiseasePage.state.diseaseType === 'specialty') {
                    return ['脑梗死', '急性心梗', '慢性肾病'].includes(item.group);
                } else if (DepartmentDiseasePage.state.diseaseType === 'chronic') {
                    return ['糖尿病', '慢性肾病'].includes(item.group);
                }
                return true;
            });
        }
        
        // 根据科室筛选数据
        filteredData = this.filterDataBySelection(filteredData, 'group');
        
        // 更新图表数据
        this.state.charts.drgsChart.setOption({
            xAxis: {
                data: filteredData.map(function(item) { return item.group; })
            },
            series: [
                {
                    data: filteredData.map(function(item) { return item.count; })
                },
                {
                    data: filteredData.map(function(item) { return item.cmi; })
                },
                {
                    data: filteredData.map(function(item) { return item.costIndex; })
                },
                {
                    data: filteredData.map(function(item) { return item.timeIndex; })
                }
            ]
        });
    },
    
    // 初始化质量趋势图
    initQualityTrendChart: function() {
        var departmentFactor = this.getDepartmentFactor();
        var adjustedQualityTrend = this.mockData.qualityTrend.map(function(item) {
            var newItem = JSON.parse(JSON.stringify(item));
            // 根据科室调整质量数据
            newItem.successRate = Math.min(100, item.successRate * departmentFactor);
            newItem.complication = Math.max(0, item.complication * (2 - departmentFactor));
            newItem.infection = Math.max(0, item.infection * (2 - departmentFactor));
            newItem.rationalDrug = Math.min(100, item.rationalDrug * departmentFactor);
            return newItem;
        });
        
        var option = {
            title: {
                text: '医疗质量趋势分析',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['治疗有效率', '并发症发生率', '院内感染率', '合理用药率'],
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
                data: adjustedQualityTrend.map(function(item) { return item.month; })
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value}%'
                }
            },
            series: [
                {
                    name: '治疗有效率',
                    type: 'line',
                    data: adjustedQualityTrend.map(function(item) { return item.successRate; }),
                    smooth: true,
                    lineStyle: {
                        width: 3
                    },
                    itemStyle: {
                        color: '#52c41a'
                    }
                },
                {
                    name: '并发症发生率',
                    type: 'line',
                    data: adjustedQualityTrend.map(function(item) { return item.complication; }),
                    smooth: true,
                    lineStyle: {
                        width: 3
                    },
                    itemStyle: {
                        color: '#ff4d4f'
                    }
                },
                {
                    name: '院内感染率',
                    type: 'line',
                    data: this.mockData.qualityTrend.map(function(item) { return item.infection; }),
                    smooth: true,
                    lineStyle: {
                        width: 3
                    },
                    itemStyle: {
                        color: '#faad14'
                    }
                },
                {
                    name: '合理用药率',
                    type: 'line',
                    data: this.mockData.qualityTrend.map(function(item) { return item.rationalDrug; }),
                    smooth: true,
                    lineStyle: {
                        width: 3
                    },
                    itemStyle: {
                        color: '#1890ff'
                    }
                }
            ]
        };
        
        this.state.charts.qualityTrendChart.setOption(option);
    },
    
    // 更新质量趋势图
    updateQualityTrendChart: function() {
        var departmentFactor = this.getDepartmentFactor();
        var adjustedQualityTrend = this.mockData.qualityTrend.map(function(item) {
            var newItem = JSON.parse(JSON.stringify(item));
            // 根据科室调整质量数据
            newItem.successRate = Math.min(100, item.successRate * departmentFactor);
            newItem.complication = Math.max(0, item.complication * (2 - departmentFactor));
            newItem.infection = Math.max(0, item.infection * (2 - departmentFactor));
            newItem.rationalDrug = Math.min(100, item.rationalDrug * departmentFactor);
            return newItem;
        });
        
        this.state.charts.qualityTrendChart.setOption({
            series: [
                {
                    data: adjustedQualityTrend.map(function(item) { return item.successRate; })
                },
                {
                    data: adjustedQualityTrend.map(function(item) { return item.complication; })
                },
                {
                    data: adjustedQualityTrend.map(function(item) { return item.infection; })
                },
                {
                    data: adjustedQualityTrend.map(function(item) { return item.rationalDrug; })
                }
            ]
        });
    },
    
    // 初始化风险雷达图
    initRiskRadarChart: function() {
        var departmentFactor = this.getDepartmentFactor();
        var adjustedRiskRadar = this.mockData.riskRadar.map(function(item) {
            var newItem = JSON.parse(JSON.stringify(item));
            // 根据科室调整风险数据
            newItem.A = item.A * (2 - departmentFactor); // 科室因子越低，风险越高
            return newItem;
        });
        
        var option = {
            title: {
                text: '病种风险雷达图',
                left: 'center'
            },
            tooltip: {},
            legend: {
                data: ['当前科室', '医院平均'],
                bottom: 10
            },
            radar: {
                indicator: adjustedRiskRadar,
                shape: 'circle',
                splitNumber: 4,
                axisName: {
                    color: '#666'
                },
                splitLine: {
                    lineStyle: {
                        color: ['#ddd', '#ddd', '#ddd', '#ddd']
                    }
                },
                splitArea: {
                    show: true,
                    areaStyle: {
                        color: ['#fff', '#f9f9f9', '#f5f5f5', '#f0f0f0']
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#ddd'
                    }
                }
            },
            series: [
                {
                    name: '风险对比',
                    type: 'radar',
                    data: [
                        {
                            value: adjustedRiskRadar.map(function(item) { return item.A; }),
                            name: '当前科室',
                            areaStyle: {
                                color: 'rgba(24, 144, 255, 0.3)'
                            },
                            lineStyle: {
                                color: '#1890ff'
                            }
                        },
                        {
                            value: this.mockData.riskRadar.map(function(item) { return item.B; }),
                            name: '医院平均',
                            areaStyle: {
                                color: 'rgba(255, 77, 79, 0.3)'
                            },
                            lineStyle: {
                                color: '#ff4d4f'
                            }
                        }
                    ]
                }
            ]
        };
        
        this.state.charts.riskRadarChart.setOption(option);
    },
    
    // 更新风险雷达图
    updateRiskRadarChart: function() {
        var departmentFactor = this.getDepartmentFactor();
        var adjustedRiskRadar = this.mockData.riskRadar.map(function(item) {
            var newItem = JSON.parse(JSON.stringify(item));
            // 根据科室调整风险数据
            newItem.A = item.A * (2 - departmentFactor); // 科室因子越低，风险越高
            return newItem;
        });
        
        this.state.charts.riskRadarChart.setOption({
            radar: {
                indicator: adjustedRiskRadar
            },
            series: [
                {
                    data: [
                        {
                            value: adjustedRiskRadar.map(function(item) { return item.A; }),
                            name: '当前科室'
                        },
                        {
                            value: this.mockData.riskRadar.map(function(item) { return item.B; }),
                            name: '医院平均'
                        }
                    ]
                }
            ]
        });
    },
    
    // 导出报告
    exportReport: function() {
        alert('科室病种管理报告导出功能已触发，实际项目中会生成并下载PDF或Excel报告');
        // 实际项目中，这里会调用后端API生成报告并下载
    },
    
    // 自定义报告
    customReport: function() {
        alert('自定义报告功能已触发，实际项目中会弹出自定义报告配置对话框');
        // 实际项目中，这里会弹出自定义报告配置对话框
    },
    
    // 格式化货币
    formatCurrency: function(value) {
        if (typeof value !== 'number') return value;
        
        return '¥' + value.toLocaleString();
    },
    
    // 获取科室名称
    getDepartmentName: function(deptCode) {
        var deptMap = {
            'all': '全部科室',
            'internal': '内科',
            'surgery': '外科',
            'pediatrics': '儿科',
            'gynecology': '妇产科',
            'neurology': '神经内科',
            'cardiology': '心内科',
            'orthopedics': '骨科',
            'ophthalmology': '眼科',
            'dermatology': '皮肤科',
            'ent': '耳鼻喉科'
        };
        
        return deptMap[deptCode] || deptCode;
    }
};

// 患者明细弹窗功能
var PatientModal = {
    // 临床路径名称映射函数 - 根据医学逻辑生成路径名称
    getPathwayName: function(diagnosis, age, severity, comorbidities) {
        var pathwayMap = {
            '肺炎': {
                base: '社区获得性肺炎临床路径',
                elderly: '老年人社区获得性肺炎临床路径',
                severe: '重症社区获得性肺炎临床路径',
                adult: '成人社区获得性肺炎临床路径',
                pediatric: '儿童社区获得性肺炎临床路径'
            },
            '糖尿病': {
                base: '2型糖尿病临床路径',
                elderly: '老年2型糖尿病临床路径',
                severe: '糖尿病酮症酸中毒临床路径',
                adult: '成人2型糖尿病临床路径',
                pediatric: '1型糖尿病临床路径'
            },
            '急性心梗': {
                base: 'ST段抬高型心肌梗死临床路径',
                elderly: '老年急性心肌梗死临床路径',
                severe: '急性心肌梗死合并心源性休克临床路径',
                adult: '急性心肌梗死临床路径',
                pediatric: '儿童心肌炎临床路径'
            },
            '胆囊炎': {
                base: '急性胆囊炎临床路径',
                elderly: '老年急性胆囊炎临床路径',
                severe: '急性重症胆囊炎临床路径',
                adult: '腹腔镜胆囊切除术临床路径',
                pediatric: '儿童胆囊炎临床路径'
            }
        };
        
        var diseasePathways = pathwayMap[diagnosis];
        if (!diseasePathways) {
            return diagnosis + '临床路径';
        }
        
        // 根据年龄和严重程度选择合适的路径
        if (severity === '重度' || severity === '危重') {
            return diseasePathways.severe;
        } else if (age >= 65) {
            return diseasePathways.elderly;
        } else if (age >= 18) {
            return diseasePathways.adult;
        } else {
            return diseasePathways.pediatric;
        }
    },
    
    // 生成路径编码
    generatePathwayCode: function(pathwayName, year) {
        var codeMap = {
            '社区获得性肺炎临床路径': 'CAP',
            '老年人社区获得性肺炎临床路径': 'ECAP',
            '重症社区获得性肺炎临床路径': 'SCAP',
            '成人社区获得性肺炎临床路径': 'ACAP',
            '2型糖尿病临床路径': 'T2DM',
            '老年2型糖尿病临床路径': 'ET2DM',
            'ST段抬高型心肌梗死临床路径': 'STEMI',
            '急性胆囊炎临床路径': 'AC'
        };
        
        var baseCode = codeMap[pathwayName] || 'CP';
        return baseCode + '-' + (year || '2023');
    },
    // 模拟患者数据
    patientData: [
        {
            id: 'P001',
            name: '张三',
            gender: '男',
            age: 65,
            admissionDate: '2023-10-15',
            dischargeDate: '2023-10-22',
            days: 7,
            pathwayStatus: 'in',
            pathwayTime: '2023-10-15 14:30',
            completion: '已完成',
            cost: 12500,
            diagnosis: '肺炎',
            pathwayName: '社区获得性肺炎临床路径',
            pathwayCode: 'CAP-2023',
            icdCode: 'J18.901',
            severity: '中度',
            secondaryDiagnosis: '高血压、糖尿病',
            pathwayVersion: 'V2.1'
        },
        {
            id: 'P002',
            name: '李四',
            gender: '女',
            age: 58,
            admissionDate: '2023-10-16',
            dischargeDate: '2023-10-24',
            days: 8,
            pathwayStatus: 'out',
            pathwayTime: '2023-10-24 10:15',
            completion: '已完成',
            cost: 11800,
            diagnosis: '肺炎',
            pathwayName: '老年人社区获得性肺炎临床路径',
            pathwayCode: 'ECAP-2023',
            icdCode: 'J18.901',
            severity: '轻中度',
            secondaryDiagnosis: '慢性阻塞性肺疾病',
            pathwayVersion: 'V2.1'
        },
        {
            id: 'P003',
            name: '王五',
            gender: '男',
            age: 72,
            admissionDate: '2023-10-17',
            dischargeDate: '2023-10-26',
            days: 9,
            pathwayStatus: 'variance',
            pathwayTime: '2023-10-17 16:45',
            completion: '变异',
            cost: 15200,
            diagnosis: '肺炎',
            pathwayName: '重症社区获得性肺炎临床路径',
            pathwayCode: 'SCAP-2023',
            icdCode: 'J18.901',
            severity: '重度',
            secondaryDiagnosis: '心力衰竭、肾功能不全',
            pathwayVersion: 'V2.1'
        },
        {
            id: 'P004',
            name: '赵六',
            gender: '女',
            age: 45,
            admissionDate: '2023-10-18',
            dischargeDate: '2023-10-25',
            days: 7,
            pathwayStatus: 'in',
            pathwayTime: '2023-10-18 09:20',
            completion: '进行中',
            cost: 9800,
            diagnosis: '肺炎',
            pathwayName: '成人社区获得性肺炎临床路径',
            pathwayCode: 'ACAP-2023',
            icdCode: 'J18.901',
            severity: '轻度',
            secondaryDiagnosis: '无',
            pathwayVersion: 'V2.1'
        },
        {
            id: 'P005',
            name: '钱七',
            gender: '男',
            age: 68,
            admissionDate: '2023-10-19',
            dischargeDate: '2023-10-27',
            days: 8,
            pathwayStatus: 'out',
            pathwayTime: '2023-10-27 11:30',
            completion: '已完成',
            cost: 13200,
            diagnosis: '肺炎',
            pathwayName: '老年人社区获得性肺炎临床路径',
            pathwayCode: 'ECAP-2023',
            icdCode: 'J18.901',
            severity: '中度',
            secondaryDiagnosis: '冠心病',
            pathwayVersion: 'V2.1'
        }
    ],

    // 显示患者明细弹窗
    show: function() {
        document.getElementById('patientModal').style.display = 'block';
        this.renderPatientTable();
    },

    // 关闭患者明细弹窗
    close: function() {
        document.getElementById('patientModal').style.display = 'none';
    },

    // 渲染患者表格
    renderPatientTable: function() {
        var tbody = document.getElementById('patientTableBody');
        var html = '';

        this.patientData.forEach(function(patient, index) {
            var statusText = '';
            var statusClass = '';
            
            switch(patient.pathwayStatus) {
                case 'in':
                    statusText = '已入径';
                    statusClass = 'status-medium';
                    break;
                case 'out':
                    statusText = '已出径';
                    statusClass = 'status-high';
                    break;
                case 'variance':
                    statusText = '变异';
                    statusClass = 'status-low';
                    break;
            }

            var rowBg = index % 2 === 0 ? '#ffffff' : '#f8f9fa';
            
            html += '<tr style="background: ' + rowBg + '; transition: all 0.2s ease; border-bottom: 1px solid #e9ecef;" onmouseover="this.style.background=\'#e3f2fd\'; this.style.transform=\'translateX(2px)\'; this.style.boxShadow=\'0 2px 8px rgba(0,120,212,0.1)\';" onmouseout="this.style.background=\'' + rowBg + '\'; this.style.transform=\'translateX(0)\'; this.style.boxShadow=\'none\';">';
            html += '<td style="padding: 10px 8px; font-size: 13px; color: #666;">' + patient.id + '</td>';
            html += '<td style="padding: 10px 8px; font-size: 13px;"><span class="patient-name-link" style="color: #0078d4; text-decoration: underline; cursor: pointer; font-weight: 500;" onclick="showPathwayComparison(\'' + patient.id + '\', \'' + patient.name + '\')">' + patient.name + '</span></td>';
            html += '<td style="padding: 10px 8px; text-align: center; font-size: 13px; color: #666;">' + patient.gender + '</td>';
            html += '<td style="padding: 10px 8px; text-align: center; font-size: 13px; color: #666;">' + patient.age + '</td>';
            html += '<td style="padding: 10px 8px; text-align: center; font-size: 13px; color: #666;">' + patient.admissionDate + '</td>';
            html += '<td style="padding: 10px 8px; text-align: center; font-size: 13px; color: #666;">' + patient.dischargeDate + '</td>';
            html += '<td style="padding: 10px 8px; text-align: center; font-size: 13px; font-weight: 500; color: #333;">' + patient.days + '</td>';
            html += '<td style="padding: 10px 8px; text-align: center;"><span class="status-badge ' + statusClass + '" style="padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500;">' + statusText + '</span></td>';
            html += '<td style="padding: 10px 8px; text-align: center; font-size: 13px; color: #666;">' + patient.pathwayTime + '</td>';
            html += '<td style="padding: 10px 8px; text-align: center; font-size: 13px; color: #666;">' + patient.completion + '</td>';
            html += '<td style="padding: 10px 8px; text-align: right; font-size: 13px; font-weight: 500; color: #0078d4;">¥' + patient.cost.toLocaleString() + '</td>';
            html += '<td style="padding: 10px 8px; text-align: center;"><button class="action-btn" style="padding: 6px 12px; background: #f8f9fa; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; font-size: 12px; color: #666; transition: all 0.2s ease;" onmouseover="this.style.background=\'#0078d4\'; this.style.color=\'white\'; this.style.borderColor=\'#0078d4\';" onmouseout="this.style.background=\'#f8f9fa\'; this.style.color=\'#666\'; this.style.borderColor=\'#ddd\';" onclick="viewPatientDetail(\'' + patient.id + '\')">查看详情</button></td>';
            html += '</tr>';
        });

        tbody.innerHTML = html;
    },

    // 筛选患者
    filter: function() {
        var status = document.getElementById('pathwayStatus').value;
        var searchText = document.getElementById('patientSearch').value.toLowerCase();
        
        var filteredData = this.patientData.filter(function(patient) {
            var matchStatus = status === 'all' || patient.pathwayStatus === status;
            var matchSearch = searchText === '' || 
                             patient.name.toLowerCase().includes(searchText) || 
                             patient.id.toLowerCase().includes(searchText);
            return matchStatus && matchSearch;
        });

        this.renderFilteredTable(filteredData);
    },

    // 渲染筛选后的表格
    renderFilteredTable: function(data) {
        var tbody = document.getElementById('patientTableBody');
        var html = '';

        data.forEach(function(patient) {
            var statusText = '';
            var statusClass = '';
            
            switch(patient.pathwayStatus) {
                case 'in':
                    statusText = '已入径';
                    statusClass = 'status-medium';
                    break;
                case 'out':
                    statusText = '已出径';
                    statusClass = 'status-high';
                    break;
                case 'variance':
                    statusText = '变异';
                    statusClass = 'status-low';
                    break;
            }

            html += '<tr>';
            html += '<td>' + patient.id + '</td>';
            html += '<td><span class="patient-name-link" onclick="showPathwayComparison(\'' + patient.id + '\', \'' + patient.name + '\')">' + patient.name + '</span></td>';
            html += '<td>' + patient.gender + '</td>';
            html += '<td>' + patient.age + '</td>';
            html += '<td>' + patient.admissionDate + '</td>';
            html += '<td>' + patient.dischargeDate + '</td>';
            html += '<td>' + patient.days + '</td>';
            html += '<td><span class="status-badge ' + statusClass + '">' + statusText + '</span></td>';
            html += '<td>' + patient.pathwayTime + '</td>';
            html += '<td>' + patient.completion + '</td>';
            html += '<td>¥' + patient.cost.toLocaleString() + '</td>';
            html += '<td><button class="action-btn" onclick="viewPatientDetail(\'' + patient.id + '\')">查看详情</button></td>';
            html += '</tr>';
        });

        tbody.innerHTML = html;
    }
};

// 临床路径对比弹窗功能
var PathwayModal = {
    // 模拟临床路径数据
    pathwayData: {
        // 患者实际路径
        actual: {
            'P001': [
                { day: 1, step: '入院评估', status: 'completed', time: '2023-10-15 14:30', note: '完成入院评估，确诊肺炎' },
                { day: 1, step: '抗生素治疗', status: 'completed', time: '2023-10-15 16:00', note: '开始静脉抗生素治疗' },
                { day: 2, step: '胸部X线检查', status: 'completed', time: '2023-10-16 09:00', note: '胸部X线显示肺部感染' },
                { day: 3, step: '血常规复查', status: 'completed', time: '2023-10-17 08:00', note: '白细胞计数下降' },
                { day: 5, step: '症状评估', status: 'completed', time: '2023-10-19 10:00', note: '发热症状缓解' },
                { day: 7, step: '出院准备', status: 'completed', time: '2023-10-21 14:00', note: '症状完全缓解，准备出院' },
                { day: 7, step: '出院', status: 'completed', time: '2023-10-22 10:00', note: '患者康复出院' }
            ],
            'P002': [
                { day: 1, step: '入院评估', status: 'completed', time: '2023-10-16 10:15', note: '完成入院评估，确诊肺炎' },
                { day: 1, step: '抗生素治疗', status: 'completed', time: '2023-10-16 11:30', note: '开始口服抗生素治疗' },
                { day: 2, step: '胸部CT检查', status: 'completed', time: '2023-10-17 14:00', note: '胸部CT确认肺部感染范围' },
                { day: 4, step: '血常规复查', status: 'completed', time: '2023-10-19 08:30', note: '感染指标明显改善' },
                { day: 6, step: '症状评估', status: 'completed', time: '2023-10-21 09:00', note: '咳嗽症状减轻' },
                { day: 8, step: '出院准备', status: 'completed', time: '2023-10-23 15:00', note: '各项指标正常' },
                { day: 8, step: '出院', status: 'completed', time: '2023-10-24 10:15', note: '患者康复出院' }
            ],
            'P003': [
                { day: 1, step: '入院评估', status: 'completed', time: '2023-10-17 16:45', note: '完成入院评估，确诊重症肺炎' },
                { day: 1, step: '抗生素治疗', status: 'completed', time: '2023-10-17 18:00', note: '开始静脉抗生素治疗' },
                { day: 2, step: '胸部CT检查', status: 'completed', time: '2023-10-18 10:00', note: '双肺感染，病情较重' },
                { day: 3, step: '调整治疗方案', status: 'variance', time: '2023-10-19 14:00', note: '因病情加重，调整为联合抗生素治疗' },
                { day: 5, step: 'ICU转入', status: 'variance', time: '2023-10-21 20:00', note: '呼吸困难加重，转入ICU' },
                { day: 7, step: '机械通气', status: 'variance', time: '2023-10-23 08:00', note: '需要机械通气支持' },
                { day: 9, step: '病情稳定', status: 'completed', time: '2023-10-25 12:00', note: '病情逐渐稳定' },
                { day: 9, step: '出院', status: 'completed', time: '2023-10-26 14:00', note: '病情稳定后出院' }
            ]
        },
        // 国家标准路径
        standard: [
            { day: 1, step: '入院评估', description: '完成病史采集、体格检查、实验室检查' },
            { day: 1, step: '抗生素治疗', description: '根据病情严重程度选择合适的抗生素' },
            { day: 2, step: '影像学检查', description: '胸部X线或CT检查，评估肺部病变' },
            { day: 3, step: '疗效评估', description: '评估治疗效果，必要时调整治疗方案' },
            { day: 5, step: '症状改善评估', description: '评估发热、咳嗽等症状改善情况' },
            { day: 7, step: '出院评估', description: '评估患者是否达到出院标准' },
            { day: 7, step: '出院', description: '患者症状缓解，各项指标正常，可以出院' }
        ]
    },

    // 显示临床路径对比弹窗
    show: function(patientId, patientName) {
        document.getElementById('pathwayModal').style.display = 'block';
        document.getElementById('pathwayModalTitle').textContent = '临床路径对比分析 - ' + patientName;
        this.renderPathwayComparison(patientId);
    },

    // 关闭临床路径对比弹窗
    close: function() {
        document.getElementById('pathwayModal').style.display = 'none';
    },

    // 渲染路径对比
    renderPathwayComparison: function(patientId) {
        var actualPathway = this.pathwayData.actual[patientId] || [];
        var standardPathway = this.pathwayData.standard;

        // 渲染实际路径
        var actualHtml = '';
        actualPathway.forEach(function(step) {
            var stepClass = step.status === 'completed' ? 'completed' : 
                           step.status === 'variance' ? 'variance' : '';
            
            actualHtml += '<div class="pathway-step ' + stepClass + '">';
            actualHtml += '<div style="font-weight: bold;">第' + step.day + '天: ' + step.step + '</div>';
            actualHtml += '<div style="font-size: 12px; color: #666; margin-top: 5px;">时间: ' + step.time + '</div>';
            actualHtml += '<div style="font-size: 12px; margin-top: 5px;">' + step.note + '</div>';
            actualHtml += '</div>';
        });

        // 渲染标准路径
        var standardHtml = '';
        standardPathway.forEach(function(step) {
            standardHtml += '<div class="pathway-step">';
            standardHtml += '<div style="font-weight: bold;">第' + step.day + '天: ' + step.step + '</div>';
            standardHtml += '<div style="font-size: 12px; margin-top: 5px;">' + step.description + '</div>';
            standardHtml += '</div>';
        });

        document.getElementById('actualPathway').innerHTML = actualHtml;
        document.getElementById('standardPathway').innerHTML = standardHtml;
    }
};

// 全局函数
function showPatientModal() {
    PatientModal.show();
}

function closePatientModal() {
    PatientModal.close();
}

function filterPatients() {
    PatientModal.filter();
}

function showPathwayComparison(patientId, patientName) {
    PathwayModal.show(patientId, patientName);
}

function closePathwayModal() {
    PathwayModal.close();
}

function viewPatientDetail(patientId) {
    // 查找患者数据
    var patient = PatientModal.patientData.find(function(p) {
        return p.id === patientId;
    });
    
    if (patient) {
        // 填充患者基本信息
        document.getElementById('detailHospitalNo').textContent = patient.id;
        document.getElementById('detailPatientName').textContent = patient.name;
        document.getElementById('detailGender').textContent = patient.gender;
        document.getElementById('detailAge').textContent = patient.age + '岁';
        document.getElementById('detailAdmissionDate').textContent = patient.admissionDate;
        document.getElementById('detailDischargeDate').textContent = patient.dischargeDate || '住院中';
        document.getElementById('detailStayDays').textContent = patient.days + '天';
        
        // 填充诊断信息
        document.getElementById('detailMainDiagnosis').textContent = patient.diagnosis;
        document.getElementById('detailSecondaryDiagnosis').textContent = patient.secondaryDiagnosis || '无';
        document.getElementById('detailDiagnosisCode').textContent = patient.icdCode;
        document.getElementById('detailIcdCode').textContent = patient.icdCode;
        document.getElementById('detailSeverity').textContent = patient.severity;
        
        // 填充临床路径信息
        var pathwayStatusText = '';
        switch(patient.pathwayStatus) {
            case 'in': pathwayStatusText = '已入径'; break;
            case 'out': pathwayStatusText = '已出径'; break;
            case 'variance': pathwayStatusText = '变异'; break;
        }
        document.getElementById('detailPathwayStatus').textContent = pathwayStatusText;
        document.getElementById('detailPathwayName').textContent = patient.pathwayName;
        document.getElementById('detailPathwayEntryTime').textContent = patient.admissionDate;
        document.getElementById('detailPathwayExitTime').textContent = patient.dischargeDate || '未出径';
        document.getElementById('detailCompletionStatus').textContent = patient.completion;
        
        // 根据患者具体情况设置变异原因
        var varianceReason = '无';
        if (patient.pathwayStatus === 'variance') {
            if (patient.id === 'P003') {
                varianceReason = '患者合并心力衰竭和肾功能不全，病情复杂，需延长治疗时间';
            } else {
                varianceReason = '患者合并症较多，延长住院时间';
            }
        }
        document.getElementById('detailVarianceReason').textContent = varianceReason;
        document.getElementById('detailPathwayVersion').textContent = patient.pathwayVersion;
        
        // 填充费用信息
        document.getElementById('detailTotalCost').textContent = '¥' + patient.cost.toLocaleString();
        document.getElementById('detailMedicineCost').textContent = '¥' + Math.round(patient.cost * 0.4).toLocaleString();
        document.getElementById('detailMaterialCost').textContent = '¥' + Math.round(patient.cost * 0.2).toLocaleString();
        document.getElementById('detailExamCost').textContent = '¥' + Math.round(patient.cost * 0.25).toLocaleString();
        document.getElementById('detailTreatmentCost').textContent = '¥' + Math.round(patient.cost * 0.15).toLocaleString();
        document.getElementById('detailSurgeryCost').textContent = '¥0';
        document.getElementById('detailNursingCost').textContent = '¥' + Math.round(patient.cost * 0.05).toLocaleString();
        document.getElementById('detailOtherCost').textContent = '¥' + Math.round(patient.cost * 0.05).toLocaleString();
        
        // 填充治疗记录
        document.getElementById('detailTreatmentRecords').innerHTML = '<p>2023-10-15: 入院评估，确诊肺炎，开始抗生素治疗</p><p>2023-10-16: 胸部X线检查，血常规复查</p><p>2023-10-17: 症状评估，调整用药方案</p><p>2023-10-19: 病情好转，继续治疗</p><p>2023-10-21: 症状明显缓解，准备出院</p><p>2023-10-22: 康复出院</p>';
        
        // 显示弹窗
        document.getElementById('patientDetailModal').style.display = 'block';
    }
}

function closePatientDetailModal() {
    document.getElementById('patientDetailModal').style.display = 'none';
}

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
        DepartmentDiseasePage.init();
    } else {
        const onReady = function() {
            document.removeEventListener('echartsLoaded', onReady);
            DepartmentDiseasePage.init();
        };
        document.addEventListener('echartsLoaded', onReady);
    }
});

// 心梗患者明细功能
var MIPatientModal = {
    // 心梗患者数据
    patientData: [
        {
            id: 'MI001',
            name: '陈一',
            gender: '男',
            age: 62,
            admissionDate: '2023-10-15',
            dischargeDate: '2023-10-25',
            days: 10,
            pathwayStatus: 'in',
            pathwayTime: '2023-10-15 08:30',
            completion: '已完成',
            cost: 45800,
            diagnosis: '急性心梗',
            pathwayName: 'ST段抬高型心肌梗死临床路径',
            pathwayCode: 'STEMI-2023',
            icdCode: 'I21.901',
            severity: '重度',
            secondaryDiagnosis: '高血压、糖尿病',
            pathwayVersion: 'V3.1'
        },
        {
            id: 'MI002',
            name: '刘二',
            gender: '女',
            age: 58,
            admissionDate: '2023-10-16',
            dischargeDate: '2023-10-24',
            days: 8,
            pathwayStatus: 'out',
            pathwayTime: '2023-10-24 14:20',
            completion: '已完成',
            cost: 38500,
            diagnosis: '急性心梗',
            pathwayName: '非ST段抬高型心肌梗死临床路径',
            pathwayCode: 'NSTEMI-2023',
            icdCode: 'I21.902',
            severity: '中度',
            secondaryDiagnosis: '高脂血症',
            pathwayVersion: 'V3.1'
        },
        {
            id: 'MI003',
            name: '张三',
            gender: '男',
            age: 65,
            admissionDate: '2023-10-17',
            dischargeDate: '2023-10-28',
            days: 11,
            pathwayStatus: 'variance',
            pathwayTime: '2023-10-17 12:15',
            completion: '变异',
            cost: 52300,
            diagnosis: '急性心梗',
            pathwayName: 'ST段抬高型心肌梗死临床路径',
            pathwayCode: 'STEMI-2023',
            icdCode: 'I21.901',
            severity: '重度',
            secondaryDiagnosis: '心力衰竭、肾功能不全',
            pathwayVersion: 'V3.1'
        },
        {
            id: 'MI004',
            name: '李四',
            gender: '女',
            age: 55,
            admissionDate: '2023-10-18',
            dischargeDate: '2023-10-26',
            days: 8,
            pathwayStatus: 'in',
            pathwayTime: '2023-10-18 16:45',
            completion: '进行中',
            cost: 41200,
            diagnosis: '急性心梗',
            pathwayName: '非ST段抬高型心肌梗死临床路径',
            pathwayCode: 'NSTEMI-2023',
            icdCode: 'I21.902',
            severity: '中度',
            secondaryDiagnosis: '高血压',
            pathwayVersion: 'V3.1'
        },
        {
            id: 'MI005',
            name: '王五',
            gender: '男',
            age: 70,
            admissionDate: '2023-10-19',
            dischargeDate: '2023-10-29',
            days: 10,
            pathwayStatus: 'out',
            pathwayTime: '2023-10-29 10:30',
            completion: '已完成',
            cost: 47600,
            diagnosis: '急性心梗',
            pathwayName: 'ST段抬高型心肌梗死临床路径',
            pathwayCode: 'STEMI-2023',
            icdCode: 'I21.901',
            severity: '重度',
            secondaryDiagnosis: '冠心病、高血压',
            pathwayVersion: 'V3.1'
        }
    ],

    show: function() {
        document.getElementById('miPatientModal').style.display = 'block';
        this.renderPatientTable();
        this.updatePatientCount();
    },

    close: function() {
        document.getElementById('miPatientModal').style.display = 'none';
    },

    renderPatientTable: function() {
        const tbody = document.getElementById('miPatientTableBody');
        let html = '';
        
        this.patientData.forEach(patient => {
            const statusClass = patient.pathwayStatus === 'in' ? 'status-in' : 
                               patient.pathwayStatus === 'out' ? 'status-out' : 'status-variance';
            const statusText = patient.pathwayStatus === 'in' ? '已入径' : 
                              patient.pathwayStatus === 'out' ? '已出径' : '变异';
            
            html += `
                <tr style="border-bottom: 1px solid #e9ecef;">
                    <td style="padding: 12px 8px; border-right: 1px solid #e9ecef;">${patient.id}</td>
                    <td style="padding: 12px 8px; border-right: 1px solid #e9ecef;">
                        <span style="color: #0078d4; text-decoration: underline; cursor: pointer;" 
                              onclick="showMIPathwayComparison('${patient.id}', '${patient.name}')">${patient.name}</span>
                    </td>
                    <td style="padding: 12px 8px; text-align: center; border-right: 1px solid #e9ecef;">${patient.gender}</td>
                    <td style="padding: 12px 8px; text-align: center; border-right: 1px solid #e9ecef;">${patient.age}</td>
                    <td style="padding: 12px 8px; text-align: center; border-right: 1px solid #e9ecef;">${patient.admissionDate}</td>
                    <td style="padding: 12px 8px; text-align: center; border-right: 1px solid #e9ecef;">${patient.dischargeDate}</td>
                    <td style="padding: 12px 8px; text-align: center; border-right: 1px solid #e9ecef;">${patient.days}</td>
                    <td style="padding: 12px 8px; text-align: center; border-right: 1px solid #e9ecef;">
                        <span class="${statusClass}" style="padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500;
                               background-color: ${patient.pathwayStatus === 'in' ? '#e3f2fd' : 
                                                  patient.pathwayStatus === 'out' ? '#e8f5e8' : '#fff3e0'};
                               color: ${patient.pathwayStatus === 'in' ? '#1976d2' : 
                                       patient.pathwayStatus === 'out' ? '#388e3c' : '#f57c00'};">${statusText}</span>
                    </td>
                    <td style="padding: 12px 8px; text-align: center; border-right: 1px solid #e9ecef;">${patient.pathwayTime}</td>
                    <td style="padding: 12px 8px; text-align: center; border-right: 1px solid #e9ecef;">${patient.completion}</td>
                    <td style="padding: 12px 8px; text-align: right; border-right: 1px solid #e9ecef;">¥${patient.cost.toLocaleString()}</td>
                    <td style="padding: 12px 8px; text-align: center;">
                        <button onclick="viewMIPatientDetail('${patient.id}')" 
                                style="background: #0078d4; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                            查看详情
                        </button>
                    </td>
                </tr>
            `;
        });
        
        tbody.innerHTML = html;
    },

    filter: function() {
        const status = document.getElementById('miPathwayStatus').value;
        const search = document.getElementById('miPatientSearch').value.toLowerCase();
        
        let filteredData = this.patientData;
        
        if (status !== 'all') {
            filteredData = filteredData.filter(patient => patient.pathwayStatus === status);
        }
        
        if (search) {
            filteredData = filteredData.filter(patient => 
                patient.name.toLowerCase().includes(search) || 
                patient.id.toLowerCase().includes(search)
            );
        }
        
        this.renderFilteredTable(filteredData);
        this.updatePatientCount(filteredData.length);
    },

    renderFilteredTable: function(data) {
        const tbody = document.getElementById('miPatientTableBody');
        let html = '';
        
        data.forEach(patient => {
            const statusClass = patient.pathwayStatus === 'in' ? 'status-in' : 
                               patient.pathwayStatus === 'out' ? 'status-out' : 'status-variance';
            const statusText = patient.pathwayStatus === 'in' ? '已入径' : 
                              patient.pathwayStatus === 'out' ? '已出径' : '变异';
            
            html += `
                <tr style="border-bottom: 1px solid #e9ecef;">
                    <td style="padding: 12px 8px; border-right: 1px solid #e9ecef;">${patient.id}</td>
                    <td style="padding: 12px 8px; border-right: 1px solid #e9ecef;">
                        <span style="color: #0078d4; text-decoration: underline; cursor: pointer;" 
                              onclick="showMIPathwayComparison('${patient.id}', '${patient.name}')">${patient.name}</span>
                    </td>
                    <td style="padding: 12px 8px; text-align: center; border-right: 1px solid #e9ecef;">${patient.gender}</td>
                    <td style="padding: 12px 8px; text-align: center; border-right: 1px solid #e9ecef;">${patient.age}</td>
                    <td style="padding: 12px 8px; text-align: center; border-right: 1px solid #e9ecef;">${patient.admissionDate}</td>
                    <td style="padding: 12px 8px; text-align: center; border-right: 1px solid #e9ecef;">${patient.dischargeDate}</td>
                    <td style="padding: 12px 8px; text-align: center; border-right: 1px solid #e9ecef;">${patient.days}</td>
                    <td style="padding: 12px 8px; text-align: center; border-right: 1px solid #e9ecef;">
                        <span class="${statusClass}" style="padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500;
                               background-color: ${patient.pathwayStatus === 'in' ? '#e3f2fd' : 
                                                  patient.pathwayStatus === 'out' ? '#e8f5e8' : '#fff3e0'};
                               color: ${patient.pathwayStatus === 'in' ? '#1976d2' : 
                                       patient.pathwayStatus === 'out' ? '#388e3c' : '#f57c00'};">${statusText}</span>
                    </td>
                    <td style="padding: 12px 8px; text-align: center; border-right: 1px solid #e9ecef;">${patient.pathwayTime}</td>
                    <td style="padding: 12px 8px; text-align: center; border-right: 1px solid #e9ecef;">${patient.completion}</td>
                    <td style="padding: 12px 8px; text-align: right; border-right: 1px solid #e9ecef;">¥${patient.cost.toLocaleString()}</td>
                    <td style="padding: 12px 8px; text-align: center;">
                        <button onclick="viewMIPatientDetail('${patient.id}')" 
                                style="background: #0078d4; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                            查看详情
                        </button>
                    </td>
                </tr>
            `;
        });
        
        tbody.innerHTML = html;
    },

    updatePatientCount: function(count) {
        const countElement = document.getElementById('miPatientCount');
        if (countElement) {
            countElement.textContent = count !== undefined ? count : this.patientData.length;
        }
    }
};

// 心梗临床路径对比功能
var MIPathwayModal = {
    // 心梗临床路径数据
    pathwayData: {
        // 患者实际路径
        actual: {
            'MI001': [
                { day: 1, step: '急诊评估', status: 'completed', time: '2023-10-15 08:30', note: '确诊ST段抬高型心肌梗死' },
                { day: 1, step: '急诊PCI', status: 'completed', time: '2023-10-15 10:00', note: '成功开通梗死相关血管' },
                { day: 2, step: '双联抗血小板', status: 'completed', time: '2023-10-16 08:00', note: '开始双联抗血小板治疗' },
                { day: 3, step: '心功能评估', status: 'completed', time: '2023-10-17 09:00', note: '心功能轻度受损' },
                { day: 5, step: '康复评估', status: 'completed', time: '2023-10-19 14:00', note: '开始心脏康复训练' },
                { day: 8, step: '出院准备', status: 'completed', time: '2023-10-22 16:00', note: '病情稳定，准备出院' },
                { day: 10, step: '出院', status: 'completed', time: '2023-10-25 10:00', note: '患者康复出院' }
            ],
            'MI002': [
                { day: 1, step: '急诊评估', status: 'completed', time: '2023-10-16 14:20', note: '确诊非ST段抬高型心肌梗死' },
                { day: 1, step: '药物治疗', status: 'completed', time: '2023-10-16 15:30', note: '开始抗凝、抗血小板治疗' },
                { day: 2, step: '冠脉造影', status: 'completed', time: '2023-10-17 10:00', note: '冠脉造影显示单支病变' },
                { day: 3, step: 'PCI治疗', status: 'completed', time: '2023-10-18 09:00', note: '成功植入支架' },
                { day: 5, step: '心功能评估', status: 'completed', time: '2023-10-20 11:00', note: '心功能基本正常' },
                { day: 7, step: '康复训练', status: 'completed', time: '2023-10-22 14:00', note: '开始康复训练' },
                { day: 8, step: '出院', status: 'completed', time: '2023-10-24 14:20', note: '患者康复出院' }
            ],
            'MI003': [
                { day: 1, step: '急诊评估', status: 'completed', time: '2023-10-17 12:15', note: '确诊ST段抬高型心肌梗死' },
                { day: 1, step: '急诊PCI', status: 'completed', time: '2023-10-17 14:00', note: '血管开通，但有并发症' },
                { day: 2, step: '并发症处理', status: 'variance', time: '2023-10-18 08:00', note: '出现心力衰竭，需要强化治疗' },
                { day: 4, step: 'IABP支持', status: 'variance', time: '2023-10-20 10:00', note: '植入主动脉球囊反搏' },
                { day: 7, step: '肾功能监测', status: 'variance', time: '2023-10-23 12:00', note: '肾功能恶化，调整用药' },
                { day: 9, step: '病情稳定', status: 'completed', time: '2023-10-25 15:00', note: '病情逐渐稳定' },
                { day: 11, step: '出院', status: 'completed', time: '2023-10-28 11:00', note: '病情稳定后出院' }
            ]
        },
        // 国家标准路径
        standard: [
            { day: 1, step: '急诊评估', description: '完成心电图、心肌酶、冠脉造影等检查' },
            { day: 1, step: '急诊PCI', description: '对于STEMI患者，应在90分钟内完成PCI' },
            { day: 2, step: '药物治疗', description: '双联抗血小板、他汀类、ACEI/ARB等' },
            { day: 3, step: '心功能评估', description: '超声心动图评估心功能' },
            { day: 5, step: '康复评估', description: '评估患者康复训练适应性' },
            { day: 7, step: '出院评估', description: '评估患者是否达到出院标准' },
            { day: 7, step: '出院', description: '患者病情稳定，可以出院' }
        ]
    },

    show: function(patientId, patientName) {
        document.getElementById('miPathwayModal').style.display = 'block';
        document.getElementById('miPathwayModalTitle').textContent = `${patientName} - 急性心梗临床路径对比分析`;
        this.renderPathwayComparison(patientId);
    },

    close: function() {
        document.getElementById('miPathwayModal').style.display = 'none';
    },

    renderPathwayComparison: function(patientId) {
        const content = document.getElementById('miPathwayContent');
        const actualPath = this.pathwayData.actual[patientId] || [];
        const standardPath = this.pathwayData.standard;

        let html = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; height: 100%;">
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
                    <h3 style="margin: 0 0 20px 0; color: #333; font-size: 18px; font-weight: 600;">患者实际路径</h3>
                    <div style="max-height: 500px; overflow-y: auto;">
        `;

        actualPath.forEach((step, index) => {
            const statusColor = step.status === 'completed' ? '#28a745' : 
                               step.status === 'variance' ? '#ffc107' : '#6c757d';
            const statusText = step.status === 'completed' ? '已完成' : 
                              step.status === 'variance' ? '变异' : '进行中';

            html += `
                <div style="display: flex; margin-bottom: 15px; position: relative;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background: ${statusColor}; 
                                display: flex; align-items: center; justify-content: center; color: white; 
                                font-weight: bold; font-size: 14px; flex-shrink: 0;">
                        ${step.day}
                    </div>
                    <div style="margin-left: 15px; flex: 1;">
                        <div style="font-weight: 600; color: #333; margin-bottom: 5px;">${step.step}</div>
                        <div style="font-size: 12px; color: #666; margin-bottom: 3px;">${step.time}</div>
                        <div style="font-size: 13px; color: #555;">${step.note}</div>
                        <span style="display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 11px; 
                                     background: ${statusColor}; color: white; margin-top: 5px;">${statusText}</span>
                    </div>
                </div>
            `;

            if (index < actualPath.length - 1) {
                html += `<div style="width: 2px; height: 20px; background: #ddd; margin-left: 19px; margin-bottom: 5px;"></div>`;
            }
        });

        html += `
                    </div>
                </div>
                <div style="background: #e8f5e8; padding: 20px; border-radius: 8px;">
                    <h3 style="margin: 0 0 20px 0; color: #333; font-size: 18px; font-weight: 600;">国家标准路径</h3>
                    <div style="max-height: 500px; overflow-y: auto;">
        `;

        standardPath.forEach((step, index) => {
            html += `
                <div style="display: flex; margin-bottom: 15px; position: relative;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background: #28a745; 
                                display: flex; align-items: center; justify-content: center; color: white; 
                                font-weight: bold; font-size: 14px; flex-shrink: 0;">
                        ${step.day}
                    </div>
                    <div style="margin-left: 15px; flex: 1;">
                        <div style="font-weight: 600; color: #333; margin-bottom: 5px;">${step.step}</div>
                        <div style="font-size: 13px; color: #555;">${step.description}</div>
                    </div>
                </div>
            `;

            if (index < standardPath.length - 1) {
                html += `<div style="width: 2px; height: 20px; background: #ddd; margin-left: 19px; margin-bottom: 5px;"></div>`;
            }
        });

        html += `
                    </div>
                </div>
            </div>
        `;

        content.innerHTML = html;
    }
};

// 全局函数
function showMIPatientModal() {
    MIPatientModal.show();
}

function closeMIPatientModal() {
    MIPatientModal.close();
}

function filterMIPatients() {
    MIPatientModal.filter();
}

function showMIPathwayComparison(patientId, patientName) {
    MIPathwayModal.show(patientId, patientName);
}

function closeMIPathwayModal() {
    MIPathwayModal.close();
}

function viewMIPatientDetail(patientId) {
    // 查找患者数据
    const patient = MIPatientModal.patientData.find(p => p.id === patientId);
    if (!patient) return;

    // 显示患者详细信息弹窗
    document.getElementById('miPatientDetailModal').style.display = 'block';
    document.getElementById('miPatientDetailTitle').textContent = `${patient.name} - 急性心梗患者详细信息`;

    // 生成患者详细信息内容
    const content = document.getElementById('miPatientDetailContent');
    content.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
                <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px; font-weight: 600;">基本信息</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div><strong>住院号:</strong> ${patient.id}</div>
                    <div><strong>患者姓名:</strong> ${patient.name}</div>
                    <div><strong>性别:</strong> ${patient.gender}</div>
                    <div><strong>年龄:</strong> ${patient.age}岁</div>
                    <div><strong>入院日期:</strong> ${patient.admissionDate}</div>
                    <div><strong>出院日期:</strong> ${patient.dischargeDate}</div>
                    <div><strong>住院天数:</strong> ${patient.days}天</div>
                    <div><strong>医疗费用:</strong> ¥${patient.cost.toLocaleString()}</div>
                </div>
            </div>
            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px;">
                <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px; font-weight: 600;">诊断信息</h3>
                <div style="display: grid; gap: 10px;">
                    <div><strong>主要诊断:</strong> ${patient.diagnosis}</div>
                    <div><strong>ICD编码:</strong> ${patient.icdCode}</div>
                    <div><strong>病情严重程度:</strong> ${patient.severity}</div>
                    <div><strong>次要诊断:</strong> ${patient.secondaryDiagnosis}</div>
                </div>
            </div>
        </div>

        <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px; font-weight: 600;">临床路径信息</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px;">
                <div><strong>路径名称:</strong> ${patient.pathwayName}</div>
                <div><strong>路径编码:</strong> ${patient.pathwayCode}</div>
                <div><strong>路径版本:</strong> ${patient.pathwayVersion}</div>
                <div><strong>入径时间:</strong> ${patient.pathwayTime}</div>
                <div><strong>路径状态:</strong> ${patient.pathwayStatus === 'in' ? '已入径' : patient.pathwayStatus === 'out' ? '已出径' : '变异'}</div>
                <div><strong>完成情况:</strong> ${patient.completion}</div>
            </div>
        </div>

        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px;">
            <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px; font-weight: 600;">关键指标</h3>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;">
                <div style="text-align: center; padding: 15px; background: white; border-radius: 6px;">
                    <div style="font-size: 24px; font-weight: bold; color: #0078d4; margin-bottom: 5px;">
                        ${patient.severity === '重度' ? '7.5' : patient.severity === '中度' ? '6.2' : '5.1'}天
                    </div>
                    <div style="font-size: 12px; color: #666;">平均住院日</div>
                </div>
                <div style="text-align: center; padding: 15px; background: white; border-radius: 6px;">
                    <div style="font-size: 24px; font-weight: bold; color: #28a745; margin-bottom: 5px;">
                        ${patient.severity === '重度' ? '94.8' : patient.severity === '中度' ? '96.5' : '98.2'}%
                    </div>
                    <div style="font-size: 12px; color: #666;">治疗成功率</div>
                </div>
                <div style="text-align: center; padding: 15px; background: white; border-radius: 6px;">
                    <div style="font-size: 24px; font-weight: bold; color: #ffc107; margin-bottom: 5px;">
                        ${patient.severity === '重度' ? '4.2' : patient.severity === '中度' ? '2.1' : '0.8'}%
                    </div>
                    <div style="font-size: 12px; color: #666;">并发症率</div>
                </div>
                <div style="text-align: center; padding: 15px; background: white; border-radius: 6px;">
                    <div style="font-size: 24px; font-weight: bold; color: #dc3545; margin-bottom: 5px;">
                        ${patient.severity === '重度' ? '3.8' : patient.severity === '中度' ? '1.5' : '0.3'}%
                    </div>
                    <div style="font-size: 12px; color: #666;">病死率</div>
                </div>
            </div>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px; font-weight: 600;">治疗记录</h3>
            <div id="miTreatmentRecords">
                <!-- 治疗记录内容将在这里动态生成 -->
            </div>
        </div>
    `;

    // 生成治疗记录
    const treatmentRecords = [
        { date: patient.admissionDate, time: '08:30', event: '急诊入院', description: '患者因胸痛急诊入院，心电图提示急性心肌梗死' },
        { date: patient.admissionDate, time: '10:00', event: '急诊PCI', description: '成功开通梗死相关血管，植入药物洗脱支架' },
        { date: patient.admissionDate, time: '14:00', event: '药物治疗', description: '开始双联抗血小板、他汀类、β受体阻滞剂治疗' },
        { date: patient.admissionDate, time: '18:00', event: '监护观察', description: '转入CCU监护，密切观察心律、血压变化' }
    ];

    let recordsHtml = '';
    treatmentRecords.forEach(record => {
        recordsHtml += `
            <div style="border-left: 3px solid #0078d4; padding-left: 15px; margin-bottom: 15px;">
                <div style="font-weight: 600; color: #333; margin-bottom: 5px;">
                    ${record.date} ${record.time} - ${record.event}
                </div>
                <div style="color: #666; font-size: 14px;">${record.description}</div>
            </div>
        `;
    });

    document.getElementById('miTreatmentRecords').innerHTML = recordsHtml;
}

function closeMIPatientDetailModal() {
    document.getElementById('miPatientDetailModal').style.display = 'none';
}