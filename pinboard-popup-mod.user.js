// ==UserScript==
// @name         pinboard-popup-mod
// @version      1.1.0
// @description  Pinboard.in bookmarklet popup page enhancements
// @namespace    http://kafene.org
// @match        https://*.pinboard.in/add?*
// @run-at       document-start
// @grant        none
// @license      MIT <https://raw.githubusercontent.com/kafene/userscripts/mater/LICENSE>
// @require      https://raw.githubusercontent.com/ded/domready/master/src/ready.js
// @downloadURL  https://raw.githubusercontent.com/kafene/userscripts/master/pinboard-popup-mod.user.js
// @updateURL    https://raw.githubusercontent.com/kafene/userscripts/master/pinboard-popup-mod.user.js
// ==/UserScript==

// On the "add bookmark" popup/page highlight assigned tags in the tag cloud,
// and allow clicking on tags to toggle them in the tag input.
domready(function () {
    // The tags input field
    var tagsInput = document.querySelector("input[name=tags]");

    // querySelectorAll to Array helper
    var qq = function (selector) {
        return [].slice.call(document.querySelectorAll(selector));
    };

    // Element matches selector
    var matches = function (elem, selector) {
        return elem && elem.matches && elem.matches(selector);
    };

    // Array unique
    var unique = function (array) {
        return array.reverse().filter(function (e, i, arr) {
            return -1 === arr.indexOf(e, i+1);
        }).reverse();
    };

    // Get tags currently in the tags input field
    var getTags = function () {
        return tagsInput.value.trim().split(/[,\s]+/).filter(function (v) { return !!v; });
    };

    var ltrim = function (val) {
        return val.replace(/^\s+/, "");
    };

    var setTags = function (newTags) {
        tagsInput.value = ltrim(unique(newTags).sort().join(" ") + " ");
    };

    var addTagOnClick = function (event) {
        addTag(event.target.textContent.trim());
    };

    var removeTagOnClick = function (event) {
        removeTag(event.target.textContent.trim());
    };

    var highlightAsync = function () {
        setTimeout(highlight);
    };
    
    var removeTag = function (tag) {
        setTags(getTags().filter(t => t !== tag));
        highlightAsync();
    };
    
    var addTag = function (tag) {
        setTags(getTags().concat(tag));
        highlightAsync();
    };

    var removeAddTagActiveClass = function (a) {
        a.classList.remove("add_tag_active");
    };

    var activateTag = function (a) {
        a.classList.add("add_tag_active");
        a.style.backgroundColor = "rgb(221,238,255)";
        a.removeEventListener("click", addTagOnClick, false);
        a.addEventListener("click", removeTagOnClick, false);
    };

    var deactivateTag = function (a) {
        a.classList.remove("add_tag_active");
        a.style.backgroundColor = "inherit";
        a.removeEventListener("click", removeTagOnClick, false);
        a.addEventListener("click", addTagOnClick, false);
    };

    // Highlight a given tag (for use in higlight() loop)
    var highlightTag = function (tag) {
        qq('a[onclick*="add_tag(\'' + tag + '\')"]').forEach(activateTag);
    };

    // Highlight links that need to be highlighted
    var highlight = function () {
        qq("a[onclick*=add_tag]").forEach(removeAddTagActiveClass);
        getTags().forEach(highlightTag);
        qq("a[onclick*=add_tag]:not(.add_tag_active)").forEach(deactivateTag);
        tagsInput.focus();
    };

    // Highlight when the input text changes
    tagsInput.addEventListener("change", highlightAsync, false);
    
    // Highlight when a key is pressed in the input (to catch tab key autocomplete)
    tagsInput.addEventListener("keydown", function (event) {
        event.stopPropagation();
        highlightAsync();
    }, false);

    // Highlight when an autocomplete tag or suggested tag is clicked
    document.addEventListener("mousedown", function (event) {
        if (matches(event.target, "div.pin-ac li,a.suggested_tag")) {
            highlightAsync();
        }
    }, false);

    // and... hightlight now (on load).
    highlightAsync();
});
