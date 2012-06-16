(function ( global, ns, _undefined_ ) {
	'use strict';
	var doc = global.document, nav = navigator, BrowserDetection;

	if ( ns === _undefined_ ) {
		ns = global;
	}

	BrowserDetection = function () {};
	BrowserDetection.browser = '';
	BrowserDetection.version = -1;
	BrowserDetection.browsersSet = [
		{
			string: function () {
				return nav.userAgent;
			},
			subString: "Chrome",
			identity: "Chrome"
		},
		{
			string: function () {
				return nav.userAgent;
			},
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: function () {
				return nav.vendor;
			},
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			string: function () { return '';},
			prop: function () {
				return global.opera;
			},
			identity: "Opera"
		},
		{
			string: function () {
				return nav.vendor;
			},
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: function () {
				return nav.vendor;
			},
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: function () {
				return nav.userAgent;
			},
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: function () {
				return nav.vendor;
			},
			subString: "Camino",
			identity: "Camino"
		},
		{    // for newer Netscape (6+)
			string: function () {
				return nav.userAgent;
			},
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: function () {
				return nav.userAgent;
			},
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: function () {
				return nav.userAgent;
			},
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{
			// for older Netscape (4-)
			string: function () {
				return nav.userAgent;
			},
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	];
	BrowserDetection.init = function ( aBrowsersSet, sDataString ) {
		var oBrowserDetection = new BrowserDetection();
		oBrowserDetection.setBrowser( aBrowsersSet || BrowserDetection.browsersSet );
		oBrowserDetection.setVersion( sDataString );
	};
	BrowserDetection.isIE5 = function () {
		return BrowserDetection.isIE() && BrowserDetection.version === 5;
	};
	BrowserDetection.isIE6 = function () {
		return BrowserDetection.isIE() && BrowserDetection.version === 6;
	};
	BrowserDetection.isIE = function () {
		return BrowserDetection.browser === 'Explorer';
	};
	BrowserDetection.isSafari = function () {
		if ( BrowserDetection.browser === 'Safari' ) {
			BrowserDetection.isSafari = function () {return true;};
			return true;
		}
		BrowserDetection.isSafari = function () {return false;};
		return false;
	};
	BrowserDetection.isIEorOpera = function () {
		return BrowserDetection.isIE() || BrowserDetection.browser === 'Opera';
	};
	BrowserDetection.prototype.setBrowser = function ( a_Data, sUAString, bOperaProp ) {
		BrowserDetection.browser = (function () {
			var aData = a_Data || BrowserDetection.browsersSet,
				sString = '',
				oProp = null,
				nData,
				nLenData = aData.length;

			for ( nData = 0; nData < nLenData; nData += 1 ) {
				sString = bOperaProp ? '' : (sUAString || aData[nData].string());

				if ( typeof aData[nData].prop === "function" ) {
					oProp = aData[nData].prop();
				}

				BrowserDetection.version = aData[nData].versionSearch || aData[nData].identity;

				if ( sString ) {
					if ( sString.indexOf( aData[nData].subString ) !== -1 ) {
						return aData[nData].identity;
					}
				}
				else if ( oProp ) {
					return aData[nData].identity;
				}
			}
			aData = null;
		}());
		return true;
	};
	BrowserDetection.prototype.setVersion = function ( sDataString ) {
		var aLookForVersion = [nav.userAgent, nav.appVersion],
			sVersion = 'Unknown',
			nLook,
			nLenLook = aLookForVersion.length,
			_getVersion = function ( sDataString ) {
				var nIndex = sDataString.indexOf( BrowserDetection.version );
				if ( nIndex === -1 ) {
					return false;
				}
				return parseFloat( sDataString.substring( nIndex + BrowserDetection.version.length + 1 ) );
			};

		if ( typeof sDataString !== "undefined" ) {
			BrowserDetection.version = _getVersion( sDataString );
			return true;
		}

		for ( nLook = 0; nLook < nLenLook; nLook += 1 ) {
			sVersion = _getVersion( aLookForVersion[nLook] );
			if ( sVersion !== '' ) {
				BrowserDetection.version = sVersion;
				return true;
			}
		}

		BrowserDetection.version = 'Unknown';
		return true;
	};

	ns.BrowserDetection = BrowserDetection;
}( this, Namespace ));