const sshRequest = require('../../../../../utils/sshRequest');

const deleteKeyInNodeCommand = require('../../../../../commands/node/key/delete');

const KEY_NOT_FOUND_ERROR_MESSAGE_REGEX = /Error: (.*?): key not found/;

module.exports = (req, res) => {
  if (!req.body.key_name)
    return res.json({ err: 'bad_request' });

  sshRequest('exec', {
    host: req.body.host,
    command: deleteKeyInNodeCommand(req.body.key_name),
    in_container: true
  }, (err, delete_key_in_node_response) => {
    if (err)
      return res.json({ err: err });

    if (KEY_NOT_FOUND_ERROR_MESSAGE_REGEX.test(delete_key_in_node_response.stderr))
      return res.json({ err: 'key_not_found' });

    return res.json({});
  });
};