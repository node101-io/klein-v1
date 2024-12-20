const express = require('express');

const router = express.Router();

const isAuth = require('../middleware/isAuth');
const isConnectedToHost = require('../middleware/isConnectedToHost');
const setRenderFrontData = require('../middleware/setRenderFrontData');

const indexGetController = require('../controllers/node/index/get');
const logsGetController = require('../controllers/node/logs/get');
const sendTokenGetController = require('../controllers/node/send-token/get');
const stakingGetController = require('../controllers/node/staking/get');
const validatorGetController = require('../controllers/node/validator/get');
const voteGetController = require('../controllers/node/vote/get');
const walletGetController = require('../controllers/node/wallet/get');
const withdrawRewardsGetController = require('../controllers/node/withdraw-rewards/get');

router.get(
  '/',
    isAuth,
    isConnectedToHost,
    setRenderFrontData,
    indexGetController
);
router.get(
  '/logs',
    isAuth,
    isConnectedToHost,
    setRenderFrontData,
    logsGetController
);
router.get(
  '/send-token',
    isAuth,
    isConnectedToHost,
    setRenderFrontData,
    sendTokenGetController
);
router.get(
  '/staking',
    isAuth,
    isConnectedToHost,
    setRenderFrontData,
    stakingGetController
);
router.get(
  '/validator',
    isAuth,
    isConnectedToHost,
    setRenderFrontData,
    validatorGetController
);
router.get(
  '/vote',
    isAuth,
    isConnectedToHost,
    setRenderFrontData,
    voteGetController
);
router.get(
  '/wallet',
    isAuth,
    isConnectedToHost,
    setRenderFrontData,
    walletGetController
);
router.get(
  '/withdraw-rewards',
    isAuth,
    isConnectedToHost,
    setRenderFrontData,
    withdrawRewardsGetController
);

module.exports = router;