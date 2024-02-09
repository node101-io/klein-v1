const express = require('express');

const router = express.Router();

const notificationPostController = require('../controllers/notification/post');

router.post(
  '/',
    notificationPostController
);

module.exports = router;