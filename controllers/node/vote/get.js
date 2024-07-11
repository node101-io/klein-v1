module.exports = (req, res) => {
  return res.render('index', {
    page: 'node/vote',
    title: 'Vote',
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
        id: 'proposal-id',
        type: 'number',
        title: 'Proposal ID',
        placeholder: 'Input placeholder',
        is_required: true
      },
      {
        id: 'option',
        type: 'radio',
        choices: [
          { id: 'yes', text: 'Yes' },
          { id: 'no', text: 'No' },
          { id: 'no-with-veto', text: 'No with veto' },
          { id: 'abstain', text: 'Abstain' },
        ],
        title: 'Proposal ID',
        placeholder: 'Input placeholder',
        is_required: true
      }
    ],
    long_input_list: []
  });
};