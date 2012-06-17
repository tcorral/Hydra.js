(function ( win, Hydra, $ ) {
	'use strict';
	var Events;

	/**
	 * Events jQuery methods wrapper
	 * @type {Object}
	 */
	Events = {
		/**
		 * Binds an event handler to one element
		 * @param {String} sType
		 * @param {String/Element} sSelector
		 * @param {Function} fpCallback
		 * @param {Array} aData
		 */
		bind: function ( sType, sSelector, fpCallback, aData ) {
			aData = aData || [];
			$( sSelector ).bind( sType, aData, fpCallback );
		},
		/**
		 * Triggers an event hander in one element
		 * @param {String} sType
		 * @param {String/Element} sSelector
		 * @param {Array} aExtraParams
		 */
		trigger: function ( sType, sSelector, aExtraParams ) {
			aExtraParams = aExtraParams || [];
			$( sSelector ).trigger( sType, aExtraParams );
		},
		/**
		 * Unbinds an event handler of one element
		 * @param {String} sType
		 * @param {String/Element} sSelector
		 * @param {Function} fpCallback
		 * @param {Array} aData
		 */
		unbind: function ( sType, sSelector, fpCallback ) {
			$( sSelector ).unbind( sType, fpCallback );
		}
	};
	Hydra.extend( "events", Events );
}( window, Hydra, jQuery ));