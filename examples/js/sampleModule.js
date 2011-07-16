Hydra.module.register("single", function (action) {
	return {
		sModule: 'BaseSample',
		init: function (oData) {
			alert("Single Module started");
		},
		handleAction: function (oNotifier) {},
		destroy: function () {}
	};
});