/**
 * BrowserDetection is the class to detect browsers
 * @class Namespace.BrowserDetection
 * @constructor
 * @version 1.0
 * @author Tomas Corral Casas
 */
Namespace.BrowserDetection = function(){};
/**
 * BrowserDetection.browser variable definition
 * @member Namespace.BrowserDetection
 * @version 1.0
 * @author Tomas Corral Casas
 * @type String
 */
Namespace.BrowserDetection.browser = '';
/**
 * BrowserDetection.version variable definition
 * @member Namespace.BrowserDetection
 * @version 1.0
 * @author Tomas Corral Casas
 * @type Number
 */
Namespace.BrowserDetection.version = -1;
/**
 * BrowserDetection.browsersSet config for all the different browsers to be checked in BrowserDetection
 * @member Namespace.BrowserDetection
 * @version 1.0
 * @author Tomas Corral Casas
 * @type Number
 */
Namespace.BrowserDetection.browsersSet = [
	{
		string: function()
		{
		return navigator.userAgent;
		},
		subString: "Chrome",
		identity: "Chrome"
	},
	{
		string: function()
		{
			return navigator.userAgent;
		},
		subString: "OmniWeb",
		versionSearch: "OmniWeb/",
		identity: "OmniWeb"
	},
	{
		string: function()
		{
			return navigator.vendor;
		},
		subString: "Apple",
		identity: "Safari",
		versionSearch: "Version"
	},
	{
		string: function(){ return '';},
		prop: function()
		{
			return window.opera;
		},
		identity: "Opera"
	},
	{
		string: function()
		{
			return navigator.vendor;
		},
		subString: "iCab",
		identity: "iCab"
	},
	{
		string: function()
		{
			return navigator.vendor;
		},
		subString: "KDE",
		identity: "Konqueror"
	},
	{
		string: function()
		{
			return navigator.userAgent;
		},
		subString: "Firefox",
		identity: "Firefox"
	},
	{
		string: function()
		{
			return navigator.vendor;
		},
		subString: "Camino",
		identity: "Camino"
	},
	{	// for newer Netscape (6+)
		string: function()
		{
			return navigator.userAgent;
		},
		subString: "Netscape",
		identity: "Netscape"
	},
	{
		string: function()
		{
			return navigator.userAgent;
		},
		subString: "MSIE",
		identity: "Explorer",
		versionSearch: "MSIE"
	},
	{
		string: function()
		{
			return navigator.userAgent;
		},
		subString: "Gecko",
		identity: "Mozilla",
		versionSearch: "rv"
	},
	{
		// for older Netscape (4-)
		string: function()
		{
			return navigator.userAgent;
		},
		subString: "Mozilla",
		identity: "Netscape",
		versionSearch: "Mozilla"
	}
];

/**
 * BrowserDetection.setBrowser sets the browser that owns the user
 * this method sets the static variable BrowserDetection.browser with a numeric value
 * @member Namespace.BrowserDetection.prototype
 * @version 1.0
 * @author Tomas Corral Casas
 * @return the identity of the browser
 * @type String
 */
Namespace.BrowserDetection.prototype.setBrowser = function(a_Data, sUAString, bOperaProp)
{
	Namespace.BrowserDetection.browser = (function()
	{
		var aData = a_Data || Namespace.BrowserDetection.browsersSet;
		var sString = '';
		var oProp = null;
		var nData = 0;
		var nLenData = aData.length;
		for (; nData < nLenData; nData++)
		{
			sString = bOperaProp ? '': (sUAString || aData[nData].string());

			if(typeof aData[nData].prop === "function")
			{
				oProp = aData[nData].prop();
			}

			Namespace.BrowserDetection.version = aData[nData].versionSearch || aData[nData].identity;

			if (sString)
			{
				if (sString.indexOf(aData[nData].subString) !== -1)
				{
					return aData[nData].identity;
				}
			}
			else if (oProp)
			{
				return aData[nData].identity;
			}
		}
		aData = null;
	}());
    return true;
};
/**
 * BrowserDetection.setVersion sets the version of the browser that owns the user
 * this method sets the static variable BrowserDetection.version with a numeric value
 * @member Namespace.BrowserDetection.prototype
 * @version 1.0
 * @author Tomas Corral Casas
 * @return undefined
 */
