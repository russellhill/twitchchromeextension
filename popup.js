// Update the relevant fields with the new data
function setGameInfo(info) {
    if (info) {
        document.getElementById('gameTitle').innerHTML = info.gameTitle;
        document.getElementById('gameViewers').textContent = info.gameViewers;
        document.getElementById('gameChannels').textContent = info.gameChannels;
        document.getElementById('gameLink').href = info.gameLink;
        document.getElementById('gameImage').src = info.gameImage;
    }
}

function busy(isBusy) {
    var data = document.getElementById('data');
    var busy = document.getElementById('busy');
    if (isBusy) {
        data.style.display = 'none';
        busy.style.display = 'block';
    } else {
        data.style.display = 'block';
        busy.style.display = 'none';
    }
}

window.addEventListener('DOMContentLoaded', function () {
    busy(true);
    chrome.runtime.sendMessage({from: 'popup', subject: 'GameInfo'}, function (data) {
        setGameInfo(data);
        busy(false);
    });
});
