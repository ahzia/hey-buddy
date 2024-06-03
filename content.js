// Function to inject the Dialogflow Messenger script and CSS
function injectDialogflowMessenger(settings) {
  // Inject CSS
  const link = document.createElement('link');
  link.href = chrome.runtime.getURL('dialogflow/df-messenger-default.css');
  link.rel = 'stylesheet';
  document.head.appendChild(link);

  // Inject JS
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('dialogflow/df-messenger.js');
  script.async = true;
  document.head.appendChild(script);

  script.onload = () => {
    console.log('loaded');
    initializeDialogflowMessenger(settings);
  };
}

const sendMessageToAgent = (message, type) => {
  const sessionId = sessionStorage.getItem('df-messenger-sessionID');
  fetch(
    `https://dialogflow.cloud.google.com/v1/cx/integrations/messenger/webhook/projects/hey-buddy-425118/agents/565449f1-c5bd-40c2-8457-295ce6ae892d/sessions/${sessionId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        queryInput: {
          text: {
            text: message,
          },
          languageCode: 'en',
        },
        queryParams: {
          channel: 'DF_MESSENGER',
        },
      }),
    },
  )
    .then((data) => {
      console.log('Success:', data);
      if (type === 'settings') {
        sessionStorage.setItem('df-messenger-userdataSent', 'true');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};

// Function to initialize the Dialogflow Messenger with website content
function initializeDialogflowMessenger(settings) {
  const sessionId = sessionStorage.getItem('df-messenger-sessionID');
  const userDataSent = sessionStorage.getItem('df-messenger-userdataSent');
  console.log('Session ID:', sessionId);
  console.log('User Data Sent:', userDataSent);
  
  if (!userDataSent) {
    const pageTitle = document.title;
    const websiteContent = `websiteContent: '${document.body.innerText}'`;
    console.log('pageTitle', pageTitle);
    console.log('websiteContent', websiteContent);
    const text = `{userName: '${settings.username}', agentName: '${settings.chatname}', userAge: '${settings.age}, agentPersona: ${settings.agentPersona}, titleOfTopic: '${pageTitle}'`;
    sendMessageToAgent(websiteContent, 'websiteContent');
    sendMessageToAgent(text, 'settings');
  }
}

// Function to create the chat bubble and settings icon
function createChatAndSettings(settings) {
  injectDialogflowMessenger(settings);
  const chatname = settings.chatname;
  // Create chat container
  const chatContainer = document.createElement('div');
  chatContainer.id = 'hey-buddy-chat';
  chatContainer.style.position = 'fixed';
  chatContainer.style.bottom = '16px';
  chatContainer.style.right = '16px';
  chatContainer.style.zIndex = '9999';

  // Create chat bubble
  const chatBubble = document.createElement('df-messenger');
  chatBubble.setAttribute('project-id', 'hey-buddy-425118');
  chatBubble.setAttribute('agent-id', '565449f1-c5bd-40c2-8457-295ce6ae892d');
  chatBubble.setAttribute('language-code', 'en');
  chatBubble.setAttribute('max-query-length', '-1');

  const chatBubbleSettings = document.createElement('df-messenger-chat-bubble');
  chatBubbleSettings.setAttribute('chat-title', `${chatname}👋`);
  chatBubble.appendChild(chatBubbleSettings);

  chatContainer.appendChild(chatBubble);

  // Create settings icon
  const settingsIcon = document.createElement('div');
  settingsIcon.id = 'settings-icon';
  settingsIcon.style.position = 'fixed';
  settingsIcon.style.bottom = '16px';
  settingsIcon.style.right = '80px';
  settingsIcon.style.zIndex = '9999';
  settingsIcon.style.cursor = 'pointer';
  settingsIcon.innerHTML = `<i class='fas fa-cog' style='font-size: 24px;'></i>`;

  // Click event to open settings
  settingsIcon.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  document.body.appendChild(chatContainer);
  document.body.appendChild(settingsIcon);
}

// Load and inject the chat bubble and settings icon
chrome.storage.sync.get(['username', 'chatname', 'age'], (result) => {
  const username = result.username || 'You';
  const chatname = result.chatname || 'Hey Buddy';
  const age = result.age || '18';
  const agentPersona = result.agentPersona || 'Friendly';
  const settings = {
    username, chatname, age, agentPersona
  };
  createChatAndSettings(settings);
});
