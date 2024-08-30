localStorage.open_pages = Date.now();

window.addEventListener('storage', event => {
  if (event.key == 'open_pages') {
    localStorage.page_available = Date.now();
  } else if (event.key == 'page_available') {
    alert('One more page already open');
    window.close();
  };
}, false);
