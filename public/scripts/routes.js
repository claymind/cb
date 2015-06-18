rulesBuilderApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/partials/rules-designer'
        })
        .otherwise({
            templateUrl: '/partials/page-not-found'
        });

    $locationProvider.html5Mode(false);
}]);