const mysql = require('mysql2/promise');

async function testDatabase() {
    const dbConfig = {
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'hospital_db',
        charset: 'utf8mb4'
    };

    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('✅ 数据库连接成功');

        // 查看表结构
        const [tables] = await connection.execute('SHOW TABLES');
        console.log('📋 数据库表:', tables);

        // 查看disease_benefit表结构
        const [columns] = await connection.execute('DESCRIBE disease_benefit');
        console.log('🏗️ disease_benefit表结构:');
        columns.forEach(col => {
            console.log(`  ${col.Field}: ${col.Type} ${col.Null} ${col.Key} ${col.Default}`);
        });

        // 查询所有数据
        const [rows] = await connection.execute('SELECT * FROM disease_benefit ORDER BY id');
        console.log(`📊 总共有 ${rows.length} 条数据:`);
        
        rows.forEach((row, index) => {
            console.log(`${index + 1}. [${row.disease_code}] ${row.disease_name} - ${row.department}`);
            console.log(`   收入: ${row.revenue}, 成本: ${row.cost}, 利润: ${row.profit}, 利润率: ${row.profit_rate}%`);
        });

        await connection.end();
    } catch (error) {
        console.error('❌ 数据库错误:', error);
    }
}

testDatabase();