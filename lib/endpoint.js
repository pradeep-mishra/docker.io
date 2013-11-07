var querystring = require('querystring'),
    http = require('follow-redirects').http,
    fs = require('fs'),
    p = require('path'),
    validator = require('flat-validator'),
    parse = require('url').parse,
    resolve = require('url').resolve,
    es = require('event-stream');

var Endpoint = function(type, o) {

    var path = o.path,
        endpoint = this;

    this.streamReply = o.streamReply;
    this.jsonStreamReply = o.jsonStreamReply;

    this.forceURLParams = o.forceURLParams;
    this.urlParams = o.urlParams;
    this.method = o.method;
    this.args = o.args;
    this.socketPath = o.socketPath
    this.host = o.host
    this.statusCodes = o.codes;
    this.type = type;

    var API = function() {
        if (!(this instanceof API)) {
            var args = Array.prototype.concat.apply([null], arguments);
            return new (Function.prototype.bind.apply(API, args));
        }

        var self = this,
            data,
            validArgs;

        this.callback = arguments[arguments.length -1];

        this.error = function(message) {
            self.callback(message, {});
        };

        // assign argumets to a named var
        switch(type) {
            case 'id':
                this.id = arguments[0];

                // make sure arguments are passed in correctly
                //
                if (typeof this.id !== 'string' || this.id === "") {
                    return this.error('The first argument "ID" should be a string...');
                }

                // allow for options or ignore them
                if (arguments.length > 2) {
                    this.opts = arguments[1];
                }

            break;
            case 'file':
                this.file = arguments[0];

                // allow for options or ignore them
                if (arguments.length > 2) {
                    if(typeof(arguments[1]) === 'string') {
                        this.opts = {};
                        this.opts.t = arguments[1];
                    } else {
                        this.opts = arguments[1];
                    }
                }
            break;
            case 'options':
                if (arguments.length > 1) {
                    this.opts = arguments[0];
                } else {
                    this.opts = {};
                }
            break;
        }

        validArgs = validator.validate(this.opts, endpoint.args);

        // note that we dont check if(validArgs) because a fail returns an object
        if(validArgs === true) {

            if (this.opts && (endpoint.forceURLParams || this.file || endpoint.method === 'GET' || endpoint.host.indexOf('?') !== -1 || endpoint.urlParams)) {
                var origOpts = this.opts;

                if (endpoint.urlParams) {
                    this.opts = {};
                    for (var p = 0; p < endpoint.urlParams.length; p++) {
                        var param = endpoint.urlParams[p];
                        this.opts[param] = origOpts[param];
                        origOpts[param] = undefined;
                    };
                }

                // We have to do this due to the commit endpoint not following the same convention as the rest of the API
                var query_seperator = endpoint.host.indexOf('?') !== -1 ? '&' : '?';

                this.url = resolve(endpoint.host, path.replace('${id}', this.id)) + query_seperator + querystring.stringify(this.opts);
                this.opts = undefined;

                if (endpoint.urlParams) this.opts = origOpts;
            } else {
                this.url = resolve(endpoint.host, path.replace('${id}', this.id));
            }

            var options = {
                path: this.url,
                method: endpoint.method,
                headers: {
                    'Content-Length': 0
                }
            };

            if(this.file) {
                data = fs.readFileSync( p.resolve(this.file) );

                options.headers = {
                    'Content-Type': 'application/tar',
                    'Content-Length': data.length
                };
            } else if(this.opts && endpoint.method === 'POST') {
                data = JSON.stringify(this.opts);
                options.headers = {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length
                };
            }

            if(endpoint.socketPath) {
                options.socketPath = endpoint.socketPath;
            } else {
                options.hostname = parse(options.path).hostname;
                options.port = parse(options.path).port;
            }

            var req = http.request(options, function() {});

            req.on('response', function(res) {
                // This is used for events
                if (endpoint.jsonStreamReply) {
                    // Build new res stream
                    res = es.pipeline(
                        // Source stream
                        res,

                        // Buffer till reception of newlines
                        es.split(),

                        // Parse JSON
                        es.parse()
                    );
                }

                if (endpoint.streamReply) {

                    // Allow users to stop the stream
                    self.callback.prototype.end = function() {
                        res.destroy();
                    };

                    res.setEncoding('utf8');
                    res.on('data', function(chunk) {
                        self.callback(null, chunk);
                    });

                    res.on('end', function() {
                        self.callback(null, null);
                    });

                } else {
                    var chunks = '';
                    res.on('data', function(chunk) {
                        chunks = chunks + chunk;
                    });

                    res.on('end', function() {
                        var json;

                        try {
                            json = JSON.parse(chunks);
                        } catch(e) {
                            json = chunks.split(/\n/);
                        }
                        return endpoint.checkStatus(null, res, json, self.callback);
                    });

                }
            });

            req.on('error', function(error) {
               endpoint.checkStatus(error, {}, error, self.callback);
            });

            if(data) {
                req.write(data);
            }
            req.end();
        } else {
            endpoint.error(validArgs.fieldName + ' Is a '+ validArgs.ruleName +' property for this API, and was not found or did not pass validation.');
        }
    };

    return API;
}

Endpoint.prototype.error = function(message) {
    throw message;
};

Endpoint.prototype.checkStatus = function(err, res, json, cb) {
    if (err) return cb(err, null);
    var s = this.validateStatus(res.statusCode.toString());

    if (typeof json === 'string' && !json.isJson()) {
        json = '{"msg": "' + json.replace(/[^a-zA-Z ]/g, "") + '"}';
    } else if (typeof json === 'string') {
        json = JSON.parse(json);
    }

    if (!s.status) {
        var error = {
            code: res.statusCode,
            msg: this.statusCodes[s]
        }
        return cb(error, undefined);
    }
    if (this.streamReply) {
        return cb(null, res);
    } else {
        return cb(null, json);
    }
};

Endpoint.prototype.validateStatus = function(s) {
    if (s in this.statusCodes) {
        return {
            status: this.statusCodes[s] === true,
            msg: this.statusCodes[s]
        };
    }

    return this.error("Docker returned " + s + " a result not supported by this version of the Docker.io for NodeJS");
};


module.exports = Endpoint;
