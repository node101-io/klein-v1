const sshRequest = require("../../../../../utils/sshRequest");
const jsonify = require("../../../../../utils/jsonify");

const listKeysInNodeCommand = require("../../../../../commands/node/key/list");

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.body.host,
    command: listKeysInNodeCommand()
  }, (err, data) => {
    if (err)
      return res.json({ err: err });

    data = jsonify(data);

    return res.json({ data: data });
  });
};