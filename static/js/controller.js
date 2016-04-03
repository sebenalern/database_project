var chitChatApp = angular.module('chitChatApp', ['ngRoute']);

chitChatApp.controller('mainController', ['$scope', '$log', '$sce', function ($scope, $log, $sce) {
    
    var socket = io.connect('https://' + document.domain + ':' + location.port + '/chitchat');
    
        
    $scope.firstName = "";
    $scope.lastName = "";
    $scope.username = "Nick";
    $scope.email = "";
    $scope.notLoggedIn = false;
    var pic = 'http://www.wired.com/wp-content/uploads/2015/09/google-logo.jpg';
    $scope.profilePicture = $sce.trustAsUrl(pic);
    
    socket.on('connect', function(){
        $log.log("After connected");
    });

    $scope.getLogin = function (email, password) {
      $log.log(email);
      $log.log(password);
      $scope.tempArray = [];
      $scope.tempArray.push(email);
      $scope.tempArray.push(password);
      
      socket.emit('LoginDetails', $scope.tempArray);
    };
    
    socket.on('receiveUserProfileData', function(userData) {
        $log.log("in receiveUserProfileData");
        $log.log(userData);
        
    });
    
    socket.on('notReceiveUserProfileData', function() {
        $log.log("inside notReceiveUserProfileData");
        $scope.notLoggedIn = true;
    });
    
    $scope.getProfilePicture = function (picture) {
        $scope.profilePicture = picture;
      $log.log("here" + $scope.profilePicture);  
    };
}]);