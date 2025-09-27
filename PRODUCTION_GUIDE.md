# HMS 生产环境部署指南

## 🔒 代码保护特性

本项目已实现多层代码保护机制，确保源代码安全：

### 1. JavaScript 代码混淆
- **变量名混淆**: 所有变量名被替换为十六进制字符
- **控制流平坦化**: 代码逻辑结构被重新组织
- **字符串加密**: 字符串使用 RC4 加密
- **死代码注入**: 插入无用代码干扰逆向工程
- **调试保护**: 阻止开发者工具调试
- **自我防护**: 检测代码篡改并停止执行

### 2. 构建优化
- **代码压缩**: 移除空格、注释和无用代码
- **文件名混淆**: 使用哈希值命名文件
- **资源内联**: 小文件直接嵌入HTML
- **代码分割**: 按需加载，减少初始包大小

### 3. 安全措施
- **移除调试信息**: 生产环境无 console.log
- **源码映射禁用**: 无法通过浏览器查看原始代码
- **完整性校验**: SHA256 哈希验证文件完整性
- **版权保护**: 法律声明和使用限制

## 🚀 构建命令

### 开发环境
```bash
npm run dev          # 启动开发服务器
npm run serve        # 启动简单HTTP服务器
```

### 生产环境
```bash
npm run build                # 标准构建
npm run build:protected      # 增强保护构建
npm run build:production     # 生产环境构建（推荐）
```

## 📦 部署步骤

### 1. 构建项目
```bash
npm run build:production
```

### 2. 部署文件
构建完成后，您将获得：
- `dist/` 目录：包含所有部署文件
- `hms-production.zip`：压缩的部署包
- `checksums.json`：文件完整性校验

### 3. 服务器配置

#### Apache (.htaccess)
```apache
# 启用压缩
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# 缓存控制
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>

# 安全头
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
```

#### Nginx
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    root /path/to/dist;
    index index.html;
    
    # 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # 缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # 安全头
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
    
    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🔐 安全建议

### 1. 服务器安全
- 使用 HTTPS（SSL/TLS）
- 定期更新服务器软件
- 配置防火墙规则
- 启用访问日志监控

### 2. 应用安全
- 配置 Content Security Policy (CSP)
- 启用 HSTS
- 禁用不必要的 HTTP 方法
- 设置适当的 CORS 策略

### 3. 监控和维护
- 定期检查文件完整性
- 监控异常访问模式
- 备份重要配置文件
- 建立安全事件响应流程

## 📊 性能优化

### 1. 资源优化
- 启用 Gzip/Brotli 压缩
- 配置适当的缓存策略
- 使用 CDN 加速静态资源
- 启用 HTTP/2

### 2. 监控指标
- 页面加载时间
- 资源大小和数量
- 用户交互响应时间
- 错误率和可用性

## 🆘 故障排除

### 常见问题

1. **页面无法加载**
   - 检查文件路径是否正确
   - 验证服务器配置
   - 查看浏览器控制台错误

2. **JavaScript 错误**
   - 检查文件完整性（使用 checksums.json）
   - 验证所有依赖文件是否存在
   - 确认浏览器兼容性

3. **样式问题**
   - 检查 CSS 文件是否正确加载
   - 验证媒体查询和响应式设计
   - 确认字体文件可访问

### 技术支持
如需技术支持，请提供：
- 错误描述和重现步骤
- 浏览器和版本信息
- 服务器环境详情
- 相关错误日志

## 📄 许可证和版权

本软件受版权法保护。未经授权的复制、分发或修改是被禁止的。
详细信息请参阅 `COPYRIGHT.txt` 文件。

---

**构建时间**: ${new Date().toISOString()}  
**版本**: 1.0.0  
**维护者**: 开发团队