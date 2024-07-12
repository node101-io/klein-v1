module.exports = (req, res) => {
  return res.render('index', {
    page: 'node/undelegate',
    title: 'Undelegate',
    node: {
      title: 'Celestia',
      description: 'Celestia is a modular chain.',
      image: [{
        url: 'https://node101.s3.eu-central-1.amazonaws.com/klein-project-celestiatestnet3-200w-200h',
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
      }
    ],
    long_input_list: []
  });
};