'use strict';

rulesBuilderApp.controller('RulesBuilderCtrl',
    function($scope, $routeParams, QueryService, UtilService, $modal, $location, $filter) {
        $scope.canvasBlockList = [];
        $scope.returnTypes = ['Truth', 'Number', 'Text'];

        //$scope.canvasSelector = ".canvas.droppable";
        //$scope.blockPlaceholderSelector = ".block.droppable";

        //
        ////get editor settings plus lists
        //$scope.getListEditorConfig = function() {
        //    return QueryService.getListEditorConfig({'action':'getlisteditorconfig'})
        //        .$promise
        //        .then(function(results){
        //            $scope.editor = results;
        //
        //            //check for query params
        //            if ($routeParams.type && $routeParams.id) {
        //                $scope.listName = $routeParams.id;
        //                $scope.getDataForList($routeParams.type, $routeParams.id);
        //            }
        //        });
        //};


        //$scope.getListEditorConfig(); //no type and id yet

    });

