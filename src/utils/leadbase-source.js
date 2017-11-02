/**
 * Creat by jiao yang for Leadbank
 * version 0.5
 *
 * @module LeadBase           // Base Object
 * @method ajax;              // Ajax 请求
 * @method shareApp           // 分享到微信、朋友圈
 * @method hideShare          // 隐藏分享
 * @method GetQueryString;    // url参数获取
 * @method encrypts;          // SHA 请求加密
 * @method tracking;          // tracking 用户行为数据收集
 * @Object reg;               // reg 正则验证
 * @Object Pull               // 上拉、下拉
 * @method $.showIndicator()  // loading 提示
 * @method $.hideIndicator()  // 隐藏loading
 * @method $.toast(text);     // toast 提示，自动隐藏
 * @method $.alert(text, title, callbackok);  // alert提示框
 * @method $.confirm(text, title, callbackOk, callbackCancel)  // confirm 提示框;
 * @method $.prompt(text, title, callbackOk, callbackCancel)   // prompt 提示框;
 *
 *
 * Native & H5 通信, 在原来基础上与业务逻辑解耦
 *
 * @mudule mutual                 // 全局对象, 与native通信所有方法挂载到此对象上
 * @method getJsontext(JSON)      // 所有callnative后的回调函数, @param {JSON}为回调返回值
 * @method getStatusRun           // get app login status
 * @method getToken               // 取得token
 * @method getAppVersion          // 取得app 版本
 * @method getPhoneDeviceId       // 取得设备号
 * @method getPhoneDeviceVersion  // 取得手机系统版本号
 * @method getUserInfo            // 取得用户信息
 * @method isOpenShareFont        // 开启app导航栏右侧菜单分享和字号
 * @method openLogin              // 打开app登录页
 * @method openRegister           // 打开app注册页
 * @method openSharePage(shareId) // 打开app分享页
 * @metiod openT0                 // 打开T+0
 * @method setTitles(title)       // 设置title
 * @method openURL(url)           // 打开一个网址
 * @method toBuyFund(fundcode)    // buy fund details
 *
 * @method LeadEvents             // 自定义事件，观察者模式; listen, once, remove, fire
*/

// 自定义事件，观察者模式
var LeadEvents = function() {
    var listen, log, obj, once, remove, trigger, _this;
    obj = {};
    _this = this;

    // 监听
    listen = function( key, eventfn ) {  
        var stack, _ref; 
        stack = ( _ref = obj[key] ) != null ? _ref : obj[ key ] = [];
        return stack.push( eventfn );
    };

    // 注册一次
    once = function( key, eventfn ) {
        remove( key );
        return listen( key, eventfn );
    };

    // 删除监听
    remove = function( key ) {
        var _ref;
        return ( _ref = obj[key] ) != null ? _ref.length = 0 : void 0;
    };

    // 触发
    fire = function() {
        var fn, stack, _i, _len, _ref, key;
        key = Array.prototype.shift.call( arguments );
        stack = ( _ref = obj[ key ] ) != null ? _ref : obj[ key ] = [];
        for ( _i = 0, _len = stack.length; _i < _len; _i++ ) {
            fn = stack[ _i ];
            if ( fn.apply( _this,  arguments ) === false) {
                return false;
            }
        }
    };
    
    // 暴漏接口
    return {
        listen: listen,
        once: once,
        remove: remove,
        fire : fire
    };
};




;$.smVersion = "0.6.2";
+function ($) {
    "use strict";

    window.pageInitTime = new Date().getTime(); 

    //全局配置
    var defaults = {
        autoInit: false, //自动初始化页面
        showPageLoadingIndicator: true, //push.js加载页面的时候显示一个加载提示
        router: false, //默认使用router
        swipePanel: "left", //滑动打开侧栏
        swipePanelOnlyClose: true  //只允许滑动关闭，不允许滑动打开侧栏
    };

    $.smConfig = $.extend(defaults, $.config);

}(Zepto);

// sui loading, toast, alert
+(function ($) {
    "use strict";
    ['width', 'height'].forEach(function (dimension) {
        var Dimension = dimension.replace(/./, function (m) {
            return m[0].toUpperCase();
        });
        $.fn['outer' + Dimension] = function (margin) {
            var elem = this;
            if (elem) {
                var size = elem[dimension]();
                var sides = {
                    'width': ['left', 'right'],
                    'height': ['top', 'bottom']
                };
                sides[dimension].forEach(function (side) {
                    if (margin) size += parseInt(elem.css('margin-' + side), 10);
                });
                return size;
            } else {
                return null;
            }
        };
    });

    //support
    $.support = (function () {
        var support = {
            touch: !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch)
        };
        return support;
    })();

    $.touchEvents = {
        start: $.support.touch ? 'touchstart' : 'mousedown',
        move: $.support.touch ? 'touchmove' : 'mousemove',
        end: $.support.touch ? 'touchend' : 'mouseup'
    };

    $.getTranslate = function (el, axis) {
        var matrix, curTransform, curStyle, transformMatrix;

        // automatic axis detection
        if (typeof axis === 'undefined') {
            axis = 'x';
        }

        curStyle = window.getComputedStyle(el, null);
        if (window.WebKitCSSMatrix) {
            // Some old versions of Webkit choke when 'none' is passed; pass
            // empty string instead in this case
            transformMatrix = new WebKitCSSMatrix(curStyle.webkitTransform === 'none' ? '' : curStyle.webkitTransform);
        }
        else {
            transformMatrix = curStyle.MozTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
            matrix = transformMatrix.toString().split(',');
        }

        if (axis === 'x') {
            //Latest Chrome and webkits Fix
            if (window.WebKitCSSMatrix)
                curTransform = transformMatrix.m41;
            //Crazy IE10 Matrix
            else if (matrix.length === 16)
                curTransform = parseFloat(matrix[12]);
            //Normal Browsers
            else
                curTransform = parseFloat(matrix[4]);
        }
        if (axis === 'y') {
            //Latest Chrome and webkits Fix
            if (window.WebKitCSSMatrix)
                curTransform = transformMatrix.m42;
            //Crazy IE10 Matrix
            else if (matrix.length === 16)
                curTransform = parseFloat(matrix[13]);
            //Normal Browsers
            else
                curTransform = parseFloat(matrix[5]);
        }

        return curTransform || 0;
    };

    /* jshint ignore:start */
    $.requestAnimationFrame = function (callback) {
        if (window.requestAnimationFrame) return window.requestAnimationFrame(callback);
        else if (window.webkitRequestAnimationFrame) return window.webkitRequestAnimationFrame(callback);
        else if (window.mozRequestAnimationFrame) return window.mozRequestAnimationFrame(callback);
        else {
            return window.setTimeout(callback, 1000 / 60);
        }
    };
    $.cancelAnimationFrame = function (id) {
        if (window.cancelAnimationFrame) return window.cancelAnimationFrame(id);
        else if (window.webkitCancelAnimationFrame) return window.webkitCancelAnimationFrame(id);
        else if (window.mozCancelAnimationFrame) return window.mozCancelAnimationFrame(id);
        else {
            return window.clearTimeout(id);
        }
    };
    /* jshint ignore:end */
    function __dealCssEvent(eventNameArr, callback) {
        var events = eventNameArr,
            i, dom = this;// jshint ignore:line

        function fireCallBack(e) {
            /*jshint validthis:true */
            if (e.target !== this) return;
            callback.call(this, e);
            for (i = 0; i < events.length; i++) {
                dom.off(events[i], fireCallBack);
            }
        }

        if (callback) {
            for (i = 0; i < events.length; i++) {
                dom.on(events[i], fireCallBack);
            }
        }
    }

    $.fn.animationEnd = function (callback) {
        __dealCssEvent.call(this, ['webkitAnimationEnd', 'animationend'], callback);
        return this;
    };
    $.fn.transitionEnd = function (callback) {
        __dealCssEvent.call(this, ['webkitTransitionEnd', 'transitionend'], callback);
        return this;
    };
    $.fn.transition = function (duration) {
        if (typeof duration !== 'string') {
            duration = duration + 'ms';
        }
        for (var i = 0; i < this.length; i++) {
            var elStyle = this[i].style;
            elStyle.webkitTransitionDuration = elStyle.MozTransitionDuration = elStyle.transitionDuration = duration;
        }
        return this;
    };

    $.fn.transform = function (transform) {
        for (var i = 0; i < this.length; i++) {
            var elStyle = this[i].style;
            elStyle.webkitTransform = elStyle.MozTransform = elStyle.transform = transform;
        }
        return this;
    };


    //重置zepto的show方法，防止有些人引用的版本中 show 方法操作 opacity 属性影响动画执行
    $.fn.show = function () {
        var elementDisplay = {};

        function defaultDisplay(nodeName) {
            var element, display;
            if (!elementDisplay[nodeName]) {
                element = document.createElement(nodeName);
                document.body.appendChild(element);
                display = getComputedStyle(element, '').getPropertyValue("display");
                element.parentNode.removeChild(element);
                display === "none" && (display = "block");
                elementDisplay[nodeName] = display;
            }
            return elementDisplay[nodeName];
        }

        return this.each(function () {
            this.style.display === "none" && (this.style.display = '');
            if (getComputedStyle(this, '').getPropertyValue("display") === "none");
            this.style.display = defaultDisplay(this.nodeName);
        });
    };
})(Zepto);


/*===========================
 Device/OS Detection
 ===========================*/
;(function ($) {
    "use strict";
    var device = {};
    var ua = navigator.userAgent;

    var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
    var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
    var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);

    device.ios = device.android = device.iphone = device.ipad = device.androidChrome = false;

    // Android
    if (android) {
        device.os = 'android';
        device.osVersion = android[2];
        device.android = true;
        device.androidChrome = ua.toLowerCase().indexOf('chrome') >= 0;
    }
    if (ipad || iphone || ipod) {
        device.os = 'ios';
        device.ios = true;
    }
    // iOS
    if (iphone && !ipod) {
        device.osVersion = iphone[2].replace(/_/g, '.');
        device.iphone = true;
    }
    if (ipad) {
        device.osVersion = ipad[2].replace(/_/g, '.');
        device.ipad = true;
    }
    if (ipod) {
        device.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
        device.iphone = true;
    }
    // iOS 8+ changed UA
    if (device.ios && device.osVersion && ua.indexOf('Version/') >= 0) {
        if (device.osVersion.split('.')[0] === '10') {
            device.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
        }
    }

    // Webview
    device.webView = (iphone || ipad || ipod) && ua.match(/.*AppleWebKit(?!.*Safari)/i);

    // Minimal UI
    if (device.os && device.os === 'ios') {
        var osVersionArr = device.osVersion.split('.');
        device.minimalUi = !device.webView &&
            (ipod || iphone) &&
            (osVersionArr[0] * 1 === 7 ? osVersionArr[1] * 1 >= 1 : osVersionArr[0] * 1 > 7) &&
            $('meta[name="viewport"]').length > 0 && $('meta[name="viewport"]').attr('content').indexOf('minimal-ui') >= 0;
    }

    // Check for status bar and fullscreen app mode
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    device.statusBar = false;
    if (device.webView && (windowWidth * windowHeight === screen.width * screen.height)) {
        device.statusBar = true;
    }
    else {
        device.statusBar = false;
    }

    // Classes
    var classNames = [];

    // Pixel Ratio
    device.pixelRatio = window.devicePixelRatio || 1;
    classNames.push('pixel-ratio-' + Math.floor(device.pixelRatio));
    if (device.pixelRatio >= 2) {
        classNames.push('retina');
    }

    // OS classes
    if (device.os) {
        classNames.push(device.os, device.os + '-' + device.osVersion.split('.')[0], device.os + '-' + device.osVersion.replace(/\./g, '-'));
        if (device.os === 'ios') {
            var major = parseInt(device.osVersion.split('.')[0], 10);
            for (var i = major - 1; i >= 6; i--) {
                classNames.push('ios-gt-' + i);
            }
        }

    }
    // Status bar classes
    if (device.statusBar) {
        classNames.push('with-statusbar-overlay');
    }
    else {
        $('html').removeClass('with-statusbar-overlay');
    }

    // Add html classes
    if (classNames.length > 0) $('html').addClass(classNames.join(' '));

    // keng..
    device.isWeixin = /MicroMessenger/i.test(ua);

    $.device = device;
})(Zepto);

;(function () {
    'use strict';

    /**
     * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
     *
     * @codingstandard ftlabs-jsv2
     * @copyright The Financial Times Limited [All Rights Reserved]
     * @license MIT License (see LICENSE.txt)
     */

    /*jslint browser:true, node:true, elision:true*/
    /*global Event, Node*/


    /**
     * Instantiate fast-clicking listeners on the specified layer.
     *
     * @constructor
     * @param {Element} layer The layer to listen on
     * @param {Object} [options={}] The options to override the defaults
     */
    function FastClick(layer, options) {
        var oldOnClick;

        options = options || {};

        /**
         * Whether a click is currently being tracked.
         *
         * @type boolean
         */
        this.trackingClick = false;


        /**
         * Timestamp for when click tracking started.
         *
         * @type number
         */
        this.trackingClickStart = 0;


        /**
         * The element being tracked for a click.
         *
         * @type EventTarget
         */
        this.targetElement = null;


        /**
         * X-coordinate of touch start event.
         *
         * @type number
         */
        this.touchStartX = 0;


        /**
         * Y-coordinate of touch start event.
         *
         * @type number
         */
        this.touchStartY = 0;


        /**
         * ID of the last touch, retrieved from Touch.identifier.
         *
         * @type number
         */
        this.lastTouchIdentifier = 0;


        /**
         * Touchmove boundary, beyond which a click will be cancelled.
         *
         * @type number
         */
        this.touchBoundary = options.touchBoundary || 10;


        /**
         * The FastClick layer.
         *
         * @type Element
         */
        this.layer = layer;

        /**
         * The minimum time between tap(touchstart and touchend) events
         *
         * @type number
         */
        this.tapDelay = options.tapDelay || 200;

        /**
         * The maximum time for a tap
         *
         * @type number
         */
        this.tapTimeout = options.tapTimeout || 700;

        if (FastClick.notNeeded(layer)) {
            return;
        }

        // Some old versions of Android don't have Function.prototype.bind
        function bind(method, context) {
            return function () {
                return method.apply(context, arguments);
            };
        }


        var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
        var context = this;
        for (var i = 0, l = methods.length; i < l; i++) {
            context[methods[i]] = bind(context[methods[i]], context);
        }

        // Set up event handlers as required
        if (deviceIsAndroid) {
            layer.addEventListener('mouseover', this.onMouse, true);
            layer.addEventListener('mousedown', this.onMouse, true);
            layer.addEventListener('mouseup', this.onMouse, true);
        }

        layer.addEventListener('click', this.onClick, true);
        layer.addEventListener('touchstart', this.onTouchStart, false);
        layer.addEventListener('touchmove', this.onTouchMove, false);
        layer.addEventListener('touchend', this.onTouchEnd, false);
        layer.addEventListener('touchcancel', this.onTouchCancel, false);

        // Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
        // which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
        // layer when they are cancelled.
        if (!Event.prototype.stopImmediatePropagation) {
            layer.removeEventListener = function (type, callback, capture) {
                var rmv = Node.prototype.removeEventListener;
                if (type === 'click') {
                    rmv.call(layer, type, callback.hijacked || callback, capture);
                } else {
                    rmv.call(layer, type, callback, capture);
                }
            };

            layer.addEventListener = function (type, callback, capture) {
                var adv = Node.prototype.addEventListener;
                if (type === 'click') {
                    adv.call(layer, type, callback.hijacked || (callback.hijacked = function (event) {
                            if (!event.propagationStopped) {
                                callback(event);
                            }
                        }), capture);
                } else {
                    adv.call(layer, type, callback, capture);
                }
            };
        }

        // If a handler is already declared in the element's onclick attribute, it will be fired before
        // FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
        // adding it as listener.
        if (typeof layer.onclick === 'function') {

            // Android browser on at least 3.2 requires a new reference to the function in layer.onclick
            // - the old one won't work if passed to addEventListener directly.
            oldOnClick = layer.onclick;
            layer.addEventListener('click', function (event) {
                oldOnClick(event);
            }, false);
            layer.onclick = null;
        }
    }

    /**
     * Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
     *
     * @type boolean
     */
    var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;

    /**
     * Android requires exceptions.
     *
     * @type boolean
     */
    var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;


    /**
     * iOS requires exceptions.
     *
     * @type boolean
     */
    var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;


    /**
     * iOS 4 requires an exception for select elements.
     *
     * @type boolean
     */
    var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


    /**
     * iOS 6.0-7.* requires the target element to be manually derived
     *
     * @type boolean
     */
    var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS [6-7]_\d/).test(navigator.userAgent);

    /**
     * BlackBerry requires exceptions.
     *
     * @type boolean
     */
    var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

    /**
     * 判断是否组合型label
     * @type {Boolean}
     */
    var isCompositeLabel = false;

    /**
     * Determine whether a given element requires a native click.
     *
     * @param {EventTarget|Element} target Target DOM element
     * @returns {boolean} Returns true if the element needs a native click
     */
    FastClick.prototype.needsClick = function (target) {

        // 修复bug: 如果父元素中有 label
        // 如果label上有needsclick这个类，则用原生的点击，否则，用模拟点击
        var parent = target;
        while (parent && (parent.tagName.toUpperCase() !== "BODY")) {
            if (parent.tagName.toUpperCase() === "LABEL") {
                isCompositeLabel = true;
                if ((/\bneedsclick\b/).test(parent.className)) return true;
            }
            parent = parent.parentNode;
        }

        switch (target.nodeName.toLowerCase()) {

            // Don't send a synthetic click to disabled inputs (issue #62)
            case 'button':
            case 'select':
            case 'textarea':
                if (target.disabled) {
                    return true;
                }

                break;
            case 'input':

                // File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
                if ((deviceIsIOS && target.type === 'file') || target.disabled) {
                    return true;
                }

                break;
            case 'label':
            case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
            case 'video':
                return true;
        }

        return (/\bneedsclick\b/).test(target.className);
    };


    /**
     * Determine whether a given element requires a call to focus to simulate click into element.
     *
     * @param {EventTarget|Element} target Target DOM element
     * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
     */
    FastClick.prototype.needsFocus = function (target) {
        switch (target.nodeName.toLowerCase()) {
            case 'textarea':
                return true;
            case 'select':
                return !deviceIsAndroid;
            case 'input':
                switch (target.type) {
                    case 'button':
                    case 'checkbox':
                    case 'file':
                    case 'image':
                    case 'radio':
                    case 'submit':
                        return false;
                }

                // No point in attempting to focus disabled inputs
                return !target.disabled && !target.readOnly;
            default:
                return (/\bneedsfocus\b/).test(target.className);
        }
    };


    /**
     * Send a click event to the specified element.
     *
     * @param {EventTarget|Element} targetElement
     * @param {Event} event
     */
    FastClick.prototype.sendClick = function (targetElement, event) {
        var clickEvent, touch;

        // On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
        if (document.activeElement && document.activeElement !== targetElement) {
            document.activeElement.blur();
        }

        touch = event.changedTouches[0];

        // Synthesise a click event, with an extra attribute so it can be tracked
        clickEvent = document.createEvent('MouseEvents');
        clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
        clickEvent.forwardedTouchEvent = true;
        targetElement.dispatchEvent(clickEvent);
    };

    FastClick.prototype.determineEventType = function (targetElement) {

        //Issue #159: Android Chrome Select Box does not open with a synthetic click event
        if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
            return 'mousedown';
        }

        return 'click';
    };


    /**
     * @param {EventTarget|Element} targetElement
     */
    FastClick.prototype.focus = function (targetElement) {
        var length;

        // Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
        var unsupportedType = ['date', 'time', 'month', 'number', 'email'];
        if (deviceIsIOS && targetElement.setSelectionRange && unsupportedType.indexOf(targetElement.type) === -1) {
            length = targetElement.value.length;
            targetElement.setSelectionRange(length, length);
        } else {
            targetElement.focus();
        }
    };


    /**
     * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
     *
     * @param {EventTarget|Element} targetElement
     */
    FastClick.prototype.updateScrollParent = function (targetElement) {
        var scrollParent, parentElement;

        scrollParent = targetElement.fastClickScrollParent;

        // Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
        // target element was moved to another parent.
        if (!scrollParent || !scrollParent.contains(targetElement)) {
            parentElement = targetElement;
            do {
                if (parentElement.scrollHeight > parentElement.offsetHeight) {
                    scrollParent = parentElement;
                    targetElement.fastClickScrollParent = parentElement;
                    break;
                }

                parentElement = parentElement.parentElement;
            } while (parentElement);
        }

        // Always update the scroll top tracker if possible.
        if (scrollParent) {
            scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
        }
    };


    /**
     * @param {EventTarget} targetElement
     * @returns {Element|EventTarget}
     */
    FastClick.prototype.getTargetElementFromEventTarget = function (eventTarget) {

        // On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
        if (eventTarget.nodeType === Node.TEXT_NODE) {
            return eventTarget.parentNode;
        }

        return eventTarget;
    };


    /**
     * On touch start, record the position and scroll offset.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onTouchStart = function (event) {
        var targetElement, touch, selection;

        // Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
        if (event.targetTouches.length > 1) {
            return true;
        }

        targetElement = this.getTargetElementFromEventTarget(event.target);
        touch = event.targetTouches[0];

        if (deviceIsIOS) {

            // Only trusted events will deselect text on iOS (issue #49)
            selection = window.getSelection();
            if (selection.rangeCount && !selection.isCollapsed) {
                return true;
            }

            if (!deviceIsIOS4) {

                // Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
                // when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
                // with the same identifier as the touch event that previously triggered the click that triggered the alert.
                // Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
                // immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
                // Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
                // which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
                // random integers, it's safe to to continue if the identifier is 0 here.
                if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
                    event.preventDefault();
                    return false;
                }

                this.lastTouchIdentifier = touch.identifier;

                // If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
                // 1) the user does a fling scroll on the scrollable layer
                // 2) the user stops the fling scroll with another tap
                // then the event.target of the last 'touchend' event will be the element that was under the user's finger
                // when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
                // is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
                this.updateScrollParent(targetElement);
            }
        }

        this.trackingClick = true;
        this.trackingClickStart = event.timeStamp;
        this.targetElement = targetElement;

        this.touchStartX = touch.pageX;
        this.touchStartY = touch.pageY;

        // Prevent phantom clicks on fast double-tap (issue #36)
        if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
            event.preventDefault();
        }

        return true;
    };


    /**
     * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.touchHasMoved = function (event) {
        var touch = event.changedTouches[0], boundary = this.touchBoundary;

        if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
            return true;
        }

        return false;
    };


    /**
     * Update the last position.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onTouchMove = function (event) {
        if (!this.trackingClick) {
            return true;
        }

        // If the touch has moved, cancel the click tracking
        if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
            this.trackingClick = false;
            this.targetElement = null;
        }

        return true;
    };


    /**
     * Attempt to find the labelled control for the given label element.
     *
     * @param {EventTarget|HTMLLabelElement} labelElement
     * @returns {Element|null}
     */
    FastClick.prototype.findControl = function (labelElement) {

        // Fast path for newer browsers supporting the HTML5 control attribute
        if (labelElement.control !== undefined) {
            return labelElement.control;
        }

        // All browsers under test that support touch events also support the HTML5 htmlFor attribute
        if (labelElement.htmlFor) {
            return document.getElementById(labelElement.htmlFor);
        }

        // If no for attribute exists, attempt to retrieve the first labellable descendant element
        // the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
        return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
    };


    /**
     * On touch end, determine whether to send a click event at once.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onTouchEnd = function (event) {
        var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

        if (!this.trackingClick) {
            return true;
        }

        // Prevent phantom clicks on fast double-tap (issue #36)
        if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
            this.cancelNextClick = true;
            return true;
        }

        if ((event.timeStamp - this.trackingClickStart) > this.tapTimeout) {
            return true;
        }
        //修复安卓微信下，input type="date" 的bug，经测试date,time,month已没问题
        var unsupportedType = ['date', 'time', 'month'];
        if (unsupportedType.indexOf(event.target.type) !== -1) {
            return false;
        }
        // Reset to prevent wrong click cancel on input (issue #156).
        this.cancelNextClick = false;

        this.lastClickTime = event.timeStamp;

        trackingClickStart = this.trackingClickStart;
        this.trackingClick = false;
        this.trackingClickStart = 0;

        // On some iOS devices, the targetElement supplied with the event is invalid if the layer
        // is performing a transition or scroll, and has to be re-detected manually. Note that
        // for this to function correctly, it must be called *after* the event target is checked!
        // See issue #57; also filed as rdar://13048589 .
        if (deviceIsIOSWithBadTarget) {
            touch = event.changedTouches[0];

            // In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
            targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
            targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
        }

        targetTagName = targetElement.tagName.toLowerCase();
        if (targetTagName === 'label') {
            forElement = this.findControl(targetElement);
            if (forElement) {
                this.focus(targetElement);
                if (deviceIsAndroid) {
                    return false;
                }

                targetElement = forElement;
            }
        } else if (this.needsFocus(targetElement)) {

            // Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
            // Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
            if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
                this.targetElement = null;
                return false;
            }

            this.focus(targetElement);
            this.sendClick(targetElement, event);

            // Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
            // Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
            if (!deviceIsIOS || targetTagName !== 'select') {
                this.targetElement = null;
                event.preventDefault();
            }

            return false;
        }

        if (deviceIsIOS && !deviceIsIOS4) {

            // Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
            // and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
            scrollParent = targetElement.fastClickScrollParent;
            if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
                return true;
            }
        }

        // Prevent the actual click from going though - unless the target node is marked as requiring
        // real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
        if (!this.needsClick(targetElement)) {
            event.preventDefault();
            this.sendClick(targetElement, event);
        }

        return false;
    };


    /**
     * On touch cancel, stop tracking the click.
     *
     * @returns {void}
     */
    FastClick.prototype.onTouchCancel = function () {
        this.trackingClick = false;
        this.targetElement = null;
    };


    /**
     * Determine mouse events which should be permitted.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onMouse = function (event) {

        // If a target element was never set (because a touch event was never fired) allow the event
        if (!this.targetElement) {
            return true;
        }

        if (event.forwardedTouchEvent) {
            return true;
        }

        // Programmatically generated events targeting a specific element should be permitted
        if (!event.cancelable) {
            return true;
        }

        // Derive and check the target element to see whether the mouse event needs to be permitted;
        // unless explicitly enabled, prevent non-touch click events from triggering actions,
        // to prevent ghost/doubleclicks.
        if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

            // Prevent any user-added listeners declared on FastClick element from being fired.
            if (event.stopImmediatePropagation) {
                event.stopImmediatePropagation();
            } else {

                // Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
                event.propagationStopped = true;
            }

            // Cancel the event
            event.stopPropagation();
            // 允许组合型label冒泡
            if (!isCompositeLabel) {
                event.preventDefault();
            }
            // 允许组合型label冒泡
            return false;
        }

        // If the mouse event is permitted, return true for the action to go through.
        return true;
    };


    /**
     * On actual clicks, determine whether this is a touch-generated click, a click action occurring
     * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
     * an actual click which should be permitted.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onClick = function (event) {
        var permitted;

        // It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
        if (this.trackingClick) {
            this.targetElement = null;
            this.trackingClick = false;
            return true;
        }

        // Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
        if (event.target.type === 'submit' && event.detail === 0) {
            return true;
        }

        permitted = this.onMouse(event);

        // Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
        if (!permitted) {
            this.targetElement = null;
        }

        // If clicks are permitted, return true for the action to go through.
        return permitted;
    };


    /**
     * Remove all FastClick's event listeners.
     *
     * @returns {void}
     */
    FastClick.prototype.destroy = function () {
        var layer = this.layer;

        if (deviceIsAndroid) {
            layer.removeEventListener('mouseover', this.onMouse, true);
            layer.removeEventListener('mousedown', this.onMouse, true);
            layer.removeEventListener('mouseup', this.onMouse, true);
        }

        layer.removeEventListener('click', this.onClick, true);
        layer.removeEventListener('touchstart', this.onTouchStart, false);
        layer.removeEventListener('touchmove', this.onTouchMove, false);
        layer.removeEventListener('touchend', this.onTouchEnd, false);
        layer.removeEventListener('touchcancel', this.onTouchCancel, false);
    };


    /**
     * Check whether FastClick is needed.
     *
     * @param {Element} layer The layer to listen on
     */
    FastClick.notNeeded = function (layer) {
        var metaViewport;
        var chromeVersion;
        var blackberryVersion;
        var firefoxVersion;

        // Devices that don't support touch don't need FastClick
        if (typeof window.ontouchstart === 'undefined') {
            return true;
        }

        // Chrome version - zero for other browsers
        chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1];

        if (chromeVersion) {

            if (deviceIsAndroid) {
                metaViewport = document.querySelector('meta[name=viewport]');

                if (metaViewport) {
                    // Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
                    if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
                        return true;
                    }
                    // Chrome 32 and above with width=device-width or less don't need FastClick
                    if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
                        return true;
                    }
                }

                // Chrome desktop doesn't need FastClick (issue #15)
            } else {
                return true;
            }
        }

        if (deviceIsBlackBerry10) {
            blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

            // BlackBerry 10.3+ does not require Fastclick library.
            // https://github.com/ftlabs/fastclick/issues/251
            if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
                metaViewport = document.querySelector('meta[name=viewport]');

                if (metaViewport) {
                    // user-scalable=no eliminates click delay.
                    if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
                        return true;
                    }
                    // width=device-width (or less than device-width) eliminates click delay.
                    if (document.documentElement.scrollWidth <= window.outerWidth) {
                        return true;
                    }
                }
            }
        }

        // IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
        if (layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation') {
            return true;
        }

        // Firefox version - zero for other browsers
        firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1];

        if (firefoxVersion >= 27) {
            // Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896

            metaViewport = document.querySelector('meta[name=viewport]');
            if (metaViewport && (metaViewport.content.indexOf('user-scalable=no') !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
                return true;
            }
        }

        // IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
        // http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
        if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
            return true;
        }

        return false;
    };


    /**
     * Factory method for creating a FastClick object
     *
     * @param {Element} layer The layer to listen on
     * @param {Object} [options={}] The options to override the defaults
     */
    FastClick.attach = function (layer, options) {
        return new FastClick(layer, options);
    };

    window.FastClick = FastClick;
}());
/*======================================================
 ************   Modals   ************
 ======================================================*/
