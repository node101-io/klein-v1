const ServerManager = require('../../../../utils/ServerManager');

module.exports = (req, res) => {
  ServerManager.checkConnection(req.body.host, (err, is_connected) => {
    if (err)
      return res.json({ err: err });

    return res.json({ data: is_connected });
  });
};
