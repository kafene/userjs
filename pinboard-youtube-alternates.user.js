// ==UserScript==
// @name         pinboard-youtube-alternates
// @version      1.0
// @description  Adds alternative links to YouTube videos on Pinboard.in
// @namespace    http://kafene.org
// @match        *://*.pinboard.in/*
// @grant        none
// @license      MIT <https://raw.githubusercontent.com/kafene/userscripts/mater/LICENSE>
// @downloadURL  https://raw.githubusercontent.com/kafene/userscripts/master/pinboard-youtube-alternates.user.js
// @updateURL    https://raw.githubusercontent.com/kafene/userscripts/master/pinboard-youtube-alternates.user.js
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function () {
    var links = document.querySelectorAll('a.bookmark_title[href^="https://www.youtube.com/watch"]');
    var regex = /[?&]v=([^#&]+)/;

    [].forEach.call(links, function (a) {
        var v = regex.exec(a.href);
        if (!v || !v[1]) { return; }

        var description = a.parentNode.querySelector('.description');
        if (!description) {
            description = document.createElement('div');
            description.className = 'description';
            a.parentNode.insertBefore(description, a.nextSibling);
        }

        description.insertAdjacentHTML('AFTERBEGIN',
            '<p>Watch with: ' +
            '<a href="http://fixyt.com/watch?v=' + v[1] + '" target="_blank">fixYT</a> &#8214; ' +
            '<a href="http://toogl.es/#/view/' + v[1] + '" target="_blank">Toogles</a> &#8214; ' +
            '<a href="http://tube.majestyc.net/?v=' + v[1] + '" target="_blank">Accessible Interface to YouTube</a>' +
            '</p>'
        );
    });
});
