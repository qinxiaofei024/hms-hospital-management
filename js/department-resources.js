const DepartmentResourcesPage = {
    mockData: {
        resourceTrend: [
            { month: '一月', '人员利用率': 85.5, '设备利用率': 90.8, '床位使用率': 95.0, '资源效率指数': 90.0 },
            { month: '二月', '人员利用率': 85.5, '设备利用率': 90.8, '床位使用率': 95.0, '资源效率指数': 90.0 },
            { month: '三月', '人员利用率': 85.5, '设备利用率': 90.8, '床位使用率': 95.0, '资源效率指数': 90.0 },
            { month: '四月', '人员利用率': 85.5, '设备利用率': 90.8, '床位使用率': 95.0, '资源效率指数': 90.0 },
            { month: '五月', '人员利用率': 85.5, '设备利用率': 90.8, '床位使用率': 95.0, '资源效率指数': 90.0 },
            { month: '六月', '人员利用率': 85.5, '设备利用率': 90.8, '床位使用率': 95.0, '资源效率指数': 90.0 },
            { month: '七月', '人员利用率': 85.5, '设备利用率': 90.8, '床位使用率': 95.0, '资源效率指数': 90.0 },
            { month: '八月', '人员利用率': 85.5, '设备利用率': 90.8, '床位使用率': 95.0, '资源效率指数': 90.0 },
            { month: '九月', '人员利用率': 85.5, '设备利用率': 90.8, '床位使用率': 95.0, '资源效率指数': 90.0 },
            { month: '十月', '人员利用率': 85.5, '设备利用率': 90.8, '床位使用率': 95.0, '资源效率指数': 90.0 },
            { month: '十一月', '人员利用率': 85.5, '设备利用率': 90.8, '床位使用率': 95.0, '资源效率指数': 90.0 },
            { month: '十二月', '人员利用率': 85.5, '设备利用率': 90.8, '床位使用率': 95.0, '资源效率指数': 90.0 }
        ],
        staffEfficiency: [
            { type: '护士', count: 45, workload: 5.2, revenue: 32000, efficiency: 89.2, changeRate: 3.8 },
            { type: '医技人员', count: 22, workload: 4.5, revenue: 48000, efficiency: 85.6, changeRate: 4.2 },
            { type: '行政人员', count: 10, workload: 3.2, revenue: 38000, efficiency: 78.5, changeRate: 2.2 }
        ],
        equipmentUtilization: [
            { name: 'CT机', type: '影像设备', utilization: 92.5, dailyHours: 18.5, maintenance: 3, failureRate: 1.2 },
            { name: 'MRI', type: '影像设备', utilization: 90.8, dailyHours: 18.2, maintenance: 2, failureRate: 0.8 },
            { name: 'DR机', type: '影像设备', utilization: 85.5, dailyHours: 17.2, maintenance: 4, failureRate: 1.5 },
            { name: '彩超', type: '影像设备', utilization: 88.2, dailyHours: 17.8, maintenance: 3, failureRate: 1.2 },
            { name: '血液分析仪', type: '检验设备', utilization: 82.5, dailyHours: 16.5, maintenance: 5, failureRate: 2.2 },
            { name: '生化分析仪', type: '检验设备', utilization: 80.8, dailyHours: 16.2, maintenance: 4, failureRate: 1.8 },
            { name: '呼吸机', type: '急救设备', utilization: 78.5, dailyHours: 15.8, maintenance: 6, failureRate: 2.5 },
            { name: '监护仪', type: '急救设备', utilization: 76.2, dailyHours: 15.3, maintenance: 8, failureRate: 3.2 },
            { name: '手术床', type: '手术设备', utilization: 85.5, dailyHours: 17.2, maintenance: 2, failureRate: 0.8 },
            { name: '麻醉机', type: '手术设备', utilization: 83.2, dailyHours: 16.8, maintenance: 3, failureRate: 1.2 }
        ],
        bedEfficiency: [
            { department: '内科', openBeds: 80, occupiedBeds: 76, utilization: 95.0, avgStay: 6.5, turnoverRate: 3.8 },
            { department: '外科', openBeds: 75, occupiedBeds: 72, utilization: 96.0, avgStay: 7.2, turnoverRate: 3.5 },
            { department: '儿科', openBeds: 60, occupiedBeds: 58, utilization: 96.7, avgStay: 5.8, turnoverRate: 4.2 },
            { department: '妇产科', openBeds: 50, occupiedBeds: 48, utilization: 96.0, avgStay: 5.2, turnoverRate: 4.5 },
            { department: '神经内科', openBeds: 45, occupiedBeds: 43, utilization: 95.6, avgStay: 8.2, turnoverRate: 3.2 },
            { department: '心内科', openBeds: 40, occupiedBeds: 38, utilization: 95.0, avgStay: 7.8, turnoverRate: 3.3 },
            { department: '骨科', openBeds: 55, occupiedBeds: 52, utilization: 94.5, avgStay: 9.2, turnoverRate: 3.0 },
            { department: '眼科', openBeds: 30, occupiedBeds: 28, utilization: 93.3, avgStay: 4.5, turnoverRate: 5.2 },
            { department: '皮肤科', openBeds: 25, occupiedBeds: 22, utilization: 88.0, avgStay: 4.2, turnoverRate: 5.5 },
            { department: '耳鼻喉科', openBeds: 25, occupiedBeds: 23, utilization: 92.0, avgStay: 4.8, turnoverRate: 4.8 }
        ],
        resourceEfficiency: [
            { name: '人员效率', value: 85.5, target: 90.0, changeRate: 2.5 },
            { name: '设备效率', value: 78.5, target: 85.0, changeRate: 3.2 },
            { name: '床位效率', value: 95.5, target: 90.0, changeRate: 1.8 },
            { name: '物资效率', value: 72.5, target: 80.0, changeRate: 4.5 },
            { name: '空间效率', value: 88.5, target: 90.0, changeRate: 2.2 },
            { name: '流程效率', value: 79.5, target: 85.0, changeRate: 3.8 }
        ],
        costBenefit: [
            { category: '人员成本', cost: 8500000, revenue: 18500000, ratio: 2.18, unitOutput: 2.18, changeRate: 3.5 },
            { category: '设备成本', cost: 5200000, revenue: 12500000, ratio: 2.40, unitOutput: 2.40, changeRate: 2.8 },
            { category: '床位成本', cost: 3800000, revenue: 15200000, ratio: 4.00, unitOutput: 4.00, changeRate: 1.2 },
            { category: '物资成本', cost: 4500000, revenue: 9800000, ratio: 2.18, unitOutput: 2.18, changeRate: 4.2 },
            { category: '能耗成本', cost: 1200000, revenue: 2800000, ratio: 2.33, unitOutput: 2.33, changeRate: 5.8 },
            { category: '管理成本', cost: 1800000, revenue: 4200000, ratio: 2.33, unitOutput: 2.33, changeRate: 2.5 }
        ],
        staffSuggestions: {
            internal: "内科建议增加2-3名护士，优化医生与护士比例至1:1.5；加强专科医生培训，提高疑难病例诊疗能力；考虑引入医生助理岗位，减轻医生工作负担。",
            surgery: "外科建议增加1-2名麻醉医生，优化手术安排；加强术后护理团队建设，缩短患者平均住院日；增加伤口治疗师配置，提高伤口愈合质量。",
            pediatrics: "儿科建议增加3-4名护士，应对儿科患者量大、护理任务重的特点；加强儿童心理学培训，提高医患沟通效率；增加儿科专科 nurse 配置。",
            gynecology: "妇产科建议增加1名超声医生，提高产前检查效率；优化产房人员配置，确保分娩安全；加强产后康复团队建设。",
            neurology: "神经内科建议增加2名专科护士，加强神经重症护理；引进神经电生理技术人员，提高神经功能评估能力；增加康复治疗师配置。",
            cardiology: "心内科建议增加2名心导管室护士，优化介入手术流程；加强心电监护团队建设，提高心血管急症处理能力；增加心脏康复治疗师配置。",
            orthopedics: "骨科建议增加2名康复治疗师，促进患者术后功能恢复；优化手术室人员配置，提高手术周转率；加强骨科专科 nurse 培训。",
            ophthalmology: "眼科建议增加1名验光师，提高门诊诊疗效率；优化手术室人员配置，增加日间手术比例；加强眼底检查技术人员培训。",
            dermatology: "皮肤科建议增加1名激光治疗师，扩展皮肤科治疗范围；优化门诊护理流程，提高患者满意度；增加皮肤病理技术人员配置。",
            ent: "耳鼻喉科建议增加1名听力师，完善听力检查服务；优化手术安排，提高手术效率；加强嗓音治疗团队建设。"
        },
        equipmentSuggestions: {
            internal: "内科建议增加1台动态心电监护仪，提高心律失常诊断能力；升级现有肺功能仪，扩展呼吸系统疾病评估范围；考虑引入远程监测设备，加强出院患者管理。",
            surgery: "外科建议增加1台腹腔镜系统，提高微创手术比例；升级手术显微镜，提高精细手术质量；考虑引入手术机器人，提升复杂手术能力。",
            pediatrics: "儿科建议增加1台儿童专用呼吸机，提高儿科重症救治能力；升级儿童专用超声设备，提高儿科影像学诊断准确性；考虑引入儿童发育评估系统。",
            gynecology: "妇产科建议升级现有宫腔镜系统，提高宫腔疾病诊断治疗能力；增加胎儿监护仪数量，保障产房安全；考虑引入盆底功能评估治疗系统。",
            neurology: "神经内科建议增加1台脑电图机，提高神经电生理诊断能力；升级经颅多普勒超声仪，完善脑血管疾病评估；考虑引入神经康复训练设备。",
            cardiology: "心内科建议升级DSA设备，提高心血管介入手术质量；增加运动平板数量，扩展心脏功能评估能力；考虑引入心脏超声造影技术。",
            orthopedics: "骨科建议增加1台C型臂X光机，提高骨科手术精准度；升级骨密度检测仪，加强骨质疏松症管理；考虑引入3D打印技术，个性化定制骨科植入物。",
            ophthalmology: "眼科建议升级现有光学相干断层扫描仪，提高视网膜疾病诊断能力；增加角膜地形图仪，完善屈光手术评估；考虑引入干眼治疗设备。",
            dermatology: "皮肤科建议增加1台点阵激光设备，扩展皮肤科治疗范围；升级皮肤镜系统，提高色素性疾病诊断准确性；考虑引入光动力治疗设备。",
            ent: "耳鼻喉科建议增加1台电子喉镜，提高咽喉疾病诊断能力；升级听力检测设备，完善听力障碍评估；考虑引入眩晕治疗系统。"
        },
        bedSuggestions: {
            internal: "内科目前床位使用率95%，建议增加10-15张床位，缓解住院压力；优化床位分配，设立呼吸重症监护床位；考虑增加日间病房，提高床位周转效率。",
            surgery: "外科目前床位使用率96%，建议增加8-10张床位；设立快速康复外科专用床位，缩短患者住院时间；优化术后监护床位配置。",
            pediatrics: "儿科目前床位使用率96.7%，建议增加15-20张床位；设立儿童重症监护床位，提高儿科重症救治能力；优化儿童隔离病房配置。",
            gynecology: "妇产科目前床位使用率96%，建议增加5-8张床位；优化产房与产后床位配置比例；考虑增加妇科肿瘤专科床位。",
            neurology: "神经内科目前床位使用率95.6%，建议增加8-10张床位；设立神经重症监护床位，提高神经重症患者救治能力；优化脑血管病康复床位配置。",
            cardiology: "心内科目前床位使用率95%，建议增加8-10张床位；设立心脏重症监护床位，提高心血管急症救治能力；考虑增加心脏康复床位。",
            orthopedics: "骨科目前床位使用率94.5%，建议增加10-12张床位；优化骨折与关节外科床位配置；考虑增加骨科康复床位，促进患者功能恢复。",
            ophthalmology: "眼科目前床位使用率93.3%，建议保持现有床位数量，优化床位管理；增加日间手术比例，提高床位使用效率；考虑设立眼科疾病专科床位。",
            dermatology: "皮肤科目前床位使用率88%，建议保持现有床位数量；优化病房环境，提高患者满意度；考虑增加皮肤科治疗床位，扩展治疗范围。",
            ent: "耳鼻喉科目前床位使用率92%，建议保持现有床位数量；优化手术与非手术患者床位分配；考虑设立耳鼻喉疾病专科床位。"
        },
        efficiencySuggestions: {
            internal: "内科建议优化门诊预约流程，减少患者等待时间；加强多学科协作，提高疑难病例诊疗效率；建立出院患者随访制度，减少再住院率；优化药品管理流程，减少药品浪费。",
            surgery: "外科建议推行快速康复外科理念，缩短患者平均住院日；优化手术安排，提高手术室使用效率；加强围手术期管理，减少手术并发症；建立手术器械管理系统，提高器械周转率。",
            pediatrics: "儿科建议优化门诊流程，减少儿童患者等待时间；加强儿科医护人员沟通技巧培训，提高医患沟通效率；建立儿童慢性病管理体系，提高长期治疗效果；优化儿科用药管理，确保用药安全。",
            gynecology: "妇产科建议推广自然分娩，降低剖宫产率；优化产房工作流程，提高分娩安全性；加强产后康复指导，提高产后恢复质量；建立妇科疾病筛查制度，提高早诊早治率。",
            neurology: "神经内科建议建立脑卒中绿色通道，提高急症救治效率；加强神经康复早期介入，促进患者功能恢复；优化抗癫痫药物管理，提高治疗效果；建立认知障碍筛查评估体系。",
            cardiology: "心内科建议推广心脏康复理念，改善患者长期预后；优化冠心病介入治疗流程，提高手术效率；加强高血压规范化管理，提高血压控制率；建立心力衰竭长期管理体系。",
            orthopedics: "骨科建议推广微创技术，减少手术创伤；优化骨折治疗方案，促进患者早期活动；加强术后康复指导，提高功能恢复质量；建立骨科植入物管理系统，确保医疗安全。",
            ophthalmology: "眼科建议推广日间手术，提高手术效率；优化白内障手术流程，提高手术量；加强糖尿病视网膜病变筛查，高治早期诊断率；建立青光眼长期管理体系。",
            dermatology: "皮肤科建议推广光电治疗技术，扩展治疗范围；优化痤疮规范化治疗方案，高治治疗效果；加强色素性疾病综合治疗，高治患者满意度；建立湿疹、银屑病等慢性病管理体系。",
            ent: "耳鼻喉科建议推广鼻内镜微创手术，减少患者痛苦；优化听力障碍评估流程，高治诊断准确性；加强眩晕疾病综合治疗，高治治疗效果；建立嗓音疾病康复训练体系。"
        },
        costSuggestions: {
            internal: "内科建议优化用药结构，降低高值药品使用比例；加强一次性耗材管理，减少浪费；建立设备维护保养制度，延长设备使用寿命；优化人力资源配置，降低人力成本。",
            surgery: "外科建议加强手术器械管理，减少丢失和损坏；优化植入物采购流程，降低采购成本；加强手术室耗材管理，减少浪费；建立手术成本核算体系，提高成本控制意识。",
            pediatrics: "儿科建议优化儿科用药剂量，减少药品浪费；加强儿科专用设备管理，提高设备使用效率；优化儿科护理流程，提高护理效率；建立儿科成本效益分析体系，促进科室可持续发展。",
            gynecology: "妇产科建议推广自然分娩，降低剖宫产相关成本；优化产科护理流程，提高护理效率；加强妇科手术器械管理，减少损耗；建立妇产科成本控制指标体系，提高成本控制效果。",
            neurology: "神经内科建议优化脑卒中急救流程，降低急救成本；加强神经重症监护管理，减少并发症；优化抗癫痫药物治疗方案，高治成本效益比；建立神经内科疾病成本效益分析体系。",
            cardiology: "心内科建议优化冠心病介入治疗方案，降低手术成本；加强心血管药物管理，减少药物不良反应；优化心力衰竭治疗方案，降低再住院率；建立心血管疾病长期管理成本控制体系。",
            orthopedics: "骨科建议优化植入物选择，降低高值耗材使用比例；加强骨科手术器械管理，减少损耗；优化骨折治疗方案，减少住院时间；建立骨科成本核算与分析体系，高治成本控制水平。",
            ophthalmology: "眼科建议优化白内障手术流程，高治手术效率；加强眼科设备维护保养，延长设备使用寿命；优化眼科用药管理，低治药品成本；建立眼科诊疗项目成本效益分析体系。",
            dermatology: "皮肤科建议优化光电治疗参数，高治治疗效果；加强皮肤科耗材管理，减少浪费；优化皮肤病治疗方案，高治成本效益比；建立皮肤科项目成本核算体系，促进科室可持续发展。",
            ent: "耳鼻喉科建议优化手术流程，高治手术效率；加强听力检测设备管理，高治设备使用效率；优化耳鼻喉疾病治疗方案，高治治疗效果；建立耳鼻喉科成本控制指标体系，高治成本控制水平。"
        },
        spaceAllocation: [
            { area: '门诊区', areaSize: 1200, utilization: 85.3, unitOutput: 2.8, suggestion: '优化候诊区与诊室布局，提高周转效率' },
            { area: '病房区', areaSize: 2400, utilization: 92.1, unitOutput: 3.5, suggestion: '增加日间病房比例，提升床位使用效率' },
            { area: '手术室', areaSize: 600, utilization: 78.5, unitOutput: 4.2, suggestion: '优化术间安排，缩短手术间空置时间' },
            { area: '检验科', areaSize: 500, utilization: 82.6, unitOutput: 3.1, suggestion: '整合检验流程，提升样本处理效率' },
            { area: '影像科', areaSize: 800, utilization: 88.9, unitOutput: 3.8, suggestion: '优化检查预约系统，提高设备使用率' },
            { area: '康复中心', areaSize: 700, utilization: 75.2, unitOutput: 2.4, suggestion: '引入分时段管理，提升日均服务量' }
        ]
    },
    
    state: {
        charts: {},
        currentDepartment: 'internal',
        resourceType: 'all',
        timeUnit: 'month'
    },
    
    // 初始化页面
    init: function() {
        this.initCharts();
        this.initEventListeners();
        this.loadData();
    },
    
    // 初始化图表
    initCharts: function() {
        // Helper to find first existing element by candidate IDs
        function getElByIds(ids) {
            for (var i = 0; i < ids.length; i++) {
                var el = document.getElementById(ids[i]);
                if (el) return el;
            }
            return null;
        }
        
        // 初始化图表实例，增加容器ID兜底映射以兼容 department-resource.html
        var resourceTrendEl = getElByIds(['resourceTrendChart', 'bedUsageMonthlyChart']);
        var staffEfficiencyEl = getElByIds(['staffEfficiencyChart', 'staffProductivityChart']);
        var equipmentUtilizationEl = getElByIds(['equipmentUtilizationChart', 'equipmentUsageChart']);
        var bedEfficiencyEl = getElByIds(['bedEfficiencyChart', 'bedUsageWeeklyChart']);
        var resourceEfficiencyEl = getElByIds(['resourceEfficiencyChart', 'resourceEfficiencyRadarChart']);
        var bedDeptCompareEl = getElByIds(['bedUsageDepartmentComparisonChart']);
        var staffStructureEl = getElByIds(['staffStructureChart']);
        var staffCostEl = getElByIds(['staffCostChart']);
        var spaceAllocationEl = getElByIds(['spaceAllocationChart']);
        
        // 医生专项分析图表
        var doctorStructureEl = getElByIds(['doctorStructureChart']);
        var doctorEfficiencyEl = getElByIds(['doctorEfficiencyChart']);
        var doctorProductivityEl = getElByIds(['doctorProductivityChart']);
        
        if (resourceTrendEl && typeof echarts !== 'undefined') {
            this.state.charts.resourceTrendChart = echarts.init(resourceTrendEl);
            this.initResourceTrendChart();
        }
        if (staffEfficiencyEl && typeof echarts !== 'undefined') {
            this.state.charts.staffEfficiencyChart = echarts.init(staffEfficiencyEl);
            this.initStaffEfficiencyChart();
        }
        if (equipmentUtilizationEl && typeof echarts !== 'undefined') {
            this.state.charts.equipmentUtilizationChart = echarts.init(equipmentUtilizationEl);
            this.initEquipmentUtilizationChart();
        }
        if (bedEfficiencyEl && typeof echarts !== 'undefined') {
            this.state.charts.bedEfficiencyChart = echarts.init(bedEfficiencyEl);
            this.initBedEfficiencyChart();
        }
        if (resourceEfficiencyEl && typeof echarts !== 'undefined') {
            this.state.charts.resourceEfficiencyChart = echarts.init(resourceEfficiencyEl);
            this.initResourceEfficiencyChart && this.initResourceEfficiencyChart();
        }
        if (bedDeptCompareEl && typeof echarts !== 'undefined') {
            this.state.charts.bedUsageDepartmentComparisonChart = echarts.init(bedDeptCompareEl);
            this.initBedUsageDepartmentComparisonChart && this.initBedUsageDepartmentComparisonChart();
        }
        if (staffStructureEl && typeof echarts !== 'undefined') {
            this.state.charts.staffStructureChart = echarts.init(staffStructureEl);
            this.initStaffStructureChart && this.initStaffStructureChart();
        }
        if (staffCostEl && typeof echarts !== 'undefined') {
            this.state.charts.staffCostChart = echarts.init(staffCostEl);
            this.initStaffCostChart && this.initStaffCostChart();
        }
        if (spaceAllocationEl && typeof echarts !== 'undefined') {
            this.state.charts.spaceAllocationChart = echarts.init(spaceAllocationEl);
            this.initSpaceAllocationChart && this.initSpaceAllocationChart();
        }
        
        // 医生专项分析图表初始化
        if (doctorStructureEl && typeof echarts !== 'undefined') {
            this.state.charts.doctorStructureChart = echarts.init(doctorStructureEl);
            this.initDoctorStructureChart && this.initDoctorStructureChart();
        }
        if (doctorEfficiencyEl && typeof echarts !== 'undefined') {
            this.state.charts.doctorEfficiencyChart = echarts.init(doctorEfficiencyEl);
            this.initDoctorEfficiencyChart && this.initDoctorEfficiencyChart();
        }
        if (doctorProductivityEl && typeof echarts !== 'undefined') {
            this.state.charts.doctorProductivityChart = echarts.init(doctorProductivityEl);
            this.initDoctorProductivityChart && this.initDoctorProductivityChart();
        }
        
        // 窗口尺寸变化时自适应
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', function() {
                Object.keys(DepartmentResourcesPage.state.charts).forEach(function(key) {
                    var chart = DepartmentResourcesPage.state.charts[key];
                    if (chart && chart.resize) chart.resize();
                });
            });
        }
    },

    // 更新资源趋势图
    updateResourceTrendChart: function() {
        // 根据资源类型筛选数据
        var legendData = ['人员利用率', '设备利用率', '床位使用率', '资源效率指数'];
        var series = this.mockData.resourceTrend;
        
        if (this.state.resourceType !== 'all') {
            var filteredLegend = [];
            if (this.state.resourceType === 'staff') {
                filteredLegend = ['人员利用率'];
            } else if (this.state.resourceType === 'equipment') {
                filteredLegend = ['设备利用率'];
            } else if (this.state.resourceType === 'bed') {
                filteredLegend = ['床位使用率'];
            } else if (this.state.resourceType === 'material') {
                filteredLegend = ['资源效率指数'];
            }
            
            legendData = filteredLegend;
        }
        
        // 构建series数组
        var seriesArray = legendData.map(function(legendName) {
            var color = '#1890ff';
            if (legendName === '设备利用率') color = '#52c41a';
            else if (legendName === '床位使用率') color = '#faad14';
            else if (legendName === '资源效率指数') color = '#ff4d4f';
            
            return {
                name: legendName,
                type: 'line',
                data: series.map(function(item) { return item[legendName]; }),
                smooth: true,
                lineStyle: {
                    width: 3
                },
                itemStyle: {
                    color: color
                }
            };
        });
        
        // 更新图表数据
        this.state.charts.resourceTrendChart.setOption({
            legend: {
                data: legendData
            },
            series: seriesArray
        });
    },
    
    // 初始化人员效率图
    initStaffEfficiencyChart: function() {
        var option = {
            title: {
                text: '人员效率分析',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['人均工作量', '人均收入', '效率指数'],
                bottom: 10
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: this.mockData.staffEfficiency.map(function(item) { return item.type; }),
                axisLabel: {
                    interval: 0,
                    rotate: 30
                }
            },
            yAxis: [
                {
                    type: 'value',
                    name: '工作量',
                    position: 'left'
                },
                {
                    type: 'value',
                    name: '收入(元)',
                    position: 'right'
                },
                {
                    type: 'value',
                    name: '指数',
                    position: 'right',
                    show: false
                }
            ],
            series: [
                {
                    name: '人均工作量',
                    type: 'bar',
                    data: this.mockData.staffEfficiency.map(function(item) { return item.workload; })
                },
                {
                    name: '人均收入',
                    type: 'bar',
                    yAxisIndex: 1,
                    data: this.mockData.staffEfficiency.map(function(item) { return item.revenue / 1000; }),
                    itemStyle: {
                        color: '#52c41a'
                    }
                },
                {
                    name: '效率指数',
                    type: 'line',
                    yAxisIndex: 2,
                    data: this.mockData.staffEfficiency.map(function(item) { return item.efficiency; }),
                    smooth: true,
                    lineStyle: {
                        width: 3
                    },
                    itemStyle: {
                        color: '#ff4d4f'
                    },
                    symbolSize: 10
                }
            ]
        };
        
        this.state.charts.staffEfficiencyChart.setOption(option);
    },
    
    // 更新人员效率图
    updateStaffEfficiencyChart: function() {
        // 人员效率图表数据通常是固定的，这里使用固定数据
    },
    
    // 初始化设备使用图
    initEquipmentUtilizationChart: function() {
        var option = {
            title: {
                text: '设备使用分析',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['使用率', '日均使用时长', '故障率'],
                bottom: 10
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: this.mockData.equipmentUtilization.slice(0, 8).map(function(item) { return item.name; }),
                axisLabel: {
                    interval: 0,
                    rotate: 30
                }
            },
            yAxis: [
                {
                    type: 'value',
                    name: '使用率(%)',
                    position: 'left'
                },
                {
                    type: 'value',
                    name: '时长(小时)',
                    position: 'right'
                },
                {
                    type: 'value',
                    name: '故障率(%)',
                    position: 'right',
                    show: false
                }
            ],
            series: [
                {
                    name: '使用率',
                    type: 'bar',
                    data: this.mockData.equipmentUtilization.slice(0, 8).map(function(item) { return item.utilization; })
                },
                {
                    name: '日均使用时长',
                    type: 'line',
                    yAxisIndex: 1,
                    data: this.mockData.equipmentUtilization.slice(0, 8).map(function(item) { return item.dailyHours; }),
                    smooth: true,
                    lineStyle: {
                        width: 3
                    },
                    itemStyle: {
                        color: '#52c41a'
                    },
                    symbolSize: 10
                },
                {
                    name: '故障率',
                    type: 'line',
                    yAxisIndex: 2,
                    data: this.mockData.equipmentUtilization.slice(0, 8).map(function(item) { return item.failureRate; }),
                    smooth: true,
                    lineStyle: {
                        width: 3
                    },
                    itemStyle: {
                        color: '#ff4d4f'
                    },
                    symbolSize: 10
                }
            ]
        };
        
        this.state.charts.equipmentUtilizationChart.setOption(option);
    },
    
    // 更新设备使用图
    updateEquipmentUtilizationChart: function() {
        // 设备使用图表数据通常是固定的，这里使用固定数据
    },
    
    // 初始化床位效率图
    initBedEfficiencyChart: function() {
        var option = {
            title: {
                text: '床位效率分析',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['床位使用率', '平均住院日', '床位周转率'],
                bottom: 10
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: this.mockData.bedEfficiency.slice(0, 8).map(function(item) { return item.department; }),
                axisLabel: {
                    interval: 0,
                    rotate: 30
                }
            },
            yAxis: [
                {
                    type: 'value',
                    name: '使用率(%)',
                    position: 'left'
                },
                {
                    type: 'value',
                    name: '天数/次数',
                    position: 'right'
                }
            ],
            series: [
                {
                    name: '床位使用率',
                    type: 'bar',
                    data: this.mockData.bedEfficiency.slice(0, 8).map(function(item) { return item.utilization; })
                },
                {
                    name: '平均住院日',
                    type: 'line',
                    yAxisIndex: 1,
                    data: this.mockData.bedEfficiency.slice(0, 8).map(function(item) { return item.avgStay; }),
                    smooth: true,
                    lineStyle: {
                        width: 3
                    },
                    itemStyle: {
                        color: '#52c41a'
                    },
                    symbolSize: 10
                },
                {
                    name: '床位周转率',
                    type: 'line',
                    yAxisIndex: 1,
                    data: this.mockData.bedEfficiency.slice(0, 8).map(function(item) { return item.turnoverRate; }),
                    smooth: true,
                    lineStyle: {
                        width: 3
                    },
                    itemStyle: {
                        color: '#ff4d4f'
                    },
                    symbolSize: 10
                }
            ]
        };
        
        this.state.charts.bedEfficiencyChart.setOption(option);
    },
    
    // 更新床位效率图
    updateBedEfficiencyChart: function() {
        // 根据当前选中科室筛选数据
        var filteredData = this.mockData.bedEfficiency;
        if (this.state.resourceType !== 'all' && this.state.resourceType === 'bed') {
            filteredData = filteredData.filter(function(item) {
                return DepartmentResourcesPage.getDepartmentName(DepartmentResourcesPage.state.currentDepartment) === item.department;
            });
        }
        
        // 限制显示数据量
        filteredData = filteredData.slice(0, 8);
        
        // 更新图表数据
        this.state.charts.bedEfficiencyChart.setOption({
            xAxis: {
                data: filteredData.map(function(item) { return item.department; })
            },
            series: [
                {
                    data: filteredData.map(function(item) { return item.utilization; })
                },
                {
                    data: filteredData.map(function(item) { return item.avgStay; })
                },
                {
                    data: filteredData.map(function(item) { return item.turnoverRate; })
                }
            ]
        });
    },
    
    // 初始化资源利用效率图
    initResourceEfficiencyChart: function() {
        var option = {
            title: {
                text: '资源利用效率',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function(params) {
                    var result = params[0].name + '<br/>';
                    params.forEach(function(param) {
                        if (param.seriesName === '目标值') {
                            result += param.marker + param.seriesName + ': ' + param.value + '<br/>';
                        } else if (param.seriesName === '实际值') {
                            result += param.marker + param.seriesName + ': ' + param.value + '<br/>';
                            result += '完成率: ' + (param.value / params[1].value * 100).toFixed(1) + '%<br/>';
                        } else {
                            result += param.marker + param.seriesName + ': ' + param.value + '<br/>';
                        }
                    });
                    return result;
                }
            },
            legend: {
                data: ['实际值', '目标值', '同比变化'],
                bottom: 10
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: this.mockData.resourceEfficiency.map(function(item) { return item.name; }),
                axisLabel: {
                    interval: 0,
                    rotate: 30
                }
            },
            yAxis: [
                {
                    type: 'value',
                    name: '效率值',
                    position: 'left'
                },
                {
                    type: 'value',
                    name: '变化率(%)',
                    position: 'right'
                }
            ],
            series: [
                {
                    name: '实际值',
                    type: 'bar',
                    data: this.mockData.resourceEfficiency.map(function(item) { return item.value; })
                },
                {
                    name: '目标值',
                    type: 'bar',
                    data: this.mockData.resourceEfficiency.map(function(item) { return item.target; }),
                    itemStyle: {
                        color: '#d9d9d9'
                    }
                },
                {
                    name: '同比变化',
                    type: 'line',
                    yAxisIndex: 1,
                    data: this.mockData.resourceEfficiency.map(function(item) { return item.changeRate; }),
                    smooth: true,
                    lineStyle: {
                        width: 3
                    },
                    itemStyle: {
                        color: '#faad14'
                    },
                    symbolSize: 10
                }
            ]
        };
        
        this.state.charts.resourceEfficiencyChart.setOption(option);
    },
    
    // 更新资源利用效率图
    updateResourceEfficiencyChart: function() {
        // 资源利用效率图表数据通常是固定的，这里使用固定数据
    },
    
    // 更新建议内容
    updateSuggestions: function() {
        var deptCode = this.state.currentDepartment;
        
        // 更新人员配置建议
        var staffEl = document.getElementById('staffSuggestion');
        if (staffEl) {
            staffEl.textContent = this.mockData.staffSuggestions[deptCode] || 
                "根据人员效率分析数据，建议优化人员配置，提高工作效率。";
        }
        
        // 更新设备配置建议
        var equipEl = document.getElementById('equipmentSuggestion');
        if (equipEl) {
            equipEl.textContent = this.mockData.equipmentSuggestions[deptCode] || 
                "根据设备使用分析数据，建议优化设备配置，提高设备使用效率。";
        }
        
        // 更新床位配置建议
        var bedEl = document.getElementById('bedSuggestion');
        if (bedEl) {
            bedEl.textContent = this.mockData.bedSuggestions[deptCode] || 
                "根据床位效率分析数据，建议优化床位配置，提高床位使用效率。";
        }
        
        // 更新资源利用效率提升建议
        var effEl = document.getElementById('efficiencySuggestion');
        if (effEl) {
            effEl.textContent = this.mockData.efficiencySuggestions[deptCode] || 
                "通过数据分析，建议优化诊疗流程，提高资源使用效率。";
        }
        
        // 更新成本控制建议
        var costEl = document.getElementById('costSuggestion');
        if (costEl) {
            costEl.textContent = this.mockData.costSuggestions[deptCode] || 
                "根据成本效益分析数据，建议加强成本控制，提高经济效益。";
        }
    },
    
    // 导出报告
    exportReport: function(type) {
        var msg = '报告导出功能触发';
        if (type) {
            msg += '：' + (type.toUpperCase());
        }
        msg += '（后续可集成后端API生成报告）';
        alert(msg);
    },
    
    // 自定义报告
    customReport: function() {
        alert('自定义报告功能已触发，实际项目中会弹出自定义报告配置对话框');
        // 实际项目中，这里会弹出自定义报告配置对话框
    },
    
    // 格式化货币
    formatCurrency: function(value) {
        if (typeof value !== 'number') return value;
        
        return '¥' + value.toLocaleString();
    },
    
    // 获取科室名称
    getDepartmentName: function(deptCode) {
        var deptMap = {
            'internal': '内科',
            'surgery': '外科',
            'pediatrics': '儿科',
            'gynecology': '妇产科',
            'neurology': '神经内科',
            'cardiology': '心内科',
            'orthopedics': '骨科',
            'ophthalmology': '眼科',
            'dermatology': '皮肤科',
            'ent': '耳鼻喉科'
        };
        
        return deptMap[deptCode] || deptCode;
    }
};

