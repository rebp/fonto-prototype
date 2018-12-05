export let ONLINE = null;

setInterval(() => {    

    if (navigator.onLine === false) {
        navigator.serviceWorker.controller.postMessage("offline");
        ONLINE = false
    } else {
        navigator.serviceWorker.controller.postMessage("online");
        ONLINE = true
    }

    return ONLINE

}, 2000);