// window.host = 'localhost';
window.host = '164.68.108.76';
// window.host = '164.90.186.117';
// window.host = '144.91.93.154';

window.addEventListener('load', _ => {
  document.addEventListener('click', event => {
    if (event.target.closest('#login-button-key')) {
      serverManager.connectWithKey({
        filename: document.getElementById('login-key-value').value,
        // passphrase: '2',
      }, (err, res) => {
        if (err)
          return console.error(err);

        return console.log(res);
      });
    };

    if (event.target.closest('#login-button-password')) {
      serverManager.connectWithPassword({
        password: 'node101jcb',
      }, data => {
        // data.type:
        //   connect
        //   handshake
        //   error
        //   change password
        //   ready
        //   timeout
        //   end
        //   close
        console.log(data.type);
      }, (err, res) => {
        if (err)
          return console.error(err);

        return console.log(res);
      });
    };

    if (event.target.closest('#logout-button')) {
      serverManager.disconnect((err, res) => {
        if (err)
          return console.error(err);

        return console.log(res);
      });
    };

    if (event.target.closest('#exec-button')) {
      localhostRequest('/ssh', 'POST', {
        type: 'exec',
        host: window.host,
        command: 'echo deneme',
      }, (err, res) => {
        if (err)
          return console.error(err);

        return console.log(res);
      });
    };

    if (event.target.closest('#end-stream-button')) {
      endStream(document.getElementById('id-value').value);
    };

    if (event.target.closest('#notification-button')) {
      localhostRequest('/notification', 'POST', {
        title: 'Welcome to the Klein',
        body: 'Login to the server to get started',
        icon: 'img/icons/favicon.ico',
        sound: 'default',
      }, (err, res) => {
        if (err)
          return console.error(err);

        return console.log(res);
      });
    };

    if (event.target.closest('#create-local-key-button')) {
      SSHKeyManager.createKeyLocal({}, (err, res) => {
        if (err)
          return console.error(err);

        return console.log(res);
      });
    };

    if (event.target.closest('#remove-local-key-button')) {
      SSHKeyManager.removeKeyLocal({
        filename: document.getElementById('local-key-value').value,
      }, (err, res) => {
        if (err)
          return console.error(err);

        return console.log(res);
      });
    };

    if (event.target.closest('#show-local-keys-button')) {
      SSHKeyManager.showKeysLocal({}, (err, res) => {
        if (err)
          return console.error(err);

        return console.log(res);
      });
    };

    if (event.target.closest('#add-remote-key-button')) {
      SSHKeyManager.addKeyRemote({
        filename: document.getElementById('remote-key-value').value,
      }, (err, res) => {
        if (err)
          return console.error(err);

        return console.log(res);
      });
    };

    if (event.target.closest('#remove-remote-key-button')) {
      SSHKeyManager.removeKeyRemote({
        filename: document.getElementById('remote-key-value').value,
      }, (err, res) => {
        if (err)
          return console.error(err);

        return console.log(res);
      });
    };

    if (event.target.closest('#show-remote-keys-button')) {
      SSHKeyManager.showKeysRemote({}, (err, res) => {
        if (err)
          return console.error(err);

        return console.log(res);
      });
    };

    if (event.target.closest('#check-availability-button')) {
      serverManager.checkAvailibilityForNodeInstallation((err, res) => {
        if (err)
          return console.error(err);

        return console.log(res);
      });
    };

    if (event.target.closest('#install-docker-button')) {
      const requestId = serverManager.installDocker(
        data => {
          console.log(data.data);
        },
        (err, res) => {
          if (err)
            return console.error(err);

          return console.log(res);
        }
      );

      console.log(requestId);
    };

    if (event.target.closest('#uninstall-docker-button')) {
      serverManager.uninstallDocker((err, res) => {
        if (err)
          return console.error(err);

        return console.log(res);
      });
    };

    if (event.target.closest('#install-server-listener-button')) {
      const requestId = serverManager.installServerListener(
        data => {
          console.log(data.data);
        },
        (err, res) => {
          if (err)
            return console.error(err);

          return console.log(res);
        }
      );

      console.log(requestId);
    };

    if (event.target.closest('#uninstall-server-listener-button')) {
      serverManager.uninstallServerListener((err, res) => {
        if (err)
          return console.error(err);

        return console.log(res);
      });
    };

    if (event.target.closest('#update-server-listener-button')) {
      serverManager.updateServerListener(data => {
        console.log(data.data);
      }, (err, res) => {
        if (err)
          return console.error(err);

        return console.log(res);
      });
    };

    if (event.target.closest('#install-node-button')) {
      nodeManager.getInstallationScriptByProject({
        network: 'cosmos',
        project: 'lavatestnet',
        is_mainnet: false
      }, (err, res) => {
        if (err)
          return console.error(err);

        let completedStepCount = 0;

        const requestId = nodeManager.installNode({
          docker_compose_content: res.docker_compose_content,
          dockerfile_content: res.dockerfile_content,
          project_route: res.project_route
        }, data => {
          const eachBuildLog = jsonify(data.data);

          if (eachBuildLog && eachBuildLog.vertexes && Array.isArray(eachBuildLog.vertexes) && eachBuildLog.vertexes.length > 0 && eachBuildLog.vertexes.find(vertex => vertex.completed))
            completedStepCount++;

          console.log(`Progress: ${Math.floor(completedStepCount * 100 / res.steps_count)}%`, eachBuildLog);
        }, (err, res) => {
          if (err)
            return console.error(err);

          return console.log(res);
        });

        return console.log(requestId);
      });
    };

    if (event.target.closest('#uninstall-node-button')) {
      nodeManager.uninstallRunningNode((err, res) => {
        if (err)
          return console.error(err);

        return console.log(res);
      });
    };

    if (event.target.closest('#restart-node-button')) {
      nodeManager.restartNode({
        network: 'cosmos',
        project: 'lavatestnet',
        is_mainnet: false,
      }, (err, res) => {
        if (err)
          return console.error(err);

        return console.log(res);
      });
    };

    if (event.target.closest('#start-node-button')) {
      nodeManager.startNode((err, res) => {
        if (err)
          return console.error(err);

        return console.log(res);
      });
    };

    if (event.target.closest('#stop-node-button')) {
      nodeManager.stopNode((err, res) => {
        if (err)
          return console.error(err);

        return console.log(res);
      });
    };

    if (event.target.closest('#node-logs')) {
      const requestId = nodeManager.checkLogs(data => {
        console.log(data.data);
      }, (err, res) => {
        if (err)
          return console.error(err);

        return console.log(res);
      });

      return console.log(requestId);
    };

    if (event.target.closest('#install-snapshot-button')) {
      nodeManager.installSnapshot(data => {
        console.log(data.data);
      }, (err, res) => {
        if (err)
          return console.error(err);

        return console.log(res);
      });
    };

    if (event.target.closest('#create-wallet-button')) {
      walletManager.createWallet({
        wallet_name: document.getElementById('wallet-name-value').value,
      }, (err, res) => {
        if (err)
          return console.error(err);

        return console.log(res);
      });
    };

    if (event.target.closest('#delete-wallet-button')) {
      walletManager.deleteWallet({
        wallet_name: document.getElementById('wallet-name-value').value,
      }, (err, res) => {
        if (err)
          return console.error(err);

        return console.log(res);
      });
    };

    if (event.target.closest('#show-button')) {
      walletManager.showWallet({
        wallet_name: document.getElementById('wallet-name-value').value,
        type: 'account'
      }, (err, res) => {
        if (err)
          return console.error(err);

        return console.log(res);
      });
    };

    if (event.target.closest('#list-wallets-button')) {
      walletManager.listWallets((err, res) => {
        if (err)
          return console.error(err);

        return console.log(res);
      });
    };

    if (event.target.closest('#recover-wallet-button')) {
      walletManager.recoverWallet({
        wallet_name: document.getElementById('wallet-name-value').value,
        mnemonic: document.getElementById('mnemonic-value').value,
      }, (err, res) => {
        if (err)
          return console.error(err);

        return console.log(res);
      });
    };

    if (event.target.closest('#rename-wallet-button')) {
      walletManager.renameWallet({
        wallet_name: document.getElementById('wallet-name-value').value,
        new_wallet_name: document.getElementById('new-wallet-name-value').value,
      }, (err, res) => {
        if (err)
          return console.error(err);

        return console.log(res);
      });
    };

    if (event.target.closest('#check-tx-result-button')) {
      txManager.checkTxResult({
        tx_hash: 'BED97703277B3CF45681013D15606FABE7A769725993D8CC3CE9E261E0CA058F',
      }, (err, res) => {
        if (err)
          return console.error(err);

        return console.log(res);
      });
    };

    if (event.target.closest('#create-validator-button')) {
      txManager.createValidator({
        amount: 500000,
        commission_max_change_rate: 0.01,
        commission_max_rate: 0.20,
        commission_rate: 0.05,
        from_key_name: 'klein101',
        moniker: 'klein'
      }, (err, res) => {
        if (err)
          return console.error(err);

        return console.log(res);
      });
    };

    if (event.target.closest('#delegate-token-button')) {
      txManager.delegateToken({
        amount: 2000000,
        from_key_name: 'klein101',
        to_validator_valoper: 'lava@valoper15f6d00t0q84m6tlzha9snj852sghv8ycpg5pwz'
      }, (err, res) => {
        if (err)
          return console.error(err);

        return console.log(res);
      });
    };

    if (event.target.closest('#edit-validator-button')) {
      txManager.editValidator({
        from_key_name: 'klein101',
        moniker: 'Klein v1: Forrest',
        website: 'https://klein.run'
      }, (err, res) => {
        if (err)
          return console.error(err);

        return console.log(res);
      });
    };

    if (event.target.closest('#redelegate-token-button')) {
      txManager.redelegateToken({
        amount: 2000000,
        from_key_name: 'klein101',
        from_validator_valoper: 'lava@valoper15f6d00t0q84m6tlzha9snj852sghv8ycpg5pwz',
        to_validator_valoper: 'lava@valoper1z06tqx7ge2w56auf94e7ql3zafl4m2xm4emuc7'
      }, (err, res) => {
        if (err)
          return console.error(err);

        return console.log(res);
      });
    };

    if (event.target.closest('#send-token-button')) {
      txManager.sendToken({
        from_key_name: 'klein101',
        to_address: 'lava@1z06tqx7ge2w56auf94e7ql3zafl4m2xmpsqm2f',
        amount: 500000
      }, (err, res) => {
        if (err)
          return console.error(err);

        return console.log(res);
      });
    };

    if (event.target.closest('#unjail-validator-button')) {
      txManager.unjailValidator({
        from_key_name: 'klein101',
      }, (err, res) => {
        if (err)
          return console.error(err);

        return console.log(res);
      });
    };

    if (event.target.closest('#vote-proposal-button')) {
      txManager.voteProposal({
        from_key_name: 'klein101',
        option: 'yes',
        proposal_id: '1'
      }, (err, res) => {
        if (err)
          return console.error(err);

        return console.log(res);
      });
    };

    if (event.target.closest('#withdraw-rewards-button')) {
      txManager.withdrawRewards({
        from_key_name: 'klein101',
        from_validator_valoper: 'lava@valoper15f6d00t0q84m6tlzha9snj852sghv8ycpg5pwz',
        withdraw_commission: false
      }, (err, res) => {
        if (err)
          return console.error(err);

        return console.log(res);
      });
    };
  });
});