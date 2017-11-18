// ==UserScript==
// @name         DuckDuckGo tweaks
// @namespace    http://kafene.org
// @version      0.0.3
// @license      MPL-2.0 <https://raw.githubusercontent.com/kafene/userjs/master/LICENSE>
// @downloadURL  https://raw.githubusercontent.com/kafene/userjs/master/scripts/duckduckgo.user.js
// @updateURL    https://raw.githubusercontent.com/kafene/userjs/master/scripts/duckduckgo.user.js
// @match        *://duckduckgo.com/*
// @match        *://www.duckduckgo.com/*
// @grant        none
// @noframes
// ==/UserScript==

/* Press "g" => focus search box and append "!" */
document.addEventListener("keydown", function (event) {
    const searchField = document.querySelector("#search_form_input, #search_form_input_homepage");

    if (!searchField) {
        return;
    }

    if (document.activeElement) {
        if (document.activeElement === searchField) {
            return;
        }
        if (document.activeElement.isContentEditable) {
            return;
        }
        if (/^(textarea|input|select|option)$/i.test(document.activeElement.nodeName)) {
            return;
        }
    }

    if (event.key === '\\' || event.key === 'g') {
        event.preventDefault();
        event.stopPropagation();
        searchField.value = searchField.value.replace(/ \!$/, '') + " !";
        const len = searchField.value.length;
        searchField.setSelectionRange(len, len);
        searchField.focus();
    }
});

/* Add some extra links under the search input field. */
(function duckbar_extras() {
    var duckbar = document.querySelector("#duckbar > .zcm");
    var searchField = document.querySelector("#search_form_input");

    if (!duckbar || !searchField) {
        return;
    }

    const createDuckbarLink = function (linkText, urlOrOnClickHandler) {
        const item = document.createElement('li');
        item.className = 'zcm__item';
        const link = document.createElement('a');
        link.className = 'zcm__link';
        link.textContent = linkText;
        if (typeof urlOrOnClickHandler === 'function') {
            link.href = '#';
            link.addEventListener('click', urlOrOnClickHandler);
        } else {
            link.href = urlOrOnClickHandler.toString();
        }
        item.appendChild(link);
        return item;
    };

    const createDuckbarSeparator = function () {
        const separator = document.createElement('span');
        separator.className = 'zcm__sep--h sep--before';
        return separator;
    };

    duckbar.appendChild(createDuckbarSeparator());

    duckbar.appendChild(createDuckbarLink('Google', function (event) {
        event.preventDefault();
        event.stopPropagation();

        const url = new URL("https://encrypted.google.com/search");
        url.searchParams.set("q", searchField.value);

        url.searchParams.set("ie", "utf8");     // specify input encoding as utf-8.
        url.searchParams.set("oe", "utf8");     // specify output encoding as utf-8.
        url.searchParams.set("safe", "off");    // disable "safe search" that excludes nsfw results.
        url.searchParams.set("num", "100");     // show 100 search results instead of the default 10.
        // url.searchParams.set("pws", "0");       // tell google not to personalize results based on your history.
        // url.searchParams.set("filter", "0");    // disable duplicate/similar results filtering.
        // url.searchParams.set("newwindow", "1"); // open search result links in a new window/tab.
        // url.searchParams.set("btnG", "Search"); // simulate a search from the google homepage.
        // url.searchParams.set("hl", "en");       // force interface language to english.
        // url.searchParams.set("gl", "us");       // set geolocation to united states (used for relevance calculation).

        window.location.href = url.href;
    }));

    duckbar.appendChild(createDuckbarLink("Maps", function (event) {
        event.preventDefault();
        event.stopPropagation();

        const url = new URL("https://encrypted.google.com/maps");
        url.searchParams.set('q', searchField.value);

        window.location.href = url.href;
    }, true));
}());
