(function ( global, Hydra, _undefined_ ) {
	'use strict';
	var ErrorHandler, oConsole, _null_, doc;

	/**
	 * Property that contains the access to the global.console object.
	 * @private
	 * @type {Object}
	 */
	oConsole = global.console;

	/**
	 * Assign global.document (window.document) to a local variable.
	 */
	if ( global.document ) {
		doc = global.document;
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
	 * Contains a reference to null object to decrease final size
	 * @type {Object}
	 * @private
	 */
	_null_ = null;

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
	 * @private
	 * @static
	 */
	ErrorHandler._create_dom = function () {
		var oLayer, oList, oLayerStyle;
		oLayer = doc.createElement( "div" );
		oList = doc.createElement( "ul" );
		oLayerStyle = oLayer.style;
		this.list = oList;

		oLayerStyle.display = 'none';
		oLayerStyle.position = "fixed";
		oLayerStyle.height = "100px";
		oLayerStyle.width = "100%";
		oLayerStyle.bottom = "0px";
		oLayer.appendChild( oList );
		doc.body.appendChild( oLayer );

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
	ErrorHandler.addItem = function ( sModuleId, sMethod, erError ) {
		var oItem;
		oItem = doc.createElement( "li" );

		oItem.appendChild( doc.createTextNode( sModuleId + "/" + sMethod + ": " + erError.message ) );
		this.list.appendChild( oItem );

		oItem = _null_;
	};

	/**
	 * log is the method that will differentiate the system if they had console or not.
	 * if global.console exist console.log will be called
	 * if global.console not exist then the log on layer will be activated.
	 * Lazy pattern will be used to avoid extra work on next calls.
	 * Arguments are sent to the methods that will be applied.
	 * @member ErrorHandler
	 * @static
	 */
	ErrorHandler.log = function () {
		var aArgs;
		aArgs = slice( arguments, 0 ).concat();

		if ( oConsole === _undefined_ || (typeof aArgs[aArgs.length - 1] === 'boolean' && !aArgs[aArgs.length - 1]) ) {
			if ( this.list === _null_ ) {
				this._create_dom();
			}
			this.addItem.apply( this, aArgs );
			ErrorHandler.__old_log__ = ErrorHandler.log;
			this.log = function () {
				var aArgs = slice( arguments, 0 ).concat();
				this.addItem.apply( this, aArgs );
				aArgs = _null_;
			};
		} else {
			oConsole.log.apply( oConsole, aArgs );
			ErrorHandler.__old_log__ = ErrorHandler.log;
			this.log = function () {
				var aArgs = slice( arguments, 0 ).concat();
				oConsole.log.apply( oConsole, aArgs );
				aArgs = _null_;
			};
		}

		aArgs = _null_;
	};

	Hydra.setErrorHandler(ErrorHandler);
}( window, Hydra ));