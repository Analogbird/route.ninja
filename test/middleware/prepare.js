
module.exports = {

	filter : function(req, res, next) {

		// Just print a text to test this middleware
		console.log('Filtered');
		return next();

	},
	
	validate : function(req, res, next) {

		// Just print a text to test this middleware
		console.log('Validated');
		return next();

	},

	terminate : function(req, res, next) {

		// Just print a text to test this middleware
		console.log('Terminated');
		return next();

	}
	
};
