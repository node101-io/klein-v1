function nodeIndexPanelSetStatus(sync, cpu, memory) {
  document.getElementById('node-index-sync-status-content').innerHTML = sync;
  document.getElementById('node-index-cpu-content').innerHTML = `${cpu}%`;
  document.getElementById('node-index-cpu-bar').style.width = `${cpu}%`;
  document.getElementById('node-index-cpu-bar').style.minWidth = `${cpu}%`;
  document.getElementById('node-index-memory-content').innerHTML = `${memory}%`;
  document.getElementById('node-index-memory-bar').style.width = `${memory}%`;
  document.getElementById('node-index-memory-bar').style.minWidth = `${memory}%`;
};

window.addEventListener('load', _ => {
  nodeIndexPanelSetStatus(5234, 45, 78);
});