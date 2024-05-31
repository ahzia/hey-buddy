// Function to create the chat interface
function createChatInterface(username, chatname) {
  // Create chat container
  const chatContainer = document.createElement("div");
  chatContainer.id = "hey-buddy-chat";

  // Create header for the chat with minimize button
  const chatHeader = document.createElement("div");
  chatHeader.classList.add("chat-header");
  // chatHeader.style.backgroundColor = "#007bff";
  // chatHeader.style.color = "#fff";
  // chatHeader.style.padding = "10px";
  // chatHeader.style.display = "flex";
  // chatHeader.style.justifyContent = "space-between";
  // chatHeader.style.alignItems = "center";
  // chatHeader.style.borderRadius = "5px 5px 0 0";
  chatHeader.innerHTML = `<span>${chatname}</span>`;
  const minimizeButton = document.createElement("button");
  minimizeButton.innerText = "-";
  minimizeButton.style.background = "none";
  minimizeButton.style.border = "none";
  minimizeButton.style.color = "#fff";
  minimizeButton.style.fontSize = "20px";
  minimizeButton.style.cursor = "pointer";
  chatHeader.appendChild(minimizeButton);
  chatContainer.appendChild(chatHeader);

  // Create chat messages container
  const chatBox = document.createElement("div");
  chatBox.id = "chat-box";
  chatBox.style.flex = "1";
  chatBox.style.padding = "10px";
  chatBox.style.overflowY = "scroll";
  chatContainer.appendChild(chatBox);

  // Create input field and send button
  const chatInputContainer = document.createElement("div");
  chatInputContainer.style.display = "flex";
  chatInputContainer.style.padding = "10px";
  chatInputContainer.style.borderTop = "1px solid #ccc";
  const inputField = document.createElement("input");
  inputField.type = "text";
  inputField.id = "input-field";
  inputField.placeholder = "Type a message...";
  inputField.style.flex = "1";
  inputField.style.padding = "5px";
  const sendButton = document.createElement("button");
  sendButton.id = "send-button";
  sendButton.innerText = "Send";
  sendButton.style.padding = "5px";
  chatInputContainer.appendChild(inputField);
  chatInputContainer.appendChild(sendButton);
  chatContainer.appendChild(chatInputContainer);

  document.body.appendChild(chatContainer);

  // Minimize button functionality
  minimizeButton.addEventListener("click", () => {
    if (chatBox.style.display === "none") {
      chatBox.style.display = "block";
      chatInputContainer.style.display = "flex";
      minimizeButton.innerText = "-";
      chatContainer.style.height = "400px";
    } else {
      chatBox.style.display = "none";
      chatInputContainer.style.display = "none";
      minimizeButton.innerText = "+";
      chatContainer.style.height = "40px";
    }
  });

  // Send button functionality
  sendButton.addEventListener("click", () => {
    const message = inputField.value;
    if (message.trim() === "") return;

    // Display user's message in chat box
    const userMessage = document.createElement("div");
    userMessage.innerHTML = `<strong>${username}:</strong> ${message}`;
    chatBox.appendChild(userMessage);
    inputField.value = "";
    chatBox.scrollTop = chatBox.scrollHeight; // Auto scroll to bottom

    // Send message and page content to backend
    chrome.runtime.sendMessage({ action: "getContent" }, (response) => {
      fetch("https://your-backend-function-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, content: response.content }),
      })
        .then((res) => res.json())
        .then((data) => {
          // Display bot's response in chat box
          const botMessage = document.createElement("div");
          botMessage.innerHTML = `<strong>${chatname}:</strong> ${data.reply}`;
          chatBox.appendChild(botMessage);
          chatBox.scrollTop = chatBox.scrollHeight; // Auto scroll to bottom
        })
        .catch((err) => {
          console.error("Error:", err);
        });
    });
  });
}

// Load stored settings and create the chat interface
chrome.storage.sync.get(["username", "chatname"], (result) => {
  const username = result.username || "You";
  const chatname = result.chatname || "Hey Buddy";
  createChatInterface(username, chatname);
});
