var dest = "./production";
var src = './public';

var glob = require('glob').sync;

module.exports = {
    images: {
        src: src + "/images/*",
        dest: dest + "/images"
    },
    markup: {
        src: src + "/views/index.html",
        dest: dest
    },
    templates: {
        src: src + "/views/partials/*.html",
        dest: dest + "/js"
    },
    css: {
        src: src + '/stylesheets/{,*/}*.css',
        dest: dest + '/css'
    },
    js: {
        src: src + '/scripts/{,*/}*.js',
        dest: dest + '/js'
    },
    concat: {
        'angular-host': {
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
        'rules-builder': {
            scripts: ['./public/scripts/**/*.js',
                './production/js/templates.js']
        }
    }
};
