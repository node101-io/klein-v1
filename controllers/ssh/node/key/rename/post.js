const sshRequest = require("../../../../../utils/sshRequest");

const renameKeyInNodeCommand = require("../../../../../commands/node/key/rename");

const KEY_NOT_FOUND_ERROR_MESSAGE = 'key not found';

module.exports = (req, res) => {
  if (!req.body.key_name)
    return res.json({ err: 'bad_request' });

  if (!req.body.new_key_name)
    return res.json({ err: 'bad_request' });

  sshRequest('exec', {
    host: req.body.host,
    command: renameKeyInNodeCommand(req.body.key_name, req.body.new_key_name)
  }, (err, data) => {
    if (err && err.includes(KEY_NOT_FOUND_ERROR_MESSAGE))
      return res.json({ err: 'document_not_found' });

    if (err)
      return res.json({ err: err });

    return res.json({ data: data });
  });
};