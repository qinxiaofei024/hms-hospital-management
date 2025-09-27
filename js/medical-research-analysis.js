// 医疗科研分析页面JavaScript

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    initCharts();
    bindEvents();
    loadData();
});

// 绑定事件
function bindEvents() {
    // 筛选条件变化
    document.getElementById('time-range').addEventListener('change', function() {
        loadData();
    });
    
    document.getElementById('department-select').addEventListener('change', function() {
        loadData();
    });
    
    document.getElementById('research-type').addEventListener('change', function() {
        loadData();
    });
    
    // 刷新按钮
    document.getElementById('refresh-btn').addEventListener('click', function() {
        loadData();
    });
    
    // 导出按钮
    document.getElementById('export-btn').addEventListener('click', function() {
        exportReport();
    });
}

// 初始化图表
function initCharts() {
    initResearchTrendChart();
    initFundingDistributionChart();
    initPublicationAnalysisChart();
    initDepartmentComparisonChart();
}

// 科研趋势图
function initResearchTrendChart() {
    const chart = echarts.init(document.getElementById('research-trend-chart'));
    
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const projectData = [12, 15, 18, 22, 25, 28, 32, 35, 38, 42, 45, 48];
    const paperData = [5, 7, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36];
    
    const option = {
        title: {
            text: '科研项目与论文发表趋势',
            subtext: 'Research Projects & Publications Trend',
            left: 'center',
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold'
            },
            subtextStyle: {
                fontSize: 12,
                color: '#666'
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
            data: months
        },
        yAxis: [
            {
                type: 'value',
                name: '项目数',
                position: 'left'
            },
            {
                type: 'value',
                name: '论文数',
                position: 'right'
            }
        ],
        series: [
            {
                name: '在研项目',
                type: 'line',
                data: projectData,
                smooth: true,
                itemStyle: { color: '#1890ff' },
                areaStyle: { opacity: 0.3 }
            },
            {
                name: '发表论文',
                type: 'bar',
                yAxisIndex: 1,
                data: paperData,
                itemStyle: { color: '#52c41a' }
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 经费分布图
function initFundingDistributionChart() {
    const chart = echarts.init(document.getElementById('funding-distribution-chart'));
    
    const option = {
        title: {
            text: '科研经费分布',
            subtext: 'Research Funding Distribution',
            left: 'center',
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold'
            },
            subtextStyle: {
                fontSize: 12,
                color: '#666'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c}万元 ({d}%)'
        },
        legend: {
            bottom: '5%',
            left: 'center'
        },
        series: [
            {
                name: '科研经费',
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
                    { value: 385, name: '国家级项目', itemStyle: { color: '#1890ff' } },
                    { value: 285, name: '省级项目', itemStyle: { color: '#52c41a' } },
                    { value: 195, name: '市级项目', itemStyle: { color: '#fa8c16' } },
                    { value: 125, name: '院级项目', itemStyle: { color: '#722ed1' } },
                    { value: 295, name: '企业合作', itemStyle: { color: '#13c2c2' } }
                ]
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 论文发表分析图
function initPublicationAnalysisChart() {
    const chart = echarts.init(document.getElementById('publication-analysis-chart'));
    
    const option = {
        title: {
            text: '论文发表质量分析',
            subtext: 'Publication Quality Analysis',
            left: 'center',
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold'
            },
            subtextStyle: {
                fontSize: 12,
                color: '#666'
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
            data: ['SCI一区', 'SCI二区', 'SCI三区', 'SCI四区', '中文核心', '其他期刊']
        },
        yAxis: {
            type: 'value',
            name: '论文数量'
        },
        series: [
            {
                name: '2023年',
                type: 'bar',
                data: [15, 22, 18, 12, 8, 5],
                itemStyle: { color: '#1890ff' }
            },
            {
                name: '2024年',
                type: 'bar',
                data: [18, 25, 20, 15, 10, 6],
                itemStyle: { color: '#52c41a' }
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 科室对比分析图
function initDepartmentComparisonChart() {
    const chart = echarts.init(document.getElementById('department-comparison-chart'));
    
    const option = {
        title: {
            text: '各科室科研产出对比',
            subtext: 'Department Research Output Comparison',
            left: 'center',
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold'
            },
            subtextStyle: {
                fontSize: 12,
                color: '#666'
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
            data: ['心内科', '骨科', '神经外科', '消化内科', '呼吸内科', '神经内科', '妇产科', '儿科'],
            axisLabel: {
                rotate: 45
            }
        },
        yAxis: [
            {
                type: 'value',
                name: '项目数',
                position: 'left'
            },
            {
                type: 'value',
                name: '经费(万元)',
                position: 'right'
            }
        ],
        series: [
            {
                name: '在研项目',
                type: 'bar',
                data: [25, 22, 18, 15, 12, 16, 8, 12],
                itemStyle: { color: '#1890ff' }
            },
            {
                name: '发表论文',
                type: 'bar',
                data: [18, 15, 12, 10, 8, 11, 6, 9],
                itemStyle: { color: '#52c41a' }
            },
            {
                name: '科研经费',
                type: 'line',
                yAxisIndex: 1,
                data: [285, 245, 195, 165, 125, 185, 95, 155],
                itemStyle: { color: '#fa8c16' },
                lineStyle: { width: 3 }
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 加载数据
function loadData() {
    // 模拟数据加载
    console.log('加载医疗科研数据...');
    
    // 这里可以根据筛选条件重新加载数据
    const timeRange = document.getElementById('time-range').value;
    const department = document.getElementById('department-select').value;
    const researchType = document.getElementById('research-type').value;
    
    console.log('筛选条件:', { timeRange, department, researchType });
    
    // 重新初始化图表（模拟数据更新）
    setTimeout(() => {
        initCharts();
    }, 500);
}

// 导出报告
function exportReport() {
    // 模拟导出功能
    const timeRange = document.getElementById('time-range').value;
    const department = document.getElementById('department-select').value;
    const researchType = document.getElementById('research-type').value;
    
    console.log('导出医疗科研分析报告...', { timeRange, department, researchType });
    
    // 创建下载链接
    const data = {
        title: '医疗科研分析报告',
        date: new Date().toLocaleDateString('zh-CN'),
        filters: { timeRange, department, researchType },
        summary: {
            ongoingProjects: 156,
            publishedPapers: 89,
            researchFunding: '1,285万',
            awards: 12
        }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `医疗科研分析报告_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('报告导出成功！');
}