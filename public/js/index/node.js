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
        if (err)
          return console.error(err);

        console.log(res);
      });
    };
  });
});