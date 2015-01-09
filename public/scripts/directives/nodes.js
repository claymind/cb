'use strict'

rulesBuilderApp.directive("rbProgram", ["$compile", function($compile) {
    return {
        restrict: 'A',
        templateUrl: '/partials/program',
        link: function(scope, element, attrs ) {
            scope.functionList = [];



            for(var c=0;c<scope.tempTree.children.length;c++) {
                switch (scope.tempTree.children[c].type) {
                    case "Function" :
                        scope.functionList.push(scope.tempTree.children[c]);
                        break;
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

                $(this).removeClass('over');
                return false;

            });
        }
    }
}]);

rulesBuilderApp.directive('rbFunction', ["$sce", "validationService", "$filter", function($sce, validationService, $filter){
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

            var identifierProductions = validationService.getProductions("Identifier");
            for (var p=0;p<identifierProductions.length;p++) {
                if (identifierProductions[p].Pattern) {
                    scope.identifierPattern = identifierProductions[p].Pattern;
                    break;
                }
            }

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

            //watch the parameters
            //scope.$watch('parameterList', function(newValue, oldValue) {
            //
            //}, true);

            //display mode
            if (scope.item.action !== "Edit") {
                if (scope.item.fields){
                    for (var f=0;f<scope.item.fields.length;f++) {
                        var field= scope.item.fields[f];
                        switch (field.name) {
                            case "Name" :
                                scope.name = field.value;
                                break;
                            case "ReturnType" :
                                scope.returnType = field.value;
                                break;
                            case "Parameters" :
                                if (field.children) {
                                    for (var i = 0; i < field.children.length; i++) {
                                        if (field.children[i].ref) {
                                            var param = validationService.getTableReference(field.children[i].ref);
                                            param["controlName"] = field.children[i].type;
                                            param["id"] = field.children[i].id;
                                            if (param)
                                                scope.parameterList.push(param);
                                        }
                                    }
                                }
                                break;
                            case "Body" :
                                for (var s=0;s<field.children.length;s++){
                                    scope.statementList.push(field.children[s]);
                                }
                                break;
                        }
                    }
                }
            }

            scope.removeFunction = function(index){
                scope.$root.tempTree.children.splice(index, 1);
                //todo: update tree


            };



            scope.removeParameter = function(index) {
                scope.parameterList.splice(index, 1);

                validationService.findNodeAndDelete(this.item, scope.$root.tempTree, scope.item.id, scope.$root.tempTree);
            };

            scope.paramNameChange = function(index) {
                //look at dependent statements and change them accordingly. change table
                var tree= scope.$root.tempTree;

            };

            scope.removeStatement = function(index) {
                scope.statementList.splice(index, 1);
                //todo: update tree
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
                $(this).removeClass('over');
                if (e.stopPropagation) {
                    e.stopPropagation(); // Stops some browsers from redirecting.
                }

                scope.$apply(function () {
                    var node = JSON.parse(e.originalEvent.dataTransfer.getData('text'));
                    if (node) {
                        //validate block
                        var dropGroup= $(e.currentTarget).data("group");
                        var newItem = {};

                        if (validationService.isValidNode(node.type, dropGroup)) {
                            switch (node.type) {
                                case "ParameterNode" :
                                    //todo: create a ref node as well as a parameter node
                                    newItem = {
                                        "ref": 1,
                                        "id": "Parameter-1",
                                        "blockId": "Function-1",
                                        "type": "ParameterNode",
                                        "controlName": "Parameternode"
                                    }
                                    scope.parameterList.push({"type": node.type, "controlName": 'Parameternode', "action" : "Edit"});
                                    break;
                                case "ReturnStatement" :
                                    newItem = {
                                        "ref": 1,
                                        "id": "Parameter-1",
                                        "blockId": "Function-1",
                                        "type": "ReturnStatement",
                                        "controlName": "Returnstatement"
                                    }
                                    scope.statementList.push({"type": node.type, "controlName": 'Returnstatement', "action" : "Edit"});
                                    break;
                            }

                            //update temp tree
                            validationService.findNodeAndAdd(node.id, scope.$root.tempTree);
                        }


                    }
                });

                return false;
            });
        }
    };
}]);


rulesBuilderApp.directive('rbParameternode', ["$sce", "validationService", "$filter", function($sce,validationService, $filter){
    var json;
    var dragSrcEl;

    return {
        restrict: 'A',
        templateUrl: '/partials/parameter-node',
        link: function(scope, element, attrs){

            //if (scope.item && scope.item.action === "Edit") {
            //    element.find(".display-mode").hide();
            //    element.find(".edit-mode").show();
            //}
        }
    };
}]);

rulesBuilderApp.directive('rbVariablenode', ["$sce", "validationService", "$filter",  function($sce, validationService, $filter){
    var json;
    var dragSrcEl;

    return {
        restrict: 'A',
        templateUrl: '/partials/variable-node',
        link: function(scope, element, attrs){
            scope.expressionList = [];
            scope.editMode = false;

            //display mode
            if (scope.item.action !== "Edit") {
                for (var k = 0; k < scope.item.children.length; k++) {
                    scope.expressionList.push(scope.item.children[k]);
                }
            }
        }
    };
}]);


rulesBuilderApp.directive('rbReturnstatement', ["$sce", "validationService", "$filter",function($sce, validationService, $filter){
    var json;
    var dragSrcEl;

    return {
        restrict: 'A',
        templateUrl: '/partials/return-statement',
        link: function(scope, element, attrs){
            scope.expressionList = [];
            scope.editMode = false;

            //display mode
            if (scope.item.action !== "Edit") {
                for (var k = 0; k < scope.item.children.length; k++) {
                    scope.expressionList.push(scope.item.children[k]);
                }
            }
        }
    };
}]);

rulesBuilderApp.directive('rbEqualtoexpression', ["$sce", "validationService", "$filter", function($sce, validationService, $filter){
    var json;
    var dragSrcEl;

    return {
        restrict: 'A',
        templateUrl: '/partials/equal-to-expression',
        link: function(scope, element, attrs){
            scope.editMode = false;

            //display mode
            if (scope.item.action !== "Edit") {
                //left
                if (scope.item.left) {
                    if(scope.item.left.ref) {
                        var item = validationService.getTableReference(scope.item.left.ref);
                        if (item.name)
                            scope.left = item.name;
                    }
                    else {
                        if (scope.item.left.name)
                            scope.left = scope.item.left.name;
                        else if (scope.item.left.value)
                            scope.left = scope.item.left.value;
                    }
                }


                //right
                if (scope.item.right) {
                    if(scope.item.right.ref) {
                        var item = validationService.getTableReference(scope.item.right.ref);
                        if (item.name)
                            scope.right = item.name;
                    }
                    else {
                        if (scope.item.right.name)
                            scope.right = scope.item.right.name;
                        else if (scope.item.right.value)
                            scope.right = scope.item.right.value;
                    }
                }

            }
        }
    };
}]);
