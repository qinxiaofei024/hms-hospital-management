#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
病种效益分析API后端实现示例
支持 /api/disease-benefit 接口
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from datetime import datetime, date
import json
from decimal import Decimal

app = Flask(__name__)
CORS(app)  # 允许跨域请求

# 数据库配置
DB_CONFIG = {
    'host': 'localhost',
    'user': 'your_username',
    'password': 'your_password',
    'database': 'hospital_db',
    'charset': 'utf8mb4'
}

class DecimalEncoder(json.JSONEncoder):
    """处理Decimal类型的JSON序列化"""
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        if isinstance(obj, date):
            return obj.isoformat()
        return super(DecimalEncoder, self).default(obj)

def get_db_connection():
    """获取数据库连接"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except mysql.connector.Error as err:
        print(f"数据库连接错误: {err}")
        return None

@app.route('/api/disease-benefit', methods=['GET'])
def get_disease_benefit():
    """获取病种效益数据"""
    try:
        # 获取查询参数
        department = request.args.get('department', '')
        date_start = request.args.get('dateStart', '')
        date_end = request.args.get('dateEnd', '')
        page = int(request.args.get('page', 1))
        page_size = int(request.args.get('pageSize', 20))
        
        # 构建SQL查询
        sql = """
        SELECT 
            id,
            disease_code,
            disease_name,
            department,
            revenue,
            cost,
            profit,
            cases,
            avg_revenue,
            avg_cost,
            avg_profit,
            profit_rate,
            breakeven_cases,
            avg_stay,
            record_date,
            doctor_id
        FROM disease_benefit 
        WHERE 1=1
        """
        
        params = []
        
        # 添加筛选条件
        if department:
            sql += " AND department = %s"
            params.append(department)
            
        if date_start:
            sql += " AND record_date >= %s"
            params.append(date_start)
            
        if date_end:
            sql += " AND record_date <= %s"
            params.append(date_end)
        
        # 添加排序和分页
        sql += " ORDER BY record_date DESC, profit_rate DESC"
        sql += " LIMIT %s OFFSET %s"
        params.extend([page_size, (page - 1) * page_size])
        
        # 执行查询
        connection = get_db_connection()
        if not connection:
            return jsonify({
                'success': False,
                'code': 500,
                'message': '数据库连接失败'
            }), 500
            
        cursor = connection.cursor(dictionary=True)
        cursor.execute(sql, params)
        diseases = cursor.fetchall()
        
        # 获取总数
        count_sql = """
        SELECT COUNT(*) as total 
        FROM disease_benefit 
        WHERE 1=1
        """
        count_params = []
        
        if department:
            count_sql += " AND department = %s"
            count_params.append(department)
            
        if date_start:
            count_sql += " AND record_date >= %s"
            count_params.append(date_start)
            
        if date_end:
            count_sql += " AND record_date <= %s"
            count_params.append(date_end)
        
        cursor.execute(count_sql, count_params)
        total = cursor.fetchone()['total']
        
        cursor.close()
        connection.close()
        
        # 返回结果
        response = {
            'success': True,
            'code': 200,
            'message': '获取成功',
            'data': {
                'diseases': diseases,
                'pagination': {
                    'total': total,
                    'page': page,
                    'pageSize': page_size,
                    'totalPages': (total + page_size - 1) // page_size
                }
            },
            'timestamp': datetime.now().isoformat()
        }
        
        return app.response_class(
            response=json.dumps(response, cls=DecimalEncoder, ensure_ascii=False),
            status=200,
            mimetype='application/json'
        )
        
    except Exception as e:
        return jsonify({
            'success': False,
            'code': 500,
            'message': f'服务器错误: {str(e)}'
        }), 500

@app.route('/api/disease-benefit/<int:disease_id>', methods=['GET'])
def get_disease_detail(disease_id):
    """获取单个病种详情"""
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({
                'success': False,
                'code': 500,
                'message': '数据库连接失败'
            }), 500
            
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT * FROM disease_benefit WHERE id = %s
        """, (disease_id,))
        
        disease = cursor.fetchone()
        cursor.close()
        connection.close()
        
        if not disease:
            return jsonify({
                'success': False,
                'code': 404,
                'message': '病种数据不存在'
            }), 404
            
        return app.response_class(
            response=json.dumps({
                'success': True,
                'code': 200,
                'message': '获取成功',
                'data': disease
            }, cls=DecimalEncoder, ensure_ascii=False),
            status=200,
            mimetype='application/json'
        )
        
    except Exception as e:
        return jsonify({
            'success': False,
            'code': 500,
            'message': f'服务器错误: {str(e)}'
        }), 500

@app.route('/api/disease-benefit/stats', methods=['GET'])
def get_disease_stats():
    """获取病种效益统计数据"""
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({
                'success': False,
                'code': 500,
                'message': '数据库连接失败'
            }), 500
            
        cursor = connection.cursor(dictionary=True)
        
        # 获取统计数据
        cursor.execute("""
            SELECT 
                COUNT(*) as total_diseases,
                SUM(cases) as total_cases,
                SUM(revenue) as total_revenue,
                SUM(cost) as total_cost,
                SUM(profit) as total_profit,
                AVG(profit_rate) as avg_profit_rate,
                COUNT(DISTINCT department) as total_departments
            FROM disease_benefit
        """)
        
        stats = cursor.fetchone()
        cursor.close()
        connection.close()
        
        return app.response_class(
            response=json.dumps({
                'success': True,
                'code': 200,
                'message': '获取成功',
                'data': stats
            }, cls=DecimalEncoder, ensure_ascii=False),
            status=200,
            mimetype='application/json'
        )
        
    except Exception as e:
        return jsonify({
            'success': False,
            'code': 500,
            'message': f'服务器错误: {str(e)}'
        }), 500

@app.route('/api/disease-benefit/export', methods=['POST'])
def export_disease_benefit():
    """导出病种效益数据"""
    try:
        # 获取导出参数
        data = request.get_json()
        export_format = data.get('format', 'excel')  # excel, csv, pdf
        filters = data.get('filters', {})
        
        # 这里可以实现具体的导出逻辑
        # 返回下载链接或直接返回文件
        
        return jsonify({
            'success': True,
            'code': 200,
            'message': '导出成功',
            'data': {
                'downloadUrl': f'/downloads/disease_benefit_{datetime.now().strftime("%Y%m%d_%H%M%S")}.{export_format}',
                'fileName': f'病种效益分析_{datetime.now().strftime("%Y%m%d")}.{export_format}'
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'code': 500,
            'message': f'导出失败: {str(e)}'
        }), 500

if __name__ == '__main__':
    print("🚀 病种效益分析API服务启动中...")
    print("📡 API地址: http://localhost:5000/api/disease-benefit")
    print("📖 API文档: http://localhost:5000/api/docs")
    app.run(debug=True, host='0.0.0.0', port=5000)