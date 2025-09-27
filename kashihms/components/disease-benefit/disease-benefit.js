/**
 * 病种效益分析组件
 * 提供病种效益分析的完整功能，包括数据处理、图表渲染、表格管理、筛选功能等
 */
class DiseaseBenefitComponent {
    constructor(containerId, options = {}) {
        // 组件配置
        this.config = {
            containerId: containerId || 'disease-benefit-component',
            apiUrl: options.apiUrl || '/api/disease-benefit',
            autoInit: options.autoInit !== false,
            autoLoad: options.autoLoad !== false,
            enableExport: options.enableExport !== false,
            enableAIInsight: options.enableAIInsight !== false,
            debug: options.debug || false,
            ...options
        };
        
        // 组件状态
        this.state = {
            currentData: null,
            selectedDiseases: [],
            allDiseases: [],
            filteredData: null,
            isLoading: false,
            charts: {}
        };
        
        // 事件系统
        this.events = {};
        
        // 事件回调
        this.callbacks = {
            onDataLoad: options.onDataLoad || null,
            onDiseaseSelect: options.onDiseaseSelect || null,
            onExport: options.onExport || null,
            onError: options.onError || null
        };
        
        // 初始化组件
        if (this.config.autoInit) {
            setTimeout(() => {
                this.init();
            }, 100);
        }
    }
    
    /**
     * 初始化组件
     */
    init() {
        try {
            this.log('初始化病种效益组件');
            
            // 检查容器是否存在
            const container = document.getElementById(this.config.containerId);
            if (!container) {
                throw new Error(`找不到容器元素: ${this.config.containerId}`);
            }
            
            this.checkEChartsAvailability();
            this.createComponentHTML();
            this.initEventListeners();
            this.initDiseaseFilter();
            
            // 如果启用自动加载，则加载数据
            if (this.config.autoLoad) {
                this.loadData();
            }
            
            this.log('组件初始化完成');
        } catch (error) {
            console.error('组件初始化失败:', error);
            if (this.callbacks.onError) {
                this.callbacks.onError(error);
            }
        }
    }
    
