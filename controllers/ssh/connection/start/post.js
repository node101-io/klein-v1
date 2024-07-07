const VALID_IP_REGEX = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;

const sshRequest = require('../../../../utils/sshRequest');

module.exports = (req, res) => {
  if (!req.body.host || typeof req.body.host != 'string' || !VALID_IP_REGEX.test(req.body.host))
    return res.json({ err: 'invalid_host' });

  if (!req.body.password || typeof req.body.password != 'string')
    sshRequest('connect:key', req.body, (err, data) => {
      if (err)
        return res.json({ err: err });

      return res.json({});
    });
  else if (!req.body.filename || typeof req.body.filename != 'string')
    sshRequest('connect:password', req.body, (err, data) => {
      if (err)
        return res.json({ err: err });

      return res.json({});
    });
  else
    return res.json({ err: 'bad_request' });
};