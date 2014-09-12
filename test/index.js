'use strict';

require('should');

var request = require('supertest'),
	express = require('express'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	ninja = require('../lib/ninja.js').with(express, __dirname).timeout('3s'),
	app;

	ninja.use(
		cookieParser(),
		bodyParser.json(),
		function errorHandler (err, req, res, next) {
			res.status(err.status).end();
		}
	);

	app = ninja.app();

describe('route.ninja', function () {

	describe('#HTTP GET - Ninja style', function () {
		it('Should return 200 and a text', function (done) {
			request(app)
				.get('/style')
				.expect(200, 'Shotokan Karate is my favourite style.')
				.end(function(err, res) {
					if (err) {
						return done(err);
					}

					done();
				});
		});
	});

	describe('#HTTP POST - Ninja style', function () {
		it('Should return 200 and a text', function (done) {
			request(app)
				.post('/style')
				.expect(200, 'Shotokan Karate is my favourite style.')
				.end(function(err, res) {
					if (err) {
						return done(err);
					}

					done();
				});
		});
	});

	describe('#HTTP POST - Ninja technique', function () {
		it('Should return 200 and a text', function (done) {
			request(app)
				.post('/technique')
				.expect(200, 'Shotokan Karate is my favourite style.')
				.end(function(err, res) {
					if (err) {
						return done(err);
					}

					done();
				});
		});
	});

	describe('#HTTP PUT - Ninja doctrine', function () {
		it('Should return 200 and a text', function (done) {
			request(app)
				.post('/doctrine')
				.expect(200, 'Shotokan Karate is my favourite style.')
				.end(function(err, res) {
					if (err) {
						return done(err);
					}

					done();
				});
		});
	});

	describe('#HTTP PUT - Ninja style', function () {
		it('Should return 200 and a text', function (done) {
			request(app)
				.post('/style')
				.expect(200, 'Shotokan Karate is my favourite style.')
				.end(function(err, res) {
					if (err) {
						return done(err);
					}

					done();
				});
		});
	});

	describe('#HTTP PUT - Ninja style', function () {
		it('Should return 200 and a text', function (done) {
			request(app)
				.put('/style')
				.expect(200, 'Shotokan Karate is my favourite style.')
				.end(function(err, res) {
					if (err) {
						return done(err);
					}

					done();
				});
		});
	});


	describe('#HTTP GET - Ninja style using simplified Budo', function () {
		it('Should return 200 and a text', function (done) {
			request(app)
				.get('/simplestyle')
				.expect(200, 'Shotokan Karate is my favourite style.')
				.end(function(err, res) {
					if (err) {
						return done(err);
					}

					done();
				});
		});
	});

	describe('#HTTP GET - Ninja weapon (with middleware)', function () {
		it('Should return 200 and a text', function (done) {
			request(app)
				.get('/weapon')
				.expect(200, 'Kusarigama is my favourite weapon. Filtered & Validated')
				.end(function(err, res) {
					if (err) {
						return done(err);
					}

					done();
				});
		});
	});

	describe('#HTTP GET - Ninja weapon (with middleware) using simplified Budo', function () {
		it('Should return 200 and a text', function (done) {
			request(app)
				.get('/simpleweapon')
				.expect(200, 'Kusarigama is my favourite weapon. Filtered & Validated')
				.end(function(err, res) {
					if (err) {
						return done(err);
					}

					done();
				});
		});
	});

	describe('#HTTP POST - Ninja legend', function () {
		it('Should return 200 and a text', function (done) {
			request(app)
				.post('/legend')
				.send({ legend: 'Enter the dragon.'} )
				.expect(200, 'I received the legend: Enter the dragon.')
				.end(function(err, res) {
					if (err) {
						return done(err);
					}

					done();
				});
		});
	});

	describe('#GET - Undefined method', function () {
		it('Should return 404', function (done) {
			request(app)
				.get('/katana')
				.expect(404)
				.end(function(err, res) {
					if (err) {
						return done(err);
					}

					done();
				});
		});
	});

	describe('#GET - Does not exist, test the error handler', function () {
		it('Should return 404', function (done) {
			request(app)
				.get('/age')
				.expect(404)
				.end(function(err, res) {
					if (err) {
						return done(err);
					}

					done();;
				});
		});
	});

	describe('#GET - Timeout test', function () {
		it('Should return 503', function (done) {
			request(app)
				.get('/timeout')
				.expect(503)
				.end(function(err, res) {
					if (err) {
						return done(err);
					}

					done();
				});
		});
	});

	describe('#HTTP GET - Ninja technique', function () {
		it('Should return 200 and a text', function (done) {
			request(app)
				.get('/technique')
				.expect(200, 'Shotokan Karate is my favourite style.')
				.end(function(err, res) {
					if (err) {
						return done(err);
					}

					done();
				});
		});
	});

	describe('#HTTP GET - Ninja doctrine', function () {
		it('Should return 200 and a text', function (done) {
			request(app)
				.get('/doctrine')
				.expect(200, 'Shotokan Karate is my favourite style.')
				.end(function(err, res) {
					if (err) {
						return done(err);
					}

					done();
				});
		});
	});

});
