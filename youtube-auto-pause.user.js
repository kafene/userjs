// ==UserScript==
// @name         youtube-auto-pause
// @version      0.2.0
// @description  always pause youtube videos on page load
// @namespace    http://kafene.org
// @copyright    2014 kafene software <http://kafene.org/>
// @include      http://www.youtube.com/*
// @include      https://www.youtube.com/*
// @include      http://youtube.com/*
// @include      https://youtube.com/*
// @include      http://www.youtube-nocookie.com/*
// @include      https://www.youtube-nocookie.com/*
// @include      http://youtube-nocookie.com/*
// @include      https://youtube-nocookie.com/*
// @run-at       document-start
// @grant        none
// @license      MIT <https://raw.githubusercontent.com/kafene/userscripts/mater/LICENSE>
// @require      https://raw.githubusercontent.com/ded/domready/master/src/ready.js
// @downloadURL  https://raw.githubusercontent.com/kafene/userscripts/master/youtube-auto-pause.user.js
// @updateURL    https://raw.githubusercontent.com/kafene/userscripts/master/youtube-auto-pause.user.js
// ==/UserScript==

domready(function () {
    var buttons = document.querySelectorAll(".ytp-button-pause");
    [].forEach.call(buttons, function (b) { b.click && b.click(); });
});

new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.addedNodes) {
            Array.from(mutation.addedNodes).forEach(function (node) {
                if (node && node.matches && node.matches(".ytp-button-pause")) {
                    setTimeout(function () { node.click && node.click(); });
                }
            });
        }
    });
}).observe(document, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
});
