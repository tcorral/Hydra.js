TestCase("HydraInitializationTest", sinon.testCase({
	setUp: function () {},
    tearDown: function () {},
	"test should return an object for window.Hydra or Hydra": function () {
		assertFunction(window.Hydra);
		assertFunction(Hydra);
	},
	"test should return a function for action property of Hydra": function () {
		assertFunction(Hydra.action);
	},
	"test should return a function for errorHandler property of Hydra": function () {
		assertFunction(Hydra.errorHandler);
	},
	"test should return a function for setErrorHandler property of Hydra": function () {
		assertFunction(Hydra.setErrorHandler);
	},
	"test should return a Module object for module property of Hydra": function () {
		assertObject(Hydra.module);
		assertEquals("Module", Hydra.module.type);
	}
}));

TestCase("HydraActionTest", sinon.testCase({
	setUp: function () {},
    tearDown: function () {},
	"test should return the Action Class": function () {
		var oResult;
		oResult = Hydra.action();

		assertEquals("Action", oResult.type);
	}
}));

TestCase("HydraErrorHandlerTest", sinon.testCase({
	setUp: function () {},
    tearDown: function () {},
	"test should return the ErrorHandler Class": function () {
		var oResult;

		oResult = Hydra.errorHandler();

		assertEquals("ErrorHandler", oResult.type);
	},
	"test should return an instance of ErrorHandler": function () {
		var oInstance = null;

		var oClass = Hydra.errorHandler();
		oInstance = new (oClass);

		assertInstanceOf(oClass, oInstance);
	}
}));

TestCase("HydraSetErrorHandlerTest", sinon.testCase({
	setUp: function () {
		this.ErrorHandler = Hydra.errorHandler();
		var FakeClass = function () {};
		FakeClass.type = 'Fake';

		Hydra.setErrorHandler(FakeClass);
	},
    tearDown: function () {
        Hydra.setErrorHandler(this.ErrorHandler);
    },
	"test should change the ErrorHandler Class to a Fake Class": function () {
		var oResult = null;

		oResult = Hydra.errorHandler();

		assertEquals("Fake", oResult.type);
	},
	"test should return an instance of Fake Class": function () {
		var oInstance = null;
		var oClass =  null;

		oClass = Hydra.errorHandler();
		oInstance = new (oClass);

		assertInstanceOf(oClass, oInstance);
	}
}));

