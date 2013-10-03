// ==UserScript==
// @include *
// @run-at document-start
// ==/UserScript==

/*
 * Some extra CSS styles
 */
window.addEventListener('DOMContentLoaded', function () {
    // General Stylesheet additions
    // Use arrow cursor on all text except form fields
    var style = document.createElement('style');
    var head = document.head || document.documentElement;
    var body = document.body || document.documentElement;
    style.appendChild(document.createTextNode(' \
        body { cursor: default; } \
        input[type="text"], \
        input[type="password"], \
        input[type="email"] { \
            cursor: text; \
        } \
    '));
    head.appendChild(style);
    body.style.cursor = 'default';
});
