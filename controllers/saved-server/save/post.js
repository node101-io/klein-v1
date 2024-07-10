const SavedServers = require('../../../utils/savedServers');

module.exports = (req, res) => {
  SavedServers.save(req.body.server, (err, saved_servers) => {
    if (err)
      return res.json({ err: err });

    return res.json({ data: saved_servers });
  });
};