// 动态加载器与导出功能实现
(function(){
    // 通用脚本加载器
    DepartmentResourcesPage._ensureScript = function(src, testFn) {
        return new Promise(function(resolve, reject){
            try {
                if (typeof testFn === 'function' && testFn()) return resolve();
                // 防重复加载
                if (document.querySelector('script[data-dynamic-src="' + src + '"]')) {
                    // 已存在，等待加载完成
                    var check = setInterval(function(){
                        if (typeof testFn === 'function' && testFn()) {
                            clearInterval(check);
                            resolve();
                        }
                    }, 100);
                    // 超时保护
                    setTimeout(function(){ clearInterval(check); resolve(); }, 5000);
                    return;
                }
                var s = document.createElement('script');
                s.src = src;
                s.async = true;
                s.setAttribute('data-dynamic-src', src);
                s.onload = function(){ resolve(); };
                s.onerror = function(){ reject(new Error('脚本加载失败: ' + src)); };
                document.head.appendChild(s);
            } catch(err) {
                reject(err);
            }
        });
    };

    DepartmentResourcesPage.ensureHtml2pdf = function() {
        var url = './js/html2pdf.bundle.min.js';
        return DepartmentResourcesPage._ensureScript(url, function(){ return typeof window.html2pdf !== 'undefined'; });
    };

    DepartmentResourcesPage.ensureXLSX = function() {
        var url = './js/xlsx.full.min.js';
        return DepartmentResourcesPage._ensureScript(url, function(){ return typeof window.XLSX !== 'undefined'; });
    };

    // 将表格转为二维数组
    DepartmentResourcesPage.tableToAOA = function(tableEl){
        var aoa = [];
        if (!tableEl) return aoa;
        tableEl.querySelectorAll('tr').forEach(function(tr){
            var row = [];
            tr.querySelectorAll('th,td').forEach(function(td){
                var text = (td.innerText || td.textContent || '').trim();
                row.push(text);
            });
            if (row.length) aoa.push(row);
        });
        return aoa;
    };

    // CSV 工具
    DepartmentResourcesPage._csvEscape = function(val){
        if (val == null) return '';
        var s = String(val).replace(/\r?\n/g, ' ');
        if (/[",]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
        return s;
    };
    DepartmentResourcesPage.tableToCSV = function(tableEl){
        var aoa = DepartmentResourcesPage.tableToAOA(tableEl);
        return aoa.map(function(row){ return row.map(DepartmentResourcesPage._csvEscape).join(','); }).join('\r\n');
    };
    DepartmentResourcesPage._downloadCSV = function(csv, filename){
        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        DepartmentResourcesPage._saveBlob(blob, filename);
    };

    // DataURL 与保存
    DepartmentResourcesPage._dataURLtoBlob = function(dataurl){
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]);
        var n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) u8arr[n] = bstr.charCodeAt(n);
        return new Blob([u8arr], {type: mime});
    };
    DepartmentResourcesPage._saveBlob = function(blob, filename){
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // 导出 PDF
    DepartmentResourcesPage.exportToPDF = function(){
        var target = document.querySelector('.content') || document.querySelector('.container') || document.body;
        if (window.Common && Common.Export && typeof Common.Export.exportToPDF === 'function') {
            Common.Export.exportToPDF(target, { filename: '科室资源分析报告.pdf' }).catch(function(e){
                alert('导出PDF失败: ' + (e && e.message || e));
                console.error(e);
            });
        } else {
            alert('导出模块未就绪，请稍后重试');
        }
    };

    // 导出 Excel（多表格多Sheet）
    DepartmentResourcesPage.exportToExcel = function(){
        var tableIds = ['bedUsageTable','staffAnalysisTable','equipmentAnalysisTable','spaceAnalysisTable','optimizationSuggestionsTable'];
        var tables = tableIds.map(function(id){ return document.getElementById(id); }).filter(Boolean);
        if (!tables.length) { alert('未找到可导出的表格'); return; }
        if (window.Common && Common.Export && typeof Common.Export.exportToExcel === 'function') {
            Common.Export.exportToExcel(tables, '科室资源分析.xlsx');
        } else {
            alert('导出模块未就绪，请稍后重试');
        }
    };

    // 导出图表为 PNG
    DepartmentResourcesPage.exportCharts = function(){
        if (!DepartmentResourcesPage.state || !DepartmentResourcesPage.state.charts) {
            alert('图表尚未初始化');
            return;
        }
        var charts = DepartmentResourcesPage.state.charts;
        var exported = 0;
        Object.keys(charts).forEach(function(key){
            var inst = charts[key];
            if (inst && typeof inst.getDataURL === 'function') {
                try {
                    var dataURL = inst.getDataURL({ type: 'png', pixelRatio: 2, backgroundColor: '#ffffff' });
                    var blob = DepartmentResourcesPage._dataURLtoBlob(dataURL);
                    var filename = (key || 'chart') + '.png';
                    DepartmentResourcesPage._saveBlob(blob, filename);
                    exported++;
                } catch(e) {
                    console.error('导出图表失败:', key, e);
                }
            }
        });
        if (!exported) alert('未找到可导出的图表');
    };
})();

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 统一通过 Common.ensureEcharts 加载 ECharts
    if (typeof Common !== 'undefined' && typeof Common.ensureEcharts === 'function') {
        try {
            Common.ensureEcharts();
        } catch (e) {
            console.warn('ensureEcharts 调用失败:', e);
        }
    }

    // 如果 ECharts 已就绪，直接初始化；否则等待全局事件
    if (typeof echarts !== 'undefined') {
        DepartmentResourcesPage.init();
    } else {
        const onReady = function() {
            document.removeEventListener('echartsLoaded', onReady);
            DepartmentResourcesPage.init();
        };
        document.addEventListener('echartsLoaded', onReady);
    }
});

