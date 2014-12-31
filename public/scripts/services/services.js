'use strict';

var rulesServices = angular.module('rulesBuilderService', ['ngResource']);

rulesServices.factory('validationService', function() {
    return {
        getFunctionReturnTypes : function(){
            var rt = [];
            for(var s=0; s < this.getSyntaxTree().syntaxTree.syntaxNodes.syntaxNode.length;s++) {
                var itemNode = this.getSyntaxTree().syntaxTree.syntaxNodes.syntaxNode[s];
                if (itemNode["-id"].search("TypeNode") > 0) {
                    rt.push(itemNode);
                }
            }

            return rt;
        },
        isValidNode: function(childNode, parentNode) {
            var childVisual, parentVisual;

            for(var s=0; s < this.getSyntaxTree().syntaxTree.syntaxNodes.syntaxNode.length; s++) {
                var itemNode = this.getSyntaxTree().syntaxTree.syntaxNodes.syntaxNode[s];
                if(childNode === itemNode["-id"]) {
                    if (itemNode.productions && itemNode.productions.showVisual) {
                        //look at child node
                        childVisual = itemNode.productions.showVisual;
                        break;
                    }
                }
            }

            for(var s=0; s < this.getSyntaxTree().syntaxTree.syntaxNodes.syntaxNode.length; s++) {
                var itemNode = this.getSyntaxTree().syntaxTree.syntaxNodes.syntaxNode[s];
                if(parentNode === itemNode["-id"]) {
                    if (itemNode.productions && itemNode.productions.showVisual) {
                        //look at parent node
                        parentVisual = itemNode.productions.showVisual;
                        break;
                    }
                }
            }


            return (childVisual["-group"] === parentVisual["-group"]);
        },
        getFields: function(node) {
            var nodes = this.getSyntaxTree().syntaxNodes.syntaxNode;
            for (var t=0;t<nodes;t++){
                if (nodes[t].productions && nodes[t].productions.showVisual) {
                    if (nodes[t].productions.showVisual) { //this is a building block
                        if(node === nodes[t]._id) {
                            if (nodes[t].fields && nodes[t].fields.syntaxField) {
                                for (var n=0; n<nodes[t].fields.syntaxField;n++){

                                }
                            }
                        }
                    }
                }
            }
        },
        getTransformation: function(node) {
            angular.forEach(this.getSyntaxTree().syntaxNodes.syntaxNode, function (item, index) {
                if (item.productions && item.productions.showVisual) {
                    if (item.productions.showVisual) { //this is a building block
                        if(node === item._id) {
                            return item.Transformation;
                        }
                    }
                }
            });
            return null;
        },
        getFamilyTree: function() {
          return {
              name : "Parent",
              children: [{
                  name : "Child1",
                  children: [{
                      name : "Grandchild1",
                      children: []
                  },{
                      name : "Grandchild2",
                      children: []
                  },{
                      name : "Grandchild3",
                      children: []
                  }]
              }, {
                  name: "Child2",
                  children: []
              }]
          };
        },
        getSyntaxTree: function() {
            var tree = {
                "syntaxTree": {
                    "-Root": "Program",
                    "syntaxNodes": {
                        "syntaxNode": [
                            {
                                "-id": "Program",
                                "fields": {
                                    "syntaxField": {
                                        "-name": "Statements",
                                        "-node": "StatementNode",
                                        "productions": {
                                            "isNull": { "-value": "false" },
                                            "isCollection": {
                                                "-value": "true",
                                                "-element": "Statement"
                                            },
                                            "acceptNodes": { "-nodes": "Declaration" }
                                        }
                                    }
                                },
                                "productions": {
                                    "showVisual": { "-group": "Root" }
                                }
                            },
                            {
                                "-id": "StatementNode",
                                "productions": {
                                    "isAbstract": { "-value": "true" }
                                }
                            },
                            {
                                "-id": "Declarable",
                                "fields": {
                                    "field": {
                                        "-name": "Name",
                                        "-type": "String"
                                    }
                                },
                                "productions": {
                                    "isAbstract": { "-value": "true" }
                                }
                            },
                            {
                                "-id": "Declaration",
                                "-parent": "StatementNode",
                                "fields": {
                                    "syntaxField": {
                                        "-name": "Declarable",
                                        "-node": "Declarable"
                                    }
                                }
                            },
                            {
                                "-id": "Identifer",
                                "fields": {
                                    "field": {
                                        "-name": "Value",
                                        "-type": "String"
                                    }
                                },
                                "productions": {
                                    "match": {
                                        "-pattern": "[\\w-[0-9]]\\w*"
                                    }
                                }
                            },
                            {
                                "-id": "TypeNode",
                                "-parent": "Declarable"
                            },
                            {
                                "-id": "BooleanTypeNode",
                                "-parent": "Declarable"
                            },
                            {
                                "-id": "IntegerTypeNode",
                                "-parent": "Declarable"
                            },
                            {
                                "-id": "StringTypeNode",
                                "-parent": "Declarable"
                            },
                            {
                                "-id": "NullTypeNode",
                                "-parent": "Declarable"
                            },
                            {
                                "-id": "ExpressionNode",
                                "fields": {
                                    "syntaxField": {
                                        "-name": "ExpressionType",
                                        "-node": "TypeNode"
                                    }
                                }
                            },
                            {
                                "-id": "VariableNode",
                                "-parent": "Declarable",
                                "fields": {
                                    "syntaxField": [
                                        {
                                            "-name": "Type",
                                            "-node": "TypeNode"
                                        },
                                        {
                                            "-name": "Initializer",
                                            "-node": "ExpressionNode",
                                            "productions": {
                                                "isNull": { "-value": "true" }
                                            }
                                        }
                                    ]
                                },
                                "productions": {
                                    "assertCompatible": {
                                        "-left": "Initializer.ExpressionType",
                                        "-right": "Type"
                                    },
                                    "showVisual": { "-group": "Declarables" }
                                }
                            },
                            {
                                "-id": "ParameterNode",
                                "-parent": "VariableNode",
                                "productions": {
                                    "showVisual": { "-group": "Declarables" }
                                }
                            },
                            {
                                "-id": "Block",
                                "fields": {
                                    "syntaxField": {
                                        "-name": "Statements",
                                        "-node": "StatementNode",
                                        "productions": {
                                            "isCollection": {
                                                "-value": "true",
                                                "-element": "Statement"
                                            }
                                        }
                                    }
                                },
                                "productions": {
                                    "createDeclarationTable": { "-value": "true" }
                                }
                            },
                            {
                                "-id": "Function",
                                "-parent": "Declarable",
                                "fields": {
                                    "syntaxField": [
                                        {
                                            "-name": "Name",
                                            "-node": "Identifer",
                                            "productions": {
                                                "isNull": { "-value": "false" }
                                            }
                                        },
                                        {
                                            "-name": "ReturnType",
                                            "-node": "TypeNode",
                                            "productions": {
                                                "isNull": { "-value": "true" }
                                            }
                                        },
                                        {
                                            "-name": "Parameters",
                                            "-node": "ParameterNode",
                                            "productions": {
                                                "isNull": { "-value": "true" },
                                                "isCollection": {
                                                    "-value": "true",
                                                    "-element": "Parameter"
                                                }
                                            }
                                        },
                                        {
                                            "-name": "Body",
                                            "-node": "Block",
                                            "productions": {
                                                "isNull": { "-value": "true" }
                                            }
                                        }
                                    ]
                                },
                                "productions": {
                                    "createDeclarationTable": { "-value": "true" },
                                    "showVisual": { "-group": "Declarables" }
                                }
                            },
                            {
                                "-id": "BlockStatement",
                                "-parent": "StatementNode",
                                "fields": {
                                    "syntaxField": {
                                        "-name": "MainBlock",
                                        "-node": "Block"
                                    }
                                },
                                "productions": {
                                    "showVisual": { "-group": "Statements" }
                                }
                            },
                            {
                                "-id": "VariableExpressionNode",
                                "-parent": "ExpressionNode",
                                "productions": {
                                    "isSystem": { "-value": "true" }
                                }
                            },
                            {
                                "-id": "SimpleVariableReferenceNode",
                                "-parent": "VariableExpressionNode",
                                "fields": {
                                    "syntaxField": {
                                        "-name": "Referent",
                                        "-node": "VariableNode",
                                        "productions": {
                                            "lookupDeclarationTable": { "-using": "Name" }
                                        }
                                    },
                                    "field": [
                                        {
                                            "-name": "Name",
                                            "-type": "String",
                                            "productions": {
                                                "isSystem": { "-value": "true" }
                                            }
                                        },
                                        {
                                            "-name": "IsStatic",
                                            "-type": "Boolean",
                                            "productions": {
                                                "isSystem": { "-value": "true" }
                                            }
                                        }
                                    ]
                                },
                                "productions": {
                                    "setField": {
                                        "-field": "ExpressionType",
                                        "-from": "Referent.Type"
                                    },
                                    "showVisual": { "-group": "Expressions" }
                                }
                            },
                            {
                                "-id": "MemberAccessNode",
                                "-parent": "VariableExpressionNode",
                                "fields": {
                                    "syntaxField": {
                                        "-name": "Parent",
                                        "-node": "ExpressionNode"
                                    },
                                    "field": [
                                        {
                                            "-name": "ChildId",
                                            "-type": "String"
                                        },
                                        {
                                            "-name": "IsStatic",
                                            "-type": "Boolean"
                                        }
                                    ]
                                },
                                "productions": {
                                    "isAbstract": { "-value": "true" }
                                }
                            },
                            {
                                "-id": "FieldAccessNode",
                                "-parent": "MemberAccessNode",
                                "productions": {
                                    "typeHasField": {
                                        "-typeNode": "Parent.ExpressionType",
                                        "-fieldName": "ChildId",
                                        "-isStatic": "IsStatic",
                                        "-setField": "ExpressionType"
                                    },
                                    "showVisual": { "-group": "Expressions" }
                                }
                            },
                            {
                                "-id": "LiteralNode",
                                "-parent": "ExpressionNode",
                                "fields": {
                                    "field": {
                                        "-name": "Lexeme",
                                        "-type": "String"
                                    }
                                },
                                "productions": {
                                    "isAbstract": { "-value": "true" }
                                }
                            },
                            {
                                "-id": "BooleanLiteral",
                                "-parent": "LiteralNode",
                                "productions": {
                                    "fieldOptions": {
                                        "-field": "Lexeme",
                                        "-from": "true,false"
                                    },
                                    "setExpressionType": { "-typeNode": "BooleanTypeNode" },
                                    "showVisual": { "-group": "Literals" }
                                }
                            },
                            {
                                "-id": "IntegerLiteral",
                                "-parent": "LiteralNode",
                                "productions": {
                                    "setExpressionType": { "-typeNode": "IntegerTypeNode" },
                                    "match": { "-pattern": "^\\d+$" },
                                    "showVisual": { "-group": "Literals" }
                                }
                            },
                            {
                                "-id": "StringLiteral",
                                "-parent": "LiteralNode",
                                "productions": {
                                    "setExpressionType": { "-typeNode": "StringTypeNode" },
                                    "showVisual": { "-group": "Literals" }
                                }
                            },
                            {
                                "-id": "NullLiteral",
                                "-parent": "LiteralNode",
                                "productions": {
                                    "setExpressionType": { "-typeNode": "NullLiteral" },
                                    "showVisual": { "-group": "Literals" }
                                }
                            },
                            {
                                "-id": "ReturnStatement",
                                "-parent": "StatementNode",
                                "fields": {
                                    "syntaxField": {
                                        "-name": "Expression",
                                        "-node": "ExpressionNode"
                                    }
                                },
                                "productions": {
                                    "showVisual": { "-group": "Statements" }
                                }
                            },
                            {
                                "-id": "InfixExpressionNode",
                                "-parent": "ExpressionNode",
                                "fields": {
                                    "syntaxField": [
                                        {
                                            "-name": "Left",
                                            "-node": "ExpressionNode"
                                        },
                                        {
                                            "-name": "Right",
                                            "-node": "ExpressionNode"
                                        }
                                    ]
                                },
                                "productions": {
                                    "isSystem": { "-value": "true" },
                                    "showVisual": { "-group": "Expressions" },
                                    "assertCompatible": {
                                        "-left": "Left",
                                        "-right": "Right"
                                    }
                                }
                            },
                            {
                                "-id": "EqualToExpression",
                                "-parent": "InfixExpressionNode"
                            },
                            {
                                "-id": "NotEqualToExpression",
                                "-parent": "InfixExpressionNode"
                            },
                            {
                                "-id": "LessThanExpression",
                                "-parent": "InfixExpressionNode"
                            },
                            {
                                "-id": "GreaterThanExpression",
                                "-parent": "InfixExpressionNode"
                            },
                            {
                                "-id": "LessThanOrEqualExpression",
                                "-parent": "InfixExpressionNode"
                            },
                            {
                                "-id": "GreaterThanOrEqualExpression",
                                "-parent": "InfixExpressionNode"
                            },
                            {
                                "-id": "validation",
                                "-parent": "Declarable",
                                "fields": {
                                    "syntaxField": [
                                        {
                                            "-name": "when",
                                            "-node": "Function",
                                            "productions": {
                                                "enforReturnType": { "-typeName": "bool" },
                                                "isNull": { "-value": "true" }
                                            }
                                        },
                                        {
                                            "-name": "validate",
                                            "-node": "Function",
                                            "productions": {
                                                "enforReturnType": { "-typeName": "bool" }
                                            }
                                        },
                                        {
                                            "-name": "message",
                                            "-node": "Function",
                                            "productions": {
                                                "enforReturnType": { "-typeName": "string" }
                                            }
                                        }
                                    ]
                                },
                                "productions": {
                                    "showVisual": { "-group": "Declarables" }
                                }
                            }
                        ]
                    }
                }
            };
            return tree;
        },
        getNodes: function(cb){
            var nodes = [];

            for(var s=0; s < this.getSyntaxTree().syntaxTree.syntaxNodes.syntaxNode.length; s++) {
                var item = this.getSyntaxTree().syntaxTree.syntaxNodes.syntaxNode[s];
                if (item.productions && item.productions.showVisual) {
                    if (item.productions.showVisual) { //this is a building block
                        nodes.push(item);
                    }
                }
            }

            cb(null, nodes);
        },
        getTableReference : function(refId, blockId) {

            var tree = this.getUITree();
            if (tree.table){
                for (var x=0;x<tree.table.length;x++){
                    if (tree.table[x].ref === refId && tree.table[x].blockId === blockId) {
                        return tree.table[x];
                    }
                }
            }

        },
        traverse : function(object, currentNode) {
            var that = this;
            var foundItem;

            //if (object && object.children) {
            //    var node = _.find(object.children, function(item) {
            //        if (item.id === currentNode.id) {
            //            found = true;
            //            return;
            //        }
            //    });
            //
            //    if (!found) {
            //        that.traverse(object.children, currentNode);
            //    }
            //}
            if (object && object.children) {
                angular.forEach(object.children, function (item, index) {
                    if (item.id === currentNode.id) {
                        //from here, locate its immediate function block
                        foundItem = item;
                    }
                    else {
                        that.traverse(item, currentNode);
                    }
                });
            }

            if (foundItem) {
                return foundItem;
            }
        },

        getUITree : function(cb) {
            var uiTree = {
                "id": "MyProgram1",
                "type" : "Program",
                "controlName" : "canvas",
                "table": [{
                    "ref" : 1,
                    "blockId": "myFunction1",
                    "type": "ParameterNode",
                    "controlName": "function-parameter",
                    "value": "truth",
                    "name": "active"
                },{
                    "ref" : 2,
                    "blockId": "myFunction1",
                    "type": "ParameterNode",
                    "controlName": "function-parameter",
                    "value": "text",
                    "name": "manager"
                },{
                    "ref" : 3,
                    "blockId": "myFunction-1-Body",
                    "type": "ParameterNode",
                    "controlName": "function-parameter",
                    "value": "truth",
                    "name": "active"
                }],
                "children": [{
                    "id": "myFunction1",
                    "type" : "Function",
                    "controlName" : "function",
                    "children" : [{
                        "id" : "myFunction1-Name",
                        "type" : "FunctionName",
                        "value": "test"
                    }, {
                        "id" : "myFunction1-ReturnType",
                        "type": "FunctionReturnType",
                        "value" : "truth"
                    },{
                        "id": "myFunction1-Parameters",
                        "type" : "FunctionParameters",
                        "children" : [{
                            "ref": 1,
                            "blockId": "myFunction1"
                           },{
                            "ref": 2,
                            "blockId": "myFunction1"
                        }]
                    }, {
                        "id": "myFunction1-Body",
                        "type" : "Block",
                        "controlName": "block",
                        "children": [{
                            "id": "myFunction1-ReturnStatement",
                            "type": "ReturnStatement",
                            "controlName" : "return-statement",
                            "children" : [{
                                "id": "myExpression1",
                                "type" : "EqualToExpression",
                                "controlName" : "equal-to-expression",
                                "left" : {
                                    "ref" : 3,
                                    "blockId": "myFunction-1-Body"
                                },
                                "right": {
                                    "id" : "myRightExpression1",
                                    "type" : "BooleanLiteral",
                                    "value" : "yes"
                                }
                            }]
                        }]
                    }]
                }]
            };
            //cb(null, uiTree);
            return uiTree;
        }
    };
});

