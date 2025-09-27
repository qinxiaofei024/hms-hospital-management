var AnesthesiaICUPage = {
    init: function() {
        console.log('Initializing AnesthesiaICUPage...');
        this.loadData();
        this.initCharts();
        this.updateOverviewCards();
        this.updateCharts();
        // 绑定交互事件，确保“刷新”“导出”等按钮可用
        this.initEventListeners().then(function(boundCount){
            console.log('Event listeners bound count:', boundCount);
            console.log('AnesthesiaICUPage initialized successfully');
        });
    },
    
    initEventListeners: function() {
        console.log('Initializing event listeners with HMS standard approach...');
        
        // 使用Promise确保DOM完全加载
        return new Promise((resolve) => {
            const bindEvents = () => {
                try {
                    // 增强的元素检查 - 按照HMS指南标准
                    const elements = [
                        { id: 'refresh-btn', handler: () => this.refreshData() },
                        { id: 'export-btn', handler: () => this.exportReport() },
                        { id: 'nav-toggle', handler: () => this.toggleNavigation() }
                    ];
                    
                    let boundCount = 0;
                    elements.forEach(({ id, handler }) => {
                        const element = document.getElementById(id);
                        if (element && typeof element.addEventListener === 'function') {
                            element.addEventListener('click', handler);
                            boundCount++;
                            console.log(`Event bound to ${id}`);
                        } else {
                            console.warn(`Element ${id} not found or not ready`);
                        }
                    });
                    
                    console.log(`Event listeners initialized: ${boundCount}/${elements.length} elements bound`);
                    resolve(boundCount);
                } catch (error) {
                    console.error('Error in event listeners initialization:', error);
                    resolve(0);
                }
            };
            
            // 多重检查确保DOM就绪
            if (document.readyState === 'complete') {
                setTimeout(bindEvents, 100);
            } else {
                setTimeout(bindEvents, 500);
            }
        });
    },
    
    toggleNavigation: function() {
        // 导航栏折叠功能
        const nav = document.querySelector('.navigation');
        if (nav) {
            nav.classList.toggle('collapsed');
        }
    },
    
    loadData: function() {
        setTimeout(() => {
            this.data = this.getMockData();
            this.updateOverviewCards();
            this.updateCharts();
            this.updateKPICards();
            this.updateDataTable();
        }, 500);
    },
    
    refreshData: function() {
        this.loadData();
    },
    
    exportReport: function() {
        // 导出报告功能
        console.log('导出麻醉ICU报告');
        // 这里可以添加实际的导出逻辑
    },
    
    initCharts: function() {
        this.charts = this.charts || {};
        const chartContainers = {
            anesthesiaTrend: 'anesthesia-trend',
            icuTrend: 'icu-trend',
            revenueComposition: 'revenue-composition',
            surgeryType: 'surgery-type',
            revenueSource: 'revenue-source',
            orgTime: 'org-time-analysis',
            medtechRanking: 'medtech-ranking',
            outpatientEval: 'outpatient-eval',
            painlessAppointment: 'painless-appointment',
            incomeCost: 'income-cost-structure',
            firstCaseDelay: 'first-case-delay',
            physicianWorkload: 'physician-workload',
            drugUsageType: 'drug-usage-type',
            operationWorkloadType: 'operation-workload-type',
            workHours: 'work-hours-chart',
            overtimeAnalysis: 'overtime-analysis-chart'
        };
        Object.keys(chartContainers).forEach(key => {
            const el = document.getElementById(chartContainers[key]);
            if (el) {
                this.charts[key] = echarts.init(el);
            } else {
                console.warn(`图表容器 ${chartContainers[key]} 未找到`);
            }
        });
        window.addEventListener('resize', () => {
            Object.values(this.charts).forEach(chart => { if (chart) chart.resize(); });
        });
    },
    
    getMockData: function() {
        return {
            overview: {
                totalAnesthesia: 1256,
                icuAdmissions: 328,
                totalRevenue: 295.0,
                avgStayDays: 4.2
            },
            trends: {
                anesthesia: [980, 1050, 1150, 1180, 1220, 1256],
                icu: [280, 295, 302, 310, 318, 328],
                revenue: [220.5, 238.2, 248.2, 252.5, 258.6, 263.8]
            },
            revenueComposition: [
                { name: 'Anesthesia Fee', value: 120.5 },
                { name: 'ICU Fee', value: 85.2 },
                { name: 'Medicine Fee', value: 45.8 },
                { name: 'Equipment Fee', value: 28.3 },
                { name: 'Other', value: 15.2 }
            ],
            surgeryTypes: [
                { name: 'General Surgery', value: 285 },
                { name: 'Orthopedics', value: 220 },
                { name: 'Cardiovascular', value: 180 },
                { name: 'Neurosurgery', value: 165 },
                { name: 'Emergency', value: 145 },
                { name: 'Other', value: 261 }
            ],
            workHours: {
                categories: ['8小时以下', '8-10小时', '10-12小时', '12-14小时', '14小时以上'],
                data: [15, 45, 35, 20, 10]
            },
            overtimeAnalysis: [
                { name: '正常工作', value: 65, color: '#4ECDC4' },
                { name: '合理加班', value: 25, color: '#FFEAA7' },
                { name: '过度加班', value: 10, color: '#FF6B6B' }
            ],
            // 新增模块模拟数据
            revenueSource: [
                { name: '手术麻醉费用', value: 130.2 },
                { name: 'ICU护理费', value: 90.5 },
                { name: '药品收入', value: 50.8 },
                { name: '耗材收入', value: 30.6 },
                { name: '其他', value: 18.1 }
            ],
            orgTime: {
                months: ['1月','2月','3月','4月','5月','6月'],
                orgs: ['本部','托管/分院'],
                series: {
                    main: [520, 540, 580, 600, 620, 640],
                    branch: [180, 190, 210, 220, 230, 240]
                }
            },
            medtechRanking: {
                depts: ['麻醉科','手术室','ICU','检验科','放射科','超声科','病理科','药学部'],
                values: [295, 280, 260, 185, 170, 155, 132, 110]
            },
            outpatientEval: {
                weeks: ['W1','W2','W3','W4','W5','W6'],
                counts: [120, 138, 150, 145, 160, 172]
            },
            painlessAppointment: {
                days: ['Mon','Tue','Wed','Thu','Fri','Sat'],
                duration: [35, 32, 30, 28, 27, 25] // minutes
            },
            incomeCost: {
                months: ['1月','2月','3月','4月','5月','6月'],
                income: [120, 128, 142, 150, 158, 165],
                cost: [72, 75, 80, 82, 85, 88]
            },
            firstCaseDelay: {
                buckets: ['准时','5-10分钟','10-20分钟','20-30分钟','30分钟以上'],
                counts: [56, 22, 18, 10, 6]
            },
            physicianWorkload: {
                doctors: ['张三','李四','王五','赵六','钱七','周八','吴九','郑十'],
                cases: [220, 210, 198, 185, 172, 166, 150, 142]
            },
            drugUsageType: {
                types: ['全麻','椎管内','神经阻滞','镇静'],
                persons: [680, 420, 260, 180]
            },
            operationWorkloadType: {
                types: ['全麻','椎管内','神经阻滞','镇静'],
                operations: [720, 460, 280, 210]
            },
            tableData: [
                { month: '1月', anesthesia: 980, icu: 280, anesthesiaRevenue: 120.5, icuRevenue: 85.2, totalRevenue: 205.7, growth: '--' },
                { month: '2月', anesthesia: 1050, icu: 295, anesthesiaRevenue: 128.2, icuRevenue: 90.0, totalRevenue: 218.2, growth: '+6.1%' },
                { month: '3月', anesthesia: 1150, icu: 302, anesthesiaRevenue: 138.0, icuRevenue: 94.2, totalRevenue: 232.2, growth: '+6.4%' },
                { month: '4月', anesthesia: 1180, icu: 310, anesthesiaRevenue: 142.5, icuRevenue: 96.0, totalRevenue: 238.5, growth: '+2.7%' },
                { month: '5月', anesthesia: 1220, icu: 318, anesthesiaRevenue: 148.6, icuRevenue: 98.4, totalRevenue: 247.0, growth: '+3.6%' },
                { month: '6月', anesthesia: 1256, icu: 328, anesthesiaRevenue: 155.0, icuRevenue: 101.0, totalRevenue: 256.0, growth: '+3.6%' }
            ]
        };
    },
    
    updateCharts: function() {
        if (!this.data) return;
        
        const anesthesiaTrendOption = {
            title: { text: 'Anesthesia Cases Trend', left: 'center' },
            tooltip: { trigger: 'axis' },
            grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
            xAxis: {
                type: 'category',
                data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
            },
            yAxis: { type: 'value' },
            series: [{
                name: 'Anesthesia Cases',
                type: 'line',
                data: this.data.trends.anesthesia,
                smooth: true,
                lineStyle: { color: '#1890ff' },
                areaStyle: { color: 'rgba(24, 144, 255, 0.1)' }
            }]
        };
        if (this.charts.anesthesiaTrend) this.charts.anesthesiaTrend.setOption(anesthesiaTrendOption);
        
        const icuTrendOption = {
            title: { text: 'ICU Admissions Trend', left: 'center' },
            tooltip: { trigger: 'axis' },
            grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
            xAxis: { type: 'category', data: ['Jan','Feb','Mar','Apr','May','Jun'] },
            yAxis: { type: 'value' },
            series: [{
                name: 'ICU Admissions',
                type: 'line',
                data: this.data.trends.icu,
                smooth: true,
                lineStyle: { color: '#52c41a' },
                areaStyle: { color: 'rgba(82,196,26,0.1)' }
            }]
        };
        if (this.charts.icuTrend) this.charts.icuTrend.setOption(icuTrendOption);
        
        const revenueCompositionOption = {
            title: { text: 'Revenue Composition', left: 'center' },
            tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
            series: [{
                name: 'Revenue',
                type: 'pie',
                radius: ['40%', '70%'],
                data: this.data.revenueComposition,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };
        if (this.charts.revenueComposition) this.charts.revenueComposition.setOption(revenueCompositionOption);
        
        const surgeryTypeOption = {
            title: { text: 'Surgery Type Distribution', left: 'center' },
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
            xAxis: { type: 'value' },
            yAxis: {
                type: 'category',
                data: this.data.surgeryTypes.map(item => item.name)
            },
            series: [{
                name: 'Cases',
                type: 'bar',
                data: this.data.surgeryTypes.map(item => item.value),
                itemStyle: { color: '#722ed1' }
            }]
        };
        if (this.charts.surgeryType) this.charts.surgeryType.setOption(surgeryTypeOption);

        // 麻醉医师工作时长分布
        const workHoursOption = {
            title: {
                text: '麻醉医师工作时长分布',
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
                },
                formatter: function(params) {
                    var p = params && params[0];
                    if (!p) return '';
                    var text = p.marker + p.name + '：' + p.value;
                    if (p.name && p.name.indexOf('14小时') !== -1) {
                        text += '<br/>' + '<span style="color:#ff4d4f;font-weight:600;">警示：连续工作超过14小时，需关注排班与休息</span>';
                    }
                    return text;
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
                data: ['8小时以内', '8-10小时', '10-12小时', '12-14小时', '14小时以上']
            },
            yAxis: {
                type: 'value',
                name: '人数'
            },
            series: [{
                name: '医师人数',
                type: 'bar',
                data: [
                    15,
                    28,
                    35,
                    18,
                    { value: 8, itemStyle: { color: '#ff4d4f' }, label: { show: true, position: 'top', color: '#ff4d4f', fontWeight: 'bold', formatter: '14h+ 警示' } }
                ],
                itemStyle: {
                    color: '#52c41a' // 改为纯色，去除渐变（默认柱）
                }
            }]
        };
        if (this.charts.workHours) this.charts.workHours.setOption(workHoursOption);

        // 加班合理性分布
        const overtimeAnalysisOption = {
            title: {
                text: '加班合理性分布',
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
                orient: 'vertical',
                left: 'left',
                data: ['合理加班', '紧急加班', '计划加班', '非必要加班']
            },
            series: [{
                name: '加班类型',
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
                labelLine: { show: false },
                data: [
                    {value: 45, name: '合理加班', itemStyle: {color: '#52c41a'}},
                    {value: 25, name: '紧急加班', itemStyle: {color: '#faad14'}},
                    {value: 20, name: '计划加班', itemStyle: {color: '#1890ff'}},
                    {value: 10, name: '非必要加班', itemStyle: {color: '#ff4d4f'}}
                ]
            }]
        };
        if (this.charts.overtimeAnalysis) this.charts.overtimeAnalysis.setOption(overtimeAnalysisOption);

        // 新增模块渲染逻辑
        // 收入来源 Revenue Source
        if (this.charts.revenueSource) {
            const option = {
                title: { text: '收入来源 Revenue Source', left: 'center' },
                tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
                legend: { bottom: 0 },
                series: [{
                    name: '收入来源',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    data: (this.data.revenueSource || []).map(i => ({ value: i.value, name: i.name })),
                    emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.3)' } }
                }]
            };
            this.charts.revenueSource.setOption(option);
        }

        // 组织/时间维度对比 Org/Time
        if (this.charts.orgTime) {
            const months = (this.data.orgTime && this.data.orgTime.months) || [];
            const main = (this.data.orgTime && this.data.orgTime.series && this.data.orgTime.series.main) || [];
            const branch = (this.data.orgTime && this.data.orgTime.series && this.data.orgTime.series.branch) || [];
            const option = {
                title: { text: '组织/时间维度对比 Org vs Time', left: 'center' },
                tooltip: { trigger: 'axis' },
                legend: { top: 24, data: ['本部','托管/分院'] },
                grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                xAxis: { type: 'category', data: months },
                yAxis: { type: 'value' },
                series: [
                    { name: '本部', type: 'bar', data: main, itemStyle: { color: '#1890ff' } },
                    { name: '托管/分院', type: 'bar', data: branch, itemStyle: { color: '#13c2c2' } }
                ]
            };
            this.charts.orgTime.setOption(option);
        }

        // 医技科室收入排名 Medtech Ranking
        if (this.charts.medtechRanking) {
            const depts = (this.data.medtechRanking && this.data.medtechRanking.depts) || [];
            const values = (this.data.medtechRanking && this.data.medtechRanking.values) || [];
            const option = {
                title: { text: '医技科室收入排名 Medtech Ranking', left: 'center' },
                tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
                grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                xAxis: { type: 'value' },
                yAxis: { type: 'category', data: depts },
                series: [{
                    name: '收入(万元)',
                    type: 'bar',
                    data: values,
                    itemStyle: { color: '#722ed1' }
                }]
            };
            this.charts.medtechRanking.setOption(option);
        }

        // 门诊麻醉评估人次 Outpatient Evaluation
        if (this.charts.outpatientEval) {
            const weeks = (this.data.outpatientEval && this.data.outpatientEval.weeks) || [];
            const counts = (this.data.outpatientEval && this.data.outpatientEval.counts) || [];
            const option = {
                title: { text: '门诊麻醉评估人次 Outpatient Evaluation', left: 'center' },
                tooltip: { trigger: 'axis' },
                grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                xAxis: { type: 'category', data: weeks },
                yAxis: { type: 'value' },
                series: [{ name: '人次', type: 'line', smooth: true, data: counts, itemStyle: { color: '#fa8c16' }, areaStyle: { color: 'rgba(250,140,22,0.12)' } }]
            };
            this.charts.outpatientEval.setOption(option);
        }

        // 无痛处方预约时长 Painless Appointment Duration
        if (this.charts.painlessAppointment) {
            const days = (this.data.painlessAppointment && this.data.painlessAppointment.days) || [];
            const duration = (this.data.painlessAppointment && this.data.painlessAppointment.duration) || [];
            const option = {
                title: { text: '无痛处方预约时长 Painless Appointment', left: 'center' },
                tooltip: { trigger: 'axis' },
                grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                xAxis: { type: 'category', data: days },
                yAxis: { type: 'value', name: '分钟' },
                series: [{ name: '时长(分钟)', type: 'bar', data: duration, itemStyle: { color: '#eb2f96' } }]
            };
            this.charts.painlessAppointment.setOption(option);
        }

        // 收入结构与费用控制 Income vs Cost
        if (this.charts.incomeCost) {
            const months = (this.data.incomeCost && this.data.incomeCost.months) || [];
            const income = (this.data.incomeCost && this.data.incomeCost.income) || [];
            const cost = (this.data.incomeCost && this.data.incomeCost.cost) || [];
            const option = {
                title: { text: '收入结构与费用控制 Income vs Cost', left: 'center' },
                tooltip: { trigger: 'axis' },
                legend: { top: 24, data: ['收入','成本'] },
                grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                xAxis: { type: 'category', data: months },
                yAxis: { type: 'value' },
                series: [
                    { name: '收入', type: 'bar', data: income, itemStyle: { color: '#52c41a' } },
                    { name: '成本', type: 'bar', data: cost, itemStyle: { color: '#ff4d4f' } }
                ]
            };
            this.charts.incomeCost.setOption(option);
        }

        // 首台晚开 First Case Delay
        if (this.charts.firstCaseDelay) {
            const buckets = (this.data.firstCaseDelay && this.data.firstCaseDelay.buckets) || [];
            const counts = (this.data.firstCaseDelay && this.data.firstCaseDelay.counts) || [];
            const option = {
                title: { text: '首台晚开监测 First Case Delay', left: 'center' },
                tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
                grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                xAxis: { type: 'category', data: buckets },
                yAxis: { type: 'value', name: '台次' },
                series: [{ name: '台次', type: 'bar', data: counts, itemStyle: { color: '#13c2c2' } }]
            };
            this.charts.firstCaseDelay.setOption(option);
        }

        // 医师工作量 Physician Workload（支持点击下钻）
        if (this.charts.physicianWorkload) {
            const doctors = (this.data.physicianWorkload && this.data.physicianWorkload.doctors) || [];
            const cases = (this.data.physicianWorkload && this.data.physicianWorkload.cases) || [];
            const option = {
                title: { text: '医师工作量 Physician Workload', left: 'center' },
                tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
                grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                xAxis: { type: 'value' },
                yAxis: { type: 'category', data: doctors },
                series: [{ name: '台次', type: 'bar', data: cases, itemStyle: { color: '#1890ff' } }]
            };
            this.charts.physicianWorkload.setOption(option);
            try { this.charts.physicianWorkload.off('click'); } catch (e) {}
            this.charts.physicianWorkload.on('click', (params) => {
                if (typeof filterChart === 'function') {
                    filterChart('physician-workload', params.name);
                }
                if (typeof showTrendModal === 'function') {
                    showTrendModal('医师工作量 Physician Workload - ' + params.name);
                }
            });
        }

        // 不同麻醉类型用药人次 Drug Usage by Type
        if (this.charts.drugUsageType) {
            const types = (this.data.drugUsageType && this.data.drugUsageType.types) || [];
            const persons = (this.data.drugUsageType && this.data.drugUsageType.persons) || [];
            const option = {
                title: { text: '按麻醉类型的用药人次 Drug Usage by Type', left: 'center' },
                tooltip: { trigger: 'axis' },
                grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                xAxis: { type: 'category', data: types },
                yAxis: { type: 'value', name: '人次' },
                series: [{ name: '人次', type: 'bar', data: persons, itemStyle: { color: '#fa541c' } }]
            };
            this.charts.drugUsageType.setOption(option);
        }

        // 不同麻醉类型操作工作量 Operation Workload by Type
        if (this.charts.operationWorkloadType) {
            const types = (this.data.operationWorkloadType && this.data.operationWorkloadType.types) || [];
            const operations = (this.data.operationWorkloadType && this.data.operationWorkloadType.operations) || [];
            const option = {
                title: { text: '按麻醉类型的操作工作量 Operation Workload', left: 'center' },
                tooltip: { trigger: 'axis' },
                grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                xAxis: { type: 'category', data: types },
                yAxis: { type: 'value', name: '台次' },
                series: [{ name: '台次', type: 'line', smooth: true, data: operations, itemStyle: { color: '#722ed1' }, areaStyle: { color: 'rgba(114,46,209,0.08)' } }]
            };
            this.charts.operationWorkloadType.setOption(option);
        }
    },
    
    updateOverviewCards: function() {
        if (!this.data || !this.data.overview) return;
        
        const totalAnesthesiaEl = document.getElementById('total-anesthesia-count');
        if (totalAnesthesiaEl) {
            totalAnesthesiaEl.textContent = this.data.overview.totalAnesthesia;
        }
        
        const icuAdmissionEl = document.getElementById('icu-admission-count');
        if (icuAdmissionEl) {
            icuAdmissionEl.textContent = this.data.overview.icuAdmissions;
        }
        
        const totalRevenueEl = document.getElementById('total-revenue');
        if (totalRevenueEl) {
            totalRevenueEl.textContent = this.data.overview.totalRevenue.toFixed(1);
        }
        
        const avgStayEl = document.getElementById('avg-stay');
        if (avgStayEl) {
            avgStayEl.textContent = this.data.overview.avgStayDays.toFixed(1);
        }
    },
    
    updateKPICards: function() {
        const kpiCards = document.querySelectorAll('.kpi-card');
        kpiCards.forEach(card => {
            const status = Math.random() > 0.3 ? 'normal' : 'warning';
            card.className = `kpi-card ${status}`;
        });
    },
    
    updateDataTable: function() {
        try {
            const tableBody = document.querySelector('.data-table tbody');
            if (!tableBody) {
                console.error('Table body not found');
                return;
            }

            // 清空现有数据
            tableBody.innerHTML = '';

            // 添加新数据
            this.data.tableData.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${row.month}</td>
                    <td>${row.anesthesia}</td>
                    <td>${row.icu}</td>
                    <td>${row.anesthesiaRevenue}</td>
                    <td>${row.icuRevenue}</td>
                    <td>${row.totalRevenue}</td>
                    <td>${row.growth}</td>
                `;
                tableBody.appendChild(tr);
            });

            console.log('Data table updated successfully');
        } catch (error) {
            console.error('Error updating data table:', error);
        }
    },
    
    exportReport: function() {
        alert('Export functionality would be implemented here');
    }
};

function showTrendModal(title) {
    alert(`Show trend modal for: ${title}`);
}

function refreshChart(chartId) {
    if (window.AnesthesiaICUPage) {
        window.AnesthesiaICUPage.refreshData();
    }
}

function filterChart(chartId, filter) {
    alert(`Filter chart ${chartId} with: ${filter}`);
}

// 确保DOM完全加载后再初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        window.AnesthesiaICUPage = AnesthesiaICUPage;
        AnesthesiaICUPage.init();
    });
} else {
    // DOM已经加载完成
    window.AnesthesiaICUPage = AnesthesiaICUPage;
    AnesthesiaICUPage.init();
}