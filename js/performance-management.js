// 绩效管理页面JavaScript功能

// 全局变量
let performanceData = [];
let currentPage = 1;
let pageSize = 20;
let totalItems = 55;

// 模拟绩效指标数据 - 完整的26个三级公立医院绩效监测指标
const mockPerformanceData = [
    {
        id: 1,
        name: '出院患者手术占比',
        category: 'medical',
        currentValue: '19.93%',
        targetValue: '≥18%',
        completionRate: '110.7%',
        yearOverYear: '+1.01%',
        status: 'normal',
        weight: '4%',
        score: '4.4分',
        trend: 'positive'
    },
    {
        id: 2,
        name: '微创手术占比',
        category: 'medical',
        currentValue: '14.41%',
        targetValue: '≥12%',
        completionRate: '120.1%',
        yearOverYear: '+1.14%',
        status: 'normal',
        weight: '4%',
        score: '4.8分',
        trend: 'positive'
    },
    {
        id: 3,
        name: '四级手术比例',
        category: 'medical',
        currentValue: '37.82%',
        targetValue: '≥35%',
        completionRate: '108.1%',
        yearOverYear: '+2.50%',
        status: 'normal',
        weight: '5%',
        score: '5.4分',
        trend: 'positive'
    },
    {
        id: 4,
        name: '手术患者并发症发生率',
        category: 'medical',
        currentValue: '0.73%',
        targetValue: '≤1.0%',
        completionRate: '137.0%',
        yearOverYear: '-0.02%',
        status: 'normal',
        weight: '6%',
        score: '8.2分',
        trend: 'positive'
    },
    {
        id: 5,
        name: 'I类切口手术部位感染率',
        category: 'medical',
        currentValue: '0.02%',
        targetValue: '≤0.5%',
        completionRate: '2400%',
        yearOverYear: '-0.04%',
        status: 'normal',
        weight: '6%',
        score: '6.0分',
        trend: 'positive'
    },
    {
        id: 6,
        name: '低风险组病例死亡率',
        category: 'medical',
        currentValue: '0.002%',
        targetValue: '≤0.1%',
        completionRate: '5000%',
        yearOverYear: '-0.014%',
        status: 'normal',
        weight: '8%',
        score: '8.0分',
        trend: 'positive'
    },
    {
        id: 7,
        name: '抗菌药物使用强度',
        category: 'medical',
        currentValue: '33.8DDDs',
        targetValue: '≤40DDDs',
        completionRate: '118.3%',
        yearOverYear: '-1.5DDDs',
        status: 'normal',
        weight: '5%',
        score: '5.9分',
        trend: 'positive'
    },
    {
        id: 8,
        name: '门诊患者基本药物处方占比',
        category: 'medical',
        currentValue: '59.48%',
        targetValue: '≥50%',
        completionRate: '119.0%',
        yearOverYear: '+1.40%',
        status: 'normal',
        weight: '3%',
        score: '3.6分',
        trend: 'positive'
    },
    {
        id: 9,
        name: '住院患者基本药物使用率',
        category: 'medical',
        currentValue: '96.30%',
        targetValue: '≥90%',
        completionRate: '107.0%',
        yearOverYear: '+0.13%',
        status: 'normal',
        weight: '3%',
        score: '3.2分',
        trend: 'positive'
    },
    {
        id: 10,
        name: '国家组织药品集中采购中标药品使用比例',
        category: 'medical',
        currentValue: '89.71%',
        targetValue: '≥80%',
        completionRate: '112.1%',
        yearOverYear: '+4.06%',
        status: 'normal',
        weight: '4%',
        score: '4.5分',
        trend: 'positive'
    },
    {
        id: 11,
        name: '大型医用设备检查阳性率',
        category: 'medical',
        currentValue: '89.0%',
        targetValue: '≥85%',
        completionRate: '104.7%',
        yearOverYear: '+0.55%',
        status: 'normal',
        weight: '3%',
        score: '3.1分',
        trend: 'positive'
    },
    {
        id: 12,
        name: '平均住院日',
        category: 'operation',
        currentValue: '8.5天',
        targetValue: '≤9天',
        completionRate: '105.9%',
        yearOverYear: '-0.3天',
        status: 'normal',
        weight: '6%',
        score: '6.4分',
        trend: 'positive'
    },
    {
        id: 13,
        name: '床位使用率',
        category: 'operation',
        currentValue: '85.2%',
        targetValue: '≥85%',
        completionRate: '100.2%',
        yearOverYear: '+1.5%',
        status: 'warning',
        weight: '4%',
        score: '4.0分',
        trend: 'positive'
    },
    {
        id: 14,
        name: '医护比',
        category: 'operation',
        currentValue: '1:1.52',
        targetValue: '1:1.25',
        completionRate: '121.6%',
        yearOverYear: '+0.05',
        status: 'normal',
        weight: '5%',
        score: '6.1分',
        trend: 'positive'
    },
    {
         id: 15,
         name: '医疗服务收入占医疗收入比例',
         category: 'operation',
         currentValue: '29.59%',
         targetValue: '≥30%',
         completionRate: '98.6%',
         yearOverYear: '+0.94%',
         status: 'critical',
         weight: '8%',
         score: '7.9分',
         trend: 'positive'
     },
     {
         id: 16,
         name: '人员经费占业务支出比重',
         category: 'operation',
         currentValue: '39.18%',
         targetValue: '≥40%',
         completionRate: '98.0%',
         yearOverYear: '+0.13%',
         status: 'critical',
         weight: '6%',
         score: '5.9分',
         trend: 'positive'
     },
    {
        id: 17,
        name: '万元收入能耗支出',
        category: 'operation',
        currentValue: '158元',
        targetValue: '≤200元',
        completionRate: '126.6%',
        yearOverYear: '-12元',
        status: 'normal',
        weight: '3%',
        score: '3.8分',
        trend: 'positive'
    },
    {
        id: 18,
        name: '收支结余',
        category: 'operation',
        currentValue: '5.2%',
        targetValue: '≥3%',
        completionRate: '173.3%',
        yearOverYear: '+1.8%',
        status: 'normal',
        weight: '8%',
        score: '13.9分',
        trend: 'positive'
    },
    {
        id: 19,
        name: '资产负债率',
        category: 'operation',
        currentValue: '42.5%',
        targetValue: '≤50%',
        completionRate: '117.6%',
        yearOverYear: '-2.1%',
        status: 'normal',
        weight: '4%',
        score: '4.7分',
        trend: 'positive'
    },
    {
        id: 20,
        name: '医师日均担负诊疗人次',
        category: 'operation',
        currentValue: '7.8人次',
        targetValue: '7-9人次',
        completionRate: '100%',
        yearOverYear: '+0.2人次',
        status: 'warning',
        weight: '3%',
        score: '3.0分',
        trend: 'positive'
    },
    {
        id: 21,
        name: '医师日均担负住院床日',
        category: 'operation',
        currentValue: '2.8床日',
        targetValue: '2.5-3.0床日',
        completionRate: '100%',
        yearOverYear: '+0.1床日',
        status: 'warning',
        weight: '3%',
        score: '3.0分',
        trend: 'positive'
    },
    {
        id: 22,
        name: '每百张床位医师数',
        category: 'development',
        currentValue: '18.5人',
        targetValue: '≥17人',
        completionRate: '108.8%',
        yearOverYear: '+0.8人',
        status: 'normal',
        weight: '4%',
        score: '4.4分',
        trend: 'positive'
    },
    {
        id: 23,
        name: '麻醉医师占医师比例',
        category: 'development',
        currentValue: '5.2%',
        targetValue: '≥5%',
        completionRate: '104.0%',
        yearOverYear: '+0.3%',
        status: 'warning',
        weight: '3%',
        score: '3.1分',
        trend: 'positive'
    },
    {
        id: 24,
        name: '门诊患者满意度',
        category: 'satisfaction',
        currentValue: '93.95分',
        targetValue: '≥90分',
        completionRate: '104.4%',
        yearOverYear: '+5.16分',
        status: 'normal',
        weight: '8%',
        score: '8.4分',
        trend: 'positive'
    },
    {
        id: 25,
        name: '住院患者满意度',
        category: 'satisfaction',
        currentValue: '95.42分',
        targetValue: '≥90分',
        completionRate: '106.0%',
        yearOverYear: '+2.58分',
        status: 'normal',
        weight: '8%',
        score: '8.5分',
        trend: 'positive'
    },
    {
        id: 26,
        name: '医务人员满意度',
        category: 'satisfaction',
        currentValue: '86.23分',
        targetValue: '≥85分',
        completionRate: '101.4%',
        yearOverYear: '+2.56分',
        status: 'warning',
        weight: '6%',
        score: '6.1分',
        trend: 'positive'
    }
];