/*jshint unused: false*/
+function ($) {
    "use strict";
    var _modalTemplateTempDiv = document.createElement('div');

    $.modalStack = [];

    $.modalStackClearQueue = function () {
        if ($.modalStack.length) {
            ($.modalStack.shift())();
        }
    };
    $.modal = function (params) {
        params = params || {};
        var modalHTML = '';
        var buttonsHTML = '';
        if (params.buttons && params.buttons.length > 0) {
            for (var i = 0; i < params.buttons.length; i++) {
                buttonsHTML += '<span class="modal-button' + (params.buttons[i].bold ? ' modal-button-bold' : '') + '">' + params.buttons[i].text + '</span>';
            }
        }
        var extraClass = params.extraClass || '';
        var titleHTML = params.title ? '<div class="modal-title">' + params.title + '</div>' : '';
        var textHTML = params.text ? '<div class="modal-text">' + params.text + '</div>' : '';
        var afterTextHTML = params.afterText ? params.afterText : '';
        var noButtons = !params.buttons || params.buttons.length === 0 ? 'modal-no-buttons' : '';
        var verticalButtons = params.verticalButtons ? 'modal-buttons-vertical' : '';
        modalHTML = '<div class="modal ' + extraClass + ' ' + noButtons + '"><div class="modal-inner">' + (titleHTML + textHTML + afterTextHTML) + '</div><div class="modal-buttons ' + verticalButtons + '">' + buttonsHTML + '</div></div>';

        _modalTemplateTempDiv.innerHTML = modalHTML;

        var modal = $(_modalTemplateTempDiv).children();

        $(defaults.modalContainer).append(modal[0]);

        // Add events on buttons
        modal.find('.modal-button').each(function (index, el) {
            $(el).on('click', function (e) {
                if (params.buttons[index].close !== false) $.closeModal(modal);
                if (params.buttons[index].onClick) params.buttons[index].onClick(modal, e);
                if (params.onClick) params.onClick(modal, index);
            });
        });
        $.openModal(modal);
        return modal[0];
    };
    $.alert = function (text, title, callbackOk) {
        if (typeof title === 'function') {
            callbackOk = arguments[1];
            title = undefined;
        }
        return $.modal({
            text: text || '',
            title: typeof title === 'undefined' ? defaults.modalTitle : title,
            buttons: [{text: defaults.modalButtonOk, bold: true, onClick: callbackOk}]
        });
    };
    $.confirm = function (text, title, callbackOk, callbackCancel) {
        if (typeof title === 'function') {
            callbackCancel = arguments[2];
            callbackOk = arguments[1];
            title = undefined;
        }
        return $.modal({
            text: text || '',
            title: typeof title === 'undefined' ? defaults.modalTitle : title,
            buttons: [
                {text: defaults.modalButtonCancel, onClick: callbackCancel},
                {text: defaults.modalButtonOk, bold: true, onClick: callbackOk}
            ]
        });
    };
    $.prompt = function (text, title, callbackOk, callbackCancel) {
        if (typeof title === 'function') {
            callbackCancel = arguments[2];
            callbackOk = arguments[1];
            title = undefined;
        }
        return $.modal({
            text: text || '',
            title: typeof title === 'undefined' ? defaults.modalTitle : title,
            afterText: '<input type="text" class="modal-text-input">',
            buttons: [
                {
                    text: defaults.modalButtonCancel
                },
                {
                    text: defaults.modalButtonOk,
                    bold: true
                }
            ],
            onClick: function (modal, index) {
                if (index === 0 && callbackCancel) callbackCancel($(modal).find('.modal-text-input').val());
                if (index === 1 && callbackOk) callbackOk($(modal).find('.modal-text-input').val());
            }
        });
    };
    $.modalLogin = function (text, title, callbackOk, callbackCancel) {
        if (typeof title === 'function') {
            callbackCancel = arguments[2];
            callbackOk = arguments[1];
            title = undefined;
        }
        return $.modal({
            text: text || '',
            title: typeof title === 'undefined' ? defaults.modalTitle : title,
            afterText: '<input type="text" name="modal-username" placeholder="' + defaults.modalUsernamePlaceholder + '" class="modal-text-input modal-text-input-double"><input type="password" name="modal-password" placeholder="' + defaults.modalPasswordPlaceholder + '" class="modal-text-input modal-text-input-double">',
            buttons: [
                {
                    text: defaults.modalButtonCancel
                },
                {
                    text: defaults.modalButtonOk,
                    bold: true
                }
            ],
            onClick: function (modal, index) {
                var username = $(modal).find('.modal-text-input[name="modal-username"]').val();
                var password = $(modal).find('.modal-text-input[name="modal-password"]').val();
                if (index === 0 && callbackCancel) callbackCancel(username, password);
                if (index === 1 && callbackOk) callbackOk(username, password);
            }
        });
    };
    $.modalPassword = function (text, title, callbackOk, callbackCancel) {
        if (typeof title === 'function') {
            callbackCancel = arguments[2];
            callbackOk = arguments[1];
            title = undefined;
        }
        return $.modal({
            text: text || '',
            title: typeof title === 'undefined' ? defaults.modalTitle : title,
            afterText: '<input type="password" name="modal-password" placeholder="' + defaults.modalPasswordPlaceholder + '" class="modal-text-input">',
            buttons: [
                {
                    text: defaults.modalButtonCancel
                },
                {
                    text: defaults.modalButtonOk,
                    bold: true
                }
            ],
            onClick: function (modal, index) {
                var password = $(modal).find('.modal-text-input[name="modal-password"]').val();
                if (index === 0 && callbackCancel) callbackCancel(password);
                if (index === 1 && callbackOk) callbackOk(password);
            }
        });
    };
    $.showPreloader = function (title) {
        $.hidePreloader();
        $.showPreloader.preloaderModal = $.modal({
            title: title || defaults.modalPreloaderTitle,
            text: '<div class="preloader"></div>'
        });

        return $.showPreloader.preloaderModal;
    };
    $.hidePreloader = function () {
        $.showPreloader.preloaderModal && $.closeModal($.showPreloader.preloaderModal);
    };
    $.showIndicator = function () {
        if ($('.preloader-indicator-modal')[0]) return;
        $(defaults.modalContainer).append('<div class="preloader-indicator-overlay"></div><div class="preloader-indicator-modal"><span class="preloader preloader-white"></span></div>');
    };
    $.hideIndicator = function () {
        $('.preloader-indicator-overlay, .preloader-indicator-modal').remove();
    };
    // Action Sheet
    $.actions = function (params) {
        var modal, groupSelector, buttonSelector;
        params = params || [];

        if (params.length > 0 && !$.isArray(params[0])) {
            params = [params];
        }
        var modalHTML;
        var buttonsHTML = '';
        for (var i = 0; i < params.length; i++) {
            for (var j = 0; j < params[i].length; j++) {
                if (j === 0) buttonsHTML += '<div class="actions-modal-group">';
                var button = params[i][j];
                var buttonClass = button.label ? 'actions-modal-label' : 'actions-modal-button';
                if (button.bold) buttonClass += ' actions-modal-button-bold';
                if (button.color) buttonClass += ' color-' + button.color;
                if (button.bg) buttonClass += ' bg-' + button.bg;
                if (button.disabled) buttonClass += ' disabled';
                buttonsHTML += '<span class="' + buttonClass + '">' + button.text + '</span>';
                if (j === params[i].length - 1) buttonsHTML += '</div>';
            }
        }
        modalHTML = '<div class="actions-modal">' + buttonsHTML + '</div>';
        _modalTemplateTempDiv.innerHTML = modalHTML;
        modal = $(_modalTemplateTempDiv).children();
        $(defaults.modalContainer).append(modal[0]);
        groupSelector = '.actions-modal-group';
        buttonSelector = '.actions-modal-button';

        var groups = modal.find(groupSelector);
        groups.each(function (index, el) {
            var groupIndex = index;
            $(el).children().each(function (index, el) {
                var buttonIndex = index;
                var buttonParams = params[groupIndex][buttonIndex];
                var clickTarget;
                if ($(el).is(buttonSelector)) clickTarget = $(el);
                // if (toPopover && $(el).find(buttonSelector).length > 0) clickTarget = $(el).find(buttonSelector);

                if (clickTarget) {
                    clickTarget.on('click', function (e) {
                        if (buttonParams.close !== false) $.closeModal(modal);
                        if (buttonParams.onClick) buttonParams.onClick(modal, e);
                    });
                }
            });
        });
        $.openModal(modal);
        return modal[0];
    };
    $.popup = function (modal, removeOnClose) {
        if (typeof removeOnClose === 'undefined') removeOnClose = true;
        if (typeof modal === 'string' && modal.indexOf('<') >= 0) {
            var _modal = document.createElement('div');
            _modal.innerHTML = modal.trim();
            if (_modal.childNodes.length > 0) {
                modal = _modal.childNodes[0];
                if (removeOnClose) modal.classList.add('remove-on-close');
                $(defaults.modalContainer).append(modal);
            }
            else return false; //nothing found
        }
        modal = $(modal);
        if (modal.length === 0) return false;
        modal.show();
        modal.find(".content").scroller("refresh");
        if (modal.find('.' + defaults.viewClass).length > 0) {
            $.sizeNavbars(modal.find('.' + defaults.viewClass)[0]);
        }
        $.openModal(modal);

        return modal[0];
    };
    $.pickerModal = function (pickerModal, removeOnClose) {
        if (typeof removeOnClose === 'undefined') removeOnClose = true;
        if (typeof pickerModal === 'string' && pickerModal.indexOf('<') >= 0) {
            pickerModal = $(pickerModal);
            if (pickerModal.length > 0) {
                if (removeOnClose) pickerModal.addClass('remove-on-close');
                $(defaults.modalContainer).append(pickerModal[0]);
            }
            else return false; //nothing found
        }
        pickerModal = $(pickerModal);
        if (pickerModal.length === 0) return false;
        pickerModal.show();
        $.openModal(pickerModal);
        return pickerModal[0];
    };
    $.loginScreen = function (modal) {
        if (!modal) modal = '.login-screen';
        modal = $(modal);
        if (modal.length === 0) return false;
        modal.show();
        if (modal.find('.' + defaults.viewClass).length > 0) {
            $.sizeNavbars(modal.find('.' + defaults.viewClass)[0]);
        }
        $.openModal(modal);
        return modal[0];
    };
    //显示一个消息，会在2秒钟后自动消失
    $.toast = function (msg, duration, extraclass) {
        var $toast = $('<div class="modal toast ' + (extraclass || '') + '">' + msg + '</div><div class="preloader-indicator-overlay"></div>').appendTo(document.body);
        $.openModal($toast, function () {
            setTimeout(function () {
                $.closeModal($toast);
            }, duration || 2000);
        });
    };
    $.openModal = function (modal, cb) {
        modal = $(modal);
        var isModal = modal.hasClass('modal'),
            isNotToast = !modal.hasClass('toast');
        if ($('.modal.modal-in:not(.modal-out)').length && defaults.modalStack && isModal && isNotToast) {
            $.modalStack.push(function () {
                $.openModal(modal, cb);
            });
            return;
        }
        var isPopup = modal.hasClass('popup');
        var isLoginScreen = modal.hasClass('login-screen');
        var isPickerModal = modal.hasClass('picker-modal');
        var isToast = modal.hasClass('toast');
        if (isModal) {
            modal.show();
            modal.css({
                marginTop: -Math.round(modal.outerHeight() / 2) + 'px'
            });
        }

        if (isToast) {
            if($(window).width() <= modal.outerWidth()) {
                modal.css({
                    width: Math.round($(window).width()/ 1.185) + 'px',
                    marginLeft: -Math.round($(window).width() / 2 / 1.185) + 'px' //1.185 是初始化时候的放大效果
                });
            } else {
                modal.css({
                    marginLeft: -Math.round(modal.outerWidth() / 2 / 1.185) + 'px' //1.185 是初始化时候的放大效果
                });
            }
        }

        var overlay;
        if (!isLoginScreen && !isPickerModal && !isToast) {
            if ($('.modal-overlay').length === 0 && !isPopup) {
                $(defaults.modalContainer).append('<div class="modal-overlay"></div>');
            }
            if ($('.popup-overlay').length === 0 && isPopup) {
                $(defaults.modalContainer).append('<div class="popup-overlay"></div>');
            }
            overlay = isPopup ? $('.popup-overlay') : $('.modal-overlay');
        }

        //Make sure that styles are applied, trigger relayout;
        var clientLeft = modal[0].clientLeft;

        // Trugger open event
        modal.trigger('open');

        // Picker modal body class
        if (isPickerModal) {
            $(defaults.modalContainer).addClass('with-picker-modal');
        }

        // Classes for transition in
        if (!isLoginScreen && !isPickerModal && !isToast) overlay.addClass('modal-overlay-visible');
        modal.removeClass('modal-out').addClass('modal-in').transitionEnd(function (e) {
            if (modal.hasClass('modal-out')) modal.trigger('closed');
            else modal.trigger('opened');
        });
        // excute callback
        if (typeof cb === 'function') {
            cb.call(this);
        }
        return true;
    };
    $.closeModal = function (modal) {
        modal = $(modal || '.modal-in');
        if (typeof modal !== 'undefined' && modal.length === 0) {
            return;
        }
        var isModal = modal.hasClass('modal'),
            isPopup = modal.hasClass('popup'),
            isToast = modal.hasClass('toast'),
            isLoginScreen = modal.hasClass('login-screen'),
            isPickerModal = modal.hasClass('picker-modal'),
            removeOnClose = modal.hasClass('remove-on-close'),
            overlay = isPopup ? $('.popup-overlay') : $('.modal-overlay');
        if (isPopup) {
            if (modal.length === $('.popup.modal-in').length) {
                overlay.removeClass('modal-overlay-visible');
            }
        }
        else if (!(isPickerModal || isToast)) {
            overlay.removeClass('modal-overlay-visible');
        }

        modal.trigger('close');

        // Picker modal body class
        if (isPickerModal) {
            $(defaults.modalContainer).removeClass('with-picker-modal');
            $(defaults.modalContainer).addClass('picker-modal-closing');
        }

        modal.removeClass('modal-in').addClass('modal-out').transitionEnd(function (e) {
            if (modal.hasClass('modal-out')) modal.trigger('closed');
            else modal.trigger('opened');

            if (isPickerModal) {
                $(defaults.modalContainer).removeClass('picker-modal-closing');
            }
            if (isPopup || isLoginScreen || isPickerModal) {
                modal.removeClass('modal-out').hide();
                if (removeOnClose && modal.length > 0) {
                    modal.remove();
                }
            }
            else {
                modal.remove();
            }
        });
        if (isModal && defaults.modalStack) {
            $.modalStackClearQueue();
        }

        return true;
    };
    function handleClicks(e) {
        /*jshint validthis:true */
        var clicked = $(this);
        var url = clicked.attr('href');


        //Collect Clicked data- attributes
        var clickedData = clicked.dataset();

        // Popup
        var popup;
        if (clicked.hasClass('open-popup')) {
            if (clickedData.popup) {
                popup = clickedData.popup;
            }
            else popup = '.popup';
            $.popup(popup);
        }
        if (clicked.hasClass('close-popup')) {
            if (clickedData.popup) {
                popup = clickedData.popup;
            }
            else popup = '.popup.modal-in';
            $.closeModal(popup);
        }

        // Close Modal
        if (clicked.hasClass('modal-overlay')) {
            if ($('.modal.modal-in').length > 0 && defaults.modalCloseByOutside)
                $.closeModal('.modal.modal-in');
            if ($('.actions-modal.modal-in').length > 0 && defaults.actionsCloseByOutside)
                $.closeModal('.actions-modal.modal-in');

        }
        if (clicked.hasClass('popup-overlay')) {
            if ($('.popup.modal-in').length > 0 && defaults.popupCloseByOutside)
                $.closeModal('.popup.modal-in');
        }
    }

    $(document).on('click', ' .modal-overlay, .popup-overlay, .close-popup, .open-popup, .close-picker', handleClicks);
    var defaults = $.modal.prototype.defaults = {
        modalStack: true,
        modalButtonOk: '确定',
        modalButtonCancel: '取消',
        modalPreloaderTitle: '加载中',
        modalContainer: document.body ? document.body : 'body'
    };
}(Zepto);


