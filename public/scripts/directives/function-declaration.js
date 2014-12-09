'use strict'

rulesBuilderApp.directive('functionDeclaration', function($sce, $modal, QueryService, UtilService, $filter){
    var modalInstance;
    var json;
    var dragSrcEl;

    return {
        restrict: 'A',
        transclude: true,
        templateUrl: '/partials/function-declaration',
        controller: function($scope) {
            $scope.isCollapsed = false;
            $scope.body = null;
            $scope.name = null;
            $scope.parameterList = [];
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

            element.find(".droppable").on('dragover', null, {'scope' :scope}, function(e){
                if (e.preventDefault) {
                    e.preventDefault(); // Necessary. Allows us to drop.
                }

                e.originalEvent.dataTransfer.dropEffect = 'move';

                return false;
            });

           element.find(".droppable").on('dragenter', null, {'scope' :scope}, function(e){
               // this / e.target is the current hover target.
               $(this).addClass('over');
               //$(this).css("height", $(dragSrcEl).height());
           });

           element.find(".droppable").on('dragleave', null, {'scope' :scope}, function(e){
               $(this).removeClass('over');  // this / e.target is previous target element.
               //$(this).css("height", "2px");
           });

           element.find(".droppable").on('drop', null, {'scope' :scope}, function(e){
               // this/e.target is current target element.

               if (e.stopPropagation) {
                   e.stopPropagation(); // Stops some browsers from redirecting.
               }

               scope.$apply(function () {
                   var transferredData = JSON.parse(e.originalEvent.dataTransfer.getData('blocktype'));
                   if (transferredData) {
                       scope.parameterList.push({"blockType": transferredData.type});
                   }
               });

                return false;
            });
        }
    };
});

