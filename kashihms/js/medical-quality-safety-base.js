/**
 * 医疗质量安全监测页面基础控制器
 * 提供统一的初始化、数据加载、图表创建等功能
 */
class MedicalQualitySafetyBase {
    constructor(options = {}) {
        this.options = {
            containerId: 'main-content',
            chartContainers: [],
            mockDataEnabled: true,
            autoRefresh: false,
            refreshInterval: 30000,
            ...options
        };
        
        this.charts = {};
        this.data = {};
        this.refreshTimer = null;
        
        this.init();
    }
    
    /**
     * 初始化页面
     */
    async init() {
        try {
            // 等待ECharts加载
            await this.ensureECharts();
            
            // 初始化组件
            this.initComponents();
            
            // 绑定事件
            this.bindEvents();
            
            // 加载数据
            await this.loadData();
            
            // 初始化图表
            this.initCharts();
            
            // 启动自动刷新
            if (this.options.autoRefresh) {
                this.startAutoRefresh();
            }
            
            console.log('医疗质量安全监测页面初始化完成');
        } catch (error) {
            console.error('页面初始化失败:', error);
            this.showError('页面初始化失败，请刷新重试');
        }
    }
    
    /**
     * 确保ECharts已加载
     */
    ensureECharts() {
        return new Promise((resolve, reject) => {
            if (window.echarts) {
                resolve();
                return;
            }
            
            // 使用Common.ensureEcharts如果可用
            if (window.Common && window.Common.ensureEcharts) {
                window.Common.ensureEcharts().then(resolve).catch(reject);
                return;
            }
            
            // 监听echartsLoaded事件
            const handleEChartsLoaded = () => {
                document.removeEventListener('echartsLoaded', handleEChartsLoaded);
                resolve();
            };
            
            document.addEventListener('echartsLoaded', handleEChartsLoaded);
            
            // 超时处理
            setTimeout(() => {
                if (!window.echarts) {
                    document.removeEventListener('echartsLoaded', handleEChartsLoaded);
                    reject(new Error('ECharts加载超时'));
                }
            }, 10000);
        });
    }
    
    /**
     * 初始化组件
     */
    initComponents() {
        // 初始化统计卡片
        this.initStatCards();
        
        // 初始化筛选控件
        this.initFilters();
        
        // 初始化表格
        this.initTables();
    }
    
    /**
     * 初始化统计卡片
     */
    initStatCards() {
        const statsGrid = document.getElementById('statsGrid');
        if (!statsGrid) return;
        
        const defaultStats = [
            { title: '总体质量评分', value: '95.2', unit: '分', trend: 'up', change: '+2.1' },
            { title: '安全事件数', value: '3', unit: '件', trend: 'down', change: '-2' },
            { title: '合规率', value: '98.5', unit: '%', trend: 'up', change: '+1.2' },
            { title: '满意度', value: '96.8', unit: '%', trend: 'up', change: '+0.8' }
        ];
        
        const stats = this.options.customStats || defaultStats;
        
        statsGrid.innerHTML = stats.map(stat => `
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">${stat.title}</span>
                    <span class="stat-trend ${stat.trend}">
                        ${stat.trend === 'up' ? '↗' : '↘'} ${stat.change}
                    </span>
                </div>
                <div class="stat-value">
                    <span class="stat-number">${stat.value}</span>
                    <span class="stat-unit">${stat.unit}</span>
                </div>
            </div>
        `).join('');
    }
    
