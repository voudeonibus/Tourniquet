# Tourniquet

[![npm version](https://img.shields.io/npm/v/tourniquet.svg?style=flat)](https://www.npmjs.com/package/tourniquet)
[![dependency Status](https://img.shields.io/david/voudeonibus/tourniquet.svg?style=flat)](https://david-dm.org/voudeonibus/tourniquet#info=dependencies)
[![devDependency Status](https://img.shields.io/david/dev/voudeonibus/tourniquet.svg?style=flat)](https://david-dm.org/voudeonibus/tourniquet#info=devDependencies)
![download github](https://img.shields.io/github/downloads/voudeonibus/Tourniquet/latest/total.svg)
![download npm month](https://img.shields.io/npm/dm/tourniquet.svg)
![license](https://img.shields.io/npm/l/tourniquet.svg)

Tourniquet is a service registry build primarily on [Node.js](http://nodejs.org/)/[io.js](https://iojs.org/en/index.html), [Redis](http://redis.io/) and [Socket.io](https://github.com/Automattic/socket.io), inspired by [Thalassa](https://github.com/PearsonEducation/thalassa).

Registry Service by Vou de Ônibus.

## Table of contents

- [Quick start](#quick-start)
- [Starting as a server](#starting-as-a-server)
- [Starting as a client](#starting-as-a-client)
- [Bugs and feature requests](#bugs-and-feature-requests)
- [Contributing](#contributing)
- [Versioning](#versioning)
- [License](#license)

## Quick start

Several quick start options are available:

- Clone the repo: `git clone https://github.com/voudeonibus/Tourniquet.git`.
- Install with [npm](https://www.npmjs.com): `npm install tourniquet`.

## Starting as a server

```
var Tourniquet = require('tourniquet');

Tourniquet();
```

### Options

- **port:** Tourniquet socket port | **default:** 5000
- **redis_port:** port of redis | **default:** 6379
- **redis_host:** host of redis | **default:** 127.0.0.1
- **redis_password:** password of redis | **default:** undefined
- **redis_db:** name of database on redis | **default:** 4

### Note

You can configure all options as environment variables in UpperCase(eg: REDIS_PORT), except the parameter **port**, that as environment variables
should be **TOURNIQUET_PORT**

### Example

```javascript
var Tourniquet = require('tourniquet');

Tourniquet({
    port: 5000,
    redis_port: 6379
});
```
## Starting as a client

```
var Tourniquet = require('tourniquet/client');

var client = new Tourniquet({
  service: 'my-service',
  version: '1.0.0',
  port: 8080
});

```

### Options

- **service**: name of your service | optional
- **version**: version of your service | optional
- **port**: port of your service | optional
- **tourniquet_port**: port of server tourniquet | **default:** 5000
- **tourniquet_host**: host of server tourniquet | **default:** http://localhost

### Note

You can configure all options of Tourniquet as environment variables in UpperCase (eg: TOURNIQUET_PORT).

### Example

```
var Tourniquet = require('tourniquet/client');

var client = new Tourniquet({
  service: 'my-service',
  version: '1.0.0',
  port: 8080,
  tourniquet_port: 5000,
  tourniquet_host: '127.0.0.1'
});

```

## Bugs and feature requests

Have a bug or a feature request? Please first search for existing and closed issues. If your problem or idea is not addressed yet, [please open a new issue](https://github.com/voudeonibus/Tourniquet/issues/new).

## Versioning

For transparency into our release cycle and in striving to maintain backward compatibility, Tourniquet is maintained under [the Semantic Versioning guidelines](http://semver.org/). Sometimes we screw up, but we'll adhere to those rules whenever possible.

## License

[MIT](https://github.com/voudeonibus/Tourniquet/blob/master/LICENSE)
