// 重点指标监控页面JavaScript功能

// 全局变量
let currentPeriod = 'month'; // 当前时段：day, month, year
let currentDepartment = 'all'; // 当前科室
let indicatorsData = {}; // 指标数据
let chartsInstances = {}; // 图表实例

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    loadIndicatorsData();
    bindEvents();
});

// 初始化页面
function initializePage() {
    // 设置默认日期
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = today;
    
    document.getElementById('startDate').value = formatDate(startDate);
    document.getElementById('endDate').value = formatDate(endDate);
    
    // 设置默认时段
    document.getElementById('timePeriod').value = currentPeriod;
    document.getElementById('department').value = currentDepartment;
}

// 绑定事件
function bindEvents() {
    // 筛选控件事件
    document.getElementById('timePeriod').addEventListener('change', handleTimePeriodChange);
    document.getElementById('department').addEventListener('change', handleDepartmentChange);
    document.getElementById('startDate').addEventListener('change', handleDateChange);
    document.getElementById('endDate').addEventListener('change', handleDateChange);
    
    // 按钮事件
    document.getElementById('queryBtn').addEventListener('click', handleQuery);
    document.getElementById('resetBtn').addEventListener('click', handleReset);
    document.getElementById('exportBtn').addEventListener('click', handleExport);
    
    // 表格操作事件
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-config')) {
            handleConfigIndicator(e.target.dataset.indicator);
        } else if (e.target.classList.contains('btn-detail')) {
            handleViewDetail(e.target.dataset.indicator);
        }
    });
    
    // 弹窗关闭事件
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal') || e.target.classList.contains('close')) {
            closeModal();
        }
    });
}

// 时段切换处理
function handleTimePeriodChange(e) {
    currentPeriod = e.target.value;
    loadIndicatorsData();
}

// 科室切换处理
function handleDepartmentChange(e) {
    currentDepartment = e.target.value;
    loadIndicatorsData();
}

// 日期变化处理
function handleDateChange() {
    // 验证日期范围
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    
    if (startDate > endDate) {
        alert('开始日期不能大于结束日期');
        return;
    }
    
    loadIndicatorsData();
}

// 查询处理
function handleQuery() {
    showLoading();
    loadIndicatorsData();
}

// 重置处理
function handleReset() {
    initializePage();
    loadIndicatorsData();
}

// 导出处理
function handleExport() {
    const data = generateExportData();
    exportToExcel(data, `重点指标监控_${formatDate(new Date())}.xlsx`);
}

// 加载指标数据
function loadIndicatorsData() {
    showLoading();
    
    // 模拟API调用
    setTimeout(() => {
        indicatorsData = generateMockData();
        renderIndicatorsOverview();
        renderIndicatorsTable();
        renderTrendCharts();
        hideLoading();
    }, 1000);
}

