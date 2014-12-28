'use strict';

rulesBuilderApp.controller('RulesBuilderCtrl',
    function($scope, $routeParams, validationService, $modal, $location, $filter) {
        $scope.nodes = [];
        $scope.uiTree = {};
        $scope.returnTypes = ['Truth', 'Number', 'Text'];
        $scope.isEditMode = false;
        $scope.modeCaption = "Switch to Edit Mode";

        //$scope.$watch('isEditMode', function(newValue, oldValue) {
        //    if (newValue) {
        //        $scope.modeCaption = "Switch to Display Mode";
        //    }
        //    else {
        //        $scope.modeCaption = "Switch to Edit Mode";
        //    }
        //});

        //$scope.$watch('canvasNodeList', function(newValue, oldValue) {
        //    if (newValue.length === 0) {
        //        $scope.modeCaption = "Switch to Edit Mode";
        //        $scope.isEditMode = false;
        //    }
        //}, true);

        $scope.isValidNode = function(source, target) {
            var sourceNode = source;
            var targetNode = target;
        };

        //load the left nav
        validationService.getNodes(function(err, res) {
            $scope.nodes = res;
        });

        //load the canvas
        $scope.uiTree = validationService.getUITree();

    });

