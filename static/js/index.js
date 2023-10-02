const app = () => {
  const socket = io('https://chat-rlvf.onrender.com');
  const msgInput = document.querySelector('.message-input');
  const msgList = document.querySelector('.messages-list');
  const sendBtn = document.querySelector('.send-btn');
  const usernameInput = document.querySelector('.username-input');
  const messages = [];
  console.log(messages);
  const getMessages = async () => {
    try {
      const { data } = await axios.get('https://chat-rlvf.onrender.com/api/chat');
      renderMessages(data);
      data.forEach((item) => messages.push(item));
    } catch (error) {
      console.log('222');
      console.log(error.message);
    }
  };

  getMessages();

  const handleSendMessage = (text) => {
    if (!text.trim()) {
      return;
    }

    sendMessage({
      username: usernameInput.value || 'Anonymous',
      text,
      createdAt: new Date(),
    });

    msgInput.value = '';
  };

  msgInput.addEventListener(
    'keydown',
    (e) => e.keyCode === 13 && handleSendMessage(e.target.value),
  );

  sendBtn.addEventListener('click', () => handleSendMessage(msgInput.value));

  const renderMessages = (data) => {
    let messages = '';
    console.log(data);
    data.forEach(
      (message) =>
        (messages += `
        <li class="bg-dark p-2 rounded mb-2 d-flex justify-content-between message">
            <div class="mr-2">
                <span class="text-info">${message.username}</span>
                <p class="text-light">${message.text}</p>
            </div>
            <span class="text-muted text-right date">
                ${new Date(message.createdAt).toLocaleString('ru', {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                })}
            </span>
        </li>`),
    );

    msgList.innerHTML = messages;
  };

  const sendMessage = (message) => socket.emit('sendMessage', message);

  socket.on('recMessage', (message) => {
    console.log(message);
    messages.push(message);
    renderMessages(messages);
  });
};

app();
