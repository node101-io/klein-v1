function loadPageNodeWallet(data) {
  loadingStart();

  walletManager.listWallets((err, wallet_list) => {
    if (err)
      return console.error(err);

    localhostRequest('/templates/node-wallets-each-wallet-wrapper', 'POST', {
      wallet_list: wallet_list
    }, (err, html) => {
      if (err)
        return console.error(err);

      document.querySelector('.node-wallets-list-wrapper').innerHTML = html;

      loadingStop();
    });
  });
};

window.addEventListener('load', () => {
  const walletNameInput = document.querySelector('TODO'); // TODO: id is not yet defined

  document.addEventListener('click', event => {
    if (event.target.closest('TODO')) { // TODO: id is not yet defined
      const walletName = walletNameInput.value;

      walletManager.createWallet({
        wallet_name: walletName.value
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
      const walletWrapper = event.target.closest('.node-wallets-each-wallet-wrapper');
      const copyButton = walletWrapper.querySelector('.node-wallets-each-wallet-copy-button');
      const copiedIcon = walletWrapper.querySelector('.node-wallets-each-wallet-copied-icon');

      navigator.clipboard.writeText(walletWrapper.querySelector('.node-wallets-each-wallet-address').innerText);

      copyButton.classList.add('display-none');
      copiedIcon.classList.remove('display-none');

      setTimeout(() => {
        copyButton.classList.remove('display-none');
        copiedIcon.classList.add('display-none');
      }, 1000);
    };
  });
});
