# 域名配置和SSL证书设置指南

## 📋 概述

本指南将帮助您为HMS医院管理系统配置自定义域名和SSL证书，提供更专业和安全的访问体验。

## 🌐 域名配置

### 1. 购买域名

#### 推荐域名注册商
- **阿里云域名服务**：https://wanwang.aliyun.com/
- **腾讯云域名注册**：https://dnspod.cloud.tencent.com/
- **Godaddy**：https://www.godaddy.com/
- **Namecheap**：https://www.namecheap.com/

#### 域名选择建议
- 选择与医院相关的域名名称
- 推荐使用 `.com`、`.cn`、`.org` 等主流后缀
- 避免使用过长或难记的域名

### 2. DNS解析配置

#### 2.1 阿里云域名解析设置

1. **登录阿里云控制台**
   - 访问：https://dns.console.aliyun.com/
   - 选择您的域名

2. **添加A记录**
   ```
   记录类型：A
   主机记录：@
   解析路线：默认
   记录值：您的服务器IP地址
   TTL：600
   ```

3. **添加WWW记录**
   ```
   记录类型：A
   主机记录：www
   解析路线：默认
   记录值：您的服务器IP地址
   TTL：600
   ```

#### 2.2 其他DNS服务商配置

**腾讯云DNS**
```
类型：A记录
主机记录：@
记录值：服务器IP
线路类型：默认
TTL：600
```

**Cloudflare DNS**
```
Type: A
Name: @
IPv4 address: 服务器IP
Proxy status: DNS only (灰色云朵)
TTL: Auto
```

### 3. 验证DNS解析

#### 使用命令行验证
```bash
# Windows
nslookup yourdomain.com

# Linux/Mac
dig yourdomain.com
```

#### 在线工具验证
- DNS检查工具：https://www.whatsmydns.net/
- 阿里云DNS检测：https://zijian.aliyun.com/

## 🔒 SSL证书配置

### 方法一：Let's Encrypt免费证书（推荐）

#### 1. 自动配置（使用部署脚本）
```bash
# 在服务器上运行
setup-ssl yourdomain.com
```

#### 2. 手动配置
```bash
# 安装Certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取证书
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 测试自动续期
sudo certbot renew --dry-run
```

#### 3. 设置自动续期
```bash
# 编辑crontab
sudo crontab -e

# 添加以下行
0 12 * * * /usr/bin/certbot renew --quiet
```

### 方法二：阿里云SSL证书

#### 1. 购买SSL证书
1. 登录阿里云控制台
2. 进入SSL证书服务
3. 购买或申请免费证书

#### 2. 下载证书文件
- 选择Nginx格式下载
- 获得两个文件：
  - `yourdomain.com.pem`（证书文件）
  - `yourdomain.com.key`（私钥文件）

#### 3. 上传证书到服务器
```bash
# 创建证书目录
sudo mkdir -p /etc/nginx/ssl

# 上传证书文件
scp yourdomain.com.pem root@服务器IP:/etc/nginx/ssl/
scp yourdomain.com.key root@服务器IP:/etc/nginx/ssl/

# 设置权限
sudo chmod 600 /etc/nginx/ssl/yourdomain.com.key
sudo chmod 644 /etc/nginx/ssl/yourdomain.com.pem
```

#### 4. 配置Nginx
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    ssl_certificate /etc/nginx/ssl/yourdomain.com.pem;
    ssl_certificate_key /etc/nginx/ssl/yourdomain.com.key;
    
    # SSL配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    root /var/www/hms/dist;
    index index.html;
    
    # 其他配置...
}
```

### 方法三：Cloudflare SSL

#### 1. 添加网站到Cloudflare
1. 注册Cloudflare账号
2. 添加您的域名
3. 更改DNS服务器到Cloudflare

#### 2. 启用SSL
1. 在Cloudflare控制台中
2. 进入SSL/TLS设置
3. 选择"完全"或"完全(严格)"模式

#### 3. 配置源服务器证书
```bash
# 生成Cloudflare源证书
# 在Cloudflare控制台 > SSL/TLS > 源服务器 > 创建证书
```

## 🔧 高级SSL配置

### 1. HSTS配置
```nginx
# 在server块中添加
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

