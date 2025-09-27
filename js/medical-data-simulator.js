/**
 * 医疗质量安全监测系统 - 数据模拟器
 * 基于真实医疗业务规律生成专业的模拟数据
 */

class MedicalDataSimulator {
    constructor() {
        this.initializeBaseData();
        this.setupTemporalPatterns();
        this.setupCorrelationRules();
    }

    /**
     * 初始化基础数据
     */
    initializeBaseData() {
        // 科室配置
        this.departments = [
            { id: 'ICU', name: '重症医学科', riskLevel: 'high', bedCount: 20 },
            { id: 'SURGERY', name: '外科', riskLevel: 'medium', bedCount: 45 },
            { id: 'INTERNAL', name: '内科', riskLevel: 'medium', bedCount: 60 },
            { id: 'EMERGENCY', name: '急诊科', riskLevel: 'high', bedCount: 15 },
            { id: 'OBSTETRICS', name: '妇产科', riskLevel: 'medium', bedCount: 30 },
            { id: 'PEDIATRICS', name: '儿科', riskLevel: 'medium', bedCount: 25 }
        ];

        // 医疗质量指标基准值
        this.qualityBenchmarks = {
            // 诊疗流程指标
            diagnosis: {
                firstDiagnosisResponsibilityRate: { target: 95, current: 94.2, range: [90, 98] },
                threeLevelRoundsRate: { target: 90, current: 89.7, range: [85, 95] },
                consultationExecutionRate: { target: 85, current: 87.5, range: [80, 92] },
                diagnosisAccuracyRate: { target: 92, current: 92.8, range: [88, 96] }
            },
            
            // 手术质量指标
            surgery: {
                surgicalSafetyChecklistRate: { target: 100, current: 99.8, range: [98, 100] },
                surgicalComplicationRate: { target: 2.0, current: 1.2, range: [0.8, 3.5], reverse: true },
                surgicalInfectionRate: { target: 1.5, current: 1.0, range: [0.5, 2.8], reverse: true },
                surgicalMortalityRate: { target: 0.5, current: 0.3, range: [0.1, 1.2], reverse: true }
            },
            
            // 护理质量指标
            nursing: {
                nursingAdverseEventRate: { target: 0.2, current: 0.15, range: [0.08, 0.35], reverse: true },
                fallIncidentRate: { target: 0.1, current: 0.08, range: [0.03, 0.25], reverse: true },
                pressureUlcerRate: { target: 0.08, current: 0.05, range: [0.02, 0.18], reverse: true },
                nursingSatisfactionRate: { target: 90, current: 94.5, range: [85, 98] }
            },
            
            // 危重病例指标
            critical: {
                criticalPatientIdentificationRate: { target: 90, current: 92.5, range: [85, 97] },
                emergencyResponseTime: { target: 4, current: 3.2, range: [2.5, 6.0], reverse: true },
                resuscitationSuccessRate: { target: 85, current: 89.7, range: [80, 95] },
                icuMortalityRate: { target: 10, current: 8.5, range: [6, 15], reverse: true }
            },
            
            // 药事管理指标
            pharmacy: {
                rationalDrugUseRate: { target: 90, current: 91.8, range: [85, 96] },
                antibioticUseIntensity: { target: 40, current: 38.5, range: [30, 50], reverse: true },
                adverseDrugReactionRate: { target: 3.0, current: 2.8, range: [1.5, 4.5] },
                prescriptionReviewPassRate: { target: 92, current: 94.2, range: [88, 98] }
            },
            
            // 技术创新指标
            innovation: {
                newTechnologySuccessRate: { target: 75, current: 78.5, range: [70, 85] },
                qualityImprovementCompletionRate: { target: 85, current: 89.2, range: [80, 95] },
                innovationROI: { target: 3.0, current: 3.2, range: [2.5, 4.0] },
                technologyAdoptionRate: { target: 90, current: 92.8, range: [85, 98] }
            }
        };
    }