// 生成模拟数据
function generateMockData() {
    const departments = ['心内科', '神经内科', '呼吸内科', '消化内科', '内分泌科'];
    
    // 重新组织指标结构
    const workloadIndicators = [
        { id: 'outpatient', name: '门诊量', category: 'workload' },
        { id: 'inpatient', name: '住院量', category: 'workload' },
        { id: 'surgery', name: '手术量', category: 'workload' },
        { id: 'emergency', name: '急诊量', category: 'workload' }
    ];
    
    const revenueIndicators = [
        { id: 'medical_revenue', name: '医疗收入', category: 'revenue' },
        { id: 'drug_revenue', name: '药品收入', category: 'revenue' },
        { id: 'material_revenue', name: '耗材收入', category: 'revenue' },
        { id: 'exam_revenue', name: '检查收入', category: 'revenue' }
    ];
    
    const costEfficiencyIndicators = [
        { id: 'cost_control', name: '门诊均次费用', category: 'cost' },
        { id: 'drug_ratio', name: '药占比', category: 'cost' },
        { id: 'material_ratio', name: '耗材占比', category: 'cost' },
        { id: 'avg_cost', name: '人均住院费用', category: 'cost' },
        { id: 'bed_utilization', name: '床位使用率', category: 'efficiency' },
        { id: 'avg_stay', name: '平均住院日', category: 'efficiency' },
        { id: 'bed_turnover', name: '病床周转次数', category: 'efficiency' },
        { id: 'quality_score', name: '安全质量', category: 'quality' }
    ];
    
    const trendIndicators = [
        { id: 'trend-workload', name: '工作量趋势', category: 'workload' },
        { id: 'trend-revenue', name: '收入结构趋势', category: 'revenue' },
        { id: 'trend-cost', name: '费用控制趋势', category: 'cost' },
        { id: 'trend-efficiency', name: '效益效率趋势', category: 'efficiency' },
        { id: 'trend-quality', name: '质量安全趋势', category: 'quality' },
        { id: 'trend-satisfaction', name: '患者满意度趋势', category: 'quality' }
    ];
    
    const data = {
        workload: {},
        revenue: {},
        costEfficiency: {},
        trends: {},
        details: {},
        overview: {}
    };
    
    // 生成工作量指标数据
    workloadIndicators.forEach(indicator => {
        const baseValue = Math.random() * 1000 + 500;
        const trend = Math.random() > 0.5 ? 'up' : 'down';
        const trendValue = (Math.random() * 20 - 10).toFixed(1);
        const status = getIndicatorStatus(baseValue, indicator.category);
        
        // 为每个指标生成对应的单一子指标
        let subIndicators = [];
        if (indicator.id === 'outpatient') {
            subIndicators = [{ name: '门诊量', value: baseValue.toFixed(0), unit: '人次' }];
        } else if (indicator.id === 'inpatient') {
            subIndicators = [{ name: '住院量', value: (Math.random() * 200 + 100).toFixed(0), unit: '人次' }];
        } else if (indicator.id === 'surgery') {
            subIndicators = [{ name: '手术量', value: (Math.random() * 50 + 20).toFixed(0), unit: '台次' }];
        } else if (indicator.id === 'emergency') {
            subIndicators = [{ name: '急诊量', value: (Math.random() * 300 + 150).toFixed(0), unit: '人次' }];
        }
        
        data.workload[indicator.id] = {
            name: indicator.name,
            value: baseValue.toFixed(0),
            unit: getIndicatorUnit(indicator.category),
            trend: trend,
            trendValue: trendValue,
            status: status,
            subIndicators: subIndicators
        };
    });
    
    // 生成收入指标数据
    revenueIndicators.forEach(indicator => {
        const baseValue = Math.random() * 500 + 200;
        const trend = Math.random() > 0.5 ? 'up' : 'down';
        const trendValue = (Math.random() * 20 - 10).toFixed(1);
        const status = getIndicatorStatus(baseValue, indicator.category);
        
        // 为每个收入指标生成对应的单一子指标
        let subIndicators = [];
        if (indicator.id === 'medical_revenue') {
            subIndicators = [{ name: '医疗收入', value: baseValue.toFixed(1), unit: '万元' }];
        } else if (indicator.id === 'drug_revenue') {
            subIndicators = [{ name: '药品收入', value: baseValue.toFixed(1), unit: '万元' }];
        } else if (indicator.id === 'material_revenue') {
            subIndicators = [{ name: '耗材收入', value: baseValue.toFixed(1), unit: '万元' }];
        } else if (indicator.id === 'exam_revenue') {
            subIndicators = [{ name: '检查收入', value: baseValue.toFixed(1), unit: '万元' }];
        }
        
        data.revenue[indicator.id] = {
            name: indicator.name,
            value: baseValue.toFixed(1),
            unit: '万元',
            trend: trend,
            trendValue: trendValue,
            status: status,
            subIndicators: subIndicators
        };
    });
    
    // 生成费用控制和效益效率指标数据
    costEfficiencyIndicators.forEach(indicator => {
        let baseValue, subIndicators = [];
        const trend = Math.random() > 0.5 ? 'up' : 'down';
        const trendValue = (Math.random() * 20 - 10).toFixed(1);
        
        // 为每个指标设置具体数值
        if (indicator.id === 'cost_control') {
            baseValue = 457;
            subIndicators = [{ name: '门诊均次费用', value: '457', unit: '元' }];
        } else if (indicator.id === 'drug_ratio') {
            baseValue = 36;
            subIndicators = [{ name: '药占比', value: '36', unit: '%' }];
        } else if (indicator.id === 'material_ratio') {
            baseValue = 27;
            subIndicators = [{ name: '耗材占比', value: '27', unit: '%' }];
        } else if (indicator.id === 'avg_cost') {
            baseValue = 17894;
            subIndicators = [{ name: '人均住院费用', value: '17894', unit: '元' }];
        } else if (indicator.id === 'bed_utilization') {
            baseValue = Math.random() * 100 + 50;
            subIndicators = [{ name: '床位使用率', value: baseValue.toFixed(1), unit: '%' }];
        } else if (indicator.id === 'avg_stay') {
            baseValue = 7.12;
            subIndicators = [{ name: '平均住院日', value: '7.12', unit: '天' }];
        } else if (indicator.id === 'bed_turnover') {
            baseValue = 51.26;
            subIndicators = [{ name: '病床周转次数', value: '51.26', unit: '次' }];
        } else if (indicator.id === 'quality_score') {
            baseValue = 99;
            subIndicators = [{ name: '安全质量', value: '99', unit: '分' }];
        }
        
        const status = getIndicatorStatus(baseValue, indicator.category);
        
        data.costEfficiency[indicator.id] = {
            name: indicator.name,
            value: baseValue.toFixed(1),
            unit: getIndicatorUnit(indicator.category),
            trend: trend,
            trendValue: trendValue,
            status: status,
            subIndicators: subIndicators
        };
    });
    
    // 生成趋势数据
    trendIndicators.forEach(indicator => {
        data.trends[indicator.id] = generateTrendData(indicator, currentPeriod);
    });
    
    // 生成overview数据（用于表格渲染）
    [...workloadIndicators, ...revenueIndicators, ...costEfficiencyIndicators].forEach(indicator => {
        data.overview[indicator.id] = {
            name: indicator.name,
            category: indicator.category
        };
    });
    
    // 生成详细数据
    [...workloadIndicators, ...revenueIndicators, ...costEfficiencyIndicators].forEach(indicator => {
        data.details[indicator.id] = generateDetailData(indicator, departments);
    });
    
    return data;
}

