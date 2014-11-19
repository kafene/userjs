// ==UserScript==
// @name         google-privacy
// @version      0.0.1
// @description  some minor privacy enhancements on google
// @namespace    http://kafene.org
// @copyright    2014 kafene software <http://kafene.org/>
// @match        *://*.google.com/*
// @run-at       document-start
// @grant        none
// @license      MIT <https://raw.githubusercontent.com/kafene/userscripts/mater/LICENSE>
// @downloadURL  https://raw.githubusercontent.com/kafene/userscripts/master/google-privacy.user.js
// @updateURL    https://raw.githubusercontent.com/kafene/userscripts/master/google-privacy.user.js
// ==/UserScript==

var fun_B4Dz7bjC = function () {
    'use strict';

    try {
        window.__defineGetter__('rwt', function() {
            return function() {return true;};
        });

        window.__defineGetter__('_gaUserPrefs', function() {
            return {ioo: function () {return true;}};
        });
    } catch (e) {}

    try {
        Object.defineProperty(window, 'rwt', {
            value: function() {return true;},
            writable: false,
            configurable: false
        });

        Object.defineProperty(window, '_gaUserPrefs', {
            value: {ioo: function () {return true;}},
            writable: false,
            configurable: false
        });
    } catch (e) {}
}

fun_B4Dz7bjC();
document.addEventListener('DOMContentLoaded', fun_B4Dz7bjC);
setTimeout(fun_B4Dz7bjC, 250);

window.addEventListener('load', function () {
    fun_B4Dz7bjC();

    var s = document.createElement('script');
    s.textContent = '(' + fun_B4Dz7bjC + ')();';
    s.onload = function () {setTimeout(function () {s.parentNode.removeChild(s);});};
    (document.head || document.documentElement).appendChild(s);

    [].forEach.call(document.querySelectorAll('a[href*="/url?q="]'), function (a) {
        //a.href = decodeURIComponent(a.href.replace('https://encrypted.google.com/url?q=', ''));
        a.href = decodeURIComponent(/\?q=([^&]+)/.exec(a.href)[1]);
    });

    [].forEach.call(document.querySelectorAll('a[href][onmousedown*="rwt"]'), function (a) {
        var m = /[?&]url=([^&]+)/i.exec(a.href);
        if (m && m[1]) { a.href = decodeURIComponent(m[1]); }
        a.removeAttribute('onmousedown');
        a.removeAttribute('onmouseover');
    });

    setTimeout(fun_B4Dz7bjC, 250);
});
