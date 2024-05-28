const express = require('express');

const router = express.Router();

const isAuth = require('../middleware/isAuth');
const indexGetController = require('../controllers/index/index/get');

router.get(
  '/',
    isAuth,
    indexGetController
);

module.exports = router;