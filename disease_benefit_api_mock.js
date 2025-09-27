#!/usr/bin/env node
/**
 * 病种效益分析API - 模拟数据版本
 * 无需数据库连接，使用内存中的模拟数据
 * 
 * 启动命令: node disease_benefit_api_mock.js
 * API地址: http://localhost:5000/api/disease-benefit
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// ================================
// 中间件配置
// ================================
app.use(cors({
    origin: ['http://localhost:8000', 'http://127.0.0.1:8000'],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 请求日志中间件
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
});

// ================================
// 模拟数据
// ================================
let mockData = [
    // 心内科
    {
        id: 1,
        disease_code: 'I21.9',
        disease_name: '急性心肌梗死',
        department: '心内科',
        revenue: 1250000.00,
        cost: 980000.00,
        profit: 270000.00,
        cases: 45,
        avg_revenue: 27777.78,
        avg_cost: 21777.78,
        avg_profit: 6000.00,
        profit_rate: 21.60,
        breakeven_cases: 35,
        avg_stay: 8.5,
        record_date: '2024-01-15',
        doctor_id: 'DOC001',
        created_at: '2024-01-15T10:00:00.000Z',
        updated_at: '2024-01-15T10:00:00.000Z'
    },
    {
        id: 2,
        disease_code: 'I50.9',
        disease_name: '心力衰竭',
        department: '心内科',
        revenue: 890000.00,
        cost: 720000.00,
        profit: 170000.00,
        cases: 38,
        avg_revenue: 23421.05,
        avg_cost: 18947.37,
        avg_profit: 4473.68,
        profit_rate: 19.10,
        breakeven_cases: 30,
        avg_stay: 12.3,
        record_date: '2024-01-15',
        doctor_id: 'DOC002',
        created_at: '2024-01-15T10:00:00.000Z',
        updated_at: '2024-01-15T10:00:00.000Z'
    },
    {
        id: 3,
        disease_code: 'I25.1',
        disease_name: '冠心病',
        department: '心内科',
        revenue: 2100000.00,
        cost: 1650000.00,
        profit: 450000.00,
        cases: 85,
        avg_revenue: 24705.88,
        avg_cost: 19411.76,
        avg_profit: 5294.12,
        profit_rate: 21.43,
        breakeven_cases: 65,
        avg_stay: 6.8,
        record_date: '2024-01-15',
        doctor_id: 'DOC001',
        created_at: '2024-01-15T10:00:00.000Z',
        updated_at: '2024-01-15T10:00:00.000Z'
    },
    {
        id: 4,
        disease_code: 'I48.9',
        disease_name: '心房颤动',
        department: '心内科',
        revenue: 1680000.00,
        cost: 1280000.00,
        profit: 400000.00,
        cases: 72,
        avg_revenue: 23333.33,
        avg_cost: 17777.78,
        avg_profit: 5555.56,
        profit_rate: 23.81,
        breakeven_cases: 55,
        avg_stay: 7.2,
        record_date: '2024-02-10',
        doctor_id: 'DOC002',
        created_at: '2024-02-10T10:00:00.000Z',
        updated_at: '2024-02-10T10:00:00.000Z'
    },
    {
        id: 5,
        disease_code: 'I20.9',
        disease_name: '心绞痛',
        department: '心内科',
        revenue: 950000.00,
        cost: 720000.00,
        profit: 230000.00,
        cases: 58,
        avg_revenue: 16379.31,
        avg_cost: 12413.79,
        avg_profit: 3965.52,
        profit_rate: 24.21,
        breakeven_cases: 44,
        avg_stay: 4.8,
        record_date: '2024-03-05',
        doctor_id: 'DOC001',
        created_at: '2024-03-05T10:00:00.000Z',
        updated_at: '2024-03-05T10:00:00.000Z'
    },

    // 神经内科
    {
        id: 6,
        disease_code: 'I63.9',
        disease_name: '脑梗死',
        department: '神经内科',
        revenue: 1680000.00,
        cost: 1320000.00,
        profit: 360000.00,
        cases: 62,
        avg_revenue: 27096.77,
        avg_cost: 21290.32,
        avg_profit: 5806.45,
        profit_rate: 21.43,
        breakeven_cases: 48,
        avg_stay: 15.2,
        record_date: '2024-01-15',
        doctor_id: 'DOC003',
        created_at: '2024-01-15T10:00:00.000Z',
        updated_at: '2024-01-15T10:00:00.000Z'
    },
    {
        id: 7,
        disease_code: 'I61.9',
        disease_name: '脑出血',
        department: '神经内科',
        revenue: 980000.00,
        cost: 850000.00,
        profit: 130000.00,
        cases: 28,
        avg_revenue: 35000.00,
        avg_cost: 30357.14,
        avg_profit: 4642.86,
        profit_rate: 13.27,
        breakeven_cases: 24,
        avg_stay: 18.7,
        record_date: '2024-01-15',
        doctor_id: 'DOC004',
        created_at: '2024-01-15T10:00:00.000Z',
        updated_at: '2024-01-15T10:00:00.000Z'
    },
    {
        id: 8,
        disease_code: 'G40.9',
        disease_name: '癫痫',
        department: '神经内科',
        revenue: 720000.00,
        cost: 580000.00,
        profit: 140000.00,
        cases: 42,
        avg_revenue: 17142.86,
        avg_cost: 13809.52,
        avg_profit: 3333.33,
        profit_rate: 19.44,
        breakeven_cases: 34,
        avg_stay: 8.5,
        record_date: '2024-02-20',
        doctor_id: 'DOC003',
        created_at: '2024-02-20T10:00:00.000Z',
        updated_at: '2024-02-20T10:00:00.000Z'
    },
    {
        id: 9,
        disease_code: 'G35.9',
        disease_name: '多发性硬化',
        department: '神经内科',
        revenue: 1350000.00,
        cost: 1100000.00,
        profit: 250000.00,
        cases: 35,
        avg_revenue: 38571.43,
        avg_cost: 31428.57,
        avg_profit: 7142.86,
        profit_rate: 18.52,
        breakeven_cases: 29,
        avg_stay: 12.8,
        record_date: '2024-03-12',
        doctor_id: 'DOC004',
        created_at: '2024-03-12T10:00:00.000Z',
        updated_at: '2024-03-12T10:00:00.000Z'
    },

    // 呼吸内科
    {
        id: 10,
        disease_code: 'J44.1',
        disease_name: '慢性阻塞性肺病',
        department: '呼吸内科',
        revenue: 750000.00,
        cost: 580000.00,
        profit: 170000.00,
        cases: 42,
        avg_revenue: 17857.14,
        avg_cost: 13809.52,
        avg_profit: 4047.62,
        profit_rate: 22.67,
        breakeven_cases: 32,
        avg_stay: 9.8,
        record_date: '2024-01-15',
        doctor_id: 'DOC005',
        created_at: '2024-01-15T10:00:00.000Z',
        updated_at: '2024-01-15T10:00:00.000Z'
    },
    {
        id: 11,
        disease_code: 'J18.9',
        disease_name: '肺炎',
        department: '呼吸内科',
        revenue: 1200000.00,
        cost: 920000.00,
        profit: 280000.00,
        cases: 68,
        avg_revenue: 17647.06,
        avg_cost: 13529.41,
        avg_profit: 4117.65,
        profit_rate: 23.33,
        breakeven_cases: 52,
        avg_stay: 7.5,
        record_date: '2024-01-15',
        doctor_id: 'DOC006',
        created_at: '2024-01-15T10:00:00.000Z',
        updated_at: '2024-01-15T10:00:00.000Z'
    },
    {
        id: 12,
        disease_code: 'J45.9',
        disease_name: '支气管哮喘',
        department: '呼吸内科',
        revenue: 680000.00,
        cost: 520000.00,
        profit: 160000.00,
        cases: 55,
        avg_revenue: 12363.64,
        avg_cost: 9454.55,
        avg_profit: 2909.09,
        profit_rate: 23.53,
        breakeven_cases: 42,
        avg_stay: 5.2,
        record_date: '2024-02-25',
        doctor_id: 'DOC005',
        created_at: '2024-02-25T10:00:00.000Z',
        updated_at: '2024-02-25T10:00:00.000Z'
    },
    {
        id: 13,
        disease_code: 'J84.1',
        disease_name: '肺纤维化',
        department: '呼吸内科',
        revenue: 1450000.00,
        cost: 1180000.00,
        profit: 270000.00,
        cases: 32,
        avg_revenue: 45312.50,
        avg_cost: 36875.00,
        avg_profit: 8437.50,
        profit_rate: 18.62,
        breakeven_cases: 26,
        avg_stay: 16.5,
        record_date: '2024-03-18',
        doctor_id: 'DOC006',
        created_at: '2024-03-18T10:00:00.000Z',
        updated_at: '2024-03-18T10:00:00.000Z'
    },

    // 消化内科
    {
        id: 14,
        disease_code: 'K25.9',
        disease_name: '胃溃疡',
        department: '消化内科',
        revenue: 680000.00,
        cost: 520000.00,
        profit: 160000.00,
        cases: 35,
        avg_revenue: 19428.57,
        avg_cost: 14857.14,
        avg_profit: 4571.43,
        profit_rate: 23.53,
        breakeven_cases: 27,
        avg_stay: 5.8,
        record_date: '2024-01-15',
        doctor_id: 'DOC007',
        created_at: '2024-01-15T10:00:00.000Z',
        updated_at: '2024-01-15T10:00:00.000Z'
    },
    {
        id: 15,
        disease_code: 'K72.9',
        disease_name: '肝硬化',
        department: '消化内科',
        revenue: 1450000.00,
        cost: 1180000.00,
        profit: 270000.00,
        cases: 52,
        avg_revenue: 27884.62,
        avg_cost: 22692.31,
        avg_profit: 5192.31,
        profit_rate: 18.62,
        breakeven_cases: 42,
        avg_stay: 14.2,
        record_date: '2024-01-15',
        doctor_id: 'DOC008',
        created_at: '2024-01-15T10:00:00.000Z',
        updated_at: '2024-01-15T10:00:00.000Z'
    },
    {
        id: 16,
        disease_code: 'K50.9',
        disease_name: '克罗恩病',
        department: '消化内科',
        revenue: 980000.00,
        cost: 780000.00,
        profit: 200000.00,
        cases: 28,
        avg_revenue: 35000.00,
        avg_cost: 27857.14,
        avg_profit: 7142.86,
        profit_rate: 20.41,
        breakeven_cases: 22,
        avg_stay: 11.5,
        record_date: '2024-02-28',
        doctor_id: 'DOC007',
        created_at: '2024-02-28T10:00:00.000Z',
        updated_at: '2024-02-28T10:00:00.000Z'
    },
    {
        id: 17,
        disease_code: 'K85.9',
        disease_name: '急性胰腺炎',
        department: '消化内科',
        revenue: 1250000.00,
        cost: 980000.00,
        profit: 270000.00,
        cases: 38,
        avg_revenue: 32894.74,
        avg_cost: 25789.47,
        avg_profit: 7105.26,
        profit_rate: 21.60,
        breakeven_cases: 30,
        avg_stay: 13.8,
        record_date: '2024-03-22',
        doctor_id: 'DOC008',
        created_at: '2024-03-22T10:00:00.000Z',
        updated_at: '2024-03-22T10:00:00.000Z'
    },

    // 骨科
    {
        id: 18,
        disease_code: 'S72.0',
        disease_name: '股骨颈骨折',
        department: '骨科',
        revenue: 1850000.00,
        cost: 1420000.00,
        profit: 430000.00,
        cases: 48,
        avg_revenue: 38541.67,
        avg_cost: 29583.33,
        avg_profit: 8958.33,
        profit_rate: 23.24,
        breakeven_cases: 37,
        avg_stay: 12.5,
        record_date: '2024-01-15',
        doctor_id: 'DOC009',
        created_at: '2024-01-15T10:00:00.000Z',
        updated_at: '2024-01-15T10:00:00.000Z'
    },
    {
        id: 19,
        disease_code: 'M17.9',
        disease_name: '膝关节骨关节炎',
        department: '骨科',
        revenue: 2200000.00,
        cost: 1680000.00,
        profit: 520000.00,
        cases: 65,
        avg_revenue: 33846.15,
        avg_cost: 25846.15,
        avg_profit: 8000.00,
        profit_rate: 23.64,
        breakeven_cases: 50,
        avg_stay: 8.2,
        record_date: '2024-02-18',
        doctor_id: 'DOC009',
        created_at: '2024-02-18T10:00:00.000Z',
        updated_at: '2024-02-18T10:00:00.000Z'
    },
    {
        id: 20,
        disease_code: 'S42.2',
        disease_name: '肱骨骨折',
        department: '骨科',
        revenue: 1320000.00,
        cost: 980000.00,
        profit: 340000.00,
        cases: 42,
        avg_revenue: 31428.57,
        avg_cost: 23333.33,
        avg_profit: 8095.24,
        profit_rate: 25.76,
        breakeven_cases: 31,
        avg_stay: 9.8,
        record_date: '2024-03-08',
        doctor_id: 'DOC010',
        created_at: '2024-03-08T10:00:00.000Z',
        updated_at: '2024-03-08T10:00:00.000Z'
    },

    // 妇产科
    {
        id: 21,
        disease_code: 'O80.9',
        disease_name: '正常分娩',
        department: '妇产科',
        revenue: 1680000.00,
        cost: 1200000.00,
        profit: 480000.00,
        cases: 120,
        avg_revenue: 14000.00,
        avg_cost: 10000.00,
        avg_profit: 4000.00,
        profit_rate: 28.57,
        breakeven_cases: 86,
        avg_stay: 3.2,
        record_date: '2024-01-20',
        doctor_id: 'DOC011',
        created_at: '2024-01-20T10:00:00.000Z',
        updated_at: '2024-01-20T10:00:00.000Z'
    },
    {
        id: 22,
        disease_code: 'O82.9',
        disease_name: '剖宫产',
        department: '妇产科',
        revenue: 2450000.00,
        cost: 1850000.00,
        profit: 600000.00,
        cases: 85,
        avg_revenue: 28823.53,
        avg_cost: 21764.71,
        avg_profit: 7058.82,
        profit_rate: 24.49,
        breakeven_cases: 64,
        avg_stay: 5.5,
        record_date: '2024-02-15',
        doctor_id: 'DOC011',
        created_at: '2024-02-15T10:00:00.000Z',
        updated_at: '2024-02-15T10:00:00.000Z'
    },
    {
        id: 23,
        disease_code: 'N83.2',
        disease_name: '卵巢囊肿',
        department: '妇产科',
        revenue: 980000.00,
        cost: 720000.00,
        profit: 260000.00,
        cases: 45,
        avg_revenue: 21777.78,
        avg_cost: 16000.00,
        avg_profit: 5777.78,
        profit_rate: 26.53,
        breakeven_cases: 33,
        avg_stay: 4.8,
        record_date: '2024-03-10',
        doctor_id: 'DOC012',
        created_at: '2024-03-10T10:00:00.000Z',
        updated_at: '2024-03-10T10:00:00.000Z'
    },

    // 儿科
    {
        id: 24,
        disease_code: 'J20.9',
        disease_name: '急性支气管炎',
        department: '儿科',
        revenue: 680000.00,
        cost: 520000.00,
        profit: 160000.00,
        cases: 85,
        avg_revenue: 8000.00,
        avg_cost: 6117.65,
        avg_profit: 1882.35,
        profit_rate: 23.53,
        breakeven_cases: 65,
        avg_stay: 4.2,
        record_date: '2024-01-25',
        doctor_id: 'DOC013',
        created_at: '2024-01-25T10:00:00.000Z',
        updated_at: '2024-01-25T10:00:00.000Z'
    },
    {
        id: 25,
        disease_code: 'A09.9',
        disease_name: '感染性腹泻',
        department: '儿科',
        revenue: 450000.00,
        cost: 350000.00,
        profit: 100000.00,
        cases: 75,
        avg_revenue: 6000.00,
        avg_cost: 4666.67,
        avg_profit: 1333.33,
        profit_rate: 22.22,
        breakeven_cases: 58,
        avg_stay: 3.5,
        record_date: '2024-02-22',
        doctor_id: 'DOC013',
        created_at: '2024-02-22T10:00:00.000Z',
        updated_at: '2024-02-22T10:00:00.000Z'
    },
    {
        id: 26,
        disease_code: 'J06.9',
        disease_name: '急性上呼吸道感染',
        department: '儿科',
        revenue: 320000.00,
        cost: 250000.00,
        profit: 70000.00,
        cases: 95,
        avg_revenue: 3368.42,
        avg_cost: 2631.58,
        avg_profit: 736.84,
        profit_rate: 21.88,
        breakeven_cases: 74,
        avg_stay: 2.8,
        record_date: '2024-03-15',
        doctor_id: 'DOC014',
        created_at: '2024-03-15T10:00:00.000Z',
        updated_at: '2024-03-15T10:00:00.000Z'
    },

    // 泌尿外科
    {
        id: 27,
        disease_code: 'N20.0',
        disease_name: '肾结石',
        department: '泌尿外科',
        revenue: 1250000.00,
        cost: 950000.00,
        profit: 300000.00,
        cases: 58,
        avg_revenue: 21551.72,
        avg_cost: 16379.31,
        avg_profit: 5172.41,
        profit_rate: 24.00,
        breakeven_cases: 44,
        avg_stay: 6.5,
        record_date: '2024-01-30',
        doctor_id: 'DOC015',
        created_at: '2024-01-30T10:00:00.000Z',
        updated_at: '2024-01-30T10:00:00.000Z'
    },
    {
        id: 28,
        disease_code: 'N40.0',
        disease_name: '前列腺增生',
        department: '泌尿外科',
        revenue: 1680000.00,
        cost: 1280000.00,
        profit: 400000.00,
        cases: 72,
        avg_revenue: 23333.33,
        avg_cost: 17777.78,
        avg_profit: 5555.56,
        profit_rate: 23.81,
        breakeven_cases: 55,
        avg_stay: 7.8,
        record_date: '2024-02-12',
        doctor_id: 'DOC015',
        created_at: '2024-02-12T10:00:00.000Z',
        updated_at: '2024-02-12T10:00:00.000Z'
    },

    // 眼科
    {
        id: 29,
        disease_code: 'H25.9',
        disease_name: '白内障',
        department: '眼科',
        revenue: 1850000.00,
        cost: 1350000.00,
        profit: 500000.00,
        cases: 125,
        avg_revenue: 14800.00,
        avg_cost: 10800.00,
        avg_profit: 4000.00,
        profit_rate: 27.03,
        breakeven_cases: 91,
        avg_stay: 2.5,
        record_date: '2024-02-05',
        doctor_id: 'DOC016',
        created_at: '2024-02-05T10:00:00.000Z',
        updated_at: '2024-02-05T10:00:00.000Z'
    },
    {
        id: 30,
        disease_code: 'H40.9',
        disease_name: '青光眼',
        department: '眼科',
        revenue: 980000.00,
        cost: 750000.00,
        profit: 230000.00,
        cases: 42,
        avg_revenue: 23333.33,
        avg_cost: 17857.14,
        avg_profit: 5476.19,
        profit_rate: 23.47,
        breakeven_cases: 32,
        avg_stay: 3.8,
        record_date: '2024-03-20',
        doctor_id: 'DOC016',
        created_at: '2024-03-20T10:00:00.000Z',
        updated_at: '2024-03-20T10:00:00.000Z'
    }
];

let nextId = 31;

// ================================
// 工具函数
// ================================

/**
 * 统一响应格式
 */
