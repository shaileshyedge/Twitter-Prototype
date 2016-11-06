
var app =  angular.module('signUp',[]);
app.controller('signUpCntr',function($scope,$http){

    $scope.credentials = true;
    $scope.emailCredentials = true;
    $scope.clickSignUp =function (){
        var fname = $scope.fname;
        var lname = $scope.lname;
        var email = $scope.email;
        var password = $scope.password;
        var date = $scope.date;
        var handle = $scope.handle;
        var location = $scope.location;
        $http({
            method : "POST",
            data :{
                "firstName" : fname,
                "lastName" : lname,
                "email" : email,
                "password" : password,
                "dateOfBirth" : date,
                "handle" : handle,
                "location" : location
            },
            url : "/performSignUp"
        }).success(function (data) {
            if(data.statusCode == 200)
            {
                alert("YOU ARE SIGNED UP.LOGIN TO CONTINUE");
                window.location.assign("/homePage");
            }
            else if(data.statusCode ==401)
            {
                $scope.credentials = false;
            }
            else
            {
                $scope.credentials = true;
                $scope.emailCredentials = false;
            }
        });
    }

});
