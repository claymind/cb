'use strict'

rulesBuilderApp.directive('nodeThumbnail', ["$sce", "validationService", "$filter", "$compile", function($sce, validationService, $filter, $compile){
    var json;
    var dragSrcEl;

    return {
        restrict: 'A',
        link: function(scope, element, attrs){

            element.find(".draggable").on('dragstart', null, {'scope' : scope}, function(e){
                this.style.opacity = '0.4';
                dragSrcEl = this;

                e.originalEvent.dataTransfer.effectAllowed = 'move';
                e.originalEvent.dataTransfer.setData('text', JSON.stringify(
                    {"type": scope.nodeItem["Id"]}));
            });

            element.find(".draggable").on('dragend', null, {'scope' : scope}, function(e){
                this.style.opacity = '1';
                $(this).parent().removeClass('over');
            });
        }
    };
}]);