const createResponse = (success, code, message, data = null) => {
    return {
        success,
        code,
        message,
        data,
        timestamp: new Date().toISOString()
    };
};

/**
 * 数据格式化函数
 */
const formatDiseaseData = (disease) => {
    return {
        ...disease,
        revenue: parseFloat(disease.revenue || 0),
        cost: parseFloat(disease.cost || 0),
        profit: parseFloat(disease.profit || 0),
        avg_revenue: parseFloat(disease.avg_revenue || 0),
        avg_cost: parseFloat(disease.avg_cost || 0),
        avg_profit: parseFloat(disease.avg_profit || 0),
        profit_rate: parseFloat(disease.profit_rate || 0),
        avg_stay: parseFloat(disease.avg_stay || 0)
    };
};

/**
 * 筛选数据
 */
const filterData = (data, filters) => {
    return data.filter(item => {
        if (filters.department && item.department !== filters.department) return false;
        if (filters.dateStart && item.record_date < filters.dateStart) return false;
        if (filters.dateEnd && item.record_date > filters.dateEnd) return false;
        if (filters.diseaseCode && !item.disease_code.includes(filters.diseaseCode)) return false;
        if (filters.diseaseName && !item.disease_name.includes(filters.diseaseName)) return false;
        if (filters.minProfitRate !== undefined && item.profit_rate < filters.minProfitRate) return false;
        if (filters.maxProfitRate !== undefined && item.profit_rate > filters.maxProfitRate) return false;
        return true;
    });
};

