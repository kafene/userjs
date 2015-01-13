// ==UserScript==
// @name         password-exposer
// @version      0.1.0
// @description  Toggle password fields between text <=> password on double-click
// @namespace    http://kafene.org
// @copyright    2014 kafene software <http://kafene.org/>
// @include      *
// @run-at       document-start
// @grant        none
// @license      MIT <https://raw.githubusercontent.com/kafene/userscripts/mater/LICENSE>
// @downloadURL  https://raw.githubusercontent.com/kafene/userscripts/master/password-exposer.user.js
// @updateURL    https://raw.githubusercontent.com/kafene/userscripts/master/password-exposer.user.js
// ==/UserScript==

document.addEventListener("dblclick", function (event) {
    if (event.target.matches("input[type=password]")) {
        var type = event.target.type === "text" ? "password" : "text";
        event.target.type = type;
        event.target.setAttribute("type", type);
    }
});

