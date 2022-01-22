async function alertUser({
    html,
    title = chrome.runtime.getManifest().name,
    width = 400,
    height = 250,
    left,
    top
}) {
    const window = left == null && top == null && await chrome.windows.getCurrent();
    const window2 = await chrome.windows.create({
        url: `data:text/html,<title>${title}</title>${html}`.replace(/#/g, '%23'),
        type: 'popup',
        left: left ?? Math.floor(window.left + (window.width - width) / 2),
        top: top ?? Math.floor(window.top + (window.height - height) / 2),
        height,
        width
    });
    return new Promise((resolve) => {
        chrome.windows.onRemoved.addListener(onRemoved, { windowTypes: [ 'popup' ] });
        function onRemoved(id) {
            if (id === window2.id) {
                chrome.windows.onRemoved.removeListener(onRemoved);
                resolve();
            }
        }
    });
}

const divStyle = `style="text-align:center;font-family:sans-serif;padding-top:0.5rem;`;
const inputHtml = `<input
    style="padding:0.5rem 1.25rem; border:unset; border-radius:1.5rem;"
    type="button"
    onclick="window.close()"
    value="Close"
/>`;

chrome.action.onClicked.addListener(
    (tab) => {
        let tabUrl = tab.url;
        if (tabUrl.indexOf('chrome.google.com/webstore') >= 0) {
            alertUser({ html: `<div ${divStyle}">
    <p>This extension will not run on the<br/>Chrome Web Store.<br/>
    Please try on another tab.</p>
    <p>DON'T LET YOUR DREAMS BE DREAMS!<br/>
    DO IT!!!</p>
    ${inputHtml}
</div>` })
                .then(() => {
                    console.log('Chrome Web Store alert closed.');
                });
        } else if (tabUrl.indexOf("chrome://") >= 0) {
            alertUser({ html: `<div ${divStyle}">
    <p>This extension will not run on this page.<br/>
    Please try on another tab.</p>
    <p>WHAT ARE YOU WAITING FOR?<br/>
    DO IT!!!</p><br/>
    ${inputHtml}
</div>` })
                .then(() => {
                    console.log('Chrome tab alert closed.');
                });
        } else {
            chrome.scripting.executeScript(
                {
                    target: { tabId: tab.id },
                    files: [ 'scripts/doit.js' ]
                },
                null
            );
        }
    }
);