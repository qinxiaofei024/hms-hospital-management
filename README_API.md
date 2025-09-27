# 病种效益分析API - JavaScript后端

完整的病种效益分析后端API服务，使用Node.js + Express + MySQL实现。

## 🚀 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 配置数据库
确保MySQL服务已启动，然后执行数据库初始化脚本：
```sql
-- 在MySQL中执行 database_config.sql 文件
mysql -u root -p < database_config.sql
```

### 3. 环境配置
创建 `.env` 文件（可选）：
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=hospital_db
PORT=5000
```

### 4. 启动服务
```bash
# 生产环境
npm start

# 开发环境（自动重启）
npm run dev

# 直接运行
node disease_benefit_api.js
```

### 5. 测试API
```bash
# 运行API测试
npm test
# 或
node test_api.js
```

## 📡 API接口文档

### 基础信息
- **服务地址**: `http://localhost:5000`
- **API前缀**: `/api/disease-benefit`
- **响应格式**: JSON

### 统一响应格式
```json
{
  "success": true,
  "code": 200,
  "message": "操作成功",
  "data": {},
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

### 接口列表

#### 1. 健康检查
```http
GET /api/health
```

#### 2. 获取病种效益列表
```http
GET /api/disease-benefit
```

**查询参数**:
- `page`: 页码（默认1）
- `pageSize`: 每页数量（默认20）
- `department`: 科室筛选
- `dateStart`: 开始日期
- `dateEnd`: 结束日期
- `diseaseCode`: 病种编码筛选
- `diseaseName`: 病种名称筛选
- `minProfitRate`: 最小结余率
- `maxProfitRate`: 最大结余率
- `sortBy`: 排序字段
- `sortOrder`: 排序方向（ASC/DESC）

**示例**:
```http
GET /api/disease-benefit?department=心内科&page=1&pageSize=10&sortBy=profit_rate&sortOrder=DESC
```

#### 3. 获取单个病种详情
```http
GET /api/disease-benefit/:id
```

#### 4. 创建病种记录
```http
POST /api/disease-benefit
Content-Type: application/json

{
  "disease_code": "I21.9",
  "disease_name": "急性心肌梗死",
  "department": "心内科",
  "revenue": 1250000.00,
  "cost": 980000.00,
  "cases": 45,
  "breakeven_cases": 35,
  "avg_stay": 8.5,
  "record_date": "2024-01-15",
  "doctor_id": "DOC001"
}
```

#### 5. 更新病种记录
```http
PUT /api/disease-benefit/:id
Content-Type: application/json

{
  "revenue": 1300000.00,
  "cost": 1000000.00,
  "cases": 50
}
```

#### 6. 删除病种记录
```http
DELETE /api/disease-benefit/:id
```

#### 7. 获取统计数据
```http
GET /api/disease-benefit/stats
```

**查询参数**:
- `department`: 科室筛选
- `dateStart`: 开始日期
- `dateEnd`: 结束日期

**响应数据**:
```json
{
  "success": true,
  "data": {
    "overview": {
      "total_diseases": 10,
      "total_cases": 500,
      "total_revenue": 12500000.00,
      "total_cost": 9800000.00,
      "total_profit": 2700000.00,
      "avg_profit_rate": 21.6
    },
    "departmentStats": [...],
    "monthlyTrend": [...]
  }
}
```

#### 8. 获取科室列表
```http
GET /api/disease-benefit/departments
```

#### 9. 导出数据
```http
POST /api/disease-benefit/export
Content-Type: application/json

{
  "format": "json",  // 或 "csv"
  "filters": {
    "department": "心内科",
    "dateStart": "2024-01-01",
    "dateEnd": "2024-01-31"
  }
}
```

#### 10. 批量导入数据
```http
POST /api/disease-benefit/batch
Content-Type: application/json

