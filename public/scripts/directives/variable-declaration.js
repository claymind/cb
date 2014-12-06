'use strict'

rulesBuilderApp.directive('variableDeclaration', function($sce, $modal, QueryService, UtilService, $filter){
    var modalInstance;
    var json;
    var dragSrcEl;

    return {
        restrict: 'A',
        transclude: true,
        templateUrl: '/partials/variable-declaration',
        controller: function($scope) {
            $scope.isCollapsed = false;
            $scope.body = null;
            $scope.name = null;
            $scope.params = [];
            $scope.returnType = null;
            $scope.declarationBlockList = [];
        },
        link: function(scope, element, attrs){
            var canvas = $(scope.$parent.canvasSelector);

            scope.onNameChange = function() {
                scope.name = element.val();
            };

            scope.onReturnTypeChange = function() {
                //this = current list item
            };

        }
    };
});

