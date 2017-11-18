// opens a new tab showing all (most?) images on the current page, including background images!

javascript:(function(){
    const images = new Set();
    Array.from(document.querySelectorAll('*')).forEach(function (elem) {
        if (elem instanceof Element && elem.matches('img') && elem.src) {
            images.add({url: elem.src, alt: (elem.alt || ''), title: (elem.title || '')});
        } else {
            const bgImage = window.getComputedStyle(elem).backgroundImage;
            if (/^url\("(.+?)"\)/i.test(bgImage)) {
                images.add({url: RegExp.$1, alt: '', title: ''});
            }
        }
    });
    const w = window.open();
    images.forEach(function (image) {
        w.document.body.appendChild(w.document.createElement('img')).src = image.url;
        if (image.alt) {
            w.document.body.appendChild(w.document.createElement('br'));
            w.document.body.appendChild(w.document.createTextNode(String(image.alt)));
        }
        if (image.title) {
            w.document.body.appendChild(w.document.createElement('br'));
            w.document.body.appendChild(w.document.createTextNode(String(image.title)));
        }
        w.document.body.appendChild(w.document.createElement('br'));
        w.document.body.appendChild(w.document.createElement('hr'));
    });
})();
