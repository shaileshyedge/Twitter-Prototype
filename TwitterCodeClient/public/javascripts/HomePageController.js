

var app =  angular.module('homePageApp',[]);
app.controller('HomePageController',function($scope,$http){

    $http({

        method : "GET",
        url : "/getTweets"
    }).success(function (data) {
        $scope.data = data;
    });


    $scope.insertTweet =function () {
        var tweetValue = $scope.tweetValue;

        $http({

            method: "POST",
            data: {
                "tweetValue": tweetValue
            },
            url: '/putTweet'
        }).success(function (data) {
            $scope.data = data;
        });
    }

    $scope.retweet = function (tweet_id)
    {
        $http({

            method : "POST",
            data : {
                "tweet_id" : tweet_id
            },
            url : "/putRetweet"

        }).success( function (data) {
            $scope.data = data;
        });
    }


});


app.controller('profile',function($scope,$http){

    $http({

        method : "GET",
        url : "/fetchUserDtls"
    }).success(function (result) {
        $scope.result = result;
    });

});


app.controller('searchController',function($scope,$http) {

    $scope.searchHash =function () {
        $http({
            method: "POST",
            data: {
                "search": $scope.search
            },
            url: "/checkSearchType"
        }).success(function (data) {
            if(data.statusCode == 1)
            {
                window.location.assign('/goToHashPage');
            }
            else if(data.statusCode == 2 || data.statusCode == 3)
            {
                window.location.assign('/UserSearchLogic');
            }
        });
    }
});
