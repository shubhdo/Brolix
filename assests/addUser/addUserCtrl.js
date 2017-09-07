app.controller('addUserCtrl',function ($scope,dataService) {

    $scope.add=function (data) {
        dataService.addUser(data).then(function (response) {
            console.log(response.data.response)
            if (response.data.responseCode===200) {
                alert("Successfully Added")
            }
            else {
                alert(response.message)
            }
        })
            .catch(function (response) {
                console.log(response);
                alert(response.message)
            })

    }

    $scope.getData=function () {
        dataService.getCountries()
            .then(function (response) {
                $scope.country=response.data.response;
            })
            .catch(function (err) {
                console.log(err);
            })
    };

    $scope.getStates=function () {
        dataService.getStates($scope.obj.country)
            .then(function (response) {
                $scope.states=response.data.response
            })
            .catch(function (err) {
                console.log(err);
            })
    };
})