// 获取指标状态
function getIndicatorStatus(value, category) {
    const thresholds = {
        workload: { warning: 70, alert: 50 },
        revenue: { warning: 80, alert: 60 },
        cost: { warning: 75, alert: 90 },
        efficiency: { warning: 75, alert: 60 },
        quality: { warning: 85, alert: 70 }
    };
    
    const threshold = thresholds[category] || { warning: 75, alert: 60 };
    
    if (category === 'cost') {
        // 费用控制：值越高越不好
        if (value >= threshold.alert) return 'alert';
        if (value >= threshold.warning) return 'warning';
        return 'normal';
    } else {
        // 其他指标：值越高越好
        if (value < threshold.alert) return 'alert';
        if (value < threshold.warning) return 'warning';
        return 'normal';
    }
}

// 获取指标单位
function getIndicatorUnit(category) {
    const units = {
        workload: '台次',
        revenue: '万元',
        cost: '%',
        efficiency: '%',
        quality: '分'
    };
    return units[category] || '';
}

// 生成子指标 - 简化版本，每个卡片只保留主要指标
function generateSubIndicators(category) {
    const subIndicators = {
        workload: [
            { name: '门诊量', value: (Math.random() * 1000 + 500).toFixed(0), unit: '人次' }
        ],
        revenue: [
            { name: '医疗收入', value: (Math.random() * 500 + 200).toFixed(1), unit: '万元' }
        ],
        cost: [
            { name: '药占比', value: (Math.random() * 20 + 25).toFixed(1), unit: '%' }
        ],
        efficiency: [
            { name: '床位使用率', value: (Math.random() * 20 + 80).toFixed(1), unit: '%' }
        ],
        quality: [
            { name: '患者满意度', value: (Math.random() * 10 + 85).toFixed(1), unit: '分' }
        ]
    };
    
    return subIndicators[category] || [];
}

