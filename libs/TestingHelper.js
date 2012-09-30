(function ( win, Hydra ) {
	'use strict';

	var oTestFramework = null;
	/**
	 * Sets the framework object that will be used to allow test and getModule methods in module
	 * @static
	 * @member Hydra
	 * @param {Object} oTest
	 */
	Hydra.setTestFramework = function ( oTest ) {
		oTestFramework = oTest;
	};

	/**
	 * getModule returns the module with the id
	 * It must work only when it's executed in oTestFramework environment
	 * @member Hydra.module
	 * @param {String} sModuleId
	 * @param {String} sIdInstance
	 * @return {Module}
	 */
	Hydra.module.getModule = function ( sModuleId, sIdInstance ) {
		var oInstance;
		if ( oTestFramework ) {
			oInstance = Hydra.module.getInstance( sModuleId );
			return this.setInstance(sModuleId, sIdInstance, oInstance);
		}
		return null;
	};
	/**
	 * test is a method that will return the module without wrapping their methods.
	 * It's called test because it was created to be able to test the modules with unit testing.
	 * It must work only when it's executed in oTestFramework environment
	 * @member Hydra.module
	 * @param {String} sModuleId
	 * @param {Function} fpCallback
	 */
	Hydra.module.test = function ( sModuleId, fpCallback ) {
		if ( oTestFramework ) {
			Hydra.setDebug( true );
			fpCallback( Hydra.module.getInstance( sModuleId ) );
			Hydra.setDebug( false );
		}
	}
}( window, Hydra ));