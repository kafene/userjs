// ==UserScript==
// @name         link-tweaks
// @version      1.0
// @description  Open External Links in New Tab, add rel=noreferrer, remove a.ping
// @namespace    http://kafene.org
// @include      *
// @require      https://code.jquery.com/jquery-2.1.1.min.js
// @require      https://cdn.rawgit.com/brandonaaron/livequery/master/jquery.livequery.min.js
// @run-at       document-start
// @grant        unsafeWindow
// @copyright    Copyright (c) 2014 kafene software <http://kafene.org/>
// @license      MIT <https://raw.githubusercontent.com/kafene/userscripts/mater/LICENSE>
// @downloadURL  https://raw.githubusercontent.com/kafene/userscripts/master/link-tweaks.user.js
// @updateURL    https://raw.githubusercontent.com/kafene/userscripts/master/link-tweaks.user.js
// ==/UserScript==

$(function () {
    $(document).livequery('a[href]', function (a) {
        if (a.ping) {
            a.ping = '';
            a.removeAttribute('ping');
        }

        if (!a.href || 0 !== a.href.indexOf('http') || a.host === window.location.host) {
            return;
        }

        var href = a.href,
            u = encodeURIComponent(a.href),
            rel = a.rel || '';

        a.rel = rel.trim().split(/\s+/).concat('noreferrer').join(' ');
        a.target = '_blank';
    });
});
