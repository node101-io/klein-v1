module.exports = (req, res) => {
  return res.render('index', {
    page: 'node/redelegate',
    title: 'Redelegate',
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
        id: 'from-valoper-address',
        type: 'text',
        title: 'From Valoper Address',
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
    long_input_list: []
  });
};