"use strict";

/**
 * http://en.wikipedia.org/wiki/Ninja
 * Stefan Aichholzer <play@analogbird.com>
 * We fly light.
 */
var path = require('path'),
	ninja = function(app, appPath) {

		this.app = app;
		this.appPath = appPath || path.resolve(__dirname, '../../../');
		this.control = this.middleware = null;
		this.middlewareMethods = [];

		this.kyoketsu();
		this.nagamaki();

	};

/**
 * http://en.wikipedia.org/wiki/Kyoketsu-shoge
 * 
 * Tries to find the path to the Budo. By default it will look
 * in the base directory where the application resides.
 * Optionally a full path may be provided. 
 */
ninja.prototype.kyoketsu = function() {

	console.log(this.appPath + '/budo.json');
	try {
		this.budo = require(this.appPath + '/budo.json');
	} catch (err) {
		throw new Error('I cannot find my budo.');
	}
};


/**
 * http://en.wikipedia.org/wiki/Kaginawa
 * 
 * Tries to load the respective control and middleware (if any).
 * In your Budo, a control is called from the file defined in "from".
 * Middleware is define in "via"
 */
ninja.prototype.kaginawa = function(type, loadedFile, loadedMethod) {

	try {
		switch (type) {
			case 'control': this.control = require((this.appPath + '/' + loadedFile).replace('//', '/'));
				break;

			case 'middleware': this.middleware = require((this.appPath + '/' + this.budo[loadedFile]).replace('//', '/'));
				break;
		}
	} catch (err) {
		throw new Error('I cannot find the middleware you are trying to use.');
	}

	if (loadedMethod) {
		this.middlewareMethods.push(loadedMethod);
	}

};


/**
 * http://en.wikipedia.org/wiki/Kusarigama
 * 
 * Applies the actual route logic to your application.
 * Takes care of mapping the middleware (if any) and the control.
 */
ninja.prototype.kusarigama = function(verb, route) {

	var self = this;
	if (this.middleware) {
		this.middlewareMethods.forEach(function(method) {
			try {
				self.app[verb](route[verb], self.middleware[method]);
			} catch (err) {
				throw new Error('Are you sure this method "' + method + '" exists? - Check you Budo.');
			}
		});
	}

	this.app[verb](route[verb], this.control[route.run]);

};


/**
 * http://en.wikipedia.org/wiki/Naginata
 * 
 * Identifies the HTTP verb you are trying to use.
 * You may define any valid HTTP verb in your Budo.
 */
ninja.prototype.naginata = function(route) {

	var verbs = ['get', 'post', 'put', 'delete', 'head', 'options', 'patch', 'trace', 'connect'],
		currentVerb;

	for (var verb in verbs) {
		if (verbs[verb] in route) {
			currentVerb = verbs[verb];
			//this.middlewareMethods.push(currentVerb);
			return currentVerb;
		}
	}
	
	return false;
};


/**
 * http://en.wikipedia.org/wiki/Nagamaki
 * 
 * Reads the Budo and tries to perform all that has been defined in it.
 * This is basically the core of the route.ninja.
 */
ninja.prototype.nagamaki = function() {

	var self = this,
		verb,
		control,
		components;

	this.budo.routes.forEach(function(route) {

		verb = self.naginata(route);
		if (!verb) {
			throw new Error('I do not know what you want me to do. Please specify a valid HTTP verb.');
		}

		self.kaginawa('control', route.from);

		if (route.via && typeof route.via === 'string') {
			components = route.via.split('.');
			self.kaginawa('middleware', components[0], components[1]);
		} else if (route.via && Array.isArray(route.via)) {
			route.via.forEach(function(via) {
				components = via.split('.');
				self.kaginawa('middleware', components[0], components[1]);
			});
		}

		self.kusarigama(verb, route);
		self.middlewareMethods = [];
	});

};


module.exports = ninja;
