module.exports = (req, res) => {
  return res.render('index', {
    page: 'node/logs',
    title: 'Logs',
    node: {
      title: 'Celestia',
      description: 'Celestia is a modular chain.',
      image: [{
        url: 'https://node101.s3.eu-central-1.amazonaws.com/klein-project-celestiatestnet3-200w-200h',
        alt: 'Agoric Logo'
      }],
      link: 'https://node101.io'
    },
    host: req.query.host
  });
};