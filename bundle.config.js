module.exports = {
    bundle: {
        angular: {
            scripts: [
                './bower_components/angular/angular.min.js',
                './bower_components/angular-resource/angular-resource.min.js',
                './bower_components/angular-cookies/angular-cookies.min.js',
                './bower_components/angular-sanitize/angular-sanitize.min.js',
                './bower_components/angular-route/angular-route.min.js'
            ]
        },
        rulesbuilder: {
            scripts: [
                './public/scripts/services/services.js',
                './public/scripts/app.js',
                './public/scripts/routes.js',
                './public/scripts/controllers/rules-builder.js',
                './public/scripts/directives/node-container.js',
                './public/scripts/directives/node-thumbnail.js',
                './public/scripts/directives/nodes.js'
            ]
        }
    }
};

