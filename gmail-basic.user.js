// ==UserScript==
// @name        Gmail-Basic
// @version     0.1
// @namespace   https://github.com/kafene/userscripts
// @copyright   2014 kafene software <http://kafene.org/>
// @license     MIT <http://kafene.github.io/MIT-LICENSE.txt>
// @description some tweaks for Gmail's basic-HTML mode
// @downloadURL https://raw.githubusercontent.com/kafene/userscripts/master/gmail-basic.user.js
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @match       *://mail.google.com/*
// @run-at      document-end
// ==/UserScript==

if ('mail.google.com' === window.location.hostname) {
    // Add a "check all" button in HTML-Gmail's spam and trash folders.
    $(function () {
        $('form select[name=tact]').before(
            $('<input type="checkbox"/>').click(function () {
                $('form td input[type=checkbox][name=t]').trigger('click');
            })
        );
    });

    // Add unread count to title in Gmail Basic HTML mode
    if (!window.frameElement) {
        $(function () {
            var originalTitle = document.title;
            var countRe = /Inbox\s+\((\d+)\)/;
            var titleRe = /\s*\((\d+)\)\s*/;
            var setUnreadTitle = function () {
                var m = countRe.exec(document.body.textContent);
                document.title = (m && m[1]) ?
                    '('+parseInt(m[1])+') '+document.title.replace(titleRe, ' ') :
                    originalTitle;
            };
            window.setInterval(setUnreadTitle, 5000);
            setUnreadTitle();
        });
    }
}
