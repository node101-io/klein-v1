const async = require('async');

const fetch = require('../../../utils/fetch');

const FETCH_TIMEOUT_IN_MS = 5000;
const RANDOM_PEER_COUNT = 5;
const RANDOM_SEED_COUNT = 5;
const TYPE_VALUES = [
  'chain_info',
  'state_sync_info'
];

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

const collectChainInfoFromRPCs = (data, callback) => {
  if (!data.network || typeof data.network != 'string') // TODO
    return callback('bad_request');

  if (!('is_mainnet' in data) && typeof data.is_mainnet != 'boolean')
    return callback('bad_request');

  if (!data.project || typeof data.project != 'string')
    return callback('bad_request');

  fetch(`https://raw.githubusercontent.com/cosmos/chain-registry/master/${data.is_mainnet ? '' : 'testnets/'}${data.project}/chain.json`, {
    timeout: FETCH_TIMEOUT_IN_MS
  }, (err, res) => {
    if (err) return callback(err);

    if (!res.apis || !res.apis.rpc || !Array.isArray(res.apis.rpc) || !res.apis.rpc.length)
      return callback('rpc_list_not_found');

    if (!res.fees || !res.fees.fee_tokens || !Array.isArray(res.fees.fee_tokens) || !res.fees.fee_tokens.length || !res.fees.fee_tokens[0] || !res.fees.fee_tokens[0].denom || typeof res.fees.fee_tokens[0].denom != 'string')
      return callback('denom_not_found');

    if (!('fixed_min_gas_price' in res.fees.fee_tokens[0]) || typeof res.fees.fee_tokens[0].fixed_min_gas_price != 'number')
      return callback('min_gas_price_not_found');

    if (!res.peers || !res.peers.seeds || !Array.isArray(res.peers.seeds) || !res.peers.seeds.length)
      return callback('seeds_not_found');

    if (!res.codebase || !res.codebase.genesis || !res.codebase.genesis.genesis_url || typeof res.codebase.genesis.genesis_url != 'string')
      return callback('genesis_file_not_found');

    if (!res.codebase || !res.codebase.git_repo || typeof res.codebase.git_repo != 'string')
      return callback('git_repo_not_found');

    async.map(res.apis.rpc, (rpc, callback) => {
      getChainInfoFromRPC(rpc.address, (err, chain_info) => {
        if (err) return callback(null);

        return callback(null, {
          rpc: rpc.address,
          ...chain_info
        });
      });
    }, (err, chains_info) => {
      if (err) return callback(err);

      chains_info = chains_info.filter(info => !!info);

      if (!chains_info.length)
        return callback('no_response_from_any_rpc');

      const maxBlockHeight = Math.max(...chains_info.map(info => info.height));
      const activeChainsInfo = chains_info.filter(info => info.height >= maxBlockHeight - 20);

      decideRelevantChainInfo(activeChainsInfo, (err, chain_info) => {
        if (err) return callback(err);

        return callback(null, {
          ...chain_info,
          denom: res.fees.fee_tokens[0].denom,
          min_gas_price: res.fees.fee_tokens[0].fixed_min_gas_price,
          seeds: res.peers.seeds.map(seed => `${seed.id}@${seed.address}`).slice(0, RANDOM_SEED_COUNT),
          genesis_file: res.codebase.genesis.genesis_url,
          repo: res.codebase.git_repo
        });
      });
    });
  });
};

const getChainInfoFromRPC = (rpc, callback) => {
  async.parallel({
    chain_id: callback => fetch(`${rpc}/status`, {
      timeout: FETCH_TIMEOUT_IN_MS
    }, (err, res) => {
      if (err) return callback(err);

      if (!res.result || !res.result.node_info || !res.result.node_info.network || typeof res.result.node_info.network != 'string')
        return callback('status_route_error');

      return callback(null, res.result.node_info.network);
    }),
    version: callback => fetch(`${rpc}/abci_info`, {
      timeout: FETCH_TIMEOUT_IN_MS
    }, (err, res) => {
      if (err) return callback(err);

      if (!res.result || !res.result.response || !res.result.response.version || typeof res.result.response.version != 'string')
        return callback('abci_info_route_error');

      return callback(null, res.result.response.version);
    }),
    peers: callback => fetch(`${rpc}/net_info`, {
      timeout: FETCH_TIMEOUT_IN_MS
    }, (err, res) => {
      if (err) return callback(err);

      if (!res.result || !res.result.peers || !Array.isArray(res.result.peers))
        return callback('net_info_route_error');

      const peers = [];

      for (let i = 0; i < res.result.peers.length; i++) {
        if (peers.length >= RANDOM_PEER_COUNT) break;

        const peer = res.result.peers[i];

        if (!peer.node_info || !peer.node_info.id || !peer.remote_ip || !peer.node_info.listen_addr || typeof peer.node_info.id != 'string' || typeof peer.remote_ip != 'string' || typeof peer.node_info.listen_addr != 'string')
          continue;

        if (peer.remote_ip.includes('0.0.0.0'))
          continue;

        peers.push(`${peer.node_info.id}@${peer.remote_ip.split(':').shift()}:${peer.node_info.listen_addr.split(':').pop()}`);
      };

      return callback(null, peers);
    }),
    height: callback => fetch(`${rpc}/block`, {
      timeout: FETCH_TIMEOUT_IN_MS
    }, (err, res) => {
      if (err) return callback(err);

      return callback(null, res.result && res.result.block && res.result.block.header && res.result.block.header.height ? res.result.block.header.height : null);
    })
  }, (err, results) => {
    if (err) return callback(err);

    return callback(null, {
      chain_id: results.chain_id,
      version: results.version,
      peers: results.peers,
      height: results.height
    });
  });
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

  const version = findMostCommonKeyInObject(versions);

  return callback(null, {
    chain_id: findMostCommonKeyInObject(chainIDs),
    version: version.startsWith('v') ? version : `v${version}`,
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

//   fetch(`${chainRPC.rpc}/block?height=${trustHeight}`, (err, res) => {
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

module.exports = (req, res) => {
  if (!req.query.type || typeof req.query.type != 'string' || !TYPE_VALUES.includes(req.query.type))
    return res.json({ err: 'bad_request' });

  if (!req.query.network || typeof req.query.network != 'string')
    return res.json({ err: 'bad_request' });

  if (!req.query.project || typeof req.query.project != 'string')
    return res.json({ err: 'bad_request' });

  if (!req.query.is_mainnet || typeof req.query.is_mainnet != 'string' || (req.query.is_mainnet != 'true' && req.query.is_mainnet != 'false'))
    return res.json({ err: 'bad_request' });

  if (req.query.type == 'chain_info')
    collectChainInfoFromRPCs({
      network: req.query.network,
      project: req.query.project,
      is_mainnet: JSON.parse(req.query.is_mainnet)
    }, (err, chain_info) => {
      if (err) return res.json({ err: err });

      return res.json({ data: chain_info });
    });
  else if (req.query.type == 'state_sync_info')
    return res.json({ err: 'bad_request' });
  else
    return res.json({ err: 'not_possible_error' });
};