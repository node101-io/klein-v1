const createGasFeeFlags = require('./functions/createGasFeeFlags');

module.exports = data => `
  $DAEMON_NAME tx staking edit-validator \\
    --chain-id $CHAIN_ID \\
    --keyring-backend test \\
    --yes \\
    --output json \\
    ${createGasFeeFlags(data.fees)} \\
    --from ${data.from_key_name.trim()} \\
    ${data.commission_rate ? `--commission-rate ${data.commission_rate}` : ''} \\
    ${data.identity.trim() ? `--new-identity ${data.identity.trim()}` : ''} \\
    ${data.moniker.trim() ? `--new-moniker ${data.moniker.trim()}` : ''} \\
    ${data.security_contact.trim() ? `--security-contact ${data.security_contact.trim()}` : ''} \\
    ${data.website.trim() ? `--new-website ${data.website.trim()}` : ''}
`;