    /**
     * 创建组件HTML结构
     */
    createComponentHTML() {
        const container = document.getElementById(this.config.containerId);
        if (!container) {
            console.error(`找不到容器元素: ${this.config.containerId}`);
            return;
        }
        
        // 如果容器为空，创建基础HTML结构
        if (!container.innerHTML.trim()) {
            container.innerHTML = `
                <div class="disease-benefit-component">
                    <div class="disease-benefit-content">
                        <!-- 筛选区域 -->
                        <div class="filter-section">
                            <div class="filter-row">
                                <div class="filter-group">
                                    <label>病种筛选：</label>
                                    <div class="disease-filter-container">
                                        <input type="text" id="disease-search" class="disease-search" placeholder="搜索病种...">
                                        <div class="disease-dropdown" id="disease-dropdown">
                                            <div class="disease-list" id="disease-list"></div>
                                        </div>
                                        <div class="selected-diseases" id="selected-diseases">
                                            <span class="selected-text">请选择病种</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="filter-group">
                                     <button class="btn btn-primary" id="refresh-btn">刷新数据</button>
                                     <button class="btn btn-secondary" id="export-btn">导出数据</button>
                                     <button class="btn btn-info" id="ai-insight-btn">AI洞察</button>
                                 </div>
                            </div>
                        </div>
                        
                        <!-- 图表区域 -->
                        <div class="charts-section">
                            <div class="chart-row">
                                <div class="chart-container">
                                    <h3>病种效益分析</h3>
                                    <div id="disease-benefit-chart" class="chart"></div>
                                </div>
                                <div class="chart-container">
                                    <h3>DRG效益分析</h3>
                                    <div id="drg-benefit-chart" class="chart"></div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 表格区域 -->
                        <div class="tables-section">
                            <!-- 病种表格 -->
                            <div class="table-section">
                                <div class="table-header">
                                    <h3>病种效益明细</h3>
                                </div>
                                <div class="table-container">
                                    <table id="disease-table" class="data-table">
                                        <thead>
                                            <tr>
                                                <th>病种名称</th>
                                                <th>病例数</th>
                                                <th>总收入</th>
                                                <th>总成本</th>
                                                <th>总结余</th>
                                                <th>平均收入</th>
                                                <th>平均成本</th>
                                                <th>平均结余</th>
                                                <th>利润率</th>
                                                <th>保本例数</th>
                                                <th>操作</th>
                                            </tr>
                                        </thead>
                                        <tbody id="disease-tbody">
                                            <!-- 数据行将在这里动态生成 -->
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- 医生病种表格 -->
                            <div class="table-section">
                                <div class="table-header">
                                    <h3>医生病种效益</h3>
                                </div>
                                <div class="table-container">
                                    <table id="doctor-disease-table" class="data-table">
                                        <thead>
                                            <tr>
                                                <th>医生姓名</th>
                                                <th>职称</th>
                                                <th>科室</th>
                                                <th>病种</th>
                                                <th>病例数</th>
                                                <th>平均收入</th>
                                                <th>平均成本</th>
                                                <th>平均结余</th>
                                                <th>利润率</th>
                                                <th>操作</th>
                                            </tr>
                                        </thead>
                                        <tbody id="doctor-disease-tbody">
                                            <!-- 数据行将在这里动态生成 -->
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 加载指示器 -->
                        <div id="loading-indicator" class="loading-indicator" style="display: none;">
                            <div class="loading-spinner"></div>
                            <div class="loading-text">加载中...</div>
                        </div>
                        
                        <!-- 消息提示 -->
                        <div id="message-container" class="message-container"></div>
                    </div>
                    
                    <!-- 病种详情弹窗 -->
                    <div id="disease-detail-modal" class="disease-detail-modal">
                        <div class="disease-detail-content">
                            <div class="disease-detail-header">
                                <h2 class="disease-detail-title" id="disease-detail-title">病种详情</h2>
                                <span class="disease-detail-close" id="disease-detail-close">&times;</span>
                            </div>
                            <div class="disease-detail-body">
                                <!-- 病种基本信息 -->
                                <div class="disease-info-grid">
                                    <div class="disease-info-card">
                                        <h3>收入构成分析</h3>
                                        <div id="disease-revenue-chart" class="disease-chart-container"></div>
                                    </div>
                                    <div class="disease-info-card">
                                        <h3>成本构成分析</h3>
                                        <div id="disease-cost-chart" class="disease-chart-container"></div>
                                    </div>
                                </div>

                                <!-- 科室明细 -->
                                <div class="department-list">
                                    <h3>收治科室明细</h3>
                                    <div id="department-details"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 医生档案弹窗 -->
                    <div id="doctor-profile-modal" class="doctor-profile-modal">
                        <div class="doctor-profile-content">
                            <div class="doctor-profile-header">
                                <h2 class="doctor-profile-title" id="doctor-profile-title">医生档案</h2>
                                <span class="doctor-profile-close" id="doctor-profile-close">&times;</span>
                            </div>
                            <div class="doctor-profile-body">
                                <!-- 医生基本信息 -->
                                <div class="doctor-basic-info" id="doctor-basic-info"></div>
                                
                                <!-- 医生效益图表 -->
                                <div class="doctor-charts-grid">
                                    <div class="doctor-chart-card">
                                        <h3>月度效益趋势</h3>
                                        <div id="doctor-trend-chart" class="doctor-chart-container"></div>
                                    </div>
                                    <div class="doctor-chart-card">
                                        <h3>病种分布</h3>
                                        <div id="doctor-disease-chart" class="doctor-chart-container"></div>
                                    </div>
                                </div>
                                
                                <!-- 医生病种明细表格 -->
                                <div class="doctor-detail-table">
                                    <h3>病种明细</h3>
                                    <table class="data-table">
                                        <thead>
                                            <tr>
                                                <th>病种</th>
                                                <th>病例数</th>
                                                <th>平均收入</th>
                                                <th>平均成本</th>
                                                <th>平均结余</th>
                                                <th>利润率</th>
                                            </tr>
                                        </thead>
                                        <tbody id="doctor-disease-detail-tbody"></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- AI洞察弹窗 -->
                    <div id="ai-insight-modal" class="ai-insight-modal">
                        <div class="ai-insight-content">
                            <div class="ai-insight-header">
                                <h2 class="ai-insight-title">AI智能洞察</h2>
                                <span class="ai-insight-close" id="ai-insight-close">&times;</span>
                            </div>
                            <div class="ai-insight-body">
                                <div id="ai-insight-content" class="ai-insight-text"></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }
    
    /**
     * 日志输出
     */
    log(message) {
        if (this.config.debug) {
            console.log(`[DiseaseBenefitComponent] ${message}`);
        }
    }
    
    /**
     * 检查ECharts可用性
     */
    checkEChartsAvailability() {
        if (typeof echarts === 'undefined') {
            console.error('ECharts未加载，请确保已引入ECharts库');
            return false;
        }
        return true;
    }
    
    /**
     * 初始化事件监听器
     */
    initEventListeners() {
        const container = document.getElementById(this.config.containerId);
        if (!container) {
            console.error(`找不到容器元素: ${this.config.containerId}`);
            return;
        }
        
        // 筛选事件
        this.bindFilterEvents();
        
        // 表格操作事件
        this.bindTableEvents();
        
        // 模态框事件
        this.bindModalEvents();
        
        // 导出和AI洞察事件
        this.bindActionEvents();
        
        // 窗口大小变化事件
        window.addEventListener('resize', this.debounce(() => {
            this.resizeCharts();
        }, 300));
    }
    
    /**
     * 绑定筛选事件
     */
    bindFilterEvents() {
        const searchInput = document.getElementById('disease-search');
        const dropdown = document.getElementById('disease-dropdown');
        const timeRangeSelect = document.getElementById('time-range-select');
        const departmentSelect = document.getElementById('department-select');
        
        if (searchInput) {
            // 使用防抖处理搜索输入
            const debouncedSearch = this.debounce((value) => {
                this.handleSearch(value);
            }, 200);
            
            searchInput.addEventListener('input', (e) => {
                debouncedSearch(e.target.value);
            });
            
            searchInput.addEventListener('focus', () => {
                // 如果有内容，执行搜索；否则显示所有选项
                const value = searchInput.value.trim();
                if (value) {
                    this.handleSearch(value);
                } else {
                    this.handleSearch('');
                }
            });
            
            searchInput.addEventListener('keydown', (e) => {
                this.handleSearchKeydown(e);
            });
            
            // 添加清空按钮功能
            searchInput.addEventListener('keyup', (e) => {
                if (e.key === 'Backspace' || e.key === 'Delete') {
                    if (!searchInput.value.trim()) {
                        this.handleSearch('');
                    }
                }
            });
        }
        
        if (timeRangeSelect) {
            timeRangeSelect.addEventListener('change', () => {
                this.refreshData();
            });
        }
        
        if (departmentSelect) {
            departmentSelect.addEventListener('change', () => {
                this.refreshData();
            });
        }
        
        // 点击外部关闭下拉框
        document.addEventListener('click', (e) => {
            if (!dropdown?.contains(e.target) && !searchInput?.contains(e.target)) {
                this.closeDropdown();
                // 清除键盘焦点
                const focusedItem = dropdown?.querySelector('.dropdown-item.keyboard-focus');
                if (focusedItem) {
                    focusedItem.classList.remove('keyboard-focus');
                }
            }
        });
        
        // 添加下拉框内的点击事件
        if (dropdown) {
            dropdown.addEventListener('click', (e) => {
                e.stopPropagation(); // 防止冒泡到document
            });
        }
    }
    
    /**
     * 绑定表格事件
     */
    bindTableEvents() {
        const container = document.getElementById(this.config.containerId);
        
        // 病种详情按钮事件
        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('detail-btn')) {
                const diseaseCode = e.target.dataset.diseaseCode;
                const diseaseName = e.target.dataset.diseaseName;
                this.showDiseaseDetail(diseaseCode, diseaseName);
            }
            
            // 医生画像按钮事件
            if (e.target.classList.contains('profile-btn')) {
                const doctorId = e.target.dataset.doctorId;
                const doctorName = e.target.dataset.doctorName;
                const doctorTitle = e.target.dataset.doctorTitle;
                const department = e.target.dataset.department;
                this.showDoctorProfile(doctorId, doctorName, doctorTitle, department);
            }
        });
    }
    
    /**
     * 绑定模态框事件
     */
    bindModalEvents() {
        // 病种详情模态框
        const diseaseModal = document.getElementById('disease-detail-modal');
        const diseaseCloseBtn = document.getElementById('disease-detail-close');
        
        if (diseaseCloseBtn) {
            diseaseCloseBtn.addEventListener('click', () => {
                this.closeDiseaseDetail();
            });
        }
        
        if (diseaseModal) {
            diseaseModal.addEventListener('click', (e) => {
                if (e.target === diseaseModal) {
                    this.closeDiseaseDetail();
                }
            });
        }
        
        // 医生画像模态框
        const doctorModal = document.getElementById('doctor-profile-modal');
        const doctorCloseBtn = document.getElementById('doctor-profile-close');
        
        if (doctorCloseBtn) {
            doctorCloseBtn.addEventListener('click', () => {
                this.closeDoctorProfile();
            });
        }
        
        if (doctorModal) {
            doctorModal.addEventListener('click', (e) => {
                if (e.target === doctorModal) {
                    this.closeDoctorProfile();
                }
            });
        }
        
        // AI洞察模态框
        const aiModal = document.getElementById('ai-insight-modal');
        const aiCloseBtn = document.querySelector('.ai-insight-close');
        
        if (aiCloseBtn) {
            aiCloseBtn.addEventListener('click', () => {
                this.closeAIInsight();
            });
        }
        
        if (aiModal) {
            aiModal.addEventListener('click', (e) => {
                if (e.target === aiModal) {
                    this.closeAIInsight();
                }
            });
        }
    }
    
    /**
     * 绑定操作事件
     */
    bindActionEvents() {
        const exportBtn = document.getElementById('export-btn');
        const refreshBtn = document.getElementById('refresh-btn');
        const aiInsightBtn = document.getElementById('ai-insight-btn');
        
        // 导出按钮
        if (exportBtn && this.config.enableExport) {
            exportBtn.addEventListener('click', () => {
                this.exportData();
            });
        }
        
        // 刷新按钮
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshData();
            });
        }
        
        // AI洞察按钮
        if (aiInsightBtn && this.config.enableAIInsight) {
            aiInsightBtn.addEventListener('click', () => {
                this.showAIInsight();
            });
        }
        
        // 模态框关闭按钮
        const diseaseDetailClose = document.getElementById('disease-detail-close');
        const doctorProfileClose = document.getElementById('doctor-profile-close');
        const aiInsightClose = document.getElementById('ai-insight-close');
        
        if (diseaseDetailClose) {
            diseaseDetailClose.addEventListener('click', () => {
                this.closeDiseaseDetail();
            });
        }
        
        if (doctorProfileClose) {
            doctorProfileClose.addEventListener('click', () => {
                this.closeDoctorProfile();
            });
        }
        
        if (aiInsightClose) {
            aiInsightClose.addEventListener('click', () => {
                this.closeAIInsight();
            });
        }
    }
    
    /**
     * 加载数据
     */
    async loadData() {
        this.state.isLoading = true;
        this.showLoading();
        
        try {
            let data;
            if (this.config.apiUrl && this.config.apiUrl !== '/api/disease-benefit') {
                // 从API加载数据
                const response = await fetch(this.config.apiUrl);
                data = await response.json();
            } else {
                // 使用模拟数据
                data = this.generateMockData();
            }
            
            this.state.currentData = this.transformData(data);
            this.state.allDiseases = this.extractDiseaseList(this.state.currentData);
            
            // 确保数据设置完成后再初始化图表
            this.renderDiseaseFilter();
            
            // 延迟初始化图表，确保DOM已渲染
            setTimeout(() => {
                this.initCharts();
                this.updateTables();
            }, 100);
            
            if (this.callbacks.onDataLoad) {
                this.callbacks.onDataLoad(this.state.currentData);
            }
            
        } catch (error) {
            console.error('加载数据失败:', error);
            this.showError('数据加载失败，请稍后重试');
            
            if (this.callbacks.onError) {
                this.callbacks.onError(error);
            }
        } finally {
            this.state.isLoading = false;
            this.hideLoading();
        }
    }
    
    /**
     * 生成模拟数据
     */
    generateMockData() {
        return {
            diseaseData: this.generateDiseaseData(),
            doctorDiseaseData: this.generateDoctorDiseaseData()
        };
    }
    
    /**
     * 生成病种数据
     */
    generateDiseaseData() {
        const diseases = [
            '急性心肌梗死', '脑梗死', '肺炎', '胆囊炎', '阑尾炎',
            '骨折', '白内障', '糖尿病', '高血压', '冠心病',
            '胃炎', '肾结石', '甲状腺结节', '乳腺增生', '子宫肌瘤'
        ];
        
        return diseases.map((name, index) => {
            const cases = Math.floor(Math.random() * 500) + 50;
            const avgRevenue = Math.floor(Math.random() * 50000) + 10000;
            const avgCost = Math.floor(Math.random() * 30000) + 8000;
            const avgBenefit = avgRevenue - avgCost;
            const profitRate = ((avgBenefit / avgRevenue) * 100);
            const breakevenCases = avgCost > 0 ? Math.ceil(avgCost / (avgRevenue - avgCost)) : 0;
            
            return {
                code: `D${String(index + 1).padStart(3, '0')}`,
                name: name,
                cases: cases,
                totalRevenue: avgRevenue * cases,
                totalCost: avgCost * cases,
                totalBenefit: avgBenefit * cases,
                avgRevenue: avgRevenue,
                avgCost: avgCost,
                avgBenefit: avgBenefit,
                profitRate: profitRate,
                breakevenCases: breakevenCases
            };
        });
    }
    
    /**
     * 生成医生病种数据
     */
    generateDoctorDiseaseData() {
        const doctors = [
            { name: '张医生', title: '主任医师', department: '心内科' },
            { name: '李医生', title: '副主任医师', department: '神经内科' },
            { name: '王医生', title: '主治医师', department: '呼吸科' },
            { name: '刘医生', title: '主任医师', department: '消化科' },
            { name: '陈医生', title: '副主任医师', department: '骨科' }
        ];
        
        const diseases = ['急性心肌梗死', '脑梗死', '肺炎', '胆囊炎', '阑尾炎'];
        
        const data = [];
        doctors.forEach((doctor, doctorIndex) => {
            diseases.forEach((disease, diseaseIndex) => {
                if (Math.random() > 0.3) { // 70%的概率有数据
                    const cases = Math.floor(Math.random() * 50) + 5;
                    const avgRevenue = Math.floor(Math.random() * 40000) + 15000;
                    const avgCost = Math.floor(Math.random() * 25000) + 10000;
                    const avgBenefit = avgRevenue - avgCost;
                    const profitRate = ((avgBenefit / avgRevenue) * 100);
                    
                    data.push({
                        doctorId: `DOC${String(doctorIndex + 1).padStart(3, '0')}`,
                        doctorName: doctor.name,
                        doctorTitle: doctor.title,
                        department: doctor.department,
                        diseaseCode: `D${String(diseaseIndex + 1).padStart(3, '0')}`,
                        diseaseName: disease,
                        cases: cases,
                        avgRevenue: avgRevenue,
                        avgCost: avgCost,
                        avgBenefit: avgBenefit,
                        profitRate: profitRate
                    });
                }
            });
        });
        
        return data;
    }
    
    /**
     * 数据转换
     */
    transformData(rawData) {
        return {
            diseases: rawData.diseaseData || [],
            doctorDiseases: rawData.doctorDiseaseData || []
        };
    }
    
    /**
     * 提取病种列表
     */
    extractDiseaseList(data) {
        const diseases = data.diseases || [];
        return diseases.map(item => ({
            code: item.code,
            name: item.name,
            selected: false
        }));
    }
    
    /**
     * 初始化病种筛选
     */
    initDiseaseFilter() {
        this.state.selectedDiseases = [];
        this.renderDiseaseFilter();
    }
    
    /**
     * 渲染病种筛选下拉框
     */
    renderDiseaseFilter() {
        const dropdownContent = document.getElementById('disease-dropdown-content');
        if (!dropdownContent) return;
        
        dropdownContent.innerHTML = '';
        
        // 全选选项
        const selectAllItem = document.createElement('div');
        selectAllItem.className = 'dropdown-item select-all';
        selectAllItem.innerHTML = `
            <input type="checkbox" id="select-all-diseases" ${this.state.selectedDiseases.length === this.state.allDiseases.length ? 'checked' : ''}>
            <label for="select-all-diseases">全选</label>
        `;
        dropdownContent.appendChild(selectAllItem);
        
        // 病种选项
        this.state.allDiseases.forEach(disease => {
            const item = document.createElement('div');
            item.className = 'dropdown-item';
            item.innerHTML = `
                <input type="checkbox" id="disease-${disease.code}" value="${disease.code}" ${disease.selected ? 'checked' : ''}>
                <label for="disease-${disease.code}">${disease.name}</label>
            `;
            dropdownContent.appendChild(item);
        });
        
        // 绑定选择事件
        dropdownContent.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                this.handleDiseaseSelection(e);
            }
        });
    }
    
    /**
     * 处理病种选择
     */
    handleDiseaseSelection(e) {
        const checkbox = e.target;
        const diseaseCode = checkbox.value;
        
        if (checkbox.id === 'select-all-diseases') {
            // 全选/取消全选
            const isChecked = checkbox.checked;
            this.state.allDiseases.forEach(disease => {
                disease.selected = isChecked;
            });
            this.state.selectedDiseases = isChecked ? [...this.state.allDiseases.map(d => d.code)] : [];
            
            // 更新所有复选框状态
            const checkboxes = document.querySelectorAll('#disease-dropdown-content input[type="checkbox"]:not(#select-all-diseases)');
            checkboxes.forEach(cb => {
                cb.checked = isChecked;
            });
        } else {
            // 单个病种选择
            const disease = this.state.allDiseases.find(d => d.code === diseaseCode);
            if (disease) {
                disease.selected = checkbox.checked;
                
                if (checkbox.checked) {
                    if (!this.state.selectedDiseases.includes(diseaseCode)) {
                        this.state.selectedDiseases.push(diseaseCode);
                    }
                } else {
                    this.state.selectedDiseases = this.state.selectedDiseases.filter(code => code !== diseaseCode);
                }
            }
            
            // 更新全选状态
            const selectAllCheckbox = document.getElementById('select-all-diseases');
            if (selectAllCheckbox) {
                selectAllCheckbox.checked = this.state.selectedDiseases.length === this.state.allDiseases.length;
            }
        }
        
        this.updateSelectedText();
        this.updateFilteredData();
        this.updateTables();
        this.updateCharts();
        
        if (this.callbacks.onDiseaseSelect) {
            this.callbacks.onDiseaseSelect(this.state.selectedDiseases);
        }
    }
    
    /**
     * 更新选中文本
     */
    updateSelectedText() {
        const searchInput = document.getElementById('disease-search');
        if (!searchInput) return;
        
        if (this.state.selectedDiseases.length === 0) {
            searchInput.placeholder = '搜索病种...';
            searchInput.value = '';
        } else if (this.state.selectedDiseases.length === 1) {
            const disease = this.state.allDiseases.find(d => d.code === this.state.selectedDiseases[0]);
            searchInput.value = disease ? disease.name : '';
        } else {
            searchInput.value = `已选择 ${this.state.selectedDiseases.length} 个病种`;
        }
    }
    
    /**
     * 更新筛选后的数据
     */
    updateFilteredData() {
        if (!this.state.currentData) return;
        
        if (this.state.selectedDiseases.length === 0) {
            this.state.filteredData = this.state.currentData;
        } else {
            this.state.filteredData = {
                diseases: this.state.currentData.diseases.filter(disease => 
                    this.state.selectedDiseases.includes(disease.code)
                ),
                doctorDiseases: this.state.currentData.doctorDiseases.filter(item => 
                    this.state.selectedDiseases.includes(item.diseaseCode)
                )
            };
        }
    }
    
    /**
     * 处理搜索
     */
    handleSearch(searchTerm) {
        const dropdownContent = document.getElementById('disease-dropdown-content');
        if (!dropdownContent) return;
        
        const items = dropdownContent.querySelectorAll('.dropdown-item:not(.select-all)');
        let visibleCount = 0;
        
        // 移除之前的无结果提示
        const existingNoResults = dropdownContent.querySelector('.no-results');
        if (existingNoResults) {
            existingNoResults.remove();
        }
        
        items.forEach(item => {
            const label = item.querySelector('label');
            if (label) {
                const originalText = label.getAttribute('data-original-text') || label.textContent;
                if (!label.getAttribute('data-original-text')) {
                    label.setAttribute('data-original-text', originalText);
                }
                
                const lowerText = originalText.toLowerCase();
                const lowerSearchTerm = searchTerm.toLowerCase().trim();
                const matches = !lowerSearchTerm || lowerText.includes(lowerSearchTerm);
                
                item.style.display = matches ? 'flex' : 'none';
                
                if (matches) {
                    visibleCount++;
                    // 高亮匹配的文本
                    if (lowerSearchTerm) {
                        const highlightedText = this.highlightText(originalText, lowerSearchTerm);
                        label.innerHTML = highlightedText;
                    } else {
                        label.textContent = originalText;
                    }
                } else {
                    label.textContent = originalText;
                }
            }
        });
        
        // 显示无结果提示
        if (searchTerm.trim() && visibleCount === 0) {
            const noResultsDiv = document.createElement('div');
            noResultsDiv.className = 'no-results';
            noResultsDiv.textContent = `未找到包含 "${searchTerm}" 的病种`;
            dropdownContent.appendChild(noResultsDiv);
        }
        
        // 显示/隐藏下拉框
        if (searchTerm.trim() || visibleCount > 0) {
            this.openDropdown();
        } else if (!searchTerm.trim()) {
            // 如果搜索框为空，显示所有选项
            items.forEach(item => {
                item.style.display = 'flex';
                const label = item.querySelector('label');
                if (label) {
                    const originalText = label.getAttribute('data-original-text') || label.textContent;
                    label.textContent = originalText;
                }
            });
            this.openDropdown();
        }
    }
    
    /**
     * 高亮匹配的文本
     */
    highlightText(text, searchTerm) {
        if (!searchTerm) return text;
        
        const regex = new RegExp(`(${this.escapeRegExp(searchTerm)})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }
    
    /**
     * 转义正则表达式特殊字符
     */
    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    /**
     * 处理搜索键盘事件
     */
    handleSearchKeydown(e) {
        const dropdown = document.getElementById('disease-dropdown');
        const searchInput = document.getElementById('disease-search');
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (!dropdown.classList.contains('show')) {
                    this.openDropdown();
                }
                this.navigateDropdown('down');
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (dropdown.classList.contains('show')) {
                    this.navigateDropdown('up');
                }
                break;
            case 'Enter':
                e.preventDefault();
                if (dropdown.classList.contains('show')) {
                    const currentFocus = dropdown.querySelector('.dropdown-item.keyboard-focus');
                    if (currentFocus && !currentFocus.classList.contains('no-results')) {
                        const checkbox = currentFocus.querySelector('input[type="checkbox"]');
                        if (checkbox) {
                            checkbox.checked = !checkbox.checked;
                            checkbox.dispatchEvent(new Event('change'));
                            // 保持焦点在搜索框
                            searchInput.focus();
                        }
                    }
                } else {
                    this.openDropdown();
                }
                break;
            case 'Escape':
                e.preventDefault();
                this.closeDropdown();
                searchInput.blur();
                break;
            case 'Tab':
                // Tab键关闭下拉框
                this.closeDropdown();
                break;
        }
    }
    
