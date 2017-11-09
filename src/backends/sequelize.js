'use strict';

var baseActivitySchemaPlugin = require('./activity.js');
var util = require('util');
var baseBackend = require('./base');
var sequelize = require('sequelize');
var stream = require('../index.js');


function Backend() {}

function setupSequelize(s) {
	Backend.prototype.getSequelize = function() {
		return s;
	};
}

util.inherits(Backend, baseBackend);


Backend.prototype.serializeValue = function(value) {
  if (typeof value._id !== 'undefined') {
		return value.constructor.modelName + ':' + value._id;
	} else {
		return value;
	}
};


(Backend.prototype.collectReferences = function(activities) {
	var modelReferences = {};
	this.iterActivityFieldsWithReferences(activities, function(args) {
		if (modelReferences[args.modelRef]) {
			modelReferences[args.modelRef].push(args.instanceRef);
		} else {
			modelReferences[args.modelRef] = [args.instanceRef];
		}
	});

	return modelReferences;
}), (Backend.prototype.loadFromStorage = function(modelClass, objectIds, callback) {
	var found = {};
	var paths = [];
	if (typeof modelClass.pathsToPopulate === 'function') {
		paths = modelClass.pathsToPopulate();
	}

	modelClass.findAll({
    where: {
      id: objectIds
    }
  }).then(function(docs) {
		for (var i in docs) {
			found[docs[i].id] = docs[i];
		}

		callback(null, found);
	}).catch(function(err) {
    console.log(err);
    callback(err, null);
  });
});


// takes string user, return User model
Backend.prototype.getClassFromRef = function(ref) {
  var sequelize = this.getSequelize();
	var sequelizeModel;
  try {
		sequelizeModel = sequelize.models[ref];
	} catch (e) {
		// fail silently
	}

	return sequelizeModel;
};

Backend.prototype.getIdFromRef = function(ref) {
	return ref.split(':')[1];
};

// Stream Node.js can automatically publish new activities to your feeds. To do that you only need to register the models you want to publish with this library.
module.exports.activity = function(schema, options) {
	schema.plugin(baseActivitySchemaPlugin);
	schema.plugin(mongooseActivitySchemaPlugin);
};

module.exports.Backend = Backend;
module.exports.Setup = setupSequelize;
