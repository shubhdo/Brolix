'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', ['ngRoute', 'angularUtils.directives.dirPagination','toastr'])

app.config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!' +
        '');

    $routeProvider.when('/users', {
        templateUrl: 'users/users.html',
        controller: 'usersCtrl'
    })
        .when('/pages', {
            templateUrl: 'pages/pages.html',
            controller: 'pagesCtrl'
        })
        .when('/ads', {
            templateUrl: 'ads/ads.html',
            controller: 'adsCtrl'
        })
        .when('/addUser', {
            templateUrl: 'addUser/addUser.html',
            controller: 'addUserCtrl'
        }).when('/login', {
        templateUrl: 'login/login.html',
        controller: 'loginCtrl'
    }).otherwise({redirectTo: '/login'});
}])
