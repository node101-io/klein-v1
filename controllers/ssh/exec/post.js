const SSH = require('../../../modules/ssh/ssh');

module.exports = (req, res) => {
  SSH.exec(req.body, (err, response) => {
    if (err) {
      res.write(JSON.stringify, { error: err, success: false });
      return res.end();
    };

    res.write(JSON.stringify({ response, success: true }));
    return res.end();
  });
}