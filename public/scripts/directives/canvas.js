'use strict'

rulesBuilderApp.directive("rbCanvas", function($compile) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs ) {
            element.on('dragover', null, {'scope' :scope}, function(e){
                if (e.preventDefault) {
                    e.preventDefault(); // Necessary. Allows us to drop.
                }

                e.originalEvent.dataTransfer.dropEffect = 'move';

                return false;
            });

            element.on('dragenter', null, {'scope' :scope}, function(e){
                // this / e.target is the current hover target.
                $(this).addClass('over');
                //$(this).css("height", $(dragSrcEl).height());
            });

            element.on('dragleave', null, {'scope' :scope}, function(e){
                $(this).removeClass('over');  // this / e.target is previous target element.
                //$(this).css("height", "2px");
            });

            element.on('drop', null, {'scope' :scope}, function(e){
                // this/e.target is current target element.

                if (e.stopPropagation) {
                    e.stopPropagation(); // Stops some browsers from redirecting.
                }

                var transferredData = JSON.parse(e.originalEvent.dataTransfer.getData('blocktype'));
                if (transferredData) {
                    if ($(e.currentTarget).hasClass('canvas') && transferredData.type === 'Function') {
                        scope.$apply(function () {
                            var node = JSON.parse(e.originalEvent.dataTransfer.getData('blocktype'));
                            if (node) {
                                //validate block

                                scope.canvasBlockList.push({"id" : node.type, "controlName": 'rb-' + node.type.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()});

                            }
                        });
                    }
                }

                $(this).removeClass('over');
                return false;
                //if (scope.canvasBlockList.length === 0) {

                //}
            });

            //scope.$watch('canvasBlockList', function() {
            //    var x = 1;
            //});
            //if(blockPlaceHolder && blockPlaceHolder.length > 0) {
            //    blockPlaceHolder.on('drop', null, {'scope': scope}, function (e) {
            //        // this/e.target is current target element.
            //
            //        if (e.stopPropagation) {
            //            e.stopPropagation(); // Stops some browsers from redirecting.
            //        }
            //
            //        //this thumbnail can either be dropped initially on the canvas or on top/bottom of other blocks
            //
            //        //var list = canvas.find("li");
            //        //if (list.length === 0) {
            //        //    scope.$apply(function () {
            //        //        scope.$parent.blockList.push({"blockType": attrs.type});
            //        //        canvas.removeClass("droppable");
            //        //    });
            //        //}
            //
            //        return false;
            //    });
            //}
        }
    }
});