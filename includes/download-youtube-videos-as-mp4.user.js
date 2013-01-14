// ==UserScript==
// @name Download YouTube Videos as MP4
// @description Adds a button that lets you download YouTube videos.
// @namespace http://googlesystem.blogspot.com
// @include http://www.youtube.com/watch?*
// @include https://www.youtube.com/watch?*
// @match http://www.youtube.com/watch?*
// @match https://www.youtube.com/watch?*
// @homepageURL http://userscripts.org/scripts/show/25105
// @updateURL https://userscripts.org/scripts/source/25105.meta.js
// @author Gantt
// @version 1.4.8
// @date 2012-09-19
// @license MIT License
// ==/UserScript==
window.addEventListener('load',function(){
	var FORMAT_LABEL={'5':'FLV 240p','18':'MP4 360p',
		'22':'MP4 720p (HD)','34':'FLV 360p','35':'FLV 480p',
		'37':'MP4 1080p (HD)','38':'MP4 4K (HD)','43':'WebM 360p',
		'44':'WebM 480p','45':'WebM 720p (HD)','46':'WebM 1080p (HD)'};
	var FORMAT_TYPE={'5':'flv','18':'mp4','22':'mp4','34':'flv','35':'flv',
		'37':'mp4','38':'mp4','43':'webm','44':'webm','45':'webm','46':'webm'};
	var FORMAT_ORDER=['5','18','34','43','35','44','22','45','37','46','38'];
	var FORMAT_RULE={'flv':'max','mp4':'all','webm':'none'};
	var videoId, videoTicket, videoFormats, videoTitle='';
	var isExperiment=false; // YouTube's experimental interface
	run();
	function run(){
		if(document.getElementById('download-youtube-video')) return;
		var videoPlayer=document.getElementById('watch-player');
		if(videoPlayer==null){
			videoPlayer=document.getElementById('watch7-player');
			isExperiment=true;
		}
		if(videoPlayer&&videoPlayer.getAttribute('class').indexOf('html5')==-1){
			var flashValues=videoPlayer.innerHTML;
			var videoIdMatches=flashValues.match(/(?:"|\&amp;)video_id=([^(\&|$)]+)/);
			videoId=(videoIdMatches)?videoIdMatches[1]:null;
			var videoTicketMatches=flashValues.match(/(?:"|\&amp;)t=([^(\&|$)]+)/);
			videoTicket=(videoTicketMatches)?videoTicketMatches[1]:null;
			var videoFormatsMatches=flashValues.match(
				/(?:"|\&amp;)url_encoded_fmt_stream_map=([^(\&|$)]+)/);
			videoFormats=(videoFormatsMatches)?videoFormatsMatches[1]:null;
		}
		if(videoId==null||videoTicket==null){
			var config=null;
			if(window.yt&&window.yt.playerConfig) config=window.yt.playerConfig;
			if(config&&config.args){
				var args=config.args;
				videoId=args['video_id'];
				videoTicket=args['t'];
				videoFormats=args['url_encoded_fmt_stream_map'];
			}
		}
		if(videoId==null||videoTicket==null){
			var bodyContent=document.getElementsByTagName('body')[0];
			bodyContent=bodyContent.innerHTML;
			var videoIdMatches=bodyContent.match(/\"video_id\":\s*\"([^\"]+)\"/);
			videoId=(videoIdMatches)?videoIdMatches[1]:null;
			var videoTicketMatches=bodyContent.match(/\"t\":\s*\"([^\"]+)\"/);
			videoTicket=(videoTicketMatches)?videoTicketMatches[1]:null;
			var videoFormatsMatches=bodyContent.match(
				/\"url_encoded_fmt_stream_map\":\s*\"([^\"]+)\"/);
			videoFormats=(videoFormatsMatches)?videoFormatsMatches[1]:null;
		}
		if(videoId==null||videoTicket==null||videoFormats==null||videoId.length==0
		||videoTicket.length==0||videoFormats.length==0) return;
		var videoTitle=document.title||'video';
		videoTitle=videoTitle.replace(/\s*\-\s*YouTube$/i,'')
			.replace(/[#"\?:\*]/g,'').replace(/[&\|\\\/]/g,'_').replace(/'/g,'\'')
			.replace(/^\s+|\s+$/g, '').replace(/\.+$/g, '');
		var sep1='%2C',sep2='%26',sep3='%3D';
		if(videoFormats.indexOf(',')>-1){
			sep1=',';sep2=(videoFormats.indexOf('&')>-1)?'&':'\\u0026';sep3='=';
		}
		var videoURL=new Array();
		var videoFormatsGroup=videoFormats.split(sep1);
		for(var i=0;i<videoFormatsGroup.length;i++){
			var videoFormatsElem=videoFormatsGroup[i].split(sep2);
			var videoFormatsPair=new Array();
			for(var j=0;j<videoFormatsElem.length;j++){
				var pair=videoFormatsElem[j].split(sep3);
				if(pair.length==2) videoFormatsPair[pair[0]]=pair[1];
			}
			var url=(videoFormatsPair['url'])?videoFormatsPair['url']:null;
			if(url==null) continue;
			url=unescape(unescape(url)).replace(/\\\//g,'/').replace(/\\u0026/g,'&');
			var itag=(videoFormatsPair['itag'])?videoFormatsPair['itag']:null;
			if(itag==null) continue;
			var signature=(videoFormatsPair['sig'])?videoFormatsPair['sig']:null;
			if(signature!=null) url=url+"&signature="+signature;
			if(url.toLowerCase().indexOf('http')==0) videoURL[itag]=url;
		}
		var showFormat=new Array();
		for(var category in FORMAT_RULE){
			var rule=FORMAT_RULE[category];
			for(var index in FORMAT_TYPE){
				if(FORMAT_TYPE[index]==category) showFormat[index]=(rule=='all');
			}
			if(rule=='max'){
				for(var i=FORMAT_ORDER.length-1;i>=0;i--){
					var format=FORMAT_ORDER[i];
					if(FORMAT_TYPE[format]==category && videoURL[format]!=undefined){
						showFormat[format]=true;break;
					}
				}
			}
		}
		var downloadCodeList=[];
		for(var i=0;i<FORMAT_ORDER.length;i++){
			var format=FORMAT_ORDER[i];
			if(videoURL[format]!=undefined&&FORMAT_LABEL[format]!=undefined
			&&showFormat[format])
				downloadCodeList.push({url:videoURL[format]+'&title='
					+videoTitle,format:format,label:FORMAT_LABEL[format]});
		}
		if(downloadCodeList.length==0) return; // no format
		var uiLanguage=document.documentElement.getAttribute('lang');
		if(/^lt|bg|uk$/.test(uiLanguage)){
			var likeButton=document.getElementById('watch-like');
			if(likeButton){
				var spanElements=likeButton.getElementsByTagName('span');
				if(spanElements) spanElements[0].style.display='none';
			}
		}
		if(isExperiment){
			var parentElement=document.getElementById('watch7-action-buttons');
			var rightElement=document.getElementById('watch7-sentiment-actions');
		}
		else{
			var parentElement=document.getElementById('watch-actions');
			var rightElement=document.getElementById('watch-actions-right');
		}
		if(parentElement==null) return;
		var mainSpan=document.createElement('span');
		var spanButton=document.createElement('span');
		spanButton.setAttribute('class','yt-uix-button-content');
		spanButton.appendChild(document.createTextNode('Download'+' '));
		mainSpan.appendChild(spanButton);
		var imgButton=document.createElement('img');
		//imgButton.setAttribute('style','vertical-align:baseline;');
		imgButton.setAttribute('class','yt-uix-button-arrow');
		imgButton.setAttribute('src','//s.ytimg.com/yt/img/pixel-vfl3z5WfW.gif');
		mainSpan.appendChild(imgButton);
		var listItems=document.createElement('ol');
		listItems.setAttribute('style','display:none;');
		listItems.setAttribute('class','yt-uix-button-menu');
		for(var i=0;i<downloadCodeList.length;i++){
			var listItem=document.createElement('li');
			var listLink=document.createElement('a');
			listLink.setAttribute('style','text-decoration:none;');
			listLink.setAttribute('href',downloadCodeList[i].url);
			var listSpan=document.createElement('span');
			listSpan.setAttribute('class','yt-uix-button-menu-item');
			listSpan.setAttribute('loop',i+'');
			listSpan.setAttribute('id','download-youtube-video-fmt'
				+downloadCodeList[i].format);
			listSpan.appendChild(document.createTextNode(downloadCodeList[i].label));
			listLink.appendChild(listSpan);
			listItem.appendChild(listLink);
			listItems.appendChild(listItem);
		}
		mainSpan.appendChild(listItems);
		var buttonElement=document.createElement('button');
		buttonElement.setAttribute('id','download-youtube-video-button');
		if(isExperiment){
			buttonElement.setAttribute('class',
				'yt-uix-button yt-uix-button-text yt-uix-tooltip yt-uix-button-empty');
			buttonElement.setAttribute('style','margin-left:10px; margin-top:4px;');
		}
		else buttonElement.setAttribute('class','yt-uix-button '
			+'yt-uix-button-default yt-uix-tooltip yt-uix-tooltip-reverse');
		buttonElement.setAttribute('data-tooltip-text','Download this video');
		buttonElement.setAttribute('onclick','return false;');
		buttonElement.setAttribute('type','button');
		buttonElement.appendChild(mainSpan);
		var containerSpan=document.createElement('span');
		containerSpan.setAttribute('id','download-youtube-video');
		var leftmostButton=document.getElementById('watch-flag')
			||document.getElementById('watch-transcript')||null;
		if(!isExperiment&&leftmostButton
		&&leftmostButton.parentNode==parentElement){
			containerSpan.appendChild(buttonElement);
			containerSpan.appendChild(document.createTextNode(' '));
			parentElement.insertBefore(containerSpan,leftmostButton);
		}
		else{
			containerSpan.appendChild(document.createTextNode(' '));
			containerSpan.appendChild(buttonElement);
			parentElement.appendChild(containerSpan);
		}
		for(var i=0;i<downloadCodeList.length;i++){
			var downloadFMT=document.getElementById('download-youtube-video-fmt'+downloadCodeList[i].format);
			downloadFMT.addEventListener('click',downloadVideo,false);
		}
		function downloadVideo(e){
			var elem=e.target;
			e.returnValue=false;
			if(e.preventDefault) e.preventDefault();
			document.location.href=downloadCodeList[elem.getAttribute('loop')].url;
		}
	}
},false);