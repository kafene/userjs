// ==UserScript==
// @name         reddit-no-np
// @version      1.0.1
// @description  Remove np links on reddit so you don't end up stuck browsing on np.reddit.com
// @namespace    http://kafene.org
// @match        *://*.reddit.com/*
// @run-at       document-start
// @grant        none
// @copyright    Copyright (c) 2014 kafene software <http://kafene.org/>
// @license      MIT <https://raw.githubusercontent.com/kafene/userscripts/mater/LICENSE>
// @downloadURL  https://raw.githubusercontent.com/kafene/userscripts/master/reddit-no-np.user.js
// @updateURL    https://raw.githubusercontent.com/kafene/userscripts/master/reddit-no-np.user.js
// ==/UserScript==

window.addEventListener('load', function () {
    console.info("No np.reddit links!!");

    var npLinks = document.querySelectorAll('a[href*="//np.reddit.com"]');
    if (npLinks) {
        [].forEach.call(npLinks, function (a) {
            a.hostname = 'www.reddit.com';
            a.protocol = 'https';
        });
    }

    document.querySelector('body').classList.add('subscriber');
});
