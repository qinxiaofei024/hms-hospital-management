// 核医学页面管理 - 防冲突版本
console.log('Nuclear Medicine JS loading...');

// 保护ECharts实例，防止common.js干扰
(function() {
    'use strict';
    
    // 保存原始的ECharts引用
    const originalEcharts = window.echarts;
    
    // 防止common.js重新加载ECharts
    if (window.Common && window.Common.ensureEcharts) {
        const originalEnsureEcharts = window.Common.ensureEcharts;
        window.Common.ensureEcharts = function() {
            return Promise.resolve(originalEcharts);
        };
    }
    
    // 核医学页面管理对象
    const NuclearMedicinePage = {
        charts: {},
        
        // 初始化页面
        init: function() {
            console.log('Initializing Nuclear Medicine Page...');
            
            // 确保ECharts可用
            if (typeof originalEcharts === 'undefined') {
                console.error('ECharts is not available');
                return;
            }
            
            // 等待DOM完全加载
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    setTimeout(() => this.initializeCharts(), 1000);
                });
            } else {
                setTimeout(() => this.initializeCharts(), 1000);
            }
            
            this.bindEvents();
            this.loadData();
        },
        
        // 初始化图表
        initializeCharts: function() {
            console.log('Starting chart initialization...');
            
            // 使用保存的ECharts引用
            if (!originalEcharts) {
                console.error('ECharts not available for chart initialization');
                return;
            }
            
            // 初始化图表
             this.createExamTrendChart();
             this.createRevenueTrendChart();
             this.createExamTypeChart();
             this.createRadiopharmaceuticalChart();
             this.createEquipmentEfficiencyChart();
             this.createDepartmentRequestChart();
             this.createRadiationSafetyChart();
             
             console.log('Chart initialization completed');
        },
        
        // 检查量趋势分析图表
        createExamTrendChart: function() {
            console.log('Creating exam trend chart...');
            
            const container = document.getElementById('exam-trend-chart');
            console.log('Container element:', container);
            
            if (!container) {
                console.error('exam-trend-chart container not found');
                return;
            }
            
            console.log('Container dimensions:', {
                width: container.offsetWidth,
                height: container.offsetHeight,
                clientWidth: container.clientWidth,
                clientHeight: container.clientHeight
            });
            
            try {
                // 确保容器有尺寸
                if (container.offsetWidth === 0 || container.offsetHeight === 0) {
                    console.warn('Container has no size, setting default size');
                    container.style.width = '100%';
                    container.style.height = '300px';
                }
                
                // 使用保存的ECharts引用初始化
                this.charts.examTrend = originalEcharts.init(container);
                console.log('ECharts instance created successfully');
                
                const option = {
                    title: {
                        text: '核医学检查量趋势',
                        left: 'center',
                        textStyle: { color: '#333', fontSize: 16 }
                    },
                    tooltip: { trigger: 'axis' },
                    legend: {
                        data: ['本月检查量', '上月检查量'],
                        top: 30
                    },
                    xAxis: {
                        type: 'category',
                        data: ['第1周', '第2周', '第3周', '第4周']
                    },
                    yAxis: {
                        type: 'value',
                        name: '检查量'
                    },
                    series: [
                        {
                            name: '本月检查量',
                            type: 'line',
                            data: [120, 132, 101, 134],
                            itemStyle: { color: '#5470c6' }
                        },
                        {
                            name: '上月检查量',
                            type: 'line',
                            data: [220, 182, 191, 234],
                            itemStyle: { color: '#91cc75' }
                        }
                    ]
                };
                
                this.charts.examTrend.setOption(option);
                console.log('Chart option set successfully');
                
                // 强制重新渲染
                setTimeout(() => {
                    if (this.charts.examTrend) {
                        this.charts.examTrend.resize();
                        console.log('Chart resized');
                    }
                }, 100);
                
            } catch (error) {
                console.error('Error creating exam trend chart:', error);
                console.error('Error stack:', error.stack);
            }
        },
        
        // 收入情况趋势图表
        createRevenueTrendChart: function() {
            console.log('Creating revenue trend chart...');
            
            const container = document.getElementById('revenue-trend-chart');
            console.log('Revenue trend container element:', container);
            
            if (!container) {
                console.error('revenue-trend-chart container not found');
                return;
            }
            
            try {
                // 确保容器有尺寸
                if (container.offsetWidth === 0 || container.offsetHeight === 0) {
                    console.warn('Revenue trend container has no size, setting default size');
                    container.style.width = '100%';
                    container.style.height = '300px';
                }
                
                // 使用保存的ECharts引用初始化
                this.charts.revenueTrend = originalEcharts.init(container);
                console.log('Revenue trend ECharts instance created successfully');
                
                const option = {
                    title: {
                        text: '核医学科收入趋势',
                        left: 'center',
                        textStyle: { color: '#333', fontSize: 16 }
                    },
                    tooltip: { 
                        trigger: 'axis',
                        formatter: function(params) {
                            let result = params[0].name + '<br/>';
                            params.forEach(function(item) {
                                result += item.seriesName + ': ¥' + item.value.toLocaleString() + '<br/>';
                            });
                            return result;
                        }
                    },
                    legend: {
                        data: ['本月收入', '上月收入', '目标收入'],
                        top: 30
                    },
                    xAxis: {
                        type: 'category',
                        data: ['第1周', '第2周', '第3周', '第4周']
                    },
                    yAxis: {
                        type: 'value',
                        name: '收入(万元)',
                        axisLabel: {
                            formatter: function(value) {
                                return (value / 10000).toFixed(1) + '万';
                            }
                        }
                    },
                    series: [
                        {
                            name: '本月收入',
                            type: 'line',
                            data: [85000, 92000, 78000, 105000],
                            itemStyle: { color: '#36A2EB' },
                            lineStyle: { width: 3 },
                            symbol: 'circle',
                            symbolSize: 6
                        },
                        {
                            name: '上月收入',
                            type: 'line',
                            data: [75000, 88000, 82000, 95000],
                            itemStyle: { color: '#4BC0C0' },
                            lineStyle: { width: 2, type: 'dashed' },
                            symbol: 'diamond',
                            symbolSize: 5
                        },
                        {
                            name: '目标收入',
                            type: 'line',
                            data: [90000, 90000, 90000, 90000],
                            itemStyle: { color: '#FF6384' },
                            lineStyle: { width: 2, type: 'dotted' },
                            symbol: 'rect',
                            symbolSize: 4
                        }
                    ]
                };
                
                this.charts.revenueTrend.setOption(option);
                console.log('Revenue trend chart option set successfully');
                
                // 强制重新渲染
                setTimeout(() => {
                    if (this.charts.revenueTrend) {
                        this.charts.revenueTrend.resize();
                        console.log('Revenue trend chart resized');
                    }
                }, 100);
                
            } catch (error) {
                console.error('Error creating revenue trend chart:', error);
                console.error('Error stack:', error.stack);
            }
        },
         
         // 检查类型分布图表
         createExamTypeChart: function() {
             console.log('Creating exam type chart...');
             
             const container = document.getElementById('exam-type-chart');
             console.log('Exam type container element:', container);
             
             if (!container) {
                 console.error('exam-type-chart container not found');
                 return;
             }
             
             try {
                 // 确保容器有尺寸
                 if (container.offsetWidth === 0 || container.offsetHeight === 0) {
                     console.warn('Exam type container has no size, setting default size');
                     container.style.width = '100%';
                     container.style.height = '300px';
                 }
                 
                 // 使用保存的ECharts引用初始化
                 this.charts.examType = originalEcharts.init(container);
                 console.log('Exam type ECharts instance created successfully');
                 
                 const option = {
                     title: {
                         text: '检查类型分布',
                         left: 'center',
                         textStyle: { color: '#333', fontSize: 16 }
                     },
                     tooltip: {
                         trigger: 'item',
                         formatter: '{a} <br/>{b}: {c} ({d}%)'
                     },
                     legend: {
                         orient: 'vertical',
                         left: 'left',
                         data: ['骨扫描', '心肌灌注', '甲状腺扫描', '肾功能检查', '肺通气灌注']
                     },
                     series: [
                         {
                             name: '检查类型',
                             type: 'pie',
                             radius: '50%',
                             center: ['50%', '60%'],
                             data: [
                                 { value: 335, name: '骨扫描' },
                                 { value: 310, name: '心肌灌注' },
                                 { value: 234, name: '甲状腺扫描' },
                                 { value: 135, name: '肾功能检查' },
                                 { value: 148, name: '肺通气灌注' }
                             ],
                             emphasis: {
                                 itemStyle: {
                                     shadowBlur: 10,
                                     shadowOffsetX: 0,
                                     shadowColor: 'rgba(0, 0, 0, 0.5)'
                                 }
                             }
                         }
                     ]
                 };
                 
                 this.charts.examType.setOption(option);
                 console.log('Exam type chart option set successfully');
                 
                 // 强制重新渲染
                 setTimeout(() => {
                     if (this.charts.examType) {
                         this.charts.examType.resize();
                         console.log('Exam type chart resized');
                     }
                 }, 100);
                 
             } catch (error) {
                 console.error('Error creating exam type chart:', error);
                 console.error('Error stack:', error.stack);
             }
         },
         
         // 创建放射性药物使用情况图表
         createRadiopharmaceuticalChart: function() {
             console.log('Creating radiopharmaceutical chart...');
             
             const container = document.getElementById('radiopharmaceutical-chart');
             console.log('Radiopharmaceutical container element:', container);
             
             if (!container) {
                 console.error('radiopharmaceutical-chart container not found');
                 return;
             }
             
             try {
                 // 确保容器有尺寸
                 if (container.offsetWidth === 0 || container.offsetHeight === 0) {
                     console.warn('Radiopharmaceutical container has no size, setting default size');
                     container.style.width = '100%';
                     container.style.height = '300px';
                 }
                 
                 // 使用保存的ECharts引用初始化
                 this.charts.radiopharmaceutical = originalEcharts.init(container);
                 console.log('Radiopharmaceutical ECharts instance created successfully');
                 
                 const option = {
                     title: {
                         text: '放射性药物使用情况',
                         left: 'center',
                         textStyle: { color: '#333', fontSize: 16 }
                     },
                     tooltip: {
                         trigger: 'axis',
                         axisPointer: {
                             type: 'shadow'
                         }
                     },
                     legend: {
                         data: ['使用量', '库存量'],
                         top: 30
                     },
                     xAxis: {
                         type: 'category',
                         data: ['Tc-99m', 'I-131', 'F-18', 'Ga-68', 'Lu-177', 'Y-90']
                     },
                     yAxis: {
                         type: 'value',
                         name: '剂量 (mCi)'
                     },
                     series: [
                         {
                             name: '使用量',
                             type: 'bar',
                             data: [120, 85, 95, 45, 30, 25],
                             itemStyle: {
                                 color: '#5470c6'
                             }
                         },
                         {
                             name: '库存量',
                             type: 'bar',
                             data: [80, 60, 70, 35, 20, 15],
                             itemStyle: {
                                 color: '#91cc75'
                             }
                         }
                     ]
                 };
                 
                 this.charts.radiopharmaceutical.setOption(option);
                 console.log('Radiopharmaceutical chart option set successfully');
                 
                 // 强制重新渲染
                 setTimeout(() => {
                     if (this.charts.radiopharmaceutical) {
                         this.charts.radiopharmaceutical.resize();
                         console.log('Radiopharmaceutical chart resized');
                     }
                 }, 100);
                 
             } catch (error) {
                 console.error('Error creating radiopharmaceutical chart:', error);
                 console.error('Error stack:', error.stack);
             }
         },
         
         // 创建设备效率分析图表
         createEquipmentEfficiencyChart: function() {
             console.log('Creating equipment efficiency chart...');
             
             const container = document.getElementById('equipment-efficiency-chart');
             console.log('Equipment efficiency container element:', container);
             
             if (!container) {
                 console.error('equipment-efficiency-chart container not found');
                 return;
             }
             
             try {
                 // 确保容器有尺寸
                 if (container.offsetWidth === 0 || container.offsetHeight === 0) {
                     console.warn('Equipment efficiency container has no size, setting default size');
                     container.style.width = '100%';
                     container.style.height = '300px';
                 }
                 
                 // 使用保存的ECharts引用初始化
                 this.charts.equipmentEfficiency = originalEcharts.init(container);
                 console.log('Equipment efficiency ECharts instance created successfully');
                 
                 const option = {
                     title: {
                         text: '设备效率分析',
                         left: 'center',
                         textStyle: { color: '#333', fontSize: 16 }
                     },
                     tooltip: {
                         trigger: 'axis'
                     },
                     legend: {
                         data: ['SPECT-CT', 'PET-CT', 'γ相机'],
                         top: 30
                     },
                     radar: {
                         indicator: [
                             { name: '使用率', max: 100 },
                             { name: '故障率', max: 100 },
                             { name: '维护频次', max: 100 },
                             { name: '检查质量', max: 100 },
                             { name: '患者满意度', max: 100 }
                         ]
                     },
                     series: [
                         {
                             name: '设备效率',
                             type: 'radar',
                             data: [
                                 {
                                     value: [85, 15, 25, 92, 88],
                                     name: 'SPECT-CT',
                                     itemStyle: {
                                         color: '#5470c6'
                                     }
                                 },
                                 {
                                     value: [78, 20, 30, 95, 90],
                                     name: 'PET-CT',
                                     itemStyle: {
                                         color: '#91cc75'
                                     }
                                 },
                                 {
                                     value: [90, 10, 20, 88, 85],
                                     name: 'γ相机',
                                     itemStyle: {
                                         color: '#fac858'
                                     }
                                 }
                             ]
                         }
                     ]
                 };
                 
                 this.charts.equipmentEfficiency.setOption(option);
                 console.log('Equipment efficiency chart option set successfully');
                 
                 // 强制重新渲染
                 setTimeout(() => {
                     if (this.charts.equipmentEfficiency) {
                         this.charts.equipmentEfficiency.resize();
                         console.log('Equipment efficiency chart resized');
                     }
                 }, 100);
                 
             } catch (error) {
                 console.error('Error creating equipment efficiency chart:', error);
                 console.error('Error stack:', error.stack);
             }
         },
         
         // 创建科室申请量统计图表
         createDepartmentRequestChart: function() {
             console.log('Creating department request chart...');
             
             const container = document.getElementById('department-request-chart');
             console.log('Department request container element:', container);
             
             if (!container) {
                 console.error('department-request-chart container not found');
                 return;
             }
             
             try {
                 // 确保容器有尺寸
                 if (container.offsetWidth === 0 || container.offsetHeight === 0) {
                     console.warn('Department request container has no size, setting default size');
                     container.style.width = '100%';
                     container.style.height = '300px';
                 }
                 
                 // 使用保存的ECharts引用初始化
                 this.charts.departmentRequest = originalEcharts.init(container);
                 console.log('Department request ECharts instance created successfully');
                 
                 const option = {
                     title: {
                         text: '科室申请量统计',
                         left: 'center',
                         textStyle: { color: '#333', fontSize: 16 }
                     },
                     tooltip: {
                         trigger: 'axis',
                         axisPointer: {
                             type: 'shadow'
                         }
                     },
                     xAxis: {
                         type: 'category',
                         data: ['心内科', '肿瘤科', '内分泌科', '骨科', '神经内科', '呼吸科'],
                         axisLabel: {
                             rotate: 45
                         }
                     },
                     yAxis: {
                         type: 'value',
                         name: '申请数量'
                     },
                     series: [
                         {
                             name: '申请量',
                             type: 'bar',
                             data: [156, 142, 98, 87, 76, 65],
                             itemStyle: {
                                 color: '#5470c6'
                             }
                         }
                     ]
                 };
                 
                 this.charts.departmentRequest.setOption(option);
                 console.log('Department request chart option set successfully');
                 
                 // 强制重新渲染
                 setTimeout(() => {
                     if (this.charts.departmentRequest) {
                         this.charts.departmentRequest.resize();
                         console.log('Department request chart resized');
                     }
                 }, 100);
                 
             } catch (error) {
                 console.error('Error creating department request chart:', error);
                 console.error('Error stack:', error.stack);
             }
         },
         
         // 创建辐射安全监测图表
         createRadiationSafetyChart: function() {
             console.log('Creating radiation safety chart...');
             
             const container = document.getElementById('radiation-safety-chart');
             console.log('Radiation safety container element:', container);
             
             if (!container) {
                 console.error('radiation-safety-chart container not found');
                 return;
             }
             
             try {
                 // 确保容器有尺寸
                 if (container.offsetWidth === 0 || container.offsetHeight === 0) {
                     console.warn('Radiation safety container has no size, setting default size');
                     container.style.width = '100%';
                     container.style.height = '300px';
                 }
                 
                 // 使用保存的ECharts引用初始化
                 this.charts.radiationSafety = originalEcharts.init(container);
                 console.log('Radiation safety ECharts instance created successfully');
                 
                 const option = {
                     title: {
                         text: '辐射安全监测',
                         left: 'center',
                         textStyle: { color: '#333', fontSize: 16 }
                     },
                     tooltip: {
                         trigger: 'axis'
                     },
                     legend: {
                         data: ['辐射剂量', '安全阈值'],
                         top: 30
                     },
                     xAxis: {
                         type: 'category',
                         data: ['1月', '2月', '3月', '4月', '5月', '6月']
                     },
                     yAxis: {
                         type: 'value',
                         name: '剂量 (mSv)'
                     },
                     series: [
                         {
                             name: '辐射剂量',
                             type: 'line',
                             data: [2.1, 2.3, 1.8, 2.0, 2.2, 1.9],
                             itemStyle: {
                                 color: '#ee6666'
                             },
                             lineStyle: {
                                 color: '#ee6666'
                             }
                         },
                         {
                             name: '安全阈值',
                             type: 'line',
                             data: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0],
                             itemStyle: {
                                 color: '#73c0de'
                             },
                             lineStyle: {
                                 color: '#73c0de',
                                 type: 'dashed'
                             }
                         }
                     ]
                 };
                 
                 this.charts.radiationSafety.setOption(option);
                 console.log('Radiation safety chart option set successfully');
                 
                 // 强制重新渲染
                 setTimeout(() => {
                     if (this.charts.radiationSafety) {
                         this.charts.radiationSafety.resize();
                         console.log('Radiation safety chart resized');
                     }
                 }, 100);
                 
             } catch (error) {
                 console.error('Error creating radiation safety chart:', error);
                 console.error('Error stack:', error.stack);
             }
         },
         
         // 绑定事件
        bindEvents: function() {
            console.log('Binding events...');
            
            // 导出按钮事件
            const exportBtn = document.getElementById('export-btn');
            if (exportBtn) {
                exportBtn.addEventListener('click', () => this.exportData());
            }
            
            // 刷新按钮事件
            const refreshBtn = document.getElementById('refresh-btn');
            if (refreshBtn) {
                refreshBtn.addEventListener('click', () => this.loadData(true));
            }
        },
        
        // 加载数据
        loadData: function(isRefresh = false) {
            console.log('Loading data...');
            
            // 模拟数据加载
            setTimeout(() => {
                this.updateOverviewCards();
                this.updateTableData();
                
                if (isRefresh) {
                    this.showMessage('数据已刷新');
                }
            }, 500);
        },
        
        // 更新概览卡片
        updateOverviewCards: function() {
            const cards = document.querySelectorAll('.overview-card');
            if (cards.length >= 3) {
                const values = cards[0].querySelector('.card-value');
                if (values) values.textContent = '¥2,456,789';
                
                const usage = cards[1].querySelector('.card-value');
                if (usage) usage.textContent = '87.5%';
                
                const time = cards[2].querySelector('.card-value');
                if (time) time.textContent = '45分钟';
            }
        },
        
        // 更新表格数据
        updateTableData: function() {
            const tbody = document.getElementById('exam-detail-table');
            if (!tbody) return;
            
            const examDetails = [
                { id: 'NM001', patient: '张三', type: '骨扫描', date: '2024-01-15', status: '已完成', doctor: '李医生', dose: '20mCi' },
                { id: 'NM002', patient: '李四', type: '心肌灌注', date: '2024-01-15', status: '进行中', doctor: '王医生', dose: '25mCi' }
            ];
            
            tbody.innerHTML = examDetails.map(item => `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.patient}</td>
                    <td>${item.type}</td>
                    <td>${item.date}</td>
                    <td><span class="status ${item.status === '已完成' ? 'completed' : 'pending'}">${item.status}</span></td>
                    <td>${item.doctor}</td>
                    <td>${item.dose}</td>
                    <td>
                        <button class="btn btn-small btn-primary" onclick="viewDetails('${item.id}')">查看</button>
                        <button class="btn btn-small btn-secondary" onclick="editRecord('${item.id}')">编辑</button>
                    </td>
                </tr>
            `).join('');
        },
        
        // 导出数据
        exportData: function() {
            this.showMessage('正在导出数据...');
        },
        
        // 显示消息
        showMessage: function(message) {
            console.log('Message:', message);
            
            // 创建临时消息提示
            const messageDiv = document.createElement('div');
            messageDiv.textContent = message;
            messageDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 10px 20px;
                border-radius: 4px;
                z-index: 1000;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            `;
            
            document.body.appendChild(messageDiv);
            
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 3000);
        }
    };
    
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            console.log('DOM Content Loaded');
            NuclearMedicinePage.init();
        });
    } else {
        console.log('DOM already loaded');
        NuclearMedicinePage.init();
    }
    
    // 全局函数
    window.viewDetails = function(id) {
        NuclearMedicinePage.showMessage(`查看记录 ${id} 的详细信息`);
    };
    
    window.editRecord = function(id) {
        NuclearMedicinePage.showMessage(`编辑记录 ${id}`);
    };
    
    // 窗口大小改变时重新调整图表
    window.addEventListener('resize', function() {
        Object.values(NuclearMedicinePage.charts).forEach(chart => {
            if (chart && chart.resize) {
                chart.resize();
            }
        });
    });
    
    // 暴露到全局作用域以便调试
    window.NuclearMedicinePage = NuclearMedicinePage;
    
})();

console.log('Nuclear Medicine JS loaded');