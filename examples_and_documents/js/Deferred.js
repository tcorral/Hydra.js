(function ( global, Hydra, _undefined_ ) {
	'use strict';
	var Deferred, Promise, When, reResolve, _false_, _true_, _null_;

	/**
	 * Regular expression to detect if a Promise if resolved or not.
	 * @private
	 * @type {RegExp}
	 */
	reResolve = /resolve/g;
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
		this.resolve = (function ( oContext ) {
			return function ( oResult ) {
				oContext.bCompleted = _true_;
				oContext.sType = 'resolve';
				oContext.oResult = oResult;
				oContext.oAction.notify( {type: 'complete'} );
			};
		}( this ));
		// Must be called when something fails
		this.reject = (function ( oContext ) {
			return function ( oResult ) {
				oContext.bCompleted = _true_;
				oContext.sType = 'reject';
				oContext.oResult = oResult;
				oContext.oAction.notify( {type: 'complete'} );
			};
		}( this ));
	};

	/**
	 * Adds new callbacks to execute when the promise has been completed
	 * @member Promise.prototype
	 * @param {Function} fpSuccess
	 * @param {Function} fpFailure
	 * @return {Promise} Promise instance
	 */
	Promise.prototype.then = function ( fpSuccess, fpFailure ) {
		this.aPending.push( { resolve: fpSuccess, reject: fpFailure} );
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
		this.oAction.listen( ['complete'], this.checkCompleted, this );
	};

	Deferred.prototype = {
		/**
		 * Adds a new Promise object to the array of Promise object that are needed to be completed.
		 * @member Deferred.prototype
		 * @param {Promise} oPromise
		 * @return {Object} Deferred instance
		 */
		add: function ( oPromise ) {
			this.aPromises.push( oPromise );
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

			for ( nPromise = 0; nPromise < nLenPromise; nPromise++ ) {
				oPromise = this.aPromises[nPromise];
				if ( !oPromise.bCompleted ) {
					return _false_;
				}
			}
			this.complete( this.getType() );

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

			for ( nPromise = 0; nPromise < nLenPromises; nPromise++ ) {
				oPromise = this.aPromises[nPromise];
				if ( oPromise.bCompleted ) {
					aTypes.push( oPromise.sType );
				}
			}
			if ( aTypes.length === 0 ) {
				return "";
			}
			sType = aTypes.join( "" ).replace( reResolve, "" ).length > 0 ? 'reject' : 'resolve';

			try {
				return sType;
			}
			finally {
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
		complete: function ( sType ) {
			var nPromise, nLenPromises, oPromise;
			if ( sType.length === 0 ) {
				return _false_;
			}
			nLenPromises = this.aPromises.length;

			for ( nPromise = 0; nPromise < nLenPromises; nPromise++ ) {
				oPromise = this.aPromises[nPromise];
				while ( oPromise.aPending[0] ) {
					oPromise.aPending.shift()[sType]( oPromise.oResult );
				}
			}
			while ( this.aPending[0] ) {
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
		then: function ( fpSuccess, fpFailure ) {
			this.aPending.push( { resolve: fpSuccess, reject: fpFailure} );
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
		aArgs = slice( arguments, 0 );
		nLenArgs = aArgs.length;
		oArg = _null_;

		this.oDeferred = oDeferred = new Deferred();

		for ( nArg = 0; nArg < nLenArgs; nArg++ ) {
			oArg = aArgs[nArg];
			if ( oArg instanceof Promise ) {
				oDeferred.add( oArg );
			} else {
				oDeferred.complete( 'resolved' );
				return;
			}
		}

		try {
			return oDeferred;
		}
		finally {
			aArgs = _null_;
			nArg = _null_;
			nLenArgs = _null_;
			oArg = _null_;
		}
	};
	/**
	 * Returns the constructor of Deferred object
	 * @static
	 * @member Hydra
	 * @type {Deferred}
	 */
	Hydra.extend('deferred', Deferred);

	/**
	 * Returns the constructor of Promise object
	 * @static
	 * @member Hydra
	 * @type {Promise}
	 */
	Hydra.extend('promise', Promise);

	/**
	 * Sugar method to generate Deferred objects in a simple way
	 * @static
	 * @member Hydra
	 */
	Hydra.extend('when', When);
}( window, Hydra ));