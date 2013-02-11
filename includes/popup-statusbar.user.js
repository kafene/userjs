// ==UserScript==
// @name    popup-statusbar.js
// @version 0.1
// @author  David Håsäther, <davidh@opera.com>
// @author  Jan Henrik Helmers, <janhh@opera.com>
// @author  Martin Rauscher, <firstname@rauscheronline.de>
// @include *
// ==/UserScript==
function PopupStatusbar() {
    var ID = "_opera_extension_$_popup_statusbar_";
    var HIDE_TIMEOUT = 300, EXPAND_TIMEOUT = 1000; // ms
    var hideTimeoutId = null, expandTimeoutId = null;
    var styles =
      { "base":
          [ "position: fixed", "z-index: 2147483647"
          , "top: auto", "right: auto", "bottom: 0", "left: 0"
          , "font: 12px 'Segoe UI', 'Droid Sans', 'DejaVu Sans', sans-serif"
          , "background: #f2f1f0", "color: #333", "padding: 2px 4px"
          , "box-sizing: border-box", "border: 0 solid #999"
          , "border-color: #aaa9a9", "border-width: 1px 1px 0 0"
          , "border-top-right-radius: 4px", "overflow: hidden"
          , "white-space: nowrap", "text-overflow: ellipsis"
          , "-o-transition: opacity .3s, max-width .3s"
          , "-moz-transition: opacity .3s, max-width .3s"
          , "-webkit-transition: opacity .3s, max-width .3s"
          , "transition: opacity .3s, max-width .3s"
          , "text-shadow: 0 1px rgba(255, 255, 255, .5)"
          ]
      , "https": ["background: #fc5", "color: #431", "border-color: #431"]
      , "ftp": []
      , "javascript": []
      , "mailto": []
      };
    this._currentTarget = null;
    this._isExpanded = false;
    this.show = function(event){
        var target = event.target;
        while(target && !/^(?:a|area)$/i.test(target.nodeName)) {
            target = target.parentNode;
        }
        if(!target || !target.href) { return; }
        clearTimeout(hideTimeoutId);
        var ele = document.getElementById(ID);
        var statusbar = ele || document.createElement("div");
        if(this._currentTarget != target) {
            this._removeElement(); /* Not dealing w/ same target, remove ele */
            var url = target.href;
            var scheme = url.slice(0, url.indexOf(":"));
            statusbar.id = ID;
            var maxWidth = "max-width: "+(this._isExpanded
                ? "100%"
                : Math.min(500, document.documentElement.clientWidth)+"px");
            var URIDecoded = decodeURI(url.replace("http://", ""));
            statusbar.style.cssText = styles["base"]
                .concat(styles[scheme] || [])
                .concat(ele ? "opacity: 1" : "opacity: 0")
                .concat(maxWidth).join(" !important;");
			      if(target.title) {
                statusbar.innerHTML = target.title+"<br/>"+URIDecoded;
			      } else { statusbar.textContent = URIDecoded; }
            /* Append it to the document element to avoid problems when someone does
               document.body.lastChild or similar */
            document.documentElement.appendChild(statusbar);
            /* If the mouse is over the statusbar, don't show it */
            var box = statusbar.getBoundingClientRect();
            if(event.clientY > box.top && event.clientX < box.width) {
                this._removeElement();
                return;
            }
            setTimeout(function(){ /* Fade it in */
                statusbar.style.opacity = "1 !important";
            }, 0);
        }
        this._currentTarget = target;
        /* Expand it after a while, Chrome style */
        expandTimeoutId = setTimeout(function(){
            /* Doesn't animate when setting it to "100%" */
            var StStyle = document.documentElement.clientWidth+"px !important";
            statusbar.style.maxWidth = StStyle;
            this._isExpanded = true;
        }.bind(this), EXPAND_TIMEOUT);
        var removeBound = function(event){
            this.hide(event);
            target.removeEventListener("mouseout", removeBound);
        }.bind(this);
        target.addEventListener("mouseout", removeBound);
        statusbar.addEventListener("mouseover", this._removeElement.bind(this));
    };
    this.hide = function(event){
        clearTimeout(expandTimeoutId);
        hideTimeoutId = setTimeout(function() {
            /* Setting display before removing is a workaround for a reflow bug
               where the statusbar gets stuck on the page if it's too short. */
            var ele = document.getElementById(ID);
            if(ele) { ele.style.display = "none !important"; }
            setTimeout(this._removeElement.bind(this), 0);
            this._isExpanded = false;
        }.bind(this), HIDE_TIMEOUT);
    };
    this._removeElement = function(){
        var ele = document.getElementById(ID);
        if(ele) {
            ele.parentNode.removeChild(ele);
            this._currentTarget = null;
        }
    };
}

window.addEventListener("DOMContentLoaded", function(event){
    if(window != window.top) { return; } /* Frames are problematic */
    var statusbar = new PopupStatusbar();
    var show_bound = statusbar.show.bind(statusbar);
    document.body.addEventListener("mouseover", show_bound);
    opera.extension.addEventListener("disconnect", function(){
        statusbar._removeElement();
        document.body.removeEventListener("mouseover", show_bound);
    });
});

