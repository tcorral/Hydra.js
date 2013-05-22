define(["backbone", "text!templates/documentation/use_with_nodejs.tpl", 'i18n!nls/labels'], function(Backbone, useWithNodeJSTPL, labels){
	return Backbone.View.extend({
		el: document.getElementById("documentation"),
		template: _.template(useWithNodeJSTPL),
		initialize: function(){
		},
		render: function(){
			this.el.innerHTML = this.template(labels.root || labels);
			return this;
		}
	});
});