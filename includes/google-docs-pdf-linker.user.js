// ==UserScript==
// @include *
// @run-at document-start
// ==/UserScript==

/*
 * Google-Docs-PDF-Linker
 *
 * Adds the text [PDF] after links ending in '.pdf', with a link to
 * the Google Docs PDF viewer.
 *
 * By kafene software <http://kafene.org/>
 */
window.addEventListener('DOMContentLoaded', function () {
    if (/^(drive|docs)\.google\./i.test(window.location.host)) {
        return;
    }
    /* Create a randomish ID to avoid infinite loop. */
    var id = ' c0341e5c2wf6-' + (Math.floor(Math.random() * 899) + 100);
    var re = /\.(docx?|xlsx?|pptx?|pdf|odt|ods|odf|ai|dxf|eps|xps|p?ps)$/i;
    var ep = 'http://docs.google.com/viewer?extsrc=1&url=';

    [].forEach.call(document.querySelectorAll('a[href]'), function (link) {
        var m = re.exec(link.href);
        if (link.className.indexOf(id) > 0 || !m || !m[1]) {
            return;
        }

        link.className += ' u'+id+'u';
        var a = '<a href="{1}" style="{2}" class="{3}" target="_blank">{4}</a>'
            .replace('{1}', ep + encodeURIComponent(link.href))
            .replace('{2}', 'font-weight:bold; position:relative; left:0.5em;')
            .replace('{3}', 'i'+id+'i')
            .replace('{4}', '['+m[1].toUpperCase()+']');
        link.insertAdjacentHTML('afterend', a);
    });
});
