/**
 * 病种效益组件配置文件
 * 定义组件的默认配置、配置接口和验证规则
 */

/**
 * 默认配置
 */
const DEFAULT_CONFIG = {
    // 基础配置
    containerId: 'disease-benefit-component',
    apiUrl: '/api/disease-benefit',
    autoInit: true,
    debug: false,
    
    // 功能开关
    enableExport: true,
    enableAIInsight: true,
    enableDoctorProfile: true,
    enableDiseaseDetail: true,
    enableSearch: true,
    enableFilter: true,
    
    // 数据配置
    dataSource: 'api', // 'api' | 'mock' | 'custom'
    refreshInterval: 0, // 自动刷新间隔(毫秒)，0表示不自动刷新
    cacheEnabled: true,
    cacheExpiry: 300000, // 缓存过期时间(毫秒)，默认5分钟
    
    // 显示配置
    pageSize: 20,
    maxDisplayItems: 100,
    showPagination: true,
    showRowNumbers: true,
    showExportButton: true,
    showAIInsightButton: true,
    
    // 图表配置
    chartTheme: 'default', // 'default' | 'dark' | 'light'
    chartAnimation: true,
    chartTooltip: true,
    chartLegend: true,
    
    // 表格配置
    tableStriped: true,
    tableHover: true,
    tableBordered: true,
    tableResponsive: true,
    sortable: true,
    
    // 筛选配置
    filterConfig: {
        enableTimeRange: true,
        enableDepartment: true,
        enableDiseaseType: true,
        enableProfitStatus: true,
        defaultTimeRange: 'month', // 'week' | 'month' | 'quarter' | 'year'
        maxSelectedDiseases: 10
    },
    
    // 导出配置
    exportConfig: {
        formats: ['csv', 'excel'], // 支持的导出格式
        includeCharts: false,
        includeFilters: true,
        filename: '病种效益分析',
        encoding: 'utf-8'
    },
    
    // AI洞察配置
    aiConfig: {
        enabled: true,
        analysisTypes: ['overview', 'trend', 'recommendation', 'risk'],
        autoAnalysis: false,
        analysisDepth: 'standard' // 'basic' | 'standard' | 'detailed'
    },
    
    // 样式配置
    styleConfig: {
        primaryColor: '#1890ff',
        successColor: '#52c41a',
        warningColor: '#faad14',
        errorColor: '#f5222d',
        borderRadius: '6px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    
    // 响应式配置
    responsive: {
        enabled: true,
        breakpoints: {
            xs: 576,
            sm: 768,
            md: 992,
            lg: 1200,
            xl: 1400
        }
    },
    
    // 国际化配置
    i18n: {
        locale: 'zh-CN',
        fallbackLocale: 'en-US',
        messages: {}
    }
};

/**
 * 配置验证规则
 */
const CONFIG_VALIDATORS = {
    containerId: (value) => {
        if (typeof value !== 'string' || value.trim() === '') {
            throw new Error('containerId必须是非空字符串');
        }
        return true;
    },
    
    apiUrl: (value) => {
        if (typeof value !== 'string') {
            throw new Error('apiUrl必须是字符串');
        }
        return true;
    },
    
    pageSize: (value) => {
        if (!Number.isInteger(value) || value < 1 || value > 1000) {
            throw new Error('pageSize必须是1-1000之间的整数');
        }
        return true;
    },
    
    refreshInterval: (value) => {
        if (!Number.isInteger(value) || value < 0) {
            throw new Error('refreshInterval必须是非负整数');
        }
        return true;
    },
    
    cacheExpiry: (value) => {
        if (!Number.isInteger(value) || value < 0) {
            throw new Error('cacheExpiry必须是非负整数');
        }
        return true;
    },
    
    chartTheme: (value) => {
        const validThemes = ['default', 'dark', 'light'];
        if (!validThemes.includes(value)) {
            throw new Error(`chartTheme必须是以下值之一: ${validThemes.join(', ')}`);
        }
        return true;
    },
    
    dataSource: (value) => {
        const validSources = ['api', 'mock', 'custom'];
        if (!validSources.includes(value)) {
            throw new Error(`dataSource必须是以下值之一: ${validSources.join(', ')}`);
        }
        return true;
    }
};

/**
 * 配置管理器类
 */
class ConfigManager {
    constructor(userConfig = {}) {
        this.config = this.mergeConfig(DEFAULT_CONFIG, userConfig);
        this.validateConfig(this.config);
    }
    
    /**
     * 合并配置
     */
    mergeConfig(defaultConfig, userConfig) {
        const merged = { ...defaultConfig };
        
        for (const key in userConfig) {
            if (userConfig.hasOwnProperty(key)) {
                if (typeof userConfig[key] === 'object' && userConfig[key] !== null && !Array.isArray(userConfig[key])) {
                    merged[key] = this.mergeConfig(defaultConfig[key] || {}, userConfig[key]);
                } else {
                    merged[key] = userConfig[key];
                }
            }
        }
        
        return merged;
    }
    
    /**
     * 验证配置
     */
    validateConfig(config) {
        for (const key in CONFIG_VALIDATORS) {
            if (config.hasOwnProperty(key)) {
                try {
                    CONFIG_VALIDATORS[key](config[key]);
                } catch (error) {
                    throw new Error(`配置验证失败 - ${key}: ${error.message}`);
                }
            }
        }
    }
    
    /**
     * 获取配置值
     */
    get(path, defaultValue = undefined) {
        const keys = path.split('.');
        let current = this.config;
        
        for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key];
            } else {
                return defaultValue;
            }
        }
        
        return current;
    }
    
    /**
     * 设置配置值
     */
    set(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        let current = this.config;
        
        for (const key of keys) {
            if (!(key in current) || typeof current[key] !== 'object') {
                current[key] = {};
            }
            current = current[key];
        }
        
        current[lastKey] = value;
        
        // 验证更新后的配置
        if (CONFIG_VALIDATORS[lastKey]) {
            CONFIG_VALIDATORS[lastKey](value);
        }
    }
    
    /**
     * 获取完整配置
     */
    getAll() {
        return { ...this.config };
    }
    
    /**
     * 重置配置
     */
    reset() {
        this.config = { ...DEFAULT_CONFIG };
    }
    
    /**
     * 更新配置
     */
    update(newConfig) {
        this.config = this.mergeConfig(this.config, newConfig);
        this.validateConfig(this.config);
    }
}

