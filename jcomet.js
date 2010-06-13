/*
 *
 */

(function(window, $) {

// path to jComet relative to the document root;
// must end in a slash (/)
var jCometDirectory = '/kbjr/jComet/',

_defaultSettings = {
	url: '',
	onreceive: function() { },
	error: function() { },
	refreshInterval: 0
};

$.include = function(file) {
	$.ajax({
		url: file,
		datatype: 'script',
		method: 'post',
		async: false
	});
};

$.include(jCometDirectory + 'utf8-encoding.js');
$.include(jCometDirectory + 'php-serialize.js');

window.jComet = function(options) {

	var self = this,
	s = $.extend(true, { }, _defaultSettings, options),
	poller, callback = s.onreceive;
	
	s.onreceive = function(response) {
		var returned = unserialize(response);
		if (returned) {
			callback(returned);
		} else {
			s.error(response);
		}
	};
	
	poller = new $.PushPoller(s);
	
	self.start = function() {
		poller.initialize();
	};
	
	self.stop = function() {
		poller.abort();
	};
	
	self.isOpen = function() {
		return poller.isOpen();
	};
	
	self.state = function() {
		return poller.state();
	};
	
	self._poller = function() {
		return poller;
	};

}

}(window, $));
