docker.io
=========
[![Build Status](https://7.hidemyass.com/ip-1/encoded/Oi8vY2kuYXBwZXJzb25sYWJzLmNvbS9pbWFnZXMvYmFkZ2VzL2J1aWxkX3Bhc3NpbmcucG5n)](http://ci.appersonlabs.com/appersonlabs/docker.io/)
[![Dep Status](https://david-dm.org/appersonlabs/docker.io.png)](https://david-dm.org/appersonlabs/docker.io)
[![devDependency Status](https://david-dm.org/appersonlabs/docker.io/dev-status.png)](https://david-dm.org/appersonlabs/docker.io#info=devDependencies)

Node.JS wrapper for low-level Docker.io HTTP interface

## Usage

### Using unix sockets (most secure)

```javascript

// Sockets are used by default.
var docker = require('docker.io')({ socketPath: '/var/run/docker.sock' });

```

### Using TCP connection

```javascript

// You must specify socketPath: false to indicate you want to use TCP connections.
var docker = require('docker.io')({ socketPath: false, host: 'http://localhost', port: '4243'});

```

The defaults for the connection options are:

- socketPath: /var/run/docker.sock
- host: http://localhost
- port: 4243

### API calls

Here is an example API call, more examples can be found [here](examples.md)

```javascript

var options = {}; // all options listed in the REST documentation for Docker are supported.

docker.containers.list(options /* optional*/, function(err, res) {
    if (err) throw err;
    console.log("data returned from Docker as JS object: ", res);
});

```

## Contributing

PULL REQUESTS ARE WELCOME!

Concerned that your PR would change too much? file a ticket, I am willing to hear arguments for change :)

## License

Copyright 2013 Apperson Labs, LLC
http://appersonlabs.com
matt@appersonlabs.com

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
