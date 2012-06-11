Hydra.module.register("simple", function () {
	return {
		sModule: 'BaseSample',
		init: function () {
			this.__container__.innerHTML = 'TEST' + "_" + this.__container__.id;
		},
		onDestroy: function () {
			this.__container__.innerHTML = 'Destroyed content' + "_" + this.__container__.id;
		}
	};
});