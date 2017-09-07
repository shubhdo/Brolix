'use strict';

angular.module('myApp').service('dataService', function ($q, $http) {


    var baseUrl='http://localhost:3000/';
    var self = this;

    self.getUsers=function () {
        return httpCall('GET',baseUrl+"getUsers");
    }

    self.blockUser=function (data) {
        console.log("999999999",data)
        return httpCall('POST',baseUrl+"blockUser",data)
    }
    function httpCall(method, url, data) {
        return $q(function (resolve, reject) {
            $http({
                method: method,
                url: url,
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }

            }).then(function successCallback(response) {
                console.log(response);
                resolve(response)
            }, function errorCallback(response) {
                console.log(response)
                reject(response)
            });

        })
    }


});
