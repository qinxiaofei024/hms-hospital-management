/**
 * 组件注册管理器
 * 用于将测试通过的组件注册到组件库中
 */
class ComponentRegistry {
    constructor() {
        this.dataPath = '../data/component-library.json';
        this.init();
    }

    init() {
        this.createRegistrationUI();
        this.bindEvents();
    }

    /**
     * 创建组件注册UI
     */
    createRegistrationUI() {
        // 检查是否已存在注册按钮
        if (document.getElementById('component-registry-btn')) {
            return;
        }

        // 创建注册按钮容器
        const registryContainer = document.createElement('div');
        registryContainer.id = 'component-registry-container';
        registryContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: white;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            border: 2px solid #667eea;
            min-width: 250px;
        `;

        registryContainer.innerHTML = `
            <div style="margin-bottom: 10px; font-weight: 600; color: #333;">
                🧩 组件注册工具
            </div>
            <div style="margin-bottom: 15px; font-size: 0.9em; color: #666;">
                测试通过后可将组件添加到组件库
            </div>
            <button id="component-registry-btn" style="
                width: 100%;
                padding: 10px;
                background: #667eea;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.3s ease;
            ">
                📝 注册当前组件
            </button>
            <div id="registry-status" style="
                margin-top: 10px;
                font-size: 0.8em;
                text-align: center;
                display: none;
            "></div>
        `;

        document.body.appendChild(registryContainer);

        // 添加悬停效果
        const btn = registryContainer.querySelector('#component-registry-btn');
        btn.addEventListener('mouseenter', () => {
            btn.style.background = '#5a6fd8';
            btn.style.transform = 'translateY(-2px)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.background = '#667eea';
            btn.style.transform = 'translateY(0)';
        });
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'component-registry-btn') {
                this.showRegistrationModal();
            }
        });
    }

    /**
     * 显示组件注册模态框
     */
    showRegistrationModal() {
        // 检测当前页面的组件信息
        const componentInfo = this.detectCurrentComponent();
        
        // 创建模态框
        const modal = document.createElement('div');
        modal.id = 'component-registration-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 20000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        modal.innerHTML = `
            <div style="
                background: white;
                padding: 30px;
                border-radius: 15px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; color: #333;">🧩 组件注册</h2>
                    <button id="close-modal" style="
                        background: none;
                        border: none;
                        font-size: 24px;
                        cursor: pointer;
                        color: #999;
                    ">×</button>
                </div>
                
                <form id="component-registration-form">
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">组件名称 *</label>
                        <input type="text" id="component-name" value="${componentInfo.name}" required style="
                            width: 100%;
                            padding: 10px;
                            border: 2px solid #e1e5e9;
                            border-radius: 6px;
                            font-size: 14px;
                        ">
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">组件ID *</label>
                        <input type="text" id="component-id" value="${componentInfo.id}" required style="
                            width: 100%;
                            padding: 10px;
                            border: 2px solid #e1e5e9;
                            border-radius: 6px;
                            font-size: 14px;
                        ">
                        <small style="color: #666;">唯一标识符，建议使用英文和连字符</small>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">版本号 *</label>
                        <input type="text" id="component-version" value="1.0.0" required style="
                            width: 100%;
                            padding: 10px;
                            border: 2px solid #e1e5e9;
                            border-radius: 6px;
                            font-size: 14px;
                        ">
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">组件描述 *</label>
                        <textarea id="component-description" required style="
                            width: 100%;
                            padding: 10px;
                            border: 2px solid #e1e5e9;
                            border-radius: 6px;
                            font-size: 14px;
                            min-height: 80px;
                            resize: vertical;
                        ">${componentInfo.description}</textarea>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">组件分类 *</label>
                        <select id="component-category" required style="
                            width: 100%;
                            padding: 10px;
                            border: 2px solid #e1e5e9;
                            border-radius: 6px;
                            font-size: 14px;
                        ">
                            <option value="">请选择分类</option>
                            <option value="数据分析" selected>数据分析</option>
                            <option value="UI组件">UI组件</option>
                            <option value="表单控件">表单控件</option>
                            <option value="图表组件">图表组件</option>
                        </select>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">标签</label>
                        <input type="text" id="component-tags" value="${componentInfo.tags}" style="
                            width: 100%;
                            padding: 10px;
                            border: 2px solid #e1e5e9;
                            border-radius: 6px;
                            font-size: 14px;
                        ">
                        <small style="color: #666;">多个标签用逗号分隔</small>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">主要功能</label>
                        <textarea id="component-features" style="
                            width: 100%;
                            padding: 10px;
                            border: 2px solid #e1e5e9;
                            border-radius: 6px;
                            font-size: 14px;
                            min-height: 60px;
                            resize: vertical;
                        ">${componentInfo.features}</textarea>
                        <small style="color: #666;">每行一个功能点</small>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">作者</label>
                        <input type="text" id="component-author" value="HMS开发团队" style="
                            width: 100%;
                            padding: 10px;
                            border: 2px solid #e1e5e9;
                            border-radius: 6px;
                            font-size: 14px;
                        ">
                    </div>
                    
                    <div style="display: flex; gap: 10px; justify-content: flex-end;">
                        <button type="button" id="cancel-registration" style="
                            padding: 10px 20px;
                            background: #6c757d;
                            color: white;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                        ">取消</button>
                        <button type="submit" style="
                            padding: 10px 20px;
                            background: #28a745;
                            color: white;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                        ">注册组件</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // 绑定模态框事件
        this.bindModalEvents(modal);
    }

