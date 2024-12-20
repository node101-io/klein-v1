module.exports = (active_page, current_page) => {
  if (active_page == current_page || (current_page.includes('*') && active_page.includes(current_page.replace('*', ''))))
    return '';

  return 'display-none';
};