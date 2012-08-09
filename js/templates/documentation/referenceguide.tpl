<aside id="toc">
	<nav>
		<div id="toc_title">
			Table of Contents
		</div>
		<ul>
			<li>
				<a href="#version">
					Hydra.version
				</a>
			</li>
			<li>
				<a href="#action">
					Hydra.action
				</a>
			</li>
			<li>
				<a href="#listen">
					Hydra.action.listen
				</a>
			</li>
			<li>
				<a href="#notify">
					Hydra.action.notify
				</a>
			</li>
			<li>
				<a href="#listen">
					Hydra.action.stopListen
				</a>
			</li>
			<li>
				<a href="#errorHandler">
					Hydra.errorHandler
				</a>
			</li>
			<li>
				<a href="#setErrorHandler">
					Hydra.setErrorHandler
				</a>
			</li>
			<li>
				<a href="#module">
					Hydra.module
				</a>
			</li>
			<li>
				<a href="#setVars">
					Hydra.module.setVars
				</a>
			</li>
			<li>
				<a href="#getVars">
					Hydra.module.getVars
				</a>
			</li>
			<li>
				<a href="#register">
					Hydra.module.register
				</a>
			</li>
			<li>
				<a href="#module_extend">
					Hydra.module.extend
				</a>
			</li>
			<li>
				<a href="#start">
					Hydra.module.start
				</a>
			</li>
			<li>
				<a href="#startAll">
					Hydra.module.startAll
				</a>
			</li>
			<li>
				<a href="#isModuleStarted">
					Hydra.module.isModuleStarted
				</a>
			</li>
			<li>
				<a href="#stop">
					Hydra.module.stop
				</a>
			</li>
			<li>
				<a href="#stopAll">
					Hydra.module.stopAll
				</a>
			</li>
			<li>
				<a href="#setDebug">
					Hydra.setDebug
				</a>
			</li>
			<li>
				<a href="#extend">
					Hydra.extend
				</a>
			</li>
			<li>
				<a href="#noConflict">
					Hydra.noConflict
				</a>
			</li>
		</ul>
	</nav>
</aside>
<div id="doc_content">
<div>
	<h2 id="reference_guide">
		Reference guide
	</h2>
	<h3 id="version">Hydra.version</h3>
	<p>
		Version attribute returns Hydra version.
	</p>
	<div>
		Sample of usage:
	</div>
	<div>
		<pre><code class="language-javascript">var sVersion = Hydra.version;</code></pre>
	</div>
</div>
<div>
	<div>
		<h3 id="action">Hydra.action</h3>
		<p>
			Is the Mediator object that manages the event handling system that allows to communicate modules with each other without know about the existence of other modules.
		</p>
		<div>
			Sample of usage:
		</div>
		<div>
			<pre><code class="language-javascript">var oAction = new Hydra.action();</code></pre>
		</div>
	</div>
	<div>
		<h4 id="listen">Hydra.action.listen</h4>
		<p class="h4">
			Method to start listening events, this method is used internally when <em>init</em> method is executed but it can be used while developing if needed.
		</p>
		<div class="tip">
			Tip: You can create classes that will act when an event is triggered or create your own pub/sub subsystem.
		</div>
		<div class="h4">
			Sample of usage:
		</div>
		<div>
			<pre><code class="language-javascript">// handler is the method/function that will be called when the event is triggered.
// instance is the module object instance but it could be any object where you want to add a pub/sub
// subsystem

new Hydra.action().listen(['event1', 'event2'], handler, instance);</code></pre>
		</div>
	</div>
	<div>
		<h4 id="notify">Hydra.action.notify</h4>
		<p class="h4">
			Method to trigger an event. Events are used to communicate between modules.
		</p>
		<p class="h4">
			Notify method needs at least one object with a 'type' property that must be the name of the event we want to be triggered.
		</p>
		<div class="h4">
			Sample of Notify objects:
		</div>
		<br>>
		<div class="h4">
			The minimum object to notify an event.
		</div>
		<div>
			<pre><code class="language-javascript">var oNotify = {
	type: 'event-to-be-triggered'
};</code></pre>
		</div>
		<div class="h4">
			The most common object to notify an event, sends an object with data.
		</div>
		<div>
			<pre><code class="language-javascript">var oNotify = {
	type: 'event-to-be-triggered',
	data: {
		test: 'hello'
	}
};</code></pre>
		</div>
		<div class="h4">
			Sample of usage:
		</div>
		<div>
			<pre><code class="language-javascript">new Hydra.action().notify({ type: 'event-to-be-triggered', data: { test: 'hello'} });</code></pre>
		</div>
	</div>
	<div>
		<h4>Hydra.action.stopListen</h4>
		<p class="h4">
			Method to stop listening events, this method is used internally when <em>destroy</em> method is executed when <em>stop</em> module is executed but it can be used while developing if needed.
		</p>
		<div class="h4">
			Sample of usage
		</div>
		<div>
			<pre><code class="language-javascript">new Hydra.action().stopListen(['event1', 'event2'], instance);</code></pre>
		</div>
	</div>