// 初始化绩效管理页面
function initPerformanceManagement() {
    console.log('初始化绩效管理页面');
    
    // 初始化数据
    performanceData = [...mockPerformanceData];
    
    // 重置筛选器到默认状态
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    if (searchInput) searchInput.value = '';
    if (categoryFilter) categoryFilter.value = '';
    if (statusFilter) statusFilter.value = '';
    
    // 初始化图表
    initPerformanceRadarChart();
    initPerformanceTrendChart();
    initDepartmentPerformanceChart();
    
    // 初始化表格
    renderPerformanceTable();
    
    // 更新监测预警统计
    updateWarningStatistics();
    
    // 绑定事件监听器
    bindEventListeners();
    
    // 更新概览卡片动画
    animateOverviewCards();
}

// 初始化绩效雷达图
function initPerformanceRadarChart() {
    const chartDom = document.getElementById('performanceRadarChart');
    if (!chartDom) return;
    
    const myChart = echarts.init(chartDom);
    
    const option = {
        title: {
            text: '绩效指标雷达图',
            left: 'center',
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            top: 'middle'
        },
        radar: {
            indicator: [
                { name: '医疗质量', max: 420 },
                { name: '运营效率', max: 290 },
                { name: '持续发展', max: 140 },
                { name: '满意度评价', max: 120 }
            ],
            center: ['50%', '55%'],
            radius: '60%'
        },
        series: [{
            name: '绩效指标',
            type: 'radar',
            data: [
                {
                    value: [405.8, 265.2, 132.5, 115.8],
                    name: '2024年',
                    areaStyle: {
                        color: 'rgba(22, 93, 255, 0.2)'
                    },
                    lineStyle: {
                        color: '#165dff'
                    }
                },
                {
                    value: [358.4, 218.6, 108.3, 98.2],
                    name: '2023年',
                    areaStyle: {
                        color: 'rgba(255, 125, 0, 0.2)'
                    },
                    lineStyle: {
                        color: '#ff7d00'
                    }
                }
            ]
        }]
    };
    
    myChart.setOption(option);
    
    // 响应式处理
    window.addEventListener('resize', function() {
        myChart.resize();
    });
}