// 生成详细数据
function generateDetailData(indicator, departments) {
    return departments.map(dept => {
        const baseValue = Math.random() * 100 + 50;
        const status = getIndicatorStatus(baseValue, indicator.category);
        const trend = Math.random() > 0.5 ? 'up' : 'down';
        const trendValue = (Math.random() * 20 - 10).toFixed(1);
        
        return {
            department: dept,
            value: baseValue.toFixed(1),
            target: (baseValue * (0.9 + Math.random() * 0.2)).toFixed(1),
            completion: ((baseValue / (baseValue * 1.1)) * 100).toFixed(1),
            trend: trend,
            trendValue: trendValue,
            status: status,
            lastUpdate: formatDateTime(new Date())
        };
    });
}

// 生成趋势数据
function generateTrendData(indicator, period) {
    const periods = {
        day: 30,
        month: 12,
        year: 5
    };
    
    const count = periods[period] || 12;
    const data = [];
    
    for (let i = 0; i < count; i++) {
        const date = new Date();
        if (period === 'day') {
            date.setDate(date.getDate() - (count - 1 - i));
        } else if (period === 'month') {
            date.setMonth(date.getMonth() - (count - 1 - i));
        } else {
            date.setFullYear(date.getFullYear() - (count - 1 - i));
        }
        
        data.push({
            date: formatPeriodDate(date, period),
            value: Math.random() * 100 + 50,
            target: Math.random() * 100 + 60
        });
    }
    
    return data;
}

// 生成对比数据


// 渲染指标概览
function renderIndicatorsOverview() {
    const container = document.getElementById('indicatorsOverview');
    container.innerHTML = '';
    
    // 第一个容器：工作量指标（一行4个）
    const workloadContainer = document.createElement('div');
    workloadContainer.className = 'workload-indicators';
    const workloadTitle = document.createElement('h3');
    workloadTitle.textContent = '工作量指标';
    workloadTitle.style.marginBottom = '16px';
    workloadTitle.style.fontSize = '18px';
    workloadTitle.style.fontWeight = '600';
    workloadTitle.style.color = '#333';
    container.appendChild(workloadTitle);
    
    Object.entries(indicatorsData.workload).forEach(([key, data]) => {
        const card = createOverviewCard(data);
        workloadContainer.appendChild(card);
    });
    container.appendChild(workloadContainer);
    
    // 第二个容器：收入指标（一行4个）
    const revenueContainer = document.createElement('div');
    revenueContainer.className = 'revenue-indicators';
    const revenueTitle = document.createElement('h3');
    revenueTitle.textContent = '收入指标';
    revenueTitle.style.marginBottom = '16px';
    revenueTitle.style.fontSize = '18px';
    revenueTitle.style.fontWeight = '600';
    revenueTitle.style.color = '#333';
    container.appendChild(revenueTitle);
    
    Object.entries(indicatorsData.revenue).forEach(([key, data]) => {
        const card = createOverviewCard(data);
        revenueContainer.appendChild(card);
    });
    container.appendChild(revenueContainer);
    
    // 第三个容器：费用控制和效益效率（每行4个，排两行）
    const costEfficiencyContainer = document.createElement('div');
    costEfficiencyContainer.className = 'cost-efficiency-indicators';
    const costEfficiencyTitle = document.createElement('h3');
    costEfficiencyTitle.textContent = '费用控制与效益效率';
    costEfficiencyTitle.style.marginBottom = '16px';
    costEfficiencyTitle.style.fontSize = '18px';
    costEfficiencyTitle.style.fontWeight = '600';
    costEfficiencyTitle.style.color = '#333';
    container.appendChild(costEfficiencyTitle);
    
    const costEfficiencyEntries = Object.entries(indicatorsData.costEfficiency);
    
    // 每行4个卡片，排两行
    for (let i = 0; i < costEfficiencyEntries.length; i += 4) {
        const row = document.createElement('div');
        row.className = 'cost-efficiency-row';
        
        for (let j = i; j < Math.min(i + 4, costEfficiencyEntries.length); j++) {
            const [key, data] = costEfficiencyEntries[j];
            const card = createOverviewCard(data);
            row.appendChild(card);
        }
        
        costEfficiencyContainer.appendChild(row);
    }
    container.appendChild(costEfficiencyContainer);
}

