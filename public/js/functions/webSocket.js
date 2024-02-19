const WEBSOCKET_PORT = document.getElementById('data-websocket-port').getAttribute('data');

const wsStreams = {};

const webSocket = new WebSocket(`ws://localhost:${WEBSOCKET_PORT}/`);

function onWebSocketData(requestId, callback) {
  wsStreams[requestId] = callback;

  webSocket.addEventListener('message', message => {
    const data = JSON.parse(message.data);

    if (data.id == requestId) {
      return wsStreams[requestId](data);
    };
  });
};

function endWebSocket(requestId) {
  webSocket.send(JSON.stringify({
    id: requestId,
    type: 'end'
  }));

  webSocket.removeEventListener('message', wsStreams[requestId]);

  delete wsStreams[requestId];
};

window.addEventListener('beforeunload', () => {
  webSocket.close();
});