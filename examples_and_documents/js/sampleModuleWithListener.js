Hydra.module.register("sampleModuleWithListener", function (action) {
	return {
		sModule: 'BaseSample',
		init: function (oData) {
			alert("Single Module started");
			
			this.createLinkAndAddEvent();
			
			action.listen(['linkClicked'], this.handleAction, this);
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
		},
		handleAction: function (oNotifier) {
			if(oNotifier.type !== 'linkClicked')
			{
				return;
			}
			alert('Link clicked');
		},
		destroy: function () {}
	};
});