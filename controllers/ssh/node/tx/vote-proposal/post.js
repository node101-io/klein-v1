const sshRequest = require('../../../../../utils/sshRequest');
const evaluateTxResponseError = require('../../../../../utils/evaluateTxResponseError');
const jsonify = require('../../../../../utils/jsonify');

const voteProposalCommand = require('../../../../../commands/node/tx/voteProposal');

const DEFAULT_TEXT_FIELD_LENGTH = 1e4;
const KEY_NOT_FOUND_ERROR_MESSAGE_REGEX = /Error: (.*?): key not found/;
const VOTE_OPTIONS = [ 'yes', 'no', 'no_with_veto', 'abstain' ];

module.exports = (req, res) => {
  if (!req.body.from_key_name || typeof req.body.from_key_name != 'string' || !req.body.from_key_name.trim().length || req.body.from_key_name.length > DEFAULT_TEXT_FIELD_LENGTH)
    return res.json({ err: 'bad_request' });

  if (!req.body.proposal_id || typeof req.body.proposal_id != 'string' || !req.body.proposal_id.trim().length || req.body.proposal_id.length > DEFAULT_TEXT_FIELD_LENGTH)
    return res.json({ err: 'bad_request' });

  if (!req.body.option || typeof req.body.option != 'string' || !VOTE_OPTIONS.includes(req.body.option))
    return res.json({ err: 'bad_request' });

  sshRequest('exec', {
    host: req.body.host,
    command: voteProposalCommand({
      fees: req.body.fees,
      from_key_name: req.body.from_key_name,
      option: req.body.option,
      proposal_id: req.body.proposal_id
    }),
    is_container: true
  }, (err, tx_response) => {
    if (err)
      return res.json({ err: err });

    if (KEY_NOT_FOUND_ERROR_MESSAGE_REGEX.test(tx_response))
      return res.json({ err: 'key_not_found' });

    tx_response = jsonify(tx_response);

    evaluateTxResponseError(tx_response, err => {
      if (err)
        return res.json({ err: err, data: tx_response });

      return res.json({ data: tx_response });
    });
  });
};