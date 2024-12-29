const ServerManager = require('../../../../utils/server-manager');

module.exports = (req, res) => {
  ServerManager.connect(req.body, (err, action) => {
    if (err)
      return res.json({ err: err });

    return res.json({ data: action });
  });
};
