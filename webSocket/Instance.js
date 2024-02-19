const ws = require('ws');

let instance = null;

const Instance = {
  create(port) {
    const wss = new ws.WebSocketServer({ port })
      .on('connection', ws => {
        instance = ws;
        return ws;
      })
      .on('error', err => {
        console.error(err);
        setTimeout(this.create(port), 1000);
      });
  },
  get() {
    return instance
  }
};

module.exports = Instance;