# Hydra.js
Hydra.js is a module manager oriented system.

## Hydra.js has been moved to HydraJS organization in [(https://github.com/HydraJS/HydraJS)](https://github.com/HydraJS/HydraJS)

## Updated to version 3.8.0

[![Build Status](https://travis-ci.org/tcorral/Hydra.js.png)](https://travis-ci.org/tcorral/Hydra.js)

[Changelog](https://raw.github.com/tcorral/Hydra.js/master/changelog.txt)

## Description

Hydra.js is the library that will help you to scale your app.
Hydra.js is a framework that gives you the tools to write your application using modules or widgets and make easy to work with them.

Hydra.js uses a decoupled architecture that:

* Allows you to change your base framework without change the modules or widget code.
* Allow the modules communicate with each other without knowing which modules are loaded.
* Can be easily extended with new features.

### Some benefits:

* No known module to other modules
* If something is wrong in one module, the other modules will continue working.
* Notifying an action will be called on all the modules that will be listening this action.
* A module can be extended
* If you have a module that is working well you can extend it to change his behavior without losing is original behavior.
* Allows multi-instance modules
* Allows set private variables to be used inside of modules.
* Can be used in url threaded application as in an Ajax threaded application.
* You can test your modules with any Unit Testing Framework.
* Only 3.51KB when [Gzipped](https://github.com/tcorral/Hydra.js/raw/master/versions/hydra.min.js.gz).

[Project Web](http://tcorral.github.io/Hydra.js)

[API documentation](http://tcorral.github.io/Hydra.js/apis/Hydra.js_API_v3.8.0/index.html)

[Examples](http://tcorral.github.io/Hydra.js/#examples)

## Usage

### Install:

Install with [Bower](http://bower.io)

bower install hydrajs

Install with [Component](http://component.io)

component install hydrajs

Install with [NPM](http://npmjs.org)

npm install hydra.js

### Use in browser

Insert in your html code:

<script type="text/javascript" src="/path/to/your/js/libs/Hydra.js"></script>

### Common usage
#### Setting variables

```js
Hydra.module.setVars({
    gaq: _gaq,
    list: document.getElementById( "list" )
});
```

Setting the variables in this way will make the variables accessible as the last argument in the init module method. If needed you can also access these
variables using getVars (See 'Getting variables')

*Tip. This method not only sets variables, if the object has been set before the new variables will be merged with the previous object. *

#### Getting variables
```js
var oVars = Hydra.module.getVars();
```
Returns the object with the private variables set using setVars (See 'Setting variables')

#### Module creator function
The module creator function gets four arguments:

* **Bus**
* Get access to Hydra.bus, the action manager to publish or subscribe to events
* **Module**
* Get access to Hydra.module, the module manager to register, extend, decorate, start and stop modules.
* **ErrorHandler**
* Get access to the Hydra.errorHandler, it's recommended to use it instead of using console.log because of the possible improvements see [Hydra.js extensions](https://github.com/tcorral/Hydra_Extensions/) or [Hermes.js](https://github.com/tcorral/Hermes.js/)
* **Api**
* Get access to the rest of the Hydra api. You can use it to access to the current extensions, i.e. jQuery, or to your own extensions.

```js
function( Bus, Module, ErrorHandler, Api )
{
    return {
        init: function ( oData ) {}
    };
}
```

#### Create a module
```js
Hydra.module.register( 'moduleId', function( Bus, Module, ErrorHandler, Api )
{
    return {
        init: function ( oData ) {}
    };
});
```

#### Create a module using dependency injection
```js
Hydra.module.register( 'moduleId', ['$api', '$bus'], function ( Api, Bus )
{
    return {
        init: function ( oData ) {}
    };
});
```

The following are available for dependency injection:

* $bus
* $module
* $log (error handler)
* $api
* $global (window object)
* $doc (document object)

To use dependency injection, pass an array of strings containing any of the variables listed above as the second parameter when registering a module.
Hydra will pass them in the order specified to your function.

#### Extend a module overriding the base module
To extend a module you will need to register the base module before extends it.

```js
Hydra.module.extend( 'moduleId', function( Bus, Module, ErrorHandler, Api )
{
    return {
        init: function ( oData ) {}
    };
});
```

#### Extend a module creating a new module
To extend a module you will need to register the base module before extends it.

```js
Hydra.module.extend( 'moduleId', 'newModuleId', function( Bus, Module, ErrorHandler, Api )
{
    return {
        init: function ( oData ) {}
    };
});
```

This extension allows access the parent methods as classical inheritance.

#### Access parent methods

Register base module:

```js
Hydra.module.register( 'moduleId', function( Bus, Module, ErrorHandler, Api )
{
    return {
        init: function ( oData ) {},
        changeTitle: function( sTitle ){
            document.title = sTitle;
        }
    };
});
```

Create the new module using "extend":

```js
Hydra.module.extend( 'moduleId', 'newModuleId', function( Bus, Module, ErrorHandler, Api )
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
```

#### Decorating modules
Sometimes is better to decorate our modules instead of extending them. I recommend to use decorate instead of extend modules.

```js
Hydra.module.decorate( 'baseModuleId', 'decoratedModuleId', function( Bus, baseModule, Module, ErrorHandler, Api )
{
    return {
        init: function ()
        {
            //do something on start a module
            baseModule.init();
        },
        onDestroy: function ()
        {
            //do something on stop a module
            baseModule.onDestroy();
        }
    };
});
```

#### Listening to events
```js
Hydra.module.register( 'moduleId', function( Bus, Module, ErrorHandler, Api )
{
    return {
        events : {
            'channel': {
                'item:action1': function ( oData ) {}
            }
        },
        init: function ( oData ) {
            /* The subscribing of events is done by Hydra inside the core.
            * Bus.subscribe( this );
            */
        }
    };
});
```

#### Publishing actions
To use the action manager you have accessible using "Bus".

The publish method expect three arguments, but only the first two are mandatory, the channel name and the event name

```js
Hydra.bus.publish( 'channel_name', 'event_name', data );
```

*Tip: 'global' channel is created by default to use it if you want to communicate with other modules that are not related with a specific channel. *

```js
Hydra.module.register( 'moduleId', function( Bus, Module, ErrorHandler, Api )
{
    return {
        events : {
            'channel': {
                'item:action1': function ( oData ) {}
            }
        },
        init: function ( oData ) {
            $( "#button" ).click( function(){
                Bus.publish( 'channel', 'item:action1', {} );
            });
        }
    };
});
```

If you need compatibility with the previous event manager called Action, you can add it in your code to maintain compatibility with previous version's code. You can download it from: [Action](https://github.com/tcorral/Hydra_Extensions/tree/master/Sandbox)


## Documentation

[Project Web](http://tcorral.github.io/Hydra.js)

[API documentation](http://tcorral.github.io/Hydra.js/apis/Hydra.js_API_v3.8.0/index.html)

[Examples](http://tcorral.github.io/Hydra.js/#examples)

## License

Hydra.js is licensed under the MIT license.

## Agreements

Hydra was inspired by Nicholas Zakas presentation.

* [Scalable Javascript Application](http://www.slideshare.net/nzakas/scalable-javascript-application-architecture)