/**
 * 事件类型定义
 */
const EVENT_TYPES = {
    // 数据事件
    DATA_LOAD_START: 'data:load:start',
    DATA_LOAD_SUCCESS: 'data:load:success',
    DATA_LOAD_ERROR: 'data:load:error',
    DATA_REFRESH: 'data:refresh',
    DATA_FILTER: 'data:filter',
    
    // 用户交互事件
    DISEASE_SELECT: 'disease:select',
    DISEASE_DESELECT: 'disease:deselect',
    DISEASE_DETAIL_SHOW: 'disease:detail:show',
    DISEASE_DETAIL_HIDE: 'disease:detail:hide',
    
    // 医生相关事件
    DOCTOR_PROFILE_SHOW: 'doctor:profile:show',
    DOCTOR_PROFILE_HIDE: 'doctor:profile:hide',
    
    // 导出事件
    EXPORT_START: 'export:start',
    EXPORT_SUCCESS: 'export:success',
    EXPORT_ERROR: 'export:error',
    
    // AI洞察事件
    AI_ANALYSIS_START: 'ai:analysis:start',
    AI_ANALYSIS_SUCCESS: 'ai:analysis:success',
    AI_ANALYSIS_ERROR: 'ai:analysis:error',
    
    // 图表事件
    CHART_RENDER: 'chart:render',
    CHART_UPDATE: 'chart:update',
    CHART_RESIZE: 'chart:resize',
    
    // 表格事件
    TABLE_UPDATE: 'table:update',
    TABLE_SORT: 'table:sort',
    TABLE_PAGE_CHANGE: 'table:page:change',
    
    // 错误事件
    ERROR: 'error',
    WARNING: 'warning',
    
    // 生命周期事件
    COMPONENT_INIT: 'component:init',
    COMPONENT_READY: 'component:ready',
    COMPONENT_DESTROY: 'component:destroy'
};

/**
 * 事件管理器类
 */
class EventManager {
    constructor() {
        this.listeners = new Map();
        this.onceListeners = new Map();
    }
    
    /**
     * 添加事件监听器
     */
    on(eventType, callback, context = null) {
        if (typeof callback !== 'function') {
            throw new Error('回调函数必须是function类型');
        }
        
        if (!this.listeners.has(eventType)) {
            this.listeners.set(eventType, []);
        }
        
        this.listeners.get(eventType).push({
            callback,
            context
        });
        
        return this; // 支持链式调用
    }
    
    /**
     * 添加一次性事件监听器
     */
    once(eventType, callback, context = null) {
        if (typeof callback !== 'function') {
            throw new Error('回调函数必须是function类型');
        }
        
        if (!this.onceListeners.has(eventType)) {
            this.onceListeners.set(eventType, []);
        }
        
        this.onceListeners.get(eventType).push({
            callback,
            context
        });
        
        return this;
    }
    