/*
 * An Angular service which helps with creating recursive directives.
 * @author Mark Lagendijk
 * @license MIT
 */
rulesServices.factory('RecursionHelper', ['$compile', function($compile){
    return {
        /**
         * Manually compiles the element, fixing the recursion loop.
         * @param element
         * @param [link] A post-link function, or an object with function(s) registered via pre and post properties.
         * @returns An object containing the linking functions.
         */
        compile: function(element, link){
            // Normalize the link parameter
            if(angular.isFunction(link)){
                link = { post: link };
            }

            // Break the recursion loop by removing the contents
            var contents = element.contents().remove();
            var compiledContents;
            return {
                pre: (link && link.pre) ? link.pre : null,
                /**
                 * Compiles and re-adds the contents
                 */
                post: function(scope, element){
                    // Compile the contents
                    if(!compiledContents){
                        //if (scope.family.markup) {
                        //    compiledContents = $compile(scope.family.markup);
                        //}
                        //else {
                            compiledContents = $compile(contents);
                        //}
                    }
                    // Re-add the compiled contents to the element
                    if (compiledContents) {
                        compiledContents(scope, function (clone) {
                            element.append(clone);
                        });
                    }

                    // Call the post-linking function, if any
                    if(link && link.post){
                        link.post.apply(null, arguments);
                    }
                }
            };
        }
    };
}]);