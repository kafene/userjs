// ==UserScript==
// @name         global-styles
// @namespace    139c4e7f1d4e
// @description  global stylesheets to apply to all sites
// @copyright    2011 kafene.org
// @license      MIT
// @include      http://*
// @include      https://*
// ==/UserScript==
(function(){
  /* Use arrow cursor on all text except form fields */
	window.addEventListener('load',function(evt){
		universal_addstyle(' \
			body { cursor:default; } \
			input[type=text], [type=password], [type=email] { cursor:text; } \
		');
	});
	/* Remove google play link from gmail, replace with Reader */
	if(window.location.href.indexOf('mail.google.com/mail')!=-1) {
		setTimeout(function(){try {
			var pl = document.querySelectorAll('li.gbt a.gbzt[href*="play.google.com"]')[0];
			pl.onclick = '';
			pl.href = 'https://www.google.com/reader/view/';
			pl.querySelector('span.gbts').textContent = 'Reader';
		} catch(err){}},2000);
	}
	function universal_addstyle(css){ "use strict";
		var style = document.createElement('style');
		style.appendChild(document.createTextNode(css));
		var h = document.getElementsByTagName('head');
		if(h.length>=1) { h[h.length-1].appendChild(style); }
	}
})();