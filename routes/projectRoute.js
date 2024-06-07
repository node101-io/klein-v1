const express = require('express');

const router = express.Router();

const isAuth = require('../middleware/isAuth');
// const indexGetController = require('../controllers/project/index/get');
const infoGetController = require('../controllers/project/info/get');
const scriptGetController = require('../controllers/project/script/get');

router.get(
  '/info',
    isAuth,
    infoGetController
);

router.get(
  '/script',
    isAuth,
    scriptGetController
);

module.exports = router;