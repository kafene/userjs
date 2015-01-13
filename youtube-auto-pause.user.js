// ==UserScript==
// @name         youtube-auto-pause
// @version      0.1.0
// @description  always pause youtube videos on page load
// @namespace    http://kafene.org
// @copyright    2014 kafene software <http://kafene.org/>
// @match        *://*.youtube.com/*
// @run-at       document-start
// @grant        none
// @license      MIT <https://raw.githubusercontent.com/kafene/userscripts/mater/LICENSE>
// @require      https://raw.githubusercontent.com/ded/domready/master/src/ready.js
// @downloadURL  https://raw.githubusercontent.com/kafene/userscripts/master/youtube-auto-pause.user.js
// @updateURL    https://raw.githubusercontent.com/kafene/userscripts/master/youtube-auto-pause.user.js
// ==/UserScript==

domready(function () {
    var buttons = document.querySelectorAll(".ytp-button-pause");
    [].forEach.call(buttons, function (button) {button.click()});
});
