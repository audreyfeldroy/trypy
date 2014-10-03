var tutorialApp = angular.module('Tutorial', ['ng.django.forms','ngSanitize']).config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{$').endSymbol('$}');
});

tutorialApp.controller('TutorialController', function ($scope, $http) {

  $scope.nextChallenge = function(){
    if ($scope.currents.challenge < $scope.challenges.length) {
        $scope.currents.challenge += 1;
    } else {
        if ($scope.currents.level < $scope.levels.length) {
            $scope.currents.level += 1;
            $scope.currents.challenge = 1;
            $scope.getChallengesList();
        }
    }
    $scope.getCurrentChallenge();
  };

  $scope.prevChallenge = function(){
    if ($scope.currents.challenge > 1) {
        $scope.currents.challenge -= 1;
    } else {
        if ($scope.currents.level > 1) {
            $scope.currents.level -= 1;
            $scope.getChallengesList();
            $scope.currents.challenge = $scope.challenges.length;
        }
    }
    $scope.getCurrentChallenge();
  };

  $scope.getCurrentChallenge = function(){
    $http.get('/api/challenges/'+$scope.currents.level+'/'+$scope.currents.challenge+'/.json').success(function(data) {
      $scope.instructions = data;
    });
  };

  $scope.getChallengesList = function(){
      $http.get('/api/challenges/.json?level='+$scope.currents.level).success(function(data) {
        $scope.challenges = data;
      });
  }

  $scope.currents = {'level': 1, 'challenge': 1};
  $http.get('/api/levels/.json').success(function(data) {
    $scope.levels = data;
  });

  $scope.getChallengesList();
  $scope.getCurrentChallenge();

  $scope.$on('goToNextChallenge', function(event, args) {
      $scope.nextChallenge();
  });

  $scope.$on('goToPrevChallenge', function(event, args) {
      $scope.prevChallenge();
  });

});

tutorialApp.controller('PromptController', function ($scope, $http, $rootScope) {

  $scope.runCode = function(keyCode){

    if (keyCode == 13) {
        $scope.resetHistoryIndex();

        if (!$scope.isBuiltinCommand($scope.prompt)){

            // Running a command
            $scope.output.push({'text': '>>> '+$scope.prompt, 'error': false});
            $scope.history.push($scope.prompt);
            $http.post('/run_code/', { 'command': $scope.prompt }).success(function(data){
                $scope.output.push(data);
                $scope.prompt = '';
            });

        } else {
            $scope.runBuiltinCommand($scope.prompt);
        }
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

  $scope.clearOutput = function(){
      $scope.output = [{'text':'Python ready.', 'error':false}];
  };

  var BUILTINS = ['next', 'back', 'clear', 'help'];

  $scope.isBuiltinCommand = function(command) {
      if (BUILTINS.indexOf(command) > -1) {
          return true;
      }
      return false;
  }

  $scope.runBuiltinCommand = function(command) {
      $scope.clearOutput();
      $scope.prompt = '';

      if (command == 'next'){
          $rootScope.$broadcast('goToNextChallenge', {});
      }

      if (command == 'back'){
          $rootScope.$broadcast('goToPrevChallenge', {});
      }
  }

  $scope.clearOutput();
  $scope.history = [];
  $scope.history_index = 0;

});
