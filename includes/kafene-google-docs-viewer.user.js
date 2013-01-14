// ==UserScript==
// @include       http://*/*
// @include       https://*/*
// @exclude       widget://*
// @run-at        document-start
// ==/UserScript==
window.addEventListener('load', function(){
  if(/^(drive|docs)\.google\./.test(window.location.host)) { return; }
  var guid = ' c0341e5c2wf6-' + (Math.floor(Math.random() * 899) + 100)
  , re = /\.(docx?|xlsx?|pptx?|pdf|odt|ods|pages|ai|psd|tiff?|dxf|eps|xps|p?ps)$/i
  , endpoint = 'http://docs.google.com/viewer?extsrc=1&url='
  , notice, match, current, links, i = 0;
  for( ; i < (links = document.getElementsByTagName('a')).length; i++) {
    if(links[i].href && (current = links[i]).className.indexOf(guid) < 0
      && (match = re.exec(current.href)) && match[1])
    {
      notice = ' <a href="' + current.href + '" class="' + guid + '-notice">'
             + '<b>[' + match[1].toUpperCase() + ']</b></a';
      current.insertAdjacentHTML('afterend', notice);
      current.className += guid;
      current.setAttribute('target', '_blank');
      current.href = endpoint + current.href;
    }
  }
},false);
