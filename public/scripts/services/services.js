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
        isValidNode: function(childNode, dropGroup) {
            var childVisual, parentVisual;

            for(var s=0; s < this.getSyntaxTree().SyntaxNodes.length; s++) {
                var item = this.getSyntaxTree().SyntaxNodes[s];

                if(childNode === item["Id"]) {
                    var itemProds = this.getProductions(item.Id);

                    for (var i=0;i<itemProds.length;i++) {
                        if (itemProds[i].ProductionType === 2) {

                            if (itemProds[i].Group) {
                                childVisual = itemProds[i].Group;
                                break;
                            }
                        }
                    }
                }

            }

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
        findNodeAndDelete: function(node, parentNode, functionId, tree) {
            if (parentNode.children) { //object has children
                for (var t = 0; t < parentNode.children.length; t++) {
                    if (node.id) {
                        if (parentNode.children[t].id === node.id) {
                            parentNode.children.splice(t, 1);
                            return true;
                            break;
                        } else { //if node has objects
                            this.findNodeAndDelete(node.id, parentNode.children[t], functionId);
                        }
                    }else if (node.ref) {
                        if (parentNode.children[t].ref) {
                            if (parentNode.children[t].ref === node.ref) {
                                parentNode.children.splice(t, 1);

                                //also delete ref from table
                                this.removeRefFromTable(node.ref, functionId, tree);
                                return true;
                                break;
                            } else { //if node has objects
                                this.findNodeAndDelete(node, parentNode.children[t], functionId, tree);
                            }
                        }
                        else if (parentNode.children[t].left) {
                            if (parentNode.children[t].left.ref) {
                                if (parentNode.children[t].left.ref === node.ref) {
                                    parentNode.children.splice(t, 1);

                                    //also delete ref from table
                                    this.removeRefFromTable(node.ref, functionId, tree);
                                    return true;
                                    break;
                                } else { //if node has objects
                                    this.findNodeAndDelete(node, parentNode.children[t], functionId, tree);
                                }
                            }
                            else if(parentNode.children[t].right.ref) {
                                if (parentNode.children[t].right.ref === node.ref) {
                                    parentNode.children.splice(t, 1);

                                    //also delete ref from table
                                    this.removeRefFromTable(node.ref, functionId, tree);
                                    return true;
                                    break;
                                } else { //if node has objects
                                    this.findNodeAndDelete(node, parentNode.children[t], functionId, tree);
                                }
                            }
                        }
                    }

                }
            }

            if (parentNode.fields) {
                for (var t = 0; t < parentNode.fields.length; t++) {
                    if (node.fields) {
                        if (parentNode.fields[t].name === node.id) {
                            parentNode.children.splice(t, 1);
                            return true;
                            break;
                        } else { //if node has objects
                            this.findNodeAndDelete(nodeId, parentNode.fields[t], functionId, tree);
                        }
                    }
                    else if (node.ref) {
                        if (parentNode.fields[t].ref === node.ref) {
                            parentNode.fields.splice(t, 1);

                            //also delete ref from table
                            this.removeRefFromTable(node.ref, functionId, tree);
                            return true;
                            break;
                        } else { //if node has objects
                            this.findNodeAndDelete(node, parentNode.fields[t], functionId, tree);
                        }
                    }
                }
            }
        },
        addFunctionParameter: function(node, tree, functionId) {
            for (var t=0;t<tree.children.length;t++){
                if (tree.children[t].id === functionId) {
                    for (var f = 0; f < tree.children[t].fields.length; f++) {
                        if (tree.children[t].fields[f].name === "Parameters") {
                            for (var r = 0; r < tree.children[t].fields[f].children.length; r++) {
                                var param = tree.children[t].fields[f].children[r];
                                if (param.ref === node.ref) {  //ref exists
                                    return false;
                                }
                            }
                            //add param
                            tree.children[t].fields[f].children.push({
                                "controlName": node.controlName,
                                "ref": node.ref,
                                "type": node.type
                            })


                            //add table ref
                            tree.table.push({
                                "ref": node.ref,
                                "value": "truth",
                                "name": "newParameter",
                                "functionId": node.functionId
                            });
                            return true;
                        }
                    }
                }
            }
            return false;

        },
        removeFunction: function(node, tree, functionId) {
            for (var t=0;t<tree.children.length;t++){
                if (tree.children[t].id === functionId) {

                    //remove function
                    tree.children.splice(t, 1)
                    //remove table ref
                    for (var t=tree.table.length;t>0;t--) {
                        if (tree.table[t-1].functionId === functionId) {
                            tree.table.splice(t-1, 1);
                        }
                    }
                    return true;

                }
            }
            return false;

        },
        addFunction: function(node, tree) {
            for (var t=0;t<tree.children.length;t++){
                if (tree.children[t].id === node.id) {
                    return false;
                }
            }
            delete node.action;
            tree.children.push(node);
            return true;

        },
        removeFunctionParameter: function(node, tree, functionId) {
            for (var t=0;t<tree.children.length;t++){
                if (tree.children[t].id === functionId) {
                    for (var f = 0; f < tree.children[t].fields.length; f++) {
                        if (tree.children[t].fields[f].name === "Parameters") {
                            for (var r = 0; r < tree.children[t].fields[f].children.length; r++) {
                                var param = tree.children[t].fields[f].children[r];
                                if (param.ref === node.ref) {  //ref exists
                                    //remove param
                                    tree.children[t].fields[f].children.splice(r, 1)
                                    //remove table ref
                                    this.removeRefFromTable(node.ref, functionId, tree);
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
            return false;

        },
        editFunctionParameter: function(node, tree, functionId, field, newValue ) {
            for (var t=0;t<tree.children.length;t++){
                if (tree.children[t].id === functionId) {
                    for (var f = 0; f < tree.children[t].fields.length; f++) {
                        if (tree.children[t].fields[f].name === "Parameters") {
                            for (var r = 0; r < tree.children[t].fields[f].children.length; r++) {
                                var param = tree.children[t].fields[f].children[r];
                                if (param.ref === node.ref) {  //ref exists
                                    //edit ref
                                    return this.editRefFromTable(node.ref, functionId, tree, field, newValue);
                                }
                            }
                        }
                    }
                }
            }
            return false;

        },
        removeRefFromTable: function(refId, functionId, tree, field) {
            for (var t=0;t<tree.table.length;t++) {
                if (tree.table[t].functionId === functionId && tree.table[t].ref === refId) {
                    tree.table.splice(t, 1);

                    return true;
                }
            }
            return false;
        },
        editRefFromTable: function(refId, functionId, tree, field, newValue) {
            for (var t=0;t<tree.table.length;t++) {
                if (tree.table[t].functionId === functionId && tree.table[t].ref === refId) {
                    tree.table[t][field] = newValue ;

                    return true;
                }
            }
        },
        editFunctionName: function(tree, functionId, newValue ) {
            for (var t=0;t<tree.children.length;t++){
                if (tree.children[t].id === functionId) {
                    for (var f = 0; f < tree.children[t].fields.length; f++) {
                        if (tree.children[t].fields[f].name === "Name") {
                            tree.children[t].fields[f].value = newValue;
                            return true;
                        }
                    }
                }
            }
            return false;

        },
        editFunctionReturnType: function(tree, functionId, newValue ) {
            for (var t=0;t<tree.children.length;t++){
                if (tree.children[t].id === functionId) {
                    for (var f = 0; f < tree.children[t].fields.length; f++) {
                        if (tree.children[t].fields[f].name === "ReturnType") {
                            tree.children[t].fields[f].value = newValue;
                            return true;
                        }
                    }
                }
            }
            return false;

        },
        updateExpression: function(tree, newExpression, statementId, functionId ) {
            for (var t=0;t<tree.children.length;t++){
                if (tree.children[t].id === functionId) {

                    traverse(tree.children[t]).forEach(function (item) {
                        if (typeof item === 'object' && (item.id === statementId)) {   //return statement
                            item.expression.left = newExpression.left;
                            item.expression.right = newExpression.right;

                        }
                    });
                }
            }
            return false;

        },
        removeStatement: function(node, tree, functionId) {
            for (var t=0;t<tree.children.length;t++){
                if (tree.children[t].id === functionId) {
                    for (var f = 0; f < tree.children[t].fields.length; f++) {
                        if (tree.children[t].fields[f].name === "Body") {
                            for (var r = 0; r < tree.children[t].fields[f].children.length; r++) {
                                var param = tree.children[t].fields[f].children[r];
                                if (param.type === "ReturnStatement" && node.id === param.id) {
                                    tree.children[t].fields[f].children.splice(r, 1);
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
            return false;

        },
        addExpression : function(node,tree, statementId, functionId) {
            for (var t=0;t<tree.children.length;t++){
                if (tree.children[t].id === functionId) {
                    //var that = this;
                    //traverse(tree.children[t]).forEach(function (item) {
                    //    if (typeof item === 'object' && (item.id === statementId)) {   //return statement
                    //        //add expresssion
                    //        item.expression = this.node;
                    //    }
                    //});
                    for (var s=0;s<tree.children[t].fields.length;s++) {
                        if (tree.children[t].fields[s].name === "Body") {
                            for (var c=0;c<tree.children[t].fields[s].children.length;c++) {
                                if (tree.children[t].fields[s].children[c].type === "ReturnStatement") {
                                    tree.children[t].fields[s].children[c].expression = node;
                                    return true;

                                }
                            }
                        }
                    }
                }
            }
            return false;
        },
        createInfixExpressionText : function(node, element){
            var left, right;
            var that = this;
            var operatorText = "";
            var previousNode = "";
            var values = [];
            var text = "";

            traverse(node).forEach(function (exp) {
                if (typeof node === 'object' && exp.type !== undefined) {
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
                                    var item = that.getTableReference(exp.ref, funcId);
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
                    };
                }

            });

            //loop through the values
            for (var v = 0; v < values.length; v++) {
                var pos1 = text.indexOf("{");
                var pos2 = text.indexOf("}");

                var placeholder = text.substring(pos1, pos2 + 1);
                if (placeholder==="{left}") {
                    left = values[v];
                }
                else if (placeholder==="{right}") {
                    right= values[v];
                }
                text = text.replace(placeholder, values[v]);
            }
            return {'text': text, 'left' : left, 'right' : right};

        },
        addStatement: function(node, tree, functionId) {
            for (var t=0;t<tree.children.length;t++){
                if (tree.children[t].id === functionId) {
                    for (var f = 0; f < tree.children[t].fields.length; f++) {
                        if (tree.children[t].fields[f].name === "Body") {

                            //add param
                            tree.children[t].fields[f].children.push({
                                "controlName": node.controlName,
                                "id": node.id,
                                "type": node.type,
                                "expression" :{}
                            })
                            return true;
                        }
                    }
                }
            }
            return false;

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
                        "Group": "Root"
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
                        "Id": "Identifier",
                        "Fields": [{
                            "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                            "Name": "Value",
                            "Productions": []
                        }],
                        "Productions": [{
                            "Pattern": /^[a-zA-Z]*$/,
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
                                    "Id": "Identifier",
                                    "Fields": [{
                                        "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                        "Name": "Value",
                                        "Productions": []
                                    }],
                                    "Productions": [{
                                        "Pattern": /^[a-zA-Z]*$/,
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
                    },{
                        "Id": "Validation",
                        "Fields": [{
                            "Node": {
                                "Id": "Function",
                                "Fields": [{
                                    "Node": {
                                        "Id": "Identifier",
                                        "Fields": [{
                                            "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                            "Name": "Value",
                                            "Productions": []
                                        }],
                                        "Productions": [{
                                            "Pattern": /^[a-zA-Z]*$/,
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
                                            "Id": "Identifier",
                                            "Fields": [{
                                                "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                "Name": "Value",
                                                "Productions": []
                                            }],
                                            "Productions": [{
                                                "Pattern": /^[a-zA-Z]*$/,
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
                                            "Id": "Identifier",
                                            "Fields": [{
                                                "Type": "System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089",
                                                "Name": "Value",
                                                "Productions": []
                                            }],
                                            "Productions": [{
                                                "Pattern": /^[a-zA-Z]*$/,
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
                            "Group": "Statements"
                            //"ProductionType": 2
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
                                "Pattern": /^d+$/,
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
        getTableReference : function(refId, functionId) {

            var tree = this.getUITree();
            if (tree.table) {
                for (var x = 0; x < tree.table.length; x++) {
                    if (tree.table[x].ref === refId) {
                        if (!tree.table[x].functionId) {
                            return tree.table[x];
                            break;
                        }
                        else if (tree.table[x].functionId === functionId){
                            return tree.table[x];
                            break;
                        }
                    }
                }

                return undefined;
            }

        },
        getTableVarsInScope : function(functionId, tree) {
            var vars = [];

            if (tree.table) {
                for (var x = 0; x < tree.table.length; x++) {
                    if (tree.table[x].functionId === functionId || !tree.table[x].functionId) {
                        vars.push({"name": tree.table[x].name, "ref": tree.table[x].ref});
                    }
                }
                return vars;
            }

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
        getUITree: function(cb) {
            return this.getUITreeEmpty();
        },

        getUITreeComplex : function(cb) {

            var uiTree = {
                "id": "Program-1", //will be root
                "type": "Program",
                "controlName": "Program",
                "table": [{
                    "ref": 0,
                    "name": "it"
                },{
                    "ref": 12345,
                    "value": "truth",
                    "name": "active",
                    "functionId" : "Function-1"
                },{
                    "ref": 23456,
                    "value": "number",
                    "name": "age",
                    "functionId" : "Function-1"
                },{
                    "ref": 45678,
                    "value": "text",
                    "name": "FirstName",
                    "functionId" : "Function-1"
                },{
                    "ref": 12345,
                    "value": "truth",
                    "name": "active",
                    "functionId" : "Function-2"
                },{
                    "ref": 23456,
                    "value": "number",
                    "name": "age",
                    "functionId" : "Function-2"
                },{
                    "ref": 45678,
                    "value": "text",
                    "name": "FirstName",
                    "functionId" : "Function-2"
                }],
                "children": [{
                    "id": "Function-1",
                    "type": "Function",
                    "controlName": "Function",
                    "fields": [{
                        "name": "Name",
                        "value": "test"
                    }, {
                        "name": "ReturnType",
                        "value": "truth"
                    }, {
                        "name": "Parameters",
                        "children": [{
                            "ref": 12345,
                            "type": "ParameterNode",
                            "controlName": "Parameternode"
                        },{
                            "ref": 45678,
                            "type": "ParameterNode",
                            "controlName": "Parameternode"
                        },{
                            "ref": 23456,
                            "type": "ParameterNode",
                            "controlName": "Parameternode"
                        }]
                    }, {
                        "name": "Body",
                        "children": [{
                            "type": "ReturnStatement",
                            "id" : "12345",
                            "controlName": "Returnstatement",
                            "expression": {
                                "id": "54321",
                                "type": "EqualToExpression",
                                "left": {
                                    "type": "left",
                                    "expression": {
                                        "id": "98765",
                                        "type": "EqualToExpression",
                                        "left": {
                                            "type": "left",
                                            "expression": {
                                                "id": "11221",
                                                "type": "SimpleVariableReferenceNode",
                                                "ref": 23456
                                                }
                                        },
                                        "right": {
                                            "type": "IntegerLiteral",
                                            "value": 10,
                                            "expression": {}
                                        }
                                    }
                                },
                                "right": {
                                    "type": "IntegerLiteral",
                                    "value": 36,
                                    "expression": {}
                                }
                            }
                        }]
                    }]
                },{
                    "id": "Function-2",
                    "type": "Function",
                    "controlName": "Function",
                    "fields": [{
                        "name": "Name",
                        "value": "test"
                    }, {
                        "name": "ReturnType",
                        "value": "truth"
                    }, {
                        "name": "Parameters",
                        "children": [{
                            "ref": 12345,
                            "type": "ParameterNode",
                            "controlName": "Parameternode"
                        },{
                            "ref": 45678,
                            "type": "ParameterNode",
                            "controlName": "Parameternode"
                        },{
                            "ref": 23456,
                            "type": "ParameterNode",
                            "controlName": "Parameternode"
                        }]
                    }, {
                        "name": "Body",
                        "children": [{
                            "type": "ReturnStatement",
                            "id": "12345",
                            "controlName": "Returnstatement",
                            "expression": {
                                "id": "35423",
                                "type": "EqualToExpression",
                                "left": {
                                    "type": "left",
                                    "expression": {
                                        "id": 98768,
                                        "type" : "SimpleVariableReferenceNode",
                                        "ref": 23456
                                    }
                                },
                                "right": {
                                    "type": "IntegerLiteral",
                                    "value": 36,
                                    "expression": {}
                                }
                            }
                        }]
                    }]
                }]
            };

            return uiTree;
        },
        getUITreeBasic: function() {

            var uiTree = {
                "id": "Program-1", //will be root
                "type": "Program",
                "controlName": "Program",
                "table": [{
                    "ref": "0",
                    "name": "it"
                },{
                    "ref": "12345",
                    "value": "truth",
                    "name": "active",
                    "functionId" : "Function-1"
                },{
                    "ref": "23456",
                    "value": "number",
                    "name": "age",
                    "functionId" : "Function-1"
                },{
                    "ref": "45678",
                    "value": "text",
                    "name": "FirstName",
                    "functionId" : "Function-1"
                },{
                    "ref": "12345",
                    "value": "truth",
                    "name": "active",
                    "functionId" : "Function-2"
                },{
                    "ref": "23456",
                    "value": "number",
                    "name": "age",
                    "functionId" : "Function-2"
                },{
                    "ref": "45678",
                    "value": "text",
                    "name": "FirstName",
                    "functionId" : "Function-2"
                }],
                "children": [{
                    "id": "Function-1",
                    "type": "Function",
                    "controlName": "Function",
                    "fields": [{
                        "name": "Name",
                        "value": "test"
                    }, {
                        "name": "ReturnType",
                        "value": "truth"
                    }, {
                        "name": "Parameters",
                        "children": [{
                            "ref": "12345",
                            "type": "ParameterNode",
                            "controlName": "Parameternode"
                        },{
                            "ref": "45678",
                            "type": "ParameterNode",
                            "controlName": "Parameternode"
                        },{
                            "ref": "23456",
                            "type": "ParameterNode",
                            "controlName": "Parameternode"
                        }]
                    }, {
                        "name": "Body",
                        "children": [{
                            "type": "ReturnStatement",
                            "id" : "12345",
                            "controlName": "Returnstatement",
                            "expression": {
                                "id": "54321",
                                "type": "EqualToExpression",
                                "left": {
                                    "type": "left",
                                    "expression": {
                                        "id": "11221",
                                        "type": "SimpleVariableReferenceNode",
                                        "ref": "23456"
                                    }
                                },
                                "right": {
                                    "type": "IntegerLiteral",
                                    "value": "36",
                                    "expression": {}
                                }
                            }
                        }]
                    }]
                },{
                    "id": "Function-2",
                    "type": "Function",
                    "controlName": "Function",
                    "fields": [{
                        "name": "Name",
                        "value": "test"
                    }, {
                        "name": "ReturnType",
                        "value": "truth"
                    }, {
                        "name": "Parameters",
                        "children": [{
                            "ref": "12345",
                            "type": "ParameterNode",
                            "controlName": "Parameternode"
                        },{
                            "ref": "45678",
                            "type": "ParameterNode",
                            "controlName": "Parameternode"
                        },{
                            "ref": "23456",
                            "type": "ParameterNode",
                            "controlName": "Parameternode"
                        }]
                    }, {
                        "name": "Body",
                        "children": [{
                            "type": "ReturnStatement",
                            "id": "12345",
                            "controlName": "Returnstatement",
                            "expression": {
                                "id": "35423",
                                "type": "EqualToExpression",
                                "left": {
                                    "type": "IntegerLiteral",
                                    "value": "36",
                                    "expression": {}
                                },"right": {
                                    "type": "right",
                                    "expression": {
                                        "id": "98768",
                                        "type" : "SimpleVariableReferenceNode",
                                        "ref": "23456"
                                    }
                                }
                            }
                        }]
                    }]
                }]
            };

            return uiTree;
        },
        getUITreeEmpty : function(){
            return {
                "id": "Program-1",
                "type": "Program",
                "controlName": "Program",
                "table": [{
                    "ref": "0",
                    "name": "it"
                }],
                "children": []
            };
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