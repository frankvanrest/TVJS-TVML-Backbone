var Backbone = require('backbone');
var _ = require('underscore');

// needed by Backbone adjusted methodes
var pathStripper = /#.*$/;
var delegateEventSplitter = /^(\S+)\s*(.*)$/;

var TVJSRouter = Backbone.Router.extend({

  navigate: function(fragment, options) {
    // Normalize the fragment.
    fragment = Backbone.history.getFragment(fragment || '');

    // Don't include a trailing slash on the root.
    var root = Backbone.history.root;
    if (fragment === '' || fragment.charAt(0) === '?') {
      root = root.slice(0, -1) || '/';
    }
    var url = root + fragment;

    // Strip the hash and decode for matching.
    fragment = Backbone.history.decodeFragment(fragment.replace(pathStripper, ''));

    if (Backbone.history.fragment === fragment) return;
    Backbone.history.fragment = fragment;

    return this.loadUrl(fragment);
  },

  // Attempt to load the current URL fragment. If a route succeeds with a
  // match, returns `true`. If no defined routes matches the fragment,
  // returns `false`.
  loadUrl: function(fragment) {
    // If the root doesn't match, no routes can match either.
    fragment = Backbone.history.fragment = Backbone.history.getFragment(fragment);
    return _.some(Backbone.history.handlers, function(handler) {
      if (handler.route.test(fragment)) {
        handler.callback(fragment);
        return true;
      }
    });
  },
});

var TVJSView = Backbone.View.extend({
	_ensureElement: function(){
   	 	return true;
  },

	show: function(){
		navigationDocument.pushDocument(
    	this.document
  	);
  	this.delegateEvents();
  },

	replace: function(){
		navigationDocument.replaceDocument(
    	this.document
		);
  	this.delegateEvents();
	},

	parseTemplateString: function(templateString){
		return (new DOMParser() ).parseFromString(
        templateString,
        "text/xml"
      );
	},

	delegateEvents: function(events) {
    events || (events = _.result(this, 'events'));
    if (!events) return this;
    //this.undelegateEvents();
    for (var key in events) {
      var method = events[key];
      if (!_.isFunction(method)) method = this[method];
      if (!method) continue;
      var match = key.match(delegateEventSplitter);
      this.delegate(match[1], match[2], _.bind(method, this));
    }
    return this;
  },

  delegate: function(eventName, selector, listener) {

  	// selector for Id
  	if(selector.substring(0,1) == "#"){
  		selector = selector.substring(1);
  		this.document.getElementById(selector).addEventListener(eventName, listener);		

  	// selector for class
  	} else if(selector.substring(0,1) == "."){
  		selector = selector.substring(1);
  		this.document.getElementByClassName(selector).addEventListener(eventName, listener);

  	// selector for tagName
  	} else {
  		this.document.getElementByTagName(selector).addEventListener(eventName, listener);
  	}
    return this;
  },

});

exports.View = TVJSView;
exports.Router = TVJSRouter;