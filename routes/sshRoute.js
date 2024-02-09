const express = require('express');

const router = express.Router();

const sshPostController = require('../controllers/ssh/post');

router.post(
  '/',
    sshPostController
);

module.exports = router;