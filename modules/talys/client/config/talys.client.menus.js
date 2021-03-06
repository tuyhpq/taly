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
      type: 'dropdown',
      roles: ['*']
    });
    menuService.addSubMenuItem('topbar', 'talys', {
      title: 'Tạo Chủ Đề',
      state: 'talys.create',
      roles: ['*']
    });
  }
}());
