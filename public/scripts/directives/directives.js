'use strict'

toolsApp.directive('listitem', function($sce, $modal, QueryService, UtilService, $filter){
    var modalInstance;
    var json;
    var dragSrcEl;

    return {
        restrict: 'A',
        templateUrl: '/partials/list-item',
        scope: {
            listItem: '=item',
            doc: '=doc',
            settings: '=settings'
        },
        link: function(scope, element, attrs){

            scope.onTypeChange = function() {
                //this = current list item
                this.listItem.name=null;
                this.listItem.id = null;
                this.listItem.image = {};
                this.listItem.origImage = {};
                this.listItem.title= null;
                this.listItem.origTitle=null;
                this.listItem.subTitle=null;
                this.listItem.origSubTitle=null;
                this.listItem.url=null;
                this.listItem.author = null;
            };

            //for hardcoded list names
            scope.getTypeLabel = function(listItem) {
                if (listItem === 'gallery.photo') {
                    return 'Photo Gallery';
                }

                if (listItem === 'gallery.video') {
                    return 'Video Gallery';
                }

                return listItem.charAt(0).toUpperCase() + listItem.slice(1)
            };

            scope.getThumbnail = function(url) {
                return "http://images.fandango.com/ImageRenderer/50/50/redesign/static/img/default_poster.png/0/" + UtilService.getRelativeUrl(url);
            };

            if (scope.settings) {
                var draggable = element.find(".grip-bar");
                if (scope.settings.isDraggable) {
                    draggable.addClass("draggable");
                    draggable.attr("draggable", true);
                }
                else {
                    draggable.removeClass("draggable");
                    draggable.attr("draggable", false);
                }
            }

            //watch the author field for Item type. This is for validation
            scope.$watch('listItem.author', function(newValue, oldValue) {
                if (!scope.listItem.name) { //this is an Item type
                    if (newValue === '' || newValue === undefined) {

                        scope.$parent.itemForm.itemAuthor.$setValidity('listError', true);
                        scope.$parent.itemForm.itemAuthor.$setPristine();

                    }
                }
            });

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

            element.find('.author.preview').on('click', null, {'scope' : scope}, function(e){
                //query the author
                var id = scope.listItem.author;
                var query = {"author" : id};

                QueryService.select({'action' : 'select', 'query' : query, 'bucket' : scope.doc.bucket})
                    .$promise
                    .then(function(results){
                        if (results[0] && results[0].key) {
                            var id = results[0].key.id;
                            var name = results[0].name;
                            var desc = results[0].descriptionFunny;
                            var image = results[0].image && results[0].image.uri;

                            modalInstance = $modal.open({
                                template: '<div class="modal-header">' +
                                    '<h3>' + id + '</h3>' +
                                    '</div>' +
                                    '<div class="modal-body row">' +
                                    '<div class="col-sm-2">' +
                                    '<img ng-src="' + image + '" />' +
                                    '</div>' +
                                    '<div class="col-sm-10">' +
                                    '<p>' + name + '</p>' +
                                    '<p>' + desc + '</p>' +
                                    '<p>' + image + '</p>' +
                                    '</div>' +
                                    '</div>' +
                                    '<div class="modal-footer">' +
                                        '<button class="btn btn-primary" ng-click="$dismiss()">OK</button>' +
                                    '</div>'
                            });
                        }
                        else { //invalid author data
                            modalInstance = $modal.open({
                                template: '<div class="modal-header">' +
                                    '<h3></h3>' +
                                    '</div>' +
                                    '<div class="modal-body">Author not found.</div>' +
                                    '<div class="modal-footer">' +
                                        '<button class="btn btn-primary" ng-click="$dismiss()">OK</button>' +
                                    '</div>'
                            });
                        }
                    });
            });

            element.find('.image-url.preview').on('click', null, {'scope' : scope}, function(e){
                var image = $(e.currentTarget).closest(".form-group").find(".form-control.item-image-url").val();

                image = 'http://images.fandango.com/ImageRenderer/400/400/redesign/static/img/default_poster.png/0/' + UtilService.getRelativeUrl(image);

                if (image!== '') {
                    window.open(image, "_blank", "height=600px, width=800px, scrollbars=yes");
                }

            });

            element.find('.image-url-thumbnail').on('click', null, {'scope' : scope}, function(e){
                var image = $(e.currentTarget).closest(".form-group").find(".form-control.item-image-url").val();

                image = 'http://images.fandango.com/ImageRenderer/400/400/redesign/static/img/default_poster.png/0/' + UtilService.getRelativeUrl(image);

                if (image!== '') {
                    window.open(image, "_blank", "height=600px, width=800px, scrollbars=yes");
                }

            });

            element.find('.item-url.preview').on('click', null, {'scope' : scope}, function(e){
                var url = $(e.currentTarget).closest(".form-group").find(".form-control.item-url").val();

                if (url !== '') {
                    window.open(url, "_blank", "height=600px, width=800px, scrollbars=yes");
                }
            });

            element.find(".draggable").on('dragstart', null, {'scope' : scope}, function(e){
                this.style.opacity = '0.4';
                dragSrcEl = this;

                e.originalEvent.dataTransfer.effectAllowed = 'move';
                e.originalEvent.dataTransfer.setData('text/html', $(this).closest("li").html());
            });

            element.find(".draggable").on('dragend', null, {'scope' : scope}, function(e){
                this.style.opacity = '1';
                $(this).parent().removeClass('over');
            });

            element.find(".droppable").on('dragover', null, {'scope' :scope}, function(e){
                if (e.preventDefault) {
                    e.preventDefault(); // Necessary. Allows us to drop.
                }

                e.originalEvent.dataTransfer.dropEffect = 'move';

                return false;
            });

            element.find(".droppable").on('dragenter', null, {'scope' :scope}, function(e){
                // this / e.target is the current hover target.
                $(this).addClass('over');
                $(this).css("height", $(dragSrcEl).height());
            });

            element.find(".droppable").on('dragleave', null, {'scope' :scope}, function(e){
                $(this).removeClass('over');  // this / e.target is previous target element.
                $(this).css("height", "2px");
            });

            element.find(".droppable").on('drop', null, {'scope' :scope}, function(e){
                // this/e.target is current target element.

                if (e.stopPropagation) {
                    e.stopPropagation(); // Stops some browsers from redirecting.
                }

                // Don't do anything if dropping the same column we're dragging. 'this' is the target (droppable)
                if (dragSrcEl != this) {
                    var srcListItem = $(dragSrcEl).closest("li");
                    if ($(this).closest("li").hasClass("last")) {   //means item was dragged to very last
                        $(this).closest("li").after(srcListItem);
                    }
                    else {
                        $(this).closest("li").before(srcListItem);
                    }

                    $(this).find('meta').remove(); //strip out meta tags created by the transfer

                    //copy the modified list including its hashkeys to a new object.  stringify is the only way to preserve the hashkeys.
                    var output = JSON.stringify(scope.doc.list);
                    var list = angular.fromJson(output);

                    var tempList = $(".draggable");
                    for (var t=0; t < tempList.length; t++) {
                        var id = $(tempList[t]).parent().find("ul").attr("id");

                        for (var l=0; l < list.length; l++) {
                            //check whether this item hashkey is the same as the html element's id.
                            if (list[l].$$hashKey === id) {
                                list[l].order = t + 1;
                                break;
                            }
                        }
                    }

                    //remove hashkey
                    for (var x=0;x<list.length;x++) {
                        delete list[x].$$hashKey;
                    }

                    scope.$apply(function() {
                        scope.doc.list = list;
                        //sort the list items according to order
                        var sortedArray = $filter('orderBy')(scope.doc.list, '+order');

                        angular.forEach(sortedArray, function(value, key){
                            sortedArray[key].order = key + 1;
                        });

                        scope.doc.list = sortedArray;
                    });
                }

                return false;
            });
       }
    };
});


var INTEGER_REGEXP = /^\-?\d+$/;
toolsApp.directive('integer', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(viewValue) {
                if (INTEGER_REGEXP.test(viewValue)) {
                    // it is valid
                    ctrl.$setValidity('integer', true);
                    return viewValue;
                } else {
                    // it is invalid, return undefined (no model update)
                    ctrl.$setValidity('integer', false);
                    return undefined;
                }
            });
        }
    };
});

toolsApp.directive('modalWindow', function($location){
    return {
        restrict: 'EA',
        link: function(scope, element) {
            var editTagsBtn = element.find(".edit-tags-btn");
             if (editTagsBtn.length > 0){
                 editTagsBtn.on("click", null, {scope: scope}, function(){
                     var type = $(this).data().type;
                     var id = $(this).data().id;
                     $location.path("/edit-doc/" + type + "/" + id);
                     scope.$dismiss();
                 });
             }
        }
    }
});
