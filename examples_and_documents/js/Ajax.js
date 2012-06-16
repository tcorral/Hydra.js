(function ( global, ns, _undefined_ ) {
	'use strict';
	var doc = global.document, ResponseAjax, doTimeout = global.setTimeout, Ajax;

	if ( ns === _undefined_ ) {
		ns = global;
	}

	ResponseAjax = function ( oHttp ) {
		var _oHttp = oHttp;
		this.responseTEXT = function () {
			return _oHttp.responseText;
		};
		this.responseXML = function () {
			return _oHttp.responseXML;
		};
		this.responseHTML = function () {
			try {
				var oLayer = doc.createElement( "div" ),
					oDocumentFragment = doc.createDocumentFragment(),
					nLayer,
					nLenLayers;

				oLayer.innerHTML = _oHttp.responseText;
				nLenLayers = oLayer.childNodes.length;

				for ( nLayer = 0; nLayer < nLenLayers; nLayer += 1 ) {
					oDocumentFragment.appendChild( oLayer.childNodes[nLayer] );
				}
				return oDocumentFragment;
			}
			catch ( erError ) {
				return {
					e_r_e_r_r_o_r_s_t_a_t_u_s_a_j_a_x: erError.message
				};
			}
		};
		this.responseJSON = function () {
			try {
				return JSON.parse( _oHttp.responseText );
			}
			catch ( erError ) {
				return {
					e_r_e_r_r_o_r_s_t_a_t_u_s_a_j_a_x: erError.message
				};
			}
		};
		this.getStatusNumber = function () {
			return _oHttp.status;
		};
		this.getStatusMessage = function () {
			return _oHttp.statusText;
		};
	};

	Ajax = function () {
		this.oHttp = this.getHTTPObject();
		this.sUrl = '';
		this.bAsync = true;
		this.sLastError = '';
		this.sMethod = Ajax._methods.POST;
		this.sDataType = Ajax._dataTypes.TEXT;
		this.sData = '';
		this.bInProcess = false;
		this.onBeforeSend = function () { return this; };
		this.onReady = function ( oResponseAjax ) {};
		this.onError = function ( oResponseAjax, sErrorMessage, nStatusNumber, sStatusMessage ) {};
		this.onComplete = function ( oResponseAjax, nStatusNumber, sStatusMessage ) {};
		this.oCache = null;
		this.nTimeout = 0;
		this.nIdTimeout = -1;
	};
	Ajax._methods = {
		GET: "GET",
		POST: "POST"
	};
	Ajax._dataTypes = {
		TEXT: "TEXT",
		XML: "XML",
		JSON: "JSON",
		HTML: "HTML"
	};
	Ajax._acceptType = {
		TEXT: "text/plain",
		XML: "text/xml",
		HTML: "text/html",
		JSON: "application/json",
		"*": "*/*"
	};
	Ajax.errors = {
		notSupported: 'jsFramework Error:\nThis browser doesn\'t support the XMLHttpRequest object.',
		xmlParserError: 'XML parser error or not a valid XML file',
		jsonParserError: 'JSON parser error or not a valid JSON file',
		htmlParserError: 'HTML parser error or not a valid HTML file'
	};
	Ajax.instance = null;
	Ajax.getInstance = function () {
		if ( Ajax.instance === null ) {
			Ajax.instance = new Ajax();
		}
		try {
			return Ajax.instance;
		}
		catch ( erError ) {
		}
		finally {
			Ajax.getInstance = function () {
				return Ajax.instance;
			};
		}
		return null;
	};
	Ajax.prototype = {
		getHTTPObject: (function () {
			var fpCallback = function () {};
			if ( ns.BrowserDetection ) {
				if ( ns.BrowserDetection.isIE() ) {
					fpCallback = function () {
						var oXmlHttp = null;
						try {
							oXmlHttp = new XMLHttpRequest();
						}
						catch ( oError ) {
							try {
								oXmlHttp = new ActiveXObject( 'Msxml2.XMLHTTP' );
							}
							catch ( oError2 ) {
								try {
									oXmlHttp = new ActiveXObject( 'Microsoft.XMLHTTP' );
								}
								catch ( oError3 ) {
									throw new Error( Ajax.errors.notSupported );
								}
							}
						}
						return oXmlHttp;
					};
				}
				else {
					fpCallback = function () {
						var oXmlHttp = null;
						try {
							oXmlHttp = new XMLHttpRequest();
						}
						catch ( oError ) {
							throw new Error( Ajax.errors.notSupported );
						}
						return oXmlHttp;
					};
				}
			}
			return fpCallback;
		}()),
		setup: function ( oConfig ) {
			this.sUrl = oConfig.url || '';
			this.bAsync = (typeof oConfig.async === "boolean") ? oConfig.async : true;
			this.sMethod = oConfig.method ? oConfig.method.toUpperCase() : Ajax._methods.POST;
			this.sData = this.serializeData( oConfig.data || '' );
			this.sDataType = oConfig.dataType ? oConfig.dataType.toUpperCase() : Ajax._dataTypes.TEXT;
			this.onBeforeSend = oConfig.beforeSend ||
				function () {
				};
			this.onReady = oConfig.success ||
				function ( oResponseAjax ) {
				};
			this.onError = oConfig.error ||
				function ( oResponseAjax, sErrorMessage, nStatusNumber, sStatusMessage ) {
				};
			this.onComplete = oConfig.complete ||
				function ( oResponseAjax, nStatusNumber, sStatusMessage ) {
				};
			this.oCache = (typeof oConfig.cache !== "undefined") ? oConfig.cache : null;
			this.nTimeout = oConfig.timeout > 0 ? oConfig.timeout : 0;

			if ( this.sMethod === Ajax._methods.GET && this.sData.length > 0 ) {
				this.sUrl += "?" + this.sData;
			}
			return this;
		},
		serializeData: function ( oData ) {
			if ( typeof oData === "string" ) {
				return oData;
			}
			else {
				return this._serializeObject( oData );
			}
		},
		_serializeObject: function ( oObject ) {
			return ns.Utilities.serializeObject( oObject );
		},
		isResponseCorrect: function () {
			try {
				var oResponse = new ResponseAjax( this.oHttp )['response' + this.sDataType]();

				if ( this.sDataType === Ajax._dataTypes.XML && oResponse === null ) {
					throw new Error( Ajax.errors.xmlParserError );
				}
				if ( this.sDataType === Ajax._dataTypes.JSON && typeof oResponse.e_r_e_r_r_o_r_s_t_a_t_u_s_a_j_a_x !== "undefined" ) {
					throw new Error( Ajax.errors.jsonParserError );
				}
				if ( this.sDataType === Ajax._dataTypes.HTML && typeof oResponse.e_r_e_r_r_o_r_s_t_a_t_u_s_a_j_a_x !== "undefined" ) {
					throw new Error( Ajax.errors.htmlParserError );
				}
				return true;
			}
			catch ( eError ) {
				this.sLastError = eError.message;
				return false;
			}
		},
		checkReadyOrError: function () {
			var oResponse = new ResponseAjax( this.oHttp ),
				nStatus = this.oHttp.status,
				sStatus = this.oHttp.statusText;

			if ( nStatus === 200 ) {
				if ( this.nTimeout ) {
					global.clearTimeout( this.nIdTimeout );
				}
				if ( this.isResponseCorrect() ) {
					oResponse['response' + this.sDataType]();
					if ( this.oCache !== null ) {
						this.oCache.addAjaxResponse( this.sUrl + "(" + this.sData + this.sDataType + ")", oResponse );
					}
					this.onReady( oResponse );
					oResponse = null;
				}
				else {
					this.onError( oResponse.responseTEXT(), this.sLastError, nStatus, sStatus );
				}
			}
			else {
				this.onError( oResponse.responseTEXT(), "Server Error", nStatus, sStatus );
			}
		},
		setHeaderPost: {
			GET: function ( oAjax ) {
				oAjax.oHttp.setRequestHeader( 'Accept', Ajax._acceptType[oAjax.sDataType] );
			},
			POST: function ( oAjax ) {
				oAjax.oHttp.setRequestHeader( 'Accept', Ajax._acceptType[oAjax.sDataType] );
				oAjax.oHttp.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
			}
		},
		wichMethod: {
			GET: function ( oAjax ) {
				return null;
			},
			POST: function ( oAjax ) {
				return oAjax.sData;
			}
		},
		workAsyncMode: [
			function ( oAjax ) {
				oAjax.onBeforeSend();
				if ( this.nTimeout ) {
					oAjax.nIdTimeout = doTimeout( function () {
						oAjax.abort();
					}, oAjax.nTimeout );
				}
				oAjax.oHttp.send( oAjax.wichMethod[oAjax.sMethod]( oAjax ) );
				oAjax.bInProcess = false;
				oAjax.checkReadyOrError();
			},
			function ( oAjax ) {
				oAjax.oHttp.onreadystatechange = function () {
					if ( oAjax.oHttp.readyState === 4 ) {
						oAjax.onComplete( new ResponseAjax( oAjax.oHttp )['response' + oAjax.sDataType]() );
						oAjax.bInProcess = false;
						oAjax.checkReadyOrError();
					}
				};
				oAjax.bInProcess = true;
				oAjax.onBeforeSend();
				if ( this.nTimeout ) {
					oAjax.nIdTimeout = doTimeout( function () {
						oAjax.abort();
					}, oAjax.nTimeout );
				}
				oAjax.oHttp.send( oAjax.wichMethod[oAjax.sMethod]( oAjax ) );
			}
		],
		call: function () {
			var oCachedResponse = '';
			if ( this.oCache !== null ) {
				oCachedResponse = this.oCache.getAjaxResponse( this.sUrl + "(" + this.sData + this.sDataType + ")" );
				if ( oCachedResponse ) {
					this.onReady( oCachedResponse );
					return this;
				}
			}
			if ( this.oHttp && !this.bInProcess ) {
				this.bInProcess = true;
				this.oHttp.open( this.sMethod, this.sUrl, this.bAsync );
				this.setHeaderPost[this.sMethod]( this );
				return this.workAsyncMode[Number( this.bAsync )]( this );
			}
			return this;
		},
		abort: function () {
			this.oHttp.abort();
		}
	};
	ns.Ajax = Ajax;
}( this, Namespace ));