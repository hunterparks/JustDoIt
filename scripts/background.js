chrome.browserAction.onClicked.addListener(
  () => {
    chrome.tabs.getSelected(
      null,
      (tabRef) => {
        let tabUrl = tabRef.url;
        if (tabUrl.indexOf("chrome.google.com/webstore") >= 0) {
          alert("This extension will not run on the Chrome Web Store.\n" +
                "Please try on another tab.\n" +
                "DON'T LET YOUR DREAMS BE DREAMS!\n" +
                "DO IT!!!");
        } else if (tabUrl.indexOf("chrome://") >= 0) {
          alert("This extension will not run on this website.\n" +
                "Please try on another tab.\n" +
                "WHAT ARE YOU WAITING FOR?\n" +
                "DO IT!!!");
        }
        chrome.tabs.executeScript(
          null,
          { file: "scripts/jquery.min.js" },
          () => {
            chrome.tabs.executeScript(
              null,
              { file: "scripts/doit.js" },
              null
            );
          }
        );
      }
    );
  }
);
