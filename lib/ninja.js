"use strict";

/**
 * http://en.wikipedia.org/wiki/Ninja
 * Stefan Aichholzer <play@analogbird.com>
 * We fly light.
 */
var path = require('path'),
	Ninja = function(express, appPath) {

		this._app = express();
		this.appPath = appPath || path.resolve(__dirname, '../../../');
		this.control = this.middleware = null;
		this.middlewareMethods = [];
		this.error = function(err, req, res, next) {
			res.status(404).send({
					code: 404,
					message: 'You should define your own error function. Look for the Ninja and read the Express documentation.'
				}
			);
		}

		return this;
	};

Ninja.prototype.use = function Ninja$use() {

	var self = this;
	Array.prototype.slice.call(arguments).forEach(function(arg) {

		// Intercept the custom error function as it should be implemented according to Express.
		if (arg.length === 4) {
			self.error = arg;
		}

		self._app.use(arg);
	});

	return this;
};

Ninja.prototype.app = function Ninja$app() {

	this.kyoketsu();
	this.nagamaki();
	this._app.use(this.error);

	return this._app;
};

/**
 * http://en.wikipedia.org/wiki/Kyoketsu-shoge
 *
 * Tries to find the path to the Budo. By default it will look
 * in the base directory where the application resides.
 * Optionally a full path may be provided.
 */
Ninja.prototype.kyoketsu = function Ninja$kyoketsu() {

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
Ninja.prototype.kaginawa = function Ninja$kaginawa(type, loadedFile, loadedMethod) {

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
Ninja.prototype.kusarigama = function Ninja$kusarigama(verb, route) {

	var self = this;
	if (this.middleware) {
		this.middlewareMethods.forEach(function(method) {
			try {
				self._app[verb](route[verb], self.middleware[method]);
			} catch (err) {
				throw new Error('Are you sure this method "' + method + '" exists? - Check you Budo.');
			}
		});
	}

	this._app[verb](route[verb], this.control[route.run]);

};


/**
 * http://en.wikipedia.org/wiki/Naginata
 *
 * Identifies the HTTP verb you are trying to use.
 * You may define any valid HTTP verb in your Budo.
 */
Ninja.prototype.naginata = function Ninja$naginata(route) {

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
Ninja.prototype.nagamaki = function Ninja$nagamaki() {

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


module.exports = {

	with: function (express, appPath) {
		return new Ninja(express, appPath);
	}

};