// 绑定导出按钮
DepartmentResourcesPage.initEventListeners = function() {
    // 导出按钮事件绑定
    var excelBtn = document.getElementById('exportExcelBtn');
    if (excelBtn) {
        excelBtn.addEventListener('click', function() {
            DepartmentResourcesPage.exportToExcel();
        });
    }
    var pdfBtn = document.getElementById('exportPdfBtn');
    if (pdfBtn) {
        pdfBtn.addEventListener('click', function() {
            DepartmentResourcesPage.exportToPDF();
        });
    }
    var chartBtn = document.getElementById('exportChartBtn');
    if (chartBtn) {
        chartBtn.addEventListener('click', function() {
            DepartmentResourcesPage.exportCharts();
        });
    }

    // 过滤控件事件绑定
    var resourceTypeSel = document.getElementById('resourceType');
    if (resourceTypeSel) {
        resourceTypeSel.addEventListener('change', function() {
            DepartmentResourcesPage.loadData();
        });
    }
    var deptSel = document.getElementById('department');
    if (deptSel) {
        deptSel.addEventListener('change', function() {
            DepartmentResourcesPage.loadData();
        });
    }
    var timeSel = document.getElementById('timeRange');
    if (timeSel) {
        timeSel.addEventListener('change', function() {
            DepartmentResourcesPage.loadData();
        });
    }
    var refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            DepartmentResourcesPage.loadData();
        });
    }

    // “资源优化建议”表事件委托：点击“详情”打开弹窗
    var sugTable = document.getElementById('optimizationSuggestionsTable');
    if (sugTable) {
        sugTable.addEventListener('click', function(e) {
            var target = e.target;
            if (target && target.classList && target.classList.contains('suggestion-detail-btn')) {
                var skey = target.getAttribute('data-skey');
                if (skey) {
                    DepartmentResourcesPage.openSuggestionModal(skey);
                }
            }
        });
    }
};

