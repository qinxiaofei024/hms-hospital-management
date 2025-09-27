// 患者满意度管理页面逻辑
var PatientSatisfactionPage = {
    // 页面状态
    state: {
        currentDepartment: '',
        dateRange: {
            start: '',
            end: ''
        },
        timeDimension: 'month', // month, quarter, year
        searchKeyword: '',
        satisfactionDimension: 'all', // all, process, quality, nursing, communication, environment, cost
        charts: {
            satisfactionTrend: null,
            departmentComparison: null,
            patientProfile: null,
            dimensionRadar: null,
            surveyStats: null,
            analysisReport: null,
            template: null,
            report: null
        }
    },
    
    // 模拟数据
    mockData: {
        // 满意度概览数据
        satisfactionOverview: [
            { name: '总体满意度', current: 88.6, previous: 86.2, growthRate: 2.4, target: 90.0, completionRate: 98.4, unit: '分' },
            { name: '门诊满意度', current: 87.8, previous: 85.5, growthRate: 2.3, target: 88.0, completionRate: 99.8, unit: '分' },
            { name: '住院满意度', current: 89.4, previous: 87.1, growthRate: 2.3, target: 92.0, completionRate: 97.2, unit: '分' }
        ],
        
        // 六大评价维度数据
        satisfactionDimensions: [
            { name: '诊疗流程效率', current: 86.5, previous: 84.2, growthRate: 2.3, target: 88.0, completionRate: 98.3, unit: '分' },
            { name: '医疗服务质量', current: 91.2, previous: 89.8, growthRate: 1.4, target: 92.0, completionRate: 99.1, unit: '分' },
            { name: '护理服务质量', current: 89.7, previous: 87.9, growthRate: 1.8, target: 90.0, completionRate: 99.7, unit: '分' },
            { name: '医患沟通效果', current: 87.3, previous: 85.1, growthRate: 2.2, target: 89.0, completionRate: 98.1, unit: '分' },
            { name: '环境设施体验', current: 85.9, previous: 83.6, growthRate: 2.3, target: 87.0, completionRate: 98.7, unit: '分' },
            { name: '费用透明度', current: 88.1, previous: 84.8, growthRate: 3.3, target: 88.0, completionRate: 100.1, unit: '分' }
        ],
        
        // 调查管理功能数据
        surveyManagement: [
            { name: '在线调查统计', current: 2856, previous: 2714, growthRate: 5.2, target: 3000, completionRate: 95.2, unit: '份' },
            { name: '问卷模板管理', current: 15, previous: 12, growthRate: 25.0, target: 18, completionRate: 83.3, unit: '个' },
            { name: '数据分析报告', current: 24, previous: 20, growthRate: 20.0, target: 25, completionRate: 96.0, unit: '份' }
        ],
        
        // 数据可视化展示数据
        visualizationData: [
            { name: '满意度趋势分析', current: '持续上升', previous: '波动上升', improvement: '趋势稳定', target: '稳步提升', status: '良好' },
            { name: '科室满意度对比', current: '15个科室', previous: '15个科室', improvement: '8个优秀', target: '全部优秀', status: '良好' },
            { name: '患者画像分析', current: '多维度', previous: '基础维度', improvement: '深度分析', target: '精准画像', status: '优秀' }
        ],
        
        // 月度满意度趋势数据
        monthlySatisfaction: [
            { month: '1月', overall: 84.2, outpatient: 83.5, inpatient: 85.1, survey: 2150 },
            { month: '2月', overall: 84.8, outpatient: 84.1, inpatient: 85.6, survey: 2080 },
            { month: '3月', overall: 85.5, outpatient: 84.8, inpatient: 86.3, survey: 2380 },
            { month: '4月', overall: 86.1, outpatient: 85.4, inpatient: 86.9, survey: 2420 },
            { month: '5月', overall: 86.8, outpatient: 86.1, inpatient: 87.6, survey: 2550 },
            { month: '6月', overall: 87.2, outpatient: 86.5, inpatient: 88.0, survey: 2680 },
            { month: '7月', overall: 87.6, outpatient: 86.9, inpatient: 88.4, survey: 2720 },
            { month: '8月', overall: 88.0, outpatient: 87.3, inpatient: 88.8, survey: 2780 },
            { month: '9月', overall: 88.3, outpatient: 87.6, inpatient: 89.1, survey: 2820 },
            { month: '10月', overall: 88.6, outpatient: 87.8, inpatient: 89.4, survey: 2856 }
        ],
        
        // 月度维度评分数据
        monthlyDimensions: [
            { month: '1月', process: 82.5, quality: 87.2, nursing: 85.8, communication: 83.1, environment: 81.6, cost: 84.2 },
            { month: '2月', process: 83.1, quality: 87.8, nursing: 86.2, communication: 83.5, environment: 82.1, cost: 84.8 },
            { month: '3月', process: 83.8, quality: 88.5, nursing: 86.9, communication: 84.2, environment: 82.7, cost: 85.5 },
            { month: '4月', process: 84.2, quality: 89.1, nursing: 87.3, communication: 84.8, environment: 83.2, cost: 86.1 },
            { month: '5月', process: 84.8, quality: 89.6, nursing: 87.8, communication: 85.3, environment: 83.8, cost: 86.8 },
            { month: '6月', process: 85.2, quality: 90.1, nursing: 88.2, communication: 85.7, environment: 84.2, cost: 87.2 },
            { month: '7月', process: 85.6, quality: 90.5, nursing: 88.6, communication: 86.1, environment: 84.6, cost: 87.6 },
            { month: '8月', process: 86.0, quality: 90.8, nursing: 89.0, communication: 86.5, environment: 85.0, cost: 88.0 },
            { month: '9月', process: 86.3, quality: 91.0, nursing: 89.3, communication: 86.8, environment: 85.3, cost: 88.3 },
            { month: '10月', process: 86.5, quality: 91.2, nursing: 89.7, communication: 87.3, environment: 85.9, cost: 88.1 }
        ],
        
        // 月度调查统计数据
        monthlySurvey: [
            { month: '1月', surveys: 2150, responses: 1935, responseRate: 90.0, avgTime: 3.2 },
            { month: '2月', surveys: 2080, responses: 1872, responseRate: 90.0, avgTime: 3.1 },
            { month: '3月', surveys: 2380, responses: 2142, responseRate: 90.0, avgTime: 3.0 },
            { month: '4月', surveys: 2420, responses: 2178, responseRate: 90.0, avgTime: 2.9 },
            { month: '5月', surveys: 2550, responses: 2295, responseRate: 90.0, avgTime: 2.8 },
            { month: '6月', surveys: 2680, responses: 2412, responseRate: 90.0, avgTime: 2.8 },
            { month: '7月', surveys: 2720, responses: 2448, responseRate: 90.0, avgTime: 2.7 },
            { month: '8月', surveys: 2780, responses: 2502, responseRate: 90.0, avgTime: 2.7 },
            { month: '9月', surveys: 2820, responses: 2538, responseRate: 90.0, avgTime: 2.6 },
            { month: '10月', surveys: 2856, responses: 2570, responseRate: 90.0, avgTime: 2.6 }
        ],
        
        // 科室满意度分布数据
        departmentSatisfaction: [
            { department: '心内科', overall: 93.2, process: 91.5, quality: 95.8, nursing: 94.2, communication: 92.1, environment: 90.8, cost: 93.5 },
            { department: '骨科', overall: 89.8, process: 88.2, quality: 92.1, nursing: 90.5, communication: 88.9, environment: 87.6, cost: 90.2 },
            { department: '消化内科', overall: 91.5, process: 90.1, quality: 93.8, nursing: 92.2, communication: 90.5, environment: 89.2, cost: 91.8 },
            { department: '呼吸内科', overall: 87.6, process: 86.2, quality: 89.8, nursing: 88.1, communication: 86.5, environment: 85.2, cost: 87.9 },
            { department: '神经内科', overall: 88.9, process: 87.5, quality: 91.2, nursing: 89.8, communication: 87.8, environment: 86.5, cost: 89.2 },
            { department: '妇产科', overall: 90.3, process: 89.1, quality: 92.5, nursing: 91.2, communication: 89.6, environment: 88.3, cost: 90.6 },
            { department: '儿科', overall: 86.7, process: 85.3, quality: 88.9, nursing: 87.2, communication: 85.6, environment: 84.3, cost: 87.0 },
            { department: '急诊科', overall: 84.2, process: 82.8, quality: 86.5, nursing: 84.9, communication: 83.3, environment: 82.0, cost: 84.5 }
        ],
        
        // 患者画像数据
        patientProfile: [
            { category: '年龄分布', '18-30岁': 15.2, '31-45岁': 28.6, '46-60岁': 32.8, '60岁以上': 23.4 },
            { category: '性别分布', '男性': 47.7, '女性': 52.3 },
            { category: '就诊类型', '门诊': 68.2, '住院': 31.8 },
            { category: '教育程度', '高中及以下': 35.6, '大专': 28.9, '本科': 26.8, '研究生及以上': 8.7 },
            { category: '满意度分布', '非常满意': 45.2, '满意': 38.6, '一般': 12.8, '不满意': 2.9, '非常不满意': 0.5 }
        ],
        
        // 目标完成度数据
        targetCompletion: [
            { name: '总体满意度', value: 98.4 },
            { name: '六大维度', value: 96.8 },
            { name: '调查管理', value: 91.7 },
            { name: '数据分析', value: 94.2 }
        ],

        // 模板管理数据
        templateData: {
            id: 'MZMY-001',
            name: '门诊满意度调查模板',
            code: 'MZMY-001',
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            createDate: '2023-12-15',
            creator: '张医生',
            status: 'published', // draft, published, reviewing, withdrawn
            usageCount: 1256,
            questions: [
                { id: 1, text: '您对本次就诊的整体满意度如何？', type: '单选题', required: true },
                { id: 2, text: '您对医生的诊疗服务满意度如何？', type: '单选题', required: true },
                { id: 3, text: '您对护理人员的服务满意度如何？', type: '单选题', required: true },
                { id: 4, text: '您对医院环境设施的满意度如何？', type: '单选题', required: true },
                { id: 5, text: '您对挂号流程的满意度如何？', type: '单选题', required: true },
                { id: 6, text: '您对候诊时间的满意度如何？', type: '单选题', required: true },
                { id: 7, text: '您对医疗费用透明度的满意度如何？', type: '单选题', required: true },
                { id: 8, text: '您对医患沟通效果的满意度如何？', type: '单选题', required: true },
                { id: 9, text: '您认为还有哪些方面需要改进？', type: '多选题', required: false },
                { id: 10, text: '您有什么建议或意见？', type: '文本题', required: false }
            ]
        }
    },
    
    // 初始化页面
    init: function() {
        console.log('开始初始化患者满意度页面...');
        
        // 添加调试信息到页面
        var debugInfo = document.createElement('div');
        debugInfo.id = 'debug-info';
        debugInfo.style.cssText = 'position: fixed; top: 10px; right: 10px; background: #f0f0f0; padding: 10px; border: 1px solid #ccc; z-index: 9999; max-width: 300px; font-size: 12px;';
        debugInfo.innerHTML = '<strong>调试信息:</strong><br>初始化开始...';
        document.body.appendChild(debugInfo);
        

        
        // 直接使用传统初始化方式
        this.initCharts();
        this.initEventListeners();
        this.loadData();
        
        // 更新调试信息
        debugInfo.innerHTML += '<br>初始化完成';
        console.log('患者满意度页面初始化完成');
    },
    

    

    

    

    
    // 传统图表初始化方法（回退方案）
    initCharts: function() {
        console.log('使用传统方式初始化图表...');
        
        // 定义图表容器映射
        const chartContainers = [
            'satisfactionTrendChart', 'departmentComparisonChart', 'patientProfileChart', 
            'surveyStatsChart', 'dimensionRadarChart', 'templateChart', 'reportChart'
        ];
        
        // 初始化图表
        chartContainers.forEach(containerId => {
            try {
                const container = document.getElementById(containerId);
                if (container) {
                    const chartName = containerId.replace('Chart', '');
                    this.state.charts[chartName] = echarts.init(container);
                    console.log(`图表 ${containerId} 初始化成功`);
                } else {
                    console.warn(`图表容器 ${containerId} 未找到，跳过初始化`);
                }
            } catch (error) {
                console.error(`初始化图表 ${containerId} 时出错:`, error);
            }
        });
        
        // 设置响应式
        window.addEventListener('resize', () => {
            Object.values(this.state.charts).forEach(chart => {
                if (chart && chart.resize) {
                    chart.resize();
                }
            });
        });
        
        // 初始化各图表
        this.initSatisfactionTrendChart();
        this.initSurveyStatsChart();
        this.initDepartmentComparisonChart();
        this.initPatientProfileChart();
        
        // 只有当图表对象存在时才初始化
        if (this.state.charts.template) {
            this.initTemplateChart();
        }
        if (this.state.charts.report) {
            this.initReportChart();
        }
    },
    
    // 初始化事件监听器
    initEventListeners: function() {
        // 时间维度选择事件
        document.querySelectorAll('.time-dimension-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.time-dimension-btn').forEach(function(b) {
                    b.classList.remove('active');
                });
                this.classList.add('active');
                
                // 获取维度值
                const dimension = this.dataset.dimension || this.getAttribute('data-dimension');
                if (dimension) {
                    PatientSatisfactionPage.state.timeDimension = dimension;
                    PatientSatisfactionPage.refreshData();
                }
            });
        });
        
        // 日期范围选择事件 - 添加容错
        const dateRangePicker = document.getElementById('dateRangePicker') || document.querySelector('[id*="date"], [class*="date"]');
        if (dateRangePicker) {
            dateRangePicker.addEventListener('change', function() {
                var value = this.value.split(' - ');
                if (value.length === 2) {
                    PatientSatisfactionPage.state.dateRange.start = value[0];
                    PatientSatisfactionPage.state.dateRange.end = value[1];
                    PatientSatisfactionPage.refreshData();
                }
            });
        }
        
        // 科室选择事件 - 添加容错
        const departmentSelect = document.getElementById('departmentSelect') || document.querySelector('[id*="department"], select');
        if (departmentSelect) {
            departmentSelect.addEventListener('change', function() {
                PatientSatisfactionPage.state.currentDepartment = this.value;
                PatientSatisfactionPage.refreshData();
            });
        }
        
        // 搜索框事件 - 添加容错
        const indicatorSearch = document.getElementById('indicatorSearch') || document.querySelector('[id*="search"], input[type="search"]');
        if (indicatorSearch) {
            indicatorSearch.addEventListener('input', function() {
                PatientSatisfactionPage.state.searchKeyword = this.value.toLowerCase();
                PatientSatisfactionPage.filterIndicators();
            });
        }
        
        // 刷新按钮事件 - 添加容错
        const refreshBtn = document.getElementById('refreshBtn') || document.querySelector('[id*="refresh"], .refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', function() {
                PatientSatisfactionPage.refreshData();
            });
        }
        
        // 导出按钮事件 - 添加容错
        const exportBtn = document.getElementById('exportBtn') || document.querySelector('[id*="export"], .export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', function() {
                PatientSatisfactionPage.exportReport();
            });
        }
        
        // 满意度维度切换事件 - 修复选择器
        const satisfactionTabs = document.querySelectorAll('.satisfaction-dimension-tab, [data-content]');
        satisfactionTabs.forEach(function(tab) {
            tab.addEventListener('click', function() {
                // 移除所有标签的 active 状态
                satisfactionTabs.forEach(function(t) {
                    t.classList.remove('active');
                });
                
                // 移除所有内容的 active 状态
                document.querySelectorAll('.satisfaction-content').forEach(function(content) {
                    content.classList.remove('active');
                });
                
                this.classList.add('active');
                const contentId = this.dataset.content || this.getAttribute('data-content');
                if (contentId) {
                    const contentElement = document.getElementById(contentId);
                    if (contentElement) {
                        contentElement.classList.add('active');
                    }
                    
                    // 根据选择的满意度维度更新相应的图表
                    PatientSatisfactionPage.updateChartsByType(contentId);
                }
            });
        });

        // 模板管理卡片点击事件
        const templateManagementCard = document.getElementById('templateManagementCard');
        if (templateManagementCard) {
            templateManagementCard.addEventListener('click', function() {
                PatientSatisfactionPage.showTemplateDetails();
            });
        }

        // 模板详情弹窗关闭事件
        const templateModal = document.getElementById('templateModal');
        if (templateModal) {
            templateModal.addEventListener('click', function(e) {
                if (e.target === templateModal) {
                    PatientSatisfactionPage.hideTemplateDetails();
                }
            });
        }

        // 模板详情弹窗按钮事件
        const templateCancelBtn = document.getElementById('templateCancelBtn');
        if (templateCancelBtn) {
            templateCancelBtn.addEventListener('click', function() {
                PatientSatisfactionPage.hideTemplateDetails();
            });
        }

        const templateSaveBtn = document.getElementById('templateSaveBtn');
        if (templateSaveBtn) {
            templateSaveBtn.addEventListener('click', function() {
                PatientSatisfactionPage.saveTemplate();
            });
        }

        const templateEditBtn = document.getElementById('templateEditBtn');
        if (templateEditBtn) {
            templateEditBtn.addEventListener('click', function() {
                PatientSatisfactionPage.editTemplate();
            });
        }

        const templatePublishBtn = document.getElementById('templatePublishBtn');
        if (templatePublishBtn) {
            templatePublishBtn.addEventListener('click', function() {
                PatientSatisfactionPage.publishTemplate();
            });
        }

        const templateReviewBtn = document.getElementById('templateReviewBtn');
        if (templateReviewBtn) {
            templateReviewBtn.addEventListener('click', function() {
                PatientSatisfactionPage.submitForReview();
            });
        }

        const templateWithdrawBtn = document.getElementById('templateWithdrawBtn');
        if (templateWithdrawBtn) {
            templateWithdrawBtn.addEventListener('click', function() {
                PatientSatisfactionPage.withdrawTemplate();
            });
        }

        // 模板名称编辑事件
        const templateNameEdit = document.getElementById('templateNameEdit');
        if (templateNameEdit) {
            templateNameEdit.addEventListener('click', function() {
                PatientSatisfactionPage.enableTemplateNameEdit();
            });
        }
    },
    
    // 加载数据
    loadData: function() {
        console.log('loadData 函数开始执行...');
        
        // 更新调试信息
        var debugInfo = document.getElementById('debug-info');
        if (debugInfo) {
            debugInfo.innerHTML += '<br>loadData 开始执行';
        }
        
        // 设置当前科室（如果元素存在）
        var departmentSelect = document.getElementById('departmentSelect');
        if (departmentSelect) {
            this.state.currentDepartment = departmentSelect.value;
        }
        
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
        
        // 设置日期选择器值（如果元素存在）
        var dateRangePicker = document.getElementById('dateRangePicker');
        if (dateRangePicker) {
            dateRangePicker.value = this.state.dateRange.start + ' - ' + this.state.dateRange.end;
        }
        
        // 渲染各项满意度指标
        console.log('开始渲染满意度指标...');
        if (debugInfo) {
            debugInfo.innerHTML += '<br>开始渲染指标';
        }
        
        this.renderSatisfactionOverview();
        this.renderSatisfactionDimensions();
        this.renderSurveyManagement();
        this.renderVisualizationData();
        
        // 更新图表数据
        this.updateAllCharts();
        
        console.log('loadData 函数执行完成');
        if (debugInfo) {
            debugInfo.innerHTML += '<br>loadData 完成';
        }
    },
    
    // 刷新数据
    refreshData: function() {
        // 显示加载状态
        this.showLoading(true);
        
        // 模拟数据加载延迟
        setTimeout(function() {
            // 根据当前选择的科室和时间范围筛选数据
            const filteredData = PatientSatisfactionPage.filterDataBySelection();
        
        // 更新指标显示
        PatientSatisfactionPage.renderSatisfactionOverview(filteredData.satisfactionOverview);
        PatientSatisfactionPage.renderSatisfactionDimensions(filteredData.satisfactionDimensions);
        PatientSatisfactionPage.renderSurveyManagement(filteredData.surveyManagement);
        PatientSatisfactionPage.renderVisualizationData(filteredData.visualizationData);
        
        // 更新图表
        PatientSatisfactionPage.updateAllCharts(filteredData);
        
        // 隐藏加载状态
        PatientSatisfactionPage.showLoading(false);
        }, 500);
    },
    
    // 根据选择的科室和时间范围筛选数据
    filterDataBySelection: function() {
        const { currentDepartment, dateRange } = this.state;
        
        // 复制原始数据以避免修改
        const filteredData = JSON.parse(JSON.stringify(this.mockData));
        
        // 如果选择了特定科室，为各项指标添加科室差异
        if (currentDepartment) {
            // 为工作量指标添加随机波动，模拟不同科室的数据差异
            filteredData.workloadIndicators = filteredData.workloadIndicators.map(indicator => {
                const factor = 0.85 + Math.random() * 0.3; // 0.85-1.15的随机因子
                return {
                    ...indicator,
                    current: Math.round(indicator.current * factor),
                    previous: Math.round(indicator.previous * factor),
                    growthRate: parseFloat((((Math.round(indicator.current * factor) - Math.round(indicator.previous * factor)) / Math.round(indicator.previous * factor)) * 100).toFixed(1)),
                    completionRate: parseFloat((((Math.round(indicator.current * factor)) / indicator.target) * 100).toFixed(1))
                };
            });
            
            // 为医疗质量指标添加随机波动
            filteredData.medicalQualityIndicators = filteredData.medicalQualityIndicators.map(indicator => {
                const factor = 0.95 + Math.random() * 0.08; // 0.95-1.03的随机因子
                return {
                    ...indicator,
                    current: parseFloat((indicator.current * factor).toFixed(1)),
                    previous: parseFloat((indicator.previous * factor).toFixed(1)),
                    growthRate: parseFloat(((indicator.current * factor - indicator.previous * factor) / (indicator.previous * factor) * 100).toFixed(1)),
                    completionRate: parseFloat((((indicator.current * factor)) / indicator.target) * 100).toFixed(1)
                };
            });
            
            // 为经济指标添加随机波动
            filteredData.economicIndicators = filteredData.economicIndicators.map(indicator => {
                const factor = 0.8 + Math.random() * 0.4; // 0.8-1.2的随机因子
                return {
                    ...indicator,
                    current: Math.round(indicator.current * factor),
                    previous: Math.round(indicator.previous * factor),
                    growthRate: parseFloat((((Math.round(indicator.current * factor) - Math.round(indicator.previous * factor)) / Math.round(indicator.previous * factor)) * 100).toFixed(1)),
                    completionRate: parseFloat((((Math.round(indicator.current * factor)) / indicator.target) * 100).toFixed(1))
                };
            });
            
            // 为效率指标添加随机波动
            filteredData.efficiencyIndicators = filteredData.efficiencyIndicators.map(indicator => {
                const factor = 0.9 + Math.random() * 0.2; // 0.9-1.1的随机因子
                return {
                    ...indicator,
                    current: parseFloat((indicator.current * factor).toFixed(1)),
                    previous: parseFloat((indicator.previous * factor).toFixed(1)),
                    growthRate: parseFloat(((indicator.current * factor - indicator.previous * factor) / (indicator.previous * factor) * 100).toFixed(1)),
                    completionRate: parseFloat((((indicator.current * factor)) / indicator.target) * 100).toFixed(1)
                };
            });
        }
        
        // 根据日期范围筛选月度数据
        if (dateRange.start && dateRange.end) {
            const startDate = new Date(dateRange.start);
            const endDate = new Date(dateRange.end);
            
            // 计算需要显示的月份数量
            const monthsDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth()) + 1;
            
            // 截取最近的N个月数据
            if (monthsDiff > 0 && monthsDiff < filteredData.monthlyWorkload.length) {
                filteredData.monthlyWorkload = filteredData.monthlyWorkload.slice(-monthsDiff);
                filteredData.monthlyQuality = filteredData.monthlyQuality.slice(-monthsDiff);
                filteredData.monthlyEconomic = filteredData.monthlyEconomic.slice(-monthsDiff);
                filteredData.monthlyEfficiency = filteredData.monthlyEfficiency.slice(-monthsDiff);
            }
        }
        
        return filteredData;
    },
    
    // 显示/隐藏加载状态
    showLoading: function(show) {
        var loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = show ? 'flex' : 'none';
        }
    },
    
    // 筛选指标

    

    
    // 渲染满意度概览
    renderSatisfactionOverview: function(satisfactionOverview) {
        var satisfactionOverviewContainer = document.getElementById('satisfaction-overview-cards');
        console.log('满意度概览容器:', satisfactionOverviewContainer);
        if (!satisfactionOverviewContainer) {
            console.error('找不到满意度概览容器: satisfaction-overview-cards');
            return;
        }
        
        // 清空容器
        while (satisfactionOverviewContainer.firstChild) {
            satisfactionOverviewContainer.removeChild(satisfactionOverviewContainer.firstChild);
        }
        
        // 如果没有传入指标数据，使用默认数据
        if (!satisfactionOverview) {
            satisfactionOverview = this.mockData.satisfactionOverview;
            console.log('使用默认满意度概览数据:', satisfactionOverview);
        }
        
        // 确保satisfactionOverview是数组且不为空
        if (!satisfactionOverview || !Array.isArray(satisfactionOverview)) {
            console.warn('satisfactionOverview数据无效，使用默认数据');
            satisfactionOverview = this.mockData.satisfactionOverview;
        }
        
        console.log('准备渲染满意度概览，数据长度:', satisfactionOverview.length);
        
        // 渲染每个指标
        satisfactionOverview.forEach(function(indicator, index) {
            console.log('渲染满意度概览指标', index + 1, ':', indicator.name);
            var indicatorItem = PatientSatisfactionPage.createIndicatorItem(indicator);
            satisfactionOverviewContainer.appendChild(indicatorItem);
        });
        
        console.log('满意度概览渲染完成，容器子元素数量:', satisfactionOverviewContainer.children.length);
    },
    
    // 渲染满意度维度
    renderSatisfactionDimensions: function(satisfactionDimensions) {
        var satisfactionDimensionsContainer = document.getElementById('satisfaction-dimensions-cards');
        console.log('满意度维度容器:', satisfactionDimensionsContainer);
        if (!satisfactionDimensionsContainer) {
            console.error('找不到满意度维度容器: satisfaction-dimensions-cards');
            return;
        }
        
        // 清空容器
        while (satisfactionDimensionsContainer.firstChild) {
            satisfactionDimensionsContainer.removeChild(satisfactionDimensionsContainer.firstChild);
        }
        
        // 如果没有传入指标数据，使用默认数据
        if (!satisfactionDimensions) {
            satisfactionDimensions = this.mockData.satisfactionDimensions;
            console.log('使用默认满意度维度数据:', satisfactionDimensions);
        }
        
        // 确保satisfactionDimensions是数组且不为空
        if (!satisfactionDimensions || !Array.isArray(satisfactionDimensions)) {
            console.warn('satisfactionDimensions数据无效，使用默认数据');
            satisfactionDimensions = this.mockData.satisfactionDimensions;
        }
        
        console.log('准备渲染满意度维度，数据长度:', satisfactionDimensions.length);
        
        // 渲染每个指标
        satisfactionDimensions.forEach(function(indicator, index) {
            console.log('渲染满意度维度指标', index + 1, ':', indicator.name);
            var indicatorItem = PatientSatisfactionPage.createIndicatorItem(indicator);
            satisfactionDimensionsContainer.appendChild(indicatorItem);
        });
        
        console.log('满意度维度渲染完成，容器子元素数量:', satisfactionDimensionsContainer.children.length);
    },
    
    // 渲染调查管理
    renderSurveyManagement: function(surveyManagement) {
        var surveyManagementContainer = document.getElementById('surveyManagement');
        if (!surveyManagementContainer) return;
        
        // 清空容器
        while (surveyManagementContainer.firstChild) {
            surveyManagementContainer.removeChild(surveyManagementContainer.firstChild);
        }
        
        // 如果没有传入指标数据，使用默认数据
        if (!surveyManagement) {
            surveyManagement = this.mockData.surveyManagement;
        }
        
        // 渲染每个指标
        surveyManagement.forEach(function(indicator) {
            var indicatorItem = PatientSatisfactionPage.createIndicatorItem(indicator);
            surveyManagementContainer.appendChild(indicatorItem);
        });
    },
    
    // 渲染数据可视化
    renderVisualizationData: function(visualizationData) {
        var visualizationDataContainer = document.getElementById('visualizationData');
        if (!visualizationDataContainer) return;
        
        // 清空容器
        while (visualizationDataContainer.firstChild) {
            visualizationDataContainer.removeChild(visualizationDataContainer.firstChild);
        }
        
        // 如果没有传入指标数据，使用默认数据
        if (!visualizationData) {
            visualizationData = this.mockData.visualizationData;
        }
        
        // 渲染每个指标
        visualizationData.forEach(function(indicator) {
            var indicatorItem = PatientSatisfactionPage.createIndicatorItem(indicator);
            visualizationDataContainer.appendChild(indicatorItem);
        });
    },
    
    // 创建指标项元素
    createIndicatorItem: function(indicator) {
        var indicatorItem = document.createElement('div');
        indicatorItem.className = 'indicator-item';
        
        // 格式化当前值（处理货币和非货币值）
        var formattedCurrent = indicator.unit === '元' ? 
            this.formatCurrency(indicator.current) : indicator.current;
        
        var formattedPrevious = indicator.unit === '元' ? 
            this.formatCurrency(indicator.previous) : indicator.previous;
        
        var formattedTarget = indicator.unit === '元' ? 
            this.formatCurrency(indicator.target) : indicator.target;
        
        // 确定增长率和完成率的样式
        var growthRateClass = indicator.growthRate >= 0 ? 'positive' : 'negative';
        var growthRateSymbol = indicator.growthRate >= 0 ? '+' : '';
        
        var completionRateClass = indicator.completionRate >= 100 ? 'positive' : 'negative';
        
        // 创建指标项HTML
        indicatorItem.innerHTML = `
            <div class="indicator-header">
                <span class="indicator-name">${indicator.name}</span>
                <button class="btn btn-link btn-sm more-btn" title="查看详情">
                    <i class="icon-more"></i>
                </button>
            </div>
            <div class="indicator-body">
                <div class="indicator-main">
                    <div class="indicator-value">${formattedCurrent}${indicator.unit}</div>
                    <div class="indicator-growth ${growthRateClass}">较上期 ${growthRateSymbol}${indicator.growthRate}%</div>
                </div>
                <div class="indicator-target">
                    <div class="target-info">
                        <span>目标: ${formattedTarget}${indicator.unit}</span>
                        <span class="completion-rate ${completionRateClass}">完成率: ${indicator.completionRate}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(indicator.completionRate, 120)}%;"></div>
                    </div>
                </div>
            </div>
        `;
        
        // 添加查看详情按钮事件
        var moreBtn = indicatorItem.querySelector('.more-btn');
        if (moreBtn) {
            moreBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                PatientSatisfactionPage.viewIndicatorDetails(indicator);
            });
        }
        
        return indicatorItem;
    },
    
    // 查看指标详情
    viewIndicatorDetails: function(indicator) {
        alert(`查看${indicator.name}详情\n\n当前值: ${indicator.current}${indicator.unit}\n较上期: ${indicator.growthRate >= 0 ? '+' : ''}${indicator.growthRate}%\n目标值: ${indicator.target}${indicator.unit}\n完成率: ${indicator.completionRate}%`);
        // 实际项目中，这里会打开详情弹窗或跳转到详情页面
    },
    
    // 更新所有图表
    updateAllCharts: function(filteredData) {
        // 如果没有传入筛选数据，使用默认数据
        if (!filteredData) {
            filteredData = this.mockData;
        }
        
        this.updateSatisfactionTrendChart(filteredData.monthlySatisfaction);
        this.updateDimensionRadarChart(filteredData.monthlyDimensions);
        this.updateDepartmentComparisonChart(filteredData.departmentSatisfaction);
        this.updatePatientProfileChart(filteredData.patientProfile);
        this.updateSurveyStatsChart(filteredData.monthlySurvey);
        this.updateAnalysisReportChart(filteredData.targetCompletion);
        this.updateSatisfactionTrendChart2(filteredData.monthlySatisfaction);
        this.updateSatisfactionComparisonChart(filteredData.departmentSatisfaction);
    },
    
    // 根据指标类型更新图表
    updateChartsByType: function(contentId) {
        // 这里可以根据选择的指标类型显示/隐藏或更新特定的图表
        // 目前实现为更新所有图表，实际项目中可以根据需求优化
        this.updateAllCharts();
    },
    
    // 初始化满意度趋势图
    initSatisfactionTrendChart: function() {
        if (!this.state.charts.satisfactionTrend) {
            console.error('满意度趋势图表对象未初始化');
            return;
        }
        
        var option = {
            title: {
                text: '满意度趋势',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['总体满意度', '门诊满意度', '住院满意度'],
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
                data: this.mockData.monthlySatisfaction.map(function(item) { return item.month; })
            },
            yAxis: {
                type: 'value',
                min: 80,
                max: 95
            },
            series: [
                {
                    name: '总体满意度',
                    type: 'line',
                    data: this.mockData.monthlySatisfaction.map(function(item) { return item.overall; }),
                    smooth: true,
                    areaStyle: {
                        opacity: 0.3
                    }
                },
                {
                    name: '门诊满意度',
                    type: 'line',
                    data: this.mockData.monthlySatisfaction.map(function(item) { return item.outpatient; }),
                    smooth: true
                },
                {
                    name: '住院满意度',
                    type: 'line',
                    data: this.mockData.monthlySatisfaction.map(function(item) { return item.inpatient; }),
                    smooth: true
                }
            ]
        };
        
        try {
            this.state.charts.satisfactionTrend.setOption(option);
            console.log('满意度趋势图初始化成功');
        } catch (error) {
            console.error('满意度趋势图初始化失败:', error);
        }
    },
    
    // 更新满意度趋势图
    updateSatisfactionTrendChart: function(monthlySatisfaction) {
        // 检查图表对象是否存在
        if (!this.state.charts.satisfactionTrend) {
            console.warn('Satisfaction trend chart object not found');
            return;
        }
        
        // 如果没有传入数据，使用默认数据
        if (!monthlySatisfaction) monthlySatisfaction = this.mockData.monthlySatisfaction;
        
        this.state.charts.satisfactionTrend.setOption({
            xAxis: {
                data: monthlySatisfaction.map(function(item) { return item.month; })
            },
            series: [
                {
                    data: monthlySatisfaction.map(function(item) { return item.overall; })
                },
                {
                    data: monthlySatisfaction.map(function(item) { return item.outpatient; })
                },
                {
                    data: monthlySatisfaction.map(function(item) { return item.inpatient; })
                }
            ]
        });
    },
    
    // 初始化满意度维度雷达图
    initDimensionRadarChart: function() {
        if (!this.state.charts.dimensionRadar) {
            console.error('满意度维度雷达图表对象未初始化');
            return;
        }
        
        var latestData = this.mockData.monthlyDimensions[this.mockData.monthlyDimensions.length - 1];
        var option = {
            title: {
                text: '满意度维度分析',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                data: ['当前月份'],
                bottom: 10
            },
            radar: {
                indicator: [
                    { name: '诊疗流程', max: 100 },
                    { name: '服务质量', max: 100 },
                    { name: '护理质量', max: 100 },
                    { name: '医患沟通', max: 100 },
                    { name: '环境设施', max: 100 },
                    { name: '费用透明', max: 100 }
                ],
                radius: '60%'
            },
            series: [{
                name: '满意度维度',
                type: 'radar',
                data: [
                    {
                        value: [
                            latestData.process,
                            latestData.quality,
                            latestData.nursing,
                            latestData.communication,
                            latestData.environment,
                            latestData.cost
                        ],
                        name: '当前月份',
                        areaStyle: {
                            opacity: 0.3
                        }
                    }
                ]
            }]
        };
        
        try {
            this.state.charts.dimensionRadar.setOption(option);
            console.log('满意度维度雷达图初始化成功');
        } catch (error) {
            console.error('满意度维度雷达图初始化失败:', error);
        }
    },
    
    // 更新满意度维度雷达图
    updateDimensionRadarChart: function(monthlyDimensions) {
        // 检查图表对象是否存在
        if (!this.state.charts.dimensionRadar) {
            console.warn('Dimension radar chart object not found');
            return;
        }
        
        // 如果没有传入数据，使用默认数据
        if (!monthlyDimensions) monthlyDimensions = this.mockData.monthlyDimensions;
        
        var latestData = monthlyDimensions[monthlyDimensions.length - 1];
        this.state.charts.dimensionRadar.setOption({
            series: [{
                data: [
                    {
                        value: [
                            latestData.process,
                            latestData.quality,
                            latestData.nursing,
                            latestData.communication,
                            latestData.environment,
                            latestData.cost
                        ],
                        name: '当前月份'
                    }
                ]
            }]
        });
    },
    
    // 初始化科室满意度对比图
    initDepartmentComparisonChart: function() {
        var option = {
            title: {
                text: '科室满意度对比',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['总体满意度'],
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
                data: this.mockData.departmentSatisfaction.map(function(item) { return item.department; }),
                axisLabel: {
                    rotate: 45
                }
            },
            yAxis: {
                type: 'value',
                min: 80,
                max: 100,
                axisLabel: {
                    formatter: '{value}分'
                }
            },
            series: [
                {
                    name: '总体满意度',
                    type: 'bar',
                    data: this.mockData.departmentSatisfaction.map(function(item) { 
                        return {
                            value: item.overall,
                            itemStyle: {
                                color: item.overall >= 90 ? '#52c41a' : 
                                       item.overall >= 85 ? '#faad14' : '#ff4d4f'
                            }
                        };
                    }),
                    barWidth: '60%'
                }
            ]
        };
        
        this.state.charts.departmentComparison.setOption(option);
    },
    
    // 更新科室满意度对比图
    updateDepartmentComparisonChart: function(departmentSatisfaction) {
        // 检查图表对象是否存在
        if (!this.state.charts.departmentComparison) {
            console.warn('Department comparison chart object not found');
            return;
        }
        
        // 如果没有传入数据，使用默认数据
        if (!departmentSatisfaction) departmentSatisfaction = this.mockData.departmentSatisfaction;
        
        this.state.charts.departmentComparison.setOption({
            xAxis: {
                data: departmentSatisfaction.map(function(item) { return item.department; })
            },
            series: [
                {
                    data: departmentSatisfaction.map(function(item) { 
                        return {
                            value: item.overall,
                            itemStyle: {
                                color: item.overall >= 90 ? '#52c41a' : 
                                       item.overall >= 85 ? '#faad14' : '#ff4d4f'
                            }
                        };
                    })
                }
            ]
        });
    },
    
    // 初始化患者画像图
    initPatientProfileChart: function() {
        // 使用年龄分布作为默认显示
        var ageData = this.mockData.patientProfile[0];
        var data = [];
        for (var key in ageData) {
            if (key !== 'category') {
                data.push({
                    name: key,
                    value: ageData[key]
                });
            }
        }
        
        var option = {
            title: {
                text: '患者画像分析',
                subtext: '年龄分布',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c}% ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: data.map(function(item) { return item.name; })
            },
            series: [
                {
                    name: '年龄分布',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    center: ['60%', '50%'],
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
                    data: data
                }
            ]
        };
        
        this.state.charts.patientProfile.setOption(option);
    },
    
    // 更新患者画像图
    updatePatientProfileChart: function(patientProfile) {
        // 检查图表对象是否存在
        if (!this.state.charts.patientProfile) {
            console.warn('患者画像图表对象不存在，无法更新');
            return;
        }
        
        // 如果没有传入数据，使用默认数据
        if (!patientProfile) patientProfile = this.mockData.patientProfile;
        
        // 默认显示年龄分布
        var ageData = patientProfile[0];
        var data = [];
        for (var key in ageData) {
            if (key !== 'category') {
                data.push({
                    name: key,
                    value: ageData[key]
                });
            }
        }
        
        this.state.charts.patientProfile.setOption({
            title: {
                subtext: ageData.category
            },
            legend: {
                data: data.map(function(item) { return item.name; })
            },
            series: [
                {
                    name: ageData.category,
                    data: data
                }
            ]
        });
    },
    
    // 初始化调查统计图
    initSurveyStatsChart: function() {
        var option = {
            title: {
                text: '月度调查统计',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            legend: {
                data: ['调查份数', '回收份数', '回收率'],
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
                data: this.mockData.monthlySurvey.map(function(item) { return item.month; })
            },
            yAxis: [
                {
                    type: 'value',
                    name: '份数',
                    position: 'left',
                    min: 0,
                    max: 3000
                },
                {
                    type: 'value',
                    name: '回收率(%)',
                    position: 'right',
                    min: 85,
                    max: 95,
                    axisLabel: {
                        formatter: '{value}%'
                    }
                }
            ],
            series: [
                {
                    name: '调查份数',
                    type: 'bar',
                    data: this.mockData.monthlySurvey.map(function(item) { return item.surveys; }),
                    itemStyle: {
                        color: '#5470c6'
                    }
                },
                {
                    name: '回收份数',
                    type: 'bar',
                    data: this.mockData.monthlySurvey.map(function(item) { return item.responses; }),
                    itemStyle: {
                        color: '#91cc75'
                    }
                },
                {
                    name: '回收率',
                    type: 'line',
                    yAxisIndex: 1,
                    data: this.mockData.monthlySurvey.map(function(item) { return item.responseRate; }),
                    smooth: true,
                    itemStyle: {
                        color: '#fac858'
                    }
                }
            ]
        };
        
        this.state.charts.surveyStats.setOption(option);
    },
    
    // 更新调查统计图
    updateSurveyStatsChart: function(monthlySurvey) {
        // 检查图表对象是否存在
        if (!this.state.charts.surveyStats) {
            console.warn('调查统计图表对象不存在，无法更新');
            return;
        }
        
        // 如果没有传入数据，使用默认数据
        if (!monthlySurvey) monthlySurvey = this.mockData.monthlySurvey;
        
        this.state.charts.surveyStats.setOption({
            xAxis: {
                data: monthlySurvey.map(function(item) { return item.month; })
            },
            series: [
                {
                    data: monthlySurvey.map(function(item) { return item.surveys; })
                },
                {
                    data: monthlySurvey.map(function(item) { return item.responses; })
                },
                {
                    data: monthlySurvey.map(function(item) { return item.responseRate; })
                }
            ]
        });
    },
    
    // 初始化分析报告图
    initAnalysisReportChart: function() {
        var option = {
            title: {
                text: '满意度目标完成度',
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
                bottom: '10%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: this.mockData.targetCompletion.map(function(item) { return item.name; })
            },
            yAxis: {
                type: 'value',
                max: 120,
                axisLabel: {
                    formatter: '{value}%'
                }
            },
            series: [
                {
                    type: 'bar',
                    data: this.mockData.targetCompletion.map(function(item) { return item.value; }),
                    itemStyle: {
                        color: function(params) {
                            return params.value >= 100 ? '#52c41a' : '#faad14';
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
        
        this.state.charts.analysisReport.setOption(option);
    },
    
    // 初始化模板图表
    initTemplateChart: function() {
        // 检查图表对象是否存在
        if (!this.state.charts.template) {
            console.warn('Template chart object not found');
            return;
        }
        
        var option = {
            title: {
                text: '问卷模板使用情况',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: '模板类型',
                    type: 'pie',
                    radius: '50%',
                    data: [
                        { value: 6, name: '门诊模板' },
                        { value: 4, name: '住院模板' },
                        { value: 2, name: '专科模板' }
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
        
        this.state.charts.template.setOption(option);
    },
    
    // 初始化报告图表
    initReportChart: function() {
        // 检查图表对象是否存在
        if (!this.state.charts.report) {
            console.warn('Report chart object not found');
            return;
        }
        
        var option = {
            title: {
                text: '数据分析报告统计',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['月度报告', '季度报告', '年度报告'],
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
                data: ['1月', '2月', '3月', '4月', '5月', '6月']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '月度报告',
                    type: 'bar',
                    data: [2, 2, 2, 2, 2, 2],
                    itemStyle: {
                        color: '#1890ff'
                    }
                },
                {
                    name: '季度报告',
                    type: 'bar',
                    data: [0, 0, 1, 0, 0, 1],
                    itemStyle: {
                        color: '#52c41a'
                    }
                },
                {
                    name: '年度报告',
                    type: 'bar',
                    data: [0, 0, 0, 0, 0, 1],
                    itemStyle: {
                        color: '#faad14'
                    }
                }
            ]
        };
        
        this.state.charts.report.setOption(option);
    },
    
    // 更新分析报告图
    updateAnalysisReportChart: function(targetCompletion) {
        // 检查图表对象是否存在
        if (!this.state.charts.analysisReport) {
            console.warn('Analysis report chart object not found');
            return;
        }
        
        // 如果没有传入数据，使用默认数据
        if (!targetCompletion) targetCompletion = this.mockData.targetCompletion;
        
        this.state.charts.analysisReport.setOption({
            xAxis: {
                data: targetCompletion.map(function(item) { return item.name; })
            },
            series: [
                {
                    data: targetCompletion.map(function(item) { return item.value; })
                }
            ]
        });
    },
    
    // 初始化满意度趋势图（第二个）
    initSatisfactionTrendChart2: function() {
        var option = {
            title: {
                text: '满意度趋势分析',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            legend: {
                data: ['总体满意度', '门诊满意度', '住院满意度'],
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
                data: this.mockData.monthlySatisfaction.map(function(item) { return item.month; })
            },
            yAxis: {
                type: 'value',
                min: 80,
                max: 95,
                axisLabel: {
                    formatter: '{value}分'
                }
            },
            series: [
                {
                    name: '总体满意度',
                    type: 'line',
                    smooth: true,
                    data: this.mockData.monthlySatisfaction.map(function(item) { return item.overall; })
                },
                {
                    name: '门诊满意度',
                    type: 'line',
                    smooth: true,
                    data: this.mockData.monthlySatisfaction.map(function(item) { return item.outpatient; })
                },
                {
                    name: '住院满意度',
                    type: 'line',
                    smooth: true,
                    data: this.mockData.monthlySatisfaction.map(function(item) { return item.inpatient; })
                }
            ]
        };
        
        this.state.charts.satisfactionTrend2.setOption(option);
    },
    
    // 更新满意度趋势图（第二个）
    updateSatisfactionTrendChart2: function(monthlySatisfaction) {
        // 检查图表对象是否存在
        if (!this.state.charts.satisfactionTrend2) {
            console.warn('满意度趋势图2对象不存在，无法更新');
            return;
        }
        
        // 如果没有传入数据，使用默认数据
        if (!monthlySatisfaction) monthlySatisfaction = this.mockData.monthlySatisfaction;
        
        this.state.charts.satisfactionTrend2.setOption({
            xAxis: {
                data: monthlySatisfaction.map(function(item) { return item.month; })
            },
            series: [
                {
                    data: monthlySatisfaction.map(function(item) { return item.overall; })
                },
                {
                    data: monthlySatisfaction.map(function(item) { return item.outpatient; })
                },
                {
                    data: monthlySatisfaction.map(function(item) { return item.inpatient; })
                }
            ]
        });
    },
    
    // 初始化满意度对比图（第二个）
    initSatisfactionComparisonChart: function() {
        var option = {
            title: {
                text: '科室满意度对比',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['总体满意度', '服务质量', '环境设施'],
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
                data: this.mockData.departmentSatisfaction.map(function(item) { return item.department; })
            },
            yAxis: {
                type: 'value',
                min: 80,
                max: 100,
                axisLabel: {
                    formatter: '{value}分'
                }
            },
            series: [
                {
                    name: '总体满意度',
                    type: 'bar',
                    data: this.mockData.departmentSatisfaction.map(function(item) { return item.overall; })
                },
                {
                    name: '服务质量',
                    type: 'bar',
                    data: this.mockData.departmentSatisfaction.map(function(item) { return item.quality; })
                },
                {
                    name: '环境设施',
                    type: 'bar',
                    data: this.mockData.departmentSatisfaction.map(function(item) { return item.environment; })
                }
            ]
        };
        
        this.state.charts.satisfactionComparison.setOption(option);
    },
    
    // 更新满意度对比图（第二个）
    updateSatisfactionComparisonChart: function(departmentSatisfaction) {
        // 检查图表对象是否存在
        if (!this.state.charts.satisfactionComparison) {
            console.warn('满意度对比图表对象不存在，无法更新');
            return;
        }
        
        // 如果没有传入数据，使用默认数据
        if (!departmentSatisfaction) departmentSatisfaction = this.mockData.departmentSatisfaction;
        
        // 如果选择了特定科室，突出显示该科室
        const { currentDepartment } = this.state;
        
        this.state.charts.satisfactionComparison.setOption({
            xAxis: {
                data: departmentSatisfaction.map(function(item) { return item.department; })
            },
            series: [
                {
                    data: departmentSatisfaction.map(function(item, index) {
                        return {
                            value: item.overall,
                            itemStyle: currentDepartment && item.department === currentDepartment ? 
                                { color: '#1890ff' } : null
                        };
                    })
                },
                {
                    data: departmentSatisfaction.map(function(item, index) {
                        return {
                            value: item.quality,
                            itemStyle: currentDepartment && item.department === currentDepartment ? 
                                { color: '#1890ff' } : null
                        };
                    })
                },
                {
                    data: departmentSatisfaction.map(function(item, index) {
                        return {
                            value: item.environment,
                            itemStyle: currentDepartment && item.department === currentDepartment ? 
                                { color: '#1890ff' } : null
                        };
                    })
                }
            ]
        });
    },
    
    // 导出报告
    exportReport: function() {
        alert('指标报告导出功能已触发，实际项目中会生成并下载PDF或Excel报告');
        // 实际项目中，这里会调用后端API生成报告并下载
    },
    
    // 格式化货币
    formatCurrency: function(value) {
        if (typeof value !== 'number') return value;
        
        if (value >= 10000) {
            return (value / 10000).toFixed(1) + '万';
        }
        
        return value.toLocaleString();
    },

    // 模板管理相关方法
    showTemplateDetails: function() {
        const modal = document.getElementById('templateModal');
        if (modal) {
            this.populateTemplateDetails();
            modal.style.display = 'block';
        }
    },

    hideTemplateDetails: function() {
        const modal = document.getElementById('templateModal');
        if (modal) {
            modal.style.display = 'none';
            this.resetTemplateForm();
        }
    },

    populateTemplateDetails: function() {
        const template = this.mockData.templateData;
        
        // 填充基本信息
        const nameElement = document.getElementById('templateName');
        if (nameElement) nameElement.textContent = template.name;
        
        const codeElement = document.getElementById('templateCode');
        if (codeElement) codeElement.textContent = template.code;
        
        const startDateElement = document.getElementById('templateStartDate');
        if (startDateElement) startDateElement.textContent = template.startDate;
        
        const endDateElement = document.getElementById('templateEndDate');
        if (endDateElement) endDateElement.textContent = template.endDate;
        
        const createDateElement = document.getElementById('templateCreateDate');
        if (createDateElement) createDateElement.textContent = template.createDate;
        
        const creatorElement = document.getElementById('templateCreator');
        if (creatorElement) creatorElement.textContent = template.creator;
        
        const statusElement = document.getElementById('templateStatus');
        if (statusElement) {
            const statusText = this.getStatusText(template.status);
            statusElement.textContent = statusText;
            statusElement.className = 'template-status ' + template.status;
        }
        
        const usageCountElement = document.getElementById('templateUsageCount');
        if (usageCountElement) usageCountElement.textContent = template.usageCount;
        
        // 填充问题列表
        this.populateQuestionList(template.questions);
        
        // 更新按钮状态
        this.updateTemplateButtons(template.status);
    },

    populateQuestionList: function(questions) {
        const questionList = document.getElementById('templateQuestionList');
        if (!questionList) return;
        
        questionList.innerHTML = '';
        questions.forEach(function(question, index) {
            const questionItem = document.createElement('div');
            questionItem.className = 'question-item';
            questionItem.innerHTML = `
                <div class="question-number">${index + 1}</div>
                <div class="question-content">
                    <div class="question-text">${question.text}</div>
                    <div class="question-meta">
                        <span class="question-type">${question.type}</span>
                        ${question.required ? '<span class="question-required">必填</span>' : '<span class="question-optional">选填</span>'}
                    </div>
                </div>
            `;
            questionList.appendChild(questionItem);
        });
    },

    getStatusText: function(status) {
        const statusMap = {
            'draft': '草稿',
            'published': '已发布',
            'reviewing': '审核中',
            'withdrawn': '已撤回'
        };
        return statusMap[status] || status;
    },

    updateTemplateButtons: function(status) {
        const editBtn = document.getElementById('templateEditBtn');
        const publishBtn = document.getElementById('templatePublishBtn');
        const reviewBtn = document.getElementById('templateReviewBtn');
        const withdrawBtn = document.getElementById('templateWithdrawBtn');
        const saveBtn = document.getElementById('templateSaveBtn');
        
        // 隐藏所有按钮
        [editBtn, publishBtn, reviewBtn, withdrawBtn, saveBtn].forEach(function(btn) {
            if (btn) btn.style.display = 'none';
        });
        
        // 根据状态显示相应按钮
        switch(status) {
            case 'draft':
                if (editBtn) editBtn.style.display = 'inline-block';
                if (publishBtn) publishBtn.style.display = 'inline-block';
                if (reviewBtn) reviewBtn.style.display = 'inline-block';
                break;
            case 'published':
                if (editBtn) editBtn.style.display = 'inline-block';
                if (withdrawBtn) withdrawBtn.style.display = 'inline-block';
                break;
            case 'reviewing':
                if (withdrawBtn) withdrawBtn.style.display = 'inline-block';
                break;
            case 'withdrawn':
                if (editBtn) editBtn.style.display = 'inline-block';
                if (publishBtn) publishBtn.style.display = 'inline-block';
                break;
        }
    },

    enableTemplateNameEdit: function() {
        const nameElement = document.getElementById('templateName');
        if (!nameElement) return;
        
        const currentName = nameElement.textContent;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentName;
        input.className = 'template-name-input';
        input.id = 'templateNameInput';
        
        nameElement.style.display = 'none';
        nameElement.parentNode.insertBefore(input, nameElement.nextSibling);
        
        input.focus();
        input.select();
        
        // 保存按钮显示
        const saveBtn = document.getElementById('templateSaveBtn');
        if (saveBtn) saveBtn.style.display = 'inline-block';
        
        // 回车保存
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                PatientSatisfactionPage.saveTemplateName();
            }
        });
        
        // 失去焦点保存
        input.addEventListener('blur', function() {
            PatientSatisfactionPage.saveTemplateName();
        });
    },

    saveTemplateName: function() {
        const input = document.getElementById('templateNameInput');
        const nameElement = document.getElementById('templateName');
        
        if (input && nameElement) {
            const newName = input.value.trim();
            if (newName) {
                nameElement.textContent = newName;
                this.mockData.templateData.name = newName;
            }
            
            nameElement.style.display = 'inline';
            input.remove();
        }
    },

    editTemplate: function() {
        alert('编辑模板功能');
        // 这里可以跳转到模板编辑页面或开启编辑模式
    },

    saveTemplate: function() {
        this.saveTemplateName();
        alert('模板已保存');
        this.hideTemplateDetails();
    },

    publishTemplate: function() {
        if (confirm('确定要发布此模板吗？发布后将可以被使用。')) {
            this.mockData.templateData.status = 'published';
            alert('模板已发布');
            this.populateTemplateDetails();
        }
    },

    submitForReview: function() {
        if (confirm('确定要提交审核吗？提交后需要等待审核通过。')) {
            this.mockData.templateData.status = 'reviewing';
            alert('已提交审核');
            this.populateTemplateDetails();
        }
    },

    withdrawTemplate: function() {
        if (confirm('确定要撤回此模板吗？撤回后将停止使用。')) {
            this.mockData.templateData.status = 'withdrawn';
            alert('模板已撤回');
            this.populateTemplateDetails();
        }
    },

    resetTemplateForm: function() {
        // 重置表单状态
        const nameElement = document.getElementById('templateName');
        const input = document.getElementById('templateNameInput');
        
        if (input && nameElement) {
            nameElement.style.display = 'inline';
            input.remove();
        }
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM加载完成，准备初始化页面...');
    // 检查是否有ECharts库
    if (typeof echarts === 'undefined') {
        console.error('ECharts库未加载');
        return;
    }
    
    // 添加短暂延迟确保DOM完全准备好
    setTimeout(function() {
        console.log('开始初始化PatientSatisfactionPage...');
        PatientSatisfactionPage.init();
    }, 100);
});