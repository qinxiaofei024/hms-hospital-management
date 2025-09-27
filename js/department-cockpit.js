// 科主任驾驶舱页面逻辑
console.log('department-cockpit.js 文件已加载');
var DepartmentCockpitPage = {
    // 页面状态
    state: {
        currentDepartment: '',
        dateRange: {
            start: '',
            end: ''
        },
        timeDimension: 'month', // month, quarter, year
        charts: {
            overallTrendChart: null,
            workloadTrendChart: null,
            qualityTrendChart: null,
            economicTrendChart: null,
            departmentComparisonChart: null,
            resourceUtilizationChart: null,
            bedOccupancyRateChart: null,
            avgLengthOfStayChart: null,
            operationEfficiencyChart: null
        }
    },
    
    // 模拟数据
    mockData: {
        // 关键指标数据
        keyIndicators: {
            outpatientVolume: {
                current: 12580,
                previous: 11630,
                growthRate: 8.2
            },
            inpatientVolume: {
                current: 2856,
                previous: 2714,
                growthRate: 5.2
            },
            surgeryVolume: {
                current: 1423,
                previous: 1441,
                growthRate: -1.2
            },
            totalRevenue: {
                current: 48650000,
                previous: 44920000,
                growthRate: 8.3
            },
            bedOccupancyRate: {
                current: 88.5,
                previous: 87.2,
                growthRate: 1.3
            },
            avgLengthOfStay: {
                current: 7.8,
                previous: 8.1,
                growthRate: -3.7
            },
            medicalQuality: {
                current: 96.2,
                previous: 95.7,
                growthRate: 0.5
            },
            patientSatisfaction: {
                current: 95.8,
                previous: 94.9,
                growthRate: 0.9
            }
        },
        
        // 预警信息数据
        warningMessages: [
            {
                id: 1,
                title: '药品费用占比偏高',
                content: '本科室药品费用占比达到42%，超过医院标准38%',
                level: 'warning',
                time: '2023-11-01 09:15',
                status: 'unread'
            },
            {
                id: 2,
                title: '床位使用率下降',
                content: '近一周科室床位使用率较上月同期下降5.3%',
                level: 'warning',
                time: '2023-10-28 14:30',
                status: 'unread'
            },
            {
                id: 3,
                title: '平均住院日延长',
                content: '本月科室平均住院日较上月延长0.5天',
                level: 'alert',
                time: '2023-10-25 11:20',
                status: 'read'
            },
            {
                id: 4,
                title: '次均费用增长过快',
                content: '次均费用同比增长8.7%，高于医院平均水平',
                level: 'alert',
                time: '2023-10-20 16:45',
                status: 'read'
            },
            {
                id: 5,
                title: '医疗纠纷预警',
                content: '本月科室医疗投诉较上月增加2起',
                level: 'alert',
                time: '2023-10-18 10:05',
                status: 'read'
            }
        ],
        
        // 月度工作量趋势数据
        monthlyWorkload: [
            { month: '1月', outpatientVolume: 10250, inpatientVolume: 2350, surgeryVolume: 1120 },
            { month: '2月', outpatientVolume: 9800, inpatientVolume: 2200, surgeryVolume: 1050 },
            { month: '3月', outpatientVolume: 11500, inpatientVolume: 2580, surgeryVolume: 1250 },
            { month: '4月', outpatientVolume: 11800, inpatientVolume: 2620, surgeryVolume: 1300 },
            { month: '5月', outpatientVolume: 12200, inpatientVolume: 2700, surgeryVolume: 1350 },
            { month: '6月', outpatientVolume: 12800, inpatientVolume: 2780, surgeryVolume: 1380 },
            { month: '7月', outpatientVolume: 13200, inpatientVolume: 2820, surgeryVolume: 1400 },
            { month: '8月', outpatientVolume: 13500, inpatientVolume: 2860, surgeryVolume: 1410 },
            { month: '9月', outpatientVolume: 13100, inpatientVolume: 2840, surgeryVolume: 1430 },
            { month: '10月', outpatientVolume: 12580, inpatientVolume: 2856, surgeryVolume: 1423 }
        ],
        
        // 月度收入趋势数据
        monthlyRevenue: [
            { month: '1月', revenue: 37800000, cost: 26500000, profit: 11300000 },
            { month: '2月', revenue: 36500000, cost: 25800000, profit: 10700000 },
            { month: '3月', revenue: 40200000, cost: 28300000, profit: 11900000 },
            { month: '4月', revenue: 41500000, cost: 29100000, profit: 12400000 },
            { month: '5月', revenue: 42800000, cost: 29800000, profit: 13000000 },
            { month: '6月', revenue: 44300000, cost: 30600000, profit: 13700000 },
            { month: '7月', revenue: 45800000, cost: 31200000, profit: 14600000 },
            { month: '8月', revenue: 47200000, cost: 32000000, profit: 15200000 },
            { month: '9月', revenue: 46800000, cost: 31800000, profit: 15000000 },
            { month: '10月', revenue: 48650000, cost: 32900000, profit: 15750000 }
        ],
        
        // 医疗质量指标数据
        qualityIndicators: [
            { name: '甲级病案率', target: 95, actual: 96.2 },
            { name: '处方合格率', target: 98, actual: 98.5 },
            { name: '三日确诊率', target: 90, actual: 92.8 },
            { name: '手术并发症发生率', target: 2, actual: 1.5 },
            { name: '医院感染率', target: 5, actual: 3.2 }
        ],
        
        // 科室对比数据
        departmentComparison: [
            { department: '心内科', outpatientRank: 3, inpatientRank: 2, surgeryRank: 4, revenueRank: 2, qualityRank: 1 },
            { department: '骨科', outpatientRank: 4, inpatientRank: 3, surgeryRank: 1, revenueRank: 1, qualityRank: 3 },
            { department: '消化内科', outpatientRank: 2, inpatientRank: 4, surgeryRank: 7, revenueRank: 4, qualityRank: 2 },
            { department: '呼吸内科', outpatientRank: 1, inpatientRank: 1, surgeryRank: 6, revenueRank: 3, qualityRank: 4 },
            { department: '神经内科', outpatientRank: 5, inpatientRank: 5, surgeryRank: 2, revenueRank: 5, qualityRank: 5 },
            { department: '妇产科', outpatientRank: 6, inpatientRank: 6, surgeryRank: 5, revenueRank: 6, qualityRank: 6 },
            { department: '儿科', outpatientRank: 7, inpatientRank: 7, surgeryRank: 8, revenueRank: 7, qualityRank: 7 }
        ],
        
        // 资源利用效率数据
        resourceUtilization: [
            { name: '医生人均门诊量', current: 8.5, target: 8.0 },
            { name: '医生人均手术量', current: 3.2, target: 3.0 },
            { name: '护士人均护理病人数', current: 6.8, target: 6.5 },
            { name: '大型设备使用率', current: 72, target: 70 },
            { name: '材料利用率', current: 85, target: 80 }
        ],
        
        // 床位使用率数据
        bedOccupancyRate: [
            { name: '心内科', rate: 88.5 },
            { name: '骨科', rate: 87.2 },
            { name: '消化内科', rate: 89.1 },
            { name: '呼吸内科', rate: 92.3 },
            { name: '神经内科', rate: 86.7 },
            { name: '妇产科', rate: 84.2 },
            { name: '儿科', rate: 82.9 }
        ],
        
        // 平均住院日数据
        avgLengthOfStay: [
            { name: '心内科', days: 7.8 },
            { name: '骨科', days: 8.5 },
            { name: '消化内科', days: 7.2 },
            { name: '呼吸内科', days: 8.1 },
            { name: '神经内科', days: 9.2 },
            { name: '妇产科', days: 5.8 },
            { name: '儿科', days: 6.2 }
        ],
        
        // 运营效率数据
        operationEfficiency: [
            { name: '预约挂号率', current: 78, target: 75 },
            { name: '检查报告及时性', current: 93, target: 90 },
            { name: '平均候诊时间(分钟)', current: 18, target: 20 },
            { name: '平均住院日', current: 7.8, target: 8.0 },
            { name: '床位周转次数', current: 32, target: 30 }
        ],
        
        // 医生层面数据
        doctorData: {
            outpatient: [
                { id: 1, name: '张**', outpatientVolume: 2580, satisfaction: 96.5, avgWaitTime: 15 },
                { id: 2, name: '李**', outpatientVolume: 2340, satisfaction: 95.8, avgWaitTime: 18 },
                { id: 3, name: '王**', outpatientVolume: 2180, satisfaction: 97.2, avgWaitTime: 12 },
                { id: 4, name: '陈**', outpatientVolume: 2020, satisfaction: 94.6, avgWaitTime: 20 },
                { id: 5, name: '刘**', outpatientVolume: 1960, satisfaction: 96.1, avgWaitTime: 16 },
                { id: 6, name: '赵**', outpatientVolume: 1500, satisfaction: 95.3, avgWaitTime: 14 }
            ],
            inpatient: [
                { id: 1, name: '张**', inpatientVolume: 580, avgStay: 7.2, satisfaction: 97.1 },
                { id: 2, name: '李**', inpatientVolume: 520, avgStay: 8.1, satisfaction: 96.3 },
                { id: 3, name: '王**', inpatientVolume: 480, avgStay: 7.8, satisfaction: 95.8 },
                { id: 4, name: '陈**', inpatientVolume: 460, avgStay: 7.5, satisfaction: 96.7 },
                { id: 5, name: '刘**', inpatientVolume: 420, avgStay: 8.3, satisfaction: 94.9 },
                { id: 6, name: '赵**', inpatientVolume: 396, avgStay: 7.9, satisfaction: 95.5 }
            ],
            surgery: [
                { id: 1, name: '张**', surgeryVolume: 285, successRate: 98.9, avgTime: 120 },
                { id: 2, name: '李**', surgeryVolume: 268, successRate: 99.2, avgTime: 115 },
                { id: 3, name: '王**', surgeryVolume: 245, successRate: 98.6, avgTime: 135 },
                { id: 4, name: '陈**', surgeryVolume: 230, successRate: 99.1, avgTime: 110 },
                { id: 5, name: '刘**', surgeryVolume: 215, successRate: 98.8, avgTime: 125 },
                { id: 6, name: '赵**', surgeryVolume: 180, successRate: 99.0, avgTime: 118 }
            ],
            revenue: [
                { id: 1, name: '张**', revenue: 8650000, drugRatio: 35.2, examRatio: 28.5 },
                { id: 2, name: '李**', revenue: 7980000, drugRatio: 38.1, examRatio: 26.8 },
                { id: 3, name: '王**', revenue: 7520000, drugRatio: 36.7, examRatio: 29.2 },
                { id: 4, name: '陈**', revenue: 7200000, drugRatio: 34.9, examRatio: 30.1 },
                { id: 5, name: '刘**', revenue: 6890000, drugRatio: 37.3, examRatio: 27.6 },
                { id: 6, name: '赵**', revenue: 6410000, drugRatio: 39.2, examRatio: 25.9 }
            ],
            cmi: [
                { id: 1, name: '张**', cmi: 1.45, caseComplexity: '高', specialtyLevel: '三级' },
                { id: 2, name: '李**', cmi: 1.38, caseComplexity: '高', specialtyLevel: '三级' },
                { id: 3, name: '王**', cmi: 1.32, caseComplexity: '中高', specialtyLevel: '二级' },
                { id: 4, name: '陈**', cmi: 1.28, caseComplexity: '中', specialtyLevel: '二级' },
                { id: 5, name: '刘**', cmi: 1.25, caseComplexity: '中', specialtyLevel: '二级' },
                { id: 6, name: '赵**', cmi: 1.18, caseComplexity: '中低', specialtyLevel: '一级' }
            ],
            avgstay: [
                { id: 1, name: '张**', avgStay: 6.8, bedTurnover: 35, efficiency: '优秀' },
                { id: 2, name: '李**', avgStay: 7.2, bedTurnover: 32, efficiency: '良好' },
                { id: 3, name: '王**', avgStay: 7.8, bedTurnover: 30, efficiency: '良好' },
                { id: 4, name: '陈**', avgStay: 8.1, bedTurnover: 28, efficiency: '一般' },
                { id: 5, name: '刘**', avgStay: 8.5, bedTurnover: 26, efficiency: '一般' },
                { id: 6, name: '赵**', avgStay: 9.2, bedTurnover: 24, efficiency: '待改进' }
            ]
        }
    },
    
    // 初始化页面
    init: function() {
        console.log('DepartmentCockpitPage.init() 开始执行');
        try {
            this.initCharts();
            console.log('initCharts() 完成');
        } catch (e) {
            console.error('initCharts() 出错:', e);
        }
        
        try {
            this.loadData();
            console.log('loadData() 完成');
        } catch (e) {
            console.error('loadData() 出错:', e);
        }
        
        try {
            this.initEventListeners();
            console.log('initEventListeners() 完成');
        } catch (e) {
            console.error('initEventListeners() 出错:', e);
        }
        console.log('DepartmentCockpitPage.init() 执行完成');
    },
    
    // 初始化图表
    initCharts: function() {
        // 初始化图表实例，只初始化HTML中存在的容器
        const containers = [
            'workloadTrendChart',
            'revenueStructureChart',
            'doctorEfficiencyChart',
            'diseaseDistributionChart',
            'departmentComparisonChart'
        ];
        
        containers.forEach(containerId => {
              const element = document.getElementById(containerId);
              console.log(`检查容器 ${containerId}:`, element);
              
              if (element && element.nodeType === Node.ELEMENT_NODE) {
                  console.log(`初始化图表容器: ${containerId}`, element.offsetWidth, 'x', element.offsetHeight);
                  try {
                      // 确保元素有尺寸
                      if (element.offsetWidth > 0 && element.offsetHeight > 0) {
                          this.state.charts[containerId] = echarts.init(element);
                          console.log(`图表容器 ${containerId} 初始化成功`);
                      } else {
                          console.warn(`图表容器 ${containerId} 尺寸为0，跳过初始化`);
                      }
                  } catch (error) {
                      console.error(`图表容器 ${containerId} 初始化失败:`, error);
                  }
              } else {
                  console.warn(`图表容器 ${containerId} 不存在或不是有效元素`);
              }
          });
        
        // 设置窗口大小改变时的响应
        window.addEventListener('resize', function() {
            for (var chartKey in DepartmentCockpitPage.state.charts) {
                if (DepartmentCockpitPage.state.charts[chartKey]) {
                    DepartmentCockpitPage.state.charts[chartKey].resize();
                }
            }
        });
        
        // 初始化各图表
        this.initWorkloadTrendChart();
        this.initRevenueStructureChart();
        this.initDoctorEfficiencyChart();
        this.initDiseaseDistributionChart();
        this.initDepartmentComparisonChart();
    },
    
    // 初始化事件监听器
    initEventListeners: function() {
        console.log('initEventListeners 函数开始执行');
        // 时间维度选择事件
        document.querySelectorAll('.time-dimension-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.time-dimension-btn').forEach(function(b) {
                    b.classList.remove('active');
                });
                this.classList.add('active');
                DepartmentCockpitPage.state.timeDimension = this.dataset.dimension;
                DepartmentCockpitPage.refreshData();
            });
        });
        
        // 日期范围选择事件
        var dateRangePicker = document.getElementById('dateRangePicker');
        if (dateRangePicker) {
            dateRangePicker.addEventListener('change', function() {
                var value = this.value.split(' - ');
                if (value.length === 2) {
                    DepartmentCockpitPage.state.dateRange.start = value[0];
                    DepartmentCockpitPage.state.dateRange.end = value[1];
                    DepartmentCockpitPage.refreshData();
                }
            });
        }
        
        // 科室选择事件
        var departmentSelect = document.getElementById('department-select');
        if (departmentSelect) {
            departmentSelect.addEventListener('change', function() {
                DepartmentCockpitPage.state.currentDepartment = this.value;
                DepartmentCockpitPage.refreshData();
            });
        }
        
        // 刷新按钮事件
        var refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', function() {
                DepartmentCockpitPage.refreshData();
            });
        }
        
        // 导出按钮事件
        var exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', function() {
                DepartmentCockpitPage.exportReport();
            });
        }
        
        // 预警信息点击事件
        document.querySelectorAll('.warning-item').forEach(function(item) {
            item.addEventListener('click', function() {
                this.classList.remove('unread');
                this.classList.add('read');
                // 这里可以添加查看预警详情的逻辑
            });
        });
        
        // 指标卡片点击事件 - 下钻功能
        document.querySelectorAll('.indicator-card').forEach(function(card) {
            card.addEventListener('click', function() {
                var indicatorType = this.dataset.type;
                DepartmentCockpitPage.drillDown(indicatorType);
            });
        });

        // 可点击指标文字的点击事件
        var clickableIndicators = document.querySelectorAll('.clickable-indicator');
        console.log('找到可点击指标元素数量:', clickableIndicators.length);
        
        clickableIndicators.forEach(function(indicator) {
            console.log('绑定事件到指标:', indicator.dataset.indicator, indicator);
            indicator.addEventListener('click', function(e) {
                console.log('指标被点击:', this.dataset.indicator);
                e.stopPropagation(); // 阻止事件冒泡
                var indicatorType = this.dataset.indicator;
                DepartmentCockpitPage.showDoctorModal(indicatorType);
            });
        });

        // 弹窗关闭事件
        var modals = document.querySelectorAll('.modal');
        modals.forEach(function(modal) {
            // 点击关闭按钮
            var closeBtn = modal.querySelector('.close');
            if (closeBtn) {
                closeBtn.addEventListener('click', function() {
                    modal.style.display = 'none';
                });
            }
            
            // 点击弹窗外部区域关闭
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
    },
    
    // 加载数据
    loadData: function() {
        // 设置当前科室
        var departmentSelect = document.getElementById('department-select');
        this.state.currentDepartment = departmentSelect ? departmentSelect.value : '心内科';
        
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
        
        // 渲染关键指标
        this.renderKeyIndicators();
        
        // 渲染预警信息
        this.renderWarningMessages();
        
        // 更新图表数据
        this.updateAllCharts();
    },
    
    // 刷新数据
    refreshData: function() {
        // 显示加载状态
        this.showLoading(true);
        
        // 模拟数据加载延迟
        setTimeout(function() {
            // 根据当前选择的科室和时间范围筛选数据
            const filteredData = DepartmentCockpitPage.filterDataBySelection();
            
            // 重新渲染关键指标
            DepartmentCockpitPage.renderKeyIndicators(filteredData.keyIndicators);
            
            // 重新渲染预警信息
            DepartmentCockpitPage.renderWarningMessages(filteredData.warningMessages);
            
            // 更新所有图表
            DepartmentCockpitPage.updateAllCharts(filteredData);
            
            // 隐藏加载状态
            DepartmentCockpitPage.showLoading(false);
        }, 500);
    },
    
    // 根据选择的科室和时间范围筛选数据
    filterDataBySelection: function() {
        const { currentDepartment, dateRange } = this.state;
        
        // 复制原始数据以避免修改
        const filteredData = JSON.parse(JSON.stringify(this.mockData));
        
        // 如果选择了特定科室，为关键指标添加科室差异
        if (currentDepartment) {
            // 为关键指标添加随机波动，模拟不同科室的数据差异
            const indicators = filteredData.keyIndicators;
            for (const key in indicators) {
                if (indicators.hasOwnProperty(key)) {
                    const factor = 0.8 + Math.random() * 0.4; // 0.8-1.2的随机因子
                    indicators[key].current = Math.round(indicators[key].current * factor);
                    indicators[key].previous = Math.round(indicators[key].previous * factor);
                    // 重新计算增长率
                    indicators[key].growthRate = parseFloat((((indicators[key].current - indicators[key].previous) / indicators[key].previous) * 100).toFixed(1));
                }
            }
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
                filteredData.monthlyRevenue = filteredData.monthlyRevenue.slice(-monthsDiff);
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
    
    // 渲染关键指标
    renderKeyIndicators: function(indicators) {
        // 如果没有传入指标数据，使用默认数据
        if (!indicators) {
            indicators = this.mockData.keyIndicators;
        }
        
        // 渲染门诊人次
        this.renderIndicator('outpatientVolume', indicators.outpatientVolume.current, 
            indicators.outpatientVolume.growthRate);
        
        // 渲染出院人次
        this.renderIndicator('inpatientVolume', indicators.inpatientVolume.current, 
            indicators.inpatientVolume.growthRate);
        
        // 渲染手术量
        this.renderIndicator('surgeryVolume', indicators.surgeryVolume.current, 
            indicators.surgeryVolume.growthRate);
        
        // 渲染总收入
        this.renderIndicator('totalRevenue', this.formatCurrency(indicators.totalRevenue.current), 
            indicators.totalRevenue.growthRate, true);
        
        // 渲染床位使用率
        this.renderIndicator('bedOccupancyRate', indicators.bedOccupancyRate.current + '%', 
            indicators.bedOccupancyRate.growthRate);
        
        // 渲染平均住院日
        this.renderIndicator('avgLengthOfStay', indicators.avgLengthOfStay.current + '天', 
            indicators.avgLengthOfStay.growthRate);
        
        // 渲染医疗质量
        this.renderIndicator('medicalQuality', indicators.medicalQuality.current + '%', 
            indicators.medicalQuality.growthRate);
        
        // 渲染患者满意度
        this.renderIndicator('patientSatisfaction', indicators.patientSatisfaction.current + '%', 
            indicators.patientSatisfaction.growthRate);
    },
    
    // 渲染单个指标
    renderIndicator: function(indicatorId, value, growthRate, isCurrency) {
        var indicatorElement = document.getElementById(indicatorId);
        if (!indicatorElement) return;
        
        var valueElement = indicatorElement.querySelector('.indicator-value');
        var growthElement = indicatorElement.querySelector('.indicator-growth');
        
        if (valueElement) {
            valueElement.textContent = value;
        }
        
        if (growthElement) {
            var growthClass = growthRate >= 0 ? 'positive' : 'negative';
            var growthSymbol = growthRate >= 0 ? '+' : '';
            
            growthElement.textContent = growthSymbol + growthRate + '%';
            growthElement.className = 'indicator-growth ' + growthClass;
        }
    },
    
    // 渲染预警信息
    renderWarningMessages: function(warningMessages) {
        var warningContainer = document.getElementById('warningMessages');
        if (!warningContainer) return;
        
        warningContainer.innerHTML = '';
        
        // 如果没有传入预警信息，使用默认数据
        if (!warningMessages) {
            warningMessages = this.mockData.warningMessages;
        }
        
        warningMessages.forEach(function(warning) {
            var warningItem = document.createElement('div');
            warningItem.className = 'warning-item ' + warning.status + ' ' + warning.level;
            
            var levelIcon = warning.level === 'warning' ? '⚠' : '🚨';
            
            warningItem.innerHTML = `
                <div class="warning-header">
                    <span class="warning-level">${levelIcon}</span>
                    <span class="warning-title">${warning.title}</span>
                    <span class="warning-time">${warning.time}</span>
                </div>
                <div class="warning-content">${warning.content}</div>
            `;
            
            // 添加点击事件
            warningItem.addEventListener('click', function() {
                this.classList.remove('unread');
                this.classList.add('read');
                // 这里可以添加查看预警详情的逻辑
            });
            
            warningContainer.appendChild(warningItem);
        });
    },
    
    // 更新所有图表
    updateAllCharts: function(filteredData) {
        // 如果没有传入筛选数据，使用默认数据
        if (!filteredData) {
            filteredData = this.mockData;
        }
        
        this.updateWorkloadTrendChart(filteredData.monthlyWorkload);
        this.updateDepartmentComparisonChart(filteredData.departmentComparison);
        // 注意：收入结构图、医生效率图、疾病分布图暂时没有对应的更新函数
        // 如果需要动态更新这些图表，需要添加相应的update函数
    },
    
    // 初始化总体趋势图
    initOverallTrendChart: function() {
        var option = {
            title: {
                text: '总体运营趋势',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['工作量', '收入', '医疗质量'],
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
                data: this.mockData.monthlyWorkload.map(function(item) { return item.month; })
            },
            yAxis: [
                {
                    type: 'value',
                    name: '工作量',
                    position: 'left'
                },
                {
                    type: 'value',
                    name: '收入(万元)',
                    position: 'right'
                },
                {
                    type: 'value',
                    name: '质量(%)',
                    position: 'right',
                    max: 100
                }
            ],
            series: [
                {
                    name: '工作量',
                    type: 'line',
                    data: this.mockData.monthlyWorkload.map(function(item) {
                        return item.outpatientVolume + item.inpatientVolume;
                    }),
                    smooth: true,
                    areaStyle: {
                        opacity: 0.3
                    }
                },
                {
                    name: '收入',
                    type: 'line',
                    yAxisIndex: 1,
                    data: this.mockData.monthlyRevenue.map(function(item) {
                        return Math.round(item.revenue / 10000);
                    }),
                    smooth: true
                },
                {
                    name: '医疗质量',
                    type: 'line',
                    yAxisIndex: 2,
                    data: [94.5, 94.8, 95.0, 95.3, 95.5, 95.7, 95.9, 96.0, 96.1, 96.2],
                    smooth: true
                }
            ]
        };
        
        this.state.charts.overallTrendChart.setOption(option);
    },
    
    // 更新总体趋势图
    updateOverallTrendChart: function(monthlyWorkload, monthlyRevenue) {
        // 如果没有传入数据，使用默认数据
        if (!monthlyWorkload) monthlyWorkload = this.mockData.monthlyWorkload;
        if (!monthlyRevenue) monthlyRevenue = this.mockData.monthlyRevenue;
        
        this.state.charts.overallTrendChart.setOption({
            xAxis: {
                data: monthlyWorkload.map(function(item) { return item.month; })
            },
            series: [
                {
                    data: monthlyWorkload.map(function(item) {
                        return item.outpatientVolume + item.inpatientVolume;
                    })
                },
                {
                    data: monthlyRevenue.map(function(item) {
                        return Math.round(item.revenue / 10000);
                    })
                }
            ]
        });
    },
    
    // 初始化工作量趋势图
    initWorkloadTrendChart: function() {
        var option = {
            title: {
                text: '工作量趋势',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['门诊人次', '出院人次', '手术量'],
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
                data: this.mockData.monthlyWorkload.map(function(item) { return item.month; })
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '门诊人次',
                    type: 'line',
                    data: this.mockData.monthlyWorkload.map(function(item) { return item.outpatientVolume; }),
                    smooth: true,
                    areaStyle: {
                        opacity: 0.3
                    }
                },
                {
                    name: '出院人次',
                    type: 'line',
                    data: this.mockData.monthlyWorkload.map(function(item) { return item.inpatientVolume; }),
                    smooth: true
                },
                {
                    name: '手术量',
                    type: 'line',
                    data: this.mockData.monthlyWorkload.map(function(item) { return item.surgeryVolume; }),
                    smooth: true
                }
            ]
        };
        
        this.state.charts.workloadTrendChart.setOption(option);
    },
    
    // 更新工作量趋势图
    updateWorkloadTrendChart: function(monthlyWorkload) {
        // 如果没有传入数据，使用默认数据
        if (!monthlyWorkload) monthlyWorkload = this.mockData.monthlyWorkload;
        
        this.state.charts.workloadTrendChart.setOption({
            xAxis: {
                data: monthlyWorkload.map(function(item) { return item.month; })
            },
            series: [
                {
                    data: monthlyWorkload.map(function(item) { return item.outpatientVolume; })
                },
                {
                    data: monthlyWorkload.map(function(item) { return item.inpatientVolume; })
                },
                {
                    data: monthlyWorkload.map(function(item) { return item.surgeryVolume; })
                }
            ]
        });
    },
    
    // 初始化医疗质量趋势图
    initQualityTrendChart: function() {
        var qualityTrendData = [
            { month: '1月', medicalQuality: 94.5, patientSatisfaction: 93.2 },
            { month: '2月', medicalQuality: 94.8, patientSatisfaction: 93.5 },
            { month: '3月', medicalQuality: 95.0, patientSatisfaction: 93.8 },
            { month: '4月', medicalQuality: 95.3, patientSatisfaction: 94.2 },
            { month: '5月', medicalQuality: 95.5, patientSatisfaction: 94.5 },
            { month: '6月', medicalQuality: 95.7, patientSatisfaction: 94.7 },
            { month: '7月', medicalQuality: 95.9, patientSatisfaction: 95.0 },
            { month: '8月', medicalQuality: 96.0, patientSatisfaction: 95.3 },
            { month: '9月', medicalQuality: 96.1, patientSatisfaction: 95.5 },
            { month: '10月', medicalQuality: 96.2, patientSatisfaction: 95.8 }
        ];
        
        var option = {
            title: {
                text: '医疗质量趋势',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['医疗质量', '患者满意度'],
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
                data: qualityTrendData.map(function(item) { return item.month; })
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
                    name: '医疗质量',
                    type: 'line',
                    data: qualityTrendData.map(function(item) { return item.medicalQuality; }),
                    smooth: true
                },
                {
                    name: '患者满意度',
                    type: 'line',
                    data: qualityTrendData.map(function(item) { return item.patientSatisfaction; }),
                    smooth: true
                }
            ]
        };
        
        this.state.charts.qualityTrendChart.setOption(option);
    },
    
    // 更新医疗质量趋势图
    updateQualityTrendChart: function() {
        // 根据当前选择的科室调整数据
        const { currentDepartment } = this.state;
        const baseQualityData = [
            { month: '1月', medicalQuality: 94.5, patientSatisfaction: 93.2 },
            { month: '2月', medicalQuality: 94.8, patientSatisfaction: 93.5 },
            { month: '3月', medicalQuality: 95.0, patientSatisfaction: 93.8 },
            { month: '4月', medicalQuality: 95.3, patientSatisfaction: 94.2 },
            { month: '5月', medicalQuality: 95.5, patientSatisfaction: 94.5 },
            { month: '6月', medicalQuality: 95.7, patientSatisfaction: 94.7 },
            { month: '7月', medicalQuality: 95.9, patientSatisfaction: 95.0 },
            { month: '8月', medicalQuality: 96.0, patientSatisfaction: 95.3 },
            { month: '9月', medicalQuality: 96.1, patientSatisfaction: 95.5 },
            { month: '10月', medicalQuality: 96.2, patientSatisfaction: 95.8 }
        ];
        
        // 如果选择了特定科室，添加科室数据差异
        let qualityTrendData = baseQualityData;
        if (currentDepartment) {
            // 根据科室名称生成一个基础偏移量
            const departmentOffset = currentDepartment.charCodeAt(0) % 10 / 10; // 0-1之间的偏移
            
            qualityTrendData = baseQualityData.map(item => ({
                ...item,
                medicalQuality: parseFloat((item.medicalQuality - 1 + departmentOffset).toFixed(1)),
                patientSatisfaction: parseFloat((item.patientSatisfaction - 1 + departmentOffset).toFixed(1))
            }));
        }
        
        // 根据日期范围筛选数据
        const { dateRange } = this.state;
        if (dateRange.start && dateRange.end) {
            const startDate = new Date(dateRange.start);
            const endDate = new Date(dateRange.end);
            const monthsDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth()) + 1;
            
            if (monthsDiff > 0 && monthsDiff < qualityTrendData.length) {
                qualityTrendData = qualityTrendData.slice(-monthsDiff);
            }
        }
        
        this.state.charts.qualityTrendChart.setOption({
            xAxis: {
                data: qualityTrendData.map(function(item) { return item.month; })
            },
            series: [
                {
                    data: qualityTrendData.map(function(item) { return item.medicalQuality; })
                },
                {
                    data: qualityTrendData.map(function(item) { return item.patientSatisfaction; })
                }
            ]
        });
    },
    
    // 初始化经济运行趋势图
    initEconomicTrendChart: function() {
        var option = {
            title: {
                text: '经济运行趋势',
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
                data: ['收入', '成本', '利润'],
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
                    name: '收入',
                    type: 'line',
                    data: this.mockData.monthlyRevenue.map(function(item) { return item.revenue; }),
                    smooth: true,
                    areaStyle: {
                        opacity: 0.3
                    }
                },
                {
                    name: '成本',
                    type: 'line',
                    data: this.mockData.monthlyRevenue.map(function(item) { return item.cost; }),
                    smooth: true
                },
                {
                    name: '利润',
                    type: 'line',
                    data: this.mockData.monthlyRevenue.map(function(item) { return item.profit; }),
                    smooth: true
                }
            ]
        };
        
        this.state.charts.economicTrendChart.setOption(option);
    },
    
    // 更新经济运行趋势图
    updateEconomicTrendChart: function(monthlyRevenue) {
        // 如果没有传入数据，使用默认数据
        if (!monthlyRevenue) monthlyRevenue = this.mockData.monthlyRevenue;
        
        this.state.charts.economicTrendChart.setOption({
            xAxis: {
                data: monthlyRevenue.map(function(item) { return item.month; })
            },
            series: [
                {
                    data: monthlyRevenue.map(function(item) { return item.revenue; })
                },
                {
                    data: monthlyRevenue.map(function(item) { return item.cost; })
                },
                {
                    data: monthlyRevenue.map(function(item) { return item.profit; })
                }
            ]
        });
    },
    
    // 初始化科室对比图
    initDepartmentComparisonChart: function() {
        var option = {
            title: {
                text: '科室运营对比',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['门诊排名', '住院排名', '手术排名', '收入排名', '质量排名'],
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
                data: this.mockData.departmentComparison.map(function(item) { return item.department; })
            },
            yAxis: {
                type: 'value',
                min: 1,
                max: 8,
                inverse: true,
                axisLabel: {
                    formatter: '{value}'
                }
            },
            series: [
                {
                    name: '门诊排名',
                    type: 'bar',
                    data: this.mockData.departmentComparison.map(function(item) { return item.outpatientRank; }),
                    itemStyle: {
                        color: '#52c41a'
                    }
                },
                {
                    name: '住院排名',
                    type: 'bar',
                    data: this.mockData.departmentComparison.map(function(item) { return item.inpatientRank; }),
                    itemStyle: {
                        color: '#1890ff'
                    }
                },
                {
                    name: '手术排名',
                    type: 'bar',
                    data: this.mockData.departmentComparison.map(function(item) { return item.surgeryRank; }),
                    itemStyle: {
                        color: '#faad14'
                    }
                },
                {
                    name: '收入排名',
                    type: 'bar',
                    data: this.mockData.departmentComparison.map(function(item) { return item.revenueRank; }),
                    itemStyle: {
                        color: '#f5222d'
                    }
                },
                {
                    name: '质量排名',
                    type: 'bar',
                    data: this.mockData.departmentComparison.map(function(item) { return item.qualityRank; }),
                    itemStyle: {
                        color: '#722ed1'
                    }
                }
            ]
        };
        
        this.state.charts.departmentComparisonChart.setOption(option);
    },
    
    // 更新科室对比图
    updateDepartmentComparisonChart: function(departmentComparison) {
        // 如果没有传入数据，使用默认数据
        if (!departmentComparison) departmentComparison = this.mockData.departmentComparison;
        
        // 如果选择了特定科室，突出显示该科室
        const { currentDepartment } = this.state;
        
        this.state.charts.departmentComparisonChart.setOption({
            xAxis: {
                data: departmentComparison.map(function(item) { return item.department; })
            },
            series: [
                {
                    data: departmentComparison.map(function(item, index) {
                        return {
                            value: item.outpatientRank,
                            itemStyle: currentDepartment && item.department === currentDepartment ? 
                                { color: '#1890ff' } : null
                        };
                    })
                },
                {
                    data: departmentComparison.map(function(item, index) {
                        return {
                            value: item.inpatientRank,
                            itemStyle: currentDepartment && item.department === currentDepartment ? 
                                { color: '#1890ff' } : null
                        };
                    })
                },
                {
                    data: departmentComparison.map(function(item, index) {
                        return {
                            value: item.surgeryRank,
                            itemStyle: currentDepartment && item.department === currentDepartment ? 
                                { color: '#1890ff' } : null
                        };
                    })
                },
                {
                    data: departmentComparison.map(function(item, index) {
                        return {
                            value: item.revenueRank,
                            itemStyle: currentDepartment && item.department === currentDepartment ? 
                                { color: '#1890ff' } : null
                        };
                    })
                },
                {
                    data: departmentComparison.map(function(item, index) {
                        return {
                            value: item.qualityRank,
                            itemStyle: currentDepartment && item.department === currentDepartment ? 
                                { color: '#1890ff' } : null
                        };
                    })
                }
            ]
        });
    },
    
    // 初始化资源利用效率图
    initResourceUtilizationChart: function() {
        var option = {
            title: {
                text: '资源利用效率',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['实际值', '目标值'],
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
                data: this.mockData.resourceUtilization.map(function(item) { return item.name; })
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '实际值',
                    type: 'bar',
                    data: this.mockData.resourceUtilization.map(function(item) { return item.current; }),
                    itemStyle: {
                        color: '#52c41a'
                    }
                },
                {
                    name: '目标值',
                    type: 'bar',
                    data: this.mockData.resourceUtilization.map(function(item) { return item.target; }),
                    itemStyle: {
                        color: '#d9d9d9'
                    }
                }
            ]
        };
        
        this.state.charts.resourceUtilizationChart.setOption(option);
    },
    
    // 更新资源利用效率图
    updateResourceUtilizationChart: function(resourceUtilization) {
        // 如果没有传入数据，使用默认数据
        if (!resourceUtilization) resourceUtilization = this.mockData.resourceUtilization;
        
        // 如果选择了特定科室，添加科室数据差异
        const { currentDepartment } = this.state;
        if (currentDepartment) {
            resourceUtilization = resourceUtilization.map(item => ({
                ...item,
                current: parseFloat((item.current * (0.95 + Math.random() * 0.1)).toFixed(1))
            }));
        }
        
        this.state.charts.resourceUtilizationChart.setOption({
            xAxis: {
                data: resourceUtilization.map(function(item) { return item.name; })
            },
            series: [
                {
                    data: resourceUtilization.map(function(item) { return item.current; })
                },
                {
                    data: resourceUtilization.map(function(item) { return item.target; })
                }
            ]
        });
    },
    
    // 初始化床位使用率图
    initBedOccupancyRateChart: function() {
        var option = {
            title: {
                text: '床位使用率对比',
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
                data: this.mockData.bedOccupancyRate.map(function(item) { return item.name; })
            },
            yAxis: {
                type: 'value',
                max: 100,
                axisLabel: {
                    formatter: '{value}%'
                }
            },
            series: [
                {
                    type: 'bar',
                    data: this.mockData.bedOccupancyRate.map(function(item) { return item.rate; }),
                    itemStyle: {
                        color: function(params) {
                            return params.value >= 85 ? '#52c41a' : '#faad14';
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
        
        this.state.charts.bedOccupancyRateChart.setOption(option);
    },
    
    // 更新床位使用率图
    updateBedOccupancyRateChart: function(bedOccupancyRate) {
        // 如果没有传入数据，使用默认数据
        if (!bedOccupancyRate) bedOccupancyRate = this.mockData.bedOccupancyRate;
        
        // 如果选择了特定科室，突出显示该科室
        const { currentDepartment } = this.state;
        
        this.state.charts.bedOccupancyRateChart.setOption({
            xAxis: {
                data: bedOccupancyRate.map(function(item) { return item.name; })
            },
            series: [
                {
                    data: bedOccupancyRate.map(function(item, index) {
                        return {
                            value: item.rate,
                            itemStyle: currentDepartment && item.name === currentDepartment ? 
                                { color: '#1890ff' } : {
                                    color: function(params) {
                                        return params.value >= 85 ? '#52c41a' : '#faad14';
                                    }
                                }
                        };
                    }),
                    label: {
                        show: true,
                        position: 'top',
                        formatter: '{c}%'
                    }
                }
            ]
        });
    },
    
    // 初始化平均住院日图
    initAvgLengthOfStayChart: function() {
        var option = {
            title: {
                text: '平均住院日对比',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function(params) {
                    return params[0].name + ': ' + params[0].value + '天';
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
                data: this.mockData.avgLengthOfStay.map(function(item) { return item.name; })
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value}天'
                }
            },
            series: [
                {
                    type: 'bar',
                    data: this.mockData.avgLengthOfStay.map(function(item) { return item.days; }),
                    itemStyle: {
                        color: function(params) {
                            return params.value <= 8 ? '#52c41a' : '#faad14';
                        }
                    },
                    label: {
                        show: true,
                        position: 'top',
                        formatter: '{c}天'
                    }
                }
            ]
        };
        
        this.state.charts.avgLengthOfStayChart.setOption(option);
    },
    
    // 更新平均住院日图
    updateAvgLengthOfStayChart: function(avgLengthOfStay) {
        // 如果没有传入数据，使用默认数据
        if (!avgLengthOfStay) avgLengthOfStay = this.mockData.avgLengthOfStay;
        
        // 如果选择了特定科室，突出显示该科室
        const { currentDepartment } = this.state;
        
        this.state.charts.avgLengthOfStayChart.setOption({
            xAxis: {
                data: avgLengthOfStay.map(function(item) { return item.name; })
            },
            series: [
                {
                    data: avgLengthOfStay.map(function(item, index) {
                        return {
                            value: item.days,
                            itemStyle: currentDepartment && item.name === currentDepartment ? 
                                { color: '#1890ff' } : {
                                    color: function(params) {
                                        return params.value <= 8 ? '#52c41a' : '#faad14';
                                    }
                                }
                        };
                    }),
                    label: {
                        show: true,
                        position: 'top',
                        formatter: '{c}天'
                    }
                }
            ]
        });
    },
    
    // 初始化运营效率图
    initOperationEfficiencyChart: function() {
        var option = {
            title: {
                text: '运营效率指标',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['实际值', '目标值'],
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
                data: this.mockData.operationEfficiency.map(function(item) { return item.name; })
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '实际值',
                    type: 'bar',
                    data: this.mockData.operationEfficiency.map(function(item) { return item.current; }),
                    itemStyle: {
                        color: '#52c41a'
                    }
                },
                {
                    name: '目标值',
                    type: 'bar',
                    data: this.mockData.operationEfficiency.map(function(item) { return item.target; }),
                    itemStyle: {
                        color: '#d9d9d9'
                    }
                }
            ]
        };
        
        this.state.charts.operationEfficiencyChart.setOption(option);
    },
    
    // 更新运营效率图
    updateOperationEfficiencyChart: function(operationEfficiency) {
        // 如果没有传入数据，使用默认数据
        if (!operationEfficiency) operationEfficiency = this.mockData.operationEfficiency;
        
        // 如果选择了特定科室，添加科室数据差异
        const { currentDepartment } = this.state;
        if (currentDepartment) {
            operationEfficiency = operationEfficiency.map(item => ({
                ...item,
                current: parseFloat((item.current * (0.95 + Math.random() * 0.1)).toFixed(1))
            }));
        }
        
        this.state.charts.operationEfficiencyChart.setOption({
            xAxis: {
                data: operationEfficiency.map(function(item) { return item.name; })
            },
            series: [
                {
                    data: operationEfficiency.map(function(item) { return item.current; })
                },
                {
                    data: operationEfficiency.map(function(item) { return item.target; })
                }
            ]
        });
    },
    
    // 导出报告
    exportReport: function() {
        alert('报告导出功能已触发，实际项目中会生成并下载PDF或Excel报告');
        // 实际项目中，这里会调用后端API生成报告并下载
    },
    
    // 指标下钻功能
    drillDown: function(indicatorType) {
        // 根据指标类型跳转到相应的详细页面
        switch(indicatorType) {
            case 'outpatientVolume':
            case 'inpatientVolume':
            case 'surgeryVolume':
                // 跳转到科室医疗服务页面
                window.location.href = 'department-service.html';
                break;
            case 'totalRevenue':
                // 跳转到科室收入分析页面
                window.location.href = 'department-revenue.html';
                break;
            case 'medicalQuality':
            case 'patientSatisfaction':
                // 跳转到重点指标监控页面
                window.location.href = 'key-indicators.html';
                break;
            default:
                // 默认跳转到科室运营报告页面
                window.location.href = 'department-report.html';
        }
    },

    // 初始化收入结构图表
    initRevenueStructureChart: function() {
        const option = {
            title: {
                text: '收入结构分析',
                left: 'center',
                textStyle: {
                    color: '#333',
                    fontSize: 16
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['门诊收入', '住院收入', '手术收入', '检查收入', '药品收入']
            },
            series: [
                {
                    name: '收入结构',
                    type: 'pie',
                    radius: '50%',
                    center: ['50%', '60%'],
                    data: [
                        {value: 1548, name: '门诊收入'},
                        {value: 2356, name: '住院收入'},
                        {value: 1234, name: '手术收入'},
                        {value: 987, name: '检查收入'},
                        {value: 876, name: '药品收入'}
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
        
        this.state.charts.revenueStructureChart.setOption(option);
    },

    // 初始化医生效率图表
    initDoctorEfficiencyChart: function() {
        const option = {
            title: {
                text: '医生工作效率',
                left: 'center',
                textStyle: {
                    color: '#333',
                    fontSize: 16
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['门诊量', '手术量', '病床管理']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ['张医生', '李医生', '王医生', '赵医生', '陈医生']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '门诊量',
                    type: 'bar',
                    data: [120, 200, 150, 80, 70]
                },
                {
                    name: '手术量',
                    type: 'bar',
                    data: [20, 30, 25, 15, 12]
                },
                {
                    name: '病床管理',
                    type: 'bar',
                    data: [15, 25, 20, 12, 10]
                }
            ]
        };
        
        this.state.charts.doctorEfficiencyChart.setOption(option);
    },

    // 初始化疾病分布图表
    initDiseaseDistributionChart: function() {
        const option = {
            title: {
                text: '疾病分布统计',
                left: 'center',
                textStyle: {
                    color: '#333',
                    fontSize: 16
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['心血管疾病', '呼吸系统疾病', '消化系统疾病', '神经系统疾病', '其他疾病']
            },
            series: [
                {
                    name: '疾病分布',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    center: ['50%', '60%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        {value: 335, name: '心血管疾病'},
                        {value: 310, name: '呼吸系统疾病'},
                        {value: 234, name: '消化系统疾病'},
                        {value: 135, name: '神经系统疾病'},
                        {value: 148, name: '其他疾病'}
                    ]
                }
            ]
        };
        
        this.state.charts.diseaseDistributionChart.setOption(option);
    },
    
    // 显示医生详情弹窗
    showDoctorModal: function(indicatorType) {
        console.log('showDoctorModal被调用，指标类型:', indicatorType);
        var modal = document.getElementById('doctorModal');
        console.log('找到弹窗元素:', modal);
        var modalTitle = document.getElementById('modalTitle');
        var modalBody = modal.querySelector('.modal-body');
        console.log('找到标题元素:', modalTitle);
        console.log('找到内容元素:', modalBody);
        
        // 设置弹窗标题
        var titles = {
            'outpatient': '门急诊人次 - 医生详情',
            'inpatient': '出院人次 - 医生详情',
            'surgery': '手术人次 - 医生详情',
            'revenue': '医疗收入 - 医生详情',
            'cmi': 'CMI值 - 医生详情',
            'avgstay': '平均住院日 - 医生详情'
        };
        modalTitle.textContent = titles[indicatorType] || '医生详情';
        
        // 获取对应的医生数据
        var doctorData = this.mockData.doctorData[indicatorType] || [];
        
        // 生成医生列表HTML
        var doctorListHTML = '<div class="doctor-list">';
        doctorData.forEach(function(doctor) {
            doctorListHTML += '<div class="doctor-card">';
            doctorListHTML += '<div class="doctor-name clickable-doctor" data-doctor-id="' + doctor.id + '" data-indicator="' + indicatorType + '">' + doctor.name + '</div>';
            doctorListHTML += '<div class="doctor-stats">';
            
            // 根据指标类型显示不同的统计信息
            switch(indicatorType) {
                case 'outpatient':
                    doctorListHTML += '<div>门诊量: ' + doctor.outpatientVolume + '</div>';
                    doctorListHTML += '<div>满意度: ' + doctor.satisfaction + '%</div>';
                    doctorListHTML += '<div>平均候诊: ' + doctor.avgWaitTime + '分钟</div>';
                    break;
                case 'inpatient':
                    doctorListHTML += '<div>住院量: ' + doctor.inpatientVolume + '</div>';
                    doctorListHTML += '<div>平均住院日: ' + doctor.avgStay + '天</div>';
                    doctorListHTML += '<div>满意度: ' + doctor.satisfaction + '%</div>';
                    break;
                case 'surgery':
                    doctorListHTML += '<div>手术量: ' + doctor.surgeryVolume + '</div>';
                    doctorListHTML += '<div>成功率: ' + doctor.successRate + '%</div>';
                    doctorListHTML += '<div>平均时长: ' + doctor.avgTime + '分钟</div>';
                    break;
                case 'revenue':
                    doctorListHTML += '<div>收入: ' + DepartmentCockpitPage.formatCurrency(doctor.revenue) + '</div>';
                    doctorListHTML += '<div>药品占比: ' + doctor.drugRatio + '%</div>';
                    doctorListHTML += '<div>检查占比: ' + doctor.examRatio + '%</div>';
                    break;
                case 'cmi':
                    doctorListHTML += '<div>CMI值: ' + doctor.cmi + '</div>';
                    doctorListHTML += '<div>病例复杂度: ' + doctor.caseComplexity + '</div>';
                    doctorListHTML += '<div>专科级别: ' + doctor.specialtyLevel + '</div>';
                    break;
                case 'avgstay':
                    doctorListHTML += '<div>平均住院日: ' + doctor.avgStay + '天</div>';
                    doctorListHTML += '<div>床位周转: ' + doctor.bedTurnover + '次</div>';
                    doctorListHTML += '<div>效率评级: ' + doctor.efficiency + '</div>';
                    break;
            }
            
            doctorListHTML += '</div>';
            doctorListHTML += '</div>';
        });
        doctorListHTML += '</div>';
        
        modalBody.innerHTML = doctorListHTML;
        
        // 为医生姓名添加点击事件
        modalBody.querySelectorAll('.clickable-doctor').forEach(function(doctorName) {
            doctorName.addEventListener('click', function() {
                var doctorId = this.dataset.doctorId;
                var indicator = this.dataset.indicator;
                DepartmentCockpitPage.showDoctorDetailModal(doctorId, indicator);
            });
        });
        
        modal.style.display = 'block';
    },

    // 显示医生个人详情弹窗
    showDoctorDetailModal: function(doctorId, indicatorType) {
        console.log('showDoctorDetailModal被调用，医生ID:', doctorId, '指标类型:', indicatorType);
        var modal = document.getElementById('doctorDetailModal');
        var modalTitle = document.getElementById('doctorDetailTitle');
        var modalBody = modal.querySelector('.modal-body');
        console.log('找到医生详情弹窗元素:', modal);
        console.log('找到医生详情标题元素:', modalTitle);
        
        // 获取医生数据
        var doctorData = this.mockData.doctorData[indicatorType].find(function(doctor) {
            return doctor.id == doctorId;
        });
        
        if (!doctorData) return;
        
        modalTitle.textContent = doctorData.name + ' - 详细信息';
        
        // 生成详细信息HTML
        var detailHTML = '<div class="doctor-detail-content">';
        
        // 基本信息
        detailHTML += '<div class="detail-section">';
        detailHTML += '<h4>基本信息</h4>';
        detailHTML += '<div class="detail-grid">';
        detailHTML += '<div class="detail-item"><span class="detail-label">医生姓名:</span><span class="detail-value">' + doctorData.name + '</span></div>';
        detailHTML += '<div class="detail-item"><span class="detail-label">医生编号:</span><span class="detail-value">DOC' + String(doctorId).padStart(4, '0') + '</span></div>';
        detailHTML += '<div class="detail-item"><span class="detail-label">科室:</span><span class="detail-value">心内科</span></div>';
        detailHTML += '<div class="detail-item"><span class="detail-label">职称:</span><span class="detail-value">主任医师</span></div>';
        detailHTML += '</div>';
        detailHTML += '</div>';
        
        // 业务指标
        detailHTML += '<div class="detail-section">';
        detailHTML += '<h4>业务指标</h4>';
        detailHTML += '<div class="detail-grid">';
        
        switch(indicatorType) {
            case 'outpatient':
                detailHTML += '<div class="detail-item"><span class="detail-label">门诊量:</span><span class="detail-value">' + doctorData.outpatientVolume + ' 人次</span></div>';
                detailHTML += '<div class="detail-item"><span class="detail-label">患者满意度:</span><span class="detail-value">' + doctorData.satisfaction + '%</span></div>';
                detailHTML += '<div class="detail-item"><span class="detail-label">平均候诊时间:</span><span class="detail-value">' + doctorData.avgWaitTime + ' 分钟</span></div>';
                detailHTML += '<div class="detail-item"><span class="detail-label">复诊率:</span><span class="detail-value">68.5%</span></div>';
                break;
            case 'inpatient':
                detailHTML += '<div class="detail-item"><span class="detail-label">住院量:</span><span class="detail-value">' + doctorData.inpatientVolume + ' 人次</span></div>';
                detailHTML += '<div class="detail-item"><span class="detail-label">平均住院日:</span><span class="detail-value">' + doctorData.avgStay + ' 天</span></div>';
                detailHTML += '<div class="detail-item"><span class="detail-label">患者满意度:</span><span class="detail-value">' + doctorData.satisfaction + '%</span></div>';
                detailHTML += '<div class="detail-item"><span class="detail-label">治愈率:</span><span class="detail-value">94.2%</span></div>';
                break;
            case 'surgery':
                detailHTML += '<div class="detail-item"><span class="detail-label">手术量:</span><span class="detail-value">' + doctorData.surgeryVolume + ' 台</span></div>';
                detailHTML += '<div class="detail-item"><span class="detail-label">手术成功率:</span><span class="detail-value">' + doctorData.successRate + '%</span></div>';
                detailHTML += '<div class="detail-item"><span class="detail-label">平均手术时长:</span><span class="detail-value">' + doctorData.avgTime + ' 分钟</span></div>';
                detailHTML += '<div class="detail-item"><span class="detail-label">并发症率:</span><span class="detail-value">1.2%</span></div>';
                break;
            case 'revenue':
                detailHTML += '<div class="detail-item"><span class="detail-label">医疗收入:</span><span class="detail-value">' + DepartmentCockpitPage.formatCurrency(doctorData.revenue) + '</span></div>';
                detailHTML += '<div class="detail-item"><span class="detail-label">药品费用占比:</span><span class="detail-value">' + doctorData.drugRatio + '%</span></div>';
                detailHTML += '<div class="detail-item"><span class="detail-label">检查费用占比:</span><span class="detail-value">' + doctorData.examRatio + '%</span></div>';
                detailHTML += '<div class="detail-item"><span class="detail-label">次均费用:</span><span class="detail-value">¥3,250</span></div>';
                break;
            case 'cmi':
                detailHTML += '<div class="detail-item"><span class="detail-label">CMI值:</span><span class="detail-value">' + doctorData.cmi + '</span></div>';
                detailHTML += '<div class="detail-item"><span class="detail-label">病例复杂度:</span><span class="detail-value">' + doctorData.caseComplexity + '</span></div>';
                detailHTML += '<div class="detail-item"><span class="detail-label">专科级别:</span><span class="detail-value">' + doctorData.specialtyLevel + '</span></div>';
                detailHTML += '<div class="detail-item"><span class="detail-label">疑难病例数:</span><span class="detail-value">45 例</span></div>';
                break;
            case 'avgstay':
                detailHTML += '<div class="detail-item"><span class="detail-label">平均住院日:</span><span class="detail-value">' + doctorData.avgStay + ' 天</span></div>';
                detailHTML += '<div class="detail-item"><span class="detail-label">床位周转次数:</span><span class="detail-value">' + doctorData.bedTurnover + ' 次</span></div>';
                detailHTML += '<div class="detail-item"><span class="detail-label">效率评级:</span><span class="detail-value">' + doctorData.efficiency + '</span></div>';
                detailHTML += '<div class="detail-item"><span class="detail-label">提前出院率:</span><span class="detail-value">15.8%</span></div>';
                break;
        }
        
        detailHTML += '</div>';
        detailHTML += '</div>';
        
        // 质量指标
        detailHTML += '<div class="detail-section">';
        detailHTML += '<h4>质量指标</h4>';
        detailHTML += '<div class="detail-grid">';
        detailHTML += '<div class="detail-item"><span class="detail-label">医疗质量评分:</span><span class="detail-value">96.8分</span></div>';
        detailHTML += '<div class="detail-item"><span class="detail-label">患者投诉次数:</span><span class="detail-value">0次</span></div>';
        detailHTML += '<div class="detail-item"><span class="detail-label">医疗事故:</span><span class="detail-value">0次</span></div>';
        detailHTML += '<div class="detail-item"><span class="detail-label">学术论文:</span><span class="detail-value">3篇</span></div>';
        detailHTML += '</div>';
        detailHTML += '</div>';
        
        detailHTML += '</div>';
        
        modalBody.innerHTML = detailHTML;
        modal.style.display = 'block';
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

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded 事件已触发');
    
    // 检查是否有ECharts库
    if (typeof echarts === 'undefined') {
        console.error('ECharts库未加载');
        return;
    }
    console.log('ECharts库已加载');
    
    // 延迟初始化，确保DOM完全准备好
    setTimeout(function() {
        console.log('开始初始化科主任驾驶舱页面');
        DepartmentCockpitPage.init();
    }, 100);
});