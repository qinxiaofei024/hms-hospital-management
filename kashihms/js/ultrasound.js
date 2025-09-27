// 超声医学运营分析页面JavaScript
var UltrasoundPage = {
    // 初始化页面
    init: function() {
        this.initEventListeners();
        this.loadData();
        this.initCharts();
    },
    
    // 初始化事件监听器
    initEventListeners: function() {
        // 刷新按钮点击事件
        document.getElementById('refresh-btn').addEventListener('click', function() {
            UltrasoundPage.refreshData();
        });
        
        // 导出报表按钮点击事件
        document.getElementById('export-btn').addEventListener('click', function() {
            UltrasoundPage.exportReport();
        });
        
        // 时间范围选择事件
        document.getElementById('time-range').addEventListener('change', function() {
            UltrasoundPage.loadData();
        });
        
        // 科室选择事件
        document.getElementById('department').addEventListener('change', function() {
            UltrasoundPage.loadData();
        });
    },
    
    // 加载数据
    loadData: function() {
        var timeRange = document.getElementById('time-range').value;
        var department = document.getElementById('department').value;
        
        // 获取模拟数据
        var data = this.getMockData(timeRange, department);
        
        // 更新概览卡片数据
        this.updateOverviewCards(data.overview);
        
        // 更新设备状态卡片
        this.updateEquipmentStatus(data.equipment);
        
        // 更新详细数据表格
        this.updateDataTable(data.detailData);
        
        // 更新图表数据
        this.updateCharts(data.charts);
    },
    
    // 获取模拟数据
    getMockData: function(timeRange, department) {
        // 根据不同的时间范围和科室返回不同的模拟数据
        // 这里返回的是默认的模拟数据
        return {
            overview: {
                totalExaminations: 5862,
                totalRevenue: 128.5,
                avgEquipmentUsage: 78.5,
                positiveRate: 38.2,
                trends: {
                    totalExaminations: 4.3,
                    totalRevenue: 6.8,
                    avgEquipmentUsage: 2.1,
                    positiveRate: -0.5
                }
            },
            equipment: [
                { name: '高端彩超仪A', usage: 85.2, status: 'normal' },
                { name: '高端彩超仪B', usage: 81.6, status: 'normal' },
                { name: '中端彩超仪C', usage: 76.3, status: 'normal' },
                { name: '便携彩超仪D', usage: 68.9, status: 'warning' }
            ],
            charts: {
                examinationTrend: {
                    months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月'],
                    count: [4180, 4390, 4770, 5020, 5260, 5440, 5660, 5922]
                },
                examinationType: {
                    categories: ['腹部超声', '心脏超声', '血管超声', '妇产科超声', '肌肉骨骼超声'],
                    values: [1750, 1250, 960, 1350, 612]
                },
                revenueTrend: {
                    months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月'],
                    revenue: [89.6, 95.2, 103.5, 108.7, 114.3, 119.8, 124.7, 131.2]
                },
                equipmentUsage: {
                    names: ['高端彩超仪A', '高端彩超仪B', '中端彩超仪C', '便携彩超仪D'],
                    usage: [85.2, 81.6, 76.3, 68.9]
                }
            },
            detailData: [
                { month: '1月', abdominal: 1250, cardiac: 850, vascular: 680, obstetric: 980, musculoskeletal: 420, totalExaminations: 4180, totalRevenue: 89.6 },
                { month: '2月', abdominal: 1320, cardiac: 890, vascular: 710, obstetric: 1020, musculoskeletal: 450, totalExaminations: 4390, totalRevenue: 95.2 },
                { month: '3月', abdominal: 1450, cardiac: 960, vascular: 780, obstetric: 1100, musculoskeletal: 480, totalExaminations: 4770, totalRevenue: 103.5 },
                { month: '4月', abdominal: 1520, cardiac: 1020, vascular: 820, obstetric: 1150, musculoskeletal: 510, totalExaminations: 5020, totalRevenue: 108.7 },
                { month: '5月', abdominal: 1580, cardiac: 1080, vascular: 860, obstetric: 1200, musculoskeletal: 540, totalExaminations: 5260, totalRevenue: 114.3 },
                { month: '6月', abdominal: 1620, cardiac: 1120, vascular: 890, obstetric: 1250, musculoskeletal: 560, totalExaminations: 5440, totalRevenue: 119.8 },
                { month: '7月', abdominal: 1680, cardiac: 1180, vascular: 920, obstetric: 1300, musculoskeletal: 580, totalExaminations: 5660, totalRevenue: 124.7 },
                { month: '8月', abdominal: 1750, cardiac: 1250, vascular: 960, obstetric: 1350, musculoskeletal: 612, totalExaminations: 5922, totalRevenue: 131.2 }
            ]
        };
    },
    
    // 初始化图表
    initCharts: function() {
        // 检查量趋势图
        var examinationTrendEl = document.getElementById('examination-trend-chart');
        if (examinationTrendEl) {
            this.examinationTrendChart = echarts.init(examinationTrendEl);
        }
        
        // 检查类型分布图
        var examinationTypeEl = document.getElementById('examination-type-chart');
        if (examinationTypeEl) {
            this.examinationTypeChart = echarts.init(examinationTypeEl);
        }
        
        // 收入趋势分析图
        var revenueTrendEl = document.getElementById('revenue-trend-chart');
        if (revenueTrendEl) {
            this.revenueTrendChart = echarts.init(revenueTrendEl);
        }
        
        // 设备使用率对比图
        var equipmentUsageEl = document.getElementById('equipment-usage-chart');
        if (equipmentUsageEl) {
            this.equipmentUsageChart = echarts.init(equipmentUsageEl);
        }

        // 新增：检查项目统计图表实例
        var itemTypeEl = document.getElementById('exam-item-type-chart');
        if (itemTypeEl) {
            this.examItemTypeChart = echarts.init(itemTypeEl);
        }
        var regionCompareEl = document.getElementById('exam-region-compare-chart');
        if (regionCompareEl) {
            this.examRegionCompareChart = echarts.init(regionCompareEl);
        }
        var itemTrendEl = document.getElementById('exam-item-trend-chart');
        if (itemTrendEl) {
            this.examItemTrendChart = echarts.init(itemTrendEl);
        }
        
        // 设置默认图表配置
        this.updateCharts(this.getMockData('month', 'all').charts);
        
        // 新增：渲染检查项目统计默认数据
        this.updateExamItemCharts(this.getExamItemsMockData());
        this.updateExamItemTable(this.getExamItemsMockData());
        
        // 窗口大小改变时重新调整图表大小
        window.addEventListener('resize', function() {
            // 首次渲染后微任务触发一次 resize，避免初次计算尺寸为 0 导致空白
            setTimeout(function() {
                if (UltrasoundPage.examinationTrendChart) UltrasoundPage.examinationTrendChart.resize();
                if (UltrasoundPage.examinationTypeChart) UltrasoundPage.examinationTypeChart.resize();
                if (UltrasoundPage.revenueTrendChart) UltrasoundPage.revenueTrendChart.resize();
                if (UltrasoundPage.equipmentUsageChart) UltrasoundPage.equipmentUsageChart.resize();
                if (UltrasoundPage.examItemTypeChart) UltrasoundPage.examItemTypeChart.resize();
                if (UltrasoundPage.examRegionCompareChart) UltrasoundPage.examRegionCompareChart.resize();
                if (UltrasoundPage.examItemTrendChart) UltrasoundPage.examItemTrendChart.resize();
            }, 0);
        });

        // 新增：筛选器监听
        var timeSel = document.getElementById('item-time-range');
        var regionSel = document.getElementById('exam-region');
        var typeSel = document.getElementById('exam-type');
        var onFilterChange = function() {
            var data = UltrasoundPage.getExamItemsMockData(timeSel?.value, regionSel?.value, typeSel?.value);
            UltrasoundPage.updateExamItemCharts(data);
            UltrasoundPage.updateExamItemTable(data);
        };
        if (timeSel) timeSel.addEventListener('change', onFilterChange);
        if (regionSel) regionSel.addEventListener('change', onFilterChange);
        if (typeSel) typeSel.addEventListener('change', onFilterChange);
    },
    
    // 更新图表数据
    updateCharts: function(chartsData) {
        // 更新检查量趋势图
        var examinationTrendOption = {
            tooltip: {
                trigger: 'axis',
                formatter: '{b}: {c}人次'
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
                data: chartsData.examinationTrend.months
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value}人次'
                }
            },
            series: [{
                name: '检查量',
                type: 'line',
                data: chartsData.examinationTrend.count,
                smooth: true,
                lineStyle: {
                    color: '#0066cc',
                    width: 3
                },
                itemStyle: {
                    color: '#0066cc'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(0, 102, 204, 0.3)'
                    }, {
                        offset: 1,
                        color: 'rgba(0, 102, 204, 0.05)'
                    }])
                }
            }]
        };
        if (this.examinationTrendChart) {
            this.examinationTrendChart.setOption(examinationTrendOption);
        }
        
        // 更新检查类型分布图
        var examinationTypeOption = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c}人次 ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 10,
                data: chartsData.examinationType.categories
            },
            series: [{
                name: '检查类型',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: chartsData.examinationType.categories.map((category, index) => ({
                    value: chartsData.examinationType.values[index],
                    name: category
                })),
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                itemStyle: {
                    color: function(params) {
                        var colorList = ['#0066cc', '#52c41a', '#faad14', '#ff4d4f', '#722ed1'];
                        return colorList[params.dataIndex];
                    }
                },
                label: {
                    formatter: '{b}: {c}人次'
                }
            }]
        };
        if (this.examinationTypeChart) {
            this.examinationTypeChart.setOption(examinationTypeOption);
        }
        
        // 更新收入趋势分析图
        var revenueTrendOption = {
            tooltip: {
                trigger: 'axis',
                formatter: '{b}: {c}万元'
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
                data: chartsData.revenueTrend.months
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value}万元'
                }
            },
            series: [{
                name: '收入',
                type: 'line',
                data: chartsData.revenueTrend.revenue,
                smooth: true,
                lineStyle: {
                    color: '#52c41a',
                    width: 3
                },
                itemStyle: {
                    color: '#52c41a'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(82, 196, 26, 0.3)'
                    }, {
                        offset: 1,
                        color: 'rgba(82, 196, 26, 0.05)'
                    }])
                }
            }]
        };
        if (this.revenueTrendChart) {
            this.revenueTrendChart.setOption(revenueTrendOption);
        }
        
        // 更新设备使用率对比图
        var equipmentUsageOption = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: '{b}: {c}%'
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
                },
                max: 100
            },
            yAxis: {
                type: 'category',
                data: chartsData.equipmentUsage.names
            },
            series: [{
                name: '设备使用率',
                type: 'bar',
                data: chartsData.equipmentUsage.usage,
                itemStyle: {
                    color: function(params) {
                        if (params.data >= 80) {
                            return '#0066cc';
                        } else if (params.data >= 70) {
                            return '#52c41a';
                        } else {
                            return '#faad14';
                        }
                    }
                },
                label: {
                    show: true,
                    position: 'right',
                    formatter: '{c}%'
                }
            }]
        };
        if (this.equipmentUsageChart) {
            this.equipmentUsageChart.setOption(equipmentUsageOption);
        }
    },
    
    // 更新概览卡片
    updateOverviewCards: function(overviewData) {
        var cards = document.querySelectorAll('.overview-card');
        
        // 总检查人次卡片
        cards[0].querySelector('.card-value').textContent = overviewData.totalExaminations.toLocaleString();
        this.updateTrendValue(cards[0], overviewData.trends.totalExaminations);
        
        // 总收入卡片
        cards[1].querySelector('.card-value').textContent = overviewData.totalRevenue.toFixed(1);
        this.updateTrendValue(cards[1], overviewData.trends.totalRevenue);
        
        // 平均设备使用率卡片
        cards[2].querySelector('.card-value').textContent = overviewData.avgEquipmentUsage.toFixed(1);
        this.updateTrendValue(cards[2], overviewData.trends.avgEquipmentUsage);
        
        // 阳性检出率卡片
        cards[3].querySelector('.card-value').textContent = overviewData.positiveRate.toFixed(1);
        this.updateTrendValue(cards[3], overviewData.trends.positiveRate);
    },
    
    // 更新趋势值
    updateTrendValue: function(card, trendValue) {
        var trendEl = card.querySelector('.card-trend');
        var isPositive = trendValue > 0;
        var absValue = Math.abs(trendValue).toFixed(1);
        
        trendEl.className = 'card-trend ' + (isPositive ? 'trend-up' : 'trend-down');
        trendEl.innerHTML = '<i class="icon-arrow-' + (isPositive ? 'up' : 'down') + '"></i> 较上月' + 
                           (isPositive ? '增长' : '下降') + ' ' + absValue + '%';
    },
    
    // 更新设备状态卡片
    updateEquipmentStatus: function(equipmentData) {
        var equipmentCards = document.querySelectorAll('.equipment-card');
        
        equipmentData.forEach(function(equipment, index) {
            if (equipmentCards[index]) {
                equipmentCards[index].querySelector('.equipment-name').textContent = equipment.name;
                equipmentCards[index].querySelector('.equipment-usage').textContent = equipment.usage + '%';
                
                var statusEl = equipmentCards[index].querySelector('.equipment-status-text');
                statusEl.className = 'equipment-status-text status-' + equipment.status;
                
                if (equipment.status === 'normal') {
                    statusEl.textContent = '正常运行';
                } else if (equipment.status === 'warning') {
                    statusEl.textContent = '使用率偏低';
                } else {
                    statusEl.textContent = '需要维护';
                }
            }
        });
    },
    
    // 更新详细数据表格
    updateDataTable: function(detailData) {
        var tbody = document.querySelector('.data-table tbody');
        tbody.innerHTML = '';
        
        detailData.forEach(function(item) {
            var tr = document.createElement('tr');
            tr.innerHTML = '' +
                '<td>' + item.month + '</td>' +
                '<td>' + item.abdominal.toLocaleString() + '</td>' +
                '<td>' + item.cardiac.toLocaleString() + '</td>' +
                '<td>' + item.vascular.toLocaleString() + '</td>' +
                '<td>' + item.obstetric.toLocaleString() + '</td>' +
                '<td>' + item.musculoskeletal.toLocaleString() + '</td>' +
                '<td>' + item.totalExaminations.toLocaleString() + '</td>' +
                '<td>' + item.totalRevenue + '</td>';
            tbody.appendChild(tr);
        });
    },
    
    // 刷新数据
    refreshData: function() {
        // 显示加载动画
        var refreshBtn = document.getElementById('refresh-btn');
        var originalText = refreshBtn.textContent;
        refreshBtn.innerHTML = '<i class="icon-refresh"></i> 刷新中...';
        refreshBtn.disabled = true;
        
        // 模拟网络请求延迟
        setTimeout(function() {
            UltrasoundPage.loadData();
            
            // 恢复按钮状态
            refreshBtn.textContent = originalText;
            refreshBtn.disabled = false;
        }, 1000);
    },
    
    // 导出报表
    exportReport: function() {
        // 显示导出提示
        alert('报表导出成功！');
        
        // 实际项目中这里应该调用后端接口导出报表
        console.log('导出超声医学运营分析报表');
    }
};

