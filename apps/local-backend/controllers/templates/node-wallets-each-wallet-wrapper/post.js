const path = require('path');
const pug = require('pug');

const renderWalletWrapper = pug.compileFile(path.join(__dirname, '../../../views/templates/index-login-right-button-wrapper.pug'));

module.exports = (req, res) => {
  if (!req.body || typeof req.body != 'object')
    return res.json({ err: 'bad_request' });

  if (!req.body.wallet_list || !Array.isArray(req.body.wallet_list))
    return res.json({ err: 'bad_request' });

  for (let i = 0; i < req.body.wallet_list.length; i++)
    if (!req.body.wallet_list[i] || typeof req.body.wallet_list[i] != 'object' || !req.body.wallet_list[i].address || typeof req.body.wallet_list[i].address != 'string')
      return res.json({ err: 'bad_request' });

  return res.json({
    data: req.body.wallet_list.map(address => renderWalletWrapper({
      ...res.locals,
      address: address
    })).join('')
  });
};
