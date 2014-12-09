'use strict'

rulesBuilderApp.directive('rbFunction', function($sce, $modal, validationService, $filter){
    var modalInstance;
    var json;
    var dragSrcEl;

    return {
        restrict: 'A',
        templateUrl: '/partials/function',
        controller: function($scope) {
            $scope.id = "Function";
            $scope.isCollapsed = false;
            $scope.body = null;
            $scope.name = null;
            $scope.parameterList = [];
            $scope.returnType = null;
        },
        link: function(scope, element, attrs){

            scope.onReturnTypeChange = function() {
                //this = current list item
            };

            scope.removeFunction = function(index){
                scope.canvasBlockList.splice(index, 1);
            }

            scope.removeParameter = function(index) {
                scope.parameterList.splice(index, 1);
            }

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
                $(this).removeClass('over');
                if (e.stopPropagation) {
                    e.stopPropagation(); // Stops some browsers from redirecting.
                }

                scope.$apply(function () {
                    var node = JSON.parse(e.originalEvent.dataTransfer.getData('blocktype'));
                    if (node) {
                        //validate block
                        var x = validationService.isValidNode(node.type, scope.blockItem.id);
                        scope.parameterList.push({"id" : node.type, "controlName": 'rb-' + node.type.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()});
                    }
                });

                return false;
            });
        }
    };
});


rulesBuilderApp.directive('rbVariableNode', function($sce, $modal, validationService, $filter){
    var modalInstance;
    var json;
    var dragSrcEl;

    return {
        restrict: 'A',
        templateUrl: '/partials/variable-node',
        controller: function($scope) {
            $scope.isCollapsed = false;
            $scope.body = null;
            $scope.name = null;
            $scope.variables = [];
            $scope.returnType = null;
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

rulesBuilderApp.directive('rbParameterNode', function($sce, $modal, validationService, $filter){
    var modalInstance;
    var json;
    var dragSrcEl;

    return {
        restrict: 'A',
        templateUrl: '/partials/parameter-node',
        controller: function($scope) {
            $scope.isCollapsed = false;
            $scope.body = null;
            $scope.name = null;
            $scope.params = [];
            $scope.returnType = null;
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