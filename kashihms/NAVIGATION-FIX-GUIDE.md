# 导航栏统一修复指南

## 问题描述
所有页面存在导航栏不一致的问题：
- index.html 使用动态加载导航栏（通过fetch加载components/nav.html）
- 其他所有页面使用硬编码的导航栏
- 导致导航栏样式、功能、菜单项不一致
- index.html 中导航栏无法显示

## 需要修复的页面列表

以下页面需要统一修复（共28个页面）：

1. data-asset.html ✅ (已修复)
2. data-integration.html
3. economic-operation.html
4. economic-benefit.html
5. performance-management.html
6. realtime-monitoring.html
7. operation-command.html
8. operation-report.html
9. medical-service.html
10. department-analysis.html
11. medical-imaging.html
12. anesthesia-icu.html
13. ultrasound.html
14. nuclear-medicine.html
15. medical-laboratory.html
16. endoscopy.html
17. pathology.html
18. department-cockpit.html
19. department-cost.html
20. department-disease.html
21. department-report.html
22. department-resource.html
23. department-revenue.html
24. department-service.html
25. key-indicators.html
26. mobile-operation.html
27. ai-assistant.html
28. chart-diagnostics.html

## 修复步骤

### 1. 移除硬编码导航栏

在每个页面的 `<body>` 标签后，移除以下硬编码内容：

```html
<!-- 移除顶部导航栏 -->
<header class="header">
    <div class="logo">
        <img src="../images/logo.svg" alt="医院logo">
        <h1>佛山市南海区中医院数据中心管理平台</h1>
    </div>
    <div class="user-info">
        <span>管理员</span>
        <button>退出</button>
    </div>
</header>

<!-- 移除左侧菜单 -->
<aside class="sidebar">
    <nav>
        <ul>
            <!-- 菜单内容 -->
        </ul>
    </nav>
</aside>
```

### 2. 添加统一导航容器

在 `<body>` 标签后添加：

```html
<!-- 统一导航组件 -->
<div id="navigation-container"></div>
```

### 3. 添加导航加载脚本

在 `</body>` 标签前添加：

```html
<!-- 加载统一导航组件 -->
<script src="../js/navigation-loader.js"></script>
```

### 4. 调整页面布局

确保主内容区域有正确的边距：

```html
<div class="main-content" style="margin-left: 0;">
    <div class="content-wrapper" style="margin-left: 240px;">
        <!-- 页面内容 -->
    </div>
</div>
```

## 批量修复脚本

已创建 `js/fix-navigation.js` 脚本，但由于浏览器安全限制，需要手动执行修复。

## 验证修复

修复后请检查：
1. 导航栏是否正常显示
2. 菜单点击功能是否正常
3. 当前页面菜单项是否高亮
4. 页面布局是否正确
5. 没有JavaScript错误

## 注意事项

1. **路径问题**：确保所有资源路径正确（../js/, ../css/, ../images/）
2. **加载顺序**：navigation-loader.js 应该在页面其他脚本之前加载
3. **兼容性**：确保所有浏览器支持 fetch API
4. **错误处理**：如果导航加载失败，会显示错误提示

## 紧急修复

如果导航加载失败，可以临时使用以下代码：

```html
<script>
// 紧急导航加载
fetch('../components/nav.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('navigation-container').innerHTML = html;
        
        // 加载侧边栏脚本
        const script = document.createElement('script');
        script.src = '../js/sidebar.js';
        script.onload = function() {
            new SidebarManager().init();
        };
        document.body.appendChild(script);
    })
    .catch(error => console.error('导航加载失败:', error));
</script>
```

## 技术支持

如有问题，请检查：
1. 浏览器控制台错误信息
2. 网络请求状态
3. 文件路径是否正确
4. 组件文件是否存在

完成修复后，所有页面将使用统一的导航栏，确保用户体验一致。