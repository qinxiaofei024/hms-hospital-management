// 经济效益分析页面JavaScript
class EconomicBenefitPage {
    constructor() {
        this.currentTab = 'overall';
        this.currentTimeRange = 'year';
        this.charts = {};
        this.debugMode = true; // 开启调试模式
        this.init();
    }

    // 调试日志函数
    log(message) {
        if (this.debugMode && console && console.log) {
            console.log(`[EconomicBenefit] ${message}`);
        }
    }
    
    // 创建测试图表
    createTestChart() {
        this.log('创建测试图表');
        
        try {
            // 在页面顶部添加一个测试图表容器
            const testChartContainer = document.createElement('div');
            testChartContainer.id = 'test-visible-chart';
            testChartContainer.style.width = '100%';
            testChartContainer.style.height = '200px';
            testChartContainer.style.backgroundColor = '#f0f0f0';
            testChartContainer.style.border = '2px solid #ff9900';
            testChartContainer.style.marginBottom = '20px';
            testChartContainer.style.padding = '10px';
            
            // 添加标题
            const testChartTitle = document.createElement('div');
            testChartTitle.textContent = 'ECharts 测试图表 (如果能看到此图表，表示ECharts正常工作)';
            testChartTitle.style.textAlign = 'center';
            testChartTitle.style.marginBottom = '10px';
            testChartTitle.style.fontWeight = 'bold';
            testChartContainer.appendChild(testChartTitle);
            
            // 添加图表内容容器
            const chartContent = document.createElement('div');
            chartContent.id = 'test-chart-content';
            chartContent.style.width = '100%';
            chartContent.style.height = '150px';
            testChartContainer.appendChild(chartContent);
            
            // 将容器插入到页面顶部
            const container = document.querySelector('.container');
            if (container && container.parentNode) {
                container.parentNode.insertBefore(testChartContainer, container);
            }
            
            this.log('测试图表容器已添加到页面');
            
            // 检查ECharts是否可用
            if (typeof echarts === 'undefined') {
                this.log('错误：ECharts未定义');
                chartContent.textContent = '错误：ECharts库未加载成功！';
                chartContent.style.display = 'flex';
                chartContent.style.alignItems = 'center';
                chartContent.style.justifyContent = 'center';
                chartContent.style.color = 'red';
                return;
            }
            
            this.log('ECharts已定义，版本：' + echarts.version);
            
            // 初始化测试图表
            try {
                const chart = echarts.init(chartContent);
                this.log('测试图表初始化成功');
                
                this.safeInitChart('service-benefit-chart', () => ({
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: {
                        type: 'category',
                        data: ['A', 'B', 'C', 'D', 'E']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: [120, 200, 150, 80, 70],
                        type: 'bar',
                        itemStyle: {
                            color: '#ff9900'
                        }
                    }]
                }));
                
                chart.setOption(option);
                this.log('测试图表配置已设置');
                
                // 添加窗口调整事件
                window.addEventListener('resize', function() {
                    if (chart && chart.resize) {
                        chart.resize();
                    }
                });
            } catch (error) {
                this.log('测试图表创建失败：' + error.message);
                chartContent.textContent = '错误：图表初始化失败：' + error.message;
                chartContent.style.display = 'flex';
                chartContent.style.alignItems = 'center';
                chartContent.style.justifyContent = 'center';
                chartContent.style.color = 'red';
            }
        } catch (error) {
            this.log('创建测试图表过程出错：' + error.message);
            console.error('测试图表创建错误:', error);
        }
    }

    init() {
        this.log('页面初始化开始');
        this.initEventListeners();
        this.createTestChart(); // 添加测试图表
        this.loadData();
        this.log('页面初始化完成');
    }

    initEventListeners() {
        // 时间范围选择
        document.getElementById('timeRange').addEventListener('change', (e) => {
            this.currentTimeRange = e.target.value;
            this.loadData();
        });

        // 添加防抖的窗口resize事件监听器
        const debouncedResize = this.debounce(() => {
            this.log('窗口大小改变，重新调整图表');
            this.resizeCharts();
        }, 300);

        window.addEventListener('resize', debouncedResize);
    }

    // 切换标签页
    switchTab(tabName, event) {
        // 更新按钮状态
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');

        // 显示对应内容
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        this.currentTab = tabName;
        
        // 初始化对应图表
        setTimeout(() => {
            this.initChartsForTab(tabName);
            
            // 如果切换到病种效益选项卡，初始化筛选功能
            if (tabName === 'disease') {
                this.initDiseaseFilter();
            }
        }, 100);
    }

    // 加载数据
    loadData() {
        // 从实际数据文件加载数据
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '../data/economic-benefit.json', true);
        xhr.responseType = 'json';
        
        xhr.onload = () => {
            if (xhr.status === 200) {
                const rawData = xhr.response;
                // 转换数据格式以匹配代码期望的结构
                const data = this.transformData(rawData);
                this.currentData = data; // 存储转换后的数据供图表使用
                this.updateBenefitOverview(data.overview);
                this.initCharts();
                this.updateTables(data);
            } else {
                console.error('加载数据失败:', xhr.status);
                // 如果加载失败，使用模拟数据
                const data = this.getMockData();
                this.currentData = data;
                this.updateBenefitOverview(data.overview);
                this.initCharts();
                this.updateTables(data);
            }
        };
        
        xhr.onerror = () => {
            console.error('请求数据出错');
            // 如果请求出错，使用模拟数据
            const data = this.getMockData();
            this.currentData = data;
            this.updateBenefitOverview(data.overview);
            this.initCharts();
            this.updateTables(data);
        };
        
        xhr.send();
    }

    // 转换数据格式以匹配代码期望的结构
    transformData(rawData) {
        return {
            overview: {
                totalRevenue: rawData.overview?.totalRevenue || 2870, // 28.7亿，以万元为单位
                netProfit: rawData.overview?.netProfit || 1010, // 10.1亿，以万元为单位
                overallBenefitRate: rawData.overview?.profitMargin || 12.8,
                outpatientBenefitRate: 8.5, // 从原数据中计算或使用默认值
                inpatientBenefitRate: 15.2, // 从原数据中计算或使用默认值
                totalCost: rawData.overview?.totalCost || 1860, // 18.6亿，以万元为单位
                revenueGrowth: rawData.overview?.revenueGrowth || 8.5,
                roi: rawData.overview?.roi || 18.5,
                costGrowth: rawData.overview?.costGrowth || 5.2,
                trends: {
                    overall: { value: rawData.overview?.revenueGrowth || 2.3, isPositive: true },
                    outpatient: { value: 1.2, isPositive: true },
                    inpatient: { value: -0.8, isPositive: false },
                    cost: { value: rawData.overview?.costGrowth || 5.6, isPositive: true }
                }
            },
            overallTrend: {
                months: rawData.revenueAnalysis?.trend?.months || ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                revenue: rawData.revenueAnalysis?.trend?.revenue || [8500, 8200, 9100, 8800, 9200, 9500, 8900, 9300, 9600, 9100, 9400, 9800],
                cost: rawData.costAnalysis?.trend?.cost || [7200, 7100, 7800, 7600, 7900, 8100, 7700, 8000, 8200, 7800, 8000, 8300],
                benefit: rawData.revenueAnalysis?.trend?.profit || [1300, 1100, 1300, 1200, 1300, 1400, 1200, 1300, 1400, 1300, 1400, 1500]
            },
            departmentBenefit: (rawData.departmentBenefits && Array.isArray(rawData.departmentBenefits)) ? rawData.departmentBenefits.map(dept => ({
                name: dept.name,
                revenue: dept.revenue,
                cost: dept.cost,
                benefit: dept.profit,
                benefitRate: dept.profitMargin
            })) : this.generateDepartmentBenefitData(),
            outpatientData: this.generateOutpatientDataFromRaw(rawData),
            inpatientData: this.generateInpatientDataFromRaw(rawData),
            diseaseData: this.generateDiseaseData(), // 使用模拟数据，因为原数据中没有病种数据
            serviceData: this.generateServiceData(), // 使用模拟数据，因为原数据中没有服务项目数据
            costData: {
                totalCost: rawData.costAnalysis?.byCategory ? {
                    categories: rawData.costAnalysis.byCategory.map(item => item.name),
                    values: rawData.costAnalysis.byCategory.map(item => item.value),
                    colors: rawData.costAnalysis.byCategory.map(item => item.color)
                } : this.generateCostData().totalCost,
                directCost: rawData.costAnalysis?.byCategory ? {
                    categories: rawData.costAnalysis.byCategory.slice(0, 4).map(item => item.name),
                    values: rawData.costAnalysis.byCategory.slice(0, 4).map(item => item.value),
                    colors: rawData.costAnalysis.byCategory.slice(0, 4).map(item => item.color)
                } : this.generateCostData().directCost,
                indirectCost: rawData.costAnalysis?.byCategory ? {
                    categories: rawData.costAnalysis.byCategory.slice(4).map(item => item.name),
                    values: rawData.costAnalysis.byCategory.slice(4).map(item => item.value),
                    colors: rawData.costAnalysis.byCategory.slice(4).map(item => item.color)
                } : this.generateCostData().indirectCost,
                structure: this.generateCostData().structure
            },
            breakevenData: this.generateBreakevenData(), // 使用模拟数据，因为原数据中没有本量利数据
            efficiencyData: {
                departments: this.generateEfficiencyData().departments, // 使用模拟数据，因为原数据中没有效率数据
                incomeStructure: rawData.efficiencyAnalysis?.resourceEfficiency || this.generateEfficiencyData().incomeStructure
            }
        };
    }

    // 从原始数据生成门诊数据
    generateOutpatientDataFromRaw(rawData) {
        const outpatientDepts = rawData.revenueAnalysis?.byDepartment?.filter(dept => 
            ['内科', '外科', '妇产科', '儿科', '急诊科'].includes(dept.name)
        ) || [];
        
        return {
            trend: {
                months: rawData.revenueAnalysis?.trend?.months || ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                revenue: (rawData.revenueAnalysis?.trend?.revenue && Array.isArray(rawData.revenueAnalysis.trend.revenue)) ? rawData.revenueAnalysis.trend.revenue.map(v => v * 0.4) : [3200, 3100, 3400, 3300, 3450, 3550, 3350, 3500, 3600, 3400, 3500, 3650],
                cost: (rawData.costAnalysis?.trend?.cost && Array.isArray(rawData.costAnalysis.trend.cost)) ? rawData.costAnalysis.trend.cost.map(v => v * 0.4) : [2900, 2850, 3100, 3000, 3150, 3250, 3050, 3200, 3300, 3100, 3200, 3350],
                benefit: (rawData.revenueAnalysis?.trend?.profit && Array.isArray(rawData.revenueAnalysis.trend.profit)) ? rawData.revenueAnalysis.trend.profit.map(v => v * 0.3) : [300, 250, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300]
            },
            departments: (outpatientDepts && Array.isArray(outpatientDepts)) ? outpatientDepts.map(dept => ({
                name: dept.name + '门诊',
                revenue: (dept.revenue || dept.value || 1000) * 0.6, // 假设60%是门诊收入
                cost: (dept.revenue || dept.value || 1000) * 0.5,
                benefit: (dept.revenue || dept.value || 1000) * 0.1,
                benefitRate: 10,
                patients: Math.floor((dept.revenue || dept.value || 1000) * 10),
                avgCost: Math.floor((dept.revenue || dept.value || 1000) * 0.5 / ((dept.revenue || dept.value || 1000) * 10) * 1000)
            })) : this.generateOutpatientData().departments
        };
    }

    // 从原始数据生成住院数据
    generateInpatientDataFromRaw(rawData) {
        const inpatientDepts = rawData.revenueAnalysis?.byDepartment?.filter(dept => 
            ['内科', '外科', '妇产科', '骨科', '心血管科'].includes(dept.name)
        ) || [];
        
        return {
            trend: {
                months: rawData.revenueAnalysis?.trend?.months || ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                revenue: (rawData.revenueAnalysis?.trend?.revenue && Array.isArray(rawData.revenueAnalysis.trend.revenue)) ? rawData.revenueAnalysis.trend.revenue.map(v => v * 0.6) : [5300, 5100, 5700, 5500, 5750, 5950, 5550, 5800, 6000, 5700, 5900, 6150],
                cost: (rawData.costAnalysis?.trend?.cost && Array.isArray(rawData.costAnalysis.trend.cost)) ? rawData.costAnalysis.trend.cost.map(v => v * 0.6) : [4500, 4400, 4850, 4700, 4900, 5050, 4750, 4950, 5100, 4850, 5000, 5200],
                benefit: (rawData.revenueAnalysis?.trend?.profit && Array.isArray(rawData.revenueAnalysis.trend.profit)) ? rawData.revenueAnalysis.trend.profit.map(v => v * 0.7) : [800, 700, 850, 800, 850, 900, 800, 850, 900, 850, 900, 950]
            },
            departments: (inpatientDepts && Array.isArray(inpatientDepts)) ? inpatientDepts.map(dept => ({
                name: dept.name + '病房',
                revenue: (dept.revenue || dept.value || 1000) * 0.4, // 假设40%是住院收入
                cost: (dept.revenue || dept.value || 1000) * 0.3,
                benefit: (dept.revenue || dept.value || 1000) * 0.1,
                benefitRate: 15,
                discharges: Math.floor((dept.revenue || dept.value || 1000) / 10),
                avgDays: 7.5
            })) : this.generateInpatientData().departments
        };
    }

    // 获取模拟数据
    getMockData() {
        return {
            overview: {
                totalRevenue: 2870, // 28.7亿，以万元为单位
                netProfit: 1010, // 10.1亿，以万元为单位
                overallBenefitRate: 12.8,
                outpatientBenefitRate: 8.5,
                inpatientBenefitRate: 15.2,
                totalCost: 1860, // 18.6亿，以万元为单位
                revenueGrowth: 8.5,
                roi: 18.5,
                costGrowth: 5.2,
                trends: {
                    overall: { value: 2.3, isPositive: true },
                    outpatient: { value: 1.2, isPositive: true },
                    inpatient: { value: -0.8, isPositive: false },
                    cost: { value: 5.6, isPositive: true }
                }
            },
            overallTrend: this.generateTrendData(),
            departmentBenefit: this.generateDepartmentBenefitData(),
            outpatientData: this.generateOutpatientData(),
            inpatientData: this.generateInpatientData(),
            diseaseData: this.generateDiseaseData(),
            serviceData: this.generateServiceData(),
            costData: this.generateCostData(),
            breakevenData: this.generateBreakevenData(),
            efficiencyData: this.generateEfficiencyData()
        };
    }

    // 生成趋势数据
    generateTrendData() {
        const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
        return {
            months: months,
            revenue: [8500, 8200, 9100, 8800, 9200, 9500, 8900, 9300, 9600, 9100, 9400, 9800],
            cost: [7200, 7100, 7800, 7600, 7900, 8100, 7700, 8000, 8200, 7800, 8000, 8300],
            benefit: [1300, 1100, 1300, 1200, 1300, 1400, 1200, 1300, 1400, 1300, 1400, 1500]
        };
    }

    // 生成科室效益数据
    generateDepartmentBenefitData() {
        return [
            { name: '内科', revenue: 1850, cost: 1580, benefit: 270, benefitRate: 14.6 },
            { name: '外科', revenue: 2100, cost: 1780, benefit: 320, benefitRate: 15.2 },
            { name: '妇产科', revenue: 1650, cost: 1420, benefit: 230, benefitRate: 13.9 },
            { name: '儿科', revenue: 1200, cost: 1080, benefit: 120, benefitRate: 10.0 },
            { name: '急诊科', revenue: 980, cost: 890, benefit: 90, benefitRate: 9.2 },
            { name: '骨科', revenue: 1580, cost: 1320, benefit: 260, benefitRate: 16.5 },
            { name: '心血管科', revenue: 1420, cost: 1210, benefit: 210, benefitRate: 14.8 },
            { name: '神经科', revenue: 1180, cost: 1020, benefit: 160, benefitRate: 13.6 }
        ];
    }

    // 生成门诊数据
    generateOutpatientData() {
        return {
            trend: {
                months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                revenue: [3200, 3100, 3400, 3300, 3450, 3550, 3350, 3500, 3600, 3400, 3500, 3650],
                cost: [2900, 2850, 3100, 3000, 3150, 3250, 3050, 3200, 3300, 3100, 3200, 3350],
                benefit: [300, 250, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300]
            },
            departments: [
                { name: '内科门诊', revenue: 850, cost: 780, benefit: 70, benefitRate: 8.2, patients: 2850, avgCost: 298 },
                { name: '外科门诊', revenue: 920, cost: 840, benefit: 80, benefitRate: 8.7, patients: 3100, avgCost: 297 },
                { name: '妇产科门诊', revenue: 680, cost: 620, benefit: 60, benefitRate: 8.8, patients: 2200, avgCost: 309 },
                { name: '儿科门诊', revenue: 520, cost: 480, benefit: 40, benefitRate: 7.7, patients: 1850, avgCost: 281 },
                { name: '骨科门诊', revenue: 580, cost: 530, benefit: 50, benefitRate: 8.6, patients: 1950, avgCost: 297 }
            ]
        };
    }

    // 生成住院数据
    generateInpatientData() {
        return {
            trend: {
                months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                revenue: [5300, 5100, 5700, 5500, 5750, 5950, 5550, 5800, 6000, 5700, 5900, 6150],
                cost: [4500, 4400, 4850, 4700, 4900, 5050, 4750, 4950, 5100, 4850, 5000, 5200],
                benefit: [800, 700, 850, 800, 850, 900, 800, 850, 900, 850, 900, 950]
            },
            departments: [
                { name: '内科病房', revenue: 1200, cost: 1020, benefit: 180, benefitRate: 15.0, discharges: 850, avgDays: 7.2 },
                { name: '外科病房', revenue: 1580, cost: 1320, benefit: 260, benefitRate: 16.5, discharges: 680, avgDays: 8.5 },
                { name: '妇产科病房', revenue: 980, cost: 840, benefit: 140, benefitRate: 14.3, discharges: 420, avgDays: 6.8 },
                { name: '骨科病房', revenue: 1180, cost: 980, benefit: 200, benefitRate: 16.9, discharges: 520, avgDays: 9.2 },
                { name: '心血管科病房', revenue: 920, cost: 780, benefit: 140, benefitRate: 15.2, discharges: 380, avgDays: 8.8 }
            ]
        };
    }

    // 生成病种数据
    generateDiseaseData() {
        return [
            { code: 'A09.9', name: '复杂手术并发症', cases: 85, avgRevenue: 25000, avgCost: 28500, avgBenefit: -3500, benefitRate: -14.0 },
            { code: 'C78.0', name: '恶性肿瘤', cases: 85, avgRevenue: 45800, avgCost: 39200, avgBenefit: 6600, benefitRate: 14.4 },
            { code: 'E11.9', name: '2型糖尿病', cases: 520, avgRevenue: 6800, avgCost: 5600, avgBenefit: 1200, benefitRate: 17.6 },
            { code: 'F32.9', name: '抑郁症', cases: 125, avgRevenue: 7800, avgCost: 6500, avgBenefit: 1300, benefitRate: 16.7 },
            { code: 'G93.1', name: '脑血管病后遗症', cases: 195, avgRevenue: 16800, avgCost: 14200, avgBenefit: 2600, benefitRate: 15.5 },
            { code: 'H25.9', name: '白内障', cases: 340, avgRevenue: 8500, avgCost: 7200, avgBenefit: 1300, benefitRate: 15.3 },
            { code: 'I10', name: '原发性高血压', cases: 680, avgRevenue: 4200, avgCost: 3500, avgBenefit: 700, benefitRate: 16.7 },
            { code: 'I21.9', name: '急性心肌梗死', cases: 75, avgRevenue: 38500, avgCost: 33200, avgBenefit: 5300, benefitRate: 13.8 },
            { code: 'I25.1', name: '冠状动脉粥样硬化性心脏病', cases: 285, avgRevenue: 12800, avgCost: 10800, avgBenefit: 2000, benefitRate: 15.6 },
            { code: 'I63.9', name: '脑梗死', cases: 165, avgRevenue: 22800, avgCost: 19500, avgBenefit: 3300, benefitRate: 14.5 },
            { code: 'J18.9', name: '肺炎', cases: 310, avgRevenue: 9200, avgCost: 7800, avgBenefit: 1400, benefitRate: 15.2 },
            { code: 'J44.9', name: '慢性阻塞性肺疾病', cases: 420, avgRevenue: 8500, avgCost: 7200, avgBenefit: 1300, benefitRate: 15.3 },
            { code: 'J96.0', name: '急性呼吸衰竭', cases: 55, avgRevenue: 28000, avgCost: 32000, avgBenefit: -4000, benefitRate: -14.3 },
            { code: 'K29.9', name: '慢性胃炎', cases: 385, avgRevenue: 5800, avgCost: 4900, avgBenefit: 900, benefitRate: 15.5 },
            { code: 'K35.9', name: '急性阑尾炎', cases: 280, avgRevenue: 11200, avgCost: 9500, avgBenefit: 1700, benefitRate: 15.2 },
            { code: 'K80.2', name: '胆囊结石伴慢性胆囊炎', cases: 380, avgRevenue: 15200, avgCost: 12800, avgBenefit: 2400, benefitRate: 15.8 },
            { code: 'K92.2', name: '消化道出血', cases: 155, avgRevenue: 13800, avgCost: 11800, avgBenefit: 2000, benefitRate: 14.5 },
            { code: 'L30.9', name: '皮炎湿疹', cases: 420, avgRevenue: 3200, avgCost: 2700, avgBenefit: 500, benefitRate: 15.6 },
            { code: 'M51.2', name: '腰椎间盘突出症', cases: 265, avgRevenue: 18500, avgCost: 15800, avgBenefit: 2700, benefitRate: 14.6 },
            { code: 'M79.3', name: '风湿性关节炎', cases: 195, avgRevenue: 8900, avgCost: 7600, avgBenefit: 1300, benefitRate: 14.6 },
            { code: 'N17.9', name: '急性肾衰竭', cases: 65, avgRevenue: 35000, avgCost: 42000, avgBenefit: -7000, benefitRate: -20.0 },
            { code: 'N18.6', name: '慢性肾脏病', cases: 225, avgRevenue: 14500, avgCost: 12300, avgBenefit: 2200, benefitRate: 15.2 },
            { code: 'N20.0', name: '肾结石', cases: 320, avgRevenue: 9800, avgCost: 8300, avgBenefit: 1500, benefitRate: 15.3 },
            { code: 'O80', name: '正常分娩', cases: 380, avgRevenue: 6800, avgCost: 5800, avgBenefit: 1000, benefitRate: 14.7 },
            { code: 'R50.9', name: '发热待查', cases: 285, avgRevenue: 5200, avgCost: 4400, avgBenefit: 800, benefitRate: 15.4 },
            { code: 'R57.0', name: '心源性休克', cases: 25, avgRevenue: 45000, avgCost: 52000, avgBenefit: -7000, benefitRate: -15.6 },
            { code: 'S72.0', name: '股骨颈骨折', cases: 145, avgRevenue: 28500, avgCost: 24800, avgBenefit: 3700, benefitRate: 13.0 },
            { code: 'T81.4', name: '术后感染', cases: 45, avgRevenue: 18000, avgCost: 22000, avgBenefit: -4000, benefitRate: -22.2 },
            { code: 'Z38.0', name: '新生儿', cases: 450, avgRevenue: 4800, avgCost: 4100, avgBenefit: 700, benefitRate: 14.6 },
            { code: 'Z51.1', name: '化疗', cases: 95, avgRevenue: 32500, avgCost: 28200, avgBenefit: 4300, benefitRate: 13.2 }
        ];
    }

    // 生成医疗服务项目数据
    generateServiceData() {
        return [
            { code: '470000001', name: 'CT检查', quantity: 2850, revenue: 1425000, cost: 1140000, benefit: 285000, benefitRate: 20.0 },
            { code: '470000002', name: 'MRI检查', quantity: 1200, revenue: 2400000, cost: 1800000, benefit: 600000, benefitRate: 25.0 },
            { code: '470000003', name: '超声检查', quantity: 4200, revenue: 840000, cost: 672000, benefit: 168000, benefitRate: 20.0 },
            { code: '470000004', name: '心电图检查', quantity: 5800, revenue: 290000, cost: 232000, benefit: 58000, benefitRate: 20.0 },
            { code: '470000005', name: '胃镜检查', quantity: 850, revenue: 680000, cost: 544000, benefit: 136000, benefitRate: 20.0 }
        ];
    }

    // 生成成本数据
    generateCostData() {
        return {
            totalCost: {
                categories: ['人员成本', '药品成本', '耗材成本', '设备折旧', '房屋折旧', '水电费', '其他'],
                values: [3245, 2150, 1420, 850, 320, 180, 280],
                colors: ['#0066cc', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2', '#eb2f96']
            },
            directCost: {
                categories: ['直接人员', '直接药品', '直接耗材', '专用设备'],
                values: [2580, 1850, 980, 650],
                colors: ['#0066cc', '#52c41a', '#faad14', '#f5222d']
            },
            indirectCost: {
                categories: ['管理人员', '共用设备', '房屋折旧', '水电费', '行政费用'],
                values: [665, 200, 320, 180, 280],
                colors: ['#722ed1', '#13c2c2', '#eb2f96', '#fa8c16', '#a0d911']
            },
            structure: [
                { item: '人员成本', current: 3245, proportion: 39.4, previous: 3080, change: 5.4, trend: 'up' },
                { item: '药品成本', current: 2150, proportion: 26.1, previous: 2050, change: 4.9, trend: 'up' },
                { item: '耗材成本', current: 1420, proportion: 17.2, previous: 1350, change: 5.2, trend: 'up' },
                { item: '设备折旧', current: 850, proportion: 10.3, previous: 820, change: 3.7, trend: 'up' },
                { item: '房屋折旧', current: 320, proportion: 3.9, previous: 320, change: 0.0, trend: 'stable' },
                { item: '水电费', current: 180, proportion: 2.2, previous: 175, change: 2.9, trend: 'up' },
                { item: '其他', current: 280, proportion: 3.4, previous: 285, change: -1.8, trend: 'down' }
            ]
        };
    }

    // 生成本量利数据
    generateBreakevenData() {
        return {
            outpatient: {
                months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                revenue: [3200, 3100, 3400, 3300, 3450, 3550, 3350, 3500, 3600, 3400, 3500, 3650],
                cost: [2900, 2850, 3100, 3000, 3150, 3250, 3050, 3200, 3300, 3100, 3200, 3350],
                breakevenPoint: 2850,
                profitPoint: 3420,
                unitContribution: 285,
                contributionRate: 68.5
            },
            inpatient: {
                months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                revenue: [5300, 5100, 5700, 5500, 5750, 5950, 5550, 5800, 6000, 5700, 5900, 6150],
                cost: [4500, 4400, 4850, 4700, 4900, 5050, 4750, 4950, 5100, 4850, 5000, 5200],
                breakevenPoint: 1240,
                profitPoint: 1488,
                unitContribution: 1580,
                contributionRate: 72.3
            }
        };
    }
    
    // 生成人员效率数据
    generateEfficiencyData() {
        const departments = [
            { name: '内科', doctors: 25, outpatients: 31200, inpatients: 2250, revenue: 6200, profit: 930 },
            { name: '外科', doctors: 22, outpatients: 26800, inpatients: 1980, revenue: 5800, profit: 870 },
            { name: '妇产科', doctors: 18, outpatients: 22500, inpatients: 1650, revenue: 4900, profit: 735 },
            { name: '儿科', doctors: 16, outpatients: 20100, inpatients: 1420, revenue: 4200, profit: 630 },
            { name: '急诊科', doctors: 20, outpatients: 24800, inpatients: 1850, revenue: 5100, profit: 765 },
            { name: '口腔科', doctors: 15, outpatients: 18900, inpatients: 0, revenue: 3800, profit: 570 },
            { name: '眼科', doctors: 12, outpatients: 15600, inpatients: 1050, revenue: 3400, profit: 510 },
            { name: '耳鼻喉科', doctors: 10, outpatients: 12800, inpatients: 890, revenue: 2900, profit: 435 },
            { name: '皮肤科', doctors: 8, outpatients: 10200, inpatients: 0, revenue: 2400, profit: 360 },
            { name: '中医科', doctors: 14, outpatients: 17500, inpatients: 980, revenue: 3600, profit: 540 }
        ];
        
        // 计算效率指标
        const efficiencyData = (departments && Array.isArray(departments)) ? departments.map(dept => ({
            ...dept,
            outpatientPerDoctor: Math.round(dept.outpatients / dept.doctors),
            inpatientPerDoctor: Math.round(dept.inpatients / dept.doctors),
            revenuePerDoctor: Math.round(dept.revenue / dept.doctors * 10) / 10,
            profitPerDoctor: Math.round(dept.profit / dept.doctors * 10) / 10
        })) : [];
        
        // 计算平均值
        const totalDoctors = departments.reduce((sum, dept) => sum + dept.doctors, 0);
        const totalOutpatients = departments.reduce((sum, dept) => sum + dept.outpatients, 0);
        const totalInpatients = departments.reduce((sum, dept) => sum + dept.inpatients, 0);
        const totalRevenue = departments.reduce((sum, dept) => sum + dept.revenue, 0);
        const totalProfit = departments.reduce((sum, dept) => sum + dept.profit, 0);
        
        const averages = {
            outpatientPerDoctor: Math.round(totalOutpatients / totalDoctors),
            inpatientPerDoctor: Math.round(totalInpatients / totalDoctors),
            revenuePerDoctor: Math.round(totalRevenue / totalDoctors * 10) / 10,
            profitPerDoctor: Math.round(totalProfit / totalDoctors * 10) / 10
        };
        
        // 收入构成数据
        const incomeStructure = [
            { name: '医疗服务收入', value: 45 },
            { name: '药品收入', value: 32 },
            { name: '检查检验收入', value: 18 },
            { name: '其他收入', value: 5 }
        ];
        
        return {
            departments: efficiencyData,
            averages,
            incomeStructure
        };
    }

    // 更新效益概览
    updateBenefitOverview(overview) {
        const cards = document.querySelectorAll('.benefit-card');
        if (cards.length >= 4) {
            // 动态计算利润率和总成本
            const profitMargin = ((overview.netProfit / overview.totalRevenue) * 100).toFixed(1);
            const totalCost = overview.totalRevenue - overview.netProfit;
            
            // 总收入
            cards[0].querySelector('.benefit-value').textContent = '¥' + (overview.totalRevenue / 100).toFixed(1) + '亿';
            // 净利润
            cards[1].querySelector('.benefit-value').textContent = '¥' + (overview.netProfit / 100).toFixed(1) + '亿';
            // 利润率 = 净利润/总收入
            cards[2].querySelector('.benefit-value').textContent = profitMargin + '%';
            // 总成本 = 总收入-净利润
            cards[3].querySelector('.benefit-value').textContent = '¥' + (totalCost / 100).toFixed(1) + '亿';

            // 更新趋势 - 使用实际数据或默认值
            const trends = [
                { value: overview.revenueGrowth || 8.5, isPositive: (overview.revenueGrowth || 8.5) > 0 },
                { value: overview.roi || 18.5, isPositive: (overview.roi || 18.5) > 0 },
                { value: parseFloat(profitMargin), isPositive: parseFloat(profitMargin) > 0 },
                { value: overview.costGrowth || 5.2, isPositive: (overview.costGrowth || 5.2) > 0 }
            ];
            
            cards.forEach((card, index) => {
                const trendElement = card.querySelector('.benefit-trend');
                if (trendElement && trends[index]) {
                    const trend = trends[index];
                    trendElement.textContent = (trend.isPositive ? '↑ ' : '↓ ') + Math.abs(trend.value) + '% 同比上期';
                    trendElement.className = 'benefit-trend ' + (trend.isPositive ? 'positive' : 'negative');
                }
            });
        }
    }

    // 检查图表容器
    checkChartContainers() {
        const containers = [
            'overall-trend-chart',
            'department-benefit-chart'
        ];
        
        let allValid = true;
        containers.forEach(id => {
            const element = document.getElementById(id);
            if (!element) {
                this.log(`错误：找不到图表容器 ${id}`);
                allValid = false;
            } else {
                const rect = element.getBoundingClientRect();
                this.log(`容器 ${id}: 宽度=${rect.width}, 高度=${rect.height}`);
                if (rect.width === 0 || rect.height === 0) {
                    this.log(`警告：容器 ${id} 尺寸为0`);
                }
            }
        });
        
        return allValid;
    }

    // 安全初始化图表的辅助函数
    safeInitChart(containerId, optionCallback) {
        try {
            const container = document.getElementById(containerId);
            if (!container) {
                this.log(`错误：找不到图表容器 ${containerId}`);
                return null;
            }

            // 检查容器是否可见
            const rect = container.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) {
                this.log(`警告：容器 ${containerId} 尺寸为0，跳过初始化`);
                return null;
            }

            // 如果已经有图表实例，先销毁
            if (this.charts[containerId]) {
                this.charts[containerId].dispose();
            }

            const chart = echarts.init(container);
            const option = optionCallback();
            chart.setOption(option);
            this.charts[containerId] = chart;
            
            this.log(`图表 ${containerId} 初始化成功`);
            return chart;
        } catch (error) {
            this.log(`图表 ${containerId} 初始化失败: ${error.message}`);
            console.error(`图表 ${containerId} 错误:`, error);
            return null;
        }
    }

    // 初始化图表
    initCharts() {
        this.log('初始化所有图表开始');
        
        // 检查ECharts是否可用
        if (typeof echarts === 'undefined') {
            this.log('错误：ECharts未定义，无法初始化图表');
            return;
        }
        
        // 检查图表容器
        if (!this.checkChartContainers()) {
            this.log('图表容器检查失败，延迟初始化');
            setTimeout(() => this.initCharts(), 100);
            return;
        }
        
        try {
            console.log('开始初始化图表，currentData:', this.currentData);
            this.initOverallTrendChart();
            this.initDepartmentBenefitChart();
            this.log('主要图表初始化完成');
            
            // 其他图表初始化
            console.log('开始初始化门诊图表');
            this.initOutpatientCharts();
            console.log('开始初始化住院图表');
            this.initInpatientCharts();
            console.log('开始初始化病种图表');
            this.initDiseaseCharts();
            console.log('开始初始化服务图表');
            this.initServiceCharts();
            console.log('开始初始化成本图表');
            this.initCostCharts();
            console.log('开始初始化盈亏平衡图表');
            this.initBreakevenCharts();
            console.log('开始初始化效率图表');
            this.initEfficiencyCharts();
            
            this.log('初始化所有图表完成');
        } catch (error) {
            this.log('图表初始化过程中出错：' + error.message);
            console.error('图表初始化错误:', error);
        }
    }

    // 为特定标签页初始化图表
    initChartsForTab(tabName) {
        switch (tabName) {
            case 'overall':
                this.initOverallTrendChart();
                this.initDepartmentBenefitChart();
                break;
            case 'outpatient':
                this.initOutpatientCharts();
                break;
            case 'inpatient':
                this.initInpatientCharts();
                break;
            case 'disease':
                this.initDiseaseCharts();
                break;
            case 'service':
                this.initServiceCharts();
                break;
            case 'cost':
                this.initCostCharts();
                break;
            case 'breakeven':
                this.initBreakevenCharts();
                break;
            case 'efficiency':
                this.initEfficiencyCharts();
                break;
        }
    }

    // 初始化总体趋势图表
    initOverallTrendChart() {
        // 使用转换后的数据结构
        const data = this.currentData?.overallTrend || this.generateTrendData();
        
        this.safeInitChart('overall-trend-chart', () => ({
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            legend: {
                data: ['收入', '成本', '结余']
            },
            grid: {
                left: '5%',
                right: '8%',
                bottom: '8%',
                top: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: data.months
            },
            yAxis: {
                type: 'value',
                name: '金额（万元）'
            },
            series: [
                {
                    name: '收入',
                    type: 'line',
                    data: data.revenue,
                    smooth: true,
                    itemStyle: {
                        color: '#0066cc'
                    }
                },
                {
                    name: '成本',
                    type: 'line',
                    data: data.cost,
                    smooth: true,
                    itemStyle: {
                        color: '#f5222d'
                    }
                },
                {
                    name: '结余',
                    type: 'line',
                    data: data.benefit,
                    smooth: true,
                    itemStyle: {
                        color: '#52c41a'
                    }
                }
            ]
        }));
    }

    // 初始化科室效益图表
    initDepartmentBenefitChart() {
        const chartElement = document.getElementById('department-benefit-chart');
        if (!chartElement) {
            this.log('科室效益图表容器不存在');
            return;
        }
        
        try {
            const chart = echarts.init(chartElement);
            
            // 使用转换后的数据结构
            const data = this.currentData?.departmentBenefit || this.generateDepartmentBenefitData();
            
            this.safeInitChart('department-benefit-chart', () => ({
                title: {
                    text: '各科室收益情况',
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
                    },
                    formatter: function(params) {
                        let result = params[0].name + '<br/>';
                        params.forEach(param => {
                            if (param.seriesName === '结余率') {
                                result += param.marker + param.seriesName + ': ' + param.value + '%<br/>';
                            } else {
                                result += param.marker + param.seriesName + ': ' + param.value + '万元<br/>';
                            }
                        });
                        return result;
                    }
                },
                legend: {
                    data: ['收入', '成本', '结余率'],
                    top: 30,
                    itemGap: 20
                },
                grid: {
                    left: '8%',
                    right: '8%',
                    bottom: '15%',
                    top: '20%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: (data && Array.isArray(data)) ? data.map(item => item.name) : [],
                    axisLabel: {
                        rotate: 45,
                        fontSize: 12
                    }
                },
                yAxis: [
                    {
                        type: 'value',
                        name: '金额（万元）',
                        position: 'left',
                        axisLabel: {
                            formatter: '{value}'
                        }
                    },
                    {
                        type: 'value',
                        name: '结余率（%）',
                        position: 'right',
                        max: 50,
                        axisLabel: {
                            formatter: '{value}%'
                        }
                    }
                ],
                series: [
                    {
                        name: '收入',
                        type: 'bar',
                        data: (data && Array.isArray(data)) ? data.map(item => item.revenue) : [],
                        itemStyle: {
                            color: '#0066cc'
                        },
                        barWidth: '20%'
                    },
                    {
                        name: '成本',
                        type: 'bar',
                        data: (data && Array.isArray(data)) ? data.map(item => item.cost) : [],
                        itemStyle: {
                            color: '#f5222d'
                        },
                        barWidth: '20%'
                    },
                    {
                        name: '结余率',
                        type: 'line',
                        yAxisIndex: 1,
                        data: (data && Array.isArray(data)) ? data.map(item => parseFloat(item.benefitRate)) : [],
                        itemStyle: {
                            color: '#52c41a'
                        },
                        lineStyle: {
                            width: 3
                        },
                        symbol: 'circle',
                        symbolSize: 6
                    }
                ]
            }));
            this.charts.departmentBenefit = chart;
            this.log('科室效益图表初始化成功');
        } catch (error) {
            this.log(`科室效益图表初始化失败: ${error.message}`);
            console.error('科室效益图表错误:', error);
        }
    }

    // 初始化门诊图表
    initOutpatientCharts() {
        this.initOutpatientRevenueChart();
        this.initOutpatientRankingChart();
    }

    // 初始化门诊收入图表
    initOutpatientRevenueChart() {
        // 使用实际数据，如果没有则使用模拟数据
        const data = this.currentData?.outpatientData?.trend || this.generateOutpatientData().trend;
        
        this.safeInitChart('outpatient-revenue-chart', () => ({
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            legend: {
                data: ['门诊收入', '门诊成本', '门诊结余']
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
                data: data.months
            },
            yAxis: {
                type: 'value',
                name: '金额（万元）'
            },
            series: [
                {
                    name: '门诊收入',
                    type: 'line',
                    data: data.revenue,
                    smooth: true,
                    itemStyle: {
                        color: '#0066cc'
                    }
                },
                {
                    name: '门诊成本',
                    type: 'line',
                    data: data.cost,
                    smooth: true,
                    itemStyle: {
                        color: '#f5222d'
                    }
                },
                {
                    name: '门诊结余',
                    type: 'line',
                    data: data.benefit,
                    smooth: true,
                    itemStyle: {
                        color: '#52c41a'
                    }
                }
            ]
        }));
    }

    // 初始化门诊排名图表
    initOutpatientRankingChart() {
        // 使用实际数据，如果没有则使用模拟数据
        const data = this.currentData?.outpatientData?.departments || this.generateOutpatientData().departments;
        
        this.safeInitChart('outpatient-ranking-chart', () => ({
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['门诊收入', '门诊结余率']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: (data && Array.isArray(data)) ? data.map(item => item.name) : []
            },
            yAxis: [
                {
                    type: 'value',
                    name: '收入（万元）'
                },
                {
                    type: 'value',
                    name: '结余率（%）',
                    max: 12
                }
            ],
            series: [
                {
                    name: '门诊收入',
                    type: 'bar',
                    data: (data && Array.isArray(data)) ? data.map(item => item.revenue) : [],
                    itemStyle: {
                        color: '#0066cc'
                    }
                },
                {
                    name: '门诊结余率',
                    type: 'line',
                    yAxisIndex: 1,
                    data: (data && Array.isArray(data)) ? data.map(item => item.benefitRate) : [],
                    itemStyle: {
                        color: '#52c41a'
                    }
                }
            ]
        }));
    }

    // 初始化住院图表
    initInpatientCharts() {
        this.initInpatientRevenueChart();
        this.initInpatientCostChart();
    }

    // 初始化住院收入图表
    initInpatientRevenueChart() {
        // 使用实际数据，如果没有则使用模拟数据
        const data = this.currentData?.inpatientData?.trend || this.generateInpatientData().trend;
        
        this.safeInitChart('inpatient-revenue-chart', () => ({
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                },
                formatter: function(params) {
                    let result = params[0].name + '<br/>';
                    params.forEach(param => {
                        result += param.marker + param.seriesName + ': ' + (param.value || 0).toFixed(1) + '万元<br/>';
                    });
                    return result;
                }
            },
            legend: {
                data: ['住院收入', '住院成本', '住院结余']
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
                data: data.months
            },
            yAxis: {
                type: 'value',
                name: '金额（万元）'
            },
            series: [
                {
                    name: '住院收入',
                    type: 'line',
                    data: data.revenue,
                    smooth: true,
                    itemStyle: {
                        color: '#0066cc'
                    }
                },
                {
                    name: '住院成本',
                    type: 'line',
                    data: data.cost,
                    smooth: true,
                    itemStyle: {
                        color: '#f5222d'
                    }
                },
                {
                    name: '住院结余',
                    type: 'line',
                    data: data.benefit,
                    smooth: true,
                    itemStyle: {
                        color: '#52c41a'
                    }
                }
            ]
        }));
    }

    // 初始化住院成本图表
    initInpatientCostChart() {
        // 使用实际数据，如果没有则使用模拟数据
        const departments = this.currentData?.inpatientData?.departments || this.generateInpatientData().departments;
        
        this.safeInitChart('inpatient-cost-chart', () => ({
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function(params) {
                    let result = params[0].name + '<br/>';
                    params.forEach(param => {
                        if (param.seriesName === '住院结余率') {
                            result += param.marker + param.seriesName + ': ' + (param.value || 0).toFixed(1) + '%<br/>';
                        } else {
                            result += param.marker + param.seriesName + ': ' + (param.value || 0).toFixed(1) + '万元<br/>';
                        }
                    });
                    return result;
                }
            },
            legend: {
                data: ['住院收入', '住院成本', '住院结余率']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: (departments && Array.isArray(departments)) ? departments.map(item => item.name) : []
            },
            yAxis: [
                {
                    type: 'value',
                    name: '金额（万元）'
                },
                {
                    type: 'value',
                    name: '结余率（%）',
                    max: 20
                }
            ],
            series: [
                {
                    name: '住院收入',
                    type: 'bar',
                    data: (departments && Array.isArray(departments)) ? departments.map(item => item.revenue) : [],
                    itemStyle: {
                        color: '#0066cc'
                    }
                },
                {
                    name: '住院成本',
                    type: 'bar',
                    data: (departments && Array.isArray(departments)) ? departments.map(item => item.cost) : [],
                    itemStyle: {
                        color: '#f5222d'
                    }
                },
                {
                    name: '住院结余率',
                    type: 'line',
                    yAxisIndex: 1,
                    data: (departments && Array.isArray(departments)) ? departments.map(item => item.benefitRate) : [],
                    itemStyle: {
                        color: '#52c41a'
                    }
                }
            ]
        }));
    }

    // 初始化病种图表
    initDiseaseCharts() {
        this.initDiseaseBenefitChart();
        this.initDRGBenefitChart();
    }

    // 初始化病种效益图表
    initDiseaseBenefitChart() {
        
        // 使用实际数据，如果没有则使用模拟数据
        const data = this.currentData?.diseaseData || this.generateDiseaseData();
        console.log('病种数据:', data);
        
        this.safeInitChart('disease-benefit-chart', () => ({
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['平均收入', '平均成本', '平均结余', '结余率']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: (data && Array.isArray(data)) ? data.map(item => item.name.substring(0, 8) + '...') : []
            },
            yAxis: [
                {
                    type: 'value',
                    name: '金额（元）'
                },
                {
                    type: 'value',
                    name: '结余率（%）',
                    max: 20
                }
            ],
            series: [
                {
                    name: '平均收入',
                    type: 'bar',
                    data: (data && Array.isArray(data)) ? data.map(item => item.avgRevenue) : [],
                    itemStyle: {
                        color: '#0066cc'
                    }
                },
                {
                    name: '平均成本',
                    type: 'bar',
                    data: (data && Array.isArray(data)) ? data.map(item => item.avgCost) : [],
                    itemStyle: {
                        color: '#f5222d'
                    }
                },
                {
                    name: '平均结余',
                    type: 'bar',
                    data: (data && Array.isArray(data)) ? data.map(item => item.avgBenefit) : [],
                    itemStyle: {
                        color: '#52c41a'
                    }
                },
                {
                    name: '结余率',
                    type: 'line',
                    yAxisIndex: 1,
                    data: (data && Array.isArray(data)) ? data.map(item => item.benefitRate) : [],
                    itemStyle: {
                        color: '#faad14'
                    }
                }
            ]
        }));
    }

    // 初始化DRG效益图表
    initDRGBenefitChart() {
        
        // 使用实际数据，如果没有则使用模拟数据
        const data = this.currentData?.diseaseData || this.generateDiseaseData();
        
        // 只取前8个病种数据用于饼图显示
        const chartData = (data && Array.isArray(data)) ? data.slice(0, 8) : [];
        
        this.safeInitChart('drg-benefit-chart', () => ({
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
                    name: 'DRG/DIP效益分布',
                    type: 'pie',
                    radius: '50%',
                    data: chartData.map(item => ({
                        name: item.name.substring(0, 8) + '...',
                        value: item.avgBenefit * item.cases
                    })),
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        }));
    }

    // 初始化服务项目图表
    initServiceCharts() {
        this.initServiceBenefitChart();
        this.initServiceCostChart();
    }

    // 初始化服务项目效益图表
    initServiceBenefitChart() {
        
        // 使用实际数据，如果没有则使用模拟数据
        const data = this.currentData?.serviceData || this.generateServiceData();
        
        this.safeInitChart('service-benefit-chart', () => ({
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['项目收入', '项目成本', '项目结余', '结余率']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: (data && Array.isArray(data)) ? data.map(item => item.name) : []
            },
            yAxis: [
                {
                    type: 'value',
                    name: '金额（元）'
                },
                {
                    type: 'value',
                    name: '结余率（%）',
                    max: 30
                }
            ],
            series: [
                {
                    name: '项目收入',
                    type: 'bar',
                    data: (data && Array.isArray(data)) ? data.map(item => item.revenue / item.quantity) : [],
                    itemStyle: {
                        color: '#0066cc'
                    }
                },
                {
                    name: '项目成本',
                    type: 'bar',
                    data: (data && Array.isArray(data)) ? data.map(item => item.cost / item.quantity) : [],
                    itemStyle: {
                        color: '#f5222d'
                    }
                },
                {
                    name: '项目结余',
                    type: 'bar',
                    data: (data && Array.isArray(data)) ? data.map(item => item.benefit / item.quantity) : [],
                    itemStyle: {
                        color: '#52c41a'
                    }
                },
                {
                    name: '结余率',
                    type: 'line',
                    yAxisIndex: 1,
                    data: (data && Array.isArray(data)) ? data.map(item => item.benefitRate) : [],
                    itemStyle: {
                        color: '#faad14'
                    }
                }
            ]
        }));
    }

    // 初始化服务项目成本图表
    initServiceCostChart() {
        
        // 使用实际数据，如果没有则使用模拟数据
        const data = this.currentData?.serviceData || this.generateServiceData();
        
        this.safeInitChart('service-cost-chart', () => ({
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
                    name: '项目成本构成',
                    type: 'pie',
                    radius: '50%',
                    data: [
                        { name: '人员成本', value: 35 },
                        { name: '设备折旧', value: 25 },
                        { name: '耗材成本', value: 20 },
                        { name: '房屋折旧', value: 10 },
                        { name: '其他成本', value: 10 }
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
        }));
    }

    // 初始化成本图表
    initCostCharts() {
        this.initTotalCostChart();
        this.initDirectCostChart();
        this.initIndirectCostChart();
    }

    // 初始化总成本图表
    initTotalCostChart() {
        
        // 使用实际数据，如果没有则使用模拟数据
        const data = this.currentData?.costData?.totalCost || this.generateCostData().totalCost;
        
        this.safeInitChart('total-cost-chart', () => ({
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
                    name: '总成本构成',
                    type: 'pie',
                    radius: '50%',
                    data: (data.categories && Array.isArray(data.categories)) ? data.categories.map((category, index) => ({
                        name: category,
                        value: data.values[index]
                    })) : [],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        }));
    }

    // 初始化直接成本图表
    initDirectCostChart() {
        
        // 使用实际数据，如果没有则使用模拟数据
        const data = this.currentData?.costData?.directCost || this.generateCostData().directCost;
        
        this.safeInitChart('direct-cost-chart', () => ({
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
                    name: '直接成本构成',
                    type: 'pie',
                    radius: '50%',
                    data: (data.categories && Array.isArray(data.categories)) ? data.categories.map((category, index) => ({
                        name: category,
                        value: data.values[index]
                    })) : [],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        }));
    }

    // 初始化间接成本图表
    initIndirectCostChart() {
        
        // 使用实际数据，如果没有则使用模拟数据
        const data = this.currentData?.costData?.indirectCost || this.generateCostData().indirectCost;
        
        this.safeInitChart('indirect-cost-chart', () => ({
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
                    name: '间接成本构成',
                    type: 'pie',
                    radius: '50%',
                    data: (data.categories && Array.isArray(data.categories)) ? data.categories.map((category, index) => ({
                        name: category,
                        value: data.values[index]
                    })) : [],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        }));
    }

    // 初始化本量利图表和指标
    initBreakevenCharts() {
        this.initOutpatientBreakevenChart();
        this.initInpatientBreakevenChart();
        this.initOutpatientBreakevenCoordinateChart();
        this.initInpatientBreakevenCoordinateChart();
        this.updateBreakevenIndicators();
    }

    // 更新本量利分析指标
    updateBreakevenIndicators() {
        const data = this.getMockData().breakevenData;
        
        // 更新门诊本量利指标
        document.getElementById('outpatient-breakeven-point-value').textContent = data.outpatient.breakevenPoint.toLocaleString();
        document.getElementById('outpatient-profit-point-value').textContent = data.outpatient.profitPoint.toLocaleString();
        document.getElementById('outpatient-unit-contribution-value').textContent = '¥' + data.outpatient.unitContribution.toLocaleString();
        document.getElementById('outpatient-margin-value').textContent = data.outpatient.contributionRate + '%';
        
        // 更新住院本量利指标
        document.getElementById('inpatient-breakeven-point-value').textContent = data.inpatient.breakevenPoint.toLocaleString();
        document.getElementById('inpatient-profit-point-value').textContent = data.inpatient.profitPoint.toLocaleString();
        document.getElementById('inpatient-unit-contribution-value').textContent = '¥' + data.inpatient.unitContribution.toLocaleString();
        document.getElementById('inpatient-margin-value').textContent = data.inpatient.contributionRate + '%';
    }

    // 初始化门诊本量利图表
    initOutpatientBreakevenChart() {
        
        // 使用实际数据，如果没有则使用模拟数据
        const data = this.currentData?.breakevenData?.outpatient || this.generateBreakevenData().outpatient;
        
        this.safeInitChart('outpatient-breakeven-chart', () => ({
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            legend: {
                data: ['收入', '成本', '利润']
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
                data: data.months
            },
            yAxis: {
                type: 'value',
                name: '金额（万元）'
            },
            series: [
                {
                    name: '收入',
                    type: 'line',
                    data: data.revenue,
                    smooth: true,
                    itemStyle: {
                        color: '#0066cc'
                    },
                    markLine: {
                        data: [
                            {
                                type: 'average',
                                name: '平均收入'
                            }
                        ]
                    }
                },
                {
                    name: '成本',
                    type: 'line',
                    data: data.cost,
                    smooth: true,
                    itemStyle: {
                        color: '#f5222d'
                    }
                },
                {
                    name: '利润',
                    type: 'line',
                    data: (data.revenue && Array.isArray(data.revenue)) ? data.revenue.map((revenue, index) => revenue - data.cost[index]) : [],
                    smooth: true,
                    itemStyle: {
                        color: '#52c41a'
                    },
                    markLine: {
                        data: [
                            {
                                yAxis: 0,
                                name: '盈亏平衡点'
                            }
                        ]
                    }
                }
            ]
        }));
    }

    // 初始化住院本量利图表
    initInpatientBreakevenChart() {
        
        // 使用实际数据，如果没有则使用模拟数据
        const data = this.currentData?.breakevenData?.inpatient || this.generateBreakevenData().inpatient;
        
        this.safeInitChart('inpatient-breakeven-chart', () => ({
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            legend: {
                data: ['收入', '成本', '利润']
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
                data: data.months
            },
            yAxis: {
                type: 'value',
                name: '金额（万元）'
            },
            series: [
                {
                    name: '收入',
                    type: 'line',
                    data: data.revenue,
                    smooth: true,
                    itemStyle: {
                        color: '#0066cc'
                    },
                    markLine: {
                        data: [
                            {
                                type: 'average',
                                name: '平均收入'
                            }
                        ]
                    }
                },
                {
                    name: '成本',
                    type: 'line',
                    data: data.cost,
                    smooth: true,
                    itemStyle: {
                        color: '#f5222d'
                    }
                },
                {
                    name: '利润',
                    type: 'line',
                    data: (data.revenue && Array.isArray(data.revenue)) ? data.revenue.map((revenue, index) => revenue - data.cost[index]) : [],
                    smooth: true,
                    itemStyle: {
                        color: '#52c41a'
                    },
                    markLine: {
                        data: [
                            {
                                yAxis: 0,
                                name: '盈亏平衡点'
                            }
                        ]
                    }
                }
            ]
        }));
    }

    // 门诊本量利分析坐标系图表
    initOutpatientBreakevenCoordinateChart() {
        this.safeInitChart('outpatient-breakeven-coordinate-chart', () => ({
            title: {
                text: '门诊本量利分析坐标图',
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
                },
                formatter: function(params) {
                    let result = params[0].name + '<br/>';
                    params.forEach(param => {
                        if (param.seriesName === '收入') {
                            result += param.marker + param.seriesName + ': ¥' + param.value.toLocaleString() + '<br/>';
                        } else if (param.seriesName === '总成本') {
                            result += param.marker + param.seriesName + ': ¥' + param.value.toLocaleString() + '<br/>';
                        } else if (param.seriesName === '利润') {
                            result += param.marker + param.seriesName + ': ¥' + param.value.toLocaleString() + '<br/>';
                        }
                    });
                    return result;
                }
            },
            legend: {
                data: ['收入', '总成本', '利润', '盈亏平衡点'],
                top: 30
            },
            grid: {
                left: '10%',
                right: '10%',
                bottom: '15%',
                top: '20%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                name: '业务量（人次）',
                nameLocation: 'middle',
                nameGap: 30,
                data: [0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000],
                axisLabel: {
                    formatter: '{value}'
                }
            },
            yAxis: {
                type: 'value',
                name: '金额（万元）',
                nameLocation: 'middle',
                nameGap: 50,
                axisLabel: {
                    formatter: function(value) {
                        return (value / 10000).toFixed(1);
                    }
                }
            },
            series: [
                {
                    name: '收入',
                    type: 'line',
                    data: [0, 50000, 100000, 150000, 200000, 250000, 300000, 350000, 400000, 450000, 500000],
                    lineStyle: {
                        color: '#5470c6',
                        width: 3
                    },
                    itemStyle: {
                        color: '#5470c6'
                    }
                },
                {
                    name: '总成本',
                    type: 'line',
                    data: [80000, 120000, 160000, 200000, 240000, 280000, 320000, 360000, 400000, 440000, 480000],
                    lineStyle: {
                        color: '#fc8452',
                        width: 3
                    },
                    itemStyle: {
                        color: '#fc8452'
                    }
                },
                {
                    name: '利润',
                    type: 'line',
                    data: [-80000, -70000, -60000, -50000, -40000, -30000, -20000, -10000, 0, 10000, 20000],
                    lineStyle: {
                        color: '#91cc75',
                        width: 3
                    },
                    itemStyle: {
                        color: '#91cc75'
                    }
                },
                {
                    name: '盈亏平衡点',
                    type: 'scatter',
                    data: [[2850, 285000]],
                    symbolSize: 15,
                    itemStyle: {
                        color: '#ee6666'
                    },
                    label: {
                        show: true,
                        position: 'top',
                        formatter: '盈亏平衡点\n(2850人次)',
                        fontSize: 12,
                        color: '#ee6666'
                    }
                }
            ]
        }));
    }

    // 住院本量利分析坐标系图表
    initInpatientBreakevenCoordinateChart() {
        this.safeInitChart('inpatient-breakeven-coordinate-chart', () => ({
            title: {
                text: '住院本量利分析坐标图',
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
                },
                formatter: function(params) {
                    let result = params[0].name + '<br/>';
                    params.forEach(param => {
                        if (param.seriesName === '收入') {
                            result += param.marker + param.seriesName + ': ¥' + param.value.toLocaleString() + '<br/>';
                        } else if (param.seriesName === '总成本') {
                            result += param.marker + param.seriesName + ': ¥' + param.value.toLocaleString() + '<br/>';
                        } else if (param.seriesName === '利润') {
                            result += param.marker + param.seriesName + ': ¥' + param.value.toLocaleString() + '<br/>';
                        }
                    });
                    return result;
                }
            },
            legend: {
                data: ['收入', '总成本', '利润', '盈亏平衡点'],
                top: 30
            },
            grid: {
                left: '10%',
                right: '10%',
                bottom: '15%',
                top: '20%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                name: '业务量（床日）',
                nameLocation: 'middle',
                nameGap: 30,
                data: [0, 200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000],
                axisLabel: {
                    formatter: '{value}'
                }
            },
            yAxis: {
                type: 'value',
                name: '金额（万元）',
                nameLocation: 'middle',
                nameGap: 50,
                axisLabel: {
                    formatter: function(value) {
                        return (value / 10000).toFixed(1);
                    }
                }
            },
            series: [
                {
                    name: '收入',
                    type: 'line',
                    data: [0, 100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000, 900000, 1000000],
                    lineStyle: {
                        color: '#5470c6',
                        width: 3
                    },
                    itemStyle: {
                        color: '#5470c6'
                    }
                },
                {
                    name: '总成本',
                    type: 'line',
                    data: [150000, 230000, 310000, 390000, 470000, 550000, 630000, 710000, 790000, 870000, 950000],
                    lineStyle: {
                        color: '#fc8452',
                        width: 3
                    },
                    itemStyle: {
                        color: '#fc8452'
                    }
                },
                {
                    name: '利润',
                    type: 'line',
                    data: [-150000, -130000, -110000, -90000, -70000, -50000, -30000, -10000, 10000, 30000, 50000],
                    lineStyle: {
                        color: '#91cc75',
                        width: 3
                    },
                    itemStyle: {
                        color: '#91cc75'
                    }
                },
                {
                    name: '盈亏平衡点',
                    type: 'scatter',
                    data: [[1240, 620000]],
                    symbolSize: 15,
                    itemStyle: {
                        color: '#ee6666'
                    },
                    label: {
                        show: true,
                        position: 'top',
                        formatter: '盈亏平衡点\n(1240床日)',
                        fontSize: 12,
                        color: '#ee6666'
                    }
                }
            ]
        }));
    }

    // 更新表格数据
    updateTables(data) {
        // 只更新实际存在的数据
        if (data.departmentBenefit) {
            this.updateOverallTable(data.departmentBenefit);
        }
        // 更新病种效益明细表
        if (data.diseaseData) {
            this.updateDiseaseTable(data.diseaseData);
        }
        // 更新医疗服务项目明细表
        if (data.serviceData) {
            this.updateServiceTable(data.serviceData);
        }
        // 更新成本结构表格
        if (data.costData && data.costData.structure) {
            this.updateCostTable(data.costData.structure);
        }
        // 更新门诊效益表格
        if (data.outpatientData && data.outpatientData.departments) {
            this.updateOutpatientTable(data.outpatientData.departments);
        }
        // 更新住院效益表格
        if (data.inpatientData && data.inpatientData.departments) {
            this.updateInpatientTable(data.inpatientData.departments);
        }
        // 其他表格数据暂时注释掉，因为数据文件中不存在这些字段
        // this.updateEfficiencyTable(data.efficiencyData);
    }

    // 更新总体效益表格
    updateOverallTable(data) {
        const tbody = document.querySelector('#overall-detail-table tbody');
        tbody.innerHTML = '';
        
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${(item.revenue || 0).toFixed(1)}万元</td>
                <td>${(item.cost || 0).toFixed(1)}万元</td>
                <td>${(item.profit || 0).toFixed(1)}万元</td>
                <td>${(item.profitMargin || 0).toFixed(1)}%</td>
                <td class="${item.revenueGrowth > 0 ? 'positive' : 'negative'}">${item.revenueGrowth > 0 ? '↑' : '↓'} ${Math.abs(item.revenueGrowth || 0).toFixed(1)}%</td>
            `;
            tbody.appendChild(row);
        });
    }

    // 添加十字型悬停效果
    addCrossHoverEffect() {
        const table = document.querySelector('#disease-detail-table');
        if (!table) return;

        const rows = table.querySelectorAll('tbody tr');
        
        rows.forEach((row, rowIndex) => {
            const cells = row.querySelectorAll('td');
            
            cells.forEach((cell, cellIndex) => {
                // 鼠标进入单元格
                cell.addEventListener('mouseenter', () => {
                    // 病种名称（索引0）和病种编码（索引1）列不触发列高亮，只有行高亮
                    if (cellIndex === 0 || cellIndex === 1) {
                        // 只高亮当前行的所有单元格（除了当前单元格）
                        cells.forEach((c, i) => {
                            if (i !== cellIndex) {
                                c.classList.add('column-highlight');
                            }
                        });
                        // 当前单元格特殊高亮
                        cell.classList.add('cell-focus');
                    } else {
                        // 数字列只显示行高亮，不显示列高亮
                        // 高亮当前行的所有单元格（除了当前单元格）
                        cells.forEach((c, i) => {
                            if (i !== cellIndex) {
                                c.classList.add('column-highlight');
                            }
                        });
                        
                        // 当前单元格特殊高亮
                        cell.classList.add('cell-focus');
                    }
                });
                
                // 鼠标离开单元格
                cell.addEventListener('mouseleave', () => {
                    // 移除所有高亮效果
                    table.querySelectorAll('.column-highlight').forEach(c => {
                        c.classList.remove('column-highlight');
                    });
                    
                    table.querySelectorAll('.cell-focus').forEach(c => {
                        c.classList.remove('cell-focus');
                    });
                });
            });
        });
    }

    // 更新门诊效益表格
    updateOutpatientTable(data) {
        const tbody = document.querySelector('#outpatient-detail-table tbody');
        tbody.innerHTML = '';
        
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${(item.revenue || 0).toFixed(1)}万元</td>
                <td>${(item.cost || 0).toFixed(1)}万元</td>
                <td>${(item.benefit || 0).toFixed(1)}万元</td>
                <td>${(item.benefitRate || 0).toFixed(1)}%</td>
                <td>${(item.patients || 0).toLocaleString()}</td>
                <td>¥${(item.avgCost || 0).toFixed(0)}</td>
            `;
            tbody.appendChild(row);
        });
    }

    // 更新住院效益表格
    updateInpatientTable(data) {
        const tbody = document.querySelector('#inpatient-detail-table tbody');
        tbody.innerHTML = '';
        
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${(item.revenue || 0).toFixed(1)}万元</td>
                <td>${(item.cost || 0).toFixed(1)}万元</td>
                <td>${(item.benefit || 0).toFixed(1)}万元</td>
                <td>${(item.benefitRate || 0).toFixed(1)}%</td>
                <td>${(item.discharges || 0).toLocaleString()}</td>
                <td>${(item.avgDays || 0).toFixed(1)}天</td>
            `;
            tbody.appendChild(row);
        });
    }

    // 初始化病种筛选功能
    initDiseaseFilter() {
        const diseaseData = this.currentData?.diseaseData || this.generateDiseaseData();
        this.selectedDiseases = new Set(diseaseData.map(item => item.code)); // 默认全选
        this.allDiseases = diseaseData;
        
        this.renderDiseaseFilter();
        this.bindFilterEvents();
    }

    // 渲染病种筛选区域
    renderDiseaseFilter() {
        const dropdownOptions = document.getElementById('disease-dropdown-options');
        if (!dropdownOptions) return;
        
        dropdownOptions.innerHTML = '';
        
        this.allDiseases.forEach(disease => {
            const isSelected = this.selectedDiseases.has(disease.code);
            const option = document.createElement('div');
            option.className = `dropdown-option ${isSelected ? 'selected' : ''}`;
            option.innerHTML = `
                <input type="checkbox" class="disease-checkbox" 
                       data-disease-code="${disease.code}" 
                       ${isSelected ? 'checked' : ''}>
                <div class="option-content">
                    <span class="option-name" title="${disease.name}">${disease.name}</span>
                    <span class="option-count">${disease.cases}</span>
                </div>
            `;
            dropdownOptions.appendChild(option);
        });
        
        // 更新全选状态和显示文本
        this.updateSelectAllState();
        this.updateSelectedText();
    }

    // 绑定筛选事件
    bindFilterEvents() {
        // 下拉框触发器点击事件
        const dropdownTrigger = document.getElementById('disease-dropdown-trigger');
        const dropdownMenu = document.getElementById('disease-dropdown-menu');
        
        if (dropdownTrigger && dropdownMenu) {
            dropdownTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = dropdownMenu.classList.contains('show');
                if (isOpen) {
                    this.closeDropdown();
                } else {
                    this.openDropdown();
                }
            });
        }

        // 搜索框事件
        const searchInput = document.getElementById('disease-search-input');
        if (searchInput) {
            // 搜索输入事件
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
            
            // 阻止搜索框点击事件冒泡
            searchInput.addEventListener('click', (e) => {
                e.stopPropagation();
            });
            
            // 键盘导航
            searchInput.addEventListener('keydown', (e) => {
                this.handleSearchKeydown(e);
            });
        }

        // 点击其他地方关闭下拉框
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.disease-dropdown')) {
                this.closeDropdown();
            }
        });

        // 全选/取消全选
        const selectAllCheckbox = document.getElementById('select-all-diseases');
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', (e) => {
                const isChecked = e.target.checked;
                if (isChecked) {
                    this.selectedDiseases = new Set(this.allDiseases.map(item => item.code));
                } else {
                    this.selectedDiseases.clear();
                }
                this.renderDiseaseFilter();
                this.updateDiseaseTable();
            });
        }

        // 单个病种选择
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('disease-checkbox')) {
                const diseaseCode = e.target.getAttribute('data-disease-code');
                const isChecked = e.target.checked;
                
                if (isChecked) {
                    this.selectedDiseases.add(diseaseCode);
                } else {
                    this.selectedDiseases.delete(diseaseCode);
                }
                
                // 更新选中状态样式
                const option = e.target.closest('.dropdown-option');
                if (isChecked) {
                    option.classList.add('selected');
                } else {
                    option.classList.remove('selected');
                }
                
                this.updateSelectAllState();
                this.updateSelectedText();
                this.updateDiseaseTable();
            }
        });
    }

    // 打开下拉框
    openDropdown() {
        const dropdownTrigger = document.getElementById('disease-dropdown-trigger');
        const dropdownMenu = document.getElementById('disease-dropdown-menu');
        
        if (dropdownTrigger && dropdownMenu) {
            dropdownTrigger.classList.add('active');
            dropdownMenu.classList.add('show');
            
            // 让搜索框获得焦点
            setTimeout(() => {
                const searchInput = document.getElementById('disease-search-input');
                if (searchInput) {
                    searchInput.focus();
                }
            }, 100);
        }
    }

    // 关闭下拉框
    closeDropdown() {
        const dropdownTrigger = document.getElementById('disease-dropdown-trigger');
        const dropdownMenu = document.getElementById('disease-dropdown-menu');
        
        if (dropdownTrigger && dropdownMenu) {
            dropdownTrigger.classList.remove('active');
            dropdownMenu.classList.remove('show');
        }
        
        // 清空搜索框
        const searchInput = document.getElementById('disease-search-input');
        if (searchInput) {
            searchInput.value = '';
            this.handleSearch(''); // 重置搜索结果
        }
    }

    // 处理搜索
    handleSearch(searchTerm) {
        const dropdownOptions = document.getElementById('disease-dropdown-options');
        const noResults = document.getElementById('no-search-results');
        
        if (!dropdownOptions || !noResults) return;
        
        const searchTermLower = searchTerm.toLowerCase().trim();
        let hasVisibleResults = false;
        
        // 遍历所有选项
        const options = dropdownOptions.querySelectorAll('.dropdown-option');
        options.forEach(option => {
            const optionName = option.querySelector('.option-name');
            if (!optionName) return;
            
            const originalText = optionName.getAttribute('data-original-text') || optionName.textContent;
            if (!optionName.getAttribute('data-original-text')) {
                optionName.setAttribute('data-original-text', originalText);
            }
            
            if (searchTermLower === '') {
                // 没有搜索词，显示所有选项
                option.style.display = 'flex';
                option.classList.remove('search-matched');
                optionName.innerHTML = originalText;
                hasVisibleResults = true;
            } else {
                // 模糊匹配
                const isMatch = originalText.toLowerCase().includes(searchTermLower);
                
                if (isMatch) {
                    option.style.display = 'flex';
                    option.classList.add('search-matched');
                    
                    // 高亮匹配的文本
                    const highlightedText = this.highlightSearchTerm(originalText, searchTermLower);
                    optionName.innerHTML = highlightedText;
                    hasVisibleResults = true;
                } else {
                    option.style.display = 'none';
                    option.classList.remove('search-matched');
                }
            }
        });
        
        // 显示或隐藏"无结果"提示
        if (searchTermLower !== '' && !hasVisibleResults) {
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
        }
    }

    // 高亮搜索词
    highlightSearchTerm(text, searchTerm) {
        if (!searchTerm) return text;
        
        const regex = new RegExp(`(${this.escapeRegExp(searchTerm)})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }

    // 转义正则表达式特殊字符
    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // 处理搜索框键盘事件
    handleSearchKeydown(e) {
        const dropdownOptions = document.getElementById('disease-dropdown-options');
        if (!dropdownOptions) return;
        
        const visibleOptions = Array.from(dropdownOptions.querySelectorAll('.dropdown-option'))
            .filter(option => option.style.display !== 'none');
        
        if (visibleOptions.length === 0) return;
        
        let currentIndex = visibleOptions.findIndex(option => option.classList.contains('keyboard-focused'));
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (currentIndex < visibleOptions.length - 1) {
                    this.setKeyboardFocus(visibleOptions, currentIndex + 1);
                }
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                if (currentIndex > 0) {
                    this.setKeyboardFocus(visibleOptions, currentIndex - 1);
                }
                break;
                
            case 'Enter':
                e.preventDefault();
                if (currentIndex >= 0 && currentIndex < visibleOptions.length) {
                    const checkbox = visibleOptions[currentIndex].querySelector('input[type="checkbox"]');
                    if (checkbox) {
                        checkbox.click();
                    }
                }
                break;
                
            case 'Escape':
                e.preventDefault();
                this.closeDropdown();
                break;
        }
    }

    // 设置键盘焦点
    setKeyboardFocus(options, index) {
        // 移除所有焦点
        options.forEach(option => option.classList.remove('keyboard-focused'));
        
        // 设置新焦点
        if (index >= 0 && index < options.length) {
            options[index].classList.add('keyboard-focused');
            options[index].scrollIntoView({ block: 'nearest' });
        }
    }

    // 更新选中文本显示
    updateSelectedText() {
        const selectedText = document.getElementById('selected-disease-text');
        if (!selectedText) return;
        
        const totalCount = this.allDiseases.length;
        const selectedCount = this.selectedDiseases.size;
        
        if (selectedCount === 0) {
            selectedText.textContent = '请选择病种';
        } else if (selectedCount === totalCount) {
            selectedText.textContent = '已选择全部病种';
        } else {
            selectedText.textContent = `已选择 ${selectedCount} 个病种`;
        }
    }

    // 更新全选状态
    updateSelectAllState() {
        const selectAllCheckbox = document.getElementById('select-all-diseases');
        if (!selectAllCheckbox) return;
        
        const totalCount = this.allDiseases.length;
        const selectedCount = this.selectedDiseases.size;
        
        if (selectedCount === 0) {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = false;
        } else if (selectedCount === totalCount) {
            selectAllCheckbox.checked = true;
            selectAllCheckbox.indeterminate = false;
        } else {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = true;
        }
    }

    // 获取筛选后的病种数据
    getFilteredDiseaseData() {
        if (!this.allDiseases || !this.selectedDiseases) {
            return this.currentData?.diseaseData || this.generateDiseaseData();
        }
        
        return this.allDiseases.filter(disease => this.selectedDiseases.has(disease.code));
    }

    // 更新病种效益表格
    updateDiseaseTable(data) {
        const tbody = document.querySelector('#disease-detail-table tbody');
        tbody.innerHTML = '';
        
        // 如果没有传入数据，使用筛选后的数据
        const tableData = data || this.getFilteredDiseaseData();
        
        tableData.forEach(item => {
            const row = document.createElement('tr');
            const avgBenefit = item.avgBenefit || 0;
            const avgCost = item.avgCost || 0;
            const isLoss = avgBenefit < 0;
            
            // 计算保本例数：平均成本/平均结余，向下取整
            let breakevenCases;
            let breakevenDisplay;
            if (avgBenefit <= 0) {
                breakevenCases = '∞';
                breakevenDisplay = `<span class="infinity-symbol">∞</span><div class="breakeven-tooltip">亏损病种，无法保本</div>`;
            } else {
                breakevenCases = Math.floor(avgCost / avgBenefit);
                breakevenDisplay = `${breakevenCases.toLocaleString()}<div class="breakeven-tooltip">需要${breakevenCases}例才能保本</div>`;
            }
            
            // 如果是亏损病种，添加高亮样式
            if (isLoss) {
                row.classList.add('loss-row');
            }
            
            row.innerHTML = `
                <td>${item.code}</td>
                <td><span class="disease-name-link" data-disease-code="${item.code}" data-disease-name="${item.name}">${item.name}</span></td>
                <td>${(item.cases || 0).toLocaleString()}</td>
                <td class="breakeven-cell">${breakevenDisplay}</td>
                <td>¥${(item.avgRevenue || 0).toFixed(0)}</td>
                <td>¥${(item.avgCost || 0).toFixed(0)}</td>
                <td class="benefit-amount">¥${avgBenefit.toFixed(0)}</td>
                <td>${(item.benefitRate || 0).toFixed(1)}%</td>
            `;
            tbody.appendChild(row);
        });

        // 为病种名称链接添加点击事件
        document.querySelectorAll('.disease-name-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const diseaseCode = e.target.getAttribute('data-disease-code');
                const diseaseName = e.target.getAttribute('data-disease-name');
                this.showDiseaseDetail(diseaseCode, diseaseName);
            });
        });

        // 应用渐变背景色效果
        this.applyGradientBackgrounds();
        
        // 添加十字型悬停效果
        this.addCrossHoverEffect();
    }

    // 应用渐变背景色效果
    applyGradientBackgrounds() {
        const table = document.querySelector('#disease-detail-table');
        if (!table) return;

        const rows = table.querySelectorAll('tbody tr');
        if (rows.length === 0) return;

        // 定义需要应用渐变效果的列索引和对应的数据提取函数
        const numericColumns = [
            { 
                index: 2, // 病例数
                getValue: (cell) => parseInt(cell.textContent.replace(/,/g, '')) || 0,
                isDescending: true // 数值越大排序越高
            },
            { 
                index: 4, // 平均收入
                getValue: (cell) => parseFloat(cell.textContent.replace(/[¥,]/g, '')) || 0,
                isDescending: true
            },
            { 
                index: 5, // 平均成本
                getValue: (cell) => parseFloat(cell.textContent.replace(/[¥,]/g, '')) || 0,
                isDescending: true
            },
            { 
                index: 6, // 平均结余
                getValue: (cell) => parseFloat(cell.textContent.replace(/[¥,]/g, '')) || 0,
                isDescending: true
            },
            { 
                index: 7, // 结余率
                getValue: (cell) => parseFloat(cell.textContent.replace(/%/g, '')) || 0,
                isDescending: true
            }
        ];

        // 清除保本例数列(索引3)的所有渐变样式
        rows.forEach(row => {
            const breakevenCell = row.cells[3]; // 保本例数列
            if (breakevenCell) {
                // 清除所有渐变样式类
                for (let i = 1; i <= 10; i++) {
                    breakevenCell.classList.remove(`gradient-level-${i}`);
                }
                breakevenCell.classList.remove('numeric-cell');
            }
        });

        // 为每个数字列应用渐变效果
        numericColumns.forEach(column => {
            // 收集该列的所有值和对应的单元格
            const columnData = [];
            rows.forEach((row, rowIndex) => {
                const cell = row.cells[column.index];
                if (cell) {
                    const value = column.getValue(cell);
                    columnData.push({ cell, value, rowIndex });
                }
            });

            // 按值排序
            columnData.sort((a, b) => {
                if (column.isDescending) {
                    return b.value - a.value; // 降序：值越大排序越高
                } else {
                    return a.value - b.value; // 升序：值越小排序越高
                }
            });

            // 应用渐变背景色
            columnData.forEach((item, sortIndex) => {
                const cell = item.cell;
                
                // 清除之前的渐变样式
                for (let i = 1; i <= 10; i++) {
                    cell.classList.remove(`gradient-level-${i}`);
                }
                
                // 添加numeric-cell类
                cell.classList.add('numeric-cell');
                
                // 计算渐变等级 (1-10)
                const totalItems = columnData.length;
                let gradientLevel;
                
                if (totalItems === 1) {
                    gradientLevel = 5; // 只有一个值时使用中等强度
                } else {
                    // 使用更平滑的渐变计算，确保排序最高的是最浓的
                    const normalizedPosition = sortIndex / (totalItems - 1); // 0到1之间
                    gradientLevel = Math.ceil((1 - normalizedPosition) * 10); // 反转，使排序最高的最浓
                    gradientLevel = Math.max(1, Math.min(10, gradientLevel));
                }
                
                // 应用渐变样式
                cell.classList.add(`gradient-level-${gradientLevel}`);
                
                // 为负数值添加特殊样式
                if (item.value < 0) {
                    cell.classList.add('negative-value');
                }
            });
        });
    }

    // 更新服务项目效益表格
    updateServiceTable(data) {
        const tbody = document.querySelector('#service-detail-table tbody');
        tbody.innerHTML = '';
        
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.code}</td>
                <td>${item.name}</td>
                <td>${(item.quantity || 0).toLocaleString()}</td>
                <td>¥${((item.revenue || 0) / 10000).toFixed(1)}万</td>
                <td>¥${((item.cost || 0) / 10000).toFixed(1)}万</td>
                <td>¥${((item.benefit || 0) / 10000).toFixed(1)}万</td>
                <td>${(item.benefitRate || 0).toFixed(1)}%</td>
            `;
            tbody.appendChild(row);
        });
    }

    // 更新成本结构表格
    updateCostTable(data) {
        const tbody = document.querySelector('#cost-structure-table tbody');
        tbody.innerHTML = '';
        
        data.forEach(item => {
            const row = document.createElement('tr');
            const trendIcon = item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '→';
            const trendClass = item.trend === 'up' ? 'positive' : item.trend === 'down' ? 'negative' : 'stable';
            
            row.innerHTML = `
                <td>${item.item}</td>
                <td>${(item.current || 0).toFixed(1)}万元</td>
                <td>${(item.proportion || 0).toFixed(1)}%</td>
                <td>${(item.previous || 0).toFixed(1)}万元</td>
                <td class="${trendClass}">${trendIcon} ${Math.abs(item.change || 0).toFixed(1)}%</td>
                <td class="${trendClass}">${trendIcon}</td>
            `;
            tbody.appendChild(row);
        });
    }
    
    // 更新人员效率表格
    updateEfficiencyTable(data) {
        const tbody = document.querySelector('#efficiency-table tbody');
        tbody.innerHTML = '';
        
        data.departments.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.doctors}</td>
                <td>${item.outpatients.toLocaleString()}</td>
                <td>${item.outpatientPerDoctor.toLocaleString()}</td>
                <td>${item.inpatients.toLocaleString()}</td>
                <td>${item.inpatientPerDoctor.toLocaleString()}</td>
                <td>${item.revenue.toLocaleString()}</td>
                <td>${item.revenuePerDoctor.toLocaleString()}</td>
                <td>${item.profit.toLocaleString()}</td>
                <td>${item.profitPerDoctor.toLocaleString()}</td>
            `;
            tbody.appendChild(row);
        });
    }
    
    // 初始化人员效率图表
    initEfficiencyCharts() {
        this.initDepartmentEfficiencyChart();
        this.initDoctorIncomeStructureChart();
        this.updateEfficiencyIndicators();
    }
    
    // 初始化科室效率对比图表
    initDepartmentEfficiencyChart() {
        // 使用实际数据，如果没有则使用模拟数据
        let data = this.currentData?.efficiencyData?.departments || this.generateEfficiencyData().departments;
        
        // 确保data是数组且不为空
        if (!Array.isArray(data) || data.length === 0) {
            data = this.generateEfficiencyData().departments;
        }
        
        this.safeInitChart('department-efficiency-chart', () => ({
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['每医生门急诊人次', '每医生出院人次', '每医生收入(万元)', '每医生贡献利润(万元)']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: (data && Array.isArray(data)) ? data.map(item => item.name) : []
            },
            yAxis: [
                {
                    type: 'value',
                    name: '人次',
                    position: 'left',
                    axisLabel: {
                        formatter: '{value}'
                    }
                },
                {
                    type: 'value',
                    name: '金额(万元)',
                    position: 'right',
                    axisLabel: {
                        formatter: '{value}'
                    }
                }
            ],
            series: [
                {
                    name: '每医生门急诊人次',
                    type: 'bar',
                    data: (data && Array.isArray(data)) ? data.map(item => item.outpatientPerDoctor) : [],
                    itemStyle: {
                        color: '#0066cc'
                    }
                },
                {
                    name: '每医生出院人次',
                    type: 'bar',
                    data: (data && Array.isArray(data)) ? data.map(item => item.inpatientPerDoctor) : [],
                    itemStyle: {
                        color: '#52c41a'
                    }
                },
                {
                    name: '每医生收入(万元)',
                    type: 'line',
                    yAxisIndex: 1,
                    data: (data && Array.isArray(data)) ? data.map(item => item.revenuePerDoctor) : [],
                    itemStyle: {
                        color: '#faad14'
                    }
                },
                {
                    name: '每医生贡献利润(万元)',
                    type: 'line',
                    yAxisIndex: 1,
                    data: (data && Array.isArray(data)) ? data.map(item => item.profitPerDoctor) : [],
                    itemStyle: {
                        color: '#f5222d'
                    }
                }
            ]
        }));
    }
    
    // 初始化医生收入构成图表
    initDoctorIncomeStructureChart() {
        // 使用实际数据，如果没有则使用模拟数据
        const data = this.currentData?.efficiencyData?.incomeStructure || this.generateEfficiencyData().incomeStructure;
        
        this.safeInitChart('doctor-income-structure-chart', () => ({
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
                    name: '每医生收入构成',
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
                    data: data
                }
            ]
        }));
    }
    
    // 更新人员效率概览指标
    updateEfficiencyIndicators() {
        const data = this.getMockData().efficiencyData.averages;
        
        document.getElementById('avg-outpatient-per-doctor-value').textContent = data.outpatientPerDoctor.toLocaleString();
        document.getElementById('avg-inpatient-per-doctor-value').textContent = data.inpatientPerDoctor.toLocaleString();
        document.getElementById('avg-income-per-doctor-value').textContent = '¥' + data.revenuePerDoctor.toLocaleString() + '万';
        document.getElementById('avg-profit-per-doctor-value').textContent = '¥' + data.profitPerDoctor.toLocaleString() + '万';
    }

    // 刷新数据
    refreshData() {
        this.loadData();
        this.showMessage('数据已刷新', 'success');
    }

    // 导出数据
    exportData() {
        this.showMessage('正在导出报表...', 'info');
        setTimeout(() => {
            this.showMessage('报表导出成功', 'success');
        }, 2000);
    }

    // 显示消息
    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    // 窗口大小改变时重新调整图表
    resizeCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.resize) {
                chart.resize();
            }
        });
    }

    // 防抖函数
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 显示病种详情弹窗
    showDiseaseDetail(diseaseCode, diseaseName) {
        console.log(`[EconomicBenefit] 显示病种详情: ${diseaseCode} - ${diseaseName}`);
        
        // 设置弹窗标题
        document.getElementById('disease-detail-title').textContent = `${diseaseCode} - ${diseaseName}`;
        
        // 生成病种详细数据
        const diseaseDetailData = this.generateDiseaseDetailData(diseaseCode, diseaseName);
        
        // 先显示弹窗
        document.getElementById('disease-detail-modal').style.display = 'block';
        
        // 添加弹窗关闭事件
        this.setupModalEvents();
        
        // 延迟渲染图表，确保容器已经有正确的尺寸
        setTimeout(() => {
            // 渲染收入构成图表
            this.renderDiseaseRevenueChart(diseaseDetailData.revenueStructure);
            
            // 渲染成本构成图表
            this.renderDiseaseCostChart(diseaseDetailData.costStructure);
            
            // 渲染科室明细
            this.renderDepartmentDetails(diseaseDetailData.departments);
        }, 100);
    }

    // 生成病种详细数据
    generateDiseaseDetailData(diseaseCode, diseaseName) {
        // 模拟收入构成数据
        const revenueStructure = {
            categories: ['床位费', '诊疗费', '手术费', '药品费', '检查费', '化验费', '材料费'],
            values: [1200, 800, 3500, 2800, 1500, 600, 1800],
            colors: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452']
        };

        // 模拟成本构成数据
        const costStructure = {
            categories: ['人员成本', '药品成本', '耗材成本', '设备折旧', '房屋折旧', '管理费用'],
            values: [3200, 2400, 1800, 800, 400, 600],
            colors: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272']
        };

        // 模拟科室数据
        const departments = [
            {
                name: '心内科',
                cases: 85,
                avgRevenue: 12800,
                avgCost: 10800,
                avgBenefit: 2000,
                doctors: [
                    { 
                        id: 'doctor_001', 
                        name: '张主任', 
                        title: '主任医师', 
                        cases: 35, 
                        avgRevenue: 13200, 
                        avgCost: 11000, 
                        avgBenefit: 2200,
                        diseases: [
                            { name: '冠心病', cases: 15, revenue: 14000, cost: 11500 },
                            { name: '心律失常', cases: 12, revenue: 12800, cost: 10800 },
                            { name: '高血压', cases: 8, revenue: 11500, cost: 9800 }
                        ]
                    },
                    { 
                        id: 'doctor_002', 
                        name: '李医生', 
                        title: '副主任医师', 
                        cases: 28, 
                        avgRevenue: 12600, 
                        avgCost: 10700, 
                        avgBenefit: 1900,
                        diseases: [
                            { name: '冠心病', cases: 12, revenue: 13500, cost: 11200 },
                            { name: '心律失常', cases: 10, revenue: 12200, cost: 10500 },
                            { name: '心肌炎', cases: 6, revenue: 11800, cost: 10200 }
                        ]
                    },
                    { 
                        id: 'doctor_003', 
                        name: '王医生', 
                        title: '主治医师', 
                        cases: 22, 
                        avgRevenue: 9800, 
                        avgCost: 12500, 
                        avgBenefit: -2700,
                        diseases: [
                            { name: '心肌梗死', cases: 8, revenue: 8500, cost: 15000 },
                            { name: '心衰', cases: 9, revenue: 10200, cost: 12800 },
                            { name: '心律失常', cases: 5, revenue: 11500, cost: 9200 }
                        ]
                    }
                ]
            },
            {
                name: '心外科',
                cases: 45,
                avgRevenue: 25000,
                avgCost: 22000,
                avgBenefit: 3000,
                doctors: [
                    { 
                        id: 'doctor_004', 
                        name: '陈主任', 
                        title: '主任医师', 
                        cases: 25, 
                        avgRevenue: 26000, 
                        avgCost: 22500, 
                        avgBenefit: 3500,
                        diseases: [
                            { name: '心脏瓣膜病', cases: 10, revenue: 28000, cost: 24000 },
                            { name: '先心病', cases: 8, revenue: 25000, cost: 21500 },
                            { name: '冠脉搭桥', cases: 7, revenue: 24500, cost: 21800 }
                        ]
                    },
                    { 
                        id: 'doctor_005', 
                        name: '刘医生', 
                        title: '副主任医师', 
                        cases: 20, 
                        avgRevenue: 18500, 
                        avgCost: 22000, 
                        avgBenefit: -3500,
                        diseases: [
                            { name: '心脏瓣膜病', cases: 6, revenue: 16000, cost: 25000 },
                            { name: '先心病', cases: 8, revenue: 19500, cost: 21500 },
                            { name: '心脏移植', cases: 6, revenue: 20000, cost: 20500 }
                        ]
                    }
                ]
            },
            {
                name: 'ICU',
                cases: 25,
                avgRevenue: 35000,
                avgCost: 32000,
                avgBenefit: 3000,
                doctors: [
                    { 
                        id: 'doctor_006', 
                        name: '赵主任', 
                        title: '主任医师', 
                        cases: 15, 
                        avgRevenue: 36000, 
                        avgCost: 32500, 
                        avgBenefit: 3500,
                        diseases: [
                            { name: '重症肺炎', cases: 6, revenue: 38000, cost: 34000 },
                            { name: '多器官衰竭', cases: 5, revenue: 35000, cost: 32000 },
                            { name: '急性心梗', cases: 4, revenue: 34500, cost: 31500 }
                        ]
                    },
                    { 
                        id: 'doctor_007', 
                        name: '孙医生', 
                        title: '副主任医师', 
                        cases: 10, 
                        avgRevenue: 33000, 
                        avgCost: 31000, 
                        avgBenefit: 2000,
                        diseases: [
                            { name: '重症肺炎', cases: 4, revenue: 34000, cost: 31500 },
                            { name: '脓毒症', cases: 3, revenue: 32500, cost: 30800 },
                            { name: '急性肾衰', cases: 3, revenue: 32000, cost: 30500 }
                        ]
                    }
                ]
            }
        ];

        return {
            revenueStructure,
            costStructure,
            departments
        };
    }

    // 渲染病种收入构成图表
    renderDiseaseRevenueChart(data) {
        console.log('[EconomicBenefit] 开始渲染收入构成图表', data);
        const chartDom = document.getElementById('disease-revenue-chart');
        if (!chartDom) {
            console.error('[EconomicBenefit] 收入图表容器未找到');
            return;
        }
        
        console.log('[EconomicBenefit] 图表容器尺寸:', chartDom.offsetWidth, 'x', chartDom.offsetHeight);
        const chart = echarts.init(chartDom);
        
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                textStyle: {
                    fontSize: 12
                }
            },
            series: [
                {
                    name: '收入构成',
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
                    data: data.categories.map((name, index) => ({
                        name: name,
                        value: data.values[index],
                        itemStyle: {
                            color: data.colors[index]
                        }
                    }))
                }
            ]
        };
        
        chart.setOption(option);
        
        // 确保图表正确渲染
        setTimeout(() => {
            chart.resize();
        }, 50);
    }

    // 渲染病种成本构成图表
    renderDiseaseCostChart(data) {
        console.log('[EconomicBenefit] 开始渲染成本构成图表', data);
        const chartDom = document.getElementById('disease-cost-chart');
        if (!chartDom) {
            console.error('[EconomicBenefit] 成本图表容器未找到');
            return;
        }
        
        console.log('[EconomicBenefit] 图表容器尺寸:', chartDom.offsetWidth, 'x', chartDom.offsetHeight);
        const chart = echarts.init(chartDom);
        
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                textStyle: {
                    fontSize: 12
                }
            },
            series: [
                {
                    name: '成本构成',
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
                    data: data.categories.map((name, index) => ({
                        name: name,
                        value: data.values[index],
                        itemStyle: {
                            color: data.colors[index]
                        }
                    }))
                }
            ]
        };
        
        chart.setOption(option);
        
        // 确保图表正确渲染
        setTimeout(() => {
            chart.resize();
        }, 50);
    }

    // 渲染科室明细
    renderDepartmentDetails(departments) {
        const container = document.getElementById('department-details');
        container.innerHTML = '';
        
        departments.forEach(dept => {
            const deptElement = document.createElement('div');
            deptElement.className = 'department-item';
            
            deptElement.innerHTML = `
                <div class="department-header" data-dept="${dept.name}">
                    <div class="department-name">${dept.name}</div>
                    <div class="department-stats">
                        <span>病例数: ${dept.cases}</span>
                        <span>平均收入: ¥${dept.avgRevenue.toLocaleString()}</span>
                        <span>平均成本: ¥${dept.avgCost.toLocaleString()}</span>
                        <span>平均结余: ¥${dept.avgBenefit.toLocaleString()}</span>
                    </div>
                    <div class="department-toggle">▼</div>
                </div>
                <div class="doctor-list">
                    <div class="doctor-grid">
                        ${dept.doctors.map(doctor => `
                            <div class="doctor-card clickable" 
                                 data-doctor-id="${doctor.id}" 
                                 data-doctor-name="${doctor.name}" 
                                 data-doctor-title="${doctor.title}"
                                 data-department="${dept.name}">
                                <div class="doctor-name">${doctor.name} (${doctor.title})</div>
                                <div class="doctor-stats">
                                    <span>病例数: ${doctor.cases}</span>
                                    <span>平均收入: ¥${doctor.avgRevenue.toLocaleString()}</span>
                                    <span>平均成本: ¥${doctor.avgCost.toLocaleString()}</span>
                                    <span class="${doctor.avgBenefit < 0 ? 'loss-amount' : ''}">平均结余: ¥${doctor.avgBenefit.toLocaleString()}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            
            container.appendChild(deptElement);
        });
        
        // 添加科室展开/收起功能
        container.querySelectorAll('.department-header').forEach(header => {
            header.addEventListener('click', () => {
                const doctorList = header.nextElementSibling;
                const toggle = header.querySelector('.department-toggle');
                
                if (doctorList.classList.contains('show')) {
                    doctorList.classList.remove('show');
                    toggle.classList.remove('expanded');
                } else {
                    doctorList.classList.add('show');
                    toggle.classList.add('expanded');
                }
            });
        });
    }

    // 设置弹窗事件
    setupModalEvents() {
        const modal = document.getElementById('disease-detail-modal');
        const closeBtn = document.getElementById('disease-detail-close');
        
        // 关闭按钮事件
        closeBtn.onclick = () => {
            modal.style.display = 'none';
        };
        
        // 点击背景关闭
        modal.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
        
        // ESC键关闭
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });
    }
}

