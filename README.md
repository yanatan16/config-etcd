# config-etcd

Configure your app with values from etcd with a simple API.

#### Features

- Get etcd keys to configure your app
- Let etcd directives sit with other configurations for later lookup
- Recursively evaluate a structure looking for directives to retrieve values from etcd
- Callback is guarenteed to execute after config has been updated
- In-place configuration update
- Works with any configuration method

## Install

```
npm install config-etcd --save
```

## Use

Use whatever method you want to get configuration values into your app. (I prefer the [config module](http://npm.org/package/config)).

Lets suppose that the etcd key `/services/db/password` contains the value `foobar`.

```javascript
var config = {
    'db': {
        'host': '127.0.0.1',
        'port': 12345,
        'password': 'etcd:/services/db/password'
    }
}

var etcd_hosts = ['127.0.0.1:4001']

var configEtcd = require('config-etcd')

configEtcd(etcd_hosts, config, function (err, updated_config) {
    if (err) throw err
    console.log('Successfully updated config with values from etcd:', updated_config)
})
```

This will print the new updated config structure:

```javascript
{
    'db': {
        'host': '127.0.0.1',
        'port': 12345,
        'password': 'foobar'
    }
}
```

Alternatively, you can omit the `etcd_hosts` parameter to just initialize with `[127.0.0.1:4001` as your etcd address.

## License

MIT license in [LICENSE](LICENSE) file.