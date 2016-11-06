
var app =  angular.module('hashPageControl',[]);
app.controller('HashPageControl',function($scope,$http){

    $http({

        method : "GET",
        url : "/fetchHashTags"
    }).success( function (data) {
       $scope.data = data;
    });


});



