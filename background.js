function getViewerCount(callback) {
    var oldColor;
    chrome.browserAction.getBadgeBackgroundColor({}, function(color) {
        oldColor = color;
    });
    chrome.browserAction.setBadgeBackgroundColor({ color: '#FF0000'});
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://twitchcount.herokuapp.com/get-data?game=sea%20of%20thieves', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            var resp = JSON.parse(xhr.responseText);
            chrome.browserAction.setBadgeBackgroundColor({ color: oldColor });
            callback(null, resp);
        }
    }
    xhr.send();
}

chrome.runtime.onInstalled.addListener(function() {
    function getExternalIcon(iconURL) {
        console.log('get icon', iconURL);
        var canvas = document.createElement('canvas');
        var img = new Image();
        img.onload = function() {
            document.body.appendChild(canvas);
            var context = canvas.getContext('2d');
            context.drawImage(this, 0, 0);
            var imageData = context.getImageData(0, 0, img.width, img.height);
            console.log('get icon (2)', imageData);
            chrome.browserAction.setIcon({imageData: imageData});
        }
        img.src = iconURL;
    }

    getViewerCount(function (error, data) {
        console.log(data);
        chrome.browserAction.setBadgeText({ text: data.viewers.toString(10) });
        chrome.browserAction.setTitle({ title: 'Viewers: ' + data.viewers })
        getExternalIcon(data.box.small);
        chrome.alarms.create('checkAlarm', { delayInMinutes: 1, periodInMinutes: 1 });
    });    

    chrome.browserAction.onClicked.addListener(function (tab) {
        var newURL = 'https://www.twitch.tv/directory/game/Sea%20of%20Thieves';
        chrome.tabs.create({ url: newURL });
    });
});

// chrome.runtime.onSuspend.addListener(function() {
//     console.log('Unloading');
//     chrome.browserAction.setBadgeText({ text: 'DEAD' });
// });

chrome.alarms.onAlarm.addListener(function(alarm) {
    getViewerCount(function (error, data) {
        console.log(data);
        chrome.browserAction.setBadgeText({ text: data.viewers.toString(10) });
        chrome.browserAction.setTitle({ title: 'Viewers: ' + data.viewers })
    });    
});