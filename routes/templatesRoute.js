
const express = require('express');

const router = express.Router();

const isAuth = require('../middleware/isAuth');

const templatesGeneralProjectWrapperPostController = require('../controllers/templates/general-project-wrapper/post');
const templatesIndexLoginProjectWrapperPostController = require('../controllers/templates/index-login-project-wrapper/post');
const setRenderFrontData = require('../middleware/setRenderFrontData');

router.post(
  '/general-project-wrapper',
    isAuth,
    setRenderFrontData,
    templatesGeneralProjectWrapperPostController
);
router.post(
  '/index-login-project-wrapper',
    isAuth,
    setRenderFrontData,
    templatesIndexLoginProjectWrapperPostController
);

module.exports = router;
