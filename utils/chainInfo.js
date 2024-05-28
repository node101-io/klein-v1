const fetch = require('node-fetch');

const controller = new AbortController();

const FETCH_TIMEOUT_IN_MS = 5000;
const RETURN_TIMEOUT_IN_MS = 1000;
const RANDOM_PEER_COUNT = 5;
const TYPE_VALUES = [
  'chain_info',
  'state_sync_info'
];

const getRPCList = (data, callback) => {
  if (typeof data.is_mainnet != 'boolean')
    return callback('bad_request');

  if (!data.identifier || typeof data.identifier != 'string')
    return callback('bad_request');

  fetchWithTimeout(`https://raw.githubusercontent.com/cosmos/chain-registry/master${data.is_mainnet ? '' : '/testnets'}/${data.identifier}/chain.json`, (err, res) => {
    if (err) return;

    res.json()
      .then(res => {
        if (res.apis && res.apis.rpc) {
          callback(null, res.apis.rpc.map(rpc => rpc.address));
        };
      })
      .catch(err => callback('document_not_found'));
  });
};

const fetchWithTimeout = (url, callback, timeout = FETCH_TIMEOUT_IN_MS) => {
  const timeoutId = setTimeout(() => {
    controller.abort();
    callback('request_timeout');
  }, timeout);

  fetch(url, { signal: controller.signal })
    .then(res => {
      clearTimeout(timeoutId);
      callback(null, res);
    })
    .catch(err => {
      clearTimeout(timeoutId);
      callback('request_error');
    });
};

const getRPCInfo = (rpc, callback) => {
  const chainInfo = {
    rpc: rpc,
    chainID: null,
    version: null,
    peers: null,
    height: null
  };

  fetchWithTimeout(`${rpc}/status`, (err, res) => {
    if (err) return;

    res.json()
      .then(res => {
        if (res.result && res.result.node_info && res.result.node_info.network)
          chainInfo.chainID = res.result.node_info.network;
      })
      .catch(err => null);
  });

  fetchWithTimeout(`${rpc}/abci_info`, (err, res) => {
    if (err) return;

    res.json()
      .then(res => {
        if (res.result && res.result.response && res.result.response.version)
          chainInfo.version = res.result.response.version;
      })
      .catch(err => null);
  });

  fetchWithTimeout(`${rpc}/net_info`, (err, res) => {
    if (err) return;

    res.json()
      .then(res => {
        if (res.result && res.result.peers && res.result.peers.length > 0)
          chainInfo.peers = res.result.peers.map(peer => {
            const id = peer.node_info.id;
            const remoteIp = peer.remote_ip;
            const listenAddrParts = peer.node_info.listen_addr.split(':');
            const lastPartOfListenAddr = listenAddrParts[listenAddrParts.length - 1];
            return `${id}@${remoteIp}:${lastPartOfListenAddr}`;
          }).slice(0, RANDOM_PEER_COUNT);
      })
      .catch(err => null);
  });

  fetchWithTimeout(`${rpc}/block`, (err, res) => {
    if (err) return;

    res.json()
      .then(res => {
        if (res.result && res.result.block && res.result.block.header && res.result.block.header.height)
          chainInfo.height = res.result.block.header.height;
      })
      .catch(err => null);
  });

  setTimeout(() => {
    if (!chainInfo.chainID && !chainInfo.version && !chainInfo.peers && !chainInfo.height)
      return;

    return callback(null, chainInfo);
  }, FETCH_TIMEOUT_IN_MS + RETURN_TIMEOUT_IN_MS); // ????
};

const filterAndFormatTheRPCList = (rpcList, callback) => {
  const rpcListWithChainInfo = [];

  for (let i = 0; i < rpcList.length; i++)
    getRPCInfo(rpcList[i], (err, rpcInfo) => {
      if (err) return callback(err);

      rpcListWithChainInfo.push(rpcInfo);
    });

  setTimeout(() => {
    if (!rpcListWithChainInfo.length)
      return callback('no_response_from_any_rpc');

    const maxHeight = Math.max(...rpcListWithChainInfo.map(info => info.height));
    const filteredRPCList = rpcListWithChainInfo.filter(info => info.height >= maxHeight - 20);

    return callback(null, filteredRPCList);
  }, FETCH_TIMEOUT_IN_MS + RETURN_TIMEOUT_IN_MS); // ????
};

const findMostCommon = object => {
  let mostCommon = null;
  let mostCommonCount = 0;

  for (const [key, value] of Object.entries(object))
    if (value > mostCommonCount) {
      mostCommon = key;
      mostCommonCount = value;
    };

  return mostCommon;
};

const getChainInfo = (filteredRPCList, callback) => {
  const chainIDs = {};
  const versions = {};
  let allPeers = [];

  filteredRPCList.forEach(({ chainID, version, peers }) => {
    chainIDs[chainID] = (chainIDs[chainID] || 0) + 1;
    versions[version] = (versions[version] || 0) + 1;
    allPeers = allPeers.concat(peers);
  });

  const filteredPeers = allPeers.filter(peer => peer !== null);
  const randomPeers = filteredPeers.length >= 5 ? filteredPeers.sort(() => Math.random() - 0.5).slice(0, RANDOM_PEER_COUNT) : filteredPeers;

  callback(null, {
    chainID: findMostCommon(chainIDs),
    version: findMostCommon(versions),
    peers: randomPeers
  });
};

// const getStateSyncInfo = (filteredRPCList, callback, index = 0) => {
//   const stateSyncInfo = {
//     rpc: null,
//     height: null,
//     hash: null
//   };

//   const chainRPC = filteredRPCList[index];
//   const trustHeight = chainRPC.height - 1000;

//   fetchWithTimeout(`${chainRPC.rpc}/block?height=${trustHeight}`, (err, res) => {
//     if (err) return;

//     res.json()
//       .then(res => {
//         if (res.result && res.result.block_id && res.result.block_id.hash) {
//           stateSyncInfo.rpc = chainRPC.rpc;
//           stateSyncInfo.height = trustHeight;
//           stateSyncInfo.hash = res.result.block_id.hash;
//         };
//       })
//       .catch(err =>
//         getStateSyncInfo(filteredRPCList, callback, index + 1)
//       );
//   }, FETCH_TIMEOUT_IN_MS * 3);

//   setTimeout(() => {
//     if (!stateSyncInfo.rpc && !stateSyncInfo.height && !stateSyncInfo.hash)
//       return;

//     return callback(null, stateSyncInfo);
//   }, FETCH_TIMEOUT_IN_MS * 3 + RETURN_TIMEOUT_IN_MS); // ????
// };

module.exports = (type, data, callback) => {
  if (!type || typeof type != 'string' || !TYPE_VALUES.includes(type))
    return callback('bad_request');

  if (!data || typeof data != 'object')
    return callback('bad_request');

  if (type == 'chain_info') {
    getRPCList(data, (err, rpcList) => {
      if (err) return callback(err);

      filterAndFormatTheRPCList(rpcList, (err, filteredRPCList) => {
        if (err) return callback(err);

        getChainInfo(filteredRPCList, (err, chainInfo) => {
          if (err) return callback(err);

          callback(null, chainInfo);
        });
      });
    });
  } else if (type == 'state_sync_info') {
    return callback('bad_request');
  } else {
    return callback('not_possible_error');
  };
};
