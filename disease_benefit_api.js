#!/usr/bin/env node
/**
 * 病种效益分析API - 完整JavaScript后端实现
 * 支持病种效益数据的增删改查、统计分析、数据导出等功能
 * 
 * 启动命令: node disease_benefit_api.js
 * API地址: http://localhost:5000/api/disease-benefit
 */

// 加载环境变量
require('dotenv').config();

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

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
// 数据库配置
// ================================
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hospital_db',
    charset: 'utf8mb4',
    timezone: '+08:00',
    acquireTimeout: 60000,
    timeout: 60000
};

// 创建数据库连接池
const pool = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    reconnect: true
});

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
 * 错误处理函数
 */
const handleError = (res, error, message = '服务器内部错误') => {
    console.error('API Error:', error);
    const errorMessage = error.code === 'ER_NO_SUCH_TABLE' 
        ? '数据库表不存在，请先初始化数据库' 
        : `${message}: ${error.message}`;
    
    res.status(500).json(createResponse(false, 500, errorMessage));
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
        avg_stay: parseFloat(disease.avg_stay || 0),
        record_date: disease.record_date ? new Date(disease.record_date).toISOString().split('T')[0] : null
    };
};

/**
 * 构建查询条件
 */
const buildWhereClause = (filters) => {
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (filters.department) {
        whereClause += ' AND department = ?';
        params.push(filters.department);
    }

    if (filters.dateStart) {
        whereClause += ' AND record_date >= ?';
        params.push(filters.dateStart);
    }

    if (filters.dateEnd) {
        whereClause += ' AND record_date <= ?';
        params.push(filters.dateEnd);
    }

    if (filters.diseaseCode) {
        whereClause += ' AND disease_code LIKE ?';
        params.push(`%${filters.diseaseCode}%`);
    }

    if (filters.diseaseName) {
        whereClause += ' AND disease_name LIKE ?';
        params.push(`%${filters.diseaseName}%`);
    }

    if (filters.minProfitRate !== undefined) {
        whereClause += ' AND profit_rate >= ?';
        params.push(filters.minProfitRate);
    }

    if (filters.maxProfitRate !== undefined) {
        whereClause += ' AND profit_rate <= ?';
        params.push(filters.maxProfitRate);
    }

    return { whereClause, params };
};

// ================================
// 数据库初始化
// ================================

/**
 * 初始化数据库表结构
 */
