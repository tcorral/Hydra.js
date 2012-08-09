define(["backbone", "text!templates/about.tpl", 'i18n!nls/labels'], function(Backbone, aboutTPL, labels){
	return Backbone.View.extend({
		el: document.getElementById("article_body"),
		template: _.template(aboutTPL),
		events: {
			"change input": 'change_link'
		},
		$DownloadLink: null,
		change_link: function(eEvent)
		{
			this.$DownloadLink.attr("href", eEvent.target.getAttribute("data-url"));
		},
		initialize: function(){
		},
		render: function(){
			this.el.innerHTML = this.template(labels.root || labels);
			this.$DownloadLink = this.$el.find("a.blank");
			this.$DownloadLink.each(function()
			{
				this.target = 'blank';
			});
			return this;
		}
	});
});