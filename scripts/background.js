function showAlert(message) {
    alert(message);
}

chrome.action.onClicked.addListener(
    (tab) => {
        let tabUrl = tab.url;
        if (tabUrl.indexOf('chrome.google.com/webstore') >= 0) {
            const message = `This extension will not run on the Chrome Web Store.
Please try on another tab.
DON'T LET YOUR DREAMS BE DREAMS!
DO IT!!!`;
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: showAlert(message)
            });
        } else if (tabUrl.indexOf("chrome://") >= 0) {
            const message = `This extension will not run on this website.
Please try on another tab.
WHAT ARE YOU WAITING FOR?
DO IT!!!`;
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: showAlert(message)
            });
        }
        chrome.scripting.executeScript(
            {
                target: { tabId: tab.id },
                files: [ 'scripts/jquery.min.js' ]
            },
            () => {
                chrome.scripting.executeScript(
                    {
                        target: { tabId: tab.id },
                        files: [ 'scripts/doit.js' ]
                    },
                    null
                );
            }
        );
    }
);
