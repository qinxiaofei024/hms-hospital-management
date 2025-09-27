#!/usr/bin/env node
/**
 * 病种效益分析API - Node.js Express实现
 * 支持 /api/disease-benefit 接口
 */

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const moment = require('moment');

const app = express();
const PORT = 5000;

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 数据库配置
const dbConfig = {
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'hospital_db',
    charset: 'utf8mb4',
    timezone: '+08:00'
};

// 创建数据库连接池
const pool = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 统一响应格式
const createResponse = (success, code, message, data = null) => {
    return {
        success,
        code,
        message,
        data,
        timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
    };
};

// 错误处理中间件
const handleError = (res, error, message = '服务器内部错误') => {
    console.error('API Error:', error);
    res.status(500).json(createResponse(false, 500, `${message}: ${error.message}`));
};

/**
 * GET /api/disease-benefit
 * 获取病种效益数据列表
 */
app.get('/api/disease-benefit', async (req, res) => {
    try {
        const {
            department = '',
            dateStart = '',
            dateEnd = '',
            page = 1,
            pageSize = 20,
            sortBy = 'record_date',
            sortOrder = 'DESC'
        } = req.query;

        // 构建查询条件
        let whereClause = 'WHERE 1=1';
        const params = [];

        if (department) {
            whereClause += ' AND department = ?';
            params.push(department);
        }

        if (dateStart) {
            whereClause += ' AND record_date >= ?';
            params.push(dateStart);
        }

        if (dateEnd) {
            whereClause += ' AND record_date <= ?';
            params.push(dateEnd);
        }

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
            ORDER BY ${sortBy} ${sortOrder}
            LIMIT ? OFFSET ?
        `;

        // 计数查询
        const countQuery = `
            SELECT COUNT(*) as total 
            FROM disease_benefit 
            ${whereClause}
        `;

        // 执行查询
        const [diseases] = await pool.execute(mainQuery, [...params, parseInt(pageSize), offset]);
        const [countResult] = await pool.execute(countQuery, params);
        const total = countResult[0].total;

        // 格式化数据
        const formattedDiseases = diseases.map(disease => ({
            ...disease,
            revenue: parseFloat(disease.revenue),
            cost: parseFloat(disease.cost),
            profit: parseFloat(disease.profit),
            avg_revenue: parseFloat(disease.avg_revenue),
            avg_cost: parseFloat(disease.avg_cost),
            avg_profit: parseFloat(disease.avg_profit),
            profit_rate: parseFloat(disease.profit_rate),
            avg_stay: parseFloat(disease.avg_stay),
            record_date: moment(disease.record_date).format('YYYY-MM-DD')
        }));

        const responseData = {
            diseases: formattedDiseases,
            pagination: {
                total,
                page: parseInt(page),
                pageSize: parseInt(pageSize),
                totalPages: Math.ceil(total / parseInt(pageSize))
            }
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

        const [rows] = await pool.execute(
            'SELECT * FROM disease_benefit WHERE id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json(createResponse(false, 404, '病种数据不存在'));
        }

        const disease = {
            ...rows[0],
            revenue: parseFloat(rows[0].revenue),
            cost: parseFloat(rows[0].cost),
            profit: parseFloat(rows[0].profit),
            avg_revenue: parseFloat(rows[0].avg_revenue),
            avg_cost: parseFloat(rows[0].avg_cost),
            avg_profit: parseFloat(rows[0].avg_profit),
            profit_rate: parseFloat(rows[0].profit_rate),
            avg_stay: parseFloat(rows[0].avg_stay),
            record_date: moment(rows[0].record_date).format('YYYY-MM-DD')
        };

        res.json(createResponse(true, 200, '获取成功', disease));

    } catch (error) {
        handleError(res, error, '获取病种详情失败');
    }
});

/**
 * GET /api/disease-benefit/stats
 * 获取病种效益统计数据
 */
app.get('/api/disease-benefit/stats', async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT 
                COUNT(*) as total_diseases,
                SUM(cases) as total_cases,
                SUM(revenue) as total_revenue,
                SUM(cost) as total_cost,
                SUM(profit) as total_profit,
                AVG(profit_rate) as avg_profit_rate,
                COUNT(DISTINCT department) as total_departments
            FROM disease_benefit
        `);

        const stats = {
            ...rows[0],
            total_revenue: parseFloat(rows[0].total_revenue || 0),
            total_cost: parseFloat(rows[0].total_cost || 0),
            total_profit: parseFloat(rows[0].total_profit || 0),
            avg_profit_rate: parseFloat(rows[0].avg_profit_rate || 0)
        };

        res.json(createResponse(true, 200, '获取成功', stats));

    } catch (error) {
        handleError(res, error, '获取统计数据失败');
    }
});

/**
 * POST /api/disease-benefit/export
 * 导出病种效益数据
 */
app.post('/api/disease-benefit/export', async (req, res) => {
    try {
        const { format = 'excel', filters = {} } = req.body;

        // 这里可以实现具体的导出逻辑
        // 例如生成Excel、CSV或PDF文件

        const fileName = `病种效益分析_${moment().format('YYYYMMDD_HHmmss')}.${format}`;
        const downloadUrl = `/downloads/${fileName}`;

        res.json(createResponse(true, 200, '导出成功', {
            downloadUrl,
            fileName
        }));

    } catch (error) {
        handleError(res, error, '导出失败');
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

// 健康检查接口
app.get('/api/health', (req, res) => {
    res.json(createResponse(true, 200, 'API服务正常运行'));
});

// 404处理
app.use('*', (req, res) => {
    res.status(404).json(createResponse(false, 404, '接口不存在'));
});

// 启动服务器
app.listen(PORT, () => {
    console.log('🚀 病种效益分析API服务启动成功!');
    console.log(`📡 服务地址: http://localhost:${PORT}`);
    console.log(`📖 主要接口:`);
    console.log(`   GET  /api/disease-benefit          - 获取病种效益列表`);
    console.log(`   GET  /api/disease-benefit/:id      - 获取病种详情`);
    console.log(`   GET  /api/disease-benefit/stats    - 获取统计数据`);
    console.log(`   POST /api/disease-benefit/export   - 导出数据`);
    console.log(`   GET  /api/health                   - 健康检查`);
});

module.exports = app;