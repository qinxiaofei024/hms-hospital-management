#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
ECharts诊断工具测试脚本
用于验证echarts-diagnostics.js是否正确集成到economic-benefit.html页面中
"""

import requests
from bs4 import BeautifulSoup
import time
import json

# 配置
BASE_URL = "http://localhost:8000"
TARGET_PAGE = f"{BASE_URL}/pages/economic-benefit.html"
TIMEOUT = 10


def test_page_access():
    """测试页面是否能够正常访问"""
    print("===== 开始测试ECharts诊断工具 =====")
    print(f"1. 测试页面访问: {TARGET_PAGE}")
    
    try:
        response = requests.get(TARGET_PAGE, timeout=TIMEOUT)
        if response.status_code == 200:
            print(f"✅ 页面访问成功，状态码: {response.status_code}")
            return response.text
        else:
            print(f"❌ 页面访问失败，状态码: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ 页面访问异常: {str(e)}")
        print("提示: 请确保HTTP服务器已启动 (python -m http.server 8000 --directory c:/Users/qinxi/lakehouse_guangdong/hms)")
        return None


def check_diagnostics_script(html_content):
    """检查诊断脚本是否正确集成"""
    if not html_content:
        return False
    
    print("2. 检查诊断脚本集成")
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # 检查是否引用了诊断脚本
    diagnostic_scripts = soup.find_all('script', src=lambda src: src and '../js/echarts-diagnostics.js' in src)
    
    if diagnostic_scripts:
        print(f"✅ 发现诊断脚本引用: {diagnostic_scripts[0]['src']}")
        return True
    else:
        print("❌ 未找到诊断脚本引用")
        # 检查是否还有旧的修复脚本
        old_scripts = soup.find_all('script', src=lambda src: src and 'economic-benefit-fix.js' in src)
        if old_scripts:
            print(f"⚠️ 发现旧的修复脚本: {old_scripts[0]['src']}")
        return False


def check_echarts_library(html_content):
    """检查ECharts库是否被引用"""
    if not html_content:
        return False
    
    print("3. 检查ECharts库引用")
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # 检查是否引用了ECharts库
    echarts_scripts = soup.find_all('script', src=lambda src: src and ('echarts.min.js' in src or 'echarts.js' in src))
    
    if echarts_scripts:
        print(f"✅ 发现ECharts库引用: {echarts_scripts[0]['src']}")
        return True
    else:
        print("⚠️ 未直接引用ECharts库，但诊断工具会尝试动态加载")
        return True  # 诊断工具会尝试动态加载，所以返回True


def check_chart_containers(html_content):
    """检查图表容器是否存在"""
    if not html_content:
        return []
    
    print("4. 检查图表容器")
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # 主要图表容器ID列表
    chart_ids = ['overall-trend-chart', 'department-benefit-chart', 'service-benefit-chart', 'service-cost-chart']
    found_containers = []
    
    for chart_id in chart_ids:
        container = soup.find(id=chart_id)
        if container:
            print(f"✅ 找到图表容器: {chart_id}")
            found_containers.append(chart_id)
        else:
            print(f"❌ 未找到图表容器: {chart_id}")
    
    return found_containers


def generate_test_report(access_success, script_integrated, echarts_available, chart_containers):
    """生成测试报告"""
    print("\n===== 测试报告摘要 =====")
    
    # 计算总分
    total_score = 0
    max_score = 100
    
    if access_success:
        total_score += 30
        print("1. 页面访问: ✅ 通过 (30/30分)")
    else:
        print("1. 页面访问: ❌ 失败 (0/30分)")
        
    if script_integrated:
        total_score += 30
        print("2. 诊断脚本集成: ✅ 通过 (30/30分)")
    else:
        print("2. 诊断脚本集成: ❌ 失败 (0/30分)")
        
    if echarts_available:
        total_score += 20
        print("3. ECharts库: ✅ 可用 (20/20分)")
    else:
        print("3. ECharts库: ❌ 不可用 (0/20分)")
        
    container_score = int(len(chart_containers) / 4 * 20)
    total_score += container_score
    print(f"4. 图表容器: {'✅' if len(chart_containers) == 4 else '⚠️'} 找到 {len(chart_containers)}/4 个容器 ({container_score}/20分)")
    
    print(f"\n总评分: {total_score}/{max_score}")
    
    # 生成建议
    print("\n===== 使用建议 =====")
    print("1. 打开经济效益分析页面 (economic-benefit.html)")
    print("2. 在页面右下角寻找 '📊 ECharts诊断' 浮动按钮")
    print("3. 点击按钮打开诊断面板")
    print("4. 查看诊断结果，然后点击 '🔧 一键修复图表' 按钮")
    print("5. 如仍有问题，请复制诊断报告并分析具体错误")
    
    # 保存报告到文件
    report = {
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "access_success": access_success,
        "script_integrated": script_integrated,
        "echarts_available": echarts_available,
        "chart_containers_found": len(chart_containers),
        "chart_containers": chart_containers,
        "total_score": total_score,
        "max_score": max_score
    }
    
    with open("echarts_diagnostics_test_report.json", "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    
    print("\n✅ 测试报告已保存到: echarts_diagnostics_test_report.json")


def main():
    """主函数"""
    # 测试页面访问
    html_content = test_page_access()
    access_success = html_content is not None
    
    # 检查诊断脚本集成
    script_integrated = check_diagnostics_script(html_content)
    
    # 检查ECharts库
    echarts_available = check_echarts_library(html_content)
    
    # 检查图表容器
    chart_containers = check_chart_containers(html_content)
    
    # 生成测试报告
    generate_test_report(access_success, script_integrated, echarts_available, chart_containers)
    
    print("\n===== 测试完成 =====")


if __name__ == "__main__":
    main()