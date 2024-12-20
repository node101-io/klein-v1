const SavedServers = require('../../../utils/savedServers');

module.exports = (req, res) => {
  if (!req.query.host || typeof req.query.host != 'string' || !req.query.host.trim().length)
    SavedServers.getAll((err, saved_servers) => {
      if (err)
        return res.json({ err: err });

      return res.json({ data: saved_servers });
    });
  else
    SavedServers.getByHost(req.query.host, (err, saved_server) => {
      if (err)
        return res.json({ err: err });

      return res.json({ data: saved_server });
    });
};