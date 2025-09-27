# 病种效益分析组件 (Disease Benefit Component)

## 概述

病种效益分析组件是一个功能完整的前端组件，用于展示和分析医院各病种的经济效益数据。组件提供了数据可视化、筛选、导出、详情查看等功能。

## 功能特性

- 📊 **数据可视化**: 支持多种图表类型（柱状图、饼图、趋势图等）
- 🔍 **智能筛选**: 支持按科室、病种、时间范围等多维度筛选
- 📋 **数据表格**: 可排序、可分页的数据表格展示
- 📤 **数据导出**: 支持Excel格式数据导出
- 🔍 **详情查看**: 病种详情弹窗和医生画像功能
- 🤖 **AI洞察**: 智能分析和建议功能
- 📱 **响应式设计**: 适配各种屏幕尺寸

## 文件结构

```
disease-benefit/
├── disease-benefit.html    # 组件HTML模板
├── disease-benefit.css     # 组件样式文件
├── disease-benefit.js      # 组件JavaScript逻辑
├── config.js              # 配置管理和事件系统
├── test.html              # 测试页面
└── README.md              # 使用文档
```

## 快速开始

### 1. 引入文件

在HTML页面中引入必要的文件：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>病种效益分析</title>
    
    <!-- 引入ECharts -->
    <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
    
    <!-- 引入组件样式 -->
    <link rel="stylesheet" href="disease-benefit.css">
</head>
<body>
    <!-- 组件容器 -->
    <div id="disease-benefit-container"></div>
    
    <!-- 引入配置文件 -->
    <script src="config.js"></script>
    <!-- 引入组件脚本 -->
    <script src="disease-benefit.js"></script>
</body>
</html>
```

### 2. 初始化组件

```javascript
// 基础初始化
const component = new DiseaseBenefitComponent('disease-benefit-container');

// 使用自定义配置初始化
const customConfig = {
    apiEndpoints: {
        diseaseData: '/api/disease-benefit',
        departmentData: '/api/departments'
    },
    charts: {
        theme: 'dark',
        animation: true
    }
};

const component = new DiseaseBenefitComponent('disease-benefit-container', customConfig);
```

### 3. 加载数据

```javascript
// 加载初始数据
component.loadData();

// 加载指定筛选条件的数据
component.loadData({
    department: '内科',
    dateRange: ['2024-01-01', '2024-12-31'],
    diseaseType: '慢性病'
});
```

## 配置选项

### 基础配置

```javascript
const config = {
    // API端点配置
    apiEndpoints: {
        diseaseData: '/api/disease-benefit',      // 病种数据接口
        departmentData: '/api/departments',       // 科室数据接口
        doctorData: '/api/doctors',              // 医生数据接口
        exportData: '/api/export'                // 数据导出接口
    },
    
    // 图表配置
    charts: {
        theme: 'light',                          // 主题: light/dark
        animation: true,                         // 是否启用动画
        responsive: true,                        // 是否响应式
        colors: ['#1890ff', '#52c41a', '#faad14'] // 自定义颜色
    },
    
    // 表格配置
    table: {
        pageSize: 20,                           // 每页显示条数
        sortable: true,                         // 是否可排序
        exportable: true                        // 是否可导出
    },
    
    // 筛选配置
    filters: {
        showDepartment: true,                   // 显示科室筛选
        showDateRange: true,                    // 显示时间范围筛选
        showDiseaseType: true                   // 显示病种类型筛选
    }
};
```

### 事件监听

```javascript
// 监听数据加载完成事件
component.on('dataLoaded', (data) => {
    console.log('数据加载完成:', data);
});

// 监听筛选变化事件
component.on('filterChanged', (filters) => {
    console.log('筛选条件变化:', filters);
});

// 监听图表点击事件
component.on('chartClicked', (params) => {
    console.log('图表被点击:', params);
});

