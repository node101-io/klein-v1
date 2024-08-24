const makeWalletManager = _ => {
  return {
    createWallet: (data, callback) => {
      localhostRequest('/ssh/node/key/create', 'POST', {
        key_name: data.wallet_name
      }, (err, wallet) => {
        if (err)
          return callback(err);

        return callback(null, wallet);
      });
    },
    deleteWallet: (data, callback) => {
      localhostRequest('/ssh/node/key/delete', 'POST', {
        key_name: data.wallet_name
      }, (err, res) => {
        if (err)
          return callback(err);

        return callback(null);
      });
    },
    getWalletBalance: (data, callback) => {
      localhostRequest('/ssh/node/key/balance', 'POST', {
        key_address: data.key_address
      }, (err, balance) => {
        if (err)
          return callback(err);

        return callback(null, balance);
      });
    },
    listWallets: callback => {
      localhostRequest('/ssh/node/key/list', 'POST', {}, (err, key_list) => {
        if (err)
          return callback(err);

        return callback(null, key_list);
      });
    },
    showWallet: (data, callback) => {
      localhostRequest('/ssh/node/key/show', 'POST', {
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