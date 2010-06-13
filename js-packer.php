<?php

/*
 * js-packer.php
 *
 * Software: jComet HTTP Pushing Library
 * Author: James Brumond
 * Version: 0.1.1
 *
 * Copyright 2010 James Brumond
 * Dual licensed under MIT and GPL
 */

/*
 * Which Copy of the JavaScript Should be Used?
 * @const JCOMET_SOURCE [ "full-source" | "packed" ]
 */
	define("JCOMET_SOURCE", "packed");

/*
 * What files need to be loaded?
 * @var array $needed_files
 */
	$needed_files = array(
		'utf8-encoding.js', 'php-serialize.js', 'jquery.push-polling.js', 'jcomet.js'
	);

/*
 * Load the files into an array
 */
	$file_content = array();
	foreach ($needed_files as $file) {
		$file = dirname(__FILE__) . "/js/" . JCOMET_SOURCE . "/$file";
		if (file_exists($file)) {
			$file_content[] = file_get_contents($file);
		} else {
			header('Content-Type: text/plain');
			die("The file '$file' could not be loaded.");
		}
	}
	$file_content = implode("\n", $file_content);
	
/*
 * Output the loaded JavaScript
 */
	header('Content-Type: text/javascript');
	echo $file_content;

?>
