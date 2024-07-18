module.exports = (req, res) => {
  return res.render('index', {
    page: 'node/index',
    title: 'Celestia',
    node: {
      title: 'Celestia',
      description: 'Celestia is a modular chain.',
      image: [{
        url: 'https://node101.s3.eu-central-1.amazonaws.com/klein-project-celestiatestnet3-200w-200h',
        alt: 'Celestia Logo'
      }],
      link: 'https://node101.io'
    },
    host: req.query.host
  });
};