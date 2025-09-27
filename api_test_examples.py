#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
病种效益分析API测试示例
测试所有API接口的功能
"""

import requests
import json
from datetime import datetime

# API基础URL
BASE_URL = "http://localhost:5000"
API_BASE = f"{BASE_URL}/api"

def test_api_health():
    """测试API健康状态"""
    print("🔍 测试API健康状态...")
    try:
        response = requests.get(f"{API_BASE}/health")
        print(f"状态码: {response.status_code}")
        print(f"响应: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ 健康检查失败: {e}")
        return False

def test_get_disease_benefit_list():
    """测试获取病种效益列表"""
    print("\n🔍 测试获取病种效益列表...")
    
    # 基础查询
    try:
        response = requests.get(f"{API_BASE}/disease-benefit")
        print(f"状态码: {response.status_code}")
        data = response.json()
        print(f"返回数据条数: {len(data['data']['diseases'])}")
        print(f"分页信息: {data['data']['pagination']}")
        
        # 带参数查询
        params = {
            'department': '心内科',
            'page': 1,
            'pageSize': 5,
            'sortBy': 'profit_rate',
            'sortOrder': 'DESC'
        }
        response = requests.get(f"{API_BASE}/disease-benefit", params=params)
        print(f"\n带参数查询状态码: {response.status_code}")
        data = response.json()
        print(f"筛选后数据条数: {len(data['data']['diseases'])}")
        
        return response.status_code == 200
    except Exception as e:
        print(f"❌ 获取列表失败: {e}")
        return False

def test_get_disease_detail():
    """测试获取病种详情"""
    print("\n🔍 测试获取病种详情...")
    try:
        # 先获取一个ID
        response = requests.get(f"{API_BASE}/disease-benefit?pageSize=1")
        if response.status_code == 200:
            data = response.json()
            if data['data']['diseases']:
                disease_id = data['data']['diseases'][0]['id']
                
                # 获取详情
                detail_response = requests.get(f"{API_BASE}/disease-benefit/{disease_id}")
                print(f"状态码: {detail_response.status_code}")
                detail_data = detail_response.json()
                print(f"病种详情: {detail_data['data']['disease_name']}")
                return detail_response.status_code == 200
        
        print("❌ 没有找到可测试的病种数据")
        return False
    except Exception as e:
        print(f"❌ 获取详情失败: {e}")
        return False

def test_get_stats():
    """测试获取统计数据"""
    print("\n🔍 测试获取统计数据...")
    try:
        response = requests.get(f"{API_BASE}/disease-benefit/stats")
        print(f"状态码: {response.status_code}")
        data = response.json()
        stats = data['data']
        print(f"总病种数: {stats['total_diseases']}")
        print(f"总病例数: {stats['total_cases']}")
        print(f"总收入: {stats['total_revenue']}")
        print(f"平均结余率: {stats['avg_profit_rate']:.2f}%")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ 获取统计数据失败: {e}")
        return False

def test_export_data():
    """测试数据导出"""
    print("\n🔍 测试数据导出...")
    try:
        export_data = {
            'format': 'excel',
            'filters': {
                'department': '心内科',
                'dateStart': '2024-01-01',
                'dateEnd': '2024-12-31'
            }
        }
        
        response = requests.post(
            f"{API_BASE}/disease-benefit/export",
            json=export_data,
            headers={'Content-Type': 'application/json'}
        )
        print(f"状态码: {response.status_code}")
        data = response.json()
        print(f"导出文件: {data['data']['fileName']}")
        print(f"下载链接: {data['data']['downloadUrl']}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ 数据导出失败: {e}")
        return False

def test_get_departments():
    """测试获取科室列表"""
    print("\n🔍 测试获取科室列表...")
    try:
        response = requests.get(f"{API_BASE}/disease-benefit/departments")
        print(f"状态码: {response.status_code}")
        data = response.json()
        departments = data['data']
        print(f"科室列表: {departments}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ 获取科室列表失败: {e}")
        return False

def test_error_handling():
    """测试错误处理"""
    print("\n🔍 测试错误处理...")
    try:
        # 测试不存在的病种ID
        response = requests.get(f"{API_BASE}/disease-benefit/99999")
        print(f"不存在ID状态码: {response.status_code}")
        
        # 测试不存在的接口
        response = requests.get(f"{API_BASE}/not-exist")
        print(f"不存在接口状态码: {response.status_code}")
        
        return True
    except Exception as e:
        print(f"❌ 错误处理测试失败: {e}")
        return False

def run_all_tests():
    """运行所有测试"""
    print("🚀 开始API测试...")
    print("=" * 50)
    
    tests = [
        ("API健康检查", test_api_health),
        ("获取病种效益列表", test_get_disease_benefit_list),
        ("获取病种详情", test_get_disease_detail),
        ("获取统计数据", test_get_stats),
        ("数据导出", test_export_data),
        ("获取科室列表", test_get_departments),
        ("错误处理", test_error_handling)
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, "✅ 通过" if result else "❌ 失败"))
        except Exception as e:
            results.append((test_name, f"❌ 异常: {e}"))
    
    print("\n" + "=" * 50)
    print("📊 测试结果汇总:")
    for test_name, result in results:
        print(f"{test_name}: {result}")
    
    passed = sum(1 for _, result in results if "✅" in result)
    total = len(results)
    print(f"\n通过率: {passed}/{total} ({passed/total*100:.1f}%)")

if __name__ == "__main__":
    print("病种效益分析API测试工具")
    print("请确保API服务已启动 (http://localhost:5000)")
    print("启动命令: python backend_api_example.py")
    print()
    
    # 检查服务是否启动
    try:
        response = requests.get(f"{BASE_URL}/api/health", timeout=5)
        if response.status_code == 200:
            run_all_tests()
        else:
            print("❌ API服务未正常响应，请检查服务状态")
    except requests.exceptions.ConnectionError:
        print("❌ 无法连接到API服务，请确保服务已启动")
    except Exception as e:
        print(f"❌ 连接测试失败: {e}")