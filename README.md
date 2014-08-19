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


The best -and easiest- way to manage your routes in your Nodejs &amp; Express applications.

The Ninja used this logo was kindly provided by <a href="http://pixabay.com/en/users/Nemo/" target="_blank">Nemo @ Pixabay</a>


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
new Ninja(app, budo[optional])
```

The `app` parameter is the actual `app` you get from Express, `budo` is the path to the file which defines your Ninja's rules. By default, your `Ninja` will try to find it's `budo` in the base directory where your application resides.


And now, you can do something like this:

```
var express = require('express'),
	app = express(),
	Ninja = require('route.ninja');
	
	new Ninja(app);

app.listen(3000);
```

### Define your budo (routing logic)
```
/ˈbuːdəʊ/

	Budo is the code on which martial arts are all based.
```


As in any martial arts style, your Ninja requires a `budo`. You can create a `budo` file and tell your `Ninja` how to route the traffic for your application based on those rules:

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

* Make a GET request to your web server with the (relative) URL `/person`,
* Your Express application should respond to this call using the `people` method, found in the `human.js` file. Your `budo` would look like this:

```
{
	"routes": [
		{
			"get": "/person",
			"run": "people",
			"from": "human"
		}
	]
}
```

In Express syntax, this would translate into:

```
var express = require('express'),
	app = express(),
	human = require('human');

app.get('/person', human.people);

app.listen(3000);
```



### Routing through middleware

In some cases, you will want to run some middleware before your actual method. You can also define this in your `budo` and the `Ninja` will take care of it. Middleware is useful when you want to, for example, filter, validate or process any incoming data.

```
{
	"process": "middleware",
	"routes": [
		{
			"get": "/person",
			"run": "people",
			"from": "human",
			"via": [
				"process.filter",
				"process.validate"
			]
		}
	]
}
```

So, let's elaborate:

* The `process` property must not be called `process`, you can call it anything you like. This will just tell the `Ninja` which file holds the methods you want to run. In this case the methods are to be found in the `middleware.js` file.
* The `route` object now holds an extra property; `via`, this tells the `Ninja` to run these methods before actually running the `people` method. This is also where you reference the `process` you defined before. Middleware is run in the same order as in the array. 

Again, in Express syntax, this would translate into:

```
var express = require('express'),
	app = express(),
	process = require('middleware')
	human = require('human');

app.get('/person', process.filter, process.validate, human.people);

app.listen(3000);
```
























