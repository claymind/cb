'use strict'

rulesBuilderApp.directive("rbCanvas", function($compile) {
    return {
        restrict: 'A',
        templateUrl: '/partials/canvas',
        link: function(scope, element, attrs ) {

            var table = scope.uiTree.table || [];

            //load the function table and assign a listener to those refs
            for (var t = 0; t < table.length; t++) {
                var eventName = "blockScopeRequest-" +table[t].ref + "-" + table[t].blockId;
                scope.$on(eventName, function(event, args){
                    var tbl = event.currentScope.uiTree.table;
                    var foundItem = _.find(tbl, function(item) {
                        if ((item.ref === args.ref) && (item.blockId === args.blockId)) {
                            return item;
                        }
                    });
                    if (foundItem) {
                        scope.$broadcast("blockScopeResponse-" + args.ref + "-" + args.blockId, foundItem);
                    }
                });
            }

            scope.toggleDisplayMode = function() {
                if (scope.isEditMode) {
                    element.find(".display-mode").show();
                    element.find(".edit-mode").hide();
                }
                else {
                    element.find(".display-mode").hide();
                    element.find(".edit-mode").show();
                }

                scope.isEditMode = !scope.isEditMode;

            };

            element.on('dragover', null, {'scope' :scope}, function(e){
                if (e.preventDefault) {
                    e.preventDefault(); // Necessary. Allows us to drop.
                }

                e.originalEvent.dataTransfer.dropEffect = 'move';

                return false;
            });

            element.on('dragenter', null, {'scope' :scope}, function(e){
                // this / e.target is the current hover target.
                $(this).addClass('over');
                //$(this).css("height", $(dragSrcEl).height());
            });

            element.on('dragleave', null, {'scope' :scope}, function(e){
                $(this).removeClass('over');  // this / e.target is previous target element.
                //$(this).css("height", "2px");
            });

            element.on('drop', null, {'scope' :scope}, function(e){
                // this/e.target is current target element.

                if (e.stopPropagation) {
                    e.stopPropagation(); // Stops some browsers from redirecting.
                }

                var transferredData = JSON.parse(e.originalEvent.dataTransfer.getData('text'));
                if (transferredData) {
                    if ($(e.currentTarget).hasClass('canvas') && transferredData.type === 'Function') {
                        scope.$apply(function () {
                            var node = JSON.parse(e.originalEvent.dataTransfer.getData('text'));
                            if (node) {
                                //validate block
                                scope.canvasBlockList.push({"id" : node.type, "controlName": 'rb-' + node.type.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()});
                            }
                        });
                    }
                }

                $(this).removeClass('over');
                return false;

            });
        }
    }
});

rulesBuilderApp.directive('rbFunction', function($sce, $modal, validationService, $filter){
    var modalInstance;
    var json;
    var dragSrcEl;

    return {
        restrict: 'A',
        templateUrl: '/partials/function',
        link: function(scope, element, attrs){
            scope.body = null;
            scope.parameterList = [];
            scope.blockList = [];



            angular.forEach(scope.item.children, function (item, index) {
                switch (item.type) {
                    case "FunctionName" :
                        scope.name = item.value;
                        break;
                    case "FunctionReturnType" :
                        scope.returnType = item.value;
                        break;
                    case "FunctionParameters" :
                        if (item.children) {
                            for (var i = 0; i < item.children.length; i++) {
                                if (item.children[i].ref) {
                                    scope.$on("blockScopeResponse-" + item.children[i].ref + "-" + item.children[i].blockId, function(event, args){
                                        scope.parameterList.push(args);
                                    });
                                    scope.$emit("blockScopeRequest-" + item.children[i].ref + "-" + item.children[i].blockId, {ref: item.children[i].ref, blockId: item.children[i].blockId});
                                }
                            }
                        }
                        break;
                    case "Block" :
                        scope.blockList = [item];
                        break;
                }

            });

            //scope.onReturnTypeChange = function() {
            //    //this = current list item
            //};
            //
            //scope.removeFunction = function(index){
            //    scope.canvasNodeList.splice(index, 1);
            //}
            //
            //scope.removeParameter = function(index) {
            //    scope.parameterList.splice(index, 1);
            //}
            //
            //element.find(".droppable").on('dragover', null, {'scope' :scope}, function(e){
            //    if (e.preventDefault) {
            //        e.preventDefault(); // Necessary. Allows us to drop.
            //    }
            //
            //    e.originalEvent.dataTransfer.dropEffect = 'move';
            //
            //    return false;
            //});
            //
            //element.find(".droppable").on('dragenter', null, {'scope' :scope}, function(e){
            //    // this / e.target is the current hover target.
            //    $(this).addClass('over');
            //    //$(this).css("height", $(dragSrcEl).height());
            //});
            //
            //element.find(".droppable").on('dragleave', null, {'scope' :scope}, function(e){
            //    $(this).removeClass('over');  // this / e.target is previous target element.
            //    //$(this).css("height", "2px");
            //});
            //
            //element.find(".droppable").on('drop', null, {'scope' :scope}, function(e){
            //    // this/e.target is current target element.
            //    $(this).removeClass('over');
            //    if (e.stopPropagation) {
            //        e.stopPropagation(); // Stops some browsers from redirecting.
            //    }
            //
            //    scope.$apply(function () {
            //        var node = JSON.parse(e.originalEvent.dataTransfer.getData('text'));
            //        if (node) {
            //            //validate block
            //            var x = validationService.isValidNode(node.type, scope.blockItem.id);
            //            scope.parameterList.push({"id" : node.type, "controlName": 'rb-' + node.type.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()});
            //        }
            //    });
            //
            //    return false;
            //});
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
            $scope.variables = [];
        },
        link: function(scope, element, attrs){

        }
    };
});

