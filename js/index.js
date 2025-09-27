// 首页数据和图表初始化
const IndexPage = {
    // 存储从JSON加载的数据
    data: null,
    
    // 从JSON加载数据
    loadData: function() {
        try {
            // 尝试使用XMLHttpRequest代替fetch，兼容性更好
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', 'data/index.json', true);
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200 || xhr.status === 0) { // status 0 for local file
                            try {
                                const data = JSON.parse(xhr.responseText);
                                this.data = data;
                                resolve(data);
                            } catch (e) {
                                console.error('Error parsing JSON:', e);
                                reject(e);
                            }
                        } else {
                            reject(new Error('Network response was not ok'));
                        }
                    }
                }.bind(this);
                xhr.send();
            }).catch(error => {
                console.error('Error loading data:', error);
                Common.showToast('数据加载失败，使用默认数据显示', 'warning');
                // 使用默认数据继续
                this.data = {
                    overview: {
                        totalPatient: 1256890,
                        monthlyVisit: 12580,
                        monthlyDischarge: 2856,
                        monthlyOperation: 1423,
                        avgLengthOfStay: 6.8,
                        bedOccupancyRate: 92.5,
                        medicalQualityScore: 96.8,
                        patientSatisfaction: 94.2,
                        totalRevenue: 2865.3,
                        staffCount: 2450,
                        bedCount: 1850,
                        equipmentCount: 1280
                    },
                    businessTrend: {
                        months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                        outpatient: [10250, 9800, 11500, 12100, 11800, 12300, 13500, 14200, 13800, 12500, 12800, 12580],
                        inpatient: [2100, 1980, 2350, 2500, 2680, 2750, 2900, 2880, 2750, 2680, 2800, 2856],
                        operation: [1100, 1050, 1200, 1280, 1350, 1420, 1480, 1520, 1490, 1450, 1430, 1423]
                    },
                    revenueStructure: {
                        categories: ['医疗服务收入', '药品收入', '检查收入', '手术收入', '其他收入'],
                        data: [
                            {"value": 1250, "name": "医疗服务收入", "color": "#0066cc"},
                            {"value": 870, "name": "药品收入", "color": "#1890ff"},
                            {"value": 420, "name": "检查收入", "color": "#52c41a"},
                            {"value": 280, "name": "手术收入", "color": "#faad14"},
                            {"value": 45.3, "name": "其他收入", "color": "#8c8c8c"}
                        ]
                    },
                    warningMessages: [
                        {
                            "id": "1",
                            "title": "挂号系统访问量异常增长",
                            "description": "今日挂号系统访问量较昨日增长35%，可能存在异常访问",
                            "level": "warning",
                            "time": "10分钟前",
                            "department": "信息中心"
                        }
                    ],
                    // 添加患者年龄分布数据
                    patientLevel: {
                        ageDistribution: [
                            {"name": "0-18岁", "value": 15},
                            {"name": "19-35岁", "value": 25},
                            {"name": "36-50岁", "value": 30},
                            {"name": "51-65岁", "value": 20},
                            {"name": "66岁以上", "value": 10}
                        ],
                        returnVisitRate: 65.2,
                        readmissionRate: 8.5,
                        avgWaitingTime: { doctor: 15 }
                    },
                    // 添加手术类型分布数据
                    surgeryLevel: {
                        typeDistribution: [
                            {"name": "普外科手术", "value": 35},
                            {"name": "骨科手术", "value": 25},
                            {"name": "妇产科手术", "value": 15},
                            {"name": "神经外科手术", "value": 10},
                            {"name": "心脏手术", "value": 8},
                            {"name": "其他手术", "value": 7}
                        ],
                        successRate: 98.5,
                        complicationRate: 1.2,
                        avgRecoveryTime: 7
                    },
                    // 添加资源分布数据
                    resourceLevel: {
                        departmentDistribution: [
                            {"department": "内科", "staffCount": 350, "bedCount": 320},
                            {"department": "外科", "staffCount": 320, "bedCount": 280},
                            {"department": "妇产科", "staffCount": 220, "bedCount": 180},
                            {"department": "儿科", "staffCount": 200, "bedCount": 160},
                            {"department": "急诊科", "staffCount": 180, "bedCount": 80},
                            {"department": "ICU", "staffCount": 120, "bedCount": 40}
                        ],
                        operationRoomUsageRate: 85.6
                    },
                    // 添加设备分布数据
                    equipmentLevel: {
                        typeDistribution: [
                            {"name": "影像设备", "value": 220},
                            {"name": "手术设备", "value": 180},
                            {"name": "检验设备", "value": 250},
                            {"name": "监护设备", "value": 320},
                            {"name": "康复设备", "value": 120},
                            {"name": "其他设备", "value": 190}
                        ],
                        equipmentUsageRate: 78.5,
                        equipmentFailureRate: 1.2
                    }
                };
                return this.data;
            });
        } catch (e) {
            console.error('Error in loadData:', e);
            // 直接返回默认数据
            this.data = {
                overview: {
                    totalPatient: 1256890,
                    monthlyVisit: 12580,
                    monthlyDischarge: 2856,
                    monthlyOperation: 1423,
                    avgLengthOfStay: 6.8,
                    bedOccupancyRate: 92.5,
                    medicalQualityScore: 96.8,
                    patientSatisfaction: 94.2
                },
                businessTrend: {
                    months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                    outpatient: [10250, 9800, 11500, 12100, 11800, 12300, 13500, 14200, 13800, 12500, 12800, 12580],
                    inpatient: [2100, 1980, 2350, 2500, 2680, 2750, 2900, 2880, 2750, 2680, 2800, 2856],
                    operation: [1100, 1050, 1200, 1280, 1350, 1420, 1480, 1520, 1490, 1450, 1430, 1423]
                },
                revenueStructure: {
                    categories: ['医疗服务收入', '药品收入', '检查收入', '手术收入', '其他收入'],
                    data: [
                        {"value": 1250, "name": "医疗服务收入", "color": "#0066cc"},
                        {"value": 870, "name": "药品收入", "color": "#1890ff"},
                        {"value": 420, "name": "检查收入", "color": "#52c41a"},
                        {"value": 280, "name": "手术收入", "color": "#faad14"},
                        {"value": 45.3, "name": "其他收入", "color": "#8c8c8c"}
                    ]
                },
                warningMessages: [
                    {
                        "id": "1",
                        "title": "挂号系统访问量异常增长",
                        "description": "今日挂号系统访问量较昨日增长35%，可能存在异常访问",
                        "level": "warning",
                        "time": "10分钟前",
                        "department": "信息中心"
                    }
                ]
            };
            return Promise.resolve(this.data);
        }
    },

    // 初始化图表
    initCharts: function() {
        console.log('开始初始化所有图表...');
        
        // 检查数据是否存在
        if (!this.data) {
            console.warn('No data available for charts, using default data');
            this.data = {};
        }
        
        // 检查ECharts是否已加载
        if (typeof echarts === 'undefined') {
            console.error('ECharts库未加载，无法创建图表');
            return;
        }
        
        // 创建各图表 - 确保所有图表都会初始化，即使数据不存在也会使用默认数据
        try {
            this.createBusinessTrendChart();
            this.createRevenueStructureChart();
            this.createPatientDistributionChart();
            this.createSurgeryTypeChart();
            this.createResourceUsageChart();
            this.createEquipmentDistributionChart();
            this.createDepartmentDistributionChart();
            this.createWarningTrendChart();
            this.createPatientSeasonalChart();
            
            console.log('所有图表初始化完成');
        } catch (error) {
            console.error('初始化图表时发生错误:', error);
        }
    },

    // 初始化月度业务量趋势图表
    createBusinessTrendChart: function() {
        console.log('创建业务趋势图表...');
        
        const chartDom = document.getElementById('businessTrendChart');
        if (!chartDom) {
            console.error('找不到业务趋势图表容器 businessTrendChart');
            return;
        }
        
        // 检查businessTrend数据是否存在
        if (!this.data.businessTrend) {
            console.warn('业务趋势数据不可用，使用默认数据');
            this.data.businessTrend = {
                months: ['1月', '2月', '3月', '4月', '5月', '6月'],
                outpatient: [12000, 13200, 10100, 13400, 14000, 15000],
                inpatient: [2200, 2300, 2100, 2400, 2500, 2600],
                operation: [800, 850, 780, 900, 950, 1000]
            };
        }
        
        // 检查ECharts是否已加载
        if (typeof echarts === 'undefined') {
            console.error('ECharts库未加载，无法创建图表');
            return;
        }
        
        const myChart = echarts.init(chartDom);

        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                }
            },
            legend: {
                data: ['门急诊人次', '出院人次', '手术人次']
            },
            xAxis: {
                type: 'category',
                data: this.data.businessTrend.months,
                axisPointer: {
                    type: 'shadow'
                }
            },
            yAxis: [
                {
                    type: 'value',
                    name: '人次',
                    min: 0,
                    max: 15000,
                    interval: 3000,
                    axisLabel: {
                        formatter: '{value}'
                    }
                },
                {
                    type: 'value',
                    name: '手术人次',
                    min: 0,
                    max: 2000,
                    interval: 400,
                    axisLabel: {
                        formatter: '{value}'
                    }
                }
            ],
            series: [
                {
                    name: '门急诊人次',
                    type: 'bar',
                    data: this.data.businessTrend.outpatient,
                    itemStyle: {
                        color: '#0066cc'
                    }
                },
                {
                    name: '出院人次',
                    type: 'bar',
                    data: this.data.businessTrend.inpatient,
                    itemStyle: {
                        color: '#1890ff'
                    }
                },
                {
                    name: '手术人次',
                    type: 'line',
                    yAxisIndex: 1,
                    data: this.data.businessTrend.operation,
                    itemStyle: {
                        color: '#52c41a'
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
        console.log('业务趋势图表创建成功');

        // 窗口大小改变时重新调整图表大小
        window.addEventListener('resize', function() {
            myChart.resize();
        });
    },

    // 初始化收入结构分析图表
    createRevenueStructureChart: function() {
        console.log('创建收入结构图表...');
        
        const chartDom = document.getElementById('revenueStructureChart');
        if (!chartDom) {
            console.error('找不到收入结构图表容器');
            return;
        }
        
        // 检查revenueStructure数据是否存在
        if (!this.data.revenueStructure) {
            console.warn('收入结构数据不可用，使用默认数据');
            this.data.revenueStructure = {
                categories: ['药品收入', '检查收入', '治疗收入', '手术收入', '其他收入'],
                data: [
                    { value: 45, name: '药品收入' },
                    { value: 20, name: '检查收入' },
                    { value: 15, name: '治疗收入' },
                    { value: 15, name: '手术收入' },
                    { value: 5, name: '其他收入' }
                ]
            };
        }
        
        // 检查ECharts是否已加载
        if (typeof echarts === 'undefined') {
            console.error('ECharts库未加载，无法创建图表');
            return;
        }
        
        const myChart = echarts.init(chartDom);

        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c}万元 ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 10,
                data: this.data.revenueStructure.categories
            },
            series: [
                {
                    name: '收入结构',
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
                    data: this.data.revenueStructure.data
                }
            ]
        };

        myChart.setOption(option);
        console.log('收入结构图表创建成功');

        // 窗口大小改变时重新调整图表大小
        window.addEventListener('resize', function() {
            myChart.resize();
        });
    },
    
    // 创建患者分布图表
    createPatientDistributionChart: function() {
        console.log('创建患者分布图表...');
        
        const chartDom = document.getElementById('patientDistributionChart');
        if (!chartDom) {
            console.error('找不到患者分布图表容器');
            return;
        }
        
        // 检查patientLevel和ageDistribution是否存在
        if (!this.data.patientLevel || !this.data.patientLevel.ageDistribution) {
            console.warn('患者年龄分布数据不可用，使用默认数据');
            this.data.patientLevel = this.data.patientLevel || {};
            this.data.patientLevel.ageDistribution = [
                { ageGroup: '0-18岁', percentage: 15 },
                { ageGroup: '19-35岁', percentage: 30 },
                { ageGroup: '36-50岁', percentage: 25 },
                { ageGroup: '51-65岁', percentage: 20 },
                { ageGroup: '65岁以上', percentage: 10 }
            ];
        }
        
        // 检查ECharts是否已加载
        if (typeof echarts === 'undefined') {
            console.error('ECharts库未加载，无法创建图表');
            return;
        }
        
        const myChart = echarts.init(chartDom);
        
        // 转换数据结构以匹配图表需求
        const ageData = this.data.patientLevel.ageDistribution.map(item => ({
            name: item.ageGroup,
            value: item.percentage
        }));
        
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c}%'
            },
            legend: {
                orient: 'horizontal',
                bottom: '0%',
                data: this.data.patientLevel.ageDistribution.map(item => item.ageGroup)
            },
            series: [
                {
                    name: '年龄分布',
                    type: 'pie',
                    radius: '65%',
                    center: ['50%', '45%'],
                    data: ageData,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    label: {
                        formatter: '{b}: {c}%'
                    }
                }
            ]
        };
        
        myChart.setOption(option);
        console.log('患者分布图表创建成功');
        
        // 窗口大小改变时重新调整图表大小
        window.addEventListener('resize', function() {
            myChart.resize();
        });
    },
    
    // 创建手术类型分布图表
    createSurgeryTypeChart: function() {
        console.log('创建手术类型分布图表...');
        
        const chartDom = document.getElementById('surgeryTypeChart');
        if (!chartDom) {
            console.error('找不到手术类型分布图表容器');
            return;
        }
        
        // 检查surgeryLevel和surgeryTypeDistribution是否存在
        if (!this.data.surgeryLevel || !this.data.surgeryLevel.surgeryTypeDistribution) {
            console.warn('手术类型分布数据不可用，使用默认数据');
            this.data.surgeryLevel = this.data.surgeryLevel || {};
            this.data.surgeryLevel.surgeryTypeDistribution = [
                { type: '普通手术', percentage: 35 },
                { type: '微创手术', percentage: 25 },
                { type: '急诊手术', percentage: 15 },
                { type: '择期手术', percentage: 20 },
                { type: '其他', percentage: 5 }
            ];
        }
        
        // 检查ECharts是否已加载
        if (typeof echarts === 'undefined') {
            console.error('ECharts库未加载，无法创建图表');
            return;
        }
        
        const myChart = echarts.init(chartDom);
        
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value}%'
                }
            },
            yAxis: {
                type: 'category',
                data: this.data.surgeryLevel.surgeryTypeDistribution.map(item => item.type)
            },
            series: [
                {
                    name: '手术类型分布',
                    type: 'bar',
                    data: this.data.surgeryLevel.surgeryTypeDistribution.map(item => item.percentage),
                    itemStyle: {
                        color: function(params) {
                            const colorList = ['#0066cc', '#52c41a', '#faad14', '#ff4d4f', '#722ed1', '#13c2c2'];
                            return colorList[params.dataIndex % colorList.length];
                        }
                    },
                    label: {
                        show: true,
                        position: 'right',
                        formatter: '{c}%'
                    }
                }
            ]
        };
        
        myChart.setOption(option);
        console.log('手术类型分布图表创建成功');
        
        // 窗口大小改变时重新调整图表大小
        window.addEventListener('resize', function() {
            myChart.resize();
        });
    },
    
    // 创建资源利用图表
    createResourceUsageChart: function() {
        console.log('创建资源利用图表...');
        
        const chartDom = document.getElementById('resourceUsageChart');
        if (!chartDom) {
            console.error('找不到资源利用图表容器');
            return;
        }
        
        // 检查resourceLevel、staffDistribution和bedDistribution是否存在
        if (!this.data.resourceLevel || !this.data.resourceLevel.staffDistribution || !this.data.resourceLevel.bedDistribution) {
            console.warn('资源利用数据不可用，使用默认数据');
            this.data.resourceLevel = this.data.resourceLevel || {};
            this.data.resourceLevel.staffDistribution = [
                { department: '内科', count: 45 },
                { department: '外科', count: 38 },
                { department: '儿科', count: 22 },
                { department: '妇产科', count: 28 },
                { department: '急诊科', count: 32 }
            ];
            this.data.resourceLevel.bedDistribution = [
                { department: '内科', beds: 120 },
                { department: '外科', beds: 85 },
                { department: '儿科', beds: 45 },
                { department: '妇产科', beds: 60 },
                { department: '急诊科', beds: 30 }
            ];
        }
        
        // 检查ECharts是否已加载
        if (typeof echarts === 'undefined') {
            console.error('ECharts库未加载，无法创建图表');
            return;
        }
        
        const myChart = echarts.init(chartDom);
        
        // 获取所有部门名称（合并staffDistribution和bedDistribution中的部门）
        const allDepartments = new Set();
        this.data.resourceLevel.staffDistribution.forEach(item => allDepartments.add(item.department));
        this.data.resourceLevel.bedDistribution.forEach(item => allDepartments.add(item.department));
        const departments = Array.from(allDepartments);
        
        // 创建映射，用于快速查找每个部门的人员配置和床位数量
        const staffMap = new Map(this.data.resourceLevel.staffDistribution.map(item => [item.department, item.count]));
        const bedMap = new Map(this.data.resourceLevel.bedDistribution.map(item => [item.department, item.beds]));
        
        // 准备图表数据
        const staffData = departments.map(dept => staffMap.get(dept) || 0);
        const bedData = departments.map(dept => bedMap.get(dept) || 0);
        
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['人员配置', '床位数量']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: departments
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value}'
                }
            },
            series: [
                {
                    name: '人员配置',
                    type: 'bar',
                    data: staffData,
                    itemStyle: {
                        color: '#0066cc'
                    }
                },
                {
                    name: '床位数量',
                    type: 'bar',
                    data: bedData,
                    itemStyle: {
                        color: '#52c41a'
                    }
                }
            ]
        };
        
        myChart.setOption(option);
        console.log('资源利用图表创建成功');
        
        // 窗口大小改变时重新调整图表大小
        window.addEventListener('resize', function() {
            myChart.resize();
        });
    },
    
    // 创建设备分布图表
    createEquipmentDistributionChart: function() {
        console.log('创建设备分布图表...');
        
        const chartDom = document.getElementById('equipmentDistributionChart');
        if (!chartDom) {
            console.error('找不到设备分布图表容器');
            return;
        }
        
        // 检查equipmentLevel和equipmentTypeDistribution是否存在
        if (!this.data.equipmentLevel || !this.data.equipmentLevel.equipmentTypeDistribution) {
            console.warn('设备分布数据不可用，使用默认数据');
            this.data.equipmentLevel = this.data.equipmentLevel || {};
            this.data.equipmentLevel.equipmentTypeDistribution = [
                { type: '影像设备', count: 25 },
                { type: '监护设备', count: 40 },
                { type: '手术设备', count: 15 },
                { type: '检验设备', count: 30 },
                { type: '治疗设备', count: 20 }
            ];
        }
        
        // 检查ECharts是否已加载
        if (typeof echarts === 'undefined') {
            console.error('ECharts库未加载，无法创建图表');
            return;
        }
        
        const myChart = echarts.init(chartDom);
        
        // 转换数据结构以匹配图表需求
        const equipmentData = this.data.equipmentLevel.equipmentTypeDistribution.map(item => ({
            name: item.type,
            value: item.count
        }));
        
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c}台 ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: this.data.equipmentLevel.equipmentTypeDistribution.map(item => item.type)
            },
            series: [
                {
                    name: '设备类型分布',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    data: equipmentData,
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
        
        myChart.setOption(option);
        console.log('设备分布图表创建成功');
        
        // 窗口大小改变时重新调整图表大小
        window.addEventListener('resize', function() {
            myChart.resize();
        });
    },
    
    // 创建科室分布图表
    createDepartmentDistributionChart: function() {
        console.log('创建科室分布图表...');
        
        const chartDom = document.getElementById('departmentDistributionChart');
        if (!chartDom) {
            console.error('找不到科室分布图表容器');
            return;
        }
        
        // 检查departmentLevel数据是否存在
        if (!this.data.departmentLevel) {
            console.warn('科室分布数据不可用，使用默认数据');
            this.data.departmentLevel = [
                { name: '内科', value: 25 },
                { name: '外科', value: 20 },
                { name: '儿科', value: 15 },
                { name: '妇产科', value: 12 },
                { name: '急诊科', value: 10 },
                { name: '其他', value: 18 }
            ];
        }
        
        // 检查ECharts是否已加载
        if (typeof echarts === 'undefined') {
            console.error('ECharts库未加载，无法创建图表');
            return;
        }
        
        const myChart = echarts.init(chartDom);
        
        // 转换数据结构以匹配图表需求
        const departmentData = this.data.departmentLevel.map(item => ({
            name: item.name,
            value: item.value
        }));
        
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: this.data.departmentLevel.map(item => item.name)
            },
            series: [
                {
                    name: '科室分布',
                    type: 'pie',
                    radius: '50%',
                    center: ['50%', '50%'],
                    data: departmentData,
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
        
        myChart.setOption(option);
        console.log('科室分布图表创建成功');
        
        // 窗口大小改变时重新调整图表大小
        window.addEventListener('resize', function() {
            myChart.resize();
        });
    },
    
    // 创建预警趋势图表
    createWarningTrendChart: function() {
        console.log('创建预警趋势图表...');
        
        const chartDom = document.getElementById('warningTrendChart');
        if (!chartDom) {
            console.error('找不到预警趋势图表容器');
            return;
        }
        
        // 检查warningLevel数据是否存在
        if (!this.data.warningLevel) {
            console.warn('预警趋势数据不可用，使用默认数据');
            this.data.warningLevel = {
                months: ['1月', '2月', '3月', '4月', '5月', '6月'],
                warningCount: [25, 30, 28, 35, 32, 40],
                processedCount: [20, 28, 25, 32, 30, 38]
            };
        }
        
        // 检查ECharts是否已加载
        if (typeof echarts === 'undefined') {
            console.error('ECharts库未加载，无法创建图表');
            return;
        }
        
        const myChart = echarts.init(chartDom);
        
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                }
            },
            legend: {
                data: ['预警次数', '处理次数']
            },
            xAxis: {
                type: 'category',
                data: this.data.warningLevel.months || ['1月', '2月', '3月', '4月', '5月', '6月'],
                axisPointer: {
                    type: 'shadow'
                }
            },
            yAxis: [
                {
                    type: 'value',
                    name: '次数',
                    min: 0,
                    interval: 10,
                    axisLabel: {
                        formatter: '{value}'
                    }
                }
            ],
            series: [
                {
                    name: '预警次数',
                    type: 'bar',
                    data: this.data.warningLevel.warningCount || [25, 30, 28, 35, 32, 40],
                    itemStyle: {
                        color: '#ff4d4f'
                    }
                },
                {
                    name: '处理次数',
                    type: 'line',
                    data: this.data.warningLevel.processedCount || [20, 28, 25, 32, 30, 38],
                    itemStyle: {
                        color: '#52c41a'
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
        console.log('预警趋势图表创建成功');
        
        // 窗口大小改变时重新调整图表大小
        window.addEventListener('resize', function() {
            myChart.resize();
        });
    },
    
    // 创建患者季节性趋势图表
    createPatientSeasonalChart: function() {
        console.log('创建患者季节性趋势图表...');
        
        const chartDom = document.getElementById('patientSeasonalChart');
        if (!chartDom) {
            console.error('找不到患者季节性趋势图表容器');
            return;
        }
        
        // 检查patientLevel和seasonalTrend数据是否存在
        if (!this.data.patientLevel || !this.data.patientLevel.seasonalTrend) {
            console.warn('患者季节性趋势数据不可用，使用默认数据');
            this.data.patientLevel = this.data.patientLevel || {};
            this.data.patientLevel.seasonalTrend = {
                months: ['春季', '夏季', '秋季', '冬季'],
                outpatient: [35000, 38000, 36000, 34000],
                inpatient: [8000, 8500, 8200, 7800]
            };
        }
        
        // 检查ECharts是否已加载
        if (typeof echarts === 'undefined') {
            console.error('ECharts库未加载，无法创建图表');
            return;
        }
        
        const myChart = echarts.init(chartDom);
        
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                }
            },
            legend: {
                data: ['门急诊人次', '出院人次']
            },
            xAxis: {
                type: 'category',
                data: this.data.patientLevel.seasonalTrend.months || ['春季', '夏季', '秋季', '冬季'],
                axisPointer: {
                    type: 'shadow'
                }
            },
            yAxis: [
                {
                    type: 'value',
                    name: '人次',
                    min: 0,
                    interval: 5000,
                    axisLabel: {
                        formatter: '{value}'
                    }
                }
            ],
            series: [
                {
                    name: '门急诊人次',
                    type: 'bar',
                    data: this.data.patientLevel.seasonalTrend.outpatient || [35000, 38000, 36000, 34000],
                    itemStyle: {
                        color: '#0066cc'
                    }
                },
                {
                    name: '出院人次',
                    type: 'line',
                    data: this.data.patientLevel.seasonalTrend.inpatient || [8000, 8500, 8200, 7800],
                    itemStyle: {
                        color: '#1890ff'
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
        console.log('患者季节性趋势图表创建成功');
        
        // 窗口大小改变时重新调整图表大小
        window.addEventListener('resize', function() {
            myChart.resize();
        });
    },

    // 初始化预警信息
    initWarningMessages: function() {
        console.log('初始化预警信息...');
        
        const warningList = document.getElementById('warningList');
        const lastUpdateTime = document.getElementById('lastUpdateTime');
        const warningSection = document.querySelector('.warning-section');
        
        if (!warningList || !lastUpdateTime) {
            console.error('找不到预警列表或更新时间元素');
            return;
        }
        
        if (!warningSection) {
            console.error('找不到预警区域');
            return;
        }
        
        // 清空现有内容
        warningList.innerHTML = '';
        
        // 使用默认数据或从data中获取预警信息
        const warningMessages = this.data.warningMessages || [
            {
                "id": "1",
                "title": "挂号系统访问量异常增长",
                "description": "今日挂号系统访问量较昨日增长35%，可能存在异常访问",
                "level": "warning",
                "time": "10分钟前",
                "department": "信息中心"
            },
            {
                "id": "2",
                "title": "急诊科患者等待时间过长",
                "description": "急诊科患者等待时间超过60分钟，已达警戒值",
                "level": "critical",
                "time": "5分钟前",
                "department": "急诊科"
            },
            {
                "id": "3",
                "title": "内科三区床位使用率超标",
                "description": "内科三区床位使用率超过100%，建议增加临时床位",
                "level": "critical",
                "time": "15分钟前",
                "department": "内科"
            },
            {
                "id": "4",
                "title": "手术间延迟提醒",
                "description": "手术间3首台手术延迟超过30分钟",
                "level": "warning",
                "time": "25分钟前",
                "department": "手术室"
            },
            {
                "id": "5",
                "title": "检验科工作表现",
                "description": "检验科危急值处理及时率100%",
                "level": "normal",
                "time": "1小时前",
                "department": "检验科"
            }
        ];
        
        // 渲染预警信息
        warningMessages.forEach(message => {
            const warningItem = this.createWarningItem(message);
            warningList.appendChild(warningItem);
        });
        
        // 更新最后更新时间
        this.updateLastUpdateTime();
        
        // 启用预警区域拖动功能
        this.makeWarningSectionDraggable(warningSection);
        
        console.log('预警信息初始化完成，已启用拖动和滚动功能');
    },
    
    // 创建预警信息项
    createWarningItem: function(message) {
        const warningItem = document.createElement('div');
        
        // 设置样式类
        let levelClass = 'normal';
        if (message.level === 'critical') levelClass = 'critical';
        if (message.level === 'warning') levelClass = 'warning';
        
        warningItem.className = `warning-item ${levelClass}`;
        
        // 设置图标
        let icon = 'ℹ️';
        if (message.level === 'critical') icon = '⚠️';
        if (message.level === 'warning') icon = '⚠️';
        
        warningItem.innerHTML = `
            <span class="warning-icon">${icon}</span>
            <div class="warning-content">
                <div class="warning-title">${message.title}</div>
                <div class="warning-description">${message.description}</div>
                <div class="warning-meta">
                    <span class="warning-department">${message.department}</span>
                    <span class="warning-time">${message.time}</span>
                </div>
            </div>
        `;
        
        return warningItem;
    },
    
    // 更新最后更新时间
    updateLastUpdateTime: function() {
        const lastUpdateTime = document.getElementById('lastUpdateTime');
        if (!lastUpdateTime) return;
        
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        
        lastUpdateTime.textContent = `最后更新: ${hours}:${minutes}:${seconds}`;
    },
    
    // 模拟数据更新
    simulateDataUpdate: function() {
        // 更新预警信息时间戳
        setInterval(() => {
            const warningTimes = document.querySelectorAll('.warning-time');
            warningTimes.forEach(time => {
                const originalTime = time.textContent;
                if (originalTime.includes('分钟前')) {
                    const minutes = parseInt(originalTime);
                    time.textContent = (minutes + 1) + '分钟前';
                } else if (originalTime.includes('小时前')) {
                    const hours = parseInt(originalTime);
                    time.textContent = (hours + 1) + '小时前';
                }
            });
        }, 60000);
        
        // 每2秒更新最后更新时间
        setInterval(() => {
            this.updateLastUpdateTime();
        }, 2000);
        
        // 每8秒随机添加或删除一条预警信息
        setInterval(() => {
            this.randomUpdateWarning();
        }, 8000);
        
        // 每30秒更新概览卡片数据
        setInterval(() => {
            this.updateOverviewData();
        }, 30000);
    },
    
    // 更新概览数据函数
    updateOverviewData: function() {
        // 随机更新部分概览数据
        const overviewCards = document.querySelectorAll('.overview-card .card-value');
        
        if (overviewCards.length > 0) {
            // 随机选择1-3个卡片进行更新
            const updateCount = Math.floor(Math.random() * 3) + 1;
            const indicesToUpdate = [];
            
            while (indicesToUpdate.length < updateCount) {
                const randomIndex = Math.floor(Math.random() * overviewCards.length);
                if (!indicesToUpdate.includes(randomIndex)) {
                    indicesToUpdate.push(randomIndex);
                }
            }
            
            indicesToUpdate.forEach(index => {
                const card = overviewCards[index];
                const currentValue = parseInt(card.textContent.replace(/[^\d]/g, ''));
                
                // 根据不同类型的数据进行不同的变化
                let newValue;
                if (index === 0) { // 在院患者数
                    newValue = currentValue + Math.floor(Math.random() * 21) - 10; // ±10
                    newValue = Math.max(0, newValue);
                } else if (index === 1) { // 今日门诊
                    newValue = currentValue + Math.floor(Math.random() * 101) - 50; // ±50
                    newValue = Math.max(0, newValue);
                } else if (index === 2) { // 今日手术
                    newValue = currentValue + Math.floor(Math.random() * 7) - 3; // ±3
                    newValue = Math.max(0, newValue);
                } else if (index === 3) { // 床位使用率
                    const currentPercent = parseFloat(card.textContent.replace('%', ''));
                    const change = (Math.random() * 6) - 3; // ±3%
                    newValue = Math.min(100, Math.max(0, currentPercent + change));
                    card.textContent = newValue.toFixed(1) + '%';
                    return;
                } else {
                    // 其他数据类型的通用更新逻辑
                    const changePercent = (Math.random() * 0.1) - 0.05; // ±5%
                    newValue = Math.round(currentValue * (1 + changePercent));
                    newValue = Math.max(0, newValue);
                }
                
                // 添加数字变化动画效果
                card.style.transform = 'scale(1.1)';
                card.style.color = '#00d4aa';
                
                setTimeout(() => {
                    if (index === 3) return; // 百分比已经在上面处理了
                    
                    // 格式化数字显示
                    if (newValue >= 1000) {
                        card.textContent = (newValue / 1000).toFixed(1) + 'k';
                    } else {
                        card.textContent = newValue.toString();
                    }
                    
                    setTimeout(() => {
                        card.style.transform = 'scale(1)';
                        card.style.color = '';
                    }, 300);
                }, 100);
            });
        }
    },
    
    // 随机更新预警信息
    randomUpdateWarning: function() {
        const warningList = document.getElementById('warningList');
        if (!warningList) return;
        
        const action = Math.random() > 0.5 ? 'add' : 'remove';
        
        if (action === 'add' && warningList.children.length < 8) {
            // 添加新预警信息 - 丰富预警内容
            const newWarnings = [
                {
                    "id": Date.now().toString(),
                    "title": "药品库存不足",
                    "description": "常用药品阿莫西林库存仅剩余20%，请及时补货",
                    "level": "warning",
                    "time": "刚刚",
                    "department": "药房"
                },
                {
                    "id": Date.now().toString(),
                    "title": "设备维护提醒",
                    "description": "CT设备#CT-003需要进行例行维护",
                    "level": "normal",
                    "time": "刚刚",
                    "department": "医学工程科"
                },
                {
                    "id": Date.now().toString(),
                    "title": "网络异常流量",
                    "description": "内网发现异常流量，可能存在网络攻击",
                    "level": "critical",
                    "time": "刚刚",
                    "department": "信息中心"
                },
                {
                    "id": Date.now().toString(),
                    "title": "ICU床位使用率超标",
                    "description": "ICU床位使用率达到98%，建议调整患者分配",
                    "level": "critical",
                    "time": "刚刚",
                    "department": "重症医学科"
                },
                {
                    "id": Date.now().toString(),
                    "title": "检验科设备故障",
                    "description": "生化分析仪#BC-002出现故障，预计维修时间2小时",
                    "level": "warning",
                    "time": "刚刚",
                    "department": "检验科"
                },
                {
                    "id": Date.now().toString(),
                    "title": "医生排班异常",
                    "description": "内科三区明日值班医生不足，需要紧急调配",
                    "level": "warning",
                    "time": "刚刚",
                    "department": "人事科"
                },
                {
                    "id": Date.now().toString(),
                    "title": "患者满意度提升",
                    "description": "本月患者满意度达到96.5%，较上月提升2.3%",
                    "level": "normal",
                    "time": "刚刚",
                    "department": "质控科"
                },
                {
                    "id": Date.now().toString(),
                    "title": "手术室排期冲突",
                    "description": "明日3号手术室存在排期冲突，需要重新安排",
                    "level": "warning",
                    "time": "刚刚",
                    "department": "手术室"
                },
                {
                    "id": Date.now().toString(),
                    "title": "医保结算异常",
                    "description": "发现3例医保结算异常，需要人工审核",
                    "level": "critical",
                    "time": "刚刚",
                    "department": "医保办"
                },
                {
                    "id": Date.now().toString(),
                    "title": "医疗废物处理",
                    "description": "本周医疗废物处理及时率达到100%",
                    "level": "normal",
                    "time": "刚刚",
                    "department": "院感科"
                }
            ];
            
            const randomWarning = newWarnings[Math.floor(Math.random() * newWarnings.length)];
            const warningItem = this.createWarningItem(randomWarning);
            warningList.appendChild(warningItem);
            
            // 添加动画效果
            warningItem.style.opacity = '0';
            warningItem.style.transform = 'translateY(10px)';
            warningItem.style.transition = 'opacity 0.3s, transform 0.3s';
            
            setTimeout(() => {
                warningItem.style.opacity = '1';
                warningItem.style.transform = 'translateY(0)';
            }, 10);
        } else if (action === 'remove' && warningList.children.length > 1) {
            // 随机移除一条预警信息
            const randomIndex = Math.floor(Math.random() * warningList.children.length);
            const warningToRemove = warningList.children[randomIndex];
            
            // 添加退出动画
            warningToRemove.style.opacity = '0';
            warningToRemove.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                if (warningToRemove.parentNode) {
                    warningToRemove.parentNode.removeChild(warningToRemove);
                }
            }, 300);
        }
    },
    
    // 禁用预警区域拖动功能，确保预警信息完整显示
    makeWarningSectionDraggable: function(element) {
        if (!element) {
            console.warn('预警区域元素不存在，无法初始化');
            return;
        }
        
        // 检查是否已经应用了设置
        if (element.dataset.draggable === 'false') {
            console.log('预警区域已设置，跳过重复初始化');
            return;
        }
        
        // 标记元素已应用设置
        element.dataset.draggable = 'false';
        console.log('禁用预警区域拖动功能，确保预警信息完整显示');
        
        // 设置元素样式为固定位置，不启用拖动
        element.style.position = 'relative';
        element.style.zIndex = '10';
        element.style.cursor = 'default';
        element.style.overflow = 'visible';
        
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .warning-section {
                overflow-y: auto !important;
                max-height: calc(100vh - 120px);
                cursor: default;
                position: relative;
            }
            
            .warning-section .section-title {
                cursor: default;
            }
            
            .warning-section .warning-list {
                cursor: default;
                max-height: calc(100vh - 180px);
                overflow-y: auto;
            }
            
            .warning-section .warning-item {
                cursor: default;
                padding: 10px;
                margin-bottom: 8px;
                border-radius: 4px;
            }
            
            .warning-section::-webkit-scrollbar {
                width: 8px;
            }
            
            .warning-section::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
            }
            
            .warning-section::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.3);
                border-radius: 4px;
            }
            
            .warning-section::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.5);
            }
            
            .warning-list::-webkit-scrollbar {
                width: 6px;
            }
            
            .warning-list::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 3px;
            }
            
            .warning-list::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 3px;
            }
            
            .warning-list::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.4);
            }
        `;
        document.head.appendChild(style);
    },

    // 更新数据概览卡片
    updateOverviewCards: function() {
        if (!this.data || !this.data.overview) {
            console.warn('Overview data not available');
            return;
        }
        
        const overview = this.data.overview;
        
        // 更新数据概览卡片内容 - 匹配实际的HTML结构
        const cards = document.querySelectorAll('.overview-cards .card');
        const titles = ['门急诊人次', '出院人次', '手术人次', '医疗收入'];
        const values = [
            (overview.monthlyVisit || 0).toLocaleString(),
            (overview.monthlyDischarge || 0).toLocaleString(),
            (overview.monthlyOperation || 0).toLocaleString(),
            '¥' + (overview.totalRevenue || 0) + '万'
        ];
        
        // 确保我们有足够的卡片来显示数据
        if (cards && cards.length >= titles.length) {
            for (let i = 0; i < titles.length; i++) {
                const card = cards[i];
                if (card) {
                    const titleElement = card.querySelector('.card-title');
                    const valueElement = card.querySelector('.card-value');
                    
                    if (titleElement) titleElement.textContent = titles[i];
                    if (valueElement) valueElement.textContent = values[i];
                }
            }
        }
        
        // 添加更多关键指标卡片
        let additionalCards = document.querySelector('.additional-indicators');
        if (!additionalCards) {
            // 创建额外指标容器
            additionalCards = document.createElement('div');
            additionalCards.className = 'overview-cards additional-indicators';
            // margin-top 由 CSS 规则控制：.overview-cards.additional-indicators { margin-top: 16px; }
            
            // 添加到概览卡片容器后面
            const overviewCards = document.querySelector('.overview-cards');
            if (overviewCards) {
                overviewCards.parentNode.insertBefore(additionalCards, overviewCards.nextSibling);
            }
        }
        
        // 清空现有内容
        if (additionalCards) {
            additionalCards.innerHTML = '';
        }
        
        // 添加患者层面指标卡片
        if (this.data.patientLevel && additionalCards) {
            this.createIndicatorCard(additionalCards, '患者满意度', (overview.patientSatisfaction || 0) + '%', '正常', 'up', 2.5);
            if (this.data.patientLevel.avgWaitingTime && this.data.patientLevel.avgWaitingTime.doctor) {
                this.createIndicatorCard(additionalCards, '平均就诊等待时间', this.data.patientLevel.avgWaitingTime.doctor + '分钟', '正常', 'down', 3.8);
            }
            this.createIndicatorCard(additionalCards, '复诊率', (this.data.patientLevel.returnVisitRate || 0) + '%', '正常', 'up', 1.2);
            this.createIndicatorCard(additionalCards, '再入院率', (this.data.patientLevel.readmissionRate || 0) + '%', '正常', 'down', 0.5);
        }
        
        // 添加手术层面指标卡片
        if (this.data.surgeryLevel && additionalCards) {
            this.createIndicatorCard(additionalCards, '手术成功率', (this.data.surgeryLevel.successRate || 0) + '%', '优秀', 'up', 0.3);
            this.createIndicatorCard(additionalCards, '手术并发症率', (this.data.surgeryLevel.complicationRate || 0) + '%', '优秀', 'down', 0.2);
            this.createIndicatorCard(additionalCards, '平均术后恢复期', (this.data.surgeryLevel.avgRecoveryTime || 0) + '天', '正常', 'down', 1.2);
        }
        
        // 添加资源层面指标卡片
        if (this.data.resourceLevel && additionalCards) {
            this.createIndicatorCard(additionalCards, '员工总数', (overview.staffCount || 0) + '人', '正常', 'up', 5.2);
            this.createIndicatorCard(additionalCards, '床位数', (overview.bedCount || 0) + '张', '正常', 'up', 3.5);
            this.createIndicatorCard(additionalCards, '病床使用率', (overview.bedOccupancyRate || 0) + '%', '高负荷', 'up', 2.1);
            this.createIndicatorCard(additionalCards, '手术室使用率', (this.data.resourceLevel.operationRoomUsageRate || 0) + '%', '正常', 'up', 1.8);
        }
        
        // 添加设备层面指标卡片
        if (this.data.equipmentLevel && additionalCards) {
            this.createIndicatorCard(additionalCards, '设备总数', (overview.equipmentCount || 0) + '台', '正常', 'up', 4.7);
            this.createIndicatorCard(additionalCards, '设备使用率', (this.data.equipmentLevel.equipmentUsageRate || 0) + '%', '正常', 'up', 2.3);
            this.createIndicatorCard(additionalCards, '设备故障率', (this.data.equipmentLevel.equipmentFailureRate || 0) + '%', '低', 'down', 0.4);
        }
    },
    
    // 创建指标卡片
    createIndicatorCard: function(container, title, value, status, trend, changeRate) {
        const card = document.createElement('div');
        card.className = 'card';
        
        // 根据状态设置不同的样式
        let statusClass = 'normal';
        if (status === '高负荷' || status === '警告') statusClass = 'warning';
        if (status === '优秀' || status === '低') statusClass = 'success';
        
        card.innerHTML = `
            <div class="card-title">${title}</div>
            <div class="card-value">${value}</div>
            <div class="card-trend">
                <span class="${trend}">${trend === 'up' ? '+' : ''}${changeRate}%</span>
                <span>较上月</span>
            </div>
            <div class="card-status ${statusClass}">${status}</div>
        `;
        
        container.appendChild(card);
    },

    // 初始化页面
    init: function() {
        try {
            Common.showLoading();
            
            this.loadData()
                .then(() => {
                    Common.hideLoading();
                    this.updateOverviewCards();
                    this.initCharts();
                    this.initWarningMessages();  // 初始化预警信息
                    this.simulateDataUpdate();   // 启动数据模拟更新
                })
                .catch((error) => {
                    Common.hideLoading();
                    console.error('Failed to initialize page:', error);
                    Common.showToast('页面初始化失败，请刷新重试', 'error');
                });
        } catch (error) {
            console.error('Critical error in init:', error);
            Common.hideLoading();
            Common.showToast('系统发生严重错误', 'error');
        }
    }
};

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', function() {
    console.log('DOM内容已加载，开始初始化页面...');
    
    // 等待一小段时间确保所有脚本都已加载完成
    setTimeout(() => {
        // 检查ECharts是否已加载
        if (typeof echarts === 'undefined') {
            console.error('ECharts库未加载');
            return;
        }
        
        console.log('ECharts库已加载，初始化页面...');
        IndexPage.init();
    }, 200);
});