(function ( win, doc, Hydra ) {
	'use strict';
	TestCase( "HydraEventsBindTest", sinon.testCase( {
		setUp: function ()
		{
			var self = this;
			this.sExpected = 'test';
			this.sTest = '';
			this.fpCallback = function()
			{
				self.sTest = self.sExpected;
			};
		},
		tearDown: function ()
		{
			delete this.sExpected;
			delete this.sTest;
			delete this.fpCallback;
		},
		'test should check that bind method adds the event handler': function ()
		{
			Hydra.events.bind("click", doc, this.fpCallback);

			Hydra.events.trigger("click", doc);

			assertSame(this.sExpected, this.sTest);
		}
	} ) );

	TestCase( "HydraEventsTriggerTest", sinon.testCase( {
		setUp: function ()
		{
			var self = this;
			this.sExpected = 'test';
			this.sTest = '';
			this.fpCallback = function()
			{
				self.sTest = self.sExpected;
			};
		},
		tearDown: function ()
		{
			delete this.sExpected;
			delete this.sTest;
			delete this.fpCallback;
		},
		'test should check that trigger method call the event handler': function ()
		{
			Hydra.events.bind("click", doc, this.fpCallback);

			Hydra.events.trigger("click", doc);

			assertSame(this.sExpected, this.sTest);
		}
	} ) );

	TestCase( "HydraEventsUnbindTest", sinon.testCase( {
		setUp: function ()
		{
			var self = this;
			this.sExpected = 'test';
			this.sTest = '';
			this.fpCallback = function()
			{
				self.sTest = self.sExpected;
			};
		},
		tearDown: function ()
		{
			delete this.sExpected;
			delete this.sTest;
			delete this.fpCallback;
		},
		'test should check that unbind method removes the event handler': function () {
			Hydra.events.bind("click", doc, this.fpCallback);

			Hydra.events.unbind("click", doc, this.fpCallback);

			Hydra.events.trigger("click", doc);

			assertString(this.sTest);
			assertEquals(0, this.sTest.length);
		}
	} ) );
}( window, document, Hydra ));