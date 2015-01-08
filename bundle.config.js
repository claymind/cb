module.exports = {
    bundle: {
        angular: {
            scripts: [
                './bower_components/angular/angular.js',
                './bower_components/angular-resource/angular-resource.js',
                './bower_components/angular-cookies/angular-cookies.js',
                './bower_components/angular-sanitize/angular-sanitize.js',
                './bower_components/angular-route/angular-route.js'
            ]
        },
        rulesbuilder: {
            scripts: [
                './dist/scripts/app.js',
                './dist/scripts/services/services.js',
                './dist/scripts/routes.js',
                './dist/scripts/controllers/rules-builder.js',
                './dist/scripts/directives/node-container.js',
                './dist/scripts/directives/node-thumbnail.js',
                './dist/scripts/directives/nodes.js'
            ]
        }
    }
};

