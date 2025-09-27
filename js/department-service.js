// 初始化所有图表
document.addEventListener('DOMContentLoaded', function() {
    // 初始化门急诊人次趋势图表
    const outpatientTrendChart = echarts.init(document.getElementById('outpatientTrendChart'));
    outpatientTrendChart.setOption({
        title: {
            text: '门急诊人次趋势',
            textStyle: {
                color: '#333',
                fontSize: 16,
                fontWeight: 'normal'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data: ['全院'],
            textStyle: {
                color: '#333'
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
            boundaryGap: false,
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            axisLabel: {
                color: '#666'
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                color: '#666'
            },
            min: 10000,  // 设置最小值，使数据在图表中居中显示
            max: 14000   // 设置最大值，使数据在图表中居中显示
        },
        series: [
            {
                name: '全院',
                type: 'line',
                areaStyle: {},
                emphasis: {
                    focus: 'series'
                },
                data: [12300, 12500, 12150, 12500, 12350, 12400, 12460, 12280, 12510, 12440, 12620, 12580]
            }
        ]
    });

    // 初始化出院人次趋势图表
    const dischargeTrendChart = echarts.init(document.getElementById('dischargeTrendChart'));
    dischargeTrendChart.setOption({
        title: {
            text: '出院人次趋势',
            textStyle: {
                color: '#333',
                fontSize: 16,
                fontWeight: 'normal'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data: ['全院'],
            textStyle: {
                color: '#333'
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
            boundaryGap: false,
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            axisLabel: {
                color: '#666'
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                color: '#666'
            },
            min: 2500,   // 设置最小值，使数据在图表中居中显示
            max: 3000    // 设置最大值，使数据在图表中居中显示
        },
        series: [
            {
                name: '全院',
                type: 'line',
                areaStyle: {},
                emphasis: {
                    focus: 'series'
                },
                data: [2830, 2830, 2858, 2830, 2866, 2830, 2860, 2890, 2827, 2822, 2870, 2856]
            }
        ]
    });

    // 初始化手术人次趋势图表
    const surgeryTrendChart = echarts.init(document.getElementById('surgeryTrendChart'));
    surgeryTrendChart.setOption({
        title: {
            text: '手术人次趋势',
            textStyle: {
                color: '#333',
                fontSize: 16,
                fontWeight: 'normal'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data: ['全院'],
            textStyle: {
                color: '#333'
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
            boundaryGap: false,
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            axisLabel: {
                color: '#666'
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                color: '#666'
            },
            min: 1300,   // 设置最小值，使数据在图表中居中显示
            max: 1500    // 设置最大值，使数据在图表中居中显示
        },
        series: [
            {
                name: '全院',
                type: 'line',
                areaStyle: {},
                emphasis: {
                    focus: 'series'
                },
                data: [1400, 1410, 1405, 1420, 1395, 1400, 1415, 1390, 1425, 1405, 1440, 1423]
            }
        ]
    });

    

    // 初始化平均住院日趋势图表
    const avgStayTrendChart = echarts.init(document.getElementById('avgStayTrendChart'));
    avgStayTrendChart.setOption({
        title: {
            text: '平均住院日趋势',
            textStyle: {
                color: '#333',
                fontSize: 16,
                fontWeight: 'normal'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data: ['全院'],
            textStyle: {
                color: '#333'
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
            boundaryGap: false,
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            axisLabel: {
                color: '#666'
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                color: '#666'
            },
            min: 8.0,    // 设置最小值，使数据在图表中居中显示
            max: 9.5     // 设置最大值，使数据在图表中居中显示
        },
        series: [
            {
                name: '全院',
                type: 'line',
                emphasis: {
                    focus: 'series'
                },
                data: [9.0, 8.9, 8.8, 8.7, 8.6, 8.5, 8.6, 8.5, 8.4, 8.5, 8.6, 8.5]
            }
        ]
    });

    // 初始化病床使用率趋势图表
    const bedUsageTrendChart = echarts.init(document.getElementById('bedUsageTrendChart'));
    bedUsageTrendChart.setOption({
        title: {
            text: '病床使用率趋势',
            textStyle: {
                color: '#333',
                fontSize: 16,
                fontWeight: 'normal'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data: ['全院'],
            textStyle: {
                color: '#333'
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
            boundaryGap: false,
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            axisLabel: {
                color: '#666'
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                color: '#666',
                formatter: '{value}%'
            },
            min: 90,     // 设置最小值，使数据在图表中居中显示
            max: 95      // 设置最大值，使数据在图表中居中显示
        },
        series: [
            {
                name: '全院',
                type: 'line',
                emphasis: {
                    focus: 'series'
                },
                data: [91.9, 92.1, 92.0, 92.3, 92.2, 92.1, 92.3, 92.1, 92.2, 92.1, 92.2, 92.3]
            }
        ]
    });



    // 初始化CMI值趋势图表
    const cmiTrendChart = echarts.init(document.getElementById('cmiTrendChart'));
    cmiTrendChart.setOption({
        title: {
            text: 'CMI值趋势',
            textStyle: {
                color: '#333',
                fontSize: 16,
                fontWeight: 'normal'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data: ['全院'],
            textStyle: {
                color: '#333'
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
            boundaryGap: false,
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            axisLabel: {
                color: '#666'
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                color: '#666'
            },
            min: 1.20,   // 设置最小值，使数据在图表中居中显示
            max: 1.30    // 设置最大值，使数据在图表中居中显示
        },
        series: [
            {
                name: '全院',
                type: 'line',
                emphasis: {
                    focus: 'series'
                },
                data: [1.22, 1.23, 1.22, 1.23, 1.24, 1.25, 1.24, 1.25, 1.24, 1.25, 1.24, 1.25]
            }
        ]
    });

    // 初始化患者满意度趋势图表
    const satisfactionTrendChart = echarts.init(document.getElementById('satisfactionTrendChart'));
    satisfactionTrendChart.setOption({
        title: {
            text: '患者满意度趋势',
            textStyle: {
                color: '#333',
                fontSize: 16,
                fontWeight: 'normal'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data: ['全院'],
            textStyle: {
                color: '#333'
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
            boundaryGap: false,
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            axisLabel: {
                color: '#666'
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                color: '#666',
                formatter: '{value}%'
            },
            min: 95,     // 设置最小值，使数据在图表中居中显示
            max: 98      // 设置最大值，使数据在图表中居中显示
        },
        series: [
            {
                name: '全院',
                type: 'line',
                emphasis: {
                    focus: 'series'
                },
                data: [95.8, 96.0, 95.9, 96.2, 96.1, 96.3, 96.2, 96.3, 96.4, 96.3, 96.2, 96.8]
            }
        ]
    });

    // 初始化医疗质量指标对比图表
    const qualityComparisonChart = echarts.init(document.getElementById('qualityComparisonChart'));
    qualityComparisonChart.setOption({
        title: {
            text: '医疗质量指标对比',
            textStyle: {
                color: '#333',
                fontSize: 16,
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
            data: ['全院'],
            textStyle: {
                color: '#333'
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
            data: ['治愈好转率', '危重患者抢救成功率', '院内感染率', '医疗事故发生率'],
            axisLabel: {
                color: '#666'
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                color: '#666',
                formatter: '{value}%'
            },
            min: 0,      // 设置最小值，使数据在图表中居中显示
            max: 100     // 设置最大值，使数据在图表中居中显示
        },
        series: [
            {
                name: '全院',
                type: 'bar',
                emphasis: {
                    focus: 'series'
                },
                data: [96.2, 93.5, 1.0, 0.04]
            }
        ]
    });

    

    // 初始化专科技术能力雷达图
    const specialtyRadarChart = echarts.init(document.getElementById('specialtyRadarChart'));
    specialtyRadarChart.setOption({
        title: {
            text: '专科技术能力雷达图',
            textStyle: {
                color: '#333',
                fontSize: 16,
                fontWeight: 'normal'
            }
        },
        tooltip: {},
        legend: {
            data: ['全院'],
            textStyle: {
                color: '#333'
            }
        },
        radar: {
            indicator: [
                { name: '三/四级手术占比', max: 100 },
                { name: '微创手术占比', max: 100 },
                { name: '新技术开展数', max: 10 },
                { name: '科研论文数', max: 20 },
                { name: '专科门诊量', max: 100 },
                { name: '专科住院量', max: 100 }
            ]
        },
        series: [{
            name: '专科技术能力',
            type: 'radar',
            data: [
                {
                    value: [49.5, 51.5, 6.2, 14.6, 70, 71],
                    name: '全院'
                }
            ]
        }]
    });







    // 窗口大小改变时，重新调整图表大小
    window.addEventListener('resize', function() {
        outpatientTrendChart.resize();
        dischargeTrendChart.resize();
        surgeryTrendChart.resize();
        avgStayTrendChart.resize();
        bedUsageTrendChart.resize();
        cmiTrendChart.resize();
        satisfactionTrendChart.resize();
        qualityMetricsChart.resize();
        specialtyRadarChart.resize();
    });
    
    // 填充科室数据列表
    fillDepartmentTable();
});