<?php session_start();

/*
 * jcomet.php
 *
 * Software: jComet HTTP Pushing Library
 * Author: James Brumond
 * Version: 0.1.1
 *
 * Copyright 2010 James Brumond
 * Dual licensed under MIT and GPL
 *
 * Requirements:
 *   PHP >= 5.3.0
 */

/*
 * If requested, reset the session
 */
	if (isset($_GET['reset'])) {
		session_unset();
		die('Session Cleared');
	}

/*
 * Allow the script to run forever independent of the client
 */
	ignore_user_abort(true);
	set_time_limit(0);

/*
 * jComet Version String
 */
	define("JCOMET_VERSION", "0.1.1");

/*
 * jComet Directory
 */
	define("JCOMET_DIRECTORY", dirname(__FILE__));

/*
 * Import Exception Handling Class
 */
	chdir(JCOMET_DIRECTORY);
	require_once "exceptions.php";

/*
 * jComet Pusher Class
 */
	abstract class jCometPusher {
	
		abstract protected function get_data($previous);
		
		protected $interval = 1;
		protected $id = 'jCometPusher';
	
		final public function __construct() {
			if (! isset($_SESSION['jCometData'][$this->id]))
				$_SESSION['jCometData'][$this->id] = null;
			$previous = $_SESSION['jCometData'][$this->id];
			while (true) {
				try {
					$result = $this->get_data($previous);
				} catch (Exception $e) {
					jCometExceptions::handle_exception($e);
				}
				if (connection_status() == 0) {
					if ($previous !== $result) {
						$_SESSION['jCometData'][$this->id] = $result;
						die(serialize($result));
					} else {
						usleep($this->interval * 1000000);
					}
				} else {
					die(connection_status());
				}
			}
		}
	
	}

?>
