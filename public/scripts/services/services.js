'use strict';

var rulesServices = angular.module('rulesBuilderService', ['ngResource']);

rulesServices.factory('validationService', function() {
    return {
        getFunctionReturnTypes : function(){
            var rt = [];
            for(var s=0; s < this.getSyntaxTree().SyntaxNodes.length;s++) {
                var itemNode = this.getSyntaxTree().SyntaxNodes[s];
                if (itemNode["Id"].search("TypeNode") > 0) {
                    rt.push(itemNode);
                }
            }

            return rt;
        },
        getProductions : function(nodeId) {
            var productions = [];

            for(var s=0; s < this.getSyntaxTree().SyntaxNodes.length; s++) {
                var itemNode = this.getSyntaxTree().SyntaxNodes[s];
                if(nodeId === itemNode["Id"]) {
                    if (itemNode.Productions) {
                        for (var p=0;p<itemNode.Productions.length;p++) {
                            productions.push(itemNode.Productions[p]);
                        }
                    }

                    if (itemNode.Fields) {
                        for (var f=0;f<itemNode.Fields.length;f++){
                            if (itemNode.Fields[f].Node)
                                this.getParentProductions(itemNode.Fields[f].Node, productions);
                        }
                    }

                    if (itemNode.Parent) {
                        this.getParentProductions(itemNode.Parent, productions);
                    }
                }
            }
            return productions;
        },
        getParentProductions : function(node, productions) {

            if (node.Productions) {
                for (var p=0;p<node.Productions.length;p++) {
                    productions.push(node.Productions[p]);
                }
            }

            //look at each field and get each field productions
            for (var f = 0; f < node.Fields.length; f++) {
                if (node.Fields[f].Productions) {
                    for (var p=0;p<node.Fields[f].Productions.length;p++) {
                        productions.push(node.Fields[f].Productions[p]);
                    }
                }

                if (node.Fields[f].Node) {
                    this.getParentProductions(node.Fields[f].Node, productions);
                }
            }

            return productions;
        },
        //getParentNode : function(node, productions) {
        //    for(var s=0; s < this.getSyntaxTree().SyntaxNodes.length; s++) {
        //        var itemNode = this.getSyntaxTree().SyntaxNodes[s];
        //        if(node === itemNode["-id"]) {
        //            if (itemNode.Productions) {
        //                for (var p=0;p<itemNode.Fields[f].Productions.length;p++) {
        //                    productions.push(itemNode.Fields[f].Productions[p]);
        //                }
        //            }
        //            //look for fieldname
        //            if (itemNode.Fields) {
        //                for (var f=0;f<itemNode.Fields.length;f++) {
        //                    var field = itemNode.Fields[f];
        //                    if (field.Productions) {
        //                        for (var p=0;p<field.Productions.length;p++) {
        //                            productions.push(field.Productions[p]);
        //                        }
        //
        //                        if (field["-parent"]) {
        //                            this.getParentNode(field["-parent"], productions);
        //                        }
        //                        else if (field["-node"]) {
        //                            this.getParentNode(field["-node"], productions);
        //                        }
        //                        break;
        //                    }
        //                }
        //            }
        //        }
        //    }
        //},
        isValidNode: function(childNode, dropGroup) {
            var childVisual, parentVisual;

            for(var s=0; s < this.getSyntaxTree().SyntaxNodes.length; s++) {
                var item = this.getSyntaxTree().SyntaxNodes[s];
                if(childNode === item["Id"]) {
                    if (item.Productions) {
                        //look at child node
                        for (var p=0;p<item.Productions.length;p++) {
                            childVisual = item.Productions[p].Group;
                            break;
                        }
                    }
                }
            }

            //for(var s=0; s < this.getSyntaxTree().SyntaxNodes.length; s++) {
            //    var itemNode = this.getSyntaxTree().SyntaxNodes[s];
            //    if(parentNode === itemNode["Id"]) {
            //        if (itemNode.Productions) {
            //            //look at parent node
            //            for (var p=0;p<itemNode.Productions.length;p++) {
            //                parentVisual = itemNode.Productions[p].Group;
            //                break;
            //            }
            //        }
            //    }
            //}


            return (childVisual === dropGroup);
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
            return {
                "Root": {
                    "Id": "Program",
                        "Fields": [{
                        "Node": {
                            "Id": "StatementNode",
                            "Fields": [],
                            "Productions": [{
                                "Value": true,
                                "ProductionType": 1
                            }],
                            "Parent": null
                        },
                        "Name": "Statements",
                        "Productions": [{
                            "Value": false,
                            "ProductionType": 0
                        },
                            {
                                "Value": true,
                                "Element": "Statement",
                                "ProductionType": 3
                            },
                            {
                                "Nodes": ["Declaration"],
                                "ProductionType": 4
                            }]
                    }],
                        "Productions": [{
                        "Group": "Root",
                        "ProductionType": 2
                    }],
                        "Parent": null
                },
                "SyntaxNodes": [{
                    "Id": "Program",
                    "Fields": [{
                        "Node": {
                            "Id": "StatementNode",
                            "Fields": [],
                            "Productions": [{
                                "Value": true,
                                "ProductionType": 1
                            }],
                            "Parent": null
                        },
                        "Name": "Statements",
                        "Productions": [{
                            "Value": false,
                            "ProductionType": 0
                        },
                        {
                            "Value": true,
                            "Element": "Statement",
                            "ProductionType": 3
                        },
                        {
                            "Nodes": ["Declaration"],
                            "ProductionType": 4
                        }]
                    }],
                    "Productions": [{
                        "Group": "Root",
                        "ProductionType": 2
                    }],
                    "Parent": null
                },
                    {
                        "Id": "StatementNode",
                        "Fields": [],
                        "Productions": [{
                            "Value": true,
                            "ProductionType": 1
                        }],
                        "Parent": null
                    },
                    {
                        "Id": "Declarable",
                        "Fields": [{
                            "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                            "Name": "Name",
                            "Productions": []
                        }],
                        "Productions": [{
                            "Value": true,
                            "ProductionType": 1
                        }],
                        "Parent": null
                    },
                    {
                        "Id": "Declaration",
                        "Fields": [{
                            "Node": {
                                "Id": "Declarable",
                                "Fields": [{
                                    "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                    "Name": "Name",
                                    "Productions": []
                                }],
                                "Productions": [{
                                    "Value": true,
                                    "ProductionType": 1
                                }],
                                "Parent": null
                            },
                            "Name": "Declarable",
                            "Productions": []
                        }],
                        "Productions": [],
                        "Parent": {
                            "Id": "StatementNode",
                            "Fields": [],
                            "Productions": [{
                                "Value": true,
                                "ProductionType": 1
                            }],
                            "Parent": null
                        }
                    },
                    {
                        "Id": "Identifer",
                        "Fields": [{
                            "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                            "Name": "Value",
                            "Productions": []
                        }],
                        "Productions": [{
                            "Pattern": "[w-[0-9]]w*",
                            "ProductionType": 5
                        }],
                        "Parent": null
                    },
                    {
                        "Id": "TypeNode",
                        "Fields": [],
                        "Productions": [],
                        "Parent": {
                            "Id": "Declarable",
                            "Fields": [{
                                "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                "Name": "Name",
                                "Productions": []
                            }],
                            "Productions": [{
                                "Value": true,
                                "ProductionType": 1
                            }],
                            "Parent": null
                        }
                    },
                    {
                        "Id": "BooleanTypeNode",
                        "Fields": [],
                        "Productions": [],
                        "Parent": {
                            "Id": "Declarable",
                            "Fields": [{
                                "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                "Name": "Name",
                                "Productions": []
                            }],
                            "Productions": [{
                                "Value": true,
                                "ProductionType": 1
                            }],
                            "Parent": null
                        }
                    },
                    {
                        "Id": "IntegerTypeNode",
                        "Fields": [],
                        "Productions": [],
                        "Parent": {
                            "Id": "Declarable",
                            "Fields": [{
                                "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                "Name": "Name",
                                "Productions": []
                            }],
                            "Productions": [{
                                "Value": true,
                                "ProductionType": 1
                            }],
                            "Parent": null
                        }
                    },
                    {
                        "Id": "StringTypeNode",
                        "Fields": [],
                        "Productions": [],
                        "Parent": {
                            "Id": "Declarable",
                            "Fields": [{
                                "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                "Name": "Name",
                                "Productions": []
                            }],
                            "Productions": [{
                                "Value": true,
                                "ProductionType": 1
                            }],
                            "Parent": null
                        }
                    },
                    {
                        "Id": "NullTypeNode",
                        "Fields": [],
                        "Productions": [],
                        "Parent": {
                            "Id": "Declarable",
                            "Fields": [{
                                "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                "Name": "Name",
                                "Productions": []
                            }],
                            "Productions": [{
                                "Value": true,
                                "ProductionType": 1
                            }],
                            "Parent": null
                        }
                    },
                    {
                        "Id": "ExpressionNode",
                        "Fields": [{
                            "Node": {
                                "Id": "TypeNode",
                                "Fields": [],
                                "Productions": [],
                                "Parent": {
                                    "Id": "Declarable",
                                    "Fields": [{
                                        "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                        "Name": "Name",
                                        "Productions": []
                                    }],
                                    "Productions": [{
                                        "Value": true,
                                        "ProductionType": 1
                                    }],
                                    "Parent": null
                                }
                            },
                            "Name": "ExpressionType",
                            "Productions": []
                        }],
                        "Productions": [],
                        "Parent": null
                    },
                    {
                        "Id": "VariableNode",
                        "Fields": [{
                            "Node": {
                                "Id": "TypeNode",
                                "Fields": [],
                                "Productions": [],
                                "Parent": {
                                    "Id": "Declarable",
                                    "Fields": [{
                                        "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                        "Name": "Name",
                                        "Productions": []
                                    }],
                                    "Productions": [{
                                        "Value": true,
                                        "ProductionType": 1
                                    }],
                                    "Parent": null
                                }
                            },
                            "Name": "Type",
                            "Productions": []
                        },
                            {
                                "Node": {
                                    "Id": "ExpressionNode",
                                    "Fields": [{
                                        "Node": {
                                            "Id": "TypeNode",
                                            "Fields": [],
                                            "Productions": [],
                                            "Parent": {
                                                "Id": "Declarable",
                                                "Fields": [{
                                                    "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                    "Name": "Name",
                                                    "Productions": []
                                                }],
                                                "Productions": [{
                                                    "Value": true,
                                                    "ProductionType": 1
                                                }],
                                                "Parent": null
                                            }
                                        },
                                        "Name": "ExpressionType",
                                        "Productions": []
                                    }],
                                    "Productions": [],
                                    "Parent": null
                                },
                                "Name": "Initializer",
                                "Productions": [{
                                    "Value": true,
                                    "ProductionType": 0
                                }]
                            }],
                        "Productions": [{
                            "Left": "Initializer.ExpressionType",
                            "Right": "Type",
                            "ProductionType": 6
                        },
                            {
                                "Group": "Declarables",
                                "ProductionType": 2
                            }],
                        "Parent": {
                            "Id": "Declarable",
                            "Fields": [{
                                "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                "Name": "Name",
                                "Productions": []
                            }],
                            "Productions": [{
                                "Value": true,
                                "ProductionType": 1
                            }],
                            "Parent": null
                        }
                    },
                    {
                        "Id": "ParameterNode",
                        "Fields": [],
                        "Productions": [{
                            "Group": "Declarables",
                            "ProductionType": 2
                        }],
                        "Parent": {
                            "Id": "VariableNode",
                            "Fields": [{
                                "Node": {
                                    "Id": "TypeNode",
                                    "Fields": [],
                                    "Productions": [],
                                    "Parent": {
                                        "Id": "Declarable",
                                        "Fields": [{
                                            "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                            "Name": "Name",
                                            "Productions": []
                                        }],
                                        "Productions": [{
                                            "Value": true,
                                            "ProductionType": 1
                                        }],
                                        "Parent": null
                                    }
                                },
                                "Name": "Type",
                                "Productions": []
                            },
                                {
                                    "Node": {
                                        "Id": "ExpressionNode",
                                        "Fields": [{
                                            "Node": {
                                                "Id": "TypeNode",
                                                "Fields": [],
                                                "Productions": [],
                                                "Parent": {
                                                    "Id": "Declarable",
                                                    "Fields": [{
                                                        "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                        "Name": "Name",
                                                        "Productions": []
                                                    }],
                                                    "Productions": [{
                                                        "Value": true,
                                                        "ProductionType": 1
                                                    }],
                                                    "Parent": null
                                                }
                                            },
                                            "Name": "ExpressionType",
                                            "Productions": []
                                        }],
                                        "Productions": [],
                                        "Parent": null
                                    },
                                    "Name": "Initializer",
                                    "Productions": [{
                                        "Value": true,
                                        "ProductionType": 0
                                    }]
                                }],
                            "Productions": [{
                                "Left": "Initializer.ExpressionType",
                                "Right": "Type",
                                "ProductionType": 6
                            },
                                {
                                    "Group": "Declarables",
                                    "ProductionType": 2
                                }],
                            "Parent": {
                                "Id": "Declarable",
                                "Fields": [{
                                    "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                    "Name": "Name",
                                    "Productions": []
                                }],
                                "Productions": [{
                                    "Value": true,
                                    "ProductionType": 1
                                }],
                                "Parent": null
                            }
                        }
                    },
                    {
                        "Id": "Block",
                        "Fields": [{
                            "Node": {
                                "Id": "StatementNode",
                                "Fields": [],
                                "Productions": [{
                                    "Value": true,
                                    "ProductionType": 1
                                }],
                                "Parent": null
                            },
                            "Name": "Statements",
                            "Productions": [{
                                "Value": true,
                                "Element": "Statement",
                                "ProductionType": 3
                            }]
                        }],
                        "Productions": [{
                            "Value": true,
                            "ProductionType": 7
                        }],
                        "Parent": null
                    },
                    {
                        "Id": "Function",
                        "Fields": [{
                            "Node": {
                                "Id": "Identifer",
                                "Fields": [{
                                    "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                    "Name": "Value",
                                    "Productions": []
                                }],
                                "Productions": [{
                                    "Pattern": "[w-[0-9]]w*",
                                    "ProductionType": 5
                                }],
                                "Parent": null
                            },
                            "Name": "Name",
                            "Productions": [{
                                "Value": false,
                                "ProductionType": 0
                            }]
                        },
                            {
                                "Node": {
                                    "Id": "TypeNode",
                                    "Fields": [],
                                    "Productions": [],
                                    "Parent": {
                                        "Id": "Declarable",
                                        "Fields": [{
                                            "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                            "Name": "Name",
                                            "Productions": []
                                        }],
                                        "Productions": [{
                                            "Value": true,
                                            "ProductionType": 1
                                        }],
                                        "Parent": null
                                    }
                                },
                                "Name": "ReturnType",
                                "Productions": [{
                                    "Value": true,
                                    "ProductionType": 0
                                }]
                            },
                            {
                                "Node": {
                                    "Id": "ParameterNode",
                                    "Fields": [],
                                    "Productions": [{
                                        "Group": "Declarables",
                                        "ProductionType": 2
                                    }],
                                    "Parent": {
                                        "Id": "VariableNode",
                                        "Fields": [{
                                            "Node": {
                                                "Id": "TypeNode",
                                                "Fields": [],
                                                "Productions": [],
                                                "Parent": {
                                                    "Id": "Declarable",
                                                    "Fields": [{
                                                        "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                        "Name": "Name",
                                                        "Productions": []
                                                    }],
                                                    "Productions": [{
                                                        "Value": true,
                                                        "ProductionType": 1
                                                    }],
                                                    "Parent": null
                                                }
                                            },
                                            "Name": "Type",
                                            "Productions": []
                                        },
                                            {
                                                "Node": {
                                                    "Id": "ExpressionNode",
                                                    "Fields": [{
                                                        "Node": {
                                                            "Id": "TypeNode",
                                                            "Fields": [],
                                                            "Productions": [],
                                                            "Parent": {
                                                                "Id": "Declarable",
                                                                "Fields": [{
                                                                    "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                                    "Name": "Name",
                                                                    "Productions": []
                                                                }],
                                                                "Productions": [{
                                                                    "Value": true,
                                                                    "ProductionType": 1
                                                                }],
                                                                "Parent": null
                                                            }
                                                        },
                                                        "Name": "ExpressionType",
                                                        "Productions": []
                                                    }],
                                                    "Productions": [],
                                                    "Parent": null
                                                },
                                                "Name": "Initializer",
                                                "Productions": [{
                                                    "Value": true,
                                                    "ProductionType": 0
                                                }]
                                            }],
                                        "Productions": [{
                                            "Left": "Initializer.ExpressionType",
                                            "Right": "Type",
                                            "ProductionType": 6
                                        },
                                            {
                                                "Group": "Declarables",
                                                "ProductionType": 2
                                            }],
                                        "Parent": {
                                            "Id": "Declarable",
                                            "Fields": [{
                                                "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                "Name": "Name",
                                                "Productions": []
                                            }],
                                            "Productions": [{
                                                "Value": true,
                                                "ProductionType": 1
                                            }],
                                            "Parent": null
                                        }
                                    }
                                },
                                "Name": "Parameters",
                                "Productions": [{
                                    "Value": true,
                                    "ProductionType": 0
                                },
                                    {
                                        "Value": true,
                                        "Element": "Parameter",
                                        "ProductionType": 3
                                    }]
                            },
                            {
                                "Node": {
                                    "Id": "Block",
                                    "Fields": [{
                                        "Node": {
                                            "Id": "StatementNode",
                                            "Fields": [],
                                            "Productions": [{
                                                "Value": true,
                                                "ProductionType": 1
                                            }],
                                            "Parent": null
                                        },
                                        "Name": "Statements",
                                        "Productions": [{
                                            "Value": true,
                                            "Element": "Statement",
                                            "ProductionType": 3
                                        }]
                                    }],
                                    "Productions": [{
                                        "Value": true,
                                        "ProductionType": 7
                                    }],
                                    "Parent": null
                                },
                                "Name": "Body",
                                "Productions": [{
                                    "Value": true,
                                    "ProductionType": 0
                                }]
                            }],
                        "Productions": [{
                            "Value": true,
                            "ProductionType": 7
                        },
                            {
                                "Group": "Declarables",
                                "ProductionType": 2
                            }],
                        "Parent": {
                            "Id": "Declarable",
                            "Fields": [{
                                "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                "Name": "Name",
                                "Productions": []
                            }],
                            "Productions": [{
                                "Value": true,
                                "ProductionType": 1
                            }],
                            "Parent": null
                        }
                    },
                    {
                        "Id": "BlockStatement",
                        "Fields": [{
                            "Node": {
                                "Id": "Block",
                                "Fields": [{
                                    "Node": {
                                        "Id": "StatementNode",
                                        "Fields": [],
                                        "Productions": [{
                                            "Value": true,
                                            "ProductionType": 1
                                        }],
                                        "Parent": null
                                    },
                                    "Name": "Statements",
                                    "Productions": [{
                                        "Value": true,
                                        "Element": "Statement",
                                        "ProductionType": 3
                                    }]
                                }],
                                "Productions": [{
                                    "Value": true,
                                    "ProductionType": 7
                                }],
                                "Parent": null
                            },
                            "Name": "MainBlock",
                            "Productions": []
                        }],
                        "Productions": [{
                            "Group": "Statements",
                            "ProductionType": 2
                        }],
                        "Parent": {
                            "Id": "StatementNode",
                            "Fields": [],
                            "Productions": [{
                                "Value": true,
                                "ProductionType": 1
                            }],
                            "Parent": null
                        }
                    },
                    {
                        "Id": "VariableExpressionNode",
                        "Fields": [],
                        "Productions": [{
                            "Value": true,
                            "ProductionType": 8
                        }],
                        "Parent": {
                            "Id": "ExpressionNode",
                            "Fields": [{
                                "Node": {
                                    "Id": "TypeNode",
                                    "Fields": [],
                                    "Productions": [],
                                    "Parent": {
                                        "Id": "Declarable",
                                        "Fields": [{
                                            "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                            "Name": "Name",
                                            "Productions": []
                                        }],
                                        "Productions": [{
                                            "Value": true,
                                            "ProductionType": 1
                                        }],
                                        "Parent": null
                                    }
                                },
                                "Name": "ExpressionType",
                                "Productions": []
                            }],
                            "Productions": [],
                            "Parent": null
                        }
                    },
                    {
                        "Id": "SimpleVariableReferenceNode",
                        "Fields": [{
                            "Node": {
                                "Id": "VariableNode",
                                "Fields": [{
                                    "Node": {
                                        "Id": "TypeNode",
                                        "Fields": [],
                                        "Productions": [],
                                        "Parent": {
                                            "Id": "Declarable",
                                            "Fields": [{
                                                "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                "Name": "Name",
                                                "Productions": []
                                            }],
                                            "Productions": [{
                                                "Value": true,
                                                "ProductionType": 1
                                            }],
                                            "Parent": null
                                        }
                                    },
                                    "Name": "Type",
                                    "Productions": []
                                },
                                    {
                                        "Node": {
                                            "Id": "ExpressionNode",
                                            "Fields": [{
                                                "Node": {
                                                    "Id": "TypeNode",
                                                    "Fields": [],
                                                    "Productions": [],
                                                    "Parent": {
                                                        "Id": "Declarable",
                                                        "Fields": [{
                                                            "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                            "Name": "Name",
                                                            "Productions": []
                                                        }],
                                                        "Productions": [{
                                                            "Value": true,
                                                            "ProductionType": 1
                                                        }],
                                                        "Parent": null
                                                    }
                                                },
                                                "Name": "ExpressionType",
                                                "Productions": []
                                            }],
                                            "Productions": [],
                                            "Parent": null
                                        },
                                        "Name": "Initializer",
                                        "Productions": [{
                                            "Value": true,
                                            "ProductionType": 0
                                        }]
                                    }],
                                "Productions": [{
                                    "Left": "Initializer.ExpressionType",
                                    "Right": "Type",
                                    "ProductionType": 6
                                },
                                    {
                                        "Group": "Declarables",
                                        "ProductionType": 2
                                    }],
                                "Parent": {
                                    "Id": "Declarable",
                                    "Fields": [{
                                        "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                        "Name": "Name",
                                        "Productions": []
                                    }],
                                    "Productions": [{
                                        "Value": true,
                                        "ProductionType": 1
                                    }],
                                    "Parent": null
                                }
                            },
                            "Name": "Referent",
                            "Productions": [{
                                "Name": "Name",
                                "ProductionType": 9
                            }]
                        },
                            {
                                "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                "Name": "Name",
                                "Productions": [{
                                    "Value": true,
                                    "ProductionType": 8
                                }]
                            },
                            {
                                "Type": "System.Boolean, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                "Name": "IsStatic",
                                "Productions": [{
                                    "Value": true,
                                    "ProductionType": 8
                                }]
                            }],
                        "Productions": [{
                            "Field": "ExpressionType",
                            "From": "Referent.Type",
                            "ProductionType": 10
                        },
                            {
                                "Group": "Expressions",
                                "ProductionType": 2
                            }],
                        "Parent": {
                            "Id": "VariableExpressionNode",
                            "Fields": [],
                            "Productions": [{
                                "Value": true,
                                "ProductionType": 8
                            }],
                            "Parent": {
                                "Id": "ExpressionNode",
                                "Fields": [{
                                    "Node": {
                                        "Id": "TypeNode",
                                        "Fields": [],
                                        "Productions": [],
                                        "Parent": {
                                            "Id": "Declarable",
                                            "Fields": [{
                                                "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                "Name": "Name",
                                                "Productions": []
                                            }],
                                            "Productions": [{
                                                "Value": true,
                                                "ProductionType": 1
                                            }],
                                            "Parent": null
                                        }
                                    },
                                    "Name": "ExpressionType",
                                    "Productions": []
                                }],
                                "Productions": [],
                                "Parent": null
                            }
                        }
                    },
                    {
                        "Id": "MemberAccessNode",
                        "Fields": [{
                            "Node": {
                                "Id": "ExpressionNode",
                                "Fields": [{
                                    "Node": {
                                        "Id": "TypeNode",
                                        "Fields": [],
                                        "Productions": [],
                                        "Parent": {
                                            "Id": "Declarable",
                                            "Fields": [{
                                                "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                "Name": "Name",
                                                "Productions": []
                                            }],
                                            "Productions": [{
                                                "Value": true,
                                                "ProductionType": 1
                                            }],
                                            "Parent": null
                                        }
                                    },
                                    "Name": "ExpressionType",
                                    "Productions": []
                                }],
                                "Productions": [],
                                "Parent": null
                            },
                            "Name": "Parent",
                            "Productions": []
                        },
                            {
                                "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                "Name": "ChildId",
                                "Productions": []
                            },
                            {
                                "Type": "System.Boolean, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                "Name": "IsStatic",
                                "Productions": []
                            }],
                        "Productions": [{
                            "Value": true,
                            "ProductionType": 1
                        }],
                        "Parent": {
                            "Id": "VariableExpressionNode",
                            "Fields": [],
                            "Productions": [{
                                "Value": true,
                                "ProductionType": 8
                            }],
                            "Parent": {
                                "Id": "ExpressionNode",
                                "Fields": [{
                                    "Node": {
                                        "Id": "TypeNode",
                                        "Fields": [],
                                        "Productions": [],
                                        "Parent": {
                                            "Id": "Declarable",
                                            "Fields": [{
                                                "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                "Name": "Name",
                                                "Productions": []
                                            }],
                                            "Productions": [{
                                                "Value": true,
                                                "ProductionType": 1
                                            }],
                                            "Parent": null
                                        }
                                    },
                                    "Name": "ExpressionType",
                                    "Productions": []
                                }],
                                "Productions": [],
                                "Parent": null
                            }
                        }
                    },
                    {
                        "Id": "FieldAccessNode",
                        "Fields": [],
                        "Productions": [{
                            "TypeNodeName": "Parent.ExpressionType",
                            "FieldName": "ChildId",
                            "IsStatic": "IsStatic",
                            "FieldToSet": "ExpressionType",
                            "ProductionType": 13
                        },
                            {
                                "Group": "Expressions",
                                "ProductionType": 2
                            }],
                        "Parent": {
                            "Id": "MemberAccessNode",
                            "Fields": [{
                                "Node": {
                                    "Id": "ExpressionNode",
                                    "Fields": [{
                                        "Node": {
                                            "Id": "TypeNode",
                                            "Fields": [],
                                            "Productions": [],
                                            "Parent": {
                                                "Id": "Declarable",
                                                "Fields": [{
                                                    "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                    "Name": "Name",
                                                    "Productions": []
                                                }],
                                                "Productions": [{
                                                    "Value": true,
                                                    "ProductionType": 1
                                                }],
                                                "Parent": null
                                            }
                                        },
                                        "Name": "ExpressionType",
                                        "Productions": []
                                    }],
                                    "Productions": [],
                                    "Parent": null
                                },
                                "Name": "Parent",
                                "Productions": []
                            },
                                {
                                    "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                    "Name": "ChildId",
                                    "Productions": []
                                },
                                {
                                    "Type": "System.Boolean, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                    "Name": "IsStatic",
                                    "Productions": []
                                }],
                            "Productions": [{
                                "Value": true,
                                "ProductionType": 1
                            }],
                            "Parent": {
                                "Id": "VariableExpressionNode",
                                "Fields": [],
                                "Productions": [{
                                    "Value": true,
                                    "ProductionType": 8
                                }],
                                "Parent": {
                                    "Id": "ExpressionNode",
                                    "Fields": [{
                                        "Node": {
                                            "Id": "TypeNode",
                                            "Fields": [],
                                            "Productions": [],
                                            "Parent": {
                                                "Id": "Declarable",
                                                "Fields": [{
                                                    "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                    "Name": "Name",
                                                    "Productions": []
                                                }],
                                                "Productions": [{
                                                    "Value": true,
                                                    "ProductionType": 1
                                                }],
                                                "Parent": null
                                            }
                                        },
                                        "Name": "ExpressionType",
                                        "Productions": []
                                    }],
                                    "Productions": [],
                                    "Parent": null
                                }
                            }
                        }
                    },
                    {
                        "Id": "LiteralNode",
                        "Fields": [{
                            "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                            "Name": "Lexeme",
                            "Productions": []
                        }],
                        "Productions": [{
                            "Value": true,
                            "ProductionType": 1
                        }],
                        "Parent": {
                            "Id": "ExpressionNode",
                            "Fields": [{
                                "Node": {
                                    "Id": "TypeNode",
                                    "Fields": [],
                                    "Productions": [],
                                    "Parent": {
                                        "Id": "Declarable",
                                        "Fields": [{
                                            "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                            "Name": "Name",
                                            "Productions": []
                                        }],
                                        "Productions": [{
                                            "Value": true,
                                            "ProductionType": 1
                                        }],
                                        "Parent": null
                                    }
                                },
                                "Name": "ExpressionType",
                                "Productions": []
                            }],
                            "Productions": [],
                            "Parent": null
                        }
                    },
                    {
                        "Id": "BooleanLiteral",
                        "Fields": [],
                        "Productions": [{
                            "Field": "Lexeme",
                            "Options": ["true",
                                "false"],
                            "ProductionType": 11
                        },
                            {
                                "TypeNodeName": "BooleanTypeNode",
                                "ProductionType": 12
                            },
                            {
                                "Group": "Literals",
                                "ProductionType": 2
                            }],
                        "Parent": {
                            "Id": "LiteralNode",
                            "Fields": [{
                                "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                "Name": "Lexeme",
                                "Productions": []
                            }],
                            "Productions": [{
                                "Value": true,
                                "ProductionType": 1
                            }],
                            "Parent": {
                                "Id": "ExpressionNode",
                                "Fields": [{
                                    "Node": {
                                        "Id": "TypeNode",
                                        "Fields": [],
                                        "Productions": [],
                                        "Parent": {
                                            "Id": "Declarable",
                                            "Fields": [{
                                                "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                "Name": "Name",
                                                "Productions": []
                                            }],
                                            "Productions": [{
                                                "Value": true,
                                                "ProductionType": 1
                                            }],
                                            "Parent": null
                                        }
                                    },
                                    "Name": "ExpressionType",
                                    "Productions": []
                                }],
                                "Productions": [],
                                "Parent": null
                            }
                        }
                    },
                    {
                        "Id": "IntegerLiteral",
                        "Fields": [],
                        "Productions": [{
                            "TypeNodeName": "IntegerTypeNode",
                            "ProductionType": 12
                        },
                            {
                                "Pattern": "^d+$",
                                "ProductionType": 5
                            },
                            {
                                "Group": "Literals",
                                "ProductionType": 2
                            }],
                        "Parent": {
                            "Id": "LiteralNode",
                            "Fields": [{
                                "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                "Name": "Lexeme",
                                "Productions": []
                            }],
                            "Productions": [{
                                "Value": true,
                                "ProductionType": 1
                            }],
                            "Parent": {
                                "Id": "ExpressionNode",
                                "Fields": [{
                                    "Node": {
                                        "Id": "TypeNode",
                                        "Fields": [],
                                        "Productions": [],
                                        "Parent": {
                                            "Id": "Declarable",
                                            "Fields": [{
                                                "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                "Name": "Name",
                                                "Productions": []
                                            }],
                                            "Productions": [{
                                                "Value": true,
                                                "ProductionType": 1
                                            }],
                                            "Parent": null
                                        }
                                    },
                                    "Name": "ExpressionType",
                                    "Productions": []
                                }],
                                "Productions": [],
                                "Parent": null
                            }
                        }
                    },
                    {
                        "Id": "StringLiteral",
                        "Fields": [],
                        "Productions": [{
                            "TypeNodeName": "StringTypeNode",
                            "ProductionType": 12
                        },
                            {
                                "Group": "Literals",
                                "ProductionType": 2
                            }],
                        "Parent": {
                            "Id": "LiteralNode",
                            "Fields": [{
                                "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                "Name": "Lexeme",
                                "Productions": []
                            }],
                            "Productions": [{
                                "Value": true,
                                "ProductionType": 1
                            }],
                            "Parent": {
                                "Id": "ExpressionNode",
                                "Fields": [{
                                    "Node": {
                                        "Id": "TypeNode",
                                        "Fields": [],
                                        "Productions": [],
                                        "Parent": {
                                            "Id": "Declarable",
                                            "Fields": [{
                                                "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                "Name": "Name",
                                                "Productions": []
                                            }],
                                            "Productions": [{
                                                "Value": true,
                                                "ProductionType": 1
                                            }],
                                            "Parent": null
                                        }
                                    },
                                    "Name": "ExpressionType",
                                    "Productions": []
                                }],
                                "Productions": [],
                                "Parent": null
                            }
                        }
                    },
                    {
                        "Id": "NullLiteral",
                        "Fields": [],
                        "Productions": [{
                            "TypeNodeName": "NullLiteral",
                            "ProductionType": 12
                        },
                            {
                                "Group": "Literals",
                                "ProductionType": 2
                            }],
                        "Parent": {
                            "Id": "LiteralNode",
                            "Fields": [{
                                "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                "Name": "Lexeme",
                                "Productions": []
                            }],
                            "Productions": [{
                                "Value": true,
                                "ProductionType": 1
                            }],
                            "Parent": {
                                "Id": "ExpressionNode",
                                "Fields": [{
                                    "Node": {
                                        "Id": "TypeNode",
                                        "Fields": [],
                                        "Productions": [],
                                        "Parent": {
                                            "Id": "Declarable",
                                            "Fields": [{
                                                "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                "Name": "Name",
                                                "Productions": []
                                            }],
                                            "Productions": [{
                                                "Value": true,
                                                "ProductionType": 1
                                            }],
                                            "Parent": null
                                        }
                                    },
                                    "Name": "ExpressionType",
                                    "Productions": []
                                }],
                                "Productions": [],
                                "Parent": null
                            }
                        }
                    },
                    {
                        "Id": "ReturnStatement",
                        "Fields": [{
                            "Node": {
                                "Id": "ExpressionNode",
                                "Fields": [{
                                    "Node": {
                                        "Id": "TypeNode",
                                        "Fields": [],
                                        "Productions": [],
                                        "Parent": {
                                            "Id": "Declarable",
                                            "Fields": [{
                                                "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                "Name": "Name",
                                                "Productions": []
                                            }],
                                            "Productions": [{
                                                "Value": true,
                                                "ProductionType": 1
                                            }],
                                            "Parent": null
                                        }
                                    },
                                    "Name": "ExpressionType",
                                    "Productions": []
                                }],
                                "Productions": [],
                                "Parent": null
                            },
                            "Name": "Expression",
                            "Productions": []
                        }],
                        "Productions": [{
                            "Group": "Statements",
                            "ProductionType": 2
                        }],
                        "Parent": {
                            "Id": "StatementNode",
                            "Fields": [],
                            "Productions": [{
                                "Value": true,
                                "ProductionType": 1
                            }],
                            "Parent": null
                        }
                    },
                    {
                        "Id": "InfixExpressionNode",
                        "Fields": [{
                            "Node": {
                                "Id": "ExpressionNode",
                                "Fields": [{
                                    "Node": {
                                        "Id": "TypeNode",
                                        "Fields": [],
                                        "Productions": [],
                                        "Parent": {
                                            "Id": "Declarable",
                                            "Fields": [{
                                                "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                "Name": "Name",
                                                "Productions": []
                                            }],
                                            "Productions": [{
                                                "Value": true,
                                                "ProductionType": 1
                                            }],
                                            "Parent": null
                                        }
                                    },
                                    "Name": "ExpressionType",
                                    "Productions": []
                                }],
                                "Productions": [],
                                "Parent": null
                            },
                            "Name": "Left",
                            "Productions": []
                        },
                            {
                                "Node": {
                                    "Id": "ExpressionNode",
                                    "Fields": [{
                                        "Node": {
                                            "Id": "TypeNode",
                                            "Fields": [],
                                            "Productions": [],
                                            "Parent": {
                                                "Id": "Declarable",
                                                "Fields": [{
                                                    "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                    "Name": "Name",
                                                    "Productions": []
                                                }],
                                                "Productions": [{
                                                    "Value": true,
                                                    "ProductionType": 1
                                                }],
                                                "Parent": null
                                            }
                                        },
                                        "Name": "ExpressionType",
                                        "Productions": []
                                    }],
                                    "Productions": [],
                                    "Parent": null
                                },
                                "Name": "Right",
                                "Productions": []
                            }],
                        "Productions": [{
                            "Value": true,
                            "ProductionType": 8
                        },
                            {
                                "Group": "Expressions",
                                "ProductionType": 2
                            },
                            {
                                "Left": "Left",
                                "Right": "Right",
                                "ProductionType": 6
                            }],
                        "Parent": {
                            "Id": "ExpressionNode",
                            "Fields": [{
                                "Node": {
                                    "Id": "TypeNode",
                                    "Fields": [],
                                    "Productions": [],
                                    "Parent": {
                                        "Id": "Declarable",
                                        "Fields": [{
                                            "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                            "Name": "Name",
                                            "Productions": []
                                        }],
                                        "Productions": [{
                                            "Value": true,
                                            "ProductionType": 1
                                        }],
                                        "Parent": null
                                    }
                                },
                                "Name": "ExpressionType",
                                "Productions": []
                            }],
                            "Productions": [],
                            "Parent": null
                        }
                    },
                    {
                        "Id": "EqualToExpression",
                        "Fields": [],
                        "Productions": [],
                        "Parent": {
                            "Id": "InfixExpressionNode",
                            "Fields": [{
                                "Node": {
                                    "Id": "ExpressionNode",
                                    "Fields": [{
                                        "Node": {
                                            "Id": "TypeNode",
                                            "Fields": [],
                                            "Productions": [],
                                            "Parent": {
                                                "Id": "Declarable",
                                                "Fields": [{
                                                    "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                    "Name": "Name",
                                                    "Productions": []
                                                }],
                                                "Productions": [{
                                                    "Value": true,
                                                    "ProductionType": 1
                                                }],
                                                "Parent": null
                                            }
                                        },
                                        "Name": "ExpressionType",
                                        "Productions": []
                                    }],
                                    "Productions": [],
                                    "Parent": null
                                },
                                "Name": "Left",
                                "Productions": []
                            },
                                {
                                    "Node": {
                                        "Id": "ExpressionNode",
                                        "Fields": [{
                                            "Node": {
                                                "Id": "TypeNode",
                                                "Fields": [],
                                                "Productions": [],
                                                "Parent": {
                                                    "Id": "Declarable",
                                                    "Fields": [{
                                                        "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                        "Name": "Name",
                                                        "Productions": []
                                                    }],
                                                    "Productions": [{
                                                        "Value": true,
                                                        "ProductionType": 1
                                                    }],
                                                    "Parent": null
                                                }
                                            },
                                            "Name": "ExpressionType",
                                            "Productions": []
                                        }],
                                        "Productions": [],
                                        "Parent": null
                                    },
                                    "Name": "Right",
                                    "Productions": []
                                }],
                            "Productions": [{
                                "Value": true,
                                "ProductionType": 8
                            },
                                {
                                    "Group": "Expressions",
                                    "ProductionType": 2
                                },
                                {
                                    "Left": "Left",
                                    "Right": "Right",
                                    "ProductionType": 6
                                }],
                            "Parent": {
                                "Id": "ExpressionNode",
                                "Fields": [{
                                    "Node": {
                                        "Id": "TypeNode",
                                        "Fields": [],
                                        "Productions": [],
                                        "Parent": {
                                            "Id": "Declarable",
                                            "Fields": [{
                                                "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                "Name": "Name",
                                                "Productions": []
                                            }],
                                            "Productions": [{
                                                "Value": true,
                                                "ProductionType": 1
                                            }],
                                            "Parent": null
                                        }
                                    },
                                    "Name": "ExpressionType",
                                    "Productions": []
                                }],
                                "Productions": [],
                                "Parent": null
                            }
                        }
                    },
                    {
                        "Id": "NotEqualToExpression",
                        "Fields": [],
                        "Productions": [],
                        "Parent": {
                            "Id": "InfixExpressionNode",
                            "Fields": [{
                                "Node": {
                                    "Id": "ExpressionNode",
                                    "Fields": [{
                                        "Node": {
                                            "Id": "TypeNode",
                                            "Fields": [],
                                            "Productions": [],
                                            "Parent": {
                                                "Id": "Declarable",
                                                "Fields": [{
                                                    "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                    "Name": "Name",
                                                    "Productions": []
                                                }],
                                                "Productions": [{
                                                    "Value": true,
                                                    "ProductionType": 1
                                                }],
                                                "Parent": null
                                            }
                                        },
                                        "Name": "ExpressionType",
                                        "Productions": []
                                    }],
                                    "Productions": [],
                                    "Parent": null
                                },
                                "Name": "Left",
                                "Productions": []
                            },
                                {
                                    "Node": {
                                        "Id": "ExpressionNode",
                                        "Fields": [{
                                            "Node": {
                                                "Id": "TypeNode",
                                                "Fields": [],
                                                "Productions": [],
                                                "Parent": {
                                                    "Id": "Declarable",
                                                    "Fields": [{
                                                        "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                        "Name": "Name",
                                                        "Productions": []
                                                    }],
                                                    "Productions": [{
                                                        "Value": true,
                                                        "ProductionType": 1
                                                    }],
                                                    "Parent": null
                                                }
                                            },
                                            "Name": "ExpressionType",
                                            "Productions": []
                                        }],
                                        "Productions": [],
                                        "Parent": null
                                    },
                                    "Name": "Right",
                                    "Productions": []
                                }],
                            "Productions": [{
                                "Value": true,
                                "ProductionType": 8
                            },
                                {
                                    "Group": "Expressions",
                                    "ProductionType": 2
                                },
                                {
                                    "Left": "Left",
                                    "Right": "Right",
                                    "ProductionType": 6
                                }],
                            "Parent": {
                                "Id": "ExpressionNode",
                                "Fields": [{
                                    "Node": {
                                        "Id": "TypeNode",
                                        "Fields": [],
                                        "Productions": [],
                                        "Parent": {
                                            "Id": "Declarable",
                                            "Fields": [{
                                                "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                "Name": "Name",
                                                "Productions": []
                                            }],
                                            "Productions": [{
                                                "Value": true,
                                                "ProductionType": 1
                                            }],
                                            "Parent": null
                                        }
                                    },
                                    "Name": "ExpressionType",
                                    "Productions": []
                                }],
                                "Productions": [],
                                "Parent": null
                            }
                        }
                    },
                    {
                        "Id": "LessThanExpression",
                        "Fields": [],
                        "Productions": [],
                        "Parent": {
                            "Id": "InfixExpressionNode",
                            "Fields": [{
                                "Node": {
                                    "Id": "ExpressionNode",
                                    "Fields": [{
                                        "Node": {
                                            "Id": "TypeNode",
                                            "Fields": [],
                                            "Productions": [],
                                            "Parent": {
                                                "Id": "Declarable",
                                                "Fields": [{
                                                    "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                    "Name": "Name",
                                                    "Productions": []
                                                }],
                                                "Productions": [{
                                                    "Value": true,
                                                    "ProductionType": 1
                                                }],
                                                "Parent": null
                                            }
                                        },
                                        "Name": "ExpressionType",
                                        "Productions": []
                                    }],
                                    "Productions": [],
                                    "Parent": null
                                },
                                "Name": "Left",
                                "Productions": []
                            },
                                {
                                    "Node": {
                                        "Id": "ExpressionNode",
                                        "Fields": [{
                                            "Node": {
                                                "Id": "TypeNode",
                                                "Fields": [],
                                                "Productions": [],
                                                "Parent": {
                                                    "Id": "Declarable",
                                                    "Fields": [{
                                                        "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                        "Name": "Name",
                                                        "Productions": []
                                                    }],
                                                    "Productions": [{
                                                        "Value": true,
                                                        "ProductionType": 1
                                                    }],
                                                    "Parent": null
                                                }
                                            },
                                            "Name": "ExpressionType",
                                            "Productions": []
                                        }],
                                        "Productions": [],
                                        "Parent": null
                                    },
                                    "Name": "Right",
                                    "Productions": []
                                }],
                            "Productions": [{
                                "Value": true,
                                "ProductionType": 8
                            },
                                {
                                    "Group": "Expressions",
                                    "ProductionType": 2
                                },
                                {
                                    "Left": "Left",
                                    "Right": "Right",
                                    "ProductionType": 6
                                }],
                            "Parent": {
                                "Id": "ExpressionNode",
                                "Fields": [{
                                    "Node": {
                                        "Id": "TypeNode",
                                        "Fields": [],
                                        "Productions": [],
                                        "Parent": {
                                            "Id": "Declarable",
                                            "Fields": [{
                                                "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                "Name": "Name",
                                                "Productions": []
                                            }],
                                            "Productions": [{
                                                "Value": true,
                                                "ProductionType": 1
                                            }],
                                            "Parent": null
                                        }
                                    },
                                    "Name": "ExpressionType",
                                    "Productions": []
                                }],
                                "Productions": [],
                                "Parent": null
                            }
                        }
                    },
                    {
                        "Id": "GreaterThanExpression",
                        "Fields": [],
                        "Productions": [],
                        "Parent": {
                            "Id": "InfixExpressionNode",
                            "Fields": [{
                                "Node": {
                                    "Id": "ExpressionNode",
                                    "Fields": [{
                                        "Node": {
                                            "Id": "TypeNode",
                                            "Fields": [],
                                            "Productions": [],
                                            "Parent": {
                                                "Id": "Declarable",
                                                "Fields": [{
                                                    "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                    "Name": "Name",
                                                    "Productions": []
                                                }],
                                                "Productions": [{
                                                    "Value": true,
                                                    "ProductionType": 1
                                                }],
                                                "Parent": null
                                            }
                                        },
                                        "Name": "ExpressionType",
                                        "Productions": []
                                    }],
                                    "Productions": [],
                                    "Parent": null
                                },
                                "Name": "Left",
                                "Productions": []
                            },
                                {
                                    "Node": {
                                        "Id": "ExpressionNode",
                                        "Fields": [{
                                            "Node": {
                                                "Id": "TypeNode",
                                                "Fields": [],
                                                "Productions": [],
                                                "Parent": {
                                                    "Id": "Declarable",
                                                    "Fields": [{
                                                        "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                        "Name": "Name",
                                                        "Productions": []
                                                    }],
                                                    "Productions": [{
                                                        "Value": true,
                                                        "ProductionType": 1
                                                    }],
                                                    "Parent": null
                                                }
                                            },
                                            "Name": "ExpressionType",
                                            "Productions": []
                                        }],
                                        "Productions": [],
                                        "Parent": null
                                    },
                                    "Name": "Right",
                                    "Productions": []
                                }],
                            "Productions": [{
                                "Value": true,
                                "ProductionType": 8
                            },
                                {
                                    "Group": "Expressions",
                                    "ProductionType": 2
                                },
                                {
                                    "Left": "Left",
                                    "Right": "Right",
                                    "ProductionType": 6
                                }],
                            "Parent": {
                                "Id": "ExpressionNode",
                                "Fields": [{
                                    "Node": {
                                        "Id": "TypeNode",
                                        "Fields": [],
                                        "Productions": [],
                                        "Parent": {
                                            "Id": "Declarable",
                                            "Fields": [{
                                                "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                "Name": "Name",
                                                "Productions": []
                                            }],
                                            "Productions": [{
                                                "Value": true,
                                                "ProductionType": 1
                                            }],
                                            "Parent": null
                                        }
                                    },
                                    "Name": "ExpressionType",
                                    "Productions": []
                                }],
                                "Productions": [],
                                "Parent": null
                            }
                        }
                    },
                    {
                        "Id": "LessThanOrEqualExpression",
                        "Fields": [],
                        "Productions": [],
                        "Parent": {
                            "Id": "InfixExpressionNode",
                            "Fields": [{
                                "Node": {
                                    "Id": "ExpressionNode",
                                    "Fields": [{
                                        "Node": {
                                            "Id": "TypeNode",
                                            "Fields": [],
                                            "Productions": [],
                                            "Parent": {
                                                "Id": "Declarable",
                                                "Fields": [{
                                                    "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                    "Name": "Name",
                                                    "Productions": []
                                                }],
                                                "Productions": [{
                                                    "Value": true,
                                                    "ProductionType": 1
                                                }],
                                                "Parent": null
                                            }
                                        },
                                        "Name": "ExpressionType",
                                        "Productions": []
                                    }],
                                    "Productions": [],
                                    "Parent": null
                                },
                                "Name": "Left",
                                "Productions": []
                            },
                                {
                                    "Node": {
                                        "Id": "ExpressionNode",
                                        "Fields": [{
                                            "Node": {
                                                "Id": "TypeNode",
                                                "Fields": [],
                                                "Productions": [],
                                                "Parent": {
                                                    "Id": "Declarable",
                                                    "Fields": [{
                                                        "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                        "Name": "Name",
                                                        "Productions": []
                                                    }],
                                                    "Productions": [{
                                                        "Value": true,
                                                        "ProductionType": 1
                                                    }],
                                                    "Parent": null
                                                }
                                            },
                                            "Name": "ExpressionType",
                                            "Productions": []
                                        }],
                                        "Productions": [],
                                        "Parent": null
                                    },
                                    "Name": "Right",
                                    "Productions": []
                                }],
                            "Productions": [{
                                "Value": true,
                                "ProductionType": 8
                            },
                                {
                                    "Group": "Expressions",
                                    "ProductionType": 2
                                },
                                {
                                    "Left": "Left",
                                    "Right": "Right",
                                    "ProductionType": 6
                                }],
                            "Parent": {
                                "Id": "ExpressionNode",
                                "Fields": [{
                                    "Node": {
                                        "Id": "TypeNode",
                                        "Fields": [],
                                        "Productions": [],
                                        "Parent": {
                                            "Id": "Declarable",
                                            "Fields": [{
                                                "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                "Name": "Name",
                                                "Productions": []
                                            }],
                                            "Productions": [{
                                                "Value": true,
                                                "ProductionType": 1
                                            }],
                                            "Parent": null
                                        }
                                    },
                                    "Name": "ExpressionType",
                                    "Productions": []
                                }],
                                "Productions": [],
                                "Parent": null
                            }
                        }
                    },
                    {
                        "Id": "GreaterThanOrEqualExpression",
                        "Fields": [],
                        "Productions": [],
                        "Parent": {
                            "Id": "InfixExpressionNode",
                            "Fields": [{
                                "Node": {
                                    "Id": "ExpressionNode",
                                    "Fields": [{
                                        "Node": {
                                            "Id": "TypeNode",
                                            "Fields": [],
                                            "Productions": [],
                                            "Parent": {
                                                "Id": "Declarable",
                                                "Fields": [{
                                                    "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                    "Name": "Name",
                                                    "Productions": []
                                                }],
                                                "Productions": [{
                                                    "Value": true,
                                                    "ProductionType": 1
                                                }],
                                                "Parent": null
                                            }
                                        },
                                        "Name": "ExpressionType",
                                        "Productions": []
                                    }],
                                    "Productions": [],
                                    "Parent": null
                                },
                                "Name": "Left",
                                "Productions": []
                            },
                                {
                                    "Node": {
                                        "Id": "ExpressionNode",
                                        "Fields": [{
                                            "Node": {
                                                "Id": "TypeNode",
                                                "Fields": [],
                                                "Productions": [],
                                                "Parent": {
                                                    "Id": "Declarable",
                                                    "Fields": [{
                                                        "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                        "Name": "Name",
                                                        "Productions": []
                                                    }],
                                                    "Productions": [{
                                                        "Value": true,
                                                        "ProductionType": 1
                                                    }],
                                                    "Parent": null
                                                }
                                            },
                                            "Name": "ExpressionType",
                                            "Productions": []
                                        }],
                                        "Productions": [],
                                        "Parent": null
                                    },
                                    "Name": "Right",
                                    "Productions": []
                                }],
                            "Productions": [{
                                "Value": true,
                                "ProductionType": 8
                            },
                                {
                                    "Group": "Expressions",
                                    "ProductionType": 2
                                },
                                {
                                    "Left": "Left",
                                    "Right": "Right",
                                    "ProductionType": 6
                                }],
                            "Parent": {
                                "Id": "ExpressionNode",
                                "Fields": [{
                                    "Node": {
                                        "Id": "TypeNode",
                                        "Fields": [],
                                        "Productions": [],
                                        "Parent": {
                                            "Id": "Declarable",
                                            "Fields": [{
                                                "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                "Name": "Name",
                                                "Productions": []
                                            }],
                                            "Productions": [{
                                                "Value": true,
                                                "ProductionType": 1
                                            }],
                                            "Parent": null
                                        }
                                    },
                                    "Name": "ExpressionType",
                                    "Productions": []
                                }],
                                "Productions": [],
                                "Parent": null
                            }
                        }
                    },
                    {
                        "Id": "validation",
                        "Fields": [{
                            "Node": {
                                "Id": "Function",
                                "Fields": [{
                                    "Node": {
                                        "Id": "Identifer",
                                        "Fields": [{
                                            "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                            "Name": "Value",
                                            "Productions": []
                                        }],
                                        "Productions": [{
                                            "Pattern": "[w-[0-9]]w*",
                                            "ProductionType": 5
                                        }],
                                        "Parent": null
                                    },
                                    "Name": "Name",
                                    "Productions": [{
                                        "Value": false,
                                        "ProductionType": 0
                                    }]
                                },
                                    {
                                        "Node": {
                                            "Id": "TypeNode",
                                            "Fields": [],
                                            "Productions": [],
                                            "Parent": {
                                                "Id": "Declarable",
                                                "Fields": [{
                                                    "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                    "Name": "Name",
                                                    "Productions": []
                                                }],
                                                "Productions": [{
                                                    "Value": true,
                                                    "ProductionType": 1
                                                }],
                                                "Parent": null
                                            }
                                        },
                                        "Name": "ReturnType",
                                        "Productions": [{
                                            "Value": true,
                                            "ProductionType": 0
                                        }]
                                    },
                                    {
                                        "Node": {
                                            "Id": "ParameterNode",
                                            "Fields": [],
                                            "Productions": [{
                                                "Group": "Declarables",
                                                "ProductionType": 2
                                            }],
                                            "Parent": {
                                                "Id": "VariableNode",
                                                "Fields": [{
                                                    "Node": {
                                                        "Id": "TypeNode",
                                                        "Fields": [],
                                                        "Productions": [],
                                                        "Parent": {
                                                            "Id": "Declarable",
                                                            "Fields": [{
                                                                "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                                "Name": "Name",
                                                                "Productions": []
                                                            }],
                                                            "Productions": [{
                                                                "Value": true,
                                                                "ProductionType": 1
                                                            }],
                                                            "Parent": null
                                                        }
                                                    },
                                                    "Name": "Type",
                                                    "Productions": []
                                                },
                                                    {
                                                        "Node": {
                                                            "Id": "ExpressionNode",
                                                            "Fields": [{
                                                                "Node": {
                                                                    "Id": "TypeNode",
                                                                    "Fields": [],
                                                                    "Productions": [],
                                                                    "Parent": {
                                                                        "Id": "Declarable",
                                                                        "Fields": [{
                                                                            "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                                            "Name": "Name",
                                                                            "Productions": []
                                                                        }],
                                                                        "Productions": [{
                                                                            "Value": true,
                                                                            "ProductionType": 1
                                                                        }],
                                                                        "Parent": null
                                                                    }
                                                                },
                                                                "Name": "ExpressionType",
                                                                "Productions": []
                                                            }],
                                                            "Productions": [],
                                                            "Parent": null
                                                        },
                                                        "Name": "Initializer",
                                                        "Productions": [{
                                                            "Value": true,
                                                            "ProductionType": 0
                                                        }]
                                                    }],
                                                "Productions": [{
                                                    "Left": "Initializer.ExpressionType",
                                                    "Right": "Type",
                                                    "ProductionType": 6
                                                },
                                                    {
                                                        "Group": "Declarables",
                                                        "ProductionType": 2
                                                    }],
                                                "Parent": {
                                                    "Id": "Declarable",
                                                    "Fields": [{
                                                        "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                        "Name": "Name",
                                                        "Productions": []
                                                    }],
                                                    "Productions": [{
                                                        "Value": true,
                                                        "ProductionType": 1
                                                    }],
                                                    "Parent": null
                                                }
                                            }
                                        },
                                        "Name": "Parameters",
                                        "Productions": [{
                                            "Value": true,
                                            "ProductionType": 0
                                        },
                                            {
                                                "Value": true,
                                                "Element": "Parameter",
                                                "ProductionType": 3
                                            }]
                                    },
                                    {
                                        "Node": {
                                            "Id": "Block",
                                            "Fields": [{
                                                "Node": {
                                                    "Id": "StatementNode",
                                                    "Fields": [],
                                                    "Productions": [{
                                                        "Value": true,
                                                        "ProductionType": 1
                                                    }],
                                                    "Parent": null
                                                },
                                                "Name": "Statements",
                                                "Productions": [{
                                                    "Value": true,
                                                    "Element": "Statement",
                                                    "ProductionType": 3
                                                }]
                                            }],
                                            "Productions": [{
                                                "Value": true,
                                                "ProductionType": 7
                                            }],
                                            "Parent": null
                                        },
                                        "Name": "Body",
                                        "Productions": [{
                                            "Value": true,
                                            "ProductionType": 0
                                        }]
                                    }],
                                "Productions": [{
                                    "Value": true,
                                    "ProductionType": 7
                                },
                                    {
                                        "Group": "Declarables",
                                        "ProductionType": 2
                                    }],
                                "Parent": {
                                    "Id": "Declarable",
                                    "Fields": [{
                                        "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                        "Name": "Name",
                                        "Productions": []
                                    }],
                                    "Productions": [{
                                        "Value": true,
                                        "ProductionType": 1
                                    }],
                                    "Parent": null
                                }
                            },
                            "Name": "when",
                            "Productions": [{
                                "TypeName": "bool",
                                "ProductionType": 14
                            },
                                {
                                    "Value": true,
                                    "ProductionType": 0
                                }]
                        },
                            {
                                "Node": {
                                    "Id": "Function",
                                    "Fields": [{
                                        "Node": {
                                            "Id": "Identifer",
                                            "Fields": [{
                                                "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                "Name": "Value",
                                                "Productions": []
                                            }],
                                            "Productions": [{
                                                "Pattern": "[w-[0-9]]w*",
                                                "ProductionType": 5
                                            }],
                                            "Parent": null
                                        },
                                        "Name": "Name",
                                        "Productions": [{
                                            "Value": false,
                                            "ProductionType": 0
                                        }]
                                    },
                                        {
                                            "Node": {
                                                "Id": "TypeNode",
                                                "Fields": [],
                                                "Productions": [],
                                                "Parent": {
                                                    "Id": "Declarable",
                                                    "Fields": [{
                                                        "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                        "Name": "Name",
                                                        "Productions": []
                                                    }],
                                                    "Productions": [{
                                                        "Value": true,
                                                        "ProductionType": 1
                                                    }],
                                                    "Parent": null
                                                }
                                            },
                                            "Name": "ReturnType",
                                            "Productions": [{
                                                "Value": true,
                                                "ProductionType": 0
                                            }]
                                        },
                                        {
                                            "Node": {
                                                "Id": "ParameterNode",
                                                "Fields": [],
                                                "Productions": [{
                                                    "Group": "Declarables",
                                                    "ProductionType": 2
                                                }],
                                                "Parent": {
                                                    "Id": "VariableNode",
                                                    "Fields": [{
                                                        "Node": {
                                                            "Id": "TypeNode",
                                                            "Fields": [],
                                                            "Productions": [],
                                                            "Parent": {
                                                                "Id": "Declarable",
                                                                "Fields": [{
                                                                    "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                                    "Name": "Name",
                                                                    "Productions": []
                                                                }],
                                                                "Productions": [{
                                                                    "Value": true,
                                                                    "ProductionType": 1
                                                                }],
                                                                "Parent": null
                                                            }
                                                        },
                                                        "Name": "Type",
                                                        "Productions": []
                                                    },
                                                        {
                                                            "Node": {
                                                                "Id": "ExpressionNode",
                                                                "Fields": [{
                                                                    "Node": {
                                                                        "Id": "TypeNode",
                                                                        "Fields": [],
                                                                        "Productions": [],
                                                                        "Parent": {
                                                                            "Id": "Declarable",
                                                                            "Fields": [{
                                                                                "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                                                "Name": "Name",
                                                                                "Productions": []
                                                                            }],
                                                                            "Productions": [{
                                                                                "Value": true,
                                                                                "ProductionType": 1
                                                                            }],
                                                                            "Parent": null
                                                                        }
                                                                    },
                                                                    "Name": "ExpressionType",
                                                                    "Productions": []
                                                                }],
                                                                "Productions": [],
                                                                "Parent": null
                                                            },
                                                            "Name": "Initializer",
                                                            "Productions": [{
                                                                "Value": true,
                                                                "ProductionType": 0
                                                            }]
                                                        }],
                                                    "Productions": [{
                                                        "Left": "Initializer.ExpressionType",
                                                        "Right": "Type",
                                                        "ProductionType": 6
                                                    },
                                                        {
                                                            "Group": "Declarables",
                                                            "ProductionType": 2
                                                        }],
                                                    "Parent": {
                                                        "Id": "Declarable",
                                                        "Fields": [{
                                                            "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                            "Name": "Name",
                                                            "Productions": []
                                                        }],
                                                        "Productions": [{
                                                            "Value": true,
                                                            "ProductionType": 1
                                                        }],
                                                        "Parent": null
                                                    }
                                                }
                                            },
                                            "Name": "Parameters",
                                            "Productions": [{
                                                "Value": true,
                                                "ProductionType": 0
                                            },
                                                {
                                                    "Value": true,
                                                    "Element": "Parameter",
                                                    "ProductionType": 3
                                                }]
                                        },
                                        {
                                            "Node": {
                                                "Id": "Block",
                                                "Fields": [{
                                                    "Node": {
                                                        "Id": "StatementNode",
                                                        "Fields": [],
                                                        "Productions": [{
                                                            "Value": true,
                                                            "ProductionType": 1
                                                        }],
                                                        "Parent": null
                                                    },
                                                    "Name": "Statements",
                                                    "Productions": [{
                                                        "Value": true,
                                                        "Element": "Statement",
                                                        "ProductionType": 3
                                                    }]
                                                }],
                                                "Productions": [{
                                                    "Value": true,
                                                    "ProductionType": 7
                                                }],
                                                "Parent": null
                                            },
                                            "Name": "Body",
                                            "Productions": [{
                                                "Value": true,
                                                "ProductionType": 0
                                            }]
                                        }],
                                    "Productions": [{
                                        "Value": true,
                                        "ProductionType": 7
                                    },
                                        {
                                            "Group": "Declarables",
                                            "ProductionType": 2
                                        }],
                                    "Parent": {
                                        "Id": "Declarable",
                                        "Fields": [{
                                            "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                            "Name": "Name",
                                            "Productions": []
                                        }],
                                        "Productions": [{
                                            "Value": true,
                                            "ProductionType": 1
                                        }],
                                        "Parent": null
                                    }
                                },
                                "Name": "validate",
                                "Productions": [{
                                    "TypeName": "bool",
                                    "ProductionType": 14
                                }]
                            },
                            {
                                "Node": {
                                    "Id": "Function",
                                    "Fields": [{
                                        "Node": {
                                            "Id": "Identifer",
                                            "Fields": [{
                                                "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                "Name": "Value",
                                                "Productions": []
                                            }],
                                            "Productions": [{
                                                "Pattern": "[w-[0-9]]w*",
                                                "ProductionType": 5
                                            }],
                                            "Parent": null
                                        },
                                        "Name": "Name",
                                        "Productions": [{
                                            "Value": false,
                                            "ProductionType": 0
                                        }]
                                    },
                                        {
                                            "Node": {
                                                "Id": "TypeNode",
                                                "Fields": [],
                                                "Productions": [],
                                                "Parent": {
                                                    "Id": "Declarable",
                                                    "Fields": [{
                                                        "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                        "Name": "Name",
                                                        "Productions": []
                                                    }],
                                                    "Productions": [{
                                                        "Value": true,
                                                        "ProductionType": 1
                                                    }],
                                                    "Parent": null
                                                }
                                            },
                                            "Name": "ReturnType",
                                            "Productions": [{
                                                "Value": true,
                                                "ProductionType": 0
                                            }]
                                        },
                                        {
                                            "Node": {
                                                "Id": "ParameterNode",
                                                "Fields": [],
                                                "Productions": [{
                                                    "Group": "Declarables",
                                                    "ProductionType": 2
                                                }],
                                                "Parent": {
                                                    "Id": "VariableNode",
                                                    "Fields": [{
                                                        "Node": {
                                                            "Id": "TypeNode",
                                                            "Fields": [],
                                                            "Productions": [],
                                                            "Parent": {
                                                                "Id": "Declarable",
                                                                "Fields": [{
                                                                    "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                                    "Name": "Name",
                                                                    "Productions": []
                                                                }],
                                                                "Productions": [{
                                                                    "Value": true,
                                                                    "ProductionType": 1
                                                                }],
                                                                "Parent": null
                                                            }
                                                        },
                                                        "Name": "Type",
                                                        "Productions": []
                                                    },
                                                        {
                                                            "Node": {
                                                                "Id": "ExpressionNode",
                                                                "Fields": [{
                                                                    "Node": {
                                                                        "Id": "TypeNode",
                                                                        "Fields": [],
                                                                        "Productions": [],
                                                                        "Parent": {
                                                                            "Id": "Declarable",
                                                                            "Fields": [{
                                                                                "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                                                "Name": "Name",
                                                                                "Productions": []
                                                                            }],
                                                                            "Productions": [{
                                                                                "Value": true,
                                                                                "ProductionType": 1
                                                                            }],
                                                                            "Parent": null
                                                                        }
                                                                    },
                                                                    "Name": "ExpressionType",
                                                                    "Productions": []
                                                                }],
                                                                "Productions": [],
                                                                "Parent": null
                                                            },
                                                            "Name": "Initializer",
                                                            "Productions": [{
                                                                "Value": true,
                                                                "ProductionType": 0
                                                            }]
                                                        }],
                                                    "Productions": [{
                                                        "Left": "Initializer.ExpressionType",
                                                        "Right": "Type",
                                                        "ProductionType": 6
                                                    },
                                                        {
                                                            "Group": "Declarables",
                                                            "ProductionType": 2
                                                        }],
                                                    "Parent": {
                                                        "Id": "Declarable",
                                                        "Fields": [{
                                                            "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                            "Name": "Name",
                                                            "Productions": []
                                                        }],
                                                        "Productions": [{
                                                            "Value": true,
                                                            "ProductionType": 1
                                                        }],
                                                        "Parent": null
                                                    }
                                                }
                                            },
                                            "Name": "Parameters",
                                            "Productions": [{
                                                "Value": true,
                                                "ProductionType": 0
                                            },
                                                {
                                                    "Value": true,
                                                    "Element": "Parameter",
                                                    "ProductionType": 3
                                                }]
                                        },
                                        {
                                            "Node": {
                                                "Id": "Block",
                                                "Fields": [{
                                                    "Node": {
                                                        "Id": "StatementNode",
                                                        "Fields": [],
                                                        "Productions": [{
                                                            "Value": true,
                                                            "ProductionType": 1
                                                        }],
                                                        "Parent": null
                                                    },
                                                    "Name": "Statements",
                                                    "Productions": [{
                                                        "Value": true,
                                                        "Element": "Statement",
                                                        "ProductionType": 3
                                                    }]
                                                }],
                                                "Productions": [{
                                                    "Value": true,
                                                    "ProductionType": 7
                                                }],
                                                "Parent": null
                                            },
                                            "Name": "Body",
                                            "Productions": [{
                                                "Value": true,
                                                "ProductionType": 0
                                            }]
                                        }],
                                    "Productions": [{
                                        "Value": true,
                                        "ProductionType": 7
                                    },
                                        {
                                            "Group": "Declarables",
                                            "ProductionType": 2
                                        }],
                                    "Parent": {
                                        "Id": "Declarable",
                                        "Fields": [{
                                            "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                            "Name": "Name",
                                            "Productions": []
                                        }],
                                        "Productions": [{
                                            "Value": true,
                                            "ProductionType": 1
                                        }],
                                        "Parent": null
                                    }
                                },
                                "Name": "message",
                                "Productions": [{
                                    "TypeName": "string",
                                    "ProductionType": 14
                                }]
                            }],
                        "Productions": [{
                            "Group": "Declarables",
                            "ProductionType": 2
                        }],
                        "Parent": {
                            "Id": "Declarable",
                            "Fields": [{
                                "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                "Name": "Name",
                                "Productions": []
                            }],
                            "Productions": [{
                                "Value": true,
                                "ProductionType": 1
                            }],
                            "Parent": null
                        }
                    }]
            };
        },
        getNodes: function(cb){
            var nodes = [];

            for(var s=0; s < this.getSyntaxTree().SyntaxNodes.length; s++) {
                var item = this.getSyntaxTree().SyntaxNodes[s];

                var itemProds = this.getProductions(item.Id);

                for (var i=0;i<itemProds.length;i++) {
                    if (itemProds[i].ProductionType === 2) {

                        if (itemProds[i].Group) {
                            item.group = itemProds[i].Group;

                        }

                        nodes.push(item);
                        break;
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
                "type": "Program",
                "controlName": "Program",
                "table": [{  // active as truth
                    "ref": 1,
                    "value": "truth",
                    "name": "active",
                    "blockIds": [
                        "Function-1",
                        "Block-1"
                    ]
                }],
                "children": [{ // Function test as truth
                    "id": "Function-1",
                    "type": "Function",
                    "controlName": "Function",
                    "children": [{
                        "id": "Name-1",
                        "type": "Name",
                        "value": "test"
                    }, {
                        "id": "ReturnType-1",
                        "type": "ReturnType",
                        "value": "truth"
                    }, {
                        "id": "Parameters-1",
                        "type": "Parameters",
                        "children": [{
                            "ref": 1,
                            "blockId": "Function-1",
                            "type": "ParameterNode",
                            "controlName": "Parameternode"
                        }]
                    }, { //return active is equal to yes
                        "id": "Block-1",
                        "type": "Block",
                        "controlName": "Block",
                        "children": [{
                            "id": "ReturnStatement-1",
                            "type": "ReturnStatement",
                            "controlName": "Returnstatement",
                            "children": [{
                                "id": "Expression-1",
                                "type": "EqualToExpression",
                                "controlName": "Equaltoexpression",
                                "left": {
                                    "ref": 1,
                                    "blockId": "Block-1",
                                    "type": "left"
                                },
                                "right": {
                                    "id": "BooleanLiteral-1",
                                    "type": "BooleanLiteral",
                                    "value": "yes"
                                }
                            }]
                        }]
                    }]
                }]
            };

            return uiTree;
        },
        getUITree2: function() {

            var uiTree = {
                "Program" : {
                "id": "Program-1", //will be root
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
                    "Function":{
                        "id": "Function-1",
                        "controlName" : "Function",
                        "Name" : {
                            "id" : "Name-1",
                            "value": "test"
                        },
                        "ReturnType" : {
                            "id" : "ReturnType-1",
                            "value" : "truth"
                        },
                        "Parameters" : {
                            "id": "Parameters-1",
                            "children" : [{
                                "ParameterNode" : {
                                    "ref": 1,
                                    "blockId": "Function-1",
                                    "controlName": "Parameternode"
                                }
                            }]
                        },
                        "Block" : {
                            "id": "Block-1",
                            "controlName": "Block",
                            "children": [{
                                "ReturnStatement" : {
                                    "id": "ReturnStatement-1",
                                    "controlName" : "Returnstatement",
                                    "children" : [ {
                                        "EqualToExpression" : {
                                            "id": "Expression-1",
                                            "controlName": "Equaltoexpression",
                                            "Left": {
                                                "ref": 1,
                                                "blockId": "Block-1",
                                                "children": []
                                            },
                                            "Right": {
                                                "BooleanLiteral": {
                                                    "id": "BooleanLiteral-1",
                                                    "value": "yes",
                                                    "children": []
                                                }
                                            }
                                        }
                                    }]
                                }
                            }]
                        }
                    }
                }]
            }};

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