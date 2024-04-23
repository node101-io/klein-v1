const express = require('express');

const router = express.Router();

const isAuth = require('../middleware/isAuth');
const preferenceGetController = require('../controllers/preference/get');
const preferencePostController = require('../controllers/preference/post');

router.get(
  '/get',
    isAuth,
    preferenceGetController
);

router.post(
  '/set',
    isAuth,
    preferencePostController
);

module.exports = router;