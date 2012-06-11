/**
 * Namespace.ResponseAjax is the object to be used as response when returning the Ajax Call
 * It's used in Ajax.
 * @class Namespace.ResponseAjax
 * @requires Namespace
 * @constructor
 * @version 1.0
 * @author Tomas Corral Casas
 * @param {Object} oHttp
 */
Namespace.ResponseAjax = function(oHttp)
{
	/**
	 * _oHttp is the XMLHttpRequest Object
	 * @member Namespace.ResponseAjax
	 * @private
	 * @author Tomas Corral Casas
	 * @type XMLHttpRequest
	 */
	var _oHttp = oHttp;
	/**
	 * responseTEXT is the internal method to get the response in text format
	 * @member Namespace.ResponseAjax.prototype
	 * @author Tomas Corral Casas
	 * @return the response in text format
	 * @type String
	 */
	this.responseTEXT = function()
	{
		return _oHttp.responseText;
	};
	/**
	 * responseXML is the internal method to get the response in XML format
	 * @member Namespace.ResponseAjax.prototype
	 * @author Tomas Corral Casas
	 * @return the response in XML format
	 * @type XML
	 */
	this.responseXML = function()
	{
		return _oHttp.responseXML;
	};
	/**
	 * responseHTML is the internal method to get the response in Node format
	 * @member Namespace.ResponseAjax.prototype
	 * @author Tomas Corral Casas
	 * @return the response in Node format
	 * @type DocumentFragment
	 */
	this.responseHTML = function()
	{
		try
		{
			var oLayer = document.createElement("div");
			var oDocumentFragment = document.createDocumentFragment();
			oLayer.innerHTML = _oHttp.responseText;
			for (var nLayer = 0, nLenLayers = oLayer.childNodes.length; nLayer < nLenLayers; nLayer++)
			{
				oDocumentFragment.appendChild(oLayer.childNodes[nLayer]);
			}
			return oDocumentFragment;
		}
		catch (erError)
		{
			return {
				e_r_e_r_r_o_r_s_t_a_t_u_s_a_j_a_x: erError.message
			};
		}
	};
	/**
	 * responseJSON is the internal method to get the response in JSON format
	 * @member Namespace.ResponseAjax.prototype
	 * @author Tomas Corral Casas
	 * @return the response in JSON format
	 * @type JSON
	 */
	this.responseJSON = function()
	{
		try
		{
			return JSON.parse(_oHttp.responseText);
		}
		catch (erError)
		{
			return {
				e_r_e_r_r_o_r_s_t_a_t_u_s_a_j_a_x: erError.message
			};
		}
	};
	/**
	 * getStatusNumber is the internal method to get the status number of the request
	 * @member Namespace.ResponseAjax.prototype
	 * @author Tomas Corral Casas
	 * @return the status number for the response
	 * @type Number
	 */
	this.getStatusNumber = function()
	{
		return _oHttp.status;
	};
	/**
	 * getStatusMessage is the internal method to get the status message of the request
	 * @member Namespace.ResponseAjax.prototype
	 * @author Tomas Corral Casas
	 * @return the status message for the response
	 * @type String
	 */
	this.getStatusMessage = function()
	{
		return _oHttp.statusText;
	};
};
/**
 * Namespace.Ajax is the class to launch AJAX calls to the server to retrieve information
 * @class Namespace.Ajax
 * @requires Namespace
 * @requires Namespace.ResponseAjax
 * @constructor
 * @version 1.0
 * @author Tomas Corral Casas
 */
