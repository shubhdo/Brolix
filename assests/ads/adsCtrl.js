app.controller('adsCtrl',function (dataService,$location,$scope,$document) {
   /* if (dataService.name===null) {
        $location.path('/login')
    }*/
    dataService.getTotalAds().then(function (response) {
        console.log(response)
        $scope.total_ads=response.data.response[0].count;
        console.log($scope.total_ads);

    }).catch(function (response) {
        console.log(response)
    })

    dataService.getActiveAds().then(function (response) {
        console.log(response)
        $scope.active_ads=response.data.response[0].count;
        console.log($scope.active_ads);


    }).catch(function (response) {
        console.log(response)
    })

    dataService.getExpiredAds().then(function (response) {
        console.log(response)
        $scope.expired_ads=response.data.response[0].count;
        console.log($scope.expired_ads);

    }).catch(function (response) {
        console.log(response)
    })




    var saveData=null;
    $scope.editAds=function (user) {
        $scope.obj=user;
        console.log(user);

    }

    $scope.saveAd=function (ad) {
        saveData=ad
    }

    $scope.add=function (data) {
        console.log("##############",data);
        dataService.editAd(data).then(function (response) {
            console.log(response);
        }).catch(function (response) {
            console.log(response);
        })
    }


    $document.ready(function () {
        getData()
    })

    function getData() {
        dataService.getAds().then(function (response) {
            console.log("called", response);
            $scope.ads = response.data.response
        }).catch(function (response) {
            console.log(response);
        })
    }

})