// 刷新指定图表
function refreshChart(chartId) {
    console.log('刷新图表:', chartId);
    // 重新加载数据并更新图表
    var data = UltrasoundPage.getMockData('month', 'all');
    UltrasoundPage.updateCharts(data.charts);

    // 新增：支持新图表刷新
    if (chartId === 'exam-item-type-chart' || chartId === 'exam-region-compare-chart' || chartId === 'exam-item-trend-chart') {
        var timeSel = document.getElementById('item-time-range');
        var regionSel = document.getElementById('exam-region');
        var typeSel = document.getElementById('exam-type');
        var itemsData = UltrasoundPage.getExamItemsMockData(timeSel?.value, regionSel?.value, typeSel?.value);
        UltrasoundPage.updateExamItemCharts(itemsData);
        UltrasoundPage.updateExamItemTable(itemsData);
    }
}

// 显示趋势详情模态框
function showTrendModal(type) {
    // 创建模态框HTML
    var modalHtml = `
        <div class="trend-modal-overlay" id="trendModalOverlay">
            <div class="trend-modal">
                <div class="trend-modal-header">
                    <h3 id="trendModalTitle">趋势分析</h3>
                    <button class="trend-modal-close" onclick="closeTrendModal()">×</button>
                </div>
                <div class="trend-modal-body">
                    <div class="trend-chart-container">
                        <div id="trendChart" style="width: 100%; height: 300px;"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 添加到页面
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // 更新标题和图表
    updateTrendChart(type);
}

// 关闭趋势模态框
function closeTrendModal() {
    var modal = document.getElementById('trendModalOverlay');
    if (modal) {
        modal.remove();
    }
}

// 更新趋势图表
function updateTrendChart(type) {
    var title = getTrendTitle(type);
    var data = getTrendData(type);
    
    document.getElementById('trendModalTitle').textContent = title;
    
    var chart = echarts.init(document.getElementById('trendChart'));
    var option = {
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: data.months
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            name: title,
            type: 'line',
            data: data.values,
            smooth: true,
            lineStyle: {
                color: '#1890ff'
            },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: 'rgba(24, 144, 255, 0.3)'
                    }, {
                        offset: 1, color: 'rgba(24, 144, 255, 0.1)'
                    }]
                }
            }
        }]
    };
    
    chart.setOption(option);
}

// 获取趋势标题
function getTrendTitle(type) {
    var titles = {
        'examinations': '检查人次趋势',
        'revenue': '收入趋势',
        'equipment': '设备使用率趋势',
        'positive': '阳性检出率趋势'
    };
    return titles[type] || '趋势分析';
}

// 获取趋势数据
function getTrendData(type) {
    var months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月'];
    var data = {
        'examinations': {
            months: months,
            values: [4180, 4390, 4770, 5020, 5260, 5440, 5660, 5922]
        },
        'revenue': {
            months: months,
            values: [89.6, 95.2, 103.5, 108.7, 114.3, 119.8, 124.7, 131.2]
        },
        'equipment': {
            months: months,
            values: [75.2, 76.8, 77.5, 78.1, 78.5, 79.2, 79.8, 80.3]
        },
        'positive': {
            months: months,
            values: [36.8, 37.2, 37.8, 38.1, 38.5, 38.7, 38.2, 38.0]
        }
    };
    return data[type] || data.examinations;
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    if (typeof Common !== 'undefined' && typeof Common.ensureEcharts === 'function') {
        try {
            Common.ensureEcharts();
        } catch (e) {
            console.warn('ensureEcharts 调用失败:', e);
        }
    }

    if (typeof echarts !== 'undefined') {
        UltrasoundPage.init();
    } else {
        const onReady = function() {
            document.removeEventListener('echartsLoaded', onReady);
            UltrasoundPage.init();
        };
        document.addEventListener('echartsLoaded', onReady);
    }
});

// 检查项目统计 mock 数据
UltrasoundPage.getExamItemsMockData = function(timeRange = 'year', region = 'all', examType = 'all') {
    // 身体检查部位（用 region 参数承载部位编码以兼容现有调用）
    var siteMap = [
        { code: 'abdomen', label: '腹部', base: 2200 },
        { code: 'cardiac', label: '心脏', base: 2000 },
        { code: 'thyroid', label: '甲状腺', base: 1400 },
        { code: 'breast', label: '乳腺', base: 1300 },
        { code: 'vascular', label: '血管', base: 1200 },
        { code: 'urinary', label: '泌尿系', base: 1100 },
        { code: 'obstetric', label: '妇产科', base: 1500 },
        { code: 'msk', label: '肌肉骨骼', base: 900 },
        { code: 'superficial', label: '浅表器官', base: 800 },
        { code: 'pediatric', label: '儿科', base: 700 }
    ];
    var siteCodes = siteMap.map(function(s){ return s.code; });
    var siteLabels = siteMap.map(function(s){ return s.label; });

    var months = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
    var period = timeRange === 'month' ? months.slice(-1) :
                 timeRange === 'quarter' ? months.slice(-3) :
                 timeRange === 'half-year' ? months.slice(-6) : months; // year

    function rand(base, drift) {
        if (drift === void 0) { drift = 0.15; }
        var v = base * (1 + (Math.random()*2-1)*drift);
        return Math.round(Math.max(20, v));
    }

    // 项目类型分布
    var typeKeys = ['core','interventional','routine','contrast'];
    var typeDisplay = {core:'核心检查', interventional:'介入', routine:'常规', contrast:'造影'};
    var typeValues = typeKeys.map(function(k){
        var base = k==='core'? 1800 : k==='routine'? 1500 : k==='interventional'? 600 : 400;
        return rand(base);
    });
    if (examType !== 'all' && typeKeys.indexOf(examType) >= 0) {
        typeValues = typeKeys.map(function(k){ return k===examType ? rand(1800) : rand(300); });
    }

    // 检查部位对比
    var regionValues = siteMap.map(function(s){ return rand(s.base); });
    if (region !== 'all' && siteCodes.indexOf(region) >= 0) {
        regionValues = siteMap.map(function(s){ return s.code === region ? rand(s.base * 1.2) : rand(Math.max(200, s.base * 0.35)); });
    }

    // 趋势数据（考虑所选类型与部位）
    var trend = period.map(function(m, idx){
        var base = 350 + idx*20;
        if (examType === 'core') base += 120;
        if (examType === 'interventional') base -= 50;
        // 根据部位微调
        if (region === 'cardiac') base += 100;
        if (region === 'abdomen') base += 60;
        if (region === 'thyroid') base += 20;
        if (region === 'pediatric') base -= 30;
        if (region === 'msk') base -= 10;
        return rand(base, 0.25);
    });

    // 表格明细（取前8个项目），并标注检查部位
    var tableRows = [];
    var pool = examType==='all'
        ? typeKeys.flatMap(function(k){ return [
            // 将常见项目分配到不同类型，模拟真实数据
            {name:'心脏超声', type:'core'}, {name:'肝胆胰脾', type:'routine'}, {name:'甲状腺', type:'routine'}, {name:'血管彩超', type:'routine'},
            {name:'穿刺活检引导', type:'interventional'}, {name:'置管定位', type:'interventional'}, {name:'消融术辅助', type:'interventional'},
            {name:'肝脏造影', type:'contrast'}, {name:'肿瘤造影', type:'contrast'}
        ]; })
        : (function(){
            var tm = {
                core: ['心脏超声','血管彩超'],
                routine: ['腹部超声','泌尿系','浅表器官','生殖系','甲状腺','乳腺'],
                interventional: ['穿刺活检引导','置管定位','消融术辅助'],
                contrast: ['肝脏造影','肿瘤造影','肌肉造影']
            };
            return (tm[examType]||[]).map(function(n){ return {name:n, type:examType}; });
        })();
    if (pool.length < 8) {
        ['乳腺超声','小儿髋关节','下肢静脉','颈动脉','肝硬化评估','前列腺'].forEach(function(n){ pool.push({name:n, type:'routine'}); });
    }

    var labelOf = function(code){
        var idx = siteCodes.indexOf(code);
        return idx >= 0 ? siteLabels[idx] : '腹部';
    };

    pool.slice(0, 8).forEach(function(item){
        var site = region==='all' ? siteLabels[Math.floor(Math.random()*siteLabels.length)] : labelOf(region);
        var cnt = rand(380);
        tableRows.push({ name:item.name, type: typeDisplay[item.type]||'常规', region: site, count: cnt });
    });
    var totalCnt = tableRows.reduce(function(s,i){return s+i.count;},0);
    tableRows = tableRows.map(function(i){ return Object.assign({}, i, { ratio: (i.count/Math.max(1,totalCnt)*100).toFixed(1)+'%' }); });

    return {
        type: { labels: ['核心检查','介入','常规','造影'], values: typeValues },
        region: { labels: siteLabels, values: regionValues },
        trend: { period: period, values: trend },
        table: tableRows
    };
};

// 渲染检查项目图表
UltrasoundPage.updateExamItemCharts = function(data) {
    // 项目类型分布（环形饼图）
    if (this.examItemTypeChart) {
        var option1 = {
            tooltip: { trigger: 'item', formatter: '{b}: {c}人次 ({d}%)' },
            legend: { orient: 'vertical', left: 10, data: data.type.labels },
            series: [{
                name: '项目类型', type: 'pie', radius: ['40%','70%'], center: ['50%','55%'],
                data: data.type.labels.map(function(n, i){ return { name:n, value:data.type.values[i] }; }),
                itemStyle: { borderColor: '#fff', borderWidth: 2 },
                label: { formatter: '{b}: {c}人次' }
            }]
        };
        this.examItemTypeChart.setOption(option1);
    }

    // 检查部位对比（条形图）
    if (this.examRegionCompareChart) {
        var option2 = {
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: '{b}: {c}人次' },
            grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
            xAxis: { type: 'value' },
            yAxis: { type: 'category', data: data.region.labels },
            series: [{
                type: 'bar', name: '检查人次', data: data.region.values,
                itemStyle: { color: function(p){ return ['#0066cc','#52c41a','#faad14'][p.dataIndex%3]; } },
                label: { show: true, position: 'right' }
            }]
        };
        this.examRegionCompareChart.setOption(option2);
    }

    // 趋势（折线）
    if (this.examItemTrendChart) {
        var option3 = {
            tooltip: { trigger: 'axis', formatter: '{b}: {c}人次' },
            grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
            xAxis: { type: 'category', boundaryGap: false, data: data.trend.period },
            yAxis: { type: 'value', axisLabel: { formatter: '{value}人次' } },
            series: [{ type: 'line', name: '检查量', data: data.trend.values, smooth: true,
                    lineStyle: { color: '#722ed1', width: 3 }, itemStyle: { color: '#722ed1' },
                    areaStyle: { color: new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'rgba(114,46,209,0.25)'},{offset:1,color:'rgba(114,46,209,0.05)'}]) }
                }]
        };
        this.examItemTrendChart.setOption(option3);
    }
}

// 更新统计表
UltrasoundPage.updateExamItemTable = function(data) {
    var tbody = document.querySelector('#exam-item-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    data.table.forEach(function(row){
        var tr = document.createElement('tr');
        tr.innerHTML = '<td>'+row.name+'</td>'+
                       '<td>'+row.type+'</td>'+
                       '<td>'+row.region+'</td>'+
                       '<td>'+row.count.toLocaleString()+'</td>'+
                       '<td>'+row.ratio+'</td>';
        tbody.appendChild(tr);
    });
};