(function ( global, ns, _undefined_ ) {
	'use strict';
	var oModules, doc, oVars, _null_, _false_, _true_, sVersion, Hydra, bDebug, ErrorHandler, Module, Action, oActions;

	/**
	 * If ns (namespace) is not supplied global is assumed
	 */
	if ( ns === _undefined_ ) {
		ns = global;
	}

	/**
	 * Assign global.document (window.document) to a local variable.
	 */
	if ( global.document ) {
		doc = global.document;
	}

	/**
	 * Contains a reference to null object to decrease final size
	 * @type {Object}
	 * @private
	 */
	_null_ = null;

	/**
	 * Contains a reference to false to decrease final size
	 * @type {Boolean}
	 * @private
	 */
	_false_ = false;

	/**
	 * Contains a reference to true to decrease final size.
	 * @type {Boolean}
	 * @private
	 */
	_true_ = true;

	/**
	 * Property that will save the registered modules
	 * @private
	 * @type {Object}
	 */
	oModules = {};

	/**
	 * Version of Hydra
	 * @private
	 * @type {String}
	 */
	sVersion = "2.2.0";

	/**
	 * Used to activate the debug mode
	 * @private
	 * @type {Boolean}
	 */
	bDebug = _false_;

	/**
	 * Property that will save the actions to be listened
	 * @private
	 * @type {Object}
	 */
	oActions = {};

	/**
	 * Wrapper of Object.prototype.toString to detect type of object in cross browsing mode.
	 * @private
	 * @param {Object} oObject
	 * @return {String}
	 */
	function toString ( oObject ) {
		return {}.toString.call( oObject );
	}

	/**
	 * isFunction is a function to know if the object passed as parameter is a Function object.
	 * @private
	 * @param {Object} fpCallback
	 * @return {Boolean}
	 */
	function isFunction ( fpCallback ) {
		return toString( fpCallback ) === '[object Function]';
	}

	/**
	 * isArray is a function to know if the object passed as parameter is an Array
	 * @private
	 * @param aArray
	 * @return {Boolean}
	 */
	function isArray ( aArray ) {
		return toString( aArray ) === '[object Array]';
	}

	/**
	 * setDebug is a method to set the bDebug flag.
	 * @private
	 * @param {Boolean} _bDebug
	 */
	function setDebug ( _bDebug ) {
		bDebug = _bDebug;
	}

	/**
	 * Converts objects like node list to real array.
	 * @private
	 * @param {Object} oLikeArray
	 * @param {Number} nElements
	 * @return {Array}
	 */
	function slice ( oLikeArray, nElements ) {
		return [].slice.call( oLikeArray, nElements || 0 );
	}

	/**
	 * Wrapper of Object.hasOwnProperty
	 * @private
	 * @param oObj
	 * @param sKey
	 * @return {Boolean}
	 */
	function ownProp ( oObj, sKey ) {
		return oObj.hasOwnProperty( sKey );
	}

	/**
	 * Do a simple merge of two objects overwriting the target properties with source properties
	 * @param oTarget
	 * @param oSource
	 * @private
	 */
	function simpleMerge ( oTarget, oSource ) {
		var sKey;
		for ( sKey in oSource ) {
			if ( ownProp( oSource, sKey ) ) {
				oTarget[sKey] = oSource[sKey];
			}
		}
		return oTarget;
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
	function wrapMethod ( oInstance, sName, sModuleId, fpMethod ) {
		oInstance[sName] = (function ( sName, fpMethod ) {
			return function () {
				var aArgs = slice( arguments, 0 );
				try {
					return fpMethod.apply( this, aArgs );
				}
				catch ( erError ) {
					ErrorHandler.log( sModuleId, sName, erError );
				}
				finally {
					aArgs = _null_;
				}
			};
		}( sName, fpMethod ));
	}

	/**
	 * Add common properties and methods to avoid repeating code in modules
	 * @param {String} sModuleId
	 * @param {Action} oAction
	 */
	function addPropertiesAndMethodsToModule ( sModuleId, oAction ) {
		var oModule,
			fpInitProxy;
		oModule = oModules[sModuleId].creator( oAction );
		fpInitProxy = oModule.init;
		oModule.__action__ = oAction;
		oModule.oEventsCallbacks = oModule.oEventsCallbacks || {};
		oModule.aListeningEvents = (function () {
			var oEventsCallbacks = oModule.oEventsCallbacks,
				sKey,
				aListeningEvents = [];
			for ( sKey in oEventsCallbacks ) {
				if ( oEventsCallbacks.hasOwnProperty( sKey ) ) {
					aListeningEvents.push( sKey );
				}
			}
			oEventsCallbacks = sKey = null;
			return aListeningEvents;
		}());
		oModule.init = function ( oArgs ) {
			var aArgs = slice( arguments, 0 ).concat( oVars );
			oAction.listen( this.aListeningEvents, this.handleAction, this );
			fpInitProxy.apply( this, aArgs );
		};
		oModule.handleAction = function ( oNotifier ) {
			var fpCallback = this.oEventsCallbacks[oNotifier.type];
			if ( fpCallback === _undefined_ ) {
				return;
			}
			fpCallback.call( this, oNotifier );
		};
		oModule.onDestroy = oModule.onDestroy || function () {};
		oModule.destroy = function () {
			this.onDestroy();
			oAction.stopListen( this.aListeningEvents, this );
		};
		return oModule;
	}

	/**
	 * createInstance is the method that will create the module instance and wrap the method if needed.
	 * @private
	 * @param {String} sModuleId
	 * @return {Object} Module instance
	 */
	function createInstance ( sModuleId ) {
		var oAction, oInstance, sName, fpMethod;
		if ( oModules[sModuleId] === _undefined_ ) {
			throw new Error( "The module is not registered!" );
		}
		oAction = new Action();
		sName = '';
		fpMethod = function () {};

		oInstance = addPropertiesAndMethodsToModule( sModuleId, oAction );

		if ( !bDebug ) {
			for ( sName in oInstance ) {
				if ( ownProp( oInstance, sName ) ) {
					fpMethod = oInstance[sName];
					if ( !isFunction( fpMethod ) ) {
						continue;
					}
					wrapMethod( oInstance, sName, sModuleId, fpMethod );
				}
			}
		}
		try {
			return oInstance;
		}
		finally {
			oAction = _null_;
			oInstance = _null_;
			sName = _null_;
			fpMethod = _null_;
		}
	}
	/**
	 * Simple object to abstract the error handler, the most basic is to be the console object
	 */
	ErrorHandler = global.console || {
		log: function(){}
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
		 * @return {Module}
		 */
		register: function ( sModuleId, fpCreator ) {
			oModules[sModuleId] = {
				creator: fpCreator,
				instances: {}
			};
			return oModules[sModuleId];
		},
		/**
		 * _merge is the method that gets the base module and the extended and returns the merge of them
		 * @private
		 * @param {Object} oModuleBase
		 * @param {Object} oModuleExtended
		 * @param {Boolean} bKeepParent If we keep parent calls to be callable via __super__.
		 * @return {Module}
		 */
		_merge: function ( oModuleBase, oModuleExtended, bKeepParent ) {
			var oFinalModule, sKey, callInSupper;
			oFinalModule = {};
			callInSupper = function ( fpCallback ) {
				return function () {
					var aArgs = slice( arguments, 0 );
					fpCallback.apply( this, aArgs );
				};
			};

			if ( bKeepParent ) {
				oFinalModule.__super__ = {};
				oFinalModule.__super__.__instance__ = oModuleBase;
				oFinalModule.__super__.__call__ = function ( sKey, aArgs ) {
					var oObject = this;
					while ( ownProp( oObject, sKey ) === _false_ ) {
						oObject = oObject.__instance__.__super__;
					}
					oObject[sKey].apply( oFinalModule, aArgs );
				};
			}
			for ( sKey in oModuleBase ) {
				if ( ownProp( oModuleBase, sKey ) ) {
					if ( sKey === "__super__" ) {
						continue;
					}
					oFinalModule[sKey] = oModuleBase[sKey];
				}
			}

			for ( sKey in oModuleExtended ) {
				if ( ownProp( oModuleExtended, sKey ) ) {
					if ( oFinalModule.__super__ !== _undefined_ && isFunction( oFinalModule[sKey] ) ) {
						oFinalModule.__super__[sKey] = (callInSupper( oFinalModule[sKey] ));

						oFinalModule[sKey] = oModuleExtended[sKey];
					} else {
						oFinalModule[sKey] = oModuleExtended[sKey];
					}
				}
			}
			try {
				return oFinalModule;
			}
			finally {
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
		extend: function ( sModuleId, oSecondParameter, oThirdParameter ) {
			var oModule, sFinalModuleId, fpCreator, oBaseModule, oExtendedModule, oFinalModule, oAction;
			oModule = oModules[sModuleId];
			sFinalModuleId = sModuleId;
			fpCreator = function ( oAction ) {
				return oAction;
			};

			// Function "overloading".
			// If the 2nd parameter is a string,
			if ( typeof oSecondParameter === "string" ) {
				sFinalModuleId = oSecondParameter;
				fpCreator = oThirdParameter;
			} else {
				fpCreator = oSecondParameter;
			}
			if ( oModule === _undefined_ ) {
				return;
			}
			oAction = new Action();
			oExtendedModule = fpCreator( oAction );
			oBaseModule = oModule.creator( oAction );
			// If we extend the module with the different name, we
			// create proxy class for the original methods.
			oFinalModule = this._merge( oBaseModule, oExtendedModule, (sFinalModuleId !== sModuleId) );
			// This gives access to the Action instance used to listen and notify.
			oFinalModule.__action__ = oAction;

			oModules[sFinalModuleId] = {
				creator: (function ( oModule ) {
					return function () {
						return oModule;
					};
				}( oFinalModule )),
				instances: {}
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
		 * Sets an object of vars and add it's content to oVars private variable
		 * @param oVar
		 */
		setVars: function ( oVar ) {
			if ( typeof oVars !== 'undefined' ) {
				oVars = simpleMerge( oVars, oVar );
			} else {
				oVars = oVar;
			}
		},
		/**
		 * Returns the private vars object by copy.
		 * @returns {Object} global vars.
		 */
		getVars: function () {
			return simpleMerge( {}, oVars );
		},
		/**
		 * test is a method that will return the module without wrapping their methods.
		 * It's called test because it was created to be able to test the modules with unit testing.
		 * It must work only when it's executed in jstestdriver environment
		 * @member Module.prototype
		 * @param {String} sModuleId
		 * @param {Function} fpCallback
		 */
		test: function ( sModuleId, fpCallback ) {
			if ( jstestdriver ) {
				setDebug( _true_ );
				fpCallback( createInstance( sModuleId ) );
				setDebug( _false_ );
			}
		},
		/**
		 * getModule returns the module with the id
		 * It must work only when it's executed in jstestdriver environment
		 * @param {String} sModuleId
		 * @param {String} sContainerId
		 * @return {Module}
		 */
		getModule: function ( sModuleId, sContainerId ) {
			var oModule = oModules[sModuleId], oInstance;
			if ( jstestdriver ) {
				oInstance = createInstance( sModuleId );
				oModule.instances[sContainerId] = oInstance;
				return oModule;
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
		 * @param {String} sContainerId
		 * @param {Object} oData
		 * @param {Boolean} bSingle
		 * @return {Module} instance of the module
		 */
		start: function ( sModuleId, sContainerId, oData, bSingle ) {
			var oModule, oInstance;
			oModule = oModules[sModuleId];

			if ( bSingle && this.isModuleStarted( sModuleId, sContainerId ) ) {
				this.stop( sModuleId, sContainerId );
			}
			if ( oModule !== _undefined_ ) {
				oInstance = createInstance( sModuleId );
				oModule.instances[sContainerId] = oInstance;
				oInstance.__container__ = doc.getElementById( sContainerId );
				if ( typeof oData !== 'undefined' ) {
					oInstance.init( oData );
				} else {
					oInstance.init();
				}
			}

			oModule = _null_;

			return oInstance;
		},
		/**
		 * Checks if module was already successfully started
		 * @member Module.prototype
		 * @param {String} sModuleId Name of the module
		 * @param {String} sContainerId Id of the DOM element
		 * @return {Boolean}
		 */
		isModuleStarted: function ( sModuleId, sContainerId ) {
			return (typeof oModules[sModuleId] !== _undefined_ && oModules[sModuleId].instances[sContainerId] !== _undefined_);
		},
		/**
		 * startAll is the method that will initialize all the registered modules.
		 * @member Module.prototype
		 */
		startAll: function () {
			var sModuleId, oModule;

			for ( sModuleId in oModules ) {
				if ( ownProp( oModules, sModuleId ) ) {
					oModule = oModules[sModuleId];
					if ( oModule !== _undefined_ ) {
						this.start( sModuleId, Math.random() );
					}
				}
			}

			sModuleId = _null_;
		},
		/**
		 * stop is the method that will finish the module if it was registered and started.
		 * When stop is called the module will call the destroy method and will nullify the instance.
		 * @member Module.prototype
		 * @param {String} sModuleId
		 * @param {String} sContainerId
		 * @return {Boolean}
		 */
		stop: function ( sModuleId, sContainerId ) {
			var oModule, oInstance;
			oModule = oModules[sModuleId];
			if ( oModule === _undefined_ ) {
				return false;
			}
			oInstance = oModule.instances[sContainerId];
			if ( oModule !== _undefined_ && oInstance !== _undefined_ ) {
				oInstance.destroy();
			}
			oModule = oInstance = _null_;
			return true;
		},
		/**
		 * stopAll is the method that will finish all the registered and started modules.
		 * @member Module.prototype
		 */
		stopAll: function () {
			var sModuleId, oModule, sContainerId;

			for ( sModuleId in oModules ) {
				if ( ownProp( oModules, sModuleId ) ) {
					oModule = oModules[sModuleId];
					if ( oModule !== _undefined_ ) {
						for ( sContainerId in oModule.instances ) {
							if ( ownProp( oModule.instances, sContainerId ) ) {
								this.stop( sModuleId, sContainerId );
							}

						}
					}
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
		_delete: function ( sModuleId ) {
			if ( oModules[sModuleId] !== _undefined_ ) {
				delete oModules[sModuleId];
			}
		},
		/**
		 * remove is the method that will remove the full module from the oModules object
		 * @member Module.prototype
		 * @param {String} sModuleId
		 */
		remove: function ( sModuleId ) {
			var oModule = oModules[sModuleId];
			if ( oModule === _undefined_ ) {
				return null;
			}
			if ( oModule !== _undefined_ ) {
				try {
					return oModule;
				}
				finally {
					oModule = _null_;
					this._delete( sModuleId );
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
		listen: function ( aNotificationsToListen, fpHandler, oModule ) {
			var sNotification, nNotification, nLenNotificationsToListen;
			sNotification = '';
			nLenNotificationsToListen = aNotificationsToListen.length;

			for ( nNotification = 0; nNotification < nLenNotificationsToListen; nNotification = nNotification + 1 ) {
				sNotification = aNotificationsToListen[nNotification];
				if ( oActions[sNotification] === _undefined_ ) {
					oActions[sNotification] = [];
				}
				oActions[sNotification].push( {
					module: oModule,
					handler: fpHandler
				} );
			}
		},
		/**
		 * notify is the method that will launch the actions that are listening the notified action
		 * @member Action.prototype
		 * @param oNotifier - Notifier.type and Notifier.data are needed
		 */
		notify: function ( oNotifier ) {
			var sType, oAction, aActions, nAction, nLenActions;
			sType = oNotifier.type;
			oAction = _null_;

			if ( oActions[sType] === _undefined_ ) {
				return;
			}
			// Duplicate actions array in order to avoid broken references when removing listeners.
			aActions = oActions[sType].slice();
			nLenActions = aActions.length;
			for ( nAction = 0; nAction < nLenActions; nAction = nAction + 1 ) {
				oAction = aActions[nAction];
				oAction.handler.call( oAction.module, oNotifier );
			}

			sType = _null_;
			aActions = _null_;
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
		stopListen: function ( aNotificationsToStopListen, oModule ) {
			var sNotification, aAuxActions, nNotification, nLenNotificationsToListen, nAction, nLenActions;
			sNotification = '';
			aAuxActions = [];
			nLenNotificationsToListen = aNotificationsToStopListen.length;
			nAction = 0;
			nLenActions = 0;

			for ( nNotification = 0; nNotification < nLenNotificationsToListen; nNotification = nNotification + 1 ) {
				aAuxActions = [];
				sNotification = aNotificationsToStopListen[nNotification];
				nLenActions = oActions[sNotification].length;
				for ( nAction = 0; nAction < nLenActions; nAction = nAction + 1 ) {
					if ( oModule !== oActions[sNotification][nAction].module ) {
						aAuxActions.push( oActions[sNotification][nAction] );
					}
				}
				oActions[sNotification] = aAuxActions;
				if ( oActions[sNotification].length === 0 ) {
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
		__restore__: function () {
			oActions = {};
		}
	};

	/**
	 * getErrorHandler is a method to gain access to the private ErrorHandler constructor.
	 * @private
	 * @return ErrorHandler class
	 */
	function getErrorHandler () {
		return ErrorHandler;
	}

	/**
	 * setErrorHandler is a method to set the ErrorHandler to a new object to add more logging logic.
	 * @private
	 * @param {Function} oErrorHandler
	 */
	function setErrorHandler ( oErrorHandler ) {
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
	 * Extends Hydra object with new functionality
	 * @param sIdExtension
	 * @param oExtension
	 */
	Hydra.extend = function(sIdExtension, oExtension)
	{
		if(this[sIdExtension] === _undefined_)
		{
			this[sIdExtension] = oExtension;
		}else
		{
			this[sIdExtension] = simpleMerge(this[sIdExtension], oExtension);
		}
	};

	/**
	 * Adds an alias to parts of Hydra
	 * @param sOldName
	 * @param sNewName
	 * @return {Boolean}
	 */
	Hydra.noConflict = function(sOldName, oNewContext, sNewName)
	{
		if(this[sOldName] !== _undefined_)
		{
			oNewContext[sNewName] = this[sOldName];
			return true;
		}
		return false;
	};

	/*
	 * This line exposes the private object to be accessible from outside of this code.
	 */
	ns.Hydra = Hydra;
}( window ));