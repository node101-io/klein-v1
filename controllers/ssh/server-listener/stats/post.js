const sshRequest = require('../../../../utils/sshRequest');
const jsonify = require('../../../../utils/jsonify');

const getServerStats = require('../../../../commands/server-listener/getServerStats');

const MAX_CPU_USAGE_PERCENTAGE = 50;
const MAX_MEMORY_USAGE_PERCENTAGE = 80;
const MAX_DISK_USAGE_PERCENTAGE = 60;

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.session.last_connected_host,
    command: getServerStats()
  }, (err, check_server_stats_response) => {
    if (err)
      return res.json({ err: err });

    check_server_stats_response.stdout = jsonify(check_server_stats_response.stdout);

    if (!check_server_stats_response.stdout)
      return res.json({ err: 'server_stats_error' });

    if (!check_server_stats_response.stdout.memory || !check_server_stats_response.stdout.memory.total || !check_server_stats_response.stdout.memory.used || !check_server_stats_response.stdout.memory.available)
      return res.json({ err: 'server_stats_error' });

    if (!check_server_stats_response.stdout.cpu || !check_server_stats_response.stdout.cpu.average_used || !check_server_stats_response.stdout.cpu.cores)
      return res.json({ err: 'server_stats_error' });

    if (!check_server_stats_response.stdout.disk || !check_server_stats_response.stdout.disk.total || !check_server_stats_response.stdout.disk.used || !check_server_stats_response.stdout.disk.available)
      return res.json({ err: 'server_stats_error' });

    if (parseFloat(check_server_stats_response.stdout.cpu.average_used) > MAX_CPU_USAGE_PERCENTAGE)
      return res.json({ err: 'resource_usage_high' });

    if (parseFloat(check_server_stats_response.stdout.memory.used) / parseFloat(check_server_stats_response.stdout.memory.total) * 100 > MAX_MEMORY_USAGE_PERCENTAGE)
      return res.json({ err: 'resource_usage_high' });

    if (parseFloat(check_server_stats_response.stdout.disk.used) / parseFloat(check_server_stats_response.stdout.disk.total) * 100 > MAX_DISK_USAGE_PERCENTAGE)
      return res.json({ err: 'resource_usage_high' });

    return res.json({ data: check_server_stats_response.stdout });
  });
};
