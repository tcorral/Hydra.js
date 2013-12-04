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
                <a href="#unsubscribeFrom">
                    Hydra.bus.unsubscribeFrom
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
                <a href="#module_decorate">
                    Hydra.module.decorate
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
                <a href="#setUnblockUI">
                    Hydra.setUnblockUI
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
            <li>
                <a href="#addExtensionBeforeInit">
                    Hydra.addExtensionBeforeInit
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
        Example of usage:
    </div>
    <div>
        <pre><code class="language-javascript">var sVersion = Hydra.version;</code></pre>
    </div>
</div>
<div>
    <div>
        <h3 id="bus">Hydra.bus</h3>

        <p>
            Is the Mediator object that manages the event handling system that allows modules to communicate with each
            other without knowing about the existence of other modules.
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
        <p class="h4">
            Example of usage:
        </p>
        <div>
			<pre><code class="language-javascript">// The only thing that is needed is a property object named 'events' with event names as keys,
// and values that are callbacks to execute when the event is triggered.

Hydra.module.register( "module-name", function ( Bus, Module, ErrorHandler, Api ) {
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

        <p class="h4">
            Example of usage:
        </p>
        <div>
            <pre><code class="language-javascript">Hydra.module.register( "module-name", function ( Bus, Module, ErrorHandler, Api ) {
    return {
        sName: 'John Doe',
        sayHi: function ()
        {
            alert( 'Hi!' + this.sName );
        },
        init: function () {
            // You can subscribe to one channel and event to one callback inside a module or class.
            // When the event 'item:action' is called in 'channel' channel an alert will be shown.
            Bus.subscribeTo( 'channel', 'item:action', this.sayHi, this );
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
            channel and the name of the event. The third parameter is an optional object with data to pass to the actions.
        </p>

        <p class="h4">
            Example of usage:
        </p>
        <div>
            <pre><code class="language-javascript">Hydra.module.register( "module-name", function ( Bus, Module, ErrorHandler, Api ) {
	return {
		events: {
            'channel': {
                'item:action': function ( oData ) {
                    this._logClick(oData.sButtonType);
                }
            }
        },
        _logClick: function ( sButtonType ) {
            Bus.publish( 'channel2', 'item2:action2', { test: 'hello' } );
        },
        init: function () {
            document.getElementById( 'button' ).addEventListener('click', function() {
                Bus.publish( 'channel', 'item:action', { sButtonType: 'loginButton'} );
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

        <p class="h4">
            Example of usage
        </p>
        <div>
            <pre><code class="language-javascript">Hydra.module.register( "module-name", function ( Bus, Module, ErrorHandler, Api ) {
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

    <div>
        <h4 id="unsubscribeFrom">Hydra.bus.unsubscribeFrom</h4>

        <p class="h4">
            Method to stop listening all the callbacks in one event and callback.
        </p>

        <p class="h4">
            This method requires three parameters:
            <ol>
                <li>
                    Channel name {String}
                </li>
                <li>
                    Event name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{String}
                </li>
                <li>
                    Subscriber&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Module or Class}
                </li>
            </ol>
        </p>

        <p class="h4">
            Example of usage:
        </p>
        <div>
            <pre><code class="language-javascript">Hydra.module.register( "module-name", function ( Bus, Module, ErrorHandler, Api ) {
    return {
        sName: 'John Doe',
        sayHi: function ()
        {
            alert( 'Hi!' + this.sName );
        },
        init: function () {
            // You can subscribe to one channel and event to one callback inside a module or class.
            // When the event 'item:action' is called in 'channel' channel an alert will be shown.
            Bus.subscribeTo( 'channel', 'item:action', this.sayHi, this );
            document.getElementById('button').addEventListener( 'click', function() {
                // When the button is clicked the listeners in 'channel' and 'item:action' of this
                // module will stop listening.
                Bus.unsubscribeFrom( 'channel', 'item:action', this );
            });
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
        Example of usage
    </div>
    <div>
		<pre><code class="language-javascript">var oErrorHandler = Hydra.errorHandler();
oErrorHandler.log('This is a debug message');
oErrorHandler.error('This is an error message');</code></pre>
    </div>
</div>
<div>
    <h3 id="setErrorHandler">Hydra.setErrorHandler</h3>

    <p>
        Change the ErrorHandler for a new one.
    </p>

    <div>
        Example of usage
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
        The method to set variables in the module's instance scope to avoid pollute global.
    </p>

    <p class="h4">
        Example of usage
    </p>
    <div>
        <pre><code class="language-javascript">Hydra.module.setVars( { test:'test' } );</code></pre>
    </div>
</div>
<div>
    <h4 id="getVars">Hydra.module.getVars</h4>

    <p class="h4">
        Method to get variables from the modules's instance scope variables.
    </p>

    <p class="h4">
        Example of usage
    </p>
    <div>
        <pre><code class="language-javascript">var oVars = Hydra.module.getVars();</code></pre>
    </div>
</div>
<div>
    <h4 id="register">Hydra.module.register</h4>

    <p class="h4">
        Method to register a module that could be used in your application.
    </p>

    <p class="h4">
        Example of usage
    </p>
    <div>
			<pre><code class="language-javascript">Hydra.module.register("module-name", function (action) {
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
    <div class="tip">
        <div>Since version 3.1.2 the register method returns a module instance on steroids.</div>
        <div>Now you can execute these methods on the returned instance:</div>
        <ul>
            <li>
                start -> to start the module
            </li>
            <li>
                stop -> to stop a module
            </li>
            <li>
                extend -> to extend a module -> it will return the extended module with the same methods.
            </li>
        </ul>
    </div>
</div>
<div>
    <h4 id="module_extend">Hydra.module.extend</h4>
    <div><strong>Deprecated in version 3.5.0 it will be removed in version 3.7.0 but will be available as a Hydra.js extension</strong></div>
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
    <p class="h4">
        A sample of how to extend a module, overwriting its behavior:
    </p>
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
    <p class="h4">
        Example of how to extend a module copying it as a new module:
    </p>
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

    <div class="tip">
        <div>Since version 3.1.2 the extend method returns a module instance on steroids.</div>
        <div>Now you can execute these methods on the returned instance:</div>
        <ul>
            <li>
                start -> to start the module
            </li>
            <li>
                stop -> to stop a module
            </li>
            <li>
                extend -> to extend a module -> it will return the extended module with the same methods.
            </li>
        </ul>
    </div>
</div>


<div>
    <h4 id="module_decorate">Hydra.module.decorate</h4>

    <p class="h4">
        Decorate modules is important to initialize and destroy one module with different behaviours.<br/>
        A sample of how to decorate a module:
    </p>
    <div>
			<pre><code class="language-javascript">// Base module will alert 'hello world!" when started.
Hydra.module.register( 'my-first-module', function( Bus, Module, ErrorHandler, Api ){
    return {
        init: function() {
            alert( "hello world!" );
        }
    };
});

// Decorating a module will give you a reference to the decorated module to use their methods
// oModule is the instance of the parent module

Hydra.module.decorate( 'my-first-module', 'my-decorated-module', function( Bus, Module, ErrorHandler, Api, oModule ){
    return {
        init: function() {
            alert( "Yorolei!" );
            oModule.init();
        }
    };
});

// Start a decorated module

Hydra.module.start( 'my-decorated-module' );
</code></pre>
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

    <p class="h4">
        Example of starting a single module (without id of the instance):
    </p>
    <div>
        <pre><code class="language-javascript">Hydra.module.start( 'my-fist-module' );</code></pre>
    </div>
    <p class="h4">
        Example of starting a single module (without parameters):
    </p>
    <div>
        <pre><code class="language-javascript">Hydra.module.start( 'my-fist-module', 'my-first-instance-id' );</code></pre>
    </div>
    <p class="h4">
        Example of starting a single module (with parameters):
    </p>
    <div>
        <pre><code class="language-javascript">Hydra.module.start( 'my-fist-module', 'my-first-instance-id', { data: 'test' } );</code></pre>
    </div>
    <p class="h4">
        Example of starting a single module but a single instance (with parameters):
    </p>
    <div>
        <pre><code class="language-javascript">Hydra.module.start( 'my-fist-module', 'my-first-instance-id', { data:'test' }, true );</code></pre>
    </div>
    <p class="h4">
        Example of starting more than one module at the same time (with parameters):
    </p>
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

    <p class="h4">
        Example of usage
    </p>
    <div>
        <pre><code class="language-javascript">Hydra.module.startAll();</code></pre>
    </div>
</div>
<div>
    <h4 id="isModuleStarted">Hydra.module.isModuleStarted</h4>

    <p class="h4">
        Check if the instance of one module has been started. Returns a boolean value.
    </p>

    <p class="h4">
        Example of usage
    </p>
    <div>
        <pre><code class="language-javascript">Hydra.module.isModuleStarted( "module-name", "instance-module" );</code></pre>
    </div>
</div>
<div>
    <h4 id="stop">Hydra.module.stop</h4>

    <p class="h4">
        Stops the instance of the module to destroy the instance.
    </p>

    <p class="h4">
        Example of usage
    </p>
    <div>
        <pre><code class="language-javascript">Hydra.module.stop( "module-name", "instance-module" );</code></pre>
    </div>
</div>
<div>
    <h4 id="stopAll">Hydra.module.stopAll</h4>

    <p class="h4">
        Stops all the instances of all modules that that have been started in the application.
    </p>

    <p class="h4">
        Example of usage
    </p>
    <div>
        <pre><code class="language-javascript">Hydra.module.stopAll();</code></pre>
    </div>
</div>
</div>
<div>
    <h3 id="setUnblockUI">Hydra.setUnblockUI</h3>
    <p>
        To avoid problems with long execution process, when an event is triggered, you can set a security system to avoid
        unblock the UI using Hydra.setUnblockUI(true).
    </p>
    <p>
        <div class="tip">
            <strong><em>WARNING!!</em></strong> If you use setUnblockUI in mode on, this method could modify the order of execution of the callbacks attached to events.
            <div>Use this method if you have some performance issues and if you really don't need the events being triggered in order of attachment.</div>
        </div>
    </p>
    <div>
        Set unblock UI mode off:
    </div>
    <div>
        <pre><code class="language-javascript">Hydra.setUnblockUI( false );</code></pre>
    </div>
    <div>
        Set unblock UI mode on:
    </div>
    <div>
        <pre><code class="language-javascript">Hydra.setUnblockUI( true );</code></pre>
    </div>
</div>
<div>
    <h3 id="setDebug">Hydra.setDebug</h3>

    <p>
        Hydra wraps all the module methods to avoid that an error in one module makes the app fail if debug mode is
        off.<br>
        If an error is driving you crazy then set debug to true to be able to see it.<br>
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
        Example of usage:
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
        Example of usage:
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

<div>
    <h3 id="addExtensionBeforeInit">Hydra.addExtensionBeforeInit</h3>

    <p>
        A method to extend Hydra features before init a module.
        <div>
            This method should be used if you need to check a module to add functionalities to Hydra modules.
            <div>
                This method gets an object where the keys will be the property to check in modules and the values will be
                the functions that will be executed before init the module.
            </div>
            <div>
                <pre><code class="language-javascript">{
    'property_to_check_in_modules': function(oModule, oData, bSingle){
        // Code to be executed when the property exist in oModule.
    }
}</code></pre>
            </div>
            Examples of extensions using this method:
                <ul>
                    <li>
                        <a href="https://github.com/tcorral/Hydra_Extensions/tree/master/Dependencies">Dependencies</a>
                    </li>
                    <li>
                        <a href="https://github.com/tcorral/Hydra_Extensions/tree/master/Widget">Widget</a>
                    </li>
                </ul>
        </div>
    </p>

    <div>
        Example of usage:
    </div>
    <div>
		<pre><code class="language-javascript">
Hydra.addExtensionBeforeInit({
    'element': function(oModule, oData, bSingle){
        // Callback to execute when element exist in oModule.
    }
});</code></pre>
    </div>
</div>
</div>
