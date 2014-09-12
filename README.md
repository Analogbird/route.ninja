<div align="center" style="margin:30px 0 40px">
	<img src="http://www.analogbird.com/static/img/playground/routeninja.png"/>
</div>


route.ninja
===============
```
/ˈnɪndʒə/
	
	noun: ninja; plural noun: ninjas
	A person who excels in a particular skill or activity.
```

[![Build Status](https://travis-ci.org/analogbird/route.ninja.svg)](https://travis-ci.org/analogbird/route.ninja)
[![Dependencies](https://david-dm.org/analogbird/route.ninja.png)](https://david-dm.org/analogbird/route.ninja)

The best -and easiest- way to manage your routes in your Nodejs & Express applications.

`
You can cut to the chase and take a look at the test application (in the test directory) 
`


### Usage

Usually, when using `Express` you would find yourself doing something like this:

```
var express = require('express'),
	app = express();

app.get('/', function(req, res) {
	res.send('I am not as good as a Ninja.');
});

app.listen(3000);
```

which, if you have a lot of routes, can become quite a painful spaghetti sort of thing, and we have all been there.


### Enter the Ninja

Install the `Ninja`:

```
npm install route.ninja
```

Require and summon the `Ninja`:

```
var ninja = require('route.ninja').with(express[, APP_PATH])
```

The `express` parameter is the actual `Express` library, `APP_PATH` is the path where you application resides. By default, the `Ninja` will try to find the directory where your application resides but it's recommended that you pass this value. You can easily do this with: `__dirname`.

Since version `0.0.20` the Ninja has support for [timeout](https://github.com/expressjs/timeout) built right into it. You do not need to worry about installing the module or anything else, just tell the Ninja to use it:

```
var ninja = require('route.ninja').with(express[, APP_PATH]).timeout([time])
```

`time`; time in milliseconds. Defaults to 3000. It can also be a string accepted by the [ms](https://www.npmjs.org/package/ms#readme) module.

And now, you are ready to do something like this:

```
var express = require('express'),
	ninja = require('route.ninja').with(express, __dirname).timeout(),
	app = ninja.app();

app.listen(3000);
```

You can also have the `Ninja` use any `Express` middleware, such as, for example; `body-parser`, `cookie-parser` or `express-session`:

```
var express = require('express'),
	bodyParser = require('body-parser')
	cookieParser = require('cookie-parser'),
	ninja = require('route.ninja'),
	app;

ninja.with(express, __dirname);
ninja.timeout();
ninja.use(bodyParser.json());
ninja.use(cookieParser());

/**
 * You could also chain the "use" method:
 * ninja.use(bodyParser.json()).use(cookieParser());
 *
 * Or simply pass each middleware as an argument to "use":
 * ninja.use(bodyParser.json(), cookieParser());
 */
 
/**
 * And, of course, you should not forget about your error handler.
 * If you do not provide an error handler the Ninja will use it's very basic own.
 * (Personally, I prefer named functions for the sake of debugging)
 */
ninja.use(function errorHandler (err, req, res, next) {
	res.status(404).send('Something went wrong on my side.');
});

app = ninja.app();

app.listen(3000);
```


### Define your budo (routing logic)
```
/ˈbuːdəʊ/

	Budo is the code on which martial arts are all based.
```


As in any martial arts style, the Ninja requires a `budo`. You can create a `budo.json` file and tell the `Ninja` how to route the traffic for your application based on those rules:

```
{
	"routes": [
		{
			"<THE HTTP VERB>": "<YOUR RELATIVE URL>",
			"run": "<THE METHOD TO USE FOR THIS URL CALL>",
			"from": "<THE RELATIVE LOCATION OF THE METHOD'S DEFINITION>"
		}
	]
}
```

Let’s illustrate things a little. Say, for example, you want to:

* Make a GET request to your web server with the (relative) URL `/style`,
* Your Express application should respond to this call using the `style` method, found in the `/controllers/ninja (/controllers/ninja.js)` file. Your `budo` would look like this:

```
{
	"routes": [
		{
			"get": "/style",
			"run": "style",
			"from": "/controllers/ninja"
		}
	]
}
```

**Note:** All files where your code/methods are defined must be referenced relavitely to your application. In the above example; the file `ninja.js` resides in the `controllers` directory, which -in turn- resides at the same level as you application. 

In Express syntax, this would translate into:

```
var express = require('express'),
	app = express(),
	ninja = require('./controllers/ninja');

app.get('/style', ninja.style);

app.listen(3000);
```



### Routing through middleware

In some cases, you will want to run some middleware before your actual method. You can also define this in your `budo.json` file and the `Ninja` will take care of it. Middleware is useful, for example, when you want to filter, validate or process any incoming data.

```
{
	"pre": "/middleware/prepare",
	"routes": [
		{
			"get": "/style",
			"run": "style",
			"from": "/controllers/ninja",
			"via": [
				"pre.filter",
				"pre.validate"
			]
		}
	]
}
```

So, let's elaborate:

* The `pre` property must not be called `pre`, you can call it anything you like. This will just tell the `Ninja` which file holds the methods you want to run as middleware. In this case the methods are to be found in the `/middleware/prepare (/middleware/prepare.js)` file.
* The `route` object now holds an extra property; `via`, this tells the `Ninja` to run these methods before actually running the `style` method. This is also where you reference the `pre` you defined before. Your middleware will be run in the same order as specified in the array.

Again, in Express syntax, this would translate into:

```
var express = require('express'),
	app = express(),
	pre = require('./middleware/prepare')
	ninja = require('./controllers/ninja');

app.get('/style', pre.filter, pre.validate, ninja.style);

app.listen(3000);
```



### Some basic examples using the new (short) syntax

#### Simplified way of running functions
```
{
	"get": "/style",
	"run": "/controllers/ninja.style"
}
```

##### Use middleware in a route without predefining it
```
{
	"get": "/style",
	"run": "/controllers/ninja.style",
	"via": [
		"/middleware/prepare.filter",
		"/middleware/prepare.validate"
	]
}
```

##### Multiple routes for the same HTTP verb
```
{
	"get": "/style, /technique, /doctrine",
	"run": "/controllers/ninja.style"
}
```

##### Multiple HTTP verbs for the same route
```
{
	"get, post, put": "/style",
	"run": "/controllers/ninja.style"
}
```

##### All of the above combined
```
{
	"get, post, put": "/style, /technique, /doctrine",
	"run": "style",
	"from": "/controllers/ninja",
	"via": [
		"/middleware/prepare.filter",
		"/middleware/prepare.validate"
	]
}
```





<p>&nbsp;</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
The Ninja used this logo was kindly provided by <a href="http://pixabay.com/en/users/Nemo/" target="_blank">Nemo @ Pixabay</a>
