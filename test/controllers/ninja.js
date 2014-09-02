
module.exports = {

	age : function(req, res, next) {

		// Just testing the error handler
		return next('{ code: 404, message: "Sorry, I cannot tell you may age."}')

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

	}

};
