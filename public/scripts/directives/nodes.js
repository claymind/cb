'use strict'

rulesBuilderApp.directive("rbProgram",  ["$sce", "validationService", "$filter", function($sce, validationService, $filter){
    return {
        restrict: 'A',
        templateUrl: '/partials/program',
        link: function(scope, element, attrs ) {
            scope.functionList = [];
            var element = element.closest(".canvas");


            //scope.$watch('tempTree.table', function(newValue, oldValue) {
            //    var ref;
            //    if (newValue.length > oldValue.length) { //added param
            //        //_.difference([1, 2, 3, 4, 5], [5, 2, 10]);
            //    }
            //    else {
            //        ref =  _.filter(oldValue, function(obj){ return !_.findWhere(newValue, obj); });
            //    }
            //
            //}, true);

            for(var c=0;c<scope.tempTree.children.length;c++) {
                switch (scope.tempTree.children[c].type) {
                    case "Function" :
                        scope.functionList.push(scope.tempTree.children[c]);
                        break;
                    case "Validation":
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

                                    if (validationService.addFunction(functionItem,scope.$root.tempTree)) {

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
                                            "value": "truth"
                                        }, {
                                            "name": "Parameters",
                                            "children": []
                                        }, {
                                            "name": "Body",
                                            "children": []
                                        }]
                                    };

                                    if (validationService.addFunction(validationItem1,scope.$root.tempTree)) {
                                        //validationItem1.action = "Edit";
                                        scope.functionList.push(validationItem1);
                                    }

                                    if (validationService.addFunction(validationItem2,scope.$root.tempTree)) {
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
                if (validationService.removeFunction(this.item, scope.$root.tempTree, scope.item.id)){
                    scope.functionList.splice(index, 1);
                }
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
            //scope.isEditMode = false;

            var expressionType = scope.item && scope.item.expression && scope.item.expression.type;

            //existing expressions
            if (expressionType && scope.item.expression.left && scope.item.expression.left.type) {
                var expressionText = validationService.createInfixExpressionText(scope.item, element);
                scope.text = expressionText.text;
                scope.left = expressionText.left;
                scope.right = expressionText.right;
                scope.operatorText = expressionText.operator;

            }
            else if (scope.item && scope.item.type){  //new expression
                scope.text = "<i>Click to Build Expression</i>";
                scope.isEditMode = true;
                scope.operatorText = scope.item.operatorText;
            }

            //what type of expression editor should we load
            if (expressionType) {
                var editor = element.find('.expression-editor');
                var operatorText = "";

                switch (expressionType) {
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
                        break;
                    case "FieldAccessNode":
                        break;
                }
            }


            scope.$on("isEditModeFired", function(event, data){
                scope.isEditMode = true;
            });

            scope.$on("isDisplayModeFired", function(event, data){
                scope.isEditMode = false;
            });

            scope.$on("expressionUpdated", function(event, data){

                var ele = element.find(".expression-text");
                var expressionText = validationService.createInfixExpressionText(data[0], ele);

                scope.text = expressionText.text;
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
        link: function(scope, element, attrs){
            //scope.isEditMode = false;

            scope.$on("isEditModeFired", function(event, data){
                scope.isEditMode = true;
            });

            scope.$on("isDisplayModeFired", function(event, data){
                scope.isEditMode = false;
            });


            //var expressionProductions = validationService.getProductions("ExpressionNode");
            //
            //for (var p=0;p<expressionProductions.length;p++) {
            //    if (expressionProductions[p].Group) {
            //        scope.expressionGroup = expressionProductions[p].Group;
            //        break;
            //    }
            //}

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
                                }
                                var funcId = funcEle.data("functionid");  //todo: make this blockid later
                                if (validationService.addExpression(node, scope.$root.tempTree,scope.item.id ,funcId )) {
                                    //update UI
                                    scope.item.expression = node;
                                    scope.item.operatorText = operatorText;
                                    if (element.find(".edit-mode .express").length > 0) {
                                        element.find(".edit-mode .express").remove();
                                    }

                                    var expressionText = "<span rb-expressiontext item='item'></span>";
                                    var eleParent = element.find(".expression-node");

                                    expressionText = $compile(expressionText)(scope);
                                    eleParent.append(expressionText);
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
            scope.nullLiteral = "null";
            scope.tempLeft;
            scope.tempRight;

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
                var exp = {
                    'left': {
                        'ref': (scope.tempLeft && scope.tempLeft.ref),
                        'type': 'SimpleVariableReferenceNode'  //todo: change this to not be hardcoded
                    },
                    'right' : {
                        "type": scope.activeLiteral,
                        "value": scope.tempRight,
                        "expression": {}
                    },
                    'type': scope.item.expression && scope.item.expression.type
                }

                //update tree
                var funcEle = element.closest(".rb-function");

                if (funcEle.length > 0) {
                    var funcId = funcEle.data("functionid");
                    validationService.updateExpression(scope.$root.tempTree, exp, scope.$parent.item.id, funcId);
                    //

                    //update ui

                    scope.$emit("expressionUpdated", [exp, funcId]);
                    element.closest(".expression-editor").hide('slow', function() {

                    });
                }

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
                //$(this).css("height", $(dragSrcEl).height());
            });

            element.find(".left-expression.droppable").on('dragleave', null, {'scope' :scope}, function(e){
                $(this).removeClass('over');  // this / e.target is previous target element.
                //$(this).css("height", "2px");
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

                            if (funcEle.length > 0) {
                                var funcId = funcEle.data("functionid");  //todo: make this blockid later
                                var vars = validationService.getTableVarsInScope(funcId,scope.$root.tempTree );

                                for (var s=0;s<vars.length;s++) {
                                    scope.scopeList.push(vars[s]);
                                }
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
                            }
                        }
                    }
                });

                return false;
            });
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
            //scope.isEditMode = false;

            scope.$on("isEditModeFired", function(event, data){
                scope.isEditMode = true;
            });

            scope.$on("isDisplayModeFired", function(event, data){
                scope.isEditMode = false;
            });

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

            scope.removeValidation = function(index){
                for (var x=scope.$root.tempTree.children.length; x> 0; x--) {
                    if (validationService.removeFunction(scope.$root.tempTree.children[x-1], scope.$root.tempTree, scope.$root.tempTree.children[x-1].id)){
                        scope.functionList.splice(x-1, 1);
                    }
                }

            };

        }
    };
}]);

