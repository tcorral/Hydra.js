/*global TestCase, jstestdriver, assertFalse, assertTrue, assertFunction, assertObject, assertEquals, assertInstanceOf, assertException, assertSame, window, Core, document, Hydra, assertUndefined, assertNoException, assertArray*/
(function ( win, doc, Hydra ) {
	'use strict';
	var oTestCase = TestCase;
	Hydra.setTestFramework( jstestdriver );

	oTestCase( "TestExtensionModuleBugOnLazyPatternTestSingleModuleTest", sinon.testCase( {
		setUp: function () {
			var self = this;
			this.oModule = null;
			Hydra.module.test( 'single-module', function ( oModule ) {
				self.oModule = oModule;
			} );
		},
		tearDown: function () {
			this.oModule = null;
		},
		"test the first time module is executed once": function () {
			this.oModule.init();

			assertTrue( this.oModule.isFirstExecution );
		},

		"test the second time module is executed once": function () {
			this.oModule.init();

			assertTrue( this.oModule.isFirstExecution );
		},

		"test the second time module is executed twice": function () {
			this.oModule.init();
			assertTrue( this.oModule.isFirstExecution );

			this.oModule.init();
			assertFalse( this.oModule.isFirstExecution );
		}
	} ) );

	oTestCase( "TestExtensionModuleBugOnLazyPatternTestExtendedModuleTest", sinon.testCase( {
		setUp: function () {
			var self = this;
			this.oModule = null;
			Hydra.module.test( 'extended-module', function ( oModule ) {
				self.oModule = oModule;
			} );
		},
		tearDown: function () {
			this.oModule = null;
		},
		"test the first time module is executed once": function () {
			this.oModule.init();

			assertTrue( this.oModule.isFirstExecution );
		},

		"test the second time module is executed once": function () {
			this.oModule.init();

			assertTrue( this.oModule.isFirstExecution );
		},

		"test the second time module is executed twice": function () {
			this.oModule.init();
			assertTrue( this.oModule.isFirstExecution );

			this.oModule.init();
			assertFalse( this.oModule.isFirstExecution );
		}
	} ) );

	oTestCase( "HydraInitializationTest", sinon.testCase( {
		setUp: function () {},
		tearDown: function () {},
		"test should return an object for window.Hydra or Hydra": function () {
			assertFunction( window.Hydra );
			assertFunction( Hydra );
		},
		"test should return a function for errorHandler property of Hydra": function () {
			assertFunction( Hydra.errorHandler );
		},
		"test should return a function for setErrorHandler property of Hydra": function () {
			assertFunction( Hydra.setErrorHandler );
		},
		"test should return a Module object for module property of Hydra": function () {
			assertObject( Hydra.module );
			assertEquals( "Module", Hydra.module.type );
		}
	} ) );

	oTestCase( "HydraSetErrorHandlerTest", sinon.testCase( {
		setUp: function () {
			this.ErrorHandler = Hydra.errorHandler();
			var FakeClass = function () {};
			FakeClass.type = 'Fake';

			Hydra.setErrorHandler( FakeClass );
		},
		tearDown: function () {
			Hydra.setErrorHandler( this.ErrorHandler );
		},
		"test should change the ErrorHandler Class to a Fake Class": function () {
			var oResult;

			oResult = Hydra.errorHandler();

			assertEquals( "Fake", oResult.type );
		},
		"test should return an instance of Fake Class": function () {
			var oInstance,
				oClass;

			oClass = Hydra.errorHandler();
			oInstance = new (oClass);

			assertInstanceOf( oClass, oInstance );
		}
	} ) );

	oTestCase( "HydraModuleRegisterTest", sinon.testCase( {
		setUp: function () {
			this.sModuleId = 'test';
			this.fpModuleCreator = function () {
				return {
					init: function () {

					},
					handleAction: function () {

					},
					destroy: function () {

					}
				}
			};
		},
		tearDown: function () {
			Hydra.module.remove( this.sModuleId );
		},
		"test should throw an error if we try to create a module without register if the ErrorHandler Class": function () {
			var self = this;
			assertException( function () {
				Hydra.module.test( self.sModuleId, function () {} );
			} );
		},
		"test should return a module if we create a module registering it": function () {

			Hydra.module.register( this.sModuleId, this.fpModuleCreator );

			Hydra.module.test( this.sModuleId, function ( oModule ) {
				assertObject( oModule );
			} );
		}
	} ) );

	oTestCase( "HydraModuleRemoveTest", sinon.testCase( {
		setUp: function () {
			this.sModuleId = 'test';
			this.sContainerId = 'test';
			this.fpModuleCreator = function () {
				return {
					init: function () {

					},
					handleAction: function () {

					},
					destroy: function () {

					}
				}
			};

			sinon.spy( Hydra.module, "_delete" );
		},
		tearDown: function () {
			Hydra.module._delete.restore();
		},
		"test should not call the delete native if the module is not registered before remove it": function () {
			Hydra.module.remove( this.sModuleId, this.sContainerId );

			assertEquals( 0, Hydra.module._delete.callCount );
		},
		"test should call the delete native one time if the module is registered before remove it": function () {
			Hydra.module.register( this.sModuleId, this.fpModuleCreator );

			Hydra.module.remove( this.sModuleId, this.sContainerId );

			assertTrue( Hydra.module._delete.calledOnce );
		}
	} ) );

	oTestCase( "HydraModuleStartTest", sinon.testCase( {
		setUp: function () {
			var self = this;
			this.sModuleId = 'test';
			this.sModuleId2 = 'test2';
			this.fpInitStub = sinon.stub();
			this.fpInitStub2 = sinon.stub();
			this.fpModuleCreator = function () {
				return {
					init: function () {
						self.fpInitStub();
					},
					handleAction: function () {

					},
					destroy: function () {

					}
				}
			};
			this.fpModuleCreator2 = function () {
				return {
					init: function () {
						self.fpInitStub2();
					},
					handleAction: function () {

					},
					destroy: function () {

					}
				}
			};
			Hydra.module.register( this.sModuleId, this.fpModuleCreator );
			Hydra.module.register( this.sModuleId2, this.fpModuleCreator2 );
		},
		tearDown: function () {
			Hydra.module.remove( this.sModuleId );
		},
		"test should call the init method of the module if the module is registered before start": function () {
			Hydra.module.start( this.sModuleId );

			assertTrue( this.fpInitStub.calledOnce );
		},
		"test should check that all the init methods in the modules are called when using multi-module start": function () {
			Hydra.module.start( [this.sModuleId, this.sModuleId2] );

			assertTrue( this.fpInitStub.calledOnce );
			assertTrue( this.fpInitStub2.calledOnce );
		}
	} ) );

	oTestCase( "HydraModuleStartAllTest", sinon.testCase( {
		setUp: function () {
			this.sModuleId = 'test';
			this.sModuleId2 = 'test2';
			this.sContainerId_1 = 'test1';
			this.sContainerId_2 = 'test2';
			this.fpInitStub = sinon.stub();
			var self = this;
			this.fpModuleCreator = function () {
				return {
					init: function () {
						self.fpInitStub();
					},
					handleAction: function () {

					},
					destroy: function () {

					}
				}
			};
			Hydra.module.register( this.sModuleId, this.fpModuleCreator );
			Hydra.module.register( this.sModuleId2, this.fpModuleCreator );
		},
		tearDown: function () {
			Hydra.module.remove( this.sModuleId );
		},
		"test should call the init method of the two registered modules": function () {
			Hydra.module.startAll();

			assertTrue( this.fpInitStub.calledTwice );
		}
	} ) );

	oTestCase( "HydraModuleStopTest", sinon.testCase( {
		setUp: function () {
			this.sModuleId = 'test';
			this.sContainerId = 'test';
			this.oModule = null;
			Hydra.module.register( this.sModuleId, function () {
				return {
					init: function () {}
				}
			} );
			this.oModule = Hydra.module.getModule( this.sModuleId, this.sContainerId );
			this.fpDestroyStub = sinon.stub( this.oModule.instances[this.sContainerId], 'destroy' );
		},
		tearDown: function () {
			Hydra.module.remove( this.sModuleId, this.sContainerId );
		},
		"test should not call the destroy method if the module is registered but not started": function () {
			//Simulate no started
			Hydra.module.remove( this.sModuleId, this.sContainerId );

			Hydra.module.stop( this.sModuleId, this.sContainerId );

			assertEquals( 0, this.fpDestroyStub.callCount );
		},
		"test should call the destroy method one time if the module is registered and started": function () {

			Hydra.module.stop( this.sModuleId, this.sContainerId );

			assertTrue( this.fpDestroyStub.calledOnce );
		}
	} ) );

	oTestCase( "HydraModuleStopAllTest", sinon.testCase( {
		setUp: function () {
			this.sModuleId = 'test';
			this.sContainerId_1 = 'test';
			this.sContainerId_2 = 'test2';
			Hydra.module.register( this.sModuleId, function () {
				return {
					init: function () {}
				}
			} );
			this.oModule1 = Hydra.module.getModule( this.sModuleId, this.sContainerId_1 );
			this.fpDestroyStub1 = sinon.stub( this.oModule1.instances[this.sContainerId_1], 'destroy' );

			this.oModule2 = Hydra.module.getModule( this.sModuleId, this.sContainerId_2 );
			this.fpDestroyStub2 = sinon.stub( this.oModule2.instances[this.sContainerId_2], 'destroy' );
		},
		tearDown: function () {
			Hydra.module.remove( this.sModuleId );
		},
		"test should call the destroy method of the two registered modules": function () {
			Hydra.module.stopAll();

			assertTrue( this.fpDestroyStub1.calledOnce );
			assertTrue( this.fpDestroyStub2.calledOnce );
		}
	} ) );

	oTestCase( "HydraModuleSimpleExtendTest", sinon.testCase( {
		setUp: function () {
			var self = this;
			this.sModuleId = 'test';
			this.fpInitStub = sinon.stub();
			this.fpDestroyStub = sinon.stub();
			this.fpModuleCreator = function () {
				return {
					init: function () {

					},
					handleAction: function () {

					},
					destroy: function () {
						self.fpDestroyStub();
					}
				}
			};
			this.fpModuleExtendedCreator = function () {
				return {
					init: function () {
						self.fpInitStub();
					},
					handleAction: function () {

					},
					destroy: function () {

					}
				}
			};
			Hydra.module.register( this.sModuleId, this.fpModuleCreator );
			sinon.spy( Hydra.module, "_merge" );
		},
		tearDown: function () {
			Hydra.module.remove( this.sModuleId );
			Hydra.module._merge.restore();
		},
		"test should not call the merge method until is started": function () {
			Hydra.module.extend( this.sModuleId, this.fpModuleExtendedCreator );

			assertEquals( 0, Hydra.module._merge.callCount );
		},
		"test should call the init method of the final extended module": function () {
			Hydra.module.extend( this.sModuleId, this.fpModuleExtendedCreator );

			Hydra.module.start( this.sModuleId );

			assertTrue( this.fpInitStub.calledOnce );
			assertEquals( 1, Hydra.module._merge.callCount );
		},
		"test should call the destroy method of the final extended module": function () {
			Hydra.module.extend( this.sModuleId, this.fpModuleExtendedCreator );

			Hydra.module.start( this.sModuleId );

			assertEquals( 0, this.fpDestroyStub.callCount );
		}
	} ) );

	oTestCase( "HydraModuleComplexExtendTest", sinon.testCase( {
		setUp: function () {
			var self = this;
			this.sModuleId = 'test';
			this.sExtendedModuleId = 'test2';
			this.fpInitStub = sinon.stub();
			this.fpDestroyStub = sinon.stub();
			this.fpModuleCreator = function () {
				return {
					init: function () {

					},
					handleAction: function () {

					},
					destroy: function () {
						self.fpDestroyStub();
					}
				}
			};
			this.fpModuleExtendedCreator = function () {
				return {
					init: function () {
						self.fpInitStub();
					},
					handleAction: function () {

					},
					destroy: function () {

					}
				}
			};
			Hydra.module.register( this.sModuleId, this.fpModuleCreator );
			sinon.spy( Hydra.module, "_merge" );
		},
		tearDown: function () {
			Hydra.module.remove( this.sModuleId );
			Hydra.module.remove( this.sExtendedModuleId );
			Hydra.module._merge.restore();
		},
		"test should not call the merge method until started": function () {
			Hydra.module.extend( this.sModuleId, this.sExtendedModuleId, this.fpModuleExtendedCreator );

			assertEquals( 0, Hydra.module._merge.callCount );
		},
		"test should call the init method of the final extended module": function () {
			Hydra.module.extend( this.sModuleId, this.sExtendedModuleId, this.fpModuleExtendedCreator );

			Hydra.module.start( this.sExtendedModuleId );

			assertTrue( this.fpInitStub.calledOnce );
			assertEquals( 1, Hydra.module._merge.callCount );
		},
		"test should call the destroy method of the final extended module": function () {
			Hydra.module.extend( this.sModuleId, this.sExtendedModuleId, this.fpModuleExtendedCreator );

			Hydra.module.start( this.sExtendedModuleId );

			assertEquals( 0, this.fpDestroyStub.callCount );
		}
	} ) );

	oTestCase( "HydraModuleSetVarsTest", sinon.testCase( {
		setUp: function () {
			var self = this;
			this.oVars = null;
			this.fpInit = function ( oData ) {
				self.oVars = oData;
			};
			Hydra.module.register( "test-module", function () {
				return {
					init: self.fpInit,
					destroy: function () {

					}
				};
			} );
			sinon.spy( this, 'fpInit' );
		},
		tearDown: function () {
			this.fpInit.restore();
			delete this.oVars;
			delete this.fpInit;
		},
		'test should check that setVars method exist in Module': function () {
			assertFunction( Hydra.module.setVars );
		},
		'test should check that all the vars set in setVars are passed as an object when the module is started': function () {
			var oVars = {
				'test': 'test',
				'test1': 'test1'
			};
			Hydra.module.setVars( oVars );

			Hydra.module.start( 'test-module' );

			assertSame( oVars, this.oVars );
		},
		'test should check that if we pass a param when starting the module will move the object of vars to the last position in arguments': function () {
			var oVars = {
					'test': 'test',
					'test1': 'test1'
				},
				oData = {
					data: 2
				},
				oCall;

			Hydra.module.setVars( oVars );

			Hydra.module.start( 'test-module', 'instance_id', oData );

			oCall = this.fpInit.getCall( 0 );

			assertEquals( oData, oCall.args[0] );
			assertEquals( oVars, oCall.args[1] );
		}
	} ) );

	oTestCase( "HydraModuleGetVarsTest", sinon.testCase( {
		setUp: function () {
			this.oVars = {
				'test': 'test',
				'test1': 'test1'
			};
			Hydra.module.setVars( this.oVars );
		},
		tearDown: function () {
			delete this.oVars;
		},
		'test should check that getVars method exist in Module': function () {
			assertFunction( Hydra.module.getVars );
		},
		'test should check that getVars return a copy of all the vars set using setVars': function () {
			var oVars = Hydra.module.getVars();

			assertEquals( this.oVars, oVars );
		}
	} ) );

	oTestCase( "HydraExtendTest", sinon.testCase( {
		setUp: function () {

		},
		tearDown: function () {

		},
		'test should check that extend method exist': function () {
			assertFunction( Hydra.extend );
		},
		'test should check that extend method must receive two params': function () {
			assertEquals( 2, Hydra.extend.length );
		},
		'test should check when executing extend method the new object will be part of Hydra': function () {
			var oTest = {
				test: sinon.stub()
			};
			Hydra.extend( "test", oTest );

			assertSame( oTest, Hydra.test );
		}
	} ) );

	oTestCase( "HydraNoConflictTest", sinon.testCase( {
		setUp: function () {

		},
		tearDown: function () {

		},
		'test should check that noConflict method exist': function () {
			assertFunction( Hydra.noConflict );
		},
		'test should check that noConflict method must receive three params': function () {
			assertEquals( 3, Hydra.noConflict.length );
		},
		'test should check when executing noConflict a part of Hydra will be callable with other name and in other context': function () {
			var bDone;

			bDone = Hydra.noConflict( 'module', window, 'Core' );

			assertTrue( bDone );
			assertSame( Hydra.module, window.Core );
			assertSame( Hydra.module.register, window.Core.register );
		},
		'test should check when executing noConflic with a name of part of Hydra it will do nothing': function () {
			var bDone;

			bDone = Hydra.noConflict( "how", window, 'toTest' );

			assertFalse( bDone );
			assertUndefined( Hydra.how );
			assertUndefined( window.toTest );
		}
	} ) );

	oTestCase( 'HydraBusConstructorTest', sinon.testCase( {
		setUp: function () {
			Hydra.bus.reset();
		},
		tearDown: function () {

		},
		'test should check that Hydra.bus is not undefined': function () {
			assertNotUndefined( Hydra.bus );
		},
		'test should check that Hydra.bus has method subscribers': function () {
			assertFunction( Hydra.bus.subscribers );
		},
		'test should check that Hydra.bus has method subscribe': function () {
			assertFunction( Hydra.bus.subscribe );
		},
		'test should check that Hydra.bus has method unsubscribe': function () {
			assertFunction( Hydra.bus.unsubscribe );
		},
		'test should check that Hydra.bus has method publish': function () {
			assertFunction( Hydra.bus.publish );
		}
	} ) );

	oTestCase('HydraSubscribersTest', sinon.testCase({
		setUp: function()
		{
			Hydra.bus.reset();
			this.oSubscriber = {
				oEventsCallbacks: {
					'test': function()
					{

					}
				}
			};
		},
		tearDown: function()
		{
			delete this.oSubscriber;
		},
		'test should check that must return an empty array if there are no channel': function()
		{
			var oResult = null;

			oResult = Hydra.bus.subscribers('test_channel', 'test');

			assertArray(oResult);
			assertEquals(0, oResult.length);
		},
		'test should check that must return an array with an element if a subscriber is registered': function()
		{
			var oResult = null;
			Hydra.bus.subscribe('test_channel', this.oSubscriber);

			oResult = Hydra.bus.subscribers('test_channel', 'test');

			assertArray(oResult);
			assertEquals(1, oResult.length);

			Hydra.bus.unsubscribe('test_channel', this.oSubscriber);
		}
	}));

	oTestCase('HydraBusSubscribeTest', sinon.testCase({
		setUp: function()
		{
			Hydra.bus.reset();
			this.oSubscriber = {
				oEventsCallbacks: {
					'test': function()
					{

					}
				}
			};
			this.oBadSubscriber = {};
		},
		tearDown: function()
		{
			delete this.oSubscriber;
			delete this.oBadSubscriber;
		},
		'test should check that no subscriber must be added if Subscriber does not have oEventsCallbacks and must return false': function()
		{
			var bResult = true;

			bResult = Hydra.bus.subscribe('test', this.oBadSubscriber);

			assertFalse(bResult);
			assertEquals(0, Hydra.bus.subscribers('test', 'test' ).length);

			Hydra.bus.unsubscribe('test', this.oBadSubscriber);
		},
		'test should check that one subscriber has been added if Subscriber has oEventsCallbacks and must return true': function()
		{
			var aSubscribers = null,
				bResult = false;

			bResult = Hydra.bus.subscribe('test', this.oSubscriber);

			aSubscribers = Hydra.bus.subscribers('test', 'test' );
			assertTrue(bResult);
			assertEquals(1, aSubscribers.length);
			assertSame(this.oSubscriber, aSubscribers[0].subscriber);
			assertSame(this.oSubscriber.oEventsCallbacks.test, aSubscribers[0].handler);

			Hydra.bus.unsubscribe('test', this.oSubscriber);
		}
	}));

	oTestCase('HydraBusUnsubscribeTest', sinon.testCase({
		setUp: function()
		{
			Hydra.bus.reset();
			this.oSubscriber = {
				oEventsCallbacks: {
					'test': function()
					{

					}
				}
			};
			this.oBadSubscriber = {};
		},
		tearDown: function()
		{
			delete this.oSubscriber;
			delete this.oBadSubscriber;
		},
		'test should check that must return false if Subscriber does not have oEventsCallbacks': function()
		{
			var bResult = true;

			bResult = Hydra.bus.unsubscribe('test', this.oBadSubscriber);

			assertFalse(bResult);
		},
		'test should check that must return false if Subscriber has oEventsCallbacks but has not been subscribed': function()
		{
			var bResult = true;

			bResult = Hydra.bus.unsubscribe('test', this.oSubscriber);

			assertFalse(bResult);
		},
		'test should check that must return true if Subscriber has oEventsCallbacks but has been subscribed': function()
		{
			var bResult = false;
			Hydra.bus.subscribe('test', this.oSubscriber);

			bResult = Hydra.bus.unsubscribe('test', this.oSubscriber);

			assertFalse(bResult);
		}
	}));

	oTestCase('HydraBusPublishTest', sinon.testCase({
		setUp: function()
		{
			Hydra.bus.reset();
			this.oSubscriber = {
				oEventsCallbacks: {
					'test': sinon.stub()
				}
			};
			this.oBadSubscriber = {};
		},
		tearDown: function()
		{
			delete this.oSubscriber;
			delete this.oBadSubscriber;
		},
		'test should check that must return false if there are no subscribers to the event in channel': function()
		{
			var bResult = true,
				oData = {};

			bResult = Hydra.bus.publish('test', 'test', oData);

			assertFalse(bResult);
			assertEquals(0, this.oSubscriber.oEventsCallbacks.test.callCount);
		},
		'test should check that must return true if there are any subscriber to the event in channel': function()
		{
			var bResult = false,
				oData = {};
			Hydra.bus.subscribe('test', this.oSubscriber);

			bResult = Hydra.bus.publish('test', 'test', oData);

			assertTrue(bResult);
			assertEquals(1, this.oSubscriber.oEventsCallbacks.test.callCount);
		}
	}));
}( window, document, Hydra ));