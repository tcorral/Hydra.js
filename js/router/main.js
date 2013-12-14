define( ['backbone'], function ( Backbone )
{
  function documentationRoutesHelper(sPathView, sRoute){
    return function(){
      require( ['views/documentation', sPathView, 'views/documentationMenu'], function ( documentationView, docView, docMenuView )
      {
        var oDocView = new documentationView();
        oDocView.render();
        var oOverView = new docView( {el: document.getElementById( "documentation" )} );
        oOverView.render();
        var oDocMenu = new docMenuView();
        Prism.highlightAll();
      } );
      console.log("2",this);
      this.lastRoute = sRoute;
    };
  }
  function otherRoutesHelper(sPathView, sRoute){
    return function(){
      require( [sPathView], function ( otherView )
      {
        var oView = new otherView();
        oView.render();
      } );
      this.lastRoute = sRoute;
    };
  }
  function localesRoutesHelper(sLocale){
    return function ()
    {
      var locale = localStorage.getItem( 'locale' );
      if ( locale != sLocale )
      {
        localStorage.setItem( 'locale', sLocale );
      }
      this.navigate( this.lastRoute, { trigger: true } );
      location.reload();
    };
  }
  var MainRoute = Backbone.Router.extend( {
    routes: {
      "downloads": "downloads",
      "extensions": "extensions",
      "documentation": "documentation",
      "how_to_use": "how_to_use",
      "quickstart": "quickstart",
      "apis": "apis",
      "reference_guide": "reference_guide",
      "use_with_nodejs": "use_with_nodejs",
      "use_with_bower": "use_with_bower",
      "use_with_requirejs": "use_with_requirejs",
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
    "es": localesRoutesHelper('es-es'),
    "en": localesRoutesHelper('en-us'),
    "home": otherRoutesHelper('views/about', 'home'),
    "downloads": otherRoutesHelper('views/downloads', 'downloads'),
    "extensions": otherRoutesHelper('views/extensions', 'extensions'),
    "documentation": documentationRoutesHelper('views/documentation/overview', 'documentation'),
    "expert_documentation": documentationRoutesHelper('views/documentation/expertdocumentation', 'expert_documentation'),
    "how_to_use": documentationRoutesHelper('views/documentation/how_to_use', 'how_to_use'),
    "quickstart": documentationRoutesHelper('views/documentation/quickstart', 'quickstart'),
    "apis": documentationRoutesHelper('views/documentation/apis', 'apis'),
    "reference_guide": documentationRoutesHelper('views/documentation/reference_guide', 'reference_guide'),
    "use_with_nodejs": documentationRoutesHelper('views/documentation/use_with_nodejs', 'use_with_nodejs'),
    "use_with_bower": documentationRoutesHelper('views/documentation/use_with_bower', 'use_with_bower'),
    "use_with_requirejs": documentationRoutesHelper('views/documentation/use_with_requirejs', 'use_with_requirejs'),
    "multimedia": documentationRoutesHelper('views/documentation/multimedia', 'multimedia'),
    "examples": documentationRoutesHelper('views/documentation/examples', 'examples')
  } );
  return MainRoute;
} );