async function initializeDatabase() {
    try {
        const connection = await pool.getConnection();
        
        // 创建病种效益表
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS disease_benefit (
                id INT PRIMARY KEY AUTO_INCREMENT,
                disease_code VARCHAR(20) NOT NULL,
                disease_name VARCHAR(100) NOT NULL,
                department VARCHAR(50) NOT NULL,
                revenue DECIMAL(12,2) NOT NULL DEFAULT 0,
                cost DECIMAL(12,2) NOT NULL DEFAULT 0,
                profit DECIMAL(12,2) GENERATED ALWAYS AS (revenue-cost) STORED,
                cases INT NOT NULL DEFAULT 0,
                avg_revenue DECIMAL(12,2) GENERATED ALWAYS AS (CASE WHEN cases > 0 THEN revenue/cases ELSE 0 END) STORED,
                avg_cost DECIMAL(12,2) GENERATED ALWAYS AS (CASE WHEN cases > 0 THEN cost/cases ELSE 0 END) STORED,
                avg_profit DECIMAL(12,2) GENERATED ALWAYS AS (CASE WHEN cases > 0 THEN profit/cases ELSE 0 END) STORED,
                profit_rate DECIMAL(5,2) GENERATED ALWAYS AS (CASE WHEN revenue > 0 THEN profit/revenue*100 ELSE 0 END) STORED,
                breakeven_cases INT,
                avg_stay DECIMAL(5,2),
                record_date DATE NOT NULL,
                doctor_id VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                
                INDEX idx_department (department),
                INDEX idx_date (record_date),
                INDEX idx_disease (disease_code),
                INDEX idx_profit_rate (profit_rate),
                INDEX idx_cases (cases),
                
                CONSTRAINT chk_revenue CHECK (revenue >= 0),
                CONSTRAINT chk_cost CHECK (cost >= 0),
                CONSTRAINT chk_cases CHECK (cases > 0),
                CONSTRAINT chk_avg_stay CHECK (avg_stay > 0)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `;

        await connection.execute(createTableSQL);

        // 检查是否有数据，如果没有则插入示例数据
        const [rows] = await connection.execute('SELECT COUNT(*) as count FROM disease_benefit');
        if (rows[0].count === 0) {
            await insertSampleData(connection);
        }

        connection.release();
        console.log('✅ 数据库初始化完成');
    } catch (error) {
        console.error('❌ 数据库初始化失败:', error);
    }
}

/**
 * 插入示例数据
 */
async function insertSampleData(connection) {
    const sampleData = [
        ['I21.9', '急性心肌梗死', '心内科', 1250000.00, 980000.00, 45, 35, 8.5, '2024-01-15', 'DOC001'],
        ['I50.9', '心力衰竭', '心内科', 890000.00, 720000.00, 38, 30, 12.3, '2024-01-15', 'DOC002'],
        ['I25.1', '冠心病', '心内科', 2100000.00, 1650000.00, 85, 65, 6.8, '2024-01-15', 'DOC001'],
        ['I63.9', '脑梗死', '神经内科', 1680000.00, 1320000.00, 62, 48, 15.2, '2024-01-15', 'DOC003'],
        ['G93.1', '脑出血', '神经内科', 980000.00, 850000.00, 28, 24, 18.7, '2024-01-15', 'DOC004'],
        ['J44.1', '慢性阻塞性肺病', '呼吸内科', 750000.00, 580000.00, 42, 32, 9.8, '2024-01-15', 'DOC005'],
        ['J18.9', '肺炎', '呼吸内科', 1200000.00, 920000.00, 68, 52, 7.5, '2024-01-15', 'DOC006'],
        ['K25.9', '胃溃疡', '消化内科', 680000.00, 520000.00, 35, 27, 5.8, '2024-01-15', 'DOC007'],
        ['K72.9', '肝硬化', '消化内科', 1450000.00, 1180000.00, 52, 42, 14.2, '2024-01-15', 'DOC008'],
        ['S72.0', '股骨颈骨折', '骨科', 1850000.00, 1420000.00, 48, 37, 12.5, '2024-01-15', 'DOC009']
    ];

    const insertSQL = `
        INSERT INTO disease_benefit (
            disease_code, disease_name, department, revenue, cost, cases, 
            breakeven_cases, avg_stay, record_date, doctor_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    for (const data of sampleData) {
        await connection.execute(insertSQL, data);
    }

    console.log('✅ 示例数据插入完成');
}

// ================================
// API路由
// ================================

/**
 * 健康检查接口
 */
app.get('/api/health', (req, res) => {
    res.json(createResponse(true, 200, 'API服务正常运行', {
        service: 'Disease Benefit API',
        version: '1.0.0',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    }));
});

/**
 * GET /api/disease-benefit
 * 获取病种效益数据列表
 */
app.get('/api/disease-benefit', async (req, res) => {
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

        // 构建查询条件
        const filters = {
            department,
            dateStart,
            dateEnd,
            diseaseCode,
            diseaseName,
            minProfitRate: minProfitRate ? parseFloat(minProfitRate) : undefined,
            maxProfitRate: maxProfitRate ? parseFloat(maxProfitRate) : undefined
        };

        const { whereClause, params } = buildWhereClause(filters);

        // 验证排序字段
        const allowedSortFields = ['id', 'disease_code', 'disease_name', 'department', 'revenue', 'cost', 'profit', 'cases', 'profit_rate', 'record_date'];
        const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'record_date';
        const validSortOrder = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

        // 主查询
        const offset = (parseInt(page) - 1) * parseInt(pageSize);
        const mainQuery = `
            SELECT 
                id,
                disease_code,
                disease_name,
                department,
                revenue,
                cost,
                profit,
                cases,
                avg_revenue,
                avg_cost,
                avg_profit,
                profit_rate,
                breakeven_cases,
                avg_stay,
                record_date,
                doctor_id,
                created_at,
                updated_at
            FROM disease_benefit 
            ${whereClause}
            ORDER BY ${validSortBy} ${validSortOrder}
            LIMIT ? OFFSET ?
        `;

        // 计数查询
        const countQuery = `
            SELECT COUNT(*) as total 
            FROM disease_benefit 
            ${whereClause}
        `;

        // 执行查询
        const limitParams = [...params, parseInt(pageSize), parseInt(offset)];
        const [diseases] = await pool.execute(mainQuery, limitParams);
        const [countResult] = await pool.execute(countQuery, params);
        const total = countResult[0].total;

        // 格式化数据
        const formattedDiseases = diseases.map(formatDiseaseData);

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
        handleError(res, error, '获取病种效益数据失败');
    }
});

/**
 * GET /api/disease-benefit/:id
 * 获取单个病种详情
 */
app.get('/api/disease-benefit/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json(createResponse(false, 400, '无效的病种ID'));
        }

        const [rows] = await pool.execute(
            'SELECT * FROM disease_benefit WHERE id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json(createResponse(false, 404, '病种数据不存在'));
        }

        const disease = formatDiseaseData(rows[0]);

        res.json(createResponse(true, 200, '获取成功', disease));

    } catch (error) {
        handleError(res, error, '获取病种详情失败');
    }
});

