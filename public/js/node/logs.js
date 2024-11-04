function loadPageNodeLogs(data) {
  loadingStart();

  loadingStop();
};

window.addEventListener('load', () => {
  const logsWrapper = document.querySelector('.node-logs-wrapper');

  const logStream = nodeManager.checkLogs(data => {
    logsWrapper.insertAdjacentHTML('afterbegin', data.data);
  }, err => {
    if (err)
      logsWrapper.insertAdjacentHTML('afterbegin', err);
  });
});
