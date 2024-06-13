const sshRequest = require('../../../../../utils/sshRequest');

const deleteKeyInNodeCommand = require('../../../../../commands/node/key/delete');

const KEY_NOT_FOUND_ERROR_MESSAGE = 'key not found';

module.exports = (req, res) => {
  if (!req.body.key_name)
    return res.json({ err: 'bad_request' });

  sshRequest('exec', {
    host: req.body.host,
    command: deleteKeyInNodeCommand(req.body.key_name),
    in_container: true
  }, (err, data) => {
    if (err && err.includes(KEY_NOT_FOUND_ERROR_MESSAGE))
      return res.json({ err: 'document_not_found' });

    if (err)
      return res.json({ err: err });

    return res.json({});
  });
};