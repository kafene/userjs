// ==UserScript==
// @name         youtube-auto-pause
// @version      0.0.1
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
    [].forEach.call(document.querySelectorAll("video"), function (video) {
        if (!video.paused) {
            video.pause();
        } else {
            video.addEventListener("play", (function () {
                var paused = false;
                return function () {
                    if (!paused) {
                        this.pause();
                        paused = true;
                    }
                };
            })());
        }
    });
});
