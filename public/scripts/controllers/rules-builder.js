'use strict';

rulesBuilderApp.controller('RulesBuilderCtrl',
    function($scope, $routeParams, validationService, $modal, $location, $filter) {
        $scope.nodeBlocks = [];
        $scope.canvasBlockList = [];
        $scope.returnTypes = ['Truth', 'Number', 'Text'];

        $scope.isValidNode = function(source, target) {
            var sourceNode = source;
            var targetNode = target;
        };

        $scope.nodeBlocks = validationService.getNodeBlocks();
    });

