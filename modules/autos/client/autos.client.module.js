(function (app) {
  'use strict';

  app.registerModule('autos.services');
  app.registerModule('autos', ['core']);
  app.registerModule('autos.routes', ['ui.router', 'core.routes']);
}(ApplicationConfiguration));