</div>
<div>
	<h3 id="errorHandler">Hydra.errorHandler</h3>
	<p>
		Returns the instance of ErrorHandler that will be used to log errors while developing.
	</p>
	<div>
		Sample of usage
	</div>
	<div>
		<pre><code class="language-javascript">var oErrorHandler = Hydra.errorHandler();
oErrorHandler.log('This is an error');</code></pre>
	</div>
</div>
<div>
	<h3 id="setErrorHandler">Hydra.setErrorHandler</h3>
	<p>
		Change the ErrorHandler for a new one.
	</p>
	<div>
		Sample of usage
	</div>
	<div>
		<pre><code class="language-javascript">Hydra.setErrorHandler( NewErrorHandler );</code></pre>
	</div>
</div>
<div>
	<div>
		<h3 id="module">Hydra.module</h3>
		<p>
			Is the Module object that manages all the module actions as registering, starting, stopping modules.
		</p>
	</div>
	<div>
		<h4 id="setVars">Hydra.module.setVars</h4>
		<p class="h4">
			Method to set instance modules scope variables to avoid pollute globals.
		</p>
		<div class="h4">
			Sample of usage
		</div>
		<div>
			<pre><code class="language-javascript">Hydra.module().setVars( { test:'test' } );</code></pre>
		</div>
	</div>
	<div>
		<h4 id="getVars">Hydra.module.getVars</h4>
		<p class="h4">
			Method to get instance modules scope variables.
		</p>
		<div class="h4">
			Sample of usage
		</div>
		<div>
			<pre><code class="language-javascript">var oVars = Hydra.module().getVars();</code></pre>
		</div>
	</div>
	<div>
		<h4 id="register">Hydra.module.register</h4>
		<p class="h4">
			Method to register a module that could be used in your application.
		</p>
		<div class="h4">
			Sample of usage
		</div>
		<div>
			<pre><code class="language-javascript">Hydra.module().register("module-name", function (action) {
	return {
		oEventsCallbacks: {
			'user-clicks-button': function (oNotify) {
				this._logClick(oNotify.sButtonType);
			}
		},
		_logClick: function(sButtonType) {
			console.log("User clicked a ' + sButtonType + ' button");
		},
		init: function() {
			// Code that will be executed when this module is started.
		}
	};
});</code></pre>
		</div>
	</div>
	<div>
		<h4 id="module_extend">Hydra.module.extend</h4>
		<p class="h4">
			Module extension in Hydra.js could be used in two different ways:
		</p>
		<ul>
			<li>
				Overwrite module.
			</li>
			<li>
				Copy the module as a new module.
			</li>
		</ul>
		<div class="h4">
			Sample of how to extend a module overwriting behaviour:
		</div>
		<div>
			<pre><code class="language-javascript">// Base module will alert 'hello world!" when started.

Hydra.module.register( 'my-first-module', function(){
	return {
		init: function()
		{
			alert("hello world!");
		}
	};
});

// Extending a module in this way will make that when starting 'my-first-module' the message
// that will be alerted is 'Yorolei!'.

Hydra.module.extend( 'my-first-module', function(){
	return {
		init: function()
		{
			alert("Yorolei!");
		}
	};
});</code></pre>
		</div>
		<div class="h4">
			Sample of how to extend a module copying it as a new module:
		</div>
		<div>
			<pre><code class="language-javascript">// Base module will alert 'hello world!" when started.

Hydra.module.register( 'my-first-module', function(){
	return {
		init: function()
		{
			alert("hello world!");
		}
	};
});

