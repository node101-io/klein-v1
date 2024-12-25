const makeServerManager = _ => {

  return {

    isAnyNodeInstanceRunning: _isAnyNodeInstanceRunning,
    getServerStats: _getServerStats
  };
};

const serverManager = makeServerManager();
