var chitChatApp = angular.module('chitChatApp', ['ngRoute']);

chitChatApp.controller('mainController', ['$scope', '$log', '$sce', function ($scope, $log, $sce) {
    
    var socket = io.connect('https://' + document.domain + ':' + location.port + '/chitchat');
    
        
    $scope.firstname = "";
    $scope.lastname = "";
    $scope.username = "Nick";
    var pic = 'http://www.wired.com/wp-content/uploads/2015/09/google-logo.jpg';
    $scope.profilePicture = $sce.trustAsUrl(pic);
    
    socket.on('connect', function(){
        $log.log("After connected");
    });

    
    socket.on('receiveUserProfileData', function(userData) {
       $log.log("in receiveUserProfileData");
      $log.log($scope.username = userData["name"]);
        
    });
    
    $scope.getProfilePicture = function (picture) {
        $scope.profilePicture = picture;
      $log.log("here" + $scope.profilePicture);  
    };
}]);