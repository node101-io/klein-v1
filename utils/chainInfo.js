const async = require('async');

const FETCH_TIMEOUT_IN_MS = 5000;
const RANDOM_PEER_COUNT = 5;
const TYPE_VALUES = [
  'chain_info',
  'state_sync_info'
];

const fetchWithTimeout = (url, callback) => {
  if (!url || typeof url != 'string' || !url.trim().length)
    return callback('bad_request');

  fetch(url, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_IN_MS)
  })
    .then(res => res.json())
    .then(res => callback(null, res))
    .catch(err => callback('network_error'));
};

const collectChainInfoFromRPCs = (data, callback) => {
  if ('is_mainnet' in data && typeof data.is_mainnet != 'boolean')
    return callback('bad_request');

  if (!data.identifier || typeof data.identifier != 'string')
    return callback('bad_request');

  fetchWithTimeout(`https://raw.githubusercontent.com/cosmos/chain-registry/master/${data.is_mainnet ? '' : 'testnets/'}${data.identifier}/chain.json`, (err, res) => {
    if (err) return callback(err);

    if (!res.apis || !res.apis.rpc || !Array.isArray(res.apis.rpc) || !res.apis.rpc.length)
      return callback('rpc_list_not_found');

    async.map(res.apis.rpc, (rpc, callback) => {
      getChainInfoFromRPC(rpc.address, (err, chain_info) => {
        if (err) return callback(null);

        return callback(null, chain_info);
      });
    }, (err, chains_info) => {
      if (err) return callback(err);

      chains_info = chains_info.filter(info => info != null);

      if (!chains_info.length)
        return callback('no_response_from_any_rpc');

      const maxBlockHeight = Math.max(...chains_info.map(info => info.height));
      const activeChainsInfo = chains_info.filter(info => info.height >= maxBlockHeight - 20);

      return callback(null, activeChainsInfo);
    });
  });
};

const getChainInfoFromRPC = (rpc, callback) => {
  async.parallel({
    chain_id: callback => fetchWithTimeout(`${rpc}/status`, (err, res) => {
      if (err) return callback(err);

      return callback(null, res.result && res.result.node_info && res.result.node_info.network ? res.result.node_info.network : null);
    }),
    version: callback => fetchWithTimeout(`${rpc}/abci_info`, (err, res) => {
      if (err) return callback(err);

      return callback(null, res.result && res.result.response && res.result.response.version ? res.result.response.version : null);
    }),
    peers: callback => fetchWithTimeout(`${rpc}/net_info`, (err, res) => {
      if (err) return callback(err);

      return callback(null, res.result && res.result.peers && res.result.peers.length > 0 ? res.result.peers.map(peer => `${peer.node_info.id}@${peer.remote_ip}:${peer.node_info.listen_addr.split(':').pop()}`).slice(0, RANDOM_PEER_COUNT) : null);
    }),
    height: callback => fetchWithTimeout(`${rpc}/block`, (err, res) => {
      if (err) return callback(err);

      return callback(null, res.result && res.result.block && res.result.block.header && res.result.block.header.height ? res.result.block.header.height : null);
    })
  }, (err, results) => {
    if (err) return callback(err);

    return callback(null, {
      rpc,
      chain_id: results.chain_id,
      version: results.version,
      peers: results.peers,
      height: results.height
    });
  });
};

const findMostCommonKeyInObject = object => {
  let mostCommon = null;
  let mostCommonCount = 0;

  for (const [key, value] of Object.entries(object))
    if (value > mostCommonCount) {
      mostCommon = key;
      mostCommonCount = value;
    };

  return mostCommon;
};

const decideRelevantChainInfo = (chains_info, callback) => {
  const chainIDs = {};
  const versions = {};
  let allPeers = [];

  chains_info.forEach(({ chain_id, version, peers }) => {
    chainIDs[chain_id] = (chainIDs[chain_id] || 0) + 1;
    versions[version] = (versions[version] || 0) + 1;
    allPeers = [...allPeers, ...peers]
  });

  const filteredPeers = allPeers.filter(peer => peer !== null);
  const randomPeers = filteredPeers.length >= 5 ? filteredPeers.sort(() => Math.random() - 0.5).slice(0, RANDOM_PEER_COUNT) : filteredPeers;

  return callback(null, {
    chain_id: findMostCommonKeyInObject(chainIDs),
    version: findMostCommonKeyInObject(versions),
    peers: randomPeers
  });
};

// const getStateSyncInfo = (chains_info, callback, index = 0) => {
//   const stateSyncInfo = {
//     rpc: null,
//     height: null,
//     hash: null
//   };

//   const chainRPC = chains_info[index];
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
//         getStateSyncInfo(chains_info, callback, index + 1)
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
    collectChainInfoFromRPCs(data, (err, chains_info) => {
      if (err) return callback(err);

      decideRelevantChainInfo(chains_info, (err, chain_info) => {
        if (err) return callback(err);

        return callback(null, chain_info);
      });
    });
  } else if (type == 'state_sync_info') {
    return callback('bad_request');
  } else {
    return callback('not_possible_error');
  };
};