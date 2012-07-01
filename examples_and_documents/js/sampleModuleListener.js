Hydra.module.register("sampleModuleListener", function () {
	return {
		sModule: 'BaseSample',
		aListeningEvents:['linkClicked'],
		oEventsCallbacks:{
			'linkClicked':function () {
				alert('Link clicked');
			}
		},
		init: function () {
			alert("Listener Module started");

			this.createLinkAndAddEvent();
		},
		createLinkAndAddEvent: function()
		{
			var oLink = document.createElement("a");
			oLink.href = '#';
			oLink.innerHTML = 'Start Notifier Module';
			$(oLink).click(function () {
				Hydra.module.start('sampleModuleNotifier');
			});
			document.body.appendChild(oLink);
		}
	};
});