Namespace.Ajax = function()
{
	/**
	 * oHttp is the XMLHttpRequest Object
	 * @member Namespace.Ajax.prototype
	 * @author Tomas Corral Casas
	 * @type XMLHttpRequest
	 */
	this.oHttp = this.getHTTPObject();
	/**
	 * sUrl is the URL to launch the AJAX call on server
	 * @member Namespace.Ajax.prototype
	 * @author Tomas Corral Casas
	 * @type String
	 */
	this.sUrl = '';
	/**
	 * bAsync is boolean value to determine if you want an asynchronous call or not
	 * @member Namespace.Ajax.prototype
	 * @author Tomas Corral Casas
	 * @type Boolean
	 */
	this.bAsync = true;
	/**
	 * sLastError is the variable to save the last error message returned in the AJAX call.
	 * @member Namespace.Ajax.prototype
	 * @author Tomas Corral Casas
	 * @type String
	 */
	this.sLastError = '';
	/**
	 * sMethod is the method type to make the AJAX call
	 * POST method by default
	 * @member Namespace.Ajax.prototype
	 * @author Tomas Corral Casas
	 * @type String
	 */
	this.sMethod = Namespace.Ajax._methods.POST;
	/**
	 * sDataType is the expected datatype when receiving the response from the AJAX call
	 * TEXT datatype by default
	 * @member Namespace.Ajax.prototype
	 * @author Tomas Corral Casas
	 * @type String
	 */
	this.sDataType = Namespace.Ajax._dataTypes.TEXT;
	/**
	 * sData is the data to be added when making the AJAX call.
	 * @member Namespace.Ajax.prototype
	 * @author Tomas Corral Casas
	 * @type String
	 */
	this.sData = '';
	/**
	 * bInProcess is the boolean value that saves the status of the AJAX call; is finished or not.
	 * @member Namespace.Ajax.prototype
	 * @author Tomas Corral Casas
	 * @type Boolean
	 */
	this.bInProcess = false;
	/**
	 * onBeforeSend is the callback to be called before send the AJAX call. It could be used to process some values before send the AJAX call.
	 * @member Namespace.Ajax.prototype
	 * @author Tomas Corral Casas
	 * @type Function
	 */
	this.onBeforeSend = function(){ return this; };
	/**
	 * onReady is the callback to be called when the response is OK.
	 * @member Namespace.Ajax.prototype
	 * @author Tomas Corral Casas
	 * @param {Object} oResponseAjax
	 * @type Function
	 */
	this.onReady = function(oResponseAjax)
	{
	};
	/**
	 * onError is the callback to be called when the response is KO.
	 * @member Namespace.Ajax.prototype
	 * @author Tomas Corral Casas
	 * @param {Object} oResponseAjax
	 * @param {String} sErrorMessage
	 * @param {Number} nStatusNumber
	 * @param {String} sStatusMessage
	 * @type Function
	 */
	this.onError = function(oResponseAjax, sErrorMessage, nStatusNumber, sStatusMessage)
	{
	};
	/**
	 * onComplete is the callback to be called when the response is received. Don't take care about the response is OK or KO.
	 * @member Namespace.Ajax.prototype
	 * @author Tomas Corral Casas
	 * @param {Object} oResponseAjax
	 * @param {Number} nStatusNumber
	 * @param {String} sStatusMessage
	 * @type Function
	 */
	this.onComplete = function(oResponseAjax, nStatusNumber, sStatusMessage)
	{
	};
	/**
	 * oCache is the Namespace.Cache Object to be used when making calls.
	 * If oCache is different from null. The AJAX calls are cached and the next time is not needed to make the AJAX call again. Only retrieve it from the cache.
	 * @member Namespace.Ajax.prototype
	 * @author Tomas Corral Casas
	 * @type Namespace.Cache
	 */
	this.oCache = null;
	/**
	 * nTimeout is the number of milliseconds to wait before launch a Timeout Error
	 * If you want to not use the Timeout Error, don't change this value.
	 * @member Namespace.Ajax.prototype
	 * @author Tomas Corral Casas
	 * @type Number
	 */
	this.nTimeout = 0;
	/**
	 * nIdTimeout is the identifier for the setTimeout callback. This is used to clear the timeout if the time, of the request, is less than the specified in nTimeout
	 * It's only used if the nTimeout has a positive value greater than zero.
	 * @member Namespace.Ajax.prototype
	 * @author Tomas Corral Casas
	 * @type Object
	 */
	this.nIdTimeout = -1;
};
/**
 * Namespace.Ajax._methods is the config class for AJAX methods
 * requires Namespace
 * requires Namespace.Ajax
 * @class Namespace.Ajax._methods
 * @member Namespace.Ajax
 * @constructor
 * @version 1.0
 * @author Tomas Corral Casas
 */
Namespace.Ajax._methods =
{
	GET: "GET",
	POST: "POST"
};
/**
 * Namespace.Ajax._dataTypes is the config class for AJAX dataTypes
 * requires Namespace
 * requires Namespace.Ajax
 * @class Namespace.Ajax._dataTypes
 * @member Namespace.Ajax
 * @constructor
 * @version 1.0
 * @author Tomas Corral Casas
 */
