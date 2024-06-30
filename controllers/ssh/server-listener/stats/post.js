const sshRequest = require('../../../../utils/sshRequest');
const jsonify = require('../../../../utils/jsonify');

const checkServerStats = require('../../../../commands/server-listener/checkServerStats');

const MAX_CPU_USAGE_PERCENTAGE = 50;
const MAX_MEMORY_USAGE_PERCENTAGE = 80;
const MAX_DISK_USAGE_PERCENTAGE = 60;

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.body.host,
    command: checkServerStats()
  }, (err, stats) => {
    stats = jsonify(stats);

    if (err)
      return res.json({ err: err });

    if (!stats)
      return res.json({ err: 'server_stats_error' });

    if (!stats.memory || !stats.memory.total || !stats.memory.used || !stats.memory.available)
      return res.json({ err: 'memory_usage_error' });

    if (!stats.cpu || !stats.cpu.average_used || !stats.cpu.cores)
      return res.json({ err: 'cpu_usage_error' });

    if (!stats.disk || !stats.disk.total || !stats.disk.used || !stats.disk.available)
      return res.json({ err: 'disk_usage_error' });

    if (parseFloat(stats.cpu.average_used) > MAX_CPU_USAGE_PERCENTAGE)
      return res.json({ err: 'cpu_usage_high' });

    if (parseFloat(stats.memory.used) / parseFloat(stats.memory.total) * 100 > MAX_MEMORY_USAGE_PERCENTAGE)
      return res.json({ err: 'memory_usage_high' });

    if (parseFloat(stats.disk.used) / parseFloat(stats.disk.total) * 100 > MAX_DISK_USAGE_PERCENTAGE)
      return res.json({ err: 'disk_usage_high' });

    return res.json({});
  });
};