    /**
     * 设置时间模式
     */
    setupTemporalPatterns() {
        this.temporalPatterns = {
            // 日内变化模式
            hourlyPattern: {
                // 急诊科：夜间和早晨高峰
                emergency: [0.6, 0.4, 0.3, 0.3, 0.4, 0.6, 0.8, 1.2, 1.4, 1.3, 1.2, 1.1, 
                           1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.4, 1.2, 1.0, 0.8, 0.7],
                // 手术室：白天高峰
                surgery: [0.1, 0.1, 0.1, 0.1, 0.2, 0.4, 0.6, 1.0, 1.5, 1.8, 1.9, 1.7,
                         1.5, 1.6, 1.8, 1.9, 1.6, 1.2, 0.8, 0.4, 0.2, 0.1, 0.1, 0.1],
                // 普通病房：相对平稳
                general: [0.8, 0.7, 0.6, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.2,
                         1.1, 1.2, 1.3, 1.2, 1.1, 1.0, 0.9, 0.9, 0.9, 0.8, 0.8, 0.8]
            },
            
            // 周内变化模式
            weeklyPattern: {
                // 周一到周日的相对强度
                general: [1.2, 1.3, 1.2, 1.1, 1.0, 0.8, 0.6],
                emergency: [1.1, 1.0, 0.9, 0.9, 1.0, 1.3, 1.5],
                surgery: [1.4, 1.5, 1.3, 1.2, 1.1, 0.7, 0.3]
            },
            
            // 月度变化模式
            monthlyPattern: {
                // 1-12月的相对强度（考虑季节性疾病）
                respiratory: [1.4, 1.3, 1.1, 0.9, 0.8, 0.7, 0.7, 0.8, 0.9, 1.0, 1.2, 1.4],
                cardiovascular: [1.2, 1.1, 1.0, 0.9, 0.9, 0.8, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3],
                trauma: [0.9, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.3, 1.1, 1.0, 0.9, 0.8]
            }
        };
    }

    /**
     * 设置指标相关性规则
     */
    setupCorrelationRules() {
        this.correlationRules = {
            // 护理人员配比与护理质量的关系
            nursePatientRatio: {
                optimalRatio: 0.6,
                impact: {
                    nursingAdverseEventRate: -0.8,  // 负相关
                    nursingSatisfactionRate: 0.7,   // 正相关
                    fallIncidentRate: -0.6
                }
            },
            
            // 手术时长与并发症的关系
            surgeryDuration: {
                thresholds: [60, 120, 240, 480], // 分钟
                complicationRiskMultipliers: [1.0, 1.2, 1.5, 2.0, 3.0]
            },
            
            // 患者年龄与风险的关系
            patientAge: {
                riskFactors: {
                    under18: { mortality: 0.8, complication: 0.9 },
                    age18to65: { mortality: 1.0, complication: 1.0 },
                    age65to80: { mortality: 1.5, complication: 1.3 },
                    over80: { mortality: 2.2, complication: 1.8 }
                }
            }
        };
    }

    /**
     * 生成指定时间范围的质量指标数据
     */
    generateQualityMetrics(category, timeRange, granularity = 'day') {
        const metrics = this.qualityBenchmarks[category];
        const data = {};
        
        Object.keys(metrics).forEach(metricKey => {
            data[metricKey] = this.generateTimeSeriesData(
                metrics[metricKey], 
                timeRange, 
                granularity,
                category
            );
        });
        
        return data;
    }

    /**
     * 生成时间序列数据
     */
    generateTimeSeriesData(metricConfig, timeRange, granularity, category) {
        const { startDate, endDate } = this.parseTimeRange(timeRange);
        const dataPoints = [];
        let currentDate = new Date(startDate);
        
        while (currentDate <= endDate) {
            const value = this.generateRealisticValue(metricConfig, currentDate, category);
            dataPoints.push({
                date: new Date(currentDate),
                value: this.roundToDecimal(value, 2),
                trend: this.calculateTrend(dataPoints, value),
                status: this.getMetricStatus(value, metricConfig)
            });
            
            currentDate = this.incrementDate(currentDate, granularity);
        }
        
        return dataPoints;
    }

    /**
     * 生成符合医疗规律的真实数值
     */
    generateRealisticValue(metricConfig, date, category) {
        const { target, current, range, reverse } = metricConfig;
        
        // 基础值（当前值附近波动）
        let baseValue = current;
        
        // 添加时间模式影响
        const temporalFactor = this.getTemporalFactor(date, category);
        
        // 添加随机波动（正态分布）
        const randomFactor = this.generateNormalRandom(0, 0.1);
        
        // 添加趋势因子（长期改进趋势）
        const trendFactor = this.getTrendFactor(date, reverse);
        
        // 计算最终值
        let finalValue = baseValue * (1 + temporalFactor + randomFactor + trendFactor);
        
        // 确保值在合理范围内
        finalValue = Math.max(range[0], Math.min(range[1], finalValue));
        
        return finalValue;
    }

