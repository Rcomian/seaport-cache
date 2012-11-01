seaport-cache
=============

A caching layer for seaport that lets you run nicely even if the seaport server dies.

This library takes a connected seaport object and caches all the results so that if the connection with seaport is lost, we can still run using the cached data.

Also adds some nice functions to automatically select a host based on random or round-robin principles.

example
=======

Run the seaport service and register a server as normal.

On the client use like this:

``` js
var request = require('request');
var spcache = require('seaport-cache');

var ports = spcache.seaport.connect(9090, { secret : 'beep boop' });
var cache = spcache.getCache(ports);

setInterval(function () {
  cache.getRoundRobin('web@1.2.x', function (h) {
    var u = 'http://' + h.host + ':' + h.port;

    request(u).pipe(process.stdout);
  });
}, 1000);
```

methods
=======

var spcache = require('seaport-cache');

cache.get(role, cb)
-------------------

Request an array of host/port objects through `cb(services)` that fulfill `role`

If there are no services that match the callback will be queued until some fulfilling `role` gets allocated.

cache.getFirst(role, cb)
------------------------

As with `get`, but returns just the first host/port object instead of the whole array, equive to using `services[0]` in the callback.

cache.getAny(role, cb)
----------------------

As with `get` but returns a random host/port object from the array.

cache.getRoundRobin(role, cb)
-----------------------------

As with `get` but returns the first entry from the array on the first call, the second entry from the array on the second call, etc.

Round robin is based on the exact query string used, so different query strings