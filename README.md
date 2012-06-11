# Hydra.js
Hidra.js is a module manager oriented system.

## Updated to version 2.0

#### ChangeLog 2.0:
    Add multi-instance for modules.
    Now is possible to add more than one instance for the same module.
    It has been added a new param (id of the DOM element that will be the '__container__' property of the module instance
    when these methods are called:
        start
        stop
        getModule
        isModuleStarted
#### ChangeLog 1.3.1 :
    Improve aListeningEvents generation. Now the listening events are taken from oEventsCallbacks property of methods. - Thanks, Ramonacus -
#### ChangeLog 1.3.0 :
    Delegate some repetitive jobs to the module instance creator, maintaining the size of Hydra.

    Make easier the work of developers reducing duplicated code and decrease the final size of
    projects where Hydra.js is used.

    Some modules have been moved from modules to the instance object when creating it:
         - These methods are not needed anymore to be added to your modules:
            - handleAction
            - destroy

    Added new properties to the module:
        - aListeningEvents
             - Array of events that the module will start listening
        - oEventsCallbacks
             - Object of callbacks that must match the events
        - onDestroy
            - New destroy method, only, will stop all listeners.
            - This method will be executed before stop listeners.

    When the module is started the listeners will be activated before the code in init method.
         - Is not needed anymore to start listeners.
#### ChangeLog 1.2.0 :
    Added Promise and Deferred objects.
#### ChangeLog 1.1.1:
    Added clasical inheritance to objects.
    Added __action__ to access Action object from modules
    Added __super__ to access parent object from methods using __call__ method.
#### ChangeLog 1.0:
    First commit

## Description

Hydra is used to create a scalable, maintainable and module oriented system.
Hydra is framework agnosthic.
Hydra has been designed to create your application in a modular design system.

### Some benefits:

* No known module to other modules
 * If something is wrong in one module, the others modules will continue working.
* Notifying an action will be called on all the modules that will be listening this action.
* A module can be extended
 * If you have a module that is working well you can extend it to change his behavior without losing is original behavior.
* Can be used in url threaded application as in a ajax threaded application.
* You can test your modules with any Unit Testing Framework.
* Only 2kb when [Gzipped](http://tcorral.github.com/Hydra.js/versions/hydra.js.gz).

[API documentation](http://tcorral.github.com/Hydra.js/jsdoc/index.html)

[Examples](http://tcorral.github.com/Hydra.js/examples_and_documents/index.html) to see for yourself!

## Usage

### Before using it:
Insert in your code:

	<script type="text/javascript" src="/path/to/your/js/libs/Hydra.js"></script>

### Create a module
	Hydra.module.register('moduleId', function(action)
	{
		return {
			init: function (oData) {}
		};
	});

### Extend a module overwritting the base module
To extend a module you will need to register the base module before extend it.

	Hydra.module.extend('moduleId', function(action)
	{
		return {
			init: function (oData) {}
		};
	});

### Extend a module creating a new module
To extend a module you will need to register the base module before extend it.

	Hydra.module.extend('moduleId', 'newModuleId', function(action)
	{
		return {
			init: function (oData) {}
		};
	});

This extension allows access the parent methods as classical inheritance.

### Access parent methods

Register base module:

	Hydra.module.register('moduleId', function(action)
	{
		return {
			init: function (oData) {},
			changeTitle: function(sTitle){
					document.title = sTitle;
			}
		};
	});

Create the new module using "extend":

	Hydra.module.extend('moduleId', 'newModuleId', function(action)
	{
		return {
			init: function (oData) {},
			changeTitle: function(sTitle){
					sTitle += " " + new Date().getTime();
					// This is the way of access parent methods.
					*this.__super__.call("changeTitle", [sTitle])*
			}
		};
	});


#### When listening events
	Hydra.module.register('moduleId', function(action)
	{
		return {
			aListeningEvents: ['action1', 'action2'],
			oEventsCallbacks: {
				'action1': function(oNotify)
				{
						/* your code */
				},
				'action2': function(oNotify)
				{
						/* your code */
				}
			},
			init: function (oData) {
			}
		};
	});

### Notifying actions
To use the action manager you have accessible using "action".

The notify method needs a Notifier object:

	var oNotifier = {
		type: 'listenedAction',
		data: 'data'
	};

*Tip: You can notify an action where ever you want inside the module using 'action'*

	Hydra.module.register('moduleId', function(action)
	{
		return {
			aListeningEvents : ['action1', 'action2', 'action3'],
			oEventsCallbacks : {
				'action1': function (oData) {},
				'action2': function (oData) {},
				'action3': function (oData) {}
			},
			init: function (oData) {
					$("#button").click(function(){
						action.notify({
							type: 'listenedAction',
							data: 'data'
						});
					});
			}
		};
	});
*Tip: You can create an Action on your code to notify some module creating a new instance of it in this way:*

	var oAction = new (Hydra.action());
		oAction.notify({
			type: 'listenedAction',
			data: 'data'
		});

## Promise - Deferred object usage
Promise and Deferred objects are used to defer the execution of depending asynchronous callbacks to the execution of all the callbacks, to be sure that all goes well.

### How to create a new Promise object:

	var oPromise = new Hydra.promise();
Promise object has one method :

**"then"** is a method to add success and error callbacks to the Promise object.

	oPromise.then(fpSuccessCallback, fpErrorCallback);
	//You can chain more than one "then" method
	oPromise.then(fpSuccessCallback, fpErrorCallback).then(fpSuccessCallback2, fpErrorCallback2);

Promise object can only have two different states:
* Resolved
* Rejected
If the status is "resolved" all the success callbacks assigned to Promise object will be executed.
If the status is "rejected" all the error callbacks assigned to Promise object will be executed.

### How to create a Deferred object:
Deferred is the object that manages all the promises assigned to it.

	var oDeferred = new Hydra.deferred();

Deferred object has two methods "add" and "then".

**"add"** method must be used to add Promise objects to be managed by the Deferred object.

	oDeferred.add(oPromise)
	//You can chain more than one "add" method
	oDeferred.add(oPromise).add(oPromise2);
**"then"** method must be used to add success and error callbacks to the Deferred object.

	oPromise.then(fpSuccessCallback, fpErrorCallback);
	//You can chain more than one "then" method
	oDeferred.then(fpSuccessCallback, fpErrorCallback).then(fpSuccessCallback2, fpErrorCallback2);

## Documentation

(Links will only work if you clone the repo.)

[API documentation](/tcorral/Hydra.js/tree/master/examples_and_documents/jsdoc/index.html)

[Examples](/tcorral/Hydra.js/tree/master/examples_and_documents/index.html) to see for yourself!

## License

Hydra.js is licensed under the MIT license.

## Agreements

Hydra was inspired by Nicholas Zakas presentation.

* [Scalable Javascript Application](http://www.slideshare.net/nzakas/scalable-javascript-application-architecture)