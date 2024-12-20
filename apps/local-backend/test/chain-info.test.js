const chainInfo = require('../utils/chainInfo');

describe('error: type_checks', () => {
  it('should call a callback with a "bad_request" if no type is provided', done => {
    chainInfo(null, { is_mainnet: true, identifier: 'cosmoshub' }, (err, res) => {
      expect(err).toBe('bad_request');
      done();
    });
  });

  it('should call a callback with a "bad_request" if type is not a string', done => {
    chainInfo(123, { is_mainnet: true, identifier: 'cosmoshub' }, (err, res) => {
      expect(err).toBe('bad_request');
      done();
    });
  });

  it('should call a callback with a "bad_request" if type is not in the TYPE_VALUES array', done => {
    chainInfo('not_a_type', { is_mainnet: true, identifier: 'cosmoshub' }, (err, res) => {
      expect(err).toBe('bad_request');
      done();
    });
  });
});

describe('error: data_checks', () => {
  it('should call a callback with a "bad_request" if is_mainnet is not a boolean', done => {
    chainInfo('chain_info', { is_mainnet: 'true', identifier: 'cosmoshub' }, (err, res) => {
      expect(err).toBe('bad_request');
      done();
    });
  });

  it('should call a callback with a "bad_request" if no identifier is provided', done => {
    chainInfo('chain_info', { is_mainnet: true }, (err, res) => {
      expect(err).toBe('bad_request');
      done();
    });
  });

  it('should call a callback with a "bad_request" if identifier is not a string', done => {
    chainInfo('chain_info', { is_mainnet: true, identifier: 123 }, (err, res) => {
      expect(err).toBe('bad_request');
      done();
    });
  });
});

describe('error: chain_info', () => {
  it('should call a callback with a "document_not_found" if specified chain folder is not in the provided type/identifier path', done => {
    chainInfo('chain_info', { is_mainnet: true, identifier: 'not_a_chain' }, (err, res) => {
      expect(err).toBe('network_error');
      done();
    });
  });

  it('should call a callback with "no_response_from_any_rpc" if the RPC list remained empty', done => {
    chainInfo('chain_info', { is_mainnet: true, identifier: 'akiro' }, (err, res) => {
      expect(err).toBe('no_response_from_any_rpc');
      done();
    });
  }, 10000);
});

describe('response: chain_info', () => {
  it('should return a chain info with chain ID, stable version, and active peers', done => {
    chainInfo('chain_info', { is_mainnet: true, identifier: 'cosmoshub' }, (err, res) => {
      expect(err).toBe(null);
      expect(res).toEqual(expect.any(Object));
      expect(res.version).toEqual(expect.any(String));
      expect(Array.isArray(res.peers)).toBe(true);
      expect(Array.isArray(res.seeds)).toBe(true);
      expect(res.denom).toEqual(expect.any(String));
      expect(res.min_gas_price).toEqual(expect.any(Number));
      expect(res.genesis_file).toEqual(expect.any(String));
      expect(res.repo).toEqual(expect.any(String));
      done();
    });
  }, 10000);
});