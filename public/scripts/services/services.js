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
        getProductions : function(node, fieldName) {
            var productions = [];

            for(var s=0; s < this.getSyntaxTree().syntaxTree.syntaxNodes.syntaxNode.length; s++) {
                var itemNode = this.getSyntaxTree().syntaxTree.syntaxNodes.syntaxNode[s];
                if(node === itemNode["-id"]) {
                    //if (itemNode.productions) {
                    //    productions.push(itemNode.productions);
                    //}
                    //look for fieldname
                    if (itemNode.fields && itemNode.fields.syntaxField) {

                        for (var f=0;f<itemNode.fields.syntaxField.length;f++) {
                            var field = itemNode.fields.syntaxField[f];
                            if (field["-name"] === fieldName) {
                                if (field.productions) {
                                    productions.push(field.productions);
                                    if (field["-parent"]) {
                                        this.getParentNode(field["-parent"], productions);
                                    }
                                    else if (field["-node"]) {
                                        this.getParentNode(field["-node"], productions);
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            return productions;
        },
        getParentNode : function(node, productions) {
            for(var s=0; s < this.getSyntaxTree().syntaxTree.syntaxNodes.syntaxNode.length; s++) {
                var itemNode = this.getSyntaxTree().syntaxTree.syntaxNodes.syntaxNode[s];
                if(node === itemNode["-id"]) {
                    if (itemNode.productions) {
                        productions.push(itemNode.productions);
                    }
                    //look for fieldname
                    if (itemNode.fields && itemNode.fields.syntaxField) {
                        for (var f=0;f<itemNode.fields.syntaxField.length;f++) {
                            var field = itemNode.fields.syntaxField[f];
                            if (field.productions) {
                                productions.push(field.productions);
                                if (field["-parent"]) {
                                    this.getParentNode(field["-parent"], productions);
                                }
                                else if (field["-node"]) {
                                    this.getParentNode(field["-node"], productions);
                                }
                                break;
                            }
                        }
                    }
                }
            }
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
                                    "syntaxField": [{
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
                                    }]
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
                                    "syntaxField": [{
                                        "-name": "Declarable",
                                        "-node": "Declarable"
                                    }]
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
                                        "-pattern": /^[a-zA-Z]*$/
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
                                    "syntaxField": [{
                                        "-name": "ExpressionType",
                                        "-node": "TypeNode"
                                    }]
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
                                    "syntaxField": [{
                                        "-name": "Statements",
                                        "-node": "StatementNode",
                                        "productions": {
                                            "isCollection": {
                                                "-value": "true",
                                                "-element": "Statement"
                                            }
                                        }
                                    }]
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
                                    "syntaxField": [{
                                        "-name": "MainBlock",
                                        "-node": "Block"
                                    }]
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
                                    "syntaxField": [{
                                        "-name": "Referent",
                                        "-node": "VariableNode",
                                        "productions": {
                                            "lookupDeclarationTable": { "-using": "Name" }
                                        }
                                    }],
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
                                    "syntaxField": [{
                                        "-name": "Parent",
                                        "-node": "ExpressionNode"
                                    }],
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
                                    "syntaxField": [{
                                        "-name": "Expression",
                                        "-node": "ExpressionNode"
                                    }]
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
                var ref;
                for (var x=0;x<tree.table.length;x++){
                    if (tree.table[x].ref === refId)
                        for (var b=0;b<tree.table[x].blockIds.length;b++){
                           if (tree.table[x].blockIds[b] === blockId) {
                               ref=tree.table[x];
                               break;
                           }
                        }
                    }
                }

                return ref;

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
        updateUITree: function(){

        },
        getUITree : function(cb) {
            var uiTree = {
                "id": "Program-1", //will be root
                "type" : "Program",
                "controlName" : "Program",
                "table": [{  // active as truth
                    "ref" : 1,
                    "value": "truth",
                    "name": "active",
                    "blockIds" : [
                        "Function-1",
                        "Block-1"
                    ]
                }],
                "children": [{ // Function test as truth
                    "id": "Function-1",
                    "type" : "Function",
                    "controlName" : "Function",
                    "children" : [{
                        "id" : "Name-1",
                        "type" : "Name",
                        "value": "test"
                    }, {
                        "id" : "ReturnType-1",
                        "type": "ReturnType",
                        "value" : "truth"
                    },{
                        "id": "Parameters-1",
                        "type" : "Parameters",
                        "children" : [{
                            "ref": 1,
                            "blockId": "Function-1",
                            "type": "ParameterNode",
                            "controlName": "Parameternode"
                        }]
                    }, { //return active is equal to yes
                        "id": "Block-1",
                        "type" : "Block",
                        "controlName": "Block",
                        "children": [{
                            "id": "ReturnStatement-1",
                            "type": "ReturnStatement",
                            "controlName" : "Returnstatement",
                            "children" : [{
                                "id": "Expression-1",
                                "type" : "EqualToExpression",
                                "controlName" : "Equaltoexpression",
                                "left" : {
                                    "ref" : 1,
                                    "blockId": "Block-1",
                                    "type": "left"
                                },
                                "right": {
                                    "id" : "BooleanLiteral-1",
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