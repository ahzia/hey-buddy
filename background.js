chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getContent") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          func: () => document.body.innerText,
        },
        (results) => {
          if (results && results[0] && results[0].result) {
            sendResponse({ content: results[0].result });
          } else {
            sendResponse({ content: "" });
          }
        }
      );
    });
    return true; // Will respond asynchronously.
  }
});