    /**
     * 检测当前页面的组件信息
     */
    detectCurrentComponent() {
        const pageTitle = document.title;
        const currentPath = window.location.pathname;
        const fileName = currentPath.split('/').pop().replace('.html', '');
        
        // 根据页面信息推断组件信息
        let componentInfo = {
            name: '未知组件',
            id: fileName,
            description: '请填写组件描述',
            tags: '',
            features: ''
        };

        // 特殊页面的组件信息检测
        if (currentPath.includes('component-demo')) {
            componentInfo = {
                name: '病种效益分析组件',
                id: 'disease-benefit-analysis',
                description: '用于分析医院各病种的经济效益，包含收入、成本、利润等关键指标的可视化展示',
                tags: '病种分析,效益分析,图表,数据可视化',
                features: '病种数据可视化\n多维度筛选\n实时数据更新\n数据导出功能\nAI智能分析\n响应式设计\n主题自定义'
            };
        }

        return componentInfo;
    }

    /**
     * 绑定模态框事件
     */
    bindModalEvents(modal) {
        // 关闭模态框
        const closeModal = () => {
            document.body.removeChild(modal);
        };

        modal.querySelector('#close-modal').addEventListener('click', closeModal);
        modal.querySelector('#cancel-registration').addEventListener('click', closeModal);
        
        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // 表单提交
        modal.querySelector('#component-registration-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.registerComponent(modal);
        });
    }

    /**
     * 注册组件
     */
    async registerComponent(modal) {
        const formData = new FormData(modal.querySelector('#component-registration-form'));
        
        // 收集表单数据
        const componentData = {
            id: modal.querySelector('#component-id').value,
            name: modal.querySelector('#component-name').value,
            version: modal.querySelector('#component-version').value,
            description: modal.querySelector('#component-description').value,
            category: modal.querySelector('#component-category').value,
            tags: modal.querySelector('#component-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
            author: modal.querySelector('#component-author').value,
            features: modal.querySelector('#component-features').value.split('\n').map(feature => feature.trim()).filter(feature => feature),
            createDate: new Date().toISOString(),
            updateDate: new Date().toISOString(),
            status: 'stable'
        };

        try {
            // 显示加载状态
            this.showLoadingState(modal);

            // 模拟注册过程（实际项目中这里会调用后端API）
            await this.simulateRegistration(componentData);

            // 显示成功消息
            this.showSuccessMessage(modal, componentData);

        } catch (error) {
            console.error('组件注册失败:', error);
            this.showErrorMessage(modal, error.message);
        }
    }

    /**
     * 模拟组件注册过程
     */
    async simulateRegistration(componentData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 模拟成功注册
                console.log('组件注册成功:', componentData);
                
                // 在实际项目中，这里会：
                // 1. 调用后端API保存组件信息
                // 2. 更新component-library.json文件
                // 3. 可能还会上传组件文件到指定目录
                
                resolve(componentData);
            }, 2000);
        });
    }

    /**
     * 显示加载状态
     */
    showLoadingState(modal) {
        const form = modal.querySelector('#component-registration-form');
        form.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <div style="
                    display: inline-block;
                    width: 40px;
                    height: 40px;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #667eea;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 20px;
                "></div>
                <p style="color: #666; margin: 0;">正在注册组件...</p>
            </div>
        `;

        // 添加旋转动画
        if (!document.getElementById('spin-animation')) {
            const style = document.createElement('style');
            style.id = 'spin-animation';
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * 显示成功消息
     */
    showSuccessMessage(modal, componentData) {
        const form = modal.querySelector('#component-registration-form');
        form.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <div style="font-size: 4em; margin-bottom: 20px;">✅</div>
                <h3 style="color: #28a745; margin-bottom: 15px;">组件注册成功！</h3>
                <p style="color: #666; margin-bottom: 20px;">
                    组件 "${componentData.name}" 已成功添加到组件库中
                </p>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button onclick="window.open('../pages/component-library.html', '_blank')" style="
                        padding: 10px 20px;
                        background: #667eea;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                    ">查看组件库</button>
                    <button onclick="document.body.removeChild(document.getElementById('component-registration-modal'))" style="
                        padding: 10px 20px;
                        background: #6c757d;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                    ">关闭</button>
                </div>
            </div>
        `;
    }

    /**
     * 显示错误消息
     */
    showErrorMessage(modal, errorMessage) {
        const form = modal.querySelector('#component-registration-form');
        form.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <div style="font-size: 4em; margin-bottom: 20px;">❌</div>
                <h3 style="color: #dc3545; margin-bottom: 15px;">注册失败</h3>
                <p style="color: #666; margin-bottom: 20px;">
                    ${errorMessage}
                </p>
                <button onclick="location.reload()" style="
                    padding: 10px 20px;
                    background: #dc3545;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                ">重试</button>
            </div>
        `;
    }

    /**
     * 显示通知消息
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 25px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 30000;
            animation: slideDown 0.3s ease;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#667eea'};
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // 3秒后自动移除
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// 自动初始化组件注册器（仅在测试页面）
document.addEventListener('DOMContentLoaded', () => {
    // 检查是否是组件测试页面
    const currentPath = window.location.pathname;
    if (currentPath.includes('component-demo') || 
        currentPath.includes('test') || 
        document.querySelector('[data-component-test]')) {
        
        console.log('检测到组件测试页面，初始化组件注册器');
        window.componentRegistry = new ComponentRegistry();
    }
});

// 添加必要的CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from { transform: translate(-50%, -100%); opacity: 0; }
        to { transform: translate(-50%, 0); opacity: 1; }
    }
    @keyframes slideUp {
        from { transform: translate(-50%, 0); opacity: 1; }
        to { transform: translate(-50%, -100%); opacity: 0; }
    }
`;
document.head.appendChild(style);