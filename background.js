chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'settings',
    title: 'Open Settings',
    contexts: ['action']
  });

  chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === 'settings') {
      chrome.runtime.openOptionsPage();
    }
  });
});