    /**
     * 移除事件监听器
     */
    off(eventType, callback = null) {
        if (callback === null) {
            // 移除所有监听器
            this.listeners.delete(eventType);
            this.onceListeners.delete(eventType);
        } else {
            // 移除特定监听器
            if (this.listeners.has(eventType)) {
                const listeners = this.listeners.get(eventType);
                const index = listeners.findIndex(listener => listener.callback === callback);
                if (index !== -1) {
                    listeners.splice(index, 1);
                }
            }
            
            if (this.onceListeners.has(eventType)) {
                const listeners = this.onceListeners.get(eventType);
                const index = listeners.findIndex(listener => listener.callback === callback);
                if (index !== -1) {
                    listeners.splice(index, 1);
                }
            }
        }
        
        return this;
    }
    
    /**
     * 触发事件
     */
    emit(eventType, data = null) {
        const event = {
            type: eventType,
            data: data,
            timestamp: Date.now()
        };
        
        // 触发普通监听器
        if (this.listeners.has(eventType)) {
            const listeners = this.listeners.get(eventType);
            listeners.forEach(listener => {
                try {
                    if (listener.context) {
                        listener.callback.call(listener.context, event);
                    } else {
                        listener.callback(event);
                    }
                } catch (error) {
                    console.error(`事件监听器执行错误 [${eventType}]:`, error);
                }
            });
        }
        
        // 触发一次性监听器
        if (this.onceListeners.has(eventType)) {
            const listeners = this.onceListeners.get(eventType);
            listeners.forEach(listener => {
                try {
                    if (listener.context) {
                        listener.callback.call(listener.context, event);
                    } else {
                        listener.callback(event);
                    }
                } catch (error) {
                    console.error(`一次性事件监听器执行错误 [${eventType}]:`, error);
                }
            });
            
            // 清除一次性监听器
            this.onceListeners.delete(eventType);
        }
        
        return this;
    }
    
    /**
     * 获取事件监听器数量
     */
    listenerCount(eventType) {
        const normalCount = this.listeners.has(eventType) ? this.listeners.get(eventType).length : 0;
        const onceCount = this.onceListeners.has(eventType) ? this.onceListeners.get(eventType).length : 0;
        return normalCount + onceCount;
    }
    
    /**
     * 获取所有事件类型
     */
    eventTypes() {
        const types = new Set();
        this.listeners.forEach((_, type) => types.add(type));
        this.onceListeners.forEach((_, type) => types.add(type));
        return Array.from(types);
    }
    
    /**
     * 清除所有监听器
     */
    clear() {
        this.listeners.clear();
        this.onceListeners.clear();
    }
}

/**
 * 配置预设
 */
const CONFIG_PRESETS = {
    // 基础版本 - 最小功能集
    basic: {
        enableExport: false,
        enableAIInsight: false,
        enableDoctorProfile: false,
        showExportButton: false,
        showAIInsightButton: false,
        chartAnimation: false,
        filterConfig: {
            enableTimeRange: false,
            enableDepartment: false,
            enableDiseaseType: true,
            enableProfitStatus: false
        }
    },
    
    // 标准版本 - 常用功能
    standard: {
        enableExport: true,
        enableAIInsight: false,
        enableDoctorProfile: true,
        showExportButton: true,
        showAIInsightButton: false,
        chartAnimation: true,
        filterConfig: {
            enableTimeRange: true,
            enableDepartment: true,
            enableDiseaseType: true,
            enableProfitStatus: true
        }
    },
    
    // 专业版本 - 全功能
    professional: {
        enableExport: true,
        enableAIInsight: true,
        enableDoctorProfile: true,
        showExportButton: true,
        showAIInsightButton: true,
        chartAnimation: true,
        aiConfig: {
            enabled: true,
            analysisTypes: ['overview', 'trend', 'recommendation', 'risk'],
            autoAnalysis: true,
            analysisDepth: 'detailed'
        },
        filterConfig: {
            enableTimeRange: true,
            enableDepartment: true,
            enableDiseaseType: true,
            enableProfitStatus: true,
            maxSelectedDiseases: 20
        }
    },
    
    // 演示版本 - 用于展示
    demo: {
        dataSource: 'mock',
        enableExport: true,
        enableAIInsight: true,
        enableDoctorProfile: true,
        chartAnimation: true,
        debug: true,
        refreshInterval: 30000, // 30秒自动刷新
        aiConfig: {
            enabled: true,
            autoAnalysis: true,
            analysisDepth: 'standard'
        }
    }
};

// 导出配置相关对象
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        DEFAULT_CONFIG,
        CONFIG_VALIDATORS,
        ConfigManager,
        EVENT_TYPES,
        EventManager,
        CONFIG_PRESETS
    };
} else if (typeof window !== 'undefined') {
    window.DiseaseBenefitConfig = {
        DEFAULT_CONFIG,
        CONFIG_VALIDATORS,
        ConfigManager,
        EVENT_TYPES,
        EventManager,
        CONFIG_PRESETS
    };
}