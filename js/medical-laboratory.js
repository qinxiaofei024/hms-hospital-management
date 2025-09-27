// 医疗检验页面 - 简化版本
const MedicalLaboratoryPage = {
    charts: {},
    
    // 初始化页面
    init() {
        console.log('医疗检验页面初始化开始');
        this.initCharts();
        this.bindEvents();
        this.loadData();
    },
    
    // 初始化所有图表
    initCharts() {
        console.log('开始初始化图表');
        
        // 检验量趋势图
        this.initTestVolumeChart();
        
        // 检验类型分布图
        this.initTestTypeChart();
        
        // 设备运行效率图
        this.initEquipmentEfficiencyChart();
        
        // 科室申请量排名图
        this.initDepartmentRankingChart();
        
        // 质量监控图
        this.initQualityMonitorChart();
        
        // 周转时间分析图
        this.initTurnaroundTimeChart();
        
        // 异常结果分析图
        this.initAbnormalResultsChart();
        
        console.log('所有图表初始化完成');
    },
    
    // 检验量趋势图
    initTestVolumeChart() {
        const element = document.getElementById('test-volume-chart');
        if (!element) return;
        
        this.charts.testVolume = echarts.init(element);
        this.charts.testVolume.setOption({
            title: { text: '检验量趋势' },
            tooltip: { trigger: 'axis' },
            legend: { data: ['检验量', '阳性率'] },
            xAxis: {
                type: 'category',
                data: ['1月', '2月', '3月', '4月', '5月', '6月']
            },
            yAxis: [
                { type: 'value', name: '检验量' },
                { type: 'value', name: '阳性率(%)', max: 100 }
            ],
            series: [
                {
                    name: '检验量',
                    type: 'bar',
                    data: [1200, 1350, 1100, 1400, 1250, 1500],
                    itemStyle: { color: '#5470c6' }
                },
                {
                    name: '阳性率',
                    type: 'line',
                    yAxisIndex: 1,
                    data: [15, 18, 12, 20, 16, 22],
                    itemStyle: { color: '#91cc75' }
                }
            ]
        });
    },
    
    // 检验类型分布图
    initTestTypeChart() {
        const element = document.getElementById('test-type-chart');
        if (!element) return;
        
        this.charts.testType = echarts.init(element);
        this.charts.testType.setOption({
            title: { text: '检验类型分布' },
            tooltip: { trigger: 'item' },
            series: [{
                type: 'pie',
                radius: '60%',
                data: [
                    { value: 35, name: '血液检验' },
                    { value: 25, name: '尿液检验' },
                    { value: 20, name: '生化检验' },
                    { value: 15, name: '免疫检验' },
                    { value: 5, name: '其他' }
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        });
    },
    
    // 设备运行效率图
    initEquipmentEfficiencyChart() {
        const element = document.getElementById('equipment-efficiency-chart');
        if (!element) return;
        
        this.charts.equipmentEfficiency = echarts.init(element);
        this.charts.equipmentEfficiency.setOption({
            title: { text: '设备运行效率' },
            tooltip: { trigger: 'axis' },
            xAxis: {
                type: 'category',
                data: ['设备A', '设备B', '设备C', '设备D', '设备E']
            },
            yAxis: { type: 'value', max: 100 },
            series: [{
                type: 'bar',
                data: [95, 88, 92, 85, 90],
                itemStyle: {
                    color: function(params) {
                        const colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'];
                        return colors[params.dataIndex];
                    }
                }
            }]
        });
    },
    
    // 科室申请量排名图
    initDepartmentRankingChart() {
        const element = document.getElementById('department-ranking-chart');
        if (!element) return;
        
        this.charts.departmentRanking = echarts.init(element);
        this.charts.departmentRanking.setOption({
            title: { text: '科室申请量排名' },
            tooltip: { trigger: 'axis' },
            xAxis: { type: 'value' },
            yAxis: {
                type: 'category',
                data: ['内科', '外科', '儿科', '妇产科', '急诊科']
            },
            series: [{
                type: 'bar',
                data: [320, 280, 240, 200, 180],
                itemStyle: { color: '#5470c6' }
            }]
        });
    },
    
    // 质量监控图
    initQualityMonitorChart() {
        const element = document.getElementById('quality-monitor-chart');
        if (!element) return;
        
        this.charts.qualityMonitor = echarts.init(element);
        this.charts.qualityMonitor.setOption({
            title: { text: '质量监控指标' },
            tooltip: { trigger: 'axis' },
            legend: { data: ['准确率', '及时率', '完整率'] },
            xAxis: {
                type: 'category',
                data: ['1月', '2月', '3月', '4月', '5月', '6月']
            },
            yAxis: { type: 'value', max: 100 },
            series: [
                {
                    name: '准确率',
                    type: 'line',
                    data: [98, 97, 99, 98, 99, 98],
                    itemStyle: { color: '#5470c6' }
                },
                {
                    name: '及时率',
                    type: 'line',
                    data: [95, 96, 94, 97, 95, 96],
                    itemStyle: { color: '#91cc75' }
                },
                {
                    name: '完整率',
                    type: 'line',
                    data: [99, 98, 99, 99, 98, 99],
                    itemStyle: { color: '#fac858' }
                }
            ]
        });
    },
    
    // 周转时间分析图
    initTurnaroundTimeChart() {
        const element = document.getElementById('turnaround-time-chart');
        if (!element) return;
        
        this.charts.turnaroundTime = echarts.init(element);
        this.charts.turnaroundTime.setOption({
            title: { text: '周转时间分析' },
            tooltip: { trigger: 'axis' },
            xAxis: {
                type: 'category',
                data: ['血液检验', '尿液检验', '生化检验', '免疫检验', '微生物检验']
            },
            yAxis: { type: 'value', name: '时间(小时)' },
            series: [{
                type: 'bar',
                data: [2.5, 1.8, 4.2, 6.5, 8.3],
                itemStyle: { color: '#ee6666' }
            }]
        });
    },
    
    // 异常结果分析图
    initAbnormalResultsChart() {
        const element = document.getElementById('abnormal-results-chart');
        if (!element) return;
        
        this.charts.abnormalResults = echarts.init(element);
        this.charts.abnormalResults.setOption({
            title: { text: '异常结果分析' },
            tooltip: { trigger: 'item' },
            series: [{
                type: 'pie',
                radius: ['40%', '70%'],
                data: [
                    { value: 40, name: '轻度异常' },
                    { value: 30, name: '中度异常' },
                    { value: 20, name: '重度异常' },
                    { value: 10, name: '危急值' }
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        });
    },
    
    // 绑定事件
    bindEvents() {
        // 时间筛选
        const timeFilter = document.querySelector('.time-filter select');
        if (timeFilter) {
            timeFilter.addEventListener('change', (e) => {
                console.log('时间筛选变更:', e.target.value);
                // 这里可以添加重新加载数据的逻辑
            });
        }
        
        // 导出按钮
        const exportBtn = document.querySelector('.export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportData();
            });
        }
        
        // 刷新按钮
        const refreshBtn = document.querySelector('.refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                console.log('刷新数据');
                this.loadData();
            });
        }
        
        // 搜索功能
        const searchInput = document.querySelector('.search-input');
        const searchBtn = document.querySelector('.table-actions .btn-secondary');
        if (searchInput && searchBtn) {
            searchBtn.addEventListener('click', () => {
                const keyword = searchInput.value.trim();
                console.log('搜索关键词:', keyword);
                this.searchTable(keyword);
            });
            
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const keyword = searchInput.value.trim();
                    console.log('搜索关键词:', keyword);
                    this.searchTable(keyword);
                }
            });
            
            // 实时搜索
            searchInput.addEventListener('input', (e) => {
                const keyword = e.target.value.trim();
                this.searchTable(keyword);
            });
        }
        
        // 分页功能
        const paginationBtns = document.querySelectorAll('.pagination .btn');
        paginationBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const btnText = btn.textContent.trim();
                if (btnText === '上一页') {
                    this.previousPage();
                } else if (btnText === '下一页') {
                    this.nextPage();
                } else if (!isNaN(btnText)) {
                    this.goToPage(parseInt(btnText));
                }
            });
        });
    },
    
    // 加载数据
    loadData() {
        console.log('开始加载数据');
        // 这里可以添加实际的数据加载逻辑
        // 目前使用静态数据
        this.updateTableData();
    },
    
    // 更新表格数据
    updateTableData() {
        const tableBody = document.querySelector('#test-detail-table');
        if (!tableBody) {
            console.error('未找到表格容器 #test-detail-table');
            return;
        }
        
        // 真实的医学检验项目明细数据
        this.totalData = [
            {
                testName: '血常规',
                testCount: 1250,
                revenue: 15.6,
                avgReportTime: 2.5,
                abnormalRate: 18.2,
                reagentConsumption: '中等',
                action: '查看详情'
            },
            {
                testName: '尿常规',
                testCount: 980,
                revenue: 8.9,
                avgReportTime: 1.8,
                abnormalRate: 12.5,
                reagentConsumption: '低',
                action: '查看详情'
            },
            {
                testName: '肝功能',
                testCount: 850,
                revenue: 22.4,
                avgReportTime: 4.2,
                abnormalRate: 25.8,
                reagentConsumption: '高',
                action: '查看详情'
            },
            {
                testName: '肾功能',
                testCount: 720,
                revenue: 18.7,
                avgReportTime: 3.8,
                abnormalRate: 15.6,
                reagentConsumption: '中等',
                action: '查看详情'
            },
            {
                testName: '血糖',
                testCount: 1100,
                revenue: 12.3,
                avgReportTime: 1.5,
                abnormalRate: 28.9,
                reagentConsumption: '低',
                action: '查看详情'
            },
            {
                testName: '血脂',
                testCount: 650,
                revenue: 16.8,
                avgReportTime: 3.2,
                abnormalRate: 35.4,
                reagentConsumption: '中等',
                action: '查看详情'
            },
            {
                testName: '甲状腺功能',
                testCount: 420,
                revenue: 28.5,
                avgReportTime: 6.5,
                abnormalRate: 22.1,
                reagentConsumption: '高',
                action: '查看详情'
            },
            {
                testName: '心肌酶',
                testCount: 380,
                revenue: 19.2,
                avgReportTime: 4.8,
                abnormalRate: 8.7,
                reagentConsumption: '中等',
                action: '查看详情'
            },
            {
                testName: '肿瘤标志物',
                testCount: 290,
                revenue: 45.6,
                avgReportTime: 8.3,
                abnormalRate: 12.3,
                reagentConsumption: '高',
                action: '查看详情'
            },
            {
                testName: '凝血功能',
                testCount: 560,
                revenue: 14.7,
                avgReportTime: 2.8,
                abnormalRate: 16.8,
                reagentConsumption: '中等',
                action: '查看详情'
            },
            {
                testName: '电解质',
                testCount: 780,
                revenue: 9.8,
                avgReportTime: 2.2,
                abnormalRate: 20.5,
                reagentConsumption: '低',
                action: '查看详情'
            },
            {
                testName: '免疫球蛋白',
                testCount: 320,
                revenue: 32.1,
                avgReportTime: 7.2,
                abnormalRate: 14.6,
                reagentConsumption: '高',
                action: '查看详情'
            }
        ];
        
        // 初始化分页
        this.currentPage = 1;
        this.updatePaginatedTable();
        this.updatePaginationButtons();
        
        console.log('表格数据已更新，共', this.totalData.length, '条记录');
    },
    
    // 搜索表格数据
    searchTable(keyword) {
        const tableBody = document.querySelector('#test-detail-table');
        if (!tableBody) return;
        
        const rows = tableBody.querySelectorAll('tr');
        let visibleCount = 0;
        
        rows.forEach(row => {
            const testName = row.querySelector('td:first-child')?.textContent || '';
            if (keyword === '' || testName.toLowerCase().includes(keyword.toLowerCase())) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });
        
        console.log(`搜索结果: 显示 ${visibleCount} 条记录`);
    },
    
    // 分页相关属性
    currentPage: 1,
    pageSize: 5,
    totalData: [],
    
    // 上一页
    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updatePaginatedTable();
            this.updatePaginationButtons();
        }
    },
    
    // 下一页
    nextPage() {
        const totalPages = Math.ceil(this.totalData.length / this.pageSize);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.updatePaginatedTable();
            this.updatePaginationButtons();
        }
    },
    
    // 跳转到指定页
    goToPage(page) {
        const totalPages = Math.ceil(this.totalData.length / this.pageSize);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.updatePaginatedTable();
            this.updatePaginationButtons();
        }
    },
    
    // 更新分页表格
    updatePaginatedTable() {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        const pageData = this.totalData.slice(startIndex, endIndex);
        
        const tableBody = document.querySelector('#test-detail-table');
        if (!tableBody) return;
        
        const tableHTML = pageData.map(item => `
            <tr style="border-bottom: 1px solid #e8e8e8;">
                <td style="padding: 12px 16px; border-right: 1px solid #e8e8e8; color: #333;">${item.testName}</td>
                <td style="padding: 12px 16px; text-align: center; border-right: 1px solid #e8e8e8; color: #333;">${item.testCount}</td>
                <td style="padding: 12px 16px; text-align: center; border-right: 1px solid #e8e8e8; color: #333;">${item.revenue}</td>
                <td style="padding: 12px 16px; text-align: center; border-right: 1px solid #e8e8e8; color: #333;">${item.avgReportTime}</td>
                <td style="padding: 12px 16px; text-align: center; border-right: 1px solid #e8e8e8; color: ${item.abnormalRate > 25 ? '#ff4d4f' : '#333'};">${item.abnormalRate}%</td>
                <td style="padding: 12px 16px; text-align: center; border-right: 1px solid #e8e8e8; color: #333;">
                    <span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; 
                        background: ${item.reagentConsumption === '高' ? '#fff2e8' : item.reagentConsumption === '中等' ? '#f6ffed' : '#e6f7ff'};
                        color: ${item.reagentConsumption === '高' ? '#fa8c16' : item.reagentConsumption === '中等' ? '#52c41a' : '#1890ff'};">
                        ${item.reagentConsumption}
                    </span>
                </td>
                <td style="padding: 12px 16px; text-align: center; color: #333;">
                    <button style="padding: 4px 12px; border: 1px solid #1890ff; background: white; color: #1890ff; border-radius: 4px; cursor: pointer; font-size: 12px;" 
                            onclick="alert('查看${item.testName}详细信息')">查看详情</button>
                </td>
            </tr>
        `).join('');
        
        tableBody.innerHTML = tableHTML;
    },
    
    // 更新分页按钮状态
    updatePaginationButtons() {
        const totalPages = Math.ceil(this.totalData.length / this.pageSize);
        const prevBtn = document.querySelector('.pagination .btn:first-child');
        const nextBtn = document.querySelector('.pagination .btn:last-child');
        const pageButtons = document.querySelectorAll('.pagination .btn:not(:first-child):not(:last-child)');
        
        // 更新上一页按钮状态
        if (prevBtn) {
            prevBtn.style.opacity = this.currentPage === 1 ? '0.5' : '1';
            prevBtn.style.pointerEvents = this.currentPage === 1 ? 'none' : 'auto';
        }
        
        // 更新下一页按钮状态
        if (nextBtn) {
            nextBtn.style.opacity = this.currentPage === totalPages ? '0.5' : '1';
            nextBtn.style.pointerEvents = this.currentPage === totalPages ? 'none' : 'auto';
        }
        
        // 更新页码按钮状态
        pageButtons.forEach((btn, index) => {
            const pageNum = index + 1;
            if (pageNum === this.currentPage) {
                btn.style.background = '#1890ff';
                btn.style.color = 'white';
            } else {
                btn.style.background = 'white';
                btn.style.color = '#1890ff';
            }
        });
    },
    
    // 导出数据
    exportData() {
        alert('导出功能开发中...');
    },
    
    // 窗口大小改变时重新调整图表
    resize() {
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.resize) {
                chart.resize();
            }
        });
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM加载完成，开始初始化医疗检验页面');
    
    // 确保ECharts已加载
    if (typeof echarts !== 'undefined') {
        console.log('ECharts已加载，直接初始化');
        MedicalLaboratoryPage.init();
    } else {
        console.log('ECharts未加载，等待加载...');
        // 等待ECharts加载
        const checkEcharts = setInterval(() => {
            if (typeof echarts !== 'undefined') {
                console.log('ECharts加载完成，开始初始化');
                clearInterval(checkEcharts);
                MedicalLaboratoryPage.init();
            }
        }, 100);
    }
});

// 窗口大小改变时重新调整图表
window.addEventListener('resize', function() {
    MedicalLaboratoryPage.resize();
});