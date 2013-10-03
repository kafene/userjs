// ==UserScript==
// @include *
// @run-at document-start
// ==/UserScript==

/*
 * StreamPad or Yahoo MP3 Player
 * Add a media player automatically to pages with mp3 links.
 * It works as long as the links end in '.mp3'
 *
 * To use streampad player, replace
 *     http://webplayer.yahooapis.com/player.js
 * with
 *     http://o.aolcdn.com/art/merge?f=/_media/sp/sp-player.js&f=/_media/sp/sp-player-other.js&expsec=86400&ver=11
 */
window.addEventListener('DOMContentLoaded', function () {
    if (document.querySelectorAll('a[href$=".mp3"]').length > 0) {
        var head = document.head || document.documentElement;
        var s = document.createElement('script');
        s.setAttribute('src', 'http://webplayer.yahooapis.com/player.js');
        s.async = false;
        head.appendChild(s);
    }
});
