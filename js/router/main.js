define(['backbone'], function(Backbone){
	var MainRoute = Backbone.Router.extend({
		routes: {
			"downloads": "downloads",
			"extensions": "extensions",
			"documentation": "documentation",
			"how_to_use": "how_to_use",
			"quickstart": "quickstart",
			"apis": "apis",
			"reference_guide": "reference_guide",
			"expert_documentation": "expert_documentation",
			"multimedia": "multimedia",
			"examples": "examples",
			"community": "community",
			'multimedia': 'multimedia',
			'es': 'es',
			'en': 'en',
			'*path': "home"
		},
		lastRoute: 'home',
		"es": function( ){
			var locale = localStorage.getItem('locale');
			if(locale != 'es-es') {
				localStorage.setItem('locale', 'es-es');
			}
			this.navigate(this.lastRoute, { trigger: true });
			location.reload();
		},
		"en": function( ){
			var locale = localStorage.getItem('locale');
			if(locale != 'en-us') {
				localStorage.setItem('locale', 'en-us');
			}
			this.navigate(this.lastRoute, { trigger: true });
			location.reload();
		},
		"home": function (path) {
			require(['views/about'], function(aboutView)
			{
				var oView = new aboutView();
				oView.render();
			});
			this.lastRoute = 'home';
		},
		"downloads": function () {
			require(['views/downloads'], function(downloadsView)
			{
				var oView = new downloadsView();
				oView.render();
			});
			this.lastRoute = 'downloads';
		},
		"extensions": function () {
			require(['views/extensions'], function(extensionsView)
			{
				var oView = new extensionsView();
				oView.render();
			});
			this.lastRoute = 'extensions';
		},
		"documentation": function () {
			require(['views/documentation', 'views/documentation/overview', 'views/documentationMenu'], function(documentationView, overviewView, docMenuView)
			{
				var oDocView = new documentationView();
				oDocView.render();
				var oOverView = new overviewView({el: document.getElementById("documentation")});
				oOverView.render();
				var oDocMenu = new docMenuView();
				Prism.highlightAll();
			});
			this.lastRoute = 'documentation';
		},
		"expert_documentation": function () {
			require(['views/documentation', 'views/documentation/expertdocumentation', 'views/documentationMenu'], function(documentationView, expertDocumentationView, docMenuView)
			{
				var oDocView = new documentationView();
				oDocView.render();
				var oOverView = new expertDocumentationView({el: document.getElementById("documentation")});
				oOverView.render();
				var oDocMenu = new docMenuView();
				Prism.highlightAll();
			});
			this.lastRoute = 'expert_documentation';
		},
		"how_to_use": function () {
			require(['views/documentation', 'views/documentation/how_to_use', 'views/documentationMenu'], function(documentationView, howToUseView, docMenuView)
			{
				var oDocView = new documentationView();
				oDocView.render();
				var oHowToUseView = new howToUseView({el: document.getElementById("documentation")});
				oHowToUseView.render();
				var oDocMenu = new docMenuView();
				Prism.highlightAll();
			});
			this.lastRoute = 'how_to_use';
		},
		"quickstart": function () {
			require(['views/documentation', 'views/documentation/quickstart', 'views/documentationMenu'], function(documentationView, quickstartView, docMenuView)
			{
				var oDocView = new documentationView();
				oDocView.render();
				var oView = new quickstartView({el: document.getElementById("documentation")});
				oView.render();
				var oDocMenu = new docMenuView();
				Prism.highlightAll();
			});
			this.lastRoute = 'quickstart';
		},
		"apis": function () {
			require(['views/documentation', 'views/documentation/apis', 'views/documentationMenu'], function(documentationView, apisView, docMenuView)
			{
				var oDocView = new documentationView();
				oDocView.render();
				var oView = new apisView({el: document.getElementById("documentation")});
				oView.render();
				var oDocMenu = new docMenuView();
				Prism.highlightAll();
			});
			this.lastRoute = 'apis';
		},
		"reference_guide": function () {
			require(['views/documentation', 'views/documentation/reference_guide', 'views/documentationMenu'], function(documentationView, referenceguideView, docMenuView)
			{
				var oDocView = new documentationView();
				oDocView.render();
				var oView = new referenceguideView({el: document.getElementById("documentation")});
				oView.render();
				var oDocMenu = new docMenuView();
				Prism.highlightAll();
			});
			this.lastRoute = 'reference_guide';
		},
		"multimedia": function () {
			require(['views/documentation', 'views/documentation/multimedia', 'views/documentationMenu'], function(documentationView, multimediaView, docMenuView)
			{
				var oDocView = new documentationView();
				oDocView.render();
				var oView = new multimediaView({el: document.getElementById("documentation")});
				oView.render();
				var oDocMenu = new docMenuView();
			});
			this.lastRoute = 'multimedia';
		},
		"examples": function () {
			require(['views/documentation', 'views/documentation/examples', 'views/documentationMenu'], function(documentationView, examplesView, docMenuView)
			{
                var oDocView = new documentationView();
                oDocView.render();
                var oView = new examplesView({el: document.getElementById("documentation")});
                oView.render();
                var oDocMenu = new docMenuView();
			});
			this.lastRoute = 'examples';
		}
	});
	return MainRoute;
});
