let isPageLoading = false;

function displayAllNone() {}; // Bütün wrapperlar display none

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
      indexLoginLoadPage(data);
      document.querySelector('.index-login-wrapper').style.display = 'flex';
    } else if (page == '') {

    }

    isPageLoading = false;
  });
};