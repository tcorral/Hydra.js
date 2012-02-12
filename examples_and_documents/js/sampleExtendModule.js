Hydra.module.extend("single", function (action) {
	return {
		sModule:'ExtendedModule',
		aListeningEvents:['alert'],
		oEventsCallbacks:{
			'alert':function () {
				alert("Single extended module started");
			}
		},
		init:function () {
			alert("Sample Module Extended");
			action.notify({
				type:'alert',
				data: null
			});
		}
	};
});