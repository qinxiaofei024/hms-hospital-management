/**
 * Medical Quality Safety Monitoring System - Professional Component Library
 * 医疗质量安全监测系统 - 专业组件库
 * 
 * @version 2.0.0
 * @author HMS Development Team
 * @description 专业的医疗质量安全监测组件库，提供统一的UI组件、图表组件、数据处理组件
 */

// ==================== 基础组件类 ====================

/**
 * 基础组件类 - 所有组件的父类
 */
class BaseComponent {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        this.options = { ...this.getDefaultOptions(), ...options };
        this.id = this.generateId();
        this.initialized = false;
        this.destroyed = false;
        
        if (!this.container) {
            throw new Error('Container element not found');
        }
        
        this.init();
    }
    
    getDefaultOptions() {
        return {
            theme: 'medical',
            responsive: true,
            animation: true
        };
    }
    
    generateId() {
        return `component_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    init() {
        if (this.initialized) return;
        
        this.render();
        this.bindEvents();
        this.initialized = true;
        
        this.emit('initialized');
    }
    
    render() {
        // 子类实现
    }
    
    bindEvents() {
        // 子类实现
    }
    
    emit(eventName, data = {}) {
        const event = new CustomEvent(`component:${eventName}`, {
            detail: { component: this, data, id: this.id }
        });
        document.dispatchEvent(event);
    }
    
    destroy() {
        if (this.destroyed) return;
        
        this.emit('beforeDestroy');
        this.unbindEvents();
        this.cleanup();
        this.destroyed = true;
        this.emit('destroyed');
    }
    
    unbindEvents() {
        // 子类实现
    }
    
    cleanup() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

/**
 * 统计卡片组件
 */
class StatCard extends BaseComponent {
    getDefaultOptions() {
        return {
            ...super.getDefaultOptions(),
            title: '',
            value: '',
            unit: '',
            trend: null,
            icon: 'fas fa-chart-line',
            color: 'primary',
            clickable: true,
            showTrend: true
        };
    }
    
    render() {
        const { title, value, unit, trend, icon, color, showTrend } = this.options;
        
        this.container.className = `stat-card stat-card-${color} ${this.options.clickable ? 'clickable' : ''}`;
        this.container.innerHTML = `
            <div class="stat-card-icon">
                <i class="${icon}"></i>
            </div>
            <div class="stat-card-content">
                <div class="stat-card-title">${title}</div>
                <div class="stat-card-value">
                    ${value}
                    ${unit ? `<span class="stat-card-unit">${unit}</span>` : ''}
                </div>
                ${showTrend && trend ? `
                    <div class="stat-card-trend ${trend.type}">
                        <i class="fas fa-arrow-${trend.type === 'up' ? 'up' : 'down'}"></i>
                        ${trend.value}
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    bindEvents() {
        if (this.options.clickable) {
            this.container.addEventListener('click', () => {
                this.emit('click', this.options);
            });
        }
    }
    
    updateValue(value, unit = null) {
        const valueElement = this.container.querySelector('.stat-card-value');
        if (valueElement) {
            valueElement.innerHTML = `
                ${value}
                ${unit || this.options.unit ? `<span class="stat-card-unit">${unit || this.options.unit}</span>` : ''}
            `;
        }
        this.options.value = value;
        if (unit) this.options.unit = unit;
    }
    
    updateTrend(trend) {
        const trendElement = this.container.querySelector('.stat-card-trend');
        if (trendElement && trend) {
            trendElement.className = `stat-card-trend ${trend.type}`;
            trendElement.innerHTML = `
                <i class="fas fa-arrow-${trend.type === 'up' ? 'up' : 'down'}"></i>
                ${trend.value}
            `;
        }
        this.options.trend = trend;
    }
}

/**
 * 数据表格组件
 */
class DataTable extends BaseComponent {
    getDefaultOptions() {
        return {
            ...super.getDefaultOptions(),
            data: [],
            columns: [],
            searchable: true,
            sortable: true,
            selectable: true,
            pagination: true,
            pageSize: 10,
            showHeader: true,
            striped: true,
            bordered: true
        };
    }
    
    render() {
        const { searchable, showHeader, striped, bordered } = this.options;
        
        this.container.className = `data-table-container ${striped ? 'striped' : ''} ${bordered ? 'bordered' : ''}`;
        this.container.innerHTML = `
            ${searchable ? `
                <div class="table-controls">
                    <div class="table-search-container">
                        <input type="text" class="table-search" placeholder="搜索...">
                        <i class="fas fa-search"></i>
                    </div>
                </div>
            ` : ''}
            <div class="table-wrapper">
                <table class="data-table">
                    ${showHeader ? this.renderHeader() : ''}
                    <tbody class="table-body">
                        ${this.renderBody()}
                    </tbody>
                </table>
            </div>
            ${this.options.pagination ? '<div class="table-pagination"></div>' : ''}
        `;
        
        this.initPagination();
    }
    
    renderHeader() {
        const { columns, sortable } = this.options;
        return `
            <thead class="table-header">
                <tr>
                    ${columns.map(col => `
                        <th data-column="${col.key}" ${sortable ? 'data-sortable="true"' : ''}>
                            ${col.title}
                            ${sortable ? '<i class="fas fa-sort sort-icon"></i>' : ''}
                        </th>
                    `).join('')}
                </tr>
            </thead>
        `;
    }
    
    renderBody() {
        const { data, columns } = this.options;
        return data.map(row => `
            <tr data-row-id="${row.id || ''}">
                ${columns.map(col => `
                    <td data-column="${col.key}">
                        ${this.formatCellValue(row[col.key], col)}
                    </td>
                `).join('')}
            </tr>
        `).join('');
    }
    
    formatCellValue(value, column) {
        if (column.formatter && typeof column.formatter === 'function') {
            return column.formatter(value);
        }
        return value || '';
    }
    
    bindEvents() {
        // 搜索功能
        if (this.options.searchable) {
            const searchInput = this.container.querySelector('.table-search');
            searchInput?.addEventListener('input', (e) => {
                this.search(e.target.value);
            });
        }
        
        // 排序功能
        if (this.options.sortable) {
            const headers = this.container.querySelectorAll('th[data-sortable]');
            headers.forEach(header => {
                header.addEventListener('click', () => {
                    this.sort(header.dataset.column);
                });
            });
        }
        
        // 行选择功能
        if (this.options.selectable) {
            const rows = this.container.querySelectorAll('tbody tr');
            rows.forEach(row => {
                row.addEventListener('click', () => {
                    this.selectRow(row);
                });
            });
        }
    }
    
    search(term) {
        const rows = this.container.querySelectorAll('tbody tr');
        const searchTerm = term.toLowerCase();
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
        
        this.emit('search', { term });
    }
    
    sort(column) {
        // 排序逻辑实现
        this.emit('sort', { column });
    }
    
    selectRow(row) {
        // 清除其他选中状态
        this.container.querySelectorAll('tbody tr').forEach(r => {
            r.classList.remove('selected');
        });
        
        // 选中当前行
        row.classList.add('selected');
        
        const rowData = this.getRowData(row);
        this.emit('rowSelect', { row, data: rowData });
    }
    
    getRowData(row) {
        const data = {};
        const cells = row.querySelectorAll('td');
        this.options.columns.forEach((col, index) => {
            data[col.key] = cells[index]?.textContent || '';
        });
        return data;
    }
    
    initPagination() {
        if (!this.options.pagination) return;
        
        // 分页逻辑实现
        const paginationContainer = this.container.querySelector('.table-pagination');
        if (paginationContainer) {
            // 分页控件渲染
        }
    }
    
    updateData(newData) {
        this.options.data = newData;
        const tbody = this.container.querySelector('.table-body');
        if (tbody) {
            tbody.innerHTML = this.renderBody();
            this.bindEvents(); // 重新绑定事件
        }
    }
}

/**
 * 医疗图表组件
 */
class MedicalChart extends BaseComponent {
    getDefaultOptions() {
        return {
            ...super.getDefaultOptions(),
            type: 'line',
            data: [],
            title: '',
            subtitle: '',
            xAxis: {},
            yAxis: {},
            legend: true,
            tooltip: true,
            grid: {},
            colors: ['#2c5aa0', '#28a745', '#ffc107', '#dc3545', '#17a2b8']
        };
    }
    
    render() {
        this.container.className = 'medical-chart-container';
        this.container.innerHTML = `
            <div class="chart-header">
                ${this.options.title ? `<h3 class="chart-title">${this.options.title}</h3>` : ''}
                ${this.options.subtitle ? `<p class="chart-subtitle">${this.options.subtitle}</p>` : ''}
            </div>
            <div class="chart-content" style="width: 100%; height: 400px;"></div>
        `;
        
        this.initChart();
    }
    
    initChart() {
        const chartContainer = this.container.querySelector('.chart-content');
        this.chart = echarts.init(chartContainer);
        
        const option = this.buildChartOption();
        this.chart.setOption(option);
        
        // 响应式处理
        if (this.options.responsive) {
            window.addEventListener('resize', () => {
                this.chart.resize();
            });
        }
    }
    
    buildChartOption() {
        const { type, data, xAxis, yAxis, legend, tooltip, grid, colors } = this.options;
        
        const baseOption = {
            color: colors,
            tooltip: tooltip ? {
                trigger: 'axis',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: '#e9ecef',
                borderWidth: 1,
                textStyle: { color: '#333' }
            } : false,
            legend: legend ? {
                top: 10,
                textStyle: { color: '#666' }
            } : false,
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true,
                ...grid
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                axisLine: { lineStyle: { color: '#e9ecef' } },
                axisTick: { lineStyle: { color: '#e9ecef' } },
                axisLabel: { color: '#666' },
                ...xAxis
            },
            yAxis: {
                type: 'value',
                axisLine: { lineStyle: { color: '#e9ecef' } },
                axisTick: { lineStyle: { color: '#e9ecef' } },
                axisLabel: { color: '#666' },
                splitLine: { lineStyle: { color: '#f8f9fa' } },
                ...yAxis
            },
            series: this.buildSeries()
        };
        
        return baseOption;
    }
    
    buildSeries() {
        const { type, data } = this.options;
        
        if (Array.isArray(data) && data.length > 0) {
            return data.map(series => ({
                name: series.name,
                type: type,
                data: series.data,
                smooth: type === 'line',
                symbol: 'circle',
                symbolSize: 6,
                lineStyle: { width: 2 },
                areaStyle: type === 'area' ? { opacity: 0.3 } : undefined
            }));
        }
        
        return [];
    }
    
    updateData(newData) {
        this.options.data = newData;
        const option = this.buildChartOption();
        this.chart.setOption(option, true);
    }
    
    destroy() {
        if (this.chart) {
            this.chart.dispose();
        }
        super.destroy();
    }
}

/**
 * 质量指标组件
 */
class QualityIndicator extends BaseComponent {
    getDefaultOptions() {
        return {
            ...super.getDefaultOptions(),
            title: '',
            value: 0,
            target: 100,
            unit: '%',
            status: 'normal', // normal, warning, danger
            showProgress: true,
            showTarget: true,
            format: 'percentage'
        };
    }
    
    render() {
        const { title, value, target, unit, status, showProgress, showTarget, format } = this.options;
        
        const percentage = target > 0 ? (value / target * 100) : 0;
        const formattedValue = this.formatValue(value, format);
        
        this.container.className = `quality-indicator indicator-${status}`;
        this.container.innerHTML = `
            <div class="indicator-header">
                <h4 class="indicator-title">${title}</h4>
                <div class="indicator-status">
                    <span class="status-dot"></span>
                    <span class="status-text">${this.getStatusText(status)}</span>
                </div>
            </div>
            <div class="indicator-content">
                <div class="indicator-value">
                    ${formattedValue}
                    <span class="indicator-unit">${unit}</span>
                </div>
                ${showTarget ? `
                    <div class="indicator-target">
                        目标: ${this.formatValue(target, format)}${unit}
                    </div>
                ` : ''}
                ${showProgress ? `
                    <div class="indicator-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${Math.min(percentage, 100)}%"></div>
                        </div>
                        <span class="progress-text">${percentage.toFixed(1)}%</span>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    formatValue(value, format) {
        switch (format) {
            case 'percentage':
                return value.toFixed(1);
            case 'integer':
                return Math.round(value);
            case 'decimal':
                return value.toFixed(2);
            default:
                return value;
        }
    }
    
    getStatusText(status) {
        const statusMap = {
            normal: '正常',
            warning: '警告',
            danger: '危险',
            excellent: '优秀'
        };
        return statusMap[status] || '未知';
    }
    
    updateValue(newValue) {
        this.options.value = newValue;
        this.render();
    }
    
    updateStatus(newStatus) {
        this.options.status = newStatus;
        this.container.className = `quality-indicator indicator-${newStatus}`;
        
        const statusDot = this.container.querySelector('.status-dot');
        const statusText = this.container.querySelector('.status-text');
        if (statusText) {
            statusText.textContent = this.getStatusText(newStatus);
        }
    }
}

/**
 * 模态框组件
 */
class Modal extends BaseComponent {
    getDefaultOptions() {
        return {
            ...super.getDefaultOptions(),
            title: '',
            content: '',
            size: 'medium', // small, medium, large
            closable: true,
            backdrop: true,
            keyboard: true,
            footer: true,
            buttons: []
        };
    }
    
    render() {
        const { title, content, size, closable, footer, buttons } = this.options;
        
        // 创建模态框覆盖层
        this.backdrop = document.createElement('div');
        this.backdrop.className = 'modal-backdrop';
        
        // 创建模态框
        this.modal = document.createElement('div');
        this.modal.className = `modal modal-${size}`;
        this.modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">${title}</h4>
                    ${closable ? '<button class="modal-close" type="button">&times;</button>' : ''}
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                ${footer ? `
                    <div class="modal-footer">
                        ${buttons.map(btn => `
                            <button class="btn btn-${btn.type || 'secondary'}" data-action="${btn.action || ''}">
                                ${btn.text}
                            </button>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
        
        document.body.appendChild(this.backdrop);
        document.body.appendChild(this.modal);
        
        // 显示动画
        setTimeout(() => {
            this.backdrop.classList.add('show');
            this.modal.classList.add('show');
        }, 10);
    }
    
    bindEvents() {
        // 关闭按钮
        const closeBtn = this.modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hide());
        }
        
        // 背景点击关闭
        if (this.options.backdrop) {
            this.backdrop.addEventListener('click', () => this.hide());
        }
        
        // 键盘ESC关闭
        if (this.options.keyboard) {
            this.keyboardHandler = (e) => {
                if (e.key === 'Escape') this.hide();
            };
            document.addEventListener('keydown', this.keyboardHandler);
        }
        
        // 按钮事件
        const buttons = this.modal.querySelectorAll('.modal-footer button');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                this.emit('buttonClick', { action, button: btn });
                
                if (action === 'close' || action === 'cancel') {
                    this.hide();
                }
            });
        });
    }
    
    show() {
        this.backdrop.classList.add('show');
        this.modal.classList.add('show');
        document.body.classList.add('modal-open');
    }
    
    hide() {
        this.backdrop.classList.remove('show');
        this.modal.classList.remove('show');
        document.body.classList.remove('modal-open');
        
        setTimeout(() => {
            this.destroy();
        }, 300);
    }
    
    unbindEvents() {
        if (this.keyboardHandler) {
            document.removeEventListener('keydown', this.keyboardHandler);
        }
    }
    
    cleanup() {
        if (this.backdrop && this.backdrop.parentNode) {
            this.backdrop.parentNode.removeChild(this.backdrop);
        }
        if (this.modal && this.modal.parentNode) {
            this.modal.parentNode.removeChild(this.modal);
        }
        document.body.classList.remove('modal-open');
    }
}

/**
 * 通知组件
 */
class Notification {
    static show(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="notification-icon fas fa-${this.getIcon(type)}"></i>
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // 添加到页面
        let container = document.querySelector('.notification-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        
        container.appendChild(notification);
        
        // 显示动画
        setTimeout(() => notification.classList.add('show'), 10);
        
        // 关闭事件
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.hide(notification));
        
        // 自动关闭
        if (duration > 0) {
            setTimeout(() => this.hide(notification), duration);
        }
        
        return notification;
    }
    
    static hide(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    static getIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

/**
 * 主要的医疗质量组件库类
 */
class MedicalQualityComponents {
    constructor() {
        this.components = new Map();
        this.charts = new Map();
        this.initialized = false;
        
        console.log('MedicalQualityComponents v2.0 initialized');
    }

    /**
     * Initialize component system
     */
    async init() {
        if (this.initialized) {
            console.log('MedicalQualityComponents already initialized');
            return;
        }

        try {
            // 注册组件类型
            this.registerComponentTypes();
            
            // 初始化全局样式
            this.initGlobalStyles();
            
            // 初始化事件监听
            this.initEventListeners();
            
            // 自动初始化页面中的组件
            this.autoInitComponents();
            
            this.initialized = true;
            
            // Dispatch ready event
            const event = new CustomEvent('medicalQualityComponentsReady', {
                detail: { timestamp: Date.now(), version: '2.0.0' }
            });
            document.dispatchEvent(event);
            
            console.log('MedicalQualityComponents v2.0 initialization completed');
        } catch (error) {
            console.error('Failed to initialize MedicalQualityComponents:', error);
        }
    }
    
    /**
     * 注册组件类型
     */
    registerComponentTypes() {
        this.componentTypes = {
            'stat-card': StatCard,
            'data-table': DataTable,
            'medical-chart': MedicalChart,
            'quality-indicator': QualityIndicator,
            'modal': Modal
        };
        
        console.log('Component types registered:', Object.keys(this.componentTypes));
    }
    
    /**
     * 初始化全局样式
     */
    initGlobalStyles() {
        if (document.querySelector('#medical-quality-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'medical-quality-styles';
        styles.textContent = this.getGlobalStyles();
        document.head.appendChild(styles);
    }
    
    /**
     * 获取全局样式
     */
    getGlobalStyles() {
        return `
            /* 统计卡片样式 */
            .stat-card {
                background: #fff;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 16px;
            }
            
            .stat-card.clickable {
                cursor: pointer;
            }
            
            .stat-card.clickable:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            
            .stat-card-icon {
                width: 48px;
                height: 48px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                color: #fff;
                background: linear-gradient(135deg, #2c5aa0, #4a7bc8);
            }
            
            .stat-card-content {
                flex: 1;
            }
            
            .stat-card-title {
                font-size: 14px;
                color: #666;
                margin-bottom: 4px;
            }
            
            .stat-card-value {
                font-size: 24px;
                font-weight: 600;
                color: #333;
                margin-bottom: 4px;
            }
            
            .stat-card-unit {
                font-size: 16px;
                color: #999;
                margin-left: 4px;
            }
            
            .stat-card-trend {
                font-size: 12px;
                display: flex;
                align-items: center;
                gap: 4px;
            }
            
            .stat-card-trend.up {
                color: #28a745;
            }
            
            .stat-card-trend.down {
                color: #dc3545;
            }
            
            /* 数据表格样式 */
            .data-table-container {
                background: #fff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            
            .table-controls {
                padding: 16px;
                border-bottom: 1px solid #e9ecef;
                background: #f8f9fa;
            }
            
            .table-search-container {
                position: relative;
                max-width: 300px;
            }
            
            .table-search {
                width: 100%;
                padding: 8px 12px 8px 36px;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 14px;
            }
            
            .table-search-container i {
                position: absolute;
                left: 12px;
                top: 50%;
                transform: translateY(-50%);
                color: #999;
            }
            
            .data-table {
                width: 100%;
                border-collapse: collapse;
            }
            
            .data-table th,
            .data-table td {
                padding: 12px;
                text-align: left;
                border-bottom: 1px solid #e9ecef;
            }
            
            .data-table th {
                background: #f8f9fa;
                font-weight: 600;
                color: #333;
                cursor: pointer;
            }
            
            .data-table tbody tr:hover {
                background: #f8f9fa;
            }
            
            .data-table tbody tr.selected {
                background: #e3f2fd;
            }
            
            /* 医疗图表样式 */
            .medical-chart-container {
                background: #fff;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            
            .chart-header {
                margin-bottom: 16px;
            }
            
            .chart-title {
                font-size: 18px;
                font-weight: 600;
                color: #333;
                margin: 0 0 4px 0;
            }
            
            .chart-subtitle {
                font-size: 14px;
                color: #666;
                margin: 0;
            }
            
            /* 质量指标样式 */
            .quality-indicator {
                background: #fff;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                border-left: 4px solid #2c5aa0;
            }
            
            .quality-indicator.indicator-warning {
                border-left-color: #ffc107;
            }
            
            .quality-indicator.indicator-danger {
                border-left-color: #dc3545;
            }
            
            .quality-indicator.indicator-excellent {
                border-left-color: #28a745;
            }
            
            .indicator-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
            }
            
            .indicator-title {
                font-size: 16px;
                font-weight: 600;
                color: #333;
                margin: 0;
            }
            
            .indicator-status {
                display: flex;
                align-items: center;
                gap: 6px;
            }
            
            .status-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #2c5aa0;
            }
            
            .indicator-warning .status-dot {
                background: #ffc107;
            }
            
            .indicator-danger .status-dot {
                background: #dc3545;
            }
            
            .indicator-excellent .status-dot {
                background: #28a745;
            }
            
            .status-text {
                font-size: 12px;
                color: #666;
            }
            
            .indicator-value {
                font-size: 32px;
                font-weight: 700;
                color: #333;
                margin-bottom: 8px;
            }
            
            .indicator-unit {
                font-size: 18px;
                color: #999;
                margin-left: 4px;
            }
            
            .indicator-target {
                font-size: 14px;
                color: #666;
                margin-bottom: 12px;
            }
            
            .indicator-progress {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .progress-bar {
                flex: 1;
                height: 8px;
                background: #e9ecef;
                border-radius: 4px;
                overflow: hidden;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #2c5aa0, #4a7bc8);
                transition: width 0.3s ease;
            }
            
            .progress-text {
                font-size: 12px;
                color: #666;
                min-width: 40px;
            }
            
            /* 模态框样式 */
            .modal-backdrop {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .modal-backdrop.show {
                opacity: 1;
            }
            
            .modal {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.9);
                z-index: 1001;
                opacity: 0;
                transition: all 0.3s ease;
            }
            
            .modal.show {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
            
            .modal-content {
                background: #fff;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.2);
                max-width: 90vw;
                max-height: 90vh;
                overflow: hidden;
            }
            
            .modal-medium .modal-content {
                width: 600px;
            }
            
            .modal-large .modal-content {
                width: 800px;
            }
            
            .modal-small .modal-content {
                width: 400px;
            }
            
            .modal-header {
                padding: 20px;
                border-bottom: 1px solid #e9ecef;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .modal-title {
                font-size: 18px;
                font-weight: 600;
                color: #333;
                margin: 0;
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: 24px;
                color: #999;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .modal-body {
                padding: 20px;
                max-height: 60vh;
                overflow-y: auto;
            }
            
            .modal-footer {
                padding: 20px;
                border-top: 1px solid #e9ecef;
                display: flex;
                justify-content: flex-end;
                gap: 12px;
            }
            
            /* 通知样式 */
            .notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 2000;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            
            .notification {
                background: #fff;
                border-radius: 8px;
                box-shadow: 0 4px 16px rgba(0,0,0,0.15);
                min-width: 300px;
                transform: translateX(100%);
                opacity: 0;
                transition: all 0.3s ease;
            }
            
            .notification.show {
                transform: translateX(0);
                opacity: 1;
            }
            
            .notification-content {
                padding: 16px;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .notification-icon {
                font-size: 18px;
            }
            
            .notification-success .notification-icon {
                color: #28a745;
            }
            
            .notification-error .notification-icon {
                color: #dc3545;
            }
            
            .notification-warning .notification-icon {
                color: #ffc107;
            }
            
            .notification-info .notification-icon {
                color: #17a2b8;
            }
            
            .notification-message {
                flex: 1;
                font-size: 14px;
                color: #333;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 18px;
                color: #999;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            /* 按钮样式 */
            .btn {
                padding: 8px 16px;
                border: none;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
            }
            
            .btn-primary {
                background: #2c5aa0;
                color: #fff;
            }
            
            .btn-primary:hover {
                background: #1e3f73;
            }
            
            .btn-secondary {
                background: #6c757d;
                color: #fff;
            }
            
            .btn-secondary:hover {
                background: #545b62;
            }
            
            .btn-success {
                background: #28a745;
                color: #fff;
            }
            
            .btn-success:hover {
                background: #1e7e34;
            }
            
            .btn-danger {
                background: #dc3545;
                color: #fff;
            }
            
            .btn-danger:hover {
                background: #c82333;
            }
            
            /* 响应式设计 */
            @media (max-width: 768px) {
                .stat-card {
                    flex-direction: column;
                    text-align: center;
                    gap: 12px;
                }
                
                .modal-content {
                    margin: 20px;
                    width: auto !important;
                }
                
                .notification-container {
                    left: 20px;
                    right: 20px;
                }
                
                .notification {
                    min-width: auto;
                }
            }
        `;
    }
    
    /**
     * 初始化事件监听
     */
    initEventListeners() {
        // 监听组件事件
        document.addEventListener('component:initialized', (e) => {
            const { component, id } = e.detail;
            this.components.set(id, component);
            console.log(`Component registered: ${id}`);
        });
        
        document.addEventListener('component:destroyed', (e) => {
            const { id } = e.detail;
            this.components.delete(id);
            console.log(`Component unregistered: ${id}`);
        });
        
        // 响应式处理
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    /**
     * 自动初始化页面中的组件
     */
    autoInitComponents() {
        // 查找具有 data-component 属性的元素
        const elements = document.querySelectorAll('[data-component]');
        
        elements.forEach(element => {
            const componentType = element.dataset.component;
            const options = this.parseComponentOptions(element);
            
            if (this.componentTypes[componentType]) {
                try {
                    new this.componentTypes[componentType](element, options);
                } catch (error) {
                    console.error(`Failed to initialize component ${componentType}:`, error);
                }
            }
        });
        
        console.log(`Auto-initialized ${elements.length} components`);
    }
    
    /**
     * 解析组件选项
     */
    parseComponentOptions(element) {
        const options = {};
        
        // 从 data-* 属性中解析选项
        for (const attr of element.attributes) {
            if (attr.name.startsWith('data-') && attr.name !== 'data-component') {
                const key = attr.name.replace('data-', '').replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                let value = attr.value;
                
                // 尝试解析为JSON
                try {
                    value = JSON.parse(value);
                } catch (e) {
                    // 保持原始字符串值
                }
                
                options[key] = value;
            }
        }
        
        return options;
    }
    
    /**
     * 处理窗口大小变化
     */
    handleResize() {
        // 重新调整所有图表大小
        this.charts.forEach(chart => {
            if (chart && typeof chart.resize === 'function') {
                chart.resize();
            }
        });
        
        // 通知所有组件
        this.components.forEach(component => {
            if (component && typeof component.handleResize === 'function') {
                component.handleResize();
            }
        });
    }
    
    /**
     * 创建统计卡片
     */
    createStatCard(container, options) {
        const element = typeof container === 'string' ? document.querySelector(container) : container;
        if (!element) {
            console.error('StatCard container not found');
            return null;
        }
        
        return new StatCard(element, options);
    }
    
    /**
     * 创建数据表格
     */
    createDataTable(container, options) {
        const element = typeof container === 'string' ? document.querySelector(container) : container;
        if (!element) {
            console.error('DataTable container not found');
            return null;
        }
        
        return new DataTable(element, options);
    }
    
    /**
     * 创建医疗图表
     */
    createMedicalChart(container, options) {
        const element = typeof container === 'string' ? document.querySelector(container) : container;
        if (!element) {
            console.error('MedicalChart container not found');
            return null;
        }
        
        return new MedicalChart(element, options);
    }
    
    /**
     * 创建质量指标
     */
    createQualityIndicator(container, options) {
        const element = typeof container === 'string' ? document.querySelector(container) : container;
        if (!element) {
            console.error('QualityIndicator container not found');
            return null;
        }
        
        return new QualityIndicator(element, options);
    }
    
    /**
     * 创建模态框
     */
    createModal(options) {
        return new Modal(null, options);
    }
    
    /**
     * 显示通知
     */
    showNotification(message, type = 'info', duration = 3000) {
        return Notification.show(message, type, duration);
    }
    
    /**
     * 获取组件实例
     */
    getComponent(id) {
        return this.components.get(id);
    }
    
    /**
     * 获取图表实例
     */
    getChart(id) {
        return this.charts.get(id);
    }
    
    /**
     * 销毁组件
     */
    destroyComponent(id) {
        const component = this.components.get(id);
        if (component && typeof component.destroy === 'function') {
            component.destroy();
            this.components.delete(id);
            return true;
        }
        return false;
    }
    
    /**
     * 销毁所有组件
     */
    destroyAll() {
        this.components.forEach((component, id) => {
            if (typeof component.destroy === 'function') {
                component.destroy();
            }
        });
        this.components.clear();
        
        this.charts.forEach((chart, id) => {
            if (chart && typeof chart.dispose === 'function') {
                chart.dispose();
            }
        });
        this.charts.clear();
        
        console.log('All components destroyed');
    }
    
    /**
     * 数据处理工具
     */
    static DataProcessor = {
        /**
         * 格式化数字
         */
        formatNumber(value, decimals = 2) {
            if (typeof value !== 'number') return value;
            return Number(value.toFixed(decimals));
        },
        
        /**
         * 格式化百分比
         */
        formatPercentage(value, decimals = 1) {
            if (typeof value !== 'number') return value;
            return `${(value * 100).toFixed(decimals)}%`;
        },
        
        /**
         * 格式化日期
         */
        formatDate(date, format = 'YYYY-MM-DD') {
            if (!date) return '';
            
            const d = new Date(date);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const hour = String(d.getHours()).padStart(2, '0');
            const minute = String(d.getMinutes()).padStart(2, '0');
            const second = String(d.getSeconds()).padStart(2, '0');
            
            return format
                .replace('YYYY', year)
                .replace('MM', month)
                .replace('DD', day)
                .replace('HH', hour)
                .replace('mm', minute)
                .replace('ss', second);
        },
        
        /**
         * 计算趋势
         */
        calculateTrend(current, previous) {
            if (!previous || previous === 0) return 0;
            return ((current - previous) / previous) * 100;
        },
        
        /**
         * 数据分组
         */
        groupBy(array, key) {
            return array.reduce((groups, item) => {
                const group = item[key];
                if (!groups[group]) {
                    groups[group] = [];
                }
                groups[group].push(item);
                return groups;
            }, {});
        },
        
        /**
         * 数据排序
         */
        sortBy(array, key, direction = 'asc') {
            return [...array].sort((a, b) => {
                const aVal = a[key];
                const bVal = b[key];
                
                if (direction === 'asc') {
                    return aVal > bVal ? 1 : -1;
                } else {
                    return aVal < bVal ? 1 : -1;
                }
            });
        },
        
        /**
         * 数据过滤
         */
        filterBy(array, filters) {
            return array.filter(item => {
                return Object.entries(filters).every(([key, value]) => {
                    if (Array.isArray(value)) {
                        return value.includes(item[key]);
                    }
                    return item[key] === value;
                });
            });
        },
        
        /**
         * 计算统计信息
         */
        calculateStats(array, key) {
            if (!array.length) return null;
            
            const values = array.map(item => item[key]).filter(val => typeof val === 'number');
            if (!values.length) return null;
            
            const sum = values.reduce((a, b) => a + b, 0);
            const avg = sum / values.length;
            const min = Math.min(...values);
            const max = Math.max(...values);
            
            // 计算中位数
            const sorted = [...values].sort((a, b) => a - b);
            const median = sorted.length % 2 === 0
                ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
                : sorted[Math.floor(sorted.length / 2)];
            
            return { sum, avg, min, max, median, count: values.length };
        }
    };
    
    /**
     * 图表工具
     */
    static ChartUtils = {
        /**
         * 获取默认颜色主题
         */
        getColorTheme() {
            return [
                '#2c5aa0', '#4a7bc8', '#6fa8dc', '#9fc5e8',
                '#28a745', '#5cb85c', '#8bc34a', '#cddc39',
                '#ffc107', '#ff9800', '#ff5722', '#e91e63',
                '#9c27b0', '#673ab7', '#3f51b5', '#2196f3'
            ];
        },
        
        /**
         * 生成渐变色
         */
        generateGradient(startColor, endColor) {
            return {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                    { offset: 0, color: startColor },
                    { offset: 1, color: endColor }
                ]
            };
        },
        
        /**
         * 格式化图表数据
         */
        formatChartData(data, xKey, yKey) {
            return data.map(item => [item[xKey], item[yKey]]);
        },
        
        /**
         * 生成时间序列数据
         */
        generateTimeSeriesData(startDate, endDate, interval = 'day') {
            const data = [];
            const start = new Date(startDate);
            const end = new Date(endDate);
            
            let current = new Date(start);
            while (current <= end) {
                data.push(new Date(current));
                
                switch (interval) {
                    case 'hour':
                        current.setHours(current.getHours() + 1);
                        break;
                    case 'day':
                        current.setDate(current.getDate() + 1);
                        break;
                    case 'week':
                        current.setDate(current.getDate() + 7);
                        break;
                    case 'month':
                        current.setMonth(current.getMonth() + 1);
                        break;
                }
            }
            
            return data;
        }
    };
    
    /**
     * 医疗数据工具
     */
    static MedicalUtils = {
        /**
         * 计算质量评分
         */
        calculateQualityScore(metrics) {
            const weights = {
                safety: 0.3,
                effectiveness: 0.25,
                efficiency: 0.2,
                satisfaction: 0.15,
                compliance: 0.1
            };
            
            let totalScore = 0;
            let totalWeight = 0;
            
            Object.entries(weights).forEach(([key, weight]) => {
                if (metrics[key] !== undefined) {
                    totalScore += metrics[key] * weight;
                    totalWeight += weight;
                }
            });
            
            return totalWeight > 0 ? totalScore / totalWeight : 0;
        },
        
        /**
         * 获取质量等级
         */
        getQualityLevel(score) {
            if (score >= 90) return { level: 'excellent', label: '优秀', color: '#28a745' };
            if (score >= 80) return { level: 'good', label: '良好', color: '#17a2b8' };
            if (score >= 70) return { level: 'fair', label: '合格', color: '#ffc107' };
            if (score >= 60) return { level: 'poor', label: '待改进', color: '#fd7e14' };
            return { level: 'critical', label: '需要关注', color: '#dc3545' };
        },
        
        /**
         * 计算风险等级
         */
        calculateRiskLevel(indicators) {
            const riskFactors = {
                mortality: { weight: 0.4, threshold: 5 },
                infection: { weight: 0.3, threshold: 10 },
                readmission: { weight: 0.2, threshold: 15 },
                complication: { weight: 0.1, threshold: 8 }
            };
            
            let riskScore = 0;
            Object.entries(riskFactors).forEach(([key, config]) => {
                if (indicators[key] !== undefined) {
                    const ratio = indicators[key] / config.threshold;
                    riskScore += Math.min(ratio, 2) * config.weight;
                }
            });
            
            if (riskScore <= 0.5) return { level: 'low', label: '低风险', color: '#28a745' };
            if (riskScore <= 1.0) return { level: 'medium', label: '中风险', color: '#ffc107' };
            if (riskScore <= 1.5) return { level: 'high', label: '高风险', color: '#fd7e14' };
            return { level: 'critical', label: '极高风险', color: '#dc3545' };
        },
        
        /**
         * 生成医疗报告
         */
        generateReport(data, template = 'standard') {
            const report = {
                timestamp: new Date().toISOString(),
                template,
                summary: {},
                details: data,
                recommendations: []
            };
            
            // 根据模板生成不同的报告内容
            switch (template) {
                case 'quality':
                    report.summary = this.generateQualitySummary(data);
                    break;
                case 'safety':
                    report.summary = this.generateSafetySummary(data);
                    break;
                case 'performance':
                    report.summary = this.generatePerformanceSummary(data);
                    break;
                default:
                    report.summary = this.generateStandardSummary(data);
            }
            
            return report;
        },
        
        /**
         * 生成质量摘要
         */
        generateQualitySummary(data) {
            return {
                overallScore: this.calculateQualityScore(data.metrics || {}),
                keyIndicators: data.indicators || [],
                trends: data.trends || {},
                alerts: data.alerts || []
            };
        },
        
        /**
         * 生成安全摘要
         */
        generateSafetySummary(data) {
            return {
                riskLevel: this.calculateRiskLevel(data.indicators || {}),
                incidents: data.incidents || [],
                preventiveMeasures: data.measures || [],
                compliance: data.compliance || {}
            };
        },
        
        /**
         * 生成性能摘要
         */
        generatePerformanceSummary(data) {
            return {
                efficiency: data.efficiency || {},
                productivity: data.productivity || {},
                utilization: data.utilization || {},
                benchmarks: data.benchmarks || {}
            };
        },
        
        /**
         * 生成标准摘要
         */
        generateStandardSummary(data) {
            return {
                overview: data.overview || {},
                statistics: data.statistics || {},
                highlights: data.highlights || [],
                issues: data.issues || []
            };
        }
    };

    /**
     * 兼容性方法 - 保持向后兼容
     */
    
    // 统计卡片相关
    initStatCards() {
        console.warn('initStatCards is deprecated. Use auto-initialization with data-component="stat-card"');
        this.autoInitComponents();
    }
    
    // 图表控制相关
    initChartControls() {
        console.warn('initChartControls is deprecated. Chart controls are now handled by individual chart components');
    }
    
    // 表格功能相关
    initTableFeatures() {
        console.warn('initTableFeatures is deprecated. Use auto-initialization with data-component="data-table"');
        this.autoInitComponents();
    }
    
    // 响应式处理
    initResponsiveHandlers() {
        console.warn('initResponsiveHandlers is deprecated. Responsive handling is now automatic');
    }

    // Legacy methods - deprecated, use new component architecture instead
    
    /**
     * @deprecated Use DataTable component instead
     */
    sortTable(table, column, direction) {
        console.warn('sortTable is deprecated. Use DataTable component instead.');
        // Fallback implementation for compatibility
        const dataTable = new DataTable(table.parentElement, {
            data: this.extractTableData(table),
            sortable: true
        });
        dataTable.render();
    }

    /**
     * @deprecated Use DataTable component instead
     */
    addTableRowSelection(table) {
        console.warn('addTableRowSelection is deprecated. Use DataTable component with selectable option instead.');
    }

    /**
     * @deprecated Use DataTable component instead
     */
    addTablePagination(table) {
        console.warn('addTablePagination is deprecated. Use DataTable component with pagination option instead.');
    }

    /**
     * @deprecated Use auto-initialization or component-specific handling
     */
    initResponsiveHandlers() {
        console.warn('initResponsiveHandlers is deprecated. Responsive handling is now automatic.');
    }

    /**
     * @deprecated Use MedicalChart component instead
     */
    updateChartsTimeRange(timeRange) {
        console.warn('updateChartsTimeRange is deprecated. Use MedicalChart component methods instead.');
    }

    /**
     * @deprecated Use MedicalChart component instead
     */
    updateChartType(chartType) {
        console.warn('updateChartType is deprecated. Use MedicalChart component methods instead.');
    }

    /**
     * @deprecated Use MedicalChart component instead
     */
    exportChart(format) {
        console.warn('exportChart is deprecated. Use MedicalChart component export methods instead.');
    }

    /**
     * @deprecated Use createStatCard factory method instead
     */
    createStatCard(container, data) {
        console.warn('This createStatCard method is deprecated. Use MedicalQualityComponents.createStatCard() instead.');
        // 直接创建StatCard实例，避免递归
        const element = typeof container === 'string' ? document.querySelector(container) : container;
        if (!element) {
            console.error('StatCard container not found');
            return null;
        }
        return new StatCard(element, data);
    }

    /**
     * @deprecated Use QualityIndicator component instead
     */
    updateIndicatorValue(indicatorId, value, trend) {
        console.warn('updateIndicatorValue is deprecated. Use QualityIndicator component methods instead.');
    }

    /**
     * @deprecated Use registerComponent instead
     */
    registerChart(id, chart) {
        console.warn('registerChart is deprecated. Use registerComponent instead.');
        this.charts.set(id, chart);
    }

    /**
     * @deprecated Use getComponent instead
     */
    getChart(id) {
        console.warn('getChart is deprecated. Use getComponent instead.');
        return this.charts.get(id);
    }

    /**
     * Extract table data for migration to DataTable component
     */
    extractTableData(table) {
        const rows = table.querySelectorAll('tbody tr');
        const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
        
        return Array.from(rows).map(row => {
            const cells = row.querySelectorAll('td');
            const rowData = {};
            cells.forEach((cell, index) => {
                rowData[headers[index] || `column_${index}`] = cell.textContent.trim();
            });
            return rowData;
        });
    }

    /**
     * Destroy component
     */
    destroy() {
        // Clear all charts
        this.charts.forEach(chart => {
            if (chart && typeof chart.dispose === 'function') {
                chart.dispose();
            }
        });
        this.charts.clear();
        
        // Clear indicators
        this.indicators.clear();
        
        // Remove event listeners
        window.removeEventListener('resize', this.handleResize);
        
        this.initialized = false;
        console.log('MedicalQualityComponents destroyed');
    }
}

// Create global instance
window.medicalQualityComponents = new MedicalQualityComponents();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.medicalQualityComponents.init();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MedicalQualityComponents;
}