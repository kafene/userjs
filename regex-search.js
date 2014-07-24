/*
 * regex search bookmarklet
 *
 * Modified from original Bookmarklet by D. Patrick Caldwell:
 *     http://dpatrickcaldwell.blogspot.in/2010/09/regular-expression-search-bookmarklet.html
 * and from a modification thereof:
 *     https://github.com/pratyushmittal/Regex-Search-Bookmarklet
 */

javascript:(function getjQuery(callback) {
    if ('complete' === document.readyState) {
        var script = document.createElement('script');
        var target = document.documentElement;
        script.src = '//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js';
        script.async = false;
        script.onload = function () {
            target.removeChild(script);
            callback(jQuery.noConflict(true));
        };
        target.appendChild(script);
    } else {
        window.addEventListener('load', function () {
            getjQuery(callback);
        });
    }
})(function ($) {
    var appId = 'regexp-search-bookmarklet-20140716';
    var count = 0, searches = 0, text, regexp, borderColor, bgColor;

    var searchWithinNode = function (node, re) {
        var pos, skip = 0;

        if (node.nodeType === 3 && (pos = node.data.search(re)) >= 0) {
            var $acronym = ($('<acronym/>')
                .attr('title', 'Search ' + (searches + 1) + ': ' + re.toString())
                .css({
                    'background-color': bgColor,
                    'border-top': '1px solid ' + borderColor,
                    'border-bottom': '1px solid ' + borderColor,
                    'font-weight': 'bold',
                    color: borderColor
                }));
            var middlebit = node.splitText(pos);
            var endbit = middlebit.splitText(RegExp.lastMatch.length);
            $acronym.append(middlebit.cloneNode(true));
            middlebit.parentNode.replaceChild($acronym[0], middlebit);
            count++;
            skip = 1;
        } else if (node.nodeType === 1 && !$(node).is('script,style')) {
            for (var child = 0; child < node.childNodes.length; ++child) {
                child += searchWithinNode(node.childNodes[child], re);
            }
        }

        return skip;
    };

    $('#' + appId).remove();
    var $searchBox = $('<div id="' + appId + '"/>').css({
        position: 'fixed',
        bottom: '0',
        display: 'block',
        padding: '5px',
        background: '#fff',
        border: '1px solid wheat',
        font: '12px/100% sans-serif'
    }).text('RegExp search: ');

    var $searchInput = $('<input type="text"/>')
        .css({border: '1px solid #cdcdcd', padding: '3px', margin: '3px'})
        .keypress(function (e) {
            if (e.keyCode !== 13) { return; }
            e.preventDefault();
            var text = $searchInput.val();
            if (!text) { return false; }

            try {
                regexp = new RegExp(text, 'i');
            } catch (err) {
                $searchBox.append($('<div/>').text('Unable to create RegExp from "' + text + '"\n\n' + err));
                return false;
            }

            borderColor = '#' + (searches + 8).toString(2).substr(-3).replace(/0/g, '3').replace(/1/g, '6');
            bgColor = borderColor.replace(/3/g, 'c').replace(/6/g, 'f');

            if (searches % 16 / 8 >= 1) {
                var tempColor = borderColor;
                borderColor = bgColor;
                bgColor = tempColor;
            }

            searchWithinNode(document.body, regexp);
            $searchBox.append($('<div/>').text('Found ' + count + ' match(es) for ' + regexp + '.'));
            if (count > 0) { searches++; }
        });

    $searchBox.append($searchInput);
    $('body').append($searchBox);
    $searchInput.focus();
});
