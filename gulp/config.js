var dest = "./production";
var src = './public';
var glob = require('glob').sync;

module.exports = {
    images: {
        src: src + "/images/**",
        dest: dest + "/images"
    },
    markup: {
        src: "./views/partials/*.html",
        dest: dest + "/views/"
    },
    browserify: {
        // A separate bundle will be generated for each
        // bundle config in the list below
        bundleConfigs: [{
            entries: ['./bower_components/angular/angular.js',
                './bower_components/angular-resource/angular-resource.js',
                './bower_components/angular-cookies/angular-cookies.js',
                './bower_components/angular-sanitize/angular-sanitize.js',
                './bower_components/angular-route/angular-route.js',
                './bower_components/node-uuid/uuid.js',
                './bower_components/traverse/traverse.js'],
            dest: dest + '/js',
            outputName: 'angular-host.js',
            // list of externally available modules to exclude from the bundle
            external: ['jquery', 'underscore']
        },{
            entries: [glob(src + '/scripts/{,*/}*.js')],
            dest: dest + '/js',
            outputName: 'rules-builder.js',
            // list of modules to make require-able externally
            require: ['jquery', 'underscore']
        }]
    },
    production: {
        cssSrc: dest + '/css',
        jsSrc: dest + '/js',
        dest: dest
    },
    debug: {
        cssSrc: src + '/stylesheets/{,*/}*.css',
        jsSrc: src + '/scripts',
        views: 'views'
    }
};
