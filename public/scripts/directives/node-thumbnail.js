'use strict'

rulesBuilderApp.directive('blockThumbnail', function($sce, $modal, validationService, $filter, $compile){
    var modalInstance;
    var json;
    var dragSrcEl;

    return {
        restrict: 'A',
        //templateUrl: '/partials/block-thumbnail',
        link: function(scope, element, attrs){
            scope.name=attrs.name;

            //scope.onNameChange = function() {
            //    scope.name = element.val();
            //};

            scope.onReturnTypeChange = function() {
                //this = current list item
            };

            scope.getReturnTypes = function(){
                return ['Number', 'String', 'Boolean'];
            };

            element.find('.toggle-collapse').on('click', null, {'scope': scope}, function(e) {
                //minimize or show
                scope.$apply(function(){
                    $(e.currentTarget).toggleClass( "glyphicon-chevron-up glyphicon-chevron-down");
                    scope.listItem.isCollapsed = !scope.listItem.isCollapsed;
                });
            });

            element.find('.glyphicon-remove-circle').on('click', null, {'scope': scope}, function(e) {
                //remove the item from the list

                scope.$apply(function(){
                    scope.$parent.deleteListItem(scope.$parent.$index);
                });
            });

            element.find(".draggable").on('dragstart', null, {'scope' : scope}, function(e){
                this.style.opacity = '0.4';
                dragSrcEl = this;

                e.originalEvent.dataTransfer.effectAllowed = 'move';
                e.originalEvent.dataTransfer.setData('text', JSON.stringify(
                    {"type": scope.nodeBlock._id}));
            });

            element.find(".draggable").on('dragend', null, {'scope' : scope}, function(e){
                this.style.opacity = '1';
                $(this).parent().removeClass('over');
            });
        }
    };
});

