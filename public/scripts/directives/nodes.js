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
                        var newItem = {};

                        if (validationService.isValidNode(node.type, dropGroup)) {
                            switch (node.type) {
                                case "Function" :
                                    newItem = {
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

                            }
                            //add
                            if (validationService.addFunction(newItem,scope.$root.tempTree)) {

                                newItem.action = "Edit";
                                scope.functionList.push(newItem);
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

            if (scope.item && scope.item.action === "Edit") {
                element.find(".display-mode").hide();
                element.find(".edit-mode").show();
            }

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


rulesBuilderApp.directive('rbReturnstatement', ["$sce", "validationService", "$filter", "$compile",function($sce, validationService, $filter,$compile){
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

            var text = "<i>Click to Add Expression</i>";

            //display mode
            if (scope.item.action !== "Edit") {
                var operatorText = "";
                var previousNode = "";
                var values = [];
                text ="";
                traverse(scope.item.expression).forEach(function (exp) {
                    switch (exp.type) {
                        case "EqualToExpression" :
                            operatorText = "(<span class='user-input left'>{left}</span> <span class='operator-keyword'>is equal to</span> <span class='user-input right'>{right}</span>)";

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
                    if (placeholder==="{left}") {
                        scope.left = values[v];
                    }
                    else if (placeholder==="{right}") {
                        scope.right= values[v];
                    }
                    text = text.replace(placeholder, values[v]);
                }


                //display mode
                var displayNode = element.find(".display-mode .expression-node");

                scope.text = text;
                displayNode.html(scope.text);
            }

            //edit mode
            var editNode = element.find(".edit-mode .expression-node");


            editNode.html("<span class='expression-text'>" + text + "</span><span class='glyphicon glyphicon-collapse-down'></span>");

            var expressionEditorHtml = "<div class='expression-editor'>" +
                "<div rb-equaltoexpression ></div>" +
                "</div>"

            expressionEditorHtml = $compile(expressionEditorHtml)(scope);
            editNode.append(expressionEditorHtml);

            //editNode.append(expressionEditorHtml);

            editNode.on('click', '.glyphicon-collapse-down', function(){
                editNode.find('.expression-editor').toggle();
            });

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
            scope.scopeList = [];
            scope.booleanValues = [ "truth", "false"];
            scope.booleanValue = 'false';
            scope.integerLiteral = 0;
            //scope.removeExpression = function(index){
            //    if (validationService.removeExpression(this.item, scope.$root.tempTree, scope.item.id)){
            //        scope.parameterList.splice(index, 1);
            //    }
            //};
            scope.activeElement;
            scope.activeLiteral;

            scope.assignVariable = function(index) {
                if (scope.activeElement === "left"){
                    element.find(".left-expression.droppable").html(this.item);
                }
            };

            scope.selectBooleanChange = function(index) {
                if (scope.activeElement === "right"){
                    element.find(".right-expression.droppable").html(this.booleanLiteral);
                }
            };

            scope.integerLiteralChange = function(index) {
                if (scope.activeElement === "right"){
                    element.find(".right-expression.droppable").html(this.integerLiteral);
                }
            };

            scope.stringLiteralChange = function(index) {
                if (scope.activeElement === "right"){
                    element.find(".right-expression.droppable").html(this.stringLiteral);
                }
            };

            scope.updateExpression = function(index) {

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
                                var funcId = funcEle.data("functionid");
                                var vars = validationService.getTableVarsInScope(funcId);

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
                                    scope.activeLiteral = "booleanLiteral";
                                    break;
                                case "IntegerLiteral" :
                                    scope.activeLiteral = "integerLiteral";
                                    break;
                                case "StringLiteral" :
                                    scope.activeLiteral = "stringLiteral";
                                    break;
                                case "NullLiteral" :
                                    element.find(".right-expression.droppable").html('null');
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