/**
 * 排序数据
 */
const sortData = (data, sortBy, sortOrder) => {
    return data.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];
        
        if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        }
        
        if (sortOrder === 'ASC') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });
};

/**
 * 分页数据
 */
const paginateData = (data, page, pageSize) => {
    const offset = (page - 1) * pageSize;
    return data.slice(offset, offset + pageSize);
};

// ================================
// API路由
// ================================

/**
 * 健康检查接口
 */
app.get('/api/health', (req, res) => {
    res.json(createResponse(true, 200, 'API服务正常运行（模拟数据模式）', {
        service: 'Disease Benefit API (Mock)',
        version: '1.0.0',
        mode: 'mock_data',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    }));
});

/**
 * GET /api/disease-benefit
 * 获取病种效益数据列表
 */
app.get('/api/disease-benefit', (req, res) => {
    try {
        const {
            department,
            dateStart,
            dateEnd,
            diseaseCode,
            diseaseName,
            minProfitRate,
            maxProfitRate,
            page = 1,
            pageSize = 20,
            sortBy = 'record_date',
            sortOrder = 'DESC'
        } = req.query;

        // 构建筛选条件
        const filters = {
            department,
            dateStart,
            dateEnd,
            diseaseCode,
            diseaseName,
            minProfitRate: minProfitRate ? parseFloat(minProfitRate) : undefined,
            maxProfitRate: maxProfitRate ? parseFloat(maxProfitRate) : undefined
        };

        // 筛选数据
        let filteredData = filterData(mockData, filters);

        // 排序数据
        const allowedSortFields = ['id', 'disease_code', 'disease_name', 'department', 'revenue', 'cost', 'profit', 'cases', 'profit_rate', 'record_date'];
        const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'record_date';
        const validSortOrder = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';
        
        filteredData = sortData(filteredData, validSortBy, validSortOrder);

        // 分页
        const total = filteredData.length;
        const paginatedData = paginateData(filteredData, parseInt(page), parseInt(pageSize));

        // 格式化数据
        const formattedDiseases = paginatedData.map(formatDiseaseData);

        const responseData = {
            diseases: formattedDiseases,
            pagination: {
                total,
                page: parseInt(page),
                pageSize: parseInt(pageSize),
                totalPages: Math.ceil(total / parseInt(pageSize))
            },
            filters: filters
        };

        res.json(createResponse(true, 200, '获取成功', responseData));

    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json(createResponse(false, 500, `获取病种效益数据失败: ${error.message}`));
    }
});

