// ==UserScript==
// @name    Textarea backup
// @include *
// @exclude http://mail.google.com/*
// @exclude https://mail.google.com/*
// @exclude http://pinboard.in/*
// @exclude https://pinboard.in/*
// ==/UserScript==
;(function(){
  var ls = window.localStorage
    , tas = document.getElementsByTagName('textarea');
  if(!tas || !tas.length || !ls) return;
  var key = function(ta){
    return 'TB:'+window.location.pathname+'#'+(ta.name || ta.id || '#');
  };
  for(var i = 0; i < tas.length; i++) {
    if(ls[key(tas[i])]) tas[i].value = ls[key(tas[i])];
    tas[i].addEventListener('keyup', function(ev){
      if(!!(ev.target.value.trim())) ls[key(ev.target)] = ev.target.value;
    });
    tas[i].form &&  /* Remove saved value on form submit */
    tas[i].form.addEventListener('submit', function(ev){
      for(var j = 0; j < tas.length; j++)
        if(tas[j].form == ev.target) ls.removeItem(key(tas[j]));
    });
  }
})();