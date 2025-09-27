import requests
from bs4 import BeautifulSoup
import time
import os

# 测试经济效益分析页面的图表元素加载情况
def test_economic_benefit_page():
    print("="*50)
    print("开始测试经济效益分析页面 - 图表元素检查")
    print("="*50)
    
    url = "http://localhost:8000/pages/economic-benefit.html"
    
    try:
        # 发送HTTP请求
        print(f"正在访问页面: {url}")
        start_time = time.time()
        response = requests.get(url, timeout=10)
        end_time = time.time()
        
        # 检查响应状态码
        if response.status_code != 200:
            print(f"❌ 页面访问失败，状态码: {response.status_code}")
            return False
        
        print(f"✅ 页面访问成功，状态码: {response.status_code}")
        print(f"页面加载时间: {end_time - start_time:.2f}秒")
        print(f"页面大小: {len(response.text)/1024:.2f} KB")
        
        # 解析HTML内容
        soup = BeautifulSoup(response.text, 'html.parser')
        print("✅ HTML内容解析成功")
        
        # 检查标题
        title = soup.title.text if soup.title else "无标题"
        print(f"页面标题: {title}")
        
        # 检查图表容器元素
        print("\n检查图表容器元素:")
        chart_ids = [
            'overall-trend-chart',
            'department-benefit-chart',
            'service-benefit-chart',
            'service-cost-chart'
        ]
        
        chart_containers_found = 0
        for chart_id in chart_ids:
            chart_container = soup.find(id=chart_id)
            if chart_container:
                # 获取容器类型和类名
                container_type = chart_container.name
                container_classes = chart_container.get('class', [])
                print(f"✅ 找到图表容器: {chart_id} (类型: {container_type}, 类名: {', '.join(container_classes)})")
                chart_containers_found += 1
            else:
                print(f"❌ 未找到图表容器: {chart_id}")
        
        print(f"\n图表容器检查总结: 共找到 {chart_containers_found}/{len(chart_ids)} 个图表容器")
        
        # 检查ECharts库引用
        print("\n检查ECharts库引用:")
        echarts_scripts = soup.find_all('script', src=lambda x: x and 'echarts' in x)
        
        if echarts_scripts:
            print(f"✅ 找到 {len(echarts_scripts)} 个ECharts库引用:")
            for script in echarts_scripts:
                src = script.get('src')
                print(f"  - {src}")
        else:
            print("❌ 未找到ECharts库引用")
        
        # 检查我们的修复脚本引用
        print("\n检查修复脚本引用:")
        fix_script = soup.find('script', src=lambda x: x and 'economic-benefit-fix.js' in x)
        if fix_script:
            print(f"✅ 找到修复脚本引用: {fix_script.get('src')}")
        else:
            print("❌ 未找到修复脚本引用")
        
        # 检查页面中的其他关键元素
        print("\n检查其他关键元素:")
        
        # 检查标签按钮
        tab_buttons = soup.find_all(class_='tab-button')
        if tab_buttons:
            print(f"✅ 找到 {len(tab_buttons)} 个标签按钮")
        else:
            print("❌ 未找到标签按钮")
        
        # 检查标签内容
        tab_contents = soup.find_all(class_='tab-content')
        if tab_contents:
            print(f"✅ 找到 {len(tab_contents)} 个标签内容区域")
        else:
            print("❌ 未找到标签内容区域")
        
        # 保存页面内容到临时文件，方便进一步检查
        temp_file = "temp_economic_benefit.html"
        with open(temp_file, 'w', encoding='utf-8') as f:
            f.write(response.text)
        print(f"\n✅ 页面内容已保存到: {os.path.abspath(temp_file)}")
        
        print("\n测试完成！")
        print("="*50)
        
        # 综合评估
        if chart_containers_found == len(chart_ids) and echarts_scripts and fix_script:
            print("✅ 页面结构看起来正常，所有图表容器和必要的脚本都已找到")
            print("提示: 如果图表仍然不显示，可能是浏览器渲染问题或JavaScript执行问题")
            print("建议: 打开浏览器开发者工具(F12)，检查Console和Network标签获取更多信息")
            return True
        else:
            print("⚠️ 页面结构有缺失，可能是图表不显示的原因")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ 访问页面时发生错误: {e}")
        print("请确保HTTP服务器正在运行，并且URL正确")
        return False
    except Exception as e:
        print(f"❌ 测试过程中发生未知错误: {e}")
        return False

if __name__ == "__main__":
    # 检查是否安装了必要的依赖
    try:
        import requests
        import bs4
    except ImportError:
        print("正在安装必要的依赖...")
        os.system("pip install requests beautifulsoup4")
        print("依赖安装完成，重新运行测试...")
        time.sleep(1)
        # 重新导入依赖
        import requests
        import bs4
    
    # 运行测试
    test_economic_benefit_page()