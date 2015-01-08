'use strict'

rulesBuilderApp.directive("nodeContainer", ["$compile", function($compile) {
    return {
        restriction: 'A',
        scope: {
            context: '=context'
        },
        link: function(scope, element, attributes ) {
            //$scope.$emit(attributes["blockContainer"] || "create_done", element);
            //var controlName = $scope.nodeItem ? $scope.nodeItem.controlName : $scope.controlName;
            var controlName, className;

            if (!scope.context && scope.$parent.tempTree.Program) { //no context, must be root
                controlName = "rb-" + scope.$parent.tempTree.Program.controlName;
                className = scope.$parent.tempTree.Program.controlName;
            }
            else {
                //var item = scope.context;
                //var keys = Object.keys(item);
                //for (var k=0;k < keys.length;k++) {
                //    if (typeof item[keys[k]] === "object") {
                //        if (item[keys[k]].controlName) {
                //            controlName = "rb-" + item[keys[k]].controlName;
                //            className = item[keys[k]].controlName;
                //        }
                //    }
                //}
                //

               var item = scope.context;

               if (item.controlName) {
                   controlName = "rb-" + item.controlName;
                   className = item.controlName;
               }
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
}]);