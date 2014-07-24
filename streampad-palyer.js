// Inject StreamPad.com Player into pages, it plays any linked mp3 files.

javascript:(function(){
    var s = document.createElement('SCRIPT');
    var t = document.head || document.documentElement;
    s.async = false;
    s.src = 'http://o.aolcdn.com/os_merge/?file=/streampad/sp-player.js&file=/streampad/sp-player-other.js&expsec=86400&ver=12';
    s.onload = function () { t.removeChild(s); streampadPlayer.init(); };
    t.appendChild(s);
})();
