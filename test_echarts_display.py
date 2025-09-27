from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time
import os
import sys

# 配置Chrome选项
chrome_options = Options()
chrome_options.add_argument("--headless")  # 无头模式，不显示浏览器窗口
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--window-size=1920,1080")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")

# 要测试的URL列表
test_urls = [
    "http://localhost:8000/pages/echarts-ultimate-test.html",
    "http://localhost:8000/pages/economic-benefit.html",
    "http://localhost:8000/pages/economic-benefit-chart-test.html"
]

def test_echarts_display():
    """使用Selenium测试ECharts图表显示情况"""
    print("="*80)
    print("ECharts图表显示测试工具")
    print("="*80)
    print(f"测试时间: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*80)
    
    # 确保截图目录存在
    screenshot_dir = "echarts_screenshots"
    if not os.path.exists(screenshot_dir):
        os.makedirs(screenshot_dir)
    
    try:
        # 初始化WebDriver
        print("正在初始化Chrome浏览器...")
        driver = webdriver.Chrome(
            service=Service(ChromeDriverManager().install()),
            options=chrome_options
        )
        print("Chrome浏览器初始化成功")
        
        for i, url in enumerate(test_urls):
            print("="*80)
            print(f"测试页面 {i+1}/{len(test_urls)}: {url}")
            print("="*80)
            
            try:
                # 访问页面
                start_time = time.time()
                driver.get(url)
                load_time = time.time() - start_time
                print(f"页面加载完成，耗时: {load_time:.2f}秒")
                
                # 等待图表渲染
                print("等待图表渲染...")
                time.sleep(5)  # 给足够的时间让图表渲染
                
                # 捕获页面标题
                page_title = driver.title
                print(f"页面标题: {page_title}")
                
                # 捕获页面源码中的关键信息
                page_source = driver.page_source
                
                # 检查ECharts是否加载
                if 'echarts' in page_source.lower():
                    print("✅ 页面中包含ECharts相关内容")
                else:
                    print("❌ 页面中未找到ECharts相关内容")
                
                # 检查是否有图表容器
                chart_elements = driver.find_elements("css selector", "div[id*='chart'], div[class*='chart']")
                if chart_elements:
                    print(f"✅ 找到图表容器元素: {len(chart_elements)}个")
                    for j, element in enumerate(chart_elements):
                        try:
                            # 获取元素信息
                            element_id = element.get_attribute('id') or 'unnamed'
                            element_class = element.get_attribute('class') or 'no-class'
                            location = element.location
                            size = element.size
                            
                            print(f"  - 容器{j+1}: ID='{element_id}', Class='{element_class}', 位置={location}, 大小={size}")
                            
                            # 对每个图表容器截图
                            screenshot_path = os.path.join(screenshot_dir, f"chart_{i+1}_{j+1}.png")
                            element.screenshot(screenshot_path)
                            print(f"    ✓ 已保存图表容器截图: {screenshot_path}")
                        except Exception as e:
                            print(f"    ✗ 对图表容器截图失败: {str(e)}")
                else:
                    print("❌ 未找到图表容器元素")
                
                # 截取整个页面的截图
                full_screenshot_path = os.path.join(screenshot_dir, f"full_page_{i+1}.png")
                driver.save_screenshot(full_screenshot_path)
                print(f"✅ 已保存完整页面截图: {full_screenshot_path}")
                
                # 尝试获取JavaScript控制台日志
                try:
                    logs = driver.get_log("browser")
                    if logs:
                        print(f"✅ 捕获到{len(logs)}条浏览器控制台日志")
                        # 保存日志到文件
                        log_path = os.path.join(screenshot_dir, f"console_logs_{i+1}.txt")
                        with open(log_path, "w", encoding="utf-8") as f:
                            for log in logs:
                                f.write(f"[{log['level']}] {log['message']}\n")
                        print(f"    ✓ 已保存控制台日志: {log_path}")
                    else:
                        print("⚠️ 未捕获到浏览器控制台日志")
                except Exception as e:
                    print(f"❌ 获取控制台日志失败: {str(e)}")
                
            except Exception as e:
                print(f"❌ 测试页面时出错: {str(e)}")
        
    except Exception as e:
        print(f"❌ 初始化浏览器或测试过程中出错: {str(e)}")
        print("可能需要手动安装Chrome浏览器或配置WebDriver")
    finally:
        # 关闭浏览器
        if 'driver' in locals():
            driver.quit()
            print("Chrome浏览器已关闭")
    
    print("="*80)
    print("测试总结:")
    print("="*80)
    print(f"测试了{len(test_urls)}个页面")
    print(f"截图保存在: {os.path.abspath(screenshot_dir)}")
    print("请查看截图和日志文件，确认图表是否正常显示")
    print("="*80)

if __name__ == "__main__":
    try:
        # 检查是否安装了必要的依赖
        import selenium
        import webdriver_manager
        print("依赖包检查通过")
    except ImportError:
        print("正在安装必要的依赖包...")
        os.system(f"{sys.executable} -m pip install selenium webdriver_manager")
        print("依赖包安装完成")
    
    # 运行测试
    test_echarts_display()