Namespace.BrowserDetection.prototype.setVersion = function(sDataString)
{
	var _getVersion = function(sDataString)
	{
		var nIndex = sDataString.indexOf(Namespace.BrowserDetection.version);
		if (nIndex === -1)
		{
			return false;
		}
		return parseFloat(sDataString.substring(nIndex+Namespace.BrowserDetection.version.length+1));
	};
	if(typeof sDataString !== "undefined")
	{
		Namespace.BrowserDetection.version = _getVersion(sDataString);
		return true;
	}
	var aLookForVersion = [navigator.userAgent, navigator.appVersion];
	var sVersion = 'Unknown';
	var nLook = 0;
	var nLenLook = aLookForVersion.length;

	for(; nLook < nLenLook; nLook++)
	{
		sVersion = _getVersion(aLookForVersion[nLook]);
		if(sVersion !== '')
		{
			Namespace.BrowserDetection.version = sVersion;
			return true;
		}
	}

	Namespace.BrowserDetection.version = 'Unknown';
    return true;
};
/**
 * BrowserDetection.init create the singleton and call the setBrowser and setVersion
 * methods to set both static variables,
 * BrowserDetection.browser and BrowserDetection.version
 * @member Namespace.BrowserDetection
 * @version 1.0
 * @author Tomas Corral Casas
 * @return
 */
Namespace.BrowserDetection.init = function(aBrowsersSet, sDataString)
{
	var oBrowserDetection = new Namespace.BrowserDetection();
	oBrowserDetection.setBrowser(aBrowsersSet || Namespace.BrowserDetection.browsersSet);
	oBrowserDetection.setVersion(sDataString);
};
/**
 * BrowserDetection.isIE5
 * @member Namespace.BrowserDetection
 * @version 1.0
 * @author Tomas Corral Casas
 * @return true if the browser that owns the user is Internet Explorer and version 5
 * @type boolean
 */
Namespace.BrowserDetection.isIE5 = function()
{
	return Namespace.BrowserDetection.isIE() && Namespace.BrowserDetection.version === 5;

};
/**
 * BrowserDetection.isIE6
 * @member Namespace.BrowserDetection
 * @version 1.0
 * @author Tomas Corral Casas
 * @return true if the browser that owns the user is Internet Explorer and version 6
 * @type boolean
 */
Namespace.BrowserDetection.isIE6 = function()
{
	return Namespace.BrowserDetection.isIE() && Namespace.BrowserDetection.version === 6;

};
/**
 * BrowserDetection.isIE
 * @member Namespace.BrowserDetection
 * @version 1.0
 * @author Tomas Corral Casas
 * @return true if the browser that owns the user is Internet Explorer
 * @type boolean
 */
Namespace.BrowserDetection.isIE = function()
{
	return Namespace.BrowserDetection.browser === 'Explorer';

};
/**
 * BrowserDetection.isSafari
 * @member Namespace.BrowserDetection
 * @version 1.0
 * @author Tomas Corral Casas
 * @return true if the browser that owns the user is Safari
 * @type boolean
 */
Namespace.BrowserDetection.isSafari = function()
{
	if(Namespace.BrowserDetection.browser === 'Safari')
	{
		Namespace.BrowserDetection.isSafari = function(){return true;};
		return true;
	}
	Namespace.BrowserDetection.isSafari = function(){return false;};
	return false;
};
/**
 * BrowserDetection.isIEorOpera
 * @member Namespace.BrowserDetection
 * @version 1.0
 * @author Tomas Corral Casas
 * @return true if the browser that owns the user is Internet Explorer or Opera
 * @type boolean
 */
Namespace.BrowserDetection.isIEorOpera = function()
{
	return Namespace.BrowserDetection.isIE() || Namespace.BrowserDetection.browser === 'Opera';

};