TestCase("HydraModuleRegisterTest", sinon.testCase({
	setUp: function () {
		this.sModuleId = 'test';
		this.fpModuleCreator = function (oAction) {
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
        Hydra.module.remove(this.sModuleId);
    },
	"test should throw an error if we try to create a module without register if the ErrorHandler Class": function () {
		var self = this;
		assertException(function()
		{
			Hydra.module.test(self.sModuleId, function (oModule) {});
		});
	},
	"test should return a module if we create a module registering it": function () {

		Hydra.module.register(this.sModuleId, this.fpModuleCreator);

		Hydra.module.test(this.sModuleId, function (oModule) {
			assertObject(oModule);
		});
	}
}));

TestCase("HydraModuleRemoveTest", sinon.testCase({
	setUp: function () {
		this.sModuleId = 'test';
		this.sContainerId = 'test';
		this.fpModuleCreator = function (oAction) {
			return {
				init: function () {

				},
				handleAction: function () {

				},
				destroy: function () {

				}
			}
		};

		sinon.spy(Hydra.module, "_delete");
	},
    tearDown: function () {
        Hydra.module._delete.restore();
    },
	"test should not call the delete native if the module is not registered before remove it": function () {
		Hydra.module.remove(this.sModuleId, this.sContainerId);

		assertEquals(0, Hydra.module._delete.callCount);
	},
	"test should call the delete native one time if the module is registered before remove it": function () {
		Hydra.module.register(this.sModuleId, this.fpModuleCreator);

		Hydra.module.remove(this.sModuleId, this.sContainerId);

		assertTrue(Hydra.module._delete.calledOnce);
	}
}));

TestCase("HydraModuleStartTest", sinon.testCase({
	setUp: function () {
		this.sModuleId = 'test';
		this.fpInitStub = sinon.stub();
		var self = this;
		this.fpModuleCreator = function (oAction) {
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
		Hydra.module.register(this.sModuleId, this.fpModuleCreator);
	},
    tearDown: function () {
        Hydra.module.remove(this.sModuleId);
    },
	"test should call the init method of the module if the module is registered before start": function () {
		Hydra.module.start(this.sModuleId);

		assertTrue(this.fpInitStub.calledOnce);
	}
}));

TestCase("HydraModuleStartAllTest", sinon.testCase({
	setUp: function () {
		this.sModuleId = 'test';
		this.sModuleId2 = 'test2';
		this.sContainerId_1 = 'test1';
		this.sContainerId_2 = 'test2';
		this.fpInitStub = sinon.stub();
		var self = this;
		this.fpModuleCreator = function (oAction) {
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
		Hydra.module.register(this.sModuleId, this.fpModuleCreator);
		Hydra.module.register(this.sModuleId2, this.fpModuleCreator);
	},
    tearDown: function () {
        Hydra.module.remove(this.sModuleId);
    },
	"test should call the init method of the two registered modules": function () {
		Hydra.module.startAll();

		assertTrue(this.fpInitStub.calledTwice);
	}
}));

TestCase("HydraModuleStopTest", sinon.testCase({
	setUp: function () {
		this.sModuleId = 'test';
		this.sContainerId = 'test';
		this.oModule = null;
		Hydra.module.register(this.sModuleId, function()
        {
            return {
                init: function () {}
            }
        });
        this.oModule = Hydra.module.getModule(this.sModuleId, this.sContainerId);
        this.fpDestroyStub = sinon.stub(this.oModule.instances[this.sContainerId], 'destroy');
	},
    tearDown: function () {
        Hydra.module.remove(this.sModuleId, this.sContainerId);
    },
	"test should not call the destroy method if the module is registered but not started": function () {
        //Simulate no started
        Hydra.module.remove(this.sModuleId, this.sContainerId);

		Hydra.module.stop(this.sModuleId, this.sContainerId);

		assertEquals(0, this.fpDestroyStub.callCount);
	},
	"test should call the destroy method one time if the module is registered and started": function () {

		Hydra.module.stop(this.sModuleId, this.sContainerId);

		assertTrue(this.fpDestroyStub.calledOnce);
	}
}));

TestCase("HydraModuleStopAllTest", sinon.testCase({
	setUp: function () {
		var self = this;
		this.sModuleId = 'test';
		this.sContainerId_1 = 'test';
		this.sContainerId_2 = 'test2';
		Hydra.module.register(this.sModuleId, function()
        {
            return {
                init: function () {}
            }
        });
        this.oModule1 = Hydra.module.getModule(this.sModuleId, this.sContainerId_1);
        this.fpDestroyStub1 = sinon.stub(this.oModule1.instances[this.sContainerId_1], 'destroy');

        this.oModule2 = Hydra.module.getModule(this.sModuleId, this.sContainerId_2);
        this.fpDestroyStub2 = sinon.stub(this.oModule2.instances[this.sContainerId_2], 'destroy');
	},
    tearDown: function () {
        Hydra.module.remove(this.sModuleId);
    },
	"test should call the destroy method of the two registered modules": function () {
		Hydra.module.stopAll();

        assertTrue(this.fpDestroyStub1.calledOnce);
        assertTrue(this.fpDestroyStub2.calledOnce);
	}
}));

TestCase("HydraModuleSimpleExtendTest", sinon.testCase({
	setUp: function () {
		var self = this;
		this.sModuleId = 'test';
		this.fpInitStub = sinon.stub();
		this.fpDestroyStub = sinon.stub();
		this.fpModuleCreator = function (oAction) {
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
		this.fpModuleExtendedCreator = function (oAction) {
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
		Hydra.module.register(this.sModuleId, this.fpModuleCreator);
		sinon.spy(Hydra.module, "_merge");
	},
    tearDown: function () {
        Hydra.module.remove(this.sModuleId);
        Hydra.module._merge.restore();
    },
	"test should call the merge method one time": function () {
		Hydra.module.extend(this.sModuleId, this.fpModuleExtendedCreator);

		assertTrue(Hydra.module._merge.calledOnce);
	},
	"test should call the init method of the final extended module": function () {
		Hydra.module.extend(this.sModuleId, this.fpModuleExtendedCreator);

		Hydra.module.start(this.sModuleId);

		assertTrue(this.fpInitStub.calledOnce);
	},
	"test should call the destroy method of the final extended module": function () {
		Hydra.module.extend(this.sModuleId, this.fpModuleExtendedCreator);

		Hydra.module.start(this.sModuleId);

		assertEquals(0, this.fpDestroyStub.callCount);
	}
}));

TestCase("HydraModuleComplexExtendTest", sinon.testCase({
	setUp: function () {
		var self = this;
		this.sModuleId = 'test';
		this.sExtendedModuleId = 'test2';
		this.fpInitStub = sinon.stub();
		this.fpDestroyStub = sinon.stub();
		this.fpModuleCreator = function (oAction) {
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
		this.fpModuleExtendedCreator = function (oAction) {
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
		Hydra.module.register(this.sModuleId, this.fpModuleCreator);
		sinon.spy(Hydra.module, "_merge");
	},
    tearDown: function () {
        Hydra.module.remove(this.sModuleId);
        Hydra.module.remove(this.sExtendedModuleId);
        Hydra.module._merge.restore();
    },
	"test should call the merge method one time": function () {
		Hydra.module.extend(this.sModuleId, this.sExtendedModuleId, this.fpModuleExtendedCreator);

		assertTrue(Hydra.module._merge.calledOnce);
	},
	"test should call the init method of the final extended module": function () {
		Hydra.module.extend(this.sModuleId, this.sExtendedModuleId, this.fpModuleExtendedCreator);

		Hydra.module.start(this.sExtendedModuleId);

		assertTrue(this.fpInitStub.calledOnce);
	},
	"test should call the destroy method of the final extended module": function () {
		Hydra.module.extend(this.sModuleId, this.sExtendedModuleId, this.fpModuleExtendedCreator);

		Hydra.module.start(this.sExtendedModuleId);

		assertEquals(0, this.fpDestroyStub.callCount);
	}
}));

TestCase("HydraModuleTestTest", sinon.testCase({
	setUp: function () {
		var self = this;
		this.sModuleId = 'test';
		this.fpCallback = sinon.stub();
		this.fpDestroyStub = sinon.stub();
		this.fpModuleCreator = function (oAction) {
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
		Hydra.module.register(this.sModuleId, this.fpModuleCreator);
	},
    tearDown: function () {
        Hydra.module.remove(this.sModuleId);
    },
	"test should call the callback": function () {
		Hydra.module.test(this.sModuleId, this.fpCallback);

		assertTrue(this.fpCallback.calledOnce);
	}
}));

TestCase("HydraErrorHandlerCreateDomTest", sinon.testCase({
	setUp: function () {
		document.body.innerHTML = '';
		Hydra.errorHandler().list = null;
		this.nChilds = document.body.childNodes.length;
		this.nDivs = document.body.getElementsByTagName("div").length;
		this.nLists = document.body.getElementsByTagName("ul").length;
	},
    tearDown: function () {},
	"test should return null for list before create_dom": function () {
		assertNull(Hydra.errorHandler().list);
	},
	"test should return one list after create_dom": function () {
		Hydra.errorHandler()._create_dom();

		assertTagName("UL", Hydra.errorHandler().list);
	},
	"test should add one layer and one list in the dom": function () {
		Hydra.errorHandler()._create_dom();

		assertTrue(document.body.childNodes.length > this.nChilds);
		assertTrue(document.body.getElementsByTagName("div").length > this.nDivs);
		assertTrue(document.body.getElementsByTagName("ul").length > this.nLists);
	},
	"test should return fixed for the position of the created layer": function () {
		var aDivs = [];
		var oDiv = null;

		Hydra.errorHandler()._create_dom();
		aDivs = document.body.getElementsByTagName("div");
		oDiv = aDivs[aDivs.length-1];

		assertEquals("fixed", oDiv.style.position);
	},
	"test should return 0px for the bottom of the created layer": function () {
		var aDivs = [];
		var oDiv = null;

		Hydra.errorHandler()._create_dom();
		aDivs = document.body.getElementsByTagName("div");
		oDiv = aDivs[aDivs.length-1];

		assertEquals("0px", oDiv.style.bottom);
	},
	"test should return 100px for the height of the created layer": function () {
		var aDivs = [];
		var oDiv = null;

		Hydra.errorHandler()._create_dom();
		aDivs = document.body.getElementsByTagName("div");
		oDiv = aDivs[aDivs.length-1];

		assertEquals("100px", oDiv.style.height);
	},
	"test should return 100% for the width of the created layer": function () {
		var aDivs = [];
		var oDiv = null;

		Hydra.errorHandler()._create_dom();
		aDivs = document.body.getElementsByTagName("div");
		oDiv = aDivs[aDivs.length-1];

		assertEquals("100%", oDiv.style.width);
	}
}));

TestCase("HydraErrorHandlerAddItemTest", sinon.testCase({
	setUp: function () {
		document.body.innerHTML = '';
		Hydra.errorHandler().list = null;
		this.nChilds = document.body.childNodes.length;
		this.nDivs = document.body.getElementsByTagName("div").length;
		this.nLists = document.body.getElementsByTagName("ul").length;
		Hydra.errorHandler()._create_dom();
	},
    tearDown: function () {},
	"test should return 0 for li items in the list if addItem is not called": function () {
		var oList = Hydra.errorHandler().list;
		var aLiItems = [];

		aLiItems = Hydra.errorHandler().list.getElementsByTagName("li");

		assertEquals(0, aLiItems.length);
	},
	"test should return 1 for li items in the list if addItem is called one time": function () {
		var oList = Hydra.errorHandler().list;
		var aLiItems = [];
		var sModuleId = 'test1module';
		var sMethod = 'testmethod';
		var erError = {
			message: 'testmessage'
		};

		Hydra.errorHandler().addItem(sModuleId, sMethod, erError);

		aLiItems = Hydra.errorHandler().list.getElementsByTagName("li");

		assertEquals(1, aLiItems.length);
	},
	"test should return 2 for li items in the list if addItem is called two times": function () {
		var oList = Hydra.errorHandler().list;
		var aLiItems = [];
		var sModuleId = 'test1module';
		var sMethod = 'testmethod';
		var erError = {
			message: 'testmessage'
		};

		Hydra.errorHandler().addItem(sModuleId, sMethod, erError);
		Hydra.errorHandler().addItem(sModuleId, sMethod, erError);

		aLiItems = Hydra.errorHandler().list.getElementsByTagName("li");

		assertEquals(2, aLiItems.length);
	}
}));

TestCase("HydraModuleSetVarsTest", sinon.testCase({
	setUp: function()
	{
		var self = this;
		this.oVars = null;
		this.fpInit = function(oData)
		{
			self.oVars = oData;
		};
		Hydra.module.register("test-module", function(sandbox)
		{
			return {
				init: self.fpInit,
				destroy: function()
				{

				}
			};
		});
		sinon.spy(this, 'fpInit');
	},
	tearDown: function()
	{
		this.fpInit.restore();
		delete this.oVars;
		delete this.fpInit;
	},
	'test should check that setVars method exist in Module': function()
	{
		assertFunction(Hydra.module.setVars);
	},
	'test should check that all the vars set in setVars are passed as an object when the module is started': function()
	{
		var oVars = {
			'test': 'test',
			'test1': 'test1'
		};
		Hydra.module.setVars(oVars);

		Hydra.module.start('test-module');

		assertSame(oVars, this.oVars);
	},
	'test should check that if we pass a param when starting the module will move the object of vars to the last position in arguments': function()
	{
		var oVars = {
			'test': 'test',
			'test1': 'test1'
		};
		var oData = {
			data: 2
		};
		var oCall = null;

		Hydra.module.setVars(oVars);

		Hydra.module.start('test-module', document.body, oData);

		oCall = this.fpInit.getCall(0);

		assertEquals(oData, oCall.args[0]);
		assertEquals(oVars, oCall.args[1]);
	}
}));

TestCase("HydraModuleGetVarsTest", sinon.testCase({
	setUp: function()
	{
		this.oVars = {
			'test': 'test',
			'test1': 'test1'
		};
		Hydra.module.setVars(this.oVars);
	},
	tearDown: function()
	{
		delete this.oVars;
	},
	'test should check that getVars method exist in Module': function()
	{
		assertFunction(Hydra.module.getVars);
	},
	'test should check that getVars return a copy of all the vars set using setVars': function()
	{
		var oVars = Hydra.module.getVars();

		assertEquals(this.oVars, oVars);
	}
}));

TestCase("HydraErrorHandlerLogTest", sinon.testCase({
	setUp: function () {
		document.body.innerHTML = '';
		this.oLog = Hydra.errorHandler().log;

		if(typeof Hydra.errorHandler()._create_dom.restore !== "undefined")
		{
			Hydra.errorHandler()._create_dom.restore();
		}
		if(typeof Hydra.errorHandler().addItem.restore !== "undefined")
		{
			Hydra.errorHandler().addItem.restore();
		}
		sinon.spy(Hydra.errorHandler(), "_create_dom");
		sinon.spy(Hydra.errorHandler(), "addItem");
		this.oConsole = window.console;
		this.sModuleId = 'test1module';
		this.sMethod = 'testmethod';
		this.erError = {
			message: 'testmessage'
		};
	},
    tearDown: function () {
        Hydra.module.remove(this.sModuleId);
        window.console = this.oConsole;
        Hydra.errorHandler().log = Hydra.errorHandler().__old_log__;
        if(typeof Hydra.errorHandler()._create_dom.restore !== "undefined")
        {
            Hydra.errorHandler()._create_dom.restore();
        }
        if(typeof Hydra.errorHandler().addItem.restore !== "undefined")
        {
            Hydra.errorHandler().addItem.restore();
        }
    },
	"test should call the _create_dom one time if window.console is undefined": function () {
		Hydra.errorHandler().list = null;

		Hydra.errorHandler().log(this.sModuleId, this.sMethod, this.erError, false);

		assertTrue(Hydra.errorHandler()._create_dom.calledOnce);
	},
	"test should call the addItem one time if window.console is undefined": function () {
		Hydra.errorHandler().list = null;

		Hydra.errorHandler().log(this.sModuleId, this.sMethod, this.erError, false);

		assertTrue(Hydra.errorHandler().addItem.calledOnce);
	}
}));

TestCase("HydraActionListenTest", sinon.testCase({
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
		this.oAction.notify([this.sListener], {type: this.sListener});

		assertEquals(0, this.fpHandler.callCount);
	},
	"test should call fpHandler if notify is launched after set the listeners": function () {
		this.oAction.listen([this.sListener], this.fpHandler, this.oModule);

		this.oAction.notify({type: this.sListener});

		assertEquals(1, this.fpHandler.callCount);
	}
}));

TestCase("HydraActionNotifyTest", sinon.testCase({
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
		this.fpHandler = function (oAction) {
			if(oAction.type === self.sListener){
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
		this.oAction.listen([this.sListener], this.fpHandler, this.oModule);
	},
    tearDown: function () {
        this.oAction.__restore__();
    },
	"test should not call the fpListen callback if the action called is test2": function () {
		this.oAction.notify(this.oOtherNotifier);

		assertEquals(0, this.fpListen.callCount);
	},
	"test should call the fpListen callback if the action called is test": function () {
		this.oAction.notify(this.oNotifier);

		assertTrue(this.fpListen.calledOnce);
	}
}));

TestCase("HydraActionStopListenTest", sinon.testCase({
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
		this.fpHandler = function (oAction) {
			if(oAction.type === self.sListener){
				self.fpListen();
			}
		};
		this.oModule = {
			init: function () {},
			handleAction: function()
			{
				self.fpHandler();
			},
			destroy: function () {}
		};
		this.oAction = Hydra.action();
		this.oAction.__restore__();
		this.oAction.listen([this.sListener], this.fpHandler, this.oModule);
	},
    tearDown: function () {
        this.oAction.__restore__();
    },
	"test should call the fpListen callback if the action called is test if not stopListen": function () {
		this.oAction.notify(this.oNotifier);

		assertEquals(1, this.fpListen.callCount);
	},
	"test should not call the fpListen callback if the action called is test if stopListen is called before": function () {
		this.oAction.stopListen([this.sListener], this.oModule);

		this.oAction.notify(this.oNotifier);

		assertEquals(0, this.fpListen.callCount);
	}
}));

TestCase("HydraPromiseConstructorTest", sinon.testCase({
	setUp: function () {
        this.oPromise = new Hydra.promise();
	},
    tearDown: function () {},
	"test should return an empty array for aPending property by default": function ()
    {
        assertArray(this.oPromise.aPending);
        assertEquals(0, this.oPromise.aPending.length);
	},
    "test should return false for bCompleted property by default": function()
    {
        assertBoolean(this.oPromise.bCompleted);
        assertFalse(this.oPromise.bCompleted);
    },
    "test should return sType as an empty string for sType by default": function()
    {
        assertString(this.oPromise.sType);
        assertEquals(0, this.oPromise.sType.length);
    },
    "test should return null for oResult property by default": function()
    {
        assertNull(this.oPromise.oResult);
    },
    "test should return function for resolve property by default": function()
    {
        assertFunction(this.oPromise.resolve);
    },
    "test should return function for reject property by default": function()
    {
        assertFunction(this.oPromise.resolve);
    }
}));

TestCase("HydraPromiseResolveTest", sinon.testCase({
	setUp: function () {
        this.oPromise = new Hydra.promise();
        sinon.stub(this.oPromise.oAction, "notify");
        this.oResult = 'test';
	},
    tearDown: function ()
    {
        this.oPromise.oAction.notify.restore();
    },
	"test should change bCompleted to true": function ()
    {
        this.oPromise.resolve(this.oResult);

        assertTrue(this.oPromise.bCompleted);
	},
    "test should change sType to 'resolve'": function()
    {
        this.oPromise.resolve(this.oResult);

        assertEquals("resolve", this.oPromise.sType);
    },
    "test should change oResult to 'test'": function()
    {
        this.oPromise.resolve(this.oResult);

        assertSame(this.oResult, this.oPromise.oResult);
    },
    "test should call notify of Action one time": function()
    {
        this.oPromise.resolve(this.oResult);

        assertEquals(1, this.oPromise.oAction.notify.callCount);
    }
}));

TestCase("HydraPromiseRejectTest", sinon.testCase({
	setUp: function () {
        this.oPromise = new Hydra.promise();
        sinon.stub(this.oPromise.oAction, "notify");
        this.oResult = 'test';
	},
    tearDown: function () {
        this.oPromise.oAction.notify.restore();
    },
	"test should change bCompleted to true": function ()
    {
        this.oPromise.reject(this.oResult);

        assertTrue(this.oPromise.bCompleted);
	},
    "test should change sType to 'reject'": function()
    {
        this.oPromise.reject(this.oResult);

        assertEquals("reject", this.oPromise.sType);
    },
    "test should change oResult to 'test'": function()
    {
        this.oPromise.reject(this.oResult);

        assertSame(this.oResult, this.oPromise.oResult);
    },
    "test should call notify of Action one time": function()
    {
        this.oPromise.reject(this.oResult);

        assertEquals(1, this.oPromise.oAction.notify.callCount);
    }
}));

TestCase("HydraPromiseThenTest", sinon.testCase({
	setUp: function () {
        this.oPromise = new Hydra.promise();
        sinon.spy(this.oPromise.aPending, "push");
        this.fpOnSuccess = function(){};
        this.fpOnError = function(){};
	},
    tearDown: function () {
        this.oPromise.aPending.push.restore();
    },
	"test should call push method of aPending one time": function () {
        this.oPromise.then(this.fpOnSuccess, this.fpOnError);
        assertEquals(1, this.oPromise.aPending.push.callCount);
	},
	"test should return the same instance of the promise": function () {
        var oResult = this.oPromise.then(this.fpOnSuccess, this.fpOnError);
        assertEquals(this.oPromise, oResult);
	},
    "test should return fpOnSuccess on first item in aPending with key resolve": function()
    {
        this.oPromise.then(this.fpOnSuccess, this.fpOnError);
        assertSame(this.fpOnSuccess, this.oPromise.aPending[0].resolve);
    },
    "test should return fpOnError on first item in aPending with key reject": function()
    {
        this.oPromise.then(this.fpOnSuccess, this.fpOnError);
        assertSame(this.fpOnError, this.oPromise.aPending[0].reject);
    }
}));

TestCase("HydraDeferredConstructorTest", sinon.testCase({
	setUp: function () {
        this.oAction = Hydra.action();
        sinon.stub(this.oAction, "listen");
        sinon.stub(Hydra, "action").returns(this.oAction);
        this.oDeferred = new Hydra.deferred();
	},
    tearDown: function () {
        this.oAction.listen.restore();
        Hydra.action.restore();
    },
	"test should return empty array for aPromises by default": function () {
        assertArray(this.oDeferred.aPromises);
        assertEquals(0, this.oDeferred.aPromises.length);
	},
	"test should return empty array for aPending by default": function () {
        assertArray(this.oDeferred.aPending);
        assertEquals(0, this.oDeferred.aPending.length);
	},
	"test should return empty string for sType by default": function () {
        assertString(this.oDeferred.sType);
        assertEquals(0, this.oDeferred.sType.length);
	},
    "test should call Hydra.action one time": function() {
        assertEquals(1, Hydra.action.callCount);
    },
    "test should call listen in oAction one time": function()
    {
        assertEquals(1, this.oAction.listen.callCount);
    },
    "test should call the listen with the first argument is an array with one element 'complete'": function()
    {
        assertArray(this.oAction.listen.getCall(0).args[0]);
        assertEquals("complete", this.oAction.listen.getCall(0).args[0][0]);
        assertUndefined(this.oAction.listen.getCall(0).args[0][1]);
    },
    "test should call the listen with the second argument is checkCompleted method": function()
    {
        assertArray(this.oAction.listen.getCall(0).args[0]);
        assertEquals(this.oDeferred.checkCompleted, this.oAction.listen.getCall(0).args[1]);
    },
    "test should call the listen with the third argument is the same Deferred object": function()
    {
        assertSame(this.oDeferred, this.oAction.listen.getCall(0).args[2]);
    }
}));

TestCase("HydraDeferredAddTest", sinon.testCase({
	setUp: function () {
        this.oAction = Hydra.action();
        sinon.stub(this.oAction, "listen");
        sinon.stub(Hydra, "action").returns(this.oAction);
        this.oDeferred = new Hydra.deferred();
        this.oPromise = new Hydra.promise();
	},
    tearDown: function () {
        this.oAction.listen.restore();
        Hydra.action.restore();
    },
	"test should add a new Promise element to aPromises": function () {
        this.oDeferred.add(this.oPromise);

        assertSame(this.oPromise, this.oDeferred.aPromises[0]);
	},
	"test should return the same Deferred object": function () {
        var oDeferred = this.oDeferred.add(this.oPromise);

        assertSame(this.oDeferred, oDeferred);
	}
}));

TestCase("HydraDeferredCheckCompletedTest", sinon.testCase({
	setUp: function () {
        this.oAction = Hydra.action();
        sinon.stub(this.oAction, "listen");
        sinon.stub(Hydra, "action").returns(this.oAction);
        this.oDeferred = new Hydra.deferred();
        this.oPromise = new Hydra.promise();
        sinon.stub(this.oDeferred, "complete");
        sinon.stub(this.oDeferred, "getType");
	},
    tearDown: function () {
        this.oAction.listen.restore();
        Hydra.action.restore();
        this.oDeferred.complete.restore();
        this.oDeferred.getType.restore();
    },
	"test should return false if oPromise is not completed": function () {
        this.oDeferred.add(this.oPromise);
        var bResult = this.oDeferred.checkCompleted();

        assertFalse(bResult);
	},
	"test should not call complete if oPromise is not completed": function () {
        this.oDeferred.add(this.oPromise);
        var bResult = this.oDeferred.checkCompleted();

        assertEquals(0, this.oDeferred.complete.callCount);
	},
    "test should call complete if oPromise is completed": function()
    {
        this.oDeferred.add(this.oPromise);
        this.oPromise.bCompleted = true;

        this.oDeferred.checkCompleted();

        assertEquals(1, this.oDeferred.complete.callCount);
    }
}));

TestCase("HydraDeferredGetTypeTest", sinon.testCase({
	setUp: function () {
        this.oAction = Hydra.action();
        sinon.stub(this.oAction, "listen");
        sinon.stub(Hydra, "action").returns(this.oAction);
        this.oDeferred = new Hydra.deferred();
        this.oPromise = new Hydra.promise();
        this.oDeferred.add(this.oPromise);
        sinon.spy(Array.prototype, "push");
        sinon.spy(Array.prototype, "join");
        sinon.spy(String.prototype, "replace");
	},
    tearDown: function () {
        Array.prototype.push.restore();
        Array.prototype.join.restore();
        String.prototype.replace.restore();
        this.oAction.listen.restore();
        Hydra.action.restore();
    },
	"test should not call push if oPromise is not completed": function () {
        this.oDeferred.getType();

        assertEquals(0, Array.prototype.push.callCount);
	},
    "test should call push if oPromise is completed": function()
    {
        this.oPromise.bCompleted = true;

        this.oDeferred.getType();

        assertEquals(1, Array.prototype.push.callCount);
    },
    "test should return an empty string if nothing exist or is not completed": function()
    {
        var sResult = this.oDeferred.getType();

        assertEquals(0, sResult.length);
    },
    "test should call join, replace if one or more oPromise are completed": function()
    {
        this.oPromise.bCompleted = true;
        var sResult = this.oDeferred.getType();

        assertEquals(1, Array.prototype.join.callCount);
        assertEquals(1, String.prototype.replace.callCount);
    }
}));

TestCase("HydraDeferredCompleteTest", sinon.testCase({
	setUp: function () {
        this.oAction = Hydra.action();
        sinon.stub(this.oAction, "listen");
        sinon.stub(Hydra, "action").returns(this.oAction);
        this.oDeferred = new Hydra.deferred();
        this.oPromise = new Hydra.promise();
        sinon.spy(Array.prototype, "shift");
	},
    tearDown: function () {
        Array.prototype.shift.restore();
        this.oAction.listen.restore();
        Hydra.action.restore();
    },
    "test should return false if sType is an empty string": function()
    {
        var bResult = this.oDeferred.complete("");

        assertFalse(bResult);
    },
	"test should not call shift if nothing is pending in Promise and not in Deferred object": function () {
        this.oDeferred.complete("");

        assertEquals(0, Array.prototype.shift.callCount);
    },
    "test should not call shift if something is asigned but not aPending actions": function()
    {
        this.oDeferred.add(this.oPromise);

        this.oDeferred.complete('resolve');

        assertEquals(0, Array.prototype.shift.callCount);
    },
    "test should call shift one time if oPromise has aPending actions": function()
    {
        this.oPromise.aPending[0] = {resolve: function(){}, reject: function(){}};
        this.oDeferred.add(this.oPromise);

        this.oDeferred.complete('resolve');

        assertEquals(1, Array.prototype.shift.callCount);
    },
    "test should call shift two times if oPromise has aPending actions and also Deferred object": function()
    {
        this.oPromise.aPending[0] = {resolve: function(){}, reject: function(){}};
        this.oDeferred.aPending[0] = {resolve: function(){}, reject: function(){}};
        this.oDeferred.add(this.oPromise);

        this.oDeferred.complete('resolve');

        assertEquals(2, Array.prototype.shift.callCount);
    }
}));

TestCase("HydraDeferredThenTest", sinon.testCase({
	setUp: function () {
        this.oAction = Hydra.action();
        sinon.stub(this.oAction, "listen");
        sinon.stub(Hydra, "action").returns(this.oAction);
        this.oDeferred = new Hydra.deferred();
        this.oPromise = new Hydra.promise();
        sinon.spy(this.oDeferred.aPending, "push");
        this.fpOnSuccess = function(){};
        this.fpOnError = function(){};
	},
    tearDown: function () {
        this.oAction.listen.restore();
        Hydra.action.restore();
        this.oDeferred.aPending.push.restore();
    },
	"test should call push method of aPending one time": function () {
        this.oDeferred.then(this.fpOnSuccess, this.fpOnError);
        assertEquals(1, this.oDeferred.aPending.push.callCount);
	},
	"test should return the same instance of the promise": function () {
        var oResult = this.oDeferred.then(this.fpOnSuccess, this.fpOnError);
        assertEquals(this.oDeferred, oResult);
	},
    "test should return fpOnSuccess on first item in aPending with key resolve": function()
    {
        this.oDeferred.then(this.fpOnSuccess, this.fpOnError);

        assertSame(this.fpOnSuccess, this.oDeferred.aPending[0].resolve);
    },
    "test should return fpOnError on first item in aPending with key reject": function()
    {
        this.oDeferred.then(this.fpOnSuccess, this.fpOnError);
        assertSame(this.fpOnError, this.oDeferred.aPending[0].reject);
    }
}));
