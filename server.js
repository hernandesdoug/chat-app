const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const clients = new Set();

wss.on('connection', ws => {
  clients.add(ws);
  console.log('New client connected');

  ws.on('input-msg', msg => {
    // Broadcast to all clients
    clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    });
  });

  ws.on('close', () => {
    clients.delete(ws);
  });
});

console.log('✅ Server running on ws://localhost:8080');