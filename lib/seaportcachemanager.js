var EventEmitter = require('events').EventEmitter,
    _ = require('underscore');

function SeaportCacheManager(p) {
  var self = this,
      internalCache = {};

  this.getCache = function () {
      return internalCache;
  };

  function emitUpdate() {
    self.emit('updated');
  }

  function addHost(host) {
    if (!internalCache[host.role]) {
      internalCache[host.role] = [];
    }

    internalCache[host.role].push(host);
    emitUpdate();
  }

  function clearHost(host) {
    internalCache[host.role] = _.filter(internalCache[host.role], function (item) {
      return item._id != host._id;
    });

    emitUpdate();
  }

  p.on('up', function () {
    internalCache = {};
    p.query('', function (ps) {
      _.extend(internalCache, ps);
      emitUpdate();
    });
  });

  p.on('allocate', function (host) {
    addHost(host);
  });

  p.on('assume', function (host) {
    addHost(host);
  });

  p.on('free', function (host) {
    clearHost(host);
  });
}

SeaportCacheManager.prototype = new EventEmitter();

module.exports = SeaportCacheManager;