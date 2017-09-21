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
      pointX: 0,
      pointY: 0,
      start: vm.setting.start,
      end: vm.setting.start + vm.setting.time,
      time: vm.setting.time,
      isMove: false,
      move: {
        pointX: 0,
        pointY: 0,
        before: 100
      },
      touchs: []
    }];

    $scope.addAction = function () {
      var last = vm.autos[vm.autos.length - 1];
      var auto = { pointX: 0, pointY: 0 };
      auto.start = last.end + vm.setting.spacing;
      auto.time = vm.setting.time;
      auto.end = auto.start + auto.time;
      auto.isMove = false;
      auto.move = {
        pointX: 0,
        pointY: 0,
        time: 100
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
        var startLine = '' + START.A + auto.pointX + MID + auto.pointY + START.B + auto.start;
        vm.render += startLine + '\n';

        if (auto.isMove) {
          var moveLine = '' + MOVE.A + (auto.move.pointX || 0) + MID + (auto.move.pointY || 0) + MOVE.B + (auto.start + auto.move.before);
          vm.render += moveLine + '\n';
        }

        auto.touchs.forEach(function (touch) {
          var V = auto.isMove ? { pointX: auto.pointX, pointY: auto.pointY } : { pointX: auto.move.pointX, pointY: auto.move.pointY }
          var lineA = '' + TOUCH.A + V.pointX + MID + V.pointY + MID + touch.pointX + MID + touch.pointY + TOUCH.B + (auto.start + touch.before);
          vm.render += lineA + '\n';
          var lineB = '' + TOUCH.C + V.pointX + MID + V.pointY + TOUCH.D + (auto.start + touch.before + touch.time);
          vm.render += lineB + '\n';
        });

        var endLine = '' + END.A + auto.end;
        vm.render += endLine + '\n';

        vm.render += '\n';
      });

      var blob = new Blob([vm.render], { type: 'text/plain' });
      var url = window.URL.createObjectURL(blob);
      $window.open(url);
    };

    $scope.addTouchs = function (auto) {
      var touch = {
        pointX: 0,
        pointY: 0,
        before: 100,
        time: 100
      };
      if (auto.touchs.length > 0) {
        touch.before += auto.touchs[auto.touchs.length - 1].before;
      }
      auto.touchs.push(touch);
    };
  }
}());
