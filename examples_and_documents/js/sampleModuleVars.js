Hydra.module.register("single", function () {
	return {
		sModule: 'BaseSample',
		init: function (oData, oVars) {
			var sKey;
			var oItem = document.createElement("li");
			var oList = document.getElementById("list");
			var oDocumentFragment = document.createDocumentFragment();
			for(sKey in oData)
			{
				if(oData.hasOwnProperty(sKey))
				{
					oItem = oItem.cloneNode(true);
					oItem.innerHTML = sKey + ": " + oData[sKey];
					oDocumentFragment.appendChild(oItem);
				}
			}
			for(sKey in oVars)
			{
				if(oVars.hasOwnProperty(sKey))
				{
					oItem = oItem.cloneNode(true);
					oItem.innerHTML = sKey + ": " + oVars[sKey];
					oDocumentFragment.appendChild(oItem);
				}
			}
			oList.appendChild(oDocumentFragment);
		}
	};
});