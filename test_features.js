#!/usr/bin/env node

/**
 * 病种效益API功能测试脚本
 * 专门测试用户提到的5个功能
 */

const http = require('http');

const API_BASE_URL = 'http://localhost:5000';

// 颜色输出
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(path) {
    return new Promise((resolve, reject) => {
        const url = `${API_BASE_URL}${path}`;
        log(`🔍 测试: ${url}`, 'cyan');
        
        http.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve({
                        status: res.statusCode,
                        data: jsonData
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        data: data
                    });
                }
            });
        }).on('error', reject);
    });
}

async function testFeatures() {
    log('\n🎯 病种效益API功能测试', 'blue');
    log('=' .repeat(50), 'blue');
    
    const tests = [
        {
            name: '1. 科室筛选 - 妇产科',
            path: '/api/disease-benefit?department=妇产科'
        },
        {
            name: '2. 日期范围 - 2024年2月',
            path: '/api/disease-benefit?dateStart=2024-02-01&dateEnd=2024-02-29'
        },
        {
            name: '3. 结余率筛选 - 25%-30%',
            path: '/api/disease-benefit?minProfitRate=25&maxProfitRate=30'
        },
        {
            name: '4. 病种搜索 - 骨折',
            path: '/api/disease-benefit?diseaseName=骨折'
        },
        {
            name: '5. 分页浏览 - 第2页，每页15条',
            path: '/api/disease-benefit?page=2&pageSize=15'
        },
        {
            name: '6. 统计数据',
            path: '/api/disease-benefit/stats'
        },
        {
            name: '7. 科室列表',
            path: '/api/disease-benefit/departments'
        }
    ];
    
    let passCount = 0;
    let failCount = 0;
    
    for (const test of tests) {
        try {
            log(`\n${test.name}`, 'yellow');
            const result = await makeRequest(test.path);
            
            if (result.status === 200 && result.data.success) {
                log(`✅ 成功 - 返回 ${result.data.data?.length || '数据'} 条记录`, 'green');
                if (result.data.data?.length) {
                    log(`   示例数据: ${JSON.stringify(result.data.data[0], null, 2).substring(0, 200)}...`, 'cyan');
                } else if (typeof result.data.data === 'object') {
                    log(`   返回数据: ${JSON.stringify(result.data.data, null, 2).substring(0, 200)}...`, 'cyan');
                }
                passCount++;
            } else {
                log(`❌ 失败 - 状态码: ${result.status}`, 'red');
                log(`   错误信息: ${result.data.message || '未知错误'}`, 'red');
                failCount++;
            }
        } catch (error) {
            log(`❌ 请求失败: ${error.message}`, 'red');
            failCount++;
        }
    }
    
    log('\n' + '='.repeat(50), 'blue');
    log(`📊 测试结果统计:`, 'blue');
    log(`✅ 通过: ${passCount}`, 'green');
    log(`❌ 失败: ${failCount}`, 'red');
    log(`总计: ${passCount + failCount}`, 'blue');
    
    if (failCount === 0) {
        log('\n🎉 所有功能测试通过！', 'green');
    } else {
        log(`\n⚠️  有 ${failCount} 个功能需要检查`, 'yellow');
    }
}

// 运行测试
testFeatures().catch(console.error);