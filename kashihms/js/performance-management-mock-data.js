/**
 * 绩效管理页面模拟数据
 * 该文件包含所有用于演示的模拟数据
 */
const PerformanceManagementMockData = {
    // 模拟的国家级指标数据
    nationalIndicators: [
        {
            id: 1,
            name: '医疗质量',
            type: '核心指标',
            level: 'national',
            currentValue: 92.3,
            targetValue: 90,
            warningStatus: 'normal',
            change: 2.1,
            unit: '%',
            description: '综合反映医院医疗服务质量的核心指标，包括诊断符合率、治疗有效率等多项细分指标。',
            trend: 'up',
            details: {
                subIndicators: [
                    { name: '住院患者手术前后诊断符合率', value: 98.6 },
                    { name: '病理诊断与临床诊断符合率', value: 96.8 },
                    { name: '治愈好转率', value: 94.2 },
                    { name: '医院感染发生率', value: 0.8 }
                ]
            }
        },
        {
            id: 2,
            name: '运营效率',
            type: '核心指标',
            level: 'national',
            currentValue: 85.6,
            targetValue: 88,
            warningStatus: 'warning',
            change: -1.2,
            unit: '%',
            description: '反映医院资源利用效率和运营管理水平的指标，包括平均住院日、床位使用率等。',
            trend: 'down',
            details: {
                subIndicators: [
                    { name: '平均住院日', value: 6.8 },
                    { name: '床位使用率', value: 89.5 },
                    { name: '出院患者手术占比', value: 28.3 },
                    { name: '万元收入能耗支出', value: 120 }
                ]
            }
        },
        {
            id: 3,
            name: '持续发展',
            type: '核心指标',
            level: 'national',
            currentValue: 78.9,
            targetValue: 85,
            warningStatus: 'danger',
            change: 0.5,
            unit: '%',
            description: '反映医院可持续发展能力的指标，包括科研投入、人才培养、学科建设等方面。',
            trend: 'stable',
            details: {
                subIndicators: [
                    { name: '科研项目立项数', value: 18 },
                    { name: '发表SCI论文数', value: 7 },
                    { name: '博士、硕士导师数量', value: 12 },
                    { name: '重点专科数量', value: 5 }
                ]
            }
        },
        {
            id: 4,
            name: '满意度评价',
            type: '核心指标',
            level: 'national',
            currentValue: 94.1,
            targetValue: 92,
            warningStatus: 'normal',
            change: 3.2,
            unit: '%',
            description: '反映患者和医务人员对医院服务满意度的综合指标。',
            trend: 'up',
            details: {
                subIndicators: [
                    { name: '患者满意度', value: 95.3 },
                    { name: '医务人员满意度', value: 92.8 },
                    { name: '门诊患者满意度', value: 94.6 },
                    { name: '住院患者满意度', value: 95.1 }
                ]
            }
        },
        {
            id: 5,
            name: '药占比',
            type: '约束指标',
            level: 'national',
            currentValue: 27.5,
            targetValue: 30,
            warningStatus: 'normal',
            change: -2.3,
            unit: '%',
            description: '药品收入占医疗收入的比例，是控制医疗费用不合理增长的重要指标。',
            trend: 'down',
            details: {
                subIndicators: [
                    { name: '西药占比', value: 22.3 },
                    { name: '中成药占比', value: 4.2 },
                    { name: '中药饮片占比', value: 1.0 },
                    { name: '抗菌药物使用强度', value: 42 }
                ]
            }
        },
        {
            id: 6,
            name: '耗占比',
            type: '约束指标',
            level: 'national',
            currentValue: 18.9,
            targetValue: 20,
            warningStatus: 'normal',
            change: -1.1,
            unit: '%',
            description: '卫生材料消耗占医疗收入的比例，反映医院成本控制水平。',
            trend: 'down',
            details: {
                subIndicators: [
                    { name: '高值耗材占比', value: 8.2 },
                    { name: '普通耗材占比', value: 10.7 },
                    { name: '一次性用品使用率', value: 78 },
                    { name: '耗材库存周转率', value: 12 }
                ]
            }
        },
        {
            id: 7,
            name: '三四级手术占比',
            type: '发展指标',
            level: 'national',
            currentValue: 42.6,
            targetValue: 45,
            warningStatus: 'warning',
            change: 3.5,
            unit: '%',
            description: '三四级手术占全部手术的比例，反映医院疑难重症诊疗能力。',
            trend: 'up',
            details: {
                subIndicators: [
                    { name: '四级手术占比', value: 15.8 },
                    { name: '三级手术占比', value: 26.8 },
                    { name: '手术死亡率', value: 0.12 },
                    { name: '手术并发症发生率', value: 0.85 }
                ]
            }
        },
        {
            id: 8,
            name: '出院患者手术占比',
            type: '发展指标',
            level: 'national',
            currentValue: 28.3,
            targetValue: 30,
            warningStatus: 'warning',
            change: 1.8,
            unit: '%',
            description: '出院患者中接受手术治疗的比例，反映医院外科服务能力。',
            trend: 'up',
            details: {
                subIndicators: [
                    { name: '择期手术占比', value: 65.2 },
                    { name: '急诊手术占比', value: 34.8 },
                    { name: '日间手术占比', value: 12.5 },
                    { name: '手术患者平均住院日', value: 5.2 }
                ]
            }
        },
        {
            id: 9,
            name: 'CMI值',
            type: '评价指标',
            level: 'national',
            currentValue: 1.25,
            targetValue: 1.3,
            warningStatus: 'warning',
            change: 0.08,
            unit: '',
            description: '病例组合指数，反映医院收治病例的难易程度和资源消耗水平。',
            trend: 'up',
            details: {
                subIndicators: [
                    { name: '内科CMI', value: 1.15 },
                    { name: '外科CMI', value: 1.42 },
                    { name: '妇产科CMI', value: 1.08 },
                    { name: '儿科CMI', value: 0.96 }
                ]
            }
        },
        {
            id: 10,
            name: '平均住院日',
            type: '效率指标',
            level: 'national',
            currentValue: 6.8,
            targetValue: 7,
            warningStatus: 'normal',
            change: -0.5,
            unit: '天',
            description: '出院患者平均住院天数，反映医院医疗服务效率和管理水平。',
            trend: 'down',
            details: {
                subIndicators: [
                    { name: '内科平均住院日', value: 7.5 },
                    { name: '外科平均住院日', value: 6.2 },
                    { name: '妇产科平均住院日', value: 4.8 },
                    { name: '儿科平均住院日', value: 5.2 }
                ]
            }
        },
        {
            id: 11,
            name: '人员结构',
            type: '发展指标',
            level: 'provincial',
            currentValue: 86.4,
            targetValue: 85,
            warningStatus: 'normal',
            change: 1.2,
            unit: '%',
            description: '反映医院人员配置合理性的指标，包括医护比、床护比等。',
            trend: 'up',
            details: {
                subIndicators: [
                    { name: '医护比', value: '1:1.2' },
                    { name: '床护比', value: '1:0.65' },
                    { name: '医师占比', value: 28.5 },
                    { name: '护士占比', value: 34.2 }
                ]
            }
        },
        {
            id: 12,
            name: '万元设备医疗收入',
            type: '效率指标',
            level: 'provincial',
            currentValue: 1.85,
            targetValue: 2.0,
            warningStatus: 'warning',
            change: 0.12,
            unit: '万元',
            description: '每万元固定资产（设备）产生的医疗收入，反映设备利用效率。',
            trend: 'up',
            details: {
                subIndicators: [
                    { name: '大型设备使用率', value: 78.5 },
                    { name: '设备完好率', value: 98.2 },
                    { name: '设备更新率', value: 15.3 },
                    { name: '万元设备维护成本', value: 0.12 }
                ]
            }
        },
        {
            id: 13,
            name: '医疗收入增长率',
            type: '运营指标',
            level: 'municipal',
            currentValue: 8.2,
            targetValue: 10,
            warningStatus: 'warning',
            change: -1.5,
            unit: '%',
            description: '反映医院业务增长情况的指标。',
            trend: 'down',
            details: {
                subIndicators: [
                    { name: '门诊收入增长率', value: 7.8 },
                    { name: '住院收入增长率', value: 8.5 },
                    { name: '手术收入增长率', value: 10.2 },
                    { name: '检查收入增长率', value: 6.8 }
                ]
            }
        },
        {
            id: 14,
            name: '资产负债率',
            type: '财务指标',
            level: 'municipal',
            currentValue: 42.6,
            targetValue: 50,
            warningStatus: 'normal',
            change: -2.1,
            unit: '%',
            description: '反映医院负债水平和财务风险的指标。',
            trend: 'down',
            details: {
                subIndicators: [
                    { name: '流动比率', value: 1.85 },
                    { name: '速动比率', value: 1.26 },
                    { name: '净资产收益率', value: 6.8 },
                    { name: '总资产周转率', value: 0.65 }
                ]
            }
        },
        {
            id: 15,
            name: '电子病历应用水平',
            type: '管理指标',
            level: 'district',
            currentValue: 92.8,
            targetValue: 90,
            warningStatus: 'normal',
            change: 3.5,
            unit: '%',
            description: '反映医院信息化建设和电子病历应用程度的指标。',
            trend: 'up',
            details: {
                subIndicators: [
                    { name: '电子病历完整率', value: 95.2 },
                    { name: '电子处方率', value: 98.6 },
                    { name: '信息系统集成度', value: 89.3 },
                    { name: '数据质量评分', value: 91.7 }
                ]
            }
        },
        {
            id: 16,
            name: '员工培训完成率',
            type: '发展指标',
            level: 'hospital',
            currentValue: 89.5,
            targetValue: 95,
            warningStatus: 'warning',
            change: 2.3,
            unit: '%',
            description: '反映医院员工培训情况的指标。',
            trend: 'up',
            details: {
                subIndicators: [
                    { name: '医师培训完成率', value: 92.3 },
                    { name: '护士培训完成率', value: 88.7 },
                    { name: '医技人员培训完成率', value: 86.9 },
                    { name: '管理人员培训完成率', value: 91.2 }
                ]
            }
        }
    ],
    
    // 模拟的科室绩效数据
    departmentPerformance: [
        {
            id: 1,
            name: '内科',
            score: 89.5,
            targetCompletionRate: 94.2,
            rank: 3,
            change: 2.1,
            trend: 'up',
            details: {
                subIndicators: [
                    { name: '医疗质量', value: 92.3 },
                    { name: '运营效率', value: 87.6 },
                    { name: '患者满意度', value: 93.8 },
                    { name: '成本控制', value: 85.2 },
                    { name: '科研教学', value: 88.5 }
                ]
            }
        },
        {
            id: 2,
            name: '外科',
            score: 92.3,
            targetCompletionRate: 97.8,
            rank: 1,
            change: 3.5,
            trend: 'up',
            details: {
                subIndicators: [
                    { name: '医疗质量', value: 94.6 },
                    { name: '运营效率', value: 90.2 },
                    { name: '患者满意度', value: 92.5 },
                    { name: '成本控制', value: 89.8 },
                    { name: '科研教学', value: 91.2 }
                ]
            }
        },
        {
            id: 3,
            name: '妇产科',
            score: 87.8,
            targetCompletionRate: 92.3,
            rank: 4,
            change: 1.2,
            trend: 'up',
            details: {
                subIndicators: [
                    { name: '医疗质量', value: 90.5 },
                    { name: '运营效率', value: 85.6 },
                    { name: '患者满意度', value: 95.8 },
                    { name: '成本控制', value: 83.2 },
                    { name: '科研教学', value: 86.7 }
                ]
            }
        },
        {
            id: 4,
            name: '儿科',
            score: 86.2,
            targetCompletionRate: 90.8,
            rank: 5,
            change: -0.5,
            trend: 'down',
            details: {
                subIndicators: [
                    { name: '医疗质量', value: 89.3 },
                    { name: '运营效率', value: 84.1 },
                    { name: '患者满意度', value: 94.2 },
                    { name: '成本控制', value: 82.6 },
                    { name: '科研教学', value: 85.4 }
                ]
            }
        },
        {
            id: 5,
            name: '骨科',
            score: 91.5,
            targetCompletionRate: 96.7,
            rank: 2,
            change: 2.8,
            trend: 'up',
            details: {
                subIndicators: [
                    { name: '医疗质量', value: 93.8 },
                    { name: '运营效率', value: 89.5 },
                    { name: '患者满意度', value: 91.3 },
                    { name: '成本控制', value: 88.2 },
                    { name: '科研教学', value: 89.9 }
                ]
            }
        },
        {
            id: 6,
            name: '神经内科',
            score: 88.9,
            targetCompletionRate: 93.5,
            rank: 6,
            change: 1.8,
            trend: 'up',
            details: {
                subIndicators: [
                    { name: '医疗质量', value: 91.2 },
                    { name: '运营效率', value: 86.7 },
                    { name: '患者满意度', value: 92.8 },
                    { name: '成本控制', value: 84.5 },
                    { name: '科研教学', value: 87.6 }
                ]
            }
        },
        {
            id: 7,
            name: '心内科',
            score: 87.3,
            targetCompletionRate: 91.8,
            rank: 7,
            change: 0.9,
            trend: 'up',
            details: {
                subIndicators: [
                    { name: '医疗质量', value: 90.1 },
                    { name: '运营效率', value: 85.2 },
                    { name: '患者满意度', value: 93.5 },
                    { name: '成本控制', value: 83.8 },
                    { name: '科研教学', value: 86.2 }
                ]
            }
        },
        {
            id: 8,
            name: '消化内科',
            score: 86.7,
            targetCompletionRate: 91.2,
            rank: 8,
            change: -0.8,
            trend: 'down',
            details: {
                subIndicators: [
                    { name: '医疗质量', value: 89.7 },
                    { name: '运营效率', value: 84.5 },
                    { name: '患者满意度', value: 92.3 },
                    { name: '成本控制', value: 82.9 },
                    { name: '科研教学', value: 85.8 }
                ]
            }
        },
        {
            id: 9,
            name: '呼吸内科',
            score: 85.9,
            targetCompletionRate: 90.4,
            rank: 9,
            change: -1.2,
            trend: 'down',
            details: {
                subIndicators: [
                    { name: '医疗质量', value: 88.9 },
                    { name: '运营效率', value: 83.6 },
                    { name: '患者满意度', value: 91.7 },
                    { name: '成本控制', value: 82.1 },
                    { name: '科研教学', value: 84.9 }
                ]
            }
        },
        {
            id: 10,
            name: '内分泌科',
            score: 87.1,
            targetCompletionRate: 91.6,
            rank: 10,
            change: 0.6,
            trend: 'up',
            details: {
                subIndicators: [
                    { name: '医疗质量', value: 89.9 },
                    { name: '运营效率', value: 85.0 },
                    { name: '患者满意度', value: 92.6 },
                    { name: '成本控制', value: 83.5 },
                    { name: '科研教学', value: 86.0 }
                ]
            }
        },
        {
            id: 11,
            name: '皮肤科',
            score: 84.8,
            targetCompletionRate: 89.3,
            rank: 11,
            change: -1.5,
            trend: 'down',
            details: {
                subIndicators: [
                    { name: '医疗质量', value: 88.2 },
                    { name: '运营效率', value: 82.5 },
                    { name: '患者满意度', value: 91.2 },
                    { name: '成本控制', value: 81.3 },
                    { name: '科研教学', value: 84.1 }
                ]
            }
        },
        {
            id: 12,
            name: '眼科',
            score: 85.4,
            targetCompletionRate: 89.9,
            rank: 12,
            change: -0.9,
            trend: 'down',
            details: {
                subIndicators: [
                    { name: '医疗质量', value: 88.6 },
                    { name: '运营效率', value: 83.2 },
                    { name: '患者满意度', value: 91.5 },
                    { name: '成本控制', value: 81.8 },
                    { name: '科研教学', value: 84.5 }
                ]
            }
        }
    ],
    
    // 模拟的雷达图数据
    radarData: {
        current: [
            { name: '医疗质量', value: 92.3 },
            { name: '运营效率', value: 85.6 },
            { name: '持续发展', value: 78.9 },
            { name: '满意度', value: 94.1 },
            { name: '成本控制', value: 87.5 },
            { name: '科研教学', value: 82.3 }
        ],
        lastYear: [
            { name: '医疗质量', value: 90.2 },
            { name: '运营效率', value: 86.8 },
            { name: '持续发展', value: 78.4 },
            { name: '满意度', value: 90.9 },
            { name: '成本控制', value: 85.2 },
            { name: '科研教学', value: 79.8 }
        ],
        target: [
            { name: '医疗质量', value: 95.0 },
            { name: '运营效率', value: 90.0 },
            { name: '持续发展', value: 85.0 },
            { name: '满意度', value: 95.0 },
            { name: '成本控制', value: 90.0 },
            { name: '科研教学', value: 88.0 }
        ],
        benchmark: [
            { name: '医疗质量', value: 93.5 },
            { name: '运营效率', value: 88.2 },
            { name: '持续发展', value: 82.6 },
            { name: '满意度', value: 94.8 },
            { name: '成本控制', value: 89.3 },
            { name: '科研教学', value: 85.7 }
        ],
        departments: {
            '内科': [
                { name: '医疗质量', value: 92.3 },
                { name: '运营效率', value: 87.6 },
                { name: '持续发展', value: 80.5 },
                { name: '满意度', value: 93.8 },
                { name: '成本控制', value: 85.2 },
                { name: '科研教学', value: 88.5 }
            ],
            '外科': [
                { name: '医疗质量', value: 94.6 },
                { name: '运营效率', value: 90.2 },
                { name: '持续发展', value: 83.8 },
                { name: '满意度', value: 92.5 },
                { name: '成本控制', value: 89.8 },
                { name: '科研教学', value: 91.2 }
            ],
            '妇产科': [
                { name: '医疗质量', value: 90.5 },
                { name: '运营效率', value: 85.6 },
                { name: '持续发展', value: 79.2 },
                { name: '满意度', value: 95.8 },
                { name: '成本控制', value: 83.2 },
                { name: '科研教学', value: 86.7 }
            ],
            '儿科': [
                { name: '医疗质量', value: 89.3 },
                { name: '运营效率', value: 84.1 },
                { name: '持续发展', value: 78.4 },
                { name: '满意度', value: 94.2 },
                { name: '成本控制', value: 82.6 },
                { name: '科研教学', value: 85.4 }
            ],
            '骨科': [
                { name: '医疗质量', value: 93.8 },
                { name: '运营效率', value: 89.5 },
                { name: '持续发展', value: 82.9 },
                { name: '满意度', value: 91.3 },
                { name: '成本控制', value: 88.2 },
                { name: '科研教学', value: 89.9 }
            ]
        }
    },
    
    // 模拟的报告统计数据
    reportStats: [
        { month: '1月', hospital: 12, department: 45, doctor: 128 },
        { month: '2月', hospital: 10, department: 42, doctor: 115 },
        { month: '3月', hospital: 14, department: 48, doctor: 132 },
        { month: '4月', hospital: 12, department: 46, doctor: 125 },
        { month: '5月', hospital: 13, department: 47, doctor: 129 },
        { month: '6月', hospital: 15, department: 50, doctor: 135 },
        { month: '7月', hospital: 14, department: 49, doctor: 133 },
        { month: '8月', hospital: 13, department: 48, doctor: 130 },
        { month: '9月', hospital: 15, department: 52, doctor: 138 },
        { month: '10月', hospital: 14, department: 51, doctor: 136 },
        { month: '11月', hospital: 16, department: 54, doctor: 142 },
        { month: '12月', hospital: 18, department: 58, doctor: 148 }
    ],
    
    // 模拟的历史报告数据
    reportHistory: [
        {
            id: 1,
            title: '2024年度全院绩效管理报告',
            type: 'hospital',
            period: 'year',
            year: '2024',
            month: null,
            quarter: null,
            departmentName: null,
            doctorName: null,
            generateTime: '2024-12-31 15:30:45',
            status: 'completed',
            downloadUrl: '#',
            previewUrl: '#',
            wordDownloadUrl: '#',
            score: 89.6,
            mainContent: '本报告对医院2024年度整体绩效情况进行了全面分析评估，涵盖医疗质量、运营效率、持续发展和满意度评价等方面的核心指标。报告显示，我院2024年度绩效考核综合得分为850.1分（总分970分），较2023年提升32分。其中医疗质量得分387.7分（总分420分），运营效率得分228.8分（总分290分），持续发展得分124.2分（总分140分），满意度评价得分109.4分（总分120分）。'
        },
        {
            id: 2,
            title: '2024年第四季度全院绩效管理报告',
            type: 'hospital',
            period: 'quarter',
            year: '2024',
            month: null,
            quarter: '4',
            departmentName: null,
            doctorName: null,
            generateTime: '2024-10-05 14:20:30',
            status: 'completed',
            downloadUrl: '#',
            previewUrl: '#',
            wordDownloadUrl: '#',
            score: 90.2,
            mainContent: '本报告对医院2024年第四季度整体绩效情况进行了全面分析评估，涵盖医疗质量、运营效率、持续发展和满意度评价等方面的核心指标。报告显示，我院2024年第四季度绩效考核综合得分为874.9分（总分970分），较上一季度提升8.2分。'
        },
        {
            id: 3,
            title: '2024年9月全院绩效管理报告',
            type: 'hospital',
            period: 'month',
            year: '2024',
            month: '9',
            quarter: null,
            departmentName: null,
            doctorName: null,
            generateTime: '2024-10-05 10:15:22',
            status: 'completed',
            downloadUrl: '#',
            previewUrl: '#',
            wordDownloadUrl: '#',
            score: 89.5,
            mainContent: '本报告对医院2024年9月整体绩效情况进行了全面分析评估，涵盖医疗质量、运营效率、持续发展和满意度评价等方面的核心指标。报告显示，我院2024年9月绩效考核综合得分为868.2分（总分970分），较上月提升11.6分。'
        },
        {
            id: 4,
            title: '2024年度内科绩效管理报告',
            type: 'department',
            period: 'year',
            year: '2024',
            month: null,
            quarter: null,
            departmentName: '内科',
            doctorName: null,
            generateTime: '2024-12-31 16:45:10',
            status: 'completed',
            downloadUrl: '#',
            previewUrl: '#',
            wordDownloadUrl: '#',
            score: 89.5,
            mainContent: '本报告对内科2024年度整体绩效情况进行了全面分析评估，涵盖医疗质量、运营效率、患者满意度、成本控制和科研教学等方面的核心指标。报告显示，内科2024年度绩效考核综合得分为868.2分（总分970分），在医院各科室中排名第3。'
        },
        {
            id: 5,
            title: '2024年度外科绩效管理报告',
            type: 'department',
            period: 'year',
            year: '2024',
            month: null,
            quarter: null,
            departmentName: '外科',
            doctorName: null,
            generateTime: '2024-12-31 16:48:35',
            status: 'completed',
            downloadUrl: '#',
            previewUrl: '#',
            wordDownloadUrl: '#',
            score: 92.3,
            mainContent: '本报告对外科2024年度整体绩效情况进行了全面分析评估，涵盖医疗质量、运营效率、患者满意度、成本控制和科研教学等方面的核心指标。报告显示，外科2024年度绩效考核综合得分为895.3分（总分970分），在医院各科室中排名第1。'
        },
        {
            id: 6,
            title: '2024年度妇产科绩效管理报告',
            type: 'department',
            period: 'year',
            year: '2024',
            month: null,
            quarter: null,
            departmentName: '妇产科',
            doctorName: null,
            generateTime: '2024-12-31 16:51:23',
            status: 'completed',
            downloadUrl: '#',
            previewUrl: '#',
            wordDownloadUrl: '#',
            score: 87.8,
            mainContent: '本报告对妇产科2024年度整体绩效情况进行了全面分析评估，涵盖医疗质量、运营效率、患者满意度、成本控制和科研教学等方面的核心指标。报告显示，妇产科2024年度绩效考核综合得分为851.7分（总分970分），在医院各科室中排名第4。'
        }
    ],
    
    // 模拟的预警指标数据
    warningIndicators: [
        {
            id: 1,
            name: '持续发展',
            type: '核心指标',
            level: 'national',
            currentValue: 78.9,
            targetValue: 85,
            warningLevel: 'danger',
            reason: '科研投入不足，重点专科建设滞后',
            suggestion: '增加科研投入，加强重点专科建设，引进高层次科研人才',
            responsibleDept: '科教部',
            deadline: '2025-03-31'
        },
        {
            id: 2,
            name: '运营效率',
            type: '核心指标',
            level: 'national',
            currentValue: 85.6,
            targetValue: 88,
            warningLevel: 'warning',
            reason: '平均住院日略有上升，床位周转效率有待提高',
            suggestion: '优化诊疗流程，加强术后康复管理，提高床位周转率',
            responsibleDept: '医务部',
            deadline: '2025-02-28'
        },
        {
            id: 3,
            name: '三四级手术占比',
            type: '发展指标',
            level: 'national',
            currentValue: 42.6,
            targetValue: 45,
            warningLevel: 'warning',
            reason: '三四级手术量增长缓慢，疑难重症诊疗能力有待提升',
            suggestion: '加强微创技术培训，引进先进手术设备，拓展手术范围',
            responsibleDept: '手术麻醉科',
            deadline: '2025-03-31'
        },
        {
            id: 4,
            name: '出院患者手术占比',
            type: '发展指标',
            level: 'national',
            currentValue: 28.3,
            targetValue: 30,
            warningLevel: 'warning',
            reason: '手术患者比例略低于目标值，外科服务能力有待提升',
            suggestion: '加强外科医生队伍建设，优化手术预约流程，提高手术服务效率',
            responsibleDept: '外科',
            deadline: '2025-02-28'
        },
        {
            id: 5,
            name: 'CMI值',
            type: '评价指标',
            level: 'national',
            currentValue: 1.25,
            targetValue: 1.3,
            warningLevel: 'warning',
            reason: '疑难重症病例占比略有不足，病种结构有待优化',
            suggestion: '加强与基层医院合作，建立转诊机制，提高疑难重症病例收治比例',
            responsibleDept: '医务部',
            deadline: '2025-03-31'
        },
        {
            id: 6,
            name: '人员支出占比',
            type: '结构指标',
            level: 'national',
            currentValue: 45.2,
            targetValue: 40,
            warningLevel: 'warning',
            reason: '人员成本增长较快，超过目标控制水平',
            suggestion: '优化人力资源配置，控制人员成本过快增长，提高工作效率',
            responsibleDept: '人事科',
            deadline: '2025-02-28'
        },
        {
            id: 7,
            name: '出院人数增长率',
            type: '发展指标',
            level: 'national',
            currentValue: 4.2,
            targetValue: 5,
            warningLevel: 'warning',
            reason: '出院人数增长未达到预期目标，住院服务量有待提高',
            suggestion: '加强门诊与住院衔接，优化住院流程，提高床位利用率',
            responsibleDept: '门诊部',
            deadline: '2025-02-28'
        },
        {
            id: 8,
            name: '医疗质量',
            type: '核心指标',
            level: 'department',
            department: '儿科',
            currentValue: 89.3,
            targetValue: 92,
            warningLevel: 'warning',
            reason: '医疗质量得分略低于目标值，医疗安全事件略有增加',
            suggestion: '加强医疗质量管理，开展医疗安全培训，完善质量控制体系',
            responsibleDept: '儿科',
            deadline: '2025-02-28'
        }
    ],
    
    // 获取国家级指标数据
    getNationalIndicators: function(year = '2024', level = 'all', warningStatus = 'all') {
        let indicators = this.nationalIndicators;
        
        // 根据年份筛选
        // 这里可以根据实际年份数据进行筛选，当前使用的是固定数据
        
        // 根据指标级别筛选
        if (level !== 'all') {
            indicators = indicators.filter(indicator => indicator.level === level);
        }
        
        // 根据预警状态筛选
        if (warningStatus !== 'all') {
            indicators = indicators.filter(indicator => indicator.warningStatus === warningStatus);
        }
        
        return indicators;
    },
    
    // 获取科室绩效数据
    getDepartmentPerformance: function() {
        return this.departmentPerformance;
    },
    
    // 获取雷达图数据
    getRadarData: function(comparison = 'year', department = 'all') {
        if (department === 'all') {
            return {
                current: this.radarData.current,
                comparison: this.radarData[comparison === 'year' ? 'lastYear' : comparison]
            };
        } else {
            // 转换科室ID为科室名称
            const departmentNames = {
                '1': '内科',
                '2': '外科',
                '3': '妇产科',
                '4': '儿科',
                '5': '骨科'
            };
            
            const deptName = departmentNames[department] || department;
            return {
                current: this.radarData.departments[deptName] || this.radarData.current,
                comparison: this.radarData[comparison === 'year' ? 'lastYear' : comparison]
            };
        }
    },
    
    // 获取报告统计数据
    getReportStats: function() {
        return this.reportStats;
    },
    
    // 获取历史报告数据
    getReportHistory: function(reportType = 'all', department = 'all') {
        let reports = this.reportHistory;
        
        // 根据报告类型筛选
        if (reportType !== 'all') {
            reports = reports.filter(report => report.type === reportType);
        }
        
        // 根据科室筛选
        if (department !== 'all' && reportType === 'department') {
            reports = reports.filter(report => report.departmentName === department);
        }
        
        return reports;
    },
    
    // 获取预警指标数据
    getWarningIndicators: function() {
        return this.warningIndicators;
    },
    
    // 搜索指标
    searchIndicators: function(keyword) {
        if (!keyword) return this.nationalIndicators;
        
        keyword = keyword.toLowerCase();
        return this.nationalIndicators.filter(indicator => 
            indicator.name.toLowerCase().includes(keyword) || 
            indicator.description.toLowerCase().includes(keyword)
        );
    }
};

// 将模拟数据暴露给全局窗口对象，以便其他脚本可以访问
if (typeof window !== 'undefined') {
    window.PerformanceManagementMockData = PerformanceManagementMockData;
}