/*jshint unused: false*/
+function ($) {
    'use strict';

    var getPage = function () {
        var $page = $(".page-current");
        if (!$page[0]) $page = $(".page").addClass('page-current');
        return $page;
    };

    //初始化页面中的JS组件
    $.initPage = function (page) {
        var $page = getPage();
        if (!$page[0]) $page = $(document.body);
        var $content = $page.hasClass('content') ?
            $page :
            $page.find('.content');
        //$content.scroller();  //注意滚动条一定要最先初始化

        $.initPullToRefresh($content);
        //$.initInfiniteScroll($content);
        //$.initCalendar($content);

        //extend
        if ($.initSwiper) $.initSwiper($content);
    };

    if ($.smConfig.showPageLoadingIndicator) {
        //这里的 以 push 开头的是私有事件，不要用
        $(window).on('pageLoadStart', function () {
            $.showIndicator();

        });
        $(window).on('pageAnimationStart', function () {
            $.hideIndicator();
        });
        $(window).on('pageLoadCancel', function () {
            $.hideIndicator();
        });
        $(window).on('pageLoadComplete', function () {
            $.hideIndicator();
        });
        $(window).on('pageLoadError', function () {
            $.hideIndicator();
            //$.toast('加载失败');
        });
    }

    $(window).on('pageAnimationStart', function (event, id, page) {
        // 在路由切换页面动画开始前,为了把位于 .page 之外的 popup 等隐藏,此处做些处理
        $.closeModal();
        $.closePanel();
        // 如果 panel 的 effect 是 reveal 时,似乎是 page 的动画或别的样式原因导致了 transitionEnd 时间不会触发
        // 这里暂且处理一下
        $('body').removeClass('panel-closing');
        $.allowPanelOpen = true;
    });

    // $(window).on('pageInit', function() {
    //     $.hideIndicator();
    //     $.lastPosition({
    //         needMemoryClass: [
    //             '.content'
    //         ]
    //     });
    // });
    // safari 在后退的时候会使用缓存技术，但实现上似乎存在些问题，
    // 导致路由中绑定的点击事件不会正常如期的运行（log 和 debugger 都没法调试），
    // 从而后续的跳转等完全乱了套。
    // 所以，这里检测到是 safari 的 cache 的情况下，做一次 reload
    // 测试路径(后缀 D 表示是 document，E 表示 external，不使用路由跳转）：
    // 1. aD -> bDE
    // 2. back
    // 3. aD -> bD
    window.addEventListener('pageshow', function (event) {
        if (event.persisted) {
            location.reload();
        }
    });

    $.init = function () {
        var $page = getPage();
        var id = $page[0].id;
        $.initPage();
        $page.trigger('pageInit', [id, $page]);
    };

    //DOM READY
    $(function () {
        //直接绑定
        FastClick.attach(document.body);

        if ($.smConfig.autoInit) {
            $.init();
        }

        $(document).on('pageInitInternal', function (e, id, page) {
            $.init();
        });
    });

}(Zepto);


// +function ($) {
//     'use strict';
//     $.initPullToRefresh = function (pageContainer) {
//         var eventsTarget = $(pageContainer);
//         if (!eventsTarget.hasClass('pull-to-refresh-content')) {
//             eventsTarget = eventsTarget.find('.pull-to-refresh-content');
//         }
//         if (!eventsTarget || eventsTarget.length === 0) return;

//         var isTouched, isMoved, touchesStart = {},
//             isScrolling, touchesDiff, touchStartTime, container, refresh = false,
//             useTranslate = false,
//             startTranslate = 0,
//             translate, scrollTop, wasScrolled, triggerDistance, dynamicTriggerDistance;

//         container = eventsTarget;

//         // Define trigger distance
//         if (container.attr('data-ptr-distance')) {
//             dynamicTriggerDistance = true;
//         } else {
//             triggerDistance = 44;
//         }

//         function handleTouchStart(e) {
//             if (isTouched) {
//                 if ($.device.android) {
//                     if ('targetTouches' in e && e.targetTouches.length > 1) return;
//                 } else return;
//             }
//             isMoved = false;
//             isTouched = true;
//             isScrolling = undefined;
//             wasScrolled = undefined;
//             touchesStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
//             touchesStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
//             touchStartTime = (new Date()).getTime();
//             /*jshint validthis:true */
//             container = $(this);
//         }

//         function handleTouchMove(e) {
//             if (!isTouched) return;
//             var pageX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
//             var pageY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
//             if (typeof isScrolling === 'undefined') {
//                 isScrolling = !!(isScrolling || Math.abs(pageY - touchesStart.y) > Math.abs(pageX - touchesStart.x));
//             }
//             if (!isScrolling) {
//                 isTouched = false;
//                 return;
//             }

//             scrollTop = container[0].scrollTop;
//             if (typeof wasScrolled === 'undefined' && scrollTop !== 0) wasScrolled = true;

//             if (!isMoved) {
//                 /*jshint validthis:true */
//                 container.removeClass('transitioning');
//                 if (scrollTop > container[0].offsetHeight) {
//                     isTouched = false;
//                     return;
//                 }
//                 if (dynamicTriggerDistance) {
//                     triggerDistance = container.attr('data-ptr-distance');
//                     if (triggerDistance.indexOf('%') >= 0) triggerDistance = container[0].offsetHeight * parseInt(triggerDistance, 10) / 100;
//                 }
//                 startTranslate = container.hasClass('refreshing') ? triggerDistance : 0;
//                 if (container[0].scrollHeight === container[0].offsetHeight || !$.device.ios) {
//                     useTranslate = true;
//                 } else {
//                     useTranslate = false;
//                 }
//                 useTranslate = true;
//             }
//             isMoved = true;
//             touchesDiff = pageY - touchesStart.y;

//             if (touchesDiff > 0 && scrollTop <= 0 || scrollTop < 0) {
//                 // iOS 8 fix
//                 if ($.device.ios && parseInt($.device.osVersion.split('.')[0], 10) > 7 && scrollTop === 0 && !wasScrolled) useTranslate = true;

//                 if (useTranslate) {
//                     e.preventDefault();
//                     translate = (Math.pow(touchesDiff, 0.85) + startTranslate);
//                     container.transform('translate3d(0,' + translate + 'px,0)');
//                 } else {
//                 }
//                 if ((useTranslate && Math.pow(touchesDiff, 0.85) > triggerDistance) || (!useTranslate && touchesDiff >= triggerDistance * 2)) {
//                     refresh = true;
//                     container.addClass('pull-up').removeClass('pull-down');
//                 } else {
//                     refresh = false;
//                     container.removeClass('pull-up').addClass('pull-down');
//                 }
//             } else {

//                 container.removeClass('pull-up pull-down');
//                 refresh = false;
//                 return;
//             }
//         }

//         function handleTouchEnd() {
//             if (!isTouched || !isMoved) {
//                 isTouched = false;
//                 isMoved = false;
//                 return;
//             }
//             if (translate) {
//                 container.addClass('transitioning');
//                 translate = 0;
//             }
//             container.transform('');
//             if (refresh) {
//                 //防止二次触发
//                 if (container.hasClass('refreshing')) return;
//                 container.addClass('refreshing');
//                 container.trigger('refresh');
//             } else {
//                 container.removeClass('pull-down');
//             }
//             isTouched = false;
//             isMoved = false;
//         }

//         // Attach Events
//         eventsTarget.on($.touchEvents.start, handleTouchStart);
//         eventsTarget.on($.touchEvents.move, handleTouchMove);
//         eventsTarget.on($.touchEvents.end, handleTouchEnd);


//         function destroyPullToRefresh() {
//             eventsTarget.off($.touchEvents.start, handleTouchStart);
//             eventsTarget.off($.touchEvents.move, handleTouchMove);
//             eventsTarget.off($.touchEvents.end, handleTouchEnd);
//         }

//         eventsTarget[0].destroyPullToRefresh = destroyPullToRefresh;

//     };
//     $.pullToRefreshDone = function (container) {
//         $(window).scrollTop(0);//解决微信下拉刷新顶部消失的问题
//         container = $(container);
//         if (container.length === 0) container = $('.pull-to-refresh-content.refreshing');
//         container.removeClass('refreshing').addClass('transitioning');
//         container.transitionEnd(function () {
//             container.removeClass('transitioning pull-up pull-down');
//         });
//     };
//     $.pullToRefreshTrigger = function (container) {
//         container = $(container);
//         if (container.length === 0) container = $('.pull-to-refresh-content');
//         if (container.hasClass('refreshing')) return;
//         container.addClass('transitioning refreshing');
//         container.trigger('refresh');
//     };

//     $.destroyPullToRefresh = function (pageContainer) {
//         pageContainer = $(pageContainer);
//         var pullToRefreshContent = pageContainer.hasClass('pull-to-refresh-content') ? pageContainer : pageContainer.find('.pull-to-refresh-content');
//         if (pullToRefreshContent.length === 0) return;
//         if (pullToRefreshContent[0].destroyPullToRefresh) pullToRefreshContent[0].destroyPullToRefresh();
//     };

// }(Zepto); //jshint ignore:line


//     Zepto.js
//     @method Deferred
;(function ($) {
    var slice = Array.prototype.slice

    function Deferred(func) {
        var tuples = [
                // action, add listener, listener list, final state
                ["resolve", "done", $.Callbacks({once: 1, memory: 1}), "resolved"],
                ["reject", "fail", $.Callbacks({once: 1, memory: 1}), "rejected"],
                ["notify", "progress", $.Callbacks({memory: 1})]
            ],
            state = "pending",
            promise = {
                state: function () {
                    return state
                },
                always: function () {
                    deferred.done(arguments).fail(arguments)
                    return this
                },
                then: function (/* fnDone [, fnFailed [, fnProgress]] */) {
                    var fns = arguments
                    return Deferred(function (defer) {
                        $.each(tuples, function (i, tuple) {
                            var fn = $.isFunction(fns[i]) && fns[i]
                            deferred[tuple[1]](function () {
                                var returned = fn && fn.apply(this, arguments)
                                if (returned && $.isFunction(returned.promise)) {
                                    returned.promise()
                                        .done(defer.resolve)
                                        .fail(defer.reject)
                                        .progress(defer.notify)
                                } else {
                                    var context = this === promise ? defer.promise() : this,
                                        values = fn ? [returned] : arguments
                                    defer[tuple[0] + "With"](context, values)
                                }
                            })
                        })
                        fns = null
                    }).promise()
                },

                promise: function (obj) {
                    return obj != null ? $.extend(obj, promise) : promise
                }
            },
            deferred = {}

        $.each(tuples, function (i, tuple) {
            var list = tuple[2],
                stateString = tuple[3]

            promise[tuple[1]] = list.add

            if (stateString) {
                list.add(function () {
                    state = stateString
                }, tuples[i ^ 1][2].disable, tuples[2][2].lock)
            }

            deferred[tuple[0]] = function () {
                deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments)
                return this
            }
            deferred[tuple[0] + "With"] = list.fireWith
        })

        promise.promise(deferred)
        if (func) func.call(deferred, deferred)
        return deferred
    }

    $.when = function (sub) {
        var resolveValues = slice.call(arguments),
            len = resolveValues.length,
            i = 0,
            remain = len !== 1 || (sub && $.isFunction(sub.promise)) ? len : 0,
            deferred = remain === 1 ? sub : Deferred(),
            progressValues, progressContexts, resolveContexts,
            updateFn = function (i, ctx, val) {
                return function (value) {
                    ctx[i] = this
                    val[i] = arguments.length > 1 ? slice.call(arguments) : value
                    if (val === progressValues) {
                        deferred.notifyWith(ctx, val)
                    } else if (!(--remain)) {
                        deferred.resolveWith(ctx, val)
                    }
                }
            }

        if (len > 1) {
            progressValues = new Array(len)
            progressContexts = new Array(len)
            resolveContexts = new Array(len)
            for (; i < len; ++i) {
                if (resolveValues[i] && $.isFunction(resolveValues[i].promise)) {
                    resolveValues[i].promise()
                        .done(updateFn(i, resolveContexts, resolveValues))
                        .fail(deferred.reject)
                        .progress(updateFn(i, progressContexts, progressValues))
                } else {
                    --remain
                }
            }
        }
        if (!remain) deferred.resolveWith(resolveContexts, resolveValues)
        return deferred.promise()
    }

    $.Deferred = Deferred
})(Zepto)


//     Zepto.js
//     @method Callbacks
;(function ($) {
    // Create a collection of callbacks to be fired in a sequence, with configurable behaviour
    // Option flags:
    //   - once: Callbacks fired at most one time.
    //   - memory: Remember the most recent context and arguments
    //   - stopOnFalse: Cease iterating over callback list
    //   - unique: Permit adding at most one instance of the same callback
    $.Callbacks = function (options) {
        options = $.extend({}, options)

        var memory, // Last fire value (for non-forgettable lists)
            fired,  // Flag to know if list was already fired
            firing, // Flag to know if list is currently firing
            firingStart, // First callback to fire (used internally by add and fireWith)
            firingLength, // End of the loop when firing
            firingIndex, // Index of currently firing callback (modified by remove if needed)
            list = [], // Actual callback list
            stack = !options.once && [], // Stack of fire calls for repeatable lists
            fire = function (data) {
                memory = options.memory && data
                fired = true
                firingIndex = firingStart || 0
                firingStart = 0
                firingLength = list.length
                firing = true
                for (; list && firingIndex < firingLength; ++firingIndex) {
                    if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
                        memory = false
                        break
                    }
                }
                firing = false
                if (list) {
                    if (stack) stack.length && fire(stack.shift())
                    else if (memory) list.length = 0
                    else Callbacks.disable()
                }
            },

            Callbacks = {
                add: function () {
                    if (list) {
                        var start = list.length,
                            add = function (args) {
                                $.each(args, function (_, arg) {
                                    if (typeof arg === "function") {
                                        if (!options.unique || !Callbacks.has(arg)) list.push(arg)
                                    }
                                    else if (arg && arg.length && typeof arg !== 'string') add(arg)
                                })
                            }
                        add(arguments)
                        if (firing) firingLength = list.length
                        else if (memory) {
                            firingStart = start
                            fire(memory)
                        }
                    }
                    return this
                },
                remove: function () {
                    if (list) {
                        $.each(arguments, function (_, arg) {
                            var index
                            while ((index = $.inArray(arg, list, index)) > -1) {
                                list.splice(index, 1)
                                // Handle firing indexes
                                if (firing) {
                                    if (index <= firingLength) --firingLength
                                    if (index <= firingIndex) --firingIndex
                                }
                            }
                        })
                    }
                    return this
                },
                has: function (fn) {
                    return !!(list && (fn ? $.inArray(fn, list) > -1 : list.length))
                },
                empty: function () {
                    firingLength = list.length = 0
                    return this
                },
                disable: function () {
                    list = stack = memory = undefined
                    return this
                },
                disabled: function () {
                    return !list
                },
                lock: function () {
                    stack = undefined
                    if (!memory) Callbacks.disable()
                    return this
                },
                locked: function () {
                    return !stack
                },
                fireWith: function (context, args) {
                    if (list && (!fired || stack)) {
                        args = args || []
                        args = [context, args.slice ? args.slice() : args]
                        if (firing) stack.push(args)
                        else fire(args)
                    }
                    return this
                },
                fire: function () {
                    return Callbacks.fireWith(this, arguments)
                },
                fired: function () {
                    return !!fired
                }
            }

        return Callbacks
    }
})(Zepto)



/**
 * 上拉、下拉
 * 基于iscroll v4.2.5；抽出核心功能，简化使用方式
 */
;(function(window, doc){
var m = Math,
    dummyStyle = doc.createElement('div').style,
    vendor = (function () {
        var vendors = 't,webkitT,MozT,msT,OT'.split(','),
            t,
            i = 0,
            l = vendors.length;

        for ( ; i < l; i++ ) {
            t = vendors[i] + 'ransform';
            if ( t in dummyStyle ) {
                return vendors[i].substr(0, vendors[i].length - 1);
            }
        }

        return false;
    })(),
    cssVendor = vendor ? '-' + vendor.toLowerCase() + '-' : '',

    // Style properties
    transform = prefixStyle('transform'),
    transitionProperty = prefixStyle('transitionProperty'),
    transitionDuration = prefixStyle('transitionDuration'),
    transformOrigin = prefixStyle('transformOrigin'),
    transitionTimingFunction = prefixStyle('transitionTimingFunction'),
    transitionDelay = prefixStyle('transitionDelay'),

    // Browser capabilities
    isAndroid = (/android/gi).test(navigator.appVersion),
    isIDevice = (/iphone|ipad/gi).test(navigator.appVersion),
    isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),

    has3d = prefixStyle('perspective') in dummyStyle,
    hasTouch = 'ontouchstart' in window && !isTouchPad,
    hasTransform = vendor !== false,
    hasTransitionEnd = prefixStyle('transition') in dummyStyle,

    RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
    START_EV = hasTouch ? 'touchstart' : 'mousedown',
    MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
    END_EV = hasTouch ? 'touchend' : 'mouseup',
    CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup',
    TRNEND_EV = (function () {
        if ( vendor === false ) return false;

        var transitionEnd = {
                ''          : 'transitionend',
                'webkit'    : 'webkitTransitionEnd',
                'Moz'       : 'transitionend',
                'O'         : 'otransitionend',
                'ms'        : 'MSTransitionEnd'
            };

        return transitionEnd[vendor];
    })(),

    nextFrame = (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) { return setTimeout(callback, 1); };
    })(),
    cancelFrame = (function () {
        return window.cancelRequestAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.webkitCancelRequestAnimationFrame ||
            window.mozCancelRequestAnimationFrame ||
            window.oCancelRequestAnimationFrame ||
            window.msCancelRequestAnimationFrame ||
            clearTimeout;
    })(),

    // Helpers
    translateZ = has3d ? ' translateZ(0)' : '',

    // Constructor
    iScroll = function (el, options) {
        var that = this,
            i;

        that.wrapper = typeof el == 'object' ? el : doc.getElementById(el);
        that.wrapper.style.overflow = 'hidden';
        that.scroller = that.wrapper.children[0];

        // Default options
        that.options = {
            hScroll: true,
            vScroll: true,
            x: 0,
            y: 0,
            bounce: true,
            bounceLock: false,
            momentum: true,
            lockDirection: true,
            useTransform: true,
            useTransition: false,
            topOffset: 0,
            checkDOMChanges: false,     // Experimental
            handleClick: true,

            // Scrollbar
            hScrollbar: true,
            vScrollbar: true,
            fixedScrollbar: isAndroid,
            hideScrollbar: isIDevice,
            fadeScrollbar: isIDevice && has3d,
            scrollbarClass: '',

            // Zoom
            zoom: false,
            zoomMin: 1,
            zoomMax: 4,
            doubleTapZoom: 2,
            wheelAction: 'scroll',

            // Snap
            snap: false,
            snapThreshold: 1,

            // Events
            onRefresh: null,
            onBeforeScrollStart: function (e) { e.preventDefault(); },
            onScrollStart: null,
            onBeforeScrollMove: null,
            onScrollMove: null,
            onBeforeScrollEnd: null,
            onScrollEnd: null,
            onTouchEnd: null,
            onDestroy: null,
            onZoomStart: null,
            onZoom: null,
            onZoomEnd: null,
        };

        // User defined options
        for (i in options) that.options[i] = options[i];
        
        // Set starting position
        that.x = that.options.x;
        that.y = that.options.y;

        // Normalize options
        that.options.useTransform = hasTransform && that.options.useTransform;
        that.options.hScrollbar = that.options.hScroll && that.options.hScrollbar;
        that.options.vScrollbar = that.options.vScroll && that.options.vScrollbar;
        that.options.zoom = that.options.useTransform && that.options.zoom;
        that.options.useTransition = hasTransitionEnd && that.options.useTransition;

        // Helpers FIX ANDROID BUG!
        // translate3d and scale doesn't work together!
        // Ignoring 3d ONLY WHEN YOU SET that.options.zoom
        if ( that.options.zoom && isAndroid ){
            translateZ = '';
        }
        
        // Set some default styles
        that.scroller.style[transitionProperty] = that.options.useTransform ? cssVendor + 'transform' : 'top left';
        that.scroller.style[transitionDuration] = '0';
        that.scroller.style[transformOrigin] = '0 0';
        if (that.options.useTransition) that.scroller.style[transitionTimingFunction] = 'cubic-bezier(0.33,0.66,0.66,1)';
        
        if (that.options.useTransform) that.scroller.style[transform] = 'translate(' + that.x + 'px,' + that.y + 'px)' + translateZ;
        else that.scroller.style.cssText += ';position:absolute;top:' + that.y + 'px;left:' + that.x + 'px';

        if (that.options.useTransition) that.options.fixedScrollbar = true;

        that.refresh();

        that._bind(RESIZE_EV, window);
        that._bind(START_EV);
        if (!hasTouch) {
            if (that.options.wheelAction != 'none') {
                that._bind('DOMMouseScroll');
                that._bind('mousewheel');
            }
        }

        if (that.options.checkDOMChanges) that.checkDOMTime = setInterval(function () {
            that._checkDOMChanges();
        }, 500);
    };

