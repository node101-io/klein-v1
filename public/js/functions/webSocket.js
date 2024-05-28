const WEBSOCKET_PORT = document.getElementById('data-websocket-port').getAttribute('data');

const webSocket = new WebSocket(`ws://localhost:${WEBSOCKET_PORT}/`);

function makeStream(onStreamData) {
  const id = generateRandomHEX();

  function onMessage(message) {
    const data = jsonify(message.data);

    if (data.id == id)
      onStreamData(data);
  };

  webSocket.addEventListener('message', onMessage);

  return {
    id: id,
    end() {
      webSocket.send(JSON.stringify({
        id: id,
        type: 'end'
      }));

      webSocket.removeEventListener('message', onMessage);
    }
  };
};

window.addEventListener('beforeunload', webSocket.close);