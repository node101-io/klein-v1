const PROJECTS = [
  {
    _id: 0,
    name: 'Kava',
    description: 'Kava Testnet 1',
    image: '/logos/kava.png ',
    url: 'https://node101.io', information: 'Lorem ipsum dolor sit amet lorem ipsum dolor sit amet'
  },
  {
    _id: 1,
    name: 'Agoric',
    description: 'Agoric Testnet 1',
    image: '/logos/agoric.png ',
    url: 'https://node101.io', information: 'Lorem ipsum dolor sit amet lorem ipsum dolor sit amet'
  },
  {
    _id: 2,
    name: 'Axelar',
    description: 'Axelar Testnet 1',
    image: '/logos/axelar.png ',
    url: 'https://node101.io', information: 'Lorem ipsum dolor sit amet lorem ipsum dolor sit amet'
  },
  {
    _id: 3,
    name: 'Anoma',
    description: 'Anoma Testnet 1',
    image: '/logos/anoma.png ',
    url: 'https://node101.io', information: 'Lorem ipsum dolor sit amet lorem ipsum dolor sit amet'
  },
  {
    _id: 4,
    name: 'Archway',
    description: 'Archway Testnet 1',
    image: '/logos/archway.png ',
    url: 'https://node101.io', information: 'Lorem ipsum dolor sit amet lorem ipsum dolor sit amet'
  },
  {
    _id: 5,
    name: 'dYdX',
    description: 'dYdX Testnet 1',
    image: '/logos/dydx.png ',
    url: 'https://node101.io', information: 'Lorem ipsum dolor sit amet lorem ipsum dolor sit amet'
  },
  {
    _id: 6,
    name: 'E-Money',
    description: 'E-Money Testnet 1',
    image: '/logos/e-money.png ',
    url: 'https://node101.io', information: 'Lorem ipsum dolor sit amet lorem ipsum dolor sit amet'
  },
  {
    _id: 7,
    name: 'Celestia',
    description: 'Celestia Testnet 1',
    image: '/logos/celestia.png ',
    url: 'https://node101.io', information: 'Lorem ipsum dolor sit amet lorem ipsum dolor sit amet'
  },
  {
    _id: 8,
    name: 'Cosmos',
    description: 'Cosmos Testnet 1',
    image: '/logos/cosmos.png ',
    url: 'https://node101.io', information: 'Lorem ipsum dolor sit amet lorem ipsum dolor sit amet'
  },
  {
    _id: 9,
    name: 'Crescent',
    description: 'Crescent Testnet 1',
    image: '/logos/crescent.png ',
    url: 'https://node101.io', information: 'Lorem ipsum dolor sit amet lorem ipsum dolor sit amet'
  },
  {
    _id: 10,
    name: 'Juno',
    description: 'Juno Testnet 1',
    image: '/logos/juno.png ',
    url: 'https://node101.io', information: 'Lorem ipsum dolor sit amet lorem ipsum dolor sit amet'
  },
  {
    _id: 11,
    name: 'Osmosis',
    description: 'Osmosis Testnet 1',
    image: '/logos/osmosis.png ',
    url: 'https://node101.io', information: 'Lorem ipsum dolor sit amet lorem ipsum dolor sit amet'
  },
];

module.exports = (req, res) => {
  return res.render('index', {
    page: 'index/home',
    title: 'Home',
    projects: PROJECTS
  });
};