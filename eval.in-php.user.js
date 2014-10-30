// ==UserScript==
// @name         eval.in-php
// @version      1.0
// @description  Use PHP by default on https://eval.in/
// @namespace    http://kafene.org
// @include      https://eval.in/*
// @run-at       document-end
// @grant        none
// @copyright    Copyright (c) 2014 kafene software <http://kafene.org/>
// @license      MIT <https://raw.githubusercontent.com/kafene/userscripts/mater/LICENSE>
// @downloadURL  https://raw.githubusercontent.com/kafene/userscripts/master/eval.in-php.user.js.user.js
// @updateURL    https://raw.githubusercontent.com/kafene/userscripts/master/eval.in-php.user.js.user.js
// ==/UserScript==

window.addEventListener('load', function () {
    var selector = 'select[name=lang] optgroup[label=PHP] option:first-of-type';
    document.querySelector(selector).selected = true;

    var textarea = document.querySelector('textarea#code');

    if ('' === textarea.textContent.trim()) {
        textarea.textContent = '<?php\n\n';
    }

    textarea.focus();
});