// 初始化绩效趋势图
// 全局变量存储图表实例
let performanceTrendChartInstance = null;

// 多年趋势数据
const trendData = {
    '5': {
        xAxis: ['2020', '2021', '2022', '2023', '2024'],
        series: [
            {
                name: '医疗质量',
                data: [357.8, 365.8, 373.4, 358.4, 405.8]
            },
            {
                name: '运营效率',
                data: [222.7, 226.8, 230.6, 218.6, 265.2]
            },
            {
                name: '持续发展',
                data: [112.1, 114.5, 116.5, 108.3, 132.5]
            },
            {
                name: '满意度评价',
                data: [103.8, 104.6, 105.7, 98.2, 115.8]
            }
        ]
    },
    '3': {
        xAxis: ['2022', '2023', '2024'],
        series: [
            {
                name: '医疗质量',
                data: [373.4, 358.4, 405.8]
            },
            {
                name: '运营效率',
                data: [230.6, 218.6, 265.2]
            },
            {
                name: '持续发展',
                data: [116.5, 108.3, 132.5]
            },
            {
                name: '满意度评价',
                data: [105.7, 98.2, 115.8]
            }
        ]
    },
    '1': {
        xAxis: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        series: [
            {
                name: '医疗质量',
                data: [380.2, 382.5, 385.1, 387.3, 389.8, 391.2, 388.5, 386.7, 387.7, null, null, null]
            },
            {
                name: '运营效率',
                data: [225.3, 227.8, 230.2, 232.1, 228.9, 226.5, 224.8, 227.2, 228.8, null, null, null]
            },
            {
                name: '持续发展',
                data: [118.5, 119.8, 121.2, 122.5, 123.1, 123.8, 124.0, 124.1, 124.2, null, null, null]
            },
            {
                name: '满意度评价',
                data: [107.2, 107.8, 108.1, 108.5, 108.9, 109.1, 109.2, 109.3, 109.4, null, null, null]
            }
        ]
    }
};

