// const fetch = require('../../../utils/fetch');

// module.exports = (req, res) => {
//   fetch(`https://klein.admin.run/api/projects${req.query.id && typeof req.query.id == "string" && req.query.id.trim().length ? `?id=${req.query.id.trim()}` : ''}`)
//     .then(response => {
//       return res.json({ data: response });
//     })
//     .catch(err => {
//       console.error(err);
//       return res.json({ err: 'unknown_error' });
//     });
// };