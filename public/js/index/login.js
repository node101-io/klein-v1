window.addEventListener('load', _ => {
  document.addEventListener('click', event => {
    if (event.target.closest('.index-login-right-remember-me-input')) {
      document.querySelector('.index-login-right-remember-me-icon').classList.toggle('display-none');

      console.log(document.querySelector('.index-login-right-remember-me-input').checked);
    };
  });
});