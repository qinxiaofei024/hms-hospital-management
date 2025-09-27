-- 病种效益分析数据库配置脚本
-- 创建数据库和用户，初始化表结构和测试数据

-- 1. 创建数据库
CREATE DATABASE IF NOT EXISTS hospital_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE hospital_db;

-- 2. 创建用户和授权（可选）
-- CREATE USER 'hms_user'@'localhost' IDENTIFIED BY 'your_secure_password';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON hospital_db.* TO 'hms_user'@'localhost';
-- FLUSH PRIVILEGES;

-- 3. 创建病种效益表（已优化版本）
DROP TABLE IF EXISTS disease_benefit;

CREATE TABLE disease_benefit (
    id INT PRIMARY KEY AUTO_INCREMENT,                   -- 主键ID
    disease_code VARCHAR(20) NOT NULL,                   -- 病种编码(ICD-10)
    disease_name VARCHAR(100) NOT NULL,                  -- 病种名称
    department VARCHAR(50) NOT NULL,                     -- 科室名称
    revenue DECIMAL(12,2) NOT NULL DEFAULT 0,            -- 总收入(元)
    cost DECIMAL(12,2) NOT NULL DEFAULT 0,               -- 总成本(元)
    profit DECIMAL(12,2) GENERATED ALWAYS AS (revenue-cost) STORED, -- 总结余(元)
    cases INT NOT NULL DEFAULT 0,                        -- 病例数
    avg_revenue DECIMAL(12,2) GENERATED ALWAYS AS (revenue/cases) STORED,  -- 平均收入(元)
    avg_cost DECIMAL(12,2) GENERATED ALWAYS AS (cost/cases) STORED,        -- 平均成本(元)
    avg_profit DECIMAL(12,2) GENERATED ALWAYS AS (profit/cases) STORED,    -- 平均结余(元)
    profit_rate DECIMAL(5,2) GENERATED ALWAYS AS (profit/revenue*100) STORED, -- 结余率(%)
    breakeven_cases INT,                                  -- 保本例数(盈亏平衡点)
    avg_stay DECIMAL(5,2),                               -- 平均住院天数
    record_date DATE NOT NULL,                           -- 记录日期
    doctor_id VARCHAR(20),                               -- 主治医生ID
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,      -- 创建时间
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 更新时间
    
    -- 索引优化
    INDEX idx_department (department),                    -- 科室索引
    INDEX idx_date (record_date),                        -- 日期索引
    INDEX idx_disease (disease_code),                    -- 病种代码索引
    INDEX idx_profit_rate (profit_rate),                 -- 结余率索引
    INDEX idx_cases (cases),                             -- 病例数索引
    
    -- 约束条件
    CONSTRAINT chk_revenue CHECK (revenue >= 0),         -- 收入非负
    CONSTRAINT chk_cost CHECK (cost >= 0),               -- 成本非负
    CONSTRAINT chk_cases CHECK (cases > 0),              -- 病例数大于0
    CONSTRAINT chk_avg_stay CHECK (avg_stay > 0)         -- 平均住院天数大于0
);

-- 4. 插入测试数据
INSERT INTO disease_benefit (
    disease_code, disease_name, department, revenue, cost, cases, 
    breakeven_cases, avg_stay, record_date, doctor_id
) VALUES 
-- 心内科数据
('I21.9', '急性心肌梗死', '心内科', 1250000.00, 980000.00, 45, 35, 8.5, '2024-01-15', 'DOC001'),
('I50.9', '心力衰竭', '心内科', 890000.00, 720000.00, 38, 30, 12.3, '2024-01-15', 'DOC002'),
('I25.1', '冠心病', '心内科', 2100000.00, 1650000.00, 85, 65, 6.8, '2024-01-15', 'DOC001'),

-- 神经内科数据
('I63.9', '脑梗死', '神经内科', 1680000.00, 1320000.00, 62, 48, 15.2, '2024-01-15', 'DOC003'),
('G93.1', '脑出血', '神经内科', 980000.00, 850000.00, 28, 24, 18.7, '2024-01-15', 'DOC004'),

