require.config({
	paths:{
		backbone: 'libs/backbone-min',
		underscore: 'libs/underscore',
		jquery: 'libs/jquery-1.7.2.min',
		i18n: "libs/i18n",
		text: "libs/text"
	},
	locale: localStorage.getItem('locale') || 'en-us'
});
define(['backbone', 'router/main', 'views/topMenu'], function (Backbone, Router, ViewTopMenu){
	var myRouter = new Router();
	Backbone.history.start();
	var topMenuView = new ViewTopMenu();
});