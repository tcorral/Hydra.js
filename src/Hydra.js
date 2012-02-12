(function (win, doc, ns, _undefined_) {
	'use strict';
	var oModules, oConsole, reResolve, _null_, _false_, _true_, sVersion, Hydra, bDebug, ErrorHandler, Module, Action, oActions, Promise, Deferred, When;

	if (ns === _undefined_) {
		ns = win;
	}

	/*
	 * Variables to reduce size
	 */
	_null_ = null;
	_false_ = false;
	_true_ = true;
	/*
	 * End Variables to reduce size
	 */

	oModules = {};
	oConsole = win.console;
	reResolve = /resolve/g;
	sVersion = "1.3.0";
	bDebug = _false_;

	/**
	 * oActions is the property that will save the actions to be listened
	 * @type Object
	 */
	oActions = {};

	/**
	 * isFunction is a function to know if the object passed as parameter is a Function object.
	 * @private
	 * @param {Object} fpCallback
	 * @return Boolean
	 */
	function isFunction(fpCallback) {
		return {}.toString.call(fpCallback) === "[object Function]";
	}

	/**
	 * setDebug is a method to set the bDebug flag.
	 * @private
	 * @param {Boolean} _bDebug
	 */
	function setDebug(_bDebug) {
		bDebug = _bDebug;
	}

	/**
	 * slice is a function to convert objects like array to real arrays.
	 * @param {Object} oLikeArray
	 * @param {Number} nElements
	 * @return Array
	 */
	function slice(oLikeArray, nElements) {
		return [].slice.call(oLikeArray, nElements || 0);
	}

	function ownProp(oObj, sKey) {
		return oObj.hasOwnProperty(sKey);
	}

	/**
	 * wrapMethod is a method to wrap the original method to avoid failing code.
	 * This will be only called if bDebug flag is set to false.
	 * @private
	 * @param {Object} oInstance
	 * @param {String} sName
	 * @param {String} sModuleId
	 * @param {Function} fpMethod
	 */
	function wrapMethod(oInstance, sName, sModuleId, fpMethod) {
		oInstance[sName] = (function (sName, fpMethod) {
			return function () {
				var aArgs = slice(arguments, 0);
				try {
					return fpMethod.apply(this, aArgs);
				} catch (erError) {
					ErrorHandler.log(sModuleId, sName, erError);
				} finally {
					aArgs = _null_;
				}
			};
		}(sName, fpMethod));
	}

	/**
	 * Add common properties and methods to avoid repeating code in modules
	 * @param {Object} oModule
	 * @param {Action} oAction
	 */
	function addPropertiesAndMethodsToModule(sModuleId, oAction)
	{
		var oModule,
			fpInitProxy;
		oModule = oModules[sModuleId].creator(oAction);
		fpInitProxy = oModule.init;
		oModule.__action__ = oAction;
		oModule.init = function () {
			oAction.listen(this.aListeningEvents, this.handleAction, this);
			fpInitProxy.call(this, arguments);
		};
		oModule.aListeningEvents = oModule.aListeningEvents || [];
		oModule.oEventsCallbacks = oModule.oEventsCallbacks || {};
		oModule.handleAction = function (oNotifier) {
			var fpCallback = this.oEventsCallbacks[oNotifier.type];
			if (fpCallback === _undefined_) {
				return;
			}
			fpCallback.call(this, oNotifier);
		};
		oModule.onDestroy = function () {};
		oModule.destroy = function () {
			this.onDestroy();
			oAction.stopListen(this.aListeningEvents, this);
		};
		return oModule;
	}
	/**
	 * createInstance is the method that will create the module instance and wrap the method if needed.
	 * @private
	 * @param {String} sModuleId
	 * @return {Object} Module instance
	 */
	function createInstance(sModuleId) {
		var oAction, oInstance, sName, fpMethod;
		if (oModules[sModuleId] === _undefined_) {
			throw new Error("The module is not registered!");
		}
		oAction = new Action();
		sName = '';
		fpMethod = function () {};

		oInstance = addPropertiesAndMethodsToModule(sModuleId, oAction);

		if (!bDebug) {
			for (sName in oInstance) {
				if (ownProp(oInstance,sName)) {
					fpMethod = oInstance[sName];
					if (!isFunction(fpMethod)) {
						continue;
					}
					wrapMethod(oInstance, sName, sModuleId, fpMethod);
				}
			}
		}
		try {
			return oInstance;
		} finally {
			oAction = _null_;
			oInstance = _null_;
			sName = _null_;
			fpMethod = _null_;
		}
	}

	/**
	 * Class to manage the errors in modules
	 * @constructor
	 * @class ErrorHandler
	 * @name ErrorHandler
	 */
	ErrorHandler = function () {};

	/**
	 * type is a property to be able to know the class type.
	 * @member ErrorHandler
	 * @static
	 * @type String
	 */
	ErrorHandler.type = 'ErrorHandler';

	/**
	 * list is a property that will store the DOM object list reference.
	 * Null by default.
	 * @member ErrorHandler
	 * @static
	 * @type Object
	 */
	ErrorHandler.list = _null_;

	/**
	 * create_dom is the method that will create the hidden layer to log the errors
	 * on system without console.
	 * @member ErrorHandler
	 * @static
	 */
	ErrorHandler.create_dom = function () {
		var oLayer, oList, oLayerStyle;
		oLayer = doc.createElement("div");
		oList = doc.createElement("ul");
		oLayerStyle = oLayer.style;
		this.list = oList;

		oLayerStyle.display = 'none';
		oLayerStyle.position = "fixed";
		oLayerStyle.height = "100px";
		oLayerStyle.width = "100%";
		oLayerStyle.bottom = "0px";
		oLayer.appendChild(oList);
		doc.body.appendChild(oLayer);

		oLayer = _null_;
		oList = _null_;
		oLayerStyle = _null_;
	};

	/**
	 * addItem is the method that will add a new item to the list to log the errors
	 * on system without console.
	 * @member ErrorHandler
	 * @static
	 * @param {String} sModuleId
	 * @param {String} sMethod
	 * @param {Error} erError
	 */
	ErrorHandler.addItem = function (sModuleId, sMethod, erError) {
		var oItem;
		oItem = doc.createElement("li");

		oItem.appendChild(doc.createTextNode(sModuleId + "/" + sMethod + ": " + erError.message));
		this.list.appendChild(oItem);

		oItem = _null_;
	};

	/**
	 * log is the method that will differentiate the system if they had console or not.
	 * if window.console exist console.log will be called
	 * if window.console not exist then the log on layer will be activated.
	 * Lazy pattern will be used to avoid extra work on next calls.
	 * Arguments are sent to the methods that will be applied.
	 * @member ErrorHandler
	 * @static
	 */
	ErrorHandler.log = function () {
		var aArgs;
		aArgs = slice(arguments, 0).concat();

		if (oConsole === _undefined_ || (typeof aArgs[aArgs.length - 1] === 'boolean' && !aArgs[aArgs.length - 1])) {
			if (this.list === _null_) {
				this.create_dom();
			}
			this.addItem.apply(this, aArgs);
			ErrorHandler.__old_log__ = ErrorHandler.log;
			this.log = function () {
				var aArgs = slice(arguments, 0).concat();
				this.addItem.apply(this, aArgs);
				aArgs = _null_;
			};
		} else {
			oConsole.log.apply(oConsole, aArgs);
			ErrorHandler.__old_log__ = ErrorHandler.log;
			this.log = function () {
				var aArgs = slice(arguments, 0).concat();
				oConsole.log.apply(oConsole, aArgs);
				aArgs = _null_;
			};
		}

		aArgs = _null_;
	};

	/**
	 * Class to manage the modules.
	 * @constructor
	 * @class Module
	 * @name Module
	 */
	Module = function () {};

	Module.prototype = {
		/**
		 * type is a property to be able to know the class type.
		 * @member Module.prototype
		 * @type String
		 */
		type: 'Module',
		/**
		 * register is the method that will add the new module to the oModules object.
		 * sModuleId will be the key where it will be stored.
		 * @member Module.prototype
		 * @param {String} sModuleId
		 * @param {Function} fpCreator
		 */
		register: function (sModuleId, fpCreator) {
			oModules[sModuleId] = {
				creator: fpCreator,
				instance: _null_
			};
			return oModules[sModuleId];
		},
		/**
		 * _merge is the method that gets the base module and the extended and returns the merge of them
		 * @private
		 * @param {Object} oModuleBase
		 * @param {Object} oModuleExtended
		 * @param {Boolean} bKeepParent If we keep parent calls to be callable via __super__.
		 * @return Object
		 */
		_merge: function (oModuleBase, oModuleExtended, bKeepParent) {
			var oFinalModule, sKey, callInSupper;
			oFinalModule = {};
			callInSupper = function (fpCallback) {
				return function () {
					var aArgs = slice(arguments, 0);
					fpCallback.apply(this, aArgs);
				};
			};

			if (bKeepParent) {
				oFinalModule.__super__ = {};
				oFinalModule.__super__.__instance__ = oModuleBase;
				oFinalModule.__super__.__call__ = function (sKey, aArgs) {
					var oObject = this;
					while (ownProp(oObject,sKey) === _false_) {
						oObject = oObject.__instance__.__super__;
					}
					oObject[sKey].apply(oFinalModule, aArgs);
				};
			}
			for (sKey in oModuleBase) {
				if (ownProp(oModuleBase, sKey)) {
					if (sKey === "__super__") {
						continue;
					}
					oFinalModule[sKey] = oModuleBase[sKey];
				}
			}

			for (sKey in oModuleExtended) {
				if (ownProp(oModuleExtended, sKey)) {
					if (oFinalModule.__super__ !== _undefined_ && isFunction(oFinalModule[sKey])) {
						oFinalModule.__super__[sKey] = (callInSupper(oFinalModule[sKey]));

						oFinalModule[sKey] = oModuleExtended[sKey];
					} else {
						oFinalModule[sKey] = oModuleExtended[sKey];
					}
				}
			}
			try {
				return oFinalModule;
			} finally {
				oFinalModule = _null_;
				sKey = _null_;
			}
		},
		/**
		 * extend is the method that will be used to extend a module with new features.
		 * can be used to remove some features too, without touching the original code.
		 * You can extend a module and create a extended module with a different name.
		 * @member Module.prototype
		 * @param {String} sModuleId
		 * @param {Function/String} oSecondParameter can be the name of the new module that extends the baseModule or a function if we want to extend an existent module.
		 * @param {Function} oThirdParameter [optional] this must exist only if we need to create a new module that extends the baseModule.
		 */
		extend: function (sModuleId, oSecondParameter, oThirdParameter) {
			var oModule, sFinalModuleId, fpCreator, oBaseModule, oExtendedModule, oFinalModule, oAction;
			oModule = oModules[sModuleId];
			sFinalModuleId = sModuleId;
			fpCreator = function (oAction) {
				return oAction;
			};

			// Function "overloading".
			// If the 2nd parameter is a string,
			if (typeof oSecondParameter === "string") {
				sFinalModuleId = oSecondParameter;
				fpCreator = oThirdParameter;
			} else {
				fpCreator = oSecondParameter;
			}
			if (oModule === _undefined_) {
				return;
			}
			oAction = new Action();
			oExtendedModule = fpCreator(oAction);
			oBaseModule = oModule.creator(oAction);
			// If we extend the module with the different name, we
			// create proxy class for the original methods.
			oFinalModule = this._merge(oBaseModule, oExtendedModule, (sFinalModuleId !== sModuleId));
			// This gives access to the Action instance used to listen and notify.
			oFinalModule.__action__ = oAction;

			oModules[sFinalModuleId] = {
				creator: (function (oModule) {
					return function () {
						return oModule;
					};
				}(oFinalModule)),
				instance: _null_
			};

			oModule = _null_;
			sFinalModuleId = _null_;
			fpCreator = _null_;
			oBaseModule = _null_;
			oExtendedModule = _null_;
			oFinalModule = _null_;
			oAction = _null_;
		},
		/**
		 * test is a method that will return the module without wrapping their methods.
		 * It's called test because it was created to be able to test the modules with unit testing.
		 * It must work only when it's executed in jstestdriver environment
		 * @member Module.prototype
		 * @param {String} sModuleId
		 * @param {Function} fpCallback
		 */
		test: function (sModuleId, fpCallback) {
			if(jstestdriver)
			{
				setDebug(_true_);
				fpCallback(createInstance(sModuleId));
				setDebug(_false_);
			}
		},
		/**
		 * getModule returns the module with the id
		 * It must work only when it's executed in jstestdriver environment
		 * @param sModuleId
		 */
		getModule: function(sModuleId, bAsStart)
		{
			var oModule = oModules[sModuleId];
			if(jstestdriver)
			{
				oModule = {};
				oModule.instance = createInstance(sModuleId);
				return oModules[sModuleId] = oModule;
			}
			return null;
		},
		/**
		 * start is the method that will initialize the module.
		 * When start is called the module instance will be created and the init method is called.
		 * If bSingle is true and the module is started the module will be stopped before instance it again.
		 *   This avoid execute the same listeners more than one time.
		 * @member Module.prototype
		 * @param {String} sModuleId
		 * @param {Object} oData
		 * @param {Boolean} bSingle
		 */
		start: function (sModuleId, oData, bSingle) {
			var oModule;
			oModule = oModules[sModuleId];

			if (bSingle && this.isModuleStarted(sModuleId)) {
				this.stop(sModuleId);
			}
			if (oModule !== _undefined_) {
				oModule.instance = createInstance(sModuleId);
				oModule.instance.init(oData);
			}

			oModule = _null_;
		},
		/**
		 * Checks if module was already successfully started
		 * @member Module.prototype
		 * @param {String}sModuleId Name of the module
		 * @return boolean
		 */
		isModuleStarted: function (sModuleId) {
			return (typeof oModules[sModuleId] !== _undefined_ && oModules[sModuleId].instance !== _null_);
		},
		/**
		 * startAll is the method that will initialize all the registered modules.
		 * @member Module.prototype
		 */
		startAll: function () {
			var sModuleId;

			for (sModuleId in oModules) {
				if (ownProp(oModules, sModuleId)) {
					this.start(sModuleId);
				}
			}

			sModuleId = _null_;
		},
		/**
		 * stop is the method that will finish the module if it was registered and started.
		 * When stop is called the module will call the destroy method and will nullify the instance.
		 * @member Module.prototype
		 * @param {String} sModuleId
		 */
		stop: function (sModuleId) {
			var oModule;
			oModule = oModules[sModuleId];
			if (oModule !== _undefined_ && oModule.instance !== _null_) {
				oModule.instance.destroy();
				oModule.instance = _null_;
			}
		},
		/**
		 * stopAll is the method that will finish all the registered and started modules.
		 * @member Module.prototype
		 */
		stopAll: function () {
			var sModuleId;

			for (sModuleId in oModules) {
				if (ownProp(oModules, sModuleId)) {
					this.stop(sModuleId);
				}
			}

			sModuleId = _null_;
		},
		/**
		 * _delete is a wrapper method that will call the native delete javascript function
		 * It's important to test the full code.
		 * @member Module.prototype
		 * @param {String} sModuleId
		 */
		_delete: function (sModuleId) {
			delete oModules[sModuleId];
		},
		/**
		 * remove is the method that will remove the full module from the oModules object
		 * @member Module.prototype
		 * @param {String} sModuleId
		 */
		remove: function (sModuleId) {
			var oModule;
			oModule = oModules[sModuleId];

			if (oModule !== _undefined_) {
				try
				{
					return oModule;
				}finally
				{
					oModules[sModuleId] = _null_;
					this._delete(sModuleId);
				}
			}
		}
	};

	/**
	 * Mediator/Bus class that manages the listeners and notifications
	 * @constructor
	 * @class Action
	 * @name Action
	 */
	Action = function () {};

	Action.prototype = {
		/**
		 * type is a property to be able to know the class type.
		 * @member Action.prototype
		 * @type String
		 */
		type: "Action",
		/**
		 * listen is the method that will add a new action to the oActions object
		 * and that will activate the listener.
		 * @member Action.prototype
		 * @param {Array} aNotificationsToListen
		 * @param {Function} fpHandler
		 * @param {Object} oModule
		 */
		listen: function (aNotificationsToListen, fpHandler, oModule) {
			var sNotification, nNotification, nLenNotificationsToListen;
			sNotification = '';
			nLenNotificationsToListen = aNotificationsToListen.length;

			for (nNotification = 0; nNotification < nLenNotificationsToListen; nNotification = nNotification + 1) {
				sNotification = aNotificationsToListen[nNotification];
				if (oActions[sNotification] === _undefined_) {
					oActions[sNotification] = [];
				}
				oActions[sNotification].push({
					module: oModule,
					handler: fpHandler
				});
			}
		},
		/**
		 * notify is the method that will launch the actions that are listening the notified action
		 * @member Action.prototype
		 * @param oNotifier - Notifier.type and Notifier.data are needed
		 */
		notify: function (oNotifier) {
			var sType, oAction, nAction, nLenActions;
			sType = oNotifier.type;
			oAction = _null_;

			if (oActions[sType] === _undefined_) {
				return;
			}
			nLenActions = oActions[sType].length;
			for (nAction = 0; nAction < nLenActions; nAction = nAction + 1) {
				oAction = oActions[sType][nAction];
				oAction.handler.call(oAction.module, oNotifier);
			}

			sType = _null_;
			nAction = _null_;
			nLenActions = _null_;
			oAction = _null_;
		},
		/**
		 * stopListen removes the actions that are listening the aNotificationsToStopListen in the oModule
		 * @member Action.prototype
		 * @param {Array} aNotificationsToStopListen
		 * @param {Object} oModule
		 */
		stopListen: function (aNotificationsToStopListen, oModule) {
			var sNotification, aAuxActions, nNotification, nLenNotificationsToListen, nAction, nLenActions;
			sNotification = '';
			aAuxActions = [];
			nLenNotificationsToListen = aNotificationsToStopListen.length;
			nAction = 0;
			nLenActions = 0;

			for (nNotification = 0; nNotification < nLenNotificationsToListen; nNotification = nNotification + 1) {
				aAuxActions = [];
				sNotification = aNotificationsToStopListen[nNotification];
				nLenActions = oActions[sNotification].length;
				for (nAction = 0; nAction < nLenActions; nAction = nAction + 1) {
					if (oModule !== oActions[sNotification][nAction].module) {
						aAuxActions.push(oActions[sNotification][nAction]);
					}
				}
				oActions[sNotification] = aAuxActions;
				if (oActions[sNotification].length === 0) {
					delete oActions[sNotification];
				}
			}

			sNotification = _null_;
			aAuxActions = _null_;
			nNotification = _null_;
			nLenNotificationsToListen = _null_;
			nAction = _null_;
			nLenActions = _null_;
		},
		/**
		 * __restore__ is a private method to reset the oActions object to an empty object.
		 * @private
		 * @member Action.prototype
		 */
		__restore__ : function () {
			oActions = {};
		}
	};

	/**
	 * Promise is a class that must/can be used to defer execution of one or some callbacks when one condition (normally some asynchronous callbacks that are depending one of other)
	 * @class Promise
	 * @constructor
	 * @name Promise
	 */
	Promise = function () {
		// Pending callbacks
		this.aPending = [];
		this.bCompleted = _false_;
		this.sType = '';
		this.oResult = _null_;
		this.oAction = Hydra.action();

		// Must be called when something finished successfully
		this.resolve = (function (oContext) {
			return function (oResult) {
				oContext.bCompleted = _true_;
				oContext.sType = 'resolve';
				oContext.oResult = oResult;
				oContext.oAction.notify({type: 'complete'});
			};
		}(this));
		// Must be called when something fails
		this.reject = (function (oContext) {
			return function (oResult) {
				oContext.bCompleted = _true_;
				oContext.sType = 'reject';
				oContext.oResult = oResult;
				oContext.oAction.notify({type: 'complete'});
			};
		}(this));
	};

	/**
	 * Adds new callbacks to execute when the promise has been completed
	 * @member Promise.prototype
	 * @param {Function} fpSuccess
	 * @param {Function} fpFailure
	 * @return {Object} Promise instance
	 */
	Promise.prototype.then = function (fpSuccess, fpFailure) {
		this.aPending.push({ resolve: fpSuccess, reject: fpFailure});
		return this;
	};

	/**
	 * Deferred is a manager of Promise objects.
	 * Deferred object has some Promise objects added and execute the correct callbacks when all the added Promise object are completed.
	 * @class Deferred
	 * @constructor
	 * @name Deferred
	 */
	Deferred = function () {
		this.aPromises = [];
		this.aPending = [];
		this.sType = '';
		this.oAction = Hydra.action();
		this.oAction.listen(['complete'], this.checkCompleted, this);
	};

	Deferred.prototype = {
		/**
		 * Adds a new Promise object to the array of Promise object that are needed to be completed.
		 * @member Deferred.prototype
		 * @param oPromise
		 * @return {Object} Deferred instance
		 */
		add: function (oPromise) {
			this.aPromises.push(oPromise);
			return this;
		},
		/**
		 * This method is called when any Promise object notify 'complete'
		 * Checks the completion of all the Promise objects.
		 * If any of the Promises is not complete continue waiting.
		 * If all the Promises are complete then complete method is executed.
		 * @member Deferred.prototype
		 */
		checkCompleted: function () {
			var nPromise, nLenPromise, oPromise;
			nLenPromise = this.aPromises.length;
			oPromise = _null_;

			for (nPromise = 0; nPromise < nLenPromise; nPromise++) {
				oPromise = this.aPromises[nPromise];
				if (!oPromise.bCompleted) {
					return _false_;
				}
			}
			this.complete(this.getType());

			nPromise = _null_;
			nLenPromise = _null_;
			oPromise = _null_;
		},
		/**
		 * Return the type of completion [reject, resolve]
		 * @member Deferred.prototype
		 */
		getType: function () {
			var nPromise, nLenPromises, oPromise, aTypes, sType;
			nLenPromises = this.aPromises.length;
			oPromise = _null_;
			aTypes = [];

			for (nPromise = 0; nPromise < nLenPromises; nPromise++) {
				oPromise = this.aPromises[nPromise];
				if (oPromise.bCompleted) {
					aTypes.push(oPromise.sType);
				}
			}
			if (aTypes.length === 0) {
				return "";
			}
			sType = aTypes.join("").replace(reResolve, "").length > 0 ? 'reject' : 'resolve';

			try {
				return sType;
			} finally {
				nPromise = _null_;
				nLenPromises = _null_;
				oPromise = _null_;
				aTypes = _null_;
			}
		},
		/**
		 * Executes the correct method/s depending of completion type [success, fail]
		 * @member Deferred.prototype
		 * @param {String} sType
		 */
		complete: function (sType) {
			var nPromise, nLenPromises, oPromise;
			if (sType.length === 0) {
				return _false_;
			}
			nLenPromises = this.aPromises.length;

			for (nPromise = 0; nPromise < nLenPromises; nPromise++) {
				oPromise = this.aPromises[nPromise];
				while (oPromise.aPending[0]) {
					oPromise.aPending.shift()[sType](oPromise.oResult);
				}
			}
			while (this.aPending[0]) {
				this.aPending.shift()[sType]();
			}

			nPromise = _null_;
			nLenPromises = _null_;
			oPromise = _null_;
		},
		/**
		 * Adds new callbacks to execute when the promise has been completed
		 * @param {Function} fpSuccess
		 * @param {Function} fpFailure
		 */
		then: function (fpSuccess, fpFailure) {
			this.aPending.push({ resolve: fpSuccess, reject: fpFailure});
			return this;
		}
	};

	/**
	 * Sugar function to create a new Deferred object.
	 * When expects Promise objects to be added to the Deferred object [Promise1, Promise2,...PromiseN]
	 * If one of the arguments is not a Promise When assume that we want to complete the Deferred object
	 * @private
	 */
	When = function () {
		var aArgs, nArg, nLenArgs, oDeferred, oArg;
		aArgs = slice(arguments, 0);
		nLenArgs = aArgs.length;
		oArg = _null_;

		this.oDeferred = oDeferred = new Deferred();

		for (nArg = 0; nArg < nLenArgs; nArg++) {
			oArg = aArgs[nArg];
			if (oArg instanceof Promise) {
				oDeferred.add(oArg);
			} else {
				oDeferred.complete('resolved');
				return;
			}
		}

		try {
			return oDeferred;
		} finally {
			aArgs = _null_;
			nArg = _null_;
			nLenArgs = _null_;
			oArg = _null_;
		}
	};

	/**
	 * getErrorHandler is a method to gain access to the private ErrorHandler constructor.
	 * @private
	 * @return ErrorHandler class
	 */
	function getErrorHandler() {
		return ErrorHandler;
	}

	/**
	 * setErrorHandler is a method to set the ErrorHandler to a new object to add more logging logic.
	 * @private
	 * @param {Function} oErrorHandler
	 */
	function setErrorHandler(oErrorHandler) {
		ErrorHandler = oErrorHandler;
	}

	/**
	 * Hydra is the api that will be available to use by developers
	 * @constructor
	 * @class Hydra
	 * @name Hydra
	 */
	Hydra = function () {};

	/**
	 * Version number of Hydra.
	 * @static
	 * @member Hydra
	 * @type String
	 */
	Hydra.version = sVersion;

	/**
	 * action is a method to get a new instance of Action
	 * @static
	 * @member Hydra
	 * @return {Action} Action instance
	 */
	Hydra.action = function () {
		return new Action();
	};

	/**
	 * Returns the actual ErrorHandler
	 * @static
	 * @member Hydra
	 * @type ErrorHandler
	 */
	Hydra.errorHandler = getErrorHandler;

	/**
	 * Sets and overwrites the ErrorHandler object to log errors and messages
	 * @static
	 * @param ErrorHandler
	 * @member Hydra
	 */
	Hydra.setErrorHandler = setErrorHandler;

	/**
	 * Return a singleton of Module
	 * @static
	 * @member Hydra
	 */
	Hydra.module = new Module();

	/**
	 * Change the debug mode to on/off
	 * @static
	 * @member Hydra
	 */
	Hydra.setDebug = setDebug;

	/**
	 * Returns the constructor of Deferred object
	 * @static
	 * @member Hydra
	 */
	Hydra.deferred = Deferred;

	/**
	 * Returns the constructor of Promise object
	 * @static
	 * @member Hydra
	 */
	Hydra.promise = Promise;

	/**
	 * Sugar method to generate Deferred objects in a simple way
	 * @static
	 * @member Hydra
	 */
	Hydra.when = When;
	/*
	 * This line exposes the private object to be accessible from outside of this code.
	 */
	ns.Hydra = Hydra;
}(window, document));