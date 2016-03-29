var chitChatApp = angular.module('chitChatApp', ['ngRoute']);

chitChatApp.controller('mainController', ['$scope', '$log', function ($scope, $log) {
    
    var socket = io.connect('https://' + document.domain + ':' + location.port + '/chitchat');
    
        
    $scope.firstname = "";
    $scope.lastname = "";
    $scope.username = "";
    
    socket.on('connect', function(){
        $log.log("After connected");
    });

    
    socket.on('receiveUserProfileData', function(userData) {
       $log.log("in receiveUserProfileData");
      $log.log($scope.username = userData["name"]);
        
    });
}]);