    /**
     * 获取时间因子
     */
    getTemporalFactor(date, category) {
        const hour = date.getHours();
        const dayOfWeek = date.getDay();
        const month = date.getMonth();
        
        let factor = 0;
        
        // 小时因子
        if (this.temporalPatterns.hourlyPattern[category]) {
            factor += (this.temporalPatterns.hourlyPattern[category][hour] - 1) * 0.1;
        }
        
        // 周因子
        factor += (this.temporalPatterns.weeklyPattern.general[dayOfWeek] - 1) * 0.05;
        
        // 月度因子（季节性）
        factor += (this.temporalPatterns.monthlyPattern.respiratory[month] - 1) * 0.03;
        
        return factor;
    }

    /**
     * 获取趋势因子（模拟质量改进的长期趋势）
     */
    getTrendFactor(date, reverse = false) {
        const now = new Date();
        const daysDiff = (now - date) / (1000 * 60 * 60 * 24);
        
        // 质量指标通常有缓慢的改进趋势
        let trendFactor = daysDiff * 0.0001; // 每天0.01%的改进
        
        if (reverse) {
            trendFactor = -trendFactor; // 对于"越低越好"的指标
        }
        
        return Math.max(-0.1, Math.min(0.1, trendFactor));
    }

    /**
     * 生成正态分布随机数
     */
    generateNormalRandom(mean = 0, stdDev = 1) {
        let u = 0, v = 0;
        while(u === 0) u = Math.random();
        while(v === 0) v = Math.random();
        
        const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        return z * stdDev + mean;
    }

    /**
     * 生成患者数据
     */
    generatePatientData(count = 100) {
        const patients = [];
        const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十'];
        
        for (let i = 0; i < count; i++) {
            const age = this.generateAge();
            const department = this.departments[Math.floor(Math.random() * this.departments.length)];
            
            patients.push({
                patientId: `P${String(i + 1).padStart(6, '0')}`,
                name: names[Math.floor(Math.random() * names.length)] + (i + 1),
                age: age,
                gender: Math.random() > 0.5 ? 'M' : 'F',
                department: department.id,
                departmentName: department.name,
                admissionDate: this.generateRandomDate(-30, 0),
                riskLevel: this.calculatePatientRiskLevel(age, department.riskLevel),
                diagnosis: this.generateDiagnosis(department.id),
                vitalSigns: this.generateVitalSigns(age)
            });
        }
        
        return patients;
    }

    /**
     * 生成年龄（符合医院患者年龄分布）
     */
    generateAge() {
        const random = Math.random();
        if (random < 0.1) return Math.floor(Math.random() * 18); // 儿童
        if (random < 0.3) return Math.floor(Math.random() * 47) + 18; // 青壮年
        if (random < 0.7) return Math.floor(Math.random() * 15) + 65; // 老年
        return Math.floor(Math.random() * 20) + 80; // 高龄
    }

    /**
     * 计算患者风险等级
     */
    calculatePatientRiskLevel(age, departmentRisk) {
        let riskScore = 0;
        
        // 年龄风险
        if (age < 1) riskScore += 3;
        else if (age < 18) riskScore += 1;
        else if (age > 80) riskScore += 3;
        else if (age > 65) riskScore += 2;
        
        // 科室风险
        if (departmentRisk === 'high') riskScore += 2;
        else if (departmentRisk === 'medium') riskScore += 1;
        
        // 随机因素
        riskScore += Math.floor(Math.random() * 2);
        
        if (riskScore >= 5) return '极高';
        if (riskScore >= 3) return '高';
        if (riskScore >= 2) return '中';
        return '低';
    }

    /**
     * 生成诊断信息
     */
    generateDiagnosis(departmentId) {
        const diagnoses = {
            'ICU': ['急性呼吸衰竭', '脓毒性休克', '多器官功能衰竭', '急性心肌梗死'],
            'SURGERY': ['急性阑尾炎', '胆囊结石', '疝气', '甲状腺结节'],
            'INTERNAL': ['高血压', '糖尿病', '冠心病', '慢性阻塞性肺疾病'],
            'EMERGENCY': ['急性胃肠炎', '外伤', '急性心绞痛', '急性中毒'],
            'OBSTETRICS': ['正常分娩', '妊娠高血压', '胎位不正', '产后出血'],
            'PEDIATRICS': ['小儿肺炎', '小儿腹泻', '小儿发热', '小儿哮喘']
        };
        
        const deptDiagnoses = diagnoses[departmentId] || diagnoses['INTERNAL'];
        return deptDiagnoses[Math.floor(Math.random() * deptDiagnoses.length)];
    }

