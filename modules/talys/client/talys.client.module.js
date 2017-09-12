(function (app) {
  'use strict';

  app.registerModule('talys.services');
  app.registerModule('talys', ['core']);
  app.registerModule('talys.routes', ['ui.router', 'core.routes']);
}(ApplicationConfiguration));
