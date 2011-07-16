Hydra.module.register("sample2", function(oAction)
{
	return {
		sModule: 'sample2',
		init: function(oData)
		{
			alert(oData);
			
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