// Prototype
iScroll.prototype = {
    enabled: true,
    x: 0,
    y: 0,
    steps: [],
    scale: 1,
    currPageX: 0, currPageY: 0,
    pagesX: [], pagesY: [],
    aniTime: null,
    wheelZoomCount: 0,
    
    handleEvent: function (e) {
        var that = this;
        switch(e.type) {
            case START_EV:
                if (!hasTouch && e.button !== 0) return;
                that._start(e);
                break;
            case MOVE_EV: that._move(e); break;
            case END_EV:
            case CANCEL_EV: that._end(e); break;
            case RESIZE_EV: that._resize(); break;
            case 'DOMMouseScroll': case 'mousewheel': that._wheel(e); break;
            case TRNEND_EV: that._transitionEnd(e); break;
        }
    },
    
    _checkDOMChanges: function () {
        if (this.moved || this.zoomed || this.animating ||
            (this.scrollerW == this.scroller.offsetWidth * this.scale && this.scrollerH == this.scroller.offsetHeight * this.scale)) return;

        this.refresh();
    },
    
    _scrollbar: function (dir) {
        var that = this,
            bar;

        if (!that[dir + 'Scrollbar']) {
            if (that[dir + 'ScrollbarWrapper']) {
                if (hasTransform) that[dir + 'ScrollbarIndicator'].style[transform] = '';
                that[dir + 'ScrollbarWrapper'].parentNode.removeChild(that[dir + 'ScrollbarWrapper']);
                that[dir + 'ScrollbarWrapper'] = null;
                that[dir + 'ScrollbarIndicator'] = null;
            }

            return;
        }

        if (!that[dir + 'ScrollbarWrapper']) {
            // Create the scrollbar wrapper
            if($('.leadScrollbar').length >= 1) return;
            bar = doc.createElement('div');
            bar.className = "leadScrollbar"

            if (that.options.scrollbarClass) bar.className = that.options.scrollbarClass + dir.toUpperCase();
            else bar.style.cssText = 'position:absolute;z-index:100;' + (dir == 'h' ? 'height:7px;bottom:1px;left:2px;right:' + (that.vScrollbar ? '7' : '2') + 'px' : 'width:5px;bottom:' + (that.hScrollbar ? '7' : '2') + 'px;top:2px;right:1px');

            bar.style.cssText += ';pointer-events:none;' + cssVendor + 'transition-property:opacity;' + cssVendor + 'transition-duration:' + (that.options.fadeScrollbar ? '350ms' : '0') + ';overflow:hidden;opacity:' + (that.options.hideScrollbar ? '0' : '1');

            that.wrapper.appendChild(bar);
            that[dir + 'ScrollbarWrapper'] = bar;

            // Create the scrollbar indicator
            bar = doc.createElement('div');
            if (!that.options.scrollbarClass) {
                bar.style.cssText = 'position:absolute;z-index:100;background:rgba(0,0,0,0.5);border:0;' + cssVendor + 'background-clip:padding-box;' + cssVendor + 'box-sizing:border-box;' + (dir == 'h' ? 'height:100%' : 'width:100%') + ';' + cssVendor + 'border-radius:3px;border-radius:3px';
            }
            bar.style.cssText += ';pointer-events:none;' + cssVendor + 'transition-property:' + cssVendor + 'transform;' + cssVendor + 'transition-timing-function:cubic-bezier(0.33,0.66,0.66,1);' + cssVendor + 'transition-duration:0;' + cssVendor + 'transform: translate(0,0)' + translateZ;
            if (that.options.useTransition) bar.style.cssText += ';' + cssVendor + 'transition-timing-function:cubic-bezier(0.33,0.66,0.66,1)';

            that[dir + 'ScrollbarWrapper'].appendChild(bar);
            that[dir + 'ScrollbarIndicator'] = bar;
        }

        if (dir == 'h') {
            that.hScrollbarSize = that.hScrollbarWrapper.clientWidth;
            that.hScrollbarIndicatorSize = m.max(m.round(that.hScrollbarSize * that.hScrollbarSize / that.scrollerW), 8);
            that.hScrollbarIndicator.style.width = that.hScrollbarIndicatorSize + 'px';
            that.hScrollbarMaxScroll = that.hScrollbarSize - that.hScrollbarIndicatorSize;
            that.hScrollbarProp = that.hScrollbarMaxScroll / that.maxScrollX;
        } else {

            that.vScrollbarSize = that.vScrollbarWrapper.clientHeight;
            that.vScrollbarIndicatorSize = m.max(m.round(that.vScrollbarSize * that.vScrollbarSize / that.scrollerH), 8);
            that.vScrollbarIndicator.style.height = that.vScrollbarIndicatorSize + 'px';
            that.vScrollbarMaxScroll = that.vScrollbarSize - that.vScrollbarIndicatorSize;
            that.vScrollbarProp = that.vScrollbarMaxScroll / that.maxScrollY;
        }

        // Reset position
        that._scrollbarPos(dir, true);
    },
    
    _resize: function () {
        var that = this;
        setTimeout(function () { that.refresh(); }, isAndroid ? 200 : 0);
    },
    
    _pos: function (x, y) {
        if (this.zoomed) return;
       // console.log(y)

        x = this.hScroll ? x : 0;
        y = this.vScroll ? y : 0;

        if (this.options.useTransform) {
            this.scroller.style[transform] = 'translate(' + x + 'px,' + y + 'px) scale(' + this.scale + ')' + translateZ;
        } else {
            x = m.round(x);
            y = m.round(y);
            this.scroller.style.left = x + 'px';
            this.scroller.style.top = y + 'px';
        }

        this.x = x;
        this.y = y;

        this._scrollbarPos('h');
        this._scrollbarPos('v');
    },

    _scrollbarPos: function (dir, hidden) {
        var that = this,
            pos = dir == 'h' ? that.x : that.y,
            size;

        if (!that[dir + 'Scrollbar']) return;

        pos = that[dir + 'ScrollbarProp'] * pos;

        if (pos < 0) {
            if (!that.options.fixedScrollbar) {
                size = that[dir + 'ScrollbarIndicatorSize'] + m.round(pos * 3);
                if (size < 8) size = 8;
                that[dir + 'ScrollbarIndicator'].style[dir == 'h' ? 'width' : 'height'] = size + 'px';
            }
            pos = 0;
        } else if (pos > that[dir + 'ScrollbarMaxScroll']) {
            if (!that.options.fixedScrollbar) {
                size = that[dir + 'ScrollbarIndicatorSize'] - m.round((pos - that[dir + 'ScrollbarMaxScroll']) * 3);
                if (size < 8) size = 8;
                that[dir + 'ScrollbarIndicator'].style[dir == 'h' ? 'width' : 'height'] = size + 'px';
                pos = that[dir + 'ScrollbarMaxScroll'] + (that[dir + 'ScrollbarIndicatorSize'] - size);
            } else {
                pos = that[dir + 'ScrollbarMaxScroll'];
            }
        }

        that[dir + 'ScrollbarWrapper'].style[transitionDelay] = '0';
        that[dir + 'ScrollbarWrapper'].style.opacity = hidden && that.options.hideScrollbar ? '0' : '1';
        that[dir + 'ScrollbarIndicator'].style[transform] = 'translate(' + (dir == 'h' ? pos + 'px,0)' : '0,' + pos + 'px)') + translateZ;
    },
    
    _start: function (e) {
        var that = this,
            point = hasTouch ? e.touches[0] : e,
            matrix, x, y,
            c1, c2;

        if (!that.enabled) return;

        if (that.options.onBeforeScrollStart) that.options.onBeforeScrollStart.call(that, e);

        if (that.options.useTransition || that.options.zoom) that._transitionTime(0);

        that.moved = false;
        that.animating = false;
        that.zoomed = false;
        that.distX = 0;
        that.distY = 0;
        that.absDistX = 0;
        that.absDistY = 0;
        that.dirX = 0;
        that.dirY = 0;

        // Gesture start
        if (that.options.zoom && hasTouch && e.touches.length > 1) {
            c1 = m.abs(e.touches[0].pageX-e.touches[1].pageX);
            c2 = m.abs(e.touches[0].pageY-e.touches[1].pageY);
            that.touchesDistStart = m.sqrt(c1 * c1 + c2 * c2);

            that.originX = m.abs(e.touches[0].pageX + e.touches[1].pageX - that.wrapperOffsetLeft * 2) / 2 - that.x;
            that.originY = m.abs(e.touches[0].pageY + e.touches[1].pageY - that.wrapperOffsetTop * 2) / 2 - that.y;

            if (that.options.onZoomStart) that.options.onZoomStart.call(that, e);
        }

        if (that.options.momentum) {
            if (that.options.useTransform) {
                // Very lame general purpose alternative to CSSMatrix
                matrix = getComputedStyle(that.scroller, null)[transform].replace(/[^0-9\-.,]/g, '').split(',');
                x = +(matrix[12] || matrix[4]);
                y = +(matrix[13] || matrix[5]);
            } else {
                x = +getComputedStyle(that.scroller, null).left.replace(/[^0-9-]/g, '');
                y = +getComputedStyle(that.scroller, null).top.replace(/[^0-9-]/g, '');
            }
            
            if (x != that.x || y != that.y) {
                if (that.options.useTransition) that._unbind(TRNEND_EV);
                else cancelFrame(that.aniTime);
                that.steps = [];
                that._pos(x, y);
                if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);
            }
        }

        that.absStartX = that.x;    // Needed by snap threshold
        that.absStartY = that.y;

        that.startX = that.x;
        that.startY = that.y;
        that.pointX = point.pageX;
        that.pointY = point.pageY;

        that.startTime = e.timeStamp || Date.now();

        if (that.options.onScrollStart) that.options.onScrollStart.call(that, e);

        that._bind(MOVE_EV, window);
        that._bind(END_EV, window);
        that._bind(CANCEL_EV, window);
    },
    
    _move: function (e) {
        var that = this,
            point = hasTouch ? e.touches[0] : e,
            deltaX = point.pageX - that.pointX,
            deltaY = point.pageY - that.pointY,
            newX = that.x + deltaX,
            newY = that.y + deltaY,
            c1, c2, scale,
            timestamp = e.timeStamp || Date.now();

        if (that.options.onBeforeScrollMove) that.options.onBeforeScrollMove.call(that, e);

        // Zoom
        if (that.options.zoom && hasTouch && e.touches.length > 1) {
            c1 = m.abs(e.touches[0].pageX - e.touches[1].pageX);
            c2 = m.abs(e.touches[0].pageY - e.touches[1].pageY);
            that.touchesDist = m.sqrt(c1*c1+c2*c2);

            that.zoomed = true;

            scale = 1 / that.touchesDistStart * that.touchesDist * this.scale;

            if (scale < that.options.zoomMin) scale = 0.5 * that.options.zoomMin * Math.pow(2.0, scale / that.options.zoomMin);
            else if (scale > that.options.zoomMax) scale = 2.0 * that.options.zoomMax * Math.pow(0.5, that.options.zoomMax / scale);

            that.lastScale = scale / this.scale;

            newX = this.originX - this.originX * that.lastScale + this.x;
            newY = this.originY - this.originY * that.lastScale + this.y;

            this.scroller.style[transform] = 'translate(' + newX + 'px,' + newY + 'px) scale(' + scale + ')' + translateZ;

            if (that.options.onZoom) that.options.onZoom.call(that, e);
            return;
        }

        that.pointX = point.pageX;
        that.pointY = point.pageY;

        // Slow down if outside of the boundaries
        if (newX > 0 || newX < that.maxScrollX) {
            newX = that.options.bounce ? that.x + (deltaX / 2) : newX >= 0 || that.maxScrollX >= 0 ? 0 : that.maxScrollX;
        }
        if (newY > that.minScrollY || newY < that.maxScrollY) {
            newY = that.options.bounce ? that.y + (deltaY / 2) : newY >= that.minScrollY || that.maxScrollY >= 0 ? that.minScrollY : that.maxScrollY;
        }

        that.distX += deltaX;
        that.distY += deltaY;
        that.absDistX = m.abs(that.distX);
        that.absDistY = m.abs(that.distY);

        if (that.absDistX < 6 && that.absDistY < 6) {
            return;
        }

        // Lock direction
        if (that.options.lockDirection) {
            if (that.absDistX > that.absDistY + 5) {
                newY = that.y;
                deltaY = 0;
            } else if (that.absDistY > that.absDistX + 5) {
                newX = that.x;
                deltaX = 0;
            }
        }

        that.moved = true;
        that._pos(newX, newY);
        that.dirX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
        that.dirY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

        if (timestamp - that.startTime > 300) {
            that.startTime = timestamp;
            that.startX = that.x;
            that.startY = that.y;
        }
        
        if (that.options.onScrollMove) that.options.onScrollMove.call(that, e);
    },
    
    _end: function (e) {
        if (hasTouch && e.touches.length !== 0) return;

        var that = this,
            point = hasTouch ? e.changedTouches[0] : e,
            target, ev,
            momentumX = { dist:0, time:0 },
            momentumY = { dist:0, time:0 },
            duration = (e.timeStamp || Date.now()) - that.startTime,
            newPosX = that.x,
            newPosY = that.y,
            distX, distY,
            newDuration,
            snap,
            scale;

        that._unbind(MOVE_EV, window);
        that._unbind(END_EV, window);
        that._unbind(CANCEL_EV, window);

        if (that.options.onBeforeScrollEnd) that.options.onBeforeScrollEnd.call(that, e);

        if (that.zoomed) {
            scale = that.scale * that.lastScale;
            scale = Math.max(that.options.zoomMin, scale);
            scale = Math.min(that.options.zoomMax, scale);
            that.lastScale = scale / that.scale;
            that.scale = scale;

            that.x = that.originX - that.originX * that.lastScale + that.x;
            that.y = that.originY - that.originY * that.lastScale + that.y;
            
            that.scroller.style[transitionDuration] = '200ms';
            that.scroller.style[transform] = 'translate(' + that.x + 'px,' + that.y + 'px) scale(' + that.scale + ')' + translateZ;
            
            that.zoomed = false;
            that.refresh();

            if (that.options.onZoomEnd) that.options.onZoomEnd.call(that, e);
            return;
        }

        if (!that.moved) {
            if (hasTouch) {
                if (that.doubleTapTimer && that.options.zoom) {
                    // Double tapped
                    clearTimeout(that.doubleTapTimer);
                    that.doubleTapTimer = null;
                    if (that.options.onZoomStart) that.options.onZoomStart.call(that, e);
                    that.zoom(that.pointX, that.pointY, that.scale == 1 ? that.options.doubleTapZoom : 1);
                    if (that.options.onZoomEnd) {
                        setTimeout(function() {
                            that.options.onZoomEnd.call(that, e);
                        }, 200); // 200 is default zoom duration
                    }
                } else if (this.options.handleClick) {
                    that.doubleTapTimer = setTimeout(function () {
                        that.doubleTapTimer = null;

                        // Find the last touched element
                        target = point.target;
                        while (target.nodeType != 1) target = target.parentNode;

                        if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') {
                            ev = doc.createEvent('MouseEvents');
                            ev.initMouseEvent('click', true, true, e.view, 1,
                                point.screenX, point.screenY, point.clientX, point.clientY,
                                e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
                                0, null);
                            ev._fake = true;
                            target.dispatchEvent(ev);
                        }
                    }, that.options.zoom ? 250 : 0);
                }
            }

            that._resetPos(400);

            if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
            return;
        }

        if (duration < 300 && that.options.momentum) {
            momentumX = newPosX ? that._momentum(newPosX - that.startX, duration, -that.x, that.scrollerW - that.wrapperW + that.x, that.options.bounce ? that.wrapperW : 0) : momentumX;
            momentumY = newPosY ? that._momentum(newPosY - that.startY, duration, -that.y, (that.maxScrollY < 0 ? that.scrollerH - that.wrapperH + that.y - that.minScrollY : 0), that.options.bounce ? that.wrapperH : 0) : momentumY;

            newPosX = that.x + momentumX.dist;
            newPosY = that.y + momentumY.dist;

            if ((that.x > 0 && newPosX > 0) || (that.x < that.maxScrollX && newPosX < that.maxScrollX)) momentumX = { dist:0, time:0 };
            if ((that.y > that.minScrollY && newPosY > that.minScrollY) || (that.y < that.maxScrollY && newPosY < that.maxScrollY)) momentumY = { dist:0, time:0 };
        }

        if (momentumX.dist || momentumY.dist) {
            newDuration = m.max(m.max(momentumX.time, momentumY.time), 10);

            // Do we need to snap?
            if (that.options.snap) {
                distX = newPosX - that.absStartX;
                distY = newPosY - that.absStartY;
                if (m.abs(distX) < that.options.snapThreshold && m.abs(distY) < that.options.snapThreshold) { that.scrollTo(that.absStartX, that.absStartY, 200); }
                else {
                    snap = that._snap(newPosX, newPosY);
                    newPosX = snap.x;
                    newPosY = snap.y;
                    newDuration = m.max(snap.time, newDuration);
                }
            }

            that.scrollTo(m.round(newPosX), m.round(newPosY), newDuration);

            if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
            return;
        }

        // Do we need to snap?
        if (that.options.snap) {
            distX = newPosX - that.absStartX;
            distY = newPosY - that.absStartY;
            if (m.abs(distX) < that.options.snapThreshold && m.abs(distY) < that.options.snapThreshold) that.scrollTo(that.absStartX, that.absStartY, 200);
            else {
                snap = that._snap(that.x, that.y);
                if (snap.x != that.x || snap.y != that.y) that.scrollTo(snap.x, snap.y, snap.time);
            }

            if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
            return;
        }

        that._resetPos(200);
        if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
    },
    
    _resetPos: function (time) {

        var that = this,
            resetX = that.x >= 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x,
            resetY = that.y >= that.minScrollY || that.maxScrollY > 0 ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;

        if (resetX == that.x && resetY == that.y) {
            if (that.moved) {
                that.moved = false;
                if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);      // Execute custom code on scroll end
            }

            if (that.hScrollbar && that.options.hideScrollbar) {
                if (vendor == 'webkit') that.hScrollbarWrapper.style[transitionDelay] = '300ms';
                that.hScrollbarWrapper.style.opacity = '0';
            }
            if (that.vScrollbar && that.options.hideScrollbar) {
                if (vendor == 'webkit') that.vScrollbarWrapper.style[transitionDelay] = '300ms';
                that.vScrollbarWrapper.style.opacity = '0';
            }

            return;
        }

        that.scrollTo(resetX, resetY, time || 0);
    },

    _wheel: function (e) {
        var that = this,
            wheelDeltaX, wheelDeltaY,
            deltaX, deltaY,
            deltaScale;

        if ('wheelDeltaX' in e) {
            wheelDeltaX = e.wheelDeltaX / 12;
            wheelDeltaY = e.wheelDeltaY / 12;
        } else if('wheelDelta' in e) {
            wheelDeltaX = wheelDeltaY = e.wheelDelta / 12;
        } else if ('detail' in e) {
            wheelDeltaX = wheelDeltaY = -e.detail * 3;
        } else {
            return;
        }
        
        if (that.options.wheelAction == 'zoom') {
            deltaScale = that.scale * Math.pow(2, 1/3 * (wheelDeltaY ? wheelDeltaY / Math.abs(wheelDeltaY) : 0));
            if (deltaScale < that.options.zoomMin) deltaScale = that.options.zoomMin;
            if (deltaScale > that.options.zoomMax) deltaScale = that.options.zoomMax;
            
            if (deltaScale != that.scale) {
                if (!that.wheelZoomCount && that.options.onZoomStart) that.options.onZoomStart.call(that, e);
                that.wheelZoomCount++;
                
                that.zoom(e.pageX, e.pageY, deltaScale, 400);
                
                setTimeout(function() {
                    that.wheelZoomCount--;
                    if (!that.wheelZoomCount && that.options.onZoomEnd) that.options.onZoomEnd.call(that, e);
                }, 400);
            }
            
            return;
        }
        
        deltaX = that.x + wheelDeltaX;
        deltaY = that.y + wheelDeltaY;

        if (deltaX > 0) deltaX = 0;
        else if (deltaX < that.maxScrollX) deltaX = that.maxScrollX;

        if (deltaY > that.minScrollY) deltaY = that.minScrollY;
        else if (deltaY < that.maxScrollY) deltaY = that.maxScrollY;
    
        if (that.maxScrollY < 0) {
            that.scrollTo(deltaX, deltaY, 0);
        }
    },
    
    _transitionEnd: function (e) {
        var that = this;

        if (e.target != that.scroller) return;

        that._unbind(TRNEND_EV);
        
        that._startAni();

    },


    /**
    *
    * Utilities
    *
    */
    _startAni: function () {
        var that = this,
            startX = that.x, startY = that.y,
            startTime = Date.now(),
            step, easeOut,
            animate;

        if (that.animating) return;
        
        if (!that.steps.length) {
            that._resetPos(400);
            return;
        }
        
        step = that.steps.shift();
        
        if (step.x == startX && step.y == startY) step.time = 0;

        that.animating = true;
        that.moved = true;
        
        if (that.options.useTransition) {
            that._transitionTime(step.time);
            that._pos(step.x, step.y);
            that.animating = false;
            if (step.time) that._bind(TRNEND_EV);
            else that._resetPos(0);
            return;
        }

        animate = function () {
            var now = Date.now(),
                newX, newY;

            if (now >= startTime + step.time) {
                that._pos(step.x, step.y);
                that.animating = false;
                
                if (that.options.onAnimationEnd) that.options.onAnimationEnd.call(that);            // Execute custom code on animation end
                that._startAni();
                return;
            }

            now = (now - startTime) / step.time - 1;
            easeOut = m.sqrt(1 - now * now);
            newX = (step.x - startX) * easeOut + startX;
            newY = (step.y - startY) * easeOut + startY;
            that._pos(newX, newY);
            if (that.animating) that.aniTime = nextFrame(animate);
        };

        animate();
    },

    

    _transitionTime: function (time) {
        time += 'ms';
        this.scroller.style[transitionDuration] = time;
        if (this.hScrollbar) this.hScrollbarIndicator.style[transitionDuration] = time;
        if (this.vScrollbar) this.vScrollbarIndicator.style[transitionDuration] = time;
    },

    _momentum: function (dist, time, maxDistUpper, maxDistLower, size) {
        var deceleration = 0.0006,
            speed = m.abs(dist) / time,
            newDist = (speed * speed) / (2 * deceleration),
            newTime = 0, outsideDist = 0;

        // Proportinally reduce speed if we are outside of the boundaries
        if (dist > 0 && newDist > maxDistUpper) {
            outsideDist = size / (6 / (newDist / speed * deceleration));
            maxDistUpper = maxDistUpper + outsideDist;
            speed = speed * maxDistUpper / newDist;
            newDist = maxDistUpper;
        } else if (dist < 0 && newDist > maxDistLower) {
            outsideDist = size / (6 / (newDist / speed * deceleration));
            maxDistLower = maxDistLower + outsideDist;
            speed = speed * maxDistLower / newDist;
            newDist = maxDistLower;
        }

        newDist = newDist * (dist < 0 ? -1 : 1);
        newTime = speed / deceleration;

        return { dist: newDist, time: m.round(newTime) };
    },

    _offset: function (el) {
        var left = -el.offsetLeft,
            top = -el.offsetTop;
            
        while (el = el.offsetParent) {
            left -= el.offsetLeft;
            top -= el.offsetTop;
        }
        
        if (el != this.wrapper) {
            left *= this.scale;
            top *= this.scale;
        }

        return { left: left, top: top };
    },

    _snap: function (x, y) {
        var that = this,
            i, l,
            page, time,
            sizeX, sizeY;

        // Check page X
        page = that.pagesX.length - 1;
        for (i=0, l=that.pagesX.length; i<l; i++) {
            if (x >= that.pagesX[i]) {
                page = i;
                break;
            }
        }
        if (page == that.currPageX && page > 0 && that.dirX < 0) page--;
        x = that.pagesX[page];
        sizeX = m.abs(x - that.pagesX[that.currPageX]);
        sizeX = sizeX ? m.abs(that.x - x) / sizeX * 500 : 0;
        that.currPageX = page;

        // Check page Y
        page = that.pagesY.length-1;
        for (i=0; i<page; i++) {
            if (y >= that.pagesY[i]) {
                page = i;
                break;
            }
        }
        if (page == that.currPageY && page > 0 && that.dirY < 0) page--;
        y = that.pagesY[page];
        sizeY = m.abs(y - that.pagesY[that.currPageY]);
        sizeY = sizeY ? m.abs(that.y - y) / sizeY * 500 : 0;
        that.currPageY = page;

        // Snap with constant speed (proportional duration)
        time = m.round(m.max(sizeX, sizeY)) || 200;

        return { x: x, y: y, time: time };
    },

    _bind: function (type, el, bubble) {
        (el || this.scroller).addEventListener(type, this, !!bubble);
    },

    _unbind: function (type, el, bubble) {
        (el || this.scroller).removeEventListener(type, this, !!bubble);
    },


    /**
    *
    * Public methods
    *
    */


    destroy: function () {
        var that = this;

        that.scroller.style[transform] = '';

        // Remove the scrollbars
        that.hScrollbar = false;
        that.vScrollbar = false;
        that._scrollbar('h');
        that._scrollbar('v');

        // Remove the event listeners
        that._unbind(RESIZE_EV, window);
        that._unbind(START_EV);
        that._unbind(MOVE_EV, window);
        that._unbind(END_EV, window);
        that._unbind(CANCEL_EV, window);
        
        if (!that.options.hasTouch) {
            that._unbind('DOMMouseScroll');
            that._unbind('mousewheel');
        }
        
        if (that.options.useTransition) that._unbind(TRNEND_EV);
        
        if (that.options.checkDOMChanges) clearInterval(that.checkDOMTime);
        
        if (that.options.onDestroy) that.options.onDestroy.call(that);

        // var div = $('.myscroll').clone();
        // var o = arguments[0] || "#wrapper";
        // $( o ).empty();
        // $( o ).append( div );
        // $("body").unbind('touchmove');
        // this.refresh();
    },

    refresh: function () {
        var that = this,
            offset,
            i, l,
            els,
            pos = 0,
            page = 0;
        //var arg = arguments[0];

        var pullupH = $('.pullUp').height() + 5;
        if (that.scale < that.options.zoomMin) that.scale = that.options.zoomMin;
        that.wrapperW = that.wrapper.clientWidth || 1;
        that.wrapperH = that.wrapper.clientHeight || 1;
        
        that.minScrollY = -that.options.topOffset || 0;
        that.scrollerW = m.round(that.scroller.offsetWidth * that.scale);
        that.scrollerH = m.round((that.scroller.offsetHeight + that.minScrollY) * that.scale) // 修复顶部距离bug for 利得金融
        that.maxScrollX = that.wrapperW - that.scrollerW;
        that.maxScrollY = that.wrapperH - that.scrollerH + that.minScrollY;
        that.dirX = 0;
        that.dirY = 0;

        if (that.options.onRefresh) that.options.onRefresh.call(that);

        that.hScroll = that.options.hScroll && that.maxScrollX < 0;
        that.vScroll = that.options.vScroll && (!that.options.bounceLock && !that.hScroll || that.scrollerH > that.wrapperH);

        that.hScrollbar = that.hScroll && that.options.hScrollbar;
        that.vScrollbar = that.vScroll && that.options.vScrollbar && that.scrollerH > that.wrapperH;

        offset = that._offset(that.wrapper);
        that.wrapperOffsetLeft = -offset.left;
        that.wrapperOffsetTop = -offset.top;


        // Prepare snap
        if (typeof that.options.snap == 'string') {
            
            that.pagesX = [];
            that.pagesY = [];
            els = that.scroller.querySelectorAll(that.options.snap);
            for (i=0, l=els.length; i<l; i++) {
                pos = that._offset(els[i]);
                pos.left += that.wrapperOffsetLeft;
                pos.top += that.wrapperOffsetTop;
                that.pagesX[i] = pos.left < that.maxScrollX ? that.maxScrollX : pos.left * that.scale;
                that.pagesY[i] = pos.top < that.maxScrollY ? that.maxScrollY : pos.top * that.scale;
            }
        } else if (that.options.snap) {

            that.pagesX = [];
            while (pos >= that.maxScrollX) {
                that.pagesX[page] = pos;
                pos = pos - that.wrapperW;
                page++;
            }
            if (that.maxScrollX%that.wrapperW) that.pagesX[that.pagesX.length] = that.maxScrollX - that.pagesX[that.pagesX.length-1] + that.pagesX[that.pagesX.length-1];

            pos = 0;
            page = 0;
            that.pagesY = [];
            while (pos >= that.maxScrollY) {
                that.pagesY[page] = pos;
                pos = pos - that.wrapperH;
                page++;
            }
            if (that.maxScrollY%that.wrapperH) that.pagesY[that.pagesY.length] = that.maxScrollY - that.pagesY[that.pagesY.length-1] + that.pagesY[that.pagesY.length-1];
        }

        // Prepare the scrollbars
        that._scrollbar('h');
        that._scrollbar('v');

        if (!that.zoomed) {
            that.scroller.style[transitionDuration] = '0';

            setTimeout(function(){
                that._resetPos(400);
            },300)
        }
    },

    scrollTo: function (x, y, time, relative) {
        var that = this,
            step = x,
            i, l;

        that.stop();

        if (!step.length) step = [{ x: x, y: y, time: time, relative: relative }];
        
        for (i=0, l=step.length; i<l; i++) {
            if (step[i].relative) { step[i].x = that.x - step[i].x; step[i].y = that.y - step[i].y; }
            that.steps.push({ x: step[i].x, y: step[i].y, time: step[i].time || 0 });
        }
        that._startAni();
    },

    // scrollToElement: function (el, time) {
    //  var that = this, pos;
    //  el = el.nodeType ? el : that.scroller.querySelector(el);
    //  if (!el) return;

    //  pos = that._offset(el);
    //  pos.left += that.wrapperOffsetLeft;
    //  pos.top += that.wrapperOffsetTop;

    //  pos.left = pos.left > 0 ? 0 : pos.left < that.maxScrollX ? that.maxScrollX : pos.left;
    //  pos.top = pos.top > that.minScrollY ? that.minScrollY : pos.top < that.maxScrollY ? that.maxScrollY : pos.top;
    //  time = time === undefined ? m.max(m.abs(pos.left)*2, m.abs(pos.top)*2) : time;

    //  that.scrollTo(pos.left, pos.top, time);
    // },

    // scrollToPage: function (pageX, pageY, time) {
    //  var that = this, x, y;
        
    //  time = time === undefined ? 400 : time;

    //  if (that.options.onScrollStart) that.options.onScrollStart.call(that);

    //  if (that.options.snap) {
    //      pageX = pageX == 'next' ? that.currPageX+1 : pageX == 'prev' ? that.currPageX-1 : pageX;
    //      pageY = pageY == 'next' ? that.currPageY+1 : pageY == 'prev' ? that.currPageY-1 : pageY;

    //      pageX = pageX < 0 ? 0 : pageX > that.pagesX.length-1 ? that.pagesX.length-1 : pageX;
    //      pageY = pageY < 0 ? 0 : pageY > that.pagesY.length-1 ? that.pagesY.length-1 : pageY;

    //      that.currPageX = pageX;
    //      that.currPageY = pageY;
    //      x = that.pagesX[pageX];
    //      y = that.pagesY[pageY];
    //  } else {
    //      x = -that.wrapperW * pageX;
    //      y = -that.wrapperH * pageY;
    //      if (x < that.maxScrollX) x = that.maxScrollX;
    //      if (y < that.maxScrollY) y = that.maxScrollY;
    //  }

    //  that.scrollTo(x, y, time);
    // },

    disable: function () {
        this.stop();
        this._resetPos(0);
        this.enabled = false;

        // If disabled after touchstart we make sure that there are no left over events
        this._unbind(MOVE_EV, window);
        this._unbind(END_EV, window);
        this._unbind(CANCEL_EV, window);
    },
    
    enable: function () {
        this.enabled = true;
    },
    
    stop: function () {
        if (this.options.useTransition) this._unbind(TRNEND_EV);
        else cancelFrame(this.aniTime);
        this.steps = [];
        this.moved = false;
        this.animating = false;
    },
    
    // zoom: function (x, y, scale, time) {
    //  var that = this,
    //      relScale = scale / that.scale;

    //  if (!that.options.useTransform) return;

    //  that.zoomed = true;
    //  time = time === undefined ? 200 : time;
    //  x = x - that.wrapperOffsetLeft - that.x;
    //  y = y - that.wrapperOffsetTop - that.y;
    //  that.x = x - x * relScale + that.x;
    //  that.y = y - y * relScale + that.y;

    //  that.scale = scale;
    //  that.refresh();

    //  that.x = that.x > 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x;
    //  that.y = that.y > that.minScrollY ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;

    //  that.scroller.style[transitionDuration] = time + 'ms';
    //  that.scroller.style[transform] = 'translate(' + that.x + 'px,' + that.y + 'px) scale(' + scale + ')' + translateZ;
    //  that.zoomed = false;
    // },
    
    isReady: function () {
        return !this.moved && !this.zoomed && !this.animating;
    }
};

