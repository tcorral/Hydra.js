# Hydra.js
Hidra.js is a module manager oriented system.

## Updated to version 1.2.0

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
* Only 1.5kb when [Gzipped](http://tcorral.github.com/Hydra.js/versions/hydra.js.gz).

[API documentation](/tcorral/Hydra.js/tree/master/examples_and_documents/jsdoc/index.html)

[Examples](/tcorral/Hydra.js/tree/master/examples_and_documents/index.html) to see for yourself!

## Usage

### Before using it:
Insert in your code:

	<script type="text/javascript" src="/path/to/your/js/libs/Hydra.js"></script>

### Create a module
	Hydra.module.register('moduleId', function(action)
	{
		return {
			init: function (oData) {},
			handleAction: function (oNotifier){
			},
			destroy: function () {}
		};
	});

### Extend a module overwritting the base module
To extend a module you will need to register the base module before extend it.

	Hydra.module.extend('moduleId', function(action)
	{
		return {
			init: function (oData) {},
			handleAction: function (oNotifier){
			},
			destroy: function () {}
		};
	});

### Extend a module creating a new module
To extend a module you will need to register the base module before extend it.

	Hydra.module.extend('moduleId', 'newModuleId', function(action)
	{
		return {
			init: function (oData) {},
			handleAction: function (oNotifier){
			},
			destroy: function () {}
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
			},
			handleAction: function (oNotifier){
			},
			destroy: function () {}
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
			},
			handleAction: function (oNotifier){
			},
			destroy: function () {}
		};
	});

### Listening actions
To use the action manager you have accessible using "action".

*Tip: Use it on your init to start listening actions when the module starts.*

#### One action
	Hydra.module.register('moduleId', function(action)
	{
		return {
			init: function (oData) {
				action.listen(['action1'], this.handleAction, this);
			},
			handleAction: function (oNotifier){
			},
			destroy: function () {}
		};
	});

#### More actions
	Hydra.module.register('moduleId', function(action)
	{
		return {
			init: function (oData) {
				action.listen(['action1', 'action2'], this.handleAction, this);
			},
			handleAction: function (oNotifier){
				switch(oNofitier.type)
				{
					case 'action1':
						/* your code */
						break;
					case 'action2':
						/* your code */
						break;
					default: break;
				}
			},
			destroy: function () {}
		};
	});

*Tip: If you have several actions to listen I recommend to make use of an object where the keys must be the names of the actions.*

	Hydra.module.register('moduleId', function(action)
	{
		return {
			init: function (oData) {
				action.listen(['action1', 'action2', 'actionN'], this.handleAction, this);
			},
			actionHandlers: {
				action1: function (oData) {},
				action2: function (oData) {},
				actionN: function (oData) {}
			},
			handleAction: function (oNotifier){
				var oHandler = this.actionHandlers[oNotifier.type]
				if(typeof oHandler === "undefined")
				{
					return;
				}
				oHandler.call(this, oData);
				oHandler = null;
			},
			destroy: function () {}
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
			init: function (oData) {
				action.listen(['action1', 'action2', 'actionN'], this.handleAction, this);
				$("#button").click(function(){
					action.notify({
						type: 'listenedAction',
						data: 'data'
					});
				});
			},
			actionHandlers: {
				action1: function (oData) {},
				action2: function (oData) {},
				actionN: function (oData) {}
			},
			handleAction: function (oNotifier){
				var oHandler = this.actionHandlers[oNotifier.type]
				if(typeof oHandler === "undefined")
				{
					return;
				}
				oHandler.call(this, oData);
				oHandler = null;
			},
			destroy: function () {}
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