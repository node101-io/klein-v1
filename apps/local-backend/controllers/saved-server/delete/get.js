const SavedServers = require('../../../utils/savedServers');

module.exports = (req, res) => {
  SavedServers.deleteByHost(req.body.host, (err, saved_servers) => {
    if (err)
      return res.json({ err: err });

    return res.json({ data: saved_servers });
  });
};