var chitChatApp = angular.module('chitChatApp', ['ngRoute']);
var socket = io.connect('https://' + document.domain + ':' + location.port + '/chitchat');

chitChatApp.service("DataPersistence", function () {
    
    this.userSuccessfullyLoggedIn = false;
    this.userSuccessfullyRegistered = false;    
    this.firstname = "";
    this.lastname = "";
    this.username = "";
    this.email = "";
});

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
             when('/contacts', {
                 templateUrl: '../static/partials/contacts.html/',
                 controller: "chitChatApp"
             }).                
             otherwise({
                 redirectTo: '/'
             });
    }]);
    
chitChatApp.controller('chitChatApp', ['$scope', '$location', '$log','$route', 'DataPersistence', function ($scope, $location , $log, $route, DataPersistence) {
   

    $scope.RegistrationData=[];
    $scope.firstname = DataPersistence.firstname;
    $scope.lastname = DataPersistence.lastname;
    $scope.username = DataPersistence.username;
    $scope.email = DataPersistence.email;
    
    // Add a watcher to update the service and update its properties
    $scope.$watch('username', function () {
         DataPersistence.username = $scope.username;
     });
     $scope.$watch('firstname', function () {
         DataPersistence.firstname = $scope.firstname;
     });
    $scope.$watch('lastname', function () {
         DataPersistence.lastname = $scope.lastname;
     });
    $scope.$watch('email', function () {
         DataPersistence.email = $scope.email;
     });  
     
    socket.on('connect', function(){
         $log.log("--------------------------------Connected!--------------------------------------------");
     });
     
     socket.on('disconnect', function() {
        $log.log("---------------------------------Disconnected!-----------------------------------------");
     });

    //---sending the login details to be checked from the database in the server side
     $scope.getLogin = function (email, password) {
      $log.log(email);
      $log.log(password);
      $scope.tempArray = [];
      $scope.tempArray.push(email);
      $scope.tempArray.push(password);
      socket.emit('LoginDetails', $scope.tempArray);
    };
    
    //---getting the registration detail from html page
    $scope.RegistrationCheck = function (UsernameR,FirstnameR,LastnameR,EmailR,PasswordR) {
        console.log(UsernameR);
        $scope.RegistrationData=[];
        $scope.RegistrationData.push(UsernameR);
        
        $scope.RegistrationData.push(FirstnameR);

        $scope.RegistrationData.push(LastnameR);

        $scope.RegistrationData.push(EmailR);
        $scope.RegistrationData.push(PasswordR);
        $scope.username=UsernameR;
        $scope.email = EmailR;
        $scope.firstname = FirstnameR;
        $scope.lastname = LastnameR;
        console.log($scope.RegistrationData);
        socket.emit('InsertRegistrationDetails',$scope.RegistrationData);
    };
    
    
    //matched user details ---------------------------------
     socket.on('receiveUserProfileData', function(userData) {
        $log.log(userData);
        $scope.email = userData[0];
        $scope.firstname = userData[1];
        $scope.lastname = userData[2];
        $scope.username = userData[3];
        $scope.checked = false;
        $location.path('/profile');
        $route.reload();
        $scope.$apply();
    });
    
    
    //unmatched user details---------------------------
    socket.on('notReceiveUserProfileData', function(){
        $log.log("inside notReceiveUserProfileData");
        $scope.checked=true;
        $scope.$apply();
        
    });
    
    
    socket.on('RegisteredUser', function() {
    $location.path('/profile');
    $route.reload();
    });
    
    
    
}]);