Namespace.Ajax._dataTypes =
{
	TEXT: "TEXT",
	XML: "XML",
	JSON: "JSON",
	HTML: "HTML"
};
/**
 * Namespace.Ajax._acceptType is the config class for AJAX accepted mimetypes
 * requires Namespace
 * requires Namespace.Ajax
 * @class Namespace.Ajax._acceptType
 * @member Namespace.Ajax
 * @constructor
 * @version 1.0
 * @author Tomas Corral Casas
 */
Namespace.Ajax._acceptType =
{
	TEXT: "text/plain",
	XML: "text/xml",
	HTML: "text/html",
	JSON: "application/json",
	"*": "*/*"
};
/**
 * Namespace.Ajax.errors is the config class for AJAX message errors
 * requires Namespace
 * requires Namespace.Ajax
 * @class Namespace.Ajax.errors
 * @member Namespace.Ajax
 * @constructor
 * @version 1.0
 * @author Tomas Corral Casas
 */
Namespace.Ajax.errors =
{
	notSupported: 'jsFramework Error:\nThis browser doesn\'t support the XMLHttpRequest object.',
	xmlParserError: 'XML parser error or not a valid XML file',
	jsonParserError: 'JSON parser error or not a valid JSON file',
	htmlParserError: 'HTML parser error or not a valid HTML file'
};
/**
 * Return the XMLHttpRequest Object
 * Self executing method to use the lazy pattern. It reduces the time.
 * @member Namespace.Ajax.prototype
 * @author Tomas Corral Casas
 * @return the XMLHttpRequest Object
 * @type XMLHttpRequest
 */
Namespace.Ajax.prototype.getHTTPObject = (function()
{
	var fpCallback = function()
	{
	};
	if(Namespace.BrowserDetection)
	{
		if (Namespace.BrowserDetection.isIE())
		{
			fpCallback = function()
			{
				var oXmlHttp = null;
                try
				{
					oXmlHttp = new XMLHttpRequest();
				}
				catch (oError)
				{
					try
					{
						oXmlHttp = new ActiveXObject('Msxml2.XMLHTTP');
					}
					catch (oError)
					{
						try
						{
							oXmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
						}
						catch (oError)
						{
							throw new Error(Namespace.Ajax.errors.notSupported);
						}
					}
				}
				return oXmlHttp;
			};
		}
		else
		{
			fpCallback = function()
			{
				try
				{
					var oXmlHttp = new XMLHttpRequest();
				}
				catch (oError)
				{
					throw new Error(Namespace.Ajax.errors.notSupported);
				}
				return oXmlHttp;
			};
		}
	}
	return fpCallback;
}());
/**
 * Method used to configure all the different properties and callback at the same time
 * @member Namespace.Ajax.prototype
 * @author Tomas Corral Casas
 * @param {Object} oConfig
 * @return the instance of the Namespace.Ajax object
 * @type Namespace.Ajax
 */
Namespace.Ajax.prototype.setup = function(oConfig)
{
	this.sUrl = oConfig.url || '';
	this.bAsync = (typeof oConfig.async == "boolean") ? oConfig.async : true;
	this.sMethod = oConfig.method ? oConfig.method.toUpperCase() : Namespace.Ajax._methods.POST;
	this.sData = this.serializeData(oConfig.data || '');
	this.sDataType = oConfig.dataType ? oConfig.dataType.toUpperCase() : Namespace.Ajax._dataTypes.TEXT;
	this.onBeforeSend = oConfig.beforeSend ||
	function()
	{
	};
	this.onReady = oConfig.success ||
	function(oResponseAjax)
	{
	};
	this.onError = oConfig.error ||
	function(oResponseAjax, sErrorMessage, nStatusNumber, sStatusMessage)
	{
	};
	this.onComplete = oConfig.complete ||
	function(oResponseAjax, nStatusNumber, sStatusMessage)
	{
	};
	this.oCache = (typeof oConfig.cache !== "undefined") ? oConfig.cache : null;
	this.nTimeout = oConfig.timeout > 0 ? oConfig.timeout : 0;

	if (this.sMethod == Namespace.Ajax._methods.GET && this.sData.length > 0)
	{
		this.sUrl += "?" + this.sData;
	}
	return this;
};
/**
 * Checks if the oData is an object or String if it's an Object returns the serialized Object in String Format.
 * @member Namespace.Ajax.prototype
 * @author Tomas Corral Casas
 * @param {Object} oData
 * @return the string representation of the oData Object.
 * @type String
 */
