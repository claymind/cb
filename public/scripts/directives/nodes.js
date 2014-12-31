'use strict'

rulesBuilderApp.directive("rbCanvas", function($compile) {
    return {
        restrict: 'A',
        templateUrl: '/partials/canvas',
        link: function(scope, element, attrs ) {


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

                //var transferredData = JSON.parse(e.originalEvent.dataTransfer.getData('text'));
                //if (transferredData) {
                //    if ($(e.currentTarget).hasClass('canvas') && transferredData.type === 'Function') {
                //        scope.$apply(function () {
                //            var node = JSON.parse(e.originalEvent.dataTransfer.getData('text'));
                //            if (node) {
                //                //validate block
                //                scope.uiTree.children.push({"id" : node.type, "controlName": 'rb-' + node.type.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()});
                //            }
                //        });
                //    }
                //}

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

            scope.returnTypes = [];

            //initialize list of values
            var returnTypesList = validationService.getFunctionReturnTypes();

            for (var x=0; x< returnTypesList.length; x++){
                switch (returnTypesList[x]["-id"]) {
                    case "BooleanTypeNode" :
                        scope.returnTypes.push("truth");
                        break;
                    case "IntegerTypeNode" :
                        scope.returnTypes.push("number");
                        break;
                    case "StringTypeNode" :
                        scope.returnTypes.push("text");
                        break
                    case "NullTypeNode" :
                        scope.returnTypes.push("null");
                }
            }

            for (var x = 0; x < scope.item.children.length; x++) {
                var item = scope.item.children[x];

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
                                    var param = validationService.getTableReference(item.children[i].ref, item.children[i].blockId);

                                    if (param)
                                        scope.parameterList.push(param);
                                }
                            }
                        }
                        break;
                    case "Block" :
                        scope.blockList = [item];
                        break;
                }
            }
            scope.removeFunction = function(index){
                scope.uiTree.children.splice(index, 1);
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
                    var node = JSON.parse(e.originalEvent.dataTransfer.getData('text'));
                    if (node) {
                        //validate block
                        if (validationService.isValidNode(node.type, scope.item.type)) {
                            scope.parameterList.push({"type": node.type, "controlName": 'function-parameter', "action" : "Edit"});
                        }
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

            if (scope.item && scope.item.action === "Edit") {
                element.find(".display-mode").hide();
                element.find(".edit-mode").show();
            }
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

            //left
            if (scope.item.left.ref) {
                var item = validationService.getTableReference(scope.item.left.ref, scope.item.left.blockId);
                scope.left = item.name;
            }
            else {
                scope.left = scope.item.left.name;
            }

            //right
            if (!scope.item.right.children)
                scope.right = scope.item.right.value;
            else {
                //
            }
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