// 全局函数
function switchTab(tabName, event) {
    if (window.economicBenefitPage) {
        window.economicBenefitPage.switchTab(tabName, event);
    }
}

function refreshData() {
    if (window.economicBenefitPage) {
        window.economicBenefitPage.refreshData();
    }
}

function exportData() {
    if (window.economicBenefitPage) {
        window.economicBenefitPage.exportData();
    }
}

function getMockData() {
    if (window.economicBenefitPage) {
        return window.economicBenefitPage.getMockData();
    }
    return null;
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('[EconomicBenefit] DOM内容已加载完成');
    
    // 确保ECharts库已加载
    if (typeof echarts === 'undefined') {
        console.error('[EconomicBenefit] ECharts库未加载');
        return;
    }
    
    // 初始化经济效益页面
    try {
        window.economicBenefitPage = new EconomicBenefitPage();
        window.economicBenefitPage.init();
        console.log('[EconomicBenefit] 页面初始化成功');
    } catch (error) {
        console.error('[EconomicBenefit] 页面初始化失败:', error);
    }
});

// 医生画像功能
class DoctorProfileManager {
    constructor() {
        this.modal = null;
        this.currentDoctorData = null;
        this.charts = {};
    }

    init() {
        this.modal = document.getElementById('doctor-profile-modal');
        this.bindEvents();
    }

