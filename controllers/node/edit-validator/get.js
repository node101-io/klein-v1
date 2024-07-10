module.exports = (req, res) => {
  return res.render('index', {
    page: 'node/edit-validator',
    title: 'Edit Validator',
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
        id: 'commission-rate',
        type: 'text',
        title: 'Commission Rate',
        placeholder: 'Input placeholder',
        is_required: false
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
        id: 'moniker',
        type: 'text',
        title: 'Moniker',
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