Namespace.Ajax.prototype.serializeData = function(oData)
{
	if (typeof oData == "string")
	{
		return oData;
	}
	else
	{
		return this._serializeObject(oData);
	}
};
/**
 * Serialize an Object in Get String format.
 * @member Namespace.Ajax.prototype
 * @private
 * @author Tomas Corral Casas
 * @param {Object} oObject
 * @return the serialization of the object in Get format
 * @type String
 */
Namespace.Ajax.prototype._serializeObject = function(oObject)
{
	return Namespace.Utilities.serializeObject(oObject);
};
/**
 * Return true or false if the response is in incorrect format
 * @member Namespace.Ajax.prototype
 * @author Tomas Corral Casas
 * @return if the response is OK or KO
 * @type Boolean
 */
Namespace.Ajax.prototype.isResponseCorrect = function()
{
	try
	{
		var oResponse = new Namespace.ResponseAjax(this.oHttp)['response' + this.sDataType]();

		if (this.sDataType === Namespace.Ajax._dataTypes.XML && oResponse === null)
		{
			throw new Error(Namespace.Ajax.errors.xmlParserError);
		}
		if (this.sDataType === Namespace.Ajax._dataTypes.JSON && typeof oResponse.e_r_e_r_r_o_r_s_t_a_t_u_s_a_j_a_x != "undefined")
		{
			throw new Error(Namespace.Ajax.errors.jsonParserError);
		}
		if (this.sDataType === Namespace.Ajax._dataTypes.HTML && typeof oResponse.e_r_e_r_r_o_r_s_t_a_t_u_s_a_j_a_x != "undefined")
		{
			throw new Error(Namespace.Ajax.errors.htmlParserError);
		}
		return true;
	}
	catch (eError)
	{
		this.sLastError = eError.message;
		return false;
	}
};
/**
 * Check if the status of the AJAX call is OK or KO and call the correct callback.
 * @member Namespace.Ajax.prototype
 * @author Tomas Corral Casas
 */
Namespace.Ajax.prototype.checkReadyOrError = function()
{
	if (this.oHttp.status === 200)
	{
		if (this.nTimeout)
		{
			clearTimeout(this.nIdTimeout);
		}
		if (this.isResponseCorrect())
		{
			var oResponse = new Namespace.ResponseAjax(this.oHttp)['response' + this.sDataType]()
			if (this.oCache !== null)
			{
				this.oCache.addAjaxResponse(this.sUrl + "(" + this.sData + this.sDataType + ")", oResponse);
			}
			this.onReady(oResponse);
			oResponse = null;
		}
		else
		{
			this.onError(new Namespace.ResponseAjax(this.oHttp)['responseTEXT'](), this.sLastError, this.oHttp.status, this.oHttp.statusText);
		}
	}
	else
	{
		this.onError(new Namespace.ResponseAjax(this.oHttp)['responseTEXT'](), "Server Error", this.oHttp.status, this.oHttp.statusText);
	}
};
/**
 * Array to save the different sets for the header
 * @namespace Namespace.Ajax.prototype.setHeaderPost
 * @member Namespace.Ajax.prototype
 * @author Tomas Corral Casas
 * @type Array
 */
Namespace.Ajax.prototype.setHeaderPost = [];
/**
 * Callback to set the Headers, if the selected method is GET, when sending the AJAX call.
 * @member Namespace.Ajax.prototype.setHeaderPost
 * @author Tomas Corral Casas
 */
Namespace.Ajax.prototype.setHeaderPost.GET = function(oAjax)
{
	oAjax.oHttp.setRequestHeader('Accept', Namespace.Ajax._acceptType[oAjax.sDataType]);
};
/**
 * Callback to set the Headers, if the selected method is POST, when sending the AJAX call.
 * @member Namespace.Ajax.prototype.setHeaderPost
 * @author Tomas Corral Casas
 */
Namespace.Ajax.prototype.setHeaderPost.POST = function(oAjax)
{
	oAjax.oHttp.setRequestHeader('Accept', Namespace.Ajax._acceptType[oAjax.sDataType]);
	oAjax.oHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
};
/**
 * Array to save the different methods when getting the data
 * @namespace Namespace.Ajax.prototype.wichMethod
 * @member Namespace.Ajax.prototype
 * @author Tomas Corral Casas
 * @type Array
 */
Namespace.Ajax.prototype.wichMethod = [];
/**
 * Callback to return the data if the selected method is GET
 * @member Namespace.Ajax.prototype.wichMethod
 * @author Tomas Corral Casas
 */
