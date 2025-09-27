# HMS医院管理系统 - 阿里云快速部署脚本 (Windows PowerShell)
# 使用方法: .\quick-deploy.ps1 -ServerIP "您的服务器IP" -Username "root"

param(
    [Parameter(Mandatory=$true)]
    [string]$ServerIP,
    
    [Parameter(Mandatory=$false)]
    [string]$Username = "root",
    
    [Parameter(Mandatory=$false)]
    [string]$ZipFile = "hms-production.zip",
    
    [Parameter(Mandatory=$false)]
    [string]$Domain = ""
)

# 颜色输出函数
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Write-Info {
    param([string]$Message)
    Write-ColorOutput "[INFO] $Message" "Cyan"
}

function Write-Success {
    param([string]$Message)
    Write-ColorOutput "[SUCCESS] $Message" "Green"
}

function Write-Warning {
    param([string]$Message)
    Write-ColorOutput "[WARNING] $Message" "Yellow"
}

function Write-Error {
    param([string]$Message)
    Write-ColorOutput "[ERROR] $Message" "Red"
}

# 检查必要文件
function Test-Prerequisites {
    Write-Info "检查部署前置条件..."
    
    # 检查zip文件是否存在
    if (-not (Test-Path $ZipFile)) {
        Write-Error "部署包 $ZipFile 不存在！"
        Write-Info "请确保已运行 'npm run build:protected' 生成部署包"
        exit 1
    }
    
    # 检查SSH客户端
    try {
        ssh -V 2>$null
        Write-Success "SSH客户端检查通过"
    } catch {
        Write-Error "未找到SSH客户端，请安装OpenSSH或使用Windows 10/11内置SSH"
        exit 1
    }
    
    # 检查SCP命令
    try {
        scp 2>$null
        Write-Success "SCP命令检查通过"
    } catch {
        Write-Error "未找到SCP命令"
        exit 1
    }
    
    Write-Success "前置条件检查完成"
}

# 上传文件到服务器
function Copy-FilesToServer {
    Write-Info "上传部署文件到服务器..."
    
    try {
        # 上传zip文件
        Write-Info "上传 $ZipFile 到服务器..."
        scp $ZipFile "${Username}@${ServerIP}:/tmp/"
        
        # 上传服务器配置脚本
        Write-Info "上传服务器配置脚本..."
        scp server-setup.sh "${Username}@${ServerIP}:/tmp/"
        
        Write-Success "文件上传完成"
    } catch {
        Write-Error "文件上传失败: $_"
        exit 1
    }
}

# 配置服务器环境
function Initialize-ServerEnvironment {
    Write-Info "配置服务器环境..."
    
    $setupCommands = @(
        "chmod +x /tmp/server-setup.sh",
        "sudo /tmp/server-setup.sh"
    )
    
    foreach ($command in $setupCommands) {
        Write-Info "执行: $command"
        ssh "${Username}@${ServerIP}" $command
        if ($LASTEXITCODE -ne 0) {
            Write-Error "命令执行失败: $command"
            exit 1
        }
    }
    
    Write-Success "服务器环境配置完成"
}

# 部署应用
function Deploy-Application {
    Write-Info "部署HMS应用..."
    
    try {
        ssh "${Username}@${ServerIP}" "deploy-hms /tmp/$ZipFile"
        Write-Success "应用部署完成"
    } catch {
        Write-Error "应用部署失败: $_"
        exit 1
    }
}

# 配置SSL证书（可选）
function Set-SSLCertificate {
    if ($Domain -ne "") {
        Write-Info "配置SSL证书..."
        
        try {
            ssh "${Username}@${ServerIP}" "setup-ssl $Domain"
            Write-Success "SSL证书配置完成"
        } catch {
            Write-Warning "SSL证书配置失败，您可以稍后手动配置"
        }
    }
}

# 验证部署
function Test-Deployment {
    Write-Info "验证部署结果..."
    
    try {
        # 检查Nginx状态
        $nginxStatus = ssh "${Username}@${ServerIP}" "systemctl is-active nginx"
        if ($nginxStatus -eq "active") {
            Write-Success "Nginx服务运行正常"
        } else {
            Write-Warning "Nginx服务状态异常: $nginxStatus"
        }
        
        # 测试HTTP访问
        Write-Info "测试HTTP访问..."
        $response = Invoke-WebRequest -Uri "http://$ServerIP/hms/" -UseBasicParsing -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Success "HTTP访问测试通过"
        } else {
            Write-Warning "HTTP访问测试失败，状态码: $($response.StatusCode)"
        }
        
    } catch {
        Write-Warning "部署验证过程中出现问题: $_"
    }
}

# 显示部署结果
function Show-DeploymentResult {
    Write-Success "🎉 HMS医院管理系统部署完成！"
    Write-Host ""
    Write-ColorOutput "📋 部署信息:" "Yellow"
    Write-Host "  服务器IP: $ServerIP"
    Write-Host "  部署包: $ZipFile"
    if ($Domain -ne "") {
        Write-Host "  域名: $Domain"
    }
    Write-Host ""
    Write-ColorOutput "🌐 访问地址:" "Yellow"
    Write-Host "  HTTP: http://$ServerIP/hms/"
    if ($Domain -ne "") {
        Write-Host "  HTTPS: https://$Domain/hms/"
    }
    Write-Host ""
    Write-ColorOutput "🔧 管理命令:" "Yellow"
    Write-Host "  查看状态: ssh $Username@$ServerIP 'systemctl status nginx'"
    Write-Host "  查看日志: ssh $Username@$ServerIP 'tail -f /var/log/nginx/error.log'"
    Write-Host "  重新部署: ssh $Username@$ServerIP 'deploy-hms /path/to/new-zip'"
    Write-Host ""
}

# 主函数
function Main {
    Write-ColorOutput "🚀 开始HMS医院管理系统自动化部署..." "Green"
    Write-Host ""
    
    try {
        Test-Prerequisites
        Copy-FilesToServer
        Initialize-ServerEnvironment
        Deploy-Application
        Set-SSLCertificate
        Test-Deployment
        Show-DeploymentResult
        
    } catch {
        Write-Error "部署过程中发生错误: $_"
        Write-Info "请检查网络连接和服务器配置"
        exit 1
    }
}

# 显示使用说明
if ($args.Count -eq 0 -or $args[0] -eq "-help" -or $args[0] -eq "--help") {
    Write-Host ""
    Write-ColorOutput "HMS医院管理系统 - 阿里云快速部署脚本" "Green"
    Write-Host ""
    Write-Host "使用方法:"
    Write-Host "  .\quick-deploy.ps1 -ServerIP '您的服务器IP' [-Username 'root'] [-ZipFile 'hms-production.zip'] [-Domain '您的域名']"
    Write-Host ""
    Write-Host "参数说明:"
    Write-Host "  -ServerIP   : 阿里云服务器IP地址 (必需)"
    Write-Host "  -Username   : SSH用户名 (默认: root)"
    Write-Host "  -ZipFile    : 部署包文件名 (默认: hms-production.zip)"
    Write-Host "  -Domain     : 域名 (可选，用于SSL配置)"
    Write-Host ""
    Write-Host "示例:"
    Write-Host "  .\quick-deploy.ps1 -ServerIP '123.456.789.0'"
    Write-Host "  .\quick-deploy.ps1 -ServerIP '123.456.789.0' -Domain 'yourdomain.com'"
    Write-Host ""
    exit 0
}

# 运行主函数
Main