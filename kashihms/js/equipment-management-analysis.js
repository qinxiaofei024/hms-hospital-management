// 设备管理分析页面JavaScript

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    
    // 等待导航加载完成
    function waitForNavigation() {
        return new Promise((resolve) => {
            const checkNavigation = () => {
                const navContainer = document.getElementById('navigation-container');
                if (navContainer && navContainer.innerHTML.trim() !== '') {
                    console.log('导航加载完成');
                    resolve();
                } else {
                    console.log('等待导航加载...');
                    setTimeout(checkNavigation, 100);
                }
            };
            checkNavigation();
        });
    }
    
    // 等待导航加载完成后再初始化页面
    waitForNavigation().then(() => {
        setTimeout(() => {
            console.log('开始初始化页面...');
            try {
                initCharts();
                bindEvents();
                loadData();
            } catch (error) {
                console.error('页面初始化失败:', error);
            }
        }, 200);
    });
});

// 绑定事件
function bindEvents() {
    console.log('开始绑定事件...');
    
    try {
        // 等待一下确保DOM完全渲染
        setTimeout(() => {
            // 筛选条件变化 - 使用更安全的方式
            const timeRange = document.getElementById('time-range');
            console.log('查找 time-range 元素:', timeRange);
            if (timeRange && typeof timeRange.addEventListener === 'function') {
                timeRange.addEventListener('change', loadData);
                console.log('time-range 事件绑定成功');
            } else {
                console.warn('time-range element not found or not valid');
            }
            
            const department = document.getElementById('department');
            console.log('查找 department 元素:', department);
            if (department && typeof department.addEventListener === 'function') {
                department.addEventListener('change', loadData);
                console.log('department 事件绑定成功');
            } else {
                console.warn('department element not found or not valid');
            }
            
            const equipmentType = document.getElementById('equipment-type');
            console.log('查找 equipment-type 元素:', equipmentType);
            if (equipmentType && typeof equipmentType.addEventListener === 'function') {
                equipmentType.addEventListener('change', loadData);
                console.log('equipment-type 事件绑定成功');
            } else {
                console.warn('equipment-type element not found or not valid');
            }
            
            // 刷新按钮
            const refreshBtn = document.getElementById('refresh-btn');
            if (refreshBtn && typeof refreshBtn.addEventListener === 'function') {
                refreshBtn.addEventListener('click', loadData);
            }
            
            // 导出按钮
            const exportBtn = document.getElementById('export-btn');
            if (exportBtn && typeof exportBtn.addEventListener === 'function') {
                exportBtn.addEventListener('click', exportReport);
            }
        }, 100);
    } catch (error) {
        console.error('事件绑定失败:', error);
    }
}

// 初始化图表
function initCharts() {
    try {
        initEquipmentStatusChart();
        initUtilizationChart();
        initMaintenanceTrendChart();
        initCostAnalysisChart();
    } catch (error) {
        console.error('图表初始化出错:', error);
    }
}

