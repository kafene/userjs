// ==UserScript==
// @include *
// @run-at document-start
// ==/UserScript==

/*
 * Google-More-Privacy
 *
 * By kafene software <http://kafene.org/>
 */
(function () {
    /*
     * Opt out of google analytics tracking (ioo = is opt-out?)
     */
    window['_gaUserPrefs'] = window['_gaUserPrefs'] || {};
    window['_gaUserPrefs']['ioo'] = function () { return true; };

    /*
     * Disables Google Analytics in Opera using the window.opera object.
     */
    var op = window.opera || opera;
    if (op) {
        op.defineMagicVariable('_gaUserPrefs', function (c) {
            return {ioo: function () { return true; }};
        }, null);
    }

    /*
     * Remove google click-tracking and disable referer on Google links.
     */
    window.addEventListener('DOMContentLoaded', function () {
        if (!/google\./.test(window.location.host)) { return; }
        /*
         * Disable window.rwt()
         */
        window['rwt'] = window.rwt = function () {};
        /*
         * Disable click tracking.
         */
        [].forEach.call(document.querySelectorAll('a[href]'), function (a) {
            /*
             * Prevent sending referrer when visting (if browser supports).
             */
            a.setAttribute('rel', 'noreferrer');

            /*
             * Replace click-tracking links with direct links.
             */
            var u = /&url=([^&]*)/.exec(a.href);
            if (u && u[1]) {
                a.href = decodeURIComponent(u[1]);
            }
            if (a.hasAttribute('onmousedown')) {
                a.removeAttribute('onmousedown');
            }
        });
    });
})();
