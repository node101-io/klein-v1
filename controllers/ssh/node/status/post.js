const sshRequest = require('../../../../utils/sshRequest');

const getNodeStatusCommand = require('../../../../commands/node/getStatus');
const jsonify = require('../../../../utils/jsonify');

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.session.last_connected_host,
    command: getNodeStatusCommand()
  }, (err, get_sync_status_response) => {
    if (err)
      return res.json({ err: err });

    get_sync_status_response.stdout = jsonify(get_sync_status_response.stdout);

    return res.json({
      data: {
        chain_id: get_sync_status_response.stdout.result.node_info.network,
        moniker: get_sync_status_response.stdout.result.node_info.moniker,
        latest_block_height: get_sync_status_response.stdout.result.sync_info.latest_block_height,
        is_synced: !get_sync_status_response.stdout.result.sync_info.catching_up
    } });
  });
};
