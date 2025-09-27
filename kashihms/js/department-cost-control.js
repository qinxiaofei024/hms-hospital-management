// 科室费用控制分析页面逻辑
var DepartmentCostControlPage = {
    // 页面状态
    state: {
        currentDepartment: 'internal',
        dateRange: {
            start: '',
            end: ''
        },
        costType: 'all',
        reportType: 'monthly',
        charts: {
            costTrendChart: null,
            costStructureChart: null,
            drugCostTrendChart: null,
            materialCostTrendChart: null,
            drugCategoryChart: null,
            highCostDrugsChart: null,
            drgsCostChart: null,
            budgetExecutionChart: null,
            budgetTrendChart: null
        }
    },
    
    // 模拟数据
    mockData: {
        // 费用趋势数据
        costTrend: [
            { month: '1月', totalCost: 37800000, drugCost: 15600000, materialCost: 7250000, serviceCost: 8950000, otherCost: 6000000 },
            { month: '2月', totalCost: 36500000, drugCost: 15100000, materialCost: 7050000, serviceCost: 8650000, otherCost: 5700000 },
            { month: '3月', totalCost: 40200000, drugCost: 16800000, materialCost: 7850000, serviceCost: 9550000, otherCost: 6000000 },
            { month: '4月', totalCost: 41500000, drugCost: 17300000, materialCost: 8150000, serviceCost: 9850000, otherCost: 6200000 },
            { month: '5月', totalCost: 42800000, drugCost: 17800000, materialCost: 8450000, serviceCost: 10250000, otherCost: 6300000 },
            { month: '6月', totalCost: 44300000, drugCost: 18400000, materialCost: 8800000, serviceCost: 10500000, otherCost: 6600000 },
            { month: '7月', totalCost: 45800000, drugCost: 18900000, materialCost: 9150000, serviceCost: 10950000, otherCost: 6800000 },
            { month: '8月', totalCost: 47200000, drugCost: 19500000, materialCost: 9400000, serviceCost: 11300000, otherCost: 7000000 },
            { month: '9月', totalCost: 46800000, drugCost: 19300000, materialCost: 9300000, serviceCost: 11200000, otherCost: 7000000 },
            { month: '10月', totalCost: 48650000, drugCost: 20430000, materialCost: 9640000, serviceCost: 11580000, otherCost: 7000000 }
        ],
        
        // 费用结构数据
        costStructure: [
            { name: '药品费用', value: 20430000, percentage: 42.0 },
            { name: '卫生材料费用', value: 9640000, percentage: 19.8 },
            { name: '医疗服务费用', value: 11580000, percentage: 23.8 },
            { name: '其他费用', value: 7000000, percentage: 14.4 }
        ],
        
        // 药品费用趋势数据
        drugCostTrend: [
            { month: '1月', western: 10200000, traditional: 3500000, biological: 1900000 },
            { month: '2月', western: 9850000, traditional: 3400000, biological: 1850000 },
            { month: '3月', western: 11000000, traditional: 3700000, biological: 2100000 },
            { month: '4月', western: 11350000, traditional: 3850000, biological: 2100000 },
            { month: '5月', western: 11700000, traditional: 3950000, biological: 2150000 },
            { month: '6月', western: 12100000, traditional: 4100000, biological: 2200000 },
            { month: '7月', western: 12450000, traditional: 4200000, biological: 2250000 },
            { month: '8月', western: 12850000, traditional: 4350000, biological: 2300000 },
            { month: '9月', western: 12700000, traditional: 4300000, biological: 2300000 },
            { month: '10月', western: 13450000, traditional: 4550000, biological: 2430000 }
        ],
        
        // 材料费用趋势数据
        materialCostTrend: [
            { month: '1月', highValue: 4850000, lowValue: 2400000 },
            { month: '2月', highValue: 4700000, lowValue: 2350000 },
            { month: '3月', highValue: 5250000, lowValue: 2600000 },
            { month: '4月', highValue: 5450000, lowValue: 2700000 },
            { month: '5月', highValue: 5650000, lowValue: 2800000 },
            { month: '6月', highValue: 5850000, lowValue: 2950000 },
            { month: '7月', highValue: 6100000, lowValue: 3050000 },
            { month: '8月', highValue: 6250000, lowValue: 3150000 },
            { month: '9月', highValue: 6200000, lowValue: 3100000 },
            { month: '10月', highValue: 6400000, lowValue: 3240000 }
        ],
        
        // 药品分类数据
        drugCategory: [
            { name: '抗菌药物', value: 4580000 },
            { name: '心血管药物', value: 3850000 },
            { name: '神经系统药物', value: 3250000 },
            { name: '呼吸系统药物', value: 2850000 },
            { name: '消化系统药物', value: 2450000 },
            { name: '其他药物', value: 3450000 }
        ],
        
        // 高价药品数据
        highCostDrugs: [
            { name: '生物制品A', cost: 1250000, count: 120, avgCost: 10416.67 },
            { name: '抗肿瘤药物B', cost: 980000, count: 85, avgCost: 11529.41 },
            { name: '靶向药物C', cost: 850000, count: 70, avgCost: 12142.86 },
            { name: '生物制品D', cost: 780000, count: 95, avgCost: 8210.53 },
            { name: '特殊药物E', cost: 650000, count: 110, avgCost: 5909.09 }
        ],
        
        // 科室费用对比数据
        departmentCost: [
            { dept: '内科', totalCost: 48650000, drugCost: 20430000, materialCost: 9640000, consumptionPer100: 32.5, costRate: 67.7, yearOnYear: 8.3, monthOnMonth: 3.9 },
            { dept: '外科', totalCost: 52350000, drugCost: 18550000, materialCost: 16850000, consumptionPer100: 42.8, costRate: 72.5, yearOnYear: 10.5, monthOnMonth: 2.8 },
            { dept: '儿科', totalCost: 28500000, drugCost: 12500000, materialCost: 5250000, consumptionPer100: 28.5, costRate: 65.2, yearOnYear: 6.8, monthOnMonth: 1.9 },
            { dept: '妇产科', totalCost: 32450000, drugCost: 11850000, materialCost: 7850000, consumptionPer100: 35.2, costRate: 68.8, yearOnYear: 7.2, monthOnMonth: 2.5 },
            { dept: '神经内科', totalCost: 42350000, drugCost: 17850000, materialCost: 8550000, consumptionPer100: 34.8, costRate: 69.5, yearOnYear: 9.2, monthOnMonth: 3.1 },
            { dept: '心内科', totalCost: 45650000, drugCost: 19250000, materialCost: 9250000, consumptionPer100: 33.8, costRate: 68.2, yearOnYear: 8.8, monthOnMonth: 3.5 },
            { dept: '骨科', totalCost: 48250000, drugCost: 16550000, materialCost: 18550000, consumptionPer100: 45.8, costRate: 73.2, yearOnYear: 11.2, monthOnMonth: 2.2 },
            { dept: '眼科', totalCost: 18550000, drugCost: 6550000, materialCost: 5250000, consumptionPer100: 32.5, costRate: 67.5, yearOnYear: 5.8, monthOnMonth: 1.8 },
            { dept: '皮肤科', totalCost: 12350000, drugCost: 5250000, materialCost: 2850000, consumptionPer100: 29.8, costRate: 64.2, yearOnYear: 4.8, monthOnMonth: 1.5 },
            { dept: '耳鼻喉科', totalCost: 15850000, drugCost: 5850000, materialCost: 4250000, consumptionPer100: 30.5, costRate: 65.8, yearOnYear: 5.2, monthOnMonth: 1.7 }
        ],
        
        // DRGs费用数据
        drgsCost: [
            { group: '脑梗死', avgCost: 18500, count: 235, totalCost: 4347500, drugRatio: 45.2, materialRatio: 22.5, costIndex: 1.12 },
            { group: '肺炎', avgCost: 12500, count: 325, totalCost: 4062500, drugRatio: 52.3, materialRatio: 18.5, costIndex: 1.08 },
            { group: '急性心梗', avgCost: 28500, count: 125, totalCost: 3562500, drugRatio: 38.5, materialRatio: 32.8, costIndex: 1.15 },
            { group: '骨折', avgCost: 22500, count: 165, totalCost: 3712500, drugRatio: 32.5, materialRatio: 42.8, costIndex: 1.10 },
            { group: '糖尿病', avgCost: 8500, count: 285, totalCost: 2422500, drugRatio: 62.5, materialRatio: 15.2, costIndex: 1.05 },
            { group: '阑尾炎', avgCost: 9800, count: 145, totalCost: 1421000, drugRatio: 28.5, materialRatio: 25.8, costIndex: 1.02 },
            { group: '胆囊炎', avgCost: 12800, count: 115, totalCost: 1472000, drugRatio: 32.8, materialRatio: 28.5, costIndex: 1.04 },
            { group: '慢性肾病', avgCost: 25500, count: 95, totalCost: 2422500, drugRatio: 58.5, materialRatio: 22.5, costIndex: 1.18 },
            { group: '白内障', avgCost: 8200, count: 215, totalCost: 1763000, drugRatio: 22.5, materialRatio: 45.8, costIndex: 1.03 },
            { group: '胃肠炎', avgCost: 5800, count: 325, totalCost: 1885000, drugRatio: 45.8, materialRatio: 18.5, costIndex: 1.01 }
        ],
        
        // 预算执行数据
        budgetExecution: [
            { item: '药品费用', budget: 21500000, actual: 20430000, executionRate: 95.0, status: '良好' },
            { item: '卫生材料费用', budget: 10000000, actual: 9640000, executionRate: 96.4, status: '良好' },
            { item: '医疗服务费用', budget: 12000000, actual: 11580000, executionRate: 96.5, status: '良好' },
            { item: '设备购置', budget: 5000000, actual: 4800000, executionRate: 96.0, status: '良好' },
            { item: '设备维护', budget: 1200000, actual: 1150000, executionRate: 95.8, status: '良好' },
            { item: '人员费用', budget: 18500000, actual: 18250000, executionRate: 98.6, status: '良好' },
            { item: '能源消耗', budget: 1800000, actual: 1750000, executionRate: 97.2, status: '良好' },
            { item: '其他费用', budget: 6500000, actual: 7000000, executionRate: 107.7, status: '超预算' }
        ],
        
        // 预算趋势数据
        budgetTrend: [
            { month: '1月', budget: 38000000, actual: 37800000, executionRate: 99.5 },
            { month: '2月', budget: 36000000, actual: 36500000, executionRate: 101.4 },
            { month: '3月', budget: 40000000, actual: 40200000, executionRate: 100.5 },
            { month: '4月', budget: 41000000, actual: 41500000, executionRate: 101.2 },
            { month: '5月', budget: 42500000, actual: 42800000, executionRate: 100.7 },
            { month: '6月', budget: 44000000, actual: 44300000, executionRate: 100.7 },
            { month: '7月', budget: 45500000, actual: 45800000, executionRate: 100.7 },
            { month: '8月', budget: 47000000, actual: 47200000, executionRate: 100.4 },
            { month: '9月', budget: 47000000, actual: 46800000, executionRate: 99.6 },
            { month: '10月', budget: 49000000, actual: 48650000, executionRate: 99.3 }
        ]
    },
    
    // 初始化页面
    init: function() {
        this.initCharts();
        this.initEventListeners();
        this.loadData();
        this.renderOverviewCards();
        this.renderDepartmentCostTable();
        this.renderDrgsCostTable();
        this.renderBudgetExecutionTable();
    },
    
    // 初始化图表
    initCharts: function() {
        // 初始化图表实例
        this.state.charts.costTrendChart = echarts.init(document.getElementById('costTrendChart'));
        this.state.charts.costStructureChart = echarts.init(document.getElementById('costStructureChart'));
        this.state.charts.drugCostTrendChart = echarts.init(document.getElementById('drugCostTrendChart'));
        this.state.charts.materialCostTrendChart = echarts.init(document.getElementById('materialCostTrendChart'));
        this.state.charts.drugCategoryChart = echarts.init(document.getElementById('drugCategoryChart'));
        this.state.charts.highCostDrugsChart = echarts.init(document.getElementById('highCostDrugsChart'));
        this.state.charts.drgsCostChart = echarts.init(document.getElementById('drgsCostChart'));
        this.state.charts.budgetExecutionChart = echarts.init(document.getElementById('budgetExecutionChart'));
        this.state.charts.budgetTrendChart = echarts.init(document.getElementById('budgetTrendChart'));
        
        // 设置窗口大小改变时的响应
        window.addEventListener('resize', function() {
            for (var chartKey in DepartmentCostControlPage.state.charts) {
                if (DepartmentCostControlPage.state.charts[chartKey]) {
                    DepartmentCostControlPage.state.charts[chartKey].resize();
                }
            }
        });
        
        // 初始化各图表
        this.initCostTrendChart();
        this.initCostStructureChart();
        this.initDrugCostTrendChart();
        this.initMaterialCostTrendChart();
        this.initDrugCategoryChart();
        this.initHighCostDrugsChart();
        this.initDrgsCostChart();
        this.initBudgetExecutionChart();
        this.initBudgetTrendChart();
    },
    
    // 初始化事件监听器
    initEventListeners: function() {
        // 科室选择事件
        document.getElementById('departmentSelect').addEventListener('change', function() {
            DepartmentCostControlPage.state.currentDepartment = this.value;
            DepartmentCostControlPage.refreshData();
        });
        
        // 日期范围选择事件
        document.getElementById('dateRangePicker').addEventListener('change', function() {
            var value = this.value.split(' - ');
            if (value.length === 2) {
                DepartmentCostControlPage.state.dateRange.start = value[0];
                DepartmentCostControlPage.state.dateRange.end = value[1];
                DepartmentCostControlPage.refreshData();
            }
        });
        
        // 费用类型选择事件
        document.getElementById('costTypeSelect').addEventListener('change', function() {
            DepartmentCostControlPage.state.costType = this.value;
            DepartmentCostControlPage.refreshData();
        });
        
        // 报告类型选择事件
        document.getElementById('reportTypeSelect').addEventListener('change', function() {
            DepartmentCostControlPage.state.reportType = this.value;
            DepartmentCostControlPage.refreshData();
        });
        
        // 刷新按钮事件
        document.getElementById('refreshBtn').addEventListener('click', function() {
            DepartmentCostControlPage.refreshData();
        });
        
        // 导出按钮事件
        document.getElementById('exportBtn').addEventListener('click', function() {
            DepartmentCostControlPage.exportReport();
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
                
                // 如果切换到DRGs或预算分析标签，需要更新图表
                if (tabId === 'drgs') {
                    DepartmentCostControlPage.updateDrgsCostChart();
                } else if (tabId === 'budget') {
                    DepartmentCostControlPage.updateBudgetExecutionChart();
                    DepartmentCostControlPage.updateBudgetTrendChart();
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
    
    // 刷新数据
    refreshData: function() {
        // 显示加载状态
        this.showLoading(true);
        
        // 模拟数据加载延迟
        setTimeout(function() {
            // 更新概览卡片
            DepartmentCostControlPage.renderOverviewCards();
            
            // 更新所有图表
            DepartmentCostControlPage.updateAllCharts();
            
            // 更新表格数据
            DepartmentCostControlPage.renderDepartmentCostTable();
            DepartmentCostControlPage.renderDrgsCostTable();
            DepartmentCostControlPage.renderBudgetExecutionTable();
            
            // 隐藏加载状态
            DepartmentCostControlPage.showLoading(false);
        }, 500);
    },
    
    // 显示/隐藏加载状态
    showLoading: function(show) {
        var loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = show ? 'flex' : 'none';
        }
    },
    
    // 渲染概览卡片
    renderOverviewCards: function() {
        // 获取当前科室数据
        var currentData = this.mockData.departmentCost.find(function(item) {
            if (DepartmentCostControlPage.state.currentDepartment === 'all') {
                return true; // 返回第一个数据作为全部科室的代表
            }
            return item.dept === DepartmentCostControlPage.getDepartmentName(DepartmentCostControlPage.state.currentDepartment);
        });
        
        if (!currentData) {
            currentData = this.mockData.departmentCost[0]; // 默认使用第一个科室数据
        }
        
        // 更新概览卡片数据
        document.getElementById('totalCostValue').textContent = this.formatCurrency(currentData.totalCost);
        document.getElementById('totalCostGrowth').textContent = (currentData.yearOnYear >= 0 ? '+' : '') + currentData.yearOnYear + '%';
        document.getElementById('totalCostGrowth').className = currentData.yearOnYear >= 0 ? 'extra-value positive' : 'extra-value negative';
        
        document.getElementById('drugCostValue').textContent = this.formatCurrency(currentData.drugCost);
        var drugRatio = ((currentData.drugCost / currentData.totalCost) * 100).toFixed(1);
        document.getElementById('drugCostRatio').textContent = drugRatio + '%';
        
        document.getElementById('materialCostValue').textContent = this.formatCurrency(currentData.materialCost);
        var materialRatio = ((currentData.materialCost / currentData.totalCost) * 100).toFixed(1);
        document.getElementById('materialCostRatio').textContent = materialRatio + '%';
        
        document.getElementById('consumptionPer100Value').textContent = '¥' + currentData.consumptionPer100.toFixed(1);
        // 模拟百元医疗收入消耗同比数据
        var consumptionGrowth = -2.4;
        document.getElementById('consumptionPer100Growth').textContent = (consumptionGrowth >= 0 ? '+' : '') + consumptionGrowth + '%';
        document.getElementById('consumptionPer100Growth').className = consumptionGrowth >= 0 ? 'extra-value positive' : 'extra-value negative';
        
        document.getElementById('costRateValue').textContent = currentData.costRate.toFixed(1) + '%';
        // 模拟成本率同比数据
        var costRateGrowth = -2.3;
        document.getElementById('costRateGrowth').textContent = (costRateGrowth >= 0 ? '+' : '') + costRateGrowth + '%';
        document.getElementById('costRateGrowth').className = costRateGrowth >= 0 ? 'extra-value positive' : 'extra-value negative';
        
        // 模拟预算执行率数据
        var budgetExecutionRate = 96.5;
        document.getElementById('budgetExecutionValue').textContent = budgetExecutionRate.toFixed(1) + '%';
        var budgetStatus = budgetExecutionRate >= 100 ? '超预算' : budgetExecutionRate >= 90 ? '良好' : '不足';
        document.getElementById('budgetStatus').textContent = budgetStatus;
        document.getElementById('budgetStatus').className = budgetStatus === '超预算' ? 'extra-value negative' : 
                                                          budgetStatus === '良好' ? 'extra-value normal' : 'extra-value warning';
    },
    
    // 渲染科室费用对比表格
    renderDepartmentCostTable: function() {
        var tableBody = document.getElementById('departmentCostTable');
        if (!tableBody) return;
        
        // 清空表格
        while (tableBody.firstChild) {
            tableBody.removeChild(tableBody.firstChild);
        }
        
        // 遍历数据并添加行
        this.mockData.departmentCost.forEach(function(deptData) {
            var row = document.createElement('tr');
            
            // 设置行样式（当前选中的科室高亮显示）
            if (DepartmentCostControlPage.state.currentDepartment !== 'all' && 
                deptData.dept === DepartmentCostControlPage.getDepartmentName(DepartmentCostControlPage.state.currentDepartment)) {
                row.className = 'highlight';
            }
            
            row.innerHTML = `
                <td>${deptData.dept}</td>
                <td>${DepartmentCostControlPage.formatCurrency(deptData.totalCost)}</td>
                <td>${DepartmentCostControlPage.formatCurrency(deptData.drugCost)}</td>
                <td>${DepartmentCostControlPage.formatCurrency(deptData.materialCost)}</td>
                <td>${deptData.consumptionPer100.toFixed(1)}</td>
                <td>${deptData.costRate.toFixed(1)}</td>
                <td class="${deptData.yearOnYear >= 0 ? 'positive' : 'negative'}">
                    ${deptData.yearOnYear >= 0 ? '+' : ''}${deptData.yearOnYear.toFixed(1)}
                </td>
                <td class="${deptData.monthOnMonth >= 0 ? 'positive' : 'negative'}">
                    ${deptData.monthOnMonth >= 0 ? '+' : ''}${deptData.monthOnMonth.toFixed(1)}
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    },
    
    // 渲染DRGs费用分析表格
    renderDrgsCostTable: function() {
        var tableBody = document.getElementById('drgsCostTable');
        if (!tableBody) return;
        
        // 清空表格
        while (tableBody.firstChild) {
            tableBody.removeChild(tableBody.firstChild);
        }
        
        // 遍历数据并添加行
        this.mockData.drgsCost.forEach(function(drgData) {
            var row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${drgData.group}</td>
                <td>${DepartmentCostControlPage.formatCurrency(drgData.avgCost)}</td>
                <td>${drgData.count}</td>
                <td>${DepartmentCostControlPage.formatCurrency(drgData.totalCost)}</td>
                <td>${drgData.drugRatio.toFixed(1)}</td>
                <td>${drgData.materialRatio.toFixed(1)}</td>
                <td>${drgData.costIndex.toFixed(2)}</td>
            `;
            
            tableBody.appendChild(row);
        });
    },
    
    // 渲染预算执行分析表格
    renderBudgetExecutionTable: function() {
        var tableBody = document.getElementById('budgetExecutionTable');
        if (!tableBody) return;
        
        // 清空表格
        while (tableBody.firstChild) {
            tableBody.removeChild(tableBody.firstChild);
        }
        
        // 遍历数据并添加行
        this.mockData.budgetExecution.forEach(function(budgetData) {
            var row = document.createElement('tr');
            
            // 根据预算状态设置样式
            var statusClass = '';
            switch (budgetData.status) {
                case '超预算':
                    statusClass = 'status-over';
                    break;
                case '良好':
                    statusClass = 'status-good';
                    break;
                case '不足':
                    statusClass = 'status-insufficient';
                    break;
                default:
                    statusClass = 'status-normal';
            }
            
            row.innerHTML = `
                <td>${budgetData.item}</td>
                <td>${DepartmentCostControlPage.formatCurrency(budgetData.budget)}</td>
                <td>${DepartmentCostControlPage.formatCurrency(budgetData.actual)}</td>
                <td class="${budgetData.executionRate >= 100 ? 'negative' : 'positive'}">
                    ${budgetData.executionRate.toFixed(1)}
                </td>
                <td><span class="status-badge ${statusClass}">${budgetData.status}</span></td>
            `;
            
            tableBody.appendChild(row);
        });
    },
    
    // 更新所有图表
    updateAllCharts: function() {
        this.updateCostTrendChart();
        this.updateCostStructureChart();
        this.updateDrugCostTrendChart();
        this.updateMaterialCostTrendChart();
        this.updateDrugCategoryChart();
        this.updateHighCostDrugsChart();
        this.updateDrgsCostChart();
        this.updateBudgetExecutionChart();
        this.updateBudgetTrendChart();
    },
    
    // 初始化费用趋势图
    initCostTrendChart: function() {
        var option = {
            title: {
                text: '费用趋势分析',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                formatter: function(params) {
                    var result = params[0].name + '<br/>';
                    params.forEach(function(param) {
                        result += param.marker + param.seriesName + ': ¥' + 
                            (param.value / 10000).toFixed(1) + '万<br/>';
                    });
                    return result;
                }
            },
            legend: {
                data: ['总费用', '药品费用', '材料费用', '医疗服务费用', '其他费用'],
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
                data: this.mockData.costTrend.map(function(item) { return item.month; })
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: function(value) {
                        return (value / 10000).toFixed(0) + '万';
                    }
                }
            },
            series: [
                {
                    name: '总费用',
                    type: 'line',
                    data: this.mockData.costTrend.map(function(item) { return item.totalCost; }),
                    smooth: true,
                    lineStyle: {
                        width: 3
                    }
                },
                {
                    name: '药品费用',
                    type: 'line',
                    data: this.mockData.costTrend.map(function(item) { return item.drugCost; }),
                    smooth: true
                },
                {
                    name: '材料费用',
                    type: 'line',
                    data: this.mockData.costTrend.map(function(item) { return item.materialCost; }),
                    smooth: true
                },
                {
                    name: '医疗服务费用',
                    type: 'line',
                    data: this.mockData.costTrend.map(function(item) { return item.serviceCost; }),
                    smooth: true
                },
                {
                    name: '其他费用',
                    type: 'line',
                    data: this.mockData.costTrend.map(function(item) { return item.otherCost; }),
                    smooth: true
                }
            ]
        };
        
        this.state.charts.costTrendChart.setOption(option);
    },
    
    // 更新费用趋势图
    updateCostTrendChart: function() {
        // 根据费用类型筛选数据
        var filteredData = this.mockData.costTrend;
        
        // 更新图表数据
        this.state.charts.costTrendChart.setOption({
            series: [
                {
                    data: filteredData.map(function(item) { return item.totalCost; })
                },
                {
                    data: filteredData.map(function(item) { return item.drugCost; })
                },
                {
                    data: filteredData.map(function(item) { return item.materialCost; })
                },
                {
                    data: filteredData.map(function(item) { return item.serviceCost; })
                },
                {
                    data: filteredData.map(function(item) { return item.otherCost; })
                }
            ]
        });
    },
    
    // 初始化费用结构图
    initCostStructureChart: function() {
        var option = {
            title: {
                text: '费用结构分析',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    return params.seriesName + '<br/>' + params.name + ': ¥' + 
                        (params.value / 10000).toFixed(1) + '万 (' + params.percent + '%)';
                }
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                bottom: 10
            },
            series: [
                {
                    name: '费用类型',
                    type: 'pie',
                    radius: '60%',
                    center: ['50%', '45%'],
                    data: this.mockData.costStructure,
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
        
        this.state.charts.costStructureChart.setOption(option);
    },
    
    // 更新费用结构图
    updateCostStructureChart: function() {
        // 费用结构数据通常是固定的，这里使用固定数据
    },
    
    // 初始化药品费用趋势图
    initDrugCostTrendChart: function() {
        var option = {
            title: {
                text: '药品费用趋势分析',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                formatter: function(params) {
                    var result = params[0].name + '<br/>';
                    params.forEach(function(param) {
                        result += param.marker + param.seriesName + ': ¥' + 
                            (param.value / 10000).toFixed(1) + '万<br/>';
                    });
                    return result;
                }
            },
            legend: {
                data: ['西药', '中成药', '生物制品'],
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
                data: this.mockData.drugCostTrend.map(function(item) { return item.month; })
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: function(value) {
                        return (value / 10000).toFixed(0) + '万';
                    }
                }
            },
            series: [
                {
                    name: '西药',
                    type: 'line',
                    data: this.mockData.drugCostTrend.map(function(item) { return item.western; }),
                    smooth: true,
                    areaStyle: {
                        opacity: 0.3
                    }
                },
                {
                    name: '中成药',
                    type: 'line',
                    data: this.mockData.drugCostTrend.map(function(item) { return item.traditional; }),
                    smooth: true,
                    areaStyle: {
                        opacity: 0.3
                    }
                },
                {
                    name: '生物制品',
                    type: 'line',
                    data: this.mockData.drugCostTrend.map(function(item) { return item.biological; }),
                    smooth: true,
                    areaStyle: {
                        opacity: 0.3
                    }
                }
            ]
        };
        
        this.state.charts.drugCostTrendChart.setOption(option);
    },
    
    // 更新药品费用趋势图
    updateDrugCostTrendChart: function() {
        // 药品费用趋势数据通常是固定的，这里使用固定数据
    },
    
    // 初始化材料费用趋势图
    initMaterialCostTrendChart: function() {
        var option = {
            title: {
                text: '材料费用趋势分析',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                formatter: function(params) {
                    var result = params[0].name + '<br/>';
                    params.forEach(function(param) {
                        result += param.marker + param.seriesName + ': ¥' + 
                            (param.value / 10000).toFixed(1) + '万<br/>';
                    });
                    return result;
                }
            },
            legend: {
                data: ['高值耗材', '低值耗材'],
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
                data: this.mockData.materialCostTrend.map(function(item) { return item.month; })
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: function(value) {
                        return (value / 10000).toFixed(0) + '万';
                    }
                }
            },
            series: [
                {
                    name: '高值耗材',
                    type: 'line',
                    data: this.mockData.materialCostTrend.map(function(item) { return item.highValue; }),
                    smooth: true,
                    areaStyle: {
                        opacity: 0.3
                    }
                },
                {
                    name: '低值耗材',
                    type: 'line',
                    data: this.mockData.materialCostTrend.map(function(item) { return item.lowValue; }),
                    smooth: true,
                    areaStyle: {
                        opacity: 0.3
                    }
                }
            ]
        };
        
        this.state.charts.materialCostTrendChart.setOption(option);
    },
    
    // 更新材料费用趋势图
    updateMaterialCostTrendChart: function() {
        // 材料费用趋势数据通常是固定的，这里使用固定数据
    },
    
    // 初始化药品分类图
    initDrugCategoryChart: function() {
        var option = {
            title: {
                text: '药品分类费用分析',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    return params.seriesName + '<br/>' + params.name + ': ¥' + 
                        (params.value / 10000).toFixed(1) + '万 (' + params.percent + '%)';
                }
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                bottom: 10
            },
            series: [
                {
                    name: '药品类别',
                    type: 'pie',
                    radius: '60%',
                    center: ['50%', '45%'],
                    data: this.mockData.drugCategory,
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
        
        this.state.charts.drugCategoryChart.setOption(option);
    },
    
    // 更新药品分类图
    updateDrugCategoryChart: function() {
        // 药品分类数据通常是固定的，这里使用固定数据
    },
    
    // 初始化高价药品图
    initHighCostDrugsChart: function() {
        var option = {
            title: {
                text: '高价药品分析',
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
                        if (param.seriesName === '总费用') {
                            result += param.marker + param.seriesName + ': ¥' + 
                                (param.value / 10000).toFixed(1) + '万<br/>';
                        } else if (param.seriesName === '例均费用') {
                            result += param.marker + param.seriesName + ': ¥' + param.value.toFixed(0) + '<br/>';
                        } else {
                            result += param.marker + param.seriesName + ': ' + param.value + '<br/>';
                        }
                    });
                    return result;
                }
            },
            legend: {
                data: ['总费用', '例均费用'],
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
                data: this.mockData.highCostDrugs.map(function(item) { return item.name; }),
                axisLabel: {
                    interval: 0,
                    rotate: 30
                }
            },
            yAxis: [
                {
                    type: 'value',
                    name: '总费用(万元)',
                    position: 'left',
                    axisLabel: {
                        formatter: function(value) {
                            return (value / 10000).toFixed(0) + '万';
                        }
                    }
                },
                {
                    type: 'value',
                    name: '例均费用(元)',
                    position: 'right',
                    min: 0,
                    max: 15000
                }
            ],
            series: [
                {
                    name: '总费用',
                    type: 'bar',
                    data: this.mockData.highCostDrugs.map(function(item) { return item.cost; }),
                    itemStyle: {
                        color: '#1890ff'
                    }
                },
                {
                    name: '例均费用',
                    type: 'line',
                    yAxisIndex: 1,
                    data: this.mockData.highCostDrugs.map(function(item) { return item.avgCost; }),
                    smooth: true,
                    lineStyle: {
                        width: 3
                    },
                    itemStyle: {
                        color: '#ff4d4f'
                    },
                    symbolSize: 10
                }
            ]
        };
        
        this.state.charts.highCostDrugsChart.setOption(option);
    },
    
    // 更新高价药品图
    updateHighCostDrugsChart: function() {
        // 高价药品数据通常是固定的，这里使用固定数据
    },
    
    // 初始化DRGs费用图
    initDrgsCostChart: function() {
        var option = {
            title: {
                text: 'DRGs例均费用分析',
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
                        } else if (param.seriesName === '费用指数') {
                            result += param.marker + param.seriesName + ': ' + param.value.toFixed(2) + '<br/>';
                        } else {
                            result += param.marker + param.seriesName + ': ' + param.value + '%<br/>';
                        }
                    });
                    return result;
                }
            },
            legend: {
                data: ['例均费用', '药品占比', '材料占比', '费用指数'],
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
                data: this.mockData.drgsCost.map(function(item) { return item.group; }),
                axisLabel: {
                    interval: 0,
                    rotate: 30
                }
            },
            yAxis: [
                {
                    type: 'value',
                    name: '例均费用(元)',
                    position: 'left',
                    axisLabel: {
                        formatter: '{value}'
                    }
                },
                {
                    type: 'value',
                    name: '比率/指数',
                    position: 'right',
                    min: 0,
                    max: 1.2,
                    axisLabel: {
                        formatter: '{value}'
                    }
                }
            ],
            series: [
                {
                    name: '例均费用',
                    type: 'bar',
                    data: this.mockData.drgsCost.map(function(item) { return item.avgCost; }),
                    itemStyle: {
                        color: '#1890ff'
                    }
                },
                {
                    name: '药品占比',
                    type: 'line',
                    yAxisIndex: 1,
                    data: this.mockData.drgsCost.map(function(item) { return item.drugRatio / 100; }),
                    smooth: true
                },
                {
                    name: '材料占比',
                    type: 'line',
                    yAxisIndex: 1,
                    data: this.mockData.drgsCost.map(function(item) { return item.materialRatio / 100; }),
                    smooth: true
                },
                {
                    name: '费用指数',
                    type: 'line',
                    yAxisIndex: 1,
                    data: this.mockData.drgsCost.map(function(item) { return item.costIndex; }),
                    smooth: true,
                    lineStyle: {
                        width: 3
                    },
                    itemStyle: {
                        color: '#ff4d4f'
                    },
                    symbolSize: 10
                }
            ]
        };
        
        this.state.charts.drgsCostChart.setOption(option);
    },
    
    // 更新DRGs费用图
    updateDrgsCostChart: function() {
        // DRGs费用数据通常是固定的，这里使用固定数据
    },
    
    // 初始化预算执行图
    initBudgetExecutionChart: function() {
        var option = {
            title: {
                text: '预算执行情况分析',
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
                        if (param.seriesName === '预算金额' || param.seriesName === '实际支出') {
                            result += param.marker + param.seriesName + ': ¥' + 
                                (param.value / 10000).toFixed(1) + '万<br/>';
                        } else {
                            result += param.marker + param.seriesName + ': ' + param.value.toFixed(1) + '%<br/>';
                        }
                    });
                    return result;
                }
            },
            legend: {
                data: ['预算金额', '实际支出', '执行率'],
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
                data: this.mockData.budgetExecution.map(function(item) { return item.item; }),
                axisLabel: {
                    interval: 0,
                    rotate: 30
                }
            },
            yAxis: [
                {
                    type: 'value',
                    name: '金额(万元)',
                    position: 'left',
                    axisLabel: {
                        formatter: function(value) {
                            return (value / 10000).toFixed(0) + '万';
                        }
                    }
                },
                {
                    type: 'value',
                    name: '执行率(%)',
                    position: 'right',
                    min: 80,
                    max: 120,
                    axisLabel: {
                        formatter: '{value}%'
                    }
                }
            ],
            series: [
                {
                    name: '预算金额',
                    type: 'bar',
                    data: this.mockData.budgetExecution.map(function(item) { return item.budget; }),
                    itemStyle: {
                        color: '#52c41a'
                    }
                },
                {
                    name: '实际支出',
                    type: 'bar',
                    data: this.mockData.budgetExecution.map(function(item) { return item.actual; }),
                    itemStyle: {
                        color: '#1890ff'
                    }
                },
                {
                    name: '执行率',
                    type: 'line',
                    yAxisIndex: 1,
                    data: this.mockData.budgetExecution.map(function(item) { return item.executionRate; }),
                    smooth: true,
                    lineStyle: {
                        width: 3
                    },
                    itemStyle: {
                        color: '#ff4d4f'
                    },
                    symbolSize: 10
                }
            ]
        };
        
        this.state.charts.budgetExecutionChart.setOption(option);
    },
    
    // 更新预算执行图
    updateBudgetExecutionChart: function() {
        // 预算执行数据通常是固定的，这里使用固定数据
    },
    
    // 初始化预算趋势图
    initBudgetTrendChart: function() {
        var option = {
            title: {
                text: '预算执行趋势分析',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                formatter: function(params) {
                    var result = params[0].name + '<br/>';
                    params.forEach(function(param) {
                        if (param.seriesName === '预算金额' || param.seriesName === '实际支出') {
                            result += param.marker + param.seriesName + ': ¥' + 
                                (param.value / 10000).toFixed(1) + '万<br/>';
                        } else {
                            result += param.marker + param.seriesName + ': ' + param.value.toFixed(1) + '%<br/>';
                        }
                    });
                    return result;
                }
            },
            legend: {
                data: ['预算金额', '实际支出', '执行率'],
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
                data: this.mockData.budgetTrend.map(function(item) { return item.month; })
            },
            yAxis: [
                {
                    type: 'value',
                    name: '金额(万元)',
                    position: 'left',
                    axisLabel: {
                        formatter: function(value) {
                            return (value / 10000).toFixed(0) + '万';
                        }
                    }
                },
                {
                    type: 'value',
                    name: '执行率(%)',
                    position: 'right',
                    min: 95,
                    max: 105,
                    axisLabel: {
                        formatter: '{value}%'
                    }
                }
            ],
            series: [
                {
                    name: '预算金额',
                    type: 'line',
                    data: this.mockData.budgetTrend.map(function(item) { return item.budget; }),
                    smooth: true,
                    lineStyle: {
                        width: 3
                    },
                    itemStyle: {
                        color: '#52c41a'
                    }
                },
                {
                    name: '实际支出',
                    type: 'line',
                    data: this.mockData.budgetTrend.map(function(item) { return item.actual; }),
                    smooth: true,
                    lineStyle: {
                        width: 3
                    },
                    itemStyle: {
                        color: '#1890ff'
                    }
                },
                {
                    name: '执行率',
                    type: 'line',
                    yAxisIndex: 1,
                    data: this.mockData.budgetTrend.map(function(item) { return item.executionRate; }),
                    smooth: true,
                    lineStyle: {
                        width: 3,
                        type: 'dashed'
                    },
                    itemStyle: {
                        color: '#ff4d4f'
                    },
                    symbolSize: 10
                }
            ]
        };
        
        this.state.charts.budgetTrendChart.setOption(option);
    },
    
    // 更新预算趋势图
    updateBudgetTrendChart: function() {
        // 预算趋势数据通常是固定的，这里使用固定数据
    },
    
    // 导出报告
    exportReport: function() {
        alert('科室费用控制分析报告导出功能已触发，实际项目中会生成并下载PDF或Excel报告');
        // 实际项目中，这里会调用后端API生成报告并下载
    },
    
    // 格式化货币
    formatCurrency: function(value) {
        if (typeof value !== 'number') return value;
        
        if (value >= 10000) {
            return '¥' + (value / 10000).toFixed(1) + '万';
        }
        
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
        DepartmentCostControlPage.init();
    } else {
        const onReady = function() {
            document.removeEventListener('echartsLoaded', onReady);
            DepartmentCostControlPage.init();
        };
        document.addEventListener('echartsLoaded', onReady);
    }
});