    bindEvents() {
        // 绑定医生卡片点击事件
        document.addEventListener('click', (e) => {
            const doctorCard = e.target.closest('.doctor-card.clickable');
            if (doctorCard) {
                const doctorId = doctorCard.dataset.doctorId;
                const doctorName = doctorCard.dataset.doctorName;
                const doctorTitle = doctorCard.dataset.doctorTitle;
                const department = doctorCard.dataset.department;
                
                this.showDoctorProfile(doctorId, doctorName, doctorTitle, department);
            }
        });

        // 绑定关闭按钮事件
        const closeBtn = document.getElementById('doctor-profile-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideDoctorProfile();
            });
        }

        // 点击模态框背景关闭
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.hideDoctorProfile();
                }
            });
        }
    }

    showDoctorProfile(doctorId, doctorName, doctorTitle, department) {
        // 获取医生详细数据
        this.currentDoctorData = this.getDoctorDetailData(doctorId, doctorName, doctorTitle, department);
        
        if (!this.currentDoctorData) {
            console.error('医生数据未找到:', doctorId);
            return;
        }

        // 更新弹窗标题和基本信息
        this.updateDoctorBasicInfo();
        
        // 显示弹窗
        this.modal.style.display = 'block';
        
        // 延迟渲染图表，确保容器可见
        setTimeout(() => {
            this.renderDoctorCharts();
            this.renderDoctorTable();
        }, 100);
    }

    hideDoctorProfile() {
        if (this.modal) {
            this.modal.style.display = 'none';
        }
        
        // 销毁图表
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.dispose();
            }
        });
        this.charts = {};
    }

    getDoctorDetailData(doctorId, doctorName, doctorTitle, department) {
        // 从现有数据中查找医生信息
        const diseaseData = window.economicBenefitPage.generateDiseaseDetailData();
        const departments = diseaseData.departments;
        
        for (const dept of departments) {
            const doctor = dept.doctors.find(d => d.id === doctorId);
            if (doctor) {
                return {
                    ...doctor,
                    department: dept.name
                };
            }
        }
        
        return null;
    }

    updateDoctorBasicInfo() {
        const data = this.currentDoctorData;
        
        document.getElementById('doctor-name-info').textContent = data.name;
        document.getElementById('doctor-title-info').textContent = data.title;
        document.getElementById('doctor-dept-info').textContent = data.department;
        document.getElementById('doctor-cases-info').textContent = data.cases;
        document.getElementById('doctor-revenue-info').textContent = `¥${data.avgRevenue.toLocaleString()}`;
        document.getElementById('doctor-cost-info').textContent = `¥${data.avgCost.toLocaleString()}`;
        
        const benefitElement = document.getElementById('doctor-benefit-info');
        benefitElement.textContent = `¥${data.avgBenefit.toLocaleString()}`;
        
        const statusElement = document.getElementById('doctor-status-info');
        if (data.avgBenefit >= 0) {
            benefitElement.className = 'info-value profit';
            statusElement.textContent = '盈利';
            statusElement.className = 'info-value profit';
        } else {
            benefitElement.className = 'info-value loss';
            statusElement.textContent = '亏损';
            statusElement.className = 'info-value loss';
        }
    }

    renderDoctorCharts() {
        this.renderDoctorRevenueChart();
        this.renderDoctorCostChart();
        this.renderDoctorDiseaseChart();
        this.renderDoctorEfficiencyChart();
    }

    renderDoctorRevenueChart() {
        const chartDom = document.getElementById('doctor-revenue-chart');
        if (!chartDom) return;

        const chart = echarts.init(chartDom);
        this.charts.revenue = chart;

        const data = this.currentDoctorData;
        const diseases = data.diseases || [];
        
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: ¥{c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: diseases.map(d => d.name)
            },
            series: [
                {
                    name: '收入构成',
                    type: 'pie',
                    radius: ['40%', '70%'],
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
                    data: diseases.map(disease => ({
                        value: disease.revenue * disease.cases,
                        name: disease.name
                    }))
                }
            ]
        };

        chart.setOption(option);
        
        setTimeout(() => {
            chart.resize();
        }, 50);
    }

    renderDoctorCostChart() {
        const chartDom = document.getElementById('doctor-cost-chart');
        if (!chartDom) return;

        const chart = echarts.init(chartDom);
        this.charts.cost = chart;

        const data = this.currentDoctorData;
        const diseases = data.diseases || [];
        
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: ¥{c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: diseases.map(d => d.name)
            },
            series: [
                {
                    name: '成本构成',
                    type: 'pie',
                    radius: ['40%', '70%'],
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
                    data: diseases.map(disease => ({
                        value: disease.cost * disease.cases,
                        name: disease.name
                    }))
                }
            ]
        };

        chart.setOption(option);
        
        setTimeout(() => {
            chart.resize();
        }, 50);
    }

    renderDoctorDiseaseChart() {
        const chartDom = document.getElementById('doctor-disease-chart');
        if (!chartDom) return;

        const chart = echarts.init(chartDom);
        this.charts.disease = chart;

        const data = this.currentDoctorData;
        const diseases = data.diseases || [];
        
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['病例数']
            },
            xAxis: {
                type: 'category',
                data: diseases.map(d => d.name),
                axisLabel: {
                    rotate: 45
                }
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '病例数',
                    type: 'bar',
                    data: diseases.map(disease => disease.cases),
                    itemStyle: {
                        color: '#1976d2'
                    }
                }
            ]
        };

        chart.setOption(option);
        
        setTimeout(() => {
            chart.resize();
        }, 50);
    }

    renderDoctorEfficiencyChart() {
        const chartDom = document.getElementById('doctor-efficiency-chart');
        if (!chartDom) return;

        const chart = echarts.init(chartDom);
        this.charts.efficiency = chart;

        const data = this.currentDoctorData;
        const diseases = data.diseases || [];
        
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
                data: ['平均收入', '平均成本', '结余']
            },
            xAxis: [
                {
                    type: 'category',
                    data: diseases.map(d => d.name),
                    axisPointer: {
                        type: 'shadow'
                    },
                    axisLabel: {
                        rotate: 45
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '金额(元)',
                    axisLabel: {
                        formatter: '¥{value}'
                    }
                }
            ],
            series: [
                {
                    name: '平均收入',
                    type: 'bar',
                    data: diseases.map(disease => disease.revenue),
                    itemStyle: {
                        color: '#28a745'
                    }
                },
                {
                    name: '平均成本',
                    type: 'bar',
                    data: diseases.map(disease => disease.cost),
                    itemStyle: {
                        color: '#dc3545'
                    }
                },
                {
                    name: '结余',
                    type: 'line',
                    yAxisIndex: 0,
                    data: diseases.map(disease => disease.revenue - disease.cost),
                    itemStyle: {
                        color: '#1976d2'
                    }
                }
            ]
        };

        chart.setOption(option);
        
        setTimeout(() => {
            chart.resize();
        }, 50);
    }

    renderDoctorTable() {
        const tbody = document.getElementById('doctor-disease-tbody');
        if (!tbody) return;

        const data = this.currentDoctorData;
        const diseases = data.diseases || [];
        
        // 计算总收入和总成本用于占比计算
        const totalRevenue = diseases.reduce((sum, d) => sum + (d.revenue * d.cases), 0);
        const totalCost = diseases.reduce((sum, d) => sum + (d.cost * d.cases), 0);
        
        tbody.innerHTML = diseases.map(disease => {
            const revenue = disease.revenue * disease.cases;
            const cost = disease.cost * disease.cases;
            const benefit = revenue - cost;
            const revenuePercent = ((revenue / totalRevenue) * 100).toFixed(1);
            const costPercent = ((cost / totalCost) * 100).toFixed(1);
            
            return `
                <tr class="${benefit < 0 ? 'loss-row' : ''}">
                    <td>${disease.name}</td>
                    <td>${disease.cases}</td>
                    <td>¥${disease.revenue.toLocaleString()}</td>
                    <td>¥${disease.cost.toLocaleString()}</td>
                    <td class="${benefit < 0 ? 'benefit-amount' : ''}">¥${(disease.revenue - disease.cost).toLocaleString()}</td>
                    <td>${revenuePercent}%</td>
                    <td>${costPercent}%</td>
                </tr>
            `;
        }).join('');
    }
}