Namespace.Ajax.prototype.wichMethod.GET = function(oAjax)
{
	return null;
};
/**
 * Callback to return the data if the selected method is POST
 * @member Namespace.Ajax.prototype.wichMethod
 * @author Tomas Corral Casas
 */
Namespace.Ajax.prototype.wichMethod.POST = function(oAjax)
{
	return oAjax.sData;
};
/**
 * Array to save the different ways to execute the AJAX calls
 * @member Namespace.Ajax.prototype
 * @author Tomas Corral Casas
 * @type Array
 */
Namespace.Ajax.prototype.workAsyncMode = [];
/**
 * Callback to execute the AJAX call when the Asynchronous mode is false (Synchronous call)
 * @member Namespace.Ajax.prototype.workAsyncMode
 * @author Tomas Corral Casas
 */
Namespace.Ajax.prototype.workAsyncMode[0] = function(oAjax)
{

	oAjax.onBeforeSend();
	if (this.nTimeout)
	{
		oAjax.nIdTimeout = setTimeout(function()
		{
			oAjax.abort();
		}, oAjax.nTimeout);
	}
	oAjax.oHttp.send(oAjax.wichMethod[oAjax.sMethod](oAjax));
	oAjax.bInProcess = false;
	oAjax.checkReadyOrError();
};
/**
 * Callback to execute the AJAX call when the Asynchronous mode is true (Asynchronous call)
 * @member Namespace.Ajax.prototype.workAsyncMode
 * @author Tomas Corral Casas
 */
Namespace.Ajax.prototype.workAsyncMode[1] = function(oAjax)
{
	oAjax.oHttp.onreadystatechange = function()
	{
		if (oAjax.oHttp.readyState == 4)
		{
			oAjax.onComplete(new Namespace.ResponseAjax(oAjax.oHttp)['response' + oAjax.sDataType]());
			oAjax.bInProcess = false;
			oAjax.checkReadyOrError();
		}
	};
	oAjax.bInProcess = true;
	oAjax.onBeforeSend();
	if (this.nTimeout)
	{
		oAjax.nIdTimeout = setTimeout(function()
		{
			oAjax.abort();
		}, oAjax.nTimeout);
	}
	oAjax.oHttp.send(oAjax.wichMethod[oAjax.sMethod](oAjax));
};
/**
 * Launch the AJAX call
 * @member Namespace.Ajax.prototype
 * @author Tomas Corral Casas
 * @return the instance of the Namespace.Ajax Object
 * @type Namespace.Ajax
 */
Namespace.Ajax.prototype.call = function()
{
	var oCachedResponse = '';
	if (this.oCache !== null)
	{
		oCachedResponse = this.oCache.getAjaxResponse(this.sUrl + "(" + this.sData + this.sDataType + ")");
		if (oCachedResponse)
		{
			this.onReady(oCachedResponse);
			return this;
		}
	}
	if (this.oHttp && !this.bInProcess)
	{
		this.bInProcess = true;
		this.oHttp.open(this.sMethod, this.sUrl, this.bAsync);
		this.setHeaderPost[this.sMethod](this);
		return this.workAsyncMode[Number(this.bAsync)](this);
	}
	return this;
};
/**
 * Abort the AJAX call
 * @member Namespace.Ajax.prototype
 * @author Tomas Corral Casas
 */
Namespace.Ajax.prototype.abort = function()
{
	this.oHttp.abort();
};
/**
 * Static property to save the instance
 * This is used by the getInstance method to get and use a Singleton.
 * @member Namespace.Ajax
 * @author Tomas Corral Casas
 * @type Namespace.Ajax
 */
Namespace.Ajax.instance = null;
/**
 * Static method to create a singleton instance of the Namespace.Ajax Object
 * This is used by the getInstance method to get and use a Singleton.
 * @member Namespace.Ajax
 * @author Tomas Corral Casas
 * @return the instance of the Namespace.Ajax Object
 * @type Namespace.Ajax
 */
Namespace.Ajax.getInstance = function()
{
	if (Namespace.Ajax.instance === null)
	{
		Namespace.Ajax.instance = new Namespace.Ajax();
	}
	try
	{
		return Namespace.Ajax.instance;
	}
	catch (erError)
	{
	}
	finally
	{
		Namespace.Ajax.getInstance = function()
		{
			return Namespace.Ajax.instance;
		};
	}
    return null;
};
