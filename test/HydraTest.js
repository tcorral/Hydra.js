TestCase("HydraInitializationTest", sinon.testCase({
	setUp: function () {},
	"test should return an object for window.Hydra or Hydra": function () {
		assertObject(window.Hydra);
		assertObject(Hydra);
	},
	"test should return a function for action property of Hydra": function () {
		assertFunction(Hydra.action);
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
	},
	tearDown: function () {}
}));

TestCase("HydraActionTest", sinon.testCase({
	setUp: function () {},
	"test should return the Action Class": function () {
		var oResult = null;

		oResult = Hydra.action();

		assertEquals("Action", oResult.type);
	},
	"test should return an instance of Action": function () {
		var oInstance = null;

		var oClass = Hydra.action();
		oInstance = new (oClass);

		assertInstanceOf(oClass, oInstance);
	},
	tearDown: function () {}
}));

TestCase("HydraErrorHandlerTest", sinon.testCase({
	setUp: function () {},
	"test should return the ErrorHandler Class": function () {
		var oResult = null;

		oResult = Hydra.errorHandler();

		assertEquals("ErrorHandler", oResult.type);
	},
	"test should return an instance of ErrorHandler": function () {
		var oInstance = null;

		var oClass = Hydra.errorHandler();
		oInstance = new (oClass);

		assertInstanceOf(oClass, oInstance);
	},
	tearDown: function () {}
}));

TestCase("HydraSetErrorHandlerTest", sinon.testCase({
	setUp: function () {
		this.ErrorHandler = Hydra.errorHandler();
		var FakeClass = function () {};
		FakeClass.type = 'Fake';

		Hydra.setErrorHandler(FakeClass);
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
	},
	tearDown: function () {
		Hydra.setErrorHandler(this.ErrorHandler);
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
	},
	tearDown: function () {
		Hydra.module.remove(this.sModuleId);
	}
}));

TestCase("HydraModuleRemoveTest", sinon.testCase({
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

		sinon.spy(Hydra.module, "_delete");
	},
	"test should not call the delete native if the module is not registered before remove it": function () {
		Hydra.module.remove(this.sModuleId);

		assertEquals(0, Hydra.module._delete.callCount);
	},
	"test should call the delete native one time if the module is registered before remove it": function () {
		Hydra.module.register(this.sModuleId, this.fpModuleCreator);

		Hydra.module.remove(this.sModuleId);

		assertTrue(Hydra.module._delete.calledOnce);
	},
	tearDown: function () {
		Hydra.module._delete.restore();
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
	"test should call the init method of the module if the module is registered before start": function () {
		Hydra.module.start(this.sModuleId);

		assertTrue(this.fpInitStub.calledOnce);
	},
	tearDown: function () {
		Hydra.module.remove(this.sModuleId);
	}
}));

