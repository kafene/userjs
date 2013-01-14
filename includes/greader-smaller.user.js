// ==UserScript==
// @name         greader-smaller
// @namespace    2f5fcf097983
// @include      https://www.google.com/reader/*
// @include      http://www.google.com/reader/*
// @include      http://google.com/reader/*
// @include      https://google.com/reader/*
// @match        http://*.google.com/reader/*
// @match        https://*.google.com/reader/*
// @run-at       document-start
// ==/UserScript==
(function(){
  function d(e){return document.getElementById(e);}
  var ga=d('gbu'),gb=d('gbx1'),gc=d('gbq'),gd=d('gb')
    ,ge=d('viewer-header-container'),gf=document.createTextNode("Read Better")
    ,gg=gh=document.createElement('span'),a=document.createElement('a')
    ,gi=document.createElement('li'),gj=d('nav');
  function ga1(){ga.style.display=gb.style.display=gc.style.display='none';gd.style.height='30px';}
  function ga2(){ga.style.display=gc.style.display=gb.style.display=gd.style.height='';}
  function ga3(){ge.style.display='none';}
  function ga4(){ge.style.display='';}
  gg.setAttribute('class','gbts');gg.appendChild(gf);gh.setAttribute('class','gbtb2');
  a.appendChild(gh);a.appendChild(gg);a.setAttribute('href','#');
  a.setAttribute('class','gbzt');a.addEventListener('click',function(){
    if(ge.style.display==''||ge.style.display=='block'){ga3();ga1();}
    else{ga4();ga2();}
  });
  gi.setAttribute('class','gbt');gi.appendChild(a);
  d('gbz').childNodes[1].appendChild(gi);ga1();ga3();gj.style.width='200px';
})();