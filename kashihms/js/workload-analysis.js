// 工作量分析页面JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // 初始化页面
    initWorkloadAnalysis();
    
    // 绑定事件监听器
    bindEventListeners();
});

// 初始化工作量分析页面
function initWorkloadAnalysis() {
    // 初始化图表
    initWorkloadTrendChart();
    initWorkloadDistributionChart();
    initDepartmentComparisonChart();
    initDoctorWorkloadChart();
    
    // 加载数据
    loadWorkloadData();
}

// 绑定事件监听器
function bindEventListeners() {
    // 刷新按钮
    document.getElementById('refresh-btn').addEventListener('click', function() {
        refreshWorkloadData();
    });
    
    // 导出按钮
    document.getElementById('export-btn').addEventListener('click', function() {
        exportWorkloadReport();
    });
    
    // 筛选条件变化
    document.getElementById('time-range').addEventListener('change', function() {
        updateWorkloadData();
    });
    
    document.getElementById('department-select').addEventListener('change', function() {
        updateWorkloadData();
    });
    
    document.getElementById('workload-type').addEventListener('change', function() {
        updateWorkloadData();
    });
}

// 初始化工作量趋势图
function initWorkloadTrendChart() {
    const chart = echarts.init(document.getElementById('workload-trend-chart'));
    
    const option = {
        title: {
            text: '近30天工作量趋势',
            textStyle: {
                fontSize: 14,
                fontWeight: 'normal'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        legend: {
            data: ['门诊量', '住院量', '手术量', '检查量']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: generateDateRange(30)
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '门诊量',
                type: 'line',
                data: generateRandomData(30, 80, 120),
                smooth: true,
                itemStyle: {
                    color: '#1890ff'
                }
            },
            {
                name: '住院量',
                type: 'line',
                data: generateRandomData(30, 5, 15),
                smooth: true,
                itemStyle: {
                    color: '#52c41a'
                }
            },
            {
                name: '手术量',
                type: 'line',
                data: generateRandomData(30, 1, 5),
                smooth: true,
                itemStyle: {
                    color: '#fa8c16'
                }
            },
            {
                name: '检查量',
                type: 'line',
                data: generateRandomData(30, 20, 40),
                smooth: true,
                itemStyle: {
                    color: '#722ed1'
                }
            }
        ]
    };
    
    chart.setOption(option);
    
    // 响应式
    window.addEventListener('resize', function() {
        chart.resize();
    });
}

// 初始化工作量分布图
function initWorkloadDistributionChart() {
    const chart = echarts.init(document.getElementById('workload-distribution-chart'));
    
    const option = {
        title: {
            text: '本月工作量类型分布',
            textStyle: {
                fontSize: 14,
                fontWeight: 'normal'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['门诊量', '住院量', '手术量', '检查量', '其他']
        },
        series: [
            {
                name: '工作量分布',
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
                data: [
                    {value: 2456, name: '门诊量', itemStyle: {color: '#1890ff'}},
                    {value: 186, name: '住院量', itemStyle: {color: '#52c41a'}},
                    {value: 45, name: '手术量', itemStyle: {color: '#fa8c16'}},
                    {value: 892, name: '检查量', itemStyle: {color: '#722ed1'}},
                    {value: 234, name: '其他', itemStyle: {color: '#eb2f96'}}
                ]
            }
        ]
    };
    
    chart.setOption(option);
    
    // 响应式
    window.addEventListener('resize', function() {
        chart.resize();
    });
}

// 初始化科室工作量对比图
function initDepartmentComparisonChart() {
    const chart = echarts.init(document.getElementById('department-comparison-chart'));
    
    const option = {
        title: {
            text: '各科室工作量对比',
            textStyle: {
                fontSize: 14,
                fontWeight: 'normal'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['门诊量', '住院量', '手术量']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['心内科', '骨科', '神经外科', '消化内科', '呼吸内科', '神经内科', '妇产科', '儿科']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '门诊量',
                type: 'bar',
                data: [320, 302, 301, 334, 390, 330, 320, 280],
                itemStyle: {
                    color: '#1890ff'
                }
            },
            {
                name: '住院量',
                type: 'bar',
                data: [120, 132, 101, 134, 90, 230, 210, 180],
                itemStyle: {
                    color: '#52c41a'
                }
            },
            {
                name: '手术量',
                type: 'bar',
                data: [20, 32, 21, 24, 15, 18, 25, 12],
                itemStyle: {
                    color: '#fa8c16'
                }
            }
        ]
    };
    
    chart.setOption(option);
    
    // 响应式
    window.addEventListener('resize', function() {
        chart.resize();
    });
}

// 初始化医生工作量排名图
function initDoctorWorkloadChart() {
    const chart = echarts.init(document.getElementById('doctor-workload-chart'));
    
    const option = {
        title: {
            text: '医生工作量排名TOP10',
            textStyle: {
                fontSize: 14,
                fontWeight: 'normal'
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
            type: 'value'
        },
        yAxis: {
            type: 'category',
            data: ['张主任', '李医生', '王医生', '陈医生', '刘医生', '赵医生', '孙医生', '周医生', '吴医生', '郑医生']
        },
        series: [
            {
                name: '总工作量',
                type: 'bar',
                data: [285, 248, 255, 222, 198, 176, 165, 158, 142, 135],
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                        {offset: 0, color: '#83bff6'},
                        {offset: 0.5, color: '#188df0'},
                        {offset: 1, color: '#188df0'}
                    ])
                },
                emphasis: {
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                            {offset: 0, color: '#2378f7'},
                            {offset: 0.7, color: '#2378f7'},
                            {offset: 1, color: '#83bff6'}
                        ])
                    }
                }
            }
        ]
    };
    
    chart.setOption(option);
    
    // 响应式
    window.addEventListener('resize', function() {
        chart.resize();
    });
}

// 生成日期范围
function generateDateRange(days) {
    const dates = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(date.toLocaleDateString('zh-CN', {month: 'numeric', day: 'numeric'}));
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

// 加载工作量数据
function loadWorkloadData() {
    // 模拟数据加载
    console.log('加载工作量数据...');
    
    // 这里可以添加实际的数据加载逻辑
    // 例如：fetch('/api/workload-data')
}

// 刷新工作量数据
function refreshWorkloadData() {
    console.log('刷新工作量数据...');
    
    // 显示加载状态
    showLoading();
    
    // 模拟数据刷新
    setTimeout(() => {
        loadWorkloadData();
        hideLoading();
        showMessage('数据刷新成功', 'success');
    }, 1000);
}

// 更新工作量数据
function updateWorkloadData() {
    const timeRange = document.getElementById('time-range').value;
    const department = document.getElementById('department-select').value;
    const workloadType = document.getElementById('workload-type').value;
    
    console.log('更新工作量数据:', {timeRange, department, workloadType});
    
    // 这里可以根据筛选条件更新数据
    loadWorkloadData();
}

// 导出工作量报告
function exportWorkloadReport() {
    console.log('导出工作量报告...');
    
    // 模拟导出功能
    showMessage('报告导出中，请稍候...', 'info');
    
    setTimeout(() => {
        showMessage('报告导出成功', 'success');
    }, 2000);
}

// 显示加载状态
function showLoading() {
    // 可以添加加载动画
    console.log('显示加载状态');
}

// 隐藏加载状态
function hideLoading() {
    // 隐藏加载动画
    console.log('隐藏加载状态');
}

// 显示消息
function showMessage(message, type = 'info') {
    console.log(`${type}: ${message}`);
    // 这里可以添加实际的消息显示逻辑
}