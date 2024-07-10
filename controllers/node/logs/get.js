module.exports = (req, res) => {
  return res.render('index', {
    page: 'node/logs',
    title: 'Logs',
    node: {
      title: 'Agoric',
      description: 'Agoric is a platform for building smart contracts and decentralized applications.',
      image: [{
        url: '/images/logo.png',
        alt: 'Agoric Logo'
      }],
      link: 'https://node101.io'
    }
  });
};