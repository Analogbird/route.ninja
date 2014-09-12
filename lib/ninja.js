"use strict";

Array.prototype.insert = function (index, item) {
	this.splice(index, 0, item);
};

Array.prototype.contains = function(element) {

	var items = this.length;
	while (items--) {
		if (this[items] === element) {
			return true;
		}
	}

	return false;
};

Array.prototype.hasAnyOf = function(elements) {

	var verb,
		element;

	for (verb in this) {
		if (this.hasOwnProperty(verb)) {
			for (element in elements) {
				if (elements.hasOwnProperty(element)) {
					if (this[verb].trim() === elements[element]) {
						return true;
					}
				}
			}
		}
	}

	return false;
};


/**
 * http://en.wikipedia.org/wiki/Ninja
 * Stefan Aichholzer <play@analogbird.com>
 * We fly light.
 */
var path = require('path'),
	timeout = require('connect-timeout'),
	Ninja = function(express, appPath) {

		this._app = express();
		this.appPath = appPath || path.resolve(__dirname, '../../../');
		this.control = this.middleware = null;
		this.middlewareMethods = [];
		this.error = function(err, req, res, next) {
			res.status(404).send({
					status: 404,
					message: 'You should define your own error function. Look for the Ninja and read the Express documentation.'
				}
			);
		}

		/**
		 * In case timeout is expected to be used, then let's check
		 * if the process has not timed out before the next middle ware.
		 */
		this.timeoutHandler = function checkTimeOut (req, res, next) {
			if (!req.timedout) {
				return next();
			}
		};

		return this;
	};

Ninja.prototype.timeout = function Ninja$timeout (time) {

	this._timeout = timeout(isFinite(time) ? time : 3000);
	return this;

};

Ninja.prototype.use = function Ninja$use () {

	var self = this,
		args = Array.prototype.slice.call(arguments);

	/**
	 * Since "timeout" is being used as a top-level middleware
	 * we need to make sure the proper event handler is used after
	 * each middleware.
	 */
	if (args.length > 0 && self._timeout) {
		args.insert(0, self._timeout);

		for (var out = 2; out < args.length+1; out++) {
			if (out % 2 === 0) {
				args.insert(out, self.timeoutHandler);
			}
		}
	}

	args.forEach(function(arg) {

		// Intercept the custom error function as it should be implemented according to Express.
		if (arg.length === 4) {
			self.error = arg;
		} else {
			self._app.use(arg);
		}

	});

	return this;
};

Ninja.prototype.app = function Ninja$listen () {

	this.kyoketsu();
	this.nagamaki();
	this._app.use(this.error);

	return this._app;
};

Ninja.prototype.listen = function Ninja$listen (port) {

	this.app();
	this._app.listen(port);
};


/**
 * http://en.wikipedia.org/wiki/Kyoketsu-shoge
 *
 * Tries to find the path to the Budo. By default it will look
 * in the base directory where the application resides.
 * Optionally a full path may be provided.
 */
Ninja.prototype.kyoketsu = function Ninja$kyoketsu () {

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
Ninja.prototype.kaginawa = function Ninja$kaginawa (type, loadedFile, loadedMethod) {

	try {
		switch (type) {
			case 'control': this.control = require((this.appPath + '/' + loadedFile).replace('//', '/'));
				break;

			case 'middleware':
				loadedFile = (this.budo[loadedFile]) ? this.budo[loadedFile] : loadedFile;
				this.middleware = require((this.appPath + '/' + loadedFile).replace('//', '/'));
				break;
		}
	} catch (err) {
		console.log(err);
		throw new Error('I cannot find the middleware or controller you are looking for.');
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
Ninja.prototype.kusarigama = function Ninja$kusarigama (verbs, route) {

	var self = this,
		paths;

	if (this.middleware) {
		this.middlewareMethods.forEach(function(method) {
			try {
				verbs.requestVerbs.forEach(function(verb) {
					verb = verb.trim();
					self._app[verb](route[verbs.requestReference], self.middleware[method]);
				});
			} catch (err) {
				throw new Error('Are you sure this method "' + method + '" exists? - Check you Budo.');
			}
		});
	}

	verbs.requestVerbs.forEach(function(verb) {
		verb = verb.trim();
		paths = route[verbs.requestReference].split(',');
		paths.forEach(function(path) {
			self._app[verb](path.trim(), self.control[route.run]);
		});
	});

};


/**
 * http://en.wikipedia.org/wiki/Naginata
 *
 * Identifies the HTTP verb you are trying to use.
 * You may define any valid HTTP verb in your Budo.
 */
Ninja.prototype.naginata = function Ninja$naginata (route) {

	var verbs = ['get', 'post', 'put', 'delete', 'head', 'options', 'patch', 'trace', 'connect'],
		requestVerbs;

	// Find the verb or verbs and return it (them) as an object.
	for (var property in route) {
		requestVerbs = property.split(',');
		if (requestVerbs.hasAnyOf(verbs)) {
			return {
				requestReference: property,
				requestVerbs: requestVerbs
			};
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
Ninja.prototype.nagamaki = function Ninja$nagamaki () {

	var self = this,
		verb,
		control,
		components;

	this.budo.routes.forEach(function(route) {

		verb = self.naginata(route);
		if (!verb) {
			throw new Error('I do not know what you want me to do. Please specify a valid HTTP verb.');
		}

		components = route.run.split('.');
		if (components[1]) {
			route.from = components[0];
			route.run = components[1];
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
