// ==UserScript==
// @include *
// @run-at document-start
// ==/UserScript==

/*
 * Kafene-Pinboard-Style
 *
 * A nicer stylesheet for Pinboard.in
 * The width is more flexible to small screen sizes.
 * Some things have been shrunk down a bit to fit more,
 * colors adjusted to be prettier
 * Public/private links background colors are inverted, so public are gray.
 *
 * By kafene software <http://kafene.org/>
 */
window.addEventListener("load", function () {
    if (!/pinboard\.in/i.test(window.location.host)) {
        return;
    }

    /* Fix links in Opera */
    if (typeof(window.ef) == 'undefined') {
        window.ef = {
            form: null,
            clear: function () {}
        };
    }
    var selector = 'a[onclick]:not([onclick^="javascript:"])';
    var onclicks = document.querySelectorAll(selector);
    [].forEach.call(onclicks, function (link) {
        link.setAttribute(
            'href',
            'javascript:(function(){' + link.getAttribute('onclick') + '})();'
        );
    });

    var css = (function (heredoc) {
        return heredoc.toString()
            .replace(/^[^\/]+\/\*!?/, '')
            .replace(/\*\/[^\/]+$/, '');
    })(function () {/*
        * {
            box-sizing: border-box !important;
            max-width: 100% !important;
            font-size: 9pt;
        }
        body, #pinboard, #content {
            width: 100%;
            padding: 0;
            margin: 0;
            color: #333;
        }
        body {
            overflow-y: scroll;
            background: #fff;
        }
        .star {
            margin-left: -20px;
        }
        .bookmark:not(.private) .star {
            margin-left: -25px;
        }
        body, .display .description, .display a {
            font: 9pt/1.3em 'Segoe UI', 'Droid Sans', sans-serif;
        }
        a:not([onmouseover*='this.style']):hover {
            text-decoration: underline;
        }
        #banner {
            display: block;
            padding: 4px 10px;
            height: auto;
            width: 100%;
            border-bottom: 1px solid #ccc;
            background: #eee;
            margin-bottom: 2em;
        }
        #banner a:not(#pinboard_name), a.bookmark_title {
            color: #11a !important;
        }
        #banner a#pinboard_name {
            color: #333 !important;
        }
        #main_column, #profile_main_column {
            margin: 0;
            padding: 0 5% 0 5%;
            width: 65%;
            min-height: 500px !important;
            white-space: nowrap;
        }
        #main_column #bookmarks {
            white-space: normal;
        }
        .edit_checkbox {
            margin: 7px 0 0 -40px;
        }
        .display, .bookmark, #bulk_edit_box {
            padding: 0;
            width: 100%;
            margin: 0;
        }
        .bookmark {
            margin: 0.5em 0 0 0;
            padding: 0 0 0.5em 0;
            border-bottom: 1px solid #eee !important;
        }
        .bookmark.private {
            background: transparent !important;
            border: 0;
        }
        .bookmark:not(.private) {
            background: #eee;
            border: 1px solid #ccc !important;
            padding: 0.25em;
        }
        .bookmark:not(.private) .edit_links:after {
            margin: 0 0.25em;
            content: ' public ';
            color: #c66 !important;
            font-weight: 400;
            position: relative;
        }
        .edit_links a.edit {
            color: #999 !important;
        }
        a.bookmark_title {
            font-size: 110%;
            line-height: 100%;
            display: table;
            margin-bottom: 0.25em;
        }
        a.selected, a.unread {
            font-weight: bold;
        }
        a.tag {
            line-height: 1 !important;
            color: #990000 !important;
        }
        a.url_link {
            padding: 0 4px;
            border-radius: 3px;
        }
        .display a {
            line-height: 1;
        }
        .bookmark_count_box {
            white-space: nowrap;
        }
        a.bookmark_count {
            padding-right: 0.5em;
        }
        .display br, #edit_bookmark_form p, #timer {
            display: none !important;
        }
        .display .description a {
            color: #445588;
        }
        .display .description {
            margin: 0 0 0.25em 0;
            font-family: 'Consolas', 'Droid Sans Mono', monospace;
            line-height: 1.25em !important;
        }
        .display .description br {
            display: table !important;
        }
        .display a[href^='/u:']:not([href*='t:']) {
            color: #333;
        }
        .description blockquote {
            font-family: 'Consolas', 'Droid Sans Mono', monospace;
            margin: 0.5em;
            color: #333;
        }
        #right_bar, #tag_cloud {
            margin: 0;
            padding: 0;
            float: left;
            width: 30%;
        }
        #right_bar #tag_cloud {
            width: 100%;
            margin: 0;
        }
        .tag_table {
            margin: 0;
            width: 50%;
        }
        #tag_cloud a {
            line-height: 130% !important;
            font-size: 100% !important;
        }
        form[action='/add'], form[action='/add'] table {
            padding: 0.5em;
            width: 100%;
        }
        form[action='/add'] input[type='text'], form[action='/add'] textarea {
            width: 100%;
        }
        .pin-ac {
            margin-top: -2px;
        }
        #popup_header {
            margin: 0.25em 0.5em;
        }
        #edit_bookmark_form {
            width: 100%;
            background: #ddd;
            border: 1px solid #aaa;
            padding: 0.5em;
        }
        .edit_form_input {
            border: 1px solid #aaa !important;
            margin: 0;
            line-height: 120%;
        }
        #edit_form_checkboxes {
            margin: 0.5em 0;
        }
        textarea.edit_form_input {
            width: 100%;
            margin: 0.25em 0;
            height: 12em;
        }
        #footer {
            margin-bottom: 1em;
        }
        #main_column > form > table, textarea[name="note"] {
            width: 100%;
        }
        a.copy_link {
            display: none;
        }
        a.edit, a.delete {
            cursor: pointer;
        }
    */});
    var style = document.createElement('style');
    var appendTo = document.head || document.documentElement;
    style.innerHTML = css;
    appendTo.appendChild(style);
});
