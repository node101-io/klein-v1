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
    getPublicKey: (data, callback) => {
      localhostRequest('/ssh/node/key/get-pub-key', 'POST', {
        host: window.host,
        key_name: data.wallet_name
      }, (err, pubkey) => {
        if (err)
          return callback(err);

        return callback(null, pubkey);
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
    recoverWallet: (data, callback) => {
      localhostRequest('/ssh/node/key/recover', 'POST', {
        host: window.host,
        key_name: data.wallet_name,
        mnemonic: data.mnemonic
      }, (err, res) => {
        if (err)
          return callback(err);

        return callback(null);
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