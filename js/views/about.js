define(["backbone", "text!templates/about.tpl", 'i18n!nls/labels'], function(Backbone, aboutTPL, labels){
	return Backbone.View.extend({
		el: document.getElementById("article_body"),
		template: _.template(aboutTPL),
		initialize: function(){
		},
		render: function(){
			this.el.innerHTML = this.template(labels.root || labels);
			return this;
		}
	});
});