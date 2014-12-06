'use strict';
var content = require('content'),
    durableJsonLint = require('durable-json-lint'),
    nconf = require('nconf'),
    async = require('async'),
    logger = require('winston'),
    api;

exports.select = function select (req, res) {
    var queryStatement = req.query.query;
    queryStatement['with'] = {'cache' : false};   //do not cache query

    var bucket = req.query.bucket || 'pub';

    content.open(function (err, devApi) {
        if (!api) {
            api = devApi;
        }

        if (err) {
            res.send(500, { error: err.message + ' on bucket: ' + bucket});
        }else{
            //console.info('select using ' + bucket);
            api.auth(bucket, {user: "su"}, function (err, authApi) {
                if (err) {
                    res.send(500, { error: err.message + ' on bucket: ' + bucket});
                }
                else if (queryStatement) {
                    var jsonString = durableJsonLint(queryStatement);
                    if (jsonString.json) {
                        var validQuery = JSON.parse(jsonString.json);

                        authApi.select(validQuery, function (err, results) {
                            if (err) {
                                res.send(500, { error: err.message + ' on bucket: ' + bucket});
                            }else{
                                res.json(results);
                            }
                        });
                    }
                    else {
                        if (jsonString.errors.length > 0)
                            res.send(500, { error: jsonString.errors[0].message } );
                    }
                }
                else {
                    res.send(null);
                }

            });
        }

    });

};

exports.searchtype = function searchType (req, res){
    var text = req.query.text;

    var bucket = req.query.bucket || 'pub';

    content.open(function (err, devApi) {
        if (!api) {
            api = devApi;
        }
        if (err) {
            res.send(500, { error: err.message + ' on bucket: ' + bucket});
        }else{
            //console.info('searchtype using ' + bucket);
            api.auth(bucket, {user: "su"}, function (err, authApi) {
                if (err) {
                    res.send(500, { error: err.message + ' on bucket: ' + bucket});
                }

                authApi.select({type: {name: text + "?", limit: {count: "max"}, with: {docs: true}}}, function(err, results){
                    if (err) {
                        res.send(500, { error: err.message + ' on bucket: ' + bucket});
                    }else{

                        res.json(results);
                    }

                });
            });
        }

    });

};

exports.searchdoc = function searchDoc (req, res){
    var text = req.query.text;
    var category = req.query.category;

    var bucket = req.query.bucket || 'pub';

    content.open(function (err, devApi) {
        if (!api) {
            api = devApi;
        }
        if (err) {
            res.send(500, { error: err.message + ' on bucket: ' + bucket});
        }else{
            //console.info('searchdoc using ' + bucket);
            api.auth(bucket, {user: "su"}, function (err, authApi) {

                if (err) {
                    res.send(500, { error: err.message + ' on bucket: ' + bucket});
                }

                var query = {};
                query[category] = {name: text + "?", limit: {count: 20}};

                authApi.select( query, function(err, results){
                    if (err) {
                        res.send(500, { error: err.message + ' on bucket: ' + bucket});
                    }else{
                        res.json(results);
                    }

                });
            });
        }

    });
};

exports.update = function update (req, res) {
    var body = req.query;
    var headers = {'req': {'headers' : req.headers}};
    var bucket = req.query.bucket || 'pub';
    //console.info(bucket);

    content.open(function (err, devApi) {
        if (!api) {
            api = devApi;
        }
        if (err) {
            res.send(500, { error: err.message + ' on bucket: ' + bucket});
        }else{
            //console.info('update using ' + bucket);
            api.auth(bucket, {user: "su"}, function (err, authApi) {
                var data;

                if (err) {
                    res.send(500, { error: err.message + ' on bucket: ' + bucket});
                }

                if (body.tags === undefined){
                    body.tags = null;
                }

                if (body.data) {
                    data =  JSON.parse(body.data);
                }
                else {
                    data = null;
                }

                if (body.tags) {
                    //log tag changes here
                    logger.info("Tag changes for %s: %s. %s", body.key, body.tags, JSON.stringify(headers));
                }

                authApi.post(JSON.parse(body.key),data, JSON.parse(body.tags), function (err, results) {
                    if (err) {
                        res.send(500, { error: err.message + ' on bucket: ' + bucket});
                    }else{
                        res.json(results[0]);

                    }
                });

            });
        }

    });
};

exports.remove = function remove (req, res) {
    var body = req.query;

    var bucket = req.query.bucket || 'pub';
    //console.info(bucket);

    content.open(function (err, devApi) {
        if (!api) {
            api = devApi;
        }
        if (err) {
            res.send(500, { error: err.message + ' on bucket: ' + bucket});
        }else{
            //console.info('update using ' + bucket);
            api.auth(bucket, {user: "su"}, function (err, authApi) {
                if (err) {
                    res.send(500, { error: err.message + ' on bucket: ' + bucket});
                }

                var objToDelete = [];
                objToDelete.push(body.keys);
                authApi.remove(JSON.parse(objToDelete), function (err, results) {
                    if (err) {
                        res.send(500, { error: err.message + ' on bucket: ' + bucket});
                    }else{
                        res.json(results[0]);

                    }
                });
            });
        }

    });
};


var getEditorSettings = function getEditorSettings (callback) {
    var settings = nconf.get('listEditor');

    if (settings) {
        callback(null, settings);
    }
};

var getLists = function getLists (callback) {
    var lists = nconf.get('lists');

    if (lists) {
        callback(null, lists);
    }
};

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    res.send('respond with a resource');
});



router.get('/getListEditorConfig', function getListEditorConfig(req, res) {
    async.parallel({
            settings: getEditorSettings,
            lists: getLists
        },
        function(err, results) {
            if (err) {
                res.send(500, { error: err.message });
            }

            res.json(results);
        });
});

module.exports = router;