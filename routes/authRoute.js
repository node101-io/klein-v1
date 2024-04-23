const express = require('express');

const router = express.Router();

const indexGetController = require('../controllers/auth/index/get');
const indexPostController = require('../controllers/auth/index/post');

router.get(
  '/',
    indexGetController
);

router.post(
  '/',
    indexPostController
);

module.exports = router;