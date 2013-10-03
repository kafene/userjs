// ==UserScript==
// @include *
// @run-at document-start
// ==/UserScript==

/*
 * Reddit - Always show the downvote button
 *
 * By kafene software <http://kafene.org/>
 */
window.addEventListener('DOMContentLoaded', function () {
    if (!/reddit\./i.test(window.location.host)) {
        return;
    }
    var style = document.createElement('style');
    var head = document.head || document.documentElement;
    style.appendChild(document.createTextNode(' \
        .arrow.down { \
            display: block !important; \
            visibility: visible !important;\
        } \
    '));
    head.appendChild(style);
});
