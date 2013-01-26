define(["backbone", "text!templates/documentation/examples.tpl", 'i18n!nls/labels'], function(Backbone, overviewTPL, labels){
	return Backbone.View.extend({
		el: document.getElementById("documentation"),
		template: _.template(overviewTPL),
        events: {
            "click li": 'scrollToElement'
        },
        scrollToElement: function(eEvent){
            var sId = eEvent.target.href.substr(eEvent.target.href.indexOf("#") + 1);
            $('html, body').animate({
                scrollTop: $(document.getElementById(sId)).offset().top
            }, 2000);
            eEvent.preventDefault();
        },
		initialize: function(){
		},
		render: function(){
			this.el.innerHTML = this.template(labels.root || labels);
			return this;
		}
	});
});