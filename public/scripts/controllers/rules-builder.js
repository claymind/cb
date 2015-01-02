'use strict';

rulesBuilderApp.controller('RulesBuilderCtrl',
    function($scope, $routeParams, validationService, $modal, $location, $filter) {
        $scope.nodes = [];
        $scope.uiTree = {};
        $scope.tempTree= {};
        $scope.returnTypes = ['Truth', 'Number', 'Text'];
        $scope.isEditMode = false;
        $scope.modeCaption = "Switch to Edit Mode";

        $scope.toggleDisplayMode = function() {
            $scope.isEditMode = !$scope.isEditMode;
        };

        $scope.saveProgram = function() {
            $scope.uiTree = angular.copy($scope.tempTree);
            //persist
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

        $scope.isValidNode = function(source, target) {
            var sourceNode = source;
            var targetNode = target;
        };

        //load the left nav
        validationService.getNodes(function(err, res) {
            $scope.nodes = res;
        });


        $scope.isUnchanged = function() {
            return angular.equals($scope.tempTree, $scope.uiTree);
        };
        $scope.resetProgram = function() {
            $scope.uiTree = validationService.getUITree();
            $scope.tempTree = angular.copy($scope.uiTree);
        };


        $scope.resetProgram();
    });

