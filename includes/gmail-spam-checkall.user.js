// ==UserScript==
// @name         gmail-spam-checkall
// @namespace    0d381163d6ec
// @description  Adds a check-all box to spam folder in HTML-only Gmail
// @include      http://mail.google.com/mail/*
// @include      https://mail.google.com/mail/*
// ==/UserScript==
window.addEventListener('load', function() {
    var checks = document.querySelectorAll('input[type="checkbox"]:not(#cboxy)');
    var delfor = document.querySelector('[value="Delete Forever"]');
    if (delfor) {
        var cboxy = document.createElement('input');
        cboxy.type = 'checkbox';
        cboxy.id = 'cboxy';
        cboxy.addEventListener('click', function() {
            for (var i = 0; i < checks.length; i++) {
                if (checks[i].checked) {
                    checks[i].removeAttribute('checked');
                } else {
                    checks[i].setAttribute('checked', true);
                }
            }
        });
        delfor.parentNode.insertBefore(cboxy, delfor);
    }
});