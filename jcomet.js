/*
 *
 */

(function(window, $) {

var _defaultSettings = {
	url: '',
	onreceive: function() { },
	error: function() { },
	refreshInterval: 10000
};

window.jComet = function(options) {

	var self = this,
	s = $.extend(true, { }, _defaultSettings, options),
	poller = new $.PushPoller(s);
	
	self.start = function() {
		poller.initialize();
	};
	
	self.stop = function() {
		poller.abort();
	};

}

}(window, $));
