module.exports = (req, res) => {
  if (req.query.is_json)  {
    return res.json({
      is_incentivized: true,
      project: {}
    })
  } else {
    return res.render('index', {
      page: 'index/login',
      title: 'Login',
      is_incentivized: true,
      project: {
        _id: 0,
        name: 'Kava',
        description: 'Kava Testnet 1',
        image: '/logos/kava.png ',
        url: 'https://node101.io', information: 'Lorem ipsum dolor sit amet lorem ipsum dolor sit amet',
        requirements: {
          cpu: '2 vCPUs',
          ram: '4 GB',
          storage: '50 GB',
          os: 'Ubuntu 18.04 LTS'
        }
      }
    });
  }
};