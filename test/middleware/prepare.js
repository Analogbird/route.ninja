
module.exports = {

	filter : function(req, res, next) {

		// Do anything you need here
		req.ninja = {
			filtered: ' Filtered '
		};
		
		return next();

	},
	
	validate : function(req, res, next) {

		// Do anything you need here
		req.ninja.validated = '& Validated';

		return next();

	}
	
};