// 初始化资源趋势图（补充基础坐标轴等配置）
DepartmentResourcesPage.initResourceTrendChart = function() {
    var months = DepartmentResourcesPage.mockData.resourceTrend.map(function(item) { return item.month; });
    var legendData = ['人员利用率', '设备利用率', '床位使用率', '资源效率指数'];
    var series = DepartmentResourcesPage.mockData.resourceTrend;
    var seriesArray = legendData.map(function(legendName) {
        var color = '#1890ff';
        if (legendName === '设备利用率') color = '#52c41a';
        else if (legendName === '床位使用率') color = '#faad14';
        else if (legendName === '资源效率指数') color = '#ff4d4f';
        return {
            name: legendName,
            type: 'line',
            data: series.map(function(item) { return item[legendName]; }),
            smooth: true,
            lineStyle: { width: 3 },
            itemStyle: { color: color }
        };
    });
    DepartmentResourcesPage.state.charts.resourceTrendChart.setOption({
        title: { text: '资源效率趋势', left: 'center' },
        tooltip: { trigger: 'axis' },
        legend: { data: legendData, bottom: 10 },
        grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
        xAxis: { type: 'category', data: months, axisLabel: { interval: 0, rotate: 30 } },
        yAxis: { type: 'value', name: '指标(%)' },
        series: seriesArray
    });
    // 初始化后根据当前资源类型进行过滤更新
    DepartmentResourcesPage.updateResourceTrendChart();
};