// Extending a module in this way will make a copy of 'my-first-module' module with a new name
// that could be started as a normal module. You get two modules, the base module that will remains
// untouched and a new one to use it as you want.
// Starting 'my-first-module' you will get an alert with 'hello world!' and if you start
// 'copy-first-module' you will get an alert with 'Yorolei!'.

Hydra.module.extend( 'my-first-module', 'copy-first-module', function(){
	return {
		init: function()
		{
			alert("Yorolei!");
		}
	};
});</code></pre>
		</div>
	</div>
	<div>
		<h4 id="start">Hydra.module.start</h4>
		<p class="h4">
			Executes the init method in a module to start it, and now it will start listening events if some of them have been defined. Hydra.js is a multi-instance module system this is the reason you will need to add a single id for each instance when starting a module.
			When you start a module you can pass a third parameter that will be sent to init when executed to be used inside init method.
		</p>
		<div class="h4">
			Sample of starting a module (without parameters):
		</div>
		<div>
			<pre><code class="language-javascript">Hydra.module.start('my-fist-module', 'my-first-instance-id');</code></pre>
		</div>
		<div class="h4">
			Sample of starting a module (with parameters):
		</div>
		<div>
			<pre><code class="language-javascript">Hydra.module.start('my-fist-module', 'my-first-instance-id', { data: 'test' });</code></pre>
		</div>
	</div>
	<div>
		<h4 id="startAll">Hydra.module.startAll</h4>
		<p class="h4">
			Start all the modules that are registered, one instance per module. The id for these instances are autogenerated.
		</p>
		<div class="h4">
			Sample of usage
		</div>
		<div>
			<pre><code class="language-javascript">Hydra.module().startAll();</code></pre>
		</div>
	</div>
	<div>
		<h4 id="isModuleStarted">Hydra.module.isModuleStarted</h4>
		<p class="h4">
			Check if the instance of one module has been started. Returns true or false.
		</p>
		<div class="h4">
			Sample of usage
		</div>
		<div>
			<pre><code class="language-javascript">Hydra.module().isModuleStarted("module-name", "instance-module");</code></pre>
		</div>
	</div>
	<div>
		<h4 id="stop">Hydra.module.stop</h4>
		<p class="h4">
			Stops the instance of the module to destroy the instance.
		</p>
		<div class="h4">
			Sample of usage
		</div>
		<div>
			<pre><code class="language-javascript">Hydra.module().stop("module-name", "instance-module");</code></pre>
		</div>
	</div>
	<div>
		<h4 id="stopAll">Hydra.module.stopAll</h4>
		<p class="h4">
			Stops all the instances of all modules that that have been started in the application.
		</p>
		<div class="h4">
			Sample of usage
		</div>
		<div>
			<pre><code class="language-javascript">Hydra.module().stopAll();</code></pre>
		</div>
	</div>
</div>
<div>
	<h3 id="setDebug">Hydra.setDebug</h3>
	<p>
		Hydra.js wraps all the module methods to avoid that an error in one module make fails the app if debug mode is off<br>
		If you have an error and make you drive crazy and you need to see your code fail, then you must set debug mode on.<br>
	</p>
	<div>
		Set debug mode off:
	</div>
	<div>
		<pre><code class="language-javascript">Hydra.setDebug( false );</code></pre>
	</div>
	<div>
		Set debug mode on:
	</div>
	<div>
		<pre><code class="language-javascript">Hydra.setDebug( true );</code></pre>
	</div>
</div>
<div>
	<h3 id="extend">Hydra.extend</h3>
	<p>
		Method to extend Hydra.js framework with new features.
	</p>
	<div>
		Sample of usage:
	</div>
	<div>
		<pre><code class="language-javascript">Hydra.extend("extension", {
	"hello_world": function (){
		alert("hello world!");
	}
});

//How to use after extend Hydra.js
Hydra.extension.hello_world()		</code></pre>
	</div>
</div>
<div>
	<h3 id="noConflict">Hydra.noConflict</h3>
	<p>
		Method to create alias for the elements of Hydra.js.
	</p>
	<div>
		Sample of usage:
	</div>
	<div>
		<pre><code class="language-javascript">// To maintain compatibility with previous versions.
Hydra.noConflict("module", "Core", window);
Hydra.noConfict("action", "Sandbox", window);

//Now you can use Core and Sandbox when coding
Core.register('module-name', function (action)
{
	return {
		init: function ()
		{
			// Some code
		}
	};
});
var oSandbox = new Sandbox();</code></pre>
	</div>
</div>
</div>