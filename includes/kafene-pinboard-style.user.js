// ==UserScript==
// @name         kafene-pinboard-style
// @namespace    0c2982529348
// @copyright    2012, kafene.org
// @license      MIT
// @include      http://pinboard.in/*
// @include      https://pinboard.in/*
// @include      http://www.pinboard.in/*
// @include      https://www.pinboard.in/*
// @match        http://*.pinboard.in/*
// @match        https://*.pinboard.in/*
// @run-at       document-start
// ==/UserScript==
/*jshint multistr:true */
window.addEventListener('load',function(){ "use strict";
var css = " \
	* { box-sizing:border-box !important; max-width:100% !important; } \
	body, #pinboard, #content { width:100%; padding:0; margin:0; color:#333; } \
	body { overflow-y:scroll;  } \
	body, .display .description, .display a { font:9pt/1.3em 'Segoe UI', 'Droid Sans', sans-serif; } \
	* { font-size:9pt; } \
	a:not([onmouseover*='this.style']):hover { text-decoration:underline; } \
	#banner { \
		display:block; padding:4px 10px; height:auto; width:100%; \
		border-bottom:1px solid #ccc; background:#eee; margin-bottom:2em; \
	} \
	#banner a:not(#pinboard_name), a.bookmark_title { color:#11a !important; } \
	#banner a#pinboard_name { color:#333 !important; } \
	#main_column, #profile_main_column { margin:0; padding:0 5% 0 5%; width:65%; min-height:500px !important; } \
	.edit_checkbox { margin:7px 0 0 -40px; } \
	.display, .bookmark, #bulk_edit_box { padding:0; width:100%; margin:0; } \
	.bookmark { \
		margin:0.5em 0 0 0; padding:0 0 0.5em 0; \
		border-bottom:1px solid #eee !important; \
	} \
	.bookmark.private { background:transparent !important; border:0; } \
	.bookmark:not(.private) { background:#eee; border:1px solid #ccc !important; padding:0.25em; } \
	.bookmark:not(.private) .edit_links:after { \
		margin:0 0.25em; content:' public '; color:#c66 !important; \
		font-weight:400; position:relative; \
	} \
	.edit_links a.edit { color:#999 !important; } \
	a.bookmark_title { font-size:110%; line-height:100%; display:table; margin-bottom:0.25em; } \
	a.selected { font-weight:bold; } \
	a.unread { font-weight:bold; } \
	a.tag { line-height:1 !important; color:#990000 !important; } \
	a.url_link { padding:0 4px; border-radius:3px; } \
	.display a { line-height:1; } \
	.bookmark_count_box { white-space:nowrap; } \
	.display br { display:none !important; } \
	/*.display .description br { display:block !important; }*/ \
	.display .description a { color:#445588; } \
	.display .description { \
    margin:0 0 0.25em 0; font-family:'Consolas', 'Droid Sans Mono', monospace; \
    line-height:1.25em !important; white-space:pre-wrap; \
  } \
	.display a[href^='/u:']:not([href*='t:']) { color:#333; } \
	.description blockquote { \
    font-family:'Consolas', 'Droid Sans Mono', monospace; \
    margin:0.5em; color:#333333; \
  } \
	#right_bar, #tag_cloud { margin:0; padding:0; float:left; width:30%; } \
	#right_bar #tag_cloud { width:100%; margin:0; } \
	.tag_table { margin:0; width:50%; } \
	#tag_cloud a { line-height:130% !important; font-size:100% !important; } \
	form[action='/add'], form[action='/add'] table { padding:0.5em; width:100%; } \
	form[action='/add'] input[type='text'], form[action='/add'] textarea { width:100%; } \
	.pin-ac{ margin-top:-2px;} \
	#popup_header { margin:0.25em 0.5em; } \
	.star { display:none; } \
	#edit_bookmark_form { width:100%; background:#ddd; border:1px solid #aaa; padding:0.5em; } \
	.edit_form_input { border:1px solid #aaa !important; margin:0; line-height:120%; } \
	#edit_bookmark_form p { display:none; } \
	#edit_form_checkboxes { margin:0.5em 0; } \
	textarea.edit_form_input { width:100%; margin:0.25em 0; height:12em; } \
	#footer { margin-bottom:1em; } \
	";
	if(window.location.href.indexOf('pinboard.in')<0) { return false; }
	universal_addstyle(css);
},false);
function universal_addstyle(css){ "use strict";
	var style = document.createElement('style');
	style.appendChild(document.createTextNode(css));
	var h = document.getElementsByTagName('head');
	if(h.length>=1) { h[h.length-1].appendChild(style); }
}