function prefixStyle (style) {
    if ( vendor === '' ) return style;

    style = style.charAt(0).toUpperCase() + style.substr(1);
    return vendor + style;
}

dummyStyle = null;  // for the sake of it

if (typeof exports !== 'undefined') exports.iScroll = iScroll;
else window.iScroll = iScroll;

})(window, document);


// 微信分享库文件，AMD引入改造
!(function(){
    var a = window;
    function c(b, c, d) {
        a.WeixinJSBridge ? WeixinJSBridge.invoke(b, e(c), function (a) {
            g(b, a, d)
        }) : j(b, d)
    }

    function d(b, c, d) {
        a.WeixinJSBridge ? WeixinJSBridge.on(b, function (a) {
            d && d.trigger && d.trigger(a), g(b, a, c)
        }) : d ? j(b, d) : j(b, c)
    }

    function e(a) {
        return a = a || {}, a.appId = E.appId, a.verifyAppId = E.appId, a.verifySignType = "sha1", a.verifyTimestamp = E.timestamp + "", a.verifyNonceStr = E.nonceStr, a.verifySignature = E.signature, a
    }

    function f(a) {
        return {
            timeStamp: a.timestamp + "",
            nonceStr: a.nonceStr,
            "package": a.package,
            paySign: a.paySign,
            signType: a.signType || "SHA1"
        }
    }

    function g(a, b, c) {
        var d, e, f;
        switch (delete b.err_code, delete b.err_desc, delete b.err_detail, d = b.errMsg, d || (d = b.err_msg, delete b.err_msg, d = h(a, d), b.errMsg = d), c = c || {}, c._complete && (c._complete(b), delete c._complete), d = b.errMsg || "", E.debug && !c.isInnerInvoke && alert(JSON.stringify(b)), e = d.indexOf(":"), f = d.substring(e + 1)) {
            case"ok":
                c.success && c.success(b);
                break;
            case"cancel":
                c.cancel && c.cancel(b);
                break;
            default:
                c.fail && c.fail(b)
        }
        c.complete && c.complete(b)
    }

    function h(a, b) {
        var e, f, c = a, d = p[c];
        return d && (c = d), e = "ok", b && (f = b.indexOf(":"), e = b.substring(f + 1), "confirm" == e && (e = "ok"), "failed" == e && (e = "fail"), -1 != e.indexOf("failed_") && (e = e.substring(7)), -1 != e.indexOf("fail_") && (e = e.substring(5)), e = e.replace(/_/g, " "), e = e.toLowerCase(), ("access denied" == e || "no permission to execute" == e) && (e = "permission denied"), "config" == c && "function not exist" == e && (e = "ok"), "" == e && (e = "fail")), b = c + ":" + e
    }

    function i(a) {
        var b, c, d, e;
        if (a) {
            for (b = 0, c = a.length; c > b; ++b)d = a[b], e = o[d], e && (a[b] = e);
            return a
        }
    }

    function j(a, b) {
        if (!(!E.debug || b && b.isInnerInvoke)) {
            var c = p[a];
            c && (a = c), b && b._complete && delete b._complete, console.log('"' + a + '",', b || "")
        }
    }

    function k() {
        u || v || E.debug || "6.0.2" > z || D.systemType < 0 || A || (A = !0, D.appId = E.appId, D.initTime = C.initEndTime - C.initStartTime, D.preVerifyTime = C.preVerifyEndTime - C.preVerifyStartTime, H.getNetworkType({
            isInnerInvoke: !0,
            success: function (a) {
                var b, c;
                D.networkType = a.networkType, b = "http://open.weixin.qq.com/sdk/report?v=" + D.version + "&o=" + D.isPreVerifyOk + "&s=" + D.systemType + "&c=" + D.clientVersion + "&a=" + D.appId + "&n=" + D.networkType + "&i=" + D.initTime + "&p=" + D.preVerifyTime + "&u=" + D.url, c = new Image, c.src = b
            }
        }))
    }

    function l() {
        return (new Date).getTime()
    }

    function m(b) {
        w && (a.WeixinJSBridge ? b() : q.addEventListener && q.addEventListener("WeixinJSBridgeReady", b, !1))
    }

    function n() {
        H.invoke || (H.invoke = function (b, c, d) {
            a.WeixinJSBridge && WeixinJSBridge.invoke(b, e(c), d)
        }, H.on = function (b, c) {
            a.WeixinJSBridge && WeixinJSBridge.on(b, c)
        })
    }

    var o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D, E, F, G, H;
    if (!a.jWeixin)return o = {
        config: "preVerifyJSAPI",
        onMenuShareTimeline: "menu:share:timeline",
        onMenuShareAppMessage: "menu:share:appmessage",
        onMenuShareQQ: "menu:share:qq",
        onMenuShareWeibo: "menu:share:weiboApp",
        onMenuShareQZone: "menu:share:QZone",
        previewImage: "imagePreview",
        getLocation: "geoLocation",
        openProductSpecificView: "openProductViewWithPid",
        addCard: "batchAddCard",
        openCard: "batchViewCard",
        chooseWXPay: "getBrandWCPayRequest"
    }, p = function () {
        var b, a = {};
        for (b in o)a[o[b]] = b;
        return a
    }(), q = a.document, r = q.title, s = navigator.userAgent.toLowerCase(), t = navigator.platform.toLowerCase(), u = !(!t.match("mac") && !t.match("win")), v = -1 != s.indexOf("wxdebugger"), w = -1 != s.indexOf("micromessenger"), x = -1 != s.indexOf("android"), y = -1 != s.indexOf("iphone") || -1 != s.indexOf("ipad"), z = function () {
        var a = s.match(/micromessenger\/(\d+\.\d+\.\d+)/) || s.match(/micromessenger\/(\d+\.\d+)/);
        return a ? a[1] : ""
    }(), A = !1, B = !1, C = {
        initStartTime: l(),
        initEndTime: 0,
        preVerifyStartTime: 0,
        preVerifyEndTime: 0
    }, D = {
        version: 1,
        appId: "",
        initTime: 0,
        preVerifyTime: 0,
        networkType: "",
        isPreVerifyOk: 1,
        systemType: y ? 1 : x ? 2 : -1,
        clientVersion: z,
        url: encodeURIComponent(location.href)
    }, E = {}, F = {_completes: []}, G = {state: 0, data: {}}, m(function () {
        C.initEndTime = l()
    }), H = {
        config: function (a) {
            E = a, j("config", a);
            var b = E.check === !1 ? !1 : !0;
            m(function () {
                var a, d, e;
                if (b)c(o.config, {verifyJsApiList: i(E.jsApiList)}, function () {
                    F._complete = function (a) {
                        C.preVerifyEndTime = l(), G.state = 1, G.data = a
                    }, F.success = function () {
                        D.isPreVerifyOk = 0
                    }, F.fail = function (a) {
                        F._fail ? F._fail(a) : G.state = -1
                    };
                    var a = F._completes;
                    return a.push(function () {
                        k()
                    }), F.complete = function () {
                        for (var c = 0, d = a.length; d > c; ++c)a[c]();
                        F._completes = []
                    }, F
                }()), C.preVerifyStartTime = l(); else {
                    for (G.state = 1, a = F._completes, d = 0, e = a.length; e > d; ++d)a[d]();
                    F._completes = []
                }
            }), E.beta && n()
        }, ready: function (a) {
            0 != G.state ? a() : (F._completes.push(a), !w && E.debug && a())
        }, error: function (a) {
            "6.0.2" > z || B || (B = !0, -1 == G.state ? a(G.data) : F._fail = a)
        }, checkJsApi: function (a) {
            var b = function (a) {
                var c, d, b = a.checkResult;
                for (c in b)d = p[c], d && (b[d] = b[c], delete b[c]);
                return a
            };
            c("checkJsApi", {jsApiList: i(a.jsApiList)}, function () {
                return a._complete = function (a) {
                    if (x) {
                        var c = a.checkResult;
                        c && (a.checkResult = JSON.parse(c))
                    }
                    a = b(a)
                }, a
            }())
        }, onMenuShareTimeline: function (a) {
            d(o.onMenuShareTimeline, {
                complete: function () {
                    c("shareTimeline", {
                        title: a.title || r,
                        desc: a.title || r,
                        img_url: a.imgUrl || "",
                        link: a.link || location.href,
                        type: a.type || "link",
                        data_url: a.dataUrl || ""
                    }, a)
                }
            }, a)
        }, onMenuShareAppMessage: function (a) {
            d(o.onMenuShareAppMessage, {
                complete: function () {
                    c("sendAppMessage", {
                        title: a.title || r,
                        desc: a.desc || "",
                        link: a.link || location.href,
                        img_url: a.imgUrl || "",
                        type: a.type || "link",
                        data_url: a.dataUrl || ""
                    }, a)
                }
            }, a)
        }, onMenuShareQQ: function (a) {
            d(o.onMenuShareQQ, {
                complete: function () {
                    c("shareQQ", {
                        title: a.title || r,
                        desc: a.desc || "",
                        img_url: a.imgUrl || "",
                        link: a.link || location.href
                    }, a)
                }
            }, a)
        }, onMenuShareWeibo: function (a) {
            d(o.onMenuShareWeibo, {
                complete: function () {
                    c("shareWeiboApp", {
                        title: a.title || r,
                        desc: a.desc || "",
                        img_url: a.imgUrl || "",
                        link: a.link || location.href
                    }, a)
                }
            }, a)
        }, onMenuShareQZone: function (a) {
            d(o.onMenuShareQZone, {
                complete: function () {
                    c("shareQZone", {
                        title: a.title || r,
                        desc: a.desc || "",
                        img_url: a.imgUrl || "",
                        link: a.link || location.href
                    }, a)
                }
            }, a)
        }, startRecord: function (a) {
            c("startRecord", {}, a)
        }, stopRecord: function (a) {
            c("stopRecord", {}, a)
        }, onVoiceRecordEnd: function (a) {
            d("onVoiceRecordEnd", a)
        }, playVoice: function (a) {
            c("playVoice", {localId: a.localId}, a)
        }, pauseVoice: function (a) {
            c("pauseVoice", {localId: a.localId}, a)
        }, stopVoice: function (a) {
            c("stopVoice", {localId: a.localId}, a)
        }, onVoicePlayEnd: function (a) {
            d("onVoicePlayEnd", a)
        }, uploadVoice: function (a) {
            c("uploadVoice", {localId: a.localId, isShowProgressTips: 0 == a.isShowProgressTips ? 0 : 1}, a)
        }, downloadVoice: function (a) {
            c("downloadVoice", {serverId: a.serverId, isShowProgressTips: 0 == a.isShowProgressTips ? 0 : 1}, a)
        }, translateVoice: function (a) {
            c("translateVoice", {localId: a.localId, isShowProgressTips: 0 == a.isShowProgressTips ? 0 : 1}, a)
        }, chooseImage: function (a) {
            c("chooseImage", {
                scene: "1|2",
                count: a.count || 9,
                sizeType: a.sizeType || ["original", "compressed"],
                sourceType: a.sourceType || ["album", "camera"]
            }, function () {
                return a._complete = function (a) {
                    if (x) {
                        var b = a.localIds;
                        b && (a.localIds = JSON.parse(b))
                    }
                }, a
            }())
        }, previewImage: function (a) {
            c(o.previewImage, {current: a.current, urls: a.urls}, a)
        }, uploadImage: function (a) {
            c("uploadImage", {localId: a.localId, isShowProgressTips: 0 == a.isShowProgressTips ? 0 : 1}, a)
        }, downloadImage: function (a) {
            c("downloadImage", {serverId: a.serverId, isShowProgressTips: 0 == a.isShowProgressTips ? 0 : 1}, a)
        }, getNetworkType: function (a) {
            var b = function (a) {
                var c, d, e, b = a.errMsg;
                if (a.errMsg = "getNetworkType:ok", c = a.subtype, delete a.subtype, c)a.networkType = c; else switch (d = b.indexOf(":"), e = b.substring(d + 1)) {
                    case"wifi":
                    case"edge":
                    case"wwan":
                        a.networkType = e;
                        break;
                    default:
                        a.errMsg = "getNetworkType:fail"
                }
                return a
            };
            c("getNetworkType", {}, function () {
                return a._complete = function (a) {
                    a = b(a)
                }, a
            }())
        }, openLocation: function (a) {
            c("openLocation", {
                latitude: a.latitude,
                longitude: a.longitude,
                name: a.name || "",
                address: a.address || "",
                scale: a.scale || 28,
                infoUrl: a.infoUrl || ""
            }, a)
        }, getLocation: function (a) {
            a = a || {}, c(o.getLocation, {type: a.type || "wgs84"}, function () {
                return a._complete = function (a) {
                    delete a.type
                }, a
            }())
        }, hideOptionMenu: function (a) {
            c("hideOptionMenu", {}, a)
        }, showOptionMenu: function (a) {
            c("showOptionMenu", {}, a)
        }, closeWindow: function (a) {
            a = a || {}, c("closeWindow", {}, a)
        }, hideMenuItems: function (a) {
            c("hideMenuItems", {menuList: a.menuList}, a)
        }, showMenuItems: function (a) {
            c("showMenuItems", {menuList: a.menuList}, a)
        }, hideAllNonBaseMenuItem: function (a) {
            c("hideAllNonBaseMenuItem", {}, a)
        }, showAllNonBaseMenuItem: function (a) {
            c("showAllNonBaseMenuItem", {}, a)
        }, scanQRCode: function (a) {
            a = a || {}, c("scanQRCode", {
                needResult: a.needResult || 0,
                scanType: a.scanType || ["qrCode", "barCode"]
            }, function () {
                return a._complete = function (a) {
                    var b, c;
                    y && (b = a.resultStr, b && (c = JSON.parse(b), a.resultStr = c && c.scan_code && c.scan_code.scan_result))
                }, a
            }())
        }, openProductSpecificView: function (a) {
            c(o.openProductSpecificView, {pid: a.productId, view_type: a.viewType || 0, ext_info: a.extInfo}, a)
        }, addCard: function (a) {
            var e, f, g, h, b = a.cardList, d = [];
            for (e = 0, f = b.length; f > e; ++e)g = b[e], h = {card_id: g.cardId, card_ext: g.cardExt}, d.push(h);
            c(o.addCard, {card_list: d}, function () {
                return a._complete = function (a) {
                    var c, d, e, b = a.card_list;
                    if (b) {
                        for (b = JSON.parse(b), c = 0, d = b.length; d > c; ++c)e = b[c], e.cardId = e.card_id, e.cardExt = e.card_ext, e.isSuccess = e.is_succ ? !0 : !1, delete e.card_id, delete e.card_ext, delete e.is_succ;
                        a.cardList = b, delete a.card_list
                    }
                }, a
            }())
        }, chooseCard: function (a) {
            c("chooseCard", {
                app_id: E.appId,
                location_id: a.shopId || "",
                sign_type: a.signType || "SHA1",
                card_id: a.cardId || "",
                card_type: a.cardType || "",
                card_sign: a.cardSign,
                time_stamp: a.timestamp + "",
                nonce_str: a.nonceStr
            }, function () {
                return a._complete = function (a) {
                    a.cardList = a.choose_card_info, delete a.choose_card_info
                }, a
            }())
        }, openCard: function (a) {
            var e, f, g, h, b = a.cardList, d = [];
            for (e = 0, f = b.length; f > e; ++e)g = b[e], h = {card_id: g.cardId, code: g.code}, d.push(h);
            c(o.openCard, {card_list: d}, a)
        }, chooseWXPay: function (a) {
            c(o.chooseWXPay, f(a), a)
        }
    }, (a.wx = a.jWeixin = H)
})()

