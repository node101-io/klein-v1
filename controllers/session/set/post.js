const MAX_SESSION_KEY_LENGTH = 1e3;
const MAX_SESSION_VALUE_LENGTH = 1e4;

function getSessionDataFromBody(data, callback) {
  if (!data.key || typeof data.key != 'string' || !data.key.trim().length || data.key.length > MAX_SESSION_KEY_LENGTH)
    return callback('bad_request');

  if (data.value == undefined)
    return callback('bad_request');

  const key = data.key.trim();
  const value = data.value;

  try {
    const valueString = JSON.stringify(data.value);

    if (valueString.length > MAX_SESSION_VALUE_LENGTH)
      return callback('bad_request');

    return callback(null, { key, value });
  } catch (_) {
    return callback('bad_request');
  };
};

module.exports = (req, res) => {
  getSessionDataFromBody(req.body, (err, data) => {
    if (err) return res.json({ err: 'bad_request' });

    req.session[data.key] = data.value;

    return res.json({});
  });
};