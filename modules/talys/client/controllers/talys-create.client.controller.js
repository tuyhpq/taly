(function () {
  'use strict';

  angular
    .module('talys')
    .controller('CreateTalysController', CreateTalysController);

  CreateTalysController.$inject = ['$scope', '$state', '$window', 'TalysService', 'Notification', 'Upload', '$timeout'];

  function CreateTalysController($scope, $state, $window, TalysService, Notification, Upload, $timeout) {
    var vm = this;
    vm.form = {};

    vm.upload = new TalysService();
    vm.upload.urlImgs = [];
    vm.upload.urlFiles = [];

    vm.picFiles = [];
    vm.allFiles = [];

    $scope.selectImages = function (selectedImages) {
      if (selectedImages && selectedImages.length > 0) {
        selectedImages.forEach(function (selectedImage) {
          if (selectedImage.type.indexOf('image') > -1) {
            vm.picFiles.push(selectedImage);
          } else {
            Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i> Ảnh không đúng định dạng!' });
          }
        });
      }
    };

    $scope.removeImage = function (index) {
      vm.picFiles.splice(index, 1);
    };

    $scope.selectFiles = function (selectedFiles) {
      if (selectedFiles && selectedFiles.length > 0) {
        selectedFiles.forEach(function (selectedFile) {
          vm.allFiles.push(selectedFile);
        });
      }
    };

    $scope.removeFile = function (index) {
      vm.allFiles.splice(index, 1);
    };

    // Save talys
    vm.save = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.uploadForm');
        return false;
      }
      $scope.loadingSubmit = true;
      vm.saveImages();
    };

    function successCallback(res) {
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Upload thành công!' });
      $state.go('home');
      $scope.loadingSubmit = false;
    }

    function errorCallback(res) {
      Notification.error({
        message: res.data.message,
        title: '<i class="glyphicon glyphicon-remove"></i> Upload thất bại!'
      });
      $scope.loadingSubmit = false;
    }

    vm.saveImages = function (index = 0) {
      if (index === vm.picFiles.length) {
        vm.saveFiles();
      } else {
        Upload.upload({
          url: '/api/uploads/picture',
          data: {
            newImage: vm.picFiles[index]
          }
        }).then(function (res) {
          $timeout(function () {
            var urlImg = {
              name: vm.picFiles[index].name,
              url: res.data.nameFile
            };
            vm.upload.urlImgs.push(urlImg);
            vm.saveImages(index + 1);
          });
        }, function (res) {
          if (res.status > 0) {
            Notification.error({
              message: res.data,
              title: '<i class="glyphicon glyphicon-remove"></i> Lỗi trong khi tải lên hình ảnh!'
            });
          }
        }, function (evt) {
          vm.progressImages = parseInt(50.0 * evt.loaded / evt.total, 10);
        });
      }
    };

    vm.saveFiles = function (index = 0) {
      if (index === vm.allFiles.length) {
        vm.upload.$save(successCallback, errorCallback);
      } else {
        Upload.upload({
          url: '/api/uploads/file',
          data: {
            newFile: vm.allFiles[index]
          }
        }).then(function (res) {
          $timeout(function () {
            var urlFile = {
              name: vm.allFiles[index].name,
              url: res.data.nameFile,
              size: $scope.getSizeToString(vm.allFiles[index].size)
            };
            vm.upload.urlFiles.push(urlFile);
            vm.saveFiles(index + 1);
          });
        }, function (res) {
          if (res.status > 0) {
            Notification.error({
              message: res.data,
              title: '<i class="glyphicon glyphicon-remove"></i> Lỗi trong khi tải lên tệp tin!'
            });
          }
        }, function (evt) {
          vm.progressFiles = parseInt(50.0 * evt.loaded / evt.total, 10);
        });
      }
    };

    $scope.getSizeToString = function (size) {
      var outPut = 'unknown';
      if (size < 1024) {
        outPut = size + 'bytes';
      } else {
        size = size / 1024;
        if (size < 1024) {
          outPut = parseFloat(size).toFixed(2) + 'kb';
        } else {
          size = size / 1024;
          outPut = parseFloat(size).toFixed(2) + 'mb';
        }
      }
      return outPut;
    };

  }
}());
