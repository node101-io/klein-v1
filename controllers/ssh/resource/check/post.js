const sshRequest = require("../../../../utils/sshRequest");
const jsonify = require("../../../../utils/jsonify");

const checkCPUCommand = require("../../../../commands/resource/checkCPU");
const checkMemoryCommand = require("../../../../commands/resource/checkMemory");
const checkStorageCommand = require("../../../../commands/resource/checkStorage");

const MAX_CPU_USAGE_PERCENTAGE = 50;
const MAX_MEMORY_USAGE_PERCENTAGE = 80;
const MAX_DISK_USAGE_PERCENTAGE = 60;

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.body.host,
    command: checkCPUCommand()
  }, (err, data) => {
    if (err)
      return res.json({ err: err });

    // Example output: 82.3

    const idleCpu = jsonify(data);

    if (!idleCpu || idleCpu < 0 || idleCpu > 100)
      return res.json({ err: 'cpu_usage_error' });

    if (100 - idleCpu > MAX_CPU_USAGE_PERCENTAGE)
      return res.json({ err: 'cpu_usage_high' });

    sshRequest('exec', {
      host: req.body.host,
      command: checkMemoryCommand()
    }, (err, data) => {
      if (err)
        return res.json({ err: err });

      // Example output: { "total": "3923.9", "free": "2158.6", "cache": "1496.8" }

      const memory = jsonify(data);

      if (!memory || !memory.total || !memory.free || !memory.cache)
        return res.json({ err: 'memory_usage_error' });

      if ((parseFloat(memory.free) + parseFloat(memory.cache)) / parseFloat(memory.total) * 100 < MAX_MEMORY_USAGE_PERCENTAGE)
        return res.json({ err: 'memory_usage_high' });

      sshRequest('exec', {
        host: req.body.host,
        command: checkStorageCommand()
      }, (err, data) => {
        if (err)
          return res.json({ err: err });

        // Example output: { "total": "81106868", "available": "78707520" }

        const disk = jsonify(data);

        if (!disk || !disk.total || !disk.available)
          return res.json({ err: 'disk_usage_error' });

        if (parseFloat(disk.available) / parseFloat(disk.total) * 100 < 100 - MAX_DISK_USAGE_PERCENTAGE)
          return res.json({ err: 'disk_usage_high' });

        return res.json({});
      });
    });
  });
};