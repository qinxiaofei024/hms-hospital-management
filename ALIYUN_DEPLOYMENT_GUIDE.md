# 阿里云轻量应用服务器部署指南

## 📋 部署概览

本指南将帮助您将HMS医院管理系统部署到阿里云轻量应用服务器上。

### 🎯 部署目标
- 将构建好的HMS系统部署到生产环境
- 配置Nginx作为Web服务器
- 设置SSL证书（可选）
- 配置域名访问

## 🚀 快速部署步骤

### 1. 服务器准备

#### 1.1 连接服务器
```bash
# 使用SSH连接到您的阿里云轻量应用服务器
ssh root@您的服务器IP地址
```

#### 1.2 更新系统
```bash
# Ubuntu/Debian系统
sudo apt update && sudo apt upgrade -y

# CentOS/RHEL系统
sudo yum update -y
```

### 2. 安装必要软件

#### 2.1 安装Nginx
```bash
# Ubuntu/Debian
sudo apt install nginx -y

# CentOS/RHEL
sudo yum install nginx -y

# 启动并设置开机自启
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### 2.2 安装文件传输工具
```bash
# 安装unzip（如果没有）
sudo apt install unzip -y  # Ubuntu/Debian
sudo yum install unzip -y  # CentOS/RHEL
```

### 3. 上传项目文件

#### 方法一：使用SCP上传
```bash
# 在本地Windows机器上，使用PowerShell或CMD
scp C:\Users\qinxi\lakehouse_guangdong\hms-production.zip root@您的服务器IP:/tmp/
```

#### 方法二：使用WinSCP或FileZilla
1. 下载并安装WinSCP或FileZilla
2. 连接到您的服务器
3. 上传 `hms-production.zip` 到服务器的 `/tmp/` 目录

#### 方法三：使用阿里云控制台
1. 登录阿里云控制台
2. 进入轻量应用服务器管理页面
3. 使用文件管理功能上传zip文件

### 4. 部署网站文件

```bash
# 创建网站目录
sudo mkdir -p /var/www/hms

# 解压项目文件
cd /tmp
sudo unzip hms-production.zip -d /var/www/hms/

# 设置正确的权限
sudo chown -R www-data:www-data /var/www/hms
sudo chmod -R 755 /var/www/hms
```

### 5. 配置Nginx

#### 5.1 创建Nginx配置文件
```bash
sudo nano /etc/nginx/sites-available/hms
```

#### 5.2 添加以下配置内容：
```nginx
server {
    listen 80;
    server_name 您的域名或IP地址;
    
    root /var/www/hms/dist;
    index index.html;
    
    # 启用gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # 主页面路由
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # HMS应用路由
    location /hms/ {
        try_files $uri $uri/ /hms/index.html;
    }
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # 安全头设置
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

#### 5.3 启用站点配置
```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/hms /etc/nginx/sites-enabled/

# 删除默认配置（可选）
sudo rm /etc/nginx/sites-enabled/default

# 测试Nginx配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx
```

### 6. 配置防火墙

```bash
# Ubuntu/Debian (使用ufw)
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw enable

# CentOS/RHEL (使用firewalld)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 7. 验证部署

#### 7.1 检查服务状态
```bash
# 检查Nginx状态
sudo systemctl status nginx

# 检查端口监听
sudo netstat -tlnp | grep :80
```

#### 7.2 访问测试
在浏览器中访问：
- `http://您的服务器IP/` - 主页
- `http://您的服务器IP/hms/` - HMS系统首页
- `http://您的服务器IP/hms/pages/key-indicators.html` - 关键指标页面

## 🔒 SSL证书配置（推荐）

### 使用Let's Encrypt免费SSL证书

#### 1. 安装Certbot
```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx -y

# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx -y
```

#### 2. 获取SSL证书
```bash
sudo certbot --nginx -d 您的域名
```

#### 3. 自动续期设置
```bash
# 添加到crontab
sudo crontab -e

# 添加以下行（每天检查证书续期）
0 12 * * * /usr/bin/certbot renew --quiet
```

## 🌐 域名配置

### 1. 在域名提供商处设置DNS记录
- 类型：A记录
- 主机记录：@ 或 www
- 记录值：您的服务器IP地址
- TTL：600

### 2. 更新Nginx配置
```bash
sudo nano /etc/nginx/sites-available/hms
```

将 `server_name` 改为您的域名：
```nginx
server_name yourdomain.com www.yourdomain.com;
```

## 📊 性能优化建议

### 1. 启用HTTP/2
在SSL配置后，修改Nginx配置：
```nginx
listen 443 ssl http2;
```

### 2. 配置缓存
```nginx
# 在server块中添加
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    access_log off;
}
```

### 3. 启用Brotli压缩（可选）
```bash
# 安装Brotli模块
sudo apt install nginx-module-brotli -y

# 在nginx.conf中添加
load_module modules/ngx_http_brotli_filter_module.so;
load_module modules/ngx_http_brotli_static_module.so;
```

## 🔧 故障排除

### 常见问题及解决方案

#### 1. 403 Forbidden错误
```bash
# 检查文件权限
ls -la /var/www/hms/
sudo chown -R www-data:www-data /var/www/hms
sudo chmod -R 755 /var/www/hms
```

#### 2. 502 Bad Gateway错误
```bash
# 检查Nginx配置
sudo nginx -t
sudo systemctl restart nginx
```

#### 3. 页面无法加载
```bash
# 检查Nginx错误日志
sudo tail -f /var/log/nginx/error.log

# 检查访问日志
sudo tail -f /var/log/nginx/access.log
```

#### 4. 静态资源404错误
确保文件路径正确：
```bash
ls -la /var/www/hms/dist/hms/
```

## 📝 维护命令

### 日常维护
```bash
# 查看Nginx状态
sudo systemctl status nginx

# 重启Nginx
sudo systemctl restart nginx

# 重新加载配置（无需重启）
sudo systemctl reload nginx

# 查看错误日志
sudo tail -f /var/log/nginx/error.log

# 查看访问日志
sudo tail -f /var/log/nginx/access.log
```

### 更新部署
```bash
# 备份当前版本
sudo cp -r /var/www/hms /var/www/hms_backup_$(date +%Y%m%d)

# 上传新版本并解压
cd /tmp
sudo unzip new-hms-production.zip -d /var/www/hms_new/
sudo rm -rf /var/www/hms/dist
sudo mv /var/www/hms_new/dist /var/www/hms/

# 设置权限
sudo chown -R www-data:www-data /var/www/hms
sudo chmod -R 755 /var/www/hms
```

## 🎉 部署完成

恭喜！您的HMS医院管理系统已成功部署到阿里云轻量应用服务器。

### 访问地址
- 主站：`https://您的域名/`
- HMS系统：`https://您的域名/hms/`

### 下一步建议
1. 设置定期备份
2. 配置监控告警
3. 优化数据库连接（如需要）
4. 设置CDN加速（可选）

如有问题，请检查Nginx日志或联系技术支持。