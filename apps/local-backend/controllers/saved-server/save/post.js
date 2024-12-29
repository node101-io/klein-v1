const SavedServers = require('../../../utils/saved-servers');

module.exports = (req, res) => {
  SavedServers.saveIfNotExist(req.body.server, (err, saved_servers) => {
    if (err)
      return res.json({ err: err });

    return res.json({ data: saved_servers });
  });
};