function initPerformanceTrendChart(timeRange = '5') {
    const chartDom = document.getElementById('performanceTrendChart');
    if (!chartDom) return;
    
    if (performanceTrendChartInstance) {
        performanceTrendChartInstance.dispose();
    }
    
    performanceTrendChartInstance = echarts.init(chartDom);
    
    const currentData = trendData[timeRange];
    
    const option = {
        title: {
            text: '多年趋势对比',
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
            data: ['医疗质量', '运营效率', '持续发展', '满意度评价'],
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
            data: currentData.xAxis
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 450
        },
        series: [
            {
                name: '医疗质量',
                type: 'line',
                data: currentData.series[0].data,
                smooth: true,
                lineStyle: {
                    color: '#ff6b6b',
                    width: 2
                },
                itemStyle: {
                    color: '#ff6b6b'
                },
                connectNulls: false
            },
            {
                name: '运营效率',
                type: 'line',
                data: currentData.series[1].data,
                smooth: true,
                lineStyle: {
                    color: '#4ecdc4',
                    width: 2
                },
                itemStyle: {
                    color: '#4ecdc4'
                },
                connectNulls: false
            },
            {
                name: '持续发展',
                type: 'line',
                data: currentData.series[2].data,
                smooth: true,
                lineStyle: {
                    color: '#45b7d1',
                    width: 2
                },
                itemStyle: {
                    color: '#45b7d1'
                },
                connectNulls: false
            },
            {
                name: '满意度评价',
                type: 'line',
                data: currentData.series[3].data,
                smooth: true,
                lineStyle: {
                    color: '#f093fb',
                    width: 2
                },
                itemStyle: {
                    color: '#f093fb'
                },
                connectNulls: false
            }
        ]
    };
    
    performanceTrendChartInstance.setOption(option);
    
    // 响应式处理
    window.addEventListener('resize', function() {
        if (performanceTrendChartInstance) {
            performanceTrendChartInstance.resize();
        }
    });
}

// 初始化科室绩效图表
function initDepartmentPerformanceChart() {
    const chartDom = document.getElementById('departmentPerformanceChart');
    if (!chartDom) return;
    
    const myChart = echarts.init(chartDom);
    
    const option = {
        title: {
            text: '科室绩效目标执行情况',
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
            data: ['目标完成率', '绩效得分'],
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
            data: ['内科', '外科', '妇产科', '儿科', '骨科', '急诊科', '麻醉科', '影像科']
        },
        yAxis: [
            {
                type: 'value',
                name: '完成率(%)',
                min: 0,
                max: 120,
                position: 'left'
            },
            {
                type: 'value',
                name: '得分',
                min: 0,
                max: 100,
                position: 'right'
            }
        ],
        series: [
            {
                name: '目标完成率',
                type: 'bar',
                yAxisIndex: 0,
                data: [95.2, 88.7, 102.3, 91.8, 85.4, 78.9, 96.1, 89.3],
                itemStyle: {
                    color: '#165dff'
                }
            },
            {
                name: '绩效得分',
                type: 'line',
                yAxisIndex: 1,
                data: [87.5, 82.1, 91.2, 85.8, 79.3, 74.6, 88.9, 83.7],
                lineStyle: {
                    color: '#ff7d00'
                },
                symbol: 'circle',
                symbolSize: 6
            }
        ]
    };
    
    myChart.setOption(option);
    
    // 响应式处理
    window.addEventListener('resize', function() {
        myChart.resize();
    });
}

