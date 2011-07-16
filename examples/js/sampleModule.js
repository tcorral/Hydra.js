Hydra.module.register("sample", function (action) {
	return {
		sModule: 'BaseSample',
		init: function (oData) {
			alert("sampleBase");
		},
		handleAction: function (oNotifier) {},
		destroy: function () {}
	};
});