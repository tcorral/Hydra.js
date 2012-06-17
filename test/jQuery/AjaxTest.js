(function ( win, doc, Hydra ) {
	'use strict';
	TestCase( "HydraAjaxCallTest", sinon.testCase( {
		setUp: function () {
			sinon.stub( jQuery, 'ajax' );
			this.oConfig = {};
		},
		tearDown: function () {
			jQuery.ajax.restore();
		},
		'test should call jQuery ajax with the config': function () {
			Hydra.ajax.call( this.oConfig );

			assertEquals( 1, jQuery.ajax.callCount );
			assertSame( this.oConfig, jQuery.ajax.getCall( 0 ).args[0] );
		}
	} ) );

	TestCase( "HydraAjaxGetJSONTest", sinon.testCase( {
		setUp: function () {
			sinon.stub( jQuery, 'getJSON' );
			this.oConfig = {};
		},
		tearDown: function () {
			jQuery.getJSON.restore();
		},
		'test should call jQuery ajax with the config and dataType is json': function () {
			var sUrl = 'http://www.google.es',
				fpOnSuccess = function () {},
				sData = '';

			Hydra.ajax.getJSON( sUrl, fpOnSuccess, sData );

			assertEquals( 1, jQuery.getJSON.callCount );
			assertEquals( sUrl, jQuery.getJSON.getCall( 0 ).args[0] );
			assertEquals( fpOnSuccess, jQuery.getJSON.getCall( 0 ).args[1] );
			assertEquals( sData, jQuery.getJSON.getCall( 0 ).args[2] );
		}
	} ) );

	TestCase( "HydraAjaxGetScriptTest", sinon.testCase( {
		setUp: function () {
			sinon.stub( jQuery, 'getScript' );
			this.oConfig = {};
		},
		tearDown: function () {
			jQuery.getScript.restore();
		},
		'test should call jQuery ajax with the config and dataType is script': function () {
			var sUrl = 'http://www.google.es',
				fpOnSuccess = function () {};

			Hydra.ajax.getScript( sUrl, fpOnSuccess );

			assertEquals( 1, jQuery.getScript.callCount );
			assertSame( sUrl, jQuery.getScript.getCall( 0 ).args[0] );
			assertSame( fpOnSuccess, jQuery.getScript.getCall( 0 ).args[1] );
		}
	} ) );

	TestCase( "HydraAjaxJsonPTest", sinon.testCase( {
		setUp: function () {
			sinon.stub( jQuery, 'ajax' );
			this.oConfig = {};
		},
		tearDown: function () {
			jQuery.ajax.restore();
		},
		'test should call jQuery ajax with the config and jsonpCallback is the passed as argument': function () {
			var sUrl = 'http://www.google.es',
				fpJSONCallback = function () {},
				fpOnError = function () {};

			this.fpCallback = function () {};

			Hydra.ajax.jsonP( sUrl, fpJSONCallback, fpOnError );

			assertEquals( 1, jQuery.ajax.callCount );

			this.oConfig = jQuery.ajax.getCall( 0 ).args[0];

			assertSame( sUrl, this.oConfig.url );
			assertSame( 'jsonp', this.oConfig.dataType );
			assertSame( fpJSONCallback, this.oConfig.success );
			assertSame( fpOnError, this.oConfig.error );
		}
	} ) );
}( window, document, Hydra ));