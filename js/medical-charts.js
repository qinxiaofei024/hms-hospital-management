/**
 * 医疗质量安全监测系统 - 专用图表库
 * Medical Quality Safety Monitoring System - Chart Library
 */

class MedicalCharts {
    constructor() {
        this.chartInstances = new Map();
        this.defaultColors = [
            '#28a745', '#17a2b8', '#ffc107', '#dc3545', 
            '#6f42c1', '#fd7e14', '#20c997', '#6c757d'
        ];
        this.initialized = false;
        
        console.log('MedicalCharts library initialized');
    }

    /**
     * 初始化图表库
     */
    init() {
        if (this.initialized) return;
        
        // 检查ECharts是否可用
        if (typeof echarts === 'undefined') {
            console.error('ECharts library not found. Please include ECharts before using MedicalCharts.');
            return;
        }
        
        this.initialized = true;
        console.log('MedicalCharts library ready');
    }

    /**
     * 创建诊疗流程规范监测图表
     */
    createDiagnosisProcessChart(containerId) {
        const option = {
            title: {
                text: '诊疗流程规范监测趋势',
                left: 'center',
                textStyle: {
                    fontSize: 16,
                    fontWeight: 'normal',
                    color: '#333'
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                },
                formatter: function(params) {
                    let result = `<div style="font-weight: bold; margin-bottom: 5px;">${params[0].axisValue}</div>`;
                    params.forEach(param => {
                        result += `<div style="margin: 2px 0;">
                            <span style="display: inline-block; width: 10px; height: 10px; background-color: ${param.color}; margin-right: 5px;"></span>
                            ${param.seriesName}: ${param.value}%
                        </div>`;
                    });
                    return result;
                }
            },
            legend: {
                data: ['诊疗路径执行率', '临床指南遵循率', '合理检查率', '药物使用规范率'],
                bottom: 10,
                textStyle: {
                    fontSize: 12
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                top: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                axisLine: {
                    lineStyle: {
                        color: '#ddd'
                    }
                },
                axisLabel: {
                    color: '#666'
                }
            },
            yAxis: {
                type: 'value',
                min: 80,
                max: 100,
                axisLabel: {
                    formatter: '{value}%',
                    color: '#666'
                },
                axisLine: {
                    lineStyle: {
                        color: '#ddd'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: '#f0f0f0'
                    }
                }
            },
            series: [
                {
                    name: '诊疗路径执行率',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 6,
                    data: [92.5, 93.2, 94.1, 95.3, 96.2, 97.1, 96.8, 95.9, 94.7, 95.5, 96.3, 97.2],
                    itemStyle: {
                        color: this.defaultColors[0]
                    },
                    lineStyle: {
                        width: 3
                    },
                    areaStyle: {
                        opacity: 0.1
                    }
                },
                {
                    name: '临床指南遵循率',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 6,
                    data: [88.3, 89.1, 90.2, 91.5, 92.3, 93.1, 92.8, 91.9, 90.7, 91.5, 92.3, 93.2],
                    itemStyle: {
                        color: this.defaultColors[1]
                    },
                    lineStyle: {
                        width: 3
                    },
                    areaStyle: {
                        opacity: 0.1
                    }
                },
                {
                    name: '合理检查率',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 6,
                    data: [85.2, 86.1, 87.3, 88.5, 89.2, 90.1, 89.8, 88.9, 87.7, 88.5, 89.3, 90.2],
                    itemStyle: {
                        color: this.defaultColors[2]
                    },
                    lineStyle: {
                        width: 3
                    },
                    areaStyle: {
                        opacity: 0.1
                    }
                },
                {
                    name: '药物使用规范率',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 6,
                    data: [91.2, 92.1, 93.3, 94.5, 95.2, 96.1, 95.8, 94.9, 93.7, 94.5, 95.3, 96.2],
                    itemStyle: {
                        color: this.defaultColors[3]
                    },
                    lineStyle: {
                        width: 3
                    },
                    areaStyle: {
                        opacity: 0.1
                    }
                }
            ]
        };

        return this.createChart(containerId, option);
    }

    /**
     * 创建手术质量安全监测图表
     */
    createSurgicalQualityChart(containerId) {
        const option = {
            title: {
                text: '手术质量安全监测指标',
                left: 'center',
                textStyle: {
                    fontSize: 16,
                    fontWeight: 'normal',
                    color: '#333'
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                },
                formatter: function(params) {
                    let result = `<div style="font-weight: bold; margin-bottom: 5px;">${params[0].axisValue}</div>`;
                    params.forEach(param => {
                        const unit = param.seriesName.includes('率') ? '%' : '例';
                        result += `<div style="margin: 2px 0;">
                            <span style="display: inline-block; width: 10px; height: 10px; background-color: ${param.color}; margin-right: 5px;"></span>
                            ${param.seriesName}: ${param.value}${unit}
                        </div>`;
                    });
                    return result;
                }
            },
            legend: {
                data: ['手术成功率', '术后感染率', '手术并发症率', '非计划再手术率'],
                bottom: 10
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                top: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
            },
            yAxis: [
                {
                    type: 'value',
                    name: '成功率(%)',
                    min: 95,
                    max: 100,
                    position: 'left',
                    axisLabel: {
                        formatter: '{value}%'
                    }
                },
                {
                    type: 'value',
                    name: '并发症率(%)',
                    min: 0,
                    max: 5,
                    position: 'right',
                    axisLabel: {
                        formatter: '{value}%'
                    }
                }
            ],
            series: [
                {
                    name: '手术成功率',
                    type: 'line',
                    yAxisIndex: 0,
                    smooth: true,
                    data: [96.8, 97.2, 98.1, 97.9, 98.3, 99.1, 98.7, 97.8, 96.9, 97.5, 98.2, 99.0],
                    itemStyle: {
                        color: this.defaultColors[0]
                    },
                    lineStyle: {
                        width: 3
                    }
                },
                {
                    name: '术后感染率',
                    type: 'line',
                    yAxisIndex: 1,
                    smooth: true,
                    data: [2.1, 2.0, 1.9, 2.0, 1.8, 1.7, 1.8, 1.9, 2.0, 1.9, 1.8, 1.7],
                    itemStyle: {
                        color: this.defaultColors[3]
                    },
                    lineStyle: {
                        width: 3
                    }
                },
                {
                    name: '手术并发症率',
                    type: 'line',
                    yAxisIndex: 1,
                    smooth: true,
                    data: [3.2, 3.1, 3.0, 3.1, 2.9, 2.8, 2.9, 3.0, 3.1, 3.0, 2.9, 2.8],
                    itemStyle: {
                        color: this.defaultColors[2]
                    },
                    lineStyle: {
                        width: 3
                    }
                },
                {
                    name: '非计划再手术率',
                    type: 'line',
                    yAxisIndex: 1,
                    smooth: true,
                    data: [1.2, 1.1, 1.0, 1.1, 0.9, 0.8, 0.9, 1.0, 1.1, 1.0, 0.9, 0.8],
                    itemStyle: {
                        color: this.defaultColors[4]
                    },
                    lineStyle: {
                        width: 3
                    }
                }
            ]
        };

        return this.createChart(containerId, option);
    }

    /**
     * 创建护理质量监测图表
     */
    createNursingQualityChart(containerId) {
        const option = {
            title: {
                text: '护理质量监测指标',
                left: 'center',
                textStyle: {
                    fontSize: 16,
                    fontWeight: 'normal',
                    color: '#333'
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            legend: {
                data: ['护理满意度', '护理不良事件发生率', '护理文书合格率', '护理技能达标率'],
                bottom: 10
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                top: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
            },
            yAxis: [
                {
                    type: 'value',
                    name: '满意度/合格率(%)',
                    min: 85,
                    max: 100,
                    position: 'left',
                    axisLabel: {
                        formatter: '{value}%'
                    }
                },
                {
                    type: 'value',
                    name: '不良事件率(‰)',
                    min: 0,
                    max: 5,
                    position: 'right',
                    axisLabel: {
                        formatter: '{value}‰'
                    }
                }
            ],
            series: [
                {
                    name: '护理满意度',
                    type: 'line',
                    yAxisIndex: 0,
                    smooth: true,
                    data: [94.2, 94.8, 95.3, 95.7, 96.1, 96.5, 96.2, 95.8, 95.4, 95.9, 96.3, 96.7],
                    itemStyle: {
                        color: this.defaultColors[0]
                    },
                    areaStyle: {
                        opacity: 0.1
                    }
                },
                {
                    name: '护理不良事件发生率',
                    type: 'line',
                    yAxisIndex: 1,
                    smooth: true,
                    data: [2.8, 2.6, 2.4, 2.5, 2.3, 2.1, 2.2, 2.4, 2.6, 2.4, 2.2, 2.0],
                    itemStyle: {
                        color: this.defaultColors[3]
                    }
                },
                {
                    name: '护理文书合格率',
                    type: 'line',
                    yAxisIndex: 0,
                    smooth: true,
                    data: [91.5, 92.1, 92.8, 93.2, 93.7, 94.1, 93.8, 93.4, 93.0, 93.5, 93.9, 94.3],
                    itemStyle: {
                        color: this.defaultColors[1]
                    }
                },
                {
                    name: '护理技能达标率',
                    type: 'line',
                    yAxisIndex: 0,
                    smooth: true,
                    data: [88.3, 89.1, 89.8, 90.2, 90.7, 91.1, 90.8, 90.4, 90.0, 90.5, 90.9, 91.3],
                    itemStyle: {
                        color: this.defaultColors[2]
                    }
                }
            ]
        };

        return this.createChart(containerId, option);
    }

    /**
     * 创建疑难危重病例管理图表
     */
    createCriticalCaseChart(containerId) {
        const option = {
            title: {
                text: '疑难危重病例管理统计',
                left: 'center',
                textStyle: {
                    fontSize: 16,
                    fontWeight: 'normal',
                    color: '#333'
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            legend: {
                data: ['疑难病例数', '危重病例数', '多学科会诊率', '治愈好转率'],
                bottom: 10
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                top: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
            },
            yAxis: [
                {
                    type: 'value',
                    name: '病例数(例)',
                    position: 'left',
                    axisLabel: {
                        formatter: '{value}'
                    }
                },
                {
                    type: 'value',
                    name: '比率(%)',
                    min: 80,
                    max: 100,
                    position: 'right',
                    axisLabel: {
                        formatter: '{value}%'
                    }
                }
            ],
            series: [
                {
                    name: '疑难病例数',
                    type: 'bar',
                    yAxisIndex: 0,
                    data: [45, 52, 48, 56, 61, 58, 62, 59, 54, 57, 63, 65],
                    itemStyle: {
                        color: this.defaultColors[0]
                    }
                },
                {
                    name: '危重病例数',
                    type: 'bar',
                    yAxisIndex: 0,
                    data: [23, 28, 25, 31, 34, 32, 36, 33, 29, 32, 37, 39],
                    itemStyle: {
                        color: this.defaultColors[3]
                    }
                },
                {
                    name: '多学科会诊率',
                    type: 'line',
                    yAxisIndex: 1,
                    smooth: true,
                    data: [85.2, 86.8, 87.5, 88.9, 89.7, 90.3, 89.8, 88.6, 87.9, 89.2, 90.1, 91.2],
                    itemStyle: {
                        color: this.defaultColors[1]
                    },
                    lineStyle: {
                        width: 3
                    }
                },
                {
                    name: '治愈好转率',
                    type: 'line',
                    yAxisIndex: 1,
                    smooth: true,
                    data: [92.1, 93.2, 94.1, 94.8, 95.3, 95.7, 95.2, 94.6, 94.0, 94.7, 95.4, 96.1],
                    itemStyle: {
                        color: this.defaultColors[2]
                    },
                    lineStyle: {
                        width: 3
                    }
                }
            ]
        };

        return this.createChart(containerId, option);
    }

    /**
     * 创建药物与血液管理图表
     */
    createMedicationBloodChart(containerId) {
        const option = {
            title: {
                text: '药物与血液管理监测',
                left: 'center',
                textStyle: {
                    fontSize: 16,
                    fontWeight: 'normal',
                    color: '#333'
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            legend: {
                data: ['合理用药率', '抗菌药物使用率', '血液制品使用规范率', '药物不良反应率'],
                bottom: 10
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                top: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
            },
            yAxis: [
                {
                    type: 'value',
                    name: '使用率/规范率(%)',
                    min: 80,
                    max: 100,
                    position: 'left',
                    axisLabel: {
                        formatter: '{value}%'
                    }
                },
                {
                    type: 'value',
                    name: '不良反应率(%)',
                    min: 0,
                    max: 5,
                    position: 'right',
                    axisLabel: {
                        formatter: '{value}%'
                    }
                }
            ],
            series: [
                {
                    name: '合理用药率',
                    type: 'line',
                    yAxisIndex: 0,
                    smooth: true,
                    data: [91.2, 92.1, 93.3, 94.5, 95.2, 96.1, 95.8, 94.9, 93.7, 94.5, 95.3, 96.2],
                    itemStyle: {
                        color: this.defaultColors[0]
                    },
                    areaStyle: {
                        opacity: 0.1
                    }
                },
                {
                    name: '抗菌药物使用率',
                    type: 'line',
                    yAxisIndex: 0,
                    smooth: true,
                    data: [88.5, 89.2, 90.1, 90.8, 91.5, 92.2, 91.8, 90.9, 89.7, 90.6, 91.4, 92.1],
                    itemStyle: {
                        color: this.defaultColors[1]
                    }
                },
                {
                    name: '血液制品使用规范率',
                    type: 'line',
                    yAxisIndex: 0,
                    smooth: true,
                    data: [94.8, 95.2, 95.7, 96.1, 96.5, 96.9, 96.6, 96.2, 95.8, 96.3, 96.7, 97.1],
                    itemStyle: {
                        color: this.defaultColors[2]
                    }
                },
                {
                    name: '药物不良反应率',
                    type: 'line',
                    yAxisIndex: 1,
                    smooth: true,
                    data: [2.3, 2.1, 2.0, 1.9, 1.8, 1.7, 1.8, 1.9, 2.0, 1.9, 1.8, 1.7],
                    itemStyle: {
                        color: this.defaultColors[3]
                    },
                    lineStyle: {
                        width: 3
                    }
                }
            ]
        };

        return this.createChart(containerId, option);
    }

    /**
     * 创建技术创新与质量提升图表
     */
    createTechnologyInnovationChart(containerId) {
        const option = {
            title: {
                text: '技术创新与质量提升指标',
                left: 'center',
                textStyle: {
                    fontSize: 16,
                    fontWeight: 'normal',
                    color: '#333'
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            legend: {
                data: ['新技术应用数', '质量改进项目数', '培训完成率', '技术创新成功率'],
                bottom: 10
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                top: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
            },
            yAxis: [
                {
                    type: 'value',
                    name: '项目数(个)',
                    position: 'left',
                    axisLabel: {
                        formatter: '{value}'
                    }
                },
                {
                    type: 'value',
                    name: '完成率/成功率(%)',
                    min: 80,
                    max: 100,
                    position: 'right',
                    axisLabel: {
                        formatter: '{value}%'
                    }
                }
            ],
            series: [
                {
                    name: '新技术应用数',
                    type: 'bar',
                    yAxisIndex: 0,
                    data: [3, 5, 4, 6, 8, 7, 9, 8, 6, 7, 10, 12],
                    itemStyle: {
                        color: this.defaultColors[0]
                    }
                },
                {
                    name: '质量改进项目数',
                    type: 'bar',
                    yAxisIndex: 0,
                    data: [8, 10, 9, 12, 15, 14, 16, 15, 13, 14, 17, 19],
                    itemStyle: {
                        color: this.defaultColors[1]
                    }
                },
                {
                    name: '培训完成率',
                    type: 'line',
                    yAxisIndex: 1,
                    smooth: true,
                    data: [92.3, 93.1, 94.2, 94.8, 95.5, 96.1, 95.7, 95.2, 94.6, 95.3, 96.0, 96.7],
                    itemStyle: {
                        color: this.defaultColors[2]
                    },
                    lineStyle: {
                        width: 3
                    }
                },
                {
                    name: '技术创新成功率',
                    type: 'line',
                    yAxisIndex: 1,
                    smooth: true,
                    data: [85.2, 86.8, 87.5, 88.9, 89.7, 90.3, 89.8, 88.6, 87.9, 89.2, 90.1, 91.2],
                    itemStyle: {
                        color: this.defaultColors[3]
                    },
                    lineStyle: {
                        width: 3
                    }
                }
            ]
        };

        return this.createChart(containerId, option);
    }

    /**
     * 创建图表实例
     */
    createChart(containerId, option) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Chart container not found: ${containerId}`);
            return null;
        }

        // 如果已存在图表实例，先销毁
        if (this.chartInstances.has(containerId)) {
            this.chartInstances.get(containerId).dispose();
        }

        // 创建新的图表实例
        const chart = echarts.init(container);
        chart.setOption(option);

        // 保存图表实例
        this.chartInstances.set(containerId, chart);

        // 注册到全局组件管理器
        if (window.medicalQualityComponents) {
            window.medicalQualityComponents.registerChart(containerId, chart);
        }

        console.log(`Chart created: ${containerId}`);
        return chart;
    }

    /**
     * 更新图表数据
     */
    updateChart(containerId, newOption) {
        const chart = this.chartInstances.get(containerId);
        if (chart) {
            chart.setOption(newOption, true);
            console.log(`Chart updated: ${containerId}`);
        } else {
            console.warn(`Chart not found for update: ${containerId}`);
        }
    }

    /**
     * 调整图表大小
     */
    resizeChart(containerId) {
        const chart = this.chartInstances.get(containerId);
        if (chart) {
            chart.resize();
        }
    }

    /**
     * 调整所有图表大小
     */
    resizeAllCharts() {
        this.chartInstances.forEach(chart => {
            chart.resize();
        });
    }

    /**
     * 销毁图表
     */
    destroyChart(containerId) {
        const chart = this.chartInstances.get(containerId);
        if (chart) {
            chart.dispose();
            this.chartInstances.delete(containerId);
            console.log(`Chart destroyed: ${containerId}`);
        }
    }

    /**
     * 销毁所有图表
     */
    destroyAllCharts() {
        this.chartInstances.forEach((chart, containerId) => {
            chart.dispose();
            console.log(`Chart destroyed: ${containerId}`);
        });
        this.chartInstances.clear();
    }

    /**
     * 获取图表实例
     */
    getChart(containerId) {
        return this.chartInstances.get(containerId);
    }

    /**
     * 获取所有图表实例
     */
    getAllCharts() {
        return this.chartInstances;
    }
}

// 创建全局实例
window.medicalCharts = new MedicalCharts();

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
    // 等待ECharts加载完成后再初始化
    if (typeof echarts !== 'undefined') {
        window.medicalCharts.init();
    } else {
        // 监听ECharts加载完成事件
        document.addEventListener('echartsLoaded', () => {
            window.medicalCharts.init();
        });
    }
});

// 导出类以供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MedicalCharts;
}