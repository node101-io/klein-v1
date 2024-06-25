const sshRequest = require('../../../../../utils/sshRequest');
const jsonify = require('../../../../../utils/jsonify');

const listKeysInNodeCommand = require('../../../../../commands/node/key/list');

const NO_RECORDS_FOUND_MESSAGE_REGEX = /No records were found in keyring/

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.body.host,
    command: listKeysInNodeCommand(),
    in_container: true
  }, (err, key_list) => {
    if (err)
      return res.json({ err: err });

    if (NO_RECORDS_FOUND_MESSAGE_REGEX.test(key_list))
      return res.json({ data: [] });

    key_list = jsonify(key_list);

    return res.json({ data: key_list });
  });
};