/**
 * POST /api/disease-benefit
 * 创建新的病种效益记录
 */
app.post('/api/disease-benefit', async (req, res) => {
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

        const insertSQL = `
            INSERT INTO disease_benefit (
                disease_code, disease_name, department, revenue, cost, cases,
                breakeven_cases, avg_stay, record_date, doctor_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await pool.execute(insertSQL, [
            disease_code,
            disease_name,
            department,
            parseFloat(revenue),
            parseFloat(cost),
            parseInt(cases),
            breakeven_cases ? parseInt(breakeven_cases) : null,
            avg_stay ? parseFloat(avg_stay) : null,
            record_date,
            doctor_id
        ]);

        // 获取新创建的记录
        const [newRecord] = await pool.execute(
            'SELECT * FROM disease_benefit WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json(createResponse(true, 201, '创建成功', formatDiseaseData(newRecord[0])));

    } catch (error) {
        handleError(res, error, '创建病种效益记录失败');
    }
});

/**
 * PUT /api/disease-benefit/:id
 * 更新病种效益记录
 */
app.put('/api/disease-benefit/:id', async (req, res) => {
    try {
        const { id } = req.params;
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

        if (!id || isNaN(id)) {
            return res.status(400).json(createResponse(false, 400, '无效的病种ID'));
        }

        // 检查记录是否存在
        const [existingRecord] = await pool.execute(
            'SELECT id FROM disease_benefit WHERE id = ?',
            [id]
        );

        if (existingRecord.length === 0) {
            return res.status(404).json(createResponse(false, 404, '病种数据不存在'));
        }

        // 数据验证
        if (revenue !== undefined && parseFloat(revenue) < 0) {
            return res.status(400).json(createResponse(false, 400, '收入不能为负数'));
        }

        if (cost !== undefined && parseFloat(cost) < 0) {
            return res.status(400).json(createResponse(false, 400, '成本不能为负数'));
        }

        if (cases !== undefined && parseInt(cases) <= 0) {
            return res.status(400).json(createResponse(false, 400, '病例数必须大于0'));
        }

        const updateSQL = `
            UPDATE disease_benefit SET
                disease_code = COALESCE(?, disease_code),
                disease_name = COALESCE(?, disease_name),
                department = COALESCE(?, department),
                revenue = COALESCE(?, revenue),
                cost = COALESCE(?, cost),
                cases = COALESCE(?, cases),
                breakeven_cases = COALESCE(?, breakeven_cases),
                avg_stay = COALESCE(?, avg_stay),
                record_date = COALESCE(?, record_date),
                doctor_id = COALESCE(?, doctor_id)
            WHERE id = ?
        `;

        await pool.execute(updateSQL, [
            disease_code,
            disease_name,
            department,
            revenue ? parseFloat(revenue) : null,
            cost ? parseFloat(cost) : null,
            cases ? parseInt(cases) : null,
            breakeven_cases ? parseInt(breakeven_cases) : null,
            avg_stay ? parseFloat(avg_stay) : null,
            record_date,
            doctor_id,
            id
        ]);

        // 获取更新后的记录
        const [updatedRecord] = await pool.execute(
            'SELECT * FROM disease_benefit WHERE id = ?',
            [id]
        );

        res.json(createResponse(true, 200, '更新成功', formatDiseaseData(updatedRecord[0])));

    } catch (error) {
        handleError(res, error, '更新病种效益记录失败');
    }
});

/**
 * DELETE /api/disease-benefit/:id
 * 删除病种效益记录
 */
app.delete('/api/disease-benefit/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json(createResponse(false, 400, '无效的病种ID'));
        }

        // 检查记录是否存在
        const [existingRecord] = await pool.execute(
            'SELECT id FROM disease_benefit WHERE id = ?',
            [id]
        );

        if (existingRecord.length === 0) {
            return res.status(404).json(createResponse(false, 404, '病种数据不存在'));
        }

        await pool.execute('DELETE FROM disease_benefit WHERE id = ?', [id]);

        res.json(createResponse(true, 200, '删除成功'));

    } catch (error) {
        handleError(res, error, '删除病种效益记录失败');
    }
});

/**
 * GET /api/disease-benefit/stats
 * 获取病种效益统计数据
 */
app.get('/api/disease-benefit/stats', async (req, res) => {
    try {
        const { department, dateStart, dateEnd } = req.query;

        // 构建查询条件
        const filters = { department, dateStart, dateEnd };
        const { whereClause, params } = buildWhereClause(filters);

        const [rows] = await pool.execute(`
            SELECT 
                COUNT(*) as total_diseases,
                SUM(cases) as total_cases,
                SUM(revenue) as total_revenue,
                SUM(cost) as total_cost,
                SUM(profit) as total_profit,
                AVG(profit_rate) as avg_profit_rate,
                COUNT(DISTINCT department) as total_departments,
                MAX(profit_rate) as max_profit_rate,
                MIN(profit_rate) as min_profit_rate,
                AVG(avg_stay) as avg_stay_overall
            FROM disease_benefit
            ${whereClause}
        `, params);

        // 获取科室统计
        const [deptStats] = await pool.execute(`
            SELECT 
                department,
                COUNT(*) as disease_count,
                SUM(cases) as total_cases,
                SUM(revenue) as total_revenue,
                SUM(cost) as total_cost,
                SUM(profit) as total_profit,
                AVG(profit_rate) as avg_profit_rate
            FROM disease_benefit
            ${whereClause}
            GROUP BY department
            ORDER BY total_profit DESC
        `, params);

        // 获取月度趋势
        const [monthlyTrend] = await pool.execute(`
            SELECT 
                DATE_FORMAT(record_date, '%Y-%m') as month,
                COUNT(*) as disease_count,
                SUM(cases) as total_cases,
                SUM(revenue) as total_revenue,
                SUM(cost) as total_cost,
                SUM(profit) as total_profit,
                AVG(profit_rate) as avg_profit_rate
            FROM disease_benefit
            ${whereClause}
            GROUP BY DATE_FORMAT(record_date, '%Y-%m')
            ORDER BY month DESC
            LIMIT 12
        `, params);

        const stats = {
            overview: {
                ...rows[0],
                total_revenue: parseFloat(rows[0].total_revenue || 0),
                total_cost: parseFloat(rows[0].total_cost || 0),
                total_profit: parseFloat(rows[0].total_profit || 0),
                avg_profit_rate: parseFloat(rows[0].avg_profit_rate || 0),
                max_profit_rate: parseFloat(rows[0].max_profit_rate || 0),
                min_profit_rate: parseFloat(rows[0].min_profit_rate || 0),
                avg_stay_overall: parseFloat(rows[0].avg_stay_overall || 0)
            },
            departmentStats: deptStats.map(dept => ({
                ...dept,
                total_revenue: parseFloat(dept.total_revenue || 0),
                total_cost: parseFloat(dept.total_cost || 0),
                total_profit: parseFloat(dept.total_profit || 0),
                avg_profit_rate: parseFloat(dept.avg_profit_rate || 0)
            })),
            monthlyTrend: monthlyTrend.map(month => ({
                ...month,
                total_revenue: parseFloat(month.total_revenue || 0),
                total_cost: parseFloat(month.total_cost || 0),
                total_profit: parseFloat(month.total_profit || 0),
                avg_profit_rate: parseFloat(month.avg_profit_rate || 0)
            }))
        };

        res.json(createResponse(true, 200, '获取成功', stats));

    } catch (error) {
        handleError(res, error, '获取统计数据失败');
    }
});

/**
 * GET /api/disease-benefit/departments
 * 获取科室列表
 */
app.get('/api/disease-benefit/departments', async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT DISTINCT department 
            FROM disease_benefit 
            WHERE department IS NOT NULL 
            ORDER BY department
        `);

        const departments = rows.map(row => row.department);

        res.json(createResponse(true, 200, '获取成功', departments));

    } catch (error) {
        handleError(res, error, '获取科室列表失败');
    }
});

