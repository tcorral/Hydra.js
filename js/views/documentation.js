define(["backbone", "text!templates/documentation.tpl", 'i18n!nls/labels'], function(Backbone, documentationTPL, labels){
	return Backbone.View.extend({
		el: document.getElementById("article_body"),
		template: _.template(documentationTPL),
		initialize: function(){
		},
		render: function(){
			this.el.innerHTML = this.template(labels.root || labels);
			return this;
		}
	});
});