// 数据加载与渲染
DepartmentResourcesPage.loadData = function() {
    // 读取筛选项
    var resourceTypeSel = document.getElementById('resourceType');
    var deptSel = document.getElementById('department');
    var timeSel = document.getElementById('timeRange');

    var rt = resourceTypeSel ? resourceTypeSel.value : 'all';
    var typeMap = { all: 'all', human: 'staff', equipment: 'equipment', bed: 'bed', space: 'all' };
    this.state.resourceType = typeMap[rt] || 'all';

    var deptCode = 'internal';
    if (deptSel) {
        switch (String(deptSel.value)) {
            case '1': deptCode = 'cardiology'; break; // 心内科
            case '2': deptCode = 'orthopedics'; break; // 骨科
            case '3': deptCode = 'neurology'; break; // 神经外科 -> 归并神经内科建议
            case '4': deptCode = 'internal'; break; // 消化内科 -> 归并内科
            case '5': deptCode = 'internal'; break; // 呼吸内科 -> 归并内科
            case '6': deptCode = 'neurology'; break; // 神经内科
            case '7': deptCode = 'gynecology'; break; // 妇产科
            case '8': deptCode = 'pediatrics'; break; // 儿科
            default: deptCode = 'internal';
        }
    }
    this.state.currentDepartment = deptCode;
    this.state.timeUnit = timeSel ? timeSel.value : 'month';

    // 更新图表
    if (this.state.charts && this.state.charts.resourceTrendChart) this.updateResourceTrendChart();
    if (this.state.charts && this.state.charts.staffEfficiencyChart) this.updateStaffEfficiencyChart();
    if (this.state.charts && this.state.charts.equipmentUtilizationChart) this.updateEquipmentUtilizationChart();
    if (this.state.charts && this.state.charts.bedEfficiencyChart) this.updateBedEfficiencyChart();
    if (this.state.charts && this.state.charts.resourceEfficiencyChart) this.updateResourceEfficiencyChart();
    // 新增图表更新
    if (this.state.charts && this.state.charts.bedUsageDepartmentComparisonChart) this.updateBedUsageDepartmentComparisonChart();
    if (this.state.charts && this.state.charts.staffStructureChart) this.updateStaffStructureChart();
    if (this.state.charts && this.state.charts.staffCostChart) this.updateStaffCostChart();
    if (this.state.charts && this.state.charts.spaceAllocationChart) this.updateSpaceAllocationChart();
    // 医生专项分析图表更新
    if (this.state.charts && this.state.charts.doctorStructureChart) this.initDoctorStructureChart();
    if (this.state.charts && this.state.charts.doctorEfficiencyChart) this.initDoctorEfficiencyChart();
    if (this.state.charts && this.state.charts.doctorProductivityChart) this.initDoctorProductivityChart();

    // 渲染表格
    this.renderBedUsageTable();
    this.renderStaffAnalysisTable();
    this.renderEquipmentAnalysisTable();
    // 新增：空间资源利用分析表
    this.renderSpaceAnalysisTable();
    // 新增：医生效率与效益分析表
    this.renderDoctorAnalysisTable();
    this.renderOptimizationSuggestionsTable();

    // 更新建议摘要
    this.updateSuggestions && this.updateSuggestions();
};

DepartmentResourcesPage.renderBedUsageTable = function() {
    var table = document.querySelector('#bedUsageTable tbody');
    if (!table) return;
    var rowsHtml = '';
    var data = this.mockData.resourceTrend || [];
    var openBeds = 100;

    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var usage = Number(item['床位使用率']) || 0;
        var prev = i > 0 ? (Number(data[i - 1]['床位使用率']) || 0) : null;
        var mom = prev !== null ? (usage - prev).toFixed(1) + '%' : '-';
        var yoy = '-'; // 无历年数据，这里暂不计算
        var occDays = Math.round(openBeds * usage / 100 * 30);
        var target = 95;
        var statusText = usage >= target ? '达标' : '待提升';
        rowsHtml += '<tr>' +
            '<td>' + (item.month || '') + '</td>' +
            '<td>' + usage.toFixed(1) + '%</td>' +
            '<td>' + mom + '</td>' +
            '<td>' + yoy + '</td>' +
            '<td>' + openBeds + '</td>' +
            '<td>' + occDays + '</td>' +
            '<td>' + target + '%</td>' +
            '<td>' + statusText + '</td>' +
        '</tr>';
    }
    table.innerHTML = rowsHtml;
};

DepartmentResourcesPage.renderStaffAnalysisTable = function() {
    var table = document.querySelector('#staffAnalysisTable tbody');
    if (!table) return;
    var rowsHtml = '';
    var data = this.mockData.staffEfficiency || [];
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var revenue = Number(item.revenue) || 0;
        var cost = Math.round(revenue * 0.6);
        var ratio = cost ? (revenue / cost).toFixed(2) : '-';
        rowsHtml += '<tr>' +
            '<td>' + (item.type || '') + '</td>' +
            '<td>' + (item.count || 0) + '</td>' +
            '<td>' + (item.workload != null ? item.workload : '-') + '</td>' +
            '<td>' + this.formatCurrency(revenue) + '</td>' +
            '<td>' + this.formatCurrency(cost) + '</td>' +
            '<td>' + ratio + '</td>' +
            '<td>' + (item.efficiency != null ? item.efficiency.toFixed(1) + '%' : '-') + '</td>' +
        '</tr>';
    }
    table.innerHTML = rowsHtml;
};

