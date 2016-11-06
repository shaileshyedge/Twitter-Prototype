
var app =  angular.module('UserSearch',[]);
app.controller('UserSearchCntr',function($scope,$http){

    $scope.visible = false;

    $http({

        method : "GET",
        url : "/fetchToFollow"
    }).success( function (data) {
        $scope.data = data;
    });

    $scope.follow = function (handle){

        $http({

            method : "POST",
            data : {
                "followingHandle" : handle
            },
            url : "/FollowMe"

        }).success( function (data) {
            $scope.data = data;
        });
    }


});
