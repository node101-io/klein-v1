const express = require('express');

const router = express.Router();

const isAuth = require('../middleware/isAuth');

const getSavedServersGetController = require('../controllers/saved-server/get/get');
const deleteSavedServerGetController = require('../controllers/saved-server/delete/get');
const saveSavedServerPostController = require('../controllers/saved-server/save/post');

router.get(
  '/get',
    isAuth,
    getSavedServersGetController
);
router.get(
  '/delete',
    isAuth,
    deleteSavedServerGetController
);

router.post(
  '/save',
    isAuth,
    saveSavedServerPostController
);

module.exports = router;