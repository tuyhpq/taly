(function () {
  'use strict';

  angular
    .module('autos.services')
    .factory('AutosService', AutosService);

  AutosService.$inject = ['$resource'];

  function AutosService($resource) {
    return $resource('/api/autos/:autosId', { autosId: '@_id' }, {
      update: {
        method: 'PUT'
      }
    });
  }

}());
