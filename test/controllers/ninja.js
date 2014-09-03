'use strict';


var errorGenerator = function errorGenerator (message, code, status) {

	var error = new Error(message || 'Page not found');

	error.status = status || 404;
	error.code = code || '';

	return error;

};

module.exports = {

	age : function(req, res, next) {

		// Just testing the error handler
		return next(errorGenerator('Sorry, I cannot tell you may age.'));

	},
	
	style : function(req, res, next) {

		res.send('Shotokan Karate is my favourite style.');

	},
	
	weapon : function(req, res, next) {

		var response = 'Kusarigama is my favourite weapon.'; 
		response += req.ninja.filtered || ' - Unfiltered';
		response += req.ninja.validated || ' - Unvalidated';
		
		res.send(response);

	},

	legend : function(req, res, next) {

		res.send('I received the legend: ' + req.body.legend.trim());

	},

	timeout : function(req, res, next) {

		setTimeout(function() {
			if (!req.timedout) {
				res.status(200).end();
			}
		},  5000);

	}

};
