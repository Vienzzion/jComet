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

var _debugging = true,

_defaultSettings = {

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
	options = { },
	
	debug = function(msg, type) {
		if (_debugging) {
			var msg = '[' + Date() + '] - ' + ((msg) ? msg.toString() : '');
			if (window.console) {
				if (console.warn && type != 'msg') {
					return console.warn(msg);
				} else if (console.log) {
					return console.log(msg);
				}
			}
			return alert(msg);
		}
	},
	
	retry = function() {
		retries++;
		if (retries > s.retryCount) {
			return error('error');
		} else {
			openConnection();
		}
	},
	
	error = function(type) {
		if (type == 'abort') {
			debug('Push Poller Aborted', 'msg');
		} else {
			debug(type);
			debug('running: ' + running.toString());
			debug('retries: ' + retries);
		}
		running = false; retries = 0;
		return s.error(type);
	},
	
	refreshConnection = function() {
		retries = 0;
		openConnection();
	},
	
	resetServerConnection = function() {
		$.ajax({
			url: '',
			dataType: 'text',
			success: function() {
				refreshConnection();
			}
		});
	},
	
	openConnection = function() {
		running = true;
		if (xhr && xhr.abort) xhr.abort();
		xhr = $.ajax(options);
	};
	
	self.initialize = function() {
		retries = 0;
		options = {
			type: s.type,
			cache: s.cache,
			dataType: s.dataType,
			url: s.url,
			success: function(response) {
				s.onreceive(response);
				refreshConnection();
			},
			error: function(data, status) {
				if (status === 'timeout') {
					resetServerConnection();
				} else {
					retry();
				}
			}
		};
		if (s.username) options.username = s.username;
		if (s.password) options.password = s.password;
		if (s.xhr) options.xhr = s.xhr;
		if (s.refreshInterval) options.timeout = s.refreshInterval;
		resetServerConnection();
	};
	
	self.abort = function() {
		running = false;
		if (xhr && xhr.abort) xhr.abort();
		xhr = null;
		retries = 0;
		error('abort');
	};
	
	self.isOpen = function() {
		return (running == true && xhr && xhr.readyState && xhr.readyState > 0);
	};
	
	self.state = function() {
		return (xhr && typeof xhr.readyState != 'undefined') ? xhr.readyState : 0;
	};
	
	self.settings = function(settings) {
		if (settings) options = $.extend(true, { }, _defaultSettings, options, settings);
		return options;
	};
	
	self._xhr = function() {
		return xhr;
	};
	
	self._retryCount = function() {
		return retries;
	}

};

}(window, jQuery));
