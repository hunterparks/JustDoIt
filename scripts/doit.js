function injectCss() {
  var style = document.createElement('link');
  style.rel = 'stylesheet';
  style.type = 'text/css';
  style.href = chrome.extension.getURL('styles/main.css');
  (document.head || document.documentElement).appendChild(style);
}

function removeVideo() {
  var $videoElement = $('.shia-do-it');
  if ($videoElement !== null) $videoElement.remove();
}

function addVideo() {
  removeVideo();

  var $videoDiv = $.parseHTML('<div class="shia-do-it"><div class="container"><video width="960" height="540" name="media"></div></div>');
  $('body').append($videoDiv);

  var video = $($videoDiv).find('video').get(0);
  var videoNum = Math.floor(Math.random() * (6 - 1)) + 1;
  var filename = 'assets/' + videoNum + '.webm';
  video.src = chrome.extension.getURL(filename);

  video.onended = function () {
    removeVideo();
  };

  video.addEventListener('loadeddata', function () {
    $(video).css('visibility', 'visible');
    video.play();
  }, false);


  video.onerror = function () {
    alert('ooops... Shia had a problem. try on another tab');
    removeVideo(false);
  };

  video.load();
}

(() => {
  injectCss();
  addVideo();
})();
