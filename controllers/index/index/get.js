module.exports = (req, res) => {
  return res.render('index/index', {
    page: 'index/index',
    title: 'Klein',
    includes: {
      css: ['page'],
      js: ['page', 'localhostRequest', 'generateRandomHEX', 'webSocket', 'serverManager', 'nodeManager', 'SSHKeyManager', 'preferenceManager', 'walletManager', 'jsonify']
    }
  });
};