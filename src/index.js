'use strict';

var FeedManager = require('./FeedManager.js');
// var config = require('./config.js');
// var settings = config();
// var extend = require('util')._extend;
// var waterline = require('./backends/waterline');
// var mongoose = require('./backends/mongoose.js');

var config = {};

module.exports.FeedManager = function(settings) {
  config=settings;
  return new FeedManager(settings);
};

// module.exports.feedManagerFactory = function(options) {
// 	var withSettings = extend({}, settings);
// 	options = options || {};
//
// 	for (var key in withSettings) {
// 		if (withSettings.hasOwnProperty(key) && options.hasOwnProperty(key)) {
// 			withSettings[key] = options[key];
// 		}
// 	}
//
// 	return new FeedManager(withSettings);
// };

module.exports.backend = function() {
  if (config.backend === 'mongoose') {
    return require('./backends/mongoose.js').Backend;
  }
  if (config.backend === 'waterline') {
    return require('./backends/waterline').Backend;
  }
  if (config.backend === 'sequelize') {
    return require('./backends/sequelize').Backend;
  }
};

module.exports.settings = config;

// module.exports.WaterlineBackend = waterline.Backend;
// module.exports.MongooseBackend = mongoose.Backend;
