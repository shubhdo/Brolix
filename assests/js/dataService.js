'use strict';

angular.module('myApp').service('dataService', function ($q, $http) {



    var baseUrl='http://localhost:3000/';
    var self = this;
    self.name=null;
    self.getUsers=function () {
        return httpCall('GET',baseUrl+"getUsers");
    };

    self.getPersonalUsersList=function () {
        return httpCall('GET',baseUrl+"getUsers?personal=1")
    }

    self.getBusinessUsersList=function () {
        return httpCall('GET',baseUrl+"getUsers?business=1")
    }

    self.getBlockedUserList=function () {
        return httpCall('GET',baseUrl+"getUsers?blocked=1")
    }
    self.blockUser=function (data) {
        console.log("999999999",data)
        return httpCall('POST',baseUrl+"blockUser",data)
    };

    self.blockPage=function (data) {
      return httpCall('POST',baseUrl+"blockPage",data);
    };

    self.editPage=function (data) {
        return httpCall('PUT',baseUrl+"editPage",data);
    }

    self.editAd=function (data) {
        return httpCall('PUT',baseUrl+"editAds",data)
    }

    self.getCountries=function () {
        return httpCall('GET',baseUrl+"getCountries");
    };

    self.getStates=function (country) {
        return httpCall('GET',baseUrl+"getStates?country="+country);
    };

    self.editUser=function (data) {
        return httpCall('PUT',baseUrl+"editUser",data)
    };

    self.addUser=function (data) {
        return httpCall('POST',baseUrl+"addUser",data);
    };

    self.getPersonalUsers=function () {
        return httpCall('GET',baseUrl+"getUserData?personal=1");
    };

    self.getBusinessUsers=function () {
        return httpCall('GET',baseUrl+"getUserData?business=1");
    };

    self.getTotalUsers=function () {
        return httpCall('GET',baseUrl+"getUserData");
    };

    self.getBLockedUsers=function () {
        return httpCall('GET',baseUrl+"getUserData?blocked=1");
    };

    self.login=function (data) {
        return httpCall('POST',baseUrl+"login",data);
    }

    self.getTotalWinners=function () {
        return httpCall('GET',baseUrl+"getWinnersData");
    };

    self.getCashWinners=function () {
        return httpCall('GET',baseUrl+"getWinnersData?cash=1");
    };

    self.getCouponWinners=function () {
        return httpCall('GET',baseUrl+"getWinnersData?coupon=1");
    };

    self.getTotalPages=function () {
        return httpCall('GET',baseUrl+"getPagesData")
    }

    self.getRemovedPages=function () {
        return httpCall('GET',baseUrl+"getPagesData?removePages=1")
    }

    self.getBlockedPages=function () {
        return httpCall('GET',baseUrl+"getPagesData?blockPages=1")
    }

    self.getUnpublishedPages=function () {
        return httpCall('GET',baseUrl+"getPagesData?unpublishedPages=1")
    }

    self.getTotalAds=function () {
        return httpCall('GET',baseUrl+"getAdsData")
    }

    self.getActiveAds=function () {
        return httpCall('GET',baseUrl+"getAdsData?active=1")
    }

    self.getExpiredAds=function () {
        return httpCall('GET',baseUrl+"getAdsData?expired=1")
    }

    self.getPages=function () {
        return httpCall('GET',baseUrl+"getPages");
    }

    self.getUnpublishedPage=function () {
        return httpCall('GET',baseUrl+"getPages?unpublished=1");
    }

    self.getBlockedPage=function () {
        return httpCall('GET',baseUrl+"getPages?blocked=1");
    }

    self.getRemovedPage=function () {
        return httpCall('GET',baseUrl+"getPages?removed=1");
    }


    self.getAds=function () {
        return httpCall('GET',baseUrl+"getAds");
    }

    self.getActiveAd=function () {
        return httpCall('GET',baseUrl+"getAds?active=1");
    }

    self.getExpiredAd=function () {
        return httpCall('GET',baseUrl+"getAds?expired=1");
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