// 初始化医生画像管理器
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.doctorProfileManager = new DoctorProfileManager();
        window.doctorProfileManager.init();
        console.log('[DoctorProfile] 医生画像管理器初始化成功');
    }, 1000);
});

// 表格导出功能
class TableExporter {
    constructor() {
        this.initEventListeners();
    }

    initEventListeners() {
        const exportBtn = document.getElementById('export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportToExcel('efficiency-table', '人员效率与效益分析'));
        }

        const diseaseExportBtn = document.getElementById('disease-export-btn');
        if (diseaseExportBtn) {
            diseaseExportBtn.addEventListener('click', () => this.exportToExcel('disease-detail-table', '病种效益明细'));
        }
    }

    exportToExcel(tableId = 'efficiency-table', sheetName = '数据表') {
        try {
            const table = document.getElementById(tableId);
            if (!table) {
                alert('未找到表格数据');
                return;
            }

            // 创建工作簿
            const wb = XLSX.utils.book_new();
            
            // 获取表格数据
            const tableData = this.getTableData(table);
            
            // 创建工作表
            const ws = XLSX.utils.aoa_to_sheet(tableData);
            
            // 根据不同表格设置不同的列宽
            let colWidths;
            if (tableId === 'disease-detail-table') {
                colWidths = [
                    { wch: 15 }, // 病种编码
                    { wch: 25 }, // 病种名称
                    { wch: 10 }, // 病例数
                    { wch: 12 }, // 保本例数
                    { wch: 15 }, // 平均收入
                    { wch: 15 }, // 平均成本
                    { wch: 15 }, // 平均结余
                    { wch: 12 }  // 结余率
                ];
            } else {
                colWidths = [
                    { wch: 20 }, // 科室名称
                    { wch: 10 }, // 医生人数
                    { wch: 15 }, // 门急诊人次
                    { wch: 18 }, // 每医生门急诊人次
                    { wch: 12 }, // 出院人次
                    { wch: 18 }, // 每医生出院人次
                    { wch: 18 }, // 科室总收入
                    { wch: 18 }  // 每医生收入
                ];
            }
            ws['!cols'] = colWidths;
            
            // 添加工作表到工作簿
            XLSX.utils.book_append_sheet(wb, ws, sheetName);
            
            // 生成文件名
            const now = new Date();
            const fileName = `${sheetName}表_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}.xlsx`;
            
            // 导出文件
            XLSX.writeFile(wb, fileName);
            
            // 显示成功消息
            this.showExportSuccess(fileName);
            
        } catch (error) {
            console.error('导出失败:', error);
            // 如果XLSX库不可用，使用CSV导出作为备选方案
            this.exportToCSV(tableId, sheetName);
        }
    }

