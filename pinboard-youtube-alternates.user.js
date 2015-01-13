// ==UserScript==
// @name         pinboard-youtube-alternates
// @version      1.0.2
// @description  Adds alternative links to YouTube videos on Pinboard.in
// @namespace    http://kafene.org
// @match        *://*.pinboard.in/*
// @run-at       document-start
// @grant        none
// @license      MIT <https://raw.githubusercontent.com/kafene/userscripts/mater/LICENSE>
// @require      https://raw.githubusercontent.com/ded/domready/master/src/ready.js
// @downloadURL  https://raw.githubusercontent.com/kafene/userscripts/master/pinboard-youtube-alternates.user.js
// @updateURL    https://raw.githubusercontent.com/kafene/userscripts/master/pinboard-youtube-alternates.user.js
// ==/UserScript==

domready(function () {
    var links = document.querySelectorAll("a.bookmark_title[href^='https://www.youtube.com/watch']");
    var youtubeVideoIdRegex = /[?&]v=([^#&]+)/;

    [].forEach.call(links, function (link) {
        var matches = youtubeVideoIdRegex.exec(link.href);
        if (!matches || !matches[1]) { return; }
        var videoId = matches[1];

        var description = link.parentNode.querySelector('.description');
        if (!description) {
            description = document.createElement('div');
            description.className = 'description';
            link.parentNode.insertBefore(description, link.nextSibling);
        }

        description.insertAdjacentHTML("AFTERBEGIN",
            "<p class='youtube-alternatives'>Watch with... " +
            "<a href='http://fixyt.com/watch?v=" + videoId + "'>fixYT</a> &#8214; " +
            "<a href='http://toogl.es/#/view/" + videoId + "'>Toogles</a> &#8214; " +
            "<a href='http://viewpure.com/" + videoId + "'>ViewPure</a> &#8214; " +
            "<a href='http://quietube.com/v.php/http://www.youtube.com/watch?v=" + videoId + "'>quietube</a> &#8214; " +
            "<a href='http://tube.majestyc.net/?v=" + videoId + "'>Accessible Interface to YouTube</a>" +
            "</p>");
    });
});
