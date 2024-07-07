module.exports = (req, res) => {
  return res.render('index', {
    page: 'index/install',
    title: 'Install'
  });
};