rulesBuilderApp.directive('rbFunctionParameter', function($sce, $modal, validationService, $filter){
    var modalInstance;
    var json;
    var dragSrcEl;

    return {
        restrict: 'A',
        templateUrl: '/partials/function-parameter',
        link: function(scope, element, attrs){
            scope.name = scope.item.name;
            scope.value = scope.item.value;
            scope.editMode = false;
        }
    };
});

rulesBuilderApp.directive('rbBlock', function($sce, $modal, validationService, $filter){
    var modalInstance;
    var json;
    var dragSrcEl;

    return {
        restrict: 'A',
        templateUrl: '/partials/block',
        link: function(scope, element, attrs){
            scope.editMode = false;
            scope.statementList = [];

            var table = scope.item.table || [];

            //load the block table and assign a listener to those refs
            for (var t = 0; t < table.length; t++) {
                scope.$on("blockScopeRequest-" + table[t].ref + table[t].blockId , function(event, args){
                    scope.$broadcast("blockScopeResponse-" + args.ref + "-" + args.blockId, {ref: args.ref, blockId: args.blockId});
                });
            }

            angular.forEach(scope.item.children, function (item, index) {
                if (item.children){
                    for (var i=0; i<item.children.length; i++){
                        var nodeType = item.children[i].type;
                        scope.statementList.push(item);
                    }
                }
            });
        }
    };
});

rulesBuilderApp.directive('rbReturnStatement', function($sce, $modal, validationService, $filter){
    var modalInstance;
    var json;
    var dragSrcEl;

    return {
        restrict: 'A',
        templateUrl: '/partials/return-statement',
        link: function(scope, element, attrs){
            scope.expressionList = [];
            scope.editMode = false;

            var table = scope.item.table || [];
            angular.forEach(scope.item.children, function (item, index) {
                if (item.left) {
                    scope.expressionList.push(item);
                }
            });
        }
    };
});

rulesBuilderApp.directive('rbEqualToExpression', function($sce, $modal, validationService, $filter){
    var modalInstance;
    var json;
    var dragSrcEl;

    return {
        restrict: 'A',
        templateUrl: '/partials/equal-to-expression',
        link: function(scope, element, attrs){
            scope.editMode = false;



            if (scope.item.left.ref) {
                //var item = validationService.getTableReference(scope.item.left.ref, scope.item);
                scope.$on("blockScopeResponse-" + scope.item.left.ref + "-" + scope.item.left.blockId, function(event, args){
                    var blockObject = event.targetScope.item;
                    scope.left = args.name;
                });
                var emitName = "blockScopeRequest-" + scope.item.left.ref + "-" + scope.item.left.blockId;
                scope.$emit(emitName, {ref:scope.item.left.ref, blockId: scope.item.left.blockId});

                //right
                if (!scope.item.right.children)
                    scope.right = scope.item.right.value;
            }
            else
                scope.left = scope.item.left.name;
        }
    };
});

rulesBuilderApp.directive("tree", function(RecursionHelper) {
    return {
        restrict: "E",
        scope: {family: '='},
        transclude: false,
        templateUrl: '/partials/tree-node',
        compile: function(element) {
            return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn){
                // Define your normal link function here.
                // Alternative: instead of passing a function,
                // you can also pass an object with
                // a 'pre'- and 'post'-link function.
                scope.text = "";
                if (scope.family.text)
                     scope.text = scope.family.text;
            });
        }
    };
});