/**
 * GET /api/disease-benefit/:id
 * 获取单个病种详情
 */
app.get('/api/disease-benefit/:id', (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json(createResponse(false, 400, '无效的病种ID'));
        }

        const disease = mockData.find(item => item.id === parseInt(id));

        if (!disease) {
            return res.status(404).json(createResponse(false, 404, '病种数据不存在'));
        }

        res.json(createResponse(true, 200, '获取成功', formatDiseaseData(disease)));

    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json(createResponse(false, 500, `获取病种详情失败: ${error.message}`));
    }
});

/**
 * POST /api/disease-benefit
 * 创建新的病种效益记录
 */
app.post('/api/disease-benefit', (req, res) => {
    try {
        const {
            disease_code,
            disease_name,
            department,
            revenue,
            cost,
            cases,
            breakeven_cases,
            avg_stay,
            record_date,
            doctor_id
        } = req.body;

        // 数据验证
        if (!disease_code || !disease_name || !department || !revenue || !cost || !cases || !record_date) {
            return res.status(400).json(createResponse(false, 400, '缺少必要字段'));
        }

        if (parseFloat(revenue) < 0 || parseFloat(cost) < 0 || parseInt(cases) <= 0) {
            return res.status(400).json(createResponse(false, 400, '数据值不合法'));
        }

        // 计算衍生字段
        const revenueNum = parseFloat(revenue);
        const costNum = parseFloat(cost);
        const casesNum = parseInt(cases);
        const profit = revenueNum - costNum;
        const avg_revenue = revenueNum / casesNum;
        const avg_cost = costNum / casesNum;
        const avg_profit = profit / casesNum;
        const profit_rate = revenueNum > 0 ? (profit / revenueNum) * 100 : 0;

        const newRecord = {
            id: nextId++,
            disease_code,
            disease_name,
            department,
            revenue: revenueNum,
            cost: costNum,
            profit,
            cases: casesNum,
            avg_revenue,
            avg_cost,
            avg_profit,
            profit_rate,
            breakeven_cases: breakeven_cases ? parseInt(breakeven_cases) : null,
            avg_stay: avg_stay ? parseFloat(avg_stay) : null,
            record_date,
            doctor_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        mockData.push(newRecord);

        res.status(201).json(createResponse(true, 201, '创建成功', formatDiseaseData(newRecord)));

    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json(createResponse(false, 500, `创建病种效益记录失败: ${error.message}`));
    }
});

/**
 * PUT /api/disease-benefit/:id
 * 更新病种效益记录
 */
app.put('/api/disease-benefit/:id', (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!id || isNaN(id)) {
            return res.status(400).json(createResponse(false, 400, '无效的病种ID'));
        }

        const index = mockData.findIndex(item => item.id === parseInt(id));

        if (index === -1) {
            return res.status(404).json(createResponse(false, 404, '病种数据不存在'));
        }

        // 更新数据
        const oldRecord = mockData[index];
        const updatedRecord = { ...oldRecord, ...updateData };

        // 重新计算衍生字段
        if (updateData.revenue || updateData.cost || updateData.cases) {
            const revenue = parseFloat(updatedRecord.revenue);
            const cost = parseFloat(updatedRecord.cost);
            const cases = parseInt(updatedRecord.cases);
            
            updatedRecord.profit = revenue - cost;
            updatedRecord.avg_revenue = revenue / cases;
            updatedRecord.avg_cost = cost / cases;
            updatedRecord.avg_profit = updatedRecord.profit / cases;
            updatedRecord.profit_rate = revenue > 0 ? (updatedRecord.profit / revenue) * 100 : 0;
        }

        updatedRecord.updated_at = new Date().toISOString();
        mockData[index] = updatedRecord;

        res.json(createResponse(true, 200, '更新成功', formatDiseaseData(updatedRecord)));

    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json(createResponse(false, 500, `更新病种效益记录失败: ${error.message}`));
    }
});

