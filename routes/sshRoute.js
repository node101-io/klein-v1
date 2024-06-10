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
const installNodePostController = require('../controllers/ssh/node/install/post');
const createKeyPostController = require('../controllers/ssh/node/key/create/post');
const deleteKeyPostController = require('../controllers/ssh/node/key/delete/post');
const getPubKeyPostController = require('../controllers/ssh/node/key/get-pub-key/post');
const listKeysPostController = require('../controllers/ssh/node/key/list/post');
const recoverKeyPostController = require('../controllers/ssh/node/key/recover/post');
const renameKeyPostController = require('../controllers/ssh/node/key/rename/post');
const restartNodePostController = require('../controllers/ssh/node/restart/post');
const startNodePostController = require('../controllers/ssh/node/start/post');
const logsNodePostController = require('../controllers/ssh/node/logs/post');
const setPeersPostController = require('../controllers/ssh/node/set-peers/post');
const setSeedsPostController = require('../controllers/ssh/node/set-seeds/post');
const stopNodePostController = require('../controllers/ssh/node/stop/post');
const uninstallNodePostController = require('../controllers/ssh/node/uninstall/post');

const checkServerListenerPostController = require('../controllers/ssh/server-listener/check/post');
const installServerListenerPostController = require('../controllers/ssh/server-listener/install/post');
const uninstallServerListenerPostController = require('../controllers/ssh/server-listener/uninstall/post');
const updateServerListenerPostController = require('../controllers/ssh/server-listener/update/post');

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
  '/node/install',
    isAuth,
    installNodePostController
);
router.post(
  '/node/key/create',
    isAuth,
    createKeyPostController
);
router.post(
  '/node/key/delete',
    isAuth,
    deleteKeyPostController
);
router.post(
  '/node/key/get-pub-key',
    isAuth,
    getPubKeyPostController
);
router.post(
  '/node/key/list',
    isAuth,
    listKeysPostController
);
router.post(
  '/node/key/recover',
    isAuth,
    recoverKeyPostController
);
router.post(
  '/node/key/rename',
    isAuth,
    renameKeyPostController
);
router.post(
  '/node/restart',
    isAuth,
    restartNodePostController
);
router.post(
  '/node/start',
    isAuth,
    startNodePostController
);
router.post(
  '/node/logs',
    isAuth,
    logsNodePostController
);
router.post(
  '/node/set-peers',
    isAuth,
    setPeersPostController
);
router.post(
  '/node/set-seeds',
    isAuth,
    setSeedsPostController
);
router.post(
  '/node/stop',
    isAuth,
    stopNodePostController
);
router.post(
  '/node/uninstall',
    isAuth,
    uninstallNodePostController
);

router.post(
  '/server-listener/check',
    isAuth,
    checkServerListenerPostController
);
router.post(
  '/server-listener/install',
    isAuth,
    installServerListenerPostController
);
router.post(
  '/server-listener/uninstall',
    isAuth,
    uninstallServerListenerPostController
);
router.post(
  '/server-listener/update',
    isAuth,
    updateServerListenerPostController
);

router.post(
  '/resource/check',
    isAuth,
    checkResourcePostController
);

module.exports = router;