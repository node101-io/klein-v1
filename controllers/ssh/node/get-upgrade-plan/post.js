const sshRequest = require('../../../../utils/sshRequest');
const jsonify = require('../../../../utils/jsonify');

const getUpgradePlanCommand = require('../../../../commands/node/getUpgradePlan');

const NO_UPGRADE_SCHEDULED_MESSAGE_REGEX = /Error: no upgrade scheduled/;

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.body.host,
    command: getUpgradePlanCommand(),
    in_container: true
  }, (err, upgrade_plan) => {
    if (NO_UPGRADE_SCHEDULED_MESSAGE_REGEX.test(err))
      return res.json({ data: {
        is_upgrade_planned: false
      }});

    if (err && err != 'command_not_found')
      return res.json({ err: 'unknown_error' });

    if (err)
      return res.json({ err: err });

    return res.json({ data: {
      is_upgrade_planned: true,
      ...jsonify(upgrade_plan)
    }});
  });
};