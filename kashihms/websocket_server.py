#!/usr/bin/env python3
"""
医院监控数据WebSocket推送服务器
实时推送医院监控数据到前端大屏
"""

import asyncio
import json
import logging
import random
import websockets
from datetime import datetime, timedelta

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class HospitalDataServer:
    def __init__(self):
        self.clients = set()
        self.running = False
        
        # 基础数据
        self.base_data = {
            'patients_total': 1247,
            'bed_occupancy': 78.5,
            'surgeries_today': 23,
            'revenue_today': 156.8,
            'emergency_waiting': 12,
            'icu_occupancy': 85.2,
            'outpatient_today': 892,
            'inpatient_today': 156
        }
        
        # 科室数据
        self.departments = [
            {'name': '内科', 'patients': 156, 'revenue': 89.3},
            {'name': '外科', 'patients': 234, 'revenue': 145.6},
            {'name': '儿科', 'patients': 234, 'revenue': 67.2},
            {'name': '妇产科', 'patients': 87, 'revenue': 123.4},
            {'name': '急诊科', 'patients': 189, 'revenue': 78.9},
            {'name': 'ICU', 'patients': 45, 'revenue': 234.6}
        ]
        
        # 实时预警信息
        self.alerts = [
            {'level': 'critical', 'message': 'ICU床位紧张，使用率达到95%', 'time': ''},
            {'level': 'warning', 'message': '手术室3设备维护中', 'time': ''},
            {'level': 'info', 'message': '急诊科等候人数较多', 'time': ''},
            {'level': 'warning', 'message': '药房库存不足提醒', 'time': ''},
            {'level': 'info', 'message': '今日门诊量超过预期', 'time': ''}
        ]

    async def handle_client(self, websocket):
        """处理客户端连接"""
        self.clients.add(websocket)
        logger.info(f"新客户端连接: {websocket.remote_address}")
        
        # 发送初始数据
        await self.send_initial_data(websocket)
        
        try:
            # 保持连接并处理消息
            async for message in websocket:
                # 这里可以处理客户端发送的消息
                logger.info(f"收到消息: {message}")
        except websockets.exceptions.ConnectionClosed:
            logger.info(f"客户端断开连接: {websocket.remote_address}")
        finally:
            self.clients.discard(websocket)

    async def send_initial_data(self, websocket):
        """发送初始数据"""
        # 更新预警时间
        for alert in self.alerts:
            alert['time'] = datetime.now().strftime('%H:%M:%S')
        
        initial_data = {
            'type': 'initial',
            'timestamp': datetime.now().isoformat(),
            'data': {
                'metrics': self.base_data.copy(),
                'departments': self.departments.copy(),
                'alerts': self.alerts.copy()
            }
        }
        
        try:
            await websocket.send(json.dumps(initial_data, ensure_ascii=False))
            logger.info("已发送初始数据")
        except Exception as e:
            logger.error(f"发送初始数据失败: {e}")

    async def broadcast_data(self, data):
        """广播数据到所有客户端"""
        if not self.clients:
            return
        
        message = json.dumps(data, ensure_ascii=False)
        disconnected = set()
        
        for client in self.clients:
            try:
                await client.send(message)
            except websockets.exceptions.ConnectionClosed:
                disconnected.add(client)
            except Exception as e:
                logger.error(f"发送数据失败: {e}")
                disconnected.add(client)
        
        # 移除断开的连接
        self.clients -= disconnected

    def generate_metrics_update(self):
        """生成指标更新数据"""
        updates = {}
        
        # 随机选择几个指标进行更新
        metrics_to_update = random.sample(list(self.base_data.keys()), random.randint(2, 4))
        
        for metric in metrics_to_update:
            current_value = self.base_data[metric]
            
            # 生成变化值
            if metric in ['patients_total', 'surgeries_today', 'emergency_waiting', 'outpatient_today', 'inpatient_today']:
                change = random.randint(-5, 8)
                new_value = max(0, current_value + change)
            else:  # 百分比类型
                change = random.uniform(-2.5, 3.0)
                new_value = max(0, min(100, current_value + change))
            
            # 确定趋势
            if change > 0:
                trend = 'up'
            elif change < 0:
                trend = 'down'
            else:
                trend = 'stable'
            
            self.base_data[metric] = new_value
            updates[metric] = {
                'value': new_value,
                'change': change,
                'trend': trend
            }
        
        return updates

    def generate_patient_sources_update(self):
        """生成患者来源数据更新"""
        patient_sources = {
            '广州市': random.randint(140, 180),
            '深圳市': random.randint(80, 110),
            '佛山市': random.randint(220, 260),
            '东莞市': random.randint(60, 80),
            '中山市': random.randint(40, 60),
            '珠海市': random.randint(25, 40),
            '江门市': random.randint(20, 35),
            '惠州市': random.randint(35, 50)
        }
        return patient_sources

    def generate_flow_data_update(self):
        """生成流程数据更新"""
        outpatient_flow = {
            'registration': random.randint(120, 160),
            'consultation': random.randint(100, 140),
            'examination': random.randint(80, 120),
            'pharmacy': random.randint(90, 130),
            'discharge': random.randint(85, 125)
        }
        
        inpatient_flow = {
            'admission': random.randint(40, 60),
            'ward_transfer': random.randint(15, 25),
            'surgery': random.randint(20, 35),
            'icu_transfer': random.randint(5, 15),
            'discharge': random.randint(35, 55)
        }
        
        return {
            'outpatient_flow': outpatient_flow,
            'inpatient_flow': inpatient_flow
        }

    def generate_departments_update(self):
        """生成科室数据更新"""
        updates = []
        
        # 随机选择几个科室进行更新
        departments_to_update = random.sample(self.departments, random.randint(1, 3))
        
        for dept in departments_to_update:
            # 更新患者数量
            patient_change = random.randint(-3, 5)
            dept['patients'] = max(0, dept['patients'] + patient_change)
            
            # 更新收入
            revenue_change = random.uniform(-5.0, 8.0)
            dept['revenue'] = max(0, dept['revenue'] + revenue_change)
            
            updates.append({
                'name': dept['name'],
                'patients': dept['patients'],
                'revenue': round(dept['revenue'], 1)
            })
        
        return updates

    async def data_generator(self):
        """数据生成器 - 定期生成和推送数据"""
        while self.running:
            try:
                await asyncio.sleep(random.uniform(2, 5))  # 随机间隔2-5秒
                
                if not self.clients:
                    continue
                
                # 生成指标更新
                if random.random() < 0.8:  # 80%概率更新指标
                    metrics_updates = self.generate_metrics_update()
                    if metrics_updates:
                        await self.broadcast_data({
                            'type': 'metrics_update',
                            'timestamp': datetime.now().isoformat(),
                            'data': metrics_updates
                        })
                
                # 生成科室更新
                if random.random() < 0.6:  # 60%概率更新科室
                    dept_updates = self.generate_departments_update()
                    if dept_updates:
                        await self.broadcast_data({
                            'type': 'departments_update',
                            'timestamp': datetime.now().isoformat(),
                            'data': dept_updates
                        })
                
                # 生成患者来源更新
                if random.random() < 0.5:  # 50%概率更新患者来源
                    patient_sources = self.generate_patient_sources_update()
                    await self.broadcast_data({
                        'type': 'patient_sources_update',
                        'timestamp': datetime.now().isoformat(),
                        'data': patient_sources
                    })
                
                # 生成流程数据更新
                if random.random() < 0.4:  # 40%概率更新流程数据
                    flow_data = self.generate_flow_data_update()
                    await self.broadcast_data({
                        'type': 'flow_data_update',
                        'timestamp': datetime.now().isoformat(),
                        'data': flow_data
                    })
                
                # 生成新预警
                if random.random() < 0.3:  # 30%概率生成新预警
                    alert_messages = [
                        '手术室设备检修完成',
                        '新增急诊患者',
                        '药品配送到达',
                        '床位调配完成',
                        '设备维护提醒',
                        '人员排班更新',
                        f'来自{random.choice(["广州", "深圳", "佛山", "东莞"])}的患者完成入院',
                        f'门诊{random.choice(["内科", "外科", "儿科", "妇科"])}新增患者',
                        f'住院部{random.choice(["内科病房", "外科病房", "ICU"])}床位调整'
                    ]
                    
                    new_alert = {
                        'level': random.choice(['info', 'warning', 'critical']),
                        'message': random.choice(alert_messages),
                        'time': datetime.now().strftime('%H:%M:%S')
                    }
                    
                    await self.broadcast_data({
                        'type': 'new_alert',
                        'timestamp': datetime.now().isoformat(),
                        'data': new_alert
                    })
                
            except Exception as e:
                logger.error(f"数据生成错误: {e}")

    async def start_server(self, host="localhost", port=8765):
        """启动WebSocket服务器"""
        self.running = True
        
        # 启动数据生成器
        asyncio.create_task(self.data_generator())
        
        logger.info(f"启动WebSocket服务器: ws://{host}:{port}")
        
        async with websockets.serve(self.handle_client, host, port):
            await asyncio.Future()  # 保持服务器运行

    def stop_server(self):
        """停止服务器"""
        self.running = False

if __name__ == "__main__":
    server = HospitalDataServer()
    try:
        asyncio.run(server.start_server())
    except KeyboardInterrupt:
        logger.info("服务器停止")
        server.stop_server()