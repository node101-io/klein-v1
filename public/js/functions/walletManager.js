const makeWalletManager = _ => {
  return {
    createWallet: (data, callback) => {
      localhostRequest('/ssh/node/key/create', 'POST', {
        host: window.host,
        key_name: data.wallet_name
      }, (err, wallet) => {
        if (err)
          return callback(err);

        return callback(null, wallet);
      });
    },
    deleteWallet: (data, callback) => {
      localhostRequest('/ssh/node/key/delete', 'POST', {
        host: window.host,
        key_name: data.wallet_name
      }, (err, res) => {
        if (err)
          return callback(err);

        return callback(null);
      });
    },
    getWalletBalance: (data, callback) => {
      localhostRequest('/ssh/node/key/balance', 'POST', {
        host: window.host,
        key_address: data.key_address
      }, (err, balance) => {
        if (err)
          return callback(err);

        return callback(null, balance);
      });
    },
    listWallets: callback => {
      localhostRequest('/ssh/node/key/list', 'POST', {
        host: window.host
      }, (err, key_list) => {
        if (err)
          return callback(err);

        return callback(null, key_list);
      });
    },
    showWallet: (data, callback) => {
      localhostRequest('/ssh/node/key/show', 'POST', {
        host: window.host,
        key_name: data.wallet_name,
        key_type: data.key_type
      }, (err, pubkey) => {
        if (err)
          return callback(err);

        return callback(null, pubkey);
      });
    },
    recoverWallet: (data, callback) => {
      localhostRequest('/ssh/node/key/recover', 'POST', {
        host: window.host,
        key_name: data.wallet_name,
        mnemonic: data.mnemonic
      }, (err, res) => {
        if (err)
          return callback(err);

        return callback(null, res);
      });
    },
    renameWallet: (data, callback) => {
      localhostRequest('/ssh/node/key/rename', 'POST', {
        host: window.host,
        key_name: data.wallet_name,
        new_key_name: data.new_wallet_name
      }, (err, res) => {
        if (err)
          return callback(err);

        return callback(null);
      });
    }
  };
};

const walletManager = makeWalletManager();