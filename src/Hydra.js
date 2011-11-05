(function (win, doc) {
    'use strict';
    var oModules, Hydra, bDebug, ErrorHandler, Module, Action, oActions, Promise, Deferred, When;

    oModules = {};
    Hydra = null;
    bDebug = false;
    ErrorHandler = function () {
    };
    Module = function () {
    };
    Action = function () {
    };
    /**
     * oActions is the property that will save the actions to be listened
     * @member Action.prototype
     * @type Object
     */
    oActions = {};
    /**
     * isFunction is a method to know if the object passed as parameter is a Function object.
     * @private
     * @param {Object} fpCallback
     * @return Boolean
     */
    function isFunction(fpCallback) {
        return Object.prototype.toString.call(fpCallback) === "[object Function]";
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
                var aArgs = [].slice.call(arguments, 0);
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
     * @param {String} sModuleId
     * @return {Object} Module instance
     */
    function createInstance(sModuleId) {
        if (typeof oModules[sModuleId] === "undefined") {
            throw new Error("The module is not registered!");
        }
        var oAction, oInstance, sName, fpMethod;
        oAction = new Action();
        oInstance = oModules[sModuleId].creator(oAction);
        sName = '';
        fpMethod = function () {
        };

        oInstance.__action__ = oAction;

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
    ErrorHandler.list = null;
    /**
     * create_dom is the method that will create the hidden layer to log the errors
     * on system without console.
     * @member ErrorHandler
     * @static
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
        oLayer = oList = null;
        oLayerStyle = null;
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
        var oItem = doc.createElement("li");
        oItem.appendChild(doc.createTextNode(sModuleId + "/" + sMethod + ": " + erError.message));
        this.list.appendChild(oItem);
        oItem = null;
    };
    /**
     * log is the method that will differentiate the system if they had console or not.
     * if window.console exist console.log will be called
     * if window.console not exist then the log on layer will be activated.
     * Lazy pattern will be used to avoid extra work on next calls.
     * Arguments are sent to the methods that will be applied.
     * @static
     */
    ErrorHandler.log = function () {
        var aArgs = [].slice.call(arguments, 0).concat();

        if (typeof win.console === "undefined" || (typeof aArgs[aArgs.length - 1] === 'boolean' && !aArgs[aArgs.length - 1])) {
            if (this.list === null) {
                this.create_dom();
            }
            this.addItem.apply(this, aArgs);
            ErrorHandler.__old_log__ = ErrorHandler.log;
            this.log = function () {
                var aArgs = [].slice.call(arguments, 0).concat();
                this.addItem.apply(this, aArgs);
                aArgs = null;
            };
        } else {
            win.console.log.apply(win.console, aArgs);
            ErrorHandler.__old_log__ = ErrorHandler.log;
            this.log = function () {
                var aArgs = [].slice.call(arguments, 0).concat();
                win.console.log.apply(win.console, aArgs);
                aArgs = null;
            };
        }
        aArgs = null;
    };
    /**
     * type is a property to be able to know the class type.
     * @member Module.prototype
     * @type String
     */
    Module.prototype.type = "Module";
    /**
     * register is the method that will add the new module to the oModules object.
     * sModuleId will be the key where it will be stored.
     * @member Module.prototype
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
     * _merge is the method that gets the base module and the extended and returns the merge of them
     * @private
     * @param {Object} oModuleBase
     * @param {Object} oModuleExtended
     * @param {Boolean} bKeepParent If we keep parent calls to be callable via __super__.
     * @return Object
     */
    Module.prototype._merge = function (oModuleBase, oModuleExtended, bKeepParent) {
        var oFinalModule = {},
            sKey = '';
        if (bKeepParent) {
            oFinalModule.__super__ = {};
            oFinalModule.__super__.__instance__ = oModuleBase;
            oFinalModule.__super__.__call__ = function (sKey, aArgs) {
                var oObject = this;
                while (oObject.hasOwnProperty(sKey) === false) {
                    oObject = oObject.__instance__.__super__;
                }
                oObject[sKey].apply(oFinalModule, aArgs);
            };
        }

        for (sKey in oModuleBase) {
            if (oModuleBase.hasOwnProperty(sKey)) {
                if (sKey === "__super__") {
                    continue;
                }
                oFinalModule[sKey] = oModuleBase[sKey];
            }
        }
        function callInSupper(fpCallback) {
            return function () {
                var aArgs = [].slice.call(arguments, 0);
                fpCallback.apply(this, aArgs);
            };
        }

        for (sKey in oModuleExtended) {
            if (oModuleExtended.hasOwnProperty(sKey)) {
                if (typeof oFinalModule.__super__ !== "undefined" && Object.prototype.toString.call(oFinalModule[sKey]) === "[object Function]") {
                    oFinalModule.__super__[sKey] = (callInSupper(oFinalModule[sKey]));

                    oFinalModule[sKey] = oModuleExtended[sKey];
                } else {
                    oFinalModule[sKey] = oModuleExtended[sKey];
                }
            }
        }
        return oFinalModule;
    };
    /**
     * extend is the method that will be used to extend a module with new features.
     * can be used to remove some features too, without touching the original code.
     * You can extend a module and create a extended module with a different name.
     * @member Module.prototype
     * @param {String} sModuleId
     * @param {Function/String} oSecondParameter can be the name of the new module that extends the baseModule or a function if we want to extend an existent module.
     * @param {Function} oThirdParameter [optional] this must exist only if we need to create a new module that extends the baseModule.
     */
    Module.prototype.extend = function (sModuleId, oSecondParameter, oThirdParameter) {
        var oModule = oModules[sModuleId],
            sFinalModuleId = sModuleId,
            fpCreator = function (oAction) { return oAction; },
            oBaseModule = null,
            oExtendedModule = null,
            oFinalModule = null,
            oAction = null;

        // Function "overloading".
        // If the 2nd parameter is a string,
        if (typeof oSecondParameter === "string") {
            sFinalModuleId = oSecondParameter;
            fpCreator = oThirdParameter;
        } else {
            fpCreator = oSecondParameter;
        }

        if (typeof oModule === "undefined") {
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
            creator: function () {
                return oFinalModule;
            },
            instance: null
        };
    };
    /**
     * test is a method that will return the module without wrapping their methods.
     * It's called test because it was created to be able to test the modules with unit testing.
     * @member Module.prototype
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
     * @param {String} sModuleId
     * @param {Object} oData
     */
    Module.prototype.start = function (sModuleId, oData, bSingle) {
        var oModule = oModules[sModuleId];
        if (bSingle && this.isModuleStarted(sModuleId)) {
            this.stop(sModuleId);
        }
        if (typeof oModule !== "undefined") {
            oModule.instance = createInstance(sModuleId);
            oModule.instance.init(oData);
        }
        oModule = null;
    };
    /**
     * Checks if module was already successfully started
     *
     * @member Module.prototype
     * @param {String}sModuleId Name of the module
     * @return boolean
     */
    Module.prototype.isModuleStarted = function (sModuleId) {
        return ("undefined" !== typeof oModules[sModuleId] && null !== oModules[sModuleId].instance);
    };
    /**
     * startAll is the method that will initialize all the registered modules.
     * @member Module.prototype
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
     * @param {String} sModuleId
     */
    Module.prototype.stop = function (sModuleId) {
        var oModule = oModules[sModuleId];
        if (typeof oModule !== "undefined" && oModule.instance !== null) {
            oModule.instance.destroy();
            oModule.instance = null;
        }
    };
    /**
     * stopAll is the method that will finish all the registered and started modules.
     * @member Module.prototype
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
     * @param {String} sModuleId
     */
    Module.prototype._delete = function (sModuleId) {
        delete oModules[sModuleId];
    };
    /**
     * remove is the method that will remove the full module from the oModules object
     * @member Module.prototype
     * @param {String} sModuleId
     */
    Module.prototype.remove = function (sModuleId) {
        var oModule = oModules[sModuleId];
        if (typeof oModule !== "undefined") {
            oModules[sModuleId] = null;
            this._delete(sModuleId);
        }
    };
    /**
     * type is a property to be able to know the class type.
     * @member Action.prototype
     * @type String
     */
    Action.prototype.type = "Action";
    /**
     * listen is the method that will add a new action to the oActions object
     * and that will activate the listener.
     * @member Action.prototype
     * @param {Array} aNotificationsToListen
     * @param {Function} fpHandler
     * @param {Object} oModule
     */
    Action.prototype.listen = function (aNotificationsToListen, fpHandler, oModule) {
        var sNotification = '',
            nNotification = 0,
            nLenNotificationsToListen = aNotificationsToListen.length;

        for (nNotification = 0; nNotification < nLenNotificationsToListen; nNotification = nNotification + 1) {
            sNotification = aNotificationsToListen[nNotification];
            if (typeof oActions[sNotification] === "undefined") {
                oActions[sNotification] = [];
            }
            oActions[sNotification].push({
                module: oModule,
                handler: fpHandler
            });
        }
    };
    /**
     * notify is the method that will launch the actions that are listening the notified action
     * @member Action.prototype
     * @param oNotifier - Notifier.type and Notifier.data are needed
     */
    Action.prototype.notify = function (oNotifier) {
        var sType = oNotifier.type,
            oAction = null,
            nAction = 0,
            nLenActions = 0;

        if (typeof oActions[sType] === "undefined") {
            return;
        }

        nLenActions = oActions[sType].length;
        for (nAction = 0; nAction < nLenActions; nAction = nAction + 1) {
            oAction = oActions[sType][nAction];
            oAction.handler.call(oAction.module, oNotifier);
        }
        sType = null;
        nAction = nLenActions = null;
        oAction =  null;
    };
    /**
     * stopListen removes the actions that are listening the aNotificationsToStopListen in the oModule
     * @member Action.prototype
     * @param {Array} aNotificationsToStopListen
     * @param {Object} oModule
     */
    Action.prototype.stopListen = function (aNotificationsToStopListen, oModule) {
        var sNotification = '',
            aAuxActions = [],
            nNotification = 0,
            nLenNotificationsToListen = aNotificationsToStopListen.length,
            nAction = 0,
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
    };
    /**
     * __restore__ is a private method to reset the oActions object to an empty object.
     * @private
     * @member Action.prototype
     */
    Action.prototype.__restore__ = function () {
        oActions = {};
    };
    Promise = function()
    {
        var self = this;
        // Pending callbacks
        this.aPending = [];
        this.bCompleted = false;
        this.sType = '';
        this.oResult = null;
        this.oAction = Hydra.action();
        // Called when something finished successfully
        this.resolve = function(oResult) {
            self.bCompleted = true;
            self.sType = 'resolve';
            self.oResult = oResult;
            self.oAction.notify({type: 'complete'});
        };
        // Called when something broke
        this.reject = function(oResult) {
            self.bCompleted = true;
            self.sType = 'reject';
            self.oResult = oResult;
            self.oAction.notify({type: 'complete'});
        };
    };
    Promise.prototype.then = function(fpSuccess, fpFailure) {
        this.aPending.push({ resolve: fpSuccess, reject: fpFailure});
        return this;
    };
    Deferred = function () {
        this.aPromises = [];
        this.aPending = [];
        this.sType = '';
        this.oAction = Hydra.action();
        this.oAction.listen(['complete'], this.checkCompleted, this);
    };
    Deferred.prototype.add = function(oPromise) {
        this.aPromises.push(oPromise);
        return this;
    };
    Deferred.prototype.checkCompleted = function()
    {
        var nPromise = 0;
        var nLenPromise = this.aPromises.length;
        var oPromise = null;
        for(; nPromise < nLenPromise; nPromise++)
        {
            oPromise = this.aPromises[nPromise];
            if(!oPromise.bCompleted)
            {
                return false;
            }
        }
        this.complete(this.getType());
    };
    Deferred.prototype.getType = function()
    {
        var nPromise = 0;
        var nLenPromises = this.aPromises.length;
        var oPromise = null;
        var aTypes = [];
        var sTypes = '';
        for(; nPromise < nLenPromises; nPromise++)
        {
            oPromise = this.aPromises[nPromise];
            if(oPromise.bCompleted)
            {
                aTypes.push(oPromise.sType);
            }
        }
        if(aTypes.length === 0)
        {
            return "";
        }
        return aTypes.join("").replace(/resolve/g, "").length > 0? 'reject' : 'resolve';
    };
    Deferred.prototype.complete = function(sType)
    {
        if(sType.length === 0)
        {
            return false;
        }
        var nPromise = 0;
        var nLenPromises = this.aPromises.length;
        var oPromise = null;
        for(nPromise = 0; nPromise < nLenPromises; nPromise++)
        {
            oPromise = this.aPromises[nPromise];
            while (oPromise.aPending[0]) {
                oPromise.aPending.shift()[sType](oPromise.oResult);
            }
        }
        while(this.aPending[0])
        {
            this.aPending.shift()[sType]();
        }
    };
    Deferred.prototype.then = function(fpSuccess, fpFailure) {
        this.aPending.push({ resolve: fpSuccess, reject: fpFailure});
        return this;
    };
    When = function()
    {
        this.oDeferred = new Deferred();
        var aArgs = [].slice.call(arguments);
        var nArg = 0;
        var nLenArgs = aArgs.length;
        var oArg = null;
        for(; nArg < nLenArgs; nArg++)
        {
            oArg = aArgs[nArg];
            if(oArg instanceof Promise)
            {
                this.oDeferred.add(oArg);
            }else
            {
                this.oDeferred.complete('resolved');
                return;
            }
        }
        return this.oDeferred;
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
     * setDebug is a method to set the bDebug flag.
     * @private
     * @param {Boolean} _bDebug
     */
    function setDebug(_bDebug) {
        bDebug = _bDebug;
    }

    /*
     * Hydra is the api that will be available to use by developers
     */
    Hydra = {
        action: function () {
            return new Action();
        },
        errorHandler: getErrorHandler,
        setErrorHandler: setErrorHandler,
        module: new Module(),
        setDebug: setDebug,
        deferred: Deferred,
        promise: Promise,
        when: When
    };
    /*
     * This line exposes the private object to be accessible from outside of this code.
     */
    win.Hydra = Hydra;
}(window, document));