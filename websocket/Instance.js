const ws = require('ws');

let instance = null;

const Instance = {
  create(port) {
    new ws.WebSocketServer({ port })
      .on('connection', ws => {
        instance = ws;
        return ws;
      })
      .on('error', err => {
        if (err.code === 'EADDRINUSE')
          return console.log(`Port ${port} is already in use.`);

        setTimeout(() => Instance.create(port), 1000);
      });
  },
  get() {
    return instance
  }
};

module.exports = Instance;
