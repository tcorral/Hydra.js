define(["backbone"], function(Backbone){
	return Backbone.View.extend({
		el: document.getElementById("top_menu"),
		events: {
			'click li': 'navigate'
		},
		active: null,
		initialize: function(){
			var sSection = window.location.hash.substr(1) || 'home';
			if(sSection === 'es' || sSection === 'en')
			{
				sSection = 'home';
			}
			if(sSection === 'how_to_use' || sSection === 'quickstart' || sSection === 'apis' || sSection === 'reference_guide')
			{
				sSection = "documentation"
			}
			var oSection = document.getElementById(sSection + '_top');
			oSection.className = 'active';
			this.active = oSection;
			_.bindAll(this, "navigate");
		},
		navigate: function(eEvent){
			this.active.className = '';
			this.active =  eEvent.currentTarget;
			this.active.className = "active";
		}
	});
});