// ==UserScript==
// @include       http://*/*
// @include       https://*/*
// @exclude       widget://*
// @run-at        document-start
// ==/UserScript==
window.addEventListener('DOMContentLoaded', function() {
    if (/^(drive|docs)\.google\./.test(window.location.host)) return;
    var uid = ' c0341e5c2wf6-' + (Math.floor(Math.random() * 899) + 100);
    var re = /\.(docx?|xlsx?|pptx?|pdf|odt|ods|pages|ai|psd|tiff?|dxf|eps|xps|p?ps)$/i;
    var link, match, current, links;
    for (var i = 0; i < (links = document.getElementsByTagName('a')).length; i++) {
        if (links[i].href
        && (current = links[i]).className.indexOf(uid) < 0
        && (match = re.exec(current.href))
        && match[1]) {
            link = '<a href="'+ links[i].href +'" class="'+ uid +'-link">'+
                '<strong>['+ match[1].toUpperCase() +']</strong></a>';
            links[i].insertAdjacentHTML('afterend', ' '+ link);
            links[i].className += uid;
            links[i].setAttribute('target', '_blank');
            links[i].href = 'http://docs.google.com/viewer?extsrc=1&url='+ links[i].href;
        }
    }
});
