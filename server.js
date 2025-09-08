const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('New client connected');

  ws.on("message", (data) => {
    const msg = JSON.parse(data);
    console.log(data);
    if (msg.type === "join") {  
      ws.username = msg.username; 
    }
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(msg));
      }
    });
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log('client disconnected');
    if (ws.username) {
      const leaveMsg = { type: "leave", username: ws.username };
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(leaveMsg));
        }
      });
    }
  });
});

console.log('✅ Server running on ws://localhost:8080');