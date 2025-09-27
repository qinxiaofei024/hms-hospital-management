// vite.config.js - 增强版配置，包含代码保护
import { defineConfig } from 'vite';
import { resolve } from 'path';
import { obfuscator } from 'rollup-plugin-obfuscator';

export default defineConfig({
  // 开发服务器配置
  server: {
    port: 8888,
    open: '/' // 启动时打开根路径
  },
  
  // 构建 (打包) 配置 - 多入口 + 代码保护
  build: {
    outDir: 'dist', // 打包输出目录
    minify: 'terser', // 使用 terser 进行代码压缩
    
    // Terser 压缩选项
    terserOptions: {
      compress: {
        drop_console: true, // 移除 console.log
        drop_debugger: true, // 移除 debugger
        pure_funcs: ['console.log', 'console.info', 'console.debug'], // 移除指定函数
      },
      mangle: {
        toplevel: true, // 混淆顶级作用域
        safari10: true,
      },
      format: {
        comments: false, // 移除注释
      },
    },
    
    // Rollup 选项
    rollupOptions: {
      input: {
        // 定义多个入口点
        main: resolve(__dirname, 'index.html'),           // 根目录的 index.html
        hms: resolve(__dirname, 'hms/index.html'),        // hms 目录下的 index.html
        // HMS 子页面
        'key-indicators': resolve(__dirname, 'hms/pages/key-indicators.html'),
        'economic-benefit': resolve(__dirname, 'hms/pages/economic-benefit.html'),
        'department-cockpit': resolve(__dirname, 'hms/pages/department-cockpit.html'),
        'performance-management': resolve(__dirname, 'hms/pages/performance-management.html')
      },
      
      // 输出配置
      output: {
        // 文件名混淆
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        
        // 手动分块，进一步混淆代码结构
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          if (id.includes('echarts')) {
            return 'charts';
          }
          if (id.includes('common.js')) {
            return 'utils';
          }
        }
      },
      
      // 插件配置
      plugins: [
        // JavaScript 代码混淆
        obfuscator({
          // 混淆选项
          compact: true,
          controlFlowFlattening: true,
          controlFlowFlatteningThreshold: 0.75,
          deadCodeInjection: true,
          deadCodeInjectionThreshold: 0.4,
          debugProtection: true,
          debugProtectionInterval: true,
          disableConsoleOutput: true,
          identifierNamesGenerator: 'hexadecimal',
          log: false,
          renameGlobals: false,
          rotateStringArray: true,
          selfDefending: true,
          shuffleStringArray: true,
          splitStrings: true,
          splitStringsChunkLength: 10,
          stringArray: true,
          stringArrayEncoding: ['base64'],
          stringArrayThreshold: 0.75,
          transformObjectKeys: true,
          unicodeEscapeSequence: false
        })
      ]
    },
    
    // 资源内联阈值
    assetsInlineLimit: 4096,
    
    // 源码映射 - 生产环境关闭
    sourcemap: false,
    
    // 报告压缩详情
    reportCompressedSize: true,
  },
  
  // 插件配置
  plugins: [],
  
  // 定义全局常量替换
  define: {
    __DEV__: false,
    __VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
  },
  
  // CSS 配置
  css: {
    // CSS 代码分割
    codeSplit: true,
    // 压缩 CSS
    postcss: {
      plugins: [
        // 可以添加 autoprefixer 等插件
      ]
    }
  }
});
