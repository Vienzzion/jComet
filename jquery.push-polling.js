/*
 * jquery.push-polling.js
 *
 * Software: jQuery Push Polling Plugin
 * Author: James Brumond
 * Version: 0.1.1
 *
 * Copyright 2010 James Brumond
 * Dual licensed under MIT and GPL
 */

(function(window, $) {

var _defaultSettings = {

	// the request method [ 'get' | 'post' ]
	type: 'get',
	
	// cache the result? [ false | true ]
	cache: false,
	
	// callback on receiving of a response
	onreceive: function() { },
	
	// the data type expected back
	dataType: 'text',
	
	// on error, how many times do we retry before aborting
	retryCount: 3,
	
	// callback on error
	error: function() { },
	
	// authentication if needed
	username: false,
	password: false,
	
	// how frequently to reload the connection
	refreshInterval: 10000,
	
	// callback to construct the xhr object
	xhr: false,
	
	// the url to request
	url: ''

};

$.PushPoller = function(settings) {
	var self = this,
	s = $.extend(true, { }, _defaultSettings, settings),
	xhr = null,
	retries = 0,
	running = false,
	
	rerun = function(fail) {
		if (running) {
			if (fail) {
				retries++;
			} else {
				retries = 0;
			}
			if (retries > s.retryCount) {
				return s.error('error');
			}
			self.initialize();
		}
	};
	
	self.initialize = function() {
		running = true;
		var options = {
			type: s.type,
			cache: s.cache,
			dataType: s.dataType,
			url: s.url,
			timeout: s.refreshInterval,
			complete: function(data, status) {
				if (status === 'success') {
					s.onreceive(data.responseText);
					rerun(false);
				} else {
					rerun(status !== 'timeout');
				}
			}
		};
		if (s.username) options.username = s.username;
		if (s.password) options.password = s.password;
		if (s.xhr) options.xhr = s.xhr;
		xhr = $.ajax(options);
	};
	
	self.abort = function() {
		running = false;
		if (xhr) xhr.abort();
		xhr = null;
		retries = 0;
		s.error('abort');
	};

};

}(window, jQuery));
