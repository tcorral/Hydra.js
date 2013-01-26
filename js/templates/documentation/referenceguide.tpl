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
                <a href="#bus">
                    Hydra.bus
                </a>
            </li>
            <li>
                <a href="#subscribe">
                    Hydra.bus.subscribe
                </a>
            </li>
            <li>
                <a href="#subscribeTo">
                    Hydra.bus.subscribeTo
                </a>
            </li>
            <li>
                <a href="#publish">
                    Hydra.bus.publish
                </a>
            </li>
            <li>
                <a href="#unsubscribe">
                    Hydra.bus.unsubscribe
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
                <a href="#getDebug">
                    Hydra.getDebug
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
        Version property returns Hydra version.
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
        <h3 id="bus">Hydra.bus</h3>

        <p>
            Is the Mediator object that manages the event handling system that allows to communicate modules with each
            other without know about the existence of other modules.
        </p>
    </div>
    <div>
        <h4 id="subscribe">Hydra.bus.subscribe</h4>

        <p class="h4">
            The method to start listening events in one defined channel, this method is used internally when “init”
            method is executed but it can be used while developing if needed.
        </p>

        <div class="tip">
            Tip: You can create classes that will act when an event is triggered or create your own pub/sub subsystem.
        </div>
        <div class="h4">
            Sample of usage:
        </div>
        <div>
			<pre><code class="language-javascript">// The only thing that is needed is a property object named 'events' with event names as keys,
// and values that are callbacks to execute when the event is triggered.

