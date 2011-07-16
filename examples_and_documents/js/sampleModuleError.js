Hydra.module.register("sampleError", function(oAction)
{
	return {
		sModule: 'NeverArrivesHere',
		init: function(oData)
		{
			alert("ModuleWithError");
			oAction.listen(["alert"], this.handleAction, this);
			
			throw new Error("Ha habido un error");
			
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