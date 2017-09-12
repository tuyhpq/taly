(function () {
  'use strict';

  angular
    .module('talys.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {

    $stateProvider
      .state('talys', {
        abstract: true,
        template: '<ui-view/>'
      })
      .state('talys.create', {
        url: '/create',
        templateUrl: '/modules/talys/client/views/talys-create.client.view.html',
        controller: 'CreateTalysController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Tạo Chủ Đề'
        }
      });

  }
}());
