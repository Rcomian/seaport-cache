var _ = require('underscore'),
    semver = require('semver'),
    util = require('util');

function SeaportQueries(manager) {
  var pending = [],
      self = this;

  function queryCache(role) {
    var parts = role.split('@'),
    rolename = parts[0];
    version = parts[1] || '*';

    var cache = manager.getCache()[rolename];

    if (!cache) {
      return;
    } else {
      return _.filter(cache, function (item) {
        var result = semver.satisfies(item.version, version);
        return result;
      });
    }
  }

  this.query = function(role, cb) {
    var results = queryCache(role);
    if (results && results.length) {
      cb(results);
    } else {
      pending.push({role: role, cb: cb});
    }
  };

  function dispatchPending() {
    var copy = pending;
    pending = [];
    while (copy.length) {
      var query = copy.shift();
      self.query(query.role, query.cb);
    }
  }

  manager.on('updated', function () {
    dispatchPending();
  });
}

module.exports = SeaportQueries;