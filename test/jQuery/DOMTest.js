(function ( win, doc, Hydra ) {
	'use strict';
	TestCase( "HydraDOMByIdTest", sinon.testCase( {
		setUp: function () {},
		tearDown: function () {},
		'test should check that byId with bBasicNode set as true returns a DOM element': function () {
			/*:DOC+= <div id='test'></div>*/
			var oElement = doc.getElementById( "test" ),
				oNewElement = Hydra.dom.byId( 'test', doc, true );

			assertSame( oElement, oNewElement );
		},
		'test should check that byId with bBasicNode set as false return a jQuery element': function () {
			/*:DOC+= <div id='test'></div>*/
			var oElement = doc.getElementById( "test" ),
				$Element = Hydra.dom.byId( 'test', doc );

			assertEquals(1, $Element.length);
			assertEquals( oElement, $Element.get( 0 ) );
		}
	} ) );

	TestCase( "HydraDOMByClassNameTest", sinon.testCase( {
		setUp: function ()
		{
			/*:DOC+= <div id='orzo'>
			 <span class="test" id='test1'>Test</span>
			 <span class="test" id='test2'>Test 2</span>
			 <span class="test" id='test3'>Test 3</span>
			 <span class="test" id='test4'>Test 4</span>
			 <span class="test" id='test5'>Test 5</span>
			 </div>*/
			this.aElements = [];
			this.aElements.push(document.getElementById("test1"));
			this.aElements.push(document.getElementById("test2"));
			this.aElements.push(document.getElementById("test3"));
			this.aElements.push(document.getElementById("test4"));
			this.aElements.push(document.getElementById("test5"));
			this.$elements = jQuery(".test");
			this.nElements = 5;
		},
		tearDown: function () {},
		'test should check that byClassName with bBasicNode set as true returns a simple Array': function () {
			var aElements;

			aElements = Hydra.dom.byClassName( 'test', doc, true );

			assertArray(aElements);
			assertEquals( this.nElements, aElements.length );
			assertEquals( this.aElements, aElements);
		},
		'test should check that byClassName with bBasicNode set as false returns a jQuery element': function () {
			var $Elements;

			$Elements = Hydra.dom.byClassName( 'test', doc, false );

			assertEquals( this.nElements, $Elements.length );
			assertSame( this.$elements.get(0), $Elements.get(0));
			assertSame( this.$elements.get(1), $Elements.get(1));
			assertSame( this.$elements.get(2), $Elements.get(2));
			assertSame( this.$elements.get(3), $Elements.get(3));
			assertSame( this.$elements.get(4), $Elements.get(4));
		}
	} ) );

	TestCase( "HydraDOMByTagNameTest", sinon.testCase( {
		setUp: function ()
		{
			/*:DOC+= <div id='orzo'>
			 <span class="test" id='test1'>Test</span>
			 <span class="test" id='test2'>Test 2</span>
			 <span class="test" id='test3'>Test 3</span>
			 <span class="test" id='test4'>Test 4</span>
			 <span class="test" id='test5'>Test 5</span>
			 </div>*/
			this.aElements = [];
			this.aElements.push(document.getElementById("test1"));
			this.aElements.push(document.getElementById("test2"));
			this.aElements.push(document.getElementById("test3"));
			this.aElements.push(document.getElementById("test4"));
			this.aElements.push(document.getElementById("test5"));
			this.$elements = jQuery("span");
			this.nElements = 5;
		},
		tearDown: function () {},
		'test should check that byTagName with bBasicNode set as true returns a simple Array': function () {
			var aElements;

			aElements = Hydra.dom.byTagName( 'span', doc, true );

			assertArray(aElements);
			assertEquals( this.nElements, aElements.length );
			assertEquals( this.aElements, aElements);
		},
		'test should check that byTagName with bBasicNode set as false returns a jQuery element': function () {
			var $Elements;

			$Elements = Hydra.dom.byTagName( 'span', doc, false );

			assertEquals( this.nElements, $Elements.length );
			assertSame( this.$elements.get(0), $Elements.get(0));
			assertSame( this.$elements.get(1), $Elements.get(1));
			assertSame( this.$elements.get(2), $Elements.get(2));
			assertSame( this.$elements.get(3), $Elements.get(3));
			assertSame( this.$elements.get(4), $Elements.get(4));
		}
	} ) );

	TestCase( "HydraDOMByCssSelectorTest", sinon.testCase( {
		setUp: function ()
		{
			/*:DOC+= <div id='orzo'>
			 <span class="test" id='test1'>Test</span>
			 <span class="test" id='test2'>Test 2</span>
			 <span class="test" id='test3'>Test 3</span>
			 <span class="test" id='test4'>Test 4</span>
			 <span class="test" id='test5'>Test 5</span>
			 </div>*/
			this.aElements = [];
			this.aElements.push(document.getElementById("test1"));
			this.aElements.push(document.getElementById("test2"));
			this.aElements.push(document.getElementById("test3"));
			this.aElements.push(document.getElementById("test4"));
			this.aElements.push(document.getElementById("test5"));
			this.$elements = jQuery("span");
			this.nElements = 5;
		},
		tearDown: function () {},
		'test should check that byCssSelector with bBasicNode set as true returns a simple Array': function () {
			var aElements;

			aElements = Hydra.dom.byCssSelector( '#orzo > span', doc, true );

			assertArray(aElements);
			assertEquals( this.nElements, aElements.length );
			assertEquals( this.aElements, aElements);
		},
		'test should check that byCssSelector with bBasicNode set as false returns a jQuery element': function () {
			var $Elements;

			$Elements = Hydra.dom.byCssSelector( '#orzo > span', doc, false );

			assertEquals( this.nElements, $Elements.length );
			assertSame( this.$elements.get(0), $Elements.get(0));
			assertSame( this.$elements.get(1), $Elements.get(1));
			assertSame( this.$elements.get(2), $Elements.get(2));
			assertSame( this.$elements.get(3), $Elements.get(3));
			assertSame( this.$elements.get(4), $Elements.get(4));
		}
	} ) );
}( window, document, Hydra ));