'use strict';

rulesBuilderApp.controller('ModalInstanceCtrl',
    function($scope, $modalInstance, context) {
        $scope.ok = function () {
            $modalInstance.close(context);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss(context);
        };
    });

