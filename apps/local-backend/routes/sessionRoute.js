const express = require('express');

const router = express.Router();

const deletePostController = require('../controllers/session/delete/post');
const destroyPostController = require('../controllers/session/destroy/post');
const getPostController = require('../controllers/session/get/post');
const setPostController = require('../controllers/session/set/post');

router.post(
  '/delete',
    deletePostController
);
router.post(
  '/destroy',
    destroyPostController
);
router.post(
  '/get',
    getPostController
);
router.post(
  '/set',
    setPostController
);

module.exports = router;