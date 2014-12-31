'use strict';

rulesBuilderApp.controller('RulesBuilderCtrl',
    function($scope, $routeParams, validationService, $modal, $location, $filter) {
        $scope.nodes = [];
        $scope.uiTree = {};
        $scope.returnTypes = ['Truth', 'Number', 'Text'];
        $scope.isEditMode = false;
        $scope.modeCaption = "Switch to Edit Mode";

        $scope.toggleDisplayMode = function() {
            $scope.isEditMode = !$scope.isEditMode;
        };

        $scope.$watch('isEditMode', function(newValue, oldValue) {
            if (newValue) {
                $scope.modeCaption = "Switch to Display Mode";
                $scope.$broadcast("isEditMode");
            }
            else {
                $scope.modeCaption = "Switch to Edit Mode";
                $scope.$broadcast("isDisplayMode");
            }
        });

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

