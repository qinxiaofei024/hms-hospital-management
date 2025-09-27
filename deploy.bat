@echo off
echo ========================================
echo HMS项目 GitHub Pages 部署脚本
echo ========================================
echo.

:: 检查Git是否安装
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未检测到Git，请先安装Git
    echo 下载地址: https://git-scm.com/download/win
    pause
    exit /b 1
)

:: 检查Node.js是否安装
node --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  警告: 未检测到Node.js，将跳过路径优化
    set SKIP_OPTIMIZE=1
) else (
    echo ✅ 检测到Node.js，将运行路径优化
    set SKIP_OPTIMIZE=0
)

echo.
echo 🚀 开始部署流程...
echo.

:: 运行路径优化（如果Node.js可用）
if %SKIP_OPTIMIZE%==0 (
    echo 📝 正在优化项目路径...
    node optimize-for-github-pages.js
    if errorlevel 1 (
        echo ❌ 路径优化失败，但继续部署...
    ) else (
        echo ✅ 路径优化完成
    )
    echo.
)

:: 检查是否已经初始化Git仓库
if not exist .git (
    echo 📦 初始化Git仓库...
    git init
    git branch -M main
    echo ✅ Git仓库初始化完成
    echo.
)

:: 添加所有文件
echo 📁 添加文件到Git...
git add .

:: 检查是否有更改
git diff --staged --quiet
if errorlevel 1 (
    echo ✅ 检测到文件更改，准备提交
) else (
    echo ℹ️  没有检测到文件更改
    echo.
    echo 🎉 部署完成！如果这是首次部署，请手动设置远程仓库：
    echo    git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
    echo    git push -u origin main
    pause
    exit /b 0
)

:: 提交更改
echo.
set /p commit_message="请输入提交信息 (默认: Update HMS project): "
if "%commit_message%"=="" set commit_message=Update HMS project

git commit -m "%commit_message%"
if errorlevel 1 (
    echo ❌ 提交失败
    pause
    exit /b 1
)
echo ✅ 提交完成

:: 检查远程仓库
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo.
    echo ⚠️  未设置远程仓库，请手动添加：
    echo    git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
    echo    git push -u origin main
    echo.
    echo 📋 或者现在设置远程仓库URL：
    set /p remote_url="请输入GitHub仓库URL (留空跳过): "
    if not "%remote_url%"=="" (
        git remote add origin %remote_url%
        echo ✅ 远程仓库已设置
        goto push_changes
    ) else (
        echo ℹ️  跳过推送，请手动推送到GitHub
        goto end
    )
) else (
    echo ✅ 检测到远程仓库
)

:push_changes
:: 推送到GitHub
echo.
echo 🚀 推送到GitHub...
git push origin main
if errorlevel 1 (
    echo ❌ 推送失败，可能需要先设置认证或解决冲突
    echo.
    echo 💡 提示：
    echo    1. 确保已登录GitHub
    echo    2. 检查仓库权限
    echo    3. 如有冲突，先执行 git pull origin main
    pause
    exit /b 1
)

echo ✅ 推送完成

:end
echo.
echo ========================================
echo 🎉 部署完成！
echo ========================================
echo.
echo 📋 接下来的步骤：
echo 1. 访问GitHub仓库设置页面
echo 2. 进入 Settings ^> Pages
echo 3. 选择 Source: GitHub Actions
echo 4. 等待自动部署完成
echo.
echo 🌐 部署完成后，您的网站将在以下地址可用：
echo    https://YOUR_USERNAME.github.io/REPO_NAME/
echo.
echo 📖 详细说明请参考: GITHUB-PAGES-DEPLOYMENT.md
echo.
pause