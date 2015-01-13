// ==UserScript==
// @name         duckduckgo
// @version      1.0.3
// @description  Stuff for DuckDuckGo.com
// @namespace    http://kafene.org
// @match        *://*.duckduckgo.com/*
// @run-at       document-start
// @grant        none
// @license      MIT <https://raw.githubusercontent.com/kafene/userscripts/mater/LICENSE>
// @require      https://raw.githubusercontent.com/ded/domready/master/src/ready.js
// @downloadURL  https://raw.githubusercontent.com/kafene/userscripts/master/duckduckgo.user.js
// @updateURL    https://raw.githubusercontent.com/kafene/userscripts/master/duckduckgo.user.js
// ==/UserScript==

domready(function () {
    // Press "g" => focus search box and append "!"
    var skipRegex = /^(textarea|input|select|option)$/i;
    var searchSelector = "#search_form_input,#search_form_input_homepage";
    document.addEventListener("keydown", function (event) {
        var search = document.querySelector(searchSelector);
        if (!search) { return; }
        if (document.activeElement) {
            var ae = document.activeElement;
            var nn = ae.nodeName || "";
            if (ae === search || ae.isContentEditable || skipRegex.test(nn)) { return; }
        }
        var key = (event.keyCode || event.which || event.key);
        if (key && (key == 220 || key == 71 || key == "\\" || key == "g")) {
            event.preventDefault();
            event.stopPropagation();
            search.value += " !";
            var len = search.value.length;
            search.setSelectionRange(len, len);
            search.focus();
        }
    });

    // Add Google fallback link
    (function () {
        var duckbar = document.querySelector("#duckbar .zcm");
        if (!duckbar) { return; }
        var qs = "&num=100&filter=0&pws=0&safe=off&newwindow=1&spell=1&gl=us&hl=en&ie=utf8&oe=utf8";
        var li = document.createElement("li");
        var a = document.createElement("a");
        var q = document.querySelector("#search_form_input").value;
        var sep = document.createElement("span");
        li.classList.add("zcm__item");
        a.classList.add("zcm__link");
        sep.classList.add("zcm__sep--h");
        a.textContent = "Google";
        a.href = "https://encrypted.google.com/search?q="+encodeURIComponent(q)+qs;
        li.appendChild(a);
        duckbar.appendChild(sep);
        duckbar.appendChild(li);
    })();
});
