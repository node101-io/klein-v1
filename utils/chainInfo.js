const fetch = require('node-fetch');

const controller = new AbortController();

const FETCH_TIMEOUT_IN_MS = 5000;
const PEER_COUNT = 5;
const TYPE_VALUES = [
  'chain_info',
  'state_sync_info'
];

const getRPCList = (data, callback) => {
  if (typeof data.is_mainnet != 'boolean')
    return callback('bad_request');

  if (!data.identifier || typeof data.identifier != 'string')
    return callback('bad_request');

  fetch(`https://raw.githubusercontent.com/cosmos/chain-registry/master${data.is_mainnet ? '' : '/testnets'}/${data.identifier}/chain.json`)
    .then(res => res.json())
    .then(res => {
      if (res.apis && res.apis.rpc) {
        callback(null, res.apis.rpc.map(rpc => {
          rpc.address
        }));
      };
    })
    .catch(err => callback('chain_folder_not_found'));
};

const fetchWithTimeout = (rpc, callback) => {
  const timeoutId = setTimeout(() => {
    controller.abort();
    callback('request_timeout');
  }, FETCH_TIMEOUT_IN_MS);

  fetch(rpc, { signal: controller.signal })
    .then(res => {
      clearTimeout(timeoutId);
      callback(null, res);
    })
    .catch(err => {
      clearTimeout(timeoutId);
      callback('request_error');
    });
};

const getChainInfo = (rpc, callback) => {
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
          }).slice(0, PEER_COUNT);
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
      return callback('no_chain_info_found');

    return callback(null, chainInfo);
  }, FETCH_TIMEOUT_IN_MS + 1000); // ????
};

const findRPCListWithChainInfo = (rpcList, callback) => {
  const rpcListWithChainInfo = [];

  for (let i = 0; i < rpcList.length; i++)
    getChainInfo(rpcList[i], (err, res) => {
      if (err) return;

      rpcListWithChainInfo.push(res);

      if (rpcListWithChainInfo.length == rpcList.length)
        return callback(null, rpcListWithChainInfo);
    });

  setTimeout(() => {
    if (rpcListWithChainInfo.length == 0)
      return callback('no_rpc_responses');

    const maxHeight = Math.max(...rpcListWithChainInfo.map(res => res.height));
    const filteredResults = rpcListWithChainInfo.filter(res => res.height >= maxHeight - 20);

    return callback(null, filteredResults);
  }, FETCH_TIMEOUT_IN_MS + 1000); // ????
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

const getSyncHeightHash = (data, callback) => {
  fetch(`${data.rpc}/block?height=${data.height}`)
    .then(res => res.json())
    .then(res => res.result.block_id.hash)
    .then(res => callback(null, res))
    .catch();
};

module.exports = (type, data, callback) => {
  if (!type || typeof type != 'string' || !TYPE_VALUES.includes(type))
    return callback('bad_request');

  if (!data || typeof data != 'object')
    return callback('bad_request');

  if (type == 'chain_info') {
    getRPCList(data, (err, res) => {
      if (err) return callback(err);

      findRPCListWithChainInfo(res, (err, res) => {
        if (err) return callback(err);

        if (res.length == 0) return callback('no_valid_rpc_responses');

        const chainIDs = {};
        const versions = {};
        const allPeers = [];

        res.forEach(({ chainID, version, peers }) => {
          chainIDs[chainID] = (chainIDs[chainID] || 0) + 1;
          versions[version] = (versions[version] || 0) + 1;
          allPeers = allPeers.concat(peers);
        });

        const filteredPeers = allPeers.filter(peer => peer !== null);
        const randomPeers = filteredPeers.length >= 5 ? filteredPeers.sort(() => Math.random() - 0.5).slice(0, PEER_COUNT) : filteredPeers;

        callback(null, {
          chainID: findMostCommon(chainIDs),
          version: findMostCommon(versions),
          peers: randomPeers
        });
      });
    });
  } else if (type == 'state_sync_info') {
    getRPCList(data, (err, res) => {
      if (err) return callback(err);

      findRPCListWithChainInfo(res, (err, res) => {
        if (err) return callback(err);

        if (res.length == 0) return callback('no_valid_rpc_responses');

        const randomChainInfo = res[Math.floor(Math.random() * res.length)];
        const latestHeight = randomChainInfo.height;
        const syncHeight = latestHeight - 1000;

        getSyncHeightHash({ 
          rpc: randomChainInfo.rpc,
          height: syncHeight
        }, (err, res) => {
          if (err) return callback(err);

          callback(null, {
            rpc: randomChainInfo.rpc,
            height: syncHeight,
            hash: res
          });
        });
      });
    });
  };
};
