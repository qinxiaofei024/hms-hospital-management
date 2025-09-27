import requests
from bs4 import BeautifulSoup
import time
import sys

# 定义要测试的URL
test_urls = [
    "http://localhost:8000/pages/economic-benefit.html",
    "http://localhost:8000/pages/echarts-minimal-test.html",
    "http://localhost:8000/pages/economic-benefit-chart-test.html",
    "http://localhost:8000/pages/chart-diagnostics.html"
]

# 定义要检查的资源
critical_resources = {
    "ECharts CDN": "https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js",
    "economic-benefit.js": "http://localhost:8000/js/economic-benefit.js",
    "common.js": "http://localhost:8000/js/common.js"
}

print("="*80)
print("经济效益分析页面测试工具")
print("="*80)
print(f"测试时间: {time.strftime('%Y-%m-%d %H:%M:%S')}")
print("="*80)

# 测试HTTP服务器连接
try:
    response = requests.get("http://localhost:8000", timeout=5)
    if response.status_code == 200:
        print("✅ HTTP服务器连接正常")
    else:
        print(f"❌ HTTP服务器返回状态码: {response.status_code}")
except Exception as e:
    print(f"❌ 无法连接到HTTP服务器: {str(e)}")
    print("请确保服务器已启动: python -m http.server 8000 --directory c:/Users/qinxi/lakehouse_guangdong/hms")
    sys.exit(1)

print("="*80)
print("页面访问测试:")
print("="*80)

# 测试每个页面的访问情况
for url in test_urls:
    try:
        print(f"\n测试页面: {url}")
        start_time = time.time()
        response = requests.get(url, timeout=10)
        end_time = time.time()
        
        print(f"状态码: {response.status_code}")
        print(f"响应时间: {end_time - start_time:.2f}秒")
        print(f"内容大小: {len(response.text)}字节")
        
        # 检查页面内容
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 检查ECharts引入
        echarts_scripts = soup.find_all('script', src=lambda x: x and 'echarts' in x)
        if echarts_scripts:
            print("✅ 页面中包含ECharts脚本引入")
            for script in echarts_scripts:
                print(f"  - {script['src']}")
        else:
            print("❌ 页面中未找到ECharts脚本引入")
        
        # 检查图表容器
        chart_containers = soup.find_all('div', class_='chart-content')
        id_chart_containers = soup.find_all('div', id=lambda x: x and ('chart' in x or 'Chart' in x))
        
        if chart_containers or id_chart_containers:
            print(f"✅ 找到图表容器: 类选择器({len(chart_containers)}), ID选择器({len(id_chart_containers)})")
        else:
            print("❌ 未找到图表容器元素")
        
    except Exception as e:
        print(f"❌ 访问页面时出错: {str(e)}")

print("="*80)
print("资源加载测试:")
print("="*80)

# 测试关键资源的加载
for name, resource_url in critical_resources.items():
    try:
        print(f"\n测试资源: {name}")
        print(f"URL: {resource_url}")
        start_time = time.time()
        response = requests.get(resource_url, timeout=10)
        end_time = time.time()
        
        print(f"状态码: {response.status_code}")
        print(f"响应时间: {end_time - start_time:.2f}秒")
        print(f"内容大小: {len(response.text)}字节")
        
        # 对于JS文件，检查是否包含关键内容
        if resource_url.endswith('.js'):
            if len(response.text) > 1000:
                print("✅ 资源内容看起来正常")
                # 检查是否包含关键函数或变量名
                if 'echarts' in resource_url:
                    if 'ECharts is a free, powerful charting and visualization library' in response.text:
                        print("✅ 确认是ECharts库文件")
                elif 'economic-benefit' in resource_url:
                    if 'EconomicBenefitPage' in response.text:
                        print("✅ 找到EconomicBenefitPage类定义")
            else:
                print("⚠️ 资源内容可能不完整")
        
    except Exception as e:
        print(f"❌ 加载资源时出错: {str(e)}")

print("="*80)
print("测试总结:")
print("="*80)
print("1. 确保HTTP服务器正常运行")
print("2. 检查浏览器开发者工具中的控制台错误")
print("3. 确认ECharts库正确加载")
print("4. 验证图表容器元素存在且尺寸正确")
print("5. 检查JavaScript执行是否有异常")
print("="*80)
print("测试完成。如果所有测试都通过但图表仍不显示，可能需要检查浏览器兼容性或安全设置。")
print("建议使用Chrome或Firefox等现代浏览器，并检查开发者工具中的Network和Console标签。")