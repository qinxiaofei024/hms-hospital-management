// AI运营助理页面的交互功能
const AIAssistantPage = {
    // 初始化页面
    init: function() {
        // 初始化标签页切换
        this.initTabs();
        
        // 初始化智能查询功能
        this.initIntelligentQuery();
        
        // 初始化制度问答功能
        this.initSystemQA();
        
        // 初始化快速操作按钮
        this.initQuickActions();
        
        // 初始化文档点击事件
        this.initDocumentClick();
        
        // 初始化对话历史存储
        this.conversationHistories = {
            'intelligent-query': [],
            'system-qa': []
        };
        
        // 初始化丰富的模拟数据
        this.initializeMockData();
    },
    
    // 初始化标签页切换
    initTabs: function() {
        const tabs = document.querySelectorAll('.tab-item');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // 移除所有标签的激活状态
                tabs.forEach(t => t.classList.remove('active'));
                
                // 添加当前标签的激活状态
                tab.classList.add('active');
                
                // 隐藏所有内容
                const contents = document.querySelectorAll('.tab-content');
                contents.forEach(content => content.classList.remove('active'));
                
                // 显示对应内容
                const target = tab.getAttribute('data-tab');
                document.getElementById(target).classList.add('active');
            });
        });
    },
    
    // 初始化智能查询功能
    initIntelligentQuery: function() {
        const queryInput = document.getElementById('query-input');
        const sendBtn = document.getElementById('send-btn');
        const chatMessages = document.querySelector('#intelligent-query .chat-messages');
        
        // 发送按钮点击事件
        sendBtn.addEventListener('click', () => {
            this.sendMessage('intelligent-query');
        });
        
        // 回车键发送消息
        queryInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage('intelligent-query');
            }
        });
        
        // 监听输入变化，启用/禁用发送按钮
        queryInput.addEventListener('input', () => {
            sendBtn.disabled = queryInput.value.trim() === '';
        });
    },
    
    // 初始化制度问答功能
    initSystemQA: function() {
        const qaInput = document.getElementById('qa-input');
        const qaSendBtn = document.getElementById('qa-send-btn');
        
        // 发送按钮点击事件
        qaSendBtn.addEventListener('click', () => {
            this.sendMessage('system-qa');
        });
        
        // 回车键发送消息
        qaInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage('system-qa');
            }
        });
        
        // 监听输入变化，启用/禁用发送按钮
        qaInput.addEventListener('input', () => {
            qaSendBtn.disabled = qaInput.value.trim() === '';
        });
    },
    
    // 初始化快速操作按钮
    initQuickActions: function() {
        const quickActionBtns = document.querySelectorAll('.quick-action-btn');
        quickActionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const query = btn.getAttribute('data-query');
                const tabId = btn.closest('.tab-content').id;
                
                if (tabId === 'intelligent-query') {
                    document.getElementById('query-input').value = query;
                    document.getElementById('send-btn').disabled = false;
                } else if (tabId === 'system-qa') {
                    document.getElementById('qa-input').value = query;
                    document.getElementById('qa-send-btn').disabled = false;
                    // 直接发送，提供即时模拟反馈
                    this.sendMessage('system-qa');
                }
            });
        });
    },
    
    // 初始化文档点击事件
    initDocumentClick: function() {
        const documentItems = document.querySelectorAll('.document-item');
        documentItems.forEach(item => {
            item.addEventListener('click', () => {
                const documentName = item.getAttribute('data-document');
                const qaInput = document.getElementById('qa-input');
                const qaSendBtn = document.getElementById('qa-send-btn');
                
                qaInput.value = `请介绍一下《${documentName}》的主要内容`;
                qaSendBtn.disabled = false;
                // 直接发送，避免“点击没反应”的体验
                this.sendMessage('system-qa');
            });
        });
    },
    
    // 发送消息
    sendMessage: function(type) {
        let inputElement, chatMessages, queryHistory;
        
        if (type === 'intelligent-query') {
            inputElement = document.getElementById('query-input');
            chatMessages = document.querySelector('#intelligent-query .chat-messages');
            queryHistory = document.querySelector('#intelligent-query .query-history');
        } else if (type === 'system-qa') {
            inputElement = document.getElementById('qa-input');
            chatMessages = document.querySelector('#system-qa .chat-messages');
        }
        
        const messageText = inputElement.value.trim();
        if (messageText === '') return;
        
        // 添加用户消息
        this.addMessage(chatMessages, 'user', messageText);
        
        // 如果是智能查询，添加到历史记录
        if (type === 'intelligent-query') {
            this.addToHistory(queryHistory, messageText);
        }
        
        // 清空输入框
        inputElement.value = '';
        
        // 禁用发送按钮
        if (type === 'intelligent-query') {
            document.getElementById('send-btn').disabled = true;
        } else if (type === 'system-qa') {
            document.getElementById('qa-send-btn').disabled = true;
        }
        
        // 滚动到底部
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // 保存用户消息到对话历史
        this.conversationHistories[type].push({
            role: 'user',
            content: messageText,
            timestamp: new Date().toISOString()
        });
        
        // 模拟AI回复
        setTimeout(() => {
            let aiResponse;
            
            if (type === 'intelligent-query') {
                aiResponse = this.generateIntelligentResponse(messageText, type);
            } else if (type === 'system-qa') {
                aiResponse = this.generateSystemQAResponse(messageText, type);
            }
            
            // 保存AI回复到对话历史
            this.conversationHistories[type].push({
                role: 'ai',
                content: aiResponse,
                timestamp: new Date().toISOString()
            });
            
            // 流式输出AI回复，更拟真
            this.addStreamingMessage(chatMessages, 'ai', aiResponse, {
                onComplete: () => {
                    if (type === 'intelligent-query') {
                        document.getElementById('send-btn').disabled = false;
                    } else if (type === 'system-qa') {
                        document.getElementById('qa-send-btn').disabled = false;
                    }
                }
            });
            
            // 滚动到底部
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    },
    
    // 添加消息到聊天区域
    addMessage: function(container, sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = text;
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        
        container.appendChild(messageDiv);
    },
    
    // 新增：以打字机效果逐渐输出AI回复
    addStreamingMessage: function(container, sender, fullText, options = {}) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        // 先显示打字中指示器
        const typing = document.createElement('span');
        typing.className = 'typing';
        typing.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
        contentDiv.appendChild(typing);
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        container.appendChild(messageDiv);
        
        // 确保可见
        container.scrollTop = container.scrollHeight;
        
        // 稍作延迟后开始逐字输出
        setTimeout(() => {
            contentDiv.textContent = '';
            const text = fullText || '';
            const total = text.length;
            // 控制步长，文本越长单步越大，保证整体速度；同时保持“逐渐输出”的观感
            const step = Math.max(1, Math.ceil(total / 400));
            let i = 0;
            const timer = setInterval(() => {
                // 每次追加 step 个字符
                const next = text.slice(i, Math.min(i + step, total));
                contentDiv.textContent += next;
                i += step;
                
                // 边打字边滚动到底部
                container.scrollTop = container.scrollHeight;
                
                if (i >= total) {
                    clearInterval(timer);
                    // 完成回调（用于恢复发送按钮等）
                    if (options.onComplete) options.onComplete();
                }
            }, 16); // 约 ~60fps 的逐帧更新
        }, 200);
    },
    
    // 添加到历史记录
    addToHistory: function(container, text) {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const now = new Date();
        const timeString = now.getHours().toString().padStart(2, '0') + ':' + 
                          now.getMinutes().toString().padStart(2, '0');
        
        historyItem.innerHTML = `
            <div class="query-text">${text}</div>
            <div class="time-stamp">${timeString}</div>
        `;
        
        // 点击历史记录项，重新发送查询
        historyItem.addEventListener('click', () => {
            document.getElementById('query-input').value = text;
            document.getElementById('send-btn').disabled = false;
        });
        
        // 限制历史记录数量
        const maxHistoryItems = 20;
        const currentItems = container.querySelectorAll('.history-item');
        if (currentItems.length >= maxHistoryItems) {
            container.removeChild(currentItems[0]);
        }
        
        container.appendChild(historyItem);
    },
    
    // 初始化丰富的模拟数据
    initializeMockData: function() {
        // 智能查询数据
        this.intelligentQueryData = {
            'monthlyTrends': {
                '门诊量': {
                    'currentMonth': [8500, 8700, 8900, 9100, 9200, 9000, 8900],
                    'lastMonth': [8200, 8300, 8500, 8700, 8800, 8600, 8500],
                    'growthRate': '3.2%',
                    'analysis': '门诊量呈现稳定增长趋势，主要受季节性疾病影响，建议加强预防宣传'
                },
                '手术量': {
                    'currentMonth': [1200, 1250, 1300, 1350, 1400, 1380, 1350],
                    'lastMonth': [1100, 1150, 1200, 1250, 1300, 1280, 1250],
                    'growthRate': '7.7%',
                    'analysis': '手术量增长明显，反映医院技术水平提升和患者信任度增加'
                },
                '住院量': {
                    'currentMonth': [3200, 3300, 3400, 3500, 3600, 3550, 3500],
                    'lastMonth': [3000, 3100, 3200, 3300, 3400, 3350, 3300],
                    'growthRate': '6.1%',
                    'analysis': '住院量平稳上升，需关注床位周转率和医护人员配置'
                },
                '急诊量': {
                    'currentMonth': [2800, 2900, 3100, 3200, 3300, 3150, 3000],
                    'lastMonth': [2600, 2700, 2900, 3000, 3100, 2950, 2800],
                    'growthRate': '7.1%',
                    'analysis': '急诊量增长较快，建议优化急诊流程，提高处理效率'
                }
            },
            'departmentRanking': {
                '收入排名': ['骨科', '心血管内科', '神经内科', '普通外科', '妇产科', '眼科', '儿科', '口腔科', '肿瘤科', '呼吸内科'],
                '收入占比': ['23%', '18%', '15%', '12%', '10%', '8%', '7%', '4%', '2%', '1%'],
                '门诊量排名': ['内科', '儿科', '妇产科', '骨科', '眼科', '口腔科', '神经内科', '普通外科', '皮肤科', '耳鼻喉科'],
                '住院量排名': ['骨科', '神经内科', '普通外科', '心血管内科', '妇产科', '儿科', '眼科', '口腔科', '肿瘤科', '呼吸内科'],
                '利润率排名': ['眼科', '口腔科', '骨科', '妇产科', '心血管内科', '神经内科', '普通外科', '儿科', '肿瘤科', '呼吸内科']
            },
            'equipmentUsage': {
                'CT设备': '89%',
                'MRI设备': '85%',
                'DR设备': '78%',
                '超声设备': '82%',
                '检验设备': '92%',
                '心电图设备': '75%',
                '呼吸机': '88%',
                '监护仪': '80%',
                '血透设备': '95%',
                '内镜设备': '87%',
                '手术机器人': '72%',
                '放疗设备': '83%'
            },
            'patientStats': {
                '平均住院天数': '6.8天',
                '内科平均住院天数': '7.5天',
                '外科平均住院天数': '6.2天',
                '儿科平均住院天数': '5.8天',
                '妇产科平均住院天数': '4.5天',
                '病床使用率': '92%',
                '手术成功率': '98.5%',
                '患者满意度': '94.2%',
                '再入院率': '3.2%',
                '医院感染率': '0.8%',
                '药占比': '28.5%',
                '耗材占比': '15.2%'
            },
            'financialData': {
                '月总收入': '1.2亿元',
                '药品收入占比': '35%',
                '检查收入占比': '25%',
                '治疗收入占比': '20%',
                '手术收入占比': '15%',
                '其他收入占比': '5%',
                '同比增长': '8.5%',
                '环比增长': '2.3%',
                '人均医疗费用': '8,650元',
                '门诊人均费用': '285元',
                '住院人均费用': '12,800元',
                '医保报销比例': '78.5%'
            },
            'qualityIndicators': {
                '三级手术占比': '45.2%',
                '四级手术占比': '12.8%',
                '微创手术占比': '68.5%',
                '抗菌药物使用率': '38.2%',
                '血液制品使用合格率': '99.8%',
                '临床路径管理率': '85.6%',
                '单病种质量控制达标率': '92.3%',
                '医疗纠纷发生率': '0.15%'
            },
            'operationalEfficiency': {
                '床位周转率': '45.6次/年',
                '平均住院日': '6.8天',
                '门诊预约率': '78.5%',
                '手术室利用率': '85.2%',
                '设备完好率': '96.8%',
                '药品库存周转率': '12.5次/年',
                '医护比': '1:2.1',
                '床护比': '1:0.8'
            }
        };
        
        // 制度问答数据
        this.systemQAData = {
            '医院运营管理制度': {
                '基本原则': '1. 以患者为中心，提供优质医疗服务；2. 坚持公益性原则，保障基本医疗需求；3. 注重医疗质量和安全，持续改进医疗服务；4. 科学管理，提高运营效率；5. 依法依规运营，遵守相关法律法规；6. 注重人才培养，加强队伍建设；7. 风险管理：识别和控制各类运营风险；8. 绩效管理：建立科学的考核评价体系。',
                '组织架构': '医院实行院长负责制，设立医疗、护理、行政、后勤等多个职能部门，各部门分工明确，协同配合。具体包括：院长办公室、医务科、护理部、财务科、人事科、后勤保障部、信息中心等。',
                '工作流程': '医院各项工作流程严格按照相关规范执行，包括患者就诊流程、医疗质量控制流程、药品管理流程、财务审批流程等。具体流程可参考医院内部《工作流程手册》。',
                '考核机制': '医院建立了完善的考核机制，包括医疗质量考核、服务满意度考核、工作效率考核、成本控制考核等多个方面。考核结果与绩效奖金、晋升等挂钩，激励员工积极工作。'
            },
            '医疗质量管理办法': {
                '主要指标': '1. 诊断符合率；2. 治愈率；3. 好转率；4. 死亡率；5. 医院感染率；6. 手术并发症发生率；7. 平均住院日；8. 床位使用率；9. 药品占比；10. 大型设备检查阳性率。',
                '评价体系': '医院建立了三级医疗质量评价体系，包括科室自评、职能部门评价和医院评价。评价结果定期公示，并作为科室和个人绩效考核的重要依据。',
                '改进措施': '针对医疗质量存在的问题，医院采取了一系列改进措施，包括加强医疗质量管理培训、完善医疗质量管理制度、推广临床路径管理、加强医患沟通等。',
                '监督机制': '医院设立了医疗质量监督委员会，定期对医疗质量进行监督检查，发现问题及时整改。同时，医院还建立了患者投诉处理机制，接受社会监督。'
            },
            '医院数据管理规范': {
                '数据分级分类': '医院数据按照敏感程度分为三级：一级数据为核心敏感数据，包括患者个人身份信息、病历信息等；二级数据为重要业务数据，包括医疗质量数据、财务数据等；三级数据为一般公开数据，包括医院基本信息、公开招聘信息等。',
                '访问控制': '医院实行严格的数据访问控制，根据岗位职责和工作需要，为员工分配不同的数据访问权限。数据访问记录可追溯，确保数据安全。',
                '备份恢复': '医院建立了完善的数据备份和恢复机制，包括定期全量备份和增量备份，确保数据在发生故障时能够快速恢复。同时，医院还制定了详细的数据恢复演练计划，定期进行演练。',
                '安全审计': '医院定期进行数据安全审计，检查数据访问记录、数据修改记录等，发现异常情况及时处理。同时，医院还加强了员工数据安全培训，提高员工数据安全意识。'
            },
            '财务管理制度': {
                '报销流程': '1. 报销人填写报销单，粘贴原始凭证；2. 部门负责人审核签字；3. 财务部门审核票据真实性和合规性；4. 分管领导审批；5. 财务部门进行报销支付；6. 财务部门进行账务处理。',
                '预算管理': '医院实行全面预算管理，包括收入预算、支出预算、资本预算等。预算编制采用上下结合的方式，经过反复论证和审批后执行。预算执行情况定期分析，及时调整。',
                '成本控制': '医院加强成本控制，建立了成本核算体系，对各项成本进行精细化管理。同时，医院还采取了一系列成本控制措施，包括节能降耗、优化流程、合理用药等。',
                '资产管理': '医院加强资产管理，建立了资产台账，定期进行资产清查，确保资产安全完整。资产处置按照相关规定执行，严格审批程序。'
            },
            '人力资源管理办法': {
                '招聘流程': '1. 制定招聘计划；2. 发布招聘公告；3. 简历筛选；4. 笔试面试；5. 背景调查；6. 体检；7. 录用。',
                '培训体系': '医院建立了完善的培训体系，包括新员工入职培训、岗位技能培训、继续教育等。培训内容根据员工岗位需求和职业发展规划确定，培训效果纳入员工考核。',
                '考核机制': '医院实行多维度考核，包括工作业绩、工作态度、工作能力等。考核结果与绩效奖金、晋升、评优等挂钩。同时，医院还建立了绩效考核反馈机制，帮助员工改进工作。',
                '薪酬体系': '医院建立了公平合理的薪酬体系，包括基本工资、绩效奖金、津贴补贴等。薪酬水平参考当地同行业平均水平，结合医院实际情况确定。同时，医院还建立了薪酬调整机制，根据经济效益和物价变动等因素适时调整。'
            },
            '绩效管理体系': {
                '基本框架': '医院绩效管理体系构建应包括：1）建立平衡计分卡（BSC）框架，涵盖财务、客户、内部流程、学习成长四个维度；2）设定关键绩效指标（KPI），包括医疗质量、运营效率、财务状况、患者满意度等；3）建立分层分级的绩效考核体系；4）实施绩效沟通和反馈机制；5）建立绩效改进计划；6）将绩效结果与薪酬激励挂钩；7）定期评估和调整绩效管理体系。',
                '考核指标': '医院绩效考核指标体系包括：医疗质量指标（诊断符合率、治愈率、手术成功率等）、运营效率指标（床位使用率、平均住院日、设备利用率等）、财务指标（收入增长率、成本控制率、利润率等）、患者满意度指标、员工满意度指标、学科建设指标等。',
                '激励机制': '医院建立了多元化的激励机制，包括物质激励（绩效奖金、津贴补贴）和精神激励（表彰奖励、职业发展）相结合，短期激励和长期激励相结合，个人激励和团队激励相结合。',
                '改进措施': '医院定期对绩效管理体系进行评估和改进，包括指标体系的优化、考核方法的完善、激励机制的调整等，确保绩效管理体系的有效性和适应性。'
            },
            '医院感染控制制度': {
                '组织管理': '医院建立感染控制组织架构，设立医院感染管理委员会和感染控制科，明确各级人员职责，建立完善的感染控制制度体系。',
                '预防措施': '医院感染控制的预防措施包括：1）建立标准预防措施和隔离制度；2）加强手卫生管理；3）规范医疗器械消毒灭菌；4）合理使用抗菌药物；5）加强环境卫生管理；6）规范医疗废物处置；7）加强职业防护。',
                '监测体系': '医院建立了完善的感染监测体系，包括目标性监测、全面性监测、暴发调查等，定期分析感染发生情况，及时发现和控制感染风险。',
                '应急处置': '医院制定了感染暴发应急预案，建立快速响应机制，一旦发生感染暴发，立即启动应急预案，采取有效措施控制感染传播。'
            },
            '药事管理制度': {
                '采购管理': '医院建立规范的药品采购管理制度，实行集中采购，建立供应商评价体系，确保药品质量和供应安全。',
                '储存管理': '医院建立药品储存管理制度，按照药品储存要求设置药库和药房，建立药品养护制度，确保药品质量。',
                '调剂管理': '医院建立药品调剂管理制度，规范调剂流程，加强处方审核，确保用药安全。',
                '临床用药': '医院建立合理用药管理制度，开展药物治疗监测，加强抗菌药物管理，减少药物不良反应。',
                '药学服务': '医院开展临床药学服务，为患者提供用药指导，参与临床治疗决策，提高药物治疗效果。'
            },
            '设备管理制度': {
                '采购管理': '医院建立医疗设备采购管理制度，制定采购计划，规范采购流程，建立供应商管理体系。',
                '使用管理': '医院建立设备使用管理制度，对操作人员进行培训，建立设备使用记录，确保设备安全有效使用。',
                '维护保养': '医院建立设备维护保养制度，制定维护保养计划，建立维护保养记录，确保设备正常运行。',
                '质量控制': '医院建立设备质量控制制度，定期进行设备性能检测，建立设备档案，确保设备质量。',
                '更新改造': '医院建立设备更新改造制度，制定设备更新计划，规范报废处置流程，提高设备使用效益。'
            },
            '应急管理制度': {
                '组织体系': '医院建立应急管理组织体系，设立应急指挥部和各专业应急小组，明确职责分工，建立应急管理制度。',
                '预案体系': '医院建立应急预案体系，包括综合应急预案、专项应急预案和现场处置方案，涵盖各类突发事件。',
                '资源保障': '医院建立应急资源保障体系，储备应急物资和设备，建立应急队伍，确保应急响应能力。',
                '培训演练': '医院定期开展应急培训和演练，提高员工应急处置能力，检验应急预案的有效性。',
                '评估改进': '医院定期对应急管理工作进行评估，总结经验教训，不断完善应急管理体系。'
            },
            '患者安全管理制度': {
                '安全目标': '医院建立患者安全管理制度，确立患者安全目标，包括正确识别患者身份、改善医务人员之间的有效沟通、提高报警药物的安全性等。',
                '风险管理': '医院建立患者安全风险管理体系，识别和评估安全风险，制定风险控制措施，建立风险监测机制。',
                '不良事件': '医院建立不良事件报告和管理制度，鼓励主动报告，建立无惩罚性报告文化，通过分析不良事件改进安全管理。',
                '持续改进': '医院建立患者安全持续改进机制，定期评估安全管理效果，不断完善安全管理措施，提高患者安全水平。'
            },
            '科研管理制度': {
                '项目管理': '医院建立科研项目管理制度，规范项目申报、立项、执行、验收等各个环节，确保科研项目顺利实施。',
                '经费管理': '医院建立科研经费管理制度，规范经费使用，加强经费监管，提高经费使用效益。',
                '伦理管理': '医院建立医学伦理委员会，制定伦理审查制度，确保科研活动符合伦理要求。',
                '成果管理': '医院建立科研成果管理制度，保护知识产权，促进成果转化，提高科研效益。',
                '质量控制': '医院建立科研质量控制体系，规范科研行为，确保科研质量和学术诚信。'
            },
            '学科建设管理制度': {
                '发展规划': '医院制定学科建设发展规划，明确学科发展目标和重点，统筹学科建设资源配置。',
                '人才培养': '医院建立学科人才培养体系，引进和培养学科带头人，建设结构合理的学科团队。',
                '平台建设': '医院加强学科平台建设，建设重点实验室、临床研究中心等科研平台，提升学科建设水平。',
                '评估考核': '医院建立学科建设评估考核制度，定期评估学科建设成效，促进学科持续发展。'
            },
            '信息化管理制度': {
                '系统建设': '医院建立信息化系统建设管理制度，统筹规划信息化建设，确保系统安全稳定运行。',
                '数据管理': '医院建立数据管理制度，规范数据采集、存储、使用和共享，保障数据安全和质量。',
                '网络安全': '医院建立网络安全管理制度，加强网络安全防护，建立安全事件应急响应机制。',
                '运维管理': '医院建立信息系统运维管理制度，确保系统正常运行，及时处理系统故障和问题。'
            }
        };
    },
    
    // 生成智能查询回复
    generateIntelligentResponse: function(query, type) {
        // 提取对话历史中最近的几条消息作为上下文
        const context = this.getRecentContext(type, 3);
        
        // 基于查询内容和上下文生成回复
        if (this.containsAny(query, ['门诊量', '门诊人次'])) {
            return this.generateVisitVolumeResponse(query, context);
        } else if (this.containsAny(query, ['手术', '手术量', '手术人次'])) {
            return this.generateSurgeryResponse(query, context);
        } else if (this.containsAny(query, ['收入', '财务', '资金', '费用', '人均费用', '医保'])) {
            return this.generateFinancialResponse(query, context);
        } else if (this.containsAny(query, ['科室', '部门', '专科', '利润率'])) {
            return this.generateDepartmentResponse(query, context);
        } else if (this.containsAny(query, ['设备', '使用率', '仪器', 'CT', 'MRI', '血透', '呼吸机'])) {
            return this.generateEquipmentResponse(query, context);
        } else if (this.containsAny(query, ['患者', '住院', '病床', '床位', '急诊', '满意度'])) {
            return this.generatePatientResponse(query, context);
        } else if (this.containsAny(query, ['质量指标', '医疗质量', '感染率', '死亡率', '并发症'])) {
            return this.generateQualityIndicatorsResponse(query, context);
        } else if (this.containsAny(query, ['运营效率', '周转率', '效率', '人均工作量'])) {
            return this.generateOperationalEfficiencyResponse(query, context);
        } else if (this.containsAny(query, ['同比', '环比', '增长', '下降', '趋势'])) {
            return this.generateTrendResponse(query, context);
        } else {
            // 通用回复
            return `🔍 根据您的查询"${query}"，我为您提供以下信息：\n\n📊 数据分析结果显示，相关指标整体呈现良好趋势，仍有一些需要关注的点。\n\n💡 建议：\n• 结合历史数据进一步分析\n• 关注关键指标变化趋势\n• 制定针对性改进措施\n\n如需了解具体数据，请提供更详细的查询条件。`;
        }
    },
    
    // 生成制度问答回复
    generateSystemQAResponse: function(query, type) {
        // 提取对话历史中最近的几条消息作为上下文
        const context = this.getRecentContext(type, 3);
        
        // 基于查询内容和上下文生成回复
        if (this.containsAny(query, ['医院运营管理', '运营制度'])) {
            return this.generateOperationSystemResponse(query, context);
        } else if (this.containsAny(query, ['医疗质量', '质量控制'])) {
            return this.generateQualitySystemResponse(query, context);
        } else if (this.containsAny(query, ['数据管理', '数据安全'])) {
            return this.generateDataSystemResponse(query, context);
        } else if (this.containsAny(query, ['财务', '报销', '预算', '成本'])) {
            return this.generateFinancialSystemResponse(query, context);
        } else if (this.containsAny(query, ['人力', '招聘', '培训', '考核', '薪酬'])) {
            return this.generateHRSystemResponse(query, context);
        } else if (this.containsAny(query, ['制度', '管理办法', '规范', '规定'])) {
            // 检查是否有直接匹配的制度名称
            for (const systemName in this.systemQAData) {
                if (query.includes(systemName)) {
                    return `您查询的《${systemName}》是医院重要的管理制度文件。该制度涵盖了${systemName.replace('医院', '').replace('管理', '').replace('制度', '')}的多个方面，包括基本原则、组织架构、工作流程等内容。如果您需要了解该制度的具体条款，可以进一步提问。`;
                }
            }
            return `根据医院相关制度规定，${query}的具体内容请参考医院内部制度文档。如果您需要更详细的信息，建议咨询医院相关管理部门或查阅完整的制度文件。`;
        } else {
            // 通用回复
            return `关于"${query}"的问题，建议您参考医院的相关制度文件或咨询相关管理部门。如有具体条款需要了解，我可以为您提供更详细的解答。`;
        }
    },
    
    // 辅助函数：检查字符串是否包含任意关键词
    containsAny: function(str, keywords) {
        return keywords.some(keyword => str.includes(keyword));
    },
    
    // 辅助函数：获取最近的对话上下文
    getRecentContext: function(type, maxCount) {
        const history = this.conversationHistories[type];
        return history.slice(-maxCount);
    },
    
    // 生成门诊量相关回复
    generateVisitVolumeResponse: function(query, context) {
        const trends = this.intelligentQueryData.monthlyTrends['门诊量'];
        
        if (this.containsAny(query, ['最近一个月', '本月'])) {
            return `根据最近一个月的数据统计，门诊量呈现以下趋势：月初门诊量为${trends.currentMonth[0]}人次，中旬达到${Math.max(...trends.currentMonth)}人次，月末略降至${trends.currentMonth[trends.currentMonth.length - 1]}人次。整体呈现先上升后略微下降的趋势，主要受季节因素影响。与上月相比，门诊量增长了${trends.growthRate}。`;
        } else if (this.containsAny(query, ['上月', '上个月'])) {
            return `上月门诊量数据显示，月初为${trends.lastMonth[0]}人次，中旬达到${Math.max(...trends.lastMonth)}人次，月末为${trends.lastMonth[trends.lastMonth.length - 1]}人次。整体趋势相对平稳。`;
        } else if (this.containsAny(query, ['同比', '去年同期'])) {
            return `与去年同期相比，本月门诊量增长了${parseFloat(trends.growthRate) * 1.5}%，主要原因是医院服务质量提升和新门诊大楼投入使用。`;
        } else if (this.containsAny(query, ['预测', '未来'])) {
            return `基于当前数据和季节性因素分析，预计下月门诊量将在${Math.round(trends.currentMonth[trends.currentMonth.length - 1] * 1.02)}至${Math.round(trends.currentMonth[trends.currentMonth.length - 1] * 1.05)}人次之间，建议提前做好人员和资源安排。`;
        } else if (this.containsAny(query, ['科室', '部门'])) {
            const deptRanking = this.intelligentQueryData.departmentRanking['门诊量排名'];
            return `各科室门诊量排名前五位的分别是：1. ${deptRanking[0]}，2. ${deptRanking[1]}，3. ${deptRanking[2]}，4. ${deptRanking[3]}，5. ${deptRanking[4]}。其中${deptRanking[0]}的门诊量占全院门诊总量的${Math.round(Math.random() * 10 + 15)}%。`;
        } else {
            return `医院目前整体门诊量情况良好，近期数据稳定。如果您想了解更具体的信息，如不同时间段的门诊量、各科室门诊量分布等，可以进一步提问。`;
        }
    },
    
    // 生成手术相关回复
    generateSurgeryResponse: function(query, context) {
        const trends = this.intelligentQueryData.monthlyTrends['手术量'];
        const stats = this.intelligentQueryData.patientStats;
        
        if (this.containsAny(query, ['手术量', '手术人次'])) {
            return `根据统计，本月手术量为${trends.currentMonth.reduce((a, b) => a + b, 0)}人次，与上月相比增长了${trends.growthRate}。手术类型分布中，普外科手术占比约${Math.round(Math.random() * 5 + 25)}%，骨科手术占比约${Math.round(Math.random() * 5 + 20)}%，妇产科手术占比约${Math.round(Math.random() * 5 + 15)}%，其他手术占比约${Math.round(Math.random() * 10 + 35)}%。`;
        } else if (this.containsAny(query, ['成功率', '成功'])) {
            return `目前医院整体手术成功率为${stats.手术成功率}，处于较高水平。其中，一类手术成功率为${(parseFloat(stats.手术成功率) + 1).toFixed(1)}%，二类手术成功率为${(parseFloat(stats.手术成功率)).toFixed(1)}%，三类手术成功率为${(parseFloat(stats.手术成功率) - 0.5).toFixed(1)}%，四类手术成功率为${(parseFloat(stats.手术成功率) - 1).toFixed(1)}%。`;
        } else if (this.containsAny(query, ['并发症', '并发'])) {
            return `医院手术并发症发生率为${(100 - parseFloat(stats.手术成功率) + 0.5).toFixed(2)}%，低于行业平均水平。主要并发症类型包括感染、出血、器官功能障碍等，医院已采取一系列措施降低并发症发生率。`;
        } else {
            return `关于手术相关数据，医院有详细的统计和分析。如果您想了解具体的手术量、手术类型分布、手术成功率等信息，可以进一步提问。`;
        }
    },
    
    // 生成财务相关回复
    generateFinancialResponse: function(query, context) {
        const financialData = this.intelligentQueryData.financialData;
        const deptRanking = this.intelligentQueryData.departmentRanking;
        
        if (this.containsAny(query, ['总收入', '收入'])) {
            return `💰 本月医院总收入为${financialData.月总收入}，与上月相比增长了${financialData.环比增长}，与去年同期相比增长了${financialData.同比增长}。\n\n📊 收入结构分析：\n• 药品收入占比：${financialData.药品收入占比}\n• 检查收入占比：${financialData.检查收入占比}\n• 治疗收入占比：${financialData.治疗收入占比}\n• 手术收入占比：${financialData.手术收入占比}\n• 其他收入占比：${financialData.其他收入占比}\n\n收入结构合理，增长态势良好。`;
        } else if (this.containsAny(query, ['人均费用', '人均医疗费用', '费用'])) {
            return `💳 医疗费用统计分析：\n\n📈 人均费用指标：\n• 人均医疗费用：${financialData.人均医疗费用}\n• 门诊人均费用：${financialData.门诊人均费用}\n• 住院人均费用：${financialData.住院人均费用}\n\n🏥 医保情况：\n• 医保报销比例：${financialData.医保报销比例}\n\n费用水平合理，医保报销比例较高，有效减轻了患者负担。`;
        } else if (this.containsAny(query, ['科室收入', '部门收入'])) {
            let response = `🏥 各科室收入排名分析：\n\n💰 收入排名前五位：\n`;
            for (let i = 0; i < 5; i++) {
                response += `${i + 1}. ${deptRanking['收入排名'][i]} - 收入占比${deptRanking['收入占比'][i]}\n`;
            }
            response += `\n📊 这五个科室的总收入占医院总收入的${deptRanking['收入占比'].slice(0, 5).reduce((sum, val) => sum + parseFloat(val), 0).toFixed(0)}%，是医院的主要收入来源。`;
            return response;
        } else if (this.containsAny(query, ['成本', '支出'])) {
            return `📊 医院成本支出分析：\n\n💸 本月总支出约为${(parseFloat(financialData.月总收入) * 0.85).toFixed(1)}亿元\n\n🏗️ 主要支出构成：\n• 人员成本：约占总支出的45%\n• 药品成本：approximatelyITYOUT OF RANGE%\n• 卫生材料成本：approximatelyITYOUT OF RANGE%\n• 设备购置及维护：approximatelyITYOUT OF RANGE%\n\n成本控制情况良好，与预算基本持平。`;
        } else if (this.containsAny(query, ['利润', '盈余'])) {
            return `📈 医院盈利能力分析：\n\n💰 本月净利润约为${(parseFloat(financialData.月总收入) * 0.15).toFixed(1)}亿元\n📊 利润率约为15%，处于合理水平\n\n🎯 盈利能力指标：\n• 营业利润率：15.2%\n• 总资产收益率：8.5%\n• 净资产收益率：12.3%\n\n医院盈利能力稳定，财务状况良好。`;
        } else if (this.containsAny(query, ['医保', '报销'])) {
            return `🏥 医保报销情况分析：\n\n💳 医保报销比例：${financialData.医保报销比例}\n\n📊 医保类型分布：\n• 职工医保：approximatelyITYOUT OF RANGE%\n• 居民医保：approximatelyITYOUT OF RANGE%\n• 新农合：approximatelyITYOUT OF RANGE%\n\n🎯 报销效率：\n• 平均报销周期：7个工作日\n• 报销成功率：99.2%\n\n医保报销比例较高，有效减轻了患者经济负担。`;
        } else {
            return `💰 关于医院财务数据，我们有详细的统计和分析，包括：\n\n📊 收入分析：总收入、科室收入、收入结构\n💳 费用统计：人均费用、门诊费用、住院费用\n📈 成本控制：支出构成、成本分析\n💰 盈利能力：利润分析、财务指标\n🏥 医保情况：报销比例、医保类型\n\n如果您想了解具体的财务指标，可以进一步提问。`;
        }
    },
    
    // 生成科室相关回复
    generateDepartmentResponse: function(query, context) {
        const deptRanking = this.intelligentQueryData.departmentRanking;
        
        if (this.containsAny(query, ['收入排名', '收入'])) {
            let response = `💰 各科室收入排名分析：\n\n🏥 收入排名前五位：\n`;
            for (let i = 0; i < 5; i++) {
                response += `${i + 1}. ${deptRanking['收入排名'][i]} - 收入占比${deptRanking['收入占比'][i]}\n`;
            }
            response += `\n📊 这五个科室的总收入占医院总收入的${deptRanking['收入占比'].slice(0, 5).reduce((sum, val) => sum + parseFloat(val), 0).toFixed(0)}%，是医院的主要收入来源。`;
            return response;
        } else if (this.containsAny(query, ['利润率', '利润排名'])) {
            let response = `📈 各科室利润率排名分析：\n\n💎 利润率排名前五位：\n`;
            for (let i = 0; i < 5; i++) {
                response += `${i + 1}. ${deptRanking['利润率排名'][i]}\n`;
            }
            response += `\n💡 眼科和口腔科利润率较高，主要得益于技术含量高、耗材成本相对较低的特点。`;
            return response;
        } else if (this.containsAny(query, ['门诊量排名', '门诊'])) {
            let response = `👥 各科室门诊量排名分析：\n\n🏥 门诊量排名前五位：\n`;
            for (let i = 0; i < 5; i++) {
                response += `${i + 1}. ${deptRanking['门诊量排名'][i]}\n`;
            }
            response += `\n📊 内科和儿科门诊量较大，反映了基础医疗服务的重要性。`;
            return response;
        } else if (this.containsAny(query, ['住院量排名', '住院'])) {
            let response = `🛏️ 各科室住院量排名分析：\n\n🏥 住院量排名前五位：\n`;
            for (let i = 0; i < 5; i++) {
                response += `${i + 1}. ${deptRanking['住院量排名'][i]}\n`;
            }
            response += `\n📈 骨科和神经内科住院量较大，需要重点关注床位资源配置。`;
            return response;
        } else if (this.containsAny(query, ['人员', '医生', '护士'])) {
            return `👨‍⚕️ 医院各科室人员配置情况：\n\n🏥 主要科室人员配置：\n• 骨科：医生${Math.round(Math.random() * 10 + 20)}名，护士${Math.round(Math.random() * 20 + 40)}名\n• 心血管内科：医生${Math.round(Math.random() * 10 + 15)}名，护士${Math.round(Math.random() * 15 + 30)}名\n• 神经内科：医生${Math.round(Math.random() * 10 + 15)}名，护士${Math.round(Math.random() * 15 + 30)}名\n• 普通外科：医生${Math.round(Math.random() * 8 + 12)}名，护士${Math.round(Math.random() * 15 + 25)}名\n\n👥 整体医护比例为1:2.1，床护比例为1:0.8，人员配置合理。`;
        } else {
            return `🏥 关于医院各科室的情况，我们有详细的统计数据，包括：\n\n💰 经营指标：收入排名、利润率排名\n👥 业务指标：门诊量排名、住院量排名\n👨‍⚕️ 人力资源：医生护士配置、人员结构\n📊 绩效分析：科室对比、发展趋势\n\n如果您想了解具体科室的情况，可以进一步提问。`;
        }
    },
    
    // 生成设备相关回复
    generateEquipmentResponse: function(query, context) {
        const equipmentUsage = this.intelligentQueryData.equipmentUsage;
        
        if (this.containsAny(query, ['CT', 'ct'])) {
            return `🏥 CT设备使用情况：\n\n📊 设备配置：\n• 总数：${equipmentUsage['CT']['总数']}台\n• 正常运行：${equipmentUsage['CT']['正常运行']}台\n• 维修中：${equipmentUsage['CT']['维修中']}台\n• 使用率：${equipmentUsage['CT']['使用率']}\n\n✅ 设备运行状况良好，能够满足临床诊断需求。`;
        } else if (this.containsAny(query, ['MRI', 'mri', '核磁'])) {
            return `🧲 MRI设备使用情况：\n\n📊 设备配置：\n• 总数：${equipmentUsage['MRI']['总数']}台\n• 正常运行：${equipmentUsage['MRI']['正常运行']}台\n• 维修中：${equipmentUsage['MRI']['维修中']}台\n• 使用率：${equipmentUsage['MRI']['使用率']}\n\n✅ 设备运行状况良好，成像质量优异。`;
        } else if (this.containsAny(query, ['血透', '透析'])) {
            return `💧 血透设备使用情况：\n\n📊 设备配置：\n• 总数：${equipmentUsage['血透设备']['总数']}台\n• 正常运行：${equipmentUsage['血透设备']['正常运行']}台\n• 维修中：${equipmentUsage['血透设备']['维修中']}台\n• 使用率：${equipmentUsage['血透设备']['使用率']}\n\n🔄 血透中心运行良好，能够满足肾病患者的治疗需求。`;
        } else if (this.containsAny(query, ['呼吸机'])) {
            return `🫁 呼吸机设备使用情况：\n\n📊 设备配置：\n• 总数：${equipmentUsage['呼吸机']['总数']}台\n• 正常运行：${equipmentUsage['呼吸机']['正常运行']}台\n• 维修中：${equipmentUsage['呼吸机']['维修中']}台\n• 使用率：${equipmentUsage['呼吸机']['使用率']}\n\n🚨 ICU和急诊科呼吸机配置充足，应急保障能力强。`;
        } else if (this.containsAny(query, ['使用率', '使用'])) {
            let response = `📊 医院主要医疗设备使用率统计：\n\n`;
            for (const [equipment, data] of Object.entries(equipmentUsage)) {
                if (typeof data === 'object' && data.使用率) {
                    response += `• ${equipment}：${data.使用率}\n`;
                }
            }
            response += `\n📈 整体设备使用率处于较高水平，建议合理安排设备维护时间，确保设备正常运行。`;
            return response;
        } else if (this.containsAny(query, ['维护', '故障'])) {
            return `🔧 本月设备维护情况：\n\n📊 维护统计：\n• 定期维护：${Math.round(Math.random() * 10 + 20)}台次\n• 故障处理：${Math.round(Math.random() * 5 + 5)}起\n• 设备完好率：${(Math.random() * 3 + 96).toFixed(1)}%\n\n✅ 设备维护情况良好，运行稳定。`;
        } else if (this.containsAny(query, ['购置', '新增'])) {
            return `💰 本月新增设备情况：\n\n🆕 新增设备：\n• 设备数量：${Math.round(Math.random() * 2 + 1)}台\n• 主要设备：${Math.random() > 0.5 ? 'CT设备' : '超声设备'}\n• 总价值：约${(Math.random() * 500 + 100).toFixed(0)}万元\n\n📈 持续加强设备投入，提升医疗服务能力。`;
        } else {
            return `🏥 医院拥有各类先进医疗设备，包括：\n\n🔍 影像设备：CT、MRI、DR、超声等\n💧 治疗设备：血透设备、呼吸机、监护仪等\n🏥 手术设备：手术台、麻醉机、电刀等\n🔬 检验设备：生化分析仪、血细胞分析仪等\n\n📊 设备总价值超过2亿元，运行状况良好。如果您想了解具体设备的情况，可以进一步询问。`;
        }
    },
    
    // 生成患者相关回复
    generatePatientResponse: function(query, context) {
        const patientStats = this.intelligentQueryData.patientStats;
        
        if (this.containsAny(query, ['急诊量', '急诊'])) {
            return `🚨 急诊科运行情况：\n\n📊 急诊量统计：\n• 本月急诊量：${patientStats.急诊量}\n• 日均急诊量：${Math.round(parseInt(patientStats.急诊量) / 30)}人次\n• 急诊留观率：${(Math.random() * 5 + 15).toFixed(1)}%\n• 急诊抢救成功率：${(Math.random() * 3 + 95).toFixed(1)}%\n\n⚡ 急诊科运行良好，能够及时处理各类急危重症患者。`;
        } else if (this.containsAny(query, ['平均住院天数', '住院天数'])) {
            return `🏥 住院患者平均住院天数分析：\n\n📊 整体情况：\n• 全院平均住院天数：${patientStats.平均住院天数}\n• 较上月变化：下降${(Math.random() * 0.5 + 0.2).toFixed(1)}天\n\n🏥 各科室情况：\n• 内科系统：${patientStats.内科平均住院天数}\n• 外科系统：${patientStats.外科平均住院天数}\n• 儿科系统：${patientStats.儿科平均住院天数}\n• 妇产科系统：${patientStats.妇产科平均住院天数}\n\n📈 医疗效率持续提升，住院天数合理控制。`;
        } else if (this.containsAny(query, ['病床使用率', '床位使用率'])) {
            return `🛏️ 病床使用率分析：\n\n📊 整体情况：\n• 全院病床使用率：${patientStats.病床使用率}\n• 运行状态：较高水平\n\n🏥 重点科室：\n• 骨科：${(parseFloat(patientStats.病床使用率) + 2).toFixed(1)}%\n• 心血管内科：${(parseFloat(patientStats.病床使用率) + 1).toFixed(1)}%\n• 神经内科：${(parseFloat(patientStats.病床使用率) + 0.5).toFixed(1)}%\n• ICU：${(parseFloat(patientStats.病床使用率) - 5).toFixed(1)}%\n\n💡 建议加强床位管理，提高床位周转效率。`;
        } else if (this.containsAny(query, ['满意度', '满意'])) {
            return `😊 患者满意度调查结果：\n\n📊 总体满意度：${patientStats.患者满意度}\n📈 较上月提升：${(Math.random() * 1 + 0.5).toFixed(1)}%\n\n🏥 分项评价：\n• 医疗质量：${(parseFloat(patientStats.患者满意度) + 1).toFixed(1)}%\n• 护理服务：${(parseFloat(patientStats.患者满意度) + 0.5).toFixed(1)}%\n• 环境设施：${(parseFloat(patientStats.患者满意度) - 1).toFixed(1)}%\n• 就医流程：${(parseFloat(patientStats.患者满意度) - 2).toFixed(1)}%\n\n💡 持续改进就医流程和等候时间管理。`;
        } else if (this.containsAny(query, ['年龄分布', '性别分布'])) {
            return `👥 住院患者结构分析：\n\n📊 年龄分布：\n• 0-14岁：${(Math.random() * 5 + 5).toFixed(1)}%\n• 15-44岁：${(Math.random() * 10 + 20).toFixed(1)}%\n• 45-64岁：${(Math.random() * 15 + 30).toFixed(1)}%\n• 65岁以上：${(Math.random() * 15 + 35).toFixed(1)}%\n\n👫 性别分布：\n• 男性：${(Math.random() * 10 + 45).toFixed(1)}%\n• 女性：${(Math.random() * 10 + 45).toFixed(1)}%\n\n📈 老年患者比例较高，需要加强老年医学服务。`;
        } else {
            return `👥 关于住院患者的情况，我们有详细的统计数据：\n\n🏥 基础指标：平均住院天数、病床使用率\n🚨 急诊数据：急诊量、留观率、抢救成功率\n😊 服务质量：患者满意度、服务评价\n📊 人群结构：年龄分布、性别分布\n\n如果您想了解具体的患者信息，可以进一步提问。`;
        }
    },
    
    // 生成趋势相关回复
    generateTrendResponse: function(query, context) {
        // 检查上下文，看用户之前询问过什么指标
        let targetMetric = '';
        for (const msg of context.reverse()) {
            if (msg.role === 'user') {
                if (this.containsAny(msg.content, ['门诊量', '门诊人次'])) {
                    targetMetric = '门诊量';
                    break;
                } else if (this.containsAny(msg.content, ['手术量', '手术人次'])) {
                    targetMetric = '手术量';
                    break;
                } else if (this.containsAny(msg.content, ['住院量', '住院人次'])) {
                    targetMetric = '住院量';
                    break;
                } else if (this.containsAny(msg.content, ['收入', '财务'])) {
                    targetMetric = '收入';
                    break;
                }
            }
        }
        
        if (targetMetric) {
            if (targetMetric === '收入') {
                const financialData = this.intelligentQueryData.financialData;
                return `${targetMetric}趋势分析：本月${targetMetric}为${financialData.月总收入}，与上月相比增长了${financialData.环比增长}，与去年同期相比增长了${financialData.同比增长}。预计下月${targetMetric}将继续保持稳定增长态势。`;
            } else {
                const trends = this.intelligentQueryData.monthlyTrends[targetMetric];
                return `${targetMetric}趋势分析：本月${targetMetric}整体呈现先上升后略微下降的趋势，月初为${trends.currentMonth[0]}人次，中旬达到峰值${Math.max(...trends.currentMonth)}人次，月末为${trends.currentMonth[trends.currentMonth.length - 1]}人次。与上月相比增长了${trends.growthRate}。预计下月${targetMetric}将在${Math.round(trends.currentMonth[trends.currentMonth.length - 1] * 1.02)}至${Math.round(trends.currentMonth[trends.currentMonth.length - 1] * 1.05)}人次之间。`;
            }
        } else {
            return `关于医院各项指标的趋势分析，我们有详细的数据支持。如果您想了解具体指标（如门诊量、手术量、收入等）的趋势情况，可以先询问该指标的基本情况，然后我可以为您提供更详细的趋势分析。`;
        }
    },
    
    // 生成医院运营管理制度相关回复
    generateOperationSystemResponse: function(query, context) {
        const operationData = this.systemQAData['医院运营管理制度'];
        
        if (this.containsAny(query, ['基本原则', '原则'])) {
            return operationData.基本原则;
        } else if (this.containsAny(query, ['组织架构', '架构'])) {
            return operationData.组织架构;
        } else if (this.containsAny(query, ['工作流程', '流程'])) {
            return operationData.工作流程;
        } else if (this.containsAny(query, ['考核机制', '考核'])) {
            return operationData.考核机制;
        } else {
            return `《医院运营管理制度》是医院管理的基本制度，涵盖了医院运营管理的各个方面。如果您想了解该制度的具体内容，如基本原则、组织架构、工作流程、考核机制等，可以进一步提问。`;
        }
    },
    
    // 生成医疗质量管理制度相关回复
    generateQualitySystemResponse: function(query, context) {
        const qualityData = this.systemQAData['医疗质量管理办法'];
        
        if (this.containsAny(query, ['主要指标', '指标'])) {
            return qualityData.主要指标;
        } else if (this.containsAny(query, ['评价体系', '评价'])) {
            return qualityData.评价体系;
        } else if (this.containsAny(query, ['改进措施', '改进'])) {
            return qualityData.改进措施;
        } else if (this.containsAny(query, ['监督机制', '监督'])) {
            return qualityData.监督机制;
        } else {
            return `《医疗质量管理办法》是医院医疗质量管理的重要制度，涵盖了医疗质量控制的各个方面。如果您想了解该办法的具体内容，如主要指标、评价体系、改进措施、监督机制等，可以进一步提问。`;
        }
    },
    
    // 生成数据管理制度相关回复
    generateDataSystemResponse: function(query, context) {
        const dataData = this.systemQAData['医院数据管理规范'];
        
        if (this.containsAny(query, ['数据分级分类', '分级分类'])) {
            return dataData.数据分级分类;
        } else if (this.containsAny(query, ['访问控制', '权限'])) {
            return dataData.访问控制;
        } else if (this.containsAny(query, ['备份恢复', '备份'])) {
            return dataData.备份恢复;
        } else if (this.containsAny(query, ['安全审计', '审计'])) {
            return dataData.安全审计;
        } else {
            return `《医院数据管理规范》是医院数据管理的重要制度，涵盖了数据收集、存储、使用和共享的各个方面。如果您想了解该规范的具体内容，如数据分级分类、访问控制、备份恢复、安全审计等，可以进一步提问。`;
        }
    },
    
    // 生成财务管理制度相关回复
    generateFinancialSystemResponse: function(query, context) {
        const financialData = this.systemQAData['财务管理制度'];
        
        if (this.containsAny(query, ['报销流程', '报销'])) {
            return financialData.报销流程;
        } else if (this.containsAny(query, ['预算管理', '预算'])) {
            return financialData.预算管理;
        } else if (this.containsAny(query, ['成本控制', '成本'])) {
            return financialData.成本控制;
        } else if (this.containsAny(query, ['资产管理', '资产'])) {
            return financialData.资产管理;
        } else {
            return `《财务管理制度》是医院财务管理的重要制度，涵盖了财务报销、预算管理、成本控制、资产管理等各个方面。如果您想了解该制度的具体内容，可以进一步提问。`;
        }
    },
    
    // 生成质量指标相关回复
    generateQualityIndicatorsResponse: function(query, context) {
        const qualityData = this.intelligentQueryData.qualityIndicators;
        
        if (this.containsAny(query, ['感染率', '院感'])) {
            return `🦠 医院感染控制情况：\n\n📊 感染率统计：\n• 医院感染率：${qualityData.医院感染率}\n• 手术部位感染率：${qualityData.手术部位感染率}\n• 导管相关感染率：${qualityData.导管相关感染率}\n\n🛡️ 感染控制措施有效，各项指标均控制在合理范围内。`;
        } else if (this.containsAny(query, ['死亡率', '病死率'])) {
            return `⚕️ 医疗质量安全指标：\n\n📊 死亡率统计：\n• 住院患者死亡率：${qualityData.住院患者死亡率}\n• 手术死亡率：${qualityData.手术死亡率}\n• ICU死亡率：${qualityData.ICU死亡率}\n\n✅ 死亡率控制良好，医疗安全水平较高。`;
        } else if (this.containsAny(query, ['并发症', '并发症率'])) {
            return `⚠️ 并发症监控情况：\n\n📊 并发症统计：\n• 手术并发症率：${qualityData.手术并发症率}\n• 药物不良反应率：${qualityData.药物不良反应率}\n• 跌倒发生率：${qualityData.跌倒发生率}\n\n🔍 持续监控并发症发生情况，及时采取预防措施。`;
        } else {
            return `📋 医疗质量指标监控：\n\n🦠 感染控制：医院感染率、手术部位感染率\n⚕️ 安全指标：住院患者死亡率、手术死亡率\n⚠️ 并发症监控：手术并发症率、药物不良反应率\n\n📈 各项质量指标均在合理范围内，医疗质量持续改进。`;
        }
    },
    
    // 生成运营效率相关回复
    generateOperationalEfficiencyResponse: function(query, context) {
        const efficiencyData = this.intelligentQueryData.operationalEfficiency;
        
        if (this.containsAny(query, ['床位周转率', '周转率'])) {
            return `🛏️ 床位运营效率：\n\n📊 周转率统计：\n• 床位周转率：${efficiencyData.床位周转率}\n• 平均住院日：${efficiencyData.平均住院日}\n• 床位使用率：${efficiencyData.床位使用率}\n\n📈 床位周转效率良好，资源利用率较高。`;
        } else if (this.containsAny(query, ['人均工作量', '工作量'])) {
            return `👨‍⚕️ 人员工作效率：\n\n📊 工作量统计：\n• 医生人均门诊量：${efficiencyData.医生人均门诊量}\n• 护士人均护理量：${efficiencyData.护士人均护理量}\n• 技师人均检查量：${efficiencyData.技师人均检查量}\n\n💪 医护人员工作效率较高，人力资源配置合理。`;
        } else if (this.containsAny(query, ['手术室利用率', '手术室效率'])) {
            return `🏥 手术室运营效率：\n\n📊 利用率统计：\n• 手术室利用率：${efficiencyData.手术室利用率}\n• 平均手术时间：${efficiencyData.平均手术时间}\n• 手术间隔时间：${efficiencyData.手术间隔时间}\n\n⚡ 手术室运营效率良好，时间安排合理。`;
        } else {
            return `⚡ 医院运营效率分析：\n\n🛏️ 床位效率：床位周转率、平均住院日\n👨‍⚕️ 人员效率：医生护士人均工作量\n🏥 设施效率：手术室利用率、设备使用率\n\n📊 整体运营效率良好，各项指标均达到预期水平。`;
        }
    },
    
    // 生成人力资源管理制度相关回复
    generateHRSystemResponse: function(query, context) {
        const hrData = this.systemQAData['人力资源管理办法'];
        
        if (this.containsAny(query, ['招聘流程', '招聘'])) {
            return hrData.招聘流程;
        } else if (this.containsAny(query, ['培训体系', '培训'])) {
            return hrData.培训体系;
        } else if (this.containsAny(query, ['考核机制', '考核'])) {
            return hrData.考核机制;
        } else if (this.containsAny(query, ['薪酬体系', '薪酬'])) {
            return hrData.薪酬体系;
        } else {
            return `《人力资源管理办法》是医院人力资源管理的重要制度，涵盖了招聘、培训、考核、薪酬等各个方面。如果您想了解该办法的具体内容，可以进一步提问。`;
        }
    }
};

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', function() {
    AIAssistantPage.init();
});