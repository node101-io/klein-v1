const fetch = require("../../../utils/fetch");

module.exports = (req, res) => {
  if (req.query.project_id) {
    fetch(`https://admin.klein.run/api/projects?id=${req.query.project_id}`, {}, (err, data) => {
      if (err)
        return res.json({ err: err });

      if (!data.success)
        return res.json({ err: data.err });

      if (req.query.is_json) {
        return res.json({
          project: data.project
        });
      } else {
        return res.render('index', {
          page: 'index/login',
          title: 'Login',
          project: data.project
        });
      };
    });
  } else {
    return res.render('index', {
      page: 'index/login',
      title: 'Login'
    });
  };
};