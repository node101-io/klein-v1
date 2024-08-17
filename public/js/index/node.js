window.addEventListener('load', () => {
  document.addEventListener('click', event => {
    if (event.target.closest('#node-general-save-button-create-wallet')) {
      const createWalletPage = document.getElementById('node-general-content-wrapper-create-wallet');

      const keyNameElement = createWalletPage.querySelector('#key-name');

      if (!keyNameElement.value || typeof keyNameElement.value != 'string' || !keyNameElement.value.trim())
        return keyNameElement.nextElementSibling.classList.remove('display-none');

      walletManager.createWallet({
        wallet_name: keyNameElement.value
      }, (err, res) => {
        if (err == 'not_connected')
          return window.location.href = '/home';

        if (err == 'connection_lost')
          return window.location.href = '/home';

        if (err)
          return console.error(err);

        return window.location.href = '/node/wallets';
      });
    };

    if (event.target.closest('.node-wallets-each-wallet-copy-button')) {
      const walletAddressElement = event.target.closest('.node-wallets-each-wallet-copy-button').parentElement.querySelector('.node-wallets-each-wallet-address');

      const tempAddress = walletAddressElement.innerText;

      navigator.clipboard.writeText(tempAddress);

      walletAddressElement.innerText = 'Copied!';

      setTimeout(() => {
        walletAddressElement.innerText = tempAddress;
      }, 1000);
    };
  });

  if (window.location.pathname == '/node/wallets') {
    walletManager.listWallets((err, wallet_list) => {
      if (err)
        return console.error(err);

      //
    });
  };
});