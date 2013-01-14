// ==UserScript==
// @name         Textarea Backup Localstorage
// @author       Frans de Jonge (Frenzie)
// @version      2.0
// @namespace    http://extendopera.org/userjs/content/textarea-backup-localstorage
// @description  Retains text entered into textareas.
// @include       http://*
// @include       https://*
// ==/UserScript==
// This script is based on http://userscripts.org/scripts/show/42879,
// which is based on http://userscripts.org/scripts/show/7671
window.addEventListener('load',function(event) {
	var p, tabls_switch = true, menu_display = true, keypress_backup = true;
	var blur_backup = true, timed_backup = true, backup_interval = parseInt(10000,10);
	var keep_after_submission = true, restore_auto = false, ask_overwrite = false;
	var em_available = true, expire_days = parseInt(3,10), expire_hours = parseInt(6,10);
	var expire_minutes = parseInt(30,10), blackList = 'mail.google.com/*|lycos.com';
	blockedDomains = blackList.split('|');
	re = /(\w+):\/\/([^\:|\/]+)(\:\d*)?(.*\/)([^#|\?|\n]+)?(#.*)?(\?.*)?/i;
	arr = window.location.href.match(re);
	thisDomain = arr[2];
	thisDomain = thisDomain.split('.');
	thisDomain = thisDomain.reverse();
	for(var i=0;i<blockedDomains.length;i++) {
		theBlockedDomain = blockedDomains[i];
		theBlockedDomain = theBlockedDomain.split('.');
		theBlockedDomain = theBlockedDomain.reverse();
		for(m=0;m<=theBlockedDomain.length;m++) {
			if(theBlockedDomain[m]===undefined||theBlockedDomain[m]=='') {
				if(thisDomain[m]=='') continue; else break;
			}
			firstLetter = theBlockedDomain[m].substr(0,1);
			lastLetter = theBlockedDomain[m].substr(theBlockedDomain[m].length-1,1);
			if(theBlockedDomain[m].length>2&&firstLetter==='*'&&lastLetter==='*') {
				if(thisDomain[m].indexOf(theBlockedDomain[m].replace(/\*/g,''))==-1) break;
			}
			else if(theBlockedDomain[m]!='*'&&/\*/.test(theBlockedDomain[m])) {
				thisDomainSplit = theBlockedDomain[m].split('*');
				if(thisDomainSplit[0]!=thisDomain[m].substring(0,thisDomainSplit[0].length)
				||thisDomainSplit[1]!=thisDomain[m].substring(thisDomain[m].length-thisDomainSplit[1].length,thisDomain[m].length+1))
					break;
			}
			else if(theBlockedDomain[m]!='*'&&thisDomain[m]!=theBlockedDomain[m]) break;
		}
		if(m>=theBlockedDomain.length) {
			p = 'false|false|false|false|99999999999|false|false|false|false|0|0|1';
			p = p.split('|');
			tabls_switch = false;
			break;
		}
	}
	if(!tabls_switch) return;
	var myLocalStorage;
	if(typeof unsafeWindow!='undefined') myLocalStorage = unsafeWindow.localStorage;
	else myLocalStorage = window.localStorage;
	var expiry_timespan = (((expire_days*24)+expire_hours)*60+expire_minutes)*60000;
	function getAbsolutePosition(element,direction) {
		var ele=element, dir=direction, pos, tempEle;
		(dir=='x') ? pos=ele.offsetLeft : pos=ele.offsetTop;
		tempEle = ele.offsetParent;
		while(tempEle!=null) {
			pos += (dir=='x') ? tempEle.offsetLeft : tempEle.offsetTop;
			tempEle = tempEle.offsetParent;
		}
		return pos;
	}
	function getValue(key) {
		var value = myLocalStorage[key];
		return (value&&(value!='undefined')) ? value : '';
	}
	function setValue(key,value) { myLocalStorage[key] = value; }
	function deleteValue(key) { myLocalStorage.removeItem(key); }
	function is_significant(str) {
		return typeof str=='string'&&str.replace(/\s+/g,'').length>0;
	}
	function append_time_stamp(str) { return str+'@'+(new Date()).getTime(); }
	function remove_time_stamp(str) {
		var time_pos = str.search(/@\d+$/);
		return (time_pos!=-1) ? str.substring(0,time_pos) : str;
	}
	function get_time_stamp(str) {
		var time_pos = str.search(/@\d+$/);
		return str.substring(time_pos+1);
	}
	function SaveTextArea(txta) {
		this.ta = (typeof txta=='string' ? document.getElementById(txta) : txta);
		this.initial_txt = this.ta.textContent;
		this.committed = '';
		this.listen();
		this.restore();
	}
	function STAParentsUntil(tag,el) {
		var test = el.parentNode;
		while(test.parentNode&&(test.nodeName.toLowerCase()!=tag))
			test = test.parentNode;
		if(test.nodeName.toLowerCase()==tag) return test;
		return false;
	}
	SaveTextArea.prototype = {
		listen: function(){
			var self = this;
			if(keypress_backup) this.ta.addEventListener('keypress',function(e){self.commit(self.ta.value);},true);
			if(blur_backup) this.ta.addEventListener('blur',function(e){self.commit();},true);
			if(timed_backup) this._stay_tuned();
			var onsubmit = function(e){ if(!keep_after_submission) deleteValue(self.key()); };
			var theform = STAParentsUntil('form',this.ta);
			if(theform!==false) {
				theform.addEventListener('submit',onsubmit,true);
				theform.the_actual_submit_method = theform.submit;
				theform.submit = function(){
					onsubmit();
					self.ta.form.the_actual_submit_method();
				};
			}
		},
		_stay_tuned: function() {
			var self = this;
			setTimeout(function() {
				self.commit();
				self._stay_tuned();
			},backup_interval);
		},
		menu: function(emphasize) {
			var em=emphasize, self=this, taMenu=document.createElement('div');
			//var offsetTop = this.ta.style.borderTopWidth+this.ta.style.marginTop+getAbsolutePosition(this.ta,'y');
			var offsetTop = getAbsolutePosition(this.ta, 'y');
			//var offsetRight = window.innerWidth-(getAbsolutePosition(this.ta,'x')+this.ta.offsetWidth+this.ta.style.marginLeft+this.ta.style.marginRight);
			var offsetRight = window.innerWidth-(getAbsolutePosition(this.ta,'x')+this.ta.offsetWidth);
			var style = document.createElement('style');
			style.setAttribute('type','text/css');
			style.textContent = '#textarea_backup_menu { \
					border:2px solid #000; border-width:0 2px 2px 2px; \
					border-radius:0 0 5px 5px; text-align:left; padding:0; \
					background:hsla(0,100%,50%,.4); color:#000; font-size:12px;  \
					font-family:"Deja Vu Sans",Verdana; position:absolute;  \
					z-index:999; width:12px; height:12px; overflow:hidden;  \
					top:'+offsetTop+'px; right:'+offsetRight+'px; \
				} \
				#textarea_backup_menu ul { list-style:none; height:0; overflow:hidden; } \
				#textarea_backup_menu ul, #textarea_backup_menu li { margin:0; padding:0; z-index:999; } \
				#textarea_backup_menu a { \
					display:block; width:100%; padding:5px; border-top:1px solid #000; \
					color:#000; cursor:pointer; z-index:1000; background:rgb(255,153,153); \
				} \
				#textarea_backup_menu:hover a, #textarea_backup_menu:focus a { height:auto; color:#000; cursor:pointer; } \
				#textarea_backup_menu li a:hover { background:#fff; } \
				#textarea_backup_menu:hover, #textarea_backup_menu:focus { width:auto; height:auto; color:#000; } \
				#textarea_backup_menu:hover ul,#textarea_backup_menu:focus ul { height:auto; }';
			try { document.getElementsByTagName('head')[0].appendChild(style); }
			catch(a){}
			//document.body.previousSibling.appendChild(style);
			taMenu.id = 'textarea_backup_menu';
			//taMenu.textContent = 'Textarea Backup Actions';
			taMenu.appendChild(menuList = document.createElement('ul'));
			var menuFunctions = new Array();
			menuFunctions[menuFunctions.length] = new Array(
				'Restore previous backup for '+this.ref(),
				function() { self.ta.value = self.previous_backup }
			);
			menuFunctions[menuFunctions.length] = new Array(
				'Delete previous backup for '+this.ref(),
				function(){
					if(confirm('Delete previous backup for '+self.ref()+'?')) {
						deleteValue(self.key());
						this.parentNode.removeChild(this);
					}
				}
			);
			menuFunctions[menuFunctions.length] = new Array(
				textContent = 'Clear '+this.ref(),
				function(){
					if(confirm('Clear '+self.ref()+'?')) self.ta.value = '';
				}
			);
			for(var i in menuFunctions) {
				if(typeof menuFunctions[i]=='object'
				&&typeof menuFunctions[i][0]=='string'
				&&typeof menuFunctions[i][1]=='function') {
					menuList.appendChild(li=document.createElement('li'));
					li.appendChild(a=document.createElement('a'));
					with(a) {
						textContent = menuFunctions[i][0];
						addEventListener('click',menuFunctions[i][1],false);
					}
				}
			}
			var body = document.body;
			body.appendChild(taMenu);
		},
		restore: function(){
			var em;
			// backup text is in format of "backup_content@save_time",
			// where save_time is the ms from Javascript Date object's getTime()
			var buff = remove_time_stamp(getValue(this.key()));
			// Only restore buffer if previously saved (i.e form not submitted).
			if(!is_significant(buff)) return;
			//myLocalStorage['tab_temp'] = this.ta.textContent;
			//opera.postError(typeof buff);
			//opera.postError(typeof myLocalStorage['tab_temp']);
			//opera.postError(buff == myLocalStorage['tab_temp']);
			// Check with user before overwriting existing content with backup.
			if(buff!=this.ta.textContent&&is_significant(this.ta.textContent)&&ask_overwrite)
				this._confirm_restore(buff);
			else {
				if(restore_auto) this.ta.value = buff;
				else if(em_available) em = true;
			}
			//this.previous_backup = this.ta.value;
			this.previous_backup = buff;
			if(menu_display) this.menu(em);
		},
		_confirm_restore: function(buff){
			var to_restore = remove_time_stamp(getValue(this.key()));
			this.old_border = this.ta.style.border;
			var msg = "[Textarea Backup] Existing text detected"
				+(this.ref() ? ' in '+this.ref() : '')
				+"', overwrite with this backup?\n\n";
			if(to_restore.length>750) msg += to_restore.substring(0,500) + "\n...";
			else msg += to_restore;
			this.confirming = true;
			this.ta.scrollIntoView();
			this._highlight_textarea(this.old_border);
			this.ta.value = this.ta.textContent;
			if(window.confirm(msg)) this.ta.value = buff;
			this.confirming = false;
			this.ta.style.border = this.old_border;
		},
		_highlight_textarea: function(border,toggle){
			var self = this
			setTimeout(function(ta_border,toggle) {
				if(self.confirming) {
					self.ta.style.border = (toggle ? '3px red solid' : ta_border);
					self._highlight_textarea(ta_border,toggle);
				}
				else self.ta.style.border = this.old_border;
			},1000,border,!toggle);
			return this.ta.style.border;
		},
		commit: function() {
			this.committed = append_time_stamp(this.ta.value);
			if(is_significant(this.committed)&&this.initial_txt!=this.committed)
				setValue(this.key(),this.committed);
		},
		key:function(){ return this.ta.baseURI+';'+this.ref(); },
		ref:function(){ return this.ta.id || this.ta.name || 'norefs'; }
	};
	if(expiry_timespan>0) {
		var curr_time = (new Date()).getTime();
		for (var i=0;i<myLocalStorage.length;i++) {
			var curr_bak = getValue(myLocalStorage.key(i));
			var bak_text = remove_time_stamp(curr_bak);
			var bak_time = get_time_stamp(curr_bak);
			if((curr_time-bak_time>=expiry_timespan)||(!is_significant(bak_text)))
				deleteValue(myLocalStorage.key(i));
		}
	}
	var textareas = document.getElementsByTagName('textarea');
	for(var i=0;i<textareas.length;i++) {
		var ta = textareas[i];
		new SaveTextArea(ta);
	}
},false);