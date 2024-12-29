const ServerManager = require('../../../../utils/server-manager');

module.exports = (req, res) => {
  ServerManager.disconnect(req.body.host, (err) => {
    if (err)
      return res.json({ err: err });

    return res.json({});
  });
};