### 2. OCSP Stapling
```nginx
ssl_stapling on;
ssl_stapling_verify on;
ssl_trusted_certificate /etc/nginx/ssl/chain.pem;
resolver 8.8.8.8 8.8.4.4 valid=300s;
resolver_timeout 5s;
```

### 3. SSL安全评级优化
```nginx
# 现代SSL配置
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers off;

# DH参数
ssl_dhparam /etc/nginx/ssl/dhparam.pem;
```

## 📊 SSL证书监控

### 1. 证书到期监控脚本
```bash
#!/bin/bash
# ssl-monitor.sh

DOMAIN="yourdomain.com"
DAYS_BEFORE_EXPIRY=30

EXPIRY_DATE=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
EXPIRY_TIMESTAMP=$(date -d "$EXPIRY_DATE" +%s)
CURRENT_TIMESTAMP=$(date +%s)
DAYS_UNTIL_EXPIRY=$(( ($EXPIRY_TIMESTAMP - $CURRENT_TIMESTAMP) / 86400 ))

if [ $DAYS_UNTIL_EXPIRY -le $DAYS_BEFORE_EXPIRY ]; then
    echo "警告：SSL证书将在 $DAYS_UNTIL_EXPIRY 天后过期！"
    # 发送邮件或其他通知
fi
```

### 2. 设置监控定时任务
```bash
# 添加到crontab
0 9 * * * /usr/local/bin/ssl-monitor.sh
```

## 🌍 CDN配置（可选）

### 阿里云CDN配置

#### 1. 开通CDN服务
1. 登录阿里云控制台
2. 开通CDN服务
3. 添加加速域名

#### 2. 配置回源
```
回源协议：HTTPS
回源地址：您的服务器IP
回源端口：443
```

#### 3. 缓存配置
```
静态文件缓存：
- .js, .css: 30天
- .png, .jpg, .gif: 30天
- .html: 1小时
```

## 🔍 故障排除

### 常见问题及解决方案

#### 1. DNS解析不生效
```bash
# 清除本地DNS缓存
# Windows
ipconfig /flushdns

# Linux
sudo systemctl restart systemd-resolved

# Mac
sudo dscacheutil -flushcache
```

#### 2. SSL证书错误
```bash
# 检查证书状态
openssl s_client -servername yourdomain.com -connect yourdomain.com:443

# 检查证书文件
openssl x509 -in /etc/nginx/ssl/yourdomain.com.pem -text -noout
```

#### 3. 混合内容错误
- 确保所有资源都使用HTTPS
- 检查JavaScript中的HTTP请求
- 更新内容安全策略

#### 4. 证书链不完整
```bash
# 下载完整证书链
wget https://letsencrypt.org/certs/lets-encrypt-x3-cross-signed.pem
cat yourdomain.com.pem lets-encrypt-x3-cross-signed.pem > fullchain.pem
```

## 📋 检查清单

### 域名配置检查
- [ ] 域名已购买并实名认证
- [ ] DNS A记录已正确配置
- [ ] WWW记录已配置
- [ ] DNS解析已生效（24-48小时）

### SSL证书检查
- [ ] SSL证书已安装
- [ ] 证书链完整
- [ ] HTTPS访问正常
- [ ] HTTP自动跳转HTTPS
- [ ] 自动续期已配置

### 安全配置检查
- [ ] HSTS已启用
- [ ] 安全头已配置
- [ ] SSL评级A+（可使用 https://www.ssllabs.com/ssltest/ 测试）
- [ ] 混合内容问题已解决

## 🎉 完成验证

配置完成后，请访问以下地址验证：

1. **HTTP跳转测试**：http://yourdomain.com
2. **HTTPS访问测试**：https://yourdomain.com/hms/
3. **SSL评级测试**：https://www.ssllabs.com/ssltest/
4. **DNS传播测试**：https://www.whatsmydns.net/

恭喜！您的HMS医院管理系统现在已经拥有专业的域名和安全的HTTPS访问了！