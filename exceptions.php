<?php

/*
 * exceptions.php
 * Author: James Brumond
 * Software: jComet HTTP Pushing Library
 * 
 * Copyright 2010 James Brumond
 * Dual licensed under MIT and GPL
 */

if (! defined('JCOMET_VERSION') || $_SERVER['SCRIPT_FILENAME'] == __FILE__)
	die('Invalid Load Order');

class jCometExceptions {

	const MESSAGE = 0;
	const WARNING = 1;
	const ERROR   = 3;
	
	protected static $exceptions = true;
	protected static $html_exceptions = false;
	
	public static function throw_exception($msg, $level = self::WARNING) {
		try {
			throw new DBJS_Exception($msg, $level);
		} catch (Exception $e) {
			return self::handle_exception($e);
		}
	}
	
	public static function handle_exception($e) {
		// figure out the type of exception
		switch ($e->getCode()) {
			case self::MESSAGE:        # 0
			case E_NOTICE:             # 8 (built-in)
			case E_USER_NOTICE:        # 1024 (built-in)
				$type = 'Notice';
				$return = true;
				break;
			case self::WARNING:        # 1
			case E_WARNING:            # 2 (built-in)
			case E_USER_WARNING:       # 512 (built-in)
				$type = 'Warning';
				$return = true;
				break;
			case self::ERROR:          # 3
			case E_USER_ERROR:         # 256 (built-in)
				$type = 'Error';
				$return = false;
				break;
			case E_RECOVERABLE_ERROR:  # 4096 (built-in)
				$type = 'Recoverable Error';
				$return = true;
				break;
			default:
				$type = 'Unknown Type Exception';
				$return = false;
				break;
		}
	
		if (self::$exceptions) {
			// get some useful information
			$info = $e->getTrace();
			$info = $info[count($info) - 1];
		
			// echo the exception using html or not?
			if (self::$html_exceptions) {
				$msg = '<strong>' . $type . '</strong>: ' . $e->getMessage() . ' in <strong>' . $info['file'] .
				'</strong> on line <strong>' . $info['line'] . '</strong><br />' . "\n";
			} else {
				$msg = $type . ': ' . $e->getMessage() . ' in ' . $info['file'] . ' on line ' . $info['line'] . "\n";
			}
		
			// echo the message
			echo $msg;
		}
		
		if ($type == 'Error') exit();
	
		return $return;
	}
}

/*
 * Custom Exception Class
 */
	class jComet_Exception extends Exception { }

?>