{
  "diseases": [
    {
      "disease_code": "I21.9",
      "disease_name": "急性心肌梗死",
      "department": "心内科",
      "revenue": 1250000.00,
      "cost": 980000.00,
      "cases": 45,
      "record_date": "2024-01-15"
    }
  ]
}
```

## 🗄️ 数据库结构

### disease_benefit 表
```sql
CREATE TABLE disease_benefit (
    id INT PRIMARY KEY AUTO_INCREMENT,
    disease_code VARCHAR(20) NOT NULL,           -- 病种编码
    disease_name VARCHAR(100) NOT NULL,          -- 病种名称
    department VARCHAR(50) NOT NULL,             -- 科室
    revenue DECIMAL(12,2) NOT NULL DEFAULT 0,    -- 总收入
    cost DECIMAL(12,2) NOT NULL DEFAULT 0,       -- 总成本
    profit DECIMAL(12,2) GENERATED ALWAYS AS (revenue-cost) STORED,  -- 总结余
    cases INT NOT NULL DEFAULT 0,               -- 病例数
    avg_revenue DECIMAL(12,2) GENERATED ALWAYS AS (CASE WHEN cases > 0 THEN revenue/cases ELSE 0 END) STORED,  -- 平均收入
    avg_cost DECIMAL(12,2) GENERATED ALWAYS AS (CASE WHEN cases > 0 THEN cost/cases ELSE 0 END) STORED,        -- 平均成本
    avg_profit DECIMAL(12,2) GENERATED ALWAYS AS (CASE WHEN cases > 0 THEN profit/cases ELSE 0 END) STORED,    -- 平均结余
    profit_rate DECIMAL(5,2) GENERATED ALWAYS AS (CASE WHEN revenue > 0 THEN profit/revenue*100 ELSE 0 END) STORED,  -- 结余率
    breakeven_cases INT,                         -- 保本例数
    avg_stay DECIMAL(5,2),                       -- 平均住院天数
    record_date DATE NOT NULL,                   -- 记录日期
    doctor_id VARCHAR(20),                       -- 医生ID
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🔧 前端配置

在前端组件中配置API地址：

```javascript
// 组件初始化配置
const config = {
    apiUrl: 'http://localhost:5000/api/disease-benefit',
    autoInit: true,
    autoLoad: true,
    enableExport: true,
    enableAIInsights: true
};

// 初始化组件
new DiseaseBenefitComponent(config);
```

## 🧪 测试

### 运行测试
```bash
node test_api.js
```

### 测试覆盖
- ✅ 健康检查
- ✅ 数据列表获取（带分页、筛选、排序）
- ✅ 单个数据详情
- ✅ 数据创建、更新、删除
- ✅ 统计数据获取
- ✅ 科室列表获取
- ✅ 数据导出（JSON/CSV）
- ✅ 批量数据导入
- ✅ 错误处理

### 手动测试示例
```bash
# 获取病种列表
curl "http://localhost:5000/api/disease-benefit"

# 获取心内科数据
curl "http://localhost:5000/api/disease-benefit?department=心内科"

# 获取统计数据
curl "http://localhost:5000/api/disease-benefit/stats"

# 创建新记录
curl -X POST "http://localhost:5000/api/disease-benefit" \
  -H "Content-Type: application/json" \
  -d '{
    "disease_code": "TEST001",
    "disease_name": "测试病种",
    "department": "测试科室",
    "revenue": 100000,
    "cost": 80000,
    "cases": 10,
    "record_date": "2024-01-20"
  }'
```

## 🚀 部署

### 开发环境
```bash
npm run dev
```

### 生产环境
```bash
# 使用PM2
npm install -g pm2
pm2 start disease_benefit_api.js --name "disease-benefit-api"

# 或使用Docker
docker build -t disease-benefit-api .
docker run -p 5000:5000 disease-benefit-api
```

### 环境变量
```env
NODE_ENV=production
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=hospital_db
PORT=5000
```

## 📝 日志

服务启动后会显示：
```
✅ 数据库连接成功
✅ 数据库初始化完成
🚀 病种效益分析API服务启动成功!
📡 服务地址: http://localhost:5000
📖 主要接口:
   GET    /api/disease-benefit          - 获取病种效益列表
   GET    /api/disease-benefit/:id      - 获取病种详情
   POST   /api/disease-benefit          - 创建病种记录
   PUT    /api/disease-benefit/:id      - 更新病种记录
   DELETE /api/disease-benefit/:id      - 删除病种记录
   GET    /api/disease-benefit/stats    - 获取统计数据
   GET    /api/disease-benefit/departments - 获取科室列表
   POST   /api/disease-benefit/export   - 导出数据
   POST   /api/disease-benefit/batch    - 批量导入
   GET    /api/health                   - 健康检查

💡 前端配置: apiUrl: 'http://localhost:5000/api/disease-benefit'
🔧 数据库: localhost:3306/hospital_db
```

## 🔒 安全特性

- CORS跨域配置
- 请求体大小限制
- SQL注入防护
- 参数验证
- 错误处理
- 请求日志

## 📞 支持

如有问题，请检查：
1. MySQL服务是否启动
2. 数据库配置是否正确
3. 端口5000是否被占用
4. 依赖包是否正确安装

## 📄 许可证

MIT License