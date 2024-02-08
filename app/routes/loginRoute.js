const express = require('express');

const router = express.Router();

const indexGetController = require('../controllers/login/index/get');

router.get(
  '/',
    indexGetController
);

module.exports = router;
