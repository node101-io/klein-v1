const createGasFeeFlags = require('../functions/create-gas-fee-flags//celestiatestnet3');

module.exports = data => `
  $DAEMON_NAME tx staking edit-validator \\
    --chain-id $CHAIN_ID \\
    --keyring-backend test \\
    --yes \\
    --output json \\
    ${createGasFeeFlags(data.fees)} \\
    --from ${data.from_key_name.trim()} \\
    ${data.commission_rate ? `--commission-rate ${data.commission_rate}` : ''} \\
    ${data.identity && data.identity.trim() ? `--identity '${data.identity.trim()}'` : ''} \\
    ${data.moniker && data.moniker.trim() ? `--new-moniker '${data.moniker.trim()}'` : ''} \\
    ${data.security_contact && data.security_contact.trim() ? `--security-contact '${data.security_contact.trim()}'` : ''} \\
    ${data.website && data.website.trim() ? `--website '${data.website.trim()}'` : ''}
`;