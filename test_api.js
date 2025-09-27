#!/usr/bin/env node
/**
 * 病种效益API测试脚本
 * 用于测试所有API接口的功能
 * 
 * 运行命令: node test_api.js
 */

const http = require('http');
const https = require('https');

// 配置
const API_BASE_URL = 'http://localhost:5000';
const TEST_TIMEOUT = 10000; // 10秒超时

// 颜色输出
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

/**
 * 发送HTTP请求
 */
function makeRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, API_BASE_URL);
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: TEST_TIMEOUT
        };

        const req = http.request(url, options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const response = {
                        status: res.statusCode,
                        headers: res.headers,
                        data: body ? JSON.parse(body) : null
                    };
                    resolve(response);
                } catch (error) {
                    resolve({
                        status: res.statusCode,
                        headers: res.headers,
                        data: body,
                        parseError: error.message
                    });
                }
            });
        });

        req.on('error', reject);
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

/**
 * 日志输出函数
 */
function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
    log(`✅ ${message}`, 'green');
}

function logError(message) {
    log(`❌ ${message}`, 'red');
}

function logInfo(message) {
    log(`ℹ️  ${message}`, 'blue');
}

function logWarning(message) {
    log(`⚠️  ${message}`, 'yellow');
}

/**
 * 测试用例
 */
const tests = [
    {
        name: '健康检查',
        method: 'GET',
        path: '/api/health',
        expectedStatus: 200,
        validate: (response) => {
            return response.data && response.data.success === true;
        }
    },
    {
        name: '获取病种效益列表',
        method: 'GET',
        path: '/api/disease-benefit',
        expectedStatus: 200,
        validate: (response) => {
            return response.data && 
                   response.data.success === true && 
                   Array.isArray(response.data.data.diseases);
        }
    },
    {
        name: '获取病种效益列表（带分页）',
        method: 'GET',
        path: '/api/disease-benefit?page=1&pageSize=5',
        expectedStatus: 200,
        validate: (response) => {
            return response.data && 
                   response.data.success === true && 
                   response.data.data.pagination &&
                   response.data.data.diseases.length <= 5;
        }
    },
    {
        name: '获取病种效益列表（带筛选）',
        method: 'GET',
        path: '/api/disease-benefit?department=心内科&minProfitRate=10',
        expectedStatus: 200,
        validate: (response) => {
            return response.data && response.data.success === true;
        }
    },
    {
        name: '获取统计数据',
        method: 'GET',
        path: '/api/disease-benefit/stats',
        expectedStatus: 200,
        validate: (response) => {
            return response.data && 
                   response.data.success === true && 
                   response.data.data.overview &&
                   Array.isArray(response.data.data.departmentStats);
        }
    },
    {
        name: '获取科室列表',
        method: 'GET',
        path: '/api/disease-benefit/departments',
        expectedStatus: 200,
        validate: (response) => {
            return response.data && 
                   response.data.success === true && 
                   Array.isArray(response.data.data);
        }
    },
    {
        name: '创建新病种记录',
        method: 'POST',
        path: '/api/disease-benefit',
        data: {
            disease_code: 'TEST001',
            disease_name: '测试病种',
            department: '测试科室',
            revenue: 100000,
            cost: 80000,
            cases: 10,
            breakeven_cases: 8,
            avg_stay: 7.5,
            record_date: '2024-01-20',
            doctor_id: 'TEST_DOC'
        },
        expectedStatus: 201,
        validate: (response) => {
            return response.data && 
                   response.data.success === true && 
                   response.data.data.disease_code === 'TEST001';
        }
    },
    {
        name: '获取单个病种详情',
        method: 'GET',
        path: '/api/disease-benefit/1',
        expectedStatus: [200, 404], // 可能存在也可能不存在
        validate: (response) => {
            return response.data && typeof response.data.success === 'boolean';
        }
    },
    {
        name: '导出数据（JSON格式）',
        method: 'POST',
        path: '/api/disease-benefit/export',
        data: {
            format: 'json',
            filters: {
                department: '心内科'
            }
        },
        expectedStatus: 200,
        validate: (response) => {
            return response.status === 200; // 导出接口返回文件内容
        }
    },
    {
        name: '导出数据（CSV格式）',
        method: 'POST',
        path: '/api/disease-benefit/export',
        data: {
            format: 'csv',
            filters: {}
        },
        expectedStatus: 200,
        validate: (response) => {
            return response.status === 200;
        }
    },
    {
        name: '批量导入数据',
        method: 'POST',
        path: '/api/disease-benefit/batch',
        data: {
            diseases: [
                {
                    disease_code: 'BATCH001',
                    disease_name: '批量测试病种1',
                    department: '测试科室',
                    revenue: 50000,
                    cost: 40000,
                    cases: 5,
                    record_date: '2024-01-21'
                },
                {
                    disease_code: 'BATCH002',
                    disease_name: '批量测试病种2',
                    department: '测试科室',
                    revenue: 60000,
                    cost: 45000,
                    cases: 6,
                    record_date: '2024-01-21'
                }
            ]
        },
        expectedStatus: 201,
        validate: (response) => {
            return response.data && 
                   response.data.success === true && 
                   response.data.data.imported === 2;
        }
    },
    {
        name: '测试无效请求（404）',
        method: 'GET',
        path: '/api/invalid-endpoint',
        expectedStatus: 404,
        validate: (response) => {
            return response.data && response.data.success === false;
        }
    },
    {
        name: '测试无效数据创建',
        method: 'POST',
        path: '/api/disease-benefit',
        data: {
            disease_code: 'INVALID',
            // 缺少必要字段
        },
        expectedStatus: 400,
        validate: (response) => {
            return response.data && response.data.success === false;
        }
    }
];

