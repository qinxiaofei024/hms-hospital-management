// 侧边栏菜单管理
if (typeof SidebarManager === 'undefined') {
    class SidebarManager {
        constructor() {
            this.isCollapsed = false;
            // 构造函数不再自动调用init()，避免重复初始化
        }

        init() {
            // 初始化菜单事件
            this.initMenuEvents();
            // 设置当前活动菜单项
            this.setActiveMenuItem();
            // 添加侧边栏切换按钮
            this.addToggleSidebarButton();
        }

        // 获取根路径
        getRootPath() {
            const currentPath = window.location.pathname;
            // 如果当前页面在pages目录下，需要返回上一级目录
            if (currentPath.includes('/pages/')) {
                return '../';
            }
            // 如果当前页面在根目录，直接使用空字符串
            return '';
        }

        // 添加侧边栏切换按钮
        addToggleSidebarButton() {
            // 检查是否已经存在切换按钮
            if (document.querySelector('.sidebar-toggle')) {
                return;
            }

            // 创建切换按钮
            const toggleButton = document.createElement('button');
            toggleButton.className = 'sidebar-toggle toggle-sidebar-btn';
            toggleButton.innerHTML = '◀';
            toggleButton.style.position = 'fixed';
            toggleButton.style.left = 'var(--sidebar-width)';
            toggleButton.style.top = 'var(--header-height)';
            toggleButton.style.zIndex = '1001';
            toggleButton.style.width = '24px';
            toggleButton.style.height = 'var(--header-height)';
            toggleButton.style.border = 'none';
            toggleButton.style.borderRadius = '0 6px 6px 0';
            toggleButton.style.backgroundColor = '#0066cc';
            toggleButton.style.color = 'white';
            toggleButton.style.cursor = 'pointer';
            toggleButton.style.fontSize = '14px';
            toggleButton.style.display = 'flex';
            toggleButton.style.alignItems = 'center';
            toggleButton.style.justifyContent = 'center';
            toggleButton.style.boxShadow = '2px 0 8px rgba(0, 0, 0, 0.15)';
            toggleButton.style.transition = 'all 0.3s ease';

            // 添加悬停效果
            toggleButton.addEventListener('mouseenter', () => {
                toggleButton.style.backgroundColor = '#0052a3';
                toggleButton.style.transform = 'scaleX(1.1)';
            });
            
            toggleButton.addEventListener('mouseleave', () => {
                toggleButton.style.backgroundColor = '#0066cc';
                toggleButton.style.transform = 'scaleX(1)';
            });

            // 添加点击事件
            toggleButton.addEventListener('click', () => {
                this.toggleSidebar();
            });

            // 添加到页面
            document.body.appendChild(toggleButton);
        }

        // 切换侧边栏显示/隐藏
        toggleSidebar() {
            const sidebar = document.querySelector('.sidebar');
            const mainContent = document.querySelector('.main-content');
            const toggleButton = document.querySelector('.sidebar-toggle');
            const content = document.querySelector('.content');

            if (!sidebar || !mainContent || !toggleButton) {
                return;
            }

            this.isCollapsed = !this.isCollapsed;

            if (this.isCollapsed) {
                // 收起侧边栏
                document.documentElement.style.setProperty('--sidebar-width', '0px');
                document.body.classList.add('sidebar-collapsed');
                sidebar.style.overflow = 'hidden';
                mainContent.classList.add('sidebar-collapsed');
                toggleButton.style.left = '0';
                toggleButton.innerHTML = '▶';
                if (content) { content.style.flex = '1'; }
            } else {
                // 展开侧边栏
                document.documentElement.style.setProperty('--sidebar-width', '240px');
                document.body.classList.remove('sidebar-collapsed');
                sidebar.style.overflow = 'auto';
                mainContent.classList.remove('sidebar-collapsed');
                toggleButton.style.left = 'var(--sidebar-width)';
                toggleButton.innerHTML = '◀';
                if (content) { content.style.flex = '1'; }
            }
        }

        // 初始化菜单事件
        initMenuEvents() {
            // 获取所有菜单项
            const menuItems = document.querySelectorAll('.menu-item');

            // 为每个菜单项添加点击事件
            menuItems.forEach(item => {
                // 找到主菜单链接
                const mainLink = item.querySelector('a:not(.sub-menu a)');
                const subMenu = item.querySelector('.sub-menu');

                if (mainLink) {
                    mainLink.addEventListener('click', (e) => {
                        // 如果是首页链接，特殊处理
                        if (mainLink.classList.contains('home-link')) {
                            e.preventDefault();
                            // 跳转到根目录的首页
                            const rootPath = this.getRootPath();
                            const targetUrl = rootPath + 'index.html';
                            console.log('Home link clicked, navigating to:', targetUrl);
                            window.location.href = targetUrl;
                            return;
                        }
                        
                        // 如果有子菜单且是锚点链接（以#开头）
                        if (subMenu && mainLink.getAttribute('href').startsWith('#')) {
                            e.preventDefault();
                            // 切换子菜单显示状态
                            this.toggleSubMenu(item, e);
                        }
                        // 如果是普通链接（页面跳转）且没有子菜单
                        else if (!subMenu) {
                            // 允许默认跳转行为
                            return true;
                        }
                        // 如果是普通链接但有子菜单
                        else if (subMenu && !mainLink.getAttribute('href').startsWith('#')) {
                            // 允许默认跳转行为，同时展开子菜单
                            this.toggleSubMenu(item, e);
                        }
                    });
                }

                // 为子菜单链接添加点击事件
                const subMenuLinks = item.querySelectorAll('.sub-menu a');
                subMenuLinks.forEach(link => {
                    link.addEventListener('click', (e) => {
                        // 允许默认跳转行为
                        return true;
                    });
                });
            });
        }

        // 切换子菜单显示状态
        toggleSubMenu(menuItem, e) {
            if (menuItem) {
                const isActive = menuItem.classList.contains('active');
                
                // 切换活动状态
                menuItem.classList.toggle('active');
                
                // 如果菜单正在被激活（展开）
                if (!isActive) {
                    // 计算子菜单高度并设置
                    const subMenu = menuItem.querySelector('.sub-menu');
                    if (subMenu) {
                        // 先设置一个临时高度以获取实际高度
                        subMenu.style.maxHeight = 'none';
                        const height = subMenu.scrollHeight;
                        // 设置实际高度
                        subMenu.style.maxHeight = `${height}px`;
                    }
                }
                
                // 阻止事件冒泡，防止影响页面滚动
                if (e && typeof e.stopPropagation === 'function') {
                    e.stopPropagation();
                }
            }
        }

        // 设置当前活动菜单项
        setActiveMenuItem() {
            const currentPath = window.location.pathname;
            const menuLinks = document.querySelectorAll('.sidebar a');

            menuLinks.forEach(link => {
                const linkPath = new URL(link.href).pathname;
                // 检查当前路径是否包含链接路径
                if (currentPath.includes(linkPath) && linkPath !== '/') {
                    // 添加父菜单项激活状态
                    const menuItem = link.closest('.menu-item');
                    if (menuItem) {
                        menuItem.classList.add('active');
                    }
                    // 添加当前链接激活状态
                    link.classList.add('active');
                }
            });
        }

        // 折叠所有菜单
        collapseAllMenus() {
            const menuItems = document.querySelectorAll('.menu-item');
            menuItems.forEach(item => {
                item.classList.remove('active');
            });
        }

        // 展开所有菜单
        expandAllMenus() {
            const menuItems = document.querySelectorAll('.menu-item');
            menuItems.forEach(item => {
                const subMenu = item.querySelector('.sub-menu');
                if (subMenu) {
                    item.classList.add('active');
                }
            });
        }
    }

    // 将类暴露到全局作用域
    window.SidebarManager = SidebarManager;
}

// 退出登录函数
function logout() {
    if (confirm('确定要退出登录吗？')) {
        // 这里可以添加退出登录的逻辑
        alert('已退出登录');
        // 可以重定向到登录页面
        // window.location.href = 'login.html';
    }
}

// 侧边栏管理器现在由导航加载器控制初始化
// 不再自动创建实例，避免重复初始化