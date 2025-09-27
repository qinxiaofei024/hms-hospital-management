window.createFVSService = function ({
                                        sessionID,
                                        servletURL,
                                        ajaxFn = FR.ajax.bind(FR),
                                        fineServletURL = FR.fineServletURL
                                    }) {
    var ajax = function (options, responseTextFn) {
        return new Promise(function (resolve, reject) {
            ajaxFn({
                type: 'POST',
                url: servletURL,
                headers: {
                    sessionID: sessionID
                },
                dataType: 'json',
                complete: function (result, status) {
                    if (status === "success") {
                        resolve(result.responseText ? (responseTextFn ? responseTextFn.call(this, result.responseText) : JSON.parse(result.responseText)) : undefined);
                    } else {
                        reject(status);
                    }
                },
                ...options,
            });
        });
    };

    var normalSessionIDRequest = function (path, data, responseTextFn) {
        return ajax({
            url: servletURL + path,
            data
        }, responseTextFn)
    };

    var parseSingleDate = function (v) {
        if (v && v.__time__) {
            return new Date(v.__time__)
        }
        if (typeof v === 'string') {
            try {
                var parsed = JSON.parse(v)
                if (parsed && parsed.__time__) {
                    return new Date(parsed.__time__);
                }
            } catch {
            }
        }
        return v
    }

    var parseDateFn = function (responseText) {
        var result = JSON.parse(responseText);
        if (result.result) {
            Object.keys(result.result).forEach(key => {
                var singleResult = result.result[key];
                if (singleResult && singleResult.__time__) {
                    result.result[key] = parseSingleDate(singleResult)
                }
                if (Array.isArray(singleResult)) {
                    result.result[key] = parseDate4Array(singleResult);
                }
            });
        }
        return result;
    };

    var parseDate4Array = function (array, checkItemIsArray = true) {
        return array.map(item => {
            // 目前只有二维数组，最多2层
            if (checkItemIsArray && Array.isArray(item)) {
                return parseDate4Array(item, false);
            }
            return parseSingleDate(item);
        });
    };

    var parseParamsFromFilter = function (filter) {
        const parameters = new Map();
        filter && filter.filters && filter.filters.forEach((item) => {
            if (item.targetType === "parameter" && "value" in item) {
                parameters.set(item.name, item.value);
            }
        });
        return Object.fromEntries(parameters);
    };

    var transformComputeData = function (path, configs, otherConfigs, useKey) {
        const computeConfigs = useKey ? configs.reduce((acc, item) => {
            return [...acc, {
                key: item.key,
                payload: item.value.payload,
                params: parseParamsFromFilter(item.value.filter)
            }];
        }, []) : configs.reduce((acc, item) => {
            return [...acc, {...item.value, key: item.key, params: parseParamsFromFilter(item.value.filter)}];
        }, []);
        return normalSessionIDRequest(path, {
            ...otherConfigs,
            configs: computeConfigs
        }, parseDateFn)
    };

    var computeFieldsOnPreview = function (path) {
        return function (data) {
            const {configs, ...others} = data;
            const arrayConfigs = Object.entries(configs).map(item => {
                return {key: item[0], value: item[1]}
            });
            return transformComputeData(path, arrayConfigs, others, true);
        }
    };

    var existFile = function (options) {
        return new Promise(function (resolve, reject) {
            ajaxFn({
                type: 'GET',
                url: FR.servletURL,
                headers: {
                    sessionID,
                },
                complete: function (result, status) {
                    resolve(result.responseText === "true");
                },
                error: function () {
                    resolve(false);
                    reject();
                },
                ...options,
            });
        });
    };

    function guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    let getWidgetOptions = function (config) {
        // viewlet只是为了解决浏览器缓存组件数据请求问题而引入的，不实际参与后端数据解析
        // 后端依靠sessionID就可以判断具体请求的是哪一个fvs文件中的组件了
        // 改正：不用viewlet，viewlet比较特殊，是保留字，模板认证那边如果有viewlet&sessionid走的是一个checker，如果只有sessionid，走的另一个checker
        // 三维和其他resource走一样逻辑，只有sessionid
        //第二次改正：挂载平台 没有viewlet。改成三维组件的配置属性都不走缓存
        return ajax({
            type: 'GET',
            url: servletURL + '/resource/preview',
            data: {
                resource: config.fileName,
                nullable: true,
                __UUID__VERSION__: guid()
            }
        });
    };


    function objectToUrlEncodedString(obj) {
        var formData = new FormData();
        Object.keys(obj).forEach((key) => {
            let value = obj[key];
            // 如果传的不是string，encode会有问题
            formData.append(key, FR.cjkEncode(typeof value !== "string" ? JSON.stringify(value) : value));
        });
        return new URLSearchParams(formData).toString();
    }

    function customAjax(option) {
        var options = {};
        options.data = option.data || {};
        options.url = option.url;
        options.success = option.success;
        options.responseType = option.responseType;
        options.type = option.type || "GET";
        options.contentType = option.contentType || "json";

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (options.success && typeof options.success === "function") {
                    options.success(xhr);
                }
            }
        };
        xhr.responseType = options.responseType;
        xhr.open(options.type, options.url, true);
        xhr.setRequestHeader("sessionID", sessionID);
        xhr.setRequestHeader("Authorization", 'Bearer ' + FR.CookieInfor.getCookieByName("fine_auth_token"));
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        if (options.contentType) {
            xhr.setRequestHeader("Content-Type", options.contentType);
        }
        xhr.send(options.type === "POST" ? objectToUrlEncodedString(options.data) : null);
    }

    var widgetExport = function (data) {
        var isExcel2003 = data.type.includes("isExcel2003");
        data["isExcel2003"] = isExcel2003;
        data.type = data.type.includes("simple") ? "simple": "page";
        customAjax({
            url: servletURL + '/widget/export',
            data,
            type: "POST",
            responseType: "blob",
            contentType: "application/x-www-form-urlencoded",
            success: (xhr) => {
                var contentDisposition = xhr.getResponseHeader("Content-Disposition");
                var contentType = xhr.getResponseHeader("Content-Type");
                var blob = xhr.response;
                var match = contentDisposition.match(/filename=["']?([^"']+)["']?/);
                var filename;
                try {
                    filename = decodeURIComponent(escape(match[1]));
                } catch (error) {
                    filename = decodeURIComponent(match[1]);
                    console.error(error);
                } finally {
                    var tmpLink = document.createElement("a");
                    var blobData = new Blob([blob], {type: contentType});
                    var objectUrl = URL.createObjectURL(blobData);
                    tmpLink.href = objectUrl;
                    tmpLink.download = filename || data.widgetName;
                    tmpLink.click();
                    setTimeout(() => {
                        URL.revokeObjectURL(objectUrl);
                    }, 200);
                }
            },
        });
    };

    var getTemplateServletUrl = function (relativePath) {
        if (relativePath.endsWith(".cpt")) {
            return fineServletURL + '/view/report';
        } else if (relativePath.endsWith(".frm")) {
            return fineServletURL + '/view/form';
        }
        return servletURL;
    }

    var executeIframeTplUrl = function (relativePath) {
        return getTemplateServletUrl(relativePath) + "?viewlet=" + encodeURIComponent(encodeURIComponent(relativePath));
    };

    var calculateChartInEC = function (data) {
        return ajax({
            url: servletURL + '/fit/form/chart/data',
            data,
        });
    };

    var calculateChartHyperlinkInEC = function (data) {
        return ajax({
            url: servletURL + '/fit/form/chart/calculate/hyperlink',
            data,
        });
    };

    var refreshChartInEC = function (data) {
        return ajax({
            type: 'GET',
            url: fineServletURL + "/view/report",
            data: {
                op: "chartlink",
                cmd: "refresh_relate_data",
                sessionID: sessionID,
                dynamicHyperlink: true,
                toVanCharts: true,
                chartWidth: 0,
                chartHeight: 0,
                ...data,
            },
        });
    };

    var getParameterNames = function () {
        return ajax({
            url: servletURL + '/parameters/names',
            type: 'GET',
        });
    };

    let getOffScreenSignalingParameters = function () {
        return ajax({
            url: servletURL + '/offScreen/signalingParameters',
            type: 'GET'
        });
    };

    let joinRoom = function (roomID) {
        return ajax({
            url: servletURL + '/offScreen/joinRoom',
            type: 'GET',
            data: {
                role: "local",
                roomID
            }
        });
    };

    let isRemoteJoinRoom = function (roomID) {
        return ajax({
            url: servletURL + '/offScreen/isRemoteJoin',
            type: 'GET',
            data: {
                roomID
            },
        });
    };

    let saveWebRTCMessage = function (roomID, type, message) {
        return ajax({
            url: servletURL + '/offScreen/saveMessage/' + type,
            type: 'POST',
            data: {
                role: 'local',
                roomID,
                message
            }
        });
    };

    let getAnswer = function (roomID) {
        return ajax({
            url: servletURL + '/offScreen/getAnswer',
            type: 'GET',
            data: {
                roomID
            }
        });
    }

    let getRemoteIceCandidate = function (roomID) {
        return ajax({
            url: servletURL + '/offScreen/getRemoteIceCandidate',
            type: 'GET',
            contentType: "application/json",
            data: {
                roomID
            }
        });
    }

    let clearRoomMessage = function (roomID) {
        return new Promise(function (resolve, reject) {
            ajax({
                type: 'GET',
                url: servletURL + '/offScreen/clear',
                data: {
                    roomID
                },
                complete: function (result, status) {
                    if (status === "success" && JSON.parse(result.responseText).finish) {
                        resolve();
                    } else {
                        reject();
                    }
                }
            });
        });
    }

    let getDeviceTypeFromUrlIfExist = function () {
        const deviceType = new URLSearchParams(window.location.search).get("deviceType");
        return deviceType ? {deviceType} : {};
    }

    let getCollections = function () {
        return new Promise(function (resolve, reject) {
            ajaxFn({
                url: fineServletURL + '/v10/favorite/entry/list',
                complete: (result, status) => {
                    if (status === "success") {
                        resolve(result);
                    } else {
                        reject(status);
                    }
                },
                headers: getDeviceTypeFromUrlIfExist()
            });
        })
    }

    let addCollection = function (id) {
        if (!id) return;
        return new Promise(function (resolve, reject) {
            ajaxFn({
                url: fineServletURL + '/v10/favorite/entry/' + id,
                type: "post",
                complete: (result, status) => {
                    if (status === "success") {
                        resolve(result);
                    } else {
                        reject(status);
                    }
                },
                headers: getDeviceTypeFromUrlIfExist()
            });
        })
    }

    let removeCollection = function (id) {
        if (!id) return;
        return new Promise(function (resolve, reject) {
            ajaxFn({
                url: fineServletURL + '/v10/favorite/entry/' + id,
                type: "delete",
                complete: (result, status) => {
                    if (status === "success") {
                        resolve(result);
                    } else {
                        reject(status);
                    }
                },
                headers: getDeviceTypeFromUrlIfExist()
            });
        })
    }

    let getGlobalConfig = function () {
        return new Promise(function (resolve, reject) {
            ajaxFn({
                url: fineServletURL + '/v10/mobile/global/config',
                complete: (result, status) => {
                    if (status === "success") {
                        resolve(result);
                    } else {
                        reject(null);
                    }
                },
                headers: getDeviceTypeFromUrlIfExist()
            });
        })
    }

    let getModulesConfig = function () {
        return new Promise(function (resolve, reject) {
            ajaxFn({
                url: fineServletURL + '/v10/mobile/modules',
                complete: (result, status) => {
                    if (status === "success") {
                        resolve(result);
                    } else {
                        reject(null);
                    }
                },
                headers: getDeviceTypeFromUrlIfExist()
            });
        })
    }

    let hasMonitorVideoEnv = function () {
        return new Promise(function (resolve, reject) {
            ajaxFn({
                type: 'GET',
                url: FR.servletURL + '/monitor/check',
                headers: {
                    sessionID: sessionID
                },
                complete: function (result, status) {
                    if (status === "success") {
                        resolve(JSON.parse(result.responseText).check);
                    } else {
                        reject();
                    }
                }
            });
        });
    }

    let getMonitorVideoMessage = function (url) {
        return new Promise(function (resolve, reject) {
            ajax({
                url: servletURL + '/monitor/init',
                data: {
                    url: url,
                },
                complete: function (result, status) {
                    if (status === "success") {
                        let data = JSON.parse(result.responseText);
                        if (data.errorCode) {
                            reject(data);
                        } else if (data.success && data.id) {
                            let path = servletURL + '/monitor/play?id=' + data.id + '&sessionID=' + sessionID;
                            // 如果支持ws直接返回id，通过ws建立视频连接
                            resolve({url: path, hasAudio: data.hasAudio, id: data.transport === 'ws' ? data.id : null});
                        }
                    } else {
                        reject();
                    }
                }
            });
        });
    }

    let playMonitorVideo = function (data) {
        return ajax({
            url: servletURL + '/monitor/start',
            data: data,
        })
    }

    let endMonitorVideo = function (data) {
        return ajax({
            url: servletURL + '/monitor/end',
            data: data,
        })
    }

    let sendEmail = function (data) {
        return ajax({
            url: fineServletURL + "/view/fit/form/email/send",
            data: data
        })
    }

    let registerComputes = function (data) {
        return ajax({
            url: fineServletURL + "/view/duchamp/compute/monitor/register",
            data: {
                sessionID,
                computes: data
            }
        })
    }

    let checkPlainComputes = function (data) {
        return ajax({
            url: fineServletURL + "/view/duchamp/compute/check/plain/computes",
            data: {
                sessionID,
                computes: data
            }
        })
    }


    let listenComputes = function (data) {
        return ajax({
            url: FR.fineServletURL + "/view/duchamp/compute/listen/computes",
            data: {
                sessionID,
                computes: data
            }
        })
    }

    let heartbeat = function () {
        ajaxFn({
            url: servletURL,
            async: true,
            data: {
                sessionID
            },
        });
    }

    const remoteGetDepsSync = function (formulas) {
        const key = "__get_deps_sync__";
        let result = null;
        ajax({
            type: 'POST',
            url: servletURL + "/compute/attribute/dependence/para",
            async: false,
            dataType: 'json',
            data: {
                configs: [{
                    type: "formula",
                    columns: formulas.map(item => {
                        return {
                            formula: item
                        }
                    }),
                    key: key
                }]
            },
            timeout: 5000,
            complete: function (data, error) {
                const value = FR.jsonDecode(data.responseText);
                if (value["error"]) {
                    FR.Msg.toast(FR.i18nText(value["error"]))
                }
                if ("result" in value) {
                    const targetDeps = value["result"][key];
                    targetDeps && (result = {result: targetDeps});
                } else {
                    result = error;
                }
            }
        });
        return result;
    }

    const remoteComputeSync = function (formula, params) {
        let result = null;
        ajax({
            url: servletURL,
            type: "POST",
            async: false,
            data: {
                ...params,
                cmd: "evaluate_formula",
                expression: formula,
                op: "fr_base",
            },
            timeout: 5000,
            complete: function (data, error) {
                const value = FR.jsonDecode(data.responseText);
                if (value["error"]) {
                    FR.Msg.toast(FR.i18nText(value["error"]))
                }
                if (value["forbidden"]) {
                    result = error
                } else {
                    result = value["result"]
                }
            }
        });
        return result;
    }

    return {
        ajax,
        guid,
        existFile,
        sharedCrudService: {
            compute: computeFieldsOnPreview("/compute"),
            getDeps: computeFieldsOnPreview("/compute/dependence"),
            getWidgetOptions: getWidgetOptions,
            getAllParameters: getParameterNames,
            getOffScreenSignalingParameters: getOffScreenSignalingParameters,
            joinRoom: joinRoom,
            isRemoteJoin: isRemoteJoinRoom,
            saveWebRTCMessage: saveWebRTCMessage,
            getAnswer: getAnswer,
            getRemoteIceCandidate: getRemoteIceCandidate,
            clearRoomMessage: clearRoomMessage,
            getMonitorVideoMessage: getMonitorVideoMessage,
            playMonitorVideo: playMonitorVideo,
            endMonitorVideo: endMonitorVideo,
            registerComputes: registerComputes,
            checkPlainComputes: checkPlainComputes,
            listenComputes: listenComputes,
        },
        sharedFvsService: {
            executeIframeTplURL: executeIframeTplUrl,
            openMask: function () {
            },
            closeMask: function () {
            },
            getServerInfo: function () {
                return ajax({url: servletURL + '/serverInfo'})
            },
            hasMonitorVideoEnv: hasMonitorVideoEnv,
            sendConsumePoint: function (data) {
                ajax({
                    url: servletURL + "/focus/point/record",
                    data: data
                })
            }

        },
        sharedOtherService: {
            export: widgetExport,
            executeChartInEC: calculateChartInEC,
            executeChartHyperlinkInEC: calculateChartHyperlinkInEC,
            refreshChartInEC: refreshChartInEC,
            sendEmail: sendEmail,
            getCollectionList: getCollections,
            addCollection: addCollection,
            removeCollection: removeCollection,
            getGlobalConfig: getGlobalConfig,
            getModulesConfig: getModulesConfig,
            heartbeat: heartbeat,
            remoteGetDepsSync: remoteGetDepsSync,
            remoteComputeSync: remoteComputeSync
        }
    }
}

!(function () {
    var service = createFVSService({
        sessionID: FR.SessionMgr.getSessionID(),
        servletURL: FR.servletURL,
    })

    window.sharedCrudService = service.sharedCrudService
    window.sharedFvsService = service.sharedFvsService
    window.sharedOtherService = service.sharedOtherService;
})();
