'use strict'

rulesBuilderApp.directive("nodeContainer", function($compile) {
    return {
        restriction: 'A',
        scope: {
            context: '=context'
        },
        link: function(scope, element, attributes ) {
            //$scope.$emit(attributes["blockContainer"] || "create_done", element);
            //var controlName = $scope.nodeItem ? $scope.nodeItem.controlName : $scope.controlName;
            var controlName, className;

            if (!scope.context) { //no context, must be root
                controlName = "rb-" + scope.$parent.uiTree.controlName;
                className = scope.$parent.uiTree.controlName;
                var ele = $("<div class='"+ className + "'" +  controlName + "></div>");
                ele = $compile(ele)(scope.$parent);

            }
            else {
                controlName = "rb-" + scope.context.controlName;
                className = scope.context.controlName;
                var ele = $("<div class='"+ className + "'" +  controlName + "></div>");
                ele = $compile(ele)(scope.$parent);

            }


            element.append(ele);
        }
    }
});