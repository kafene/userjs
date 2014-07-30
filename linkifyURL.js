/**
 * Linkify-Bookmarklet
 * A bookmarklet to turn text links into clickable links
 * The regex used is from https://github.com/jmrware/LinkifyURL
 * It works quite well on links in text nodes.
 * You can try it out on LinkifyURL's test page:
 * http://jmrware.com/articles/2010/linkifyurl/linkify.html
*/
javascript:(function linkify(node) {
    var child,
        urlPattern = /(\()((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(\))|(\[)((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(\])|(\{)((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(\})|(<|&(?:lt|#60|#x3c);)((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(>|&(?:gt|#62|#x3e);)|((?:^|[^=\s'"\]])\s*['"]?|[^=\s]\s+)(\b(?:ht|f)tps?:\/\/[a-z0-9\-._~!$'()*+,;=:\/?#[\]@%]+(?:(?!&(?:gt|#0*62|#x0*3e);|&(?:amp|apos|quot|#0*3[49]|#x0*2[27]);[.!&',:?;]?(?:[^a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]|$))&[a-z0-9\-._~!$'()*+,;=:\/?#[\]@%]*)*[a-z0-9\-_~$()*+=\/#[\]@%])/img,
        urlReplace = '$1$4$7$10$13<a href="$2$5$8$11$14">$2$5$8$11$14</a>$3$6$9$12',
        skipRegExp = /^(a|script|style|template)$/i;

    if (1 === node.nodeType && node.tagName && !skipRegExp.test(node.tagName)) {
        child = node.firstChild;
        while (child) {
            linkify(child);
            child = child.nextSibling;
        }
    } else if (3 === node.nodeType) {
        node.parentNode.innerHTML = node.parentNode.innerHTML.replace(urlPattern, urlReplace);
    }
})(document.body);
