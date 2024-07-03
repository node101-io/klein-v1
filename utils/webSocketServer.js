const ws = require('ws');

let server = null;

const WebSocketServer = {
  create: (port, callback) => {
    let is_callback_called = false;

    new ws.WebSocketServer({ port })
      .on('listening', _ => {
        if (is_callback_called) return;

        is_callback_called = true;

        return callback(null);
      })
      .on('connection', ws => {
        ws.isReady = () => {
          return ws.readyState == ws.OPEN;
        };

        server = ws;
      })
      .on('close', _ => {
        server = null;
      })
      .on('error', err => {
        if (is_callback_called) return;

        is_callback_called = true;

        if (err.code == 'EADDRINUSE')
          return callback('port_in_use');

        return callback(err);
      });
  },
  get: _ => server,
  getPortHandler: port => {
    return (req, res, next) => {
      if (!req.query || typeof req.query != 'object')
        req.query = {};
      if (!req.body || typeof req.body != 'object')
        req.body = {};

      res.locals.WEBSOCKET_PORT = port;

      return next();
    };
  }
};

module.exports = WebSocketServer;