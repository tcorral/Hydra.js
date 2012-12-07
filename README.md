# Hydra.js
Hidra.js is a module manager oriented system.

## Updated to version 3.0.2

[Changelog](https://raw.github.com/tcorral/Hydra.js/master/changelog.txt)

## Description

Hydra.js is the library that will help you to scale your app.
Hydra.js is a framework that gives you the tools to write your application using modules or widgets and make easy to work with them.

Hydra.js use a decoupled architecture that:

* Allows you to change your base framework without change the modules or widgets code.
* Allow the modules communicate with each other without knowing wich modules are loaded.
* Can be easily extended with new features.

### Some benefits:

* No known module to other modules
 * If something is wrong in one module, the others modules will continue working.
* Notifying an action will be called on all the modules that will be listening this action.
* A module can be extended
 * If you have a module that is working well you can extend it to change his behavior without losing is original behavior.
* Allows multi-instance modules
* Allows set private vars to be used inside of modules.
* Can be used in url threaded application as in a ajax threaded application.
* You can test your modules with any Unit Testing Framework.
* Only 2.37Kb when [Gzipped](https://github.com/tcorral/Hydra.js/raw/master/versions/hydra.min.js.gz) 2.83Kb if you add BasicErrorHandler and Deferred plugins.

[Project Web](http://tcorral.github.com/Hydra.js)

[API documentation](http://tcorral.github.com/Hydra.js/apis/Hydra.js_API_v3.0.0/index.html)

[Examples](http://tcorral.github.com/Hydra.js/examples/index.html) to see for yourself!

## Usage

### Before using it:
Insert in your code:

	<script type="text/javascript" src="/path/to/your/js/libs/Hydra.js"></script>

### Setting vars
	Hydra.module.setVars({
		gaq: _gaq,
		list: document.getElementById( "list" )
	});
Setting the vars in this way this vars will be accessible as last argument in init module method if needed you can access
to this vars object using getVars (See 'Getting vars')
*Tip. This method not only set vars, if the object has been set before the new vars will be merged with the previous object.*

### Getting vars
	var oVars = Hydra.module.getVars();
Returns the object with the private vars set using setVars (See 'Setting vars')

### Create a module
	Hydra.module.register( 'moduleId', function( bus )
	{
		return {
			init: function ( oData ) {}
		};
	});

### Extend a module overwritting the base module
To extend a module you will need to register the base module before extend it.

	Hydra.module.extend( 'moduleId', function( bus )
	{
		return {
			init: function ( oData ) {}
		};
	});

### Extend a module creating a new module
To extend a module you will need to register the base module before extend it.

	Hydra.module.extend( 'moduleId', 'newModuleId', function( bus )
	{
		return {
			init: function ( oData ) {}
		};
	});

This extension allows access the parent methods as classical inheritance.

### Access parent methods

Register base module:

	Hydra.module.register( 'moduleId', function( bus )
	{
		return {
			init: function ( oData ) {},
			changeTitle: function( sTitle ){
					document.title = sTitle;
			}
		};
	});

Create the new module using "extend":

	Hydra.module.extend( 'moduleId', 'newModuleId', function( bus )
	{
		return {
			init: function ( oData ) {},
			changeTitle: function( sTitle ){
					sTitle += " " + new Date().getTime();
					// This is the way of access parent methods.
					this.__super__.call( "changeTitle", [sTitle] );
			}
		};
	});


#### When listening events
	Hydra.module.register( 'moduleId', function( bus )
	{
		return {
			aListeningEvents: ['action1', 'action2'],
			oEventsCallbacks: {
				'event1': function( oNotify )
				{
						/* your code */
				},
				'event2': function( oNotify )
				{
						/* your code */
				}
			},
			init: function ( oData ) {
				bus.subscribe( 'channel_name', this );
			}
		};
	});

### Publishing actions
To use the action manager you have accessible using "bus".

The publish method expect three params, but only the first two are mandatory, the channel name and the event name

	Hydra.bus.publish( 'channel_name', 'event_name', data );

*Tip: 'global' channel is created by default to use it if you want to communicate with other modules that are not related with an specific channel.*

	Hydra.module.register( 'moduleId', function( bus )
	{
		return {
			aListeningEvents : ['action1', 'action2', 'action3'],
			oEventsCallbacks : {
				'action1': function ( oData ) {},
				'action2': function ( oData ) {},
				'action3': function ( oData ) {}
			},
			init: function ( oData ) {
					$( "#button" ).click( function(){
						bus.publish( 'channel_name', 'event_name', {} );
					});
			}
		};
	});

If you need compatibility with the previous event manager called Action, you can add it in your code to maintain compatibility with previous versions code. You can download it from: [Action](https://github.com/tcorral/Hydra_Extensions/tree/master/Sandbox)


## Documentation

(Links will only work if you clone the repo.)

[Project Web](http://tcorral.github.com/Hydra.js)

[API documentation](http://tcorral.github.com/Hydra.js/apis/Hydra.js_API_v2.5.0/index.html)

[Examples](http://tcorral.github.com/Hydra.js/examples/index.html) to see for yourself!

## License

Hydra.js is licensed under the MIT license.

## Agreements

Hydra was inspired by Nicholas Zakas presentation.

* [Scalable Javascript Application](http://www.slideshare.net/nzakas/scalable-javascript-application-architecture)