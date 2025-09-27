// 科室运营报告页面逻辑
console.log('department-operation-report.js 文件已加载');
var DepartmentOperationReportPage = {
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
        console.log('DepartmentOperationReportPage.init() 开始执行');
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
        console.log('DepartmentOperationReportPage.init() 执行完成');
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
            for (var chartKey in DepartmentOperationReportPage.state.charts) {
                if (DepartmentOperationReportPage.state.charts[chartKey]) {
                    DepartmentOperationReportPage.state.charts[chartKey].resize();
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
                DepartmentOperationReportPage.state.timeDimension = this.dataset.dimension;
                DepartmentOperationReportPage.refreshData();
            });
        });
        
        // 日期范围选择事件
        var dateRangePicker = document.getElementById('dateRangePicker');
        if (dateRangePicker) {
            dateRangePicker.addEventListener('change', function() {
                var value = this.value.split(' - ');
                if (value.length === 2) {
                    DepartmentOperationReportPage.state.dateRange.start = value[0];
                    DepartmentOperationReportPage.state.dateRange.end = value[1];
                    DepartmentOperationReportPage.refreshData();
                }
            });
        }
        
        // 科室选择事件
        var departmentSelect = document.getElementById('department-select');
        if (departmentSelect) {
            departmentSelect.addEventListener('change', function() {
                DepartmentOperationReportPage.state.currentDepartment = this.value;
                DepartmentOperationReportPage.refreshData();
            });
        }
        
        // 刷新按钮事件
        var refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', function() {
                DepartmentOperationReportPage.refreshData();
            });
        }
        
        // 导出按钮事件
        var exportBtn = document.getElementById('export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', function() {
                DepartmentOperationReportPage.exportReport();
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
                DepartmentOperationReportPage.drillDown(indicatorType);
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
                DepartmentOperationReportPage.showDoctorModal(indicatorType);
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
        
        this.state.dateRange.start = startDate.toISOString().split('T')[0];
        this.state.dateRange.end = endDate.toISOString().split('T')[0];
        
        // 加载关键指标数据
        this.loadKeyIndicators();
        
        // 加载预警信息
        this.loadWarningMessages();
        
        // 加载图表数据
        this.loadChartData();
    },
    
    // 加载关键指标数据
    loadKeyIndicators: function() {
        var indicators = this.mockData.keyIndicators;
        
        // 更新门诊量指标
        this.updateIndicatorCard('outpatient-volume', indicators.outpatientVolume);
        
        // 更新住院量指标
        this.updateIndicatorCard('inpatient-volume', indicators.inpatientVolume);
        
        // 更新手术量指标
        this.updateIndicatorCard('surgery-volume', indicators.surgeryVolume);
        
        // 更新总收入指标
        this.updateIndicatorCard('total-revenue', indicators.totalRevenue);
        
        // 更新床位使用率指标
        this.updateIndicatorCard('bed-occupancy-rate', indicators.bedOccupancyRate);
        
        // 更新平均住院日指标
        this.updateIndicatorCard('avg-length-of-stay', indicators.avgLengthOfStay);
        
        // 更新医疗质量指标
        this.updateIndicatorCard('medical-quality', indicators.medicalQuality);
        
        // 更新患者满意度指标
        this.updateIndicatorCard('patient-satisfaction', indicators.patientSatisfaction);
    },
    
    // 更新指标卡片
    updateIndicatorCard: function(cardId, data) {
        var card = document.getElementById(cardId);
        if (!card) return;
        
        var valueElement = card.querySelector('.indicator-value');
        var changeElement = card.querySelector('.indicator-change');
        
        if (valueElement) {
            if (cardId === 'total-revenue') {
                valueElement.textContent = (data.current / 10000).toFixed(0) + '万';
            } else if (cardId.includes('rate') || cardId.includes('quality') || cardId.includes('satisfaction')) {
                valueElement.textContent = data.current.toFixed(1) + '%';
            } else if (cardId === 'avg-length-of-stay') {
                valueElement.textContent = data.current.toFixed(1) + '天';
            } else {
                valueElement.textContent = data.current.toLocaleString();
            }
        }
        
        if (changeElement) {
            var changeText = data.growthRate > 0 ? '+' + data.growthRate.toFixed(1) + '%' : data.growthRate.toFixed(1) + '%';
            changeElement.textContent = changeText;
            changeElement.className = 'indicator-change ' + (data.growthRate > 0 ? 'positive' : 'negative');
        }
    },
    
    // 加载预警信息
    loadWarningMessages: function() {
        var warningList = document.getElementById('warning-list');
        if (!warningList) return;
        
        var warnings = this.mockData.warningMessages;
        var html = '';
        
        warnings.forEach(function(warning) {
            html += '<div class="warning-item ' + warning.status + '" data-level="' + warning.level + '">';
            html += '<div class="warning-header">';
            html += '<span class="warning-title">' + warning.title + '</span>';
            html += '<span class="warning-time">' + warning.time + '</span>';
            html += '</div>';
            html += '<div class="warning-content">' + warning.content + '</div>';
            html += '</div>';
        });
        
        warningList.innerHTML = html;
    },
    
    // 加载图表数据
    loadChartData: function() {
        this.updateWorkloadTrendChart();
        this.updateRevenueStructureChart();
        this.updateDoctorEfficiencyChart();
        this.updateDiseaseDistributionChart();
        this.updateDepartmentComparisonChart();
    },
    
    // 初始化工作量趋势图表
    initWorkloadTrendChart: function() {
        var chart = this.state.charts.workloadTrendChart;
        if (!chart) return;
        
        var option = {
            title: {
                text: '工作量趋势',
                left: 'center',
                textStyle: {
                    fontSize: 16,
                    fontWeight: 'bold'
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            legend: {
                data: ['门诊量', '住院量', '手术量'],
                top: 30
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: []
            },
            yAxis: [
                {
                    type: 'value',
                    name: '门诊量/住院量',
                    position: 'left'
                },
                {
                    type: 'value',
                    name: '手术量',
                    position: 'right'
                }
            ],
            series: [
                {
                    name: '门诊量',
                    type: 'line',
                    yAxisIndex: 0,
                    data: [],
                    smooth: true,
                    lineStyle: {
                        color: '#5470c6'
                    }
                },
                {
                    name: '住院量',
                    type: 'line',
                    yAxisIndex: 0,
                    data: [],
                    smooth: true,
                    lineStyle: {
                        color: '#91cc75'
                    }
                },
                {
                    name: '手术量',
                    type: 'line',
                    yAxisIndex: 1,
                    data: [],
                    smooth: true,
                    lineStyle: {
                        color: '#fac858'
                    }
                }
            ]
        };
        
        chart.setOption(option);
    },
    
    // 更新工作量趋势图表
    updateWorkloadTrendChart: function() {
        var chart = this.state.charts.workloadTrendChart;
        if (!chart) return;
        
        var data = this.mockData.monthlyWorkload;
        var months = data.map(function(item) { return item.month; });
        var outpatientData = data.map(function(item) { return item.outpatientVolume; });
        var inpatientData = data.map(function(item) { return item.inpatientVolume; });
        var surgeryData = data.map(function(item) { return item.surgeryVolume; });
        
        chart.setOption({
            xAxis: {
                data: months
            },
            series: [
                {
                    data: outpatientData
                },
                {
                    data: inpatientData
                },
                {
                    data: surgeryData
                }
            ]
        });
    },
    
    // 初始化收入结构图表
    initRevenueStructureChart: function() {
        var chart = this.state.charts.revenueStructureChart;
        if (!chart) return;
        
        var option = {
            title: {
                text: '收入结构分析',
                left: 'center',
                textStyle: {
                    fontSize: 16,
                    fontWeight: 'bold'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                top: 'middle'
            },
            series: [
                {
                    name: '收入结构',
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
                    data: []
                }
            ]
        };
        
        chart.setOption(option);
    },
    
    // 更新收入结构图表
    updateRevenueStructureChart: function() {
        var chart = this.state.charts.revenueStructureChart;
        if (!chart) return;
        
        var data = [
            { value: 18650000, name: '药品收入' },
            { value: 12300000, name: '检查收入' },
            { value: 8900000, name: '治疗收入' },
            { value: 5800000, name: '手术收入' },
            { value: 3000000, name: '其他收入' }
        ];
        
        chart.setOption({
            series: [{
                data: data
            }]
        });
    },
    
    // 初始化医生效率图表
    initDoctorEfficiencyChart: function() {
        var chart = this.state.charts.doctorEfficiencyChart;
        if (!chart) return;
        
        var option = {
            title: {
                text: '医生工作效率',
                left: 'center',
                textStyle: {
                    fontSize: 16,
                    fontWeight: 'bold'
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['门诊量', '住院量', '手术量'],
                top: 30
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: []
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '门诊量',
                    type: 'bar',
                    data: [],
                    itemStyle: {
                        color: '#5470c6'
                    }
                },
                {
                    name: '住院量',
                    type: 'bar',
                    data: [],
                    itemStyle: {
                        color: '#91cc75'
                    }
                },
                {
                    name: '手术量',
                    type: 'bar',
                    data: [],
                    itemStyle: {
                        color: '#fac858'
                    }
                }
            ]
        };
        
        chart.setOption(option);
    },
    
    // 更新医生效率图表
    updateDoctorEfficiencyChart: function() {
        var chart = this.state.charts.doctorEfficiencyChart;
        if (!chart) return;
        
        var outpatientData = this.mockData.doctorData.outpatient;
        var inpatientData = this.mockData.doctorData.inpatient;
        var surgeryData = this.mockData.doctorData.surgery;
        
        var doctors = outpatientData.map(function(item) { return item.name; });
        var outpatientVolumes = outpatientData.map(function(item) { return item.outpatientVolume; });
        var inpatientVolumes = inpatientData.map(function(item) { return item.inpatientVolume; });
        var surgeryVolumes = surgeryData.map(function(item) { return item.surgeryVolume; });
        
        chart.setOption({
            xAxis: {
                data: doctors
            },
            series: [
                {
                    data: outpatientVolumes
                },
                {
                    data: inpatientVolumes
                },
                {
                    data: surgeryVolumes
                }
            ]
        });
    },
    
    // 初始化疾病分布图表
    initDiseaseDistributionChart: function() {
        var chart = this.state.charts.diseaseDistributionChart;
        if (!chart) return;
        
        var option = {
            title: {
                text: '疾病分布',
                left: 'center',
                textStyle: {
                    fontSize: 16,
                    fontWeight: 'bold'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                top: 'middle'
            },
            series: [
                {
                    name: '疾病分布',
                    type: 'pie',
                    radius: '50%',
                    center: ['60%', '50%'],
                    data: [],
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
    
    // 更新疾病分布图表
    updateDiseaseDistributionChart: function() {
        var chart = this.state.charts.diseaseDistributionChart;
        if (!chart) return;
        
        var data = [
            { value: 1048, name: '心血管疾病' },
            { value: 735, name: '呼吸系统疾病' },
            { value: 580, name: '消化系统疾病' },
            { value: 484, name: '神经系统疾病' },
            { value: 300, name: '其他疾病' }
        ];
        
        chart.setOption({
            series: [{
                data: data
            }]
        });
    },
    
    // 初始化科室对比图表
    initDepartmentComparisonChart: function() {
        var chart = this.state.charts.departmentComparisonChart;
        if (!chart) return;
        
        var option = {
            title: {
                text: '科室对比分析',
                left: 'center',
                textStyle: {
                    fontSize: 16,
                    fontWeight: 'bold'
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['门诊排名', '住院排名', '手术排名', '收入排名', '质量排名'],
                top: 30
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: []
            },
            yAxis: {
                type: 'value',
                inverse: true,
                min: 1,
                max: 8
            },
            series: [
                {
                    name: '门诊排名',
                    type: 'bar',
                    data: [],
                    itemStyle: {
                        color: '#5470c6'
                    }
                },
                {
                    name: '住院排名',
                    type: 'bar',
                    data: [],
                    itemStyle: {
                        color: '#91cc75'
                    }
                },
                {
                    name: '手术排名',
                    type: 'bar',
                    data: [],
                    itemStyle: {
                        color: '#fac858'
                    }
                },
                {
                    name: '收入排名',
                    type: 'bar',
                    data: [],
                    itemStyle: {
                        color: '#ee6666'
                    }
                },
                {
                    name: '质量排名',
                    type: 'bar',
                    data: [],
                    itemStyle: {
                        color: '#73c0de'
                    }
                }
            ]
        };
        
        chart.setOption(option);
    },
    
    // 更新科室对比图表
    updateDepartmentComparisonChart: function() {
        var chart = this.state.charts.departmentComparisonChart;
        if (!chart) return;
        
        var data = this.mockData.departmentComparison;
        var departments = data.map(function(item) { return item.department; });
        var outpatientRanks = data.map(function(item) { return item.outpatientRank; });
        var inpatientRanks = data.map(function(item) { return item.inpatientRank; });
        var surgeryRanks = data.map(function(item) { return item.surgeryRank; });
        var revenueRanks = data.map(function(item) { return item.revenueRank; });
        var qualityRanks = data.map(function(item) { return item.qualityRank; });
        
        chart.setOption({
            xAxis: {
                data: departments
            },
            series: [
                {
                    data: outpatientRanks
                },
                {
                    data: inpatientRanks
                },
                {
                    data: surgeryRanks
                },
                {
                    data: revenueRanks
                },
                {
                    data: qualityRanks
                }
            ]
        });
    },
    
    // 刷新数据
    refreshData: function() {
        console.log('刷新数据...');
        this.loadData();
    },
    
    // 导出报告
    exportReport: function() {
        console.log('导出科室运营报告PDF...');
        
        // 显示导出状态
        const exportBtn = document.getElementById('export-btn');
        if (!exportBtn) {
            console.error('导出按钮未找到');
            return;
        }
        
        const originalText = exportBtn.innerHTML;
        exportBtn.innerHTML = '导出中...';
        exportBtn.disabled = true;
        
        try {
            // 获取要导出的内容区域
            const reportContainer = document.querySelector('.department-cockpit');
            if (!reportContainer) {
                throw new Error('报告容器未找到');
            }
            
            // 配置PDF选项
            const opt = {
                margin: [10, 10, 10, 10],
                filename: '喀什地区第一人民医院科室运营报告.pdf',
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
    
    // 显示导出选项弹窗
    showExportModal: function() {
        var modal = document.createElement('div');
        modal.className = 'export-modal-overlay';
        modal.innerHTML = `
            <div class="export-modal">
                <div class="export-modal-header">
                    <h3>导出科室运营报告</h3>
                    <button class="export-modal-close">&times;</button>
                </div>
                <div class="export-modal-body">
                    <div class="export-options">
                        <h4>选择导出格式：</h4>
                        <div class="format-options">
                            <label class="format-option">
                                <input type="radio" name="exportFormat" value="pdf" checked>
                                <span class="format-icon">📄</span>
                                <span class="format-text">PDF报告</span>
                                <small>完整的可视化报告，包含图表</small>
                            </label>
                            <label class="format-option">
                                <input type="radio" name="exportFormat" value="excel">
                                <span class="format-icon">📊</span>
                                <span class="format-text">Excel数据</span>
                                <small>导出表格数据，便于进一步分析</small>
                            </label>
                        </div>
                        
                        <h4>选择导出内容：</h4>
                        <div class="content-options">
                            <label class="content-option">
                                <input type="checkbox" name="exportContent" value="indicators" checked>
                                <span>关键指标</span>
                            </label>
                            <label class="content-option">
                                <input type="checkbox" name="exportContent" value="charts" checked>
                                <span>图表数据</span>
                            </label>
                            <label class="content-option">
                                <input type="checkbox" name="exportContent" value="tables" checked>
                                <span>数据表格</span>
                            </label>
                            <label class="content-option">
                                <input type="checkbox" name="exportContent" value="analysis" checked>
                                <span>分析报告</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="export-modal-footer">
                    <button class="btn btn-default export-cancel">取消</button>
                    <button class="btn btn-primary export-confirm">开始导出</button>
                </div>
            </div>
        `;
        
        // 添加样式
        if (!document.querySelector('#export-modal-styles')) {
            var style = document.createElement('style');
            style.id = 'export-modal-styles';
            style.textContent = `
                .export-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                }
                .export-modal {
                    background: white;
                    border-radius: 8px;
                    width: 500px;
                    max-width: 90vw;
                    max-height: 80vh;
                    overflow: auto;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                }
                .export-modal-header {
                    padding: 20px;
                    border-bottom: 1px solid #eee;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .export-modal-header h3 {
                    margin: 0;
                    color: #333;
                }
                .export-modal-close {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #999;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .export-modal-close:hover {
                    color: #666;
                }
                .export-modal-body {
                    padding: 20px;
                }
                .export-options h4 {
                    margin: 0 0 15px 0;
                    color: #333;
                    font-size: 16px;
                }
                .format-options {
                    display: grid;
                    gap: 12px;
                    margin-bottom: 25px;
                }
                .format-option {
                    display: flex;
                    align-items: center;
                    padding: 15px;
                    border: 2px solid #e1e5e9;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .format-option:hover {
                    border-color: #1890ff;
                    background: #f6f8ff;
                }
                .format-option input[type="radio"] {
                    margin-right: 12px;
                }
                .format-option input[type="radio"]:checked + .format-icon + .format-text {
                    color: #1890ff;
                    font-weight: 600;
                }
                .format-option input[type="radio"]:checked ~ * {
                    color: #1890ff;
                }
                .format-option:has(input[type="radio"]:checked) {
                    border-color: #1890ff;
                    background: #f6f8ff;
                }
                .format-icon {
                    font-size: 20px;
                    margin-right: 10px;
                }
                .format-text {
                    font-weight: 500;
                    margin-right: 10px;
                }
                .format-option small {
                    color: #666;
                    font-size: 12px;
                    margin-left: auto;
                }
                .content-options {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                }
                .content-option {
                    display: flex;
                    align-items: center;
                    padding: 8px;
                    cursor: pointer;
                }
                .content-option input[type="checkbox"] {
                    margin-right: 8px;
                }
                .export-modal-footer {
                    padding: 20px;
                    border-top: 1px solid #eee;
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                }
                .export-modal-footer .btn {
                    padding: 8px 20px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                }
                .export-modal-footer .btn-default {
                    background: #f5f5f5;
                    color: #333;
                }
                .export-modal-footer .btn-primary {
                    background: #1890ff;
                    color: white;
                }
                .export-modal-footer .btn:hover {
                    opacity: 0.9;
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(modal);
        
        // 绑定事件
        var self = this;
        modal.querySelector('.export-modal-close').onclick = function() {
            document.body.removeChild(modal);
        };
        modal.querySelector('.export-cancel').onclick = function() {
            document.body.removeChild(modal);
        };
        modal.querySelector('.export-confirm').onclick = function() {
            self.performExport(modal);
        };
        
        // 点击遮罩关闭
        modal.onclick = function(e) {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        };
    },
    
    // 执行导出
    performExport: function(modal) {
        var format = modal.querySelector('input[name="exportFormat"]:checked').value;
        var contentOptions = Array.from(modal.querySelector('.content-options').querySelectorAll('input[type="checkbox"]:checked')).map(function(cb) {
            return cb.value;
        });
        
        console.log('导出格式:', format);
        console.log('导出内容:', contentOptions);
        
        // 关闭弹窗
        document.body.removeChild(modal);
        
        // 显示导出进度
        this.showExportProgress(format, contentOptions);
    },
    
    // 显示导出进度
    showExportProgress: function(format, contentOptions) {
        var progressModal = document.createElement('div');
        progressModal.className = 'export-modal-overlay';
        progressModal.innerHTML = `
            <div class="export-modal" style="width: 400px;">
                <div class="export-modal-header">
                    <h3>正在导出报告...</h3>
                </div>
                <div class="export-modal-body">
                    <div class="export-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 0%"></div>
                        </div>
                        <div class="progress-text">准备导出数据...</div>
                    </div>
                </div>
            </div>
        `;
        
        // 添加进度条样式
        if (!document.querySelector('#export-progress-styles')) {
            var style = document.createElement('style');
            style.id = 'export-progress-styles';
            style.textContent = `
                .export-progress {
                    text-align: center;
                }
                .progress-bar {
                    width: 100%;
                    height: 20px;
                    background: #f0f0f0;
                    border-radius: 10px;
                    overflow: hidden;
                    margin-bottom: 15px;
                }
                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #1890ff, #40a9ff);
                    transition: width 0.3s ease;
                }
                .progress-text {
                    color: #666;
                    font-size: 14px;
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(progressModal);
        
        var self = this;
        var progressFill = progressModal.querySelector('.progress-fill');
        var progressText = progressModal.querySelector('.progress-text');
        
        // 模拟导出进度
        var progress = 0;
        var steps = [
            { progress: 20, text: '收集数据...' },
            { progress: 40, text: '生成图表...' },
            { progress: 60, text: '处理表格...' },
            { progress: 80, text: '格式化内容...' },
            { progress: 100, text: '完成导出...' }
        ];
        
        var stepIndex = 0;
        var progressInterval = setInterval(function() {
            if (stepIndex < steps.length) {
                var step = steps[stepIndex];
                progressFill.style.width = step.progress + '%';
                progressText.textContent = step.text;
                stepIndex++;
            } else {
                clearInterval(progressInterval);
                setTimeout(function() {
                    document.body.removeChild(progressModal);
                    self.executeExport(format, contentOptions);
                }, 500);
            }
        }, 800);
    },
    
    // 执行实际导出
    executeExport: function(format, contentOptions) {
        var self = this;
        
        if (format === 'pdf') {
            this.exportToPDF(contentOptions);
        } else if (format === 'excel') {
            this.exportToExcel(contentOptions);
        }
    },
    
    // 导出PDF
    exportToPDF: function(contentOptions) {
        var self = this;
        
        // 使用Common.Export.exportToPDF
        if (window.Common && Common.Export) {
            var exportElement = document.querySelector('.department-cockpit');
            if (!exportElement) {
                exportElement = document.querySelector('.content');
            }
            
            var filename = '科室运营报告_' + new Date().toISOString().slice(0, 10) + '.pdf';
            
            Common.Export.exportToPDF(exportElement, {
                filename: filename,
                margin: 15,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 2, 
                    useCORS: true, 
                    backgroundColor: '#ffffff',
                    logging: false,
                    allowTaint: true
                },
                jsPDF: { 
                    unit: 'pt', 
                    format: 'a4', 
                    orientation: 'portrait' 
                }
            }).then(function() {
                self.showExportSuccess('PDF报告导出成功！');
            }).catch(function(error) {
                console.error('PDF导出失败:', error);
                self.showExportError('PDF导出失败，请重试！');
            });
        } else {
            this.showExportError('导出功能未就绪，请刷新页面重试！');
        }
    },
    
    // 导出Excel
    exportToExcel: function(contentOptions) {
        var self = this;
        
        // 使用Common.Export.exportToExcel
        if (window.Common && Common.Export) {
            var tables = document.querySelectorAll('table');
            var filename = '科室运营报告数据_' + new Date().toISOString().slice(0, 10) + '.xlsx';
            
            if (tables.length > 0) {
                Common.Export.exportToExcel(Array.from(tables), filename).then(function() {
                    self.showExportSuccess('Excel数据导出成功！');
                }).catch(function(error) {
                    console.error('Excel导出失败:', error);
                    self.showExportError('Excel导出失败，请重试！');
                });
            } else {
                // 如果没有表格，创建一个包含关键指标的Excel
                this.createExcelFromData(filename);
            }
        } else {
            this.showExportError('导出功能未就绪，请刷新页面重试！');
        }
    },
    
    // 从数据创建Excel
    createExcelFromData: function(filename) {
        var self = this;
        
        // 创建工作簿数据
        var workbookData = [];
        
        // 关键指标数据
        var indicatorsData = [
            ['指标名称', '数值', '单位', '同比变化'],
            ['门诊人次', '12,456', '人次', '+8.5%'],
            ['住院人次', '3,245', '人次', '+12.3%'],
            ['手术台次', '856', '台次', '+15.2%'],
            ['平均住院日', '7.2', '天', '-5.8%'],
            ['床位使用率', '85.6', '%', '+3.2%'],
            ['医疗收入', '2,456,789', '元', '+18.7%']
        ];
        
        // 收入趋势数据
        var revenueData = [
            ['月份', '门诊收入', '住院收入', '总收入'],
            ['1月', '1,234,567', '2,345,678', '3,580,245'],
            ['2月', '1,345,678', '2,456,789', '3,802,467'],
            ['3月', '1,456,789', '2,567,890', '4,024,679'],
            ['4月', '1,567,890', '2,678,901', '4,246,791'],
            ['5月', '1,678,901', '2,789,012', '4,467,913'],
            ['6月', '1,789,012', '2,890,123', '4,679,135']
        ];
        
        // 医疗质量指标
        var qualityData = [
            ['质量指标', '目标值', '实际值', '达标情况'],
            ['治愈好转率', '≥95%', '96.8%', '达标'],
            ['平均住院日', '≤8天', '7.2天', '达标'],
            ['药占比', '≤30%', '28.5%', '达标'],
            ['耗材占比', '≤20%', '18.3%', '达标'],
            ['院感发生率', '≤3%', '1.2%', '达标']
        ];
        
        try {
            // 如果XLSX库可用，创建多sheet Excel
            if (window.XLSX) {
                var wb = window.XLSX.utils.book_new();
                
                // 添加关键指标sheet
                var ws1 = window.XLSX.utils.aoa_to_sheet(indicatorsData);
                window.XLSX.utils.book_append_sheet(wb, ws1, '关键指标');
                
                // 添加收入趋势sheet
                var ws2 = window.XLSX.utils.aoa_to_sheet(revenueData);
                window.XLSX.utils.book_append_sheet(wb, ws2, '收入趋势');
                
                // 添加质量指标sheet
                var ws3 = window.XLSX.utils.aoa_to_sheet(qualityData);
                window.XLSX.utils.book_append_sheet(wb, ws3, '医疗质量');
                
                // 导出文件
                var wbout = window.XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                var blob = new Blob([wbout], {type:'application/octet-stream'});
                
                var url = URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                this.showExportSuccess('Excel数据导出成功！');
            } else {
                // 回退到CSV导出
                var csvContent = indicatorsData.map(function(row) {
                    return row.map(function(cell) {
                        return '"' + String(cell).replace(/"/g, '""') + '"';
                    }).join(',');
                }).join('\n');
                
                var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                var url = URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.download = filename.replace('.xlsx', '.csv');
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                this.showExportSuccess('CSV数据导出成功！');
            }
        } catch (error) {
            console.error('数据导出失败:', error);
            this.showExportError('数据导出失败，请重试！');
        }
    },
    
    // 显示导出成功消息
    showExportSuccess: function(message) {
        this.showToast(message, 'success');
    },
    
    // 显示导出错误消息
    showExportError: function(message) {
        this.showToast(message, 'error');
    },
    
    // 显示提示消息
    showToast: function(message, type) {
        if (window.Common && Common.showToast) {
            Common.showToast(message, type);
        } else {
            // 简单的toast实现
            var toast = document.createElement('div');
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 20px;
                border-radius: 4px;
                color: white;
                font-size: 14px;
                z-index: 10001;
                max-width: 300px;
                word-wrap: break-word;
                background: ${type === 'success' ? '#52c41a' : type === 'error' ? '#ff4d4f' : '#1890ff'};
            `;
            toast.textContent = message;
            document.body.appendChild(toast);
            
            setTimeout(function() {
                if (toast.parentNode) {
                    document.body.removeChild(toast);
                }
            }, 3000);
        }
    },
    
    // 下钻功能
    drillDown: function(indicatorType) {
        console.log('下钻到指标:', indicatorType);
        // 这里可以添加下钻功能的实现
    },
    
    // 显示医生详情弹窗
    showDoctorModal: function(indicatorType) {
        console.log('显示医生详情弹窗:', indicatorType);
        
        var modal = document.getElementById('doctorModal');
        var modalTitle = document.getElementById('modalTitle');
        var modalContent = document.getElementById('modalContent');
        
        if (!modal || !modalTitle || !modalContent) {
            console.error('弹窗元素不存在');
            return;
        }
        
        // 设置弹窗标题
        var titles = {
            'outpatient': '门诊医生排行',
            'inpatient': '住院医生排行',
            'surgery': '手术医生排行',
            'revenue': '收入医生排行',
            'cmi': 'CMI医生排行',
            'avgstay': '平均住院日医生排行'
        };
        
        modalTitle.textContent = titles[indicatorType] || '医生详情';
        
        // 获取对应数据
        var data = this.mockData.doctorData[indicatorType] || [];
        
        // 生成表格内容
        var html = '<table class="doctor-table">';
        html += '<thead><tr>';
        
        // 根据指标类型设置表头
        switch(indicatorType) {
            case 'outpatient':
                html += '<th>排名</th><th>医生</th><th>门诊量</th><th>满意度</th><th>平均候诊时间</th>';
                break;
            case 'inpatient':
                html += '<th>排名</th><th>医生</th><th>住院量</th><th>平均住院日</th><th>满意度</th>';
                break;
            case 'surgery':
                html += '<th>排名</th><th>医生</th><th>手术量</th><th>成功率</th><th>平均手术时间</th>';
                break;
            case 'revenue':
                html += '<th>排名</th><th>医生</th><th>收入</th><th>药占比</th><th>检查占比</th>';
                break;
            case 'cmi':
                html += '<th>排名</th><th>医生</th><th>CMI值</th><th>病例复杂度</th><th>专科级别</th>';
                break;
            case 'avgstay':
                html += '<th>排名</th><th>医生</th><th>平均住院日</th><th>床位周转</th><th>效率评价</th>';
                break;
        }
        
        html += '</tr></thead><tbody>';
        
        // 生成表格数据
        data.forEach(function(doctor, index) {
            html += '<tr>';
            html += '<td>' + (index + 1) + '</td>';
            html += '<td>' + doctor.name + '</td>';
            
            switch(indicatorType) {
                case 'outpatient':
                    html += '<td>' + doctor.outpatientVolume + '</td>';
                    html += '<td>' + doctor.satisfaction + '%</td>';
                    html += '<td>' + doctor.avgWaitTime + '分钟</td>';
                    break;
                case 'inpatient':
                    html += '<td>' + doctor.inpatientVolume + '</td>';
                    html += '<td>' + doctor.avgStay + '天</td>';
                    html += '<td>' + doctor.satisfaction + '%</td>';
                    break;
                case 'surgery':
                    html += '<td>' + doctor.surgeryVolume + '</td>';
                    html += '<td>' + doctor.successRate + '%</td>';
                    html += '<td>' + doctor.avgTime + '分钟</td>';
                    break;
                case 'revenue':
                    html += '<td>' + (doctor.revenue / 10000).toFixed(0) + '万</td>';
                    html += '<td>' + doctor.drugRatio + '%</td>';
                    html += '<td>' + doctor.examRatio + '%</td>';
                    break;
                case 'cmi':
                    html += '<td>' + doctor.cmi + '</td>';
                    html += '<td>' + doctor.caseComplexity + '</td>';
                    html += '<td>' + doctor.specialtyLevel + '</td>';
                    break;
                case 'avgstay':
                    html += '<td>' + doctor.avgStay + '天</td>';
                    html += '<td>' + doctor.bedTurnover + '次</td>';
                    html += '<td>' + doctor.efficiency + '</td>';
                    break;
            }
            
            html += '</tr>';
        });
        
        html += '</tbody></table>';
        
        modalContent.innerHTML = html;
        modal.style.display = 'block';
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM加载完成，开始初始化DepartmentOperationReportPage');
    DepartmentOperationReportPage.init();
});