Hydra.module().register( "module-name", function ( bus ) {
    return {
        events: {
            'channel': {
                'item:action': function ( oData ) {
                    this._logClick(oData.sButtonType);
                }
            }

        },
        _logClick: function( sButtonType ) {
            console.log("User clicked a ' + sButtonType + ' button");
        },
        init: function() {
            // The subscribing is done my Hydra.js
        }
    };
});
</code></pre>
        </div>
        <div>
            Using it in a class implementing Hydra.bus.subscribe
        </div>
        <div>
            <pre><code class="language-javascript">var ProgressBar = function () {
    this.events = {
        'download': {
            'progress': function (nProgress)
            {
                this.update(nProgress);
            }
        }
    };
    this.nProgress = 0;
    // Starts listening events in channel 'download'
    Hydra.bus.subscribe( this );
};
ProgressBar.prototype.update = function (nProgress) {
    this.nProgress = nProgress;
};</code></pre>
        </div>
    </div>
    <div>
        <h4 id="subscribeTo">Hydra.bus.subscribeTo</h4>

        <p class="h4">
            Method to subscribe one callback to one channel and event.
        </p>

        <p class="h4">
            This method requires four parameters:
            <ol>
                <li>
                    Channel name {String}
                </li>
                <li>
                    Event name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{String}
                </li>
                <li>
                    Callback&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Function}
                </li>
                <li>
                    Subscriber&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Module or Class}
                </li>
            </ol>
        </p>

        <div class="h4">
            Sample of usage:
        </div>
        <div>
            <pre><code class="language-javascript">Hydra.module().register( "module-name", function ( bus ) {
    return {
        sName: 'John Doe',
        sayHi: function ()
        {
            alert( 'Hi!' + this.sName );
        },
        init: function () {
            // You can subscribe to one channel and event to one callback inside a module or class.
            // When the event 'item:action' is called in 'channel' channel an alert will be shown.
            bus.subscribeTo( 'channel', 'item:action', this.sayHi, this );
        }
    };
});</code></pre>
        </div>
    </div>
    <div>
        <h4 id="publish">Hydra.bus.publish</h4>

        <p class="h4">
            Method to trigger an event. Events are used to communicate between modules.
        </p>

        <p class="h4">
            Publish method needs at least two of the three parameters it expects. It needs to know the name of the
            channel and the name of the event. Third parameter is an optional object with data to pass to the actions.
        </p>

        <div class="h4">
            Sample of usage:
        </div>
        <div>
            <pre><code class="language-javascript">Hydra.module().register( "module-name", function ( bus ) {
	return {
		events: {
            'channel': {
                'item:action': function ( oData ) {
                    this._logClick(oData.sButtonType);
                }
            }
        },
        _logClick: function ( sButtonType ) {
            bus.publish( 'channel2', 'item2:action2', { test: 'hello' } );
        },
        init: function () {
            document.getElementById( 'button' ).addEventListener('click', function() {
                bus.publish( 'channel', 'item:action', { sButtonType: 'loginButton'} );
            });
        }
    };
});</code></pre>
        </div>
    </div>
    <div>
        <h4 id="unsubscribe">Hydra.bus.unsubscribe</h4>

        <p class="h4">
            Method to stop listening events in channels, this method should be used in onDestroy method and it will be
            executed when stop module is executed but it can be used while developing if needed.
        </p>

        <div class="h4">
            Sample of usage
        </div>
        <div>
            <pre><code class="language-javascript">Hydra.module().register( "module-name", function ( bus ) {
    return {
        events: {
            'channel_name': {
                'user-clicks-button': function ( oData ) {
                    this._logClick(oData.sButtonType);
                }
            }
		},
        _logClick: function( sButtonType ) {
            console.log("User clicked a ' + sButtonType + ' button");
        },
        init: function() {
        }
    };
});</code></pre>
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
        The method to set instance module's scope variables to avoid pollute global.
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
        Method to get instance module's scope variables.
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
		events: {
            'channel': {
                'button:click': function (oData) {
                    this._logClick(oData.sButtonType);
                }
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
        Module extension in Hydra could be used in two different ways:
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
        A sample of how to extend a module's overwriting behavior:
    </div>
    <div>
			<pre><code class="language-javascript">// Base module will alert 'hello world!" when started.

Hydra.module.register( 'my-first-module', function(){
	return {
		init: function() {
            alert( "hello world!" );
        }
    };
});

// Extending a module in this way will make that when starting 'my-first-module' the message
// that will be alerted is 'Yorolei!'.

Hydra.module.extend( 'my-first-module', function(){
    return {
        init: function() {
            alert( "Yorolei!" );
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
		init: function() {
			alert( "hello world!" );
		}
	};
});

// Extending a module in this way will make a copy of 'my-first-module' module with a new name
// that could be started as a normal module. You get two modules, the base module that will remain
// untouched and a new one to use it as you want.
// Starting 'my-first-module' you will get an alert with 'hello world!' and if you start
// 'copy-first-module' you will get an alert with 'Yorolei!'.

Hydra.module.extend( 'my-first-module', 'copy-first-module', function(){
	return {
		init: function() {
			alert( "Yorolei!" );
		}
	};
});</code></pre>
    </div>
</div>
<div>
    <h4 id="start">Hydra.module.start</h4>

    <p class="h4">
        Executes the “init” method in a module or modules to start it, and now it will start listening events if some
        of them have been defined. Hydra is a multi-instance module system this is the reason you will need to add a
        single id for each instance when starting a module. When you start a module you can pass a third parameter that
        will be sent to “init” when executed to be used inside “init” method.
    </p>

    <div class="h4">
        Sample of starting a single module (without id of the instance):
    </div>
    <div>
        <pre><code class="language-javascript">Hydra.module.start( 'my-fist-module' );</code></pre>
    </div>
    <div class="h4">
        Sample of starting a single module (without parameters):
    </div>
    <div>
        <pre><code class="language-javascript">Hydra.module.start( 'my-fist-module', 'my-first-instance-id' );</code></pre>
    </div>
    <div class="h4">
        Sample of starting a single module (with parameters):
    </div>
    <div>
        <pre><code class="language-javascript">Hydra.module.start( 'my-fist-module', 'my-first-instance-id', { data: 'test' } );</code></pre>
    </div>
    <div class="h4">
        Sample of starting a single module but a single instance (with parameters):
    </div>
    <div>
        <pre><code class="language-javascript">Hydra.module.start( 'my-fist-module', 'my-first-instance-id', { data:'test' }, true );</code></pre>
    </div>
    <div class="h4">
        Sample of starting more than one module at the same time (with parameters):
    </div>
    <div>
        <pre><code class="language-javascript">Hydra.module.start( [ 'my-first-module', 'my-second-module'],
            ['first-instance-id', 'second-instance-id'],
			[{data: 'test-for-module-1'}, {data: 'test-for-module-2'}],
            [false, false] );</code></pre>
    </div>
</div>
<div>
    <h4 id="startAll">Hydra.module.startAll</h4>

    <p class="h4">
        Start all the modules that are registered, one instance per module. The id for these instances are auto
        generated.
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
        Check if the instance of one module has been started. Returns a boolean value.
    </p>

    <div class="h4">
        Sample of usage
    </div>
    <div>
        <pre><code class="language-javascript">Hydra.module().isModuleStarted( "module-name", "instance-module" );</code></pre>
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
        <pre><code class="language-javascript">Hydra.module().stop( "module-name", "instance-module" );</code></pre>
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
        Hydra wraps all the module methods to avoid that an error in one module makes fails the app if debug mode is
        off.<br>
        If you have an error and make you drive crazy and you need to see your code fail, then you must set debug mode
        on.<br>
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
    <h3 id="getDebug">Hydra.getDebug</h3>

    <p>
        Hydra.getDebug method must be used to know if debug mode is on.<br>
        This method will help some implementations of debugging extensions.
    </p>

    <div>
        Get debug mode status.
    </div>
    <div>
        <pre><code class="language-javascript">Hydra.getDebug();</code></pre>
    </div>
</div>
<div>
    <h3 id="extend">Hydra.extend</h3>

    <p>
        Method to extend Hydra framework with new features.
    </p>

    <div>
        Sample of usage:
    </div>
    <div>
		<pre><code class="language-javascript">Hydra.extend( "extension", {
	"hello_world": function (){
		alert("hello world!");
	}
});

//How to use after extended Hydra.js
Hydra.extension.hello_world() </code></pre>
    </div>
</div>
<div>
    <h3 id="noConflict">Hydra.noConflict</h3>

    <p>
        A method to create an alias for the elements of Hydra.js.
    </p>

    <div>
        Sample of usage:
    </div>
    <div>
		<pre><code class="language-javascript">// Maintain compatibility with previous versions.
Hydra.noConflict("module", window, "Core" );
Hydra.noConfict("action", window, "Sandbox");

//Now you can use Core and Sandbox when coding.
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