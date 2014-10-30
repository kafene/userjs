// ==UserScript==
// @name         textarea-backup
// @version      1.0
// @description  Retains text entered into textareas.
// @namespace    http://kafene.org
// @include      *
// @run-at       document-end
// @grant        none
// @copyright    Copyright (c) 2014 kafene software <http://kafene.org/>
// @license      MIT <https://raw.githubusercontent.com/kafene/userscripts/mater/LICENSE>
// @downloadURL  https://raw.githubusercontent.com/kafene/userscripts/master/textarea-backup.user.js
// @updateURL    https://raw.githubusercontent.com/kafene/userscripts/master/textarea-backup.user.js
// ==/UserScript==

/*
 * Based on: http://userscripts.ru/js/textarea-backup/ by Nikita Vasilyev.
 */

window.addEventListener('load', function () {
    var textareas = document.getElementsByTagName('textarea');
    var storage = window.localStorage;

    [].forEach.call(textareas, function (textarea, index) {
        // Get a unique identifier for the textarea element
        var key = 'textarea-backup::' + window.location.pathname + '#';
        if (textarea.id) {
            key += textarea.id;
        } else if (textarea.name) {
            key += textarea.name;
        } else {
            key += ('' + index);
        }

        if (storage[key]) {
            var originalValue = textarea.value;
            var storedValue = storage[key];
            var state = 0;

            textarea.addEventListener('dblclick', function () {
                this.value = (state = !state) ? storedValue : originalValue;
            }, false);

            textarea.style.border = '2px solid red';
        }

        textarea.addEventListener('input', function (event) {
            // window.localStorage[key] = event.target.value;
            storage[key] = this.value;
        }, false);

        if (textarea.form) {
            textarea.form.addEventListener('submit', function () {
                delete storage[key];
            }, false);
        }
    });
});
