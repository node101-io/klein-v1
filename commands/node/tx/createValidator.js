const createGasFeeFlags = require('./functions/createGasFeeFlags');

module.exports = data => `
  $DAEMON_NAME tx staking create-validator \\
    --chain-id $CHAIN_ID \\
    --keyring-backend test \\
    --yes \\
    --output json \\
    ${createGasFeeFlags(data.fees)} \\
    --from ${data.from_key_name.trim()} \\
    --pubkey $($DAEMON_NAME tendermint show-validator) \\
    --min-self-delegation 1 \\
    --amount ${data.amount}$DENOM \\
    --commission-max-change-rate ${data.commission_max_change_rate} \\
    --commission-max-rate ${data.commission_max_rate} \\
    --commission-rate ${data.comission_rate} \\
    --moniker ${data.moniker.trim()} \\
    ${data.details.trim() ? `--details ${data.details.trim()}` : ''} \\
    ${data.identity.trim() ? `--identity ${data.identity.trim()}` : ''} \\
    ${data.security_contact.trim() ? `--security-contact ${data.security_contact.trim()}` : ''} \\
    ${data.website.trim() ? `--website ${data.website.trim()}` : ''}
`;