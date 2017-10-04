(function () {
  'use strict';

  angular
    .module('autos')
    .controller('CreateAutosController', CreateAutosController);

  CreateAutosController.$inject = ['$scope', '$state', '$window', 'AutosService', 'Notification'];

  function CreateAutosController($scope, $state, $window, AutosService, Notification) {
    var vm = this;
    vm.form = {};

    var START = {
      A: '0ScRiPtSePaRaToR1280|720|MULTI:1:0:',
      B: 'ScRiPtSePaRaToR',
      C: ':'
    };
    var END = {
      A: '0ScRiPtSePaRaToR1280|720|MSBRL:2:0ScRiPtSePaRaToR'
    };
    var MOVE = {
      A: '0ScRiPtSePaRaToR1280|720|MULTI:1:2:',
      B: 'ScRiPtSePaRaToR'
    };
    var TOUCH = {
      A: '0ScRiPtSePaRaToR1280|720|MULTI:2:5:',
      B: 'ScRiPtSePaRaToR',
      C: '0ScRiPtSePaRaToR1280|720|MULTI:1:6:',
      D: 'ScRiPtSePaRaToR'
    };
    var MID = ':';

    vm.setting = {
      start: 0,
      time: 1000,
      spacing: 1000
    };

    vm.autos = [{
      X: 0,
      Y: 0,
      start: vm.setting.start,
      end: vm.setting.start + vm.setting.time,
      time: vm.setting.time,
      isMove: false,
      move: {
        X: 0,
        Y: 0,
        before: 100
      },
      touchs: []
    }];

    $scope.addAction = function () {
      var last = vm.autos[vm.autos.length - 1];
      var auto = { X: 0, Y: 0 };
      auto.start = last.end + vm.setting.spacing;
      auto.time = vm.setting.time;
      auto.end = auto.start + auto.time;
      auto.isMove = false;
      auto.move = {
        X: 0,
        Y: 0,
        time: 400
      };
      auto.touchs = [];

      vm.autos.push(auto);
    };

    $scope.reloadAutos = function () {
      console.log('xxxxxx');
      vm.autos.forEach(function (auto, index) {
        if (index === 0) {
          auto.start = vm.setting.start;
          auto.end = vm.setting.start + auto.time;
        } else {
          var last = vm.autos[index - 1];
          auto.start = last.end + vm.setting.spacing;
          auto.end = auto.start + auto.time;
        }
      });
    };

    $scope.render = function () {
      vm.render = '';
      vm.autos.forEach(function (auto, index) {
        var startLine = '' + START.A + auto.X + MID + auto.Y + START.B + auto.start;
        vm.render += startLine + '\n';

        if (auto.isMove) {
          var moveLine = '' + MOVE.A + auto.move.X + MID + auto.move.Y + MOVE.B + (auto.start + auto.move.before);
          vm.render += moveLine + '\n';
        }

        auto.touchs.forEach(function (touch) {
          var V = auto.isMove ? { X: auto.X, Y: auto.Y } : { X: auto.move.X, Y: auto.move.Y }
          var lineA = '' + TOUCH.A + V.X + MID + V.Y + MID + touch.X + MID + touch.Y + TOUCH.B + (auto.start + touch.before);
          vm.render += lineA + '\n';
          var lineB = '' + TOUCH.C + V.X + MID + V.Y + TOUCH.D + (auto.start + touch.before + touch.time);
          vm.render += lineB + '\n';
        });

        var endLine = '' + END.A + auto.end;
        vm.render += endLine + '\n';

        vm.render += '\n';
      });

      var blob = new Blob([vm.render], { type: 'text/plain' });
      var url = ($window.URL || $window.webkitURL).createObjectURL(blob);
      window.open(url);
      vm.url = url;
    };

    $scope.addTouchs = function (auto) {
      var touch = {
        X: 0,
        Y: 0,
        before: 200,
        time: 100
      };
      auto.touchs.push(touch);
    };
  }
}());
