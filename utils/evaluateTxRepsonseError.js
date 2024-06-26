module.exports = (tx_response, callback) => {
  if (tx_response.code == 0)
    return callback(null);
  else if (
    tx_response.code == 2 || // ErrTxDecode is returned if we cannot parse a transaction
    tx_response.code == 16 || // ErrJSONMarshal defines an ABCI typed JSON marshaling error
    tx_response.code == 17 || // ErrJSONUnmarshal defines an ABCI typed JSON unmarshalling error
    tx_response.code == 33 || // ErrPackAny defines an error when packing a protobuf message to Any fails.
    tx_response.code == 34 // ErrUnpackAny defines an error when unpacking a protobuf message from Any fails.
  )
    return callback('tx_parse_error');
  else if (tx_response.code == 3) // ErrInvalidSequence is used the sequence number (nonce) is incorrect for the signature
    return callback('tx_invalid_sequence');
  else if (tx_response.code == 4) // ErrUnauthorized is used whenever a request without sufficient authorization is handled.
    return callback('tx_unauthorized');
  else if (tx_response.code == 5) // ErrInsufficientFunds is used when the account cannot pay requested amount.
    return callback('tx_insufficient_funds');
  else if (tx_response.code == 7) // ErrInvalidAddress to doc
    return callback('tx_invalid_address');
  else if (tx_response.code == 8) // ErrInvalidPubKey to doc
    return callback('tx_invalid_pubkey');
  else if (tx_response.code == 9) // ErrUnknownAddress to doc
    return callback('tx_unknown_address');
  else if (tx_response.code == 10) // ErrInvalidCoins to doc
    return callback('tx_invalid_coins');
  else if (tx_response.code == 11) // ErrOutOfGas to doc
    return callback('tx_out_of_gas');
  else if (tx_response.code == 12) // ErrMemoTooLarge to doc
    return callback('tx_memo_too_large');
  else if (tx_response.code == 13) // ErrInsufficientFee to doc
    return callback('tx_insufficient_fee');
  else if (tx_response.code == 19) // ErrTxInMempoolCache defines an ABCI typed error where a tx already exists in the mempool.
    return callback('tx_already_in_mempool');
  else if (tx_response.code == 20) // ErrMempoolIsFull defines an ABCI typed error where the mempool is full.
    return callback('tx_mempool_is_full');
  else if (tx_response.code == 21) // ErrTxTooLarge defines an ABCI typed error where tx is too large.
    return callback('tx_too_large');
  else if (tx_response.code == 22) // ErrKeyNotFound defines an error when the key doesn't exist
    return callback('tx_key_not_found');
  else if (tx_response.code == 23) // ErrWrongPassword defines an error when the key password is invalid.
    return callback('tx_invalid_account_password');
  else if (tx_response.code == 24) // ErrorInvalidSigner defines an error when the tx intended signer does not match the given signer.
    return callback('tx_signer_mismatch');
  else if (tx_response.code == 25) // ErrorInvalidGasAdjustment defines an error for an invalid gas adjustment
    return callback('tx_invalid_gas_adjustment');
  else if (tx_response.code == 27) // ErrInvalidVersion defines a general error for an invalid version
    return callback('tx_invalid_version');
  else if (tx_response.code == 28) // ErrInvalidChainID defines an error when the chain-id is invalid.
    return callback('tx_invalid_chain_id');
  else if (tx_response.code == 29) // ErrInvalidType defines an error an invalid type.
    return callback('tx_invalid_type');
  else if (tx_response.code == 30) // ErrTxTimeoutHeight defines an error for when a tx is rejected out due to an explicitly set timeout height.
    return callback('tx_timeout_height');
  else if (tx_response.code == 32) // ErrWrongSequence defines an error where the account sequence defined in the signer info doesn't match the account's actual sequence number.
    return callback('tx_incorrect_account_sequence');
  else if (tx_response.code == 41) // ErrInvalidGasLimit defines an error when an invalid GasWanted value is supplied.
    return callback('tx_invalid_gas_limit');
  else // ErrPanic should only be set when we recovering from a panic
    return callback('unknown_error');
};