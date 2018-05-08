;(function (window, document, factory) {
    factory = factory(window, document)
    window.xutil = window.xutil || factory
})(window, document, function (window, document) {
    var xutil = {
        /* 数组处理相关方法 */
        // 数组去重（包括对象）
        unique: function (arr) {
            var ret = []
            var obj = {}
            for (var i = 0, arrLen = arr.length; i < arrLen; i++) {
                var item = arr[i]
                if (!obj[typeof item + JSON.stringify(item)]) {
                    obj[typeof item + JSON.stringify(item)] = true
                    ret.push(item)
                }
            }
            return ret
        },
        /* 函数处理相关 */
        // 函数节流
        throttle: function (func, wait, options) {
            var timeout, context, args, result
            var previous = 0

            options = options || {}

            var later = function () {
                previous = options.leading === false ? 0 : +new Date()
                timeout = null
                func.apply(context, args)
                if (!timeout) {
                    context = args = null
                }
            }

            var throttled = function () {
                var now = +new Date()

                if (!previous && options.leading === false) {
                    previous = now
                }

                var remaining = wait - (now - previous)

                context = this
                args = arguments

                if (remaining <= 0 || remaining > wait) {
                    if (timeout) {
                        clearTimeout(timeout)
                        timeout = null
                    }
                    previous = now
                    func.apply(context, args)
                } else if (!timeout && options.trailing !== false) {
                    timeout = setTimeout(later, remaining)
                }
            }

            throttled.cancel = function () {
                clearTimeout(timeout)
                previous = 0
                timeout = null
            }

            return throttled
        },
        // 函数防抖
        debounce: function (func, wait, immediate) {
            var timeout, result
            var debounced = function () {
                var context = this
                var args = arguments
                
                if (timeout) {
                    clearTimeout(timeout)
                }
                
                if (immediate) {
                    var callNow = !timeout
                    
                    timeout = setTimeout(function () {
                        timeout = null
                    }, wait)
                    
                    if (callNow) {
                        result = func.apply(context, args)
                    }
                } else {
                    timeout = setTimeout(function () {
                        func.apply(context, args)
                    }, wait)
                }
                return result
            }

            debounced.cancel = function () {
                clearTimeout(timeout)
                timeout = null
            }

            return debounced
        },
        /* 类型判断相关 */
        // 获取类型
        getType: function (obj) {

            var class2type = {}
            var strArr = 'Boolean Number String Function Array Date RegExp Object Error Null Undefined Symbol'.split(' ')

            for (var i = 0, len = strArr.length; i < len; i++) {
                var item = strArr[i]
                class2type['[object ' + item + ']'] = item.toLowerCase()
            }

            if (typeof obj === 'object' || typeof obj === 'function') {
                if (obj.nodeType === 1) {
                    return 'html'
                } else {
                    return class2type[Object.prototype.toString.call(obj)]
                }
            } else {
                return typeof obj
            }
        },
        /* 宿主环境相关方法 */
        // 获取浏览器信息
        getBrowser: function () {
            var ua = window.navigator.userAgent
            var ret = 'Unknown browser'
            if (ua.indexOf('Chrome') > -1) {
                ret = 'Chrome'
            }
            if (ua.indexOf("compatible") > -1 && ua.indexOf('MSIE') > -1 || ua.indexOf('like Gecko') >
                -1 && ua.indexOf('rv') > -1) {
                ret = 'Internet Explorer'
            }
            if (ua.indexOf('Opera') > -1) {
                ret = 'Opera'
            }
            if (ua.indexOf('Edge') > -1) {
                ret = 'Edge'
            }
            if (ua.indexOf('Firefox') > -1) {
                ret = 'Firefox'
            }
            if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) {
                ret = 'Safari'
            }
            if (ua.indexOf('QQBrowser') > -1) {
                ret = 'QQBrowser'
            }
            if (ua.indexOf('UCBrowser') > -1) {
                ret = 'UCBrowser'
            }
            if (ua.indexOf('MQQBrowser') > -1) {
                ret = 'QQ Browser Mobile'
            }
            if (ua.indexOf('MQQBrowser') > -1 && ua.indexOf('QQ/') > -1) {
                ret = 'QQ Browser built-in'
            }
            if (ua.indexOf('MicroMessenger') > -1) {
                ret = 'Wechat Browser built-in'
            }
            if (ua.indexOf('Weibo') > -1) {
                ret = 'Weibo built-in'
            }
            return ret
        },
        // 获取终端信息
        getOS: function () {
            var av = window.navigator.appVersion
            var ret = 'Unknown OS'
            if (av.indexOf('Win') > -1) {
                ret = 'Windows'
            }
            if (av.indexOf('Mac') > -1) {
                ret = 'MacOS'
            }
            if (av.indexOf('iPhone') > -1) {
                ret = 'IOS'
            }
            if (av.indexOf('Android') > -1) {
                ret = 'Android'
            }
            return ret
        },
        // 获取IE版本
        getIEVersion: function () {
            var ua = window.navigator.userAgent
            var ret = ''
            if (ua.indexOf('MSIE') > -1) {
                var reg = new RegExp('MSIE (\\d+\\.\\d+);');
                reg.test(ua);
                var version = parseFloat(RegExp['$1']);
                if (version < 7) {
                    ret = 'Below IE7, you need to upgrade'
                } else {
                    ret = 'IE' + version
                }
            } else if (ua.indexOf('like Gecko') > -1 && ua.indexOf('rv') > -1) {
                ret = 'IE11'
            } else if (ua.indexOf('Edge') > -1) {
                ret = 'IE Edge'
            } else {
                ret = 'Not IE Brower'
            }
            return ret
        },
        // 判断是否为移动端
        isMobile: function () {
            var ua = window.navigator.userAgent
            if (!!ua.match(/AppleWebKit.*Mobile.*/) && !!ua.match(/AppleWebKit/)) {
                return true
            } else {
                return false
            }
        },
    }
    return xutil
});