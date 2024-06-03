document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('settings-form');
  const usernameInput = document.getElementById('username');
  const chatnameInput = document.getElementById('chatname');
  const ageInput = document.getElementById('age');

  // Load stored settings
  chrome.storage.sync.get(['username', 'chatname', 'age'], (result) => {
    if (result.username) {
      usernameInput.value = result.username;
    }
    if (result.chatname) {
      chatnameInput.value = result.chatname;
    }
    if (result.age) {
      ageInput.value = result.age;
    }
  });

  // Save settings on form submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = usernameInput.value;
    const chatname = chatnameInput.value;
    const age = ageInput.value;
    chrome.storage.sync.set({ username, chatname, age }, () => {
      alert('Settings saved');
    });
  });
});
