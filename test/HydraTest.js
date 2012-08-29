(function(win, doc, Hydra){
	Hydra.setTestFramework(jstestdriver);

	TestCase( "TestExtensionModuleBugOnLazyPatternTestSingleModuleTest", sinon.testCase( {
		setUp: function()
		{
			var self = this;
			this.oModule = null;
			Hydra.module.test('single-module', function(oModule)
			{
				self.oModule = oModule;
			});
		},
		tearDown: function()
		{
			this.oModule = null;
		},
		"test the first time module is executed once": function()
		{
			this.oModule.init();

			assertTrue( this.oModule.isFirstExecution );
		},

		"test the second time module is executed once": function()
		{
			this.oModule.init();

			assertTrue( this.oModule.isFirstExecution );
		},

		"test the second time module is executed twice": function()
		{
			this.oModule.init();
			assertTrue( this.oModule.isFirstExecution );

			this.oModule.init();
			assertFalse( this.oModule.isFirstExecution );
		}
	} ) );

	TestCase( "TestExtensionModuleBugOnLazyPatternTestExtendedModuleTest", sinon.testCase( {
		setUp: function()
		{
			var self = this;
			this.oModule = null;
			Hydra.module.test('extended-module', function(oModule)
			{
				self.oModule = oModule;
			});
		},
		tearDown: function()
		{
			this.oModule = null;
		},
		"test the first time module is executed once": function()
		{
			this.oModule.init();

			assertTrue( this.oModule.isFirstExecution );
		},

		"test the second time module is executed once": function()
		{
			this.oModule.init();

			assertTrue( this.oModule.isFirstExecution );
		},

		"test the second time module is executed twice": function()
		{
			this.oModule.init();
			assertTrue( this.oModule.isFirstExecution );

			this.oModule.init();
			assertFalse( this.oModule.isFirstExecution );
		}
	} ) );
	TestCase( "HydraInitializationTest", sinon.testCase( {
		setUp: function () {},
		tearDown: function () {},
		"test should return an object for window.Hydra or Hydra": function () {
			assertFunction( window.Hydra );
			assertFunction( Hydra );
		},
		"test should return a function for action property of Hydra": function () {
			assertFunction( Hydra.action );
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

	TestCase( "HydraActionTest", sinon.testCase( {
		setUp: function () {},
		tearDown: function () {},
		"test should return the Action Class": function () {
			var oResult;
			oResult = Hydra.action();

			assertEquals( "Action", oResult.type );
		}
	} ) );

	TestCase( "HydraSetErrorHandlerTest", sinon.testCase( {
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
			var oResult = null;

			oResult = Hydra.errorHandler();

			assertEquals( "Fake", oResult.type );
		},
		"test should return an instance of Fake Class": function () {
			var oInstance = null;
			var oClass = null;

			oClass = Hydra.errorHandler();
			oInstance = new (oClass);

			assertInstanceOf( oClass, oInstance );
		}
	} ) );

	TestCase( "HydraModuleRegisterTest", sinon.testCase( {
		setUp: function () {
			this.sModuleId = 'test';
			this.fpModuleCreator = function ( oAction ) {
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
				Hydra.module.test( self.sModuleId, function ( oModule ) {} );
			} );
		},
		"test should return a module if we create a module registering it": function () {

			Hydra.module.register( this.sModuleId, this.fpModuleCreator );

			Hydra.module.test( this.sModuleId, function ( oModule ) {
				assertObject( oModule );
			} );
		}
	} ) );

	TestCase( "HydraModuleRemoveTest", sinon.testCase( {
		setUp: function () {
			this.sModuleId = 'test';
			this.sContainerId = 'test';
			this.fpModuleCreator = function ( oAction ) {
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

	TestCase( "HydraModuleStartTest", sinon.testCase( {
		setUp: function () {
			this.sModuleId = 'test';
			this.fpInitStub = sinon.stub();
			var self = this;
			this.fpModuleCreator = function ( oAction ) {
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
		},
		tearDown: function () {
			Hydra.module.remove( this.sModuleId );
		},
		"test should call the init method of the module if the module is registered before start": function () {
			Hydra.module.start( this.sModuleId );

			assertTrue( this.fpInitStub.calledOnce );
		}
	} ) );

	TestCase( "HydraModuleStartAllTest", sinon.testCase( {
		setUp: function () {
			this.sModuleId = 'test';
			this.sModuleId2 = 'test2';
			this.sContainerId_1 = 'test1';
			this.sContainerId_2 = 'test2';
			this.fpInitStub = sinon.stub();
			var self = this;
			this.fpModuleCreator = function ( oAction ) {
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

	TestCase( "HydraModuleStopTest", sinon.testCase( {
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

	TestCase( "HydraModuleStopAllTest", sinon.testCase( {
		setUp: function () {
			var self = this;
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

	TestCase( "HydraModuleSimpleExtendTest", sinon.testCase( {
		setUp: function () {
			var self = this;
			this.sModuleId = 'test';
			this.fpInitStub = sinon.stub();
			this.fpDestroyStub = sinon.stub();
			this.fpModuleCreator = function ( oAction ) {
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
			this.fpModuleExtendedCreator = function ( oAction ) {
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

	TestCase( "HydraModuleComplexExtendTest", sinon.testCase( {
		setUp: function () {
			var self = this;
			this.sModuleId = 'test';
			this.sExtendedModuleId = 'test2';
			this.fpInitStub = sinon.stub();
			this.fpDestroyStub = sinon.stub();
			this.fpModuleCreator = function ( oAction ) {
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
			this.fpModuleExtendedCreator = function ( oAction ) {
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

	TestCase( "HydraModuleTestTest", sinon.testCase( {
		setUp: function () {
			var self = this;
			this.sModuleId = 'test';
			this.fpCallback = sinon.stub();
			this.fpDestroyStub = sinon.stub();
			this.fpModuleCreator = function ( oAction ) {
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
			Hydra.module.register( this.sModuleId, this.fpModuleCreator );
		},
		tearDown: function () {
			Hydra.module.remove( this.sModuleId );
		},
		"test should call the callback": function () {
			Hydra.module.test( this.sModuleId, this.fpCallback );

			assertTrue( this.fpCallback.calledOnce );
		}
	} ) );

	TestCase( "HydraModuleSetVarsTest", sinon.testCase( {
		setUp: function () {
			var self = this;
			this.oVars = null;
			this.fpInit = function ( oData ) {
				self.oVars = oData;
			};
			Hydra.module.register( "test-module", function ( sandbox ) {
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
			};
			var oData = {
				data: 2
			};
			var oCall = null;

			Hydra.module.setVars( oVars );

			Hydra.module.start( 'test-module', document.body, oData );

			oCall = this.fpInit.getCall( 0 );

			assertEquals( oData, oCall.args[0] );
			assertEquals( oVars, oCall.args[1] );
		}
	} ) );

	TestCase( "HydraModuleGetVarsTest", sinon.testCase( {
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

	TestCase( "HydraActionListenTest", sinon.testCase( {
		setUp: function () {
			var self = this;
			this.sListener = 'test';
			this.fpHandler = sinon.stub();
			this.oModule = {
				init: function () {},
				handleAction: this.fpHandler,
				destroy: function () {}
			};
			this.oAction = new Hydra.action();
			this.oAction.__restore__();
		},
		tearDown: function () {
			this.oAction.__restore__();
		},
		"test should not call fpHandler if notify is launched before set the listeners": function () {
			this.oAction.notify( [this.sListener], {type: this.sListener} );

			assertEquals( 0, this.fpHandler.callCount );
		},
		"test should call fpHandler if notify is launched after set the listeners": function () {
			this.oAction.listen( [this.sListener], this.fpHandler, this.oModule );

			this.oAction.notify( {type: this.sListener} );

			assertEquals( 1, this.fpHandler.callCount );
		}
	} ) );

	TestCase( "HydraActionNotifyTest", sinon.testCase( {
		setUp: function () {
			this.oAction = Hydra.action();
			var self = this;
			this.fpListen = sinon.stub();
			this.sListener = 'test';
			this.sOtherListener = 'test2';
			this.nData = 1;
			this.oNotifier = {
				type: this.sListener,
				data: this.nData
			};
			this.oOtherNotifier = {
				type: this.sOtherListener,
				data: this.nData
			};
			this.fpHandler = function ( oAction ) {
				if ( oAction.type === self.sListener ) {
					self.fpListen();
				}
			};
			this.oModule = {
				init: function () {},
				handleAction: this.fpHandler,
				destroy: function () {}
			};
			this.oAction = Hydra.action();
			this.oAction.__restore__();
			this.oAction.listen( [this.sListener], this.fpHandler, this.oModule );
		},
		tearDown: function () {
			this.oAction.__restore__();
		},
		"test should not call the fpListen callback if the action called is test2": function () {
			this.oAction.notify( this.oOtherNotifier );

			assertEquals( 0, this.fpListen.callCount );
		},
		"test should call the fpListen callback if the action called is test": function () {
			this.oAction.notify( this.oNotifier );

			assertTrue( this.fpListen.calledOnce );
		}
	} ) );

	TestCase( "HydraActionStopListenTest", sinon.testCase( {
		setUp: function () {
			this.oAction = Hydra.action();
			var self = this;
			this.fpListen = sinon.stub();
			this.sListener = 'test';
			this.nData = 1;
			this.oNotifier = {
				type: this.sListener,
				data: this.nData
			};
			this.fpHandler = function ( oAction ) {
				if ( oAction.type === self.sListener ) {
					self.fpListen();
				}
			};
			this.oModule = {
				init: function () {},
				handleAction: function () {
					self.fpHandler();
				},
				destroy: function () {}
			};
			this.oAction = Hydra.action();
			this.oAction.__restore__();
			this.oAction.listen( [this.sListener], this.fpHandler, this.oModule );
		},
		tearDown: function () {
			this.oAction.__restore__();
		},
		"test should call the fpListen callback if the action called is test if not stopListen": function () {
			this.oAction.notify( this.oNotifier );

			assertEquals( 1, this.fpListen.callCount );
		},
		"test should not call the fpListen callback if the action called is test if stopListen is called before": function () {
			this.oAction.stopListen( [this.sListener], this.oModule );

			this.oAction.notify( this.oNotifier );

			assertEquals( 0, this.fpListen.callCount );
		}
	} ) );

	TestCase( "HydraExtendTest", sinon.testCase( {
		setUp: function () {

		},
		tearDown: function () {

		},
		'test should check that extend method exist': function () {
			assertFunction( Hydra.extend );
		},
		'test should check that extend method must receive two params': function()
		{
			assertEquals(2, Hydra.extend.length);
		},
		'test should check when executing extend method the new object will be part of Hydra': function()
		{
			var oTest = {
				test: sinon.stub()
			};
			Hydra.extend("test", oTest);

			assertSame(oTest, Hydra.test);
		}
	} ) );

	TestCase( "HydraNoConflictTest", sinon.testCase( {
		setUp: function () {

		},
		tearDown: function () {

		},
		'test should check that noConflict method exist': function () {
			assertFunction(Hydra.noConflict);
		},
		'test should check that noConflict method must receive three params': function()
		{
			assertEquals(3, Hydra.noConflict.length);
		},
		'test should check when executing noConflict a part of Hydra will be callable with other name and in other context': function()
		{
			var bDone = false;

			bDone = Hydra.noConflict('module', window, 'Core');

			assertTrue(bDone);
			assertSame(Hydra.module, window.Core);
			assertSame(Hydra.module.register, window.Core.register);
		},
		'test should check when executing noConflic with a name of part of Hydra it will do nothing': function()
		{
			var bDone = true;

			bDone = Hydra.noConflict("how", window, 'toTest');

			assertFalse(bDone);
			assertUndefined(Hydra.how);
			assertUndefined(window.toTest);
		}
	} ) );
}(window, document, Hydra));