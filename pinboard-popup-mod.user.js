// ==UserScript==
// @name         pinboard-popup-mod
// @version      1.0
// @description  Pinboard.in bookmarklet popup page enhancement
// @namespace    http://kafene.org
// @match        https://*.pinboard.in/add?*
// @grant        none
// ==/UserScript==

/*
 * On the "add bookmark" popup/page highlight assigned tags in the tag cloud,
 * and allow clicking on tags to toggle them in the tag input.
 */
document.addEventListener('DOMContentLoaded', function () {
    var style = document.createElement('style');
    style.textContent = 'a.add_tag_active{background-color:rgb(221,238,255) !important;}';
    (document.head || document.documentElement).appendChild(style);

    var matches = function (element, selector) {
        return (element instanceof window.Element) && (
            window.Element.prototype.matches ||
            window.Element.prototype.matchesSelector ||
            window.Element.prototype.oMatchesSelector ||
            window.Element.prototype.msMatchesSelector ||
            window.Element.prototype.mozMatchesSelector ||
            window.Element.prototype.webkitMatchesSelector
        ).call(element, selector);
    };

    var input = document.querySelector('input[name=tags]');

    var removeTag = function (tag) {
        input.value = getTags().filter(function (t) {
            return t !== tag;
        }).join(' ');

        highlight();
    };

    var addTag = function (tag) {
        input.value = getTags().concat(tag).reverse().filter(function (e, i, arr) {
            return arr.indexOf(e, i+1) === -1;
        }).reverse().join(' ');
        highlight();
    };

    var highlightNow = function () {
        [].forEach.call(document.querySelectorAll('a[onclick*="add_tag"]'), function (a) {
            a.classList.remove('add_tag_active');
        });

        getTags().forEach(function (tag) {
            var taggedLinks = document.querySelectorAll('a[onclick*="add_tag(\'' + tag + '\')"]');
            [].forEach.call(taggedLinks, function (a) {
                a.classList.add('add_tag_active');
                a.addEventListener('click', function (event) {
                    var tag = event.target.textContent.trim();
                    removeTag(tag);
                });
            });
        });

        var inactiveLinks = document.querySelectorAll('a[onclick*=add_tag]:not(.add_tag_active)');
        [].forEach.call(inactiveLinks, function (a) {
            a.addEventListener('click', function (event) {
                var tag = event.target.textContent.trim();
                addTag(tag);
            });
        });
    };

    var getTags = function () {
        return input.value.trim().split(/[,\s]+/);
    };

    var highlight = function () {
        setTimeout(function () {
            highlightNow();
        });
    };

    input.addEventListener('change', highlight);

    input.addEventListener('keydown', function (e) {
        e.stopPropagation();
        highlight();
    });

    var observer = new MutationObserver(function (mutations, observer) {
        mutations.forEach(function (mutation) {
            if (mutation.addedNodes) {
                [].forEach.call(mutation.addedNodes, function (node) {
                    if (matches(node, 'div.pin-ac')) {
                        node.addEventListener('mousedown', highlight);
                    } else if (matches(node, 'a.suggested_tag')) {
                        highlight();
                    }
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });

    highlightNow();
});
