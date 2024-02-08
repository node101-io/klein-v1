const express = require('express');

const router = express.Router();

const indexGetController = require('../controllers/node/index/get');

router.get(
  '/',
  indexGetController
);

module.exports = router;
