chrome.runtime.onInstalled.addListener(function() {
    function getViewerCount(callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://twitchcount.herokuapp.com/get-data?game=sea%20of%20thieves", true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                var resp = JSON.parse(xhr.responseText);
                callback(null, resp);
            }
        }
        xhr.send();
    }

    getViewerCount(function (error, data) {
        chrome.browserAction.setBadgeText({ text: data.viewers.toString(10) });
        chrome.browserAction.setIcon({ path : data.logo.small });
    });

    chrome.browserAction.onClicked.addListener(function (tab) {
        var newURL = "https://www.twitch.tv/directory/game/Sea%20of%20Thieves";
        chrome.tabs.create({ url: newURL });
    });
});