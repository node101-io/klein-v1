const express = require('express');

const router = express.Router();

const isAuth = require('../middleware/isAuth');
const isConnectedToHost = require('../middleware/isConnectedToHost');
const setRenderFrontData = require('../middleware/setRenderFrontData');

const indexGetController = require('../controllers/index/index/get');
const homeGetController = require('../controllers/index/home/get');
const installGetController = require('../controllers/index/install/get');
const loginGetController = require('../controllers/index/login/get');
const searchGetController = require('../controllers/index/search/get');

const loginPostController = require('../controllers/index/login/post');

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
  '/install',
    isAuth,
    setRenderFrontData,
    isConnectedToHost,
    installGetController
);
router.get(
  '/login',
    isAuth,
    setRenderFrontData,
    // isConnectedToHost,
    loginGetController
);
router.get(
  '/search',
    isAuth,
    setRenderFrontData,
    searchGetController
);

router.post(
  '/login',
    isAuth,
    loginPostController
);

module.exports = router;
