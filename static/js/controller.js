var myApp = angular.module('myApp', ['ngRoute']);

myApp.controller('mainController', ['$scope', '$log', function ($scope, $log) {
    
    var socket = io.connect('https://' + document.domain + ':' + location.port + '/iss');
    
    socket.on('connect', function(){
        $log.log("After connected");
    });
    
    $scope.name = "nick";
}]);