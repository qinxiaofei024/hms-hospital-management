# HMS项目 GitHub Pages 部署指南

## 📋 概述

本指南将帮助您将佛山市南海区中医院数据中心管理平台（HMS）部署到GitHub Pages，实现免费的静态网站托管。

## 🚀 快速开始

### 1. 准备工作

确保您已经：
- 拥有GitHub账户
- 安装了Git
- 安装了Node.js（用于运行优化脚本）

### 2. 创建GitHub仓库

1. 登录GitHub，点击右上角的"+"号，选择"New repository"
2. 仓库名称建议使用：`hms-hospital-management`
3. 设置为Public（GitHub Pages免费版需要公开仓库）
4. 不要初始化README、.gitignore或license（我们已经准备好了）

### 3. 上传项目到GitHub

```bash
# 在项目根目录执行
git init
git add .
git commit -m "Initial commit: HMS Hospital Management System"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hms-hospital-management.git
git push -u origin main
```

### 4. 启用GitHub Pages

1. 进入仓库页面，点击"Settings"
2. 在左侧菜单找到"Pages"
3. 在"Source"部分选择"GitHub Actions"
4. 系统会自动检测到我们的工作流文件

## 📁 项目结构说明

```
hms/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions自动部署配置
├── _config.yml                 # Jekyll配置文件
├── .gitignore                  # Git忽略文件配置
├── index.html                  # 项目主页
├── css/                        # 样式文件
├── js/                         # JavaScript文件
├── images/                     # 图片资源
├── pages/                      # 各功能页面
├── components/                 # 组件文件
├── data/                       # 数据文件
└── GITHUB-PAGES-DEPLOYMENT.md  # 本部署指南
```

## ⚙️ 配置文件说明

### GitHub Actions工作流 (`.github/workflows/deploy.yml`)

自动化部署流程，包括：
- 代码检出
- Jekyll构建
- 部署到GitHub Pages

### Jekyll配置 (`_config.yml`)

- 设置站点基本信息
- 配置构建选项
- 排除不必要的文件

### Git忽略配置 (`.gitignore`)

排除以下文件：
- 构建缓存文件
- 临时文件
- 开发工具文件
- 测试文件

## 🔧 路径优化

### 运行路径优化脚本

在部署前，建议运行路径优化脚本：

```bash
node optimize-for-github-pages.js
```

这个脚本会：
- 修正相对路径引用
- 确保资源正确加载
- 生成优化报告

### 手动路径检查

如果需要手动检查，注意以下路径规则：

- **pages目录下的文件**：使用 `../css/`, `../js/` 等
- **根目录文件**：使用 `./css/`, `./js/` 等
- **避免绝对路径**：不要使用 `/css/` 这样的绝对路径

## 🌐 访问地址

部署成功后，您的网站将在以下地址可用：

```
https://YOUR_USERNAME.github.io/hms-hospital-management/
```

### 自定义域名（可选）

如果您有自己的域名：

1. 在仓库根目录创建 `CNAME` 文件
2. 文件内容为您的域名，如：`hms.yourdomain.com`
3. 在域名DNS设置中添加CNAME记录指向 `YOUR_USERNAME.github.io`

## 📊 部署状态监控

### 查看部署状态

1. 进入仓库的"Actions"标签页
2. 查看最新的工作流运行状态
3. 绿色✅表示部署成功，红色❌表示失败

### 常见部署问题

#### 1. 构建失败
- 检查文件路径是否正确
- 确认没有语法错误
- 查看Actions日志获取详细错误信息

#### 2. 页面显示异常
- 检查相对路径是否正确
- 确认CSS和JS文件能正常加载
- 使用浏览器开发者工具检查网络请求

#### 3. 资源加载失败
- 运行路径优化脚本
- 检查文件名大小写是否一致
- 确认文件确实存在于仓库中

## 🔄 更新部署

### 自动部署

每次推送到main分支时，GitHub Actions会自动重新部署：

```bash
git add .
git commit -m "Update: 描述您的更改"
git push origin main
```

### 手动触发部署

1. 进入仓库的"Actions"标签页
2. 选择"Deploy HMS to GitHub Pages"工作流
3. 点击"Run workflow"按钮

## 🛠️ 本地测试

### 使用Jekyll本地服务器

```bash
# 安装Jekyll（需要Ruby环境）
gem install jekyll bundler

# 在项目目录运行
jekyll serve

# 访问 http://localhost:4000
```

### 使用Python简单服务器

```bash
# Python 3
python -m http.server 8080

# 访问 http://localhost:8080
```

## 📋 部署检查清单

部署前请确认：

- [ ] 所有文件路径使用相对路径
- [ ] 运行了路径优化脚本
- [ ] 测试了主要页面功能
- [ ] 检查了响应式布局
- [ ] 确认没有敏感信息（密码、密钥等）
- [ ] 更新了项目文档

## 🆘 故障排除

### 获取帮助

1. **查看GitHub Actions日志**：详细的构建和部署信息
2. **检查浏览器控制台**：前端错误信息
3. **GitHub Pages文档**：https://docs.github.com/en/pages

### 常用调试命令

```bash
# 检查Git状态
git status

# 查看提交历史
git log --oneline

# 强制推送（谨慎使用）
git push --force-with-lease origin main
```

## 📞 技术支持

如果遇到问题，可以：

1. 查看GitHub Actions的详细日志
2. 检查项目的Issues页面
3. 参考GitHub Pages官方文档
4. 联系项目维护者

---

## 🎉 恭喜！

按照本指南操作后，您的HMS医院管理系统应该已经成功部署到GitHub Pages。现在您可以通过互联网访问您的应用了！

记住定期更新和维护您的部署，确保系统的安全性和功能性。