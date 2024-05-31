document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('settings-form');
    const usernameInput = document.getElementById('username');
    const chatnameInput = document.getElementById('chatname');
  
    // Load stored settings
    chrome.storage.sync.get(['username', 'chatname'], (result) => {
      if (result.username) {
        usernameInput.value = result.username;
      }
      if (result.chatname) {
        chatnameInput.value = result.chatname;
      }
    });
  
    // Save settings on form submit
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = usernameInput.value;
      const chatname = chatnameInput.value;
      chrome.storage.sync.set({ username, chatname }, () => {
        alert('Settings saved');
      });
    });
  });
  