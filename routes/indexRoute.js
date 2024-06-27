const express = require('express');

const router = express.Router();

const isAuth = require('../middleware/isAuth');
const setRenderFrontData = require('../middleware/setRenderFrontData');

const homeGetController = require('../controllers/home/get');
const indexGetController = require('../controllers/index/index/get');

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

module.exports = router;