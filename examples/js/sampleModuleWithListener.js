Hydra.module.register("sampleModuleWithListener", function (action) {
	return {
		sModule: 'BaseSample',
		aListeningEvents:['linkClicked'],
		oEventsCallbacks:{
			'linkClicked':function () {
				alert('Link clicked');
			}
		},
		init: function () {
			alert("Single Module started");

			this.createLinkAndAddEvent();
		},
		createLinkAndAddEvent: function()
		{
			var oLink = document.createElement("a");
			oLink.href = '#';
			oLink.innerHTML = 'Notify';
			$(oLink).click(function () {
				action.notify({
					type: 'linkClicked',
					data: null
				});
			});
			document.body.appendChild(oLink);
		}
	};
});