// 一些基本方法，RSA加密等
;(function (Zepto) {
    // RSA 加密算法
    function RSAKeyPair(encryptionExponent, decryptionExponent, modulus) {
        this.e = biFromHex(encryptionExponent);
        this.d = biFromHex(decryptionExponent);
        this.m = biFromHex(modulus);
        this.chunkSize = 2 * biHighIndex(this.m);
        this.radix = 16;
        this.barrett = new BarrettMu(this.m)
    };
    function RSAKeyPairApp(encryptionExponent, decryptionExponent, modulus) {
        this.e = biFromHex(encryptionExponent);
        this.d = biFromHex(decryptionExponent);
        this.m = biFromHex(modulus);
        this.chunkSize = 128;
        this.radix = 16;
        this.barrett = new BarrettMu(this.m)
    };
    function twoDigit(n) {
        return (n < 10 ? "0" : "") + String(n)
    };
    function encryptedString(key, s) {
        var a = new Array();
        var sl = s.length;
        var i = 0;
        while (i < sl) {
            a[i] = s.charCodeAt(i);
            i++
        }
        ;
        while (a.length % key.chunkSize != 0) {
            a[i++] = 0
        }
        ;
        var al = a.length;
        var result = "";
        var j, k, block;
        for (i = 0; i < al; i += key.chunkSize) {
            block = new BigInt();
            j = 0;
            for (k = i; k < i + key.chunkSize; ++j) {
                block.digits[j] = a[k++];
                block.digits[j] += a[k++] << 8
            }
            var crypt = key.barrett.powMod(block, key.e);
            var text = key.radix == 16 ? biToHex(crypt) : biToString(crypt, key.radix);
            result += text + " "
        }
        ;
        return result.substring(0, result.length - 1)
    };
    function decryptedString(key, s) {
        var blocks = s.split(" ");
        var result = "";
        var i, j, block;
        for (i = 0; i < blocks.length; ++i) {
            var bi;
            if (key.radix == 16) {
                bi = biFromHex(blocks[i])
            } else {
                bi = biFromString(blocks[i], key.radix)
            }
            block = key.barrett.powMod(bi, key.d);
            for (j = 0; j <= biHighIndex(block); ++j) {
                result += String.fromCharCode(block.digits[j] & 255, block.digits[j] >> 8)
            }
        }
        ;
        if (result.charCodeAt(result.length - 1) == 0) {
            result = result.substring(0, result.length - 1)
        }
        ;
        return result
    };
    function BarrettMu(m) {
        this.modulus = biCopy(m);
        this.k = biHighIndex(this.modulus) + 1;
        var b2k = new BigInt();
        b2k.digits[2 * this.k] = 1;
        this.mu = biDivide(b2k, this.modulus);
        this.bkplus1 = new BigInt();
        this.bkplus1.digits[this.k + 1] = 1;
        this.modulo = BarrettMu_modulo;
        this.multiplyMod = BarrettMu_multiplyMod;
        this.powMod = BarrettMu_powMod
    };
    function BarrettMu_modulo(x) {
        var q1 = biDivideByRadixPower(x, this.k - 1);
        var q2 = biMultiply(q1, this.mu);
        var q3 = biDivideByRadixPower(q2, this.k + 1);
        var r1 = biModuloByRadixPower(x, this.k + 1);
        var r2term = biMultiply(q3, this.modulus);
        var r2 = biModuloByRadixPower(r2term, this.k + 1);
        var r = biSubtract(r1, r2);
        if (r.isNeg) {
            r = biAdd(r, this.bkplus1)
        }
        ;
        var rgtem = biCompare(r, this.modulus) >= 0;
        while (rgtem) {
            r = biSubtract(r, this.modulus);
            rgtem = biCompare(r, this.modulus) >= 0
        }
        ;
        return r
    };
    function BarrettMu_multiplyMod(x, y) {
        var xy = biMultiply(x, y);
        return this.modulo(xy)
    };
    function BarrettMu_powMod(x, y) {
        var result = new BigInt();
        result.digits[0] = 1;
        var a = x;
        var k = y;
        while (true) {
            if ((k.digits[0] & 1) != 0)result = this.multiplyMod(result, a);
            k = biShiftRight(k, 1);
            if (k.digits[0] == 0 && biHighIndex(k) == 0)break;
            a = this.multiplyMod(a, a)
        }
        ;
        return result
    };
    var biRadixBase = 2;
    var biRadixBits = 16;
    var bitsPerDigit = biRadixBits;
    var biRadix = 1 << 16;
    var biHalfRadix = biRadix >>> 1;
    var biRadixSquared = biRadix * biRadix;
    var maxDigitVal = biRadix - 1;
    var maxInteger = 9999999999999998;
    var maxDigits;
    var ZERO_ARRAY;
    var bigZero, bigOne;

    function setMaxDigits(value) {
        maxDigits = value;
        ZERO_ARRAY = new Array(maxDigits);
        for (var iza = 0; iza < ZERO_ARRAY.length; iza++)ZERO_ARRAY[iza] = 0;
        bigZero = new BigInt();
        bigOne = new BigInt();
        bigOne.digits[0] = 1
    };
    setMaxDigits(20);
    var dpl10 = 15;
    var lr10 = biFromNumber(1000000000000000);

    function BigInt(flag) {
        if (typeof flag == "boolean" && flag == true) {
            this.digits = null
        } else {
            this.digits = ZERO_ARRAY.slice(0)
        }
        ;
        this.isNeg = false
    };
    function biFromDecimal(s) {
        var isNeg = s.charAt(0) == '-';
        var i = isNeg ? 1 : 0;
        var result;
        while (i < s.length && s.charAt(i) == '0')++i;
        if (i == s.length) {
            result = new BigInt()
        } else {
            var digitCount = s.length - i;
            var fgl = digitCount % dpl10;
            if (fgl == 0)fgl = dpl10;
            result = biFromNumber(Number(s.substr(i, fgl)));
            i += fgl;
            while (i < s.length) {
                result = biAdd(biMultiply(result, lr10), biFromNumber(Number(s.substr(i, dpl10))));
                i += dpl10
            }
            ;
            result.isNeg = isNeg
        }
        ;
        return result
    };
    function biCopy(bi) {
        var result = new BigInt(true);
        result.digits = bi.digits.slice(0);
        result.isNeg = bi.isNeg;
        return result
    };
    function biFromNumber(i) {
        var result = new BigInt();
        result.isNeg = i < 0;
        i = Math.abs(i);
        var j = 0;
        while (i > 0) {
            result.digits[j++] = i & maxDigitVal;
            i = Math.floor(i / biRadix)
        }
        ;
        return result
    };
    function reverseStr(s) {
        var result = "";
        for (var i = s.length - 1; i > -1; --i) {
            result += s.charAt(i)
        }
        ;
        return result
    };
    var hexatrigesimalToChar = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z');

    function biToString(x, radix) {
        var b = new BigInt();
        b.digits[0] = radix;
        var qr = biDivideModulo(x, b);
        var result = hexatrigesimalToChar[qr[1].digits[0]];
        while (biCompare(qr[0], bigZero) == 1) {
            qr = biDivideModulo(qr[0], b);
            digit = qr[1].digits[0];
            result += hexatrigesimalToChar[qr[1].digits[0]]
        }
        ;
        return (x.isNeg ? "-" : "") + reverseStr(result)
    };
    function biToDecimal(x) {
        var b = new BigInt();
        b.digits[0] = 10;
        var qr = biDivideModulo(x, b);
        var result = String(qr[1].digits[0]);
        while (biCompare(qr[0], bigZero) == 1) {
            qr = biDivideModulo(qr[0], b);
            result += String(qr[1].digits[0])
        }
        ;
        return (x.isNeg ? "-" : "") + reverseStr(result)
    };
    var hexToChar = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f');

    function digitToHex(n) {
        var mask = 0xf;
        var result = "";
        for (i = 0; i < 4; ++i) {
            result += hexToChar[n & mask];
            n >>>= 4
        }
        ;
        return reverseStr(result)
    };
    function biToHex(x) {
        var result = "";
        var n = biHighIndex(x);
        for (var i = biHighIndex(x); i > -1; --i) {
            result += digitToHex(x.digits[i])
        }
        ;
        return result
    };
    function charToHex(c) {
        var ZERO = 48;
        var NINE = ZERO + 9;
        var littleA = 97;
        var littleZ = littleA + 25;
        var bigA = 65;
        var bigZ = 65 + 25;
        var result;
        if (c >= ZERO && c <= NINE) {
            result = c - ZERO
        } else if (c >= bigA && c <= bigZ) {
            result = 10 + c - bigA
        } else if (c >= littleA && c <= littleZ) {
            result = 10 + c - littleA
        } else {
            result = 0
        }
        ;
        return result
    };
    function hexToDigit(s) {
        var result = 0;
        var sl = Math.min(s.length, 4);
        for (var i = 0; i < sl; ++i) {
            result <<= 4;
            result |= charToHex(s.charCodeAt(i))
        }
        ;
        return result
    };
    function biFromHex(s) {
        var result = new BigInt();
        var sl = s.length;
        for (var i = sl, j = 0; i > 0; i -= 4, ++j) {
            result.digits[j] = hexToDigit(s.substr(Math.max(i - 4, 0), Math.min(i, 4)))
        }
        ;
        return result
    };
    function biFromString(s, radix) {
        var isNeg = s.charAt(0) == '-';
        var istop = isNeg ? 1 : 0;
        var result = new BigInt();
        var place = new BigInt();
        place.digits[0] = 1;
        for (var i = s.length - 1; i >= istop; i--) {
            var c = s.charCodeAt(i);
            var digit = charToHex(c);
            var biDigit = biMultiplyDigit(place, digit);
            result = biAdd(result, biDigit);
            place = biMultiplyDigit(place, radix)
        }
        ;
        result.isNeg = isNeg;
        return result
    };
    function biDump(b) {
        return (b.isNeg ? "-" : "") + b.digits.join(" ")
    };
    function biAdd(x, y) {
        var result;
        if (x.isNeg != y.isNeg) {
            y.isNeg = !y.isNeg;
            result = biSubtract(x, y);
            y.isNeg = !y.isNeg
        } else {
            result = new BigInt();
            var c = 0;
            var n;
            for (var i = 0; i < x.digits.length; ++i) {
                n = x.digits[i] + y.digits[i] + c;
                result.digits[i] = n % biRadix;
                c = Number(n >= biRadix)
            }
            result.isNeg = x.isNeg
        }
        ;
        return result
    };
    function biSubtract(x, y) {
        var result;
        if (x.isNeg != y.isNeg) {
            y.isNeg = !y.isNeg;
            result = biAdd(x, y);
            y.isNeg = !y.isNeg
        } else {
            result = new BigInt();
            var n, c;
            c = 0;
            for (var i = 0; i < x.digits.length; ++i) {
                n = x.digits[i] - y.digits[i] + c;
                result.digits[i] = n % biRadix;
                if (result.digits[i] < 0)result.digits[i] += biRadix;
                c = 0 - Number(n < 0)
            }
            if (c == -1) {
                c = 0;
                for (var i = 0; i < x.digits.length; ++i) {
                    n = 0 - result.digits[i] + c;
                    result.digits[i] = n % biRadix;
                    if (result.digits[i] < 0)result.digits[i] += biRadix;
                    c = 0 - Number(n < 0)
                }
                result.isNeg = !x.isNeg
            } else {
                result.isNeg = x.isNeg
            }
        }
        ;
        return result
    };
    function biHighIndex(x) {
        var result = x.digits.length - 1;
        while (result > 0 && x.digits[result] == 0)--result;
        return result
    };
    function biNumBits(x) {
        var n = biHighIndex(x);
        var d = x.digits[n];
        var m = (n + 1) * bitsPerDigit;
        var result;
        for (result = m; result > m - bitsPerDigit; --result) {
            if ((d & 0x8000) != 0)break;
            d <<= 1
        }
        ;
        return result
    };
    function biMultiply(x, y) {
        var result = new BigInt();
        var c;
        var n = biHighIndex(x);
        var t = biHighIndex(y);
        var u, uv, k;
        for (var i = 0; i <= t; ++i) {
            c = 0;
            k = i;
            for (j = 0; j <= n; ++j, ++k) {
                uv = result.digits[k] + x.digits[j] * y.digits[i] + c;
                result.digits[k] = uv & maxDigitVal;
                c = uv >>> biRadixBits
            }
            result.digits[i + n + 1] = c
        }
        ;
        result.isNeg = x.isNeg != y.isNeg;
        return result
    };
    function biMultiplyDigit(x, y) {
        var n, c, uv;
        result = new BigInt();
        n = biHighIndex(x);
        c = 0;
        for (var j = 0; j <= n; ++j) {
            uv = result.digits[j] + x.digits[j] * y + c;
            result.digits[j] = uv & maxDigitVal;
            c = uv >>> biRadixBits
        }
        result.digits[1 + n] = c;
        return result
    };
    function arrayCopy(src, srcStart, dest, destStart, n) {
        var m = Math.min(srcStart + n, src.length);
        for (var i = srcStart, j = destStart; i < m; ++i, ++j) {
            dest[j] = src[i]
        }
    };
    var highBitMasks = new Array(0x0000, 0x8000, 0xC000, 0xE000, 0xF000, 0xF800, 0xFC00, 0xFE00, 0xFF00, 0xFF80, 0xFFC0, 0xFFE0, 0xFFF0, 0xFFF8, 0xFFFC, 0xFFFE, 0xFFFF);

    function biShiftLeft(x, n) {
        var digitCount = Math.floor(n / bitsPerDigit);
        var result = new BigInt();
        arrayCopy(x.digits, 0, result.digits, digitCount, result.digits.length - digitCount);
        var bits = n % bitsPerDigit;
        var rightBits = bitsPerDigit - bits;
        for (var i = result.digits.length - 1, i1 = i - 1; i > 0; --i, --i1) {
            result.digits[i] = ((result.digits[i] << bits) & maxDigitVal) | ((result.digits[i1] & highBitMasks[bits]) >>> (rightBits))
        }
        ;
        result.digits[0] = ((result.digits[i] << bits) & maxDigitVal);
        result.isNeg = x.isNeg;
        return result
    };
    var lowBitMasks = new Array(0x0000, 0x0001, 0x0003, 0x0007, 0x000F, 0x001F, 0x003F, 0x007F, 0x00FF, 0x01FF, 0x03FF, 0x07FF, 0x0FFF, 0x1FFF, 0x3FFF, 0x7FFF, 0xFFFF);

    function biShiftRight(x, n) {
        var digitCount = Math.floor(n / bitsPerDigit);
        var result = new BigInt();
        arrayCopy(x.digits, digitCount, result.digits, 0, x.digits.length - digitCount);
        var bits = n % bitsPerDigit;
        var leftBits = bitsPerDigit - bits;
        for (var i = 0, i1 = i + 1; i < result.digits.length - 1; ++i, ++i1) {
            result.digits[i] = (result.digits[i] >>> bits) | ((result.digits[i1] & lowBitMasks[bits]) << leftBits)
        }
        ;
        result.digits[result.digits.length - 1] >>>= bits;
        result.isNeg = x.isNeg;
        return result
    };
    function biMultiplyByRadixPower(x, n) {
        var result = new BigInt();
        arrayCopy(x.digits, 0, result.digits, n, result.digits.length - n);
        return result
    };
    function biDivideByRadixPower(x, n) {
        var result = new BigInt();
        arrayCopy(x.digits, n, result.digits, 0, result.digits.length - n);
        return result
    };
    function biModuloByRadixPower(x, n) {
        var result = new BigInt();
        arrayCopy(x.digits, 0, result.digits, 0, n);
        return result
    };
    function biCompare(x, y) {
        if (x.isNeg != y.isNeg) {
            return 1 - 2 * Number(x.isNeg)
        }
        ;
        for (var i = x.digits.length - 1; i >= 0; --i) {
            if (x.digits[i] != y.digits[i]) {
                if (x.isNeg) {
                    return 1 - 2 * Number(x.digits[i] > y.digits[i])
                } else {
                    return 1 - 2 * Number(x.digits[i] < y.digits[i])
                }
            }
        }
        ;
        return 0
    };
    function biDivideModulo(x, y) {
        var nb = biNumBits(x);
        var tb = biNumBits(y);
        var origYIsNeg = y.isNeg;
        var q, r;
        if (nb < tb) {
            if (x.isNeg) {
                q = biCopy(bigOne);
                q.isNeg = !y.isNeg;
                x.isNeg = false;
                y.isNeg = false;
                r = biSubtract(y, x);
                x.isNeg = true;
                y.isNeg = origYIsNeg
            } else {
                q = new BigInt();
                r = biCopy(x)
            }
            return new Array(q, r)
        }
        ;
        q = new BigInt();
        r = x;
        var t = Math.ceil(tb / bitsPerDigit) - 1;
        var lambda = 0;
        while (y.digits[t] < biHalfRadix) {
            y = biShiftLeft(y, 1);
            ++lambda;
            ++tb;
            t = Math.ceil(tb / bitsPerDigit) - 1
        }
        ;
        r = biShiftLeft(r, lambda);
        nb += lambda;
        var n = Math.ceil(nb / bitsPerDigit) - 1;
        var b = biMultiplyByRadixPower(y, n - t);
        while (biCompare(r, b) != -1) {
            ++q.digits[n - t];
            r = biSubtract(r, b)
        }
        ;
        for (var i = n; i > t; --i) {
            var ri = (i >= r.digits.length) ? 0 : r.digits[i];
            var ri1 = (i - 1 >= r.digits.length) ? 0 : r.digits[i - 1];
            var ri2 = (i - 2 >= r.digits.length) ? 0 : r.digits[i - 2];
            var yt = (t >= y.digits.length) ? 0 : y.digits[t];
            var yt1 = (t - 1 >= y.digits.length) ? 0 : y.digits[t - 1];
            if (ri == yt) {
                q.digits[i - t - 1] = maxDigitVal
            } else {
                q.digits[i - t - 1] = Math.floor((ri * biRadix + ri1) / yt)
            }
            var c1 = q.digits[i - t - 1] * ((yt * biRadix) + yt1);
            var c2 = (ri * biRadixSquared) + ((ri1 * biRadix) + ri2);
            while (c1 > c2) {
                --q.digits[i - t - 1];
                c1 = q.digits[i - t - 1] * ((yt * biRadix) | yt1);
                c2 = (ri * biRadix * biRadix) + ((ri1 * biRadix) + ri2)
            }
            b = biMultiplyByRadixPower(y, i - t - 1);
            r = biSubtract(r, biMultiplyDigit(b, q.digits[i - t - 1]));
            if (r.isNeg) {
                r = biAdd(r, b);
                --q.digits[i - t - 1]
            }
        }
        ;
        r = biShiftRight(r, lambda);
        q.isNeg = x.isNeg != origYIsNeg;
        if (x.isNeg) {
            if (origYIsNeg) {
                q = biAdd(q, bigOne)
            } else {
                q = biSubtract(q, bigOne)
            }
            y = biShiftRight(y, lambda);
            r = biSubtract(y, r)
        }
        ;
        if (r.digits[0] == 0 && biHighIndex(r) == 0)r.isNeg = false;
        return new Array(q, r)
    };
    function biDivide(x, y) {
        return biDivideModulo(x, y)[0]
    };
    function biModulo(x, y) {
        return biDivideModulo(x, y)[1]
    };
    function biMultiplyMod(x, y, m) {
        return biModulo(biMultiply(x, y), m)
    };
    function biPow(x, y) {
        var result = bigOne;
        var a = x;
        while (true) {
            if ((y & 1) != 0)result = biMultiply(result, a);
            y >>= 1;
            if (y == 0)break;
            a = biMultiply(a, a)
        }
        return result
    };
    function biPowMod(x, y, m) {
        var result = bigOne;
        var a = x;
        var k = y;
        while (true) {
            if ((k.digits[0] & 1) != 0)result = biMultiplyMod(result, a, m);
            k = biShiftRight(k, 1);
            if (k.digits[0] == 0 && biHighIndex(k) == 0)break;
            a = biMultiplyMod(a, a, m)
        }
        return result
    };

    // Extend prototype for Date
    Date.prototype.Format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };

    // Ajax 模块
    var suffix = "";
    //接口路径
    var path = "/pews-gw/recom/recomList";
    //指定域名（可选）
    var domain = "" || window.location.origin;
    //开启debug模式,1为打印调用接口和错误和成功,0为关闭
    var DefaultdataType = "JSON";
    //全局超时时间
    var _timeout = 15000;

    var timer = null;

    var timer2 = null;

    var debug = 1;

    // Base Object
    var Base = {

        // RSA加密
        encrypts: function (str) {
            var exponent = "10001";
            var data = str.split("").reverse().join("");
            var publicKey = "d741760e63aab01eecf8f2237468da2c9a1f3dfb7de74d8bed23de8eb734b0771aa88ab3acfe3d223f24c057a37f8976cd592a5061fba10cfa212ac7448ef4ce9710a3c5ecb176ed10f55612de976edda1a000faf74923efa80645d0654588c1bc314a28879aeda2ed08b0b83c3582ef3de1fe9125aa67130cdfcd3128732461";

            setMaxDigits(130);

            var key = new RSAKeyPairApp(exponent, "", publicKey);
            var inputLen = data.length, encryptedData = "", offSet = 0, cache = "", i = 0, MAX_ENCRYPT_BLOCK = 128;

            // 对数据分段加密
            while (inputLen - offSet > 0) {
                if (inputLen - offSet > MAX_ENCRYPT_BLOCK) {
                    cache = encryptedString(key, data.substr(offSet, MAX_ENCRYPT_BLOCK));
                } else {
                    cache = encryptedString(key, data.substr(offSet, inputLen - offSet));
                }
                encryptedData = cache + encryptedData;
                i++;
                offSet = i * MAX_ENCRYPT_BLOCK;
            }

            return encryptedData;
        },


        // ajax 请求模块
        ajax: function (option, tips) {
            var GetSuccess = function (e) {
                console.log({
                    msg: domain + path + suffix + "接口调用成功",
                    respCode: e.respCode,
                    memo: e.memo,
                    data: e
                });
            };
            var GerError = function (e) {
                // console.log({
                //     msg: domain + path + suffix + "接口调用失败",
                //     status: e.status,
                //     data: e
                // });
                if( e.status != 0 ){
                    $.toast( e.status );
                } else {
                    $.toast( '网络断开，请检查！' );
                }
            };

            var timerFunc = function () {
                timer = setTimeout(function () {
                    $.hideIndicator();
                    clearTimeout(timer);
                }, 200)

                timer2 = setTimeout(function () {
                    $.hidePreloader();
                    clearTimeout(timer2);
                }, 600)
            };

            var o = option;

            // 重写Zepto AjaxSetting beforeSend Function;
            $.ajaxSettings.beforeSend = function () {
                if( !window.navigator.onLine) {
                    $.toast( '网络断开，请检查！' );
                    return;
                };

                if(o.hideLoading) {
                    return;
                };

                if(tips === undefined){
                    /*$.showIndicator();*/
                } else {
                    $.showPreloader(tips);
                };
            };


            var xhr = Zepto.ajax({
                    url: o.url || domain + path + suffix,
                    headers: {
                        Accept: "*/*"
                    },
                    type: o.type || "POST",
                    data: o.data,
                    timeout : o.timeout || _timeout,
                    dataType: o.dataType || DefaultdataType,
                    success: function (data) {
                        if (debug == 1) {
                            GetSuccess(data);
                        };
                        
                        if (o.success) {
                            o.success(data);
                        };

                        timerFunc()
                    },
                    error: function (data, textStatus) {
                        if (debug == 1) {
                            GerError(data);
                            xhr.abort();
                        };

                        if( textStatus == "timeout"){
                            xhr.abort();
                            //if( $('.timeout').length == 0) $('.content div').first().before('<div class="timeout">页面超时</div>');
                            $.toast('加载超时！');
                        };

                        if (o.error) {
                            o.error(data);
                        };

                        timerFunc();

                    },
                    complete: o.complete,
                    async: o.async || "flase"
                });
            return xhr;
        },

        // 取得url参数
        GetQueryString: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null)return decodeURI(r[2]);
            return null;
        },

        // 数字转大写
        ToDX: function (n) {
            if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) return "数据非法";
            var unit = "仟佰拾亿仟佰拾万仟佰拾元角分", str = "";
            n += "00";
            var p = n.indexOf('.');
            if (p >= 0) n = n.substring(0, p) + n.substr(p + 1, 2);
            unit = unit.substr(unit.length - n.length);
            for (var i = 0; i < n.length; i++) str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
            return str.replace(/零(仟|佰|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");
        },

        //
        dateWeek: function (datas) {
            var array = new Array();
            var date = datas;
            array = date.split('-');
            var ndate = new Date(array[0], parseInt(array[1] - 1), array[2]);
            var weekArray = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
            var weekDay = weekArray[ndate.getDay()];
            return weekDay
        },

        setNewDate: function (date) {
            var curDate = new Date(date);
            var day = 1;
            var newDate;
            if (curDate.getDay() == 0) {
                day = 1;
            } else if (curDate.getDay() == 6) {
                day = 2;
            } else if (curDate.getDay() == 5) {
                day = 3;
            } else {
                day = 1;
            }
            newDate = new Date(curDate.setDate(curDate.getDate() + day));
            return newDate.Format("yyyy-MM-dd");
        },

        // 正则验证
        reg: {
            pwdLength: /^.{6,20}$/,//6-20位密码
            lx3: /([a-zA-Z0-9\~\!\@\#\$\%\^\&\*\(\)\+\`\-\=\[\]\\\{ \}\|\;\'\:\"\,\.\/\<\>\?])\1\1/,//判断是否包含三个连续字符
            numStr: /[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/,//判断是否同时包含数字 字母
            isChinaName: /^[\u4E00-\u9FA5]{1,6}$/,//验证中文名称
            identityNo: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,//验证身份证
            bankCard: /^\d{16}|\d{19}$/,// 验证银行卡号
            phone: /^1[3|4|5|7|8]\d{9}$/, // 验证手机号
            decimal: /^\d+\.?(\d{1,2})?$/, // 验证两位小数和数字
            verifyImgCode: /^[0-9]{5}$/, // 图形验证为5位数字
            verifySmsCode: /^[0-9]{6}$/, // 短信验证为6位数字
            pwdReg0: /^(?![\\d]+$)(?![a-zA-Z]+$)(?![^\\da-zA-Z]+$).{6,20}$/, // 数字，大写字母，小写字母，特殊字符组合
            pwdReg1: /^[0-9]{6,20}$/ // 6~20纯数字
        },

        hideShare : function( config ){
            var _config = (Object.prototype.toString.call(config) === '[object Object]') ? config : console.log('参数必须是对象！');
            $.ajax({
                type: 'GET',
                async:false,
                url: _config.apiurl || window.location.origin + '/wechatgateweb/JsApiSignature.html',
                dataType: 'jsonp',
                data: '&appid=' + _config.appid + '&url=' + escape(window.location.href),
                jsonp:"callback",
                success: function(result){
                    wx.config({
                        debug: false,
                        appId: _config.appid,
                        timestamp: result.timestamp,
                        nonceStr: result.noncestr,
                        signature: result.signature,
                        jsApiList: [
                            'hideOptionMenu', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'showOptionMenu'
                        ]
                    });

                    wx.ready(function () {
                        wx.hideOptionMenu();
                    });
                }
            })
        },

        // 分享方法
        shareApp: function (jsonD, config) {

            var that = this;
            var interfaceUrl = window.location.origin;

            var _config = (Object.prototype.toString.call(config) === '[object Object]') ? config : console.log('参数必须是对象！');

            //分享到微信朋友圈
            var shareTimeD = {
                title: jsonD.desc,
                link: jsonD.link,
                imgUrl: jsonD.imgUrl,
                success: _config.success || function(){},
                cancel: _config.cancel || function(){}
            };

            //分享到微信好友
            var shareAppMessageD = {
                title: jsonD.title,
                desc: jsonD.desc,
                link: jsonD.link,
                imgUrl: jsonD.imgUrl,
                type: 'link',
                dataUrl: '',
                success: _config.success || function(){},
                cancel: _config.cancel || function(){}
            };

            // 分享到QQ好友 & QQ空间
            var shareQQ_QZoneD = {
                title: jsonD.title,
                desc: jsonD.desc,
                link: jsonD.link,
                imgUrl: jsonD.imgUrl,
                success: _config.success || function(){},
                cancel: _config.cancel || function(){}
            };


            if( _config.appid === undefined) {

                $.get(window.location.origin + "/front-gateway-web/weChatSign.action?time=" + new Date().getMilliseconds(), {"url": window.location.href}, function (result) {
                    result = JSON.parse(result);
                    wx.config({
                        debug: false,
                        appId: result.appId,
                        timestamp: result.timestamp,
                        nonceStr: result.nonceStr,
                        signature: result.signature,
                        jsApiList: [
                            'hideOptionMenu', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone', 'showOptionMenu'
                        ]
                    });
                });


                wx.ready(function () {
                    try {
                        wx.showOptionMenu();
                        wx.onMenuShareTimeline(shareTimeD);
                        wx.onMenuShareAppMessage(shareAppMessageD);
                        wx.onMenuShareQQ(shareQQ_QZoneD);
                        wx.onMenuShareQZone(shareQQ_QZoneD);
                    } catch (e) {
                        alert("noShareData");
                    }
                });

            } else {
                $.ajax({
                    type: 'GET',
                    async:false,
                    url: _config.apiurl || window.location.origin + '/wechatgateweb/JsApiSignature.html',
                    dataType: 'jsonp',
                    data: '&appid=' + _config.appid + '&url=' + escape(window.location.href),
                    jsonp:"callback",
                    success: function(result){
                        wx.config({
                            debug: false,
                            appId: _config.appid,
                            timestamp: result.timestamp,
                            nonceStr: result.noncestr,
                            signature: result.signature,
                            jsApiList: [
                                'hideOptionMenu', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone', 'showOptionMenu'
                            ]
                        });

                        wx.ready(function () {
                            try {
                                wx.showOptionMenu();
                                wx.onMenuShareTimeline(shareTimeD);
                                wx.onMenuShareAppMessage(shareAppMessageD);
                                wx.onMenuShareQQ(shareQQ_QZoneD);
                                wx.onMenuShareQZone(shareQQ_QZoneD);
                            } catch (e) {
                                alert("noShareData");
                            }
                        });

                        if (_config.callback && typeof _config.callback === 'function') _config.callback();
                    }
                })
            }; 
        },

        // 数据收集
        tracking : function(){
            var _this = this;
            var location = window.location.origin;
            var option = arguments[0];
            var _data = []
            var platform = "";
            var ua = navigator.userAgent.toLowerCase(); 
            var pathname = window.location.pathname.toLowerCase();
            var action = '';
            var _terminal = "H5";
            var $body = $('body');

            // 判断客户端环境
            // if( ua.match(/app/) ){
            //     _terminal = "H5_in_APP" + ( ua.split('|')[2] || "" );
            // } 
            // else if (_this.isInWeixin() ) {
            //     _terminal = "H5_in_Wechat"
            // } 
            // else {
            //     _terminal = "H5";
            // };  

            // 判断域名
            switch ( _this.getEnv()) {
                case 'localhost':
                case 'dev':
                    action = 'http://10.1.13.102:8081/trace/test.jsp';
                    break;
                case 'test':
                    action = 'http://tracetest.inleadfund.com.cn:8081/trace/sendLog.jsp';
                    break;
                case 'pre':
                case 'pro':
                    action = 'https://trace.leadfund.com.cn/trace/sendLog.jsp';
                    break;
                default:
                    action = 'https://trace.leadfund.com.cn/trace/sendLog.jsp';
            };

            if(Object.prototype.toString.call(option) !== '[object Object]') {
                console.log('参数需要为Object'); 
                return;
            };
            
            _data = [{
                terminal : option.terminal || 'H5',
                custId : option.custId || "未登录",
                loginType: option.custId ? 1 : 0, //登录方式; 0：游客; 1：普通登录
                tradeIDType: 99, // 交易账号类型; 没有传99
                sourPageKey: option.sourPageKey || 99, //访问来源; 没有传99
                type: "common",
                list: [{
                    opeAct: '',
                    browse:{
                        title: $('title').text(),
                        pageurl: window.location.origin + window.location.pathname,
                        pageName: pathname.substr(pathname.lastIndexOf('/') + 1),
                        custtime : window.pageInitTime
                    },
                    event:{
                        eventId: option.eventId, // fx.tiezi.share
                        eventName: option.eventName, // 页面名称-点击区域-功能
                        eventAct: option.eventAct || '未传事件类型', // 事件
                        eventOrder: new Date().getTime() //点击时间
                    }
                }]
            }];
            
            // if( $('#GAPOST').length <= 0){
            //     $body.append('<iframe id="GAPOST" name="GAPOST" style="display:none"></iframe><form method="post" action='+ action +' name="formNamer" id="formNamer" target="GAPOST" style="display:none"><input name="datas" type="hidden" value=""></form>');
            // };

            // $('#formNamer input').attr('value', JSON.stringify(_data) );

            // $('#formNamer').submit();

            this.ajax({
                url: action,
                data: {
                    datas : JSON.stringify(_data)
                },
                success: function (d) {}
            });
        },

        // 判断是否微信内
        isInWeixin : function() {
            var ua = navigator.userAgent.toLowerCase();
            if(ua.match(/MicroMessenger/i)=="micromessenger") {  
                return true;
            } else {  
                return false;
            }  
        },


        // 环境判断
        getEnv : function(){
            var host = window.location && window.location.host;
            if( host.search('localhost') != -1 || host.search('10') != -1 && host.search('10.1.1.25') == -1 && host.search('10.1.1.55') == -1  ){
                return 'localhost';
            } 
            else if ( host.search('dev') != -1 || host.search('10.1.1.25') != -1 ){
                return 'dev';
            }
            else if( host.search('test') != -1 || host.search('10.1.1.55') != -1 ) {
                return 'test';
            } 
            else if( host.search('pre') != -1 ) {
                return 'pre';
            } 
            else {
                return 'pro';
            }
        },


        // 上拉、下拉初始化
        Pull : {
            info: {
                "pullDownLable": "下拉加载更多",
                "pullingDownLable": "松开加载",
                "pullUpLable": "上拉加载更多",
                "pullingUpLable": "松开加载",
                "loadingLable": "加载中..."
            },

            init : function(parameter) {
                var _this = this;
                this.resizeTimer = null;
                this.downHeight = 40;
                this.animation = parameter.animation || "";
                this.flag = true;
                var wrapper = document.getElementById(parameter.id);
                this.wrappers = document.getElementById('linebg');
                
                if(wrapper.style && wrapper.style.height !== "100%") wrapper.style.height = "100%";

                if($('.scroller').length >=1 ) return;
                var div = document.createElement("div");
                div.className = "scroller";
                wrapper.appendChild(div);
                var scroller = wrapper.querySelector(".scroller");
                var list = wrapper.querySelector("#" + parameter.id + " > ul") || wrapper.querySelector("#" + parameter.id + " > div");
                scroller.insertBefore(list, scroller.childNodes[0]);
                var pullDown = document.createElement("div");
                pullDown.className = "pullDown";
                var pullDownLabel = document.createElement("div");
                pullDownLabel.className = "pullDownLabel";
                pullDown.appendChild(pullDownLabel);
                scroller.insertBefore(pullDown, scroller.childNodes[0]);

                var pullUp = document.createElement("div");
                pullUp.className = "pullUp";
                var pullUpLabel = document.createElement("div");
                pullUpLabel.className = "pullUpLabel";
                var content = document.createTextNode(_this.info.pullUpLable);
                pullUpLabel.appendChild(content);
                pullUp.appendChild(pullUpLabel);
                scroller.appendChild(pullUp);

                if( parameter.pullDownAction === undefined ) $('.pullDown').css('display','none');
                if( parameter.pullUpAction === undefined ) $('.pullUp').css('display','none');

                var pullDownEl = wrapper.querySelector(".pullDown");
                var pullDownOffset = pullDownEl.offsetHeight;
                var pullUpEl = wrapper.querySelector(".pullUp");
                var pullUpOffset = pullUpEl.offsetHeight;
                this.$pullUp = $('.pullUp');
                this.$pullDown = $('.pullDown');
                var $linebg = $('.linebg');
                //if( this.animation) {
                    //this.$pullUp.addClass('b1');
                    //this.$pullDown.addClass('b1');
                //};
                this.scrollIt(parameter, pullDownEl, pullDownOffset, pullUpEl, pullUpOffset);
            },
            
            scrollIt: function(parameter, pullDownEl, pullDownOffset, pullUpEl, pullUpOffset) {
                var _this = this;

                eval(parameter.id + "= new iScroll(parameter.id, {vScrollbar: true, fixedScrollbar: true, topOffset: pullDownOffset,onRefresh: function () {_this.onRelease(pullDownEl,pullUpEl,this);},onScrollMove: function () {_this.onScrolling(this,pullDownEl,pullUpEl,pullUpOffset,parameter.scrolling);},onScrollEnd: function () {_this.onPulling(pullDownEl,parameter.pullDownAction,pullUpEl,parameter.pullUpAction,this,parameter.scrollEnd);},animation:this.animation})");
                pullDownEl.querySelector('.pullDownLabel').innerHTML = this.animation ? "" : _this.info.pullDownLable;
                $("body").bind('touchmove', function(e) {
                    e.preventDefault();
                }, false);
            },

            onScrolling: function(e, pullDownEl, pullUpEl, pullUpOffset, scrolling) {
                var _this = this;

                if( scrolling) scrolling(e);

                if (e.y > -(pullUpOffset)) {
                    pullDownEl.id = '';
                    pullDownEl.querySelector('.pullDownLabel').innerHTML = this.animation ? "" : _this.info.pullDownLable;
                    e.minScrollY = -pullUpOffset;
                };

                if (e.y > 0) {
                    pullDownEl.classList.add("flip");
                    pullDownEl.querySelector('.pullDownLabel').innerHTML = this.animation ? "" : _this.info.pullingDownLable;
                    e.minScrollY = 0;
                };

                //this.$pullDown.css('height', 125 + Math.abs(e.y + 125) + 'px')
                //if( this.animation && e.y + pullUpOffset > 0 && ( e.y + pullUpOffset ) < 58) {

                    // [2,3,4,5,6].forEach(function(i){
                    //      _this.$pullDown.removeClass('b' + i);
                    // });

                    //this.$pullDown.css( 'height', ( pullUpOffset * 2 + e.y + 5 ) + 'px');
                    //this.$pullDown.addClass( 'b' + Math.floor(( e.y + pullUpOffset) / 10) );
                //};



                if( this.animation && e.y - e.maxScrollY <= 0 && e.y - e.minScrollY < 0) {

                    if( this.flag ) {
                        pullUpEl.querySelector('.pullUpLabel').innerHTML = "";
                        this.flag = false;
                    };

                    if( Math.abs(e.y - e.minScrollY ) <= 80) {

                        this.animations( e.y - e.minScrollY );

                    } else {

                        if( Math.abs(e.y - e.maxScrollY ) <= 80 ) {
                            this.animations( e.y - e.maxScrollY );
                        } else {
                            //_this.$pullUp.css('height', '0px');
                           // _this.$pullUp.addClass('b5');
                        }
                    }
                }; 


                if (e.scrollerH < e.wrapperH && e.y < (e.minScrollY - pullUpOffset) || e.scrollerH > e.wrapperH && e.y < (e.maxScrollY - pullUpOffset)) {
                    pullUpEl.classList.add("flip");
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = this.animation ? "" : _this.info.pullingUpLable;
                };
                
                if (e.scrollerH < e.wrapperH && e.y > (e.minScrollY - pullUpOffset) && pullUpEl.id.match('flip') || e.scrollerH > e.wrapperH && e.y > (e.maxScrollY - pullUpOffset) && pullUpEl.id.match('flip')) {
                    pullDownEl.classList.remove("flip");

                    pullUpEl.querySelector('.pullUpLabel').innerHTML = this.animation ? "" : _this.info.pullUpLable;
                };
            },

            animations : function( ScrollY ){
                var _this = this;

                _this.$pullUp.css('height', 105 + Math.abs(ScrollY) + 'px');

                // if( Math.floor(Math.abs(ScrollY) / 10) > 0){
                //     _this.$pullUp.addClass('b' + Math.floor( Math.abs(ScrollY) / 10) );
                // };
            },

            onRelease: function(pullDownEl, pullUpEl,e) {
                var _this = this;
                if (pullDownEl.className.match('loading')) {

                    pullDownEl.classList.toggle("loading");
                    if(this.animation) {
                        setTimeout(function(){
                            _this.$pullDown.removeClass('b6');
                            _this.$pullDown.removeClass('b7');
                        },500)

                        setTimeout(function(){
                            _this.wrappers.className = "linebg";
                        },800)
                        

                        this.$pullDown.css('height', '70px');
                        this.$pullDown.addClass('b7');
                    };
                    pullDownEl.querySelector('.pullDownLabel').innerHTML = this.animation ? "" : _this.info.pullDownLable;
                };

                if (pullUpEl.className.match('loading')) {
                    pullUpEl.classList.toggle("loading");
                    if(this.animation) {
                        this.flag = true;
                        this.$pullUp.removeClass('b6');
                        this.$pullUp.css('height', '50px');
                        //this.$pullUp.removeClass('b1');
                    };
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = _this.info.pullUpLable
                }

            },

            onPulling: function(pullDownEl, pullDownAction, pullUpEl, pullUpAction,e, scrollEnd) {
                var _this = this;

                if(scrollEnd) scrollEnd(e);

                if(this.animation && !pullUpEl.className.match('flip')) {
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = _this.info.pullUpLable;
                    //this.$pullUp.removeClass('b1');
                    this.flag = true;
                };
                
                if (pullDownEl.className.match('flip') /*&&!pullUpEl.className.match('loading')*/ ) {

                    pullDownEl.classList.add("loading");
                    pullDownEl.classList.remove("flip");
                    if(this.animation) {
                        this.wrappers.className = "";
                        this.$pullDown.css('height', '70px');
                        this.$pullDown.addClass('b6');
                    };
                    pullDownEl.querySelector('.pullDownLabel').innerHTML = this.animation ? "" : _this.info.loadingLable;
                    if (pullDownAction) pullDownAction();
                };

                if (pullUpEl.className.match('flip') /*&&!pullDownEl.className.match('loading')*/ ) {
                    pullUpEl.classList.add("loading");
                    pullUpEl.classList.remove("flip");

                    if(this.animation) {
                        this.$pullUp.css('height', '50px');
                        this.$pullUp.addClass('b6');
                    };
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = this.animation ? "" : _this.info.loadingLable;
                    if (pullUpAction) pullUpAction();
                }
            }
        },

        showSystemScrollBar : function(){
            $("body").unbind('touchmove');
        },

        hideSystemScrollBar : function(){
            $("body").bind('touchmove', function(e) {
                e.preventDefault();
            }, false);
        }
    };

    // 对象检测
    if (window.LeadBase) {
        for (var i in Base) {
            if (LeadBase[i] !== Base[i]) LeadBase[i] = Base[i];
        }
    } else {
        window.LeadBase = Base;
    }

})(Zepto);

/**
 * Native App & H5 通信
 */
;(function () {

    var mutual = {};

    mutual.loginStatus = 0;//用户登陆状态，0为未登录，1为登陆
    /*
     toBuyProduct 跳转基金详情页面
     type类型（基金0、固收1）
     id（基金id或者固收id）
     */
    // 已经废弃，现在统一使用toBuyProducts
    // mutual.toBuyProduct = function (type, id) {
    //     if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
    //         window.location.href = "tianshengwocai://jstoapp.toBuyProduct/" + type + "/" + id + "";
    //     } else if (navigator.userAgent.match(/android/i)) {
    //         window.jstoapp.toBuyProduct(type, id);
    //     }
    // };
    /*
     toCurInfo 跳转活期详情页面
     id（活期id）
     */
    // mutual.toCurInfo = function (id) {
    //     if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
    //         window.location.href = "tianshengwocai://jstoapp.toCurInfo/" + id + "";
    //     } else if (navigator.userAgent.match(/android/i)) {
    //         window.jstoapp.toCurInfo(id);
    //     }
    // };
    /*
     toHome 回到app首页
     */
    // mutual.appToLink2 = function () {
    //     if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
    //         window.location.href = "tianshengwocai://jstoapp.toHome()";
    //     } else if (navigator.userAgent.match(/android/i)) {
    //         window.jstoapp.toHome();
    //     }
    // };
    /*
     *isShare 是否分享
     *(id) 判断是否分享唯一标识
     */
    // mutual.isShare = function (id) {
    //     if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
    //         window.location.href = "tianshengwocai://jstoapp.isShare/" + id;
    //     } else if (navigator.userAgent.match(/android/i)) {
    //         window.jstoapp.isShare(id);
    //     }
    // };
    /*
     setTitle 传递标题
     *title(唯一标识)
     */
    // mutual.setTitle = function (title) {
    //     if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
    //         window.location.href = "tianshengwocai://jstoapp.setTitle/" + title;
    //     } else if (navigator.userAgent.match(/android/i)) {
    //         window.jstoapp.toTitle(title);
    //     }
    // }
    /*
     appShare app分享
     id（唯一标识Id）
     */
    // mutual.appShare = function (id) {
    //     if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
    //         window.location.href = "tianshengwocai://jstoapp.toShare/" + id;
    //     } else if (navigator.userAgent.match(/android/i)) {
    //         window.jstoapp.toShare(id);
    //     }
    // };
    /*
     appToResgiter跳转到注册页面
     */
    // mutual.appToResgiter = function () {
    //     if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
    //         window.location.href = "tianshengwocai://jstoapp.toResgiter()";
    //     } else if (navigator.userAgent.match(/android/i)) {
    //         window.jstoapp.toResgiter();
    //     }
    // };
    /*
     toCustomerServiceChat跳转到客服
     */
    // mutual.toCustomerServiceChat = function () {
    //     if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
    //         window.location.href = "tianshengwocai://jstoapp.toCustomerServiceChat()";
    //     } else if (navigator.userAgent.match(/android/i)) {
    //         window.jstoapp.toCustomerServiceChat();
    //     }
    // };
    /*
     toFeedback跳转到意见反馈
     */
    // mutual.toFeedback = function () {
    //     if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
    //         window.location.href = "tianshengwocai://jstoapp.toFeedback()";
    //     } else if (navigator.userAgent.match(/android/i)) {
    //         window.jstoapp.toFeedback();
    //     }
    // };
    /*
     判断是否安装app
     未安装app跳转到下载页面
     安装app直接打开app
     */
    mutual.verify = function () {
        var ios_appUrl = "tianshengwocai://jstoapp.toHome()";
        var android_appUrl = "tianshengwocai://jstoapp.toHome/";
        var ua = navigator.userAgent;
        var wx = ua.indexOf("MicroMessenger");
        if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
            window.location = ios_appUrl;
        } else if (navigator.userAgent.match(/android/i)) {
            window.location = android_appUrl;
        }

        setTimeout(function () {
            if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i) || wx != -1) {
                window.location = "http://a.app.qq.com/o/simple.jsp?pkgname=com.leadbank.lbf";
            } else if (navigator.userAgent.match(/android/i)) {
                window.location = "http://a.leadfund.com.cn/adnld/leadfund.apk?randNum=" + Math.random() * 10;
            }
        }, 2000);
    }
    /*
     *是否出现下载提示
     */
    mutual.isShowPrompt = function (terminal) {
        if (terminal == "APP" || terminal == "APP2") {

        } else {
            var shadow = '<section style="position: relative; z-index: 9999;" id=footShadow><ul style="height: 50px; width: 100%; background-color: rgba(0, 0, 0, 0.7); position: fixed; left: 0; bottom: 0;"><li><div class="footBgImg fl" style="float:left"><img style="width: 60px; padding: 0 10px;" src=images/icon.png></div><div style="color: #fff; font-size: 14px;" class="appFund fl"><p style="margin-top: 5px; line-height: 22px;" class=tswc>利得基金APP版</p><p class=fs12>买基金、选固收，费率低，收益高</p></div><div class="download fr" style="float: right;display: inline;"><a style="width: 60px; height: 24px; display: block; color: #fff; background-color: #dc3c14; font-size: 12px; line-height: 24px; text-align: center; border-radius: 5px; margin: 0 auto; position: relative; top:-30px; left: -20px;" href=http://a.app.qq.com/o/simple.jsp?pkgname=com.leadbank.lbf>立即下载</a></div><div id="footBannerClose"><img style="width: 16px; position: absolute; right: 7px; top: 5px;" id=closeClick src=images/close.png></div></ul></section>';
            var body = document.getElementsByTagName("body")[0];
            var node = document.createElement("div");
            var menu = document.getElementsByTagName("footer");
            if (!menu.length && !document.cookie.match("hasAppDonloadTip")) {
                node.innerHTML = shadow;
                body.appendChild(node.childNodes[0]);
            }
            $("#footBannerClose").on("click", function (e) {
                //document.getElementById("footShadow").style.display = "hidden";
                $("#footShadow").hide();
                //0代表AppTip关闭状态
                document.cookie = "hasAppDonloadTip=0";
            });
        }
    }
    /*
     * 3.4+
     * */
    var phoneType = navigator.userAgent;

    function setupWebViewJavascriptBridge(callback) {
        if (window.WebViewJavascriptBridge) {
            return callback(WebViewJavascriptBridge);
        }
        if (window.WVJBCallbacks) {
            return window.WVJBCallbacks.push(callback);
        }
        window.WVJBCallbacks = [callback];
        var WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function () {
            document.documentElement.removeChild(WVJBIframe)
        }, 0)
    }

    if (phoneType.match(/(iPhone|iPod|iPad);?/i)) {
        setupWebViewJavascriptBridge(function (bridge) {
            bridge.registerHandler('nativeCallJS', nativeCallJS);
        });
    }
    //ACTIVE
    function jsCallNative(jsontext) {
        if (phoneType.match(/(iPhone|iPod|iPad);?/i)) {
            setupWebViewJavascriptBridge(function (bridge) {
                bridge.callHandler('jsCallNative', jsontext);
            });
        } else if (phoneType.match(/android/i)) {
            var webjson = JSON.stringify(jsontext);
            prompt(webjson);
        }
    }

    

    //CALLBACK
    function nativeCallJS(jsontext) {
        if(mutual.getJsontext && typeof mutual.getJsontext === 'function') {
            mutual.getJsontext(jsontext);
            jsontext.parameter.token ? mutual.loginStatus = 1 : mutual.loginStatus = 0;
        } else {
            mutual.getJsontext = function(jsontext){}
        }
    };

    //open url
    function openURL(url) {
        mutual.jsCallNative({
            'nativeName': 'common.page.open',
            'parameter': {'url': url}
        })
    };

    //get url parameter
    mutual.getQueryString = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)return unescape(r[2]);
        return null;
    };
    mutual.jsCallNative = jsCallNative;
    mutual.nativeCallJS = nativeCallJS;
    //set title
    mutual.setTitles = function (title) {
        mutual.jsCallNative({
            'nativeName': 'common.webcontainer.title.set',
            'parameter': {'title': title}
        })
    }

    mutual.setFixTitles = function (title) {
        mutual.jsCallNative({
            'nativeName': 'common.webcontainer.title.set.fixed',
            'parameter': {'title': title}
        })
    }

    //
    mutual.closeWindow = function () { 
        mutual.jsCallNative({
            'nativeName': 'common.webcontainer.close.return',
            'parameter': {}
        })
    }
    //get token
    mutual.getToken = function () {
        mutual.jsCallNative({
            'nativeName': 'account.login.status.get',
            'parameter': {}
        })
    }
    //get user info 提供本人银行开户信息
    mutual.getUserInfo = function () {
        mutual.jsCallNative({
            'nativeName': 'account.bank.info.get',
            'parameter': {}
        })
    }
    //set up right botton
    mutual.setRightBotton = function (shareObjs) {
        mutual.jsCallNative({
            'nativeName': 'common.webcontainer.navigation.right',
            'parameter': {
                "items": shareObjs
            }
        })
    }
    //set up left botton
    mutual.setLeftBotton = function (leftBtnObjs) {
        mutual.jsCallNative({
            'nativeName': 'common.webcontainer.navigation.left',
            'parameter': {
                "items": leftBtnObjs
            }
        })
    }
    //clear left botton
    mutual.cleadLeftBtn = function(){
        mutual.jsCallNative({
            'nativeName': 'common.webcontainer.navigation.clearLeft',
            'parameter': {}
        })
    }
    //close web view
    mutual.closeWebWiew  = function(){
        mutual.jsCallNative({
            'nativeName': 'common.webcontainer.close.return',
            'parameter': {}
        })
    }
    /*
    * var shareObjs = [
     {
     "type": "share",
     "userInfo": ""
     },
     {
     "type": "fontsize",
     "userInfo": {
     "size": "0"
    }
     }
     ];
    * */
    //get app version
    mutual.getAppVersion = function () {
        mutual.jsCallNative({
            'nativeName': 'common.app.version.get',
            'parameter': {}
        })
    }

    //get phone deviceId
    mutual.getPhoneDeviceId = function () {
        mutual.jsCallNative({
            'nativeName': 'common.system.deviceid.get',
            'parameter': {}
        })
    }

    //get phone device version
    mutual.getPhoneDeviceVersion = function () {
        mutual.jsCallNative({
            'nativeName': 'common.device.version.get',
            'parameter': {}
        })
    }

    //常规活动专用
    mutual.isLoginStatusShare = function (recommendCode, totalPersons, recEquityAmount, newShareIds) {
        mutual.getStatus();
        setTimeout(function () {
            if (mutual.isLogin() || mutual.loginStatus == 1) {
                window.location.href = "friend_list.html?recommendCode=" + recommendCode + "&totalPersons=" + totalPersons + "&recEquityAmount=" + recEquityAmount + "&shareId=" + newShareIds;
            }
            else {
                mutual.openLogin();
            }
        }, 200);
    }
    //to fund product
    mutual.toBuyProducts = function (fundcode) {
        mutual.getStatus();
        setTimeout(function () {
            if (mutual.isLogin() || mutual.loginStatus == 1) {
                if (terminal == "APP" || terminal == "APP2") {
                    openURL('leadbank://page.ld/product.fund.buy?id=' + fundcode);
                } else {
                    window.location.href = "http://m.leadfund.com.cn/html/pubFund/detail.html?proId=" + fundcode;
                }
            }
            else {
                mutual.openLogin();
            }
        }, 200);
    }
    //to rank list
    mutual.toRanklist = function () {
        openURL('leadbank://page.ld/product.fund.ranklist');
    }
    //to T+0 list
    mutual.toTzerolist = function () {
        openURL('leadbank://page.ld/product.t0.list');
    }
    //to T+0 details
    mutual.toTzerodetails = function (fundId) {
        openURL('leadbank://page.ld/product.t0?id='+fundId);
    }
    //to broker asset
    mutual.toBrokerasset = function (fundId) {
        openURL('leadbank://page.ld/product.t0?id='+fundId);
    }
    //to customservice
    mutual.toCustomservice = function () {
        openURL('leadbank://page.ld/common.customservice');
    }
    //buy fund details
    mutual.toBuyFund = function (fundcode) {
        if (terminal == "APP" || terminal == "APP2") {
            openURL('leadbank://page.ld/product.fund?id=' + fundcode);
        } else {
            window.location.href = "http://m.leadfund.com.cn/html/pubFund/detail.html?proId=" + fundcode;
        }
    }

    mutual.toBuyLdb = function(fundcode){
        if(terminal=="APP"||terminal=="APP2"){
            openURL('leadbank://page.ld/product.fixedincome?id='+fundcode);
        }else{
            window.location.href = "http://m.leadfund.com.cn/html/lidebao/detail.html?productId="+fundcode;
        }
    }
    /*
     * to buy ZYF
     * */
    mutual.toBuyCurrent = function (fundcode) {
        if (terminal == "APP" || terminal == "APP2") {
            openURL('leadbank://page.ld/product.current?id=' + fundcode);
        } else {
            window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.leadbank.lbf";
        }
    }
    //open share page
    mutual.openSharePage = function (shareId,type) {
        openURL('leadbank://page.ld/common.share?id=' + shareId+'type='+type);
    }
    //open login
    mutual.openLogin = function () {
        openURL('leadbank://page.ld/account.login');
    }
    //open register
    mutual.openRegister = function () {
        openURL('leadbank://page.ld/account.register');
    }
    //open FixedinComeList 
    mutual.openFixedinComeList = function () {
        openURL('leadbank://page.ld/product.fixedincome.list');
    }
    //open T+0 page
    mutual.openT0 = function (id) {
        openURL('leadbank://page.ld/product.t0?id=' + id );
    }
    //get app login status
    mutual.getStatus = function () {
        if(window.navigator.userAgent.indexOf("leadbank|APP")!=-1) {
            mutual.jsCallNative({
                'nativeName': 'account.login.status.get',
                'parameter': {}
            })
        }
    }
    // 二次封装getStatus
    mutual.getStatusRun = function() {
        mutual.getStatus();
        setTimeout(function () {
            if (mutual.isLogin() || mutual.loginStatus == 1) {
            } else {
                mutual.openLogin();
            }
        }, 200);
    }

    // openURL 
    mutual.openURL = openURL;

    /*
     * wechat二次分享
     * */
    mutual.wechatShare = function (shareId) {
        LeadBase.ajax({
            url: window.location.origin+"/front-gateway-web/friendShare.action",
            data: {
                shareId: shareId
            },
            success: function (d) {
                var _d = JSON.parse(d);
                var jsonD = {
                    "title": _d.data.shareTitle,
                    "imgUrl": _d.data.twoCodeUrl,
                    "link": _d.data.h5Url,
                    "desc": _d.data.content
                }
                LeadBase.shareApp(jsonD,{});
            }
        });
    }

    /*获取页面url参数信息*/
    mutual.pagesInfos = {
        specialId: mutual.getQueryString("specialId"),
        recommendCode: mutual.getQueryString("recommendCode"),
        shareId: mutual.getQueryString("shareId"),
        terminal: mutual.getQueryString("terminal"),
        version: mutual.getQueryString("version"),
        specialId: mutual.getQueryString("specialId")
    };
    /*判断用户是否登陆*/
    mutual.isLogin = function () {
        var recommendCode = mutual.pagesInfos.recommendCode;
        if (recommendCode == null || recommendCode == "null" || typeof recommendCode == "undefined" || recommendCode == "''") {
            return false;
        }
        else {
            return true;
        }
    };

    window.mutual = mutual;

})();

//监测跟踪代码
// (function (i, s, o, g, r, a, m) {
//     i['GoogleAnalyticsObject'] = r;
//     i[r] = i[r] || function () {
//             (i[r].q = i[r].q || []).push(arguments)
//         }, i[r].l = 1 * new Date();
//     a = s.createElement(o),
//         m = s.getElementsByTagName(o)[0];
//     a.async = 1;
//     a.src = g;
//     m.parentNode.insertBefore(a, m)
// })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

// ga('create', 'UA-69109830-1', 'auto');
// ga('send', 'pageview');