// 渲染绩效表格
function renderPerformanceTable() {
    const tbody = document.getElementById('performanceTableBody');
    if (!tbody) return;
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, performanceData.length);
    const pageData = performanceData.slice(startIndex, endIndex);
    
    tbody.innerHTML = '';
    
    pageData.forEach(item => {
        const row = document.createElement('tr');
        
        const statusClass = item.status === 'normal' ? 'normal' : 
                           item.status === 'warning' ? 'warning' : 'critical';
        
        const trendIcon = item.trend === 'positive' ? '↑' : '↓';
        const trendColor = item.trend === 'positive' ? '#00b42a' : '#f53f3f';
        
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${getCategoryName(item.category)}</td>
            <td>${item.currentValue}</td>
            <td>${item.targetValue}</td>
            <td>${item.completionRate}</td>
            <td style="color: ${trendColor}">${item.yearOverYear} ${trendIcon}</td>
            <td><span class="card-status ${statusClass}">${getStatusName(item.status)}</span></td>
            <td>${item.weight}</td>
            <td>${item.score}</td>
            <td>
                <button class="detail-btn" onclick="showIndicatorDetail('${item.id}')">详情</button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    // 更新分页信息
    updatePaginationInfo();
}

// 获取分类名称
function getCategoryName(category) {
    const categoryMap = {
        'medical': '医疗质量',
        'operation': '运营效率',
        'development': '持续发展',
        'satisfaction': '满意度评价'
    };
    return categoryMap[category] || category;
}

// 获取状态名称
function getStatusName(status) {
    const statusMap = {
        'normal': '正常',
        'warning': '预警',
        'critical': '严重'
    };
    return statusMap[status] || status;
}

// 更新分页信息
function updatePaginationInfo() {
    const pageInfo = document.getElementById('pageInfo');
    const totalCount = document.getElementById('totalCount');
    
    if (pageInfo) {
        const startIndex = (currentPage - 1) * pageSize + 1;
        const endIndex = Math.min(currentPage * pageSize, performanceData.length);
        pageInfo.textContent = `${startIndex}-${endIndex}`;
    }
    
    if (totalCount) {
        totalCount.textContent = performanceData.length;
    }
}

// 更新监测预警统计
function updateWarningStatistics() {
    const criticalCount = mockPerformanceData.filter(item => item.status === 'critical').length;
    const warningCount = mockPerformanceData.filter(item => item.status === 'warning').length;
    const normalCount = mockPerformanceData.filter(item => item.status === 'normal').length;
    
    // 更新HTML中的统计数字
    const criticalSpan = document.querySelector('.warning-count.critical');
    const warningSpan = document.querySelector('.warning-count.warning');
    const normalSpan = document.querySelector('.warning-count.normal');
    
    if (criticalSpan) {
        criticalSpan.textContent = `严重预警: ${criticalCount}项`;
    }
    if (warningSpan) {
        warningSpan.textContent = `一般预警: ${warningCount}项`;
    }
    if (normalSpan) {
        normalSpan.textContent = `正常: ${normalCount}项`;
    }
}

// 绑定事件监听器
function bindEventListeners() {
    // 刷新数据按钮
    const refreshBtn = document.getElementById('refreshData');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            console.log('刷新绩效数据');
            // 模拟数据刷新
            setTimeout(() => {
                renderPerformanceTable();
                showNotification('数据已刷新', 'success');
            }, 1000);
        });
    }
    
    // 生成报告按钮
    const exportReportBtn = document.getElementById('exportReport');
    if (exportReportBtn) {
        exportReportBtn.addEventListener('click', function() {
            showReportModal();
        });
    }
    
    // 下载表格按钮
    const downloadTableBtn = document.getElementById('downloadTable');
    if (downloadTableBtn) {
        downloadTableBtn.addEventListener('click', function() {
            downloadPerformanceTable();
        });
    }
    
    // 搜索输入框
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterPerformanceData();
        });
    }
    
    // 分类筛选
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            filterPerformanceData();
        });
    }
    
    // 状态筛选
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            filterPerformanceData();
        });
    }
    
    // 分页按钮
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                renderPerformanceTable();
            }
        });
    }
    
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', function() {
            const maxPage = Math.ceil(performanceData.length / pageSize);
            if (currentPage < maxPage) {
                currentPage++;
                renderPerformanceTable();
            }
        });
    }
    
    // 趋势时间范围选择
    const trendTimeRange = document.getElementById('trendTimeRange');
    if (trendTimeRange) {
        trendTimeRange.addEventListener('change', function() {
            updateTrendChart(this.value);
        });
    }
    
    // 科室选择
    const departmentSelect = document.getElementById('departmentSelect');
    if (departmentSelect) {
        departmentSelect.addEventListener('change', function() {
            updateDepartmentChart(this.value);
        });
    }
    
    // 科室分析按钮
    const departmentAnalysisBtn = document.getElementById('departmentAnalysis');
    if (departmentAnalysisBtn) {
        departmentAnalysisBtn.addEventListener('click', function() {
            generateDepartmentAnalysis();
        });
    }
    
    // 雷达图详情按钮
    const radarDetailBtn = document.getElementById('radarDetailBtn');
    if (radarDetailBtn) {
        radarDetailBtn.addEventListener('click', function() {
            showRadarDetail();
        });
    }
}

// 筛选绩效数据
function filterPerformanceData() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const categoryFilter = document.getElementById('categoryFilter')?.value || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    
    performanceData = mockPerformanceData.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || item.category === categoryFilter;
        const matchesStatus = !statusFilter || item.status === statusFilter;
        
        return matchesSearch && matchesCategory && matchesStatus;
    });
    
    currentPage = 1;
    renderPerformanceTable();
}

