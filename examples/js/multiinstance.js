Hydra.module.register("simple", function () {
	return {
		sModule: 'BaseSample',
		oContainer: null,
		init: function (oContainer) {
			this.oContainer = oContainer;
			this.oContainer.innerHTML = 'TEST' + "_" + this.oContainer.id;
		},
		onDestroy: function () {
			this.oContainer.innerHTML = 'Destroyed content' + "_" + this.oContainer.id;
		}
	};
});