const fetch = require('../../../utils/fetch');

const FETCH_TIMEOUT_IN_MS = 5000;

module.exports = (req, res) => {
  if (!req.query.network || typeof req.query.network != 'string')
    return res.json({ err: 'bad_request' });

  if (!req.query.project || typeof req.query.project != 'string')
    return res.json({ err: 'bad_request' });

  if (!req.query.is_mainnet || typeof req.query.is_mainnet != 'string' || (req.query.is_mainnet != 'true' && req.query.is_mainnet != 'false'))
    return res.json({ err: 'bad_request' });

  const url = `https://raw.githubusercontent.com/node101-io/klein-scripts-v1/main/${req.query.network}/${JSON.parse(req.query.is_mainnet) ? 'mainnet' : 'testnet'}/${req.query.project}`;

  fetch(`${url}/docker-compose.yaml`, {
    json: false,
    timeout: FETCH_TIMEOUT_IN_MS
  }, (err, docker_compose_content) => {
    if (err)
      return res.json({ err: err });

    fetch(`${url}/Dockerfile`, {
      json: false,
      timeout: FETCH_TIMEOUT_IN_MS
    }, (err, dockerfile_content) => {
      if (err)
        return res.json({ err: err });

      return res.json({ data: { docker_compose_content, dockerfile_content } });
    });
  });
};