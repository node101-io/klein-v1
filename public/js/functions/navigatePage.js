function displayAllNone() {}; // Bütün wrapperlar display none

function navigatePage(page, data) {
  if (!data) return; // throw error ama front yani

  if (page == '/login') {
    if (data.project);
    if (data.project.title);

    document.querySelector('.index-login-project-title').innerText = data.project.title;

    displayAllNone();

    document.querySelector('.index-login-wrapper').style.display = 'flex';
  }
}