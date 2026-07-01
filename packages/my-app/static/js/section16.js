// static/js.section16.js
document.body.addEventListener('htmx:load', function (evt) {
    console.log("htmxロードイベントが発火されました:", evt)
})

htmx.logger = function (elt, event, data) {
    if (console) {
        console.log("INFO:", event, elt, data);
    }
}

htmx.logAll();