// 设备状态分布图
function initEquipmentStatusChart() {
    const chartElement = document.getElementById('equipment-status-chart');
    if (!chartElement) {
        console.warn('equipment-status-chart element not found');
        return;
    }
    
    const chart = echarts.init(chartElement);
    
    const option = {
        title: {
            text: '设备状态分布',
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
            bottom: '5%',
            left: 'center'
        },
        series: [
            {
                name: '设备状态',
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
                data: [
                    { value: 1191, name: '正常运行', itemStyle: { color: '#52c41a' } },
                    { value: 23, name: '故障', itemStyle: { color: '#ff4d4f' } },
                    { value: 18, name: '预警', itemStyle: { color: '#fa8c16' } },
                    { value: 24, name: '维护中', itemStyle: { color: '#722ed1' } }
                ]
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 设备利用率图
function initUtilizationChart() {
    const chartElement = document.getElementById('utilization-chart');
    if (!chartElement) {
        console.warn('utilization-chart element not found');
        return;
    }
    
    const chart = echarts.init(chartElement);
    
    const option = {
        title: {
            text: '设备利用率分析',
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
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['诊断设备', '治疗设备', '监护设备', '手术设备', '检验设备'],
            axisLabel: {
                rotate: 45
            }
        },
        yAxis: {
            type: 'value',
            name: '利用率(%)',
            max: 100
        },
        series: [
            {
                name: '利用率',
                type: 'bar',
                data: [
                    { value: 85.6, itemStyle: { color: '#1890ff' } },
                    { value: 78.9, itemStyle: { color: '#52c41a' } },
                    { value: 92.3, itemStyle: { color: '#fa8c16' } },
                    { value: 73.4, itemStyle: { color: '#722ed1' } },
                    { value: 89.7, itemStyle: { color: '#13c2c2' } }
                ],
                barWidth: '60%',
                itemStyle: {
                    borderRadius: [4, 4, 0, 0]
                }
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 维护趋势图
function initMaintenanceTrendChart() {
    const chartElement = document.getElementById('maintenance-trend-chart');
    if (!chartElement) {
        console.warn('maintenance-trend-chart element not found');
        return;
    }
    
    const chart = echarts.init(chartElement);
    
    const dates = generateDateRange(30);
    const maintenanceData = generateRandomData(30, 5, 25);
    const costData = generateRandomData(30, 10, 50);
    
    const option = {
        title: {
            text: '维护趋势分析',
            left: 'center',
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            bottom: '5%'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: dates,
            axisLabel: {
                rotate: 45
            }
        },
        yAxis: [
            {
                type: 'value',
                name: '维护次数',
                position: 'left'
            },
            {
                type: 'value',
                name: '成本(万元)',
                position: 'right'
            }
        ],
        series: [
            {
                name: '维护次数',
                type: 'line',
                data: maintenanceData,
                smooth: true,
                itemStyle: { color: '#1890ff' }
            },
            {
                name: '维护成本',
                type: 'bar',
                yAxisIndex: 1,
                data: costData,
                itemStyle: { color: '#52c41a' }
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 成本分析图
function initCostAnalysisChart() {
    const chartElement = document.getElementById('cost-analysis-chart');
    if (!chartElement) {
        console.warn('cost-analysis-chart element not found');
        return;
    }
    
    const chart = echarts.init(chartElement);
    
    const option = {
        title: {
            text: '维护成本分析',
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
            bottom: '5%'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['心内科', '骨科', '神经外科', '消化内科', '呼吸内科', '神经内科']
        },
        yAxis: {
            type: 'value',
            name: '成本(万元)'
        },
        series: [
            {
                name: '预防性维护',
                type: 'bar',
                stack: 'total',
                data: [12.5, 18.3, 15.7, 9.8, 11.2, 8.9],
                itemStyle: { color: '#1890ff' }
            },
            {
                name: '故障维修',
                type: 'bar',
                stack: 'total',
                data: [8.2, 12.6, 9.4, 6.7, 7.8, 5.3],
                itemStyle: { color: '#ff4d4f' }
            },
            {
                name: '升级改造',
                type: 'bar',
                stack: 'total',
                data: [5.8, 9.2, 7.1, 4.3, 5.6, 3.8],
                itemStyle: { color: '#52c41a' }
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 生成日期范围
function generateDateRange(days) {
    const dates = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }));
    }
    
    return dates;
}

// 生成随机数据
function generateRandomData(count, min, max) {
    const data = [];
    for (let i = 0; i < count; i++) {
        data.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return data;
}

// 加载数据
function loadData() {
    try {
        console.log('加载设备管理数据...');
        
        const timeRange = document.getElementById('time-range');
        const department = document.getElementById('department');
        const equipmentType = document.getElementById('equipment-type');
        
        const timeRangeValue = timeRange ? timeRange.value : 'month';
        const departmentValue = department ? department.value : 'all';
        const equipmentTypeValue = equipmentType ? equipmentType.value : 'all';
        
        console.log('筛选条件:', { 
            timeRange: timeRangeValue, 
            department: departmentValue, 
            equipmentType: equipmentTypeValue 
        });
        
        // 重新初始化图表（模拟数据更新）
        setTimeout(() => {
            initCharts();
        }, 500);
    } catch (error) {
        console.error('数据加载出错:', error);
    }
}

// 导出报告
function exportReport() {
    try {
        const timeRange = document.getElementById('time-range');
        const department = document.getElementById('department');
        const equipmentType = document.getElementById('equipment-type');
        
        const timeRangeValue = timeRange ? timeRange.value : 'month';
        const departmentValue = department ? department.value : 'all';
        const equipmentTypeValue = equipmentType ? equipmentType.value : 'all';
        
        console.log('导出设备管理分析报告...', { 
            timeRange: timeRangeValue, 
            department: departmentValue, 
            equipmentType: equipmentTypeValue 
        });
        
        const data = {
            title: '设备管理分析报告',
            date: new Date().toLocaleDateString('zh-CN'),
            filters: { 
                timeRange: timeRangeValue, 
                department: departmentValue, 
                equipmentType: equipmentTypeValue 
            },
            summary: {
                totalEquipment: 1256,
                normalRate: '94.8%',
                faultCount: 23,
                maintenanceCost: '156万'
            }
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `设备管理分析报告_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert('报告导出成功！');
    } catch (error) {
        console.error('报告导出出错:', error);
        alert('报告导出失败，请稍后重试');
    }
}