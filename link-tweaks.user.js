// ==UserScript==
// @name         link-tweaks
// @version      1.1
// @description  Open External Links in New Tab, add rel=noreferrer, remove a.ping
// @namespace    http://kafene.org
// @include      *
// @run-at       document-start
// @grant        none
// @copyright    Copyright (c) 2014 kafene software <http://kafene.org/>
// @license      MIT <https://raw.githubusercontent.com/kafene/userscripts/mater/LICENSE>
// @downloadURL  https://raw.githubusercontent.com/kafene/userscripts/master/link-tweaks.user.js
// @updateURL    https://raw.githubusercontent.com/kafene/userscripts/master/link-tweaks.user.js
// ==/UserScript==

 document.addEventListener('DOMContentLoaded', function () {
    var host = window.location.host;

    var handleLink = function (a) {
        if (a.ping) {
            a.ping = '';
            a.removeAttribute('ping');
        }

        if (!a.host || a.host !== host) {
            var rels = a.rel ? a.rel.trim().split(/\s+/) : [];
            a.rel = rels.concat('noreferrer').join(' ');
            a.target = '_blank';
        }
    };

    var observer = new MutationObserver(function (mutations, observer) {
        mutations.forEach(function (mutation) {
            if (mutation.addedNodes) {
                [].forEach.call(mutation.addedNodes, function (node) {
                    if (node instanceof HTMLAnchorElement) {
                        handleLink(node);
                    } else if (node.querySelectorAll) {
                        [].forEach.call(node.querySelectorAll('a'), handleLink);
                    }
                });
            }
        });
    });

    observer.observe(document, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });

    [].forEach.call(document.getElementsByTagName('a'), handleLink);
});

