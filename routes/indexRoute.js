const express = require('express');

const router = express.Router();

const isAuth = require('../middleware/isAuth');
const setRenderFrontData = require('../middleware/setRenderFrontData');

const indexGetController = require('../controllers/index/index/get');
const homeGetController = require('../controllers/index/home/get');
const loginGetController = require('../controllers/index/login/get');
const searchGetController = require('../controllers/index/search/get');

router.get(
  '/',
    isAuth,
    setRenderFrontData,
    indexGetController
);
router.get(
  '/home',
    isAuth,
    setRenderFrontData,
    homeGetController
);
router.get(
  '/login',
    isAuth,
    setRenderFrontData,
    loginGetController
);
router.get(
  '/search',
    isAuth,
    setRenderFrontData,
    searchGetController
);

module.exports = router;