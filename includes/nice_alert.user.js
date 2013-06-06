// ==UserScript==
// @name        Nice alert
// @namespace   http://userscripts.ru/js/nice-alert/
// @include     *
// @description Makes alert box suck less
// @copyright   2008+, Nikita Vasilyev (http://userscripts.org/scripts/show/43780)
// @version     1.3
// @licence     LGPL 3
// ==/UserScript==
(function() {
    if (window.alert.is_nice) { return }
    window.alert = function alert(msg) {
        var style = document.createElement("style");
        style.appendChild(document.createTextNode(" \
            #nice_alert { \
                font:18px/20px 'Segoe UI', 'Droid Sans', sans-serif !important; \
                position:fixed !important; \
                top:0 !important; \
                left:50% !important; \
                margin:0 0 0 -200px !important; \
                padding:0 !important; \
                list-style-type:none !important; \
                float:left !important; \
                cursor:pointer !important; \
                text-align:left !important; \
                z-index:9999 !important; \
            }\
            #nice_alert ALERTBOX {\
                background-color:InfoBackground !important; \
                color:InfoText !important; \
                outline:0 !important; \
                border-bottom:1px solid rgba(0, 0, 0, 0.3) !important; \
                margin:0 !important; \
                width:400px !important; \
                overflow:hidden !important; \
                text-align:center !important; \
                float:right !important; \
                clear:both !important; \
                font-size:14px !important; \
                white-space:pre-wrap !important; \
                box-shadow:0px 2px 8px rgba(0, 0, 0, 0.3); \
            }"
        ));
        document.head.appendChild(style);
        var nice_alert = document.getElementById('nice_alert') ||
            document.createElement('ALERTGROUP');
        nice_alert.id = 'nice_alert';
        document.documentElement.appendChild(nice_alert);
        nice_alert_fade = function(ev) {
            var t = ev.target;
            if (t.tagName != 'ALERTBOX') { return; }
            var h = t.clientHeight - 18;
            t.style.height = h + 'px';
            var i = 9;
            var closing = setInterval(function() {
                i--;
                t.style.opacity = i / 10;
                t.style.paddingTop = (parseInt(t.style.paddingTop) - 1) + 'px';
                t.style.paddingBottom = (parseInt(t.style.paddingBottom) - 1) + 'px';
                var currentHeight = parseInt(t.style.height) - h / 10;
                t.style.height = (currentHeight < 0 ? 0 : currentHeight) + 'px';
                if (i < 1) {
                    t.style.display = 'none';
                    clearInterval(closing);
                }
            }, 30);
        };
        nice_alert.addEventListener('click', nice_alert_fade, false);
        var cache = document.createElement('ALERTBOX');
        cache.style.padding = '0px 16px';
        cache.style.opacity = 0;
        cache.tabIndex = 0;
        (window.alert = function alert(msg) {
            window.alert.is_nice = 'Of course it is!';
            var box = cache.cloneNode(false);
            box.appendChild(document.createTextNode(msg));
            nice_alert.appendChild(box);
            var i = 1;
            var showing = setInterval(function() {
                box.style.opacity = i / 10;
                i++;
                box.style.paddingTop = (parseInt(box.style.paddingTop) + 1) + 'px';
                box.style.paddingBottom = (parseInt(box.style.paddingBottom) + 1) + 'px';
                if (i > 9) { clearInterval(showing); }
            }, 30);
            var fading = setTimeout(function() {
                /*
                var evt = document.createEvent("MouseEvents");
                var w = document.documentElement.clientWidth;
                var h = document.documentElement.clientHeight;
                var ctr = w / 2;
                var top = w - 3;
                evt.initMouseEvent("click", true, false, window, 0, 0, 0, ctr, top, false, false, false, false, 0, null);
                var ff = document.getElementById("nice_alert");
                ff.dispatchEvent(evt);
                */
                simulate(
                    box,
                    "click",
                    document.documentElement.clientWidth / 2,
                    document.documentElement.clientHeight - 3);
            }, 4000);
        })(msg);
    };
})();

/*
 * http://stackoverflow.com/questions/6157929/how-to-simulate-mouse-click-using-javascript
 */
function simulate(element, eventName) {
    var defaultOptions = {
        pointerX: 0,
        pointerY: 0,
        button: 0,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false,
        bubbles: true,
        cancelable: true
    };
    var eventMatchers = {
        'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
        'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
    };
    var extend = function(destination, source) {
        for (var property in source) {
            destination[property] = source[property];
        }
        return destination;
    };
    var options = extend(defaultOptions, arguments[2] || {});
    var oEvent, eventType = null;
    for (var name in eventMatchers) {
        if (eventMatchers[name].test(eventName)) {
            eventType = name;
            break;
        }
    }
    if (!eventType) {
        throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');
    }
    if (document.createEvent) {
        oEvent = document.createEvent(eventType);
        if (eventType == 'HTMLEvents') {
            oEvent.initEvent(eventName, options.bubbles, options.cancelable);
        } else {
            oEvent.initMouseEvent(
                eventName,
                options.bubbles,
                options.cancelable,
                document.defaultView,
                options.button,
                options.pointerX,
                options.pointerY,
                options.pointerX,
                options.pointerY,
                options.ctrlKey,
                options.altKey,
                options.shiftKey,
                options.metaKey,
                options.button,
                element
            );
        }
        element.dispatchEvent(oEvent);
    } else {
        options.clientX = options.pointerX;
        options.clientY = options.pointerY;
        var evt = document.createEventObject();
        oEvent = extend(evt, options);
        element.fireEvent('on' + eventName, oEvent);
    }
    return element;
}