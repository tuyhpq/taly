(function () {
  'use strict';

  angular
    .module('talys')
    .controller('ListTalysController', ListTalysController);

  ListTalysController.$inject = ['$scope', 'TalysService'];

  function ListTalysController($scope, TalysService) {
    var vm = this;
    vm.uploads = TalysService.query();

    // Get the modal
    var modal = document.getElementById('myModal');

    // Get the image and insert it inside the modal - use its "alt" text as a caption
    var modalImg = document.getElementById('img01');
    var captionText = document.getElementById('caption');

    $scope.viewImg = function (picFile) {
      modal.style.display = 'block';
      modalImg.src = picFile.url;
      captionText.innerHTML = picFile.name;
    };

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName('closeImg')[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
      modal.style.display = 'none';
    };

  }
}());
