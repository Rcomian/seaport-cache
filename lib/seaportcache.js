var SeaportCacheManager = require('./seaportcachemanager');
var SeaportQueries = require('./seaportqueries');
var RoundRobin = require('./roundrobin');

function SeaportCache(ports) {
  var manager = new SeaportCacheManager(ports);
  var queries = new SeaportQueries(manager);
  var roundRobin = new RoundRobin();

  function rand(low, high) {
    return Math.floor( (Math.random() * ((high - low) + 1)) + low);
  };

  this.get = function(role, cb) {
    queries.query(role, function(ps) {
      cb(ps);
    });
  };

  this.getFirst = function(role, cb) {
    queries.query(role, function(ps) {
      cb(ps[0]);
    });
  };

  this.getAny = function(role, cb) {
    queries.query(role, function(ps) {
      cb(ps[rand(0, ps.length-1)]);
    });
  };

  this.getRoundRobin = function(role, cb) {
    queries.query(role, function(ps) {
      cb(ps[roundRobin.next(role, ps.length)]);
    });
  };

  this.remove = function(host) {
    manager.remove(host);
  };
}

module.exports = SeaportCache;
