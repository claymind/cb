'use strict';

rulesBuilderApp.controller('RulesBuilderCtrl',
    ["$scope", "$routeParams", "validationService", "$location", "$filter", "$rootScope", function($scope, $routeParams, validationService, $location, $filter, $rootScope) {
        $scope.nodes = [];
        //$scope.uiTree = {};
        //$scope.isEditMode = false;
        $scope.modeCaption = "Switch to Edit Mode";

        $scope.toggleDisplayMode = function() {
            $scope.isEditMode = !$scope.isEditMode;

            if ($scope.isEditMode === true) {
                $scope.modeCaption = "Switch to Display Mode";
                $scope.$broadcast("isEditModeFired");
            }
            else{
                $scope.modeCaption = "Switch to Edit Mode";
                $scope.$broadcast("isDisplayModeFired");
            }
        };

        $scope.saveProgram = function() {
            $scope.uiTree = angular.copy(validationService.tempTree);
            //call service
        };


        //$scope.$watch('isEditMode', function(newValue, oldValue) {
        //    if (newValue) {
        //        $scope.modeCaption = "Switch to Display Mode";
        //        $scope.$broadcast("isEditModeFired");
        //    }
        //    else {
        //        $scope.modeCaption = "Switch to Edit Mode";
        //        $scope.$broadcast("isDisplayModeFired");
        //    }
        //});

        //$scope.isValidNode = function(source, target) {
        //    var sourceNode = source;
        //    var targetNode = target;
        //};

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
            return angular.equals(validationService.tempTree, $scope.uiTree);
        };
        $scope.resetProgram = function() {
            $scope.uiTree = validationService.getUITree();

            validationService.tempTree = angular.copy($scope.uiTree);

            //add entity vars to table
            var entityVars = validationService.getSyntaxTree().entity;

            var newRef;
            for(var e=0;e<entityVars.length;e++){
                var keys = Object.keys(entityVars[e]);

                var name = "";
                for (var k=0;k<keys.length;k++) {
                    if (keys[k] !== "type"){
                        name = keys[k];
                    }

                }
                newRef = {
                    "ref" : "0-" + uuid.v1(),
                    "value" :entityVars[e].type,
                    "name": name
                } ;

                validationService.tempTree.table.push(newRef);
                $scope.tempTree = validationService.tempTree;
            }


        };


        $scope.resetProgram();
    }]);

