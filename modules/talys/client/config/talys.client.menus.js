(function () {
  'use strict';

  angular
    .module('talys')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Upload',
      state: 'talys',
      type: 'dropdown'
    });
    menuService.addSubMenuItem('topbar', 'talys', {
      title: 'Danh sách tem gán',
      state: 'talys.create'
    });
  }
}());
