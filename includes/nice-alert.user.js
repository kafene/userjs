// ==UserScript==
// @include *
// @run-at document-start
// ==/UserScript==

/*
 * Nice Alert
 * From: http://userscripts.ru/js/nice-alert/
 * Also: http://userscripts.org/scripts/show/43780
 * Modified to close after a certain interval (5 seconds)
*/
(function () {
    var w = window.wrappedJSObject || window;
    if (w.alert.is_nice) {
        return;
    }
    w.alert = function alert (msg) {
        var css = " \
            #nice_alert { \
                font: 18px/20px 'Segoe UI', 'Droid Sans', sans-serif !important; \
                position: fixed !important; \
                top: 0 !important; \
                left: 50% !important; \
                padding: 0 !important; \
                margin: 0 0 0 -250px !important; \
                list-style-type: none !important; \
                float: left !important; \
                cursor: pointer !important; \
                text-align: left !important; \
                z-index: 9999 !important; \
            } \
            #nice_alert ALERTBOX { \
                background-color: InfoBackground !important; \
                color: InfoText !important; \
                margin: 0 !important; \
                float: right !important; \
                clear: both !important; \
                overflow: hidden !important; \
                font-size: 14px !important; \
                white-space: pre-wrap !important; \
                outline: 0 !important; \
                width: 500px !important; \
                border-bottom: 1px solid rgba(0, 0, 0, 0.3) !important; \
                box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.3); \
            } \
        ";
        var style = document.createElement('style');
        style.appendChild(document.createTextNode(css));
        if (document.head) {
            document.head.appendChild(style);
        }
        var na = document.getElementById('nice_alert')
              || document.createElement('ALERTGROUP');
        na.id = 'nice_alert';
        document.documentElement.appendChild(na);
        var goAway = function (e) {
            var t = e.target;
            if (t.tagName == 'ALERTBOX') {
                var h = t.clientHeight - 18;
                t.style.height = h + 'px';
                var i = 9;
                var closing = setInterval(function () {
                    i--;
                    t.style.opacity = i / 10;
                    t.style.paddingTop = (parseInt(t.style.paddingTop) - 1) + 'px';
                    t.style.paddingBottom = (parseInt(t.style.paddingBottom) - 1) + 'px';
                    var currentHeight = (parseInt(t.style.height) - h) / 10;
                    t.style.height = (currentHeight < 0 ? 0 : currentHeight) + 'px';
                    if (i < 1) {
                        t.style.display = 'none';
                        clearInterval(closing);
                    }
                }, 30);
            }
        };
        na.addEventListener('click', goAway, false);
        var cache = document.createElement('ALERTBOX');
        cache.style.padding = '0px 16px';
        cache.style.opacity = 0;
        cache.tabIndex = 0;
        (w.alert = function alert (msg) {
            w.alert.is_nice = 'Of course it is!';
            var box = cache.cloneNode(false);
            box.appendChild(document.createTextNode(msg));
            na.appendChild(box);
            var i = 1;
            var showing = setInterval(function () {
                box.style.opacity = i / 10;
                i++;
                box.style.paddingTop = (parseInt(box.style.paddingTop) + 1) + 'px';
                box.style.paddingBottom = (parseInt(box.style.paddingBottom) + 1) + 'px';
                if (i > 9) {
                    clearInterval(showing);
                }
            }, 30);
            setTimeout(function () {
                goAway({target: box});
            }, 5000);
        })(msg);
    };
})();
