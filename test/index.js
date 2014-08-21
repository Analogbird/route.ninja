'use strict';

require('should');

var request = require('supertest'),
	express = require('express'),
	bodyParser = require('body-parser'),
	ninja = require('../lib/ninja.js').with(express, __dirname),
	app;

	ninja.use(bodyParser.json());
	app = ninja.app();

describe('route.ninja', function () {

	describe('#HTTP GET - Ninja style', function () {
		it('Should return 200 and a text', function (done) {
			request(app)
				.get('/style')
				.expect(200, 'Shotokan Karate is my favourite style.')
				.end(function(err, res) {
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
					done();
				});
		});
	});

});
