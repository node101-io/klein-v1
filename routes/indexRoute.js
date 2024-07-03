const express = require('express');

const router = express.Router();

const isAuth = require('../middleware/isAuth');
const setRenderFrontData = require('../middleware/setRenderFrontData');

const homeGetController = require('../controllers/index/home/get');
const indexGetController = require('../controllers/index/index/get');
const loginGetController = require('../controllers/index/login/get');

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
)

module.exports = router;