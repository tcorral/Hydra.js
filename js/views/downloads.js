define(["backbone", "text!templates/downloads.tpl", 'i18n!nls/labels'], function(Backbone, downloadsTPL, labels){
	return Backbone.View.extend({
		el: document.getElementById("article_body"),
		template: _.template(downloadsTPL),
		initialize: function(){
		},
		render: function(){
			this.el.innerHTML = this.template(labels.root || labels);
			return this;
		}
	});
});