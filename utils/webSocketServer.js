const ws = require('ws');

let server = null;

const WebSocketServer = {
  create: (port, callback) => {
    new ws.WebSocketServer({ port })
      .on('listening', _ => {
        return callback(null);
      })
      .on('connection', ws => {
        server = ws;
      })
      .on('close', _ => {
        server = null;
      })
      .on('error', err => {
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