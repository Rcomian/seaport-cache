var SeaportCache = require('./lib/seaportcache');

function getCache(ports) {
  return new SeaportCache(ports);
}

module.exports.getCache = getCache;
module.exports.SeaportCache = SeaportCache;
