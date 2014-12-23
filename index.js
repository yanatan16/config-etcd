// get config values from etcd in a large config structure
// Anything formatted as "etcd:<key>" will be evaluated

var Etcd = require('node-etcd')
  , async = require('async')
  , etcd

module.exports = function (etcd_hosts, config, callback) {
  if (!callback) callback = config, config = etcd_hosts, etcd_hosts = ['127.0.0.1:4001']
  etcd = etcd || new Etcd(etcd_hosts||['127.0.0.1:4001'])
  evaulateEtcd(config, function (err) {
    callback(err, config)
  })
}

function evaulateEtcd(cfg, callback) {
  recursiveEach(cfg, eval, callback)

  function eval(val, key, cfg, cb) {
    if (!isEtcd(val))
      return cb()

    getEtcd(val, set, cb)

    function set(v) { cfg[key] = v }
  }

}

var etcd_rgx = /^etcd:(.*)$/
function isEtcd(val) {
  return typeof val === 'string' && etcd_rgx.test(val)
}

function getEtcd(val, setter, callback) {
  var key = val.match(etcd_rgx)[1]

  etcd.get(key, function (err, res) {
    if (err) return callback(err)
    setter(res.node.value)
    callback()
  })
}

function recursiveEach(obj, action, callback) {
  async.each(Object.keys(obj), function (key, cb) {
    var val = obj[key]

    if (typeof val === 'object')
      return recursiveEach(val, action, cb)

    action(val, key, obj, cb)
  }, callback)
}
