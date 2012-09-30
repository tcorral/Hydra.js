define(["backbone", "text!templates/documentation/multimedia.tpl", 'i18n!nls/labels'], function(Backbone, multimediaTPL, labels){
	return Backbone.View.extend({
		el: document.getElementById("documentation"),
		template: _.template(multimediaTPL),
		initialize: function(){
		},
		render: function(){
			this.el.innerHTML = this.template(labels.root || labels);
			return this;
		}
	});
});