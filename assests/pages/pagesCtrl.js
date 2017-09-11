app.controller('pagesCtrl',function ($scope,dataService,$location,$document) {
   /* if (dataService.name===null) {
        $location.path('/login')
    }*/
    var saveData=null;
    $scope.blockPage=function () {
        console.log(saveData)
        dataService.blockPage(saveData).then(function (response) {
            console.log(response)
            getData()
        })
            .catch(function (response) {
                console.log(response);
            });
    }

    $scope.editPage=function (user) {
        $scope.obj=user;
        console.log(user);

    }

    $scope.savePage=function (page) {
        saveData=page
    }

    $scope.getTotalPage=function () {
        if ($scope.displayed)
            $scope.displayed=!$scope.displayed;
        $scope.displayed=!$scope.displayed
        dataService.getPages().then(function (response) {
            console.log("called",response);
            $scope.pages=response.data.response
            for (var i=0;i<response.data.response.length;i++)
            {
                console.log(response.data.response[i].blocked);
                if(response.data.response[i].blocked) {
                    $scope.pages[i].status="Unblock"
                }
                else {
                    $scope.pages[i].status="Block"

                }
            }
        }).catch(function (response) {
            console.log(response);
        })
    }

    $scope.getUnpublishedPage=function () {
        if ($scope.displayed)
            $scope.displayed=!$scope.displayed;
        $scope.displayed=!$scope.displayed
        dataService.getUnpublishedPage().then(function (response) {
            console.log("called",response);
            $scope.pages=response.data.response
            for (var i=0;i<response.data.response.length;i++)
            {
                console.log(response.data.response[i].blocked);
                if(response.data.response[i].blocked) {
                    $scope.pages[i].status="Unblock"
                }
                else {
                    $scope.pages[i].status="Block"

                }
            }
        }).catch(function (response) {
            console.log(response);
        })
    }

    $scope.getBlockedPage=function () {
        if ($scope.displayed)
            $scope.displayed=!$scope.displayed;
        $scope.displayed=!$scope.displayed
        dataService.getBlockedPage().then(function (response) {
            console.log("called",response);
            $scope.pages=response.data.response
            for (var i=0;i<response.data.response.length;i++)
            {
                console.log(response.data.response[i].blocked);
                if(response.data.response[i].blocked) {
                    $scope.pages[i].status="Unblock"
                }
                else {
                    $scope.pages[i].status="Block"

                }
            }
        }).catch(function (response) {
            console.log(response);
        })
    }

    $scope.getRemovedPage=function () {
        if ($scope.displayed)
            $scope.displayed=!$scope.displayed;
        $scope.displayed=!$scope.displayed
        dataService.getRemovedPage().then(function (response) {
            console.log("called",response);
            $scope.pages=response.data.response
            for (var i=0;i<response.data.response.length;i++)
            {
                console.log(response.data.response[i].blocked);
                if(response.data.response[i].blocked) {
                    $scope.pages[i].status="Unblock"
                }
                else {
                    $scope.pages[i].status="Block"

                }
            }
        }).catch(function (response) {
            console.log(response);
        })
    }

    $scope.add=function (data) {
        dataService.editPage(data).then(function (response) {
            console.log(response);
        }).catch(function (response) {
            console.log(response);
        })
    }


    $document.ready(function () {
        getData()
    })

    function getData() {

        dataService.getTotalPages().then(function (response) {
            console.log(response)
            $scope.total_pages=response.data.response[0].count;
            console.log($scope.total_pages);

        }).catch(function (response) {
            console.log(response)
        })

        dataService.getRemovedPages().then(function (response) {
            console.log(response)
            $scope.removed_pages=response.data.response[0].count;
            console.log($scope.removed_pages);


        }).catch(function (response) {
            console.log(response)
        })

        dataService.getUnpublishedPages().then(function (response) {
            console.log(response)
            $scope.unpublished_pages=response.data.response[0].count;
            console.log($scope.unpublished_pages);

        }).catch(function (response) {
            console.log(response)
        })

        dataService.getBlockedPages().then(function (response) {
            console.log(response)
            $scope.blocked_pages=response.data.response[0].count;
            console.log($scope.blocked_pages);

        }).catch(function (response) {
            console.log(response)
        })
    }




});