module.exports = (url, options, callback) => {
  if (!url || typeof url != 'string')
    return callback('bad_request');

  if (!options || typeof options != 'object')
    return callback('bad_request');

  fetch(url, {
    signal: options.timeout && typeof options.timeout == 'number' && options.timeout > 0 ? AbortSignal.timeout(options.timeout) : null,
  })
    .then(res => {
      if ('json' in options && !options.json)
        return res.text();

      return res.json();
    })
    .then(res => callback(null, res))
    .catch(err => {
      if (err.name == 'AbortError')
        return callback('timeout_error');

      return callback('network_error');
    });
};