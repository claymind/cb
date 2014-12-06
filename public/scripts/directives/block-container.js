'use strict'

rulesBuilderApp.directive("blockContainer", function($compile) {
    return {
        restriction: 'A',
        link: function($scope, element, attributes ) {
            //$scope.$emit(attributes["blockContainer"] || "create_done", element);
            var ele = $("<div " + $scope.blockItem.blockType + "></div>");
            ele = $compile(ele)($scope);
            element.append(ele);
        }
    }
});