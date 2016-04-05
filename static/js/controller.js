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
                 controller: "chitChatApp"
             }).
            when('/login', {
                 templateUrl: '../static/partials/loginPage.html/',
                 controller: "chitChatApp"
             }).
            when('/registration', {
                 templateUrl: '../static/partials/registration.html/',
                 controller: "chitChatApp"
             }).
            when('/profile', {
                 templateUrl: '../static/partials/profile.html/',
                 controller: "chitChatApp"
             }).     
             when('/edit_profile', {
                 templateUrl: '../static/partials/edit_profile.html/',
                 controller: "chitChatApp"
             }).             
             otherwise({
                 redirectTo: '/'
             });
    }]);
    
chitChatApp.controller('chitChatApp', ['$scope', '$log', function ($scope, $log) {


    //---sending the login details to be checked from the database in the server side
     $scope.getLogin = function (email, password) {
      $log.log(email);
      $log.log(password);
      $scope.tempArray = [];
      $scope.tempArray.push(email);
      $scope.tempArray.push(password);
      $log.log($scope.hello);
      socket.emit('LoginDetails', $scope.tempArray);
    };
    
    //---getting the registration detail from html page
    $scope.RegistrationCheck = function (UserNameR,FirstNameR, LastNameR, EmailR, PasswordR) {
        $log.log("Hey nickkkkkkkkkkkkk");

        socket.emit('InsertRegistrationDetails',UserNameR,FirstNameR, LastNameR, EmailR, PasswordR);
    };
    
    
    //matched user details ---------------------------------
     socket.on('receiveUserProfileData', function(userData) {
        $log.log("in receiveUserProfileData");
        
    });
    
    
    //unmatched user details---------------------------
    socket.on('notReceiveUserProfileData', function() {
        $log.log("inside notReceiveUserProfileData");
        $scope.notLoggedIn = true;
    });
    
    
    
    
    
}]);