/**
 * DELETE /api/disease-benefit/:id
 * 删除病种效益记录
 */
app.delete('/api/disease-benefit/:id', (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json(createResponse(false, 400, '无效的病种ID'));
        }

        const index = mockData.findIndex(item => item.id === parseInt(id));

        if (index === -1) {
            return res.status(404).json(createResponse(false, 404, '病种数据不存在'));
        }

        mockData.splice(index, 1);

        res.json(createResponse(true, 200, '删除成功'));

    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json(createResponse(false, 500, `删除病种效益记录失败: ${error.message}`));
    }
});

/**
 * GET /api/disease-benefit/stats
 * 获取病种效益统计数据
 */
app.get('/api/disease-benefit/stats', (req, res) => {
    try {
        const { department, dateStart, dateEnd } = req.query;

        // 构建筛选条件
        const filters = { department, dateStart, dateEnd };
        const filteredData = filterData(mockData, filters);

        // 计算总览统计
        const overview = {
            total_diseases: filteredData.length,
            total_cases: filteredData.reduce((sum, item) => sum + item.cases, 0),
            total_revenue: filteredData.reduce((sum, item) => sum + item.revenue, 0),
            total_cost: filteredData.reduce((sum, item) => sum + item.cost, 0),
            total_profit: filteredData.reduce((sum, item) => sum + item.profit, 0),
            avg_profit_rate: filteredData.length > 0 ? filteredData.reduce((sum, item) => sum + item.profit_rate, 0) / filteredData.length : 0,
            total_departments: [...new Set(filteredData.map(item => item.department))].length,
            max_profit_rate: filteredData.length > 0 ? Math.max(...filteredData.map(item => item.profit_rate)) : 0,
            min_profit_rate: filteredData.length > 0 ? Math.min(...filteredData.map(item => item.profit_rate)) : 0,
            avg_stay_overall: filteredData.length > 0 ? filteredData.reduce((sum, item) => sum + (item.avg_stay || 0), 0) / filteredData.length : 0
        };

        // 科室统计
        const deptMap = {};
        filteredData.forEach(item => {
            if (!deptMap[item.department]) {
                deptMap[item.department] = {
                    department: item.department,
                    disease_count: 0,
                    total_cases: 0,
                    total_revenue: 0,
                    total_cost: 0,
                    total_profit: 0,
                    profit_rates: []
                };
            }
            const dept = deptMap[item.department];
            dept.disease_count++;
            dept.total_cases += item.cases;
            dept.total_revenue += item.revenue;
            dept.total_cost += item.cost;
            dept.total_profit += item.profit;
            dept.profit_rates.push(item.profit_rate);
        });

        const departmentStats = Object.values(deptMap).map(dept => ({
            ...dept,
            avg_profit_rate: dept.profit_rates.length > 0 ? dept.profit_rates.reduce((sum, rate) => sum + rate, 0) / dept.profit_rates.length : 0
        })).sort((a, b) => b.total_profit - a.total_profit);

        // 月度趋势（模拟数据）
        const monthlyTrend = [
            { month: '2023-10', disease_count: 25, total_cases: 1850, total_revenue: 38500000, total_cost: 30200000, total_profit: 8300000, avg_profit_rate: 21.6 },
            { month: '2023-11', disease_count: 28, total_cases: 2020, total_revenue: 42800000, total_cost: 33400000, total_profit: 9400000, avg_profit_rate: 22.0 },
            { month: '2023-12', disease_count: 30, total_cases: 2180, total_revenue: 46200000, total_cost: 35800000, total_profit: 10400000, avg_profit_rate: 22.5 },
            { month: '2024-01', disease_count: 32, total_cases: 2350, total_revenue: 49800000, total_cost: 38200000, total_profit: 11600000, avg_profit_rate: 23.3 },
            { month: '2024-02', disease_count: 35, total_cases: 2520, total_revenue: 53500000, total_cost: 40800000, total_profit: 12700000, avg_profit_rate: 23.7 },
            { month: '2024-03', disease_count: 38, total_cases: 2680, total_revenue: 57200000, total_cost: 43200000, total_profit: 14000000, avg_profit_rate: 24.5 }
        ];

        const stats = {
            overview,
            departmentStats,
            monthlyTrend
        };

        res.json(createResponse(true, 200, '获取成功', stats));

    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json(createResponse(false, 500, `获取统计数据失败: ${error.message}`));
    }
});

