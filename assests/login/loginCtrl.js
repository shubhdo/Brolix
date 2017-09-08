'use strict';

angular.module('myApp').controller('loginCtrl', ['$scope','dataService','$location',function (scope,dataService,location) {
scope.myStyle={"display":"none"};
    scope.loginForm = function (login) {


        dataService.login(scope.obj3)
            .then(function (response) {
                if (response.status===200) {
                    dataService.name=response.data.result.name;
                    dataService.telephone_no=response.data.result.telephone_no;
                    scope.myStyle={"display":"block"};
                    console.log("9999999999",response)
                    console.log("3333333333",scope.myStyle);
                    location.path('/users');
                    alert('You have successfully Logged In');
                }
                else {
                    alert(response.data.error)
                }
            })
            .catch(function (err) {
                console.log(err)
                alert(err.data.error)
                location.path('/addCompany');

            });
        console.log(scope.obj3);
        scope.obj3 = {};
        scope.login.$setPristine(true);
    }
}]);