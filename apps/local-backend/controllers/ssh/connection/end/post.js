const ServerManager = require('../../../../utils/ServerManager');

module.exports = (req, res) => {
  ServerManager.disconnect(req.body.host, (err) => {
    if (err)
      return res.json({ err: err });

    return res.json({});
  });
};
