const express = require('express');

const router = express.Router();

const connectPostController = require('../controllers/ssh/connect/post');
const disconnectPostController = require('../controllers/ssh/disconnect/post');
const execPostController = require('../controllers/ssh/exec/post');
const streamPostController = require('../controllers/ssh/stream/post');

router.post(
  '/connect',
  connectPostController
);
router.post(
  '/disconnect',
  disconnectPostController
);
router.post(
  '/exec',
  execPostController
);
router.post(
  '/stream',
  streamPostController
);

module.exports = router;