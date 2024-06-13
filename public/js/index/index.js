// window.host = 'localhost';
window.host = '164.90.186.117';
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
        password: 'node101Bos',
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

    if (event.target.closest('#install-node-button')) {
      nodeManager.getInstallationScriptByProject({
        network: 'cosmos',
        project: 'celestiatestnet3',
        is_mainnet: false,
      }, (err, res) => {
        if (err)
          return console.error(err);

        const requestId = nodeManager.installNode({
          docker_compose_content: res.docker_compose_content,
          dockerfile_content: res.dockerfile_content,
        }, data => {
          if (data.data.startsWith('#'))
            console.log(`Progress: ${Math.floor(parseInt(data.data.replace('#', '')) * 100 / res.steps_count)}%`, data.data);
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
        project: 'celestiatestnet3',
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

    if (event.target.closest('#get-pub-key-button')) {
      walletManager.getPublicKey({
        wallet_name: document.getElementById('wallet-name-value').value,
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
      // walletManager.renameWallet({
      //   wallet_name: document.getElementById('wallet-name-value').value,
      //   new_wallet_name: document.getElementById('new-wallet-name-value').value,
      // }, (err, res) => {
      //   if (err)
      //     return console.error(err);

      //   return console.log(res);
      // });

      localhostRequest('/ssh/node/tx/send-token', 'POST', {
        host: window.host,
        from_key_name: 'klein',
        to_address: 'address1',
        amount: '100',
      }, (err, res) => {
        if (err)
          return console.error(err);

        return console.log(res);
      });
    };
  });
});