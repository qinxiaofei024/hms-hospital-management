#!/bin/bash

# HMS医院管理系统 - 阿里云轻量应用服务器环境配置脚本
# 使用方法：chmod +x server-setup.sh && sudo ./server-setup.sh

set -e

echo "🚀 开始配置HMS医院管理系统服务器环境..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检测操作系统
detect_os() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$NAME
        VER=$VERSION_ID
    else
        log_error "无法检测操作系统版本"
        exit 1
    fi
    log_info "检测到操作系统: $OS $VER"
}

# 更新系统
update_system() {
    log_info "更新系统包..."
    if [[ $OS == *"Ubuntu"* ]] || [[ $OS == *"Debian"* ]]; then
        apt update && apt upgrade -y
    elif [[ $OS == *"CentOS"* ]] || [[ $OS == *"Red Hat"* ]]; then
        yum update -y
    else
        log_warning "未知的操作系统，跳过系统更新"
    fi
    log_success "系统更新完成"
}

# 安装基础软件
install_basic_packages() {
    log_info "安装基础软件包..."
    if [[ $OS == *"Ubuntu"* ]] || [[ $OS == *"Debian"* ]]; then
        apt install -y curl wget unzip nginx certbot python3-certbot-nginx ufw
    elif [[ $OS == *"CentOS"* ]] || [[ $OS == *"Red Hat"* ]]; then
        yum install -y curl wget unzip nginx certbot python3-certbot-nginx firewalld
    fi
    log_success "基础软件包安装完成"
}

# 配置Nginx
configure_nginx() {
    log_info "配置Nginx..."
    
    # 启动并设置开机自启
    systemctl start nginx
    systemctl enable nginx
    
    # 创建网站目录
    mkdir -p /var/www/hms
    
    # 创建Nginx配置文件
    cat > /etc/nginx/sites-available/hms << 'EOF'
server {
    listen 80;
    server_name _;
    
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
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # 安全头设置
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # 错误页面
    error_page 404 /hms/pages/404.html;
}
EOF
    
    # 启用站点配置
    ln -sf /etc/nginx/sites-available/hms /etc/nginx/sites-enabled/
    
    # 删除默认配置
    rm -f /etc/nginx/sites-enabled/default
    
    # 测试配置
    nginx -t
    
    # 重启Nginx
    systemctl restart nginx
    
    log_success "Nginx配置完成"
}

# 配置防火墙
configure_firewall() {
    log_info "配置防火墙..."
    
    if [[ $OS == *"Ubuntu"* ]] || [[ $OS == *"Debian"* ]]; then
        # 配置UFW
        ufw --force reset
        ufw default deny incoming
        ufw default allow outgoing
        ufw allow ssh
        ufw allow 'Nginx Full'
        ufw --force enable
    elif [[ $OS == *"CentOS"* ]] || [[ $OS == *"Red Hat"* ]]; then
        # 配置firewalld
        systemctl start firewalld
        systemctl enable firewalld
        firewall-cmd --permanent --add-service=http
        firewall-cmd --permanent --add-service=https
        firewall-cmd --permanent --add-service=ssh
        firewall-cmd --reload
    fi
    
    log_success "防火墙配置完成"
}

# 设置文件权限
setup_permissions() {
    log_info "设置文件权限..."
    
    # 创建www-data用户（如果不存在）
    if ! id "www-data" &>/dev/null; then
        useradd -r -s /bin/false www-data
    fi
    
    # 设置目录权限
    chown -R www-data:www-data /var/www/hms
    chmod -R 755 /var/www/hms
    
    log_success "文件权限设置完成"
}

