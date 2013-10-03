// ==UserScript==
// @include *
// @run-at document-start
// ==/UserScript==

/*
 * Gmail-Basic-HTML-Select-All
 *
 * Add a "check all" button in HTML-Gmail's spam and trash folders.
 *
 * By kafene software <http://kafene.org/>
 */
window.addEventListener("DOMContentLoaded", function () {
    if (/^mail\.google\./i.test(window.location.host)) {
        return;
    }

    var del = document.querySelector('input[type="submit"][value="Delete Forever"]');
    if (!del) {
        return;
    }

    var cbox = document.createElement('input');
    cbox.setAttribute('type', 'checkbox');

    cbox.addEventListener('click', function () {
        var boxes = document.querySelectorAll('input[type="checkbox"]');

        [].forEach.call(boxes, function (box) {
            if (box == cbox) { return; }
            if (box.checked) {
                box.removeAttribute('checked');
            } else {
                box.setAttribute('checked', true);
            }
        });

    });

    del.parentNode.insertBefore(cbox, del);
});
