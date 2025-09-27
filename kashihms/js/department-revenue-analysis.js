/**
 * 科室收入分析页面功能模块
 */
class DepartmentRevenueAnalysis {
    constructor() {
        this.charts = {};
        this.currentPeriod = 'month';
        this.currentAnalysisType = 'trend';
        this.init();
    }

    init() {
        this.initEventListeners();
        this.loadRevenueIndicators();
        this.initCharts();
        this.loadDoctorRevenueData();
    }

    initEventListeners() {
        // 时间维度切换
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentPeriod = e.target.dataset.period;
                this.updateRevenueTrendChart();
            });
        });

        // 分析类型切换
        document.getElementById('analysis-type').addEventListener('change', (e) => {
            this.currentAnalysisType = e.target.value;
            this.updateRevenueTrendChart();
        });

        // 排名筛选
        document.getElementById('ranking-period').addEventListener('change', () => {
            this.updateDepartmentRankingChart();
        });

        document.getElementById('ranking-type').addEventListener('change', () => {
            this.updateDepartmentRankingChart();
        });

        // 医生收入筛选
        document.getElementById('department-filter').addEventListener('change', () => {
            this.filterDoctorRevenueByDepartment();
        });

        document.getElementById('doctor-period').addEventListener('change', () => {
            this.loadDoctorRevenueData();
        });

        document.getElementById('doctor-search').addEventListener('input', (e) => {
            this.filterDoctorRevenue(e.target.value);
        });

        // 弹窗事件监听
        this.initModalEventListeners();
    }

    // 加载收入指标数据
    loadRevenueIndicators() {
        const indicators = {
            medical: { value: 2856.8, trend: 12.5, isPositive: true },
            outpatient: { value: 1234.5, trend: 8.3, isPositive: true },
            inpatient: { value: 1622.3, trend: -2.1, isPositive: false },
            service: { value: 987.6, trend: 15.7, isPositive: true }
        };

        // 更新指标卡片
        this.updateIndicatorCard('medical-revenue', 'medical-trend', indicators.medical);
        this.updateIndicatorCard('outpatient-revenue', 'outpatient-trend', indicators.outpatient);
        this.updateIndicatorCard('inpatient-revenue', 'inpatient-trend', indicators.inpatient);
        this.updateIndicatorCard('service-revenue', 'service-trend', indicators.service);

        // 更新收入波动监控
        this.updateRevenueMonitoring(indicators);
    }

    updateIndicatorCard(valueId, trendId, data) {
        const valueElement = document.getElementById(valueId);
        const trendElement = document.getElementById(trendId);
        
        if (valueElement && trendElement) {
            valueElement.textContent = `¥${data.value.toFixed(1)}万`;
            trendElement.textContent = `${data.isPositive ? '+' : ''}${data.trend}%`;
            trendElement.className = `trend ${data.isPositive ? 'positive' : 'negative'}`;
        }
    }

    updateRevenueMonitoring(indicators) {
        const alertElement = document.getElementById('revenue-alert');
        const avgTrend = Object.values(indicators).reduce((sum, item) => sum + Math.abs(item.trend), 0) / 4;
        
        if (avgTrend > 20) {
            alertElement.className = 'alert-item danger';
            alertElement.querySelector('.alert-icon').textContent = '⚠️';
            alertElement.querySelector('h5').textContent = '收入波动异常';
            alertElement.querySelector('p').textContent = '当前收入指标波动超出正常范围，需要关注';
        } else if (avgTrend > 10) {
            alertElement.className = 'alert-item warning';
            alertElement.querySelector('.alert-icon').textContent = '⚡';
            alertElement.querySelector('h5').textContent = '收入波动较大';
            alertElement.querySelector('p').textContent = '当前收入指标波动较大，建议密切关注';
        }
    }

    // 初始化图表
    initCharts() {
        this.initRevenueTrendChart();
        this.initDepartmentRankingChart();
        this.initInsuranceCompositionChart();
        this.initPatientSourceChart();
        this.initSourceTrendChart();
        this.initRevenueMonitoringChart();
    }

    // 收入趋势分析图表
    initRevenueTrendChart() {
        const chartDom = document.getElementById('revenue-trend-chart');
        this.charts.revenueTrend = echarts.init(chartDom);
        this.updateRevenueTrendChart();
    }

    updateRevenueTrendChart() {
        const data = this.getRevenueTrendData();
        const option = {
            title: {
                text: '收入趋势分析',
                left: 'center',
                textStyle: { fontSize: 16, fontWeight: 'normal' }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'cross' }
            },
            legend: {
                data: ['医疗收入', '门急诊收入', '住院收入', '医疗服务收入'],
                top: 30
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: data.categories,
                axisLine: { lineStyle: { color: '#e8e8e8' } },
                axisLabel: { color: '#666' }
            },
            yAxis: {
                type: 'value',
                name: '收入(万元)',
                axisLine: { lineStyle: { color: '#e8e8e8' } },
                axisLabel: { color: '#666' },
                splitLine: { lineStyle: { color: '#f0f0f0' } }
            },
            series: [
                {
                    name: '医疗收入',
                    type: 'line',
                    data: data.medical,
                    smooth: true,
                    lineStyle: { width: 3 },
                    itemStyle: { color: '#1890ff' }
                },
                {
                    name: '门急诊收入',
                    type: 'line',
                    data: data.outpatient,
                    smooth: true,
                    lineStyle: { width: 3 },
                    itemStyle: { color: '#52c41a' }
                },
                {
                    name: '住院收入',
                    type: 'line',
                    data: data.inpatient,
                    smooth: true,
                    lineStyle: { width: 3 },
                    itemStyle: { color: '#faad14' }
                },
                {
                    name: '医疗服务收入',
                    type: 'line',
                    data: data.service,
                    smooth: true,
                    lineStyle: { width: 3 },
                    itemStyle: { color: '#f5222d' }
                }
            ]
        };
        this.charts.revenueTrend.setOption(option);
    }

    getRevenueTrendData() {
        const periodData = {
            month: {
                categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                medical: [2200, 2350, 2180, 2420, 2680, 2856, 2920, 2780, 2650, 2890, 3020, 3150],
                outpatient: [980, 1050, 920, 1120, 1180, 1234, 1280, 1150, 1090, 1260, 1320, 1380],
                inpatient: [1220, 1300, 1260, 1300, 1500, 1622, 1640, 1630, 1560, 1630, 1700, 1770],
                service: [780, 820, 760, 850, 920, 987, 1020, 980, 940, 1010, 1080, 1150]
            },
            quarter: {
                categories: ['Q1', 'Q2', 'Q3', 'Q4'],
                medical: [6730, 7956, 8350, 9060],
                outpatient: [2950, 3534, 3520, 3960],
                inpatient: [3780, 4422, 4830, 5100],
                service: [2360, 2757, 2940, 3240]
            },
            year: {
                categories: ['2021年', '2022年', '2023年', '2024年'],
                medical: [28500, 31200, 32100, 32096],
                outpatient: [12800, 13900, 14200, 13964],
                inpatient: [15600, 17200, 18100, 18132],
                service: [9800, 10800, 11200, 11297]
            }
        };
        return periodData[this.currentPeriod];
    }

    // 科室收入对比排名图表
    initDepartmentRankingChart() {
        const chartDom = document.getElementById('department-ranking-chart');
        this.charts.departmentRanking = echarts.init(chartDom);
        this.updateDepartmentRankingChart();
    }

    updateDepartmentRankingChart() {
        const data = [
            { name: '心内科', value: 3200 },
            { name: '骨科', value: 2856 },
            { name: '神经内科', value: 2650 },
            { name: '消化内科', value: 2420 },
            { name: '呼吸内科', value: 2180 },
            { name: '内分泌科', value: 1980 },
            { name: '肾内科', value: 1850 },
            { name: '血液科', value: 1620 }
        ];

        const option = {
            title: {
                text: '科室收入排名',
                left: 'center',
                textStyle: { fontSize: 16, fontWeight: 'normal' }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                name: '收入(万元)',
                axisLine: { lineStyle: { color: '#e8e8e8' } },
                axisLabel: { color: '#666' },
                splitLine: { lineStyle: { color: '#f0f0f0' } }
            },
            yAxis: {
                type: 'category',
                data: data.map(item => item.name),
                axisLine: { lineStyle: { color: '#e8e8e8' } },
                axisLabel: { color: '#666' }
            },
            series: [{
                type: 'bar',
                data: data.map((item, index) => ({
                    value: item.value,
                    itemStyle: {
                        color: index === 1 ? '#1890ff' : '#91d5ff' // 突出显示当前科室
                    }
                })),
                barWidth: '60%',
                label: {
                    show: true,
                    position: 'right',
                    formatter: '{c}万',
                    color: '#666'
                }
            }]
        };
        this.charts.departmentRanking.setOption(option);
    }

    // 医保自费构成图表
    initInsuranceCompositionChart() {
        const chartDom = document.getElementById('insurance-composition-chart');
        this.charts.insuranceComposition = echarts.init(chartDom);
        
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c}万 ({d}%)'
            },
            series: [{
                name: '医保自费构成',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['50%', '50%'],
                data: [
                    { value: 1856, name: '医保收入', itemStyle: { color: '#1890ff' } },
                    { value: 1000, name: '自费收入', itemStyle: { color: '#52c41a' } }
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                label: {
                    formatter: '{b}\n{d}%'
                }
            }]
        };
        this.charts.insuranceComposition.setOption(option);
    }

    // 患者来源分布图表
    initPatientSourceChart() {
        const chartDom = document.getElementById('patient-source-chart');
        this.charts.patientSource = echarts.init(chartDom);
        
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c}万 ({d}%)'
            },
            series: [{
                name: '患者来源分布',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['50%', '50%'],
                data: [
                    { value: 2000, name: '本地患者', itemStyle: { color: '#1890ff' } },
                    { value: 856, name: '异地患者', itemStyle: { color: '#faad14' } }
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                label: {
                    formatter: '{b}\n{d}%'
                }
            }]
        };
        this.charts.patientSource.setOption(option);
    }

    // 收入来源变动趋势图表
    initSourceTrendChart() {
        const chartDom = document.getElementById('source-trend-chart');
        this.charts.sourceTrend = echarts.init(chartDom);
        
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'cross' }
            },
            legend: {
                data: ['医保收入', '自费收入', '本地患者', '异地患者']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                axisLine: { lineStyle: { color: '#e8e8e8' } },
                axisLabel: { color: '#666' }
            },
            yAxis: {
                type: 'value',
                name: '收入(万元)',
                axisLine: { lineStyle: { color: '#e8e8e8' } },
                axisLabel: { color: '#666' },
                splitLine: { lineStyle: { color: '#f0f0f0' } }
            },
            series: [
                {
                    name: '医保收入',
                    type: 'line',
                    data: [1200, 1280, 1150, 1320, 1450, 1520, 1580, 1480, 1420, 1560, 1650, 1720],
                    smooth: true,
                    itemStyle: { color: '#1890ff' }
                },
                {
                    name: '自费收入',
                    type: 'line',
                    data: [800, 850, 780, 880, 920, 980, 1020, 950, 900, 980, 1050, 1120],
                    smooth: true,
                    itemStyle: { color: '#52c41a' }
                },
                {
                    name: '本地患者',
                    type: 'line',
                    data: [1400, 1480, 1350, 1520, 1650, 1720, 1780, 1680, 1620, 1750, 1850, 1920],
                    smooth: true,
                    itemStyle: { color: '#faad14' }
                },
                {
                    name: '异地患者',
                    type: 'line',
                    data: [600, 650, 580, 680, 720, 780, 820, 750, 700, 790, 850, 920],
                    smooth: true,
                    itemStyle: { color: '#f5222d' }
                }
            ]
        };
        this.charts.sourceTrend.setOption(option);
    }

    // 收入波动监控图表
    initRevenueMonitoringChart() {
        const chartDom = document.getElementById('revenue-monitoring-chart');
        this.charts.revenueMonitoring = echarts.init(chartDom);
        
        const option = {
            title: {
                text: '收入波动监控',
                left: 'center',
                textStyle: { fontSize: 16, fontWeight: 'normal' }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'cross' }
            },
            legend: {
                data: ['实际收入', '预期范围上限', '预期范围下限'],
                top: 30
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                axisLine: { lineStyle: { color: '#e8e8e8' } },
                axisLabel: { color: '#666' }
            },
            yAxis: {
                type: 'value',
                name: '收入(万元)',
                axisLine: { lineStyle: { color: '#e8e8e8' } },
                axisLabel: { color: '#666' },
                splitLine: { lineStyle: { color: '#f0f0f0' } }
            },
            series: [
                {
                    name: '预期范围上限',
                    type: 'line',
                    data: [3000, 3100, 3050, 3150, 3200, 3250, 3300, 3200, 3150, 3250, 3350, 3400],
                    lineStyle: { color: '#ff7875', type: 'dashed' },
                    symbol: 'none'
                },
                {
                    name: '预期范围下限',
                    type: 'line',
                    data: [2500, 2600, 2550, 2650, 2700, 2750, 2800, 2700, 2650, 2750, 2850, 2900],
                    lineStyle: { color: '#ff7875', type: 'dashed' },
                    symbol: 'none',
                    areaStyle: {
                        color: 'rgba(255, 120, 117, 0.1)'
                    },
                    stack: 'confidence-band'
                },
                {
                    name: '实际收入',
                    type: 'line',
                    data: [2750, 2850, 2680, 2820, 2950, 2856, 3020, 2880, 2750, 2890, 3120, 3250],
                    smooth: true,
                    lineStyle: { width: 3, color: '#1890ff' },
                    itemStyle: { color: '#1890ff' }
                }
            ]
        };
        this.charts.revenueMonitoring.setOption(option);
    }

    // 加载医生收入数据
    loadDoctorRevenueData() {
        const doctorData = [
            { 
                name: '张主任', 
                title: '主任医师', 
                department: '内科',
                outpatient: 156.8, 
                inpatient: 234.5, 
                surgery: 89.2, 
                medicine: 78.5,
                materials: 45.3,
                medical: 123.7,
                examination: 67.8,
                total: 480.5, 
                growth: 12.3 
            },
            { 
                name: '李医生', 
                title: '副主任医师', 
                department: '外科',
                outpatient: 134.2, 
                inpatient: 198.7, 
                surgery: 67.3, 
                medicine: 65.4,
                materials: 38.9,
                medical: 98.6,
                examination: 54.2,
                total: 400.2, 
                growth: 8.7 
            },
            { 
                name: '王医生', 
                title: '主治医师', 
                department: '妇产科',
                outpatient: 98.5, 
                inpatient: 156.3, 
                surgery: 45.8, 
                medicine: 43.2,
                materials: 28.7,
                medical: 76.4,
                examination: 39.5,
                total: 300.6, 
                growth: -2.1 
            },
            { 
                name: '刘医生', 
                title: '主治医师', 
                department: '儿科',
                outpatient: 87.3, 
                inpatient: 134.6, 
                surgery: 38.9, 
                medicine: 38.7,
                materials: 22.4,
                medical: 65.8,
                examination: 34.6,
                total: 260.8, 
                growth: 15.6 
            },
            { 
                name: '陈医生', 
                title: '住院医师', 
                department: '骨科',
                outpatient: 65.4, 
                inpatient: 98.7, 
                surgery: 23.5, 
                medicine: 28.9,
                materials: 18.6,
                medical: 45.3,
                examination: 25.7,
                total: 187.6, 
                growth: 6.8 
            },
            { 
                name: '赵医生', 
                title: '住院医师', 
                department: '心内科',
                outpatient: 54.8, 
                inpatient: 87.2, 
                surgery: 19.8, 
                medicine: 24.5,
                materials: 15.3,
                medical: 38.9,
                examination: 21.4,
                total: 161.8, 
                growth: 9.2 
            }
        ];

        this.renderDoctorRevenueTable(doctorData);
        this.originalDoctorData = doctorData;
        this.currentDoctorData = doctorData;
    }

    renderDoctorRevenueTable(data) {
        const tbody = document.getElementById('doctor-revenue-tbody');
        tbody.innerHTML = data.map(doctor => `
            <tr>
                <td><span class="doctor-name" data-doctor="${doctor.name}">${doctor.name}</span></td>
                <td>${doctor.title}</td>
                <td>¥${doctor.outpatient.toFixed(1)}万</td>
                <td>¥${doctor.inpatient.toFixed(1)}万</td>
                <td>¥${doctor.surgery.toFixed(1)}万</td>
                <td>¥${doctor.medicine.toFixed(1)}万</td>
                <td>¥${doctor.materials.toFixed(1)}万</td>
                <td>¥${doctor.medical.toFixed(1)}万</td>
                <td>¥${doctor.examination.toFixed(1)}万</td>
                <td>¥${doctor.total.toFixed(1)}万</td>
                <td class="${doctor.growth >= 0 ? 'positive' : 'negative'}">
                    ${doctor.growth >= 0 ? '+' : ''}${doctor.growth}%
                </td>
            </tr>
        `).join('');

        // 为医生名字添加点击事件
        document.querySelectorAll('.doctor-name').forEach(nameElement => {
            nameElement.addEventListener('click', (e) => {
                const doctorName = e.target.dataset.doctor;
                this.showDoctorDetailModal(doctorName);
            });
        });
    }

    filterDoctorRevenue(searchTerm) {
        if (!this.currentDoctorData) return;
        
        const filteredData = this.currentDoctorData.filter(doctor => 
            doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        this.renderDoctorRevenueTable(filteredData);
    }

    // 按科室筛选医生收入
    filterDoctorRevenueByDepartment() {
        const departmentFilter = document.getElementById('department-filter').value;
        const searchTerm = document.getElementById('doctor-search').value;
        
        let filteredData = this.originalDoctorData;
        
        // 按科室筛选
        if (departmentFilter) {
            filteredData = filteredData.filter(doctor => doctor.department === departmentFilter);
        }
        
        // 按搜索词筛选
        if (searchTerm) {
            filteredData = filteredData.filter(doctor => 
                doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doctor.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        this.currentDoctorData = filteredData;
        this.renderDoctorRevenueTable(filteredData);
    }

    // 初始化弹窗事件监听
    initModalEventListeners() {
        const modal = document.getElementById('doctor-detail-modal');
        const closeBtn = modal.querySelector('.close');
        
        // 关闭弹窗
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        // 点击弹窗外部关闭
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // 显示医生详情弹窗
    showDoctorDetailModal(doctorName) {
        const modal = document.getElementById('doctor-detail-modal');
        const modalTitle = document.getElementById('modal-doctor-name');
        
        modalTitle.textContent = `${doctorName} - 病种收入构成明细`;
        
        // 生成病种收入数据
        const diseaseData = this.generateDiseaseRevenueData(doctorName);
        this.renderDiseaseRevenueTable(diseaseData);
        
        modal.style.display = 'block';
    }

    // 生成医生病种收入数据
    generateDiseaseRevenueData(doctorName) {
        const diseaseTemplates = [
            { name: '高血压', cases: 45, outpatient: 23.5, inpatient: 12.8, medicine: 15.6, examination: 8.9 },
            { name: '糖尿病', cases: 38, outpatient: 19.8, inpatient: 15.2, medicine: 18.7, examination: 7.3 },
            { name: '冠心病', cases: 32, outpatient: 28.6, inpatient: 22.4, medicine: 12.8, examination: 11.5 },
            { name: '脑梗死', cases: 28, outpatient: 15.9, inpatient: 35.7, medicine: 22.3, examination: 9.8 },
            { name: '肺炎', cases: 25, outpatient: 12.4, inpatient: 18.6, medicine: 14.2, examination: 6.7 },
            { name: '胃炎', cases: 42, outpatient: 18.7, inpatient: 8.9, medicine: 9.5, examination: 5.2 },
            { name: '骨折', cases: 18, outpatient: 8.5, inpatient: 45.8, medicine: 6.7, examination: 12.3 },
            { name: '阑尾炎', cases: 15, outpatient: 6.2, inpatient: 28.9, medicine: 8.4, examination: 4.8 }
        ];

        // 根据医生随机选择4-6个病种
        const selectedDiseases = diseaseTemplates
            .sort(() => Math.random() - 0.5)
            .slice(0, Math.floor(Math.random() * 3) + 4);

        // 计算总收入和占比
        const totalRevenue = selectedDiseases.reduce((sum, disease) => 
            sum + disease.outpatient + disease.inpatient + disease.medicine + disease.examination, 0);

        return selectedDiseases.map(disease => {
            const diseaseTotal = disease.outpatient + disease.inpatient + disease.medicine + disease.examination;
            const percentage = ((diseaseTotal / totalRevenue) * 100).toFixed(1);
            
            return {
                ...disease,
                total: diseaseTotal,
                percentage: percentage
            };
        });
    }

    // 渲染病种收入表格
    renderDiseaseRevenueTable(data) {
        const tbody = document.getElementById('disease-revenue-tbody');
        tbody.innerHTML = data.map(disease => `
            <tr>
                <td><span class="disease-name" data-disease="${disease.name}">${disease.name}</span></td>
                <td>${disease.cases}</td>
                <td>¥${disease.outpatient.toFixed(1)}万</td>
                <td>¥${disease.inpatient.toFixed(1)}万</td>
                <td>¥${disease.medicine.toFixed(1)}万</td>
                <td>¥${disease.examination.toFixed(1)}万</td>
                <td>¥${disease.total.toFixed(1)}万</td>
                <td>${disease.percentage}%</td>
            </tr>
        `).join('');

        // 为病种名称添加点击事件
        document.querySelectorAll('.disease-name').forEach(nameElement => {
            nameElement.addEventListener('click', (e) => {
                const diseaseName = e.target.dataset.disease;
                this.showDiseaseDetailModal(diseaseName);
            });
        });
    }

    // 显示病种详细信息弹窗
    showDiseaseDetailModal(diseaseName) {
        const diseaseData = this.generateDiseaseDetailData(diseaseName);
        
        // 设置基本信息
        document.getElementById('disease-detail-title').textContent = `${diseaseName} - 详细信息`;
        document.getElementById('disease-name-info').textContent = diseaseName;
        document.getElementById('disease-cases-info').textContent = diseaseData.cases + '例';
        document.getElementById('disease-drg-info').textContent = diseaseData.drgGroup;
        document.getElementById('disease-rw-info').textContent = diseaseData.rwValue;

        // 设置费用构成占比
        this.setRatioBar('medicine-ratio', diseaseData.ratios.medicine);
        this.setRatioBar('materials-ratio', diseaseData.ratios.materials);
        this.setRatioBar('medical-ratio', diseaseData.ratios.medical);
        this.setRatioBar('examination-ratio', diseaseData.ratios.examination);

        // 设置医保支付情况
        document.getElementById('insurance-payment-info').textContent = `¥${diseaseData.payment.insurance.toFixed(1)}万`;
        document.getElementById('cost-info').textContent = `¥${diseaseData.payment.cost.toFixed(1)}万`;
        
        const surplus = diseaseData.payment.surplus;
        const surplusElement = document.getElementById('insurance-surplus-info');
        surplusElement.textContent = `¥${Math.abs(surplus).toFixed(1)}万`;
        surplusElement.className = surplus >= 0 ? 'amount surplus' : 'amount surplus negative';

        // 显示弹窗
        document.getElementById('disease-detail-modal').style.display = 'block';
    }

    // 设置占比条形图
    setRatioBar(prefix, ratio) {
        const bar = document.getElementById(`${prefix}-bar`);
        const value = document.getElementById(`${prefix}-value`);
        
        bar.style.width = `${ratio}%`;
        value.textContent = `${ratio}%`;
    }

    // 生成病种详细数据
    generateDiseaseDetailData(diseaseName) {
        // 模拟病种详细数据
        const diseaseDetails = {
            '冠心病': {
                cases: 15,
                drgGroup: 'DRG-CV01',
                rwValue: '1.25',
                ratios: { medicine: 35, materials: 25, medical: 30, examination: 10 },
                payment: { insurance: 48.3, cost: 42.1, surplus: 6.2 }
            },
            '胃炎': {
                cases: 42,
                drgGroup: 'DRG-GI02',
                rwValue: '0.85',
                ratios: { medicine: 45, materials: 15, medical: 25, examination: 15 },
                payment: { insurance: 42.3, cost: 38.7, surplus: 3.6 }
            },
            '脑梗死': {
                cases: 28,
                drgGroup: 'DRG-NE01',
                rwValue: '1.45',
                ratios: { medicine: 40, materials: 20, medical: 25, examination: 15 },
                payment: { insurance: 83.7, cost: 76.2, surplus: 7.5 }
            },
            '骨折': {
                cases: 18,
                drgGroup: 'DRG-OR01',
                rwValue: '1.15',
                ratios: { medicine: 25, materials: 35, medical: 30, examination: 10 },
                payment: { insurance: 73.3, cost: 68.8, surplus: 4.5 }
            },
            '糖尿病': {
                cases: 38,
                drgGroup: 'DRG-EN01',
                rwValue: '0.95',
                ratios: { medicine: 50, materials: 10, medical: 25, examination: 15 },
                payment: { insurance: 61.0, cost: 55.3, surplus: 5.7 }
            },
            '肺炎': {
                cases: 25,
                drgGroup: 'DRG-RE01',
                rwValue: '1.05',
                ratios: { medicine: 40, materials: 15, medical: 30, examination: 15 },
                payment: { insurance: 51.9, cost: 47.2, surplus: 4.7 }
            }
        };

        return diseaseDetails[diseaseName] || {
            cases: 20,
            drgGroup: 'DRG-XX01',
            rwValue: '1.00',
            ratios: { medicine: 35, materials: 20, medical: 30, examination: 15 },
            payment: { insurance: 50.0, cost: 45.0, surplus: 5.0 }
        };
    }

    // 响应式处理
    handleResize() {
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.resize) {
                chart.resize();
            }
        });
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    const revenueAnalysis = new DepartmentRevenueAnalysis();
    
    // 监听窗口大小变化
    window.addEventListener('resize', () => {
        revenueAnalysis.handleResize();
    });
});

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DepartmentRevenueAnalysis;
}