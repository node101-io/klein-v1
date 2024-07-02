const fs = require('fs');
const path = require('path');
const { app } = require('electron');

const savedServersPath = path.join(app.getPath('userData'), 'savedServers.json');

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
  saveServer: (server, callback) => {
    if (!server || typeof server != 'object')
      return callback('bad_request');

    if (!server.host || typeof server.host != 'string' || !server.host.trim().length || server.host.trim().length > DEFAULT_MAX_TEXT_FIELD_LENGTH)
      return callback('bad_request');

    getLocalSavedServers((err, savedServers) => {
      if (err) return callback(err);
      if (savedServers.find(savedServer => savedServer.host == server.host))
        return callback('duplicated_unique_field');

      savedServers.push({
        host: server.host,
        username: server.username && typeof server.username == 'string' ? server.username.trim() : DEFAULT_USERNAME,
        preferred_login_type: server.preferred_login_type && typeof server.preferred_login_type == 'string' && LOGIN_TYPES.includes(server.preferred_login_type) ? server.preferred_login_type : LOGIN_TYPES[0],
        installed_projects: [
          {
            name: server.project && server.project.name && typeof server.project.name == 'string' ? server.project.name.trim() : '',
            image: server.project && server.project.image && typeof server.project.image == 'string' ? server.project.image.trim() : '',
          }
        ]
      });

      fs.writeFile(savedServersPath, JSON.stringify(savedServers, null, 2), err => {
        if (err && err.code != 'ENOENT') return callback('error_writing_file');
        if (err) return callback(err);

        return callback(null, savedServers);
      });
    });
  },
  editServer: (server, callback) => {
    if (!server || typeof server != 'object')
      return callback('bad_request');

    if (!server.host || typeof server.host != 'string' || !server.host.trim().length || server.host.trim().length > DEFAULT_MAX_TEXT_FIELD_LENGTH)
      return callback('bad_request');

    getLocalSavedServers((err, savedServers) => {
      if (err) return callback(err);

      const serverIndex = savedServers.findIndex(savedServer => savedServer.host == server.host);

      if (serverIndex == -1)
        return callback('document_not_found');

      savedServers[serverIndex] = {
        host: server.host,
        username: server.username && typeof server.username == 'string' ? server.username.trim() : DEFAULT_USERNAME,
        preferred_login_type: server.preferred_login_type && typeof server.preferred_login_type == 'string' && LOGIN_TYPES.includes(server.preferred_login_type) ? server.preferred_login_type : LOGIN_TYPES[0],
        installed_projects: {
          name: server.project && server.project.name && typeof server.project.name == 'string' ? server.project.name.trim() : '',
          image: server.project && server.project.image && typeof server.project.image == 'string' ? server.project.image.trim() : '',
        }
      };

      fs.writeFile(savedServersPath, JSON.stringify(savedServers, null, 2), err => {
        if (err && err.code != 'ENOENT') return callback('error_writing_file');
        if (err) return callback(err);

        return callback(null, savedServers);
      });
    });
  },
  deleteServer: (server, callback) => {
    if (!server || typeof server != 'object')
      return callback('bad_request');

    if (!server.host || typeof server.host != 'string' || !server.host.trim().length || server.host.trim().length > DEFAULT_MAX_TEXT_FIELD_LENGTH)
      return callback('bad_request');

    getLocalSavedServers((err, savedServers) => {
      if (err) return callback(err);

      const serverIndex = savedServers.findIndex(savedServer => savedServer.host == server.host);

      if (serverIndex == -1)
        return callback('document_not_found');

      savedServers.splice(serverIndex, 1);

      fs.writeFile(savedServersPath, JSON.stringify(savedServers, null, 2), err => {
        if (err && err.code != 'ENOENT') return callback('error_writing_file');
        if (err) return callback(err);

        return callback(null, savedServers);
      });
    });
  }
};

module.exports = SavedServers;