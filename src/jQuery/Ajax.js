(function(win, Hydra, $){
	'use strict';
	var Ajax;

	/**
	 * Ajax jQuery methods wrapper
	 * @type {Object}
	 */
	Ajax = {
		/**
		 * Executes a simple and configurable ajax call
		 * @param oConfig
		 * @return {XMLHttpRequest}
		 */
		call: function(oConfig)
		{
			return $.ajax(oConfig);
		},
		/**
		 * Sugar method to make an ajax call expecting a JSON.
		 * @param {String} sUrl
		 * @param {Function} fpOnSuccess
		 * @param {String} sData
		 * @return {XMLHttpRequest}
		 */
		getJSON: function(sUrl, fpOnSuccess, sData)
		{
			return $.getJSON(sUrl, fpOnSuccess, sData);
		},
		/**
		 * Sugar method to make an ajax call expecting a Script.
		 * @param {String} sUrl
		 * @param {Function} fpOnSuccess
		 */
		getScript: function(sUrl, fpOnSuccess)
		{
			return $.getScript( sUrl, fpOnSuccess );
		},
		jsonP: function(sUrl, fpJSONCallback, fpOnError)
		{
			return $.ajax({
				url: sUrl,
				dataType: 'jsonp',
				error: fpOnError,
				success: fpJSONCallback
			});
		}
	};

	Hydra.extend("ajax", Ajax);
}(window, Hydra, jQuery));