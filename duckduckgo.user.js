// ==UserScript==
// @name         duckduckgo
// @version      1.0
// @description  Stuff for DuckDuckGo.com
// @namespace    http://kafene.org
// @match        *://*.duckduckgo.com/*
// @grant        none
// @license      MIT <https://raw.githubusercontent.com/kafene/userscripts/mater/LICENSE>
// @downloadURL  https://raw.githubusercontent.com/kafene/userscripts/master/duckduckgo.user.js
// @updateURL    https://raw.githubusercontent.com/kafene/userscripts/master/duckduckgo.user.js
// ==/UserScript==

// Press "g" => focus search box and append "!"
document.addEventListener('DOMContentLoaded', function () {
    var searchFormInput = (
        document.getElementById('search_form_input') ||
        document.getElementById('search_form_input_homepage')
    );

    if (!searchFormInput) {
        return;
    }

    document.addEventListener('keydown', function (event) {
        if (document.activeElement) {
            var activeElement = document.activeElement;
            var activeNodeName = activeElement.nodeName ? activeElement.nodeName : '';

            if (activeElement.isContentEditable ||
                activeElement === searchFormInput ||
                /^textarea|input|select|option$/i.test(activeNodeName))
            {
                return;
            }
        }

        var key = (event.keyCode || event.which || event.key);
        if (!key) {
            return;
        }

        if (
            (220 === key || '220' === key || '\\' === key) ||
            (71 === key  || '71'  === key || 'g'  === key)
        ) {
            event.preventDefault();
            event.stopPropagation();
            searchFormInput.value += ' !';
            var len = searchFormInput.value.length;
            searchFormInput.setSelectionRange(len, len);
            searchFormInput.focus();
        }
    });
});

// Add Google fallback link
document.addEventListener('DOMContentLoaded', function () {
    var duckbar = document.querySelector('#duckbar .zcm');
    if (!duckbar) {
        return;
    }

    var li = document.createElement('li');
    var a = document.createElement('a');
    var q = document.querySelector('#search_form_input').value;
    var sep = document.createElement('span');

    li.classList.add('zcm__item');
    a.classList.add('zcm__link');
    sep.classList.add('zcm__sep--h');
    a.textContent = 'Google';
    a.href = 'https://encrypted.google.com/search?q=' + encodeURIComponent(q);
    li.appendChild(a);
    duckbar.appendChild(sep);
    duckbar.appendChild(li);
});
