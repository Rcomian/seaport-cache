function RoundRobin () {
  var robins = {};

  this.next = function(set, limit) {
    var next = 0;

    if (robins.hasOwnProperty(set)) {
      next = robins[set];
    }

    next = next % limit;

    robins[set] = next + 1;

    return next;
  }
}

module.exports = RoundRobin;
