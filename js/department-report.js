// 科室运营报告页面逻辑
var DepartmentReportPage = {
    // 页面状态
    state: {
        currentDepartment: '',
        dateRange: {
            start: '',
            end: ''
        },
        reportType: 'monthly', // monthly, quarterly, yearly
        charts: {
            keyIndicatorsChart: null,
            workloadTrendChart: null,
            qualityTrendChart: null,
            economicTrendChart: null,
            efficiencyTrendChart: null,
            problemDistributionChart: null,
            improvementChart: null,
            workloadStructureChart: null,
            revenueStructureChart: null
        }
    },
    
    // 模拟数据
    mockData: {
        // 关键指标数据
        keyIndicators: {
            workload: {
                current: 12580,
                previous: 11630,
                growthRate: 8.2,
                target: 12000,
                completionRate: 104.8
            },
            quality: {
                current: 96.2,
                previous: 95.7,
                growthRate: 0.5,
                target: 95.0,
                completionRate: 101.3
            },
            economic: {
                current: 48650000,
                previous: 44920000,
                growthRate: 8.3,
                target: 46000000,
                completionRate: 105.8
            },
            efficiency: {
                current: 88.5,
                previous: 87.2,
                growthRate: 1.3,
                target: 85.0,
                completionRate: 104.1
            }
        },
        
        // 工作量分析数据
        workloadAnalysis: {
            monthly: [
                { month: '1月', outpatient: 10250, emergency: 1580, inpatient: 2350, surgery: 1120 },
                { month: '2月', outpatient: 9800, emergency: 1450, inpatient: 2200, surgery: 1050 },
                { month: '3月', outpatient: 11500, emergency: 1650, inpatient: 2580, surgery: 1250 },
                { month: '4月', outpatient: 11800, emergency: 1720, inpatient: 2620, surgery: 1300 },
                { month: '5月', outpatient: 12200, emergency: 1780, inpatient: 2700, surgery: 1350 },
                { month: '6月', outpatient: 12800, emergency: 1820, inpatient: 2780, surgery: 1380 },
                { month: '7月', outpatient: 13200, emergency: 1850, inpatient: 2820, surgery: 1400 },
                { month: '8月', outpatient: 13500, emergency: 1920, inpatient: 2860, surgery: 1410 },
                { month: '9月', outpatient: 13100, emergency: 1880, inpatient: 2840, surgery: 1430 },
                { month: '10月', outpatient: 12580, emergency: 1850, inpatient: 2856, surgery: 1423 }
            ],
            workloadStructure: [
                { name: '门诊', value: 12580 },
                { name: '住院', value: 2856 },
                { name: '手术', value: 1423 }
            ]
        },
        
        // 医疗质量分析数据
        qualityAnalysis: {
            monthly: [
                { month: '1月', satisfaction: 93.2, complication: 1.8, infection: 3.5, readmission: 2.3 },
                { month: '2月', satisfaction: 93.5, complication: 1.7, infection: 3.4, readmission: 2.2 },
                { month: '3月', satisfaction: 93.8, complication: 1.6, infection: 3.3, readmission: 2.1 },
                { month: '4月', satisfaction: 94.2, complication: 1.5, infection: 3.2, readmission: 2.0 },
                { month: '5月', satisfaction: 94.5, complication: 1.5, infection: 3.2, readmission: 1.9 },
                { month: '6月', satisfaction: 94.7, complication: 1.4, infection: 3.1, readmission: 1.8 },
                { month: '7月', satisfaction: 95.0, complication: 1.4, infection: 3.1, readmission: 1.8 },
                { month: '8月', satisfaction: 95.3, complication: 1.3, infection: 3.0, readmission: 1.7 },
                { month: '9月', satisfaction: 95.5, complication: 1.3, infection: 3.0, readmission: 1.7 },
                { month: '10月', satisfaction: 95.8, complication: 1.2, infection: 2.9, readmission: 1.6 }
            ],
            qualityIndicators: [
                { name: '甲级病案率', value: 96.2 },
                { name: '处方合格率', value: 98.5 },
                { name: '三日确诊率', value: 92.8 },
                { name: '手术并发症发生率', value: 1.5 },
                { name: '医院感染率', value: 3.2 }
            ]
        },
        
        // 经济运行分析数据
        economicAnalysis: {
            monthly: [
                { month: '1月', revenue: 37800000, profit: 11300000, costRate: 69.5 },
                { month: '2月', revenue: 36500000, profit: 10700000, costRate: 70.7 },
                { month: '3月', revenue: 40200000, profit: 11900000, costRate: 70.4 },
                { month: '4月', revenue: 41500000, profit: 12400000, costRate: 69.9 },
                { month: '5月', revenue: 42800000, profit: 13000000, costRate: 69.6 },
                { month: '6月', revenue: 44300000, profit: 13700000, costRate: 69.1 },
                { month: '7月', revenue: 45800000, profit: 14600000, costRate: 68.1 },
                { month: '8月', revenue: 47200000, profit: 15200000, costRate: 67.8 },
                { month: '9月', revenue: 46800000, profit: 15000000, costRate: 67.9 },
                { month: '10月', revenue: 48650000, profit: 15750000, costRate: 67.7 }
            ],
            revenueStructure: [
                { name: '医疗服务收入', value: 18580000 },
                { name: '药品收入', value: 20430000 },
                { name: '卫生材料收入', value: 9640000 }
            ]
        },
        
        // 医疗效率分析数据
        efficiencyAnalysis: {
            monthly: [
                { month: '1月', bedOccupancy: 85.2, avgStay: 8.2, bedTurnover: 30.5, outpatientWaiting: 18 },
                { month: '2月', bedOccupancy: 84.8, avgStay: 8.3, bedTurnover: 30.2, outpatientWaiting: 17 },
                { month: '3月', bedOccupancy: 86.5, avgStay: 8.1, bedTurnover: 31.0, outpatientWaiting: 19 },
                { month: '4月', bedOccupancy: 87.2, avgStay: 8.0, bedTurnover: 31.5, outpatientWaiting: 18.5 },
                { month: '5月', bedOccupancy: 87.8, avgStay: 7.9, bedTurnover: 31.8, outpatientWaiting: 19.2 },
                { month: '6月', bedOccupancy: 88.0, avgStay: 7.9, bedTurnover: 32.0, outpatientWaiting: 18.8 },
                { month: '7月', bedOccupancy: 88.2, avgStay: 7.8, bedTurnover: 32.2, outpatientWaiting: 20.1 },
                { month: '8月', bedOccupancy: 88.4, avgStay: 7.8, bedTurnover: 32.3, outpatientWaiting: 21.5 },
                { month: '9月', bedOccupancy: 88.3, avgStay: 7.8, bedTurnover: 32.3, outpatientWaiting: 20.8 },
                { month: '10月', bedOccupancy: 88.5, avgStay: 7.8, bedTurnover: 32.4, outpatientWaiting: 20.5 }
            ]
        },
        
        // 问题与建议数据
        problemSuggestion: {
            problems: [
                { name: '门诊等待时间过长', severity: 80 },
                { name: '住院床位紧张', severity: 75 },
                { name: '手术预约等待时间长', severity: 70 },
                { name: '患者满意度仍有提升空间', severity: 65 },
                { name: '部分医疗设备使用率不足', severity: 60 }
            ],
            suggestions: [
                '优化门诊流程，增加预约挂号比例，减少患者等待时间',
                '合理安排病床使用，提高床位周转率',
                '优化手术安排，增加手术台次，缩短手术预约等待时间',
                '加强医患沟通，提高医疗服务质量，提升患者满意度',
                '加强设备管理，提高设备使用效率，降低运行成本'
            ]
        },
        
        // 下阶段工作计划数据
        nextPlan: [
            {
                name: '完善医疗质量管理体系',
                priority: 90,
                deadline: '2024-11-30',
                status: '进行中'
            },
            {
                name: '优化医疗服务流程',
                priority: 85,
                deadline: '2024-12-15',
                status: '已开始'
            },
            {
                name: '加强人才培养和团队建设',
                priority: 80,
                deadline: '2025-01-31',
                status: '计划中'
            },
            {
                name: '推进信息化建设',
                priority: 75,
                deadline: '2025-02-28',
                status: '计划中'
            },
            {
                name: '优化成本控制措施',
                priority: 70,
                deadline: '2024-12-31',
                status: '已开始'
            }
        ]
    },
    
    // 初始化页面
    init: function() {
        this.initCharts();
        this.initEventListeners();
        this.loadData();
        this.renderReportContent();
    },
    
    // 初始化图表
    initCharts: function() {
        // 初始化图表实例
        this.state.charts.keyIndicatorsChart = echarts.init(document.getElementById('keyIndicatorsChart'));
        this.state.charts.workloadTrendChart = echarts.init(document.getElementById('workloadTrendChart'));
        this.state.charts.qualityTrendChart = echarts.init(document.getElementById('qualityTrendChart'));
        this.state.charts.economicTrendChart = echarts.init(document.getElementById('economicTrendChart'));
        this.state.charts.efficiencyTrendChart = echarts.init(document.getElementById('efficiencyTrendChart'));
        this.state.charts.problemDistributionChart = echarts.init(document.getElementById('problemDistributionChart'));
        this.state.charts.improvementChart = echarts.init(document.getElementById('improvementChart'));
        this.state.charts.workloadStructureChart = echarts.init(document.getElementById('workloadStructureChart'));
        this.state.charts.revenueStructureChart = echarts.init(document.getElementById('revenueStructureChart'));
        
        // 设置窗口大小改变时的响应
        window.addEventListener('resize', function() {
            for (var chartKey in DepartmentReportPage.state.charts) {
                if (DepartmentReportPage.state.charts[chartKey]) {
                    DepartmentReportPage.state.charts[chartKey].resize();
                }
            }
        });
        
        // 初始化各图表
        this.initKeyIndicatorsChart();
        this.initWorkloadTrendChart();
        this.initQualityTrendChart();
        this.initEconomicTrendChart();
        this.initEfficiencyTrendChart();
        this.initProblemDistributionChart();
        this.initImprovementChart();
        this.initWorkloadStructureChart();
        this.initRevenueStructureChart();
    },
    
    // 初始化事件监听器
    initEventListeners: function() {
        // 报告类型选择事件
        document.querySelectorAll('.report-type-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.report-type-btn').forEach(function(b) {
                    b.classList.remove('active');
                });
                this.classList.add('active');
                DepartmentReportPage.state.reportType = this.dataset.type;
                DepartmentReportPage.refreshData();
            });
        });
        
        // 日期范围选择事件
        document.getElementById('dateRangePicker').addEventListener('change', function() {
            var value = this.value.split(' - ');
            if (value.length === 2) {
                DepartmentReportPage.state.dateRange.start = value[0];
                DepartmentReportPage.state.dateRange.end = value[1];
                DepartmentReportPage.refreshData();
            }
        });
        
        // 科室选择事件
        document.getElementById('departmentSelect').addEventListener('change', function() {
            DepartmentReportPage.state.currentDepartment = this.value;
            DepartmentReportPage.refreshData();
        });
        
        // 刷新按钮事件
        document.getElementById('refreshBtn').addEventListener('click', function() {
            DepartmentReportPage.refreshData();
        });
        
        // 导出按钮事件
        document.getElementById('exportBtn').addEventListener('click', function() {
            DepartmentReportPage.exportReport();
        });
        
        // 报告章节切换事件
        document.querySelectorAll('.report-section-tab').forEach(function(tab) {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.report-section-tab').forEach(function(t) {
                    t.classList.remove('active');
                });
                document.querySelectorAll('.report-section-content').forEach(function(content) {
                    content.classList.remove('active');
                });
                
                this.classList.add('active');
                var contentId = this.dataset.content;
                document.getElementById(contentId).classList.add('active');
            });
        });
    },
    
    // 加载数据
    loadData: function() {
        // 设置当前科室
        this.state.currentDepartment = document.getElementById('departmentSelect').value;
        
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
            // 更新所有图表
            DepartmentReportPage.updateAllCharts();
            
            // 重新渲染报告内容
            DepartmentReportPage.renderReportContent();
            
            // 隐藏加载状态
            DepartmentReportPage.showLoading(false);
        }, 500);
    },
    
    // 显示/隐藏加载状态
    showLoading: function(show) {
        var loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = show ? 'flex' : 'none';
        }
    },
    
    // 渲染报告内容
    renderReportContent: function() {
        // 渲染报告摘要
        this.renderReportSummary();
        
        // 渲染关键指标概览
        this.renderKeyIndicatorsOverview();
        
        // 渲染问题与建议
        this.renderProblemsSuggestions();
        
        // 渲染下阶段工作计划
        this.renderNextPlan();
    },
    
    // 渲染报告摘要
    renderReportSummary: function() {
        var reportSummaryContainer = document.getElementById('reportSummary');
        if (!reportSummaryContainer) return;
        
        // 获取当前科室名称
        var departmentName = document.getElementById('departmentSelect').options[document.getElementById('departmentSelect').selectedIndex].text;
        
        // 获取当前日期范围
        var dateRangeText = this.state.dateRange.start + ' 至 ' + this.state.dateRange.end;
        
        // 生成报告摘要内容
        var summaryContent = `
            <p><strong>报告期间：</strong>${dateRangeText}</p>
            <p><strong>报告科室：</strong>${departmentName}</p>
            <p>本报告期内，${departmentName}在工作量、医疗质量、经济运行和服务效率等方面均取得了较好的成绩。门诊人次达到${this.mockData.keyIndicators.workload.current}人次，较上期增长${this.mockData.keyIndicators.workload.growthRate}%；患者满意度达到${this.mockData.keyIndicators.quality.current}%，较上期提升${this.mockData.keyIndicators.quality.growthRate}个百分点；医疗收入达到${this.formatCurrency(this.mockData.keyIndicators.economic.current)}元，较上期增长${this.mockData.keyIndicators.economic.growthRate}%；床位使用率达到${this.mockData.keyIndicators.efficiency.current}%，较上期提升${this.mockData.keyIndicators.efficiency.growthRate}个百分点。</p>
            <p>同时，科室在门诊流程优化、床位管理、手术效率提升等方面仍有改进空间，建议在下阶段工作中重点关注这些问题，进一步提高医疗服务质量和运营效率。</p>
        `;
        
        reportSummaryContainer.innerHTML = summaryContent;
    },
    
    // 渲染关键指标概览
    renderKeyIndicatorsOverview: function() {
        var keyIndicatorsOverviewContainer = document.getElementById('keyIndicatorsOverview');
        if (!keyIndicatorsOverviewContainer) return;
        
        // 清空容器
        while (keyIndicatorsOverviewContainer.firstChild) {
            keyIndicatorsOverviewContainer.removeChild(keyIndicatorsOverviewContainer.firstChild);
        }
        
        // 渲染关键指标卡片
        var indicators = [
            {
                title: '工作量',
                value: this.mockData.keyIndicators.workload.current,
                unit: '人次',
                growthRate: this.mockData.keyIndicators.workload.growthRate,
                targetCompletion: this.mockData.keyIndicators.workload.completionRate,
                icon: 'icon-patient'
            },
            {
                title: '医疗质量',
                value: this.mockData.keyIndicators.quality.current,
                unit: '%',
                growthRate: this.mockData.keyIndicators.quality.growthRate,
                targetCompletion: this.mockData.keyIndicators.quality.completionRate,
                icon: 'icon-quality'
            },
            {
                title: '医疗收入',
                value: this.mockData.keyIndicators.economic.current,
                unit: '元',
                growthRate: this.mockData.keyIndicators.economic.growthRate,
                targetCompletion: this.mockData.keyIndicators.economic.completionRate,
                icon: 'icon-economic'
            },
            {
                title: '服务效率',
                value: this.mockData.keyIndicators.efficiency.current,
                unit: '%',
                growthRate: this.mockData.keyIndicators.efficiency.growthRate,
                targetCompletion: this.mockData.keyIndicators.efficiency.completionRate,
                icon: 'icon-efficiency'
            }
        ];
        
        indicators.forEach(function(indicator) {
            var indicatorCard = document.createElement('div');
            indicatorCard.className = 'indicator-card';
            
            // 格式化值
            var formattedValue = indicator.unit === '元' ? 
                DepartmentReportPage.formatCurrency(indicator.value) : indicator.value;
            
            // 确定增长率样式
            var growthRateClass = indicator.growthRate >= 0 ? 'positive' : 'negative';
            var growthRateSymbol = indicator.growthRate >= 0 ? '+' : '';
            
            // 确定目标完成率样式
            var targetCompletionClass = indicator.targetCompletion >= 100 ? 'positive' : 'negative';
            
            indicatorCard.innerHTML = `
                <div class="indicator-icon"><i class="${indicator.icon}"></i></div>
                <div class="indicator-info">
                    <div class="indicator-title">${indicator.title}</div>
                    <div class="indicator-main">
                        <span class="indicator-value">${formattedValue}${indicator.unit}</span>
                        <span class="indicator-growth ${growthRateClass}">较上期 ${growthRateSymbol}${indicator.growthRate}%</span>
                    </div>
                    <div class="indicator-target">
                        目标完成率: <span class="target-completion ${targetCompletionClass}">${indicator.targetCompletion}%</span>
                    </div>
                </div>
            `;
            
            keyIndicatorsOverviewContainer.appendChild(indicatorCard);
        });
    },
    
    // 渲染问题与建议
    renderProblemsSuggestions: function() {
        var problemsContainer = document.getElementById('problemsList');
        var suggestionsContainer = document.getElementById('suggestionsList');
        
        if (!problemsContainer || !suggestionsContainer) return;
        
        // 清空容器
        while (problemsContainer.firstChild) {
            problemsContainer.removeChild(problemsContainer.firstChild);
        }
        
        while (suggestionsContainer.firstChild) {
            suggestionsContainer.removeChild(suggestionsContainer.firstChild);
        }
        
        // 渲染问题列表
        this.mockData.problemSuggestion.problems.forEach(function(problem, index) {
            var problemItem = document.createElement('div');
            problemItem.className = 'problem-item';
            
            // 确定问题严重程度样式
            var severityClass = problem.severity >= 80 ? 'high' : 
                               problem.severity >= 60 ? 'medium' : 'low';
            
            problemItem.innerHTML = `
                <span class="problem-index">${index + 1}.</span>
                <span class="problem-name">${problem.name}</span>
                <div class="severity-indicator">
                    <div class="severity-bar">
                        <div class="severity-fill ${severityClass}" style="width: ${problem.severity}%;"></div>
                    </div>
                    <span class="severity-text">${problem.severity}%</span>
                </div>
            `;
            
            problemsContainer.appendChild(problemItem);
        });
        
        // 渲染建议列表
        this.mockData.problemSuggestion.suggestions.forEach(function(suggestion, index) {
            var suggestionItem = document.createElement('div');
            suggestionItem.className = 'suggestion-item';
            
            suggestionItem.innerHTML = `
                <span class="suggestion-index">${index + 1}.</span>
                <span class="suggestion-text">${suggestion}</span>
            `;
            
            suggestionsContainer.appendChild(suggestionItem);
        });
    },
    
    // 渲染下阶段工作计划
    renderNextPlan: function() {
        var planContainer = document.getElementById('nextPlanTable').querySelector('tbody');
        if (!planContainer) return;
        
        // 清空容器
        while (planContainer.firstChild) {
            planContainer.removeChild(planContainer.firstChild);
        }
        
        // 渲染工作计划表格
        this.mockData.nextPlan.forEach(function(plan) {
            var row = document.createElement('tr');
            
            // 确定优先级样式
            var priorityClass = plan.priority >= 80 ? 'high' : 
                               plan.priority >= 60 ? 'medium' : 'low';
            
            // 确定状态样式
            var statusClass = '';
            switch (plan.status) {
                case '进行中':
                    statusClass = 'status-in-progress';
                    break;
                case '已开始':
                    statusClass = 'status-started';
                    break;
                case '计划中':
                    statusClass = 'status-planned';
                    break;
                case '已完成':
                    statusClass = 'status-completed';
                    break;
                default:
                    statusClass = 'status-other';
            }
            
            row.innerHTML = `
                <td>${plan.name}</td>
                <td>
                    <div class="priority-indicator">
                        <div class="priority-bar">
                            <div class="priority-fill ${priorityClass}" style="width: ${plan.priority}%;"></div>
                        </div>
                        <span class="priority-text">${plan.priority}%</span>
                    </div>
                </td>
                <td>${plan.deadline}</td>
                <td><span class="status-badge ${statusClass}">${plan.status}</span></td>
            `;
            
            planContainer.appendChild(row);
        });
    },
    
    // 更新所有图表
    updateAllCharts: function() {
        this.updateKeyIndicatorsChart();
        this.updateWorkloadTrendChart();
        this.updateQualityTrendChart();
        this.updateEconomicTrendChart();
        this.updateEfficiencyTrendChart();
        this.updateProblemDistributionChart();
        this.updateImprovementChart();
        this.updateWorkloadStructureChart();
        this.updateRevenueStructureChart();
    },
    
    // 初始化关键指标图表
    initKeyIndicatorsChart: function() {
        var option = {
            title: {
                text: '关键指标对比',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['当前值', '上期值', '目标值'],
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
                data: ['工作量', '医疗质量', '医疗收入', '服务效率']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '当前值',
                    type: 'bar',
                    data: [
                        this.mockData.keyIndicators.workload.current,
                        this.mockData.keyIndicators.quality.current,
                        this.mockData.keyIndicators.economic.current / 10000,
                        this.mockData.keyIndicators.efficiency.current
                    ],
                    itemStyle: {
                        color: '#1890ff'
                    }
                },
                {
                    name: '上期值',
                    type: 'bar',
                    data: [
                        this.mockData.keyIndicators.workload.previous,
                        this.mockData.keyIndicators.quality.previous,
                        this.mockData.keyIndicators.economic.previous / 10000,
                        this.mockData.keyIndicators.efficiency.previous
                    ],
                    itemStyle: {
                        color: '#722ed1'
                    }
                },
                {
                    name: '目标值',
                    type: 'bar',
                    data: [
                        this.mockData.keyIndicators.workload.target,
                        this.mockData.keyIndicators.quality.target,
                        this.mockData.keyIndicators.economic.target / 10000,
                        this.mockData.keyIndicators.efficiency.target
                    ],
                    itemStyle: {
                        color: '#faad14'
                    }
                }
            ]
        };
        
        this.state.charts.keyIndicatorsChart.setOption(option);
    },
    
    // 更新关键指标图表
    updateKeyIndicatorsChart: function() {
        // 关键指标数据通常是固定的，这里使用固定数据
    },
    
    // 初始化工作量趋势图
    initWorkloadTrendChart: function() {
        var option = {
            title: {
                text: '工作量趋势分析',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['门诊人次', '急诊人次', '出院人次', '手术量'],
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
                data: this.mockData.workloadAnalysis.monthly.map(function(item) { return item.month; })
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '门诊人次',
                    type: 'line',
                    data: this.mockData.workloadAnalysis.monthly.map(function(item) { return item.outpatient; }),
                    smooth: true,
                    areaStyle: {
                        opacity: 0.3
                    }
                },
                {
                    name: '急诊人次',
                    type: 'line',
                    data: this.mockData.workloadAnalysis.monthly.map(function(item) { return item.emergency; }),
                    smooth: true
                },
                {
                    name: '出院人次',
                    type: 'line',
                    data: this.mockData.workloadAnalysis.monthly.map(function(item) { return item.inpatient; }),
                    smooth: true
                },
                {
                    name: '手术量',
                    type: 'line',
                    data: this.mockData.workloadAnalysis.monthly.map(function(item) { return item.surgery; }),
                    smooth: true
                }
            ]
        };
        
        this.state.charts.workloadTrendChart.setOption(option);
    },
    
    // 更新工作量趋势图
    updateWorkloadTrendChart: function() {
        // 工作量趋势数据通常是固定的，这里使用固定数据
    },
    
    // 初始化质量趋势图
    initQualityTrendChart: function() {
        var option = {
            title: {
                text: '医疗质量趋势分析',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                formatter: function(params) {
                    var result = params[0].name + '<br/>';
                    params.forEach(function(param) {
                        result += param.marker + param.seriesName + ': ' + param.value + '%<br/>';
                    });
                    return result;
                }
            },
            legend: {
                data: ['患者满意度', '手术并发症率', '医院感染率', '再住院率'],
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
                boundaryGap: false,
                data: this.mockData.qualityAnalysis.monthly.map(function(item) { return item.month; })
            },
            yAxis: [
                {
                    type: 'value',
                    name: '满意度(%)',
                    position: 'left',
                    min: 90,
                    max: 100,
                    axisLabel: {
                        formatter: '{value}%'
                    }
                },
                {
                    type: 'value',
                    name: '并发症/感染率(%)',
                    position: 'right',
                    min: 0,
                    max: 5,
                    axisLabel: {
                        formatter: '{value}%'
                    }
                }
            ],
            series: [
                {
                    name: '患者满意度',
                    type: 'line',
                    data: this.mockData.qualityAnalysis.monthly.map(function(item) { return item.satisfaction; }),
                    smooth: true,
                    areaStyle: {
                        opacity: 0.3
                    }
                },
                {
                    name: '手术并发症率',
                    type: 'line',
                    yAxisIndex: 1,
                    data: this.mockData.qualityAnalysis.monthly.map(function(item) { return item.complication; }),
                    smooth: true
                },
                {
                    name: '医院感染率',
                    type: 'line',
                    yAxisIndex: 1,
                    data: this.mockData.qualityAnalysis.monthly.map(function(item) { return item.infection; }),
                    smooth: true
                },
                {
                    name: '再住院率',
                    type: 'line',
                    yAxisIndex: 1,
                    data: this.mockData.qualityAnalysis.monthly.map(function(item) { return item.readmission; }),
                    smooth: true
                }
            ]
        };
        
        this.state.charts.qualityTrendChart.setOption(option);
    },
    
    // 更新质量趋势图
    updateQualityTrendChart: function() {
        // 质量趋势数据通常是固定的，这里使用固定数据
    },
    
    // 初始化经济趋势图
    initEconomicTrendChart: function() {
        var option = {
            title: {
                text: '经济运行趋势分析',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                formatter: function(params) {
                    var result = params[0].name + '<br/>';
                    params.forEach(function(param) {
                        if (param.seriesName === '医疗收入' || param.seriesName === '收支结余') {
                            result += param.marker + param.seriesName + ': ¥' + 
                                (param.value / 10000).toFixed(1) + '万<br/>';
                        } else {
                            result += param.marker + param.seriesName + ': ' + param.value + '%<br/>';
                        }
                    });
                    return result;
                }
            },
            legend: {
                data: ['医疗收入', '收支结余', '成本率'],
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
                data: this.mockData.economicAnalysis.monthly.map(function(item) { return item.month; })
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
                    name: '比率(%)',
                    position: 'right',
                    min: 60,
                    max: 80,
                    axisLabel: {
                        formatter: '{value}%'
                    }
                }
            ],
            series: [
                {
                    name: '医疗收入',
                    type: 'line',
                    data: this.mockData.economicAnalysis.monthly.map(function(item) { return item.revenue; }),
                    smooth: true,
                    areaStyle: {
                        opacity: 0.3
                    }
                },
                {
                    name: '收支结余',
                    type: 'line',
                    data: this.mockData.economicAnalysis.monthly.map(function(item) { return item.profit; }),
                    smooth: true
                },
                {
                    name: '成本率',
                    type: 'line',
                    yAxisIndex: 1,
                    data: this.mockData.economicAnalysis.monthly.map(function(item) { return item.costRate; }),
                    smooth: true
                }
            ]
        };
        
        this.state.charts.economicTrendChart.setOption(option);
    },
    
    // 更新经济趋势图
    updateEconomicTrendChart: function() {
        // 经济趋势数据通常是固定的，这里使用固定数据
    },
    
    // 初始化效率趋势图
    initEfficiencyTrendChart: function() {
        var option = {
            title: {
                text: '医疗效率趋势分析',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['床位使用率', '平均住院日', '床位周转次数', '平均门诊等待时间'],
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
                boundaryGap: false,
                data: this.mockData.efficiencyAnalysis.monthly.map(function(item) { return item.month; })
            },
            yAxis: [
                {
                    type: 'value',
                    name: '使用率(%)',
                    position: 'left',
                    min: 80,
                    max: 95,
                    axisLabel: {
                        formatter: '{value}%'
                    }
                },
                {
                    type: 'value',
                    name: '天数/分钟',
                    position: 'right',
                    min: 0,
                    max: 40
                }
            ],
            series: [
                {
                    name: '床位使用率',
                    type: 'line',
                    data: this.mockData.efficiencyAnalysis.monthly.map(function(item) { return item.bedOccupancy; }),
                    smooth: true,
                    areaStyle: {
                        opacity: 0.3
                    }
                },
                {
                    name: '平均住院日',
                    type: 'line',
                    yAxisIndex: 1,
                    data: this.mockData.efficiencyAnalysis.monthly.map(function(item) { return item.avgStay; }),
                    smooth: true
                },
                {
                    name: '床位周转次数',
                    type: 'line',
                    yAxisIndex: 1,
                    data: this.mockData.efficiencyAnalysis.monthly.map(function(item) { return item.bedTurnover; }),
                    smooth: true
                },
                {
                    name: '平均门诊等待时间',
                    type: 'line',
                    yAxisIndex: 1,
                    data: this.mockData.efficiencyAnalysis.monthly.map(function(item) { return item.outpatientWaiting; }),
                    smooth: true
                }
            ]
        };
        
        this.state.charts.efficiencyTrendChart.setOption(option);
    },
    
    // 更新效率趋势图
    updateEfficiencyTrendChart: function() {
        // 效率趋势数据通常是固定的，这里使用固定数据
    },
    
    // 初始化问题分布图表
    initProblemDistributionChart: function() {
        var option = {
            title: {
                text: '问题严重程度分布',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                bottom: 10,
                data: this.mockData.problemSuggestion.problems.map(function(item) { return item.name; })
            },
            series: [
                {
                    name: '问题严重程度',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    center: ['50%', '45%'],
                    avoidLabelOverlap: false,
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
                    data: this.mockData.problemSuggestion.problems.map(function(item) {
                        return {
                            name: item.name,
                            value: item.severity
                        };
                    })
                }
            ]
        };
        
        this.state.charts.problemDistributionChart.setOption(option);
    },
    
    // 更新问题分布图表
    updateProblemDistributionChart: function() {
        // 问题分布数据通常是固定的，这里使用固定数据
    },
    
    // 初始化改进空间图表
    initImprovementChart: function() {
        var option = {
            title: {
                text: '改进空间评估',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function(params) {
                    return params[0].name + ': ' + params[0].value + '%';
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '25%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: this.mockData.problemSuggestion.problems.map(function(item) { return item.name; }),
                axisLabel: {
                    interval: 0,
                    rotate: 30
                }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value}%'
                }
            },
            series: [
                {
                    data: this.mockData.problemSuggestion.problems.map(function(item) { return item.severity; }),
                    type: 'bar',
                    itemStyle: {
                        color: function(params) {
                            var value = params.value;
                            if (value >= 80) {
                                return '#ff4d4f';
                            } else if (value >= 60) {
                                return '#faad14';
                            } else {
                                return '#52c41a';
                            }
                        }
                    },
                    label: {
                        show: true,
                        position: 'top',
                        formatter: '{c}%'
                    }
                }
            ]
        };
        
        this.state.charts.improvementChart.setOption(option);
    },
    
    // 更新改进空间图表
    updateImprovementChart: function() {
        // 改进空间数据通常是固定的，这里使用固定数据
    },
    
    // 初始化工作量结构图表
    initWorkloadStructureChart: function() {
        var option = {
            title: {
                text: '工作量结构分析',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                bottom: 10
            },
            series: [
                {
                    name: '工作量类型',
                    type: 'pie',
                    radius: '60%',
                    center: ['50%', '45%'],
                    data: this.mockData.workloadAnalysis.workloadStructure,
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
        
        this.state.charts.workloadStructureChart.setOption(option);
    },
    
    // 更新工作量结构图表
    updateWorkloadStructureChart: function() {
        // 工作量结构数据通常是固定的，这里使用固定数据
    },
    
    // 初始化收入结构图表
    initRevenueStructureChart: function() {
        var option = {
            title: {
                text: '收入结构分析',
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
                    name: '收入类型',
                    type: 'pie',
                    radius: '60%',
                    center: ['50%', '45%'],
                    data: this.mockData.economicAnalysis.revenueStructure,
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
        
        this.state.charts.revenueStructureChart.setOption(option);
    },
    
    // 更新收入结构图表
    updateRevenueStructureChart: function() {
        // 收入结构数据通常是固定的，这里使用固定数据
    },
    
    // 导出报告
    exportReport: function() {
        alert('科室运营报告导出功能已触发，实际项目中会生成并下载PDF或Excel报告');
        // 实际项目中，这里会调用后端API生成报告并下载
    },
    
    // 格式化货币
    formatCurrency: function(value) {
        if (typeof value !== 'number') return value;
        
        if (value >= 10000) {
            return (value / 10000).toFixed(1) + '万';
        }
        
        return value.toLocaleString();
    }
};

// 页面加载完成后初始化（统一依赖 Common.ensureEcharts 与 echartsLoaded 事件）
document.addEventListener('DOMContentLoaded', function() {
    // 统一通过 Common.ensureEcharts 加载 ECharts
    if (typeof Common !== 'undefined' && typeof Common.ensureEcharts === 'function') {
        try {
            Common.ensureEcharts();
        } catch (e) {
            console.warn('ensureEcharts 调用失败:', e);
        }
    }

    // 如果 ECharts 已就绪，直接初始化；否则等待全局事件
    if (typeof echarts !== 'undefined') {
        DepartmentReportPage.init();
    } else {
        const onReady = function() {
            document.removeEventListener('echartsLoaded', onReady);
            DepartmentReportPage.init();
        };
        document.addEventListener('echartsLoaded', onReady);
    }
});