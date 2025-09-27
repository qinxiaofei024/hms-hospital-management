var originalCreateFVSService = window.createFVSService;
var createService = function({sessionID, servletURL, ajaxFn}) {
    var getStore = function () {
        FR.collectPreviewInfo(sessionID);
        return new Promise(function (resolve, reject) {
            ajaxFn({
                url: servletURL + '/store',
                type: 'GET',
                headers: {
                    sessionID: sessionID
                },
                dataType: 'json',
                complete: function (result, status) {
                    if (status === "success") {
                        try {
                            var object;
                            if (result.responseJSON && result.responseJSON.store) {
                                object = result.responseJSON;
                            } else {
                                object = JSON.parse(result.responseText);
                                object.store = JSON.parse(object.store);
                            }
                            try {
                                if (object.store) {
                                    object.store.parameterConfigs = object.parameterConfigs;
                                    object.store.preParameters = object.preParameters;
                                    if (object.adaptiveMode) {
                                        object.store.adaptiveMode = object.adaptiveMode;
                                    }
                                }
                                object.websocket.token = FR.CookieInfor.getCookieByName("fine_auth_token");
                                object.websocket.token = object.websocket.token ==  null ? "" : object.websocket.token;
                            } catch(e1) {
                                console.error(e1);
                            }
                            resolve(object);
                        } catch (e) {
                            reject(result.responseText);
                        }
                    } else {
                        reject(status);
                    }
                },
            });
        });
    };

    return {
        getStore
    }
}

window.createFVSService = function({sessionID, servletURL, ajaxFn = FR.ajax.bind(FR), fineServletURL = FR.fineServletURL}) {
    const service = createService({sessionID, servletURL,ajaxFn});
    const originalService = originalCreateFVSService({sessionID, servletURL,ajaxFn, fineServletURL});
    originalService.sharedCrudService.getStore = service.getStore;
    return originalService;
}

!function () {
    var service = window.createFVSService({
        sessionID: FR.SessionMgr.getSessionID(),
        servletURL: FR.servletURL,
    })
    const el = document.getElementById('root');
    if (window.duchampInit) {
        const initFunc = function (opts, envInfo) {

            window.duchampInit({
                el,
                ...opts,
                crudService: window.sharedCrudService,
                language: window.language,
                fvsService: {
                    ...window.sharedFvsService,
                    getEnvInfo: () => {
                        return {
                            assetBaseUrl: window.assetBaseUrl,
                            resourceBaseUrl: window.resourceBaseUrl,
                            remoteServletUrl: window.remoteServletURL,
                            ...envInfo
                        }
                    }
                },
                otherService: window.sharedOtherService,
            })
        }

        service.sharedCrudService.getStore().then(data => {
            initFunc({data},{tplPath: data.tplPath, tplLastModifiedTime: data.tplLastModifiedTime, ...data.envInfo});
        }).catch(error => {
            console.error("duchampInit Error:", error);
            initFunc({error},{});
        })
    }

    const exitCustomResource = function(resource) {
        return service.existFile({
            url: FR.servletURL + "/resource/preview",
            data: {
                resource,
                onlyCheckFound: true,
                __UUID__VERSION__: service.guid()
            }
        })
    };

    function isAndroid() {
      return /(android|linux|adr)/i.test(window.navigator.userAgent);
    }

    function isWxWork() {
      return /wxwork/i.test(window.navigator.userAgent);
    }

    /**
     * 电话、邮件、短信
     */
    const SYSTEM_PROTOCOL_LINKS = ["tel:", "mailto:", "sms:"];

    function isSystemProtocolLink(target) {
        const el = target.activeElement;
        if(!el) {
            return false;
        }
        return (
            el.tagName === "A" &&
            SYSTEM_PROTOCOL_LINKS.some((protocol) => el.href.startsWith(protocol))
        );
    }

    if(isAndroid() && isWxWork()) {
        window.addEventListener("beforeunload", function (e) {
            if (isSystemProtocolLink(e.target)) {
                return;
            }
            const sid = FR.SessionMgr.getSessionID();
            if (navigator.sendBeacon) {
                navigator.sendBeacon(FR.servletURL + "?op=closesessionid&sessionID=" + sid, new FormData())
            } else {
                var closeSession = function () {
                    FR.ajax({
                        async: false,
                        url: FR.servletURL,
                        data: {
                            op: 'closesessionid',
                            sessionID: sid,
                        }
                    });
                };
                closeSession();
            }
        })
    }

    window.Van = window.Van || {};
    Van.previewOverrideFunction = {};
    Van.previewOverrideFunction.exitCustomResource = exitCustomResource;

}();