    /**
     * 生成生命体征
     */
    generateVitalSigns(age) {
        // 根据年龄调整正常范围
        const ageFactors = this.getAgeFactors(age);
        
        return {
            temperature: this.roundToDecimal(36.0 + Math.random() * 1.5, 1),
            heartRate: Math.floor(60 + Math.random() * 40 * ageFactors.heartRate),
            systolicBP: Math.floor(90 + Math.random() * 50 * ageFactors.bloodPressure),
            diastolicBP: Math.floor(60 + Math.random() * 30 * ageFactors.bloodPressure),
            respirationRate: Math.floor(12 + Math.random() * 8 * ageFactors.respiration),
            oxygenSaturation: this.roundToDecimal(95 + Math.random() * 5, 1)
        };
    }

    /**
     * 获取年龄相关因子
     */
    getAgeFactors(age) {
        if (age < 1) {
            return { heartRate: 2.0, bloodPressure: 0.6, respiration: 2.5 };
        } else if (age < 18) {
            return { heartRate: 1.3, bloodPressure: 0.8, respiration: 1.5 };
        } else if (age > 65) {
            return { heartRate: 0.9, bloodPressure: 1.2, respiration: 1.1 };
        }
        return { heartRate: 1.0, bloodPressure: 1.0, respiration: 1.0 };
    }

    /**
     * 生成手术数据
     */
    generateSurgeryData(count = 50) {
        const surgeries = [];
        const surgeryTypes = [
            { name: '阑尾切除术', level: 2, avgDuration: 60 },
            { name: '胆囊切除术', level: 2, avgDuration: 90 },
            { name: '甲状腺切除术', level: 3, avgDuration: 120 },
            { name: '心脏搭桥术', level: 4, avgDuration: 300 },
            { name: '肝脏切除术', level: 4, avgDuration: 240 },
            { name: '疝修补术', level: 1, avgDuration: 45 }
        ];
        
        for (let i = 0; i < count; i++) {
            const surgeryType = surgeryTypes[Math.floor(Math.random() * surgeryTypes.length)];
            const duration = this.generateSurgeryDuration(surgeryType.avgDuration);
            
            surgeries.push({
                surgeryId: `S${String(i + 1).padStart(6, '0')}`,
                patientId: `P${String(Math.floor(Math.random() * 100) + 1).padStart(6, '0')}`,
                surgeryName: surgeryType.name,
                surgeryLevel: surgeryType.level,
                scheduledTime: this.generateRandomDate(-7, 7),
                duration: duration,
                complications: this.generateComplications(surgeryType.level, duration),
                safetyChecklist: this.generateSafetyChecklist(),
                outcome: this.generateSurgeryOutcome(surgeryType.level, duration)
            });
        }
        
        return surgeries;
    }

    /**
     * 生成手术时长（考虑复杂度和随机因素）
     */
    generateSurgeryDuration(avgDuration) {
        const variation = 0.3; // 30%的变异
        const randomFactor = 1 + (Math.random() - 0.5) * 2 * variation;
        return Math.floor(avgDuration * randomFactor);
    }

    /**
     * 生成并发症信息
     */
    generateComplications(surgeryLevel, duration) {
        // 并发症风险随手术级别和时长增加
        let riskFactor = surgeryLevel * 0.5 + (duration / 60) * 0.2;
        
        if (Math.random() < riskFactor / 100) {
            const complications = ['出血', '感染', '器官损伤', '麻醉并发症'];
            return complications[Math.floor(Math.random() * complications.length)];
        }
        
        return null;
    }

    /**
     * 生成手术安全核查表
     */
    generateSafetyChecklist() {
        return {
            preOperative: Math.random() > 0.02, // 98%完成率
            intraOperative: Math.random() > 0.01, // 99%完成率
            postOperative: Math.random() > 0.015 // 98.5%完成率
        };
    }

    /**
     * 生成手术结果
     */
    generateSurgeryOutcome(surgeryLevel, duration) {
        let successRate = 0.95 - (surgeryLevel - 1) * 0.02 - (duration / 600) * 0.01;
        return Math.random() < successRate ? '成功' : '并发症';
    }

