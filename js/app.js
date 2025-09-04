let username = localStorage.getItem('username');
console.log(!!username);
if (!!username) {
    username = prompt('Choose a username:');
    localStorage.setItem('username', username);
}

const socket = new WebSocket('ws://localhost:8080');
const chat = document.getElementById('chat-message');
const messageInput = document.getElementById('input-msg');


socket.onmessage = async event => {
    const result = await event.data.text();
    const msg = JSON.parse(result);
    addMessage(msg.username, msg.text);
};
function sendMessage() {
    const text = messageInput.value.trim();
    if (text) {
        const msg = { username, text };
        addMessage(username, text); // Show own message instantly
        console.log(JSON.stringify(msg));
        socket.send(JSON.stringify(msg));
        messageInput.value = '';
    }
}

function addMessage(user, text) {
    const div = document.createElement('div');
    div.innerHTML = `<strong>${user}:</strong> ${text}`;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}
document.addEventListener("DOMContentLoaded", function () {
});