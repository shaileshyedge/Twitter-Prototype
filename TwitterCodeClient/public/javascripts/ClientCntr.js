var app =  angular.module('homeLoginPage',[]);
app.controller('controlhome',function($scope,$http){
    $scope.cred = true;
    $scope.clickLogin =function (){
        var name = $scope.name;
        var password = $scope.password;
        $http({
            method : "POST",
            data :{
                "username" : name,
                "password" : password
            },
            url : '/authenticate'
        }).success(function (data) {
            if(data.statusCode == 200)
            {
                window.location.assign("/homePage");
            }
            else
            {
                $scope.cred = false;
            }
        });
    }

});

