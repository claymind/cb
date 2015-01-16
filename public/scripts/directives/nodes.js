'use strict'

rulesBuilderApp.directive("rbProgram",  ["$sce", "validationService", "$filter", function($sce, validationService, $filter){
    return {
        restrict: 'A',
        templateUrl: '/partials/program',
        link: function(scope, element, attrs ) {
            scope.functionList = [];
            setModel();

            var element = element.closest(".canvas");

            var setModel = function() {
                for(var c=0;c<validationService.tempTree.children.length;c++) {
                    switch (validationService.tempTree.children[c].type) {
                        case "Function" :
                            scope.functionList.push(validationService.tempTree.children[c]);
                            break;
                        case "Validation":
                            scope.functionList.push(validationService.tempTree.children[c]);
                            break;
                    }
                }
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
                $(this).removeClass('over');

                scope.$apply(function () {
                    var node = JSON.parse(e.originalEvent.dataTransfer.getData('text'));
                    if (node) {
                        //validate block
                        var dropGroup= $(e.currentTarget).data("group");

                        if (validationService.isValidNode(node.type, dropGroup)) {
                            switch (node.type) {
                                case "Function" :
                                    var functionItem = {
                                        "id": uuid.v1(),
                                        "type": "Function",
                                        "controlName": "Function",
                                        "fields":[{
                                            "name": "Name",
                                            "value": "newFunction"
                                        }, {
                                            "name": "ReturnType",
                                            "value": "truth"
                                        }, {
                                            "name": "Parameters",
                                            "children": []
                                        }, {
                                            "name": "Body",
                                            "children": []
                                        }]
                                    };

                                    if (validationService.addFunction(functionItem,validationService.tempTree)) {

                                        //functionItem.action = "Edit";
                                        scope.functionList.push(functionItem);
                                    }

                                    break;
                                case "Validation" :
                                    var validationItem1, validationItem2;

                                    validationItem1 = {
                                        "id": uuid.v1(),
                                        "type": "Function",
                                        "controlName": "Validation",
                                        "fields":[{
                                            "name": "Name",
                                            "value": "Validation-Function-1"
                                        }, {
                                            "name": "ReturnType",
                                            "value": "truth"
                                        }, {
                                            "name": "Parameters",
                                            "children": []
                                        }, {
                                            "name": "Body",
                                            "children": []
                                        }]
                                    };
                                    validationItem2 = {
                                        "id": uuid.v1(),
                                        "type": "Function",
                                        "controlName": "Validation",
                                        "fields":[{
                                            "name": "Name",
                                            "value": "Validation-Function-2"
                                        }, {
                                            "name": "ReturnType",
                                            "value": "text"
                                        }, {
                                            "name": "Parameters",
                                            "children": []
                                        }, {
                                            "name": "Body",
                                            "children": [{
                                                "type": "ReturnStatement",
                                                "id" : uuid.v1(),
                                                "controlName": "Returnstatement",
                                                "expression": {
                                                    "id": uuid.v1(),
                                                    "type": "StringLiteral",
                                                    "value": ""
                                                }
                                            }]
                                        }]
                                    };

                                    if (validationService.addFunction(validationItem1,validationService.tempTree)) {
                                        //validationItem1.action = "Edit";
                                        scope.functionList.push(validationItem1);
                                    }

                                    if (validationService.addFunction(validationItem2,validationService.tempTree)) {
                                        //validationItem2.action = "Edit";
                                        scope.functionList.push(validationItem2);
                                    }
                                    scope.$broadcast("isEditModeFired", scope);
                                    break;
                            }
                        }
                    }
                });

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
            //scope.isEditMode = false;

            scope.$on("isEditModeFired", function(event, data){
                scope.isEditMode = true;
            });

            scope.$on("isDisplayModeFired", function(event, data){
                scope.isEditMode = false;
            });

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
            //if (scope.item.action !== "Edit") {
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
            //}

            scope.removeFunction = function(index){
                if (validationService.removeFunction(this.item, validationService.tempTree, scope.item.id)){
                    scope.functionList.splice(index, 1);
                }
            };

            scope.removeParameter = function(index) {

                if (validationService.removeFunctionParameter(this.item, validationService.tempTree, scope.item.id)){
                    scope.parameterList.splice(index, 1);
                }
            };

            scope.functionNameChange= function(index) {
                validationService.editFunctionName(validationService.tempTree, scope.item.id, this.name);
            };

            scope.functionReturnTypeChange= function(index) {
                validationService.editFunctionReturnType(validationService.tempTree, scope.item.id, this.returnType);
            };

            scope.paramNameChange = function(index) {
                validationService.editFunctionParameter(this.item, validationService.tempTree, scope.item.id, "name", this.item.name);

            };

            scope.paramTypeChange = function(index) {
                validationService.editFunctionParameter(this.item, validationService.tempTree, scope.item.id, "value", this.item.value);

            };

            scope.removeStatement = function(index) {

                if (validationService.removeStatement(this.item, validationService.tempTree, scope.item.id)){
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
                                        if (validationService.addFunctionParameter(newItem, validationService.tempTree, newItem.functionId, validationService.tempTree)){
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

                                    if (validationService.addStatement(newItem, validationService.tempTree, newItem.functionId, validationService.tempTree)){
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
            //scope.isEditMode=false;

            scope.$on("isEditModeFired", function(event, data){
                scope.isEditMode = true;
            });

            scope.$on("isDisplayModeFired", function(event, data){
                scope.isEditMode = false;
            });
            //
            //if (scope.item && scope.item.action === "Edit") {
            //    element.find(".display-mode").hide();
            //    element.find(".edit-mode").show();
            //}
        }
    };
}]);

rulesBuilderApp.directive('rbExpressiontext', ["$sce", "validationService", "$filter", "$compile", function($sce, validationService, $filter, $compile){
    var json;
    var dragSrcEl;

    return {
        restrict: 'A',
        templateUrl: '/partials/expression-text',
        scope: {
            item: '=item'
        },
        link: function(scope, element, attrs){
            scope.exp = {};
            var expressionType = scope.item && scope.item.expression && scope.item.expression.type;

            var loadEditor = function(expType) {
                if (expType) {
                    var editor = element.find('.expression-editor');
                    var operatorText = "";

                    switch (expType) {
                        case "EqualToExpression" :
                        case "NotEqualToExpression" :
                        case "LessThanExpression" :
                        case "GreaterThanExpression" :
                        case "LessThanOrEqualExpression" :
                        case "GreaterThanOrEqualExpression" :
                            var infixExp = "<div rb-Infixexpressioneditor></div>";

                            infixExp = $compile(infixExp)(scope);
                            editor.append(infixExp);
                            break;
                        case "SimpleVariableReferenceNode":
                            //var simpleExp = "<div rb-Simplevariableexpressioneditor></div>";
                            //
                            //simpleExp = $compile(simpleExp)(scope);
                            //editor.append(simpleExp);
                            break;
                        case "BooleanLiteral":
                        case "IntegerLiteral":
                        case "StringLiteral":
                            var litExp = "<div rb-Literalexpressioneditor></div>";

                            litExp = $compile(litExp)(scope);
                            editor.append(litExp);
                            break;
                        case "NullLiteral":
                            scope.exp.text = "empty";
                            var funcEle = element.closest(".rb-function");
                            if (funcEle.length > 0) {
                                var funcId = funcEle.data("functionid");
                                scope.item.expression.value = scope.exp.text;
                                validationService.updateExpression(validationService.tempTree, scope.item.expression, scope.item.id, funcId);
                            }
                            break;
                    }
                }
            };

            //existing expressions
            if (expressionType && scope.item.expression.left && scope.item.expression.left.type) {
                var expressionText = validationService.createInfixExpressionText(scope.item, element, null);
                scope.exp.text = expressionText.text;
                scope.left = expressionText.left;
                scope.right = expressionText.right;
                scope.operatorText = expressionText.operator;

                loadEditor(scope.item.expression.type);
            }

            //new expression dropped.
            scope.$on("expressionDropped", function(event, data){
                scope.item.expression = data[0];
                scope.exp.text ="<i>Click to Build Expression</i>";
                scope.operatorText = data[2];
                scope.isEditMode = true;
                //there is no editor existing, so create one. use scope.item.expression.type
                loadEditor(scope.item.expression.type);
            });


            scope.$on("expressionUpdated", function(event, data){

                var ele = element.find(".expression-text");
                var expressionText = validationService.createInfixExpressionText(data[0], ele, data[1]);

                scope.exp.text = expressionText.text;

                //emit to return statement (display-mode node)
                scope.$emit("expressionToDisplay", scope.exp.text);

            });

            scope.toggleExpressionEditor = function(){
                element.find('.expression-editor').toggle('slow', function(){

                });
            };
        }
    };
}]);


rulesBuilderApp.directive('rbReturnstatement', ["$sce", "validationService", "$filter", "$compile",function($sce, validationService, $filter,$compile){
    var json;
    var dragSrcEl;

    return {
        restrict: 'A',
        templateUrl: '/partials/return-statement',
        scope: true,
        link: function(scope, element, attrs){
            //scope.isEditMode = false;
            scope.exp = {};

            scope.$on("isEditModeFired", function(event, data){
                scope.isEditMode = true;
            });

            scope.$on("isDisplayModeFired", function(event, data){
                scope.isEditMode = false;
            });

            scope.$on("expressionToDisplay", function(event, data){
                scope.exp.text = data;
                element.find('.display-mode .expression-node .text').html(scope.exp.text);
            });

            //var expressionProductions = validationService.getProductions("ExpressionNode");
            //
            //for (var p=0;p<expressionProductions.length;p++) {
            //    if (expressionProductions[p].Group) {
            //        scope.expressionGroup = expressionProductions[p].Group;
            //        break;
            //    }
            //}

            //display mode - existing expression text
            if (scope.item && scope.item.expression && scope.item.expression.left && scope.item.expression.left.type) {
                var expressionText = validationService.createInfixExpressionText(scope.item.expression, element, null);
                scope.exp.text = expressionText.text;
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
                        var dropGroup= $(e.currentTarget).data("group");
                        var newItem = {};

                        if (validationService.isValidNode(node.type, dropGroup)) {
                            //find the function name
                            var funcEle = element.closest(".rb-function");

                            if (funcEle.length > 0) {
                                var operatorText = "";
                                //check what type of exp
                                switch (node.type) {
                                    case "EqualToExpression" :
                                        operatorText = "is equal to";
                                        node.left = {};
                                        node.right ={};
                                        node.id = uuid.v1();
                                        break;
                                    case "NotEqualToExpression" :
                                        operatorText = "is not equal to";
                                        node.left = {};
                                        node.right ={};
                                        node.id = uuid.v1();
                                        break;
                                    case "LessThanExpression" :
                                        operatorText = "is less than";
                                        node.left = {};
                                        node.right ={};
                                        node.id = uuid.v1();
                                        break;
                                    case "GreaterThanExpression" :
                                        operatorText = "is greater than";
                                        node.left = {};
                                        node.right ={};
                                        node.id = uuid.v1();
                                        break;
                                    case "LessThanOrEqualExpression" :
                                        operatorText = "is less than or equal to";
                                        node.left = {};
                                        node.right ={};
                                        node.id = uuid.v1();
                                        break;
                                    case "GreaterThanOrEqualExpression" :
                                        operatorText = "is greater than or equal to";
                                        node.left = {};
                                        node.right ={};
                                        node.id = uuid.v1();
                                        break;
                                    case "BooleanLiteral" :
                                    case "StringLiteral" :
                                    case "IntegerLiteral" :
                                    case "NullLiteral" :
                                    case "FieldAccessNode" :
                                        node.id = uuid.v1();
                                        break;
                                }
                                var funcId = funcEle.data("functionid");  //todo: make this blockid later
                                if (validationService.addExpression(node, validationService.tempTree,scope.item.id ,funcId )) {

                                    scope.$broadcast("expressionDropped", [node, scope.item, operatorText]);
                                }
                            }
                        }
                    }
                });
                return false;
            });

        }
    };
}]);

rulesBuilderApp.directive('rbInfixexpressioneditor', ["$sce", "validationService", "$filter", function($sce, validationService, $filter){
    var json;
    var dragSrcEl;

    return {
        restrict: 'A',
        templateUrl: '/partials/infix-expression-editor',
        link: function(scope, element, attrs){
            scope.scopeList = [];
            scope.booleanValues = [ "true", "false"];
            scope.booleanValue = 'false';
            scope.booleanLiteral = false;
            scope.stringLiteral = "";
            scope.integerLiteral = 0;
            scope.fieldAccessNode = "";
            scope.nullLiteral = "null";
            scope.tempLeft;
            scope.tempRight;
            //scope.chosenVarScope;

            //scope.isEditMode = false;

            scope.$on("isEditModeFired", function(event, data){
                scope.isEditMode = true;
            });

            scope.$on("isDisplayModeFired", function(event, data){
                scope.isEditMode = false;
            });

            scope.closeInfixEditor = function(){
                element.closest('.expression-editor').hide('slow', function(){

                });
            };

            scope.activeElement;
            scope.activeLiteral;

            scope.assignVariable = function(index) {
                if (scope.activeElement === "left"){
                    scope.tempLeft = this.item;
                    element.find(".left-expression.droppable").html(this.item.name);
                }
            };

            scope.selectBooleanChange = function(index) {
                if (scope.activeElement === "right"){
                    element.find(".right-expression.droppable").html(this.booleanLiteral);
                    scope.tempRight = this.booleanLiteral;
                }
            };

            scope.integerLiteralChange = function(index) {
                if (scope.activeElement === "right"){
                    element.find(".right-expression.droppable").html(this.integerLiteral);
                    scope.tempRight = this.integerLiteral;
                }
            };

            scope.stringLiteralChange = function(index) {
                if (scope.activeElement === "right"){
                    element.find(".right-expression.droppable").html(this.stringLiteral);
                    scope.tempRight = this.stringLiteral;
                }
            };

            scope.updateExpression = function(index) {
                var ref, exp;
                if (scope.leftType === "FieldAccessNode") {
                    exp = {
                        'left': {
                            'ref': scope.tempLeft.ref,
                            'type': scope.leftType
                        },
                        'right' : {
                            "type": scope.rightType,
                            "value": scope.tempRight,
                            "expression": {}
                        },
                        'type': scope.item.expression && scope.item.expression.type
                    }
                }
                else if (scope.leftType === "SimpleVariableReferenceNode") {
                    exp = {
                        'left': {
                            'ref': scope.tempLeft.ref,
                            'type': scope.leftType
                        },
                        'right' : {
                            "type": scope.rightType,
                            "value": scope.tempRight,
                            "expression": {}
                        },
                        'type': scope.item.expression && scope.item.expression.type
                    }
                }


                //update tree
                var funcEle = element.closest(".rb-function");
                var funcId;
                var statementId;

                if (funcEle.length > 0) {
                    funcId = funcEle.data("functionid");  //todo: make this blockid later
                    statementId = scope.item.id;
                }
                else if (scope.item.controlName === "Validation") {
                    funcId = validationService.tempTree.children[0].id;
                    for (var f=0;f<validationService.tempTree.children[0].fields.length;f++){
                        if (validationService.tempTree.children[0].fields[f].name === "Body") {
                            for (var b=0;b<validationService.tempTree.children[0].fields[f].children.length;b++) {
                                if (validationService.tempTree.children[0].fields[f].children[b].type === "ReturnStatement") {
                                    statementId = validationService.tempTree.children[0].fields[f].children[b].id;
                                }
                            }
                        }
                    }
                }
                validationService.updateExpression(validationService.tempTree, exp, statementId, funcId);

                scope.$emit("expressionUpdated", [exp, funcId]);
                element.closest(".expression-editor").hide('slow', function() {

                });
            };

            element.find(".left-expression.droppable").on('dragover', null, {'scope' :scope}, function(e){
                if (e.preventDefault) {
                    e.preventDefault(); // Necessary. Allows us to drop.
                }

                e.originalEvent.dataTransfer.dropEffect = 'move';

                return false;
            });

            element.find(".left-expression.droppable").on('dragenter', null, {'scope' :scope}, function(e){
                // this / e.target is the current hover target.
                $(this).addClass('over');
            });

            element.find(".left-expression.droppable").on('dragleave', null, {'scope' :scope}, function(e){
                $(this).removeClass('over');  // this / e.target is previous target element.
            });

            element.find(".left-expression.droppable").on('drop', null, {'scope' :scope}, function(e){
                // this/e.target is current target element.
                $(this).removeClass('over');
                if (e.stopPropagation) {
                    e.stopPropagation(); // Stops some browsers from redirecting.
                }

                scope.activeElement = "left";
                scope.activeLiteral = "";

                scope.$apply(function () {
                    var node = JSON.parse(e.originalEvent.dataTransfer.getData('text'));
                    if (node) {
                        //validate block
                        var dropGroup= $(e.currentTarget).data("group");
                        var newItem = {};

                        if (validationService.isValidNode(node.type, dropGroup)) {
                            //find the function name

                            var funcEle = element.closest(".rb-function");
                            var funcId;

                            if (funcEle.length > 0) {
                                funcId = funcEle.data("functionid");  //todo: make this blockid later
                            }
                            else if (scope.item.controlName === "Validation") {
                                funcId = validationService.tempTree.children[0].id;
                            }

                            scope.leftType = node.type;

                            switch (node.type) {
                                case "SimpleVariableReferenceNode" :
                                    var vars = validationService.getTableVarsInScope(funcId,validationService.tempTree );
                                    for (var s=0;s<vars.length;s++) {
                                        scope.scopeList.push(vars[s]);
                                    }
                                    break;
                                case "FieldAccessNode" :
                                    var vars = validationService.getEntityVars(validationService.tempTree );
                                    for (var s=0;s<vars.length;s++) {
                                        scope.scopeList.push(vars[s]);
                                    }
                                    break;
                            }

                        }

                    }
                });
                return false;
            });

            element.find(".right-expression.droppable").on('dragover', null, {'scope' :scope}, function(e){
                if (e.preventDefault) {
                    e.preventDefault(); // Necessary. Allows us to drop.
                }

                e.originalEvent.dataTransfer.dropEffect = 'move';

                return false;
            });

            element.find(".right-expression.droppable").on('dragenter', null, {'scope' :scope}, function(e){
                // this / e.target is the current hover target.
                $(this).addClass('over');
                //$(this).css("height", $(dragSrcEl).height());
            });

            element.find(".right-expression.droppable").on('dragleave', null, {'scope' :scope}, function(e){
                $(this).removeClass('over');  // this / e.target is previous target element.
                //$(this).css("height", "2px");
            });

            element.find(".right-expression.droppable").on('drop', null, {'scope' :scope}, function(e){
                // this/e.target is current target element.
                $(this).removeClass('over');
                if (e.stopPropagation) {
                    e.stopPropagation(); // Stops some browsers from redirecting.
                }

                scope.activeElement = "right";
                scope.scopeList = [];

                scope.$apply(function () {
                    var node = JSON.parse(e.originalEvent.dataTransfer.getData('text'));
                    if (node) {
                        //validate block
                        var dropGroup= $(e.currentTarget).data("group");
                        var newItem = {};

                        if (validationService.isValidNode(node.type, dropGroup)) {
                            //check what type of literal and render proper element
                            var literalHtml ="";

                            scope.rightType = node.type;

                            switch(node.type){
                                case "BooleanLiteral" :
                                    scope.activeLiteral = "BooleanLiteral";
                                    break;
                                case "IntegerLiteral" :
                                    scope.activeLiteral = "IntegerLiteral";
                                    break;
                                case "StringLiteral" :
                                    scope.activeLiteral = "StringLiteral";
                                    break;
                                case "NullLiteral" :
                                    scope.activeLiteral = "NullLiteral";
                                    element.find(".right-expression.droppable").html('null');
                                    scope.tempRight = 'empty';
                                    break;
                                case "SimpleVariableReferenceNode" :
                                    scope.activeLiteral = "SimpleVariableReferenceNode";
                                    break;
                                case "FieldAccessNode" :
                                    scope.activeLiteral = "FieldAccessNode";
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

rulesBuilderApp.directive('rbLiteralexpressioneditor', ["$sce", "validationService", "$filter", function($sce, validationService, $filter){
    var json;
    var dragSrcEl;

    return {
        restrict: 'A',
        templateUrl: '/partials/literal-expression-editor',
        link: function(scope, element, attrs){
            scope.scopeList = [];
            scope.booleanValues = [ "true", "false"];
            scope.booleanValue = 'false';
            scope.booleanLiteral = false;
            scope.stringLiteral = "";
            scope.integerLiteral = 0;
            scope.nullLiteral = "null";
            scope.tempExp;
            scope.activeLiteral;

            //scope.isEditMode = false;

            scope.$on("isEditModeFired", function(event, data){
                scope.isEditMode = true;
            });

            scope.$on("isDisplayModeFired", function(event, data){
                scope.isEditMode = false;
            });

            var literalHtml ="";

            switch(scope.item.expression.type){
                case "BooleanLiteral" :
                    scope.activeLiteral = "BooleanLiteral";
                    break;
                case "IntegerLiteral" :
                    scope.activeLiteral = "IntegerLiteral";
                    break;
                case "StringLiteral" :
                    scope.activeLiteral = "StringLiteral";
                    break;
                case "NullLiteral" :
                    scope.activeLiteral = "NullLiteral";
                    break;
            }

            scope.closeInfixEditor = function(){
                element.closest('.expression-editor').hide('slow', function(){

                });
            };

            scope.selectBooleanChange = function(index) {
                element.find(".literal-expression.droppable").html(this.booleanLiteral);
                scope.tempExp = this.booleanLiteral;
            };

            scope.integerLiteralChange = function(index) {
                element.find(".literal-expression.droppable").html(this.integerLiteral);
                scope.tempExp = this.integerLiteral;
            };

            scope.stringLiteralChange = function(index) {
                element.find(".literal-expression.droppable").html(this.stringLiteral);
                scope.tempExp = this.stringLiteral;
            };

            scope.updateExpression = function(index) {
                var exp =  {
                        "type": scope.activeLiteral,
                        "value": scope.tempExp,
                        "expression": {}
                }

                //update tree
                var funcEle = element.closest(".rb-function");

                if (funcEle.length > 0) {
                    var funcId = funcEle.data("functionid");
                    validationService.updateExpression(validationService.tempTree, exp, scope.$parent.item.id, funcId);

                    //update ui

                    scope.$emit("expressionUpdated", [exp, funcId]);
                    element.closest(".expression-editor").hide('slow', function() {

                    });
                }

            };
        }
    };
}]);

rulesBuilderApp.directive('rbValidation', ["$sce", "validationService", "$filter", "$compile", function($sce, validationService, $filter, $compile){
    var json;
    var dragSrcEl;

    return {
        restrict: 'A',
        templateUrl: '/partials/validation',
        link: function(scope, element, attrs){
            scope.body = null;
            scope.parameterList = [];
            scope.statementList = [];
            scope.blockList = [];
            scope.returnTypes = [];
            scope.validationMessage = "";
            scope.exp = {};
            //scope.isEditMode = false;

            scope.$on("isEditModeFired", function(event, data){
                scope.isEditMode = true;
            });

            scope.$on("isDisplayModeFired", function(event, data){
                scope.isEditMode = false;
            });


            scope.$on("expressionToDisplay", function(event, data){
                scope.exp.text = data;
                element.find('.display-mode .expression-node .text').html(scope.exp.text);
            });

            //display mode - existing expression text
            if (scope.item && scope.item.expression && scope.item.expression.left && scope.item.expression.left.type) {
                var expressionText = validationService.createInfixExpressionText(scope.item.expression, element, null);
                scope.exp.text = expressionText.text;
            }

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

            scope.removeValidation = function(index){
                for (var x=validationService.tempTree.children.length; x> 0; x--) {
                    if (validationService.removeFunction(validationService.tempTree.children[x-1], validationService.tempTree, validationService.tempTree.children[x-1].id)){
                        scope.functionList.splice(x-1, 1);
                    }
                }

            };

            scope.validationMessageChange = function(){

                for (var f=0;f<validationService.tempTree.children[1].fields.length;f++){
                    if (validationService.tempTree.children[1].fields[f].name === "Body") {
                        for (var b=0;b<validationService.tempTree.children[1].fields[f].children.length;b++) {
                            if (validationService.tempTree.children[1].fields[f].children[b].type === "ReturnStatement") {
                                scope.expression = validationService.tempTree.children[1].fields[f].children[b].expression;
                                scope.expression.value = this.validationMessage;
                                break;
                            }
                        }
                    }
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

            element.find(".droppable.Expressions").on('drop', null, {'scope' :scope}, function(e){
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

                            var operatorText = "";
                            //check what type of exp
                            switch (node.type) {
                                case "EqualToExpression" :
                                    operatorText = "is equal to";
                                    node.left = {};
                                    node.right = {};
                                    node.id = uuid.v1();
                                    break;
                                case "NotEqualToExpression" :
                                    operatorText = "is not equal to";
                                    node.left = {};
                                    node.right = {};
                                    node.id = uuid.v1();
                                    break;
                                case "LessThanExpression" :
                                    operatorText = "is less than";
                                    node.left = {};
                                    node.right = {};
                                    node.id = uuid.v1();
                                    break;
                                case "GreaterThanExpression" :
                                    operatorText = "is greater than";
                                    node.left = {};
                                    node.right = {};
                                    node.id = uuid.v1();
                                    break;
                                case "LessThanOrEqualExpression" :
                                    operatorText = "is less than or equal to";
                                    node.left = {};
                                    node.right = {};
                                    node.id = uuid.v1();
                                    break;
                                case "GreaterThanOrEqualExpression" :
                                    operatorText = "is greater than or equal to";
                                    node.left = {};
                                    node.right = {};
                                    node.id = uuid.v1();
                                    break;
                            }

                            //find fields and ids
                            var funcId = validationService.tempTree.children[0].id;

                            var statement = {
                                "type": "ReturnStatement",
                                "id" : uuid.v1(),
                                "controlName": "Returnstatement",
                                "expression": {}
                            };

                            if (validationService.addStatement(statement,validationService.tempTree, funcId )){
                                if (validationService.addExpression(node, validationService.tempTree, statement.id, funcId)) {

                                    scope.$broadcast("expressionDropped", [node, scope.item, operatorText]);

                                }
                            }
                        }
                    }
                });
                return false;
            });

        }
    };
}]);

