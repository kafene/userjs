// opens a popup showing the response headers from the current page as seen by a fetch request.

javascript:(function () {
    fetch("").then(res => {
        const headers = Array.from(res.headers.entries()).map(e => e.join(': ')).join('\n');
        open('about:blank', 'headers', 'left=250,top=250,height=600,width=720').document.write(`<pre>\nGET ${res.url}\nStatus: HTTP ${res.status} ${res.statusText}\n\n${headers}\n</pre>`);
    });
})();
