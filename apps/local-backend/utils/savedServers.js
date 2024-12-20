const fs = require('fs');
const path = require('path');
const { app } = require('electron');

const savedServersPath = path.join(app.getPath('userData'), 'savedServers.json');
console.log(savedServersPath);

const DEFAULT_MAX_TEXT_FIELD_LENGTH = 1e4;
const DEFAULT_USERNAME = 'root';
const LOGIN_TYPES = [ 'password', 'key' ];

const getLocalSavedServers = callback => {
  let localSavedServers = [];
  let isLocalSavedServersInitialized = true;

  try {
    localSavedServers = require(savedServersPath);
  } catch (err) {
    isLocalSavedServersInitialized = false;
  };

  if (!isLocalSavedServersInitialized || !Array.isArray(localSavedServers))
    fs.writeFile(savedServersPath, '[]', err => {
      if (err && err.code != 'ENOENT') return callback('error_writing_file');
      if (err) return callback(err);

      return callback(null, []);
    });
  else
    return callback(null, localSavedServers);
};

const SavedServers = {
  init: callback => {
    getLocalSavedServers((err, savedServers) => {
      if (err) return callback(err);

      return callback(null, savedServers);
    });
  },
  getAll: callback => {
    getLocalSavedServers((err, saved_servers) => {
      if (err) return callback(err);

      return callback(null, saved_servers);
    });
  },
  getByHost: (host, callback) => {
    if (!host || typeof host != 'string' || !host.trim().length || host.trim().length > DEFAULT_MAX_TEXT_FIELD_LENGTH)
      return callback('bad_request');

    getLocalSavedServers((err, saved_servers) => {
      if (err) return callback(err);

      const server = saved_servers.find(saved_server => saved_server.host == host);

      if (!server)
        return callback('document_not_found');

      return callback(null, server);
    });
  },
  save: (server, callback) => {
    if (!server || typeof server != 'object')
      return callback('bad_request');

    if (!server.host || typeof server.host != 'string' || !server.host.trim().length || server.host.trim().length > DEFAULT_MAX_TEXT_FIELD_LENGTH)
      return callback('bad_request');

    getLocalSavedServers((err, saved_servers) => {
      if (err) return callback(err);

      if (saved_servers.find(saved_server => saved_server.host == server.host))
        saved_servers = saved_servers.filter(saved_server => saved_server.host != server.host);

      saved_servers.push({
        host: server.host,
        username: server.username && typeof server.username == 'string' ? server.username.trim() : DEFAULT_USERNAME,
        preferred_login_type: server.preferred_login_type && typeof server.preferred_login_type == 'string' && LOGIN_TYPES.includes(server.preferred_login_type) ? server.preferred_login_type : LOGIN_TYPES[0],
        project_id: server.project_id && typeof server.project_id == 'string' ? server.project_id.trim() : '',
        project_image: server.project_image && server.project_image && typeof server.project_image == 'string' ? server.project_image.trim() : '',
      });

      fs.writeFile(savedServersPath, JSON.stringify(saved_servers, null, 2), err => {
        if (err && err.code != 'ENOENT') return callback('error_writing_file');
        if (err) return callback(err);

        return callback(null, saved_servers);
      });
    });
  },
  deleteByHost: (host, callback) => {
    if (!host || typeof host != 'object')
      return callback('bad_request');

    if (!host.host || typeof host.host != 'string' || !host.host.trim().length || host.host.trim().length > DEFAULT_MAX_TEXT_FIELD_LENGTH)
      return callback('bad_request');

    getLocalSavedServers((err, saved_servers) => {
      if (err) return callback(err);

      const serverIndex = saved_servers.findIndex(saved_server => saved_server.host == server.host);

      if (serverIndex == -1)
        return callback(null, saved_servers);

      saved_servers.splice(serverIndex, 1);

      fs.writeFile(savedServersPath, JSON.stringify(saved_servers, null, 2), err => {
        if (err && err.code != 'ENOENT') return callback('error_writing_file');
        if (err) return callback(err);

        return callback(null, saved_servers);
      });
    });
  }
};

module.exports = SavedServers;