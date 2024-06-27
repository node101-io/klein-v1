module.exports = (active_page, current_page) => {
  if (active_page == current_page)
    return 'display: flex';
  return 'display: none';
}