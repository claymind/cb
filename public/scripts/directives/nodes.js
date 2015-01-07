'use strict'

rulesBuilderApp.directive("rbProgram", function($compile, $rootScope) {
    return {
        restrict: 'A',
        templateUrl: '/partials/program',
        link: function(scope, element, attrs ) {
            scope.functionList = [];

            for (var k=0;k<scope.tempTree.Program.children.length;k++) {
                var node = scope.tempTree.Program.children[k];
                var keys = Object.keys(node);
                for (var k=0;k<keys.length;k++) {
                    switch (keys[k]) {
                        case "Function" :
                            scope.functionList.push(node[keys[k]]);
                            break;
                    }
                }
            }

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
                //                scope.tempTree.children.push({"id" : node.type, "controlName": 'rb-' + node.type.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()});
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

rulesBuilderApp.directive('rbFunction', function($sce, validationService, $filter, $rootScope){
    var json;
    var dragSrcEl;

    return {
        restrict: 'A',
        templateUrl: '/partials/function',
        link: function(scope, element, attrs){
            scope.body = null;
            scope.parameterList = [];
            scope.statementList = [];
            scope.blockList = [];
            scope.returnTypes = [];

            ////get Productions
            //var nameProductions = validationService.getProductions("Function", "Name");
            //var returnTypeProductions = validationService.getProductions("Function", "ReturnType");
            //var bodyProductions = validationService.getProductions("Function", "Body");

            //intialize name field
            //for (var n=0;n<nameProductions.length;n++) {
            //    for (var x=0;x<Object.keys(nameProductions[n]).length;x++) {
            //        var prod = Object.keys(nameProductions[n])[x];
            //        switch(prod) {
            //            case "match" :
            //                scope.namePattern = nameProductions[n][prod]["-pattern"];
            //                break;
            //        }
            //    }
            //}

            var parametersProductions = validationService.getProductions("ParameterNode");

            for (var p=0;p<parametersProductions.length;p++) {
                if (parametersProductions[p].Group) {
                    scope.parametersGroup = parametersProductions[p].Group;
                    break;
                }
            }

            var statementsProductions = validationService.getProductions("ReturnStatement");

            for (var p=0;p<statementsProductions.length;p++) {
                if (statementsProductions[p].Group) {
                    scope.statementsGroup = statementsProductions[p].Group;
                    break;
                }
            }

            //initialize list of values
            var returnTypesList = validationService.getFunctionReturnTypes();

            for (var x=0; x< returnTypesList.length; x++){
                switch (returnTypesList[x]["Id"]) {
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


            var keys = Object.keys(scope.item);

            for (var k=0;k<keys.length;k++) {
                var item = scope.item[keys[k]];

                switch (keys[k]) {
                    case "Name" :
                        scope.name = item.value;
                        break;
                    case "ReturnType" :
                        scope.returnType = item.value;
                        break;
                    case "Parameters" :
                        if (item.children) {
                            for (var i = 0; i < item.children.length; i++) {
                                if (item.children[i].ParameterNode.ref) {
                                    var param = validationService.getTableReference(item.children[i].ParameterNode.ref, item.children[i].ParameterNode.blockId);
                                    param["controlName"] = "Parameternode";
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

            //for (var x = 0; x < scope.item.children.length; x++) {
            //    var item = scope.item.children[x];
            //
            //    switch (item.type) {
            //        case "Name" :
            //            scope.name = item.value;
            //            break;
            //        case "ReturnType" :
            //            scope.returnType = item.value;
            //            break;
            //        case "Parameters" :
            //            if (item.children) {
            //                for (var i = 0; i < item.children.length; i++) {
            //                    if (item.children[i].ref) {
            //                        var param = validationService.getTableReference(item.children[i].ref, item.children[i].blockId);
            //                        param["controlName"] = "Parameternode";
            //                        if (param)
            //                            scope.parameterList.push(param);
            //                    }
            //                }
            //            }
            //            break;
            //        case "Block" :
            //            scope.blockList = [item];
            //            break;
            //    }
            //}

            scope.removeFunction = function(index){
                scope.tempTree.children.splice(index, 1);
            };

            scope.removeParameter = function(index) {
                scope.parameterList.splice(index, 1);
            };

            //scope.onNameChange = function() {
            //    //apply production
            //    for (var p=0;p<nameProductions.length;p++) {
            //        switch (nameProductions[p]) {
            //            case "isNull" :
            //                var x = 1;
            //                break;
            //            case "match" :
            //        }
            //    }
            //};

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
                        var dropGroup= $(e.currentTarget).data("group");

                        if (validationService.isValidNode(node.type, dropGroup)) {
                            switch (node.type) {
                                case "ParameterNode" :
                                    scope.parameterList.push({"type": node.type, "controlName": 'Parameternode', "action" : "Edit"});
                                    break;
                                case "StatementNode" :
                                    scope.statementList.push({"type": node.type, "controlName": 'Statementnode', "action" : "Edit"});
                                    break;
                            }

                            //update temp tree
                        }


                    }
                });

                return false;
            });
        }
    };
});


rulesBuilderApp.directive('rbParameternode', function($sce,validationService, $filter,$rootScope){
    var json;
    var dragSrcEl;

    return {
        restrict: 'A',
        templateUrl: '/partials/parameter-node',
        link: function(scope, element, attrs){


            if (scope.item && scope.item.action === "Edit") {
                element.find(".display-mode").hide();
                element.find(".edit-mode").show();
            }
        }
    };
});

rulesBuilderApp.directive('rbBlock', function($sce, validationService, $filter,$rootScope){
    var json;
    var dragSrcEl;

    return {
        restrict: 'A',
        templateUrl: '/partials/block',
        link: function(scope, element, attrs){
            scope.editMode = false;
            scope.statementList = [];

            for (var k=0;k<scope.item.children.length;k++) {
                var node = scope.item.children[k];
                var keys = Object.keys(node);
                for (var k=0;k<keys.length;k++) {
                    //todo: make this dynamic
                    switch (keys[k]) {
                        case "ReturnStatement" :
                            scope.statementList.push(node[keys[k]]);
                            break;
                    }
                }
            }

            //angular.forEach(scope.item.children, function (item, index) {
            //    if (item.children){
            //        for (var i=0; i<item.children.length; i++){
            //            var nodeType = item.children[i].type;
            //            scope.statementList.push(item);
            //        }
            //    }
            //});
        }
    };
});

rulesBuilderApp.directive('rbReturnstatement', function($sce, validationService, $filter,$rootScope){
    var json;
    var dragSrcEl;

    return {
        restrict: 'A',
        templateUrl: '/partials/return-statement',
        link: function(scope, element, attrs){
            scope.expressionList = [];
            scope.editMode = false;

            for (var k=0;k<scope.item.children.length;k++) {
                var node = scope.item.children[k];
                var keys = Object.keys(node);
                for (var k=0;k<keys.length;k++) {
                    //todo: make this dynamic
                    switch (keys[k]) {
                        case "EqualToExpression" :
                            scope.expressionList.push(node[keys[k]]);
                            break;
                    }
                }
            }

            //angular.forEach(scope.item.children, function (item, index) {
            //    if (item.left) {
            //        scope.expressionList.push(item);
            //    }
            //});
        }
    };
});

rulesBuilderApp.directive('rbEqualtoexpression', function($sce, validationService, $filter,$rootScope){
    var json;
    var dragSrcEl;

    return {
        restrict: 'A',
        templateUrl: '/partials/equal-to-expression',
        link: function(scope, element, attrs){
            scope.editMode = false;

            //left
            if (scope.item.Left.ref) {
                var item = validationService.getTableReference(scope.item.Left.ref, scope.item.Left.blockId);
                scope.left = item.name;
            }
            else {
                scope.left = scope.item.Left.name;
            }

            //right
            if (scope.item.Right.children && scope.item.Right.children.length > 0) {
                //todo: support nested expressions
            }
            else {

                var keys = Object.keys(scope.item.Right);
                for (var k=0;k<keys.length;k++) {
                    //todo: make this dynamic
                    switch (keys[k]) {
                        case "BooleanLiteral" :
                            scope.right = scope.item.Right[keys[k]].value;
                            break;
                    }
                }

            }
        }
    };
});
//
//rulesBuilderApp.directive("tree", function(RecursionHelper) {
//    return {
//        restrict: "E",
//        scope: {family: '='},
//        transclude: false,
//        templateUrl: '/partials/tree-node',
//        compile: function(element) {
//            return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn){
//                // Define your normal link function here.
//                // Alternative: instead of passing a function,
//                // you can also pass an object with
//                // a 'pre'- and 'post'-link function.
//                scope.text = "";
//                if (scope.family.text)
//                     scope.text = scope.family.text;
//            });
//        }
//    };
//});
