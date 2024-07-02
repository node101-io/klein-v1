const makeTxManager = _ => {
  return {
    checkTxResult: (data, callback) => {
      localhostRequest('/ssh/node/tx/check-tx-result', 'POST', {
        host: window.host,
        tx_hash: data.tx_hash
      }, (err, res) => {
        if (err)
          return callback(err);

        return callback(null, res);
      });
    },
    createValidator: (data, callback) => {
      localhostRequest('/ssh/node/tx/create-validator', 'POST', {
        host: window.host,
        amount: data.amount,
        chain_registry_identifier: data.chain_registry_identifier,
        commission_max_change_rate: data.commission_max_change_rate,
        commission_max_rate: data.commission_max_rate,
        commission_rate: data.commission_rate,
        details: data.details,
        fees: data.fees,
        from_key_name: data.from_key_name,
        identity: data.identity,
        moniker: data.moniker,
        non_generic_tx_commands: data.non_generic_tx_commands,
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
        chain_registry_identifier: data.chain_registry_identifier,
        fees: data.fees,
        from_key_name: data.from_key_name,
        non_generic_tx_commands: data.non_generic_tx_commands,
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
        chain_registry_identifier: data.chain_registry_identifier,
        commission_rate: data.commission_rate,
        details: data.details,
        fees: data.fees,
        from_key_name: data.from_key_name,
        moniker: data.moniker,
        non_generic_tx_commands: data.non_generic_tx_commands,
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
        chain_registry_identifier: data.chain_registry_identifier,
        fees: data.fees,
        from_key_name: data.from_key_name,
        from_validator_valoper: data.from_validator_valoper,
        non_generic_tx_commands: data.non_generic_tx_commands,
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
        chain_registry_identifier: data.chain_registry_identifier,
        fees: data.fees,
        from_key_name: data.from_key_name,
        to_address: data.to_address,
        non_generic_tx_commands: data.non_generic_tx_commands
      }, (err, res) => {
        if (err)
          return callback(err);

        return callback(null, res);
      });
    },
    undelegateToken: (data, callback) => {
      localhostRequest('/ssh/node/tx/undelegate-token', 'POST', {
        host: window.host,
        amount: data.amount,
        chain_registry_identifier: data.chain_registry_identifier,
        fees: data.fees,
        from_key_name: data.from_key_name,
        from_validator_valoper: data.from_validator_valoper,
        non_generic_tx_commands: data.non_generic_tx_commands
      }, (err, res) => {
        if (err)
          return callback(err);

        return callback(null, res);
      });
    },
    unjailValidator: (data, callback) => {
      localhostRequest('/ssh/node/tx/unjail-validator', 'POST', {
        host: window.host,
        chain_registry_identifier: data.chain_registry_identifier,
        fees: data.fees,
        from_key_name: data.from_key_name,
        non_generic_tx_commands: data.non_generic_tx_commands
      }, (err, res) => {
        if (err)
          return callback(err);

        return callback(null, res);
      });
    },
    voteProposal: (data, callback) => {
      localhostRequest('/ssh/node/tx/vote-proposal', 'POST', {
        host: window.host,
        chain_registry_identifier: data.chain_registry_identifier,
        fees: data.fees,
        from_key_name: data.from_key_name,
        non_generic_tx_commands: data.non_generic_tx_commands,
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
        chain_registry_identifier: data.chain_registry_identifier,
        fees: data.fees,
        from_key_name: data.from_key_name,
        from_validator_valoper: data.from_validator_valoper,
        non_generic_tx_commands: data.non_generic_tx_commands,
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