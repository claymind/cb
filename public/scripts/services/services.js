'use strict';

var rulesServices = angular.module('rulesBuilderService', ['ngResource']);

rulesServices.factory('validationService', function() {
    return {
        isValidNode: function(childNode, parentNode) {
            var childVisual, parentVisual;

            for(var s=0; s < this.getSyntaxTree().syntaxNodes.syntaxNode.length; s++) {
                var itemNode = this.getSyntaxTree().syntaxNodes.syntaxNode[s];
                if(childNode === itemNode._id) {
                    if (itemNode.productions && itemNode.productions.showVisual) {
                        //look at child node
                        childVisual = itemNode.productions.showVisual;
                        break;
                    }
                }
            }

            if (!childVisual) {
                for(var s=0; s < this.getSyntaxTree().syntaxNodes.SyntaxNode.length; s++) {
                    var itemNode = this.getSyntaxTree().syntaxNodes.SyntaxNode[s];
                    if(childNode === itemNode._id) {
                        if (itemNode.productions && itemNode.productions.showVisual) {
                            //look at child node
                            childVisual = itemNode.productions.showVisual;
                            break;
                        }
                    }
                }
            }

            if (!childVisual) {
                for(var s=0; s < this.getSyntaxTree().syntaxNodes.syntaxTree.length; s++) {
                    var itemNode = this.getSyntaxTree().syntaxNodes.syntaxTree[s];
                    if(childNode === itemNode._id) {
                        if (itemNode.productions && itemNode.productions.showVisual) {
                            //look at child node
                            childVisual = itemNode.productions.showVisual;
                            break;
                        }
                    }
                }
            }

            for(var s=0; s < this.getSyntaxTree().syntaxNodes.syntaxNode.length; s++) {
                var itemNode = this.getSyntaxTree().syntaxNodes.syntaxNode[s];
                if(parentNode === itemNode._id) {
                    if (itemNode.productions && itemNode.productions.showVisual) {
                        //look at parent node
                        parentVisual = itemNode.productions.showVisual;
                        break;
                    }
                }
            }

            if (!parentVisual) {
                for(var s=0; s < this.getSyntaxTree().syntaxNodes.SyntaxNode.length; s++) {
                    var itemNode = this.getSyntaxTree().syntaxNodes.SyntaxNode[s];
                    if(parentNode === itemNode._id) {
                        if (itemNode.productions && itemNode.productions.showVisual) {
                            //look at parent node
                            parentVisual = itemNode.productions.showVisual;
                            break;
                        }
                    }
                }
            }

            if (!parentVisual) {
                for(var s=0; s < this.getSyntaxTree().syntaxNodes.syntaxTree.length; s++) {
                    var itemNode = this.getSyntaxTree().syntaxNodes.syntaxTree[s];
                    if(parentNode === itemNode._id) {
                        if (itemNode.productions && itemNode.productions.showVisual) {
                            //look at parent node
                            parentVisual = itemNode.productions.showVisual;
                            break;
                        }
                    }
                }
            }

            return (childVisual._group === parentVisual._group);
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
        getSyntaxTree: function(){
            return {
                "name" : "Program",
                "SyntaxProductions": {
                    "SyntaxProduction": ""
                },
                "_Root": "Program",
                "syntaxNodes": {
                    "syntaxNode": [
                        {
                            "_id": "Program",
                            "fields": {
                                "syntaxField": {
                                    "productions": {
                                        "isNull": {
                                            "_value": "false"
                                        },
                                        "isCollection": {
                                            "_value": "true",
                                            "_element": "Statement"
                                        },
                                        "acceptNodes": {
                                            "_value": "Declaration"
                                        }
                                    },
                                    "transformation": "\n            ({Statement} \\n)*\n          ",
                                    "_name": "Statements",
                                    "_node": "StatementNode"
                                }
                            },
                            "Productions": {
                                "showVisual": {
                                    "_group": "Root"
                                }
                            },
                            "transformation": "\n        {Statements}\n      "
                        },
                        {
                            "productions": {
                                "isAbstract": {
                                    "_value": "true"
                                }
                            },
                            "_id": "StatementNode"
                        },
                        {

                            "_id": "Declaration",
                            "_parent": "StatementNode",
                            "fields": {
                                "syntaxField": {
                                    "_name": "Declarable",
                                    "_node": "DeclarableNode"
                                }
                            }
                        },
                        {
                            "_id": "Function",
                            "_parent": "Declarable",
                            "fields": {
                                "syntaxField": [
                                    {
                                        "_name": "Name",
                                        "_node": "Identifier",
                                        "productions": {
                                            "isNull": {
                                                "_value": "false"
                                            }
                                        }
                                    },
                                    {
                                        "_name": "ReturnType",
                                        "_node": "TypeNode",
                                        "productions": {
                                            "isNull": {
                                                "_value": "true"
                                            }
                                        }
                                    },
                                    {
                                        "_name": "Parameters",
                                        "_node": "ParameterNode",
                                        "productions": {
                                            "isNull": {
                                                "_value": "true"
                                            },
                                            "isCollection": {
                                                "_value": "true",
                                                "_element": "Parameter"
                                            },
                                            "isDeclaration": {
                                                "_value": "true"
                                            }
                                        },
                                        "transformation": "\n            Parameter (,{Parameter})*\n          "
                                    },
                                    {
                                        "_name": "Body",
                                        "_node": "Block",
                                        "productions": {
                                            "isNull": {
                                                "_value": "true"
                                            }
                                        }
                                    }
                                ]
                            },
                            "productions": {
                                "createDeclarationTable": {
                                    "_value": "true"
                                },
                                "showVisual": {
                                    "_group": "Declarables"
                                }
                            },
                            "Transformation": "\n        function {Name} (as {ReturnType})?\n        (given {Parameters})?\n        {Body}\n      "

                        },
                        {
                            "_id": "TypeNode",
                            "_parent": "Declarable",
                            "syntaxField": {
                                "_name": "Members",
                                "_node": "TypeDeclarableNode",
                                "productions": {
                                    "isCollection": {
                                        "_value": "true"
                                    }
                                },
                                "transformation": "\n          {Name}\n        "
                            },
                            "nodes": {
                                "TypeNode": {
                                    "Name": "Boolean",
                                    "_Name": "Boolean",
                                    "_node": "TypeNode",
                                    "_isSystemNode": "true"
                                }
                            }

                        },
                        {
                            "_id": "VariableNode",
                            "_parent": "Declarable",
                            "fields": {
                                "syntaxField": [
                                    {
                                        "_name": "Type",
                                        "_node": "TypeNode"
                                    },
                                    {
                                        "productions": {
                                            "isNull": {
                                                "_value": "true"
                                            }
                                        },
                                        "_name": "Initializer",
                                        "_node": "ExpressionNode"
                                    }
                                ]
                            },
                            "productions": {
                                "assertCompatible": {
                                    "_left": "Initializer.ExpressionType",
                                    "_right": "Type"
                                },
                                "showVisual": {
                                    "_group": "Declarables"
                                }
                            },
                            "transformation": "{Type} {Name} (equal {Initializer})?"
                        },
                        {
                            "_id": "ParameterNode",
                            "_parent": "VariableNode",
                            "productions": {
                                "showVisual": {
                                    "_group": "Declarables"
                                }
                            },
                            "transformation": "\n        {Name} as {Type}\n      "
                        },
                        {
                            "_id": "Block",
                            "transformation": "\n        Begin\n          {Statements}\n        End\n      ",
                            "fields": {
                                "syntaxField": {
                                    "productions": {
                                        "isCollection": {
                                            "_value": "true",
                                            "_element": "Statement"
                                        }
                                    },
                                    "transformation": "\n            ({Statement} \\n)*\n          ",
                                    "_name": "Statements",
                                    "_node": "StatementNode"
                                }
                            },
                            "productions": {
                                "createDeclarationTable": {
                                    "_value": "true"
                                }
                            }
                        },
                        {
                            "_id": "BlockStatement",
                            "_parent": "StatementNode",
                            "fields": {
                                "syntaxField": {
                                    "_name": "MainBlock",
                                    "_node": "Block"
                                }
                            },
                            "productions": {
                                "showVisual": {
                                    "_group": "Statements"
                                }
                            },
                            "transformation": "\n        {MainBlock}\n      "
                        },
                        {
                            "_id": "ExpressionNode",
                            "fields": {
                                "syntaxField": {
                                    "_name": "ExpressionType",
                                    "_node": "TypeNode"
                                }
                            }
                        },
                        {
                            "_id": "VariableExpressionNode",
                            "_parent": "ExpressionNode",
                            "_isSystemNode": "true"
                        },
                        {
                            "_id": "SimpleVariableReferenceNode",
                            "_parent": "VariableExpressionNode",
                            "fields": {
                                "syntaxField": {
                                    "productions": {
                                        "lookupDeclarationtable": {
                                            "_using": "Name"
                                        }
                                    },
                                    "_name": "Referent",
                                    "_node": "VariableNode"
                                },
                                "field": [
                                    {
                                        "_name": "Name",
                                        "_type": "string",
                                        "_isSystemField": "true"
                                    },
                                    {
                                        "_name": "IsStatic",
                                        "_type": "bool",
                                        "_isSystemField": "true"
                                    }
                                ]
                            },
                            "productions": {
                                "setField": {
                                    "_field": "ExpressionType",
                                    "_from": "Referent.Type"
                                },
                                "showVisual": {
                                    "_group": "Expressions"
                                }
                            },
                            "transformations": "{Name}"
                        },
                        {
                            "_id": "LiteralNode",
                            "_parent": "ExpressionNode",
                            "fields": {
                                "field": {
                                    "_name": "Lexeme",
                                    "_type": "string"
                                }
                            },
                            "productions": {
                                "isAbstract": {
                                    "_value": "true"
                                }
                            },
                            "transformation": "{Lexeme}"
                        },
                        {
                            "_id": "BooleanLiteral",
                            "_parent": "LiteralNode",
                            "productions": {
                                "setField": {
                                    "_field": "ExpressionType",
                                    "_sRef": "Boolean"
                                },
                                "options": {
                                    "_field": "Lexeme",
                                    "_value": "yes|no"
                                },
                                "showVisual": {
                                    "_group": "Literals"
                                }
                            }
                        },
                        {
                            "_id": "ReturnStatement",
                            "_parent": "StatementNode",
                            "fields": {
                                "syntaxField": {
                                    "_name": "Expression",
                                    "_node": "ExpressionNode"
                                }
                            },
                            "productions": {
                                "showVisual": {
                                    "_group": "Statements"
                                }
                            },
                            "transformation": "return {Expression}"
                        },
                        {
                            "_id": "InfixExpressionNode",
                            "_parent": "ExpressionNode",
                            "_isSystemNode": "true"
                        }
                    ],
                    "SyntaxNode": [
                        {
                            "_id": "Declarable",
                            "Fields": {
                                "Field": {
                                    "_name": "Name",
                                    "_Type": "String"
                                }
                            },
                            "Productions": {
                                "IsAbstract": {
                                    "_value": "true"
                                }
                            }
                        },
                        {
                            "_id": "Identifer",
                            "Fields": {
                                "Field": {
                                    "Productions": {
                                        "Match": {
                                            "_pattern": "[\\w-[0-9]]\\w*"
                                        }
                                    },
                                    "_name": "Value",
                                    "_Type": "String"
                                }
                            },
                            "productions": {
                                "showVisual": {
                                    "_group": "Ids"
                                }
                            },
                            "transformation": "{Value}"
                        }
                    ],
                    "syntaxTree": [
                        {
                            "_id": "EqualToExpression",
                            "_parent": "InfixExpressionNode",
                            "fields": {
                                "syntaxField": [
                                    {
                                        "productions": {
                                            "assertExpressionType": {
                                                "_value": "Boolean"
                                            }
                                        },
                                        "_name": "Left",
                                        "_node": "ExpressionNode"
                                    },
                                    {
                                        "productions": {
                                            "assertExpressionType": {
                                                "_value": "Boolean"
                                            }
                                        },
                                        "_name": "Right",
                                        "_node": "ExpressionNode"
                                    }
                                ]
                            },
                            "productions": {
                                "showVisual": {
                                    "_group": "Expressions"
                                }
                            },
                            "transformation": "{Left} equal to {Right}"
                        },
                        {
                            "_id": "NotEqualToExpression",
                            "_parent": "InfixExpressionNode",
                            "fields": {
                                "syntaxField": [
                                    {
                                        "productions": {
                                            "assertExpressionType": {
                                                "_value": "Boolean"
                                            }
                                        },
                                        "_name": "Left",
                                        "_node": "ExpressionNode"
                                    },
                                    {
                                        "productions": {
                                            "assertExpressionType": {
                                                "_value": "Boolean"
                                            }
                                        },
                                        "_name": "Right",
                                        "_node": "ExpressionNode"
                                    }
                                ]
                            },
                            "productions": {
                                "showVisual": {
                                    "_group": "Expressions"
                                }
                            },
                            "transformation": "{Left} not equal to {Right}"
                        }
                    ]
                }

            };
        },
        getNodes: function(cb){
            var syntaxTree = this.getSyntaxTree();
            var nodes = [];

            angular.forEach(syntaxTree.syntaxNodes.syntaxNode, function (item, index) {
                if (item.productions && item.productions.showVisual) {
                    if (item.productions.showVisual) { //this is a building block
                        nodes.push(item);
                    }
                }
            });

            cb(null, nodes);
        },
        getTableReference : function(id, currentNode) {
            var that = this;
            this.getUITree(function(err, res){
                if (!err) {

                    //traverse tree
                    var foundItem  = that.traverse(res, currentNode);
                    if (foundItem) {
                        var a = 1;
                    }
                    //return foundItem
                }

            });
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
                    "type": "FunctionParameterNode",
                    "controlName": "function-parameter",
                    "value": "truth",
                    "name": "active"
                },{
                    "ref" : 2,
                    "blockId": "myFunction1",
                    "type": "FunctionParameterNode",
                    "controlName": "function-parameter",
                    "value": "text",
                    "name": "manager"
                },{
                    "ref" : 3,
                    "blockId": "myFunction-1-Body",
                    "type": "FunctionParameterNode",
                    "controlName": "function-parameter",
                    "value": "truth",
                    "name": "active"
                }],
                "children": [{
                    "id": "myFunction1",
                    "type" : "FunctionNode",
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
                                    "ref" : 1,
                                    "blockId": "myFunction-1-Body"
                                },
                                "right": {
                                    "children" : [{
                                        "id" : "myRightExpression1",
                                        "type" : "BooleanLiteral",
                                        "value" : "yes"
                                    }]
                                }
                            }]
                        }]
                    }]
                }]
            };
            cb(null, uiTree);
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