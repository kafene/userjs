// ==UserScript==
// @name         better-google-bookmarks
// @namespace    51545d489c2d
// @copyright    2011 kafene.org
// @license      MIT
// @include      http://google.com/bookmarks/mark*
// @include      http://www.google.com/bookmarks/mark*
// @include      https://google.com/bookmarks/mark*
// @include      https://www.google.com/bookmarks/mark*
// @match        http://*.google.com/bookmarks/mark*
// @match        https://*.google.com/bookmarks/mark*
// @run-at       document-start
// ==/UserScript==
window.addEventListener('load',function(){"use strict";
	if(document.location.href.indexOf('google.com/bookmarks/mark')<0) { return 0; }
	// Set up some variables for later use.
	var submitbutton = document.getElementsByClassName('kd-button-submit');
	submitbutton = submitbutton[0];
	var all_links = document.getElementsByTagName('a');
	var labelbox = document.getElementById('bkmk_label_1');
	// var keyed = false;
	// Add tabindex numbers to form fields.
	var namebox = document.getElementById('bkmk_n');
	var locbox = document.getElementById('bkmk_u');
	var g_textarea = document.getElementsByTagName('textarea');
	g_textarea = g_textarea[0];
	var ti_list = [namebox,locbox,labelbox,g_textarea,submitbutton];
	if(ti_list && ti_list.length) {
		for(var i=0;i<ti_list.length;i++) {
			if(ti_list[i] && typeof ti_list[i]==='object') {
				ti_list[i].setAttribute('tabindex',i);
				ti_list[i].setAttribute('data-tindex',i);
			}
		}
	}
	// Hide the "cancel" and "see all bookmarks" buttons.
	var kdbuttons = document.getElementsByClassName('kd-button');
	if(kdbuttons&&kdbuttons.length) {
		for(var j=0;j<kdbuttons.length;j++) {
			if(typeof kdbuttons[i]==='object') {
				if(kdbuttons[j].innerHTML==='Cancel') {
					kdbuttons[j].style.display = 'none';
				}
				if(kdbuttons[j].innerHTML.substr(0,9)==='See all b') {
					kdbuttons[j].parentElement.style.display = 'none';
				}
			}
		}
	}
	// Hide the top banner
	var googlebar = document.getElementById('gb');
	if(googlebar && typeof googlebar==='object') {
		googlebar.setAttribute('style','display:none!important;');
	}
	//Hide the bottom/footer links
	if(all_links&&all_links.length) {
		for(var k=0;k<all_links.length;k++) {
			if(typeof all_links[k]==='object') {
				if(all_links[k].innerHTML==='About Google') {
					all_links[k].parentElement.style.display='none';
				}
			}
		}
	}
	// Let enter button submit the bookmark, except when using autocomplete.
	var kdtextbox = document.getElementsByClassName('kd-textbox');
	if(kdtextbox&&kdtextbox.length) {
		for(var l=0;l<kdtextbox.length;l++) {
			if(typeof kdtextbox[l]==='object') {
				if(kdtextbox[l].addEventListener) {
					kdtextbox[l].addEventListener('keypress',addSubmitOnReturnKeyPress);
				}
			}
		}
	}
	function addSubmitOnReturnKeyPress(evnt) {
		var seld = document.getElementsByClassName('selected');
		if((evnt.keyCode===13||evnt.which===13) && !seld.length) {
			try{ evnt.preventDefault(); } catch(e){}
			submitbutton.click();
		}
	}
	//Append ", " to the end of label input to make adding tag easier.
	if(labelbox && typeof labelbox.value==='string') {
		var lbboxval = labelbox.value;
		var lasttwo = lbboxval.substr(labelbox.value.length-2,2);
		var appendval = labelbox.value.length&&lasttwo!==', ' ? ', ' : '';
		labelbox.value = labelbox.value+appendval;
	}
	// Focus cursor to the end of label input using a couple methods...
	if(labelbox && typeof labelbox==='object') {
		labelbox.addEventListener('focus',function(){this.value=this.value;},false);
		labelbox.setSelectionRange(labelbox.value.length,labelbox.value.length);
		labelbox.focus();
	}
	// Add some CSS to make the dropdown selection more noticeable.
	var newstyle = '.selected { background:#3079ED; color:#fff !important; }';
	universal_addstyle(newstyle);
	// Make the google logo link back to bookmarks (in a _blank window)
	var giimages = document.getElementsByTagName('img');
	if(giimages&&giimages.length) {
		for(var m=0;m<giimages.length;m++) {
			if(giimages[i] && typeof giimages[i]==='object') {
				if(giimages[m].getAttribute('alt')==='Google') {
					giimages[m].addEventListener('click',openGoogleBookmarksWindow,false);
					giimages[m].setAttribute('style','cursor:pointer !important;');
					giimages[m].setAttribute('height','28');
					giimages[m].setAttribute('width','76');
					break;
				}
			}
		}
	}
	function openGoogleBookmarksWindow() {
		void(window.open('https://www.google.com/bookmarks/'));
	}
},false);
function universal_addstyle(css) {
	"use strict";
	var style = document.createElement('style');
	style.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName('head');
	if(heads.length>=1) {
		heads[heads.length-1].appendChild(style);
	}
}