# 创建部署脚本
create_deploy_script() {
    log_info "创建部署脚本..."
    
    cat > /usr/local/bin/deploy-hms << 'EOF'
#!/bin/bash

# HMS部署脚本
# 使用方法: deploy-hms /path/to/hms-production.zip

set -e

if [ $# -eq 0 ]; then
    echo "使用方法: deploy-hms <zip文件路径>"
    exit 1
fi

ZIP_FILE=$1

if [ ! -f "$ZIP_FILE" ]; then
    echo "错误: 文件 $ZIP_FILE 不存在"
    exit 1
fi

echo "🚀 开始部署HMS系统..."

# 备份当前版本
if [ -d "/var/www/hms/dist" ]; then
    echo "📦 备份当前版本..."
    cp -r /var/www/hms /var/www/hms_backup_$(date +%Y%m%d_%H%M%S)
fi

# 解压新版本
echo "📂 解压新版本..."
cd /tmp
rm -rf hms_deploy
mkdir hms_deploy
unzip -q "$ZIP_FILE" -d hms_deploy/

# 部署文件
echo "🔄 部署文件..."
rm -rf /var/www/hms/dist
cp -r hms_deploy/dist /var/www/hms/

# 设置权限
echo "🔐 设置权限..."
chown -R www-data:www-data /var/www/hms
chmod -R 755 /var/www/hms

# 重启Nginx
echo "🔄 重启Nginx..."
systemctl restart nginx

# 清理临时文件
rm -rf /tmp/hms_deploy

echo "✅ HMS系统部署完成!"
echo "🌐 访问地址: http://$(curl -s ifconfig.me)/hms/"
EOF
    
    chmod +x /usr/local/bin/deploy-hms
    
    log_success "部署脚本创建完成"
}

# 创建SSL配置脚本
create_ssl_script() {
    log_info "创建SSL配置脚本..."
    
    cat > /usr/local/bin/setup-ssl << 'EOF'
#!/bin/bash

# SSL证书配置脚本
# 使用方法: setup-ssl yourdomain.com

set -e

if [ $# -eq 0 ]; then
    echo "使用方法: setup-ssl <域名>"
    exit 1
fi

DOMAIN=$1

echo "🔒 为域名 $DOMAIN 配置SSL证书..."

# 更新Nginx配置中的server_name
sed -i "s/server_name _;/server_name $DOMAIN www.$DOMAIN;/" /etc/nginx/sites-available/hms

# 重启Nginx
systemctl restart nginx

# 获取SSL证书
certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN

# 设置自动续期
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

echo "✅ SSL证书配置完成!"
echo "🌐 HTTPS访问地址: https://$DOMAIN/hms/"
EOF
    
    chmod +x /usr/local/bin/setup-ssl
    
    log_success "SSL配置脚本创建完成"
}

# 显示完成信息
show_completion_info() {
    log_success "🎉 服务器环境配置完成!"
    echo ""
    echo "📋 接下来的步骤:"
    echo "1. 上传 hms-production.zip 到服务器"
    echo "2. 运行: deploy-hms /path/to/hms-production.zip"
    echo "3. (可选) 配置域名: setup-ssl yourdomain.com"
    echo ""
    echo "🌐 当前访问地址: http://$(curl -s ifconfig.me 2>/dev/null || echo '您的服务器IP')/hms/"
    echo ""
    echo "📚 有用的命令:"
    echo "  - 部署新版本: deploy-hms <zip文件>"
    echo "  - 配置SSL: setup-ssl <域名>"
    echo "  - 查看Nginx状态: systemctl status nginx"
    echo "  - 查看Nginx日志: tail -f /var/log/nginx/error.log"
    echo "  - 重启Nginx: systemctl restart nginx"
}

# 主函数
main() {
    log_info "开始HMS服务器环境配置..."
    
    detect_os
    update_system
    install_basic_packages
    configure_nginx
    configure_firewall
    setup_permissions
    create_deploy_script
    create_ssl_script
    
    show_completion_info
}

# 检查是否以root权限运行
if [ "$EUID" -ne 0 ]; then
    log_error "请以root权限运行此脚本: sudo $0"
    exit 1
fi

# 运行主函数
main