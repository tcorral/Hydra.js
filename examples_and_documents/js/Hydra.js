(function (win, doc) {
	'use strict';
	/**
	 * oModules is an object where the modules will be saved.
	 * Empty object declared by default.
	 * @private
	 * @author Tomás Corral Casas
	 * @version 1.0
	 * @type Object
	 */
	var oModules = {},
		/**
		 * Hydra is the private declaration of the Hydra object.
		 * Hydra is declared null by default.
		 * @private
		 * @author Tomás Corral Casas
		 * @version 1.0
		 * @type Hydra
		 */
		Hydra = null,
		/**
		 * bDebug is a flag to wrap the module methods to avoid cascade failing.
		 * true: The code will fail.
		 * false: The code will log errors.
		 * @private
		 * @author Tomás Corral Casas
		 * @version 1.0
		 * @type Boolean
		 */
		bDebug = false,
		/**
		 * ErrorHandler is the class that will handle the errors on your code.
		 * Can be changed using setErrorHandler method.
		 * Default ErrorHandler will log messages in console if exist.
		 * If console doesn't exist the error will be logged in a hidden layer.
		 * @private
		 * @class ErrorHandler
		 * @constructor
		 * @author Tomás Corral Casas
		 * @version 1.0
		 */
		ErrorHandler = function () {},
		/**
		 * Module is the class that will manage the module system.
		 * @private
		 * @class Module
		 * @constructor
		 * @author Tomás Corral Casas
		 * @version 1.0
		 */
		Module = function () {},
		/**
		 * Action is the class that will manage the action listeners and notifications.
		 * @private
		 * @class Action
		 * @constructor
		 * @author Tomás Corral Casas
		 * @version 1.0
		 */
		Action = function () {};

	/**
	 * isFunction is a method to know if the object passed as parameter is a Function object.
	 * @private
	 * @author Tomás Corral Casas
	 * @version 1.0
	 * @param {Object} fpCallback
	 * @return Boolean
	 */
	function isFunction(fpCallback) {
		return Object.prototype.toString.call(fpCallback) === "[object Function]";
	}
	/**
	 * getAction is a method to gain access to the private Action constructor.
	 * @private
	 * @author Tomás Corral Casas
	 * @version 1.0
	 * @return Action class
	 */
	function getAction() {
		return Action;
	}
	/**
	 * getErrorHandler is a method to gain access to the private ErrorHandler constructor.
	 * @private
	 * @author Tomás Corral Casas
	 * @version 1.0
	 * @return ErrorHandler class
	 */
	function getErrorHandler() {
		return ErrorHandler;
	}
	/**
	 * setErrorHandler is a method to set the ErrorHandler to a new object to add more logging logic.
	 * @private
	 * @author Tomás Corral Casas
	 * @version 1.0
	 * @param {Object} oErrorHandler
	 */
	function setErrorHandler(oErrorHandler) {
		ErrorHandler = oErrorHandler;
	}
	/**
	 * setDebug is a method to set the bDebug flag.
	 * @private
	 * @author Tomás Corral Casas
	 * @version 1.0
	 * @param {Boolean} _bDebug
	 */
	function setDebug(_bDebug){
		bDebug = _bDebug;
	}
	/**
	 * wrapMethod is a method to wrap the original method to avoid failing code.
	 * This will be only called if bDebug flag is setted to false.
	 * @private
	 * @author Tomás Corral Casas
	 * @version 1.0
	 * @param {Object} oInstance
	 * @param {String} sName
	 * @param {String} sModuleId
	 * @param {Function} fpMethod
	 */
	function wrapMethod(oInstance, sName, sModuleId, fpMethod) {
		oInstance[sName] = (function (sName, fpMethod) {
			return function () {
				var aArgs = Array.prototype.slice.call(arguments, 0);
				try {
					return fpMethod.apply(this, aArgs);
				} catch (erError) {
					ErrorHandler.log(sModuleId, sName, erError);
				} finally {
					aArgs = null;
				}
			};
		}(sName, fpMethod));
	}
	/**
	 * createInstance is the method that will create the module instance and wrap the method if needed.
	 * @private
	 * @author Tomás Corral Casas
	 * @version 1.0
	 * @param {String} sModuleId
	 * @return {Object} Module instance
	 */
	function createInstance(sModuleId) {
		if(typeof oModules[sModuleId] === "undefined"){
			throw new Error("The module is not registered!");
		}
		var oInstance = oModules[sModuleId].creator(new Action()),
			sName = '',
			fpMethod = function () {};

		if (!bDebug) {
			for (sName in oInstance) {
				if (oInstance.hasOwnProperty(sName)) {
					fpMethod = oInstance[sName];
					if (!isFunction(fpMethod)) {
						continue;
					}
					wrapMethod(oInstance, sName, sModuleId, fpMethod);
				}
			}
		}
		return oInstance;
	}
	/**
	 * type is a property to be able to know the class type.
	 * @member ErrorHandler
	 * @static
	 * @author Tomás Corral Casas
	 * @version 1.0
	 * @type String
	 */
	ErrorHandler.type = 'ErrorHandler';
	/**
	 * list is a property that will store the DOM object list reference.
	 * Null by default.
	 * @member ErrorHandler
	 * @static
	 * @author Tomás Corral Casas
	 * @version 1.0
	 * @type DOM
	 */
	ErrorHandler.list = null;
	/**
	 * create_dom is the method that will create the hidden layer to log the errors
	 * on system without console.
	 * @member ErrorHandler
	 * @static
	 * @author Tomás Corral Casas
	 * @version 1.0
	 */
	ErrorHandler.create_dom = function () {
		var oLayer = doc.createElement("div"),
			oList = doc.createElement("ul"),
			oLayerStyle = oLayer.style;
		oLayerStyle.display = 'none';
		oLayerStyle.position = "fixed";
		oLayerStyle.height = "100px";
		oLayerStyle.width = "100%";
		oLayerStyle.bottom = "0px";
		this.list = oList;
		oLayer.appendChild(oList);
		doc.body.appendChild(oLayer);
		oLayer = oList = oLayerStyle = null;
	};
	/**
	 * addItem is the method that will add a new item to the list to log the errors
	 * on system without console.
	 * @member ErrorHandler
	 * @static
	 * @author Tomás Corral Casas
	 * @version 1.0
	 * @param {String} sModuleId
	 * @param {String} sMethod
	 * @param {Error} erError
	 */
	ErrorHandler.addItem = function (sModuleId, sMethod, erError) {
		var oItem = doc.createElement("li");
		oItem.appendChild(doc.createTextNode(sModuleId + "/" + sMethod + ": " + erError.message));
		this.list.appendChild(oItem);
		oItem = null;
	};
	/**
	 * log is the method that will differenciate the system if they had console or not.
	 * if window.console exist console.log will be called
	 * if window.console not exist then the log on layer will be activated.
	 * Lazy pattern will be used to avoid extra work on next calls.
	 * Arguments are sent to the methods that will be applied.
	 * @static
	 * @author Tomás Corral Casas
	 * @version 1.0
	 */
	ErrorHandler.log = function () {
		var aArgs = Array.prototype.slice.call(arguments, 0);

		if (typeof window.console === "undefined" || (typeof aArgs[aArgs.length  - 1] == 'boolean' && !aArgs[aArgs.length - 1])) {
			if (this.list === null) {
				this.create_dom();
			}
			this.addItem.apply(this, aArgs);
			ErrorHandler.__old_log__ = ErrorHandler.log;
			this.log = function () {
				var aArgs = Array.prototype.slice.call(arguments, 0);
				this.addItem.apply(this, aArgs);
				aArgs = null;
			};
		} else {
			win.console.log.apply(win.console, aArgs);
			ErrorHandler.__old_log__ = ErrorHandler.log;
			this.log = function () {
				var aArgs = Array.prototype.slice.call(arguments, 0);
				win.console.log.apply(win.console, aArgs);
				aArgs = null;
			};
		}
		aArgs = null;
	};
	/**
	 * type is a property to be able to know the class type.
	 * @member Module.prototype
	 * @author Tomás Corral Casas
	 * @version 1.0
	 * @type String
	 */
	Module.prototype.type = "Module";
	/**
	 * register is the method that will add the new module to the oModules object.
	 * sModuleId will be the key where it will be stored.
	 * @member Module.prototype
	 * @author Tomás Corral Casas
	 * @version 1.0
	 * @param {String} sModuleId
	 * @param {Function} fpCreator
	 */
	Module.prototype.register = function (sModuleId, fpCreator) {
		oModules[sModuleId] = {
			creator: fpCreator,
			instance: null
		};
	};
	/**
	 * merge is a method to merge two modules in a new one.
	 * This must be called only from the extend public method.
	 * @member Module.prototype
	 * @private
	 * @author Tomás Corral Casas
	 * @version 1.0
	 * @param {Object} oModuleBase
	 * @param {Object} oModuleExtended
	 * @return {Object} the merged module
	 */
	Module.prototype.merge = function (oModuleBase, oModuleExtended) {
		var oFinalModule = {},
			sKey = '';

		for (sKey in oModuleBase) {
			if (oModuleBase.hasOwnProperty(sKey)) {
				oFinalModule[sKey] = oModuleBase[sKey];
			}
		}

		for (sKey in oModuleExtended) {
			if (oModuleExtended.hasOwnProperty(sKey)) {
				oFinalModule[sKey] = oModuleExtended[sKey];
			}
		}
		return oFinalModule;
	};
	/**
	 * extend is the method that will be used to extend a module with new features.
	 * can be used to remove some features too, withou touching the original code.
	 * @member Module.prototype
	 * @author Tomás Corral Casas
	 * @version 1.0
	 * @param {String} sModuleId
	 * @param {Function} fpCreator
	 */
	Module.prototype.extend = function (sModuleId, fpCreator) {
		var oModule = oModules[sModuleId],
			self = this,
			oBaseModule = null,
			oExtendedModule = null,
			oFinalModule = null;

		if (typeof oModule === "undefined") {
			return;
		}

		oExtendedModule = fpCreator(new Action());
		oBaseModule = oModule.creator(new Action());
		oFinalModule = this.merge(oBaseModule, oExtendedModule),

		oModules[sModuleId] = {
			creator: function (oAction) {
				return oFinalModule;
			},
			instance: null
		};

		oModule = oBaseModule = oExtendedModule = null;
	};
	/**
	 * test is a method that will return the module without wrapping their methods.
	 * It's called test because it was created to be able to test the modules with unit testing.
	 * @member Module.prototype
	 * @author Tomás Corral Casas
	 * @version 1.0
	 * @param {String} sModuleId
	 * @param {Function} fpCallback
	 */
	Module.prototype.test = function (sModuleId, fpCallback) {
		bDebug = true;
		fpCallback(createInstance(sModuleId));
		bDebug = false;
	};
	/**
	 * start is the method that will initialize the module.
	 * When start is called the module instance will be created and the init method is called.
	 * @member Module.prototype
	 * @author Tomás Corral Casas
	 * @version 1.0
	 * @param {String} sModuleId
	 * @param {Object} oData
	 */
	Module.prototype.start = function (sModuleId, oData) {
		var oModule = oModules[sModuleId];
		if (typeof oModule !== "undefined")
		{
			oModule.instance = createInstance(sModuleId);
			oModule.instance.init(oData);
		}
		oModule = null;
	};
	/**
	 * startAll is the method that will initialize all the registered modules.
	 * @member Module.prototype
	 * @author Tomás Corral Casas
	 * @version 1.0
	 */
	Module.prototype.startAll = function () {
		var sModuleId = '';
		for (sModuleId in oModules) {
			if (oModules.hasOwnProperty(sModuleId)) {
				this.start(sModuleId);
			}
		}
		sModuleId = null;
	};
	/**
	 * stop is the method that will finish the module if it was registered and started.
	 * When stop is called the module will call the destroy method and will nullify the instance.
	 * @member Module.prototype
	 * @author Tomás Corral Casas
	 * @version 1.0
	 * @param {String} sModuleId
	 */
	Module.prototype.stop = function (sModuleId) {
		var oModule = oModules[sModuleId];
		if (typeof oModule !== "undefined" && !(oModule.instance == null)) {
			oModule.instance.destroy();
			oModule.instance = null;
		}
	};
	/**
	 * stopAll is the method that will finish all the registered and started modules.
	 * @member Module.prototype
	 * @author Tomás Corral Casas
	 * @version 1.0
	 */
	Module.prototype.stopAll = function () {
		var sModuleId = '';
		for (sModuleId in oModules) {
			if (oModules.hasOwnProperty(sModuleId)) {
				this.stop(sModuleId);
			}
		}
		sModuleId = null;
	};
	/**
	 * _delete is a wrapper method that will call the native delete javascript function
	 * It's important to test the full code.
	 * @member Module.prototype
	 * @author Tomás Corral Casas
	 * @version 1.0
	 * @param {String} sModuleId
	 */
	Module.prototype._delete = function (sModuleId) {
		delete oModules[sModuleId];
	};
	/**
	 * remove is the method that will remove the full module from the oModules object
	 * @member Module.prototype
	 * @author Tomás Corral Casas
	 * @version 1.0
	 * @param {String} sModuleId
	 */
	Module.prototype.remove  = function (sModuleId) {
		var oModule = oModules[sModuleId];
		if (typeof oModule !== "undefined") {
			oModules[sModuleId] = null;
			this._delete(sModuleId);
		}
	};
	/**
	 * type is a property to be able to know the class type.
	 * @member Action.prototype
	 * @author Tomás Corral Casas
	 * @version 1.0
	 * @type String
	 */
	Action.type = "Action";
	/**
	 * oActions is the property that will save the actions to be listened
	 * @member Action.prototype
	 * @author Tomás Corral Casas
	 * @version 1.0
	 * @type Object
	 */
	Action.oActions = {};
	/**
	 * listen is the method that will add a new action to the oActions object
	 * and that will activate the listener.
	 * @member Action.prototype
	 * @author Tomás Corral Casas
	 * @version 1.0
	 * @param {Array} aNotificationsToListen
	 * @param {Function} fpHandler
	 * @param {Object} oModule
	 */
	Action.prototype.listen = function (aNotificationsToListen, fpHandler, oModule) {
		var sNotification = '',
			nNotification = 0,
			nLenNotificationsToListen = aNotificationsToListen.length;

		for (; nNotification < nLenNotificationsToListen; nNotification++) {
			sNotification = aNotificationsToListen[nNotification];
			if (typeof Action.oActions[sNotification] === "undefined") {
				Action.oActions[sNotification] = [];
			}
			Action.oActions[sNotification].push({
				module: oModule,
				handler: fpHandler
			});
		}
	};
	/**
	 * notify is the method that will launch the actions that are listening the notified action
	 * @member Action.prototype
	 * @author Tomás Corral Casas
	 * @version 1.0
	 * @param oNotifier - Notifier.type and Notifier.data are needed
	 */
	Action.prototype.notify = function (oNotifier) {
		var sType = oNotifier.type,
			oAction = null,
			nAction = 0,
			nLenActions = 0,
			oActions = Action.oActions;

		if (typeof oActions[sType] === "undefined") {
			return;
		}

		nLenActions = oActions[sType].length;
		for (; nAction < nLenActions; nAction++) {
			oAction = oActions[sType][nAction];
			oAction.handler.call(oAction.module, oNotifier);
		}
		sType = oAction = nAction = nLenActions = oActions = null;
	};
	/**
	 * stopListen removes the actions that are listening the aNotificationsToStopListen in the oModule
	 * @member Action.prototype
	 * @author Tomás Corral Casas
	 * @version 1.0
	 * @param {Array} aNotificationsToStopListen
	 * @param {Object} oModule
	 */
	Action.prototype.stopListen = function (aNotificationsToStopListen, oModule) {
		var sNotification = '',
			aAuxActions = [],
			nNotification = 0,
			nLenNotificationsToListen = aNotificationsToStopListen.length,
			nAction = 0,
			nLenActions = 0,
			oActions = Action.oActions;

		for (; nNotification < nLenNotificationsToListen; nNotification++) {
			sNotification = aNotificationsToStopListen[nNotification];
			nLenActions = oActions[sNotification].length;

			for (; nAction < nLenActions; nAction++) {
				if (oModule !== oActions[sNotification][nAction].module) {
					aAuxActions.push(oActions[sNotification][nAction]);
				}
			}
			oActions[sNotification] = aAuxActions;
			if (oActions[sNotification].length === 0) {
				delete oActions[sNotification];
			}
		}
	};
	/**
	 * __restore__ is a private method to reset the oActions object to an empty object.
	 * @private
	 * @member Action.prototype
	 * @author Tomás Corral Casas
	 * @version 1.0
	 */
	Action.prototype.__restore__ = function()
	{
		Action.oActions = {};
	};
	/*
	 * Hydra is the api that will be available to use by developers
	 */
	Hydra = {
		action: getAction,
		errorHandler: getErrorHandler,
		setErrorHandler: setErrorHandler,
		module: new Module(),
		setDebug: setDebug
	};
	/*
	 * This line exposes the private object to be accessible from outside of this code.
	 */
	win.Hydra = Hydra;
}(window, document));