// 监听导出完成事件
component.on('exportCompleted', (result) => {
    console.log('导出完成:', result);
});
```

## API接口规范

### 病种数据接口

**请求**: `GET /api/disease-benefit`

**参数**:
```javascript
{
    department?: string,     // 科室名称
    dateStart?: string,      // 开始日期 (YYYY-MM-DD)
    dateEnd?: string,        // 结束日期 (YYYY-MM-DD)
    diseaseType?: string,    // 病种类型
    page?: number,           // 页码
    pageSize?: number        // 每页条数
}
```

**响应**:
```javascript
{
    code: 200,
    message: "success",
    data: {
        total: 100,
        list: [
            {
                id: "001",
                diseaseName: "高血压",
                department: "心内科",
                totalRevenue: 150000,
                totalCost: 120000,
                profit: 30000,
                profitRate: 0.2,
                patientCount: 50,
                avgCostPerPatient: 2400,
                avgRevenuePerPatient: 3000
            }
        ],
        summary: {
            totalProfit: 500000,
            totalRevenue: 2000000,
            totalCost: 1500000,
            profitRate: 0.25
        }
    }
}
```

## 方法说明

### 核心方法

```javascript
// 初始化组件
component.init()

// 加载数据
component.loadData(filters?)

// 更新筛选条件
component.updateFilters(filters)

// 刷新图表
component.refreshCharts()

// 导出数据
component.exportData(format = 'excel')

// 显示病种详情
component.showDiseaseDetail(diseaseId)

// 显示医生画像
component.showDoctorProfile(doctorId)

// 销毁组件
component.destroy()
```

### 数据方法

```javascript
// 获取当前数据
const data = component.getData()

// 设置数据
component.setData(newData)

// 获取筛选条件
const filters = component.getFilters()

// 重置筛选条件
component.resetFilters()
```

## 样式定制

### CSS变量

组件使用CSS变量，可以轻松定制主题：

```css
:root {
    --primary-color: #1890ff;
    --success-color: #52c41a;
    --warning-color: #faad14;
    --error-color: #ff4d4f;
    --text-color: #333;
    --border-color: #d9d9d9;
    --background-color: #fff;
}
```

### 自定义样式

```css
/* 自定义组件容器样式 */
.disease-benefit-component {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* 自定义图表样式 */
.chart-container {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

## 示例代码

### 完整示例

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>病种效益分析示例</title>
    <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
    <link rel="stylesheet" href="disease-benefit.css">
</head>
<body>
    <div class="container">
        <h1>病种效益分析</h1>
        <div id="disease-benefit-app"></div>
    </div>

    <script src="config.js"></script>
    <script src="disease-benefit.js"></script>
    <script>
        // 初始化组件
        const config = {
            apiEndpoints: {
                diseaseData: '/api/disease-benefit',
                departmentData: '/api/departments'
            },
            charts: {
                theme: 'light',
                animation: true
            }
        };

        const app = new DiseaseBenefitComponent('disease-benefit-app', config);

        // 监听事件
        app.on('dataLoaded', (data) => {
            console.log('数据加载完成，共', data.total, '条记录');
        });

        app.on('filterChanged', (filters) => {
            console.log('筛选条件已更新:', filters);
        });

        // 加载初始数据
        app.loadData();
    </script>
</body>
</html>
```

## 常见问题

### Q: 如何自定义图表颜色？
A: 在配置中设置 `charts.colors` 数组：
```javascript
const config = {
    charts: {
        colors: ['#1890ff', '#52c41a', '#faad14', '#ff4d4f']
    }
};
```

### Q: 如何禁用某些筛选功能？
A: 在配置中设置对应的筛选选项为 `false`：
```javascript
const config = {
    filters: {
        showDepartment: false,  // 隐藏科室筛选
        showDateRange: true,
        showDiseaseType: true
    }
};
```

### Q: 如何处理大量数据？
A: 组件支持分页加载，建议：
1. 设置合适的 `pageSize`
2. 使用服务端分页
3. 启用虚拟滚动（大数据量时）

### Q: 如何集成到现有系统？
A: 组件设计为独立模块，可以：
1. 直接嵌入现有页面
2. 作为iframe使用
3. 集成到Vue/React等框架中

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- IE 11+ (需要polyfill)

## 更新日志

### v1.0.0 (2024-01-20)
- 初始版本发布
- 支持基础的病种效益分析功能
- 包含数据可视化、筛选、导出等核心功能

## 技术支持

如有问题或建议，请联系开发团队或提交Issue。