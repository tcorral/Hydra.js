Hydra.module.register("sampleModuleNotifier", function (action) {
	return {
		sModule: 'BaseSample',
		init: function () {
			alert("Notifier Module started");

			action.notify({
				type: 'linkClicked',
				data: null
			});
		}
	};
});