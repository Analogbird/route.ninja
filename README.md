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

The best -and easiest- way to manage your routes in your Nodejs &amp; Express applications.


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

Install your `Ninja`:

```
npm install route.ninja
```

Require your `Ninja`:

```
var ninja = require('route.ninja');
```

Summon your `Ninja`:

```
new Ninja(app [, APP_PATH])
```

The `app` parameter is the actual `app` you get from Express, `APP_PATH` is the path to the where you application resides. By default, your `Ninja` will try to find the directory where your application resides but it is recommended that you pass this value. You can easily do this with: `__dirname`.


And now, you are ready to do something like this:

```
var express = require('express'),
	app = express(),
	Ninja = require('route.ninja');
	
	new Ninja(app, __dirname);

app.listen(3000);
```

### Define your budo (routing logic)
```
/ˈbuːdəʊ/

	Budo is the code on which martial arts are all based.
```


As in any martial arts style, your Ninja requires a `budo`. You can create a `budo.json` file and tell your `Ninja` how to route the traffic for your application based on those rules:

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



### Upcoming features

##### Use middleware in a route without predefining it
```
{
	"get": "/style",
	"run": "style",
	"from": "/controllers/ninja",
	"via": [
		"/middleware/prepare.filter",
		"/middleware/prepare.validate"
	]
}
```

##### Multiple HTTP verbs for the same route
```
{
	"get, post, put": "/style",
	"run": "style",
	"from": "/controllers/ninja"
}
```

##### Multiple routes for the same HTTP verb
```
{
	"get": "/style, /technique, /doctrine",
	"run": "style",
	"from": "/controllers/ninja"
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















