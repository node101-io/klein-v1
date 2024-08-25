const express = require('express');

const router = express.Router();

const isAuth = require('../middleware/isAuth');
const isConnectedToHost = require('../middleware/isConnectedToHost');
const setRenderFrontData = require('../middleware/setRenderFrontData');

const createValidatorGetController = require('../controllers/node/validator/get');
const delegateGetController = require('../controllers/node/delegate/get');
const indexGetController = require('../controllers/node/index/get');
const logsGetController = require('../controllers/node/logs/get');
const redelegateGetController = require('../controllers/node/redelegate/get');
const sendTokenGetController = require('../controllers/node/send-token/get');
const undelegateGetController = require('../controllers/node/undelegate/get');
const unjailGetController = require('../controllers/node/unjail/get');
const voteGetController = require('../controllers/node/vote/get');
const walletsGetController = require('../controllers/node/wallet/get');
const withdrawRewardsGetController = require('../controllers/node/withdraw-rewards/get');

router.get(
  '/',
    isAuth,
    isConnectedToHost,
    setRenderFrontData,
    indexGetController
);
router.get(
  '/create-validator',
    isAuth,
    isConnectedToHost,
    setRenderFrontData,
    createValidatorGetController
);
router.get(
  '/delegate',
    isAuth,
    isConnectedToHost,
    setRenderFrontData,
    delegateGetController
);
router.get(
  '/logs',
    isAuth,
    isConnectedToHost,
    setRenderFrontData,
    logsGetController
);
router.get(
  '/redelegate',
    isAuth,
    isConnectedToHost,
    setRenderFrontData,
    redelegateGetController
);
router.get(
  '/send-token',
    isAuth,
    isConnectedToHost,
    setRenderFrontData,
    sendTokenGetController
);
router.get(
  '/undelegate',
    isAuth,
    isConnectedToHost,
    setRenderFrontData,
    undelegateGetController
);
router.get(
  '/unjail',
    isAuth,
    isConnectedToHost,
    setRenderFrontData,
    unjailGetController
);
router.get(
  '/vote',
    isAuth,
    isConnectedToHost,
    setRenderFrontData,
    voteGetController
);
router.get(
  '/wallets',
    isAuth,
    isConnectedToHost,
    setRenderFrontData,
    walletsGetController
);
router.get(
  '/withdraw-rewards',
    isAuth,
    isConnectedToHost,
    setRenderFrontData,
    withdrawRewardsGetController
);

module.exports = router;