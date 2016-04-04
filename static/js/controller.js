var chitChatApp = angular.module('chitChatApp', ['ngRoute']);
var socket = io.connect('https://' + document.domain + ':' + location.port + '/chitchat');


// myApp.factory('socket', function (socketFactory) {
//   return socketFactory();
// });


chitChatApp.config(['$routeProvider',
     function($routeProvider) {
         $routeProvider.
        
             when('/', {
                 templateUrl: '../static/partials/mainPageLayout.html/',
                 controller: "mainController"
             }).
            when('/login', {
                 templateUrl: '../static/partials/loginPage.html/',
                 controller: "mainController"
             }).
            when('/registration', {
                 templateUrl: '../static/partials/registration.html/',
                 controller: "mainController"
             }).
            when('/profile', {
                 templateUrl: '../static/partials/profile.html/',
                 controller: "mainController"
             }).     
             when('/edit_profile', {
                 templateUrl: '../static/partials/edit_profile.html/',
                 controller: "mainController"
             }).             
             otherwise({
                 redirectTo: '/'
             });
    }]);
    
chitChatApp.controller('chitChatApp', ['$scope', '$log', function ($scope, $log) {
    
}]);