    /**
     * 初始化筛选控件
     */
    initFilters() {
        // 时间范围选择器
        const timeRangeSelect = document.getElementById('timeRange');
        if (timeRangeSelect) {
            timeRangeSelect.addEventListener('change', () => {
                this.handleTimeRangeChange();
            });
        }
        
        // 科室选择器
        const departmentSelect = document.getElementById('departmentSelect');
        if (departmentSelect) {
            departmentSelect.addEventListener('change', () => {
                this.handleDepartmentChange();
            });
        }
        
        // 刷新按钮
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshData();
            });
        }
    }
    
    /**
     * 初始化表格
     */
    initTables() {
        // 搜索功能
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }
    }
    
    /**
     * 绑定事件
     */
    bindEvents() {
        // 图表控制按钮
        document.querySelectorAll('.chart-control-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleChartTypeChange(e.target.dataset.type);
            });
        });
        
        // 窗口大小变化
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    /**
     * 加载数据
     */
    async loadData() {
        try {
            if (this.options.mockDataEnabled) {
                this.data = this.generateMockData();
            } else {
                // 实际数据加载逻辑
                this.data = await this.fetchRealData();
            }
        } catch (error) {
            console.error('数据加载失败:', error);
            this.data = this.generateMockData(); // 降级到模拟数据
        }
    }
    
    /**
     * 生成模拟数据
     */
    generateMockData() {
        return {
            trend: this.generateTrendData(),
            comparison: this.generateComparisonData(),
            distribution: this.generateDistributionData(),
            realtime: this.generateRealtimeData()
        };
    }
    
    /**
     * 生成趋势数据
     */
    generateTrendData() {
        const months = ['1月', '2月', '3月', '4月', '5月', '6月'];
        return {
            categories: months,
            series: [
                {
                    name: '质量评分',
                    data: months.map(() => 90 + Math.random() * 10)
                },
                {
                    name: '安全指标',
                    data: months.map(() => 85 + Math.random() * 10)
                }
            ]
        };
    }
    
    /**
     * 生成对比数据
     */
    generateComparisonData() {
        const departments = ['内科', '外科', '妇产科', '儿科', '急诊科'];
        return departments.map(dept => ({
            name: dept,
            value: 85 + Math.random() * 15
        }));
    }
    
    /**
     * 生成分布数据
     */
    generateDistributionData() {
        return [
            { name: '优秀', value: 65 },
            { name: '良好', value: 25 },
            { name: '一般', value: 8 },
            { name: '需改进', value: 2 }
        ];
    }
    
    /**
     * 生成实时数据
     */
    generateRealtimeData() {
        return {
            activeMonitoring: Math.floor(Math.random() * 50) + 20,
            alertCount: Math.floor(Math.random() * 5),
            complianceRate: (95 + Math.random() * 5).toFixed(1)
        };
    }
    
    /**
     * 初始化图表
     */
    initCharts() {
        this.options.chartContainers.forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container && container.offsetWidth > 0 && container.offsetHeight > 0) {
                this.createChart(containerId);
            }
        });
    }
    
    /**
     * 创建图表
     */
    createChart(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const chart = echarts.init(container);
        this.charts[containerId] = chart;
        
        // 根据容器ID确定图表类型
        let option;
        if (containerId.includes('trend')) {
            option = this.getTrendChartOption();
        } else if (containerId.includes('comparison')) {
            option = this.getComparisonChartOption();
        } else if (containerId.includes('distribution')) {
            option = this.getDistributionChartOption();
        } else {
            option = this.getDefaultChartOption();
        }
        
        chart.setOption(option);
    }
    
    /**
     * 获取趋势图配置
     */
    getTrendChartOption() {
        return {
            title: {
                text: '质量安全趋势分析',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                top: 30
            },
            xAxis: {
                type: 'category',
                data: this.data.trend.categories
            },
            yAxis: {
                type: 'value'
            },
            series: this.data.trend.series.map(s => ({
                ...s,
                type: 'line',
                smooth: true
            }))
        };
    }
    
    /**
     * 获取对比图配置
     */
    getComparisonChartOption() {
        return {
            title: {
                text: '科室质量对比',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            xAxis: {
                type: 'category',
                data: this.data.comparison.map(item => item.name)
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                type: 'bar',
                data: this.data.comparison.map(item => item.value),
                itemStyle: {
                    color: '#5470c6'
                }
            }]
        };
    }
    
    /**
     * 获取分布图配置
     */
    getDistributionChartOption() {
        return {
            title: {
                text: '质量等级分布',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            series: [{
                type: 'pie',
                radius: '60%',
                data: this.data.distribution,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };
    }
    
    /**
     * 获取默认图表配置
     */
    getDefaultChartOption() {
        return {
            title: {
                text: '数据展示',
                left: 'center'
            },
            tooltip: {},
            series: [{
                type: 'bar',
                data: [10, 20, 30, 40, 50]
            }]
        };
    }
    
    /**
     * 事件处理方法
     */
    handleTimeRangeChange() {
        this.refreshData();
    }
    
    handleDepartmentChange() {
        this.refreshData();
    }
    
    handleChartTypeChange(type) {
        // 更新图表类型
        document.querySelectorAll('.chart-control-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-type="${type}"]`).classList.add('active');
        
        // 重新渲染图表
        this.updateCharts();
    }
    
    handleSearch(keyword) {
        // 实现搜索逻辑
        console.log('搜索关键词:', keyword);
    }
    
    handleResize() {
        // 重新调整图表大小
        Object.values(this.charts).forEach(chart => {
            chart.resize();
        });
    }
    
    /**
     * 刷新数据
     */
    async refreshData() {
        try {
            await this.loadData();
            this.updateCharts();
            this.updateStats();
        } catch (error) {
            console.error('数据刷新失败:', error);
        }
    }
    
    /**
     * 更新图表
     */
    updateCharts() {
        Object.keys(this.charts).forEach(containerId => {
            const chart = this.charts[containerId];
            let option;
            
            if (containerId.includes('trend')) {
                option = this.getTrendChartOption();
            } else if (containerId.includes('comparison')) {
                option = this.getComparisonChartOption();
            } else if (containerId.includes('distribution')) {
                option = this.getDistributionChartOption();
            }
            
            if (option) {
                chart.setOption(option, true);
            }
        });
    }
    
    /**
     * 更新统计数据
     */
    updateStats() {
        this.initStatCards();
    }
    
    /**
     * 启动自动刷新
     */
    startAutoRefresh() {
        this.refreshTimer = setInterval(() => {
            this.refreshData();
        }, this.options.refreshInterval);
    }
    
    /**
     * 停止自动刷新
     */
    stopAutoRefresh() {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
            this.refreshTimer = null;
        }
    }
    
    /**
     * 显示错误信息
     */
    showError(message) {
        console.error(message);
        // 可以在这里添加用户友好的错误提示
    }
    
    /**
     * 销毁实例
     */
    destroy() {
        this.stopAutoRefresh();
        
        Object.values(this.charts).forEach(chart => {
            chart.dispose();
        });
        
        this.charts = {};
        this.data = {};
    }
}

// 导出基础类
window.MedicalQualitySafetyBase = MedicalQualitySafetyBase;