define(["backbone", "text!templates/documentation/use_with_requirejs.tpl", 'i18n!nls/labels'], function(Backbone, useWithRequireJSTPL, labels){
	return Backbone.View.extend({
		el: document.getElementById("documentation"),
		template: _.template(useWithRequireJSTPL),
		initialize: function(){
		},
		render: function(){
			this.el.innerHTML = this.template(labels.root || labels);
			return this;
		}
	});
});