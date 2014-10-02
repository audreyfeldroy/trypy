var tutorialApp = angular.module('Tutorial', ['ng.django.forms','ngSanitize']).config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{$').endSymbol('$}');
});


tutorialApp.controller('TutorialController', function ($scope, $http) {

  $scope.currents = {'level': 1, 'challenge': 1};

  $http.get('/api/levels/.json').success(function(data) {
    $scope.levels = data;
  });

  $http.get('/api/levels/'+$scope.currents.level+'/.json').success(function(data) {
    $scope.current_level = data;
  });

  $http.get('/api/challenges/.json?level='+$scope.currents.level).success(function(data) {
    $scope.challenges = data;
  });

  $http.get('/api/challenges/'+$scope.currents.challenge+'/.json').success(function(data) {
    $scope.instructions = data;
  });

});

tutorialApp.controller('PromptController', function ($scope, $http) {

  $scope.runCode = function(keyCode){
    if (keyCode == 13) {
      
    }
  }

});
