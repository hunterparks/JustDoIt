function injectCss() {
    var style = document.createElement('link');
    style.rel = 'stylesheet';
    style.type = 'text/css';
    style.href = chrome.runtime.getURL('styles/main.css');
    (document.head || document.documentElement).appendChild(style);
}

function removeVideo() {
    const videoElement = document.getElementsByClassName('shia-do-it')[0];
    if (videoElement) videoElement.remove();
}

function addVideo() {
    removeVideo();

    const videoFilename = `assets/${Math.floor(Math.random() * (6 - 1)) + 1}.webm`;
    const videoUrl = chrome.runtime.getURL(videoFilename);

    const video = document.createElement('video');
    video.setAttribute('width', '960');
    video.setAttribute('height', '540');
    video.setAttribute('name', 'media');
    video.setAttribute('src', videoUrl);
    video.onended = () => removeVideo();
    video.addEventListener('loadeddata', () => {
        video.style.visibility = 'visible';
        video.play();
    }, false);
    video.onerror = function () {
        alert('ooops... Shia had a problem. try on another tab');
        removeVideo();
    };
    video.load();

    const videoInnerDiv = document.createElement('div');
    videoInnerDiv.classList.add('container');
    videoInnerDiv.appendChild(video);

    const videoDiv = document.createElement('div');
    videoDiv.classList.add('shia-do-it');
    videoDiv.appendChild(videoInnerDiv);

    document.querySelector('body').appendChild(videoDiv);
}

(() => {
    injectCss();
    addVideo();
})();
