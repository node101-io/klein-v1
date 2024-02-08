const SSH = require('../../../modules/ssh/ssh');

module.exports = (req, res) => {
  SSH.connect(req.body, (err, data) => {
    if (err) {
      res.write(JSON.stringify, { error: err, success: false });
      return res.end();
    };

    res.write(JSON.stringify({ success: true }));
    return res.end();
  });
};