/**
 * GET /api/disease-benefit/departments
 * 获取科室列表
 */
app.get('/api/disease-benefit/departments', (req, res) => {
    try {
        const departments = [...new Set(mockData.map(item => item.department))].sort();
        res.json(createResponse(true, 200, '获取成功', departments));
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json(createResponse(false, 500, `获取科室列表失败: ${error.message}`));
    }
});

/**
 * POST /api/disease-benefit/export
 * 导出病种效益数据
 */
app.post('/api/disease-benefit/export', (req, res) => {
    try {
        const { format = 'json', filters = {} } = req.body;

        // 筛选数据
        const filteredData = filterData(mockData, filters);

        // 转换为导出格式
        const exportData = filteredData.map(item => ({
            '病种编码': item.disease_code,
            '病种名称': item.disease_name,
            '科室': item.department,
            '病例数': item.cases,
            '总收入': item.revenue,
            '总成本': item.cost,
            '总结余': item.profit,
            '平均收入': item.avg_revenue.toFixed(2),
            '平均成本': item.avg_cost.toFixed(2),
            '平均结余': item.avg_profit.toFixed(2),
            '结余率(%)': item.profit_rate.toFixed(2),
            '保本例数': item.breakeven_cases,
            '平均住院天数': item.avg_stay,
            '记录日期': item.record_date,
            '医生ID': item.doctor_id
        }));

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `病种效益分析_${timestamp}.${format}`;

        let responseData;
        let contentType;

        switch (format.toLowerCase()) {
            case 'csv':
                responseData = convertToCSV(exportData);
                contentType = 'text/csv';
                break;
            case 'json':
            default:
                responseData = JSON.stringify(exportData, null, 2);
                contentType = 'application/json';
                break;
        }

        // 设置响应头
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

        res.send(responseData);

    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json(createResponse(false, 500, `导出失败: ${error.message}`));
    }
});

