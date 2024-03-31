const express = require('express');

const router = express.Router();

const isAuth = require('../middleware/isAuth');

const endConnectionPostController = require('../controllers/ssh/connection/end/post');
const connectKeyPostController = require('../controllers/ssh/connection/key/post');
const connectPasswordPostController = require('../controllers/ssh/connection/password/post');

const checkDockerPostController = require('../controllers/ssh/docker/check/post');
const installDockerPostController = require('../controllers/ssh/docker/install/post');
const uninstallDockerPostController = require('../controllers/ssh/docker/uninstall/post');

const createLocalKeysPostController = require('../controllers/ssh/key/local/create/post');
const removeLocalKeysPostController = require('../controllers/ssh/key/local/remove/post');
const showLocalKeysPostController = require('../controllers/ssh/key/local/show/post');
const addRemoteKeysPostController = require('../controllers/ssh/key/remote/add/post');
const removeRemoteKeysPostController = require('../controllers/ssh/key/remote/remove/post');
const showRemoteKeysPostController = require('../controllers/ssh/key/remote/show/post');

const checkNodePostController = require('../controllers/ssh/node/check/post');

const checkNodeListenerPostController = require('../controllers/ssh/node-listener/check/post');
const installNodeListenerPostController = require('../controllers/ssh/node-listener/install/post');
const uninstallNodeListenerPostController = require('../controllers/ssh/node-listener/uninstall/post');
const updateNodeListenerPostController = require('../controllers/ssh/node-listener/update/post');

const checkResourcePostController = require('../controllers/ssh/resource/check/post');

router.post(
  '/connection/end',
    isAuth,
    endConnectionPostController
);
router.post(
  '/connection/key',
    isAuth,
    connectKeyPostController
);
router.post(
  '/connection/password',
    isAuth,
    connectPasswordPostController
);

router.post(
  '/key/local/create',
    isAuth,
    createLocalKeysPostController
);
router.post(
  '/key/local/remove',
  isAuth,
  removeLocalKeysPostController
);
router.post(
  '/key/local/show',
    isAuth,
    showLocalKeysPostController
);
router.post(
  '/key/remote/add',
  isAuth,
    addRemoteKeysPostController
);
router.post(
  '/key/remote/remove',
    isAuth,
    removeRemoteKeysPostController
);
router.post(
  '/key/remote/show',
    isAuth,
    showRemoteKeysPostController
);

router.post(
  '/docker/check',
    isAuth,
    checkDockerPostController
);
router.post(
  '/docker/install',
    isAuth,
    installDockerPostController
);
router.post(
  '/docker/uninstall',
    isAuth,
    uninstallDockerPostController
);

router.post(
  '/node/check',
    isAuth,
    checkNodePostController
);

router.post(
  '/node-listener/check',
    isAuth,
    checkNodeListenerPostController
);
router.post(
  '/node-listener/install',
    isAuth,
    installNodeListenerPostController
);
router.post(
  '/node-listener/uninstall',
    isAuth,
    uninstallNodeListenerPostController
);
router.post(
  '/node-listener/update',
    isAuth,
    updateNodeListenerPostController
);

router.post(
  '/resource/check',
    isAuth,
    checkResourcePostController
);

module.exports = router;