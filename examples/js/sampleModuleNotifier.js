Hydra.module.register("sampleModuleNotifier", function (action) {
	return {
		sModule: 'BaseSample',
		init: function (oData) {
			alert("Notifier Module started");
			
			action.notify({
				type: 'linkClicked',
				data: null
			});
		},
		handleAction: function (oNotifier) {},
		destroy: function () {}
	};
});