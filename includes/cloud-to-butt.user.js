// ==UserScript==
// @include *
// @run-at document-start
// ==/UserScript==

/*
 * Cloud-To-Butt UserScript Version
 * Version 1.0
 *
 * Replaces 'the cloud' with 'my butt', and 'cloud' with 'butt'
 * http://userscripts.org/scripts/show/173979
 * Copyright 2013, WTFPL <http://www.wtfpl.net/>
 *
 * By kafene software <http://kafene.org/>
 */
window.addEventListener('DOMContentLoaded', function () {
    // Function adapted from http://stackoverflow.com/questions/5904914/#5904945
    var walk = function (node, cb) {
        var child, next;
        switch (node.nodeType) {
            case document.ELEMENT_NODE:
            case document.DOCUMENT_NODE:
            case document.DOCUMENT_FRAGMENT_NODE:
            case 1:
            case 9:
            case 11:
                child = node.firstChild;
                while (child) {
                    walk(child, cb);
                    child = child.nextSibling;
                }
                break;
            case document.TEXT_NODE:
            case 3:
                cb(node);
                break;
        }
    };
    walk(document.body, function (textNode) {
        textNode.nodeValue = textNode.nodeValue.replace(
            /(t)he(\s*)(c)loud(s)?/img,
            function (m, p1, p2, p3, p4) {
                var m = String.fromCharCode(p1.charCodeAt(0) - 7);
                var b = String.fromCharCode(p3.charCodeAt(0) - 1);
                return m + 'y' + p2 + b + 'utt' + (p4 || '');
            }
        ).replace(
            /(c)loud(s)?/img,
            function (m, p1, p2) {
                var b = String.fromCharCode(p1.charCodeAt(0) - 1);
                return b + 'utt' + (p2 || '');
            }
        );
    });
});