    /**
     * 工具方法
     */
    parseTimeRange(timeRange) {
        const now = new Date();
        let startDate, endDate;
        
        switch (timeRange) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
                break;
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                endDate = now;
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                endDate = now;
                break;
            case 'quarter':
                startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
                endDate = now;
                break;
            case 'year':
                startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                endDate = now;
                break;
            default:
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                endDate = now;
        }
        
        return { startDate, endDate };
    }

    incrementDate(date, granularity) {
        const newDate = new Date(date);
        switch (granularity) {
            case 'hour':
                newDate.setHours(newDate.getHours() + 1);
                break;
            case 'day':
                newDate.setDate(newDate.getDate() + 1);
                break;
            case 'week':
                newDate.setDate(newDate.getDate() + 7);
                break;
            case 'month':
                newDate.setMonth(newDate.getMonth() + 1);
                break;
        }
        return newDate;
    }

    generateRandomDate(minDaysAgo, maxDaysAgo) {
        const now = new Date();
        const minTime = now.getTime() + minDaysAgo * 24 * 60 * 60 * 1000;
        const maxTime = now.getTime() + maxDaysAgo * 24 * 60 * 60 * 1000;
        return new Date(minTime + Math.random() * (maxTime - minTime));
    }

    calculateTrend(dataPoints, currentValue) {
        if (dataPoints.length < 2) return 'stable';
        
        const previousValue = dataPoints[dataPoints.length - 1].value;
        const change = (currentValue - previousValue) / previousValue;
        
        if (change > 0.02) return 'up';
        if (change < -0.02) return 'down';
        return 'stable';
    }

    getMetricStatus(value, metricConfig) {
        const { target, reverse } = metricConfig;
        const tolerance = target * 0.05; // 5%容差
        
        if (reverse) {
            if (value <= target - tolerance) return 'excellent';
            if (value <= target + tolerance) return 'good';
            if (value <= target * 1.2) return 'warning';
            return 'critical';
        } else {
            if (value >= target + tolerance) return 'excellent';
            if (value >= target - tolerance) return 'good';
            if (value >= target * 0.8) return 'warning';
            return 'critical';
        }
    }

    roundToDecimal(value, decimals) {
        return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
    }

    /**
     * 获取随机评级
     */
    getRandomRating() {
        const ratings = ['优秀', '良好', '合格', '待改进'];
        const weights = [0.3, 0.4, 0.25, 0.05]; // 权重分布
        const random = Math.random();
        let cumulative = 0;
        
        for (let i = 0; i < ratings.length; i++) {
            cumulative += weights[i];
            if (random <= cumulative) {
                return ratings[i];
            }
        }
        return ratings[1]; // 默认返回"良好"
    }

    /**
     * 生成麻醉ICU数据
     */
    generateAnesthesiaICUData() {
        return {
            totalPatients: Math.floor(Math.random() * 50) + 20,
            criticalPatients: Math.floor(Math.random() * 10) + 5,
            averageStayDays: (Math.random() * 5 + 3).toFixed(1),
            mortalityRate: (Math.random() * 3 + 1).toFixed(1),
            complicationRate: (Math.random() * 8 + 5).toFixed(1),
            satisfactionScore: (Math.random() * 10 + 85).toFixed(1)
        };
    }

    /**
     * 生成危重症监控数据
     */
    generateCriticalCareData() {
        return {
            activeCritical: Math.floor(Math.random() * 15) + 8,
            emergencyResponse: Math.floor(Math.random() * 5) + 2,
            icuOccupancy: Math.floor(Math.random() * 20) + 75,
            avgResponseTime: Math.floor(Math.random() * 8) + 5
        };
    }

    /**
     * 生成药事与血液管理数据
     */
    generatePharmacyBloodData() {
        return {
            // 实时监控数据
            realTimeData: {
                currentPrescriptions: Math.floor(450 + Math.random() * 100),
                activeBloodOrders: Math.floor(15 + Math.random() * 10),
                drugInteractionAlerts: Math.floor(Math.random() * 8),
                bloodInventoryLevel: this.roundToDecimal(0.65 + Math.random() * 0.3, 2),
                averageDispensingTime: this.roundToDecimal(8 + Math.random() * 4, 1),
                bloodCrossmatchTime: this.roundToDecimal(25 + Math.random() * 10, 1)
            },
            
            // 统计卡片数据
            statisticalCards: [
                {
                    title: '合理用药率',
                    value: this.roundToDecimal(92 + Math.random() * 6, 1),
                    unit: '%',
                    trend: Math.random() > 0.5 ? 'up' : 'down',
                    change: this.roundToDecimal(Math.random() * 2, 1)
                },
                {
                    title: '血液制品使用合规率',
                    value: this.roundToDecimal(88 + Math.random() * 8, 1),
                    unit: '%',
                    trend: Math.random() > 0.5 ? 'up' : 'down',
                    change: this.roundToDecimal(Math.random() * 3, 1)
                },
                {
                    title: '药物不良反应监测率',
                    value: this.roundToDecimal(85 + Math.random() * 10, 1),
                    unit: '%',
                    trend: Math.random() > 0.5 ? 'up' : 'down',
                    change: this.roundToDecimal(Math.random() * 2.5, 1)
                },
                {
                    title: '输血不良反应发生率',
                    value: this.roundToDecimal(0.1 + Math.random() * 0.3, 2),
                    unit: '%',
                    trend: Math.random() > 0.5 ? 'down' : 'up',
                    change: this.roundToDecimal(Math.random() * 0.1, 2)
                }
            ],
            
            // 指标列表数据
            indicators: [
                { name: '抗菌药物使用强度', value: this.roundToDecimal(35 + Math.random() * 10, 1), unit: 'DDDs', status: 'normal' },
                { name: '血液制品库存周转率', value: this.roundToDecimal(8 + Math.random() * 4, 1), unit: '次/月', status: 'good' },
                { name: '药物配伍禁忌检查率', value: this.roundToDecimal(95 + Math.random() * 4, 1), unit: '%', status: 'excellent' },
                { name: '血型鉴定准确率', value: this.roundToDecimal(99.5 + Math.random() * 0.4, 2), unit: '%', status: 'excellent' },
                { name: '处方点评覆盖率', value: this.roundToDecimal(80 + Math.random() * 15, 1), unit: '%', status: 'good' },
                { name: '血液制品报废率', value: this.roundToDecimal(1 + Math.random() * 2, 2), unit: '%', status: 'warning' }
            ],
            
            // 药物相互作用警报
            drugInteractions: [
                {
                    id: 'DI001',
                    patient: '张某某',
                    drugs: ['阿司匹林', '华法林'],
                    severity: 'high',
                    description: '增加出血风险',
                    time: '10:30',
                    status: 'pending'
                },
                {
                    id: 'DI002',
                    patient: '李某某',
                    drugs: ['地高辛', '胺碘酮'],
                    severity: 'medium',
                    description: '可能导致地高辛中毒',
                    time: '09:45',
                    status: 'resolved'
                },
                {
                    id: 'DI003',
                    patient: '王某某',
                    drugs: ['西咪替丁', '茶碱'],
                    severity: 'medium',
                    description: '茶碱血药浓度升高',
                    time: '11:15',
                    status: 'pending'
                }
            ],
            
            // 血液制品追踪
            bloodProducts: [
                {
                    id: 'BP001',
                    type: '红细胞悬液',
                    patient: '赵某某',
                    bloodType: 'A+',
                    volume: '200ml',
                    status: 'transfusing',
                    startTime: '14:30',
                    location: 'ICU-3'
                },
                {
                    id: 'BP002',
                    type: '血小板',
                    patient: '陈某某',
                    bloodType: 'O-',
                    volume: '1个治疗量',
                    status: 'prepared',
                    startTime: '15:00',
                    location: '血液科'
                },
                {
                    id: 'BP003',
                    type: '新鲜冰冻血浆',
                    patient: '刘某某',
                    bloodType: 'B+',
                    volume: '400ml',
                    status: 'completed',
                    startTime: '13:15',
                    location: '外科ICU'
                }
            ]
        };
    }

    /**
     * 生成技术创新与质量提升数据
     */
    generateTechnologyInnovationData() {
        return {
            // 统计卡片数据
            statisticalCards: [
                {
                    title: '新技术应用成功率',
                    value: this.roundToDecimal(92 + Math.random() * 6, 1),
                    unit: '%',
                    trend: Math.random() > 0.5 ? 'up' : 'down',
                    change: this.roundToDecimal(Math.random() * 3, 1)
                },
                {
                    title: '质量改进项目完成率',
                    value: this.roundToDecimal(85 + Math.random() * 10, 1),
                    unit: '%',
                    trend: Math.random() > 0.5 ? 'up' : 'down',
                    change: this.roundToDecimal(Math.random() * 4, 1)
                },
                {
                    title: '医疗技术准入合规率',
                    value: this.roundToDecimal(96 + Math.random() * 3, 1),
                    unit: '%',
                    trend: Math.random() > 0.5 ? 'up' : 'down',
                    change: this.roundToDecimal(Math.random() * 2, 1)
                },
                {
                    title: '创新技术风险事件率',
                    value: this.roundToDecimal(0.5 + Math.random() * 1, 2),
                    unit: '%',
                    trend: Math.random() > 0.5 ? 'down' : 'up',
                    change: this.roundToDecimal(Math.random() * 0.3, 2)
                }
            ],
            
            // 指标列表数据
            indicators: [
                { name: '新技术培训覆盖率', value: this.roundToDecimal(88 + Math.random() * 10, 1), unit: '%', status: 'good' },
                { name: '质量持续改进有效性', value: this.roundToDecimal(82 + Math.random() * 15, 1), unit: '%', status: 'normal' },
                { name: '技术创新投入产出比', value: this.roundToDecimal(1.2 + Math.random() * 0.8, 2), unit: '', status: 'excellent' },
                { name: '医疗设备利用率', value: this.roundToDecimal(75 + Math.random() * 20, 1), unit: '%', status: 'good' },
                { name: '创新项目成功率', value: this.roundToDecimal(78 + Math.random() * 18, 1), unit: '%', status: 'normal' },
                { name: '技术风险评估覆盖率', value: this.roundToDecimal(95 + Math.random() * 4, 1), unit: '%', status: 'excellent' }
            ],
            
            // 技术成熟度矩阵
            maturityLevels: [
                { level: 1, name: '基础研究', count: Math.floor(2 + Math.random() * 4) },
                { level: 2, name: '概念验证', count: Math.floor(3 + Math.random() * 5) },
                { level: 3, name: '实验验证', count: Math.floor(4 + Math.random() * 6) },
                { level: 4, name: '小规模试点', count: Math.floor(5 + Math.random() * 7) },
                { level: 5, name: '大规模验证', count: Math.floor(3 + Math.random() * 5) },
                { level: 6, name: '系统演示', count: Math.floor(2 + Math.random() * 4) },
                { level: 7, name: '原型演示', count: Math.floor(4 + Math.random() * 6) },
                { level: 8, name: '系统完成', count: Math.floor(3 + Math.random() * 5) },
                { level: 9, name: '实际应用', count: Math.floor(6 + Math.random() * 8) }
            ],
            
            // 创新项目看板
            projects: [
                {
                    id: 'PROJ001',
                    name: 'AI影像诊断系统升级',
                    stage: '研发',
                    priority: 'high',
                    department: '影像科'
                },
                {
                    id: 'PROJ002',
                    name: '手术室智能化改造',
                    stage: '立项',
                    priority: 'medium',
                    department: '手术科'
                },
                {
                    id: 'PROJ003',
                    name: '远程会诊平台建设',
                    stage: '推广',
                    priority: 'high',
                    department: '信息科'
                },
                {
                    id: 'PROJ004',
                    name: '医疗质量监控系统',
                    stage: '试点',
                    priority: 'high',
                    department: '质控科'
                },
                {
                    id: 'PROJ005',
                    name: '智能药房管理系统',
                    stage: '研发',
                    priority: 'medium',
                    department: '药剂科'
                },
                {
                    id: 'PROJ006',
                    name: '移动护理信息系统',
                    stage: '评估',
                    priority: 'low',
                    department: '护理部'
                }
            ],
            
            // 实时数据
            realTimeData: {
                activeProjects: Math.floor(8 + Math.random() * 6),
                newTechnologies: Math.floor(3 + Math.random() * 5),
                improvementMeasures: Math.floor(12 + Math.random() * 8),
                averageProjectCycle: Math.floor(45 + Math.random() * 30),
                trainingParticipants: Math.floor(150 + Math.random() * 100),
                conversionRate: this.roundToDecimal(65 + Math.random() * 25, 1)
            },
            
            // 部门数据表格
            departmentData: [
                {
                    department: '心血管内科',
                    newTechSuccessRate: this.roundToDecimal(94 + Math.random() * 4, 1),
                    qualityImprovementRate: this.roundToDecimal(88 + Math.random() * 8, 1),
                    techComplianceRate: this.roundToDecimal(96 + Math.random() * 3, 1),
                    riskEventRate: this.roundToDecimal(0.3 + Math.random() * 0.4, 2),
                    innovationProjects: Math.floor(3 + Math.random() * 4),
                    trainingCoverage: this.roundToDecimal(90 + Math.random() * 8, 1),
                    rating: this.getRandomRating()
                },
                {
                    department: '神经外科',
                    newTechSuccessRate: this.roundToDecimal(91 + Math.random() * 6, 1),
                    qualityImprovementRate: this.roundToDecimal(85 + Math.random() * 10, 1),
                    techComplianceRate: this.roundToDecimal(95 + Math.random() * 4, 1),
                    riskEventRate: this.roundToDecimal(0.4 + Math.random() * 0.5, 2),
                    innovationProjects: Math.floor(2 + Math.random() * 5),
                    trainingCoverage: this.roundToDecimal(87 + Math.random() * 10, 1),
                    rating: this.getRandomRating()
                },
                {
                    department: '骨科',
                    newTechSuccessRate: this.roundToDecimal(89 + Math.random() * 8, 1),
                    qualityImprovementRate: this.roundToDecimal(82 + Math.random() * 12, 1),
                    techComplianceRate: this.roundToDecimal(94 + Math.random() * 5, 1),
                    riskEventRate: this.roundToDecimal(0.5 + Math.random() * 0.6, 2),
                    innovationProjects: Math.floor(4 + Math.random() * 3),
                    trainingCoverage: this.roundToDecimal(85 + Math.random() * 12, 1),
                    rating: this.getRandomRating()
                },
                {
                    department: '妇产科',
                    newTechSuccessRate: this.roundToDecimal(93 + Math.random() * 5, 1),
                    qualityImprovementRate: this.roundToDecimal(87 + Math.random() * 9, 1),
                    techComplianceRate: this.roundToDecimal(97 + Math.random() * 2, 1),
                    riskEventRate: this.roundToDecimal(0.2 + Math.random() * 0.3, 2),
                    innovationProjects: Math.floor(2 + Math.random() * 4),
                    trainingCoverage: this.roundToDecimal(92 + Math.random() * 6, 1),
                    rating: this.getRandomRating()
                },
                {
                    department: '儿科',
                    newTechSuccessRate: this.roundToDecimal(90 + Math.random() * 7, 1),
                    qualityImprovementRate: this.roundToDecimal(84 + Math.random() * 11, 1),
                    techComplianceRate: this.roundToDecimal(95 + Math.random() * 4, 1),
                    riskEventRate: this.roundToDecimal(0.3 + Math.random() * 0.4, 2),
                    innovationProjects: Math.floor(1 + Math.random() * 4),
                    trainingCoverage: this.roundToDecimal(88 + Math.random() * 9, 1),
                    rating: this.getRandomRating()
                },
                {
                    department: '急诊科',
                    newTechSuccessRate: this.roundToDecimal(88 + Math.random() * 9, 1),
                    qualityImprovementRate: this.roundToDecimal(81 + Math.random() * 13, 1),
                    techComplianceRate: this.roundToDecimal(93 + Math.random() * 6, 1),
                    riskEventRate: this.roundToDecimal(0.6 + Math.random() * 0.7, 2),
                    innovationProjects: Math.floor(3 + Math.random() * 4),
                    trainingCoverage: this.roundToDecimal(83 + Math.random() * 14, 1),
                    rating: this.getRandomRating()
                }
            ]
        };
    }

    /**
     * 获取实时数据（模拟WebSocket数据流）
     */
    getRealTimeData() {
        return {
            timestamp: new Date(),
            currentPatients: Math.floor(180 + Math.random() * 40),
            activeSurgeries: Math.floor(8 + Math.random() * 6),
            criticalAlerts: Math.floor(Math.random() * 3),
            emergencyWaiting: Math.floor(Math.random() * 15),
            icuOccupancy: this.roundToDecimal(0.75 + Math.random() * 0.2, 2),
            staffOnDuty: {
                doctors: Math.floor(45 + Math.random() * 10),
                nurses: Math.floor(120 + Math.random() * 20)
            }
        };
    }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MedicalDataSimulator;
} else {
    window.MedicalDataSimulator = MedicalDataSimulator;
}