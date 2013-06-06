// ==UserScript==
// @name         global-styles
// @namespace    139c4e7f1d4e
// @description  global stylesheets to apply to all sites
// @copyright    2011 kafene.org
// @license      MIT
// @include      http://*
// @include      https://*
// ==/UserScript==
window.addEventListener('DOMContentLoaded', function() {
    /* Use arrow cursor on all text except form fields */
    var style = document.createElement('style');
    style.appendChild(document.createTextNode(' \
        body { cursor:default; } \
        input[type=text], [type=password], [type=email] { cursor:text; } \
    '));
    document.head.appendChild(style);
});