-- 呼吸内科数据
('J44.1', '慢性阻塞性肺病', '呼吸内科', 750000.00, 580000.00, 42, 32, 9.8, '2024-01-15', 'DOC005'),
('J18.9', '肺炎', '呼吸内科', 1200000.00, 920000.00, 68, 52, 7.5, '2024-01-15', 'DOC006'),

-- 消化内科数据
('K25.9', '胃溃疡', '消化内科', 680000.00, 520000.00, 35, 27, 5.8, '2024-01-15', 'DOC007'),
('K72.9', '肝硬化', '消化内科', 1450000.00, 1180000.00, 52, 42, 14.2, '2024-01-15', 'DOC008'),

-- 骨科数据
('S72.0', '股骨颈骨折', '骨科', 1850000.00, 1420000.00, 48, 37, 12.5, '2024-01-15', 'DOC009'),
('M17.9', '膝关节炎', '骨科', 920000.00, 680000.00, 32, 24, 8.3, '2024-01-15', 'DOC010');

-- 5. 创建科室表（可选，用于关联查询）
CREATE TABLE IF NOT EXISTS departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    dept_code VARCHAR(20) NOT NULL UNIQUE,
    dept_name VARCHAR(50) NOT NULL,
    director VARCHAR(50),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO departments (dept_code, dept_name, director, phone) VALUES
('CARDIO', '心内科', '张主任', '0757-12345678'),
('NEURO', '神经内科', '李主任', '0757-12345679'),
('RESPIR', '呼吸内科', '王主任', '0757-12345680'),
('GASTRO', '消化内科', '赵主任', '0757-12345681'),
('ORTHO', '骨科', '陈主任', '0757-12345682');

-- 6. 创建医生表（可选）
CREATE TABLE IF NOT EXISTS doctors (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    department VARCHAR(50),
    title VARCHAR(30),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO doctors (id, name, department, title, phone) VALUES
('DOC001', '张医生', '心内科', '主任医师', '13800138001'),
('DOC002', '李医生', '心内科', '副主任医师', '13800138002'),
('DOC003', '王医生', '神经内科', '主任医师', '13800138003'),
('DOC004', '赵医生', '神经内科', '主治医师', '13800138004'),
('DOC005', '陈医生', '呼吸内科', '副主任医师', '13800138005'),
('DOC006', '刘医生', '呼吸内科', '主治医师', '13800138006'),
('DOC007', '杨医生', '消化内科', '主任医师', '13800138007'),
('DOC008', '周医生', '消化内科', '副主任医师', '13800138008'),
('DOC009', '吴医生', '骨科', '主任医师', '13800138009'),
('DOC010', '郑医生', '骨科', '主治医师', '13800138010');

-- 7. 创建视图（便于查询）
CREATE OR REPLACE VIEW v_disease_benefit_summary AS
SELECT 
    d.disease_code,
    d.disease_name,
    d.department,
    d.cases,
    d.revenue,
    d.cost,
    d.profit,
    d.avg_revenue,
    d.avg_cost,
    d.avg_profit,
    d.profit_rate,
    d.avg_stay,
    d.record_date,
    doc.name as doctor_name,
    doc.title as doctor_title
FROM disease_benefit d
LEFT JOIN doctors doc ON d.doctor_id = doc.id
ORDER BY d.record_date DESC, d.profit_rate DESC;

-- 8. 查询示例
-- 查看所有数据
-- SELECT * FROM v_disease_benefit_summary;

-- 按科室统计
-- SELECT 
--     department,
--     COUNT(*) as disease_count,
--     SUM(cases) as total_cases,
--     SUM(revenue) as total_revenue,
--     SUM(cost) as total_cost,
--     SUM(profit) as total_profit,
--     AVG(profit_rate) as avg_profit_rate
-- FROM disease_benefit 
-- GROUP BY department
-- ORDER BY total_profit DESC;

-- 查看高效益病种（结余率>20%）
-- SELECT * FROM disease_benefit WHERE profit_rate > 20 ORDER BY profit_rate DESC;

COMMIT;