/*
enhanced bookmarklet for pinboard.in that helps remove
some junk from urls and decreases duplicate bookmarks.
basically a configuration for the bookmarklet is constructed
with elements like tags, url, title, description, selected text,
and then it's passed to a bunch of callbacks that can modify stuff.
that way each modification is isolated into its own function and
can be more easily changed, rather than have a bunch of different
modifications spaghettied throughout the code.
*/

javascript:(function (callbackArray) {
    var config = {}, popup, url;

    var endsWith = function (str, needle) {
        return (str.indexOf(needle, str.length - needle.length) >= 0);
    };

    config.description = ((window.getSelection || document.getSelection).call().toString() || '');
    config.url = (document.documentURI || document.URL || window.location.href || '');
    config.host = (window.location.hostname || document.location.hostname || '');
    config.title = (document.title || '');
    config.tags = [];
    config.showTags = true;
    config.readLater = false;
    config.noui = false;
    config.jumpClose = false;
    config.popup = 'left=60,top=60,height=700,width=750,scrollbars,menubar=0,toolbar=0,location=0,personalbar=0';

    config.hostIs = function (host) {
        return config.host === host || endsWith(config.host, '.' + host);
    };

    callbackArray.forEach(function (callback) { callback(config); });

    url = 'https://pinboard.in/add?' + (function (cfg, acc) {
        acc.push(['url', cfg.url]);
        acc.push(['title', cfg.title || cfg.url]);
        cfg.description && acc.push(['description', cfg.description]);
        cfg.showTags && acc.push(['showtags', 'yes']);
        cfg.tags && acc.push(['tags', cfg.tags.join(' ')]);
        cfg.jumpClose && acc.push(['jump', 'close']);
        cfg.noui && acc.push(['noui', 'yes']);
        cfg.readLater && acc.push(['later', 'yes']);
        cfg.samePage && acc.push(['next', 'same']);
        return acc;
    })(config, []).map(function (pair) {
        return pair.map(encodeURIComponent).join('=');
    }).join('&');

    try {
        popup = window.open(url, 'Pinboard', config.popup);
    } catch (a) {
        popup = window.open(url.replace(/^https/i, 'http'), 'Pinboard', config.popup);
    }

    if (config.jumpClose) {
        popup.blur();
    }
})([
    function (c) {
        var url = c.url;

        if (!url || !/^https?:\/\//i.test(url)) {
            return;
        }

        var remove = [
            'utm_source', 'utm_medium', 'utm_term', 'utm_content',
            'utm_campaign', 'utm_reader', 'utm_place', 'ga_source',
            'ga_medium', 'ga_term', 'ga_content', 'ga_campaign',
            'ga_place', 'yclid', '_openstat', 'fb_action_types',
            'fb_action_ids', 'fb_ref', 'fb_source',
            'action_object_map', 'action_type_map', 'action_ref_map',
        ];

        if (c.hostIs('youtube.com')) {
            remove.push('feature');
        } else if (c.hostIs('facebook.com')) {
            remove.push('ref', 'fref', 'hc_location');
        } else if (c.hostIs('imdb.com')) {
            remove.push('ref_');
        } else if (c.hostIs('chrome.google.com')) {
            remove.push('hl');
        } else if (c.hostIs('play.google.com')) {
            remove.push('hl');
        } else if (c.hostIs('addons.opera.com')) {
            remove.push('display', 'language');
        } else if (c.hostIs('addons.mozilla.org')) {
            remove.push('src', 'collection_id');
        } else if (c.hostIs('amazon.com')) {
            remove.push('ref', 's', 'ie', 'qid', 'sr', 'keywords');
        } else if (c.hostIs('f-droid.org')) {
            remove.push('fdfilter', 'fdpage', 'fdid');
        } else if (c.hostIs('google.com')) {
            /*remove.push('sourceid', 'ie', 'aqs', 'oq', 'es_sm');*/
        }

        var a = document.createElement('A');
        a.href = url;

        a.search = '?' + ((a.search || '')
            .replace(/(^[&?#=]+)|([&?#=]+$)/g, '')
            .split('&')
            .map(function (v) {
                return v.split('=');
            })
            .filter(function (v) {
                return v[0].length > 0 && -1 === remove.indexOf(v[0]);
            })
            .map(function (v) {
                return v[0] + (v[1] ? '=' + v[1] : '');
            })
            .join('&')
            .replace(/(^[&?#=]+)|([&?#=]+$)/g, '')
        );

        a.hash = '';

        url = a.href;
        url = url.replace(/[&?#=]+$/, '');
        url = url.replace(/[\/]+$/, '/');
        url = url.replace(/[&?#=]+\/$/, '/');

        c.url = url;
    },

    function (c) {
        if (c.hostIs('play.google.com')) {
            c.tags.push('android');
        } else if (c.hostIs('wordpress.org')) {
            c.tags.push('wordpress');
        } else if (c.hostIs('addons.mozilla.org')) {
            c.tags.push('firefox');
        } else if (c.hostIs('chrome.google.com')) {
            c.tags.push('chrome');
        } else if (c.hostIs('reddit.com')) {
            c.tags.push('reddit');
        }
    },

    function (c) {
        c.title = c.title.replace(/\s+/g, ' ').trim();

        if (0 === c.title.length) {
            c.title = c.url.replace(/^https?:\/\//i, '');
        }
    },

    function (c) {
        c.description = c.description.replace(/\s+/g, ' ').trim();
    },

    function (c) {
        if (c.hostIs('chrome.google.com')) {
            c.url = c.url.replace(/\/(related|reviews|details)\/?$/i, '');
        }
    },
]);
