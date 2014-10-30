// ==UserScript==
// @name         pinboard-favicons
// @version      1.0
// @description  Add favicons to Pinboard.in
// @namespace    http://kafene.org
// @match        *://pinboard.in/*
// @run-at       document-start
// @grant        none
// @license      MIT <https://raw.githubusercontent.com/kafene/userscripts/mater/LICENSE>
// @downloadURL  https://raw.githubusercontent.com/kafene/userscripts/master/pinboard-favicons.user.js
// @updateURL    https://raw.githubusercontent.com/kafene/userscripts/master/pinboard-favicons.user.js
// ==/UserScript==

/*
 * Don't use this if you mind Google knowing which domains you have bookmarked.
 * I suggest not sending a referer header if you do use it.
 */

document.addEventListener('DOMContentLoaded', function () {
    (document.head || document.documentElement).appendChild(document.createElement('style')).textContent = '' +
        '.display-favicon-img {' +
            'vertical-align: bottom;' +
            'height: 16px;' +
            'width: 16px;' +
            'display: inline;' +
            'margin-right: 0.5em;' +
            'float: left;' +
        '}';

    [].forEach.call(document.querySelectorAll('#bookmarks a.bookmark_title'), function (a) {
        a.insertAdjacentHTML('AFTERBEGIN',
                             '<img src="https://www.google.com/s2/favicons?domain=' +
                             a.hostname + '" class="display-favicon-img" alt="" />');
    });
});
