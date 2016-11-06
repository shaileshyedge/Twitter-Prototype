var app =  angular.module('profileapp',[]);
app.controller('profilecntr',function($scope,$http)
{

        $http({
            method : "GET",
            url : '/fetchfollow'
        }).success(function (follow)
        {
            $scope.follow = follow;
            alert(follow[0].twitter_handle);

        });



        $http({
            method : "GET",
            url : '/fetchfollower'
        }).success(function (follower)
        {
            $scope.follower = follower;
        });

    $http({
        method : "GET",
        url : '/fetchProfile'
    }).success(function (profile)
    {
        $scope.profile = profile;
        alert(profile.fname);

    });


});
