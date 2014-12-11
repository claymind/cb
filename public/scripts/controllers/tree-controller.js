'use strict';

rulesBuilderApp.controller("TreeController", function($scope,  validationService) {
        //$scope.treeFamily = {
        //    name : "Parent",
        //    children: [{
        //        name : "Child1",
        //        children: [{
        //            name : "Grandchild1",
        //            children: []
        //        },{
        //            name : "Grandchild2",
        //            children: []
        //        },{
        //            name : "Grandchild3",
        //            children: []
        //        }]
        //    }, {
        //        name: "Child2",
        //        children: []
        //    }]
        //};
    $scope.treeFamily = validationService.getAstTree();
    });