/**
 * 运行单个测试
 */
async function runTest(test) {
    try {
        logInfo(`正在测试: ${test.name}`);
        
        const response = await makeRequest(test.method, test.path, test.data);
        
        // 检查状态码
        const expectedStatuses = Array.isArray(test.expectedStatus) 
            ? test.expectedStatus 
            : [test.expectedStatus];
        
        if (!expectedStatuses.includes(response.status)) {
            logError(`状态码不匹配: 期望 ${test.expectedStatus}, 实际 ${response.status}`);
            console.log('响应数据:', JSON.stringify(response.data, null, 2));
            return false;
        }
        
        // 自定义验证
        if (test.validate && !test.validate(response)) {
            logError(`验证失败`);
            console.log('响应数据:', JSON.stringify(response.data, null, 2));
            return false;
        }
        
        logSuccess(`测试通过: ${test.name}`);
        return true;
        
    } catch (error) {
        logError(`测试失败: ${test.name} - ${error.message}`);
        return false;
    }
}

/**
 * 运行所有测试
 */
async function runAllTests() {
    log('\n🧪 开始运行API测试...', 'cyan');
    log('='.repeat(50), 'cyan');
    
    let passed = 0;
    let failed = 0;
    
    for (const test of tests) {
        const result = await runTest(test);
        if (result) {
            passed++;
        } else {
            failed++;
        }
        console.log(''); // 空行分隔
    }
    
    log('='.repeat(50), 'cyan');
    log(`\n📊 测试结果统计:`, 'cyan');
    logSuccess(`通过: ${passed}`);
    if (failed > 0) {
        logError(`失败: ${failed}`);
    }
    log(`总计: ${passed + failed}`, 'blue');
    
    if (failed === 0) {
        logSuccess('\n🎉 所有测试都通过了！');
    } else {
        logWarning(`\n⚠️  有 ${failed} 个测试失败，请检查API服务`);
    }
    
    return failed === 0;
}

/**
 * 检查API服务是否运行
 */
async function checkApiService() {
    try {
        logInfo('检查API服务状态...');
        const response = await makeRequest('GET', '/api/health');
        
        if (response.status === 200 && response.data && response.data.success) {
            logSuccess('API服务正在运行');
            return true;
        } else {
            logError('API服务响应异常');
            return false;
        }
    } catch (error) {
        logError(`无法连接到API服务: ${error.message}`);
        logWarning('请确保API服务已启动: node disease_benefit_api.js');
        return false;
    }
}

/**
 * 主函数
 */
async function main() {
    log('🚀 病种效益API测试工具', 'magenta');
    log(`📡 API地址: ${API_BASE_URL}`, 'blue');
    
    // 检查服务状态
    const serviceRunning = await checkApiService();
    if (!serviceRunning) {
        process.exit(1);
    }
    
    // 运行测试
    const allPassed = await runAllTests();
    
    process.exit(allPassed ? 0 : 1);
}

// 处理未捕获的异常
process.on('unhandledRejection', (reason, promise) => {
    logError(`未处理的Promise拒绝: ${reason}`);
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    logError(`未捕获的异常: ${error.message}`);
    process.exit(1);
});

// 启动测试
if (require.main === module) {
    main();
}

module.exports = { runAllTests, runTest, makeRequest };