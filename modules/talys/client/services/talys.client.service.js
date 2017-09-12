(function () {
  'use strict';

  angular
    .module('talys.services')
    .factory('TalysService', TalysService);

  TalysService.$inject = ['$resource'];

  function TalysService($resource) {
    return $resource('/api/talys/:talysId', { talysId: '@_id' }, {
      update: {
        method: 'PUT'
      }
    });
  }

}());
