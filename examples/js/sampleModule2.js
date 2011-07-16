Hydra.module.register("single2", function(oAction)
{
	return {
		sModule: 'BaseSample2',
		init: function (oData) {
			alert("Single Module 2 started");
		},
		handleAction: function (oNotifier) {},
		destroy: function () {}
	};
});