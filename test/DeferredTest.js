(function(win, doc, Hydra){
	'use strict';
	function setupPromise()
	{
		this.oPromise = new Hydra.promise();
	}
	function teardownPromise()
	{
		delete this.oPromise;
	}
	function setupPromiseNotify()
	{
		sinon.stub( this.oPromise.oAction, "notify" );
		this.oResult = 'test';
	}
	function teardownPromiseNotify()
	{
		this.oPromise.oAction.notify.restore();
		delete this.oResult;
	}
	function setupPromisePush()
	{
		sinon.spy( this.oPromise.aPending, "push" );
		this.fpOnSuccess = function () {};
		this.fpOnError = function () {};
	}
	function teardownPromisePush()
	{
		this.oPromise.aPending.push.restore();
		delete this.fpOnSuccess;
		delete this.fpOnError;
	}
	function setupDeferred()
	{
		this.oAction = Hydra.action();
		sinon.stub( this.oAction, "listen" );
		sinon.stub( Hydra, "action" ).returns( this.oAction );
		this.oDeferred = new Hydra.deferred();
	}
	function teardownDeferred()
	{
		this.oAction.listen.restore();
		Hydra.action.restore();
		delete this.oAction;
		delete this.oDeferred;
	}
	TestCase( "HydraPromiseConstructorTest", sinon.testCase( {
		setUp: setupPromise,
		tearDown: teardownPromise,
		"test should return an empty array for aPending property by default": function () {
			assertArray( this.oPromise.aPending );
			assertEquals( 0, this.oPromise.aPending.length );
		},
		"test should return false for bCompleted property by default": function () {
			assertBoolean( this.oPromise.bCompleted );
			assertFalse( this.oPromise.bCompleted );
		},
		"test should return sType as an empty string for sType by default": function () {
			assertString( this.oPromise.sType );
			assertEquals( 0, this.oPromise.sType.length );
		},
		"test should return null for oResult property by default": function () {
			assertNull( this.oPromise.oResult );
		},
		"test should return function for resolve property by default": function () {
			assertFunction( this.oPromise.resolve );
		},
		"test should return function for reject property by default": function () {
			assertFunction( this.oPromise.resolve );
		}
	} ) );

	TestCase( "HydraPromiseResolveTest", sinon.testCase( {
		setUp: function () {
			setupPromise.call(this);
			setupPromiseNotify.call(this);
		},
		tearDown: function () {
			teardownPromiseNotify.call(this);
			teardownPromise.call(this);
		},
		"test should change bCompleted to true": function () {
			this.oPromise.resolve( this.oResult );

			assertTrue( this.oPromise.bCompleted );
		},
		"test should change sType to 'resolve'": function () {
			this.oPromise.resolve( this.oResult );

			assertEquals( "resolve", this.oPromise.sType );
		},
		"test should change oResult to 'test'": function () {
			this.oPromise.resolve( this.oResult );

			assertSame( this.oResult, this.oPromise.oResult );
		},
		"test should call notify of Action one time": function () {
			this.oPromise.resolve( this.oResult );

			assertEquals( 1, this.oPromise.oAction.notify.callCount );
		}
	} ) );

	TestCase( "HydraPromiseRejectTest", sinon.testCase( {
		setUp: function () {
			setupPromise.call(this);
			setupPromiseNotify.call(this);
		},
		tearDown: function () {
			teardownPromiseNotify.call(this);
			teardownPromise.call(this);
		},
		"test should change bCompleted to true": function () {
			this.oPromise.reject( this.oResult );

			assertTrue( this.oPromise.bCompleted );
		},
		"test should change sType to 'reject'": function () {
			this.oPromise.reject( this.oResult );

			assertEquals( "reject", this.oPromise.sType );
		},
		"test should change oResult to 'test'": function () {
			this.oPromise.reject( this.oResult );

			assertSame( this.oResult, this.oPromise.oResult );
		},
		"test should call notify of Action one time": function () {
			this.oPromise.reject( this.oResult );

			assertEquals( 1, this.oPromise.oAction.notify.callCount );
		}
	} ) );

	TestCase( "HydraPromiseThenTest", sinon.testCase( {
		setUp: function () {
			setupPromise.call(this);
			setupPromisePush.call(this);
		},
		tearDown: function () {
			teardownPromisePush.call(this);
			teardownPromise.call(this);
		},
		"test should call push method of aPending one time": function () {
			this.oPromise.then( this.fpOnSuccess, this.fpOnError );
			assertEquals( 1, this.oPromise.aPending.push.callCount );
		},
		"test should return the same instance of the promise": function () {
			var oResult = this.oPromise.then( this.fpOnSuccess, this.fpOnError );
			assertEquals( this.oPromise, oResult );
		},
		"test should return fpOnSuccess on first item in aPending with key resolve": function () {
			this.oPromise.then( this.fpOnSuccess, this.fpOnError );
			assertSame( this.fpOnSuccess, this.oPromise.aPending[0].resolve );
		},
		"test should return fpOnError on first item in aPending with key reject": function () {
			this.oPromise.then( this.fpOnSuccess, this.fpOnError );
			assertSame( this.fpOnError, this.oPromise.aPending[0].reject );
		}
	} ) );

	TestCase( "HydraDeferredConstructorTest", sinon.testCase( {
		setUp: function () {
			setupPromise.call(this);
			setupDeferred.call(this);
		},
		tearDown: function () {
			teardownDeferred.call(this);
			teardownPromise.call(this);
		},
		"test should return empty array for aPromises by default": function () {
			assertArray( this.oDeferred.aPromises );
			assertEquals( 0, this.oDeferred.aPromises.length );
		},
		"test should return empty array for aPending by default": function () {
			assertArray( this.oDeferred.aPending );
			assertEquals( 0, this.oDeferred.aPending.length );
		},
		"test should return empty string for sType by default": function () {
			assertString( this.oDeferred.sType );
			assertEquals( 0, this.oDeferred.sType.length );
		},
		"test should call Hydra.action one time": function () {
			assertEquals( 1, Hydra.action.callCount );
		},
		"test should call listen in oAction one time": function () {
			assertEquals( 1, this.oAction.listen.callCount );
		},
		"test should call the listen with the first argument is an array with one element 'complete'": function () {
			assertArray( this.oAction.listen.getCall( 0 ).args[0] );
			assertEquals( "complete", this.oAction.listen.getCall( 0 ).args[0][0] );
			assertUndefined( this.oAction.listen.getCall( 0 ).args[0][1] );
		},
		"test should call the listen with the second argument is checkCompleted method": function () {
			assertArray( this.oAction.listen.getCall( 0 ).args[0] );
			assertEquals( this.oDeferred.checkCompleted, this.oAction.listen.getCall( 0 ).args[1] );
		},
		"test should call the listen with the third argument is the same Deferred object": function () {
			assertSame( this.oDeferred, this.oAction.listen.getCall( 0 ).args[2] );
		}
	} ) );

	TestCase( "HydraDeferredAddTest", sinon.testCase( {
		setUp: function () {
			setupPromise.call(this);
			setupDeferred.call(this);
		},
		tearDown: function () {
			teardownDeferred.call(this);
			teardownPromise.call(this);
		},
		"test should add a new Promise element to aPromises": function () {
			this.oDeferred.add( this.oPromise );

			assertSame( this.oPromise, this.oDeferred.aPromises[0] );
		},
		"test should return the same Deferred object": function () {
			var oDeferred = this.oDeferred.add( this.oPromise );

			assertSame( this.oDeferred, oDeferred );
		}
	} ) );

	TestCase( "HydraDeferredCheckCompletedTest", sinon.testCase( {
		setUp: function () {
			setupPromise.call(this);
			setupDeferred.call(this);
			sinon.stub( this.oDeferred, "complete" );
			sinon.stub( this.oDeferred, "getType" );
		},
		tearDown: function () {
			this.oDeferred.complete.restore();
			this.oDeferred.getType.restore();
			teardownDeferred.call(this);
			teardownPromise.call(this);
		},
		"test should return false if oPromise is not completed": function () {
			var bResult = true;
			this.oDeferred.add( this.oPromise );

			bResult = this.oDeferred.checkCompleted();

			assertFalse( bResult );
		},
		"test should not call complete if oPromise is not completed": function () {
			this.oDeferred.add( this.oPromise );

			this.oDeferred.checkCompleted();

			assertEquals( 0, this.oDeferred.complete.callCount );
		},
		"test should call complete if oPromise is completed": function () {
			this.oDeferred.add( this.oPromise );
			this.oPromise.bCompleted = true;

			this.oDeferred.checkCompleted();

			assertEquals( 1, this.oDeferred.complete.callCount );
		}
	} ) );

	TestCase( "HydraDeferredGetTypeTest", sinon.testCase( {
		setUp: function () {
			setupPromise.call(this);
			setupDeferred.call(this);
			this.oDeferred.add( this.oPromise );
			sinon.spy( Array.prototype, "push" );
			sinon.spy( Array.prototype, "join" );
			sinon.spy( String.prototype, "replace" );
		},
		tearDown: function () {
			Array.prototype.push.restore();
			Array.prototype.join.restore();
			String.prototype.replace.restore();
			teardownDeferred.call(this);
			teardownPromise.call(this);
		},
		"test should not call push if oPromise is not completed": function () {
			this.oDeferred.getType();

			assertEquals( 0, Array.prototype.push.callCount );
		},
		"test should call push if oPromise is completed": function () {
			this.oPromise.bCompleted = true;

			this.oDeferred.getType();

			assertEquals( 1, Array.prototype.push.callCount );
		},
		"test should return an empty string if nothing exist or is not completed": function () {
			var sResult = 'test';

			sResult = this.oDeferred.getType();

			assertEquals( 0, sResult.length );
		},
		"test should call join, replace if one or more oPromise are completed": function () {
			this.oPromise.bCompleted = true;

			this.oDeferred.getType();

			assertEquals( 1, Array.prototype.join.callCount );
			assertEquals( 1, String.prototype.replace.callCount );
		}
	} ) );

	TestCase( "HydraDeferredCompleteTest", sinon.testCase( {
		setUp: function () {
			setupPromise.call(this);
			setupDeferred.call(this);
			sinon.spy( Array.prototype, "shift" );
		},
		tearDown: function () {
			Array.prototype.shift.restore();
			teardownDeferred.call(this);
			teardownPromise.call(this);
		},
		"test should return false if sType is an empty string": function () {
			var bResult = true;

			bResult = this.oDeferred.complete( "" );

			assertFalse( bResult );
		},
		"test should not call shift if nothing is pending in Promise and not in Deferred object": function () {
			this.oDeferred.complete( "" );

			assertEquals( 0, Array.prototype.shift.callCount );
		},
		"test should not call shift if something is asigned but not aPending actions": function () {
			this.oDeferred.add( this.oPromise );

			this.oDeferred.complete( 'resolve' );

			assertEquals( 0, Array.prototype.shift.callCount );
		},
		"test should call shift one time if oPromise has aPending actions": function () {
			this.oPromise.aPending[0] = {resolve: function () {}, reject: function () {}};
			this.oDeferred.add( this.oPromise );

			this.oDeferred.complete( 'resolve' );

			assertEquals( 1, Array.prototype.shift.callCount );
		},
		"test should call shift two times if oPromise has aPending actions and also Deferred object": function () {
			this.oPromise.aPending[0] = {resolve: function () {}, reject: function () {}};
			this.oDeferred.aPending[0] = {resolve: function () {}, reject: function () {}};
			this.oDeferred.add( this.oPromise );

			this.oDeferred.complete( 'resolve' );

			assertEquals( 2, Array.prototype.shift.callCount );
		}
	} ) );

	TestCase( "HydraDeferredThenTest", sinon.testCase( {
		setUp: function () {
			this.oAction = Hydra.action();
			sinon.stub( this.oAction, "listen" );
			sinon.stub( Hydra, "action" ).returns( this.oAction );
			this.oDeferred = new Hydra.deferred();
			this.oPromise = new Hydra.promise();
			sinon.spy( this.oDeferred.aPending, "push" );
			this.fpOnSuccess = function () {};
			this.fpOnError = function () {};
		},
		tearDown: function () {
			this.oAction.listen.restore();
			Hydra.action.restore();
			this.oDeferred.aPending.push.restore();
		},
		"test should call push method of aPending one time": function () {
			this.oDeferred.then( this.fpOnSuccess, this.fpOnError );
			assertEquals( 1, this.oDeferred.aPending.push.callCount );
		},
		"test should return the same instance of the promise": function () {
			var oResult = this.oDeferred.then( this.fpOnSuccess, this.fpOnError );
			assertEquals( this.oDeferred, oResult );
		},
		"test should return fpOnSuccess on first item in aPending with key resolve": function () {
			this.oDeferred.then( this.fpOnSuccess, this.fpOnError );

			assertSame( this.fpOnSuccess, this.oDeferred.aPending[0].resolve );
		},
		"test should return fpOnError on first item in aPending with key reject": function () {
			this.oDeferred.then( this.fpOnSuccess, this.fpOnError );
			assertSame( this.fpOnError, this.oDeferred.aPending[0].reject );
		}
	} ) );

}(window, document, Hydra));