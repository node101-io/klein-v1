const express = require('express');

const router = express.Router();

const isAuth = require('../middleware/isAuth');
const setRenderFrontData = require('../middleware/setRenderFrontData');

const createValidatorGetController = require('../controllers/node/create-validator/get');
const delegateGetController = require('../controllers/node/delegate/get');
const editValidatorGetController = require('../controllers/node/edit-validator/get');
const indexGetController = require('../controllers/node/index/get');
const listValidatorsGetController = require('../controllers/node/list-validators/get');
const logsGetController = require('../controllers/node/logs/get');
const redelegateGetController = require('../controllers/node/redelegate/get');
const sendTokenGetController = require('../controllers/node/send-token/get');
const undelegateGetController = require('../controllers/node/undelegate/get');
const unjailGetController = require('../controllers/node/unjail/get');
const voteGetController = require('../controllers/node/vote/get');
const walletsGetController = require('../controllers/node/wallets/get');
const withdrawRewardsGetController = require('../controllers/node/withdraw-rewards/get');

router.get(
  '/',
    isAuth,
    setRenderFrontData,
    indexGetController
);
router.get(
  '/create-validator',
    isAuth,
    setRenderFrontData,
    createValidatorGetController
);
router.get(
  '/delegate',
    isAuth,
    setRenderFrontData,
    delegateGetController
);
router.get(
  '/edit-validator',
    isAuth,
    setRenderFrontData,
    editValidatorGetController
);
router.get(
  '/list-validators',
    isAuth,
    setRenderFrontData,
    listValidatorsGetController
);
router.get(
  '/logs',
    isAuth,
    setRenderFrontData,
    logsGetController
);
router.get(
  '/redelegate',
    isAuth,
    setRenderFrontData,
    redelegateGetController
);
router.get(
  '/send-token',
    isAuth,
    setRenderFrontData,
    sendTokenGetController
);
router.get(
  '/undelegate',
    isAuth,
    setRenderFrontData,
    undelegateGetController
);
router.get(
  '/unjail',
    isAuth,
    setRenderFrontData,
    unjailGetController
);
router.get(
  '/vote',
    isAuth,
    setRenderFrontData,
    voteGetController
);
router.get(
  '/wallets',
    isAuth,
    setRenderFrontData,
    walletsGetController
);
router.get(
  '/withdraw-rewards',
    isAuth,
    setRenderFrontData,
    withdrawRewardsGetController
);

module.exports = router;