// ==UserScript==
// @include *
// @run-at document-start
// ==/UserScript==

/*
 * Duck Duck Go insta-bang
 * Hitting "g" focuses search and appends an !
 * Based on <http://userscripts.org/scripts/show/173110>
 */
window.addEventListener('DOMContentLoaded', function () {
    // @include http*://duckduckgo.com/*
    if (!/duckduckgo\.com$/i.test(window.location.host)) {
        return;
    }
    var sbox = document.getElementById("search_form_input")
            || document.getElementById("search_form_input_homepage");
    if (!sbox) {
        return;
    }
    document.addEventListener('keydown', function (e) {
        if (71 == e.keyCode && sbox != document.activeElement) {
            sbox.value += " !";
            var len = sbox.value.length;
            sbox.setSelectionRange(len, len);
            sbox.focus();
            e.stopPropagation();
            e.preventDefault();
        }
    });
});
