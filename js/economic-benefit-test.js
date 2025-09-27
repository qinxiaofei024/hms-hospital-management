class EconomicBenefitTest {
    constructor() {
        this.charts = {};
        this.currentData = null;
        this.init();
    }

    init() {
        this.log('经济效益测试页面初始化开始');
        this.loadData();
    }

    log(message) {
        console.log(`[EconomicBenefitTest] ${message}`);
    }

    // 加载数据
    loadData() {
        this.log('开始加载数据');
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '../data/economic-benefit.json', true);
        xhr.onload = () => {
            if (xhr.status === 200) {
                try {
                    const rawData = JSON.parse(xhr.responseText);
                    this.currentData = this.transformData(rawData);
                    this.log('数据加载成功');
                    this.initCharts();
                } catch (error) {
                    this.log('数据解析错误: ' + error.message);
                    this.currentData = this.getMockData();
                    this.initCharts();
                }
            } else {
                this.log('数据加载失败，使用模拟数据');
                this.currentData = this.getMockData();
                this.initCharts();
            }
        };
        xhr.onerror = () => {
            this.log('网络错误，使用模拟数据');
            this.currentData = this.getMockData();
            this.initCharts();
        };
        xhr.send();
    }

    // 转换数据
    transformData(rawData) {
        return {
            overview: {
                totalRevenue: rawData.overview?.totalRevenue || 12500,
                netProfit: rawData.overview?.netProfit || 1875,
                profitMargin: rawData.overview?.profitMargin || 15.0,
                totalCost: rawData.overview?.totalCost || 10625
            },
            efficiencyData: this.generateEfficiencyData()
        };
    }

    // 生成效率数据
    generateEfficiencyData() {
        const departments = [
            { name: '内科', doctors: 25, outpatients: 31200, inpatients: 2250, revenue: 6200, profit: 930 },
            { name: '外科', doctors: 22, outpatients: 26800, inpatients: 1980, revenue: 5800, profit: 870 },
            { name: '妇产科', doctors: 18, outpatients: 22500, inpatients: 1650, revenue: 4900, profit: 735 }
        ];
        
        const efficiencyData = departments.map(dept => ({
            ...dept,
            outpatientPerDoctor: Math.round(dept.outpatients / dept.doctors),
            inpatientPerDoctor: Math.round(dept.inpatients / dept.doctors),
            revenuePerDoctor: Math.round(dept.revenue / dept.doctors * 10) / 10,
            profitPerDoctor: Math.round(dept.profit / dept.doctors * 10) / 10
        }));
        
        return {
            departments: efficiencyData,
            incomeStructure: [
                { name: '医疗服务收入', value: 45 },
                { name: '药品收入', value: 32 },
                { name: '检查检验收入', value: 18 },
                { name: '其他收入', value: 5 }
            ]
        };
    }

    // 获取模拟数据
    getMockData() {
        return {
            overview: {
                totalRevenue: 12500,
                netProfit: 1875,
                profitMargin: 15.0,
                totalCost: 10625
            },
            efficiencyData: this.generateEfficiencyData()
        };
    }

    // 初始化图表
    initCharts() {
        this.log('开始初始化图表');
        try {
            this.initDepartmentEfficiencyChart();
            this.log('图表初始化完成');
        } catch (error) {
            this.log('图表初始化错误: ' + error.message);
            console.error('详细错误:', error);
        }
    }

    // 初始化科室效率对比图表
    initDepartmentEfficiencyChart() {
        this.log('初始化科室效率对比图表');
        const chartElement = document.getElementById('department-efficiency-chart');
        
        if (!chartElement) {
            this.log('图表元素不存在');
            return;
        }

        try {
            const chart = echarts.init(chartElement);
            const data = this.currentData?.efficiencyData?.departments || this.generateEfficiencyData().departments;
            
            this.log('数据验证: ' + JSON.stringify(data));
            
            if (!Array.isArray(data) || data.length === 0) {
                this.log('数据无效，使用默认数据');
                return;
            }

            const option = {
                title: {
                    text: '科室效率对比',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: ['门诊量/医生', '住院量/医生', '收入/医生(万)', '利润/医生(万)'],
                    top: 30
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: data.map(item => item.name)
                },
                yAxis: [
                    {
                        type: 'value',
                        name: '人次',
                        position: 'left'
                    },
                    {
                        type: 'value',
                        name: '万元',
                        position: 'right'
                    }
                ],
                series: [
                    {
                        name: '门诊量/医生',
                        type: 'bar',
                        data: data.map(item => item.outpatientPerDoctor)
                    },
                    {
                        name: '住院量/医生',
                        type: 'bar',
                        data: data.map(item => item.inpatientPerDoctor)
                    },
                    {
                        name: '收入/医生(万)',
                        type: 'bar',
                        yAxisIndex: 1,
                        data: data.map(item => item.revenuePerDoctor)
                    },
                    {
                        name: '利润/医生(万)',
                        type: 'bar',
                        yAxisIndex: 1,
                        data: data.map(item => item.profitPerDoctor)
                    }
                ]
            };

            chart.setOption(option);
            this.charts['department-efficiency'] = chart;
            this.log('科室效率对比图表初始化成功');
        } catch (error) {
            this.log('科室效率对比图表初始化失败: ' + error.message);
            throw error;
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    window.economicBenefitTest = new EconomicBenefitTest();
});