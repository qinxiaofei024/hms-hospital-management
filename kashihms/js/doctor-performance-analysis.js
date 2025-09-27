// 医生绩效分析页面JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // 初始化页面
    initDoctorPerformance();
    
    // 绑定事件监听器
    bindEventListeners();
});

// 初始化医生绩效分析页面
function initDoctorPerformance() {
    // 初始化图表
    initPerformanceTrendChart();
    initDepartmentPerformanceChart();
    initPerformanceDistributionChart();
    initWorkloadAnalysisChart();
    
    // 加载数据
    loadPerformanceData();
}

// 绑定事件监听器
function bindEventListeners() {
    // 刷新按钮
    document.getElementById('refresh-btn').addEventListener('click', function() {
        refreshPerformanceData();
    });
    
    // 导出按钮
    document.getElementById('export-btn').addEventListener('click', function() {
        exportPerformanceReport();
    });
    
    // 筛选条件变化
    document.getElementById('time-range').addEventListener('change', function() {
        updatePerformanceData();
    });
    
    document.getElementById('department-select').addEventListener('change', function() {
        updatePerformanceData();
    });
    
    document.getElementById('doctor-level').addEventListener('change', function() {
        updatePerformanceData();
    });
}

// 初始化绩效趋势图
function initPerformanceTrendChart() {
    const chart = echarts.init(document.getElementById('performance-trend-chart'));
    
    const option = {
        title: {
            text: '近30天医生绩效趋势',
            subtext: 'Performance Trend - Last 30 Days',
            textStyle: {
                fontSize: 14,
                fontWeight: 'normal'
            },
            subtextStyle: {
                fontSize: 11,
                color: '#999',
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
            data: ['平均绩效评分', '门诊量', '手术量', '患者满意度']
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
        yAxis: [
            {
                type: 'value',
                name: '评分/满意度',
                position: 'left',
                axisLabel: {
                    formatter: '{value}'
                }
            },
            {
                type: 'value',
                name: '数量',
                position: 'right',
                axisLabel: {
                    formatter: '{value}'
                }
            }
        ],
        series: [
            {
                name: '平均绩效评分',
                type: 'line',
                yAxisIndex: 0,
                data: generateRandomData(30, 8.0, 9.5),
                smooth: true,
                itemStyle: {
                    color: '#1890ff'
                }
            },
            {
                name: '门诊量',
                type: 'bar',
                yAxisIndex: 1,
                data: generateRandomData(30, 150, 300),
                itemStyle: {
                    color: '#52c41a'
                }
            },
            {
                name: '手术量',
                type: 'bar',
                yAxisIndex: 1,
                data: generateRandomData(30, 5, 25),
                itemStyle: {
                    color: '#fa8c16'
                }
            },
            {
                name: '患者满意度',
                type: 'line',
                yAxisIndex: 0,
                data: generateRandomData(30, 85, 98),
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

// 初始化科室绩效对比图
function initDepartmentPerformanceChart() {
    const chart = echarts.init(document.getElementById('department-performance-chart'));
    
    const option = {
        title: {
            text: '各科室医生绩效对比',
            subtext: 'Department Performance Comparison',
            textStyle: {
                fontSize: 14,
                fontWeight: 'normal'
            },
            subtextStyle: {
                fontSize: 11,
                color: '#999',
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
            data: ['平均绩效评分', '医生数量']
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
        yAxis: [
            {
                type: 'value',
                name: '评分',
                position: 'left',
                axisLabel: {
                    formatter: '{value}'
                }
            },
            {
                type: 'value',
                name: '人数',
                position: 'right',
                axisLabel: {
                    formatter: '{value}人'
                }
            }
        ],
        series: [
            {
                name: '平均绩效评分',
                type: 'bar',
                yAxisIndex: 0,
                data: [8.9, 8.5, 8.7, 9.1, 8.3, 8.6, 9.2, 8.1],
                itemStyle: {
                    color: '#1890ff'
                }
            },
            {
                name: '医生数量',
                type: 'line',
                yAxisIndex: 1,
                data: [23, 18, 15, 21, 19, 17, 16, 27],
                smooth: true,
                itemStyle: {
                    color: '#52c41a'
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

// 初始化绩效分布图
function initPerformanceDistributionChart() {
    const chart = echarts.init(document.getElementById('performance-distribution-chart'));
    
    const option = {
        title: {
            text: '医生绩效等级分布',
            subtext: 'Performance Level Distribution',
            textStyle: {
                fontSize: 14,
                fontWeight: 'normal'
            },
            subtextStyle: {
                fontSize: 11,
                color: '#999',
                fontWeight: 'normal'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c}人 ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['优秀', '良好', '一般', '待改进']
        },
        series: [
            {
                name: '绩效等级',
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
                    {value: 23, name: '优秀', itemStyle: {color: '#52c41a'}},
                    {value: 67, name: '良好', itemStyle: {color: '#1890ff'}},
                    {value: 52, name: '一般', itemStyle: {color: '#fa8c16'}},
                    {value: 14, name: '待改进', itemStyle: {color: '#ff4d4f'}}
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

// 初始化工作量分析图
function initWorkloadAnalysisChart() {
    const chart = echarts.init(document.getElementById('workload-analysis-chart'));
    
    const option = {
        title: {
            text: '医生工作量分析',
            subtext: 'Workload Analysis by Position',
            textStyle: {
                fontSize: 14,
                fontWeight: 'normal'
            },
            subtextStyle: {
                fontSize: 11,
                color: '#999',
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
            data: ['门诊量', '手术量', '教学任务', '科研项目']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['主任医师', '副主任医师', '主治医师', '住院医师']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '门诊量',
                type: 'bar',
                stack: '工作量',
                data: [280, 220, 180, 120],
                itemStyle: {
                    color: '#1890ff'
                }
            },
            {
                name: '手术量',
                type: 'bar',
                stack: '工作量',
                data: [25, 20, 15, 8],
                itemStyle: {
                    color: '#52c41a'
                }
            },
            {
                name: '教学任务',
                type: 'bar',
                stack: '工作量',
                data: [15, 12, 8, 3],
                itemStyle: {
                    color: '#fa8c16'
                }
            },
            {
                name: '科研项目',
                type: 'bar',
                stack: '工作量',
                data: [8, 5, 2, 1],
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
        data.push(Math.round((Math.random() * (max - min) + min) * 10) / 10);
    }
    return data;
}

// 加载绩效数据
function loadPerformanceData() {
    // 模拟数据加载
    console.log('加载医生绩效数据...');
    
    // 这里可以添加实际的数据加载逻辑
    // 例如：fetch('/api/doctor-performance-data')
}

// 刷新绩效数据
function refreshPerformanceData() {
    console.log('刷新医生绩效数据...');
    
    // 显示加载状态
    showLoading();
    
    // 模拟数据刷新
    setTimeout(() => {
        loadPerformanceData();
        hideLoading();
        showMessage('数据刷新成功', 'success');
    }, 1000);
}

// 更新绩效数据
function updatePerformanceData() {
    const timeRange = document.getElementById('time-range').value;
    const department = document.getElementById('department-select').value;
    const doctorLevel = document.getElementById('doctor-level').value;
    
    console.log('更新医生绩效数据:', {timeRange, department, doctorLevel});
    
    // 这里可以根据筛选条件更新数据
    loadPerformanceData();
}

// 导出绩效报告
function exportPerformanceReport() {
    console.log('导出医生绩效报告...');
    
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