/**
 * 转换为CSV格式
 */
function convertToCSV(data) {
    if (!data || data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');
    
    const csvRows = data.map(row => {
        return headers.map(header => {
            const value = row[header];
            // 处理包含逗号或引号的值
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        }).join(',');
    });

    return [csvHeaders, ...csvRows].join('\n');
}

/**
 * POST /api/disease-benefit/batch
 * 批量导入病种效益数据
 */
app.post('/api/disease-benefit/batch', (req, res) => {
    try {
        const { diseases } = req.body;

        if (!Array.isArray(diseases) || diseases.length === 0) {
            return res.status(400).json(createResponse(false, 400, '请提供有效的病种数据数组'));
        }

        const results = [];
        for (const disease of diseases) {
            const {
                disease_code,
                disease_name,
                department,
                revenue,
                cost,
                cases,
                breakeven_cases,
                avg_stay,
                record_date,
                doctor_id
            } = disease;

            // 基本验证
            if (!disease_code || !disease_name || !department || !revenue || !cost || !cases || !record_date) {
                throw new Error(`病种 ${disease_name || '未知'} 缺少必要字段`);
            }

            // 计算衍生字段
            const revenueNum = parseFloat(revenue);
            const costNum = parseFloat(cost);
            const casesNum = parseInt(cases);
            const profit = revenueNum - costNum;
            const avg_revenue = revenueNum / casesNum;
            const avg_cost = costNum / casesNum;
            const avg_profit = profit / casesNum;
            const profit_rate = revenueNum > 0 ? (profit / revenueNum) * 100 : 0;

            const newRecord = {
                id: nextId++,
                disease_code,
                disease_name,
                department,
                revenue: revenueNum,
                cost: costNum,
                profit,
                cases: casesNum,
                avg_revenue,
                avg_cost,
                avg_profit,
                profit_rate,
                breakeven_cases: breakeven_cases ? parseInt(breakeven_cases) : null,
                avg_stay: avg_stay ? parseFloat(avg_stay) : null,
                record_date,
                doctor_id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            mockData.push(newRecord);
            results.push({ id: newRecord.id, disease_code, disease_name });
        }

        res.status(201).json(createResponse(true, 201, '批量导入成功', {
            imported: results.length,
            results
        }));

    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json(createResponse(false, 500, `批量导入失败: ${error.message}`));
    }
});

// ================================
// 错误处理和404
// ================================

// 404处理
app.use('*', (req, res) => {
    res.status(404).json(createResponse(false, 404, `接口不存在: ${req.originalUrl}`));
});

// 全局错误处理
app.use((error, req, res, next) => {
    console.error('Unhandled Error:', error);
    res.status(500).json(createResponse(false, 500, '服务器内部错误'));
});

// ================================
// 服务启动
// ================================

app.listen(PORT, () => {
    console.log('\n🚀 病种效益分析API服务启动成功! (模拟数据模式)');
    console.log(`📡 服务地址: http://localhost:${PORT}`);
    console.log(`📖 主要接口:`);
    console.log(`   GET    /api/disease-benefit          - 获取病种效益列表`);
    console.log(`   GET    /api/disease-benefit/:id      - 获取病种详情`);
    console.log(`   POST   /api/disease-benefit          - 创建病种记录`);
    console.log(`   PUT    /api/disease-benefit/:id      - 更新病种记录`);
    console.log(`   DELETE /api/disease-benefit/:id      - 删除病种记录`);
    console.log(`   GET    /api/disease-benefit/stats    - 获取统计数据`);
    console.log(`   GET    /api/disease-benefit/departments - 获取科室列表`);
    console.log(`   POST   /api/disease-benefit/export   - 导出数据`);
    console.log(`   POST   /api/disease-benefit/batch    - 批量导入`);
    console.log(`   GET    /api/health                   - 健康检查`);
    console.log(`\n💡 前端配置: apiUrl: 'http://localhost:${PORT}/api/disease-benefit'`);
    console.log(`🗄️  数据模式: 内存模拟数据 (${mockData.length} 条记录)`);
    console.log(`\n✨ 模拟数据包含:`);
    console.log(`   - 30个病种记录`);
    console.log(`   - 8个科室: 心内科、神经内科、呼吸内科、消化内科、骨科、妇产科、儿科、泌尿外科、眼科`);
    console.log(`   - 完整的收入、成本、结余计算`);
    console.log(`   - 多时间段数据（2024年1-3月）`);
    console.log(`   - 支持所有API功能测试`);
});

// 优雅关闭
process.on('SIGINT', () => {
    console.log('\n🛑 正在关闭服务...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 正在关闭服务...');
    process.exit(0);
});

module.exports = app;