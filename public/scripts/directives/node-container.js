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
            }
            else {
                controlName = "rb-" + scope.context.controlName;
                className = scope.context.controlName;
            }

            var ele = $("<span " +  controlName + "></span>");

            scope.$on("isEditMode", function(event, args) {
                element.find(".edit-mode").show();
                element.find(".display-mode").hide();
            });

            scope.$on("isDisplayMode", function(event, args) {
                element.find(".display-mode").show();
                element.find(".edit-mode").hide();
            });

            ele = $compile(ele)(scope.$parent);
            element.append(ele);
        }
    }
});