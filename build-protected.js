#!/usr/bin/env node

/**
 * 增强构建脚本 - 包含代码保护和混淆
 * 用于生产环境部署，最大化保护源代码
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const JavaScriptObfuscator = require('javascript-obfuscator');

console.log('🚀 开始增强构建过程...');

// 1. 清理之前的构建
console.log('📁 清理构建目录...');
if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
}

// 2. 执行 Vite 构建
console.log('⚡ 执行 Vite 构建...');
try {
    execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
    console.error('❌ Vite 构建失败:', error.message);
    process.exit(1);
}

// 复制 HMS 目录到构建输出
console.log('📁 复制 HMS 应用到构建目录...');
const hmsSourceDir = path.join(__dirname, 'hms');
const hmsDestDir = path.join(__dirname, 'dist', 'hms');

if (fs.existsSync(hmsSourceDir)) {
    // 递归复制目录
    function copyDir(src, dest) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        
        const files = fs.readdirSync(src);
        files.forEach(file => {
            const srcPath = path.join(src, file);
            const destPath = path.join(dest, file);
            const stat = fs.statSync(srcPath);
            
            if (stat.isDirectory()) {
                // 排除不需要的目录
                if (!['node_modules', '.git', 'test'].includes(file)) {
                    copyDir(srcPath, destPath);
                }
            } else {
                // 排除不需要的文件
                if (!file.endsWith('.log')) {
                    fs.copyFileSync(srcPath, destPath);
                }
            }
        });
    }
    
    copyDir(hmsSourceDir, hmsDestDir);
    console.log('✅ HMS 应用复制完成');
} else {
    console.log('⚠️  HMS 目录不存在，跳过复制');
}

// 3. 额外的 JavaScript 文件混淆
console.log('🔒 执行额外的代码混淆...');

function obfuscateJSFiles(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            obfuscateJSFiles(filePath);
        } else if (file.endsWith('.js') && !file.includes('.min.')) {
            console.log(`  🔧 混淆文件: ${filePath}`);
            
            try {
                const code = fs.readFileSync(filePath, 'utf8');
                
                // 高强度混淆配置
                const obfuscatedCode = JavaScriptObfuscator.obfuscate(code, {
                    compact: true,
                    controlFlowFlattening: true,
                    controlFlowFlatteningThreshold: 0.8,
                    numbersToExpressions: true,
                    simplify: true,
                    stringArrayShuffle: true,
                    splitStrings: true,
                    stringArrayThreshold: 0.8,
                    transformObjectKeys: true,
                    unicodeEscapeSequence: false,
                    identifierNamesGenerator: 'hexadecimal',
                    renameGlobals: false,
                    selfDefending: true,
                    stringArray: true,
                    rotateStringArray: true,
                    stringArrayEncoding: ['base64'],
                    deadCodeInjection: true,
                    deadCodeInjectionThreshold: 0.3,
                    debugProtection: false, // 暂时禁用以避免问题
                    disableConsoleOutput: true,
                    domainLock: [], // 可以添加域名锁定
                    reservedNames: [], // 保留的变量名
                    seed: Math.floor(Math.random() * 1000000) // 随机种子
                });
                
                fs.writeFileSync(filePath, obfuscatedCode.getObfuscatedCode());
                console.log(`    ✅ 混淆成功: ${file}`);
            } catch (error) {
                console.log(`    ⚠️  跳过文件 ${file}: ${error.message}`);
                // 保持原文件不变
            }
        }
    });
}

// 混淆 dist 目录中的所有 JS 文件
if (fs.existsSync('dist')) {
    obfuscateJSFiles('dist');
}

// 4. 创建版权保护文件
console.log('📄 添加版权保护信息...');
const copyrightNotice = `/*
 * 医院数据中心管理平台 (HMS)
 * 版权所有 © ${new Date().getFullYear()}
 * 
 * 警告：本软件受版权法保护。
 * 未经授权的复制、分发或修改是被禁止的。
 * 违反者将面临法律后果。
 * 
 * 构建时间: ${new Date().toISOString()}
 * 构建版本: ${process.env.npm_package_version || '1.0.0'}
 */
`;

fs.writeFileSync(path.join('dist', 'COPYRIGHT.txt'), copyrightNotice);

// 5. 创建部署说明
const deploymentGuide = `# HMS 部署指南

## 部署要求
- Web 服务器 (Apache/Nginx)
- 支持静态文件服务
- HTTPS 推荐

## 部署步骤
1. 将 dist 目录内容上传到 Web 服务器
2. 配置服务器指向 index.html 或 hms/index.html
3. 确保所有静态资源可访问

## 安全建议
- 启用 HTTPS
- 配置适当的 CSP 头
- 定期更新服务器软件

## 技术支持
如需技术支持，请联系开发团队。

构建时间: ${new Date().toISOString()}
`;

fs.writeFileSync(path.join('dist', 'DEPLOYMENT.md'), deploymentGuide);

// 6. 生成文件完整性校验
console.log('🔐 生成文件完整性校验...');
const crypto = require('crypto');

function generateChecksums(dir, checksums = {}) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            generateChecksums(filePath, checksums);
        } else {
            const content = fs.readFileSync(filePath);
            const hash = crypto.createHash('sha256').update(content).digest('hex');
            const relativePath = path.relative('dist', filePath);
            checksums[relativePath] = hash;
        }
    });
    
    return checksums;
}

const checksums = generateChecksums('dist');
fs.writeFileSync(
    path.join('dist', 'checksums.json'), 
    JSON.stringify(checksums, null, 2)
);

// 7. 压缩构建结果
console.log('📦 压缩构建结果...');
try {
    const archiver = require('archiver');
    const output = fs.createWriteStream('hms-production.zip');
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    output.on('close', () => {
        console.log(`✅ 构建完成! 总大小: ${archive.pointer()} bytes`);
        console.log('📦 生产包: hms-production.zip');
        console.log('📁 构建目录: dist/');
        console.log('');
        console.log('🎉 项目已准备好部署!');
        console.log('');
        console.log('📋 部署清单:');
        console.log('  ✓ 代码已混淆和压缩');
        console.log('  ✓ 移除了调试信息');
        console.log('  ✓ 添加了版权保护');
        console.log('  ✓ 生成了完整性校验');
        console.log('  ✓ 创建了部署包');
    });
    
    archive.on('error', (err) => {
        console.error('❌ 压缩失败:', err);
    });
    
    archive.pipe(output);
    archive.directory('dist/', false);
    archive.finalize();
    
} catch (error) {
    console.log('⚠️  压缩工具未安装，跳过压缩步骤');
    console.log('✅ 构建完成! 构建目录: dist/');
    console.log('');
    console.log('🎉 项目已准备好部署!');
}