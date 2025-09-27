import urllib.request
import time
import ssl

# 尝试访问页面
try:
    # 创建不验证SSL证书的上下文（对于本地开发服务器）
    context = ssl.create_default_context()
    context.check_hostname = False
    context.verify_mode = ssl.CERT_NONE
    
    start_time = time.time()
    
    # 设置超时
    with urllib.request.urlopen('http://localhost:8000/economic-operation.html', context=context, timeout=5) as response:
        end_time = time.time()
        
        status_code = response.status
        content_type = response.getheader('Content-Type')
        content = response.read()
        content_length = len(content)
        
        print(f'状态码: {status_code}')
        print(f'响应时间: {end_time - start_time:.2f}秒')
        print(f'内容类型: {content_type}')
        print(f'内容长度: {content_length}字节')
        
        # 检查是否包含中文字符
        content_str = content.decode('utf-8', errors='ignore')
        print(f'是否包含"经济运行分析": {'经济运行分析' in content_str}')
        
        # 显示前100个字符
        print('前100个字符:')
        print(content_str[:100])
        
        # 检查是否存在JavaScript错误
        if '<script' in content_str.lower():
            print('页面包含JavaScript脚本')
        
        # 检查CSS文件引用
        if 'economic-operation.css' in content_str:
            print('找到economic-operation.css引用')
        
        # 检查JS文件引用
        if 'economic-operation.js' in content_str:
            print('找到economic-operation.js引用')
            
except urllib.error.URLError as e:
    print(f'URL错误: {str(e)}')
except urllib.error.HTTPError as e:
    print(f'HTTP错误: 状态码 {e.code}, 信息 {e.reason}')
except Exception as e:
    print(f'访问页面时出错: {str(e)}')

print('\n测试完成')