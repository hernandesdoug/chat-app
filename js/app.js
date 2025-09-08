let username = localStorage.getItem('username');
console.log(!!username);
if (!!username) {
    username = prompt('Choose a username:');
    localStorage.setItem('username', username);
}

const socket = new WebSocket('ws://localhost:8080');
const chat = document.getElementById('chat-message');
const messageInput = document.getElementById('input-msg');

socket.onopen = () => {
    const joinMsg = { type: "join", username };
    socket.send(JSON.stringify(joinMsg));
};

socket.onmessage = async event => {
    const data = JSON.parse(event.data);
     
    if (data.type === "join") {
        console.log(data.type);
        addSystemMessage(`🔵 ${data.username} entered chat`);
    } else if (data.type === "leave") {
        addSystemMessage(`🔴 ${data.username} left chat`);
    } else if (!data.type) {
        addMessage(data.username, data.text);
    }
}

window.addEventListener("beforeunload", () => {
    const leaveMsg = { type: "leave", username };
    socket.send(JSON.stringify(leaveMsg));
});

function sendMessage() {
    const text = messageInput.value.trim();
    if (text) {
        const msg = { username, text };
        addMessage(username, text); 
        socket.send(JSON.stringify(msg));
        messageInput.value = '';
    }
}

function addMessage(user, text) {
    const div = document.createElement('div');
  
    if (text.match(/^https?:\/\//)) {
        if (/\.(jpg|jpeg|png|gif)$/i.test(text)) {
            text = `<img src="${text}" alt="image" style="max-width:200px; border-radius:8px;">`;
        } else if (/\.(mp4|webm|ogg)$/i.test(text)) {
            text = `<video controls style="max-width:300px; border-radius:8px;">
                                 <source src="${text}" type="video/mp4">
                                Your browser does not support video.
                                    </video>`;
        } else {
            text = `<a href="${text}" target="_blank">${text}</a>`;
        }
    }
    div.innerHTML = `<strong>${user}:</strong> ${text}`;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

function addSystemMessage(text) {
    const div = document.createElement('div');
    div.style.fontStyle = "italic";
    div.style.color = "gray";
    div.innerHTML = text;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

document.addEventListener("DOMContentLoaded", function () {
});