(function(win, doc, Hydra){
	'use strict';
	var oBody = doc.body;
	function setup(oTest)
	{
		oBody.innerHTML = '';
		Hydra.errorHandler().list = null;
		oTest.nChilds = oBody.childNodes.length;
		oTest.nDivs = oBody.getElementsByTagName( "div" ).length;
		oTest.nLists = oBody.getElementsByTagName( "ul" ).length;
	}
	function teardown(oTest)
	{
		delete oTest.nChilds;
		delete oTest.nDivs;
		delete oTest.nLists;
	}

	TestCase( "HydraErrorHandlerCreateDomTest", sinon.testCase( {
		setUp: function()
		{
			setup(this);
		},
		tearDown: function()
		{
			teardown(this);
		},
		"test should return null for list before create_dom": function () {
			assertNull( Hydra.errorHandler().list );
		},
		"test should return one list after create_dom": function () {
			Hydra.errorHandler()._create_dom();

			assertTagName( "UL", Hydra.errorHandler().list );
		},
		"test should add one layer and one list in the dom": function () {
			Hydra.errorHandler()._create_dom();

			assertTrue( oBody.childNodes.length > this.nChilds );
			assertTrue( oBody.getElementsByTagName( "div" ).length > this.nDivs );
			assertTrue( oBody.getElementsByTagName( "ul" ).length > this.nLists );
		},
		"test should return fixed for the position of the created layer": function () {
			var aDivs, oDiv;

			Hydra.errorHandler()._create_dom();
			aDivs = oBody.getElementsByTagName( "div" );
			oDiv = aDivs[aDivs.length - 1];

			assertEquals( "fixed", oDiv.style.position );
		},
		"test should return 0px for the bottom of the created layer": function () {
			var aDivs, oDiv;

			Hydra.errorHandler()._create_dom();
			aDivs = oBody.getElementsByTagName( "div" );
			oDiv = aDivs[aDivs.length - 1];

			assertEquals( "0px", oDiv.style.bottom );
		},
		"test should return 100px for the height of the created layer": function () {
			var aDivs, oDiv;

			Hydra.errorHandler()._create_dom();
			aDivs = oBody.getElementsByTagName( "div" );
			oDiv = aDivs[aDivs.length - 1];

			assertEquals( "100px", oDiv.style.height );
		},
		"test should return 100% for the width of the created layer": function () {
			var aDivs, oDiv;

			Hydra.errorHandler()._create_dom();
			aDivs = oBody.getElementsByTagName( "div" );
			oDiv = aDivs[aDivs.length - 1];

			assertEquals( "100%", oDiv.style.width );
		}
	} ) );

	TestCase( "HydraErrorHandlerAddItemTest", sinon.testCase( {
		setUp: function () {
			setup(this);
			Hydra.errorHandler()._create_dom();
		},
		tearDown: function()
		{
			teardown(this);
		},
		"test should return 0 for li items in the list if addItem is not called": function () {
			var oList = Hydra.errorHandler().list,
				aLiItems;

			aLiItems = oList.getElementsByTagName( "li" );

			assertEquals( 0, aLiItems.length );
		},
		"test should return 1 for li items in the list if addItem is called one time": function () {
			var oList = Hydra.errorHandler().list,
				aLiItems,
				sModuleId = 'test1module',
				sMethod = 'testmethod',
				erError = {
					message: 'testmessage'
				};

			Hydra.errorHandler().addItem( sModuleId, sMethod, erError );

			aLiItems = oList.getElementsByTagName( "li" );

			assertEquals( 1, aLiItems.length );
		},
		"test should return 2 for li items in the list if addItem is called two times": function () {
			var oList = Hydra.errorHandler().list,
				aLiItems,
				sModuleId = 'test1module',
				sMethod = 'testmethod',
				erError = {
					message: 'testmessage'
				};

			Hydra.errorHandler().addItem( sModuleId, sMethod, erError );
			Hydra.errorHandler().addItem( sModuleId, sMethod, erError );

			aLiItems = oList.getElementsByTagName( "li" );

			assertEquals( 2, aLiItems.length );
		}
	} ) );
}(window, document, Hydra));