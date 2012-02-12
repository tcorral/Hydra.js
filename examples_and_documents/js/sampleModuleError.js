Hydra.module.register("sampleError", function(oAction)
{
	return {
		sModule: 'NeverArrivesHere',
		aListeningEvents:['alert'],
		oEventsCallbacks:{
			'alert':function (oNotify) {
				alert(oNotify.data);
			}
		},
		init: function()
		{
			alert("ModuleWithError");

			throw new Error("Ha habido un error");

			oAction.notify({
				type: 'alert',
				data: ++nIndex
			});
		}
	};
});