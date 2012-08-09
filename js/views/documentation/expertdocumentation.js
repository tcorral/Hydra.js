define(["backbone", "text!templates/documentation/expertdocumentation.tpl", 'i18n!nls/labels'], function(Backbone, expertDocumentationTPL, labels){
	return Backbone.View.extend({
		el: document.getElementById("documentation"),
		template: _.template(expertDocumentationTPL),
		initialize: function(){
		},
		render: function(){
			this.el.innerHTML = this.template(labels.root || labels);
			return this;
		}
	});
});