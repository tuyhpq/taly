'use strict';

/**
 * Module init function.
 */
module.exports = function (app, db) {

};

// Module's name is also name of main Collection
module.exports.names = 'autos';

// Url of api module
module.exports.route = '/api/' + module.exports.names;

// Param's name
module.exports.param = module.exports.names + 'Id';
