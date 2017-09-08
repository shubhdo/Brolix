

app.controller('usersCtrl',function ($scope,dataService,$document,$location) {

    /*
    if (dataService.name===null) {
        $location.path()
    }*/
    var saveData=null;
    $scope.blockUser=function () {
        console.log(saveData)
        dataService.blockUser(saveData).then(function (response) {
            console.log(response)
        })
            .catch(function (response) {
                console.log(response);
            });
        getData();
    }
    
    $scope.editUser=function (user) {
        $scope.obj=user;
        console.log(user);

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
    
    
    $scope.add=function (data) {
        dataService.editUser(data).then(function (response) {
            console.log(response);
        }).catch(function (response) {
            console.log(response);
        })
    }

    $scope.getStates=function () {
        dataService.getStates($scope.obj.country)
            .then(function (response) {
                $scope.states=response.data.response
            })
            .catch(function (err) {
                console.log(err);
            })
    };



    $scope.saveUser=function (user) {
        saveData=user
    }
    $document.ready(function () {
        getData()
    })
    function getData() {
        dataService.getUsers().then(function (response) {

            console.log(response.data.response);
            $scope.users=response.data.response
            for (var i=0;i<response.data.response.length;i++)
            {
                console.log(response.data.response[i].blocked);
                if(response.data.response[i].blocked) {
                    $scope.users[i].status="Unblock"
                }
                else {
                    $scope.users[i].status="Block"

                }
            }
            console.log("5555555",$scope.users)

        }).catch(function (error) {
            console.log(error);
        })


        dataService.getTotalUsers().then(function (response) {
            console.log(response)
            $scope.total_users=response.data.response[0].count;
            console.log($scope.total_users);

        }).catch(function (response) {
            console.log(response)
        })

        dataService.getPersonalUsers().then(function (response) {
            console.log(response)
            $scope.personal_users=response.data.response[0].count;
            console.log($scope.personal_users);


        }).catch(function (response) {
            console.log(response)
        })

        dataService.getBusinessUsers().then(function (response) {
            console.log(response)
            $scope.business_users=response.data.response[0].count;
            console.log($scope.business_users);

        }).catch(function (response) {
            console.log(response)
        })

        dataService.getBLockedUsers().then(function (response) {
            console.log(response)
            $scope.blocked_users=response.data.response[0].count;
            console.log($scope.blocked_users);

        }).catch(function (response) {
            console.log(response)
        })


        dataService.getTotalWinners().then(function (response) {
            console.log(response)
            $scope.total_winners=response.data.response[0].count;
            console.log($scope.total_winners);

        }).catch(function (response) {
            console.log(response)
        })

        dataService.getCashWinners().then(function (response) {
            console.log(response)
            $scope.cash_winners=response.data.response[0].count;
            console.log($scope.cash_winners);


        }).catch(function (response) {
            console.log(response)
        })

        dataService.getCouponWinners().then(function (response) {
            console.log(response)
            $scope.coupon_winners=response.data.response[0].count;
            console.log($scope.coupon_winners);

        }).catch(function (response) {
            console.log(response)
        })
    }




});