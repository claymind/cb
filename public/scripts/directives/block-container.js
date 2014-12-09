'use strict'

rulesBuilderApp.directive("blockContainer", function($compile) {
    return {
        restriction: 'A',
        link: function($scope, element, attributes ) {
            //$scope.$emit(attributes["blockContainer"] || "create_done", element);
            var ele = $("<div class='"+ $scope.blockItem.controlName + "'" + $scope.blockItem.controlName + "></div>");
            ele = $compile(ele)($scope);
            element.append(ele);
        }
    }
});