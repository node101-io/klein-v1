module.exports = (req, res) => {
  return res.render('index', {
    page: 'node/delegate',
    title: 'Celestia',
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
        id: 'amount',
        type: 'number',
        title: 'Amount',
        placeholder: 'Input placeholder',
        is_required: true
      },
      {
        id: 'fees',
        type: 'text',
        title: 'Fees',
        placeholder: 'Input placeholder',
        is_required: true
      },
      {
        id: 'key',
        type: 'text',
        title: 'Key Name',
        placeholder: 'Input placeholder',
        is_required: true
      },
      {
        id: 'to-valoper-address',
        type: 'text',
        title: 'To Valoper Address',
        placeholder: 'Input placeholder',
        is_required: true
      }
    ],
    long_input_list: [
      {
        id: 'amount',
        type: 'number',
        title: 'Amount',
        placeholder: 'Input placeholder',
        is_required: true
      }
    ]
  });
};