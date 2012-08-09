define(["backbone", "text!templates/documentation/examples.tpl", 'i18n!nls/labels'], function(Backbone, overviewTPL, labels){
	return Backbone.View.extend({
		el: document.getElementById("documentation"),
		template: _.template(overviewTPL),
		initialize: function(){
		},
		render: function(){
			this.el.innerHTML = this.template(labels.root || labels);
			return this;
		}
	});
});