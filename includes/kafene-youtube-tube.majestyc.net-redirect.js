// ==UserScript==
// @name          kafene-youtube-tube.majestyc.net-redirect
// @namespace     ae73420c30c1
// @copyright     2012, kafene.org
// @license       MIT
// @include       http://*/*
// @include       https://*/*
// @match         http://*/*
// @match         https://*/*
// @exclude       widget://*
// @run-at        document-start
// ==/UserScript==
/*
window.addEventListener('load',function() {
    if (window.location.host.indexOf('youtube.') >= 0) return;
    var links = document.getElementsByTagName('a');
    for (var i in links) {
        try {
            var matches = links[i].href.match(/youtube\..+?v=(.+?)(\?|&|#|%|$)/i);
            if (typeof matches[1] !== 'undefined' && matches[1] !== '') {
                links[i].href = 'http://tube.majestyc.net/?v='+ matches[1] +'';
                links[i].setAttribute('target', '_blank');
            }
        } catch(a) {}
    }
});
*/