// ==UserScript==
// @name         link-tweaks
// @version      1.3.1
// @description  Open External Links in New Tab, add rel=noreferrer, remove a.ping
// @namespace    http://kafene.org
// @include      *
// @run-at       document-start
// @grant        none
// @copyright    Copyright (c) 2014 kafene software <http://kafene.org/>
// @license      MIT <https://raw.githubusercontent.com/kafene/userscripts/mater/LICENSE>
// @require      https://raw.githubusercontent.com/ded/domready/master/src/ready.js
// @downloadURL  https://raw.githubusercontent.com/kafene/userscripts/master/link-tweaks.user.js
// @updateURL    https://raw.githubusercontent.com/kafene/userscripts/master/link-tweaks.user.js
// ==/UserScript==

domready(function () {
    var isHostname = function (a, b) {
        var longer = a.length > b.length ? a : b;
        var shorter = longer === a ? b : a;
        return longer === shorter || longer.endsWith("." + shorter);
    };

    var handleLink = function (a) {
        a.removeAttribute("ping");
        if (a.href && a.href.startsWith("http") && !a.matches("[rel~=noreferrer]")) {
            a.rel = ("noreferrer " + (a.rel || "")).trim();
        }
        if (a.hostname && !isHostname(a.hostname, window.location.hostname)) {
            a.target = "_blank";
        }
    };

    document.addEventListener("mousedown", function (event) {
        var elem = event.target;
        if (!elem || !elem.matches) { return; }

        if (elem.matches("a")) {
            handleLink(elem);
        } else if (elem.form && elem.type === "submit") {
            if (event.ctrlKey || event.shiftKey || event.button === 1) {
                elem.form.target = "_blank";
            }
        }
    });
});
