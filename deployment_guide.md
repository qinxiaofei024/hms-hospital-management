# 🚀 病种效益分析API部署指南

## 📋 目录
- [环境要求](#环境要求)
- [Python Flask部署](#python-flask部署)
- [Node.js Express部署](#nodejs-express部署)
- [数据库配置](#数据库配置)
- [前端配置](#前端配置)
- [测试验证](#测试验证)
- [生产环境部署](#生产环境部署)

## 🔧 环境要求

### 基础环境
- **操作系统**: Windows 10/11, Linux, macOS
- **数据库**: MySQL 8.0+ 或 MariaDB 10.5+
- **Python**: 3.8+ (Flask方案)
- **Node.js**: 16.0+ (Express方案)

### 端口配置
- **API服务**: 5000 (可修改)
- **前端服务**: 8000 (已配置)
- **数据库**: 3306 (MySQL默认)

## 🐍 Python Flask部署

### 1. 安装依赖
```bash
# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# 安装依赖包
pip install -r requirements.txt
```

### 2. 配置数据库
```bash
# 连接MySQL数据库
mysql -u root -p

# 执行数据库初始化脚本
source database_config.sql
```

### 3. 修改数据库配置
编辑 `backend_api_example.py` 文件中的数据库配置：
```python
DB_CONFIG = {
    'host': 'localhost',        # 数据库主机
    'user': 'your_username',    # 数据库用户名
    'password': 'your_password', # 数据库密码
    'database': 'hospital_db',   # 数据库名
    'charset': 'utf8mb4'
}
```

### 4. 启动服务
```bash
python backend_api_example.py
```

### 5. 验证服务
```bash
# 测试API健康状态
curl http://localhost:5000/api/health

# 运行完整测试
python api_test_examples.py
```

## 🟢 Node.js Express部署

### 1. 安装依赖
```bash
# 安装Node.js依赖
npm install

# 或使用yarn
yarn install
```

### 2. 配置环境变量
创建 `.env` 文件：
```env
# 数据库配置
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=hospital_db
DB_PORT=3306

# 服务配置
PORT=5000
NODE_ENV=development

# JWT密钥（可选）
JWT_SECRET=your_jwt_secret_key
```

### 3. 修改数据库配置
编辑 `backend_nodejs_example.js` 文件：
```javascript
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'your_username',
    password: process.env.DB_PASSWORD || 'your_password',
    database: process.env.DB_NAME || 'hospital_db',
    charset: 'utf8mb4',
    timezone: '+08:00'
};
```

### 4. 启动服务
```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

## 🗄️ 数据库配置

### 1. 创建数据库和用户
```sql
-- 创建数据库
CREATE DATABASE hospital_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建用户（可选）
CREATE USER 'hms_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON hospital_db.* TO 'hms_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. 导入表结构和数据
```bash
mysql -u root -p hospital_db < database_config.sql
```

### 3. 验证数据
```sql
USE hospital_db;
SELECT COUNT(*) FROM disease_benefit;
SELECT * FROM disease_benefit LIMIT 5;
```

## 🌐 前端配置

### 1. 修改API地址
编辑前端组件配置，将 `apiUrl` 指向后端服务：
```javascript
const component = new DiseaseBenefitComponent('disease-benefit-container', {
    apiUrl: 'http://localhost:5000/api/disease-benefit',  // 后端API地址
    autoInit: true,
    autoLoad: true,
    enableExport: true
});
```

### 2. 处理跨域问题
后端已配置CORS，如果仍有跨域问题，可以：

**方法1**: 使用代理（推荐）
```javascript
// 在前端配置代理
const API_BASE = '/api';  // 使用相对路径
```

**方法2**: 修改后端CORS配置
```python
# Python Flask
from flask_cors import CORS
CORS(app, origins=['http://localhost:8000'])

# Node.js Express
app.use(cors({
    origin: ['http://localhost:8000'],
    credentials: true
}));
```

## 🧪 测试验证

### 1. API功能测试
```bash
# Python测试脚本
python api_test_examples.py

# 手动测试主要接口
curl -X GET "http://localhost:5000/api/disease-benefit"
curl -X GET "http://localhost:5000/api/disease-benefit/1"
curl -X GET "http://localhost:5000/api/disease-benefit/stats"
```

### 2. 前端集成测试
1. 启动前端服务: `python -m http.server 8000`
2. 访问: `http://localhost:8000/hms/pages/component-library.html`
3. 测试病种效益组件功能

### 3. 性能测试
```bash
# 使用ab进行压力测试
ab -n 1000 -c 10 http://localhost:5000/api/disease-benefit

# 使用curl测试响应时间
curl -w "@curl-format.txt" -o /dev/null -s "http://localhost:5000/api/disease-benefit"
```

## 🏭 生产环境部署

### 1. Python Flask生产部署
```bash
# 使用Gunicorn
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 backend_api_example:app

# 使用uWSGI
pip install uwsgi
uwsgi --http :5000 --wsgi-file backend_api_example.py --callable app --processes 4
```

### 2. Node.js Express生产部署
```bash
# 使用PM2
npm install -g pm2
pm2 start backend_nodejs_example.js --name "disease-benefit-api"

# 使用Docker
docker build -t disease-benefit-api .
docker run -p 5000:5000 disease-benefit-api
```

### 3. Nginx反向代理配置
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /path/to/hms;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # API代理
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 4. 数据库优化
```sql
-- 创建索引优化查询性能
CREATE INDEX idx_disease_dept_date ON disease_benefit(department, record_date);
CREATE INDEX idx_profit_rate_desc ON disease_benefit(profit_rate DESC);

-- 定期清理和优化
OPTIMIZE TABLE disease_benefit;
ANALYZE TABLE disease_benefit;
```

## 🔒 安全配置

### 1. 数据库安全
- 使用专用数据库用户，限制权限
- 定期备份数据库
- 启用SSL连接

### 2. API安全
- 添加API访问频率限制
- 实现用户认证和授权
- 使用HTTPS协议

### 3. 服务器安全
- 配置防火墙规则
- 定期更新系统和依赖包
- 监控服务状态和日志

## 📊 监控和维护

### 1. 日志配置
```python
# Python日志配置
import logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('api.log'),
        logging.StreamHandler()
    ]
)
```

### 2. 健康检查
```bash
# 定期检查API状态
curl -f http://localhost:5000/api/health || echo "API服务异常"

# 检查数据库连接
mysql -u hms_user -p -e "SELECT 1" hospital_db
```

### 3. 性能监控
- 监控API响应时间
- 监控数据库查询性能
- 监控服务器资源使用情况

## 🆘 故障排除

### 常见问题
1. **数据库连接失败**: 检查数据库配置和网络连接
2. **跨域问题**: 确认CORS配置正确
3. **API响应慢**: 检查数据库索引和查询优化
4. **前端无法加载数据**: 检查API地址配置和网络连接

### 调试命令
```bash
# 查看API日志
tail -f api.log

# 检查端口占用
netstat -tulpn | grep :5000

# 测试数据库连接
mysql -u hms_user -p hospital_db -e "SHOW TABLES;"
```

---

## 📞 技术支持

如有问题，请检查：
1. 📋 [API测试结果](api_test_examples.py)
2. 🗄️ [数据库配置](database_config.sql)
3. 🔧 [依赖包安装](requirements.txt)

**部署成功后，您的API将在 `http://localhost:5000/api/disease-benefit` 提供服务！**