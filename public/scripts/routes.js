rulesBuilderApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/localhost/g3/views/', {
            templateUrl: '/partials/rules-designer'
            //controller: 'RulesDesignerCtrl'
        })
        .otherwise({
            templateUrl: '/partials/page-not-found'
        });

    $locationProvider.html5Mode(true);
}]);