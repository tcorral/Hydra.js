Hydra.module.extend("sample", function(oAction)
{
	return {
		sModule: 'ExtendedPepe',
		init: function(oData)
		{
			alert("SampleExtended");
			oAction.listen(["alert"], this.handleAction, this);
			
			oAction.notify({
				type: 'alert',
				data: ++nIndex
			});
		},
		handleAction: function(oAction)
		{
			switch(oAction.type)
			{
				case "alert": 
					alert(oAction.data);
					break;
				default: break;
			}
		},
		destroy: function(){}
	};
});