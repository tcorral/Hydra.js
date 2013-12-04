var should = require( 'should' )
  , Hydra = require( '../src/Hydra' )
  , TestingHelper = require( '../libs/TestingHelper' )
  , sinon = require( 'sinon' )
  , oModule = null
  , oErrorHandler = null
  , FakeClass = function () {};

function getLengthObject(obj) {
  var sKey
    , nLen = 0;
  for (sKey in obj) {
    if (obj.hasOwnProperty(sKey)) {
      nLen++;
    }
  }
  return nLen;
}
FakeClass.type = 'Fake';

Hydra.setTestFramework(should);

describe('Hydra.js', function () {


  describe('Fix extension module bug on lazy pattern single module', function () {

    it('should return true if module is executed once', function () {
      var single = require('./resources/single');

      Hydra.module.test('single-module', function (oMod) {
        oModule = oMod;
      });
      oModule.init();

      oModule.isFirstExecution.should.equal(true);
    });

    it('should return false if module is executed twice', function () {
      var single = require('./resources/single');

      Hydra.module.test('single-module', function (oMod) {
        oModule = oMod;
      });
      oModule.init();
      oModule.init();

      oModule.isFirstExecution.should.equal(false);
    });

  });


  describe('Fix extension module bug on lazy pattern extended module', function () {

    it('should return true if module is executed once', function () {
      var extended = require('./resources/extended');

      Hydra.module.test('extended-module', function (oMod) {
        oModule = oMod;
      });
      oModule.init();

      oModule.isFirstExecution.should.equal(true);
    });

    it('should return false if module is executed twice', function () {
      var extended = require('./resources/extended');

      Hydra.module.test('extended-module', function (oMod) {
        oModule = oMod;
      });
      oModule.init();
      oModule.init();

      oModule.isFirstExecution.should.equal(false);
    });

  });


  describe('On request Hydra', function () {

    it('should return an object', function () {
      should.exist(Hydra);
    });

    it('should contain a property called errorHandler', function () {
      should.exist(Hydra.errorHandler);
      Hydra.errorHandler.should.be.a.Function;
    });

    it('should contain a property called setErrorHandler', function () {
      should.exist(Hydra.setErrorHandler);
      Hydra.setErrorHandler.should.be.a.Function;
    });

    it('should contain a property called module', function () {
      should.exist(Hydra.module);
      Hydra.module.should.be.an.Object;
      should.equal("Module", Hydra.module.type);
    });

  });


  describe('setErrorHandler', function () {

    it('should change the ErrorHandler class to a Fake Class', function () {
      var oResult;

      oErrorHandler = Hydra.errorHandler();
      Hydra.setErrorHandler(FakeClass);

      oResult = Hydra.errorHandler();

      oResult.type.should.equal("Fake");
      Hydra.setErrorHandler(oErrorHandler);
    });

    it('should return an instance of Fake Class', function () {
      var oInstance
        , oClass;

      oErrorHandler = Hydra.errorHandler();
      Hydra.setErrorHandler(FakeClass);

      oClass = Hydra.errorHandler();
      oInstance = new (oClass);

      oInstance.should.be.an.instanceOf(oClass);

      Hydra.setErrorHandler(oErrorHandler);
    });

  });


  describe('Register a module', function () {

    it('should throw an error if we try to create a module without register if the ErrorHandler Class', function () {
      var sModuleId = 'test'
        , fpModuleCreator = function () {
          return {
            init: function () {

            },
            handleAction: function () {

            },
            destroy: function () {

            }
          }
        };

      (function () {
        Hydra.module.test(sModuleId, function () {
        });
      }).should.throw();

      Hydra.module.remove(sModuleId);
    });

    it('should return a module if we create a module registering it', function () {
      var sModuleId = 'test'
        , fpModuleCreator = function () {
          return {
            init: function () {

            },
            handleAction: function () {

            },
            destroy: function () {

            }
          }
        };

      Hydra.module.register(sModuleId, fpModuleCreator);
      Hydra.module.test(sModuleId, function (oModule) {
        oModule.should.be.an.Object;
      });

      Hydra.module.remove(sModuleId);
    });

  });


  describe('Remove a module', function () {

    it('should not call the delete native if the module is not registered before remove it', function () {
      var sModuleId = 'test'
        , sContainerId = 'test'
        , fpModuleCreator = function () {
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

      Hydra.module.remove(sModuleId, sContainerId);

      Hydra.module._delete.callCount.should.equal(0);

      Hydra.module._delete.restore();
    });

    it('should call the delete native one time if the module is registered before remove it', function () {
      var sModuleId = 'test'
        , sContainerId = 'test'
        , fpModuleCreator = function () {
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

      Hydra.module.register(sModuleId, fpModuleCreator);

      Hydra.module.remove(sModuleId, sContainerId);

      Hydra.module._delete.calledOnce.should.equal(true);

      Hydra.module._delete.restore();
    });

  });


  describe('Start module/s', function () {

    it('should call the init method of the module if the module is registered before start', function () {
      var sModuleId = 'test'
        , sModuleId2 = 'test2'
        , fpInitStub = sinon.stub()
        , fpInitStub2 = sinon.stub()
        , fpModuleCreator = function () {
          return {
            init: function () {
              fpInitStub();
            },
            handleAction: function () {

            },
            destroy: function () {

            }
          }
        }
        , fpModuleCreator2 = function () {
          return {
            init: function () {
              fpInitStub2();
            },
            handleAction: function () {

            },
            destroy: function () {

            }
          }
        };
      Hydra.module.register(sModuleId, fpModuleCreator);
      Hydra.module.register(sModuleId2, fpModuleCreator2);

      Hydra.module.start(sModuleId);

      fpInitStub.calledOnce.should.equal(true);

      Hydra.module.remove(sModuleId);
    });

    it('should check that all the init methods in the modules are called when using multi-module start', function () {
      var sModuleId = 'test'
        , sModuleId2 = 'test2'
        , fpInitStub = sinon.stub()
        , fpInitStub2 = sinon.stub()
        , fpModuleCreator = function () {
          return {
            init: function () {
              fpInitStub();
            },
            handleAction: function () {

            },
            destroy: function () {

            }
          }
        }
        , fpModuleCreator2 = function () {
          return {
            init: function () {
              fpInitStub2();
            },
            handleAction: function () {

            },
            destroy: function () {

            }
          }
        };
      Hydra.module.register(sModuleId, fpModuleCreator);
      Hydra.module.register(sModuleId2, fpModuleCreator2);

      Hydra.module.start([sModuleId, sModuleId2]);

      fpInitStub.calledOnce.should.equal(true);
      fpInitStub2.calledOnce.should.equal(true);

      Hydra.module.remove(sModuleId);
    });

  });

  describe('Decorate a module', function () {
    it('should call the ErrorHandler.log if the base module has not been registered and return null', function () {
      var sModuleId = 'test'
        , oResult
        , sModuleDecorator = 'test-decorator';

      sinon.stub(Hydra.errorHandler(), 'log');
      oResult = Hydra.module.decorate(sModuleId, sModuleDecorator, function () {
        return {
          init: function () {
          },
          destroy: function () {
          }
        };
      });

      Hydra.errorHandler().log.calledOnce.should.equal(true);
      should.not.exist(oResult);
      Hydra.errorHandler().log.restore();
    });

    it('should return a FakeModule instance if the base module has been registered', function () {
      var sModuleId = 'test'
        , oResult
        , sModuleDecorator = 'test-decorator'
        , fpInitBaseModule = sinon.stub()
        , fpOnDestroyBaseModule = sinon.stub()
        , fpInitDecoratedModule = sinon.stub()
        , fpOnDestroyDecoratedModule = sinon.stub();

      Hydra.module.register(sModuleId, function (oBus) {
        return {
          init: fpInitBaseModule,
          onDestroy: fpOnDestroyBaseModule
        };
      });
      oResult = Hydra.module.decorate(sModuleId, sModuleDecorator, function (oBus, Module, ErroHandler, oModule) {
        return {
          init: function () {
            fpInitDecoratedModule();
            oModule.init();
          },
          onDestroy: function () {
            fpOnDestroyDecoratedModule();
            oModule.onDestroy();
          }
        };
      });

      Hydra.module.start(sModuleDecorator);

      fpInitBaseModule.calledOnce.should.equal(true);
      fpInitDecoratedModule.calledOnce.should.equal(true);

      Hydra.module.stop(sModuleDecorator);

      fpOnDestroyBaseModule.calledOnce.should.equal(true);
      fpOnDestroyDecoratedModule.calledOnce.should.equal(true);

      oResult.should.be.an.Object;
      oResult.should.have.property('start');
      oResult.should.have.property('stop');
      oResult.should.have.property('extend');
    });
  });

  describe('Start all modules', function () {

    it('should call the init method of the two registered modules', function () {
      var sModuleId = 'test'
        , sModuleId2 = 'test2'
        , sContainerId_1 = 'test1'
        , sContainerId_2 = 'test2'
        , fpInitStub = sinon.stub()
        , fpModuleCreator = function () {
        return {
          init: function () {
            fpInitStub();
          },
          handleAction: function () {

          },
          destroy: function () {

          }
        }
      };
      Hydra.module.register(sModuleId, fpModuleCreator);
      Hydra.module.register(sModuleId2, fpModuleCreator);

      Hydra.module.startAll();

      fpInitStub.calledTwice.should.equal(true);

      Hydra.module.remove(sModuleId);
    });

  });


  describe('Stop module/s', function () {

    it('should not call the destroy method if the module is registered but not started', function () {
      var sModuleId = 'test'
        , sContainerId = 'test'
        , oModule = null;

      Hydra.module.register(sModuleId, function () {
        return {
          init: function () {
          }
        }
      });
      oModule = Hydra.module.getModule(sModuleId, sContainerId);
      fpDestroyStub = sinon.stub(oModule.instances[sContainerId], 'destroy');

      Hydra.module.remove(sModuleId, sContainerId);

      Hydra.module.stop(sModuleId, sContainerId);

      fpDestroyStub.callCount.should.equal(0);

      Hydra.module.remove(sModuleId, sContainerId);
    });

    it('should call the destroy method one time if the module is registered and started', function () {
      var sModuleId = 'test'
        , sContainerId = 'test'
        , oModule = null;

      Hydra.module.register(sModuleId, function () {
        return {
          init: function () {
          }
        }
      });
      oModule = Hydra.module.getModule(sModuleId, sContainerId);
      fpDestroyStub = sinon.stub(oModule.instances[sContainerId], 'destroy');

      Hydra.module.stop(sModuleId, sContainerId);

      fpDestroyStub.calledOnce.should.equal(true);

      Hydra.module.remove(sModuleId, sContainerId);
    });

  });


  describe('Stop all modules', function () {

    it('should call the destroy method of the two registered modules', function () {
      var sModuleId = 'test'
        , sContainerId_1 = 'test'
        , sContainerId_2 = 'test2'
        , oModule1
        , fpDestroyStub1
        , oModule2
        , fpDestroyStub2;

      Hydra.module.register(sModuleId, function () {
        return {
          init: function () {
          }
        }
      });
      oModule1 = Hydra.module.getModule(sModuleId, sContainerId_1);
      fpDestroyStub1 = sinon.stub(oModule1.instances[sContainerId_1], 'destroy');

      oModule2 = Hydra.module.getModule(sModuleId, sContainerId_2);
      fpDestroyStub2 = sinon.stub(oModule2.instances[sContainerId_2], 'destroy');

      Hydra.module.stopAll();

      fpDestroyStub1.calledOnce.should.equal(true);
      fpDestroyStub2.calledOnce.should.equal(true);

      Hydra.module.remove(sModuleId);
    });
  });


  describe('Simple Extension of modules', function () {

    it('should not call the merge method until is started', function () {
      var sModuleId = 'test'
        , fpInitStub = sinon.stub()
        , fpDestroyStub = sinon.stub()
        , fpModuleCreator = function () {
          return {
            init: function () {

            },
            handleAction: function () {

            },
            destroy: function () {
              fpDestroyStub();
            }
          }
        }
        , fpModuleExtendedCreator = function () {
          return {
            init: function () {
              fpInitStub();
            },
            handleAction: function () {

            },
            destroy: function () {

            }
          }
        };

      Hydra.module.register(sModuleId, fpModuleCreator);
      sinon.spy(Hydra.module, "_merge");

      Hydra.module.extend(sModuleId, fpModuleExtendedCreator);

      Hydra.module._merge.callCount.should.equal(0);

      Hydra.module.remove(sModuleId);
      Hydra.module._merge.restore();
    });

    it('should call the init method of the final extended module', function () {
      var sModuleId = 'test'
        , fpInitStub = sinon.stub()
        , fpDestroyStub = sinon.stub()
        , fpModuleCreator = function () {
          return {
            init: function () {

            },
            handleAction: function () {

            },
            destroy: function () {
              fpDestroyStub();
            }
          }
        }
        , fpModuleExtendedCreator = function () {
          return {
            init: function () {
              fpInitStub();
            },
            handleAction: function () {

            },
            destroy: function () {

            }
          }
        };

      Hydra.module.register(sModuleId, fpModuleCreator);
      sinon.spy(Hydra.module, "_merge");

      Hydra.module.extend(sModuleId, fpModuleExtendedCreator);

      Hydra.module.start(sModuleId);

      fpInitStub.calledOnce.should.equal(true);
      Hydra.module._merge.callCount.should.equal(1);

      Hydra.module.remove(sModuleId);
      Hydra.module._merge.restore();
    });

    it('should call the init method of the final extended module', function () {
      var sModuleId = 'test'
        , fpInitStub = sinon.stub()
        , fpDestroyStub = sinon.stub()
        , fpModuleCreator = function () {
          return {
            init: function () {

            },
            handleAction: function () {

            },
            destroy: function () {
              fpDestroyStub();
            }
          }
        }
        , fpModuleExtendedCreator = function () {
          return {
            init: function () {
              fpInitStub();
            },
            handleAction: function () {

            },
            destroy: function () {

            }
          }
        };

      Hydra.module.register(sModuleId, fpModuleCreator);
      sinon.spy(Hydra.module, "_merge");

      Hydra.module.extend(sModuleId, fpModuleExtendedCreator);

      Hydra.module.start(sModuleId);

      fpDestroyStub.callCount.should.equal(0);

      Hydra.module.remove(sModuleId);
      Hydra.module._merge.restore();
    });

  });


  describe('Complex extend', function () {

    it('should', function () {
      var sModuleId = 'test'
        , sExtendedModuleId = 'test2'
        , fpInitStub = sinon.stub()
        , fpDestroyStub = sinon.stub()
        , fpModuleCreator = function () {
          return {
            init: function () {

            },
            handleAction: function () {

            },
            destroy: function () {
              fpDestroyStub();
            }
          }
        }
        , fpModuleExtendedCreator = function () {
          return {
            init: function () {
              fpInitStub();
            },
            handleAction: function () {

            },
            destroy: function () {

            }
          }
        };

      Hydra.module.register(sModuleId, fpModuleCreator);
      sinon.spy(Hydra.module, "_merge");

      Hydra.module.extend(sModuleId, sExtendedModuleId, fpModuleExtendedCreator);

      Hydra.module._merge.callCount.should.equal(0);

      Hydra.module.remove(sModuleId);
      Hydra.module.remove(sExtendedModuleId);
      Hydra.module._merge.restore();
    });

    it('should call the init method of the final extended module', function () {
      var sModuleId = 'test'
        , sExtendedModuleId = 'test2'
        , fpInitStub = sinon.stub()
        , fpDestroyStub = sinon.stub()
        , fpModuleCreator = function () {
          return {
            init: function () {

            },
            handleAction: function () {

            },
            destroy: function () {
              fpDestroyStub();
            }
          }
        }
        , fpModuleExtendedCreator = function () {
          return {
            init: function () {
              fpInitStub();
            },
            handleAction: function () {

            },
            destroy: function () {

            }
          }
        };

      Hydra.module.register(sModuleId, fpModuleCreator);
      sinon.spy(Hydra.module, "_merge");

      Hydra.module.extend(sModuleId, sExtendedModuleId, fpModuleExtendedCreator);

      Hydra.module.start(sExtendedModuleId);

      fpInitStub.calledOnce.should.equal(true);
      Hydra.module._merge.callCount.should.equal(1);

      Hydra.module.remove(sModuleId);
      Hydra.module.remove(sExtendedModuleId);
      Hydra.module._merge.restore();
    });

    it('should call the destroy method of the final extended module', function () {
      var sModuleId = 'test'
        , sExtendedModuleId = 'test2'
        , fpInitStub = sinon.stub()
        , fpDestroyStub = sinon.stub()
        , fpModuleCreator = function () {
          return {
            init: function () {

            },
            handleAction: function () {

            },
            destroy: function () {
              fpDestroyStub();
            }
          }
        }
        , fpModuleExtendedCreator = function () {
          return {
            init: function () {
              fpInitStub();
            },
            handleAction: function () {

            },
            destroy: function () {

            }
          }
        };

      Hydra.module.register(sModuleId, fpModuleCreator);
      sinon.spy(Hydra.module, "_merge");

      Hydra.module.extend(sModuleId, sExtendedModuleId, fpModuleExtendedCreator);

      Hydra.module.start(sExtendedModuleId);

      fpDestroyStub.callCount.should.equal(0);

      Hydra.module.remove(sModuleId);
      Hydra.module.remove(sExtendedModuleId);
      Hydra.module._merge.restore();
    });

  });


  describe('Set global vars', function () {

    it('should check that setVars method exist in Module', function () {
      var oVars = null
        , oCallbacks = {
          fpInit: function (oData) {
            oVars = oData;
          }
        }
        , fpInit = function (oData) {
          oVars = oData;
        };

      Hydra.module.register("test-module", function () {
        return {
          init: oCallbacks.fpInit,
          destroy: function () {

          }
        };
      });
      sinon.spy(oCallbacks, 'fpInit');

      Hydra.module.setVars.should.be.a.Function;

      oCallbacks.fpInit.restore();
      oVars = null;
      fpInit = null;
    });

    it('should check that all the vars set in setVars are passed as an object when the module is started', function () {
      var oVars = null
        , oCallbacks = {
          fpInit: function (oData) {
            oVars = oData;
          }
        }
        , fpInit = function (oData) {
          oVars = oData;
        };

      Hydra.module.register("test-module", function () {
        return {
          init: oCallbacks.fpInit,
          destroy: function () {

          }
        };
      });
      sinon.spy(oCallbacks, 'fpInit');

      oVars1 = {
        'test': 'test',
        'test1': 'test1'
      };
      Hydra.module.setVars(oVars1);

      Hydra.module.start('test-module');

      oVars1.test.should.equal("test");
      oVars1.test1.should.equal("test1");

      oCallbacks.fpInit.restore();
      oVars = null;
      fpInit = null;
    });

    it('should check that if we pass a param when starting the module will move the object of vars to the last position in arguments', function () {
      var oVars = null
        , oCallbacks = {
          fpInit: function (oData) {
            oVars = oData;
          }
        }
        , fpInit = function (oData) {
          oVars = oData;
        }
        , oVars1 = {
          'test': 'test',
          'test1': 'test1'
        }
        , oData = {
          data: 2
        }
        , oCall;

      Hydra.module.register("test-module", function () {
        return {
          init: oCallbacks.fpInit,
          destroy: function () {

          }
        };
      });
      sinon.spy(oCallbacks, 'fpInit');


      Hydra.module.setVars(oVars1);

      Hydra.module.start('test-module', 'instance_id', oData);

      oCall = oCallbacks.fpInit.getCall(0);

      oCall.args[0].should.equal(oData);
      oCall.args[1].test.should.equal(oVars1.test);
      oCall.args[1].test1.should.equal(oVars1.test1);

      oCallbacks.fpInit.restore();
      oVars = null;
      fpInit = null;
    });

  });


  describe('Get global vars', function () {

    it('should check that getVars method exist in Module', function () {
      var oVars = {
        'test': 'test',
        'test1': 'test1'
      };

      Hydra.module.setVars(oVars);

      Hydra.module.getVars.should.be.a.Function;

      oVars = null;
    });

    it('should check that getVars return a copy of all the vars set using setVars', function () {
      var oVars = {
        'test': 'test',
        'test1': 'test1'
      };

      Hydra.module.setVars(oVars);

      oVars1 = Hydra.module.getVars();

      oVars1.test.should.equal(oVars.test);
      oVars1.test1.should.equal(oVars.test1);

      oVars = null;
    });

  });


  describe('Global Extend for compatibility with require', function () {

    it('should check that extend method exist', function () {
      Hydra.extend.should.be.a.Function;
    });

    it('should check that extend method must receive two params', function () {
      Hydra.extend.length.should.equal(2);
    });

    it('should check when executing extend method the new object will be part of Hydra', function () {
      var oTest = {
        test: sinon.stub()
      };

      Hydra.extend("test", oTest);

      Hydra.test.should.eql(oTest);
    });

  });


  describe('Avoid conflict with third party namespaces', function () {

    it('should check that noConflict method exist ', function () {
      Hydra.noConflict.should.be.a.Function;
    });

    it('should check that noConflict method must receive three params ', function () {
      Hydra.noConflict.length.should.equal(3);
    });

    it('should check when executing noConflict a part of Hydra will be callable with other name and in other context ', function () {
      var bDone;

      bDone = Hydra.noConflict('module', global, 'Core');

      bDone.should.equal(true);
      Hydra.module.should.eql(Core);
      Hydra.module.register.should.eql(Core.register);
    });

  });


  describe('Bus Constructor', function () {

    it('should check that Hydra.bus is not undefined', function () {
      Hydra.bus.reset();

      should.exist(Hydra.bus);
    });

    it('should check that Hydra.bus has method subscribers', function () {
      Hydra.bus.reset();

      Hydra.bus.subscribers.should.be.a.Function;
    });

    it('should check that Hydra.bus has method subscribe', function () {
      Hydra.bus.reset();

      Hydra.bus.subscribe.should.be.a.Function;
    });

    it('should check that Hydra.bus has method unsubscribe', function () {
      Hydra.bus.reset();

      Hydra.bus.unsubscribe.should.be.a.Function;
    });

    it('should check that Hydra.bus has method publish', function () {
      Hydra.bus.reset();

      Hydra.bus.publish.should.be.a.Function;
    });

  });


  describe('Subscribe to an event', function () {

    it('should check that subscribeTo adds a subscriber', function () {
      var oSubscriber = {};

      Hydra.bus.reset();

      Hydra.bus.subscribers('channel', 'item:action').length.should.equal(0);

      Hydra.bus.subscribeTo('channel', 'item:action', sinon.stub(), oSubscriber);

      Hydra.bus.subscribers('channel', 'item:action').length.should.equal(1);

      Hydra.bus.reset();
    });

  });


  describe('Unscribe from an event', function () {

    it('should', function () {
      var oSubscriber = {};

      Hydra.bus.reset();

      Hydra.bus.subscribeTo('channel', 'item:action', sinon.stub(), oSubscriber);

      Hydra.bus.subscribers('channel', 'item:action').length.should.equal(1);

      Hydra.bus.unsubscribeFrom('channel', 'item:action', oSubscriber);

      Hydra.bus.subscribers('channel', 'item:action').length.should.equal(0);

      oSubscriber = null;
      Hydra.bus.reset();
    });

  });


  describe('Get Subscribers', function () {

    it('should check that must return an empty array if there are no channel', function () {
      var oSubscriber = {
          events: {
            channel: {
              'item:actionChannel': function () {

              }
            }
          }
        }
        , oResult = null;

      Hydra.bus.reset();

      oResult = Hydra.bus.subscribers('channel', 'item:actionChannel');

      oResult.should.be.instanceOf(Array);
      oResult.length.should.equal(0);

      oSubscriber = null;
    });

    it('should check that must return an array with an element if a subscriber is registered', function () {
      Hydra.bus.reset();
      var oSubscriber = {
          events: {
            channel: {
              'item:actionChannel': function () {

              }
            }
          }
        }
        , oResult = null;

      Hydra.bus.subscribe(oSubscriber);

      oResult = Hydra.bus.subscribers('channel', 'item:actionChannel');

      oResult.should.be.instanceOf(Array);
      oResult.length.should.equal(1);

      Hydra.bus.unsubscribe('channel', this.oSubscriber);

      oSubscriber = null;
    });

  });


  describe('Subscribe to one channel', function () {

    it('should check that no subscriber must be added if Subscriber does not have events and must return false', function () {
      var oSubscriber = {
          events: {
            global: {
              'item:actionGlobal': function () {

              }
            },
            channel: {
              'item:actionChannel': function () {

              }
            }
          }
        }
        , oBadSubscriber = {}
        , bResult = true;

      Hydra.bus.reset();

      bResult = Hydra.bus.subscribe(oBadSubscriber);

      bResult.should.equal(false);
      Hydra.bus.subscribers('channel', 'item:actionChannel').length.should.equal(0);

      Hydra.bus.unsubscribe(oBadSubscriber);

      oSubscriber = null;
      oBadSubscriber = null;
    });

    it('should check that one subscriber has been added to channel and other to global if Suscriber has events', function () {
      var oSubscriber = {
          events: {
            global: {
              'item:actionGlobal': function () {

              }
            },
            channel: {
              'item:actionChannel': function () {

              }
            }
          }
        }
        , oBadSubscriber = {}
        , aChannelSubscribers = null
        , aGlobalSubscribers = null
        , bResult = false;

      Hydra.bus.reset();


      bResult = Hydra.bus.subscribe(oSubscriber);

      aChannelSubscribers = Hydra.bus.subscribers('channel', 'item:actionChannel');
      aGlobalSubscribers = Hydra.bus.subscribers('global', 'item:actionGlobal');

      bResult.should.equal(true);
      aChannelSubscribers.length.should.equal(1);
      aGlobalSubscribers.length.should.equal(1);
      aChannelSubscribers[0].subscriber.should.eql(oSubscriber);
      aGlobalSubscribers[0].subscriber.should.eql(oSubscriber);
      aChannelSubscribers[0].handler.should.eql(oSubscriber.events.channel['item:actionChannel']);
      aGlobalSubscribers[0].handler.should.eql(oSubscriber.events.global['item:actionGlobal']);

      Hydra.bus.unsubscribe(oSubscriber);

      oSubscriber = null;
      oBadSubscriber = null;
    });

  });


  describe('Unsubscribe from one channel', function () {

    it('should check that must return false if Subscriber does not have events', function () {
      var oSubscriber = {
          events: {
            global: {
              'item:actionGlobal': function () {

              }
            },
            channel: {
              'item:actionChannel': function () {

              }
            }
          }
        }
        , oBadSubscriber = {}
        , bResult = true;

      Hydra.bus.reset();

      bResult = Hydra.bus.unsubscribe(oBadSubscriber);

      bResult.should.equal(false);

      oSubscriber = null;
      oBadSubscriber = null;
    });

    it('should check that must return false if Subscriber has events but has not been subscribed', function () {
      var oSubscriber = {
          events: {
            global: {
              'item:actionGlobal': function () {

              }
            },
            channel: {
              'item:actionChannel': function () {

              }
            }
          }
        }
        , oBadSubscriber = {}
        , bResult = true;

      Hydra.bus.reset();

      bResult = Hydra.bus.unsubscribe(oSubscriber);

      bResult.should.equal(false);

      oSubscriber = null;
      oBadSubscriber = null;
    });

    it('should check that must return true if Subscriber has events but has been subscribed', function () {
      var oSubscriber = {
          events: {
            global: {
              'item:actionGlobal': function () {

              }
            },
            channel: {
              'item:actionChannel': function () {

              }
            }
          }
        }
        , oBadSubscriber = {}
        , bResult = false;

      Hydra.bus.reset();

      Hydra.bus.subscribe(oSubscriber);

      bResult = Hydra.bus.unsubscribe(oSubscriber);

      bResult.should.equal(true);

      oSubscriber = null;
      oBadSubscriber = null;
    });

    it('should check that subscribers of global must have subscriber if unsubscribe is launched', function () {
      var oSubscriber = {
          events: {
            global: {
              'item:actionGlobal': function () {

              }
            },
            channel: {
              'item:actionChannel': function () {

              }
            }
          }
        }
        , oBadSubscriber = {}
        , bResult = false
        , aSubscribers;

      Hydra.bus.reset();

      Hydra.bus.subscribe(oSubscriber);

      bResult = Hydra.bus.unsubscribe(oSubscriber);
      aSubscribers = Hydra.bus.subscribers('global', 'test');

      bResult.should.equal(true);
      aSubscribers.length.should.equal(0);

      oSubscriber = null;
      oBadSubscriber = null;
    });

  });


  describe('Publish events in channel', function () {

    it('should check that must return false if there are no subscribers to the event in channel', function () {
      var clock = sinon.useFakeTimers()
        , oSubscriber = {
          events: {
            channel: {
              'item:action': sinon.stub()
            }
          }
        }
        , oBadSubscriber = {}
        , bResult = true,
        oData = {};

      Hydra.bus.reset();

      bResult = Hydra.bus.publish('channel', 'item:action', oData);
      clock.tick(30);

      bResult.should.equal(false);
      oSubscriber.events.channel['item:action'].callCount.should.equal(0);

      clock.restore();
      oSubscriber = null;
      oBadSubscriber = null;
    });

    it('should check that must return true if there are any subscriber to the event in channel', function () {
      var clock = sinon.useFakeTimers()
        , oSubscriber = {
          events: {
            channel: {
              'item:action': sinon.stub()
            }
          }
        }
        , oBadSubscriber = {}
        , Result = false,
        oData = {};

      Hydra.bus.reset();

      Hydra.bus.subscribe(oSubscriber);

      bResult = Hydra.bus.publish('channel', 'item:action', oData);
      clock.tick(30);

      bResult.should.equal(true);
      oSubscriber.events.channel['item:action'].callCount.should.equal(1);

      clock.restore();
      oSubscriber = null;
      oBadSubscriber = null;
    });

  });

  describe('Check that addExtensionBeforeInit works', function () {

    it('should check that Hydra.module.oModifyInit is an empty object', function () {
      getLengthObject(Hydra.module.oModifyInit).should.equal(0);
    });

    it('should check that after using addExtensionBeforeInitTest it saves the object', function () {
      var stub = sinon.stub();

      Hydra.addExtensionBeforeInit({ test: stub});
      getLengthObject(Hydra.module.oModifyInit).should.equal(1);

      Hydra.module.oModifyInit.test.should.equal(stub);
    });
  });

  describe('Check that getCopyModules works', function () {
    beforeEach(function () {
      var oModules = Hydra.getCopyModules(),
        sKey;

      for (sKey in oModules) {
        if (oModules.hasOwnProperty(sKey)) {
          Hydra.module.remove(sKey);
        }
      }
    });

    it('should check that before doing anything it will return an empty object', function () {
      var oModules = Hydra.getCopyModules();

      Object.keys(oModules).length.should.equal(0);
    });

    it('should check that if we set oModules to a different object it will continue returning the same copy of oModules', function () {
      var oModules;

      oModules = Hydra.getCopyModules();
      oModules = {};

      Object.keys(Hydra.getCopyModules()).length.should.equal(0);
    });

    it('should check that after registering one Module it will return one', function () {
      var oModules;

      Hydra.module.register('test', function () {
        return {};
      });
      oModules = Hydra.getCopyModules();

      Object.keys(oModules).length.should.equal(1);
    });

  });

  describe('Check that getCopyChannels works', function () {
    beforeEach(function () {
      Hydra.bus.reset();
    });

    it('should check that before doing anything it will return zero', function () {
      var oChannels = Hydra.getCopyChannels();

      Object.keys(oChannels.global).length.should.equal(0);
    });

    it('should check that before doing anything it will return one for the channels length', function () {
      var oChannels;

      oChannels = Hydra.getCopyChannels();

      Object.keys(oChannels).length.should.equal(1);
    });

    it('should check that if we set oChannels to a different object it will continue returning the same copy of oChannels', function () {
      var oChannels;

      oChannels = Hydra.getCopyChannels();
      oChannels = {};

      Object.keys(Hydra.getCopyChannels()).length.should.equal(1);
    });

    it('should check that after registering one Module it will return one', function () {
      var oChannels;

      Hydra.module.register('test', function () {
        return {
          events: {
            global: {
              'test': function () {
              }
            }
          }
        };
      });
      Hydra.module.start('test');
      oChannels = Hydra.getCopyChannels();

      Object.keys(oChannels.global).length.should.equal(1);
    });

    it('should check that after registering one Module in a different channel from global it will return two for the channels length and one for the event in other_channel', function () {
      var oChannels;

      Hydra.module.register('test', function () {
        return {
          events: {
            other_channel: {
              'test': function () {
              }
            }
          }
        };
      });
      Hydra.module.start('test');
      oChannels = Hydra.getCopyChannels();

      Object.keys(oChannels).length.should.equal(2);
      Object.keys(oChannels.other_channel).length.should.equal(1);
    });
  });

  describe('Check that you can access Hydra api', function () {
    beforeEach(function () {
      Hydra.bus.reset();
    });

    it('should check that you can access Hydra.module', function () {
      var oStub = sinon.stub();
      Hydra.module.register('test', function (bus, module, errorhandler) {
        return {
          init: function () {
            module.start('test2');
          }
        };
      });

      Hydra.module.register('test2', function (bus, module, errorhandler) {
        return {
          init: oStub
        };
      });

      Hydra.module.start('test');

      oStub.calledOnce.should.equal(true);
    });

    it('should check that you can access Hydra.bus', function () {
      var oStub = sinon.stub();

      Hydra.module.register('test', function (bus, module, errorhandler) {
        return {
          events: {
            'channel': {
              'item:action': oStub
            }
          },
          init: function () {
            module.start('test2');
          }
        };
      });

      Hydra.module.register('test2', function (bus, module, errorhandler) {
        return {
          init: function () {
            bus.publish('channel', 'item:action');
          }
        };
      });

      Hydra.module.start('test');

      oStub.calledOnce.should.equal(true);
    });

    it('should check that you can access Hydra.errorhandler', function () {
      var oStub = sinon.stub();

      Hydra.setErrorHandler({
        log: oStub,
        error: function () {
          console.log.apply(console, arguments);
        }
      });
      Hydra.module.register('test', function (bus, module, errorhandler) {
        return {
          init: function () {
            module.start('test2');
          }
        };
      });

      Hydra.module.register('test2', function (bus, module, errorhandler) {
        return {
          init: function () {
            errorhandler.log('Hei');
          }
        };
      });

      Hydra.module.start('test');

      oStub.calledOnce.should.equal(true);
    });
  });
});
