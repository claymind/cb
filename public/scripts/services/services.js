'use strict';

var rulesServices = angular.module('rulesBuilderService', ['ngResource']);

rulesServices.factory('validationService', function() {
    return {
        isValidNode: function(source, target) {

        },
        getSyntaxTree: function(){
            return {
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
                                        "_node": "Identifer",
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
                                "productions": {
                                    "isCollection": {
                                        "_value": "true"
                                    }
                                },
                                "transformation": "\n          {Name}\n        ",
                                "_name": "Members",
                                "_node": "TypeDeclarableNode"
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
                            "transfomration": "\n        {MainBlock}\n      "
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
                },
                "SyntaxProductions": {
                    "SyntaxProduction": ""
                },
                "_Root": "Program"
            };
        },
        getNodeBlocks: function(){
            var syntaxTree = this.getSyntaxTree();
            var nodeBlocks = [];

            angular.forEach(syntaxTree.syntaxNodes.syntaxNode, function (item, index) {
                if (item.productions && item.productions.showVisual) {
                    if (item.productions.showVisual) { //this is a building block
                        nodeBlocks.push(item);
                    }
                }
            });
            return nodeBlocks;
        },
        getUINodeBlocks: function(){
            var nodeBlocks = this.getNodeBlocks();

        }
    };
});
