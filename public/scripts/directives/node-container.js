'use strict'

rulesBuilderApp.directive("nodeContainer", ["$compile", "validationService", function($compile, validationService) {
    return {
        restriction: 'A',
        scope: {
            context: '=context'
        },
        link: function(scope, element, attributes ) {
            var controlName, className;


           var item = scope.context;
            if (!item) {
                //root
                controlName = validationService.tempTree && validationService.tempTree.controlName;
            }
            else {
                controlName = item.controlName;
            }

           if (controlName) {
               controlName = "rb-" + controlName;
               className = controlName;

               var ele = $("<span " +  controlName + "></span>");

               //scope.$on("isEditMode", function(event, args) {
               //    //element.find(".edit-mode").show();
               //    //element.find(".display-mode").hide();
               //    scope.$broadcast("isEditModeFired", null);
               //});
               //
               //scope.$on("isDisplayMode", function(event, args) {
               //    //element.find(".display-mode").show();
               //    //element.find(".edit-mode").hide();
               //    scope.$broadcast("isDisplayModeFired", null);
               //});

               //scope.$parent.root = scope.$root;
               ele = $compile(ele)(scope.$parent);
               element.append(ele);
           }
        }
    }
}]);