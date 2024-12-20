function loadPageNodeIndex(data) {
  loadingStart();

  serverManager.getServerStats((err, server_stats) => {
    if (err)
      return console.error(err);

    nodeManager.getStatus((err, node_status) => {
      if (err)
        return console.error(err);

      nodeIndexPanelSetStatus({
        sync: {
          is_syncing: node_status.is_syncing,
          latest_block_height: node_status.latest_block_height
        },
        cpu: server_stats.cpu.average_used,
        memory: Math.floor(server_stats.memory.used / server_stats.memory.total * 100)
      });

      loadingStop();
    });
  });
};

function nodeIndexPanelGetStatus(callback) {
  serverManager.getServerStats((err, server_stats) => {
    if (err)
      console.error(err);

    nodeManager.getStatus((err, node_status) => {
      if (err)
        console.error(err);
    });
  });



  // return setTimeout(nodeIndexPanelGetStatus, 5000);
};

function nodeIndexPanelSetStatus(data) {
  const syncStatusContent = document.getElementById('node-index-sync-status-content');
  const cpuStatusContent = document.getElementById('node-index-cpu-content');
  const cpuStatusBar = document.getElementById('node-index-cpu-bar');
  const memoryStatusContent = document.getElementById('node-index-memory-content');
  const memoryStatusBar = document.getElementById('node-index-memory-bar');

  syncStatusContent.innerText = Number(data.sync.latest_block_height);

  cpuStatusContent.innerText = `${data.cpu}%`;
  cpuStatusBar.style.width = `${data.cpu}%`;
  cpuStatusBar.style.minWidth = `${data.cpu}%`;

  memoryStatusContent.innerText = `${data.memory}%`;
  memoryStatusBar.style.width = `${data.memory}%`;
  memoryStatusBar.style.minWidth = `${data.memory}%`;
};

window.addEventListener('load', _ => {
  nodeIndexPanelSetStatus({
    sync: {
      is_syncing: false,
      latest_block_height: 5234
    },
    cpu: 45,
    memory: 78
  });
});
