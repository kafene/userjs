// tweaks for pinboard.in
// requires jQuery and livequery (https://github.com/brandonaaron/livequery)
/(^|\.)pinboard\.in$/.test(window.location.hostname) && $(function () {
    var loc = window.location;
    var IS_NOTE_PAGE = ('notes.pinboard.in' === loc.hostname || /\/note\//.test(loc.pathname));

    // apply custom css
    $('<style id="pinboard-userstyle">'+ _getPinboardCss() +'</style>').appendTo('head');

    // Bold tags that start with `.` and `@`.
    $('div a[onclick*="add_tag"]:regex(/^[@.]/), #tag_cloud a.tag:regex(/^[@.]/)').css('font-weight', '800');

    // Add a link back to https://pinboard.in/ in the banner on notes.pinboard.in
    'notes.pinboard.in' === loc.hostname &&
    $('<div/>').css({'display': 'inline-block', 'font-size': '100%'})
        .append($('<a href="https://pinboard.in/">Pinboard.in</a>'))
        .append($('<span>&nbsp; | &nbsp;</span>'))
        .prependTo('#logo');

    // Check the 'use markdown' checkbox in notes pages
    IS_NOTE_PAGE && $('input[type=checkbox][name=use_markdown]').prop('checked', true);

    // On the "add bookmark" popup/page highlight assigned tags in the tag cloud,
    // and allow clicking on tags to toggle them in the tag input.
    /^\/add/.test(loc.pathname) && (function () {
        var input = document.querySelector('input[name=tags]');
        var removeTag = function (tag) {
            if ('altKey' in tag) { tag = tag.target.textContent.trim(); }
            input.value = getTags().filter(function (t) {return t !== tag}).join(' ');
            highlight();
        };
        var addTag = function (tag) {
            if ('altKey' in tag) { tag = tag.target.textContent.trim(); }
            input.value = $.unique(getTags().concat(tag)).join(' ');
            highlight();
        };
        var highlight = function () {
            $('a[onclick*=add_tag]').removeClass('add_tag_active');
            getTags().forEach(function (tag) {
                $('a[onclick*="add_tag(\''+tag+'\')"]').addClass('add_tag_active').click(removeTag);
            });
            $('a[onclick*=add_tag]:not(.add_tag_active)').click(addTag);
        };
        var getTags = function () { return input.value.trim().split(/[,\s]+/); };
        var tohl = function () { setTimeout(function () { highlight(); }); };
        input.addEventListener('change', tohl);
        input.addEventListener('keydown', function (e) { e.stopPropagation(); tohl(); });
        $(document).livequery('div.pin-ac', function (ac) { $(ac).mousedown(tohl); });
        $(document).livequery('a.suggested_tag', function (a) { tohl(); });
        highlight();
    })();
});

// A nicer stylesheet
function _getPinboardCss() {
    // experimental flexbox css to swap main column and right column
    /*
        $(function () {
            var $flexColumn = $('<div id="flex_column"></div>');
            var $rightColumn = $('<div id="right_column"></div>');
            $('#right_bar').detach().appendTo($rightColumn);
            $('#tag_cloud').detach().appendTo($rightColumn);
            $('#main_column').detach().appendTo($flexColumn);
            $rightColumn.appendTo($flexColumn);
            $flexColumn.appendTo($('#content'));
            // $('#right_bar').detach().appendTo($rightColumn);
            // $('#tag_cloud').detach().appendTo($rightColumn);
            // $('#content').prepend($rightColumn);
        });
        #flex_column { display: flex; }
        #main_column { order: 2; }
        #right_column { order: 1; padding-left: 5em; }
        #right_bar { width: 100%; display: block; float: none !important; width: 100% !important; }
        #tag_cloud { display: block; float: none !important; width: 100% !important; }
    */

    var css = (function () {/*
        * { box-sizing: border-box !important; max-width: 100% !important; }
        * { font-size: 9pt; text-rendering: optimizeLegibility; }
        body, #pinboard, #content { width: 100%; padding: 0; margin: 0; color: #333; }
        body { overflow-y: scroll; background: #fff; }
        .star { margin-left: -20px; }
        .bookmark:not(.private) .star { margin-left: -25px; }
        body { font: 9pt/1.3em "Segoe UI", "DejaVu Sans", "Droid Sans", "Liberation Sans", sans-serif; }
        .display .description { font: 9pt/1.3em "Segoe UI", "DejaVu Sans", "Droid Sans", "Liberation Sans", sans-serif; }
        .display a { font: 9pt/1.3em "Segoe UI", "DejaVu Sans", "Droid Sans", "Liberation Sans", sans-serif; }
        a:not([onmouseover*="this.style"]):hover { text-decoration: underline; }
        #banner { display: block; padding: 8px 20px; height: auto; width: 100%; }
        #banner { border-bottom: 1px solid #ccc; background: #eee; margin-bottom: 2em; }
        #banner a, a.bookmark_title:not(:visited) { color: #11a; }
        a.bookmark_title:visited { color: #3711aa }
        #banner a#pinboard_name { color: #11a !important; font-weight: bold; padding-right: 0.5em; }
        #banner a#pinboard_name + span, #banner a#pinboard_name + span a { font-size: 14px !important; }
        #banner a#pinboard_name + span a { color: #11a; }
        #banner a[href="/settings/privacy"]:hover { text-decoration: none; }
        #main_column, #profile_main_column { margin: 0; padding: 0 5% 0 5%; width: 65%; }
        #main_column, #profile_main_column { min-height: 500px !important; white-space: nowrap; }
        #main_column #bookmarks { white-space: normal; }
        .edit_checkbox { margin: 7px 0 0 -40px; }
        .display, .bookmark, #bulk_edit_box { padding: 0; width: 100%; margin: 0; }
        .bookmark { margin: 0.5em 0 0 0; padding: 0 0 0.5em 0; border-bottom: 1px solid #eee !important; }
        .bookmark.private { background: transparent !important; border: 0; }
        .bookmark:not(.private) { background: #eee; border: 1px solid #ccc !important; padding: 0.25em; }
        .bookmark:not(.private) .edit_links:after { margin: 0 0.25em; content: " public "; position: relative; }
        .bookmark:not(.private) .edit_links:after { color: #c66 !important; font-weight: 400; }
        .edit_links a.edit { color: #999 !important; }
        a.bookmark_title { font-size: 110%; line-height: 100%; display: table; margin-bottom: 0.25em; }
        a.selected, a.unread { font-weight: bold; }
        a.tag { line-height: 1 !important; color: #990000 !important; }
        a.url_link { padding: 0 4px; border-radius: 3px; }
        .display a { line-height: 1; }
        .bookmark_count_box { white-space: nowrap; }
        a.bookmark_count { padding-right: 0.5em; }
        .display br, #edit_bookmark_form p { display: none !important; }
        .display .description a { color: #445588; }
        .display .description { font-family: "Consolas", "Droid Sans Mono", monospace; }
        .display .description { margin: 0 0 0.25em 0; line-height: 1.25em !important; }
        .display .description br { display: table !important; }
        .display a[href^="/u:"]:not([href*="t:"]) { color: #333; }
        .description blockquote { font-family: "Consolas", "Droid Sans Mono", monospace; margin: 0.5em; color: #333; }
        #right_bar, #tag_cloud { margin: 0; padding: 0; float: left; width: 30%; }
        #right_bar #tag_cloud { width: 100%; margin: 0; }
        .tag_table { margin: 0; width: 50%; }
        #tag_cloud a { line-height: 130% !important; font-size: 100% !important; }
        form[action="/add"], form[action="/add"] table { padding: 0.5em; width: 100%; }
        form[action="/add"] input[type="text"], form[action="/add"] textarea { width: 100%; }
        .pin-ac { margin-top: -2px; }
        #popup_header { margin: 0.25em 0.5em; }
        #edit_bookmark_form { width: 100%; background: #ddd; border: 1px solid #aaa; padding: 0.5em; }
        .edit_form_input { border: 1px solid #aaa !important; margin: 0; line-height: 120%; }
        #edit_form_checkboxes { margin: 0.5em 0; }
        textarea.edit_form_input { width: 100%; margin: 0.25em 0; height: 12em; }
        #footer { margin-bottom: 1em; }
        #main_column > form > table, textarea[name="note"] { width: 100%; }
        a.copy_link { display: none; }
        a.edit, a.delete { cursor: pointer; }
        p.alert { display: block; margin: 1em auto; }
        #note_right_column { display: none; }
        a.add_tag_active { background-color: rgb(221, 238, 255); }
    */}).toString().match(/\/\*\s*([\s\S]*?)\s*\*\//m)[1];

    ('m.pinboard.in' === window.location.hostname) && (css += (function () {/*
        #main_column { padding-left: 5px; }
        #main_column, #profile_main_column { width: 100%; }
        #pinboard_name, #logo, .display a.url_link, .display a.when { display: none; }
        #searchbox { margin-right: 0; }
        #banner { padding: 3px 5px; margin-bottom: 5px; }
        textarea[name="description"] { height: 200px !important; }
        #edit_bookmark_form textarea { width: 100%; margin: 2px 0; padding: 2px 3px; }
        #edit_bookmark_form textarea { border: 1px solid #aaa !important; }
        #edit_bookmark_form input[type="text"], { width: 100%; margin: 2px 0; padding: 2px 3px; }
        #edit_bookmark_form input[type="text"], { border: 1px solid #aaa !important; }
    */}).toString().match(/\/\*\s*([\s\S]*?)\s*\*\//m)[1]);

    ('notes.pinboard.in' === window.location.hostname) && (css += (function () {/*
        #content table { width: 100%; }
        #logo { float: none; display: inline-block; font-size: 1.2em !important; }
        #banner { margin-bottom: 5px !important; height: auto !important; }
        #logo a { font-size: 100% !important; }
    */}).toString().match(/\/\*\s*([\s\S]*?)\s*\*\//m)[1]);

    return css;
}
