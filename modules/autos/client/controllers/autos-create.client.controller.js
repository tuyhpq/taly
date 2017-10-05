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
      time: 200,
      spacing: 300
    };

    vm.autos = [{
      X: 0,
      Y: 0,
      start: vm.setting.start,
      end: vm.setting.start + vm.setting.time,
      time: vm.setting.time,
      before: 0,
      moves: [],
      touchs: []
    }];

    $scope.addAction = function () {
      var last = vm.autos[vm.autos.length - 1];
      var auto = { X: 0, Y: 0 };
      auto.start = last.end + vm.setting.spacing;
      auto.time = vm.setting.time;
      auto.end = auto.start + auto.time;
      auto.before = vm.setting.spacing;
      auto.moves = [];
      auto.touchs = [];

      vm.autos.push(auto);
    };

    $scope.reloadAutos = function () {
      vm.autos.forEach(function (auto, index) {
        if (index === 0) {
          auto.start = auto.before;
          auto.end = auto.start + auto.time;
        } else {
          var last = vm.autos[index - 1];
          auto.start = last.end + auto.before;
          auto.end = auto.start + auto.time;
        }
      });
    };

    $scope.render = function () {
      vm.render = '';
      vm.autos.forEach(function (auto, index) {
        var startLine = '' + START.A + auto.X + MID + auto.Y + START.B + auto.start;
        vm.render += startLine + '\n';

        auto.moves.forEach(function (move) {
          var moveLine = '' + MOVE.A + move.X + MID + move.Y + MOVE.B + (auto.start + move.before);
          vm.render += moveLine + '\n';
        });

        auto.touchs.forEach(function (touch) {
          var V = auto.moves.length === 0 ? { X: auto.X, Y: auto.Y } : { X: auto.moves[auto.moves.length - 1].X, Y: auto.moves[auto.moves.length - 1].Y }
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
      $window.open(url);
    };

    $scope.import = function (selectedFiles) {
      if (selectedFiles) {

        var reader = new FileReader();
        reader.readAsText(selectedFiles);

        reader.onload = function () {
          var result = reader.result.trim().replace(/ /g, '').replace(/\n\n/g, '\n');
          result = result.split('\n');

          var listStrings = [];
          result.forEach(function (value) {
            if (value && value !== '') {
              listStrings.push(value);
            }
          });

          arrayStringToArrayAuto(listStrings);
        };

      }
    };

    $scope.addMoves = function (auto) {
      var move = {
        X: 0,
        Y: 0,
        before: 200
      };
      auto.moves.push(move);
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

    function arrayStringToArrayAuto(listStrings) {
      vm.autos = [];
      var auto = {};
      var touch = {};

      for (let i in listStrings) {
        var line = listStrings[i];

        if (line.indexOf('MULTI:1:0:') !== -1) {
          var position = getPositionStartFromLine(line);
          auto = { X: position.X, Y: position.Y, start: position.time, moves: [], touchs: [] };
          auto.before = vm.autos.length !== 0 ? auto.start - vm.autos[vm.autos.length - 1].end : auto.start

        } else if (line.indexOf('MSBRL') !== -1) {
          auto.end = getEndFromLine(line);
          auto.time = auto.end - auto.start;
          vm.autos.push(auto);

        } else if (line.indexOf('MULTI:1:2:') !== -1) {
          var position = getPositionStartFromLine(line);
          auto.moves.push({
            X: position.X,
            Y: position.Y,
            before: position.time - auto.start
          });

        } else if (line.indexOf('MULTI:2:5:') !== -1) {
          var position = getPositionStartFromLine(line);
          touch = {
            X: position.X,
            Y: position.Y,
            before: position.time - auto.start,
            time: 200
          };
          auto.touchs.push(touch);

        } else if (line.indexOf('MULTI:1:6:') !== -1) {
          var end = getEndFromLine(line);
          touch.time = end - auto.start - touch.before;
          //  auto.touchs.push(touch);
        }

      }

      $scope.$apply();
    }

    function getPositionStartFromLine(line) {
      var key = 'ScRiPtSePaRaToR';
      var index = line.lastIndexOf(key);

      var X, Y, time;
      var p = -1;

      for (let i = index - 1; i > 0; i--) {
        if (isNaN(line[i]) === true) {
          if (p === -1) {
            Y = parseInt(line.slice(i + 1, index), 10);
            p = i;
          } else {
            X = parseInt(line.slice(i + 1, p), 10);
            break;
          }
        }
      }

      time = parseInt(line.slice(index + key.length, line.length), 10);

      return { X: X, Y: Y, time: time };
    }

    function getEndFromLine(line) {
      var key = 'ScRiPtSePaRaToR';
      var index = line.lastIndexOf(key);

      return parseInt(line.slice(index + key.length, line.length), 10);
    }

  }
}());
