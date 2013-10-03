// ==UserScript==
// @include *
// @run-at document-start
// ==/UserScript==

/*
 * Fix incorrectly disabled "Commit changes" button on GitHub
 * It is incorrectly disabled in Opera 12 for Linux at least.
 *
 * By kafene software <http://kafene.org/>
 */
window.addEventListener("load", function () {
    if (!/github\.com/i.test(window.location.host)) { return; }
    var button = document.querySelector('#submit-file');
    if (button) {
        button.removeAttribute('disabled');
    }
    button.addEventListener('mouseover', function () {
        button.removeAttribute('disabled');
    });
});
