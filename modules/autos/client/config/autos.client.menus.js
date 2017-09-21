(function () {
  'use strict';

  angular
    .module('autos')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {

    menuService.addMenuItem('topbar', {
      title: 'Auto',
      state: 'autos',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'autos', {
      title: 'Tạo Auto',
      state: 'autos.create',
      roles: ['*']
    });
  }
}());