// 创建概览卡片
function createOverviewCard(data) {
    const card = document.createElement('div');
    card.className = 'overview-card';
    card.setAttribute('data-status', data.status);
    
    const statusText = {
        normal: '正常',
        warning: '预警',
        alert: '告警'
    };
    
    card.innerHTML = `
        <div class="card-header">
            <h3>${data.name}</h3>
            <span class="status-badge ${data.status}">${statusText[data.status]}</span>
        </div>
        <div class="card-content">
            ${data.subIndicators.map(sub => `
                <div class="indicator-item">
                    <span class="indicator-name">${sub.name}</span>
                    <span class="indicator-value">${sub.value} ${sub.unit}</span>
                </div>
            `).join('')}
        </div>
    `;
    
    return card;
}

// 渲染指标表格
function renderIndicatorsTable() {
    const tbody = document.querySelector('#indicatorsTable tbody');
    tbody.innerHTML = '';
    
    Object.entries(indicatorsData.details).forEach(([key, details]) => {
        details.forEach(item => {
            const row = createTableRow(key, item);
            tbody.appendChild(row);
        });
    });
}

// 创建表格行
function createTableRow(indicatorId, data) {
    const row = document.createElement('tr');
    
    const statusText = {
        normal: '正常',
        warning: '预警',
        alert: '告警'
    };
    
    row.innerHTML = `
        <td>${indicatorsData.overview[indicatorId].name}</td>
        <td>${data.department}</td>
        <td>${data.value}</td>
        <td>${data.target}</td>
        <td>${data.completion}%</td>
        <td class="table-trend ${data.trend}">${data.trend === 'up' ? '↑' : '↓'} ${Math.abs(data.trendValue)}%</td>
        <td><span class="table-status ${data.status}">${statusText[data.status]}</span></td>
        <td>${data.lastUpdate}</td>
        <td class="table-actions">
            <button class="btn-small btn-config" data-indicator="${indicatorId}">配置</button>
            <button class="btn-small btn-detail" data-indicator="${indicatorId}">详情</button>
        </td>
    `;
    
    return row;
}

// 渲染趋势图表
function renderTrendCharts() {
    Object.entries(indicatorsData.trends).forEach(([key, data]) => {
        renderTrendChart(key, data);
    });
}

// 渲染单个趋势图表
function renderTrendChart(indicatorId, data) {
    const chartContainer = document.getElementById(indicatorId);
    if (!chartContainer) return;
    
    // 销毁已存在的图表实例
    if (chartsInstances[indicatorId]) {
        chartsInstances[indicatorId].dispose();
    }
    
    const chart = echarts.init(chartContainer);
    chartsInstances[indicatorId] = chart;
    
    // 图表标题映射
    const chartTitles = {
        'trend-workload': '工作量趋势',
        'trend-revenue': '收入结构趋势', 
        'trend-cost': '费用控制趋势',
        'trend-efficiency': '效益效率趋势',
        'trend-quality': '质量安全趋势',
        'trend-satisfaction': '患者满意度趋势'
    };
    
    const option = {
        title: {
            text: chartTitles[indicatorId] || '趋势分析',
            left: 'center',
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
            data: ['实际值', '目标值'],
            bottom: 0
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: data.map(item => item.date),
            axisLabel: {
                rotate: 45
            }
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '实际值',
                type: 'line',
                data: data.map(item => item.value.toFixed(1)),
                smooth: true,
                lineStyle: {
                    color: '#1890ff'
                },
                itemStyle: {
                    color: '#1890ff'
                }
            },
            {
                name: '目标值',
                type: 'line',
                data: data.map(item => item.target.toFixed(1)),
                smooth: true,
                lineStyle: {
                    color: '#52c41a',
                    type: 'dashed'
                },
                itemStyle: {
                    color: '#52c41a'
                }
            }
        ]
    };
    
    chart.setOption(option);
    
    // 响应式处理
    window.addEventListener('resize', () => {
        chart.resize();
    });
}

