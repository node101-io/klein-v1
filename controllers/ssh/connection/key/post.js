const sshRequest = require('../../../../utils/sshRequest');

module.exports = (req, res) => {
  sshRequest('connect:key', req.body, (err, data) => {
    if (err)
      return res.json({ err: err });

    return res.json({ data: data });
  });
};