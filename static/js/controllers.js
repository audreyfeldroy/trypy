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

  $scope.output = [{'text':'Python ready.', 'error':false}];
  $scope.history = [];
  $scope.history_index = 0;

  $scope.runCode = function(keyCode){

    if (keyCode == 13) {
        $scope.resetHistoryIndex();
        
        // Running a command
        $scope.output.push({'text': '>>> '+$scope.prompt, 'error': false});
        $scope.history.push($scope.prompt);
        $http.post('/run_code/', { 'command': $scope.prompt }).success(function(data){
            $scope.output.push(data);
            $scope.prompt = '';
        });
    }

    else if (keyCode == 38){
        $scope.historyUp();
    }

    else if (keyCode == 40){
        $scope.historyDown();
    }

    else {
        $scope.resetHistoryIndex();
    }
  };

  $scope.historyUp = function(){
      if ($scope.history_index < $scope.history.length && $scope.history_index + $scope.history.length >= 0){
          $scope.history_index -= 1;
          $scope.prompt = $scope.history[$scope.history.length + $scope.history_index];
      }
  };

  $scope.historyDown = function(){
      if ($scope.history_index < 0, $scope.history_index){
          $scope.history_index += 1;
          $scope.prompt = $scope.history[$scope.history.length + $scope.history_index];
      }
  };

  $scope.resetHistoryIndex = function(){
      $scope.history_index = 0;
  };

});
