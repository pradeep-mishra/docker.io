docker.io
=========

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

### Methods

We have implemented most of the container methods like:

- list

```javascript

function handler(err, res) {
    if (err) throw err;
    console.log("data returned from Docker as JS object: ", res);
}

var options = {}; // all options listed in the REST documentation for Docker are supported.

docker.containers.list(options, handler);
// OR
docker.containers.list(handler);
// ALSO
docker.images.list(options, handler);
// OR
docker.images.list(handler);

```

- create

```javascript

function handler(err, res) {
    if (err) throw err;
    console.log("data returned from Docker as JS object: ", res);
}

var options = {}; // all options listed in the REST documentation for Docker are supported.

docker.containers.create(options, handler);
// OR
docker.containers.create(handler);

```

- build

```javascript

function handler(err, res) {
    if (err) throw err;
    console.log("data returned from Docker as JS object: ", res);
}

var options = {}; // all options listed in the REST documentation for Docker are supported.

docker.containers.create('dockerfilein.tar', options, handler);
// OR
docker.containers.create('dockerfilein.tar', 'tag name', handler);

```

- inspect

```javascript

function handler(err, res) {
    if (err) throw err;
    console.log("data returned from Docker as JS object: ", res);
}

var options = {}; // all options listed in the REST documentation for Docker are supported.

docker.containers.inspect('263tbr762t37rtbd', options, handler);
// OR
docker.containers.inspect('263tbr762t37rtbd', handler);


```

- inspectChanges

```javascript

function handler(err, res) {
    if (err) throw err;
    console.log("data returned from Docker as JS object: ", res);
}

var options = {}; // all options listed in the REST documentation for Docker are supported.

docker.containers.inspectChanges('263tbr762t37rtbd', options, handler);
// OR
docker.containers.inspectChanges('263tbr762t37rtbd', handler);

```

- runExport

```javascript

function handler(err, res) {
    if (err) throw err;
    console.log("data returned from Docker as JS object: ", res);
}

var options = {}; // all options listed in the REST documentation for Docker are supported.

docker.containers.runExport('263tbr762t37rtbd', options, handler);
// OR
docker.containers.runExport('263tbr762t37rtbd', handler);
```

- start

```javascript

function handler(err, res) {
    if (err) throw err;
    console.log("data returned from Docker as JS object: ", res);
}

var options = {}; // all options listed in the REST documentation for Docker are supported.

docker.containers.start('263tbr762t37rtbd', options, handler);
// OR
docker.containers.start('263tbr762t37rtbd', handler);
```

- stop

```javascript

function handler(err, res) {
    if (err) throw err;
    console.log("data returned from Docker as JS object: ", res);
}

var options = {}; // all options listed in the REST documentation for Docker are supported.

docker.containers.stop('263tbr762t37rtbd', options, handler);
// OR
docker.containers.stop('263tbr762t37rtbd', handler);
```

- restart

```javascript

function handler(err, res) {
    if (err) throw err;
    console.log("data returned from Docker as JS object: ", res);
}

var options = {}; // all options listed in the REST documentation for Docker are supported.

docker.containers.restart('263tbr762t37rtbd', options, handler);
// OR
docker.containers.restart('263tbr762t37rtbd', handler);
```

- attach

```javascript

// This gets fired on every line returned by the container for stderr, stdin, & stdout. It gets called once for logs
function handler(err, res) {
    if (err) throw err;
    console.log("data returned from Docker as JS object: ", res);
}

var options = {}; // all options listed in the REST documentation for Docker are supported.

docker.containers.attach('263tbr762t37rtbd', options, handler);
// OR
docker.containers.attach('263tbr762t37rtbd', handler);
```

- wait

```javascript

// This fires once the container stops
function handler(err, res) {
    if (err) throw err;
    console.log("data returned from Docker as JS object: ", res);
}

var options = {}; // all options listed in the REST documentation for Docker are supported.

docker.containers.wait('263tbr762t37rtbd', options, handler);
// OR
docker.containers.wait('263tbr762t37rtbd', handler);
```

- runExport

```javascript

function handler(err, res) {
    if (err) throw err;
    console.log("data returned from Docker as JS object: ", res);
}

var options = {}; // all options listed in the REST documentation for Docker are supported.

docker.containers.runExport('263tbr762t37rtbd', options, handler);
// OR
docker.containers.runExport('263tbr762t37rtbd', handler);
```

- version

```javascript

function handler(err, res) {
    if (err) throw err;
    console.log("data returned from Docker as JS object: ", res);
}

docker.version(handler);
```

- info

```javascript

function handler(err, res) {
    if (err) throw err;
    console.log("data returned from Docker as JS object: ", res);
}

docker.info(handler);
```

Other methods are implemented but a little buggy... PULL REQUESTS ARE WELCOME!