/**
 * POST /api/disease-benefit/export
 * 导出病种效益数据
 */
app.post('/api/disease-benefit/export', async (req, res) => {
    try {
        const { format = 'json', filters = {} } = req.body;

        // 构建查询条件
        const { whereClause, params } = buildWhereClause(filters);

        // 获取导出数据
        const [diseases] = await pool.execute(`
            SELECT 
                disease_code as '病种编码',
                disease_name as '病种名称',
                department as '科室',
                cases as '病例数',
                revenue as '总收入',
                cost as '总成本',
                profit as '总结余',
                avg_revenue as '平均收入',
                avg_cost as '平均成本',
                avg_profit as '平均结余',
                profit_rate as '结余率(%)',
                breakeven_cases as '保本例数',
                avg_stay as '平均住院天数',
                record_date as '记录日期',
                doctor_id as '医生ID'
            FROM disease_benefit 
            ${whereClause}
            ORDER BY record_date DESC, profit_rate DESC
        `, params);

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `病种效益分析_${timestamp}.${format}`;

        let exportData;
        let contentType;

        switch (format.toLowerCase()) {
            case 'csv':
                exportData = convertToCSV(diseases);
                contentType = 'text/csv';
                break;
            case 'json':
            default:
                exportData = JSON.stringify(diseases, null, 2);
                contentType = 'application/json';
                break;
        }

        // 设置响应头
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

        res.send(exportData);

    } catch (error) {
        handleError(res, error, '导出失败');
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
app.post('/api/disease-benefit/batch', async (req, res) => {
    try {
        const { diseases } = req.body;

        if (!Array.isArray(diseases) || diseases.length === 0) {
            return res.status(400).json(createResponse(false, 400, '请提供有效的病种数据数组'));
        }

        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            const insertSQL = `
                INSERT INTO disease_benefit (
                    disease_code, disease_name, department, revenue, cost, cases,
                    breakeven_cases, avg_stay, record_date, doctor_id
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

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

                const [result] = await connection.execute(insertSQL, [
                    disease_code,
                    disease_name,
                    department,
                    parseFloat(revenue),
                    parseFloat(cost),
                    parseInt(cases),
                    breakeven_cases ? parseInt(breakeven_cases) : null,
                    avg_stay ? parseFloat(avg_stay) : null,
                    record_date,
                    doctor_id
                ]);

                results.push({ id: result.insertId, disease_code, disease_name });
            }

            await connection.commit();
            connection.release();

            res.status(201).json(createResponse(true, 201, '批量导入成功', {
                imported: results.length,
                results
            }));

        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }

    } catch (error) {
        handleError(res, error, '批量导入失败');
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

async function startServer() {
    try {
        // 测试数据库连接
        await pool.execute('SELECT 1');
        console.log('✅ 数据库连接成功');

        // 初始化数据库
        await initializeDatabase();

        // 启动服务器
        app.listen(PORT, () => {
            console.log('\n🚀 病种效益分析API服务启动成功!');
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
            console.log(`🔧 数据库: ${dbConfig.host}:3306/${dbConfig.database}`);
        });

    } catch (error) {
        console.error('❌ 服务启动失败:', error);
        process.exit(1);
    }
}

// 优雅关闭
process.on('SIGINT', async () => {
    console.log('\n🛑 正在关闭服务...');
    await pool.end();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 正在关闭服务...');
    await pool.end();
    process.exit(0);
});

// 启动服务
startServer();

module.exports = app;