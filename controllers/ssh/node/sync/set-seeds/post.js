const sshRequest = require('../../../../../utils/sshRequest');

const setNodeConfigVariableCommand = require('../../../../../commands/node/setConfigVariable');

module.exports = (req, res) => {
  if (!req.body.seeds || !Array.isArray(req.body.seeds))
    return res.json({ err: 'bad_request' });

  sshRequest('exec', {
    host: req.body.host,
    command: setNodeConfigVariableCommand('seeds', req.body.seeds.join(','))
  }, (err, data) => {
    if (err)
      return res.json({ err: err });

    return res.json({});
  });
};