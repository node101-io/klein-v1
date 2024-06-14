const makeTxManager = _ => {
  return {
    sendToken: (data, callback) => {
      localhostRequest('/ssh/node/tx/send-token', 'POST', {
        host: window.host,
        from_key_name: data.from_key_name,
        to_address: data.to_address,
        amount: data.amount
      }, (err, res) => {
        if (err)
          return callback(err);

        return callback(null, res);
      });
    },
    delegateToken: (data, callback) => {
      localhostRequest('/ssh/node/tx/delegate-token', 'POST', {
        host: window.host,
        from_key_name: data.from_key_name,
        to_validator_valoper: data.to_validator_valoper,
        amount: data.amount
      }, (err, res) => {
        if (err)
          return callback(err);

        return callback(null, res);
      });
    },
    redelegateToken: (data, callback) => {
      localhostRequest('/ssh/node/tx/redelegate-token', 'POST', {
        host: window.host,
        from_key_name: data.from_key_name,
        from_validator_valoper: data.from_validator_valoper,
        to_validator_valoper: data.to_validator_valoper,
        amount: data.amount
      }, (err, res) => {
        if (err)
          return callback(err);

        return callback(null, res);
      });
    },
  };
};

const txManager = makeTxManager();