// 渲染对比图表


// 指标配置处理
function handleConfigIndicator(indicatorId) {
    const modal = document.getElementById('configModal');
    const indicatorName = indicatorsData.overview[indicatorId].name;
    
    document.getElementById('configIndicatorName').textContent = indicatorName;
    document.getElementById('warningThreshold').value = '75';
    document.getElementById('alertThreshold').value = '60';
    
    modal.style.display = 'block';
    
    // 保存配置
    document.getElementById('saveConfig').onclick = function() {
        const warningThreshold = document.getElementById('warningThreshold').value;
        const alertThreshold = document.getElementById('alertThreshold').value;
        
        if (!warningThreshold || !alertThreshold) {
            alert('请填写完整的阈值配置');
            return;
        }
        
        // 这里可以调用API保存配置
        console.log('保存指标配置:', {
            indicatorId,
            warningThreshold,
            alertThreshold
        });
        
        alert('配置保存成功');
        closeModal();
        loadIndicatorsData(); // 重新加载数据
    };
}

// 查看详情处理
function handleViewDetail(indicatorId) {
    const indicatorName = indicatorsData.overview[indicatorId].name;
    const details = indicatorsData.details[indicatorId];
    
    // 这里可以打开详情页面或弹窗
    console.log('查看指标详情:', indicatorName, details);
    alert(`查看 ${indicatorName} 详细信息`);
}

// 关闭弹窗
function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

// 显示加载状态
function showLoading() {
    // 可以添加加载动画
    console.log('Loading...');
}

// 隐藏加载状态
function hideLoading() {
    console.log('Loading complete');
}

// 生成导出数据
function generateExportData() {
    const data = [];
    
    // 添加概览数据
    data.push(['指标概览']);
    data.push(['指标名称', '当前值', '状态', '趋势']);
    
    Object.entries(indicatorsData.overview).forEach(([key, item]) => {
        const statusText = {
            normal: '正常',
            warning: '预警',
            alert: '告警'
        };
        
        data.push([
            item.name,
            `${item.value} ${item.unit}`,
            statusText[item.status],
            `${item.trend === 'up' ? '↑' : '↓'} ${Math.abs(item.trendValue)}%`
        ]);
    });
    
    // 添加详细数据
    data.push([]);
    data.push(['详细数据']);
    data.push(['指标名称', '科室', '当前值', '目标值', '完成率', '趋势', '状态', '更新时间']);
    
    Object.entries(indicatorsData.details).forEach(([key, details]) => {
        details.forEach(item => {
            const statusText = {
                normal: '正常',
                warning: '预警',
                alert: '告警'
            };
            
            data.push([
                indicatorsData.overview[key].name,
                item.department,
                item.value,
                item.target,
                `${item.completion}%`,
                `${item.trend === 'up' ? '↑' : '↓'} ${Math.abs(item.trendValue)}%`,
                statusText[item.status],
                item.lastUpdate
            ]);
        });
    });
    
    return data;
}

// 导出Excel
function exportToExcel(data, filename) {
    // 这里可以使用第三方库如 SheetJS 来生成Excel文件
    // 简化实现：生成CSV格式
    const csvContent = data.map(row => row.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename.replace('.xlsx', '.csv'));
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// 工具函数
function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function formatDateTime(date) {
    return date.toLocaleString('zh-CN');
}

function formatPeriodDate(date, period) {
    if (period === 'day') {
        return `${date.getMonth() + 1}/${date.getDate()}`;
    } else if (period === 'month') {
        return `${date.getFullYear()}/${date.getMonth() + 1}`;
    } else {
        return date.getFullYear().toString();
    }
}

// 图表选择器变化处理
function handleChartSelectorChange(chartId, value) {
    // 根据选择的指标重新渲染图表
    if (indicatorsData.trends[value]) {
        renderTrendChart(value, indicatorsData.trends[value]);
    }
}