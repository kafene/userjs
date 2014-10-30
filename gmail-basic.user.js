// ==UserScript==
// @name         gmail-basic
// @description  some tweaks for Gmail's basic-HTML mode
// @version      0.1
// @namespace    http://kafene.org
// @copyright    2014 kafene software <http://kafene.org/>
// @match        https://mail.google.com/mail/u/0/h/*
// @run-at       document-end
// @grant        none
// @license      MIT <https://raw.githubusercontent.com/kafene/userscripts/mater/LICENSE>
// @downloadURL  https://raw.githubusercontent.com/kafene/userscripts/master/gmail-basic.user.js
// @updateURL    https://raw.githubusercontent.com/kafene/userscripts/master/gmail-basic.user.js
// ==/UserScript==

// Add a "check all" button in HTML-Gmail's spam and trash folders.
document.addEventListener('DOMContentLoaded', function () {
    var selects = document.querySelectorAll('form select[name=tact]');
    var checkboxes = document.querySelectorAll('form td input[type=checkbox][name=t]');

    [].forEach.call(selects, function (select) {
        var input = document.createElement('INPUT');
        input.type = 'checkbox';

        input.addEventListener('click', function () {
            [].forEach.call(checkboxes, function (checkbox) {
                var evt = document.createEvent('MouseEvent');
                evt.initEvent('click');
                checkbox.dispatchEvent(evt);
            });
        });

        select.parentNode.insertBefore(input, select);
    });
});

// Add unread count to title in Gmail Basic HTML mode
if (!window.frameElement) {
    document.addEventListener('DOMContentLoaded', function () {
        var originalTitle = document.title;
        var countRe = /Inbox\s+\((\d+)\)/;
        var titleRe = /\s*\((\d+)\)\s*/;

        var setUnreadTitle = function () {
            var m = countRe.exec(document.body.textContent);

            if (m && m[1]) {
                var count = '(' + parseInt(m[1], 10) + ') ';
                document.title = count + document.title.replace(titleRe, ' ');
            } else {
                document.title = originalTitle;
            }
        };

        // Update every 5 seconds
        window.setInterval(setUnreadTitle, 5000);
        setUnreadTitle();
    });
}
