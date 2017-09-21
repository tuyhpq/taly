(function () {
  'use strict';

  angular
    .module('autos.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {

    $stateProvider
      .state('autos', {
        abstract: true,
        url: '/autos',
        template: '<ui-view/>'
      })
      .state('autos.create', {
        url: '/create',
        templateUrl: '/modules/autos/client/views/autos-create.client.view.html',
        controller: 'CreateAutosController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Tạo Auto'
        }
      });

  }
}());
