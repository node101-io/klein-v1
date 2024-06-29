const makeTxManager = _ => {
  return {
    createValidator: (data, callback) => {
      localhostRequest('/ssh/node/tx/create-validator', 'POST', {
        host: window.host,
        amount: data.amount,
        commission_max_change_rate: data.commission_max_change_rate,
        commission_max_rate: data.commission_max_rate,
        commission_rate: data.commission_rate,
        details: data.details,
        fees: data.fees,
        from_key_name: data.from_key_name,
        identity: data.identity,
        moniker: data.moniker,
        security_contact: data.security_contact,
        website: data.website
      }, (err, res) => {
        if (err)
          return callback(err);

        return callback(null, res);
      });
    },
    delegateToken: (data, callback) => {
      localhostRequest('/ssh/node/tx/delegate-token', 'POST', {
        host: window.host,
        amount: data.amount,
        fees: data.fees,
        from_key_name: data.from_key_name,
        to_validator_valoper: data.to_validator_valoper
      }, (err, res) => {
        if (err)
          return callback(err);

        return callback(null, res);
      });
    },
    editValidator: (data, callback) => {
      localhostRequest('/ssh/node/tx/edit-validator', 'POST', {
        host: window.host,
        commission_rate: data.commission_rate,
        details: data.details,
        fees: data.fees,
        from_key_name: data.from_key_name,
        moniker: data.moniker,
        security_contact: data.security_contact,
        website: data.website
      }, (err, res) => {
        if (err)
          return callback(err);

        return callback(null, res);
      });
    },
    redelegateToken: (data, callback) => {
      localhostRequest('/ssh/node/tx/redelegate-token', 'POST', {
        host: window.host,
        amount: data.amount,
        fees: data.fees,
        from_key_name: data.from_key_name,
        from_validator_valoper: data.from_validator_valoper,
        to_validator_valoper: data.to_validator_valoper,
      }, (err, res) => {
        if (err)
          return callback(err);

        return callback(null, res);
      });
    },
    sendToken: (data, callback) => {
      localhostRequest('/ssh/node/tx/send-token', 'POST', {
        host: window.host,
        amount: data.amount,
        fees: data.fees,
        from_key_name: data.from_key_name,
        to_address: data.to_address
      }, (err, res) => {
        if (err)
          return callback(err);

        return callback(null, res);
      });
    },
    unjailValidator: (data, callback) => {
      localhostRequest('/ssh/node/tx/unjail-validator', 'POST', {
        host: window.host,
        fees: data.fees,
        from_key_name: data.from_key_name
      }, (err, res) => {
        if (err)
          return callback(err);

        return callback(null, res);
      });
    },
    voteProposal: (data, callback) => {
      localhostRequest('/ssh/node/tx/vote-proposal', 'POST', {
        host: window.host,
        fees: data.fees,
        from_key_name: data.from_key_name,
        option: data.option,
        proposal_id: data.proposal_id
      }, (err, res) => {
        if (err)
          return callback(err);

        return callback(null, res);
      });
    },
    withdrawRewards: (data, callback) => {
      localhostRequest('/ssh/node/tx/withdraw-rewards', 'POST', {
        host: window.host,
        fees: data.fees,
        from_key_name: data.from_key_name,
        from_validator_valoper: data.from_validator_valoper,
        withdraw_commission: data.withdraw_commission
      }, (err, res) => {
        if (err)
          return callback(err);

        return callback(null, res);
      });
    }
  };
};

const txManager = makeTxManager();