DepartmentResourcesPage.renderEquipmentAnalysisTable = function() {
    var table = document.querySelector('#equipmentAnalysisTable tbody');
    if (!table) return;
    var rowsHtml = '';
    var data = this.mockData.equipmentUtilization || [];
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var idx = i;
        var type = item.type || '';
        var base = 1500000;
        if (type.indexOf('影像') >= 0) base = 8000000;
        else if (type.indexOf('手术') >= 0) base = 4000000;
        else if (type.indexOf('检验') >= 0) base = 3000000;
        var invest = base;
        var utilization = Number(item.utilization) || 0;
        var goodRate = Math.max(0, Math.min(100, 100 - (Number(item.failureRate) || 0))).toFixed(1);
        var monthlyIncome = invest * (utilization / 100) * 0.06; // 简化估算
        var paybackYears = monthlyIncome > 0 ? (invest / (monthlyIncome * 12)).toFixed(1) + '年' : '-';
        var purchaseDate = (2020 + (idx % 4)) + '-' + String(((idx * 3) % 12) + 1).padStart(2, '0') + '-15';

        rowsHtml += '<tr>' +
            '<td>' + (item.name || '') + '</td>' +
            '<td>' + (item.type || '-') + '</td>' +
            '<td>' + purchaseDate + '</td>' +
            '<td>' + this.formatCurrency(invest) + '</td>' +
            '<td>' + utilization.toFixed(1) + '%</td>' +
            '<td>' + goodRate + '%</td>' +
            '<td>' + this.formatCurrency(Math.round(monthlyIncome)) + '</td>' +
            '<td>' + paybackYears + '</td>' +
        '</tr>';
    }
    table.innerHTML = rowsHtml;
};

