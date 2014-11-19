// ==UserScript==
// @name         password-exposer
// @version      0.0.1
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

window.addEventListener('load', function () {
    var fields = document.querySelectorAll('input[type="password"]');
    [].forEach.call(fields, function (input) {
        input.addEventListener('dblclick', function (event) {
            var type = (this.type === 'text' ? 'password' : 'text');
            this.setAttribute('type', this.type = type);
        });
    });
});