TestCase("HydraModuleStartAllTest", sinon.testCase({
	setUp: function () {
		this.sModuleId = 'test';
		this.sModuleId2 = 'test2';
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
	"test should call the init method of the two registered modules": function () {
		Hydra.module.startAll();

		assertTrue(this.fpInitStub.calledTwice);
	},
	tearDown: function () {
		Hydra.module.remove(this.sModuleId);
	}
}));

TestCase("HydraModuleStopTest", sinon.testCase({
	setUp: function () {
		var self = this;
		this.sModuleId = 'test';
		this.oModule = null;
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
	"test should not call the destroy method if the module is registered but not started": function () {
		Hydra.module.stop(this.sModuleId);

		assertEquals(0, this.fpDestroyStub.callCount);
	},
	"test should call the destroy method one time if the module is registered and started": function () {
		Hydra.module.start(this.sModuleId);

		Hydra.module.stop(this.sModuleId);

		assertTrue(this.fpDestroyStub.calledOnce);
	},
	tearDown: function () {
		Hydra.module.remove(this.sModuleId);
	}
}));

TestCase("HydraModuleStopAllTest", sinon.testCase({
	setUp: function () {
		var self = this;
		this.sModuleId = 'test';
		this.sModuleId2 = 'test2';
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
		Hydra.module.register(this.sModuleId2, this.fpModuleCreator);
		Hydra.module.startAll();
	},
	"test should call the destroy method of the two registered modules": function () {
		Hydra.module.stopAll();

		assertTrue(this.fpDestroyStub.calledTwice);
	},
	tearDown: function () {
		Hydra.module.remove(this.sModuleId);
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
	},
	tearDown: function () {
		Hydra.module.remove(this.sModuleId);
		Hydra.module._merge.restore();
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
	},
	tearDown: function () {
		Hydra.module.remove(this.sModuleId);
		Hydra.module.remove(this.sExtendedModuleId);
		Hydra.module._merge.restore();
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
	"test should call the callback": function () {
		Hydra.module.test(this.sModuleId, this.fpCallback);

		assertTrue(this.fpCallback.calledOnce);
	},
	tearDown: function () {
		Hydra.module.remove(this.sModuleId);
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
	"test should return null for list before create_dom": function () {
		assertNull(Hydra.errorHandler().list);
	},
	"test should return one list after create_dom": function () {
		Hydra.errorHandler().create_dom();

		assertTagName("UL", Hydra.errorHandler().list);
	},
	"test should add one layer and one list in the dom": function () {
		Hydra.errorHandler().create_dom();

		assertTrue(document.body.childNodes.length > this.nChilds);
		assertTrue(document.body.getElementsByTagName("div").length > this.nDivs);
		assertTrue(document.body.getElementsByTagName("ul").length > this.nLists);
	},
	"test should return fixed for the position of the created layer": function () {
		var aDivs = [];
		var oDiv = null;

		Hydra.errorHandler().create_dom();
		aDivs = document.body.getElementsByTagName("div");
		oDiv = aDivs[aDivs.length-1];

		assertEquals("fixed", oDiv.style.position);
	},
	"test should return 0px for the bottom of the created layer": function () {
		var aDivs = [];
		var oDiv = null;

		Hydra.errorHandler().create_dom();
		aDivs = document.body.getElementsByTagName("div");
		oDiv = aDivs[aDivs.length-1];

		assertEquals("0px", oDiv.style.bottom);
	},
	"test should return 100px for the height of the created layer": function () {
		var aDivs = [];
		var oDiv = null;

		Hydra.errorHandler().create_dom();
		aDivs = document.body.getElementsByTagName("div");
		oDiv = aDivs[aDivs.length-1];

		assertEquals("100px", oDiv.style.height);
	},
	"test should return 100% for the width of the created layer": function () {
		var aDivs = [];
		var oDiv = null;

		Hydra.errorHandler().create_dom();
		aDivs = document.body.getElementsByTagName("div");
		oDiv = aDivs[aDivs.length-1];

		assertEquals("100%", oDiv.style.width);
	},
	tearDown: function () {
	}
}));

TestCase("HydraErrorHandlerAddItemTest", sinon.testCase({
	setUp: function () {
		document.body.innerHTML = '';
		Hydra.errorHandler().list = null;
		this.nChilds = document.body.childNodes.length;
		this.nDivs = document.body.getElementsByTagName("div").length;
		this.nLists = document.body.getElementsByTagName("ul").length;
		Hydra.errorHandler().create_dom();
	},
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
	},
	tearDown: function () {
	}
}));

TestCase("HydraErrorHandlerLogTest", sinon.testCase({
	setUp: function () {
		document.body.innerHTML = '';
		this.oLog = Hydra.errorHandler().log;

		if(typeof Hydra.errorHandler().create_dom.restore !== "undefined")
		{
			Hydra.errorHandler().create_dom.restore();
		}
		if(typeof Hydra.errorHandler().addItem.restore !== "undefined")
		{
			Hydra.errorHandler().addItem.restore();
		}
		sinon.spy(Hydra.errorHandler(), "create_dom");
		sinon.spy(Hydra.errorHandler(), "addItem");
		this.oConsole = window.console;
		this.sModuleId = 'test1module';
		this.sMethod = 'testmethod';
		this.erError = {
			message: 'testmessage'
		};
	},
	"test should call the create_dom one time if window.console is undefined": function () {
		Hydra.errorHandler().list = null;

		Hydra.errorHandler().log(this.sModuleId, this.sMethod, this.erError, false);

		assertTrue(Hydra.errorHandler().create_dom.calledOnce);
	},
	"test should call the addItem one time if window.console is undefined": function () {
		Hydra.errorHandler().list = null;

		Hydra.errorHandler().log(this.sModuleId, this.sMethod, this.erError, false);

		assertTrue(Hydra.errorHandler().addItem.calledOnce);
	},
	tearDown: function () {
		Hydra.module.remove(this.sModuleId);
		window.console = this.oConsole;
		Hydra.errorHandler().log = Hydra.errorHandler().__old_log__;
		if(typeof Hydra.errorHandler().create_dom.restore !== "undefined")
		{
			Hydra.errorHandler().create_dom.restore();
		}
		if(typeof Hydra.errorHandler().addItem.restore !== "undefined")
		{
			Hydra.errorHandler().addItem.restore();
		}
	}
}));

TestCase("HydraActionListenTest", sinon.testCase({
	setUp: function () {
		var self = this;
		this.sListener = 'test';
		this.fpHandler = function (oAction) {};
		this.oModule = {
			init: function () {},
			handleAction: this.fpHandler,
			destroy: function () {}
		};
		this.fpAction = Hydra.action();
		this.oAction = new this.fpAction();
		this.oAction.__restore__();
	},
	"test should return undefined for Action.oActions.test if listen is not called": function () {
		assertUndefined(this.fpAction.oActions.test);
	},
	"test should return an object with module and handler for Action.oActions.test if listen is called": function () {
		this.oAction.listen([this.sListener], this.fpHandler, this.oModule);

		var oTestAction = this.fpAction.oActions.test[0];

		assertObject(oTestAction);
		assertSame(this.fpHandler, oTestAction.handler);
		assertSame(this.oModule, oTestAction.module);
	},
	tearDown: function () {
		this.oAction.__restore__();
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
		this.fpAction = Hydra.action();
		this.oAction = new this.fpAction();
		this.oAction.__restore__();
		this.oAction.listen([this.sListener], this.fpHandler, this.oModule);
	},
	"test should not call the fpListen callback if the action called is test2": function () {
		this.oAction.notify(this.oOtherNotifier);

		assertEquals(0, this.fpListen.callCount);
	},
	"test should call the fpListen callback if the action called is test": function () {
		this.oAction.notify(this.oNotifier);

		assertTrue(this.fpListen.calledOnce);
	},
	tearDown: function () {
		this.oAction.__restore__();
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
		this.fpAction = Hydra.action();
		this.oAction = new this.fpAction();
		this.oAction.__restore__();
		this.oAction.listen([this.sListener], this.fpHandler, this.oModule);
	},
	"test should call the fpListen callback if the action called is test if not stopListen": function () {
		this.oAction.notify(this.oNotifier);

		assertEquals(1, this.fpListen.callCount);
	},
	"test should not call the fpListen callback if the action called is test if stopListen is called before": function () {
		this.oAction.stopListen([this.sListener], this.oModule);

		this.oAction.notify(this.oNotifier);

		assertEquals(0, this.fpListen.callCount);
	},
	tearDown: function () {
		this.oAction.__restore__();
	}
}));