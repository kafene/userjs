// ==UserScript==
// @name         Reddit: no "np" links
// @namespace    http://kafene.org
// @version      1.0.2
// @license      MPL-2.0 <https://raw.githubusercontent.com/kafene/userjs/master/LICENSE>
// @downloadURL  https://raw.githubusercontent.com/kafene/userjs/master/scripts/reddit-no-np-links.user.js
// @updateURL    https://raw.githubusercontent.com/kafene/userjs/master/scripts/reddit-no-np-links.user.js
// @match        *://*.reddit.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

window.addEventListener('load', function () {
    console.log('No np.reddit.com links!');

    // just redirect if we somehow landed on an np.reddit.com page
    if (window.location.hostname === 'np.reddit.com') {
        window.location.hostname = 'www.reddit.com';
        return;
    }

    // this assumes reddit has jQuery available...
    const $ = window.jQuery;

    if (document.documentElement.lang === 'np') {
        document.documentElement.lang = 'en';
    }

    $('body').addClass('subscriber');

    $('a').removeProp('tabindex');

    const fixLink = function (a) {
        if (a.hostname === 'np.reddit.com') {
            a.hostname = 'www.reddit.com';
        }
    };

    const fixLinksInChildren = function (elem) {
        if (elem instanceof Element) {
            elem.querySelectorAll('a').forEach(fixLink);
        }
    };

    const fixChildren = function (elem) {
        $('a', elem).each(fixLink);
        Array.from(elem.querySelectorAll('a')).forEach(fixLink);
    };

    // fix existing links.
    $('a').each(fixLink);

    // fix any injected links.
    const observer = new MutationObserver(function (mutations) {
        for (const mutation of mutations) {
            if (mutation.type === 'attributes') {
                fixLink(mutation.target);
            } else if (mutation.type === 'childList') {
                for (const node of mutation.addedNodes) {
                    fixLink(node);
                    fixLinksInChildren(node);
                }
            }
        }
    });
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeOldValue: true,
        attributeFilter: ['href'],
    });
});
