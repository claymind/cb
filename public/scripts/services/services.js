'use strict';

var tools = angular.module('toolsServices', ['ngResource']);

tools.factory('QueryService',
    function($resource){
        return $resource('/api/:action', {action:'@actionvalue'}, {
            select: {method:'GET', params:{'query':'@queryvalue', 'bucket' : '@bucket'}, isArray:true},
            searchType : {method:'GET', params:{'text':'@textvalue', 'sensor' : false, 'bucket':'@bucket'}, isArray:true},
            searchDoc :{method:'GET', params:{'category' : '@typevalue', 'text':'@textvalue', 'sensor' : false, 'bucket':'@bucket'}, isArray:true},
            save: {method:'POST', params: {'action' :'@action','key': '@key', 'data':'@data', 'tags' : '@tags', 'bucket':'@bucket'}},
            delete: {method:'POST', params: {'action' :'@action','keys': '@keys', 'bucket':'@bucket'}},
            getListEditorConfig: {method:'GET', params: {'action' : '@action'}}
        });
    }
);


var util = tools.factory('UtilService', function() {
    return {
        isSystemTag: function(type) {
            if (type==='op') {
                return true;
            }
            return false;
        },
        isValidBucket: function(b){
            if (b ==='pub' || b ==='com' || b==='test') {
                return true;
            }
            return false;
        },
        isNullOrEmpty: function(val){
            if (val === null || val === "null") {
                return true;
            }

            return false;
        },
        getRelativeUrl : function(url){
            if (url) {
                return url.replace(/^.+(?=\/images\/)/, '');
            }
        }
    };
});
