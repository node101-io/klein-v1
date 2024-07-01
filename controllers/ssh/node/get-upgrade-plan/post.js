const sshRequest = require('../../../../utils/sshRequest');
const jsonify = require('../../../../utils/jsonify');

const getUpgradePlanCommand = require('../../../../commands/node/getUpgradePlan');

const NO_UPGRADE_SCHEDULED_MESSAGE_REGEX = /Error: no upgrade scheduled/;

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.body.host,
    command: getUpgradePlanCommand(),
    in_container: true
  }, (err, get_upgrade_plan_response) => {
    if (err)
      return res.json({ err: err });

    if (NO_UPGRADE_SCHEDULED_MESSAGE_REGEX.test(get_upgrade_plan_response.stderr))
      return res.json({ data: {
        is_upgrade_planned: false
      }});

    return res.json({ data: {
      is_upgrade_planned: true,
      ...jsonify(get_upgrade_plan_response.stdout)
    }});
  });
};