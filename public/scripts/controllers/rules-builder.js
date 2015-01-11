'use strict';

rulesBuilderApp.controller('RulesBuilderCtrl',
    ["$scope", "$routeParams", "validationService", "$location", "$filter", "$rootScope", function($scope, $routeParams, validationService, $location, $filter, $rootScope) {
        $scope.nodes = [];
        $scope.uiTree = {};
        //$scope.tempTree= {};
        //$scope.returnTypes = ['Truth', 'Number', 'Text'];
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
            var nodes = res;
            var caption;
            $scope.nodeThumbnails = [];

            for (var n=0;n<nodes.length;n++) {
                nodes[n].caption = nodes[n].Id.replace(/([A-Z])/g, ' $1');
                $scope.nodeThumbnails.push(nodes[n]);
            }
        });


        $scope.isUnchanged = function() {
            return angular.equals($scope.tempTree, $scope.uiTree);
        };
        $scope.resetProgram = function() {
            $scope.uiTree = validationService.getUITree();
            $rootScope.tempTree = angular.copy($scope.uiTree);

        };


        $scope.resetProgram();
    }]);

