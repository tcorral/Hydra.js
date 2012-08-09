define(["backbone"], function(Backbone){
	return Backbone.View.extend({
		el: document.getElementById("doc_top_navigation"),
		events: {
			'click li': 'navigate'
		},
		active: null,
		initialize: function(){
			var sSection = window.location.hash.substr(1) || 'documentation';
			if(sSection === 'es' || sSection === 'en')
			{
				sSection = 'documentation';
			}
			var oSection = document.getElementById('doc_top_' + sSection);
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