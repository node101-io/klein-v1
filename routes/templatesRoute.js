
const express = require('express');

const router = express.Router();

const isAuth = require('../middleware/isAuth');
const setRenderFrontData = require('../middleware/setRenderFrontData');

const templatesGeneralProjectWrapperPostController = require('../controllers/templates/general-project-wrapper/post');
const templatesIndexLoginProjectWrapperPostController = require('../controllers/templates/index-login-project-wrapper/post');
const indexLoginRightButtonWrapperPostController = require('../controllers/templates/index-login-right-button-wrapper/post');

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
router.post(
  '/index-login-right-button-wrapper',
    isAuth,
    setRenderFrontData,
    indexLoginRightButtonWrapperPostController
);

module.exports = router;
