var glob = require('glob').sync;

module.exports = {
    bundle: {
        angular: {
            scripts: [
                './bower_components/angular/angular.js',
                './bower_components/angular-resource/angular-resource.js',
                './bower_components/angular-cookies/angular-cookies.js',
                './bower_components/angular-sanitize/angular-sanitize.js',
                './bower_components/angular-route/angular-route.js',
                './bower_components/node-uuid/uuid.js',
                './bower_components/traverse/traverse.js'
            ]
        },
        rulesbuilder: {
            scripts: './public/scripts/**/*.js'
        }
    }
};


