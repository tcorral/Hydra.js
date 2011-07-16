Hydra.module.register("sampleModuleListener", function (action) {
	return {
		sModule: 'BaseSample',
		init: function (oData) {
			alert("Listener Module started");
			
			this.createLinkAndAddEvent();
			
			action.listen(['linkClicked'], this.handleAction, this);
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
		},
		handleAction: function (oNotifier) {
			if(oNotifier.type !== 'linkClicked')
			{
				return;
			}
			alert('Link clicked Listener');
		},
		destroy: function () {}
	};
});