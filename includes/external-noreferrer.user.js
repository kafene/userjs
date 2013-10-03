// ==UserScript==
// @include *
// @run-at document-start
// ==/UserScript==

/*
 * External-NoReferrer
 *
 * Adds a "noreferrer" attribute to links that are not on the same host
 * as the current page. It depends on browser support for the "noreferrer"
 * attribute.
 *
 * By kafene software <http://kafene.org/>
 */
window.addEventListener('DOMContentLoaded', function () {
    var links = document.links || document.querySelectorAll('a[href]');

    [].forEach.call(links, function (link) {
        if (link.host == window.location.host) {
            return;
        }
        var rel = link.getAttribute('rel') || '';
        rel = rel.replace(/\s*noreferrer\s*/i, '');
        rel = (rel + ' noreferrer').trim();
        link.setAttribute("rel", rel);
    });

});
