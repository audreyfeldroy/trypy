var tutorialApp = angular.module('Tutorial', ['ng.django.forms','ngSanitize', 'luegg.directives', 'ngCookies']).config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{$').endSymbol('$}');
});

tutorialApp.controller('TutorialController', function ($scope, $http, $rootScope, $location, $cookies) {

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

    $location.path('/level/'+$scope.currents.level+'/challenge/'+$scope.currents.challenge+'/');
    $cookies.trypy_level = $scope.currents.level+"/"+$scope.currents.challenge;
  };

  $scope.getChallengesList = function(){
      $http.get('/api/challenges/.json?level='+$scope.currents.level).success(function(data) {
        $scope.challenges = data;
      });
  }

  $scope.findStartingPoint = function(){
      // first look at URL
      pattern = new RegExp("level/\\d/challenge/\\d");
      if (pattern.test($location.path())){
          data = $location.path().split('/')
          $scope.currents = {'level': parseInt(data[2]), 'challenge': parseInt(data[4])};
      } else {
          // then look at cookies
          if ($cookies.trypy_level) {
              data = $cookies.trypy_level.split('/')
              $scope.currents = {'level': parseInt(data[0]), 'challenge': parseInt(data[1])};
          } else {
              // if all falls, start at the beggining
              $scope.currents = {'level': 1, 'challenge': 1};
          }
      }
  }


  $http.get('/api/levels/.json').success(function(data) {
    $scope.levels = data;
  });

  $scope.findStartingPoint();
  $scope.getChallengesList();
  $scope.getCurrentChallenge();

  $scope.$on('goToNextChallenge', function(event, args) {
      $scope.nextChallenge();
  });

  $scope.$on('goToPrevChallenge', function(event, args) {
      $scope.prevChallenge();
  });

  $scope.$on('checkOutput', function(event, args){
      var output = args['output']['text'];
      var is_error = args['output']['error'];
      var pattern = new RegExp($scope.instructions.output_condition);

      if (pattern.test(output.trim()) && is_error == $scope.instructions.output_is_error){
          $scope.nextChallenge();
          $rootScope.$broadcast('printSuccess', {});
      }
  });

});

tutorialApp.controller('PromptController', function ($scope, $http, $rootScope) {

  $scope.runCode = function(keyCode){

    if (keyCode == 13) {

        $scope.resetHistoryIndex();

        if (!$scope.isBuiltinCommand($scope.prompt)){
            $scope.loaderVisible = true;
            // Running a command
            $scope.output.push({'text': '>>> '+$scope.prompt, 'error': false});
            $scope.history.push($scope.prompt);
            $http.post('/run_code/', { 'command': $scope.prompt }).success(function(data){
                $scope.output.push(data);
                $scope.prompt = '';
                $rootScope.$broadcast('checkOutput', {'output': data});
                $scope.loaderVisible = false;
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
  var HELP_TEXT = '<Enter Help Text here>';

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

      if (command == 'clear'){
          $scope.clearOutput();
      }

      if (command == 'help'){
          $scope.output = [{'text':HELP_TEXT, 'error':false}];
      }
  }

  $scope.$on('printSuccess', function(event, args){
     $scope.output.push({'text': 'Success!', 'error': 'success'});
  });

  $scope.clearOutput();
  $scope.history = [];
  $scope.history_index = 0;

});