    exportToCSV(tableId = 'efficiency-table', sheetName = '数据表') {
        try {
            const table = document.getElementById(tableId);
            if (!table) {
                alert('未找到表格数据');
                return;
            }

            const tableData = this.getTableData(table);
            
            // 转换为CSV格式
            const csvContent = tableData.map(row => 
                row.map(cell => `"${cell}"`).join(',')
            ).join('\n');
            
            // 添加BOM以支持中文
            const BOM = '\uFEFF';
            const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
            
            // 创建下载链接
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            
            const now = new Date();
            const fileName = `${sheetName}表_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}.csv`;
            link.setAttribute('download', fileName);
            
            // 触发下载
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showExportSuccess(fileName);
            
        } catch (error) {
            console.error('CSV导出失败:', error);
            alert('导出失败，请稍后重试');
        }
    }

    getTableData(table) {
        const data = [];
        const rows = table.querySelectorAll('tr');
        
        rows.forEach(row => {
            const rowData = [];
            const cells = row.querySelectorAll('th, td');
            cells.forEach(cell => {
                rowData.push(cell.textContent.trim());
            });
            if (rowData.length > 0) {
                data.push(rowData);
            }
        });
        
        return data;
    }

    showExportSuccess(fileName) {
        // 创建成功提示
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #52c41a;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-size: 14px;
            animation: slideIn 0.3s ease;
        `;
        toast.innerHTML = `✅ 导出成功：${fileName}`;
        
        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(toast);
        
        // 3秒后自动移除
        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// AI洞察功能
class AIInsightAnalyzer {
    constructor() {
        this.modal = document.getElementById('ai-insight-modal');
        this.content = document.getElementById('ai-analysis-content');
        this.closeBtn = document.querySelector('.ai-insight-close');
        this.initEventListeners();
    }

    initEventListeners() {
        const aiBtn = document.getElementById('ai-insight-btn');
        if (aiBtn) {
            aiBtn.addEventListener('click', () => this.showAIInsight('efficiency'));
        }

        const diseaseAiBtn = document.getElementById('disease-ai-insight-btn');
        if (diseaseAiBtn) {
            diseaseAiBtn.addEventListener('click', () => this.showAIInsight('disease'));
        }

        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeModal());
        }

        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.closeModal();
                }
            });
        }
    }

    showAIInsight(analysisType = 'efficiency') {
        if (!this.modal || !this.content) return;
        
        this.modal.style.display = 'block';
        this.content.innerHTML = '<div class="typing-indicator"></div> AI正在分析表格数据...';
        
        // 模拟AI逐行输出
        setTimeout(() => {
            this.simulateAIAnalysis(analysisType);
        }, 1000);
    }

    closeModal() {
        if (this.modal) {
            this.modal.style.display = 'none';
        }
    }

    async simulateAIAnalysis(analysisType = 'efficiency') {
        let analysisText;
        
        if (analysisType === 'disease') {
            analysisText = `
📊 **病种效益分析洞察**

根据当前病种效益明细表，我发现了以下关键洞察：

🔍 **病种效益表现分析**
• 从病种结余率来看，不同病种的盈利能力存在显著差异
• 高效益病种的结余率普遍超过15%，具有良好的经济效益
• 部分病种存在亏损情况，需要重点关注成本控制

💰 **收入成本结构分析**
• 平均收入与平均成本的比值反映了病种的盈利效率
• 高收入病种主要集中在复杂手术和专科治疗领域
• 建议优化低效益病种的诊疗流程和成本结构

📈 **病例数量与效益关系**
• **规模效应**：病例数量较多的病种通常具有更好的成本控制
• **保本分析**：关注实际病例数与保本例数的差距
• **容量优化**：合理调配医疗资源，提高病种诊疗容量

⚡ **重点关注病种**
• 结余率低于5%的病种需要重点成本分析
• 实际病例数低于保本例数的病种需要业务拓展
• 平均成本异常高的病种需要流程优化

🎯 **优化策略建议**
1. **高效益病种**：扩大诊疗规模，提升市场份额
2. **亏损病种**：深入分析成本构成，优化诊疗方案
3. **潜力病种**：加强技术投入，提升诊疗水平
4. **成熟病种**：标准化流程，降低运营成本

📋 **风险提示**
• 关注季节性病种的周期性变化
• 监控新病种的培育期投入产出比
• 建立病种效益预警机制，及时调整策略

💡 **创新发展方向**
建议重点发展高技术含量、高附加值的特色病种，形成医院的核心竞争优势。

🔗 **建议进一步浏览**
• <a href="department-report.html" class="ai-insight-link">医疗质量指标</a>
• <a href="department-revenue.html" class="ai-insight-link">工作量分析</a>  
• <a href="performance-management.html" class="ai-insight-link">成本控制分析</a>
            `;
        } else {
            analysisText = `
📊 **数据概览分析**

根据当前人员效率与效益分析表，我发现了以下关键洞察：

🔍 **效率表现分析**
• 从医生人均门急诊量来看，部分科室存在明显的效率差异
• 高效科室的每医生门急诊人次普遍超过平均水平
• 建议关注效率较低科室的工作流程优化

💰 **收入效益分析**
• 每医生收入指标显示科室间存在较大差异
• 高收入科室主要集中在专科医疗服务领域
• 建议加强低收入科室的业务拓展和技术提升

📈 **优化建议**
• **人力资源配置**：根据门急诊量合理调配医生资源
• **业务流程优化**：学习高效科室的管理经验
• **收入结构调整**：发展高附加值医疗服务项目

⚡ **重点关注指标**
• 每医生门急诊人次低于500的科室需要重点关注
• 每医生收入低于平均水平的科室需要业务指导
• 出院人次与门急诊人次比例异常的科室需要流程梳理

🎯 **行动计划建议**
1. 建立科室效率监控机制
2. 定期开展科室间经验交流
3. 制定差异化的绩效考核标准
4. 加强医生培训和技能提升

📋 **数据质量评估**
当前数据完整性良好，建议持续跟踪这些关键指标的变化趋势，以便及时发现问题和机会。

🔗 **建议进一步浏览**
• <a href="department-report.html" class="ai-insight-link">医疗质量指标</a>
• <a href="department-revenue.html" class="ai-insight-link">工作量分析</a>  
• <a href="performance-management.html" class="ai-insight-link">成本控制分析</a>
            `;
        }

        await this.typewriterEffect(analysisText.trim());
    }

    async typewriterEffect(text) {
        this.content.innerHTML = '';
        const lines = text.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.trim() === '') {
                this.content.innerHTML += '<br>';
                continue;
            }
            
            const lineElement = document.createElement('div');
            lineElement.style.marginBottom = '8px';
            this.content.appendChild(lineElement);
            
            // 检查是否包含HTML标签（特别是链接）
            if (line.includes('<a href=')) {
                // 对于包含链接的行，直接设置innerHTML
                lineElement.innerHTML = line;
                // 稍作停顿以模拟打字效果
                await this.delay(500);
            } else {
                // 逐字符显示普通文本
                for (let j = 0; j < line.length; j++) {
                    lineElement.textContent += line[j];
                    await this.delay(20); // 每个字符间隔20ms
                }
            }
            
            // 每行之间稍作停顿
            await this.delay(100);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 初始化导出和AI洞察功能
document.addEventListener('DOMContentLoaded', () => {
    // 延迟初始化，确保页面完全加载
    setTimeout(() => {
        window.tableExporter = new TableExporter();
        window.aiInsightAnalyzer = new AIInsightAnalyzer();
        console.log('[TableActions] 表格操作功能初始化成功');
    }, 1500);
});

// 尝试加载XLSX库（用于Excel导出）
(function() {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
    script.onload = () => {
        console.log('[Export] XLSX库加载成功，支持Excel导出');
    };
    script.onerror = () => {
        console.log('[Export] XLSX库加载失败，将使用CSV导出');
    };
    document.head.appendChild(script);
})();