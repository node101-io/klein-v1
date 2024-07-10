module.exports = (req, res) => {
  return res.render('index', {
    page: 'node/create-validator',
    title: 'Create Validator',
    node: {
      title: 'Agoric',
      description: 'Agoric is a platform for building smart contracts and decentralized applications.',
      image: [{
        url: '/images/logo.png',
        alt: 'Agoric Logo'
      }],
      link: 'https://node101.io'
    },
    short_input_list: [
      {
        id: 'amount',
        type: 'number',
        title: 'Amount',
        placeholder: 'Input placeholder',
        is_required: true
      },
      {
        id: 'max-commissio-rate',
        type: 'number',
        title: 'Commission Max Rate',
        placeholder: 'Input placeholder',
        is_required: true
      },
      {
        id: 'max-commission-change-rate',
        type: 'number',
        title: 'Commission Max Change Rate',
        placeholder: 'Input placeholder',
        is_required: true
      },
      {
        id: 'commission-rate',
        type: 'number',
        title: 'Commission Rate',
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
        id: 'key-name',
        type: 'text',
        title: 'Key Name',
        placeholder: 'Input placeholder',
        is_required: true
      },
      {
        id: 'moniker',
        type: 'text',
        title: 'Moniker',
        placeholder: 'Input placeholder',
        is_required: true
      },
      {
        id: 'details',
        type: 'text',
        title: 'Details',
        placeholder: 'Input placeholder',
        is_required: false
      },
      {
        id: 'identity',
        type: 'text',
        title: 'Identity',
        placeholder: 'Input placeholder',
        is_required: false
      },
      {
        id: 'contact',
        type: 'text',
        title: 'Security Contact',
        placeholder: 'Input placeholder',
        is_required: false
      },
      {
        id: 'website',
        type: 'text',
        title: 'Website',
        placeholder: 'Input placeholder',
        is_required: false
      }
    ],
    long_input_list: []
  });
};