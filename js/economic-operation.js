(function() {
    // 创建EconomicOperationPage对象
    var EconomicOperationPage = {
        // 初始化状态标记
        initialized: false,
        
        // 初始化页面
        init: function() {
            console.log('EconomicOperationPage: Initializing page');
            
            // 防止重复初始化
            if (this.initialized) {
                console.log('EconomicOperationPage: Already initialized, skipping');
                return;
            }
            
            // 绑定事件
            this.bindEvents();
            
            // 初始化事件监听
            this.initEventListeners();
            
            // 加载数据
            this.loadData();
            
            // 初始化指标下钻事件
            this.initDrillDownEvents();
            
            this.initialized = true;
            console.log('EconomicOperationPage: Page initialized successfully');
        },
        
        // 绑定事件
        bindEvents: function() {
            // 绑定下拉框change事件
            const timeRange = document.getElementById('time-range');
            if (timeRange) {
                timeRange.addEventListener('change', function() {
                    EconomicOperationPage.loadData();
                });
            }
            
            const departmentType = document.getElementById('department-type');
            if (departmentType) {
                departmentType.addEventListener('change', function() {
                    EconomicOperationPage.loadData();
                });
            }
            
            // 绑定刷新按钮点击事件
            const searchBtn = document.getElementById('search-btn');
            if (searchBtn) {
                searchBtn.addEventListener('click', function() {
                    EconomicOperationPage.refreshData();
                });
            }
            
            // 绑定导出按钮点击事件
            const exportBtn = document.getElementById('export-btn');
            if (exportBtn) {
                exportBtn.addEventListener('click', function() {
                    EconomicOperationPage.exportReport();
                });
            }
            
            // 绑定导出表格按钮点击事件
            const exportTableBtn = document.getElementById('export-table-btn');
            if (exportTableBtn) {
                exportTableBtn.addEventListener('click', function() {
                    EconomicOperationPage.exportTable();
                });
            }
            
            // 绑定科室名称点击事件
            this.bindDepartmentClickEvents();
            
            // 绑定弹窗相关事件
            this.bindModalEvents();
        },
        
        // 初始化事件监听
        initEventListeners: function() {
            // 刷新按钮点击事件
            if (document.getElementById('refresh-btn')) {
                document.getElementById('refresh-btn').addEventListener('click', function() {
                    EconomicOperationPage.refreshData();
                });
            }
            
            // 指标达成率切换事件
            if (document.getElementById('achievement-rate-toggle')) {
                document.getElementById('achievement-rate-toggle').addEventListener('change', function() {
                    EconomicOperationPage.toggleAchievementRate();
                });
            }
        },
        
        // 初始化指标下钻事件
        initDrillDownEvents: function() {
            // 为所有可下钻的元素添加点击事件
            const drillableElements = document.querySelectorAll('.drillable');
            drillableElements.forEach(function(element) {
                element.addEventListener('click', function(e) {
                    const metric = this.getAttribute('data-metric');
                    const timeRange = document.getElementById('time-range');
                    const period = this.getAttribute('data-period') || (timeRange ? timeRange.value : 'currentYear');
                    EconomicOperationPage.drillDown(metric, period);
                });
            });
        },
        
        // 指标下钻功能
        drillDown: function(metric, period) {
            Common.showLoading();
            
            // 模拟下钻数据加载
            setTimeout(function() {
                console.log('Drilling down for metric:', metric, 'period:', period);
                
                // 在实际应用中，这里会根据指标和时间周期加载详细数据
                // 并显示在模态框或新页面中
                Common.showToast('加载'+metric+'详细数据成功！', 'success');
                Common.hideLoading();
            }, 800);
        },
        
        // 切换指标达成率显示
        toggleAchievementRate: function() {
            const achievementElements = document.querySelectorAll('.achievement-rate');
            const achievementRateToggle = document.getElementById('achievement-rate-toggle');
            const isChecked = achievementRateToggle ? achievementRateToggle.checked : false;
            
            achievementElements.forEach(function(element) {
                element.style.display = isChecked ? 'inline' : 'none';
            });
        },
        
        // 加载数据
        loadData: function() {
            // 显示加载状态
            Common.showLoading();
            
            // 获取选择的时间范围和科室类型
            const timeRange = document.getElementById('time-range');
            const timeRangeValue = timeRange ? timeRange.value : 'currentYear';
            
            const departmentType = document.getElementById('department-type');
            const departmentTypeValue = departmentType ? departmentType.value : 'all';
            
            // 从实际数据文件加载数据
            const xhr = new XMLHttpRequest();
            xhr.open('GET', '../data/economic-operation.json', true);
            xhr.responseType = 'json';
            
            xhr.onload = () => {
                if (xhr.status === 200) {
                    const rawData = xhr.response;
                    console.log('原始数据加载成功:', rawData);
                    console.log('总收入:', rawData.overview?.totalRevenue);
                    console.log('医疗收入:', rawData.overview?.medicalRevenue);
                    // 转换数据格式以匹配图表需求
                    const data = EconomicOperationPage.transformDataForCharts(rawData);
                    console.log('转换后的数据:', data);
                    // 使用转换后的数据初始化图表
                    EconomicOperationPage.initCharts(data);
                    
                    // 渲染对比表格
                    EconomicOperationPage.renderComparisonTable(data.comparisonTableData);
                    
                    // 渲染科室明细表格
                    EconomicOperationPage.renderDepartmentDetailsTable(data.departmentDetails);
                    
                    // 渲染指标达成率
                    EconomicOperationPage.renderAchievementRate(data.achievementRateData);
                    
                    Common.hideLoading();
                } else {
                    console.error('加载数据失败:', xhr.status);
                    // 如果加载失败，使用模拟数据
                    var mockData = EconomicOperationPage.getMockData(timeRangeValue, departmentTypeValue);
                    EconomicOperationPage.initCharts(mockData);
                    
                    // 渲染对比表格
                    EconomicOperationPage.renderComparisonTable(mockData.comparisonTableData);
                    
                    // 渲染科室明细表格
                    EconomicOperationPage.renderDepartmentDetailsTable(mockData.departmentDetails);
                    
                    // 渲染指标达成率
                    EconomicOperationPage.renderAchievementRate(mockData.achievementRateData);
                    
                    Common.hideLoading();
                }
            };
            
            xhr.onerror = () => {
                console.error('请求数据出错');
                // 如果请求出错，使用模拟数据
                var mockData = EconomicOperationPage.getMockData(timeRangeValue, departmentTypeValue);
                EconomicOperationPage.initCharts(mockData);
                
                // 渲染对比表格
                EconomicOperationPage.renderComparisonTable(mockData.comparisonTableData);
                
                // 渲染科室明细表格
                EconomicOperationPage.renderDepartmentDetailsTable(mockData.departmentDetails);
                
                // 渲染指标达成率
                EconomicOperationPage.renderAchievementRate(mockData.achievementRateData);
                
                Common.hideLoading();
            };
            
            xhr.send();
        },
        
        // 刷新数据
        refreshData: function() {
            // 显示刷新状态
            var searchBtn = document.getElementById('search-btn');
            var originalText = searchBtn.innerHTML;
            searchBtn.innerHTML = '刷新中...';
            searchBtn.disabled = true;
            
            // 重新加载数据
            this.loadData();
            
            // 恢复按钮状态
            setTimeout(function() {
                searchBtn.innerHTML = originalText;
                searchBtn.disabled = false;
            }, 1000);
        },
        
        // 导出报告
        exportReport: function() {
            // 显示导出状态
            var exportBtn = document.getElementById('export-btn');
            var originalText = exportBtn.innerHTML;
            exportBtn.innerHTML = '导出中...';
            exportBtn.disabled = true;
            
            // 模拟导出过程
            setTimeout(function() {
                Common.showToast('报告导出成功！', 'success');
                exportBtn.innerHTML = originalText;
                exportBtn.disabled = false;
            }, 1500);
        },
        
        // 导出表格数据
        exportTable: function() {
            // 显示导出状态
            var exportTableBtn = document.getElementById('export-table-btn');
            var originalText = exportTableBtn.innerHTML;
            exportTableBtn.innerHTML = '导出中...';
            exportTableBtn.disabled = true;
            
            // 模拟表格导出过程
            setTimeout(function() {
                Common.showToast('表格数据导出成功！', 'success');
                exportTableBtn.innerHTML = originalText;
                exportTableBtn.disabled = false;
            }, 1200);
        },
        
        // 绑定科室名称点击事件
        bindDepartmentClickEvents: function() {
            const departmentNames = document.querySelectorAll('.department-name.clickable');
            departmentNames.forEach(function(element) {
                element.addEventListener('click', function(e) {
                    e.stopPropagation(); // 阻止事件冒泡
                    const departmentName = this.getAttribute('data-department');
                    EconomicOperationPage.showDoctorIncomeModal(departmentName);
                });
            });
        },
        
        // 绑定弹窗相关事件
        bindModalEvents: function() {
            const modal = document.getElementById('doctor-income-modal');
            const closeBtn = modal.querySelector('.close');
            const closeModalBtn = document.getElementById('close-modal-btn');
            const exportDoctorIncomeBtn = document.getElementById('export-doctor-income-btn');
            
            // 关闭按钮事件
            if (closeBtn) {
                closeBtn.addEventListener('click', function() {
                    EconomicOperationPage.closeDoctorIncomeModal();
                });
            }
            
            if (closeModalBtn) {
                closeModalBtn.addEventListener('click', function() {
                    EconomicOperationPage.closeDoctorIncomeModal();
                });
            }
            
            // 点击模态框背景关闭
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    EconomicOperationPage.closeDoctorIncomeModal();
                }
            });
            
            // 导出医生收入数据
            if (exportDoctorIncomeBtn) {
                exportDoctorIncomeBtn.addEventListener('click', function() {
                    EconomicOperationPage.exportDoctorIncomeData();
                });
            }
            
            // 医生姓名点击事件（使用事件委托）
            const doctorIncomeTable = document.getElementById('doctor-income-tbody');
            if (doctorIncomeTable) {
                doctorIncomeTable.addEventListener('click', function(e) {
                    if (e.target.classList.contains('doctor-name-clickable')) {
                        const doctorName = e.target.getAttribute('data-doctor-name');
                        const departmentName = e.target.getAttribute('data-department');
                        EconomicOperationPage.showDoctorDiseaseModal(doctorName, departmentName);
                    }
                });
            }
            
            // 病种收入弹窗事件绑定
            const diseaseModal = document.getElementById('doctor-disease-modal');
            const diseaseCloseBtn = diseaseModal.querySelector('.close');
            const closeDiseaseModalBtn = document.getElementById('close-disease-modal-btn');
            const exportDiseaseIncomeBtn = document.getElementById('export-disease-income-btn');
            
            // 关闭按钮事件
            if (diseaseCloseBtn) {
                diseaseCloseBtn.addEventListener('click', function() {
                    EconomicOperationPage.closeDoctorDiseaseModal();
                });
            }
            
            if (closeDiseaseModalBtn) {
                closeDiseaseModalBtn.addEventListener('click', function() {
                    EconomicOperationPage.closeDoctorDiseaseModal();
                });
            }
            
            // 点击模态框背景关闭
            diseaseModal.addEventListener('click', function(e) {
                if (e.target === diseaseModal) {
                    EconomicOperationPage.closeDoctorDiseaseModal();
                }
            });
            
            // 导出病种收入数据
            if (exportDiseaseIncomeBtn) {
                exportDiseaseIncomeBtn.addEventListener('click', function() {
                    EconomicOperationPage.exportDoctorDiseaseData();
                });
            }
        },
        
        // 显示医生收入明细弹窗
        showDoctorIncomeModal: function(departmentName) {
            const modal = document.getElementById('doctor-income-modal');
            const modalTitle = document.getElementById('modal-department-title');
            const tbody = document.getElementById('doctor-income-tbody');
            
            // 设置标题
            modalTitle.textContent = departmentName + ' - 医生收入明细';
            
            // 获取医生收入数据
            const doctorData = this.getDoctorIncomeData(departmentName);
            
            // 清空表格内容
            tbody.innerHTML = '';
            
            // 填充数据
            doctorData.forEach(function(doctor) {
                const row = document.createElement('tr');
                // 将医生姓名格式化为姓氏+**
                const maskedName = doctor.name.charAt(0) + '**';
                row.innerHTML = `
                    <td><span class="doctor-name-clickable" data-doctor-name="${doctor.name}" data-department="${departmentName}">${maskedName}</span></td>
                    <td>${doctor.title}</td>
                    <td>¥${doctor.outpatientIncome.toLocaleString()}</td>
                    <td>¥${doctor.inpatientIncome.toLocaleString()}</td>
                    <td>¥${doctor.surgeryIncome.toLocaleString()}</td>
                    <td>¥${doctor.totalIncome.toLocaleString()}</td>
                    <td class="${doctor.growth >= 0 ? 'trend-up' : 'trend-down'}">${doctor.growth >= 0 ? '+' : ''}${doctor.growth}%</td>
                `;
                tbody.appendChild(row);
            });
            
            // 显示弹窗
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // 防止背景滚动
        },
        
        // 关闭医生收入明细弹窗
        closeDoctorIncomeModal: function() {
            const modal = document.getElementById('doctor-income-modal');
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // 恢复背景滚动
        },
        
        // 获取医生收入数据（模拟数据）
        getDoctorIncomeData: function(departmentName) {
            // 模拟不同科室的医生数据
            const doctorDataMap = {
                '心内科': [
                    { name: '张主任', title: '主任医师', outpatientIncome: 45000, inpatientIncome: 85000, surgeryIncome: 120000, totalIncome: 250000, growth: 12.5 },
                    { name: '李副主任', title: '副主任医师', outpatientIncome: 38000, inpatientIncome: 72000, surgeryIncome: 95000, totalIncome: 205000, growth: 8.3 },
                    { name: '王医生', title: '主治医师', outpatientIncome: 32000, inpatientIncome: 58000, surgeryIncome: 65000, totalIncome: 155000, growth: 15.2 },
                    { name: '陈医生', title: '主治医师', outpatientIncome: 28000, inpatientIncome: 52000, surgeryIncome: 58000, totalIncome: 138000, growth: 6.8 },
                    { name: '刘医生', title: '住院医师', outpatientIncome: 22000, inpatientIncome: 35000, surgeryIncome: 25000, totalIncome: 82000, growth: 18.7 }
                ],
                '消化内科': [
                    { name: '赵主任', title: '主任医师', outpatientIncome: 42000, inpatientIncome: 78000, surgeryIncome: 110000, totalIncome: 230000, growth: 9.2 },
                    { name: '孙副主任', title: '副主任医师', outpatientIncome: 35000, inpatientIncome: 65000, surgeryIncome: 88000, totalIncome: 188000, growth: 11.5 },
                    { name: '周医生', title: '主治医师', outpatientIncome: 30000, inpatientIncome: 55000, surgeryIncome: 62000, totalIncome: 147000, growth: 7.3 },
                    { name: '吴医生', title: '主治医师', outpatientIncome: 26000, inpatientIncome: 48000, surgeryIncome: 55000, totalIncome: 129000, growth: 13.1 },
                    { name: '郑医生', title: '住院医师', outpatientIncome: 20000, inpatientIncome: 32000, surgeryIncome: 22000, totalIncome: 74000, growth: 16.4 }
                ],
                '呼吸内科': [
                    { name: '马主任', title: '主任医师', outpatientIncome: 38000, inpatientIncome: 70000, surgeryIncome: 95000, totalIncome: 203000, growth: 10.8 },
                    { name: '冯副主任', title: '副主任医师', outpatientIncome: 32000, inpatientIncome: 58000, surgeryIncome: 75000, totalIncome: 165000, growth: 5.9 },
                    { name: '许医生', title: '主治医师', outpatientIncome: 28000, inpatientIncome: 50000, surgeryIncome: 58000, totalIncome: 136000, growth: 14.2 },
                    { name: '韩医生', title: '主治医师', outpatientIncome: 24000, inpatientIncome: 42000, surgeryIncome: 48000, totalIncome: 114000, growth: 8.7 },
                    { name: '曹医生', title: '住院医师', outpatientIncome: 18000, inpatientIncome: 28000, surgeryIncome: 18000, totalIncome: 64000, growth: 19.3 }
                ],
                '骨科': [
                    { name: '杨主任', title: '主任医师', outpatientIncome: 52000, inpatientIncome: 95000, surgeryIncome: 180000, totalIncome: 327000, growth: 16.8 },
                    { name: '胡副主任', title: '副主任医师', outpatientIncome: 45000, inpatientIncome: 82000, surgeryIncome: 155000, totalIncome: 282000, growth: 12.3 },
                    { name: '林医生', title: '主治医师', outpatientIncome: 38000, inpatientIncome: 68000, surgeryIncome: 125000, totalIncome: 231000, growth: 18.5 },
                    { name: '谢医生', title: '主治医师', outpatientIncome: 32000, inpatientIncome: 58000, surgeryIncome: 98000, totalIncome: 188000, growth: 14.7 },
                    { name: '邓医生', title: '住院医师', outpatientIncome: 25000, inpatientIncome: 38000, surgeryIncome: 45000, totalIncome: 108000, growth: 22.1 }
                ],
                '神经外科': [
                    { name: '蒋主任', title: '主任医师', outpatientIncome: 48000, inpatientIncome: 88000, surgeryIncome: 165000, totalIncome: 301000, growth: 8.9 },
                    { name: '沈副主任', title: '副主任医师', outpatientIncome: 42000, inpatientIncome: 75000, surgeryIncome: 142000, totalIncome: 259000, growth: 6.2 },
                    { name: '姚医生', title: '主治医师', outpatientIncome: 35000, inpatientIncome: 62000, surgeryIncome: 115000, totalIncome: 212000, growth: 11.4 },
                    { name: '卢医生', title: '主治医师', outpatientIncome: 30000, inpatientIncome: 52000, surgeryIncome: 88000, totalIncome: 170000, growth: 9.8 },
                    { name: '薛医生', title: '住院医师', outpatientIncome: 22000, inpatientIncome: 35000, surgeryIncome: 38000, totalIncome: 95000, growth: 15.6 }
                ]
            };
            
            return doctorDataMap[departmentName] || [];
        },
        
        // 导出医生收入数据
        exportDoctorIncomeData: function() {
            const exportBtn = document.getElementById('export-doctor-income-btn');
            const originalText = exportBtn.textContent;
            exportBtn.textContent = '导出中...';
            exportBtn.disabled = true;
            
            // 模拟导出过程
            setTimeout(function() {
                Common.showToast('医生收入数据导出成功！', 'success');
                exportBtn.textContent = originalText;
                exportBtn.disabled = false;
            }, 1000);
        },
        
        // 显示医生病种收入详情弹窗
        showDoctorDiseaseModal: function(doctorName, departmentName) {
            const modal = document.getElementById('doctor-disease-modal');
            const modalTitle = document.getElementById('modal-doctor-title');
            const tbody = document.getElementById('doctor-disease-tbody');
            
            // 设置标题
            modalTitle.textContent = `${doctorName} - 病种收入详情`;
            
            // 获取医生病种收入数据
            const diseaseData = this.getDoctorDiseaseData(doctorName, departmentName);
            
            // 清空表格内容
            tbody.innerHTML = '';
            
            // 填充数据
            diseaseData.forEach(function(disease) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="disease-name">${disease.name}</td>
                    <td class="case-count">${disease.caseCount}</td>
                    <td>¥${disease.averageCost.toLocaleString()}</td>
                    <td class="income-amount">¥${disease.totalIncome.toLocaleString()}</td>
                    <td class="percentage">${disease.percentage}%</td>
                    <td class="${disease.growth >= 0 ? 'trend-up' : 'trend-down'}">${disease.growth >= 0 ? '+' : ''}${disease.growth}%</td>
                `;
                tbody.appendChild(row);
            });
            
            // 显示弹窗
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // 防止背景滚动
        },
        
        // 关闭医生病种收入详情弹窗
        closeDoctorDiseaseModal: function() {
            const modal = document.getElementById('doctor-disease-modal');
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // 恢复背景滚动
        },
        
        // 获取医生病种收入数据（模拟数据）
        getDoctorDiseaseData: function(doctorName, departmentName) {
            // 根据科室和医生生成不同的病种数据
            const diseaseDataMap = {
                '心内科': {
                    '张主任': [
                        { name: '急性ST段抬高型心肌梗死', caseCount: 45, averageCost: 12500, totalIncome: 562500, percentage: 22.5, growth: 15.2 },
                        { name: '原发性高血压', caseCount: 68, averageCost: 3200, totalIncome: 217600, percentage: 8.7, growth: 8.9 },
                        { name: '心房颤动', caseCount: 32, averageCost: 8900, totalIncome: 284800, percentage: 11.4, growth: 12.3 },
                        { name: '急性冠脉综合征', caseCount: 18, averageCost: 28500, totalIncome: 513000, percentage: 20.5, growth: 18.7 },
                        { name: '慢性心力衰竭', caseCount: 25, averageCost: 15600, totalIncome: 390000, percentage: 15.6, growth: 6.8 }
                    ],
                    '李副主任': [
                        { name: '不稳定性心绞痛', caseCount: 38, averageCost: 11800, totalIncome: 448400, percentage: 21.9, growth: 12.5 },
                        { name: '高血压性心脏病', caseCount: 55, averageCost: 3100, totalIncome: 170500, percentage: 8.3, growth: 7.2 },
                        { name: '室性心律失常', caseCount: 28, averageCost: 8500, totalIncome: 238000, percentage: 11.6, growth: 9.8 },
                        { name: '急性心肌梗死', caseCount: 15, averageCost: 27200, totalIncome: 408000, percentage: 19.9, growth: 14.3 },
                        { name: '扩张性心肌病', caseCount: 22, averageCost: 14800, totalIncome: 325600, percentage: 15.9, growth: 5.1 }
                    ]
                },
                '消化内科': {
                    '赵主任': [
                        { name: '慢性萎缩性胃炎', caseCount: 52, averageCost: 2800, totalIncome: 145600, percentage: 6.3, growth: 8.5 },
                        { name: '消化性溃疡', caseCount: 35, averageCost: 8500, totalIncome: 297500, percentage: 12.9, growth: 11.2 },
                        { name: '肝硬化失代偿期', caseCount: 28, averageCost: 18500, totalIncome: 518000, percentage: 22.5, growth: 15.8 },
                        { name: '胆囊结石伴胆囊炎', caseCount: 42, averageCost: 12200, totalIncome: 512400, percentage: 22.3, growth: 9.7 },
                        { name: '炎症性肠病', caseCount: 38, averageCost: 3200, totalIncome: 121600, percentage: 5.3, growth: 6.9 }
                    ]
                },
                '妇产科': {
                    '王主任': [
                        { name: '自然分娩', caseCount: 48, averageCost: 3500, totalIncome: 168000, percentage: 35.6, growth: 8.2 },
                        { name: '剖宫产术', caseCount: 32, averageCost: 8500, totalIncome: 272000, percentage: 23.7, growth: 5.8 },
                        { name: '子宫肌瘤', caseCount: 25, averageCost: 12000, totalIncome: 300000, percentage: 18.5, growth: 12.3 },
                        { name: '卵巢囊肿', caseCount: 18, averageCost: 9800, totalIncome: 176400, percentage: 13.3, growth: 7.9 },
                        { name: '宫颈上皮内瘤变', caseCount: 12, averageCost: 5800, totalIncome: 69600, percentage: 8.9, growth: -2.1 }
                    ]
                },
                '儿科': {
                    '陈主任': [
                        { name: '小儿支气管肺炎', caseCount: 52, averageCost: 2800, totalIncome: 145600, percentage: 38.5, growth: 15.2 },
                        { name: '小儿急性胃肠炎', caseCount: 41, averageCost: 1200, totalIncome: 49200, percentage: 30.4, growth: 8.9 },
                        { name: '小儿上呼吸道感染', caseCount: 25, averageCost: 800, totalIncome: 20000, percentage: 18.5, growth: 22.1 },
                        { name: '支气管哮喘', caseCount: 12, averageCost: 3500, totalIncome: 42000, percentage: 8.9, growth: 5.7 },
                        { name: '特应性皮炎', caseCount: 8, averageCost: 1500, totalIncome: 12000, percentage: 3.7, growth: -3.2 }
                    ]
                },
                '外科': {
                    '刘主任': [
                        { name: '急性阑尾炎', caseCount: 35, averageCost: 4500, totalIncome: 157500, percentage: 32.4, growth: 6.8 },
                        { name: '急性胆囊炎', caseCount: 28, averageCost: 7200, totalIncome: 201600, percentage: 25.9, growth: 9.2 },
                        { name: '腹股沟疝', caseCount: 20, averageCost: 5800, totalIncome: 116000, percentage: 18.5, growth: 3.7 },
                        { name: '胃恶性肿瘤', caseCount: 12, averageCost: 28500, totalIncome: 342000, percentage: 11.1, growth: 12.5 },
                        { name: '甲状腺结节', caseCount: 13, averageCost: 8900, totalIncome: 115700, percentage: 12.0, growth: -1.8 }
                    ]
                },
                '骨科': {
                    '杨主任': [
                        { name: '股骨颈骨折', caseCount: 45, averageCost: 25500, totalIncome: 1147500, percentage: 35.1, growth: 18.2 },
                        { name: '膝关节骨性关节炎', caseCount: 38, averageCost: 8900, totalIncome: 338200, percentage: 10.3, growth: 12.5 },
                        { name: '腰椎间盘突出症', caseCount: 32, averageCost: 15600, totalIncome: 499200, percentage: 15.3, growth: 14.8 },
                        { name: '人工全膝关节置换术', caseCount: 15, averageCost: 45800, totalIncome: 687000, percentage: 21.0, growth: 22.1 },
                        { name: '特发性脊柱侧凸', caseCount: 12, averageCost: 38500, totalIncome: 462000, percentage: 14.1, growth: 16.7 }
                    ]
                }
            };
            
            // 如果没有找到对应的数据，返回默认数据
            const departmentData = diseaseDataMap[departmentName];
            if (departmentData && departmentData[doctorName]) {
                return departmentData[doctorName];
            }
            
            // 默认数据
            return [
                { name: '2型糖尿病', caseCount: 30, averageCost: 5000, totalIncome: 150000, percentage: 25.0, growth: 10.0 },
                { name: '原发性高血压', caseCount: 25, averageCost: 8000, totalIncome: 200000, percentage: 33.3, growth: 8.5 },
                { name: '慢性阻塞性肺疾病', caseCount: 15, averageCost: 15000, totalIncome: 225000, percentage: 37.5, growth: 15.2 },
                { name: '急性上呼吸道感染', caseCount: 10, averageCost: 2500, totalIncome: 25000, percentage: 4.2, growth: 5.8 }
            ];
        },
        
        // 导出医生病种收入数据
        exportDoctorDiseaseData: function() {
            const exportBtn = document.getElementById('export-disease-income-btn');
            const originalText = exportBtn.textContent;
            exportBtn.textContent = '导出中...';
            exportBtn.disabled = true;
            
            // 模拟导出过程
            setTimeout(function() {
                Common.showToast('医生病种收入数据导出成功！', 'success');
                exportBtn.textContent = originalText;
                exportBtn.disabled = false;
            }, 1000);
        },
        
        // 转换JSON数据为图表所需格式
        transformDataForCharts: function(rawData) {
            console.log('开始转换数据，使用overview数据:', rawData.overview);
            
            // 直接使用overview中的数据
            const totalRevenue = rawData.overview.totalRevenue;
            const medicalRevenue = rawData.overview.medicalRevenue;
            const drugRevenue = rawData.overview.drugRevenue;
            const otherRevenue = totalRevenue - medicalRevenue - drugRevenue;
            
            const revenueTypeData = [
                {name: '医疗收入', value: medicalRevenue, percentage: (medicalRevenue/totalRevenue*100).toFixed(1)},
                {name: '药品收入', value: drugRevenue, percentage: (drugRevenue/totalRevenue*100).toFixed(1)},
                {name: '其他收入', value: otherRevenue, percentage: (otherRevenue/totalRevenue*100).toFixed(1)}
            ];
            
            // 使用departmentRevenue中的数据
            const revenueSourceData = rawData.departmentRevenue.departments.map((dept, index) => ({
                name: dept,
                value: rawData.departmentRevenue.revenue[index],
                percentage: (rawData.departmentRevenue.revenue[index]/totalRevenue*100).toFixed(1)
            }));
            
            // 直接使用revenueTrend中的月度数据
            const monthlyRevenueData = rawData.revenueTrend.months.map((month, index) => ({
                month: month,
                value: rawData.revenueTrend.totalRevenue[index]
            }));
            
            // 从yearlyComparison生成季度预测数据
            const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
            const actualQuarterly = rawData.yearlyComparison.revenue.slice(-1)[0] ? 
                [rawData.yearlyComparison.revenue.slice(-1)[0]/4*0.9, rawData.yearlyComparison.revenue.slice(-1)[0]/4*1.1, rawData.yearlyComparison.revenue.slice(-1)[0]/4*1.0, rawData.yearlyComparison.revenue.slice(-1)[0]/4*1.05] :
                [680, 720, 750, 780];
            const forecastQuarterly = rawData.yearlyComparison.revenue.slice(-1)[0] ? 
                [rawData.yearlyComparison.revenue.slice(-1)[0]/4*0.95, rawData.yearlyComparison.revenue.slice(-1)[0]/4*1.15, rawData.yearlyComparison.revenue.slice(-1)[0]/4*1.05, rawData.yearlyComparison.revenue.slice(-1)[0]/4*1.1] :
                [700, 740, 770, 800];
            
            const quarterlyForecastData = quarters.map((quarter, index) => ({
                quarter: quarter,
                actual: parseFloat(actualQuarterly[index].toFixed(1)),
                forecast: parseFloat(forecastQuarterly[index].toFixed(1))
            }));
            
            // 直接使用costStructure中的数据
            const costStructureData = rawData.costStructure.data.map(item => ({
                name: item.name,
                value: item.value,
                percentage: (item.value / rawData.overview.operatingCost * 100).toFixed(1)
            }));
            
            // 使用revenueTrend中的真实月度数据生成收支结余数据
            const profitAnalysisData = rawData.revenueTrend.months.map((month, index) => {
                const revenue = rawData.revenueTrend.totalRevenue[index];
                const costRatio = rawData.overview.operatingCost / rawData.overview.totalRevenue;
                const cost = revenue * costRatio;
                const profit = revenue - cost;
                return {
                    month: month,
                    revenue: revenue,
                    cost: parseFloat(cost.toFixed(1)),
                    profit: parseFloat(profit.toFixed(1))
                };
            });
            
            return {
                revenueTypeData: revenueTypeData,
                revenueSourceData: revenueSourceData,
                monthlyRevenueData: monthlyRevenueData,
                quarterlyForecastData: quarterlyForecastData,
                costStructureData: costStructureData,
                profitAnalysisData: profitAnalysisData,
                comparisonTableData: rawData.departmentAnalysis.map(dept => ({
                    department: dept.name,
                    current: (dept.revenue / 10000).toFixed(1),
                    previous: (dept.revenue * 0.9 / 10000).toFixed(1),
                    growth: parseFloat(dept.profitMargin),
                    target: (dept.revenue * 1.1 / 10000).toFixed(1),
                    completion: ((dept.revenue / (dept.revenue * 1.1)) * 100).toFixed(1) + '%'
                })),
                departmentDetails: rawData.departmentAnalysis,
                achievementRateData: rawData.keyIndicators.map(indicator => ({
                    name: indicator.name,
                    actual: (parseFloat(indicator.value) / 10000).toFixed(1) + '万',
                    target: (parseFloat(indicator.value) * 1.1 / 10000).toFixed(1) + '万',
                    rate: parseFloat((parseFloat(indicator.value) / (parseFloat(indicator.value) * 1.1) * 100).toFixed(1))
                }))
            };
        },
        
        // 获取模拟数据
        getMockData: function(timeRange, departmentType) {
            // 所有科室的完整数据
            var allDepartments = [
                { name: '心内科', type: '内科', totalRevenue: 1280, medicalRevenue: 850, drugRevenue: 430, growth: 12.5 },
                { name: '消化内科', type: '内科', totalRevenue: 1150, medicalRevenue: 720, drugRevenue: 430, growth: 8.2 },
                { name: '呼吸内科', type: '内科', totalRevenue: 1080, medicalRevenue: 680, drugRevenue: 400, growth: 5.7 },
                { name: '神经内科', type: '内科', totalRevenue: 950, medicalRevenue: 620, drugRevenue: 330, growth: 9.8 },
                { name: '内分泌科', type: '内科', totalRevenue: 850, medicalRevenue: 530, drugRevenue: 320, growth: 7.3 },
                { name: '普外科', type: '外科', totalRevenue: 1420, medicalRevenue: 1050, drugRevenue: 370, growth: 15.2 },
                { name: '骨科', type: '外科', totalRevenue: 1350, medicalRevenue: 980, drugRevenue: 370, growth: 11.8 },
                { name: '神经外科', type: '外科', totalRevenue: 1220, medicalRevenue: 890, drugRevenue: 330, growth: 10.5 },
                { name: '胸外科', type: '外科', totalRevenue: 1050, medicalRevenue: 780, drugRevenue: 270, growth: 8.9 },
                { name: '泌尿外科', type: '外科', totalRevenue: 980, medicalRevenue: 720, drugRevenue: 260, growth: 6.4 },
                { name: '妇产科', type: '专科', totalRevenue: 1580, medicalRevenue: 1120, drugRevenue: 460, growth: 14.3 },
                { name: '儿科', type: '专科', totalRevenue: 1450, medicalRevenue: 980, drugRevenue: 470, growth: 12.1 },
                { name: '眼科', type: '专科', totalRevenue: 1120, medicalRevenue: 850, drugRevenue: 270, growth: 9.6 },
                { name: '耳鼻喉科', type: '专科', totalRevenue: 980, medicalRevenue: 720, drugRevenue: 260, growth: 7.8 },
            { name: '口腔科', type: '专科', totalRevenue: 850, medicalRevenue: 680, drugRevenue: 170, growth: 8.5 },
            { name: '医学影像科', type: '医技', totalRevenue: 1320, medicalRevenue: 1320, drugRevenue: 0, growth: 11.2 },
            { name: '检验科', type: '医技', totalRevenue: 1250, medicalRevenue: 1250, drugRevenue: 0, growth: 9.8 },
            { name: '病理科', type: '医技', totalRevenue: 950, medicalRevenue: 950, drugRevenue: 0, growth: 7.4 }
        ];
        
        // 根据时间范围和科室类型生成模拟数据
        
        // 收入类型占比数据
        var revenueTypeData = [
            {name: '医疗收入', value: 180, percentage: 56.2},
            {name: '药品收入', value: 120, percentage: 37.5},
            {name: '其他收入', value: 20, percentage: 6.3}
        ];
        
        // 收入来源分析数据（根据科室类型筛选）
        var revenueSourceData = [];
        
        // 映射科室类型到内部表示
        var typeMap = {
            'all': '全部科室',
            '内科': '内科',
            '外科': '外科',
            '专科': '专科',
            'medical': '医技'
        };
        
        var displayType = typeMap[departmentType] || departmentType;
        
        if (departmentType === 'all') {
            revenueSourceData = allDepartments.map(dept => ({name: dept.name, value: dept.totalRevenue}));
        } else if (departmentType === '内科') {
            revenueSourceData = allDepartments.filter(dept => dept.type === '内科').map(dept => ({name: dept.name, value: dept.totalRevenue}));
        } else if (departmentType === '外科') {
            revenueSourceData = allDepartments.filter(dept => dept.type === '外科').map(dept => ({name: dept.name, value: dept.totalRevenue}));
        } else if (departmentType === '专科') {
            revenueSourceData = allDepartments.filter(dept => dept.type === '专科').map(dept => ({name: dept.name, value: dept.totalRevenue}));
        } else if (departmentType === 'medical') {
            revenueSourceData = allDepartments.filter(dept => dept.type === '医技').map(dept => ({name: dept.name, value: dept.totalRevenue}));
        }
            
            // 月度收入趋势数据
            var monthlyRevenueData = [];
            var months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
            for (var i = 0; i < months.length; i++) {
                // 根据时间范围调整数据
                var baseValue = 250 + Math.random() * 50;
                if (timeRange === 'currentYear' || timeRange === 'lastYear') {
                    baseValue = baseValue * 10; // 年度数据放大10倍
                }
                monthlyRevenueData.push({month: months[i], value: Math.round(baseValue)});
            }
            
            // 季度收入预测数据
            var quarterlyForecastData = [
                {quarter: 'Q1', actual: 980, forecast: 980},
                {quarter: 'Q2', actual: 1020, forecast: 1020},
                {quarter: 'Q3', actual: 1080, forecast: 1080},
                {quarter: 'Q4', actual: 0, forecast: 1150}
            ];
            
            // 成本结构分析数据
            var costStructureData = [
                {name: '人力成本', value: 110, percentage: 47.8},
                {name: '药品成本', value: 70, percentage: 30.4},
                {name: '设备成本', value: 30, percentage: 13.0},
                {name: '其他成本', value: 20, percentage: 8.7}
            ];
            
            // 收支结余分析数据
            var profitAnalysisData = [];
            for (var i = 0; i < 12; i++) {
                var revenue = 300 + Math.random() * 50;
                var cost = 220 + Math.random() * 40;
                profitAnalysisData.push({
                    month: months[i],
                    revenue: Math.round(revenue),
                    cost: Math.round(cost),
                    profit: Math.round(revenue - cost)
                });
            }
            
            // 指标达成率数据
            var achievementRateData = [
                {name: '总收入', actual: '2.85亿', target: '3.0亿', rate: 95.0},
                {name: '净利润', actual: '1580万', target: '2000万', rate: 79.0},
                {name: '利润率', actual: '5.5%', target: '6.7%', rate: 82.1},
                {name: '床位利用率', actual: '88.5%', target: '85.0%', rate: 104.1},
                {name: '平均住院日', actual: '6.8天', target: '7.2天', rate: 105.9},
                {name: '次均费用', actual: '8650元', target: '8200元', rate: 105.5}
            ];
            
            // 对比表格数据
            var comparisonTableData = [
                {department: '心内科', current: 8850, previous: 7750, growth: 14.2, bedUsage: 94.5, avgStay: 6.8, avgCost: 19200},
                {department: '消化内科', current: 8040, previous: 7280, growth: 10.4, bedUsage: 91.2, avgStay: 7.5, avgCost: 17800},
                {department: '呼吸内科', current: 6800, previous: 6130, growth: 10.9, bedUsage: 88.7, avgStay: 8.2, avgCost: 16500},
                {department: '骨科', current: 10300, previous: 8870, growth: 16.1, bedUsage: 96.8, avgStay: 6.2, avgCost: 22400},
                {department: '神经外科', current: 9480, previous: 8860, growth: 7.0, bedUsage: 93.4, avgStay: 7.8, avgCost: 24800},
                {department: '普外科', current: 8380, previous: 7560, growth: 10.8, bedUsage: 92.1, avgStay: 6.5, avgCost: 18900}
            ];
            
            // 筛选科室明细数据
            var departmentDetails = allDepartments.filter(dept => 
                departmentType === 'all' || 
                (departmentType === '内科' && dept.type === '内科') ||
                (departmentType === '外科' && dept.type === '外科') ||
                (departmentType === '专科' && dept.type === '专科') ||
                (departmentType === 'medical' && dept.type === '医技')
            );
            
            return {
                revenueTypeData: revenueTypeData,
                revenueSourceData: revenueSourceData,
                monthlyRevenueData: monthlyRevenueData,
                quarterlyForecastData: quarterlyForecastData,
                costStructureData: costStructureData,
                profitAnalysisData: profitAnalysisData,
                achievementRateData: achievementRateData,
                comparisonTableData: comparisonTableData,
                departmentDetails: departmentDetails
            };
        },
        
        // 初始化图表
        initCharts: function(data) {
            // 收入类型占比图表
            this.initRevenueTypeChart(data.revenueTypeData);
            
            // 收入来源分析图表
            this.initRevenueSourceChart(data.revenueSourceData);
            
            // 月度收入趋势图表
            this.initMonthlyRevenueChart(data.monthlyRevenueData);
            
            // 季度收入预测图表
            this.initQuarterlyForecastChart(data.quarterlyForecastData);
            
            // 成本结构分析图表
            this.initCostStructureChart(data.costStructureData);
            
            // 收支结余分析图表
            this.initProfitAnalysisChart(data.profitAnalysisData);
            
            // 渲染对比表格
            this.renderComparisonTable(data.comparisonTableData);
            
            // 渲染指标达成率
            this.renderAchievementRate(data.achievementRateData);
        },
        
        // 初始化收入类型占比图表
        initRevenueTypeChart: function(revenueTypeData) {
            const chartDom = document.getElementById('revenueTypeChart');
            if (!chartDom) return;
            
            const myChart = echarts.init(chartDom);
            
            const timeRange = document.getElementById('time-range');
            const timeRangeValue = timeRange ? timeRange.value : 'currentYear';
            
            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: ¥{c}百万 ({d}%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    borderColor: '#1890ff',
                    borderWidth: 1,
                    textStyle: {
                        color: '#fff'
                    }
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: revenueTypeData.map(item => item.name),
                    textStyle: {
                        color: '#333'
                    }
                },
                series: [
                    {
                        name: '收入类型',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '18',
                                fontWeight: 'bold'
                            },
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: revenueTypeData.map((item, index) => ({
                            value: item.value,
                            name: item.name,
                            itemStyle: {
                                color: ['#0066cc', '#52c41a', '#fa8c16'][index % 3]
                            }
                        }))
                    }
                ],
                animationDuration: 1000,
                animationEasing: 'cubicOut',
                animationDelay: function(idx) {
                    return idx * 200;
                }
            };
            
            myChart.setOption(option);
            
            // 图表点击事件 - 用于下钻
            myChart.on('click', function(params) {
                EconomicOperationPage.drillDown('收入类型', timeRangeValue);
            });
            
            // 响应式调整
            window.addEventListener('resize', function() {
                myChart.resize();
            });
        },
        
        // 初始化收入来源分析图表
        initRevenueSourceChart: function(revenueSourceData) {
            const chartDom = document.getElementById('revenueSourceChart');
            if (!chartDom) return;
            
            const myChart = echarts.init(chartDom);
            
            const timeRange = document.getElementById('time-range');
            const timeRangeValue = timeRange ? timeRange.value : 'currentYear';
            
            var option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                        shadowStyle: {
                            color: 'rgba(0, 102, 204, 0.1)'
                        }
                    },
                    formatter: function(params) {
                        return params[0].name + ': ¥' + params[0].value + '万';
                    },
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    borderColor: '#1890ff',
                    borderWidth: 1,
                    textStyle: {
                        color: '#fff'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '15%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: revenueSourceData.map(item => item.name),
                    axisLabel: {
                        interval: 0,
                        rotate: 45,
                        color: '#333'
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#ddd'
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}万',
                        color: '#333'
                    },
                    axisLine: {
                        show: false
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#f0f0f0'
                        }
                    }
                },
                series: [
                    {
                        name: '收入',
                        type: 'bar',
                        data: revenueSourceData.map(item => item.value),
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {offset: 0, color: '#0066cc'},
                                {offset: 1, color: '#40a9ff'}
                            ])
                        },
                        emphasis: {
                            itemStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    {offset: 0, color: '#40a9ff'},
                                    {offset: 1, color: '#096dd9'}
                                ])
                            }
                        },
                        barWidth: '60%',
                        animationDelay: function (idx) {
                            return idx * 100;
                        }
                    }
                ],
                animationEasing: 'elasticOut',
                animationDelayUpdate: function (idx) {
                    return idx * 5;
                }
            };
            
            myChart.setOption(option);
            
            // 图表点击事件 - 用于下钻
            myChart.on('click', function(params) {
                EconomicOperationPage.drillDown('科室收入', timeRangeValue);
            });
            
            // 响应式调整
            window.addEventListener('resize', function() {
                myChart.resize();
            });
        },
        
        // 初始化月度收入趋势图表
        initMonthlyRevenueChart: function(monthlyRevenueData) {
            const chartDom = document.getElementById('monthlyRevenueChart');
            if (!chartDom) return;
            
            const myChart = echarts.init(chartDom);
            
            var option = {
                tooltip: {
                    trigger: 'axis',
                    formatter: function(params) {
                        return params[0].name + ': ¥' + params[0].value + '万';
                    },
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    borderColor: '#1890ff',
                    borderWidth: 1,
                    textStyle: {
                        color: '#fff'
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
                    data: monthlyRevenueData.map(item => item.month),
                    axisLabel: {
                        color: '#333'
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#ddd'
                        }
                    },
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}万',
                        color: '#333'
                    },
                    axisLine: {
                        show: false
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#f0f0f0'
                        }
                    }
                },
                series: [
                    {
                        name: '月度收入',
                        type: 'line',
                        stack: 'Total',
                        data: monthlyRevenueData.map(item => item.value),
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {offset: 0, color: 'rgba(0, 102, 204, 0.3)'},
                                {offset: 1, color: 'rgba(0, 102, 204, 0.1)'}
                            ])
                        },
                        itemStyle: {
                            color: '#0066cc',
                            borderWidth: 2,
                            borderColor: '#fff',
                            shadowBlur: 4,
                            shadowColor: 'rgba(0, 0, 0, 0.1)'
                        },
                        lineStyle: {
                            color: '#0066cc',
                            width: 3,
                            shadowBlur: 10,
                            shadowColor: 'rgba(0, 102, 204, 0.3)'
                        },
                        markLine: {
                            silent: true,
                            data: [
                                {
                                    type: 'average',
                                    name: '平均值',
                                    lineStyle: {
                                        color: '#fa8c16',
                                        width: 2,
                                        type: 'dashed'
                                    },
                                    label: {
                                        formatter: '平均值: {c}万',
                                        color: '#fa8c16'
                                    }
                                }
                            ]
                        },
                        markPoint: {
                            data: [
                                {type: 'max', name: '最大值'},
                                {type: 'min', name: '最小值'}
                            ],
                            symbolSize: 60,
                            itemStyle: {
                                color: '#fff',
                                borderColor: '#0066cc',
                                borderWidth: 2
                            },
                            label: {
                                color: '#0066cc',
                                fontWeight: 'bold'
                            }
                        },
                        smooth: true,
                        animationDuration: 1500,
                        animationEasing: 'cubicOut'
                    }
                ]
            };
            
            myChart.setOption(option);
            
            // 图表点击事件 - 用于下钻
            myChart.on('click', function(params) {
                const timeRange = document.getElementById('time-range');
                const timeRangeValue = timeRange ? timeRange.value : 'currentYear';
                EconomicOperationPage.drillDown('月度收入', timeRangeValue);
            });
            
            // 响应式调整
            window.addEventListener('resize', function() {
                myChart.resize();
            });
        },
        
        // 初始化季度预测图表
        initQuarterlyForecastChart: function(quarterlyForecastData) {
            const chartDom = document.getElementById('quarterlyForecastChart');
            if (!chartDom) return;
            
            const myChart = echarts.init(chartDom);
            
            var option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                        shadowStyle: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    formatter: function(params) {
                        var result = params[0].axisValue + '<br/>';
                        params.forEach(function(param) {
                            result += param.marker + param.seriesName + ': ¥' + param.value + '万<br/>';
                        });
                        return result;
                    },
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    borderColor: '#1890ff',
                    borderWidth: 1,
                    textStyle: {
                        color: '#fff'
                    }
                },
                legend: {
                    data: ['实际值', '预测值'],
                    textStyle: {
                        color: '#333'
                    },
                    top: 10
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
                    data: quarterlyForecastData.map(item => item.quarter),
                    axisLabel: {
                        color: '#333'
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#ddd'
                        }
                    },
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}万',
                        color: '#333'
                    },
                    axisLine: {
                        show: false
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#f0f0f0'
                        }
                    }
                },
                series: [
                    {
                        name: '实际值',
                        type: 'bar',
                        data: quarterlyForecastData.map(item => item.actual),
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {offset: 0, color: '#0066cc'},
                                {offset: 1, color: '#40a9ff'}
                            ])
                        },
                        emphasis: {
                            itemStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    {offset: 0, color: '#40a9ff'},
                                    {offset: 1, color: '#096dd9'}
                                ])
                            }
                        },
                        barWidth: '30%',
                        animationDelay: function (idx) {
                            return idx * 100;
                        }
                    },
                    {
                        name: '预测值',
                        type: 'bar',
                        data: quarterlyForecastData.map(item => item.forecast),
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {offset: 0, color: '#fa8c16'},
                                {offset: 1, color: '#ffc53d'}
                            ])
                        },
                        emphasis: {
                            itemStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    {offset: 0, color: '#ffc53d'},
                                    {offset: 1, color: '#fa8c16'}
                                ])
                            }
                        },
                        barWidth: '30%',
                        animationDelay: function (idx) {
                            return idx * 100 + 100;
                        }
                    }
                ],
                animationEasing: 'elasticOut',
                animationDelayUpdate: function (idx) {
                    return idx * 5;
                }
            };
            
            myChart.setOption(option);
            
            // 图表点击事件 - 用于下钻
            myChart.on('click', function(params) {
                const timeRange = document.getElementById('time-range');
                const timeRangeValue = timeRange ? timeRange.value : 'currentYear';
                EconomicOperationPage.drillDown('季度预测', timeRangeValue);
            });
            
            // 响应式调整
            window.addEventListener('resize', function() {
                myChart.resize();
            });
        },
        
        // 初始化成本结构分析图表
        initCostStructureChart: function(costStructureData) {
            const chartDom = document.getElementById('costStructureChart');
            if (!chartDom) return;
            
            const myChart = echarts.init(chartDom);
            
            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: ¥{c}百万 ({d}%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    borderColor: '#f5222d',
                    borderWidth: 1,
                    textStyle: {
                        color: '#fff'
                    }
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: costStructureData.map(item => item.name),
                    textStyle: {
                        color: '#333'
                    }
                },
                series: [
                    {
                        name: '成本结构',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '18',
                                fontWeight: 'bold'
                            },
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: costStructureData.map((item, index) => ({
                            value: item.value,
                            name: item.name,
                            itemStyle: {
                                color: ['#f5222d', '#fa8c16', '#faad14', '#fadb14'][index % 4]
                            }
                        })),
                        animationType: 'scale',
                        animationEasing: 'elasticOut',
                        animationDelay: function(idx) {
                            return Math.random() * 200;
                        }
                    }
                ],
                animationDuration: 1000,
                animationEasing: 'cubicOut'
            };
            
            myChart.setOption(option);
            
            // 图表点击事件 - 用于下钻
            myChart.on('click', function(params) {
                const timeRange = document.getElementById('time-range');
                const timeRangeValue = timeRange ? timeRange.value : 'currentYear';
                EconomicOperationPage.drillDown('成本结构', timeRangeValue);
            });
            
            // 响应式调整
            window.addEventListener('resize', function() {
                myChart.resize();
            });
        },
        
        // 初始化利润分析图表
        initProfitAnalysisChart: function(profitAnalysisData) {
            const chartDom = document.getElementById('profitAnalysisChart');
            if (!chartDom) return;
            
            const myChart = echarts.init(chartDom);
            
            var option = {
                tooltip: {
                    trigger: 'axis',
                    formatter: function(params) {
                        var result = params[0].axisValue + '<br/>';
                        params.forEach(function(param) {
                            result += param.marker + param.seriesName + ': ¥' + param.value + '万<br/>';
                        });
                        return result;
                    },
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    borderColor: '#1890ff',
                    borderWidth: 1,
                    textStyle: {
                        color: '#fff'
                    }
                },
                legend: {
                    data: ['收入', '成本', '结余'],
                    textStyle: {
                        color: '#333'
                    },
                    top: 10
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
                    boundaryGap: false,
                    data: profitAnalysisData.map(item => item.month),
                    axisLabel: {
                        color: '#333'
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#ddd'
                        }
                    },
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}万',
                        color: '#333'
                    },
                    axisLine: {
                        show: false
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#f0f0f0'
                        }
                    }
                },
                series: [
                    {
                        name: '收入',
                        type: 'line',
                        data: profitAnalysisData.map(item => item.revenue),
                        itemStyle: {
                            color: '#0066cc',
                            borderWidth: 2,
                            borderColor: '#fff',
                            shadowBlur: 4,
                            shadowColor: 'rgba(0, 0, 0, 0.1)'
                        },
                        lineStyle: {
                            color: '#0066cc',
                            width: 3
                        },
                        smooth: true,
                        animationDelay: function (idx) {
                            return idx * 100;
                        }
                    },
                    {
                        name: '成本',
                        type: 'line',
                        data: profitAnalysisData.map(item => item.cost),
                        itemStyle: {
                            color: '#f5222d',
                            borderWidth: 2,
                            borderColor: '#fff',
                            shadowBlur: 4,
                            shadowColor: 'rgba(0, 0, 0, 0.1)'
                        },
                        lineStyle: {
                            color: '#f5222d',
                            width: 3
                        },
                        smooth: true,
                        animationDelay: function (idx) {
                            return idx * 100 + 50;
                        }
                    },
                    {
                        name: '结余',
                        type: 'line',
                        data: profitAnalysisData.map(item => item.profit),
                        itemStyle: {
                            color: '#52c41a',
                            borderWidth: 2,
                            borderColor: '#fff',
                            shadowBlur: 4,
                            shadowColor: 'rgba(0, 0, 0, 0.1)'
                        },
                        lineStyle: {
                            color: '#52c41a',
                            width: 3,
                            shadowBlur: 10,
                            shadowColor: 'rgba(82, 196, 26, 0.3)'
                        },
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {offset: 0, color: 'rgba(82, 196, 26, 0.3)'},
                                {offset: 1, color: 'rgba(82, 196, 26, 0.1)'}
                            ])
                        },
                        smooth: true,
                        animationDelay: function (idx) {
                            return idx * 100 + 100;
                        }
                    }
                ],
                animationEasing: 'cubicOut',
                animationDuration: 1500
            };
            
            myChart.setOption(option);
            
            // 图表点击事件 - 用于下钻
            myChart.on('click', function(params) {
                const timeRange = document.getElementById('time-range');
                const timeRangeValue = timeRange ? timeRange.value : 'currentYear';
                EconomicOperationPage.drillDown('收支结余', timeRangeValue);
            });
            
            // 响应式调整
            window.addEventListener('resize', function() {
                myChart.resize();
            });
        },
        
        // 渲染对比表格
        renderComparisonTable: function(comparisonData) {
            const tableContainer = document.getElementById('comparison-table-container');
            if (!tableContainer) return;
            
            const timeRange = document.getElementById('time-range');
            const timeRangeValue = timeRange ? timeRange.value : 'currentYear';
            
            // 检查comparisonData是否存在且是数组
            if (!comparisonData || !Array.isArray(comparisonData)) {
                tableContainer.innerHTML = '<p>暂无对比数据</p>';
                return;
            }
            
            var tableHtml = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>科室</th>
                            <th>本期收入(万元)</th>
                            <th>上期收入(万元)</th>
                            <th>同比增长(%)</th>
                            <th>床位使用率(%)</th>
                            <th>平均住院日(天)</th>
                            <th>均次费用(元)</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            comparisonData.forEach(function(item) {
                var growthClass = item.growth >= 0 ? 'positive-growth' : 'negative-growth';
                var growthIcon = item.growth >= 0 ? '↑' : '↓';
                
                // 床位使用率颜色判断（添加安全检查）
                var bedUsage = item.bedUsage || 0;
                var bedUsageClass = bedUsage >= 95 ? 'high-usage' : (bedUsage >= 85 ? 'normal-usage' : 'low-usage');
                
                // 平均住院日颜色判断（越短越好，添加安全检查）
                var avgStay = item.avgStay || 0;
                var avgStayClass = avgStay <= 7 ? 'good-stay' : (avgStay <= 8 ? 'normal-stay' : 'long-stay');
                
                // 添加安全检查，确保数值存在
                var growth = item.growth || 0;
                var avgCost = item.avgCost || 0;
                
                tableHtml += `
                    <tr class="drillable" data-metric="科室对比" data-period="${timeRangeValue}">
                        <td>${item.department}</td>
                        <td>${item.current}</td>
                        <td>${item.previous}</td>
                        <td class="${growthClass}">${growthIcon} ${Math.abs(growth).toFixed(1)}%</td>
                        <td class="${bedUsageClass}">${bedUsage.toFixed(1)}%</td>
                        <td class="${avgStayClass}">${avgStay.toFixed(1)}天</td>
                        <td>¥${avgCost.toLocaleString()}</td>
                    </tr>
                `;
            });
            
            tableHtml += `
                    </tbody>
                </table>
            `;
            
            tableContainer.innerHTML = tableHtml;
            
            // 为表格添加样式和交互效果
            this.enhanceTableInteraction();
        },
        
        // 增强表格交互效果
        enhanceTableInteraction: function() {
            var tables = document.querySelectorAll('.data-table');
            tables.forEach(function(table) {
                var rows = table.querySelectorAll('tbody tr');
                rows.forEach(function(row) {
                    row.addEventListener('mouseenter', function() {
                        this.style.backgroundColor = '#f5f5f5';
                        this.style.cursor = 'pointer';
                    });
                    
                    row.addEventListener('mouseleave', function() {
                        this.style.backgroundColor = '';
                        this.style.cursor = 'default';
                    });
                });
            });
        },
        
        // 渲染科室明细表格
        renderDepartmentDetailsTable: function(departmentDetails) {
            const tableContainer = document.getElementById('department-details-table-container');
            if (!tableContainer) return;
            
            const timeRange = document.getElementById('time-range');
            const timeRangeValue = timeRange ? timeRange.value : 'currentYear';
            
            // 检查departmentDetails是否存在且是数组
            if (!departmentDetails || !Array.isArray(departmentDetails)) {
                tableContainer.innerHTML = '<p>暂无科室明细数据</p>';
                return;
            }
            
            var tableHtml = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>科室名称</th>
                            <th>科室类型</th>
                            <th>总收入(万元)</th>
                            <th>医疗收入(万元)</th>
                            <th>药品收入(万元)</th>
                            <th>同比增长(%)</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            departmentDetails.forEach(function(item) {
                var growthClass = item.growth >= 0 ? 'positive-growth' : 'negative-growth';
                var growthIcon = item.growth >= 0 ? '↑' : '↓';
                
                tableHtml += `
                    <tr class="drillable" data-metric="科室明细" data-department="${item.name}" data-period="${timeRangeValue}">
                        <td>${item.name}</td>
                        <td>${item.type}</td>
                        <td>${item.totalRevenue}</td>
                        <td>${item.medicalRevenue}</td>
                        <td>${item.drugRevenue}</td>
                        <td class="${growthClass}">${growthIcon} ${Math.abs(item.growth).toFixed(1)}</td>
                    </tr>
                `;
            });
            
            tableHtml += `
                    </tbody>
                </table>
            `;
            
            tableContainer.innerHTML = tableHtml;
            
            // 为表格添加样式和交互效果
            this.enhanceTableInteraction();
        },
        
        // 渲染指标达成率
        renderAchievementRate: function(achievementData) {
            const achievementContainer = document.getElementById('achievement-rate-container');
            if (!achievementContainer) return;
            
            const timeRange = document.getElementById('time-range');
            const timeRangeValue = timeRange ? timeRange.value : 'currentYear';
            
            // 检查achievementData是否存在且是数组
            if (!achievementData || !Array.isArray(achievementData)) {
                achievementContainer.innerHTML = '<div class="no-data-message">暂无指标达成率数据</div>';
                return;
            }
            
            var html = '';
            achievementData.forEach(function(item, index) {
                var rateClass = item.rate >= 100 ? 'achievement-met' : 'achievement-not-met';
                var iconClass = item.rate >= 100 ? 'icon-success' : 'icon-warning';
                
                // 格式化显示值
                var actualDisplay = item.actual;
                var targetDisplay = item.target;
                
                // 现在所有数据都是字符串格式，直接使用
                if (item.name === '总收入' || item.name === '净利润') {
                    // 收入和利润已经包含单位，直接显示
                    actualDisplay = item.actual;
                    targetDisplay = item.target;
                } else if (item.name === '利润率' || item.name === '床位利用率') {
                    // 百分比数据已经包含%符号
                    actualDisplay = item.actual;
                    targetDisplay = item.target;
                } else if (item.name === '平均住院日') {
                    // 天数数据已经包含单位
                    actualDisplay = item.actual;
                    targetDisplay = item.target;
                } else if (item.name === '次均费用') {
                    // 费用数据已经包含单位
                    actualDisplay = item.actual;
                    targetDisplay = item.target;
                }
                
                // 计算进度条颜色渐变
                var progressColor = '#ff7875'; // 默认红色
                var progressGradient = '';
                if (item.rate >= 100) {
                    progressGradient = 'linear-gradient(90deg, #52c41a 0%, #73d13d 100%)'; // 绿色渐变
                } else if (item.rate >= 80) {
                    progressGradient = 'linear-gradient(90deg, #faad14 0%, #ffc53d 100%)'; // 黄色渐变
                } else if (item.rate >= 60) {
                    progressGradient = 'linear-gradient(90deg, #fa8c16 0%, #ffa940 100%)'; // 橙色渐变
                } else {
                    progressGradient = 'linear-gradient(90deg, #ff7875 0%, #ff9c6e 100%)'; // 红色渐变
                }
                
                // 确定卡片状态
                var cardStatus = 'stable';
                if (item.rate >= 100) {
                    cardStatus = 'up';
                } else if (item.rate < 85) {
                    cardStatus = 'down';
                }
                
                html += `
                    <div class="achievement-item drillable" data-metric="${item.name}达成率" data-period="${timeRangeValue}" data-status="${cardStatus}" style="animation-delay: ${index * 0.1}s">
                        <div class="achievement-name">${item.name}</div>
                        <div class="achievement-values">
                            <span class="actual-value">${actualDisplay}</span>
                            <span class="target-value">目标: ${targetDisplay}</span>
                        </div>
                        <div class="achievement-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${Math.min(item.rate, 100)}%; background: ${progressGradient};"></div>
                            </div>
                        </div>
                        <div class="achievement-rate ${rateClass}">
                            <span class="${iconClass}">${item.rate.toFixed(1)}%</span>
                        </div>
                    </div>
                `;
            });
            
            achievementContainer.innerHTML = html;
            
            // 添加进入动画
            setTimeout(() => {
                const items = achievementContainer.querySelectorAll('.achievement-item');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }, 50);
        }
    };
    
    // 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('EconomicOperation: DOMContentLoaded event fired');
    
    // 等待导航加载完成后再初始化页面
    if (window.navigationLoader && window.navigationLoader.initialized) {
        console.log('EconomicOperation: Navigation already initialized, initializing page');
        EconomicOperationPage.init();
    } else {
        console.log('EconomicOperation: Waiting for navigation to load');
        document.addEventListener('navigationLoaded', function() {
            console.log('EconomicOperation: Navigation loaded event received, initializing page');
            EconomicOperationPage.init();
        });
        
        // 设置超时，以防导航加载事件没有触发
        setTimeout(() => {
            if (!EconomicOperationPage.initialized) {
                console.log('EconomicOperation: Navigation load timeout, initializing page anyway');
                EconomicOperationPage.init();
            }
        }, 3000);
    }
});

// 备用初始化方式，确保页面能够初始化
window.addEventListener('load', function() {
    console.log('EconomicOperation: Window load event fired');
    if (!EconomicOperationPage.initialized) {
        console.log('EconomicOperation: Initializing page from window load event');
        EconomicOperationPage.init();
    }
});
})();