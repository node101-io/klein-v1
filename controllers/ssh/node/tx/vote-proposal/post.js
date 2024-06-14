const sshRequest = require('../../../../../utils/sshRequest');

const voteProposalCommand = require('../../../../../commands/node/tx/voteProposal');

const VOTE_OPTIONS = ['yes', 'no', 'no_with_veto', 'abstain'];

module.exports = (req, res) => {
  if (!req.body.from_key_name || typeof req.body.from_key_name != 'string')
    return res.json({ err: 'bad_request' });

  if (!req.body.proposal_id || typeof req.body.proposal_id != 'string')
    return res.json({ err: 'bad_request' });

  if (!req.body.option || typeof req.body.option != 'string' || !VOTE_OPTIONS.includes(req.body.option))
    return res.json({ err: 'bad_request' });

  sshRequest('exec', {
    host: req.body.host,
    command: voteProposalCommand(req.body.from_key_name, req.body.proposal_id, req.body.option, req.body.fees),
    is_container: true
  }, (err, data) => {
    if (err)
      return res.json({ err: err });

    return res.json({});
  });
};