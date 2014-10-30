// ==UserScript==
// @name         reddit-no-np
// @version      1.0
// @description  Remove np links on reddit so you don't end up stuck browsing on np.reddit.com
// @namespace    http://kafene.org
// @match        *://*.reddit.com/*
// @run-at       document-end
// @grant        none
// @copyright    Copyright (c) 2014 kafene software <http://kafene.org/>
// @license      MIT <https://raw.githubusercontent.com/kafene/userscripts/mater/LICENSE>
// @downloadURL  https://raw.githubusercontent.com/kafene/userscripts/master/reddit-no-np.user.js
// @updateURL    https://raw.githubusercontent.com/kafene/userscripts/master/reddit-no-np.user.js
// ==/UserScript==

(function () {
    var npLinks = document.querySelectorAll('a[href*="np.reddit.com"]');
    if (npLinks) {
        [].forEach.call(npLinks, function (a) {
            a.hostname = 'www.reddit.com';
            a.protocol = 'https';
        });
    }

    document.querySelector('body').classList.add('subscriber');
})();
