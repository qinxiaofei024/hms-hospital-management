const Common = {
    // 获取URL参数（兼容旧接口）
    getUrlParam: function(name) {
        const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        const r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]);
        return null;
    },
    // 新接口别名（内部复用旧实现）
    getQueryString: function(name) {
        return this.getUrlParam(name);
    },

    // 格式化数字为千分位
    formatNumber: function(num) {
        if (typeof num !== 'number' && typeof num !== 'string') return num;
        
        const str = num.toString();
        const parts = str.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    },

    // 格式化日期
    formatDate: function(date, format = 'yyyy-MM-dd') {
        if (!date) return '';
        
        const d = new Date(date);
        const o = {
            'M+': d.getMonth() + 1,
            'd+': d.getDate(),
            'h+': d.getHours(),
            'm+': d.getMinutes(),
            's+': d.getSeconds(),
            'q+': Math.floor((d.getMonth() + 3) / 3),
            'S': d.getMilliseconds()
        };
        
        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        
        for (const k in o) {
            if (new RegExp('(' + k + ')').test(format)) {
                format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
            }
        }
        
        return format;
    },

    // 防抖函数
    debounce: function(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    },

    // 节流函数
    throttle: function(func, delay) {
        let previous = 0;
        return function() {
            const now = Date.now();
            const context = this;
            const args = arguments;
            if (now - previous > delay) {
                func.apply(context, args);
                previous = now;
            }
        };
    },

    // 深拷贝
    deepClone: function(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        
        const clonedObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = this.deepClone(obj[key]);
            }
        }
        
        return clonedObj;
    },

    // 平滑滚动到指定元素
    scrollToElement: function(selector, offset = 0) {
        const element = document.querySelector(selector);
        if (element) {
            const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    },

    // 动态加载CSS
    loadCSS: function(url) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        document.head.appendChild(link);
    },

    // 动态加载JavaScript
    loadJS: function(url, callback) {
        const script = document.createElement('script');
        script.src = url;
        script.onload = callback;
        document.body.appendChild(script);
    },

    // 确保 ECharts 已加载（CDN 优先，本地回退）
    ensureEcharts: function() {
        return new Promise((resolve, reject) => {
            // 已存在则直接返回
            if (window.echarts) {
                resolve(window.echarts);
                return;
            }
            
            // 如果正在加载，等待加载完成
            if (this._echartsLoading) {
                document.addEventListener('echartsLoaded', () => {
                    resolve(window.echarts);
                }, { once: true });
                return;
            }
            
            this._echartsLoading = true;

            const isPages = /\/pages\//.test(window.location.pathname);
            const localSrc = isPages ? '../js/echarts.min.js' : 'js/echarts.min.js';

            // 如已有 echarts 脚本标签，则不再重复插入
            const hasScript = Array.from(document.scripts).some(s => /echarts(\.min)?\.js/i.test(s.src || ''));
            if (hasScript && window.echarts) {
                resolve(window.echarts);
                return;
            }

            // 加载本地ECharts文件
            this.loadJS(localSrc, () => {
                if (window.echarts) {
                    this._echartsLoading = false;
                    if (!this._echartsLoaded) {
                        this._echartsLoaded = true;
                        document.dispatchEvent(new Event('echartsLoaded'));
                    }
                    resolve(window.echarts);
                } else {
                    this._echartsLoading = false;
                    reject(new Error('Failed to load ECharts'));
                }
            });
        });
    },

    // 确保全局图标样式已加载
    ensureIcons: function() {
        try {
            if (this._iconsLoaded) return;
            const isPages = /\/pages\//.test(window.location.pathname);
            const cssHref = isPages ? '../css/icons.css' : 'css/icons.css';

            // 避免重复插入
            const hasLink = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(l => {
                const href = (l.getAttribute('href') || '').toLowerCase();
                return href.endsWith('icons.css') || href.includes('/css/icons.css');
            });

            if (!hasLink) {
                this.loadCSS(cssHref);
            }
            this._iconsLoaded = true;
        } catch (e) {
            // 静默失败，避免影响主流程
            console.warn('ensureIcons failed:', e);
        }
    },

    // 获取当前时间
    getCurrentTime: function() {
        return new Date().toLocaleString('zh-CN');
    },

    // 显示加载动画
    showLoading: function() {
        let loading = document.getElementById('loading');
        if (!loading) {
            loading = document.createElement('div');
            loading.id = 'loading';
            loading.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(255, 255, 255, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
            `;
            loading.innerHTML = `
                <div style="text-align: center;">
                    <div style="width: 40px; height: 40px; border: 3px solid #f3f3f3; border-top: 3px solid #0066cc; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
                    <p style="margin-top: 10px; color: #666;">加载中...</p>
                </div>
            `;
            document.body.appendChild(loading);
            
            // 添加旋转动画
            const style = document.createElement('style');
            style.innerHTML = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        loading.style.display = 'flex';
    },

    // 隐藏加载动画
    hideLoading: function() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'none';
        }
    },

    // 显示提示信息
    showToast: function(message, type = 'info', duration = 3000) {
        // 先移除已有的toast
        const oldToast = document.querySelector('.toast');
        if (oldToast) {
            document.body.removeChild(oldToast);
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 10px 20px;
            border-radius: 4px;
            color: white;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
        `;
        
        // 设置不同类型的背景色
        switch (type) {
            case 'success':
                toast.style.backgroundColor = '#52c41a';
                break;
            case 'error':
                toast.style.backgroundColor = '#f5222d';
                break;
            case 'warning':
                toast.style.backgroundColor = '#faad14';
                break;
            default:
                toast.style.backgroundColor = '#0066cc';
        }

        toast.textContent = message;
        document.body.appendChild(toast);

        // 显示toast
        setTimeout(() => {
            toast.style.opacity = '1';
        }, 10);

        // 自动隐藏
        setTimeout(() => {
            toast.style.opacity = '0';
        }, duration);
    },

    // 展开/收起菜单
    toggleMenu: function() {
        // 使用getElementsByClassName替代querySelectorAll以提高兼容性
        const menuItems = document.getElementsByClassName('menu-item');
        
        // 转换为数组以便使用forEach
        Array.prototype.forEach.call(menuItems, function(item) {
            // 查找子菜单
            let subMenu = null;
            const children = item.children;
            for (let i = 0; i < children.length; i++) {
                if (children[i].className && children[i].className.includes('sub-menu')) {
                    subMenu = children[i];
                    break;
                }
            }
            
            // 查找第一个链接元素
            let mainLink = null;
            const links = item.getElementsByTagName('a');
            if (links.length > 0) {
                mainLink = links[0];
            }
            
            if (subMenu && mainLink) {
                // 给主链接添加点击事件，用于展开/收起子菜单和锚点滚动
            mainLink.onclick = function(e) {
                // 获取href属性
                const href = this.getAttribute('href');
                
                // 如果链接是锚点链接（以#开头但不是#）
                if (href && href.startsWith('#') && href !== '#') {
                    e.preventDefault();
                    
                    // 切换active类
                    if (item.className.includes('active')) {
                        item.className = item.className.replace('active', '').trim();
                    } else {
                        item.className += ' active';
                    }
                    
                    // 切换子菜单显示状态
                    if (subMenu.style.display === 'block') {
                        subMenu.style.display = 'none';
                    } else {
                        subMenu.style.display = 'block';
                    }
                    
                    // 滚动到对应的锚点位置
                    Common.scrollToElement(href, 60);
                }
                // 如果链接没有href或href为#，只阻止默认行为和切换菜单
                else if (!href || href === '#') {
                    e.preventDefault();
                    
                    // 切换active类
                    if (item.className.includes('active')) {
                        item.className = item.className.replace('active', '').trim();
                    } else {
                        item.className += ' active';
                    }
                    
                    // 切换子菜单显示状态
                    if (subMenu.style.display === 'block') {
                        subMenu.style.display = 'none';
                    } else {
                        subMenu.style.display = 'block';
                    }
                }
                // 否则允许链接正常跳转
            };
            }
        });
    },

    // 初始化侧边栏菜单
    initSidebar: function() {
        this.toggleMenu();
        
        // 根据URL设置当前激活的菜单
        const currentPath = window.location.pathname;
        const menuLinks = document.querySelectorAll('nav a');
        
        menuLinks.forEach(link => {
            if (link.getAttribute('href') && currentPath.includes(link.getAttribute('href'))) {
                // 移除所有激活状态
                document.querySelectorAll('.menu-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // 设置当前链接的父级菜单为激活状态
                let parent = link.parentElement;
                while (parent && !parent.classList.contains('menu-item')) {
                    parent = parent.parentElement;
                }
                
                if (parent) {
                    parent.classList.add('active');
                    // 确保所有父级菜单都展开
                    let grandParent = parent.parentElement.parentElement;
                    while (grandParent && grandParent.classList.contains('menu-item')) {
                        grandParent.classList.add('active');
                        // 展开子菜单
                        const subMenu = grandParent.querySelector('.sub-menu');
                        if (subMenu) {
                            subMenu.style.display = 'block';
                        }
                        grandParent = grandParent.parentElement.parentElement;
                    }
                }
            }
        });
    },

    // 初始化页面（幂等）
    initPage: function() {
        // 防止重复初始化
        if (this._initialized) {
            // 仍然可以在后续执行轻量操作（如更新激活菜单）
            this.initSidebar();
            return;
        }
        this._initialized = true;

        // 首次初始化时确保 ECharts 加载
        this.ensureEcharts();
        // 注入全局图标样式（icon-* & Font Awesome 检测加载）
        this.ensureIcons();

        // 侧边栏初始化
        this.initSidebar();
    }
};

// 页面加载完成后初始化（统一入口，仅一次）
window.addEventListener('DOMContentLoaded', function() {
    Common.initPage();
});

// 导航加载完成后，重新初始化侧边栏（确保动态注入的菜单绑定事件）
document.addEventListener('navigationLoaded', function() {
    try {
        if (typeof Common !== 'undefined' && Common.initSidebar) {
            Common.initSidebar();
        }
    } catch (e) {
        // 静默处理，避免影响主流程
        console.warn('Re-init sidebar after navigationLoaded failed:', e);
    }
});

// 通用导出与表格工具模块（跨页面复用）
Common.Export = {
    // 动态确保 html2pdf.js 已加载
    ensureHtml2pdf: function() {
        return new Promise(function(resolve, reject) {
            if (window.html2pdf) return resolve();
            if (Common.Export._html2pdfLoading) {
                var timer = setInterval(function(){
                    if (window.html2pdf) { clearInterval(timer); resolve(); }
                }, 100);
                setTimeout(function(){ clearInterval(timer); if (!window.html2pdf) reject(); }, 5000);
                return;
            }
            Common.Export._html2pdfLoading = true;
            Common.loadJS('./js/html2pdf.bundle.min.js', function(){
                if (window.html2pdf) resolve(); else reject();
            });
        });
    },
    // 动态确保 SheetJS (XLSX) 已加载
    ensureXLSX: function() {
        return new Promise(function(resolve, reject) {
            if (window.XLSX) return resolve();
            if (Common.Export._xlsxLoading) {
                var timer = setInterval(function(){ if (window.XLSX) { clearInterval(timer); resolve(); } }, 100);
                setTimeout(function(){ clearInterval(timer); if (!window.XLSX) reject(); }, 5000);
                return;
            }
            Common.Export._xlsxLoading = true;
            Common.loadJS('./js/xlsx.full.min.js', function(){
                if (window.XLSX) resolve(); else reject();
            });
        });
    },

    // 将表格转换为 AOA（支持 thead/tbody，忽略 data-export="false"）
    tableToAOA: function(tableEl){
        var aoa = [];
        if (!tableEl) return aoa;
        var addRowFromCells = function(row){
            var cells = row.querySelectorAll('th,td');
            var arr = [];
            for (var i=0;i<cells.length;i++){
                var cell = cells[i];
                if (cell.getAttribute && cell.getAttribute('data-export') === 'false') continue;
                arr.push((cell.innerText || cell.textContent || '').replace(/\s+/g,' ').trim());
            }
            if (arr.length) aoa.push(arr);
        };
        var thead = tableEl.querySelector('thead');
        if (thead){ thead.querySelectorAll('tr').forEach(addRowFromCells); }
        var tbody = tableEl.querySelector('tbody');
        if (tbody){ tbody.querySelectorAll('tr').forEach(addRowFromCells); }
        if (!thead && !tbody){ tableEl.querySelectorAll('tr').forEach(addRowFromCells); }
        return aoa;
    },
    _csvEscape: function(val){
        if (val == null) return '';
        var s = String(val).replace(/\r?\n/g, ' ');
        if (/[",]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
        return s;
    },
    tableToCSV: function(tableEl){
        var aoa = Common.Export.tableToAOA(tableEl);
        return aoa.map(function(row){ return row.map(Common.Export._csvEscape).join(','); }).join('\r\n');
    },

    _dataURLtoBlob: function(dataurl){
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]);
        var n = bstr.length, u8arr = new Uint8Array(n);
        while(n--) u8arr[n] = bstr.charCodeAt(n);
        return new Blob([u8arr], {type:mime});
    },
    _saveBlob: function(blob, filename){
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url; a.download = filename || 'download';
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },
    _downloadCSV: function(csv, filename){
        var blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
        Common.Export._saveBlob(blob, filename || 'data.csv');
    },

    // 导出 PDF：target 可以是元素或选择器
    exportToPDF: function(target, options){
        var el = target;
        if (!el) el = document.querySelector('.content') || document.querySelector('.container') || document.body;
        if (typeof target === 'string') el = document.querySelector(target) || el;
        return Common.Export.ensureHtml2pdf().then(function(){
            var opt = Object.assign({
                margin: 10,
                filename: (options && options.filename) || '报告.pdf',
                image: { type: 'jpeg', quality: 0.95 },
                html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
                jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
            }, options || {});
            return window.html2pdf().set(opt).from(el).save();
        });
    },

    // 导出 Excel：tables 为元素数组或选择器数组
    exportToExcel: function(tables, filename){
        var tableEls = [];
        if (!tables) {
            // 自动收集常见表格
            ['table','[role="table"]'].forEach(function(sel){
                document.querySelectorAll(sel).forEach(function(t){ tableEls.push(t); });
            });
        } else if (Array.isArray(tables)) {
            tables.forEach(function(t){
                if (typeof t === 'string') {
                    var found = document.querySelector(t);
                    if (found) tableEls.push(found);
                } else if (t && t.nodeType === 1) {
                    tableEls.push(t);
                }
            });
        } else if (typeof tables === 'string') {
            var t = document.querySelector(tables); if (t) tableEls.push(t);
        } else if (tables && tables.nodeType === 1) {
            tableEls.push(tables);
        }
        if (!tableEls.length) { Common.showToast('未找到可导出的表格','warning'); return Promise.resolve(); }

        return Common.Export.ensureXLSX().then(function(){
            var wb = window.XLSX.utils.book_new();
            tableEls.forEach(function(tbl, idx){
                var aoa = Common.Export.tableToAOA(tbl);
                var ws = window.XLSX.utils.aoa_to_sheet(aoa);
                var name = tbl.getAttribute('data-title') || tbl.getAttribute('aria-label') || (tbl.id || ('表格' + (idx+1)));
                name = String(name).slice(0,31) || ('Sheet' + (idx+1));
                window.XLSX.utils.book_append_sheet(wb, ws, name);
            });
            var wbout = window.XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            Common.Export._saveBlob(new Blob([wbout], {type:'application/octet-stream'}), filename || '导出数据.xlsx');
        }).catch(function(){
            // 回退：导出 CSV（每个表一个 CSV）
            tableEls.forEach(function(tbl){
                var csv = Common.Export.tableToCSV(tbl);
                var name = tbl.getAttribute('data-title') || tbl.getAttribute('aria-label') || tbl.id || '表格';
                Common.Export._downloadCSV(csv, (name || '表格') + '.csv');
            });
        });
    },

    // 批量导出 ECharts 图表为 PNG
    exportCharts: function(charts, prefix){
        var list = [];
        if (!charts) return 0;
        if (Array.isArray(charts)) list = charts; else if (typeof charts === 'object') list = Object.keys(charts).map(function(k){ return { key: k, inst: charts[k] }; });
        var exported = 0;
        list.forEach(function(item, i){
            var inst = item && (item.inst || item);
            if (inst && typeof inst.getDataURL === 'function'){
                try {
                    var dataURL = inst.getDataURL({ type:'png', pixelRatio: 2, backgroundColor: '#ffffff' });
                    var blob = Common.Export._dataURLtoBlob(dataURL);
                    var name = (prefix ? prefix + '_' : '') + (item.key || ('chart' + (i+1))) + '.png';
                    Common.Export._saveBlob(blob, name);
                    exported++;
                } catch (e) { console.error('导出图表失败', e); }
            }
        });
        if (!exported) Common.showToast('未找到可导出的图表','warning');
        return exported;
    }
};