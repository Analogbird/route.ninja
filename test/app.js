var express = require('express'),
	app = express(),
	Ninja = require('route.ninja');

	new Ninja(app);
	//new Ninja(app, __dirname + '/budo.json');

app.listen(7021);
