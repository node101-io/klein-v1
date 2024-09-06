let isPageLoading = false;

function displayAllNone() {
  document.getElementById('index-wrapper').classList.add('display-none');
  document.getElementById('index-home-wrapper').classList.add('display-none');
  document.getElementById('index-search-wrapper').classList.add('display-none');
  document.getElementById('index-login-wrapper').classList.add('display-none');
  document.getElementById('index-installation-wrapper').classList.add('display-none');
  document.getElementById('node-wrapper').classList.add('display-none');
};

function saveToSession(data, callback) {
  if (!data || typeof data != 'object')
    return callback(null);

  localhostRequest('/session/set', 'POST', data, (err, res) => {
    if (err) return callback(err);

    return callback(null);
  });
};

function navigatePage(page, data) {
  if (!page || typeof page != 'string' || !page.trim().length)
    return;

  if (isPageLoading) return;
  isPageLoading = true;

  saveToSession(data, err => {
    if (err) {
      isPageLoading = false;
      return;
    };

    displayAllNone();

    if (page == '/login') {
      loadPageIndexLogin(data);

      document.getElementById('index-wrapper').classList.remove('display-none');
      document.getElementById('index-login-wrapper').classList.remove('display-none');
    } else if (page == '/home') {
      loadPageIndexHome(data);

      document.getElementById('index-wrapper').classList.remove('display-none');
      document.getElementById('index-home-wrapper').classList.remove('display-none');
    } else if (page == '/install') {
      loadPageIndexInstallation(data);

      document.getElementById('index-wrapper').classList.remove('display-none');
      document.getElementById('index-installation-wrapper').classList.remove('display-none');
    } else if (page == '/node') {
      loadPageNode(data);

      document.getElementById('node-wrapper').classList.remove('display-none');
    } else if (page == '/search') {
      loadPageIndexSearch(data);

      document.getElementById('index-wrapper').classList.remove('display-none');
      document.getElementById('index-search-wrapper').classList.remove('display-none');
    };

    window.history.replaceState({}, '', page);

    isPageLoading = false;
  });
};

// window.onbeforeunload = () => {
//   return "Please don't leave the page :(";
// }
