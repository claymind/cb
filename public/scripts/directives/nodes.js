'use strict'

rulesBuilderApp.directive("rbProgram", ["$compile", function($compile) {
    return {
        restrict: 'A',
        templateUrl: '/partials/program',
        link: function(scope, element, attrs ) {
            scope.functionList = [];

            scope.$watch('tempTree.table', function(newValue, oldValue) {
                var ref;
                if (newValue.length > oldValue.length) { //added param
                    //_.difference([1, 2, 3, 4, 5], [5, 2, 10]);
                }
                else {
                    ref =  _.filter(oldValue, function(obj){ return !_.findWhere(newValue, obj); });
                }

            }, true);

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

rulesBuilderApp.directive('rbFunction', ["$sce", "validationService", "$filter", "$timeout", function($sce, validationService, $filter, $timeout){
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
                                            var param = validationService.getTableReference(field.children[i].ref, scope.item.id);
                                            param["controlName"] = field.children[i].type;
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

                if (validationService.removeFunctionParameter(this.item, scope.$root.tempTree, scope.item.id)){
                    scope.parameterList.splice(index, 1);
                }
            };

            scope.functionNameChange= function(index) {
                validationService.editFunctionName(scope.$root.tempTree, scope.item.id, this.name);
            };

            scope.functionReturnTypeChange= function(index) {
                validationService.editFunctionReturnType(scope.$root.tempTree, scope.item.id, this.returnType);
            };

            scope.paramNameChange = function(index) {
                validationService.editFunctionParameter(this.item, scope.$root.tempTree, scope.item.id, "name", this.item.name);

            };

            scope.paramTypeChange = function(index) {
                validationService.editFunctionParameter(this.item, scope.$root.tempTree, scope.item.id, "value", this.item.value);

            };

            scope.removeStatement = function(index) {

                if (validationService.removeStatement(this.item, scope.$root.tempTree, scope.item.id)){
                    scope.statementList.splice(index, 1);
                }
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
                                    newItem = {
                                        "functionId": scope.item.id,
                                        "type": "ParameterNode",
                                        "controlName": "Parameternode",
                                        "action" : "Edit"
                                    };

                                    //check if refID exists
                                    if(!validationService.getTableReference(newItem.ref, newItem.functionId)){
                                        newItem.ref = uuid.v1();
                                        scope.parameterList.push(newItem);
                                        if (validationService.addFunctionParameter(newItem, scope.$root.tempTree, newItem.functionId, scope.$root.tempTree)){
                                            console.info("Add Parameter Successful");
                                        }
                                        else {
                                            console.info("Add Parameter Failed");
                                        }
                                    }

                                    break;
                                case "ReturnStatement" :
                                    newItem = {
                                        "functionId": scope.item.id,
                                        "type": "ReturnStatement",
                                        "controlName": "Returnstatement",
                                        "action" : "Edit"
                                    };

                                    newItem.id = uuid.v1();
                                    scope.statementList.push(newItem);

                                    if (validationService.addStatement(newItem, scope.$root.tempTree, newItem.functionId, scope.$root.tempTree)){
                                        console.info("Add Statement Successful");
                                    }
                                    else {
                                        console.info("Add Statement Failed");
                                    }
                                    break;
                            }


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

            if (scope.item && scope.item.action === "Edit") {
                element.find(".display-mode").hide();
                element.find(".edit-mode").show();
            }
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

            if (scope.item && scope.item.action === "Edit") {
                element.find(".display-mode").hide();
                element.find(".edit-mode").show();
            }

            var text = "Click to Add Expression";

            //display mode
            if (scope.item.action !== "Edit") {
                var operatorText = "";
                var previousNode = "";
                var values = [];
                text ="";
                traverse(scope.item.expression).forEach(function (exp) {
                    switch (exp.type) {
                        case "EqualToExpression" :
                            operatorText = "(<span class='user-input'>{left}</span> <span class='operator-keyword'>is equal to</span> <span class='user-input'>{right}</span>)";

                            if (!text)
                                text += operatorText;
                            else {
                                if (previousNode === "left") {
                                    text = text.replace("{left}", operatorText);
                                }

                                if (previousNode === "right") {
                                    text = text.replace("{right}", operatorText);
                                }
                            }

                            break;
                        case "NotEqualToExpression" :
                            operatorText = "(<span class='user-input'>{left}</span> <span class='operator-keyword'>is not equal to</span> <span class='user-input'>{right}</span>)";

                            if (!text)
                                text += operatorText;
                            else {
                                if (previousNode === "left") {
                                    text = text.replace("{left}", operatorText);
                                }

                                if (previousNode === "right") {
                                    text = text.replace("{right}", operatorText);
                                }
                            }
                            break;
                        case "LessThanExpression" :
                            operatorText = "(<span class='user-input'>{left}</span> <span class='operator-keyword'>is less than</span> <span class='user-input'>{right}</span>)";

                            if (!text)
                                text += operatorText;
                            else {
                                if (previousNode === "left") {
                                    text = text.replace("{left}", operatorText);
                                }

                                if (previousNode === "right") {
                                    text = text.replace("{right}", operatorText);
                                }
                            }
                            break;
                        case "GreaterThanExpression" :
                            operatorText = "(<span class='user-input'>{left}</span> <span class='operator-keyword'>is greater than</span> <span class='user-input'>{right}</span>)";

                            if (!text)
                                text += operatorText;
                            else {
                                if (previousNode === "left") {
                                    text = text.replace("{left}", operatorText);
                                }

                                if (previousNode === "right") {
                                    text = text.replace("{right}", operatorText);
                                }
                            }
                            break;
                        case "LessThanOrEqualExpression" :
                            operatorText = "(<span class='user-input'>{left}</span> <span class='operator-keyword'>is less than or equal to</span> <span class='user-input'>{right}</span>)";

                            if (!text)
                                text += operatorText;
                            else {
                                if (previousNode === "left") {
                                    text = text.replace("{left}", operatorText);
                                }

                                if (previousNode === "right") {
                                    text = text.replace("{right}", operatorText);
                                }
                            }
                            break;
                        case "GreaterThanOrEqualExpression" :
                            operatorText = "(<span class='user-input'>{left}</span> <span class='operator-keyword'>is greater than or equal to</span> <span class='user-input'>{right}</span>)";

                            if (!text)
                                text += operatorText;
                            else {
                                if (previousNode === "left") {
                                    text = text.replace("{left}", operatorText);
                                }

                                if (previousNode === "right") {
                                    text = text.replace("{right}", operatorText);
                                }
                            }
                            break;
                        case "SimpleVariableReferenceNode":
                            if (exp.ref) {
                                //find the function name
                                var funcEle = element.closest(".rb-function");

                                if (funcEle.length > 0) {
                                    var funcId = funcEle.data("functionid");
                                    var item = validationService.getTableReference(exp.ref, funcId);
                                    if (item.name) {
                                        //text += " " + item.name;
                                        values.push(item.name);
                                    }
                                }
                            }

                            if (previousNode === "left") {
                                text.replace("{left}", text);
                            }

                            if (previousNode === "right") {
                                text.replace("{right}", text);
                            }

                            break;
                        case "FieldAccessNode" :
                            break;
                        case "left" :
                            if (exp.value) {
                                values.push(exp.value);
                            }

                            previousNode = "left";
                            break;
                        case "right" :
                            if (exp.value) {
                                values.push(exp.value);
                            }

                            previousNode = "right";
                            break
                        default: //may be literals
                            if (exp.value) {
                                values.push(exp.value);
                                previousNode = "literal";
                            }
                    }
                    ;
                });

                //loop through the values
                for (var v = 0; v < values.length; v++) {
                    var pos1 = text.indexOf("{");
                    var pos2 = text.indexOf("}");

                    var placeholder = text.substring(pos1, pos2 + 1);
                    text = text.replace(placeholder, values[v]);
                }


                //display mode
                var displayNode = element.find(".display-mode .expression-node");

                displayNode.html(text);
            }

            //edit mode
            var editNode = element.find(".edit-mode .expression-node");


            editNode.html("<span><span class='glyphicon glyphicon-collapse-down' ng-show=''></span>" + text + "</span>");
            //editNode.append("<div class='expression-editor'></div>");

            //var expressionProductions = validationService.getProductions("ExpressionNode");
            //
            //for (var p=0;p<expressionProductions.length;p++) {
            //    if (expressionProductions[p].Group) {
            //        scope.expressionGroup = expressionProductions[p].Group;
            //        break;
            //    }
            //}
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
                        //find the function name
                        var funcEle = element.closest(".rb-function");

                        if (funcEle.length > 0) {
                            var funcId = funcEle.data("functionid");
                            var item = validationService.getTableReference(scope.item.left.ref, funcId);
                            if (item.name)
                                scope.left = item.name;
                        }

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
                        //find the function name
                        var funcEle = element.closest(".rb-function");

                        if (funcEle.length > 0) {
                            var funcId = funcEle.data("functionid");
                            var item = validationService.getTableReference(scope.item.right.ref, funcId);
                            if (item.name)
                                scope.right = item.name;
                        }
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

