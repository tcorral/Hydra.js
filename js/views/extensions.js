define(["backbone", "text!templates/extensions.tpl", 'i18n!nls/labels'], function(Backbone, extensionsTPL, labels){
	return Backbone.View.extend({
		el: document.getElementById("article_body"),
		template: _.template(extensionsTPL),
		initialize: function(){
		},
		render: function(){
			this.el.innerHTML = this.template(labels.root || labels);
			return this;
		}
	});
});