// 建议工作流与持久化工具方法
DepartmentResourcesPage._statusText = function(status) {
    var map = { draft: '草稿', pending: '待审核', published: '已发布', withdrawn: '已撤回', archived: '已归档' };
    return map[status] || '草稿';
};
DepartmentResourcesPage._computeSuggestionKey = function(dept, category) {
    return 'res_sug::' + (dept || 'internal') + '::' + (category || '');
};
DepartmentResourcesPage._getStore = function() {
    try { var raw = localStorage.getItem('dept_res_suggestions'); return raw ? JSON.parse(raw) : {}; } catch(e) { return {}; }
};
DepartmentResourcesPage._saveStore = function(store) {
    try { localStorage.setItem('dept_res_suggestions', JSON.stringify(store || {})); } catch(e) {}
};
DepartmentResourcesPage._getSuggestion = function(key) {
    var store = this._getStore();
    return store[key] || null;
};
DepartmentResourcesPage._ensureSuggestionRecord = function(key, seed) {
    var store = this._getStore();
    if (!store[key]) {
        store[key] = {
            id: key,
            category: (seed && seed.category) || '',
            department: this.state.currentDepartment || 'internal',
            problem: (seed && seed.problem) || '-',
            cause: (seed && seed.cause) || '-',
            suggestion: (seed && (seed.text || seed.suggestion)) || '-',
            effect: (seed && seed.effect) || '-',
            deadline: (seed && seed.deadline) || '本季度',
            responsible: (seed && (seed.responsible || (seed.dept ? [seed.dept] : []))) || [],
            cc: (seed && seed.cc) || [],
            status: 'draft',
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        this._saveStore(store);
    }
    return store[key];
};
DepartmentResourcesPage._updateOperationCellStatus = function(key) {
    var btn = document.querySelector('#optimizationSuggestionsTable tbody button.suggestion-detail-btn[data-skey="' + key + '"]');
    if (btn) {
        var rec = this._getSuggestion(key);
        var statusText = this._statusText(rec && rec.status);
        var cell = btn.parentNode;
        var statusSpan = cell.querySelector('.suggestion-status');
        if (!statusSpan) {
            statusSpan = document.createElement('span');
            statusSpan.className = 'suggestion-status';
            statusSpan.style.marginLeft = '6px';
            statusSpan.style.color = '#666';
            cell.appendChild(statusSpan);
        }
        statusSpan.textContent = '[' + statusText + ']';
        // 同步更新该行其他单元格，保持表格与弹窗联动
        var tr = btn.closest('tr');
        if (tr && rec) {
            var tds = tr.querySelectorAll('td');
            if (tds && tds.length >= 9) {
                // 列索引: 0序号 1类别 2问题 3原因 4建议 5责任 6期限 7效果 8操作
                tds[2].textContent = rec.problem || '-';
                tds[3].textContent = rec.cause || '-';
                tds[4].textContent = rec.suggestion || '-';
                tds[5].textContent = (rec.responsible && rec.responsible.join('、')) || '-';
                tds[6].textContent = rec.deadline || '-';
                tds[7].textContent = rec.effect || '-';
            }
        }
    }
};

DepartmentResourcesPage.openSuggestionModal = function(skey) {
    var self = this;
    var rec = self._getSuggestion(skey);
    if (!rec) return; // 理论上已通过 ensure 创建

    var respOptions = ['医务科','设备科','护理部','运营管理部','财务科','信息科','后勤保障部','药学部','检验科','影像科'];
    var ccOptions = ['院办','人事科','质控科','医保办','总务科'];

    function checkboxGroupHtml(name, options, selected) {
        var html = '<div class="checkbox-group">';
        for (var i = 0; i < options.length; i++) {
            var opt = options[i];
            var id = name + '_' + i;
            var checked = selected && selected.indexOf(opt) >= 0 ? 'checked' : '';
            html += '<div class="checkbox-item">' +
                '<input type="checkbox" id="' + id + '" value="' + opt + '" ' + checked + ' />' +
                '<label for="' + id + '">' + opt + '</label>' +
            '</div>';
        }
        html += '</div>';
        return html;
    }

    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay show';
    overlay.innerHTML = '' +
    '<div class="modal-content" role="dialog" aria-modal="true">' +
        '<div class="modal-header">' +
            '<h3>优化建议详情 - ' + (rec.category || '') + '</h3>' +
            '<button class="modal-close" aria-label="关闭">&times;</button>' +
        '</div>' +
        '<div class="modal-body">' +
            '<div class="edit-form">' +
                '<div class="field-group"><label>当前状态</label><span>[' + self._statusText(rec.status) + ']</span></div>' +
                '<div class="field-group"><label>存在问题</label><textarea id="sug_problem" placeholder="请描述当前存在的问题">' + (rec.problem || '') + '</textarea></div>' +
                '<div class="field-group"><label>原因分析</label><textarea id="sug_cause" placeholder="请简要分析原因">' + (rec.cause || '') + '</textarea></div>' +
                '<div class="field-group"><label>优化建议</label><textarea id="sug_suggestion" placeholder="请给出可执行的优化建议">' + (rec.suggestion || '') + '</textarea></div>' +
                '<div class="field-group"><label>预期效果</label><input id="sug_effect" value="' + (rec.effect || '') + '" placeholder="例如：提升工作效率/降低成本率" /></div>' +
                '<div class="field-group"><label>完成期限</label><input id="sug_deadline" value="' + (rec.deadline || '') + '" placeholder="例如：本季度/2025-12-31" /></div>' +
                '<div class="field-group"><label>责任部门</label>' + checkboxGroupHtml('resp', respOptions, rec.responsible || []) + '</div>' +
                '<div class="field-group"><label>抄送部门</label>' + checkboxGroupHtml('cc', ccOptions, rec.cc || []) + '</div>' +
            '</div>' +
        '</div>' +
        '<div class="modal-footer">' +
            '<button class="btn btn-secondary" id="btn_cancel">关闭</button>' +
            '<button class="btn btn-primary" id="btn_save">保存草稿</button>' +
            '<button class="btn btn-warning" id="btn_submit">提交审核</button>' +
            '<button class="btn btn-success" id="btn_publish">发布</button>' +
            '<button class="btn btn-secondary" id="btn_withdraw">撤回</button>' +
            '<button class="btn btn-secondary" id="btn_archive">归档</button>' +
        '</div>' +
    '</div>';

    function getCheckedValues(prefix) {
        var nodes = overlay.querySelectorAll('input[id^="' + prefix + '_"]:checked');
        var arr = [];
        nodes.forEach(function(n){ arr.push(n.value); });
        return arr;
    }
    function validate(recLike) {
        if (!recLike.suggestion || !recLike.suggestion.trim()) {
            alert('请填写“优化建议”');
            return false;
        }
        if (!recLike.responsible || recLike.responsible.length === 0) {
            alert('请至少选择一个“责任部门”');
            return false;
        }
        return true;
    }
    function readForm() {
        return {
            problem: overlay.querySelector('#sug_problem').value || '',
            cause: overlay.querySelector('#sug_cause').value || '',
            suggestion: overlay.querySelector('#sug_suggestion').value || '',
            effect: overlay.querySelector('#sug_effect').value || '',
            deadline: overlay.querySelector('#sug_deadline').value || '',
            responsible: getCheckedValues('resp'),
            cc: getCheckedValues('cc')
        };
    }
    function setButtonsByStatus(st) {
        var canSubmit = st === 'draft' || st === 'withdrawn';
        var canPublish = st === 'pending';
        var canWithdraw = st === 'published';
        overlay.querySelector('#btn_submit').disabled = !canSubmit;
        overlay.querySelector('#btn_publish').disabled = !canPublish;
        overlay.querySelector('#btn_withdraw').disabled = !canWithdraw;
    }
    function saveAndUpdate(newStatus) {
        var store = self._getStore();
        var latest = store[skey] || rec;
        var form = readForm();
        latest.problem = form.problem;
        latest.cause = form.cause;
        latest.suggestion = form.suggestion;
        latest.effect = form.effect;
        latest.deadline = form.deadline;
        latest.responsible = form.responsible;
        latest.cc = form.cc;
        if (newStatus) latest.status = newStatus;
        latest.updatedAt = Date.now();
        store[skey] = latest;
        self._saveStore(store);
        self._updateOperationCellStatus(skey);
    }

    document.body.appendChild(overlay);
    var close = function(){ if (overlay && overlay.parentNode) { overlay.parentNode.removeChild(overlay); } };
    overlay.addEventListener('click', function(e){ if (e.target === overlay) close(); });
    overlay.querySelector('.modal-close').addEventListener('click', close);

    setButtonsByStatus(rec.status);

    overlay.querySelector('#btn_cancel').addEventListener('click', function(){ close(); });
    overlay.querySelector('#btn_save').addEventListener('click', function(){ saveAndUpdate('draft'); alert('已保存为草稿'); close(); });
    overlay.querySelector('#btn_submit').addEventListener('click', function(){
        var next = readForm();
        if (!validate(next)) return;
        saveAndUpdate('pending');
        alert('已提交审核');
        close();
    });
    overlay.querySelector('#btn_publish').addEventListener('click', function(){
        var next = readForm();
        if (!validate(next)) return;
        if (rec.status !== 'pending') { alert('仅“待审核”状态可发布'); return; }
        saveAndUpdate('published');
        alert('已发布');
        close();
    });
    overlay.querySelector('#btn_withdraw').addEventListener('click', function(){
        if (rec.status !== 'published') { alert('仅“已发布”状态可撤回'); return; }
        saveAndUpdate('withdrawn');
        alert('已撤回');
        close();
    });
    overlay.querySelector('#btn_archive').addEventListener('click', function(){
        saveAndUpdate('archived');
        alert('已归档');
        close();
    });
};

DepartmentResourcesPage.renderOptimizationSuggestionsTable = function() {
    var table = document.querySelector('#optimizationSuggestionsTable tbody');
    if (!table) return;
    var dept = this.state.currentDepartment || 'internal';

    function pick(obj, key, fallback) {
        if (!obj) return fallback || '';
        return obj[key] || fallback || '';
    }

    var items = [
        { category: '人力资源', text: pick(this.mockData.staffSuggestions, dept) || '优化人员配置，提升人力效率。', dept: '医务科', deadline: '本季度', effect: '提升工作效率' },
        { category: '设备资源', text: pick(this.mockData.equipmentSuggestions, dept) || '升级关键设备，提升诊疗能力。', dept: '设备科', deadline: '本季度', effect: '提高设备利用率' },
        { category: '床位资源', text: pick(this.mockData.bedSuggestions, dept) || '优化床位配置，提升周转效率', dept: '床位科', deadline: '本季度', effect: '提高床位利用率' }
    ];

    var rowsHtml = '';
    for (var i = 0; i < items.length; i++) {
        var it = items[i];
        var idx = i + 1;
        var skey = this._computeSuggestionKey(dept, it.category);
        this._ensureSuggestionRecord(skey, { category: it.category, text: it.text, dept: it.dept, deadline: it.deadline, effect: it.effect });
        rowsHtml += '<tr>' +
            '<td>' + idx + '</td>' +
            '<td>' + it.category + '</td>' +
            '<td>-</td>' +
            '<td>-</td>' +
            '<td>' + it.text + '</td>' +
            '<td>' + it.dept + '</td>' +
            '<td>' + it.deadline + '</td>' +
            '<td>' + it.effect + '</td>' +
            '<td><button class="btn btn-link suggestion-detail-btn" data-skey="' + skey + '">详情</button><span class="suggestion-status" style="margin-left:6px;color:#666;">[草稿]</span></td>' +
        '</tr>';
    }
    table.innerHTML = rowsHtml;
};

// 新增：床位-科室对比图 初始化
DepartmentResourcesPage.initBedUsageDepartmentComparisonChart = function() {
    var chart = this.state.charts.bedUsageDepartmentComparisonChart;
    if (!chart) return;
    var data = this.mockData.bedEfficiency.slice(0, 8);
    chart.setOption({
        title: { text: '各科室床位使用对比', left: 'center' },
        tooltip: { trigger: 'axis' },
        grid: { left: '3%', right: '4%', bottom: '10%', containLabel: true },
        xAxis: { type: 'category', data: data.map(function(i){ return i.department; }), axisLabel: { interval: 0, rotate: 30 } },
        yAxis: { type: 'value', name: '使用率(%)' },
        series: [{ name: '床位使用率', type: 'bar', data: data.map(function(i){ return i.utilization; }), itemStyle: { color: '#5B8FF9' } }]
    });
};
DepartmentResourcesPage.updateBedUsageDepartmentComparisonChart = function() {
    var chart = this.state.charts.bedUsageDepartmentComparisonChart;
    if (!chart) return;
    var data = this.mockData.bedEfficiency.slice(0, 8);
    chart.setOption({
        xAxis: { data: data.map(function(i){ return i.department; }) },
        series: [{ data: data.map(function(i){ return i.utilization; }) }]
    });
};

// 新增：人员结构图 初始化（饼图）
DepartmentResourcesPage.initStaffStructureChart = function() {
    var chart = this.state.charts.staffStructureChart;
    if (!chart) return;
    var data = DepartmentResourcesPage.mockData.staffEfficiency.map(function(s){ return { name: s.type, value: s.count }; });
    chart.setOption({
        title: { text: '人员结构', left: 'center' },
        tooltip: { trigger: 'item' },
        legend: { bottom: 10 },
        series: [{
            name: '人数', type: 'pie', radius: ['35%','60%'], center: ['50%','50%'],
            data: data,
            label: { formatter: '{b}: {c}人 ({d}%)' }
        }]
    });
};
DepartmentResourcesPage.updateStaffStructureChart = function(){
    var chart = this.state.charts.staffStructureChart;
    if (!chart) return;
    var data = DepartmentResourcesPage.mockData.staffEfficiency.map(function(s){ return { name: s.type, value: s.count }; });
    chart.setOption({ series: [{ data: data }] });
};

// 新增：人员成本图 初始化（柱形+折线）
DepartmentResourcesPage.initStaffCostChart = function(){
    var chart = this.state.charts.staffCostChart;
    if (!chart) return;
    var names = DepartmentResourcesPage.mockData.staffEfficiency.map(function(s){ return s.type; });
    var cost = DepartmentResourcesPage.mockData.staffEfficiency.map(function(s){ return Math.round((s.revenue||0) * 0.6); });
    var revenue = DepartmentResourcesPage.mockData.staffEfficiency.map(function(s){ return s.revenue||0; });
    chart.setOption({
        title: { text: '人员成本与产出', left: 'center' },
        tooltip: { trigger: 'axis' },
        legend: { data: ['成本','产出'], bottom: 10 },
        grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
        xAxis: { type: 'category', data: names, axisLabel: { interval: 0 } },
        yAxis: { type: 'value', name: '金额(元)' },
        series: [
            { name: '成本', type: 'bar', data: cost, itemStyle: { color: '#FFA39E' } },
            { name: '产出', type: 'line', data: revenue, smooth: true, itemStyle: { color: '#73D13D' } }
        ]
    });
};
DepartmentResourcesPage.updateStaffCostChart = function(){
    var chart = this.state.charts.staffCostChart;
    if (!chart) return;
    var names = DepartmentResourcesPage.mockData.staffEfficiency.map(function(s){ return s.type; });
    var cost = DepartmentResourcesPage.mockData.staffEfficiency.map(function(s){ return Math.round((s.revenue||0) * 0.6); });
    var revenue = DepartmentResourcesPage.mockData.staffEfficiency.map(function(s){ return s.revenue||0; });
    chart.setOption({ xAxis: { data: names }, series: [{ data: cost }, { data: revenue }] });
};

// 新增：空间资源分配图 初始化
DepartmentResourcesPage.initSpaceAllocationChart = function(){
    var chart = this.state.charts.spaceAllocationChart;
    if (!chart) return;
    var data = DepartmentResourcesPage.mockData.spaceAllocation || [];
    chart.setOption({
        title: { text: '空间资源分配与利用', left: 'center' },
        tooltip: { trigger: 'axis' },
        legend: { data: ['面积','使用率','单位面积产出'], bottom: 10 },
        grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
        xAxis: { type: 'category', data: data.map(function(i){ return i.area; }), axisLabel: { interval: 0, rotate: 20 } },
        yAxis: [
            { type: 'value', name: '面积(m²)' },
            { type: 'value', name: '比率/产出', position: 'right' }
        ],
        series: [
            { name: '面积', type: 'bar', data: data.map(function(i){ return i.areaSize; }), itemStyle: { color: '#69C0FF' } },
            { name: '使用率', type: 'line', yAxisIndex: 1, data: data.map(function(i){ return i.utilization; }), smooth: true, itemStyle: { color: '#FFC53D' } },
            { name: '单位面积产出', type: 'line', yAxisIndex: 1, data: data.map(function(i){ return i.unitOutput; }), smooth: true, itemStyle: { color: '#95DE64' } }
        ]
    });
};
DepartmentResourcesPage.updateSpaceAllocationChart = function(){
    var chart = this.state.charts.spaceAllocationChart;
    if (!chart) return;
    var data = DepartmentResourcesPage.mockData.spaceAllocation || [];
    chart.setOption({
        xAxis: { data: data.map(function(i){ return i.area; }) },
        series: [
            { data: data.map(function(i){ return i.areaSize; }) },
            { data: data.map(function(i){ return i.utilization; }) },
            { data: data.map(function(i){ return i.unitOutput; }) }
        ]
    });
};

// 新增：空间资源利用表格渲染
DepartmentResourcesPage.renderSpaceAnalysisTable = function(){
    var tbody = document.querySelector('#spaceAnalysisTable tbody');
    if (!tbody) return;
    var data = DepartmentResourcesPage.mockData.spaceAllocation || [];
    var html = '';
    for (var i = 0; i < data.length; i++) {
        var row = data[i];
        html += '<tr>'+
            '<td>' + (row.area || '-') + '</td>'+
            '<td>' + (row.areaSize != null ? row.areaSize : '-') + '</td>'+
            '<td>' + (row.utilization != null ? row.utilization.toFixed(1) + '%' : '-') + '</td>'+
            '<td>' + (row.unitOutput != null ? row.unitOutput.toFixed(1) : '-') + '</td>'+
            '<td>' + (row.suggestion || '-') + '</td>'+
        '</tr>';
    }
    tbody.innerHTML = html;
};

// 显示医生医疗业务收入构成明细弹窗
function showDoctorIncomeModal(doctorLevel) {
    var modal = document.getElementById('doctorIncomeModal');
    var modalTitle = document.getElementById('modalTitle');
    
    modalTitle.textContent = doctorLevel + ' - 医疗业务收入构成明细';
    modal.style.display = 'flex';
    
    // 渲染收入构成图表
    renderIncomeBreakdownChart(doctorLevel);
    
    // 渲染收入明细表格
    renderIncomeDetailsTable(doctorLevel);
}

// 关闭医生收入构成明细弹窗
function closeDoctorIncomeModal() {
    var modal = document.getElementById('doctorIncomeModal');
    modal.style.display = 'none';
}

// 渲染收入构成图表
function renderIncomeBreakdownChart(doctorLevel) {
    var chartContainer = document.getElementById('incomeBreakdownChart');
    if (!chartContainer) return;
    
    // 根据医生级别获取不同的收入构成数据
    var incomeData = getIncomeDataByLevel(doctorLevel);
    
    var chart = echarts.init(chartContainer);
    var option = {
        title: {
            text: doctorLevel + '医疗业务收入构成',
            left: 'center',
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: ¥{c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            top: 'middle'
        },
        series: [
            {
                name: '医疗业务收入构成',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['60%', '50%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '18',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: incomeData.chartData
            }
        ]
    };
    
    chart.setOption(option);
}

// 渲染收入明细表格
function renderIncomeDetailsTable(doctorLevel) {
    var tbody = document.querySelector('#incomeDetailsTable tbody');
    if (!tbody) return;
    
    var incomeData = getIncomeDataByLevel(doctorLevel);
    
    var html = '';
    for (var i = 0; i < incomeData.tableData.length; i++) {
        var item = incomeData.tableData[i];
        html += '<tr>'+
            '<td>' + item.category + '</td>'+
            '<td>¥' + item.amount.toLocaleString() + '</td>'+
            '<td>' + item.percentage + '%</td>'+
            '<td>' + item.description + '</td>'+
        '</tr>';
    }
    tbody.innerHTML = html;
}

// 根据医生级别获取医疗业务收入数据
function getIncomeDataByLevel(doctorLevel) {
    var incomeDataMap = {
        '主任医师': {
            chartData: [
                { value: 45000, name: '药品收入' },
                { value: 28000, name: '医疗服务收入' },
                { value: 18000, name: '检查收入' },
                { value: 15000, name: '耗材收入' },
                { value: 12000, name: '检验收入' }
            ],
            tableData: [
                { category: '药品收入', amount: 45000, percentage: 38.1, description: '处方药品、注射用药等收入' },
                { category: '医疗服务收入', amount: 28000, percentage: 23.7, description: '手术费、治疗费、护理费等' },
                { category: '检查收入', amount: 18000, percentage: 15.3, description: 'CT、MRI、超声等影像检查' },
                { category: '耗材收入', amount: 15000, percentage: 12.7, description: '手术器械、植入物等医用耗材' },
                { category: '检验收入', amount: 12000, percentage: 10.2, description: '血液、生化、免疫等实验室检验' }
            ]
        },
        '副主任医师': {
            chartData: [
                { value: 38000, name: '药品收入' },
                { value: 22000, name: '医疗服务收入' },
                { value: 15000, name: '检查收入' },
                { value: 12000, name: '耗材收入' },
                { value: 10000, name: '检验收入' }
            ],
            tableData: [
                { category: '药品收入', amount: 38000, percentage: 39.2, description: '处方药品、注射用药等收入' },
                { category: '医疗服务收入', amount: 22000, percentage: 22.7, description: '手术费、治疗费、护理费等' },
                { category: '检查收入', amount: 15000, percentage: 15.5, description: 'CT、MRI、超声等影像检查' },
                { category: '耗材收入', amount: 12000, percentage: 12.4, description: '手术器械、植入物等医用耗材' },
                { category: '检验收入', amount: 10000, percentage: 10.3, description: '血液、生化、免疫等实验室检验' }
            ]
        },
        '主治医师': {
            chartData: [
                { value: 32000, name: '药品收入' },
                { value: 18000, name: '医疗服务收入' },
                { value: 12000, name: '检查收入' },
                { value: 9000, name: '耗材收入' },
                { value: 8000, name: '检验收入' }
            ],
            tableData: [
                { category: '药品收入', amount: 32000, percentage: 40.5, description: '处方药品、注射用药等收入' },
                { category: '医疗服务收入', amount: 18000, percentage: 22.8, description: '手术费、治疗费、护理费等' },
                { category: '检查收入', amount: 12000, percentage: 15.2, description: 'CT、MRI、超声等影像检查' },
                { category: '耗材收入', amount: 9000, percentage: 11.4, description: '手术器械、植入物等医用耗材' },
                { category: '检验收入', amount: 8000, percentage: 10.1, description: '血液、生化、免疫等实验室检验' }
            ]
        },
        '住院医师': {
            chartData: [
                { value: 25000, name: '药品收入' },
                { value: 12000, name: '医疗服务收入' },
                { value: 8000, name: '检查收入' },
                { value: 6000, name: '耗材收入' },
                { value: 5000, name: '检验收入' }
            ],
            tableData: [
                { category: '药品收入', amount: 25000, percentage: 44.6, description: '处方药品、注射用药等收入' },
                { category: '医疗服务收入', amount: 12000, percentage: 21.4, description: '手术费、治疗费、护理费等' },
                { category: '检查收入', amount: 8000, percentage: 14.3, description: 'CT、MRI、超声等影像检查' },
                { category: '耗材收入', amount: 6000, percentage: 10.7, description: '手术器械、植入物等医用耗材' },
                { category: '检验收入', amount: 5000, percentage: 8.9, description: '血液、生化、免疫等实验室检验' }
            ]
        }
    };
    
    return incomeDataMap[doctorLevel] || incomeDataMap['住院医师'];
}

// 点击弹窗外部区域关闭弹窗
window.onclick = function(event) {
    var modal = document.getElementById('doctorIncomeModal');
    if (event.target == modal) {
        closeDoctorIncomeModal();
    }
};

// 医生专项分析图表函数
DepartmentResourcesPage.initDoctorStructureChart = function(){
    var chart = this.state.charts.doctorStructureChart;
    if (!chart) return;
    
    var data = [
        { name: '主任医师', value: 5 },
        { name: '副主任医师', value: 8 },
        { name: '主治医师', value: 12 },
        { name: '住院医师', value: 18 }
    ];
    
    chart.setOption({
        title: { text: '医生结构分布', left: 'center', textStyle: { fontSize: 14 } },
        tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
        legend: { orient: 'vertical', left: 'left' },
        series: [{
            name: '医生结构',
            type: 'pie',
            radius: '50%',
            data: data,
            emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
        }]
    });
};

DepartmentResourcesPage.initDoctorEfficiencyChart = function(){
    var chart = this.state.charts.doctorEfficiencyChart;
    if (!chart) return;
    
    chart.setOption({
        title: { text: '医生工作效率', left: 'center', textStyle: { fontSize: 14 } },
        tooltip: { trigger: 'axis' },
        legend: { data: ['门诊量', '手术量', '效率指数'] },
        xAxis: { type: 'category', data: ['主任医师', '副主任医师', '主治医师', '住院医师'] },
        yAxis: [
            { type: 'value', name: '数量' },
            { type: 'value', name: '效率指数', position: 'right' }
        ],
        series: [
            { name: '门诊量', type: 'bar', data: [120, 180, 200, 150], itemStyle: { color: '#5470c6' } },
            { name: '手术量', type: 'bar', data: [30, 45, 35, 20], itemStyle: { color: '#91cc75' } },
            { name: '效率指数', type: 'line', yAxisIndex: 1, data: [95, 88, 92, 85], smooth: true, itemStyle: { color: '#fac858' } }
        ]
    });
};

DepartmentResourcesPage.initDoctorProductivityChart = function(){
    var chart = this.state.charts.doctorProductivityChart;
    if (!chart) return;
    
    chart.setOption({
        title: { text: '医生生产力分析', left: 'center', textStyle: { fontSize: 14 } },
        tooltip: { trigger: 'axis' },
        legend: { data: ['收入贡献', '成本投入', '产出比'] },
        xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
        yAxis: [
            { type: 'value', name: '金额(万元)' },
            { type: 'value', name: '产出比', position: 'right' }
        ],
        series: [
            { name: '收入贡献', type: 'bar', data: [85, 92, 88, 95, 90, 98], itemStyle: { color: '#73c0de' } },
            { name: '成本投入', type: 'bar', data: [45, 48, 46, 50, 47, 52], itemStyle: { color: '#fc8452' } },
            { name: '产出比', type: 'line', yAxisIndex: 1, data: [1.89, 1.92, 1.91, 1.90, 1.91, 1.88], smooth: true, itemStyle: { color: '#9a60b4' } }
        ]
    });
};

// 医生效率与效益分析表格渲染
DepartmentResourcesPage.renderDoctorAnalysisTable = function(){
    var tbody = document.querySelector('#doctorAnalysisTable tbody');
    if (!tbody) return;
    
    var data = [
        { level: '主任医师', count: 5, avgPatients: 24, avgIncome: 18500, efficiency: 92.5, satisfaction: 95.2 },
        { level: '副主任医师', count: 8, avgPatients: 22, avgIncome: 15200, efficiency: 88.3, satisfaction: 93.8 },
        { level: '主治医师', count: 12, avgPatients: 18, avgIncome: 12800, efficiency: 85.7, satisfaction: 91.5 },
        { level: '住院医师', count: 18, avgPatients: 15, avgIncome: 8500, efficiency: 82.1, satisfaction: 89.3 }
    ];
    
    var html = '';
    for (var i = 0; i < data.length; i++) {
        var row = data[i];
        html += '<tr>'+
            '<td><span class="doctor-category" onclick="showDoctorIncomeModal(\'' + row.level + '\')">' + row.level + '</span></td>'+
            '<td>' + row.count + '</td>'+
            '<td>' + row.avgPatients + '</td>'+
            '<td>¥' + row.avgIncome.toLocaleString() + '</td>'+
            '<td>' + row.efficiency + '%</td>'+
            '<td>' + row.satisfaction + '%</td>'+
        '</tr>';
    }
    tbody.innerHTML = html;
};
