module.exports = (req, res) => {
  return res.render('index', {
    page: 'node/create-wallet',
    title: 'Create Wallet',
    node: {
      title: 'Celestia',
      description: 'Celestia is a modular chain.',
      image: [{
        url: 'https://node101.s3.eu-central-1.amazonaws.com/klein-project-celestiatestnet3-200w-200h',
        alt: 'Agoric Logo'
      }],
      link: 'https://node101.io'
    },
    host: req.query.host,
    short_input_list: [
      {
        id: 'key-name',
        type: 'string',
        title: 'Wallet Name',
        placeholder: 'Input placeholder',
        is_required: true
      },
    ],
    long_input_list: []
  });
};