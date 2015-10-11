var TVJS = require('./tvjs-tvml-backbone');
var _ = require('underscore');



// create router bindings
var Router = TVJS.Router.extend({
  routes: {
    "start":    "start",
    "second":   "second"
  },

  start: function(query, page) {
    var startView = new StartView();
    startView.show();
  },

  second: function(query, page) {
    var secondView = new SecondView();
    secondView.show();
  }

});


// create a view with events
var StartView = TVJS.View.extend({

  events: {
    "select #show-next": "onSelectShowNext"
  },

  template: _.template("<document>\
   <alertTemplate>\
      <title>Welcome</title>\
      <description>This is the TVJS-TVML-Backbone showcase</description>\
      <button id='show-next'>\
         <text>Show next view</text>\
      </button>\
      <button>\
         <text>Nevermind</text>\
      </button>\
   </alertTemplate>\
</document>"),


  initialize: function(){
    this.document = this.parseTemplateString(this.template());
  },

  onSelectShowNext: function(){
    myRouter.navigate("second");
  }

});

var SecondView = TVJS.View.extend({
  template: _.template("<document>\
   <ratingTemplate>\
      <title>Rate TVJS-TVML-Backbone</title>\
      <ratingBadge value=\"1\"></ratingBadge>\
   </ratingTemplate>\
</document>"),

  initialize: function(){
     this.document = this.parseTemplateString(this.template());
  }

});

var myRouter = new Router();

App.onLaunch = function(options) {
  myRouter.navigate("start");
}

App.onExit = function() {
    console.log('App finished');
}