// 显示指标详情
function showIndicatorDetail(indicatorId) {
    const modal = document.getElementById('indicatorModal');
    const modalTitle = document.getElementById('modalTitle');
    const indicatorSuggestions = document.getElementById('indicatorSuggestions');
    
    if (!modal) return;
    
    // 查找指标数据
    const indicator = mockPerformanceData.find(item => item.id == indicatorId);
    if (!indicator) return;
    
    // 设置标题
    if (modalTitle) {
        modalTitle.textContent = `${indicator.name} - 详细分析`;
    }
    
    // 生成分析建议
    if (indicatorSuggestions) {
        const suggestions = generateIndicatorSuggestions(indicator);
        indicatorSuggestions.innerHTML = suggestions;
    }
    
    // 初始化详情图表
    initIndicatorDetailChart(indicator);
    
    // 显示弹窗
    modal.style.display = 'block';
}

// 关闭指标详情弹窗
function closeIndicatorModal() {
    const modal = document.getElementById('indicatorModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 初始化指标详情图表
function initIndicatorDetailChart(indicator) {
    const chartDom = document.getElementById('indicatorDetailChart');
    if (!chartDom) return;
    
    const myChart = echarts.init(chartDom);
    
    // 模拟月度趋势数据
    const monthlyData = generateMonthlyTrendData(indicator);
    
    const option = {
        title: {
            text: `${indicator.name} - 月度趋势`,
            left: 'center'
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            name: indicator.name,
            type: 'line',
            data: monthlyData,
            smooth: true,
            lineStyle: {
                color: '#165dff'
            },
            areaStyle: {
                color: 'rgba(22, 93, 255, 0.1)'
            }
        }]
    };
    
    myChart.setOption(option);
    
    // 响应式处理
    setTimeout(() => {
        myChart.resize();
    }, 100);
}

// 生成月度趋势数据
function generateMonthlyTrendData(indicator) {
    const baseValue = parseFloat(indicator.currentValue);
    const data = [];
    
    for (let i = 0; i < 12; i++) {
        const variation = (Math.random() - 0.5) * 0.2; // ±10%的变化
        data.push((baseValue * (1 + variation)).toFixed(1));
    }
    
    return data;
}

// 生成指标分析建议
function generateIndicatorSuggestions(indicator) {
    const suggestions = {
        '平均住院日': `
            <div class="suggestion-item">
                <h5>问题分析：</h5>
                <p>当前平均住院日为${indicator.currentValue}，超出目标值${indicator.targetValue}，主要原因可能包括：</p>
                <ul>
                    <li>临床路径执行不到位</li>
                    <li>出院标准把握不严格</li>
                    <li>床位周转效率有待提升</li>
                </ul>
            </div>
            <div class="suggestion-item">
                <h5>改进建议：</h5>
                <ul>
                    <li>加强临床路径管理，规范诊疗流程</li>
                    <li>建立出院评估机制，及时安排符合条件患者出院</li>
                    <li>优化床位配置，提高床位使用效率</li>
                    <li>加强医护协作，缩短非医疗等待时间</li>
                </ul>
            </div>
        `,
        '药占比': `
            <div class="suggestion-item">
                <h5>问题分析：</h5>
                <p>当前药占比为${indicator.currentValue}，略高于目标值${indicator.targetValue}，需要关注：</p>
                <ul>
                    <li>合理用药管理有待加强</li>
                    <li>药品结构需要优化</li>
                    <li>医疗服务收入占比相对较低</li>
                </ul>
            </div>
            <div class="suggestion-item">
                <h5>改进建议：</h5>
                <ul>
                    <li>加强合理用药监管，建立用药审核机制</li>
                    <li>推广临床药师服务，优化用药方案</li>
                    <li>提升医疗技术服务价值，增加技术性收入</li>
                    <li>完善药品采购管理，控制药品成本</li>
                </ul>
            </div>
        `
    };
    
    return suggestions[indicator.name] || `
        <div class="suggestion-item">
            <h5>当前状态：</h5>
            <p>该指标当前值为${indicator.currentValue}，目标值为${indicator.targetValue}，完成率为${indicator.completionRate}。</p>
        </div>
        <div class="suggestion-item">
            <h5>建议：</h5>
            <p>请根据具体情况制定针对性的改进措施，持续监控指标变化趋势。</p>
        </div>
    `;
}

// 显示报告生成弹窗
function showReportModal() {
    const modal = document.getElementById('reportModal');
    if (modal) {
        modal.style.display = 'block';
        
        // 绑定生成报告按钮事件
        const generateBtn = document.getElementById('generateReport');
        if (generateBtn) {
            generateBtn.onclick = function() {
                generatePerformanceReport();
            };
        }
    }
}

// 关闭报告生成弹窗
function closeReportModal() {
    const modal = document.getElementById('reportModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 生成绩效报告
function generatePerformanceReport() {
    const reportType = document.getElementById('reportType')?.value || 'comprehensive';
    const timeRange = document.getElementById('reportTimeRange')?.value || 'year';
    const format = document.getElementById('reportFormat')?.value || 'word';
    
    console.log('生成绩效报告', { reportType, timeRange, format });
    
    // 模拟报告生成过程
    showNotification('正在生成报告，请稍候...', 'info');
    
    setTimeout(() => {
        showNotification(`${format.toUpperCase()}格式的${getReportTypeName(reportType)}已生成完成`, 'success');
        closeReportModal();
        
        // 模拟下载
        const link = document.createElement('a');
        link.href = '#';
        link.download = `绩效报告_${new Date().toISOString().split('T')[0]}.${format}`;
        link.click();
    }, 2000);
}

// 获取报告类型名称
function getReportTypeName(type) {
    const typeMap = {
        'comprehensive': '综合绩效报告',
        'department': '科室绩效报告',
        'indicator': '专项指标报告',
        'trend': '趋势分析报告'
    };
    return typeMap[type] || type;
}

// 下载绩效表格
function downloadPerformanceTable() {
    console.log('下载绩效表格');
    
    // 创建CSV内容
    const headers = ['指标名称', '分类', '当前值', '目标值', '完成率', '同比变化', '状态', '权重', '得分'];
    const csvContent = [
        headers.join(','),
        ...performanceData.map(item => [
            item.name,
            getCategoryName(item.category),
            item.currentValue,
            item.targetValue,
            item.completionRate,
            item.yearOverYear,
            getStatusName(item.status),
            item.weight,
            item.score
        ].join(','))
    ].join('\n');
    
    // 创建下载链接
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `绩效指标数据_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    showNotification('表格数据已下载', 'success');
}

// 更新趋势图表
function updateTrendChart(timeRange) {
    console.log('更新趋势图表', timeRange);
    // 根据时间范围重新初始化图表
    initPerformanceTrendChart(timeRange);
}

// 更新科室图表
function updateDepartmentChart(department) {
    console.log('更新科室图表', department);
    // 这里可以根据选择的科室重新加载数据和更新图表
    initDepartmentPerformanceChart();
}

// 生成科室分析
function generateDepartmentAnalysis() {
    const selectedDepartment = document.getElementById('departmentSelect')?.value;
    console.log('生成科室分析', selectedDepartment);
    
    showNotification('正在生成科室分析报告...', 'info');
    
    setTimeout(() => {
        showNotification('科室分析报告已生成', 'success');
    }, 1500);
}

// 显示雷达图详情
function showRadarDetail() {
    console.log('显示雷达图详情');
    showNotification('雷达图详细说明已展开', 'info');
}

// 概览卡片动画
function animateOverviewCards() {
    const cards = document.querySelectorAll('.overview-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        }, index * 100);
    });
}

// 显示通知
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 6px;
        color: white;
        font-size: 14px;
        z-index: 10000;
        transition: all 0.3s ease;
        transform: translateX(100%);
    `;
    
    // 根据类型设置背景色
    const colors = {
        'success': '#00b42a',
        'error': '#f53f3f',
        'warning': '#ff7d00',
        'info': '#165dff'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 点击弹窗外部关闭弹窗
window.addEventListener('click', function(event) {
    const indicatorModal = document.getElementById('indicatorModal');
    const reportModal = document.getElementById('reportModal');
    
    if (event.target === indicatorModal) {
        closeIndicatorModal();
    }
    
    if (event.target === reportModal) {
        closeReportModal();
    }
});

// 导出函数供全局使用
window.initPerformanceManagement = initPerformanceManagement;
window.showIndicatorDetail = showIndicatorDetail;
window.closeIndicatorModal = closeIndicatorModal;
window.closeReportModal = closeReportModal;