    /**
     * 导航下拉框选项
     */
    navigateDropdown(direction) {
        const dropdown = document.getElementById('disease-dropdown');
        if (!dropdown || !dropdown.classList.contains('show')) return;
        
        const visibleItems = Array.from(dropdown.querySelectorAll('.dropdown-item:not([style*="display: none"]):not(.no-results)'));
        if (visibleItems.length === 0) return;
        
        const currentFocus = dropdown.querySelector('.dropdown-item.keyboard-focus');
        let currentIndex = currentFocus ? visibleItems.indexOf(currentFocus) : -1;
        
        if (direction === 'down') {
            currentIndex = currentIndex < visibleItems.length - 1 ? currentIndex + 1 : 0;
        } else if (direction === 'up') {
            currentIndex = currentIndex > 0 ? currentIndex - 1 : visibleItems.length - 1;
        }
        
        this.setKeyboardFocus(visibleItems, currentIndex);
    }
    
    /**
     * 设置键盘焦点
     */
    setKeyboardFocus(items, index) {
        items.forEach(item => item.classList.remove('keyboard-focus'));
        if (items[index]) {
            items[index].classList.add('keyboard-focus');
            items[index].scrollIntoView({ block: 'nearest' });
        }
    }
    
    /**
     * 打开下拉框
     */
    openDropdown() {
        const dropdown = document.getElementById('disease-dropdown');
        if (dropdown) {
            dropdown.classList.add('show');
        }
    }
    
    /**
     * 关闭下拉框
     */
    closeDropdown() {
        const dropdown = document.getElementById('disease-dropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
        }
    }
    
    /**
     * 初始化图表
     */
    initCharts() {
        this.initDiseaseBenefitChart();
        this.initDRGBenefitChart();
    }
    
    /**
     * 初始化病种效益图表
     */
    initDiseaseBenefitChart() {
        const data = this.state.filteredData || this.state.currentData;
        console.log('initDiseaseBenefitChart - 数据检查:', data);
        
        if (!data || !data.diseases || data.diseases.length === 0) {
            console.warn('病种效益图表: 没有可用数据');
            return;
        }
        
        this.safeInitChart('disease-benefit-chart', () => ({
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['总收入', '总成本', '总结余']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: data.diseases.slice(0, 10).map(item => item.name),
                axisLabel: {
                    rotate: 45
                }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: function(value) {
                        return (value / 10000).toFixed(0) + '万';
                    }
                }
            },
            series: [
                {
                    name: '总收入',
                    type: 'bar',
                    data: data.diseases.slice(0, 10).map(item => item.totalRevenue),
                    itemStyle: {
                        color: '#1890ff'
                    }
                },
                {
                    name: '总成本',
                    type: 'bar',
                    data: data.diseases.slice(0, 10).map(item => item.totalCost),
                    itemStyle: {
                        color: '#faad14'
                    }
                },
                {
                    name: '总结余',
                    type: 'bar',
                    data: data.diseases.slice(0, 10).map(item => item.totalBenefit),
                    itemStyle: {
                        color: item => item.data >= 0 ? '#52c41a' : '#f5222d'
                    }
                }
            ]
        }));
    }
    
    /**
     * 初始化DRG效益图表
     */
    initDRGBenefitChart() {
        const data = this.state.filteredData || this.state.currentData;
        console.log('initDRGBenefitChart - 数据检查:', data);
        
        if (!data || !data.diseases || data.diseases.length === 0) {
            console.warn('DRG效益图表: 没有可用数据');
            return;
        }
        
        // 按利润率排序
        const sortedData = [...data.diseases].sort((a, b) => b.profitRate - a.profitRate);
        
        this.safeInitChart('drg-benefit-chart', () => ({
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    return `${params.name}<br/>利润率: ${params.value.toFixed(1)}%`;
                }
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: 'DRG效益分析',
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
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: sortedData.slice(0, 8).map(item => ({
                        value: Math.abs(item.profitRate),
                        name: item.name,
                        itemStyle: {
                            color: item.profitRate >= 0 ? '#52c41a' : '#f5222d'
                        }
                    }))
                }
            ]
        }));
    }
    
    /**
     * 安全初始化图表
     */
    safeInitChart(containerId, optionCallback) {
        try {
            const container = document.getElementById(containerId);
            if (!container) {
                console.warn(`图表容器不存在: ${containerId}`);
                return;
            }
            
            if (typeof echarts === 'undefined') {
                console.error('ECharts未加载');
                return;
            }
            
            // 检查容器尺寸
            const rect = container.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) {
                console.warn(`图表容器尺寸为0: ${containerId}, width: ${rect.width}, height: ${rect.height}`);
                // 设置最小尺寸
                container.style.width = container.style.width || '400px';
                container.style.height = container.style.height || '300px';
            }
            
            // 销毁已存在的图表实例
            if (this.state.charts[containerId]) {
                this.state.charts[containerId].dispose();
            }
            
            // 创建新的图表实例
            const chart = echarts.init(container);
            const option = optionCallback();
            
            console.log(`初始化图表 ${containerId}:`, option);
            
            chart.setOption(option);
            
            // 保存图表实例
            this.state.charts[containerId] = chart;
            
            // 触发resize确保图表正确显示
            setTimeout(() => {
                chart.resize();
            }, 50);
            
        } catch (error) {
            console.error(`初始化图表失败 ${containerId}:`, error);
        }
    }
    
    /**
     * 更新图表
     */
    updateCharts() {
        this.initDiseaseBenefitChart();
        this.initDRGBenefitChart();
    }
    
    /**
     * 更新表格
     */
    updateTables() {
        this.updateDiseaseTable();
        this.updateDoctorDiseaseTable();
    }
    
    /**
     * 更新病种表格
     */
    updateDiseaseTable() {
        const data = this.state.filteredData || this.state.currentData;
        if (!data || !data.diseases) return;
        
        const tbody = document.getElementById('disease-tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        data.diseases.forEach(item => {
            const row = document.createElement('tr');
            
            // 亏损病种高亮
            if (item.totalBenefit < 0) {
                row.classList.add('loss-row');
            }
            
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.cases.toLocaleString()}</td>
                <td>¥${(item.totalRevenue / 10000).toFixed(1)}万</td>
                <td>¥${(item.totalCost / 10000).toFixed(1)}万</td>
                <td class="${item.totalBenefit >= 0 ? 'positive' : 'negative'} benefit-amount">¥${(item.totalBenefit / 10000).toFixed(1)}万</td>
                <td>¥${(item.avgRevenue / 1000).toFixed(1)}千</td>
                <td>¥${(item.avgCost / 1000).toFixed(1)}千</td>
                <td class="${item.avgBenefit >= 0 ? 'positive' : 'negative'}">¥${(item.avgBenefit / 1000).toFixed(1)}千</td>
                <td class="${item.profitRate >= 0 ? 'positive' : 'negative'}">${item.profitRate.toFixed(1)}%</td>
                <td>${item.breakevenCases}</td>
                <td>
                    <button class="btn btn-primary action-btn detail-btn" 
                            data-disease-code="${item.code}" 
                            data-disease-name="${item.name}">详情</button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
        
        // 应用渐变背景
        this.applyGradientBackgrounds();
    }
    
    /**
     * 更新医生病种表格
     */
    updateDoctorDiseaseTable() {
        const data = this.state.filteredData || this.state.currentData;
        if (!data || !data.doctorDiseases) return;
        
        const tbody = document.getElementById('doctor-disease-tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        data.doctorDiseases.forEach(item => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${item.doctorName}</td>
                <td>${item.doctorTitle}</td>
                <td>${item.department}</td>
                <td>${item.diseaseName}</td>
                <td>${item.cases.toLocaleString()}</td>
                <td>¥${(item.avgRevenue / 1000).toFixed(1)}千</td>
                <td>¥${(item.avgCost / 1000).toFixed(1)}千</td>
                <td class="${item.avgBenefit >= 0 ? 'positive' : 'negative'}">¥${(item.avgBenefit / 1000).toFixed(1)}千</td>
                <td class="${item.profitRate >= 0 ? 'positive' : 'negative'}">${item.profitRate.toFixed(1)}%</td>
                <td>
                    <button class="btn btn-secondary action-btn profile-btn" 
                            data-doctor-id="${item.doctorId}" 
                            data-doctor-name="${item.doctorName}"
                            data-doctor-title="${item.doctorTitle}"
                            data-department="${item.department}">画像</button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }
    
    /**
     * 应用渐变背景
     */
    applyGradientBackgrounds() {
        const table = document.getElementById('disease-table');
        if (!table) return;
        
        const rows = table.querySelectorAll('tbody tr');
        const columns = [4, 7, 8]; // 总结余、平均结余、利润率列
        
        columns.forEach(colIndex => {
            const values = Array.from(rows).map(row => {
                const cell = row.cells[colIndex];
                if (!cell) return 0;
                
                const text = cell.textContent.replace(/[¥万千%,]/g, '');
                return parseFloat(text) || 0;
            });
            
            const max = Math.max(...values);
            const min = Math.min(...values);
            const range = max - min;
            
            if (range === 0) return;
            
            rows.forEach((row, index) => {
                const cell = row.cells[colIndex];
                if (!cell) return;
                
                const value = values[index];
                const normalized = (value - min) / range;
                const level = Math.min(Math.floor(normalized * 5) + 1, 5);
                
                cell.classList.add(`gradient-bg-${level}`);
            });
        });
    }
    
    /**
     * 显示病种详情
     */
    showDiseaseDetail(diseaseCode, diseaseName) {
        const modal = document.getElementById('disease-detail-modal');
        const title = document.getElementById('disease-detail-title');
        
        if (title) {
            title.textContent = `${diseaseName} - 详细分析`;
        }
        
        if (modal) {
            modal.classList.add('show');
            
            // 生成详情数据并渲染图表
            const detailData = this.generateDiseaseDetailData(diseaseCode, diseaseName);
            this.renderDiseaseDetailCharts(detailData);
            this.renderDepartmentDetails(detailData.departments);
        }
    }
    
    /**
     * 关闭病种详情
     */
    closeDiseaseDetail() {
        const modal = document.getElementById('disease-detail-modal');
        if (modal) {
            modal.classList.remove('show');
        }
    }
    
    /**
     * 生成病种详情数据
     */
    generateDiseaseDetailData(diseaseCode, diseaseName) {
        return {
            revenue: [
                { name: '药品费', value: Math.random() * 5000 + 2000 },
                { name: '检查费', value: Math.random() * 3000 + 1000 },
                { name: '治疗费', value: Math.random() * 4000 + 1500 },
                { name: '手术费', value: Math.random() * 8000 + 3000 },
                { name: '其他', value: Math.random() * 2000 + 500 }
            ],
            cost: [
                { name: '人力成本', value: Math.random() * 3000 + 1000 },
                { name: '药品成本', value: Math.random() * 4000 + 1500 },
                { name: '设备成本', value: Math.random() * 2000 + 800 },
                { name: '管理成本', value: Math.random() * 1500 + 500 },
                { name: '其他成本', value: Math.random() * 1000 + 300 }
            ],
            departments: [
                { name: '心内科', cases: Math.floor(Math.random() * 50) + 20, revenue: Math.random() * 100000 + 50000 },
                { name: '急诊科', cases: Math.floor(Math.random() * 30) + 10, revenue: Math.random() * 80000 + 40000 },
                { name: 'ICU', cases: Math.floor(Math.random() * 20) + 5, revenue: Math.random() * 120000 + 60000 }
            ]
        };
    }
    
    /**
     * 渲染病种详情图表
     */
    renderDiseaseDetailCharts(data) {
        // 收入构成图表
        this.safeInitChart('disease-revenue-chart', () => ({
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: ¥{c} ({d}%)'
            },
            series: [{
                name: '收入构成',
                type: 'pie',
                radius: '70%',
                data: data.revenue,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        }));
        
        // 成本构成图表
        this.safeInitChart('disease-cost-chart', () => ({
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: ¥{c} ({d}%)'
            },
            series: [{
                name: '成本构成',
                type: 'pie',
                radius: '70%',
                data: data.cost,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        }));
    }
    
    /**
     * 渲染科室明细
     */
    renderDepartmentDetails(departments) {
        const container = document.getElementById('department-details');
        if (!container) return;
        
        container.innerHTML = departments.map(dept => `
            <div class="department-item">
                <h4>${dept.name}</h4>
                <p>病例数: ${dept.cases}</p>
                <p>收入: ¥${(dept.revenue / 10000).toFixed(1)}万</p>
            </div>
        `).join('');
    }
    
    /**
     * 显示医生画像
     */
    showDoctorProfile(doctorId, doctorName, doctorTitle, department) {
        const modal = document.getElementById('doctor-profile-modal');
        const title = document.getElementById('doctor-profile-title');
        
        if (title) {
            title.textContent = `${doctorName} - 医疗行为画像`;
        }
        
        if (modal) {
            modal.classList.add('show');
            
            // 更新医生基本信息
            this.updateDoctorBasicInfo(doctorId, doctorName, doctorTitle, department);
            
            // 渲染医生画像图表
            this.renderDoctorProfileCharts(doctorId);
            
            // 更新医生病种明细表格
            this.updateDoctorDetailTable(doctorId);
        }
    }
    
    /**
     * 关闭医生画像
     */
    closeDoctorProfile() {
        const modal = document.getElementById('doctor-profile-modal');
        if (modal) {
            modal.classList.remove('show');
        }
    }
    
    /**
     * 更新医生基本信息
     */
    updateDoctorBasicInfo(doctorId, doctorName, doctorTitle, department) {
        const elements = {
            'doctor-name-info': doctorName,
            'doctor-title-info': doctorTitle,
            'doctor-dept-info': department,
            'doctor-cases-info': Math.floor(Math.random() * 200) + 50,
            'doctor-revenue-info': `¥${(Math.random() * 50 + 20).toFixed(1)}万`,
            'doctor-cost-info': `¥${(Math.random() * 30 + 15).toFixed(1)}万`,
            'doctor-benefit-info': `¥${(Math.random() * 20 + 5).toFixed(1)}万`,
            'doctor-status-info': Math.random() > 0.3 ? '盈利' : '亏损'
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
                if (id === 'doctor-status-info') {
                    element.className = `info-value ${value === '盈利' ? 'positive' : 'negative'}`;
                }
            }
        });
    }
    
    /**
     * 渲染医生画像图表
     */
    renderDoctorProfileCharts(doctorId) {
        // 收入构成分析
        this.safeInitChart('doctor-revenue-chart', () => ({
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: ¥{c} ({d}%)'
            },
            series: [{
                name: '收入构成',
                type: 'pie',
                radius: '60%',
                data: [
                    { value: Math.random() * 20000 + 10000, name: '门诊收入' },
                    { value: Math.random() * 30000 + 15000, name: '住院收入' },
                    { value: Math.random() * 10000 + 5000, name: '手术收入' },
                    { value: Math.random() * 5000 + 2000, name: '其他收入' }
                ]
            }]
        }));
        
        // 成本构成分析
        this.safeInitChart('doctor-cost-chart', () => ({
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: ¥{c} ({d}%)'
            },
            series: [{
                name: '成本构成',
                type: 'pie',
                radius: '60%',
                data: [
                    { value: Math.random() * 15000 + 8000, name: '人力成本' },
                    { value: Math.random() * 20000 + 10000, name: '药品成本' },
                    { value: Math.random() * 8000 + 4000, name: '设备成本' },
                    { value: Math.random() * 5000 + 2000, name: '管理成本' }
                ]
            }]
        }));
        
        // 病种分布
        this.safeInitChart('doctor-disease-chart', () => ({
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            xAxis: {
                type: 'category',
                data: ['急性心肌梗死', '脑梗死', '肺炎', '胆囊炎', '阑尾炎']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                name: '病例数',
                type: 'bar',
                data: [
                    Math.floor(Math.random() * 30) + 10,
                    Math.floor(Math.random() * 25) + 8,
                    Math.floor(Math.random() * 20) + 5,
                    Math.floor(Math.random() * 15) + 3,
                    Math.floor(Math.random() * 10) + 2
                ],
                itemStyle: {
                    color: '#1890ff'
                }
            }]
        }));
        
        // 效率指标
        this.safeInitChart('doctor-efficiency-chart', () => ({
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['月度病例数', '月度收入']
            },
            xAxis: {
                type: 'category',
                data: ['1月', '2月', '3月', '4月', '5月', '6月']
            },
            yAxis: [
                {
                    type: 'value',
                    name: '病例数',
                    position: 'left'
                },
                {
                    type: 'value',
                    name: '收入(万元)',
                    position: 'right'
                }
            ],
            series: [
                {
                    name: '月度病例数',
                    type: 'bar',
                    data: Array.from({length: 6}, () => Math.floor(Math.random() * 50) + 20),
                    itemStyle: {
                        color: '#52c41a'
                    }
                },
                {
                    name: '月度收入',
                    type: 'line',
                    yAxisIndex: 1,
                    data: Array.from({length: 6}, () => Math.floor(Math.random() * 30) + 15),
                    itemStyle: {
                        color: '#faad14'
                    }
                }
            ]
        }));
    }
    
    /**
     * 更新医生病种明细表格
     */
    updateDoctorDetailTable(doctorId) {
        const tbody = document.getElementById('doctor-disease-detail-tbody');
        if (!tbody) return;
        
        const diseases = ['急性心肌梗死', '脑梗死', '肺炎', '胆囊炎', '阑尾炎'];
        tbody.innerHTML = '';
        
        diseases.forEach(disease => {
            const row = document.createElement('tr');
            const cases = Math.floor(Math.random() * 30) + 5;
            const avgRevenue = Math.floor(Math.random() * 40000) + 15000;
            const avgCost = Math.floor(Math.random() * 25000) + 10000;
            const avgBenefit = avgRevenue - avgCost;
            const revenueRatio = Math.random() * 30 + 10;
            const costRatio = Math.random() * 25 + 8;
            
            row.innerHTML = `
                <td>${disease}</td>
                <td>${cases}</td>
                <td>¥${(avgRevenue / 1000).toFixed(1)}千</td>
                <td>¥${(avgCost / 1000).toFixed(1)}千</td>
                <td class="${avgBenefit >= 0 ? 'positive' : 'negative'}">¥${(avgBenefit / 1000).toFixed(1)}千</td>
                <td>${revenueRatio.toFixed(1)}%</td>
                <td>${costRatio.toFixed(1)}%</td>
            `;
            
            tbody.appendChild(row);
        });
    }
    
    /**
     * 显示AI洞察
     */
    showAIInsight() {
        const modal = document.getElementById('ai-insight-modal');
        const content = document.getElementById('ai-analysis-content');
        
        if (modal) {
            modal.classList.add('show');
        }
        
        if (content) {
            content.innerHTML = '<div class="loading"></div> AI正在分析数据...';
            
            // 模拟AI分析
            setTimeout(() => {
                content.innerHTML = this.generateAIInsight();
            }, 2000);
        }
    }
    
    /**
     * 关闭AI洞察
     */
    closeAIInsight() {
        const modal = document.getElementById('ai-insight-modal');
        if (modal) {
            modal.classList.remove('show');
        }
    }
    
    /**
     * 生成AI洞察内容
     */
    generateAIInsight() {
        const data = this.state.filteredData || this.state.currentData;
        if (!data || !data.diseases) {
            return '<p>暂无数据进行分析</p>';
        }
        
        const totalDiseases = data.diseases.length;
        const profitableDiseases = data.diseases.filter(d => d.totalBenefit > 0).length;
        const lossDiseases = totalDiseases - profitableDiseases;
        const avgProfitRate = data.diseases.reduce((sum, d) => sum + d.profitRate, 0) / totalDiseases;
        
        return `
            <h4>🔍 数据洞察分析</h4>
            <div style="margin: 20px 0;">
                <h5>📊 整体概况</h5>
                <ul>
                    <li>共分析 <strong>${totalDiseases}</strong> 个病种</li>
                    <li>盈利病种 <strong>${profitableDiseases}</strong> 个，占比 <strong>${((profitableDiseases/totalDiseases)*100).toFixed(1)}%</strong></li>
                    <li>亏损病种 <strong>${lossDiseases}</strong> 个，占比 <strong>${((lossDiseases/totalDiseases)*100).toFixed(1)}%</strong></li>
                    <li>平均利润率 <strong>${avgProfitRate.toFixed(1)}%</strong></li>
                </ul>
            </div>
            
            <div style="margin: 20px 0;">
                <h5>💡 优化建议</h5>
                <ul>
                    <li><strong>成本控制：</strong>重点关注亏损病种的成本结构，优化药品采购和人力配置</li>
                    <li><strong>收入提升：</strong>加强高利润病种的诊疗能力，提高病例数量</li>
                    <li><strong>流程优化：</strong>缩短平均住院日，提高床位周转率</li>
                    <li><strong>质量管理：</strong>降低并发症发生率，减少额外成本</li>
                </ul>
            </div>
            
            <div style="margin: 20px 0;">
                <h5>⚠️ 风险提示</h5>
                <ul>
                    <li>密切监控亏损病种的发展趋势</li>
                    <li>建立病种效益预警机制</li>
                    <li>定期评估医生绩效与病种效益的关联性</li>
                </ul>
            </div>
        `;
    }
    
    /**
     * 导出数据
     */
    exportData() {
        const data = this.state.filteredData || this.state.currentData;
        if (!data) {
            this.showMessage('暂无数据可导出', 'error');
            return;
        }
        
        try {
            // 准备导出数据
            const exportData = {
                diseases: data.diseases,
                doctorDiseases: data.doctorDiseases,
                exportTime: new Date().toLocaleString(),
                selectedDiseases: this.state.selectedDiseases
            };
            
            // 创建CSV内容
            const csvContent = this.convertToCSV(exportData.diseases);
            
            // 下载文件
            this.downloadCSV(csvContent, '病种效益分析.csv');
            
            this.showMessage('数据导出成功', 'success');
            
            if (this.callbacks.onExport) {
                this.callbacks.onExport(exportData);
            }
            
        } catch (error) {
            console.error('导出数据失败:', error);
            this.showMessage('导出失败，请稍后重试', 'error');
        }
    }
    
    /**
     * 转换为CSV格式
     */
    convertToCSV(data) {
        const headers = ['病种名称', '病例数', '总收入', '总成本', '总结余', '平均收入', '平均成本', '平均结余', '利润率', '保本例数'];
        const rows = data.map(item => [
            item.name,
            item.cases,
            item.totalRevenue,
            item.totalCost,
            item.totalBenefit,
            item.avgRevenue,
            item.avgCost,
            item.avgBenefit,
            item.profitRate.toFixed(2),
            item.breakevenCases
        ]);
        
        const csvContent = [headers, ...rows]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');
            
        return '\ufeff' + csvContent; // 添加BOM以支持中文
    }
    
    /**
     * 下载CSV文件
     */
    downloadCSV(content, filename) {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
    
    /**
     * 刷新数据
     */
    refreshData() {
        this.loadData();
    }
    
    /**
     * 显示消息
     */
    showMessage(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.className = `message message-${type}`;
        messageEl.textContent = message;
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 3000);
    }
    
    /**
     * 显示加载状态
     */
    showLoading() {
        const container = document.getElementById(this.config.containerId);
        if (container) {
            container.classList.add('loading-state');
        }
    }
    
    /**
     * 隐藏加载状态
     */
    hideLoading() {
        const container = document.getElementById(this.config.containerId);
        if (container) {
            container.classList.remove('loading-state');
        }
    }
    
    /**
     * 显示错误信息
     */
    showError(message) {
        this.showMessage(message, 'error');
    }
    
    /**
     * 调整图表大小
     */
    resizeCharts() {
        Object.values(this.state.charts).forEach(chart => {
            if (chart && typeof chart.resize === 'function') {
                chart.resize();
            }
        });
    }
    
    /**
     * 防抖函数
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    /**
     * 销毁组件
     */
    destroy() {
        // 销毁所有图表实例
        Object.values(this.state.charts).forEach(chart => {
            if (chart && typeof chart.dispose === 'function') {
                chart.dispose();
            }
        });
        
        // 清空状态
        this.state = {
            currentData: null,
            selectedDiseases: [],
            allDiseases: [],
            filteredData: null,
            isLoading: false,
            charts: {}
        };
        
        // 移除事件监听器
        window.removeEventListener('resize', this.resizeCharts);
        
        this.log('组件已销毁');
    }
    
    /**
     * 获取组件状态
     */
    getState() {
        return { ...this.state };
    }
    
    /**
     * 获取组件配置
     */
    getConfig() {
        return { ...this.config };
    }
    
    /**
     * 更新配置
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
    
    /**
     * 设置数据
     */
    setData(data) {
        this.state.currentData = data;
        this.state.filteredData = data;
        this.updateCharts();
        this.updateTables();
        this.emit('dataLoaded', data);
    }
    
    /**
     * 获取数据
     */
    getData() {
        return this.state.currentData;
    }
    
    /**
     * 获取筛选条件
     */
    getFilters() {
        return {
            selectedDiseases: this.state.selectedDiseases
        };
    }
    
    /**
     * 重置筛选条件
     */
    resetFilters() {
        this.state.selectedDiseases = [];
        this.updateFilteredData();
        this.emit('filterChanged', this.getFilters());
    }
    
    /**
     * 刷新图表
     */
    refreshCharts() {
        this.resizeCharts();
    }
    
    /**
     * 事件监听
     */
    on(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }
    
    /**
     * 移除事件监听
     */
    off(eventName, callback) {
        if (!this.events[eventName]) return;
        
        if (callback) {
            const index = this.events[eventName].indexOf(callback);
            if (index > -1) {
                this.events[eventName].splice(index, 1);
            }
        } else {
            this.events[eventName] = [];
        }
    }
    
    /**
     * 触发事件
     */
    emit(eventName, ...args) {
        if (!this.events[eventName]) return;
        
        this.events[eventName].forEach(callback => {
            try {
                callback(...args);
            } catch (error) {
                console.error(`事件回调执行错误 [${eventName}]:`, error);
            }
        });
    }
}

// 导出组件类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DiseaseBenefitComponent;
} else if (typeof window !== 'undefined') {
    window.DiseaseBenefitComponent = DiseaseBenefitComponent;
}