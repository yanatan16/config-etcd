var etcd_hosts = [process.env.ETCD_HOST]
  , configEtcd = require('../index')
  , Etcd = require('node-etcd')
  , etcd = new Etcd(etcd_hosts)
  , async = require('async')

exports.basic = buildTest(
  { cfg: 'etcd:/test' }
, [{key: '/test', val: 'foo'}]
, { cfg: 'foo' }
)

exports.multiple = buildTest(
  { cfg: 'etcd:/test',
    cfg2: 'etcd:/test2',
    other: 'some other key' }
, [ {key: '/test', val: 'foo'}
  , {key: '/test2', val: 'bar'} ]
, { cfg: 'foo',
    cfg2: 'bar',
    other: 'some other key' }
)

exports.deep = buildTest(
  { cfg: { dog: { house: 'etcd:/test' }
          , cat: { not: 'etcded' } } }
, [{key: '/test', val: 'pets'}]
, { cfg: { dog: { house: 'pets' }
          , cat: { not: 'etcded' } } }
)

function buildTest(config, sets, finalConfig) {
  return function (test) {
    test.expect(2)
    async.series([
      async.each.bind(async, sets, function (set, cb) {
        etcd.set(set.key, set.val, cb)
      })
    , configEtcd.bind(null, etcd_hosts, config)
    ], function (err, rets) {
      test.ifError(err)
      test.deepEqual(rets[1], finalConfig)
      test.done()
    })
  }
}

process.on('uncaughtException', function (err) {
  console.log('UNCAUGHT EXCEPTION', err)
})