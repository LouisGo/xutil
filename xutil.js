;
(function (window, document, factory) {
    factory = factory(window, document)
    window.xutil = window.xutil || factory
})(window, document, function (window, document) {
    var xutil = {

        /* dom操作相关方法 */

        /**
         * @description 绑定事件
         * @returns {Function}
         */
        on: function () {
            if (document.addEventListener) {
                return function (element, event, handler) {
                    if (element && event && handler) {
                        element.addEventListener(event, handler, false)
                    }
                }
            } else {
                return function (element, event, handler) {
                    if (element && event && handler) {
                        element.attachEvent('on' + event, handler)
                    }
                }
            }
        },
        /**
         * @description 解除事件
         * @returns {Function}
         */
        off: function () {
            if (document.removeEventListener) {
                return function (element, event, handler) {
                    if (element && event && handler) {
                        element.removeEventListener(event, handler, false)
                    }
                }
            } else {
                return function (element, event, handler) {
                    if (element && event && handler) {
                        element.detachEvent('on' + event, handler)
                    }
                }
            }
        },

        /* 字符串处理相关方法 */

        /**
         * @description 去除字符串的左右空格
         * @param {Array} str 待处理的数组 
         * @returns {String}
         */
        trim: function (str) {
            return str.replace(/(^\s*)|(\s*$)/g, '')
        },
        /**
         * @description 去除字符串的所有空格
         * @param {Array} str 待处理的数组 
         * @returns {String}
         */
        trimAll: function (str) {
            return str.replace(/\s+/g, '')
        },
        /**
         * @description 去除字符串左边的空格
         * @param {Array} str 待处理的数组 
         * @returns {String}
         */
        trimLeft: function (str) {
            return str.replace(/(^\s*)/g, '')
        },
        /**
         * @description 去除字符串右边的空格
         * @param {Array} str 待处理的数组 
         * @returns {String}
         */
        trimRight: function (str) {
            return str.replace(/(\s*$)/g, '')
        },
        /**
         * @description 替换字符串中的中文，默认为去除
         * @param {Array} str 待处理的数组 
         * @param {String} replaceStr 要替换的字段
         * @returns {String}
         */
        filterChinese: function (str, replaceStr) {
            replaceStr = replaceStr || ''
            return str.replace(/[\u4E00-\u9FA5]/g, replaceStr);
        },

        /* 数组处理相关方法 */

        /**
         * @description 数组去重（包括对象)
         * @param {Array} arr 待处理的数组 
         * @returns {Array}
         */
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
        /**
         * @description 数组分块
         * @param {Array} arr 待处理的数组 
         * @param {Number} size 分块数量 
         * @returns {Array}
         */
        chunk: function (arr, size) {
            size = Math.max(size, 0)
            var length = arr == null ? 0 : arr.length

            if (!length || size < 1) {
                return []
            }

            var index = 0
            var resIndex = 0
            var ret = new Array(Math.ceil(length / size))

            while (index < length) {
                ret[resIndex++] = arr.slice(index, (index += size))
            }

            return ret
        },

        /* 函数处理相关 */

        /**
         * @description 函数节流
         * @param {function} func 节流的回调函数 
         * @param {number} wait 等待的时间间隔 
         * @param {object} options leading为false表示禁用第一次, trailing为false表示最后不会再执行一次。默认leading:true, trailing:true
         * @returns {function}
         */
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
        /**
         * @description 函数防抖
         * @param {function} func 防抖的回调函数
         * @param {number} wait 等待的时间间隔
         * @param {Boolean} immediate 设置为true时则表示立即调用一次
         * @returns {function}
         */
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
        /**
         * @description 判断数组是否含有
         * @param {String Number Object} value 待判断的值
         * @param {Array} arr 待判断的数组  
         * @returns {Boolean}
         */
        oneOf: function (value, arr) {
            for (var i = 0, len = arr.length; i < len; i++) {
                if (this.eq(value, arr[i])) {
                    return true
                }
            }
            return false
        },

        /* 类型判断相关 */

        /**
         * @description 判断元素类型
         * @param {Unknown} obj 待判断的值
         * @returns {String} 类型字段
         */
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
        /**
         * @description 判断是否相等（lodash规则）
         * @param {Unknown} value 待判断的值1
         * @param {Unknown} arr 待判断的值2
         * @returns {Boolean}
         */
        eq: function (value, other) {
            return value === other || (value !== value && other !== other)
        },

        /* 随机生成相关方法 */

        /**
         * @description 随机范围数值
         * @param {Number} num1 待生成的值1
         * @param {Number} num2 待生成的值2
         * @returns {Number} 
         */
        randomNumber: function (num1, num2) {
            var argsLen = arguments.length
            if (argsLen === 2) {
                return Math.round(num1 + Math.random() * (num2 - num1))
            } else if (argsLen === 1) {
                return Math.round(Math.random() * num1)
            } else {
                throw '请输入类型为Number的参数'
            }
        },
        /**
         * @description 随机生成颜色
         * @returns {String} 
         */
        randomColor: function () {
            return '#' + Math.random().toString(16).substring(2).substr(0, 6)
        },
        /**
         * @description 随机生成颜色RBG格式
         * @returns {String} 
         */
        randomColorWithRGB: function () {
            return 'rgb(' + this.randomNumber(255) + ',' + this.randomNumber(255) + ',' + this.randomNumber(255) + ')'
        },

        /* 宿主环境相关方法 */

        /**
         * @description 获取浏览器信息
         * @returns {String} 浏览器信息字段
         */
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
        /**
         * @description 获取终端信息
         * @returns {String} 终端信息字段
         */
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
        /**
         * @description 获取IE版本
         * @returns {Boolean} IE版本字段
         */
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
        /**
         * @description 判断是否为移动端
         * @returns {Boolean}
         */
        isMobile: function () {
            var ua = window.navigator.userAgent
            if (!!ua.match(/AppleWebKit.*Mobile.*/) && !!ua.match(/AppleWebKit/)) {
                return true
            } else {
                return false
            }
        },

        /* 本地化存储相关 */

        /**
         * @description 获取Cookie
         * @param {String} name 待获取cookie的名字
         * @returns {String}
         */
        getCookie: function (name) {
            var arr = document.cookie.split('; ')
            var ret
            for (var i = 0, len = arr.length; i < len; i++) {
                var temp = arr[i].split('=')
                if (temp[0] === name) {
                    ret = temp[1]
                    return ret
                }
            }
            if (!ret) {
                throw '未找到名称为' + name + '的参数，请检查拼写是否正确'
                return false
            }
        },
        /**
         * @description 设置Cookie
         * @param {String} name 待获取cookie的名字
         * @returns {Null}
         */
        setCookie: function (name, value, day) {
            var oDate = new Date()
            oDate.setDate(oDate.getDate() + day)
            document.cookie = name + '=' + value + ';expires=' + oDate
        },

        /* 请求协议相关 */

        /**
         * @description url参数解析
         * @param {String} value 当前url信息
         * @returns {String} source
         * @returns {String} protocol
         * @returns {String} host 
         * @returns {String} port
         * @returns {String} query
         * @returns {String} params
         * @returns {String} file
         * @returns {String} hash
         * @returns {String} path
         * @returns {String} relative
         * @returns {String} segments
         */
        parseUrl: function (url) {
            var a = document.createElement('a')
            a.href = url
            return {
                source: url,
                protocol: a.protocol.replace(':', ''),
                host: a.hostname,
                port: a.port,
                query: a.search,
                params: (function () {
                    var ret = {},
                        seg = a.search.replace(/^\?/, '').split('&'),
                        s
                    for (var i = 0, len = seg.length; i < len; i++) {
                        if (!seg[i]) {
                            continue
                        }
                        s = seg[i].split('=')
                        ret[s[0]] = s[1]
                    }
                    return ret
                })(),
                file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
                hash: a.hash.replace('#', ''),
                path: a.pathname.replace(/^([^\/])/, '/$1'),
                relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
                segments: a.pathname.replace(/^\//, '').split('/')
            }
        },
        /**
         * @description 请求data数据格式转换
         * @param {String} type 请求转换的类型值
         * @param {Object} data 请求转换的数据
         * @returns {Unknown}
         */
        transContentType: function (type, data) {
            var ret
            if (type === 'x-www-form-urlencoded') {
                ret = this._transFormUrlencoded(data)
            }
            return ret
        },
        /**
         * @description transContentType私有方法
         * @param {Object} data 请求转换的数据
         * @returns {String}
         */
        _transFormUrlencoded: function (data) {
            var ret = []
            for (var key in data) {
                ret.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
            }
            return ret.join('&')
        }
    }
    return xutil
});