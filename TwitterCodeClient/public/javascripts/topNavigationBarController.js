
var app =  angular.module('homePageApp',[]);

app.controller('searchController',function($scope,$http) {

    $scope.searchHash =function () {
        $http({
            method: "POST",
            data: {
                "search": $scope.search
            },
            url: "/checkSearchType"
        }).success(function (data)
        {
            window.location.assign("/goToHashPage");
        });
    }
});
