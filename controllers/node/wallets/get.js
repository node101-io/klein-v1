module.exports = (req, res) => {
  return res.render('index', {
    page: 'node/wallets',
    title: 'Wallets',
    node: {
      title: 'Agoric',
      description: 'Agoric is a platform for building smart contracts and decentralized applications.',
      image: [{
        url: '/images/logo.png',
        alt: 'Agoric Logo'
      }],
      link: 'https://node